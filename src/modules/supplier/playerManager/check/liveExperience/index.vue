<script src="./index.tsx"></script>
<style lang="less" scoped>
.live-experience {
  display: flex;
  flex-direction: column;
  padding: 24px 18px 48px 18px;
  .label {
    color: var(--text-third-color);
    font-size: 12px;
  }
  h1 {
    margin: 16px 0;
    font-size: 12px;
    color: var(--text-color);
    font-weight: 600;
  }
  .division {
    height: 1px;
    background: rgba(164, 178, 194, 0.3);
  }
  .block {
    display: flex;
    flex-wrap: wrap;
  }
  .resume-list {
    flex-direction: column;
  }
  /** 直播经验 **/
  .experience {
    .text {
      color: var(--text-color);
      margin-right: 24px;
      font-size: 12px;
    }
  }
  .tags {
    display: flex;
    column-gap: 12px;
    .item {
      line-height: 20px;
      padding: 0 6px;
      border: 1px solid rgba(164, 178, 194, 0.3);
      border-radius: 2px;
      font-size: 10px;
      color: var(--text-color);
    }
  }
  .case-list {
    .case-title {
      width: 100%;
      font-size: 12px;
      color: var(--text-color);
      line-height: 18px;
    }
    .case-des {
      margin: 8px 0;
      line-height: 18px;
      font-size: 12px;
      color: var(--text-second-color);
      width: 100%;
    }
    .video-list {
      display: flex;
      column-gap: 18px;
      .video-item {
        height: 120px;
        width: 120px;
        border-radius: 2px;
        background: rgba(var(--theme-rgb-color), 0.03);
      }
    }
  }
  .cases {
    row-gap: 18px;
    column-gap: 18px;
    .case {
      position: relative;
      width: 200px;
      height: 130px;
      border-radius: 2px;
      overflow: hidden;
      background: rgba(var(--theme-rgb-color), 0.03);
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
      .text {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(60, 82, 105, 0.6);
        height: 34px;
        font-size: 12px;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        :nth-child(1) {
          width: 100%;
          display: block;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex: 1;
          overflow: hidden;
          margin-left: 12px;
        }
        :nth-child(2) {
          display: block;
          flex-shrink: 0;
          margin: 0 12px;
          cursor: pointer;
        }
      }
    }
  }

  .resume {
    display: grid;
    grid-template-columns: auto auto minmax(10px, auto) auto 1fr;
    grid-row-gap: 14px;
    margin-bottom: 14px;
    .label {
      width: 51px;
    }
    .text {
      width: 225px;
      color: var(--text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    .view {
      margin-left: 40px;
      color: var(--theme-color);
      cursor: pointer;
    }
  }
}
</style>
