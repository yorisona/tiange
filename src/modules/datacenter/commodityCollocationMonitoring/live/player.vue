<template>
  <div class="mask" v-if="isShow" @click="close">
    <video
      class="video"
      autoplay
      ref="videoRef"
      :poster="poster"
      controls
      @play="onPlay"
      @pause="onPause"
      @volumechange="onVolumeChange"
    />
  </div>
</template>
<style lang="less" scoped>
.mask {
  position: fixed;
  z-index: 1111;
  background-color: rgba(0, 0, 0, 0.3);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
video {
  max-width: 90vw;
  height: 90vh;
}
</style>
<script lang="ts">
import { defineComponent, ref, nextTick } from '@vue/composition-api';
import mpegts from 'flv.js';
export default defineComponent({
  setup() {
    const isShow = ref(false);
    const poster = ref();
    const videoRef = ref();
    let player: any;

    const show = (data: any) => {
      poster.value = data.stream_screenshot;
      isShow.value = true;
      const mediaSouce = {
        type: 'mp4',
        isLive: false,
        hasAudio: true,
        fluid: true,
        stashInitialSize: 128,
        url: data.stream_url,
      };
      player = mpegts.createPlayer(mediaSouce, {
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range',
      });
      nextTick(() => {
        player.attachMediaElement(videoRef.value);
        player.load();
        player
          .play()
          .then(() => {
            if (data.video_start_second) {
              player.currentTime = data.video_start_second;
            }
          })
          .catch((e: Error) => {
            console.log('播放失败了', e);
          });
      });
    };
    const close = () => {
      if (player) {
        player.unload();
        player.detachMediaElement();
        player = undefined;
      }

      isShow.value = false;
    };
    return { show, isShow, poster, videoRef, close };
  },
});
</script>
