<!--  注：
使用 isShow 属性配合 css 样式动态展示视频滚动条
使用 video 标签的 οncοntextmenu=“return false” 属性来实现禁止下载
使用 video 标签的 @timeupdate=“timeupdate” 方法来实现视频播放进度监听
使用 vue 的 ref 属性为 video 标签绑定监听事件，来实现其他功能，如时长统计、延迟提示、动态显示图标播放按钮等功能。
-->
<template>
  <!-- Video组件 -->
  <div id="common-video" class="h-100">
    <div :class="{ isShow: control }" class="h-100">
      <video
        ref="myVideo"
        :poster="poster"
        :src="src"
        :controls="controls"
        oncontextmenu="return false"
        @timeupdate="timeupdate"
        class="video-box"
      ></video>
      <!-- <img
        src="../../../../../assets/img/icon-tag.png"
        alt=""
        @click="operateVideo"
        class="pointer operate-btn"
        :class="{ 'fade-out': videoState }"
      />-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonVideo',
  data() {
    return {
      videoState: false, // 视频播放状态
      // 学时
      currentTime: 0,
      timer: {}, // 定时器
      pauseTimer: {}, // 暂停定时器
    };
  },
  /**
   * @param poster 展示图
   * @param src 视频资源
   * @param controls 是否显示控件
   * @param control 控件控制
   * @param videoData 视频基础数据
   */
  props: {
    poster: {
      type: String,
      required: false,
      default:
        'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/dev/compass/video/39935906/2022/07/7122620684236344078.mp4?x-oss-process=video/snapshot,t_0,f_jpg',
    },
    src: {
      type: String,
      required: true,
    },
    controls: {
      type: Boolean,
      required: false,
      default: true,
    },
    control: {
      type: Boolean,
      required: false,
      default: false,
    },
    videoData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // 监听视频播放
    this.$refs.myVideo.addEventListener('play', () => {
      this.openTimer();
    });
    // 监听视频暂停
    this.$refs.myVideo.addEventListener('pause', () => {
      this.closeTimer();
    });
  },
  methods: {
    // 开启定时器
    openTimer() {
      this.currentTime = this.$refs.myVideo.currentTime;
      this.$emit('videoStudyTime', this.currentTime);
      this.timer = setInterval(() => {
        this.$emit('videoStudyTime', this.currentTime);
      }, 60000);
    },
    // 关闭定时器
    closeTimer() {
      clearInterval(this.timer);
    },
    // 开启暂停定时器
    openPauseTimer() {
      this.pauseTimer = setInterval(() => {
        this.hintOperate();
      }, 600000);
    },
    // 关闭暂停定时器
    closePauseTimer() {
      clearInterval(this.pauseTimer);
    },
    // 提示操作
    hintOperate() {
      this.operateVideo();
    },
    // 获取当前播放位置
    timeupdate(e) {
      //当前播放时间//总时长
      if (Math.abs(this.currentTime - e.target.currentTime) > 100) {
        this.currentTime = e.target.currentTime;
        this.$emit('videoStudyTime', this.currentTime);
      }
      this.currentTime = e.target.currentTime;
      // this.$emit('changeCurrentTime', this.studyTime);
      // this.studyTime.duration = e.target.duration ? e.target.duration : 0;
    },
    // 操作视频播放、暂停
    operateVideo() {
      if (!this.src) {
        this.$message({ message: '暂无视频资源，请查看其他视频！' });
        return false;
      }
      if (this.$refs.myVideo.paused) {
        this.$refs.myVideo.play();
        this.videoState = true;
      } else {
        this.$refs.myVideo.pause();
        this.videoState = false;
      }
    },
  },
  watch: {
    // 监听操作
    videoData: {
      handler: function (val) {
        setTimeout(() => {
          const { currentTime } = val;
          this.currentTime = currentTime || 0;
          //打开视频播放
          this.$refs.myVideo.currentTime = currentTime || 0;
          this.$refs.myVideo.play();
          this.videoState = true;
        }, 200);
      },
      deep: true,
    },
  },
};
</script>

<style lang="less">
#common-video {
  position: relative;
  .video-box {
    box-sizing: border-box;
    border: 0;
    display: block;
    width: 250px;
    max-height: 454px;
    outline: none !important;
    background: black;
  }
  .isShow {
    //进度条
    video::-webkit-media-controls-timeline {
      display: none;
    }
  }
  video::-webkit-media-controls-play-button {
    visibility: none;
  }
  //播放按钮
  .operate-btn {
    display: block;
    width: 60px;
    height: 60px;
    position: absolute;
    top: calc(50% - 30px);
    left: calc(50% - 30px);
  }
  .operate-btn:hover {
    opacity: 0.8;
  }
  .fade-out {
    opacity: 0;
  }
}
</style>
