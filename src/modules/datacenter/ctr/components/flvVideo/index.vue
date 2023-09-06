<script src="./index.tsx"></script>
<style lang="less" scoped>
.video-box {
  position: relative;
  background: #eceef1;
  height: 100%;
  width: 100%;
  cursor: default;
  @keyframes danru {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 500ms linear;
    z-index: 1;
    &.show {
      opacity: 1;
      /*animation: danru 500ms 1 forwards;*/
    }

    @keyframes loading {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    i {
      font-size: 24px;
      color: #ffffff;
      animation: loading 1s infinite linear;
      transform-origin: center center;
    }
  }
  &:hover {
    .sound {
      opacity: 0.9;
    }
  }
  .video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: default;
  }
  .sound {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 32px;
    height: 32px;
    background-image: url('~@/assets/img/design/sound-on.png');
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0;
    transition: transform 0.6s linear;
    cursor: pointer;
    z-index: 222;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
    &.muted {
      background-image: url('~@/assets/img/design/sound-off.png');
    }
  }
  .error {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
  }
  .play-icon-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    &:hover {
      img {
        display: block;
        cursor: pointer;
      }
    }
    img {
      display: none;
      width: 24px;
      height: 24px;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
