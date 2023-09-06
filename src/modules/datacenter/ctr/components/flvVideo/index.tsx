import { defineComponent, ref, onUnmounted, PropType } from '@vue/composition-api';
import icon_video_play from '@/assets/img/datacenter/icon_video_play.png';
import icon_video_down from '@/assets/img/dataAnalysis/icon-download.png';
import mpegts from 'flv.js';
export default defineComponent({
  props: {
    src: {
      type: String,
    },
    poster: {
      type: String,
    },
    autoplay: {
      type: Boolean,
    },
    type: {
      type: String as PropType<'mp4' | 'flv'>,
      default: () => 'flv',
    },
    isLive: {
      type: Boolean,
      default: () => true,
    },
    playMode: {
      type: String as PropType<'hover' | 'click'>,
      default: () => 'hover',
    },
    download: {
      type: String,
    },
    // clickPlayUrl: {
    //   type: String,
    // },
  },
  setup(props) {
    const videoRef = ref<HTMLVideoElement>();
    const videoState = ref(0);
    const player = ref<any>();
    const timerMove = ref();
    const muted = ref(true);
    const hasError = ref(false);
    const isMoveing = ref(false);
    const loading = ref(false);
    const play = () => {
      hasError.value = false;
      if (!isMoveing.value) {
        loading.value = true;
      }
      isMoveing.value = true;

      clearTimeout(timerMove.value);
      timerMove.value = setTimeout(() => {
        let p = player.value;
        if (p) {
          p.unload();
          p.detachMediaElement();
          p = null;
        }

        const mediaSouce = {
          type: props.type,
          isLive: props.isLive,
          hasAudio: true,
          fluid: true,
          stashInitialSize: 128,
          url: props.src,
        };
        p = mpegts.createPlayer(mediaSouce, {
          enableWorker: false,
          lazyLoadMaxDuration: 3 * 60,
          seekType: 'range',
        });
        p.attachMediaElement(videoRef.value);
        p.on(mpegts.Events.ERROR, () => {
          hasError.value = true;
        });
        p.load();
        p.play().catch((e: any) => {
          if (isMoveing.value) {
            hasError.value = true;
          }
          console.error('error', e);
        });
        player.value = p;
      }, 300);
    };

    const stop = () => {
      hasError.value = false;
      isMoveing.value = false;
      loading.value = false;
      clearTimeout(timerMove.value);
      if (player.value) {
        player.value.pause();
        player.value.unload();
        player.value.detachMediaElement();
        player.value.destroy();
        player.value = null;
      }
    };

    onUnmounted(stop);
    const onPause = () => {};
    const onPlay = () => {
      loading.value = false;
    };
    const toggleSound = () => {
      if (!videoRef.value) return;
      videoRef.value.muted = !videoRef.value.muted;
    };
    const onVolumeChange = () => {
      if (!videoRef.value) return;
      muted.value = videoRef.value.muted;
    };

    const onVideoClick = () => {
      window.open(props.src, '_blank');
    };

    return {
      videoRef,
      videoState,
      play,
      stop,
      onPause,
      onPlay,
      toggleSound,
      onVolumeChange,
      muted,
      hasError,
      loading,
      onVideoClick,
    };
  },
  render() {
    const { play, stop, onPlay, onPause, toggleSound, onVolumeChange, muted, hasError, loading } =
      this;
    return (
      <div
        class="video-box"
        onmouseleave={this.playMode === 'hover' ? stop : undefined}
        onmouseenter={this.playMode === 'hover' ? play : undefined}
      >
        <video
          class="video"
          muted={true}
          autoplay
          ref="videoRef"
          poster={this.poster}
          controls={false}
          onplay={onPlay}
          onpause={onPause}
          onvolumechange={onVolumeChange}
        />

        {this.playMode === 'click' ? (
          <div class="play-icon-container">
            <img src={icon_video_play} alt="" onClick={this.onVideoClick} />
            {this.download && (
              <a href={this.download} target="_blank" class="mgt-20">
                <img src={icon_video_down} alt="" />
              </a>
            )}
          </div>
        ) : (
          <fragments>
            <div class={`loading ${loading ? 'show' : ''}`}>
              <i class="el-icon-refresh-right" />
            </div>
            <div class={`sound ${muted ? 'muted' : ''}`} onClick={toggleSound} />
          </fragments>
        )}

        {hasError && <div class="error">加载失败</div>}
      </div>
    );
  },
});
