<script src="./index.tsx"></script>
<style lang="less" scoped>
.player-detail-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /deep/.tg-breadcrumbs {
    flex-shrink: 0;
  }
  .edit-tab-box {
    padding-top: 6px;
    border-bottom: 1px solid rgba(164, 178, 194, 0.3);
  }
  .tabs-add {
    height: 48px;
    padding: 6px 18px 1px;
    border-bottom: 1px solid #ebeef5;
    display: flex;
    align-items: center;
    background-color: white;
    div {
      background-color: white;
      border-bottom: 2px solid transparent;
      height: 42px;
      display: flex;
      align-items: center;
      padding: 0 30px;
      font-size: 16px;
      color: var(--text-second-color);
      cursor: pointer;
      &.active {
        border-bottom: 2px solid var(--theme-color);
        font-weight: 600;
        color: var(--theme-color);
        margin-bottom: -1px;
      }
    }
    .disabled {
      cursor: not-allowed;
      border-bottom: 1px solid transparent;
    }
  }
  .page-container {
    display: flex;
    column-gap: 12px;
    flex: auto;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
  }
  .page-content-container {
    flex: 1;
    overflow: auto;
    background-color: #ffffff;
  }
  .page-side {
    width: 280px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding-left: 18px;
    padding-right: 18px;
    flex-shrink: 0;

    /** 侧边-顶部状态 **/
    .player-status {
      display: flex;
      align-content: center;
      padding: 18px 0;
      column-gap: 12px;
      margin-right: -18px;
      .avatar {
        width: 60px;
        height: 60px;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
          background-color: #f1f1f1;
        }
      }
      .info {
        flex: auto;
        display: flex;
        flex-direction: column;
        row-gap: 6px;
        overflow: hidden;

        :nth-child(1) {
          font-size: 16px;
          color: var(--text-color);
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          font-weight: 600;
          height: 20px;
        }
        :nth-child(2) {
          font-size: 14px;
          color: #a4b2c2;
          height: 20px;
        }
      }
      .status {
        flex-shrink: 0;
        width: 66px;
        align-self: center;
        font-size: 14px;
        color: #ff7a36;
        display: block;
        background: rgba(255, 122, 54, 0.1);
        border-bottom-left-radius: 66px;
        border-top-left-radius: 66px;
        height: 28px;
        line-height: 28px;
        text-align: center;
      }
    }

    /** 侧边-信息部分 **/
    .player-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 12px;
      font-size: 14px;
      color: #a4b2c2;
      padding-bottom: 18px;

      .tag {
        padding: 2px 6px;
        background: rgba(46, 181, 255, 0.08);
        border: 1px solid rgba(46, 181, 255, 0.85);
        border-radius: 10px;
        font-size: 12px;
        color: #2eb5ff;
      }
      .text {
        color: var(--text-color);
      }
      .more-box {
        border-bottom: solid 1px rgba(164, 178, 194, 0.3);
        padding-bottom: 18px;
      }
      .more {
        height: 32px;
        background: rgba(var(--theme-rgb-color), 0.06);
        border-radius: 16px;
        color: var(--theme-color);
        display: flex;
        align-items: center;
        span {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
        }
        .division {
          flex: 0 0 1px;
          height: 14px;
          width: 1px;
          background-color: rgba(164, 178, 194, 0.5);
        }
      }
      .merge-col {
        grid-column: ~'1/3';
      }
    }

    /** 侧边-标签 **/
    .player-tags {
      flex: 1;
      overflow-y: auto;
      h2 {
        font-size: 14px;
        color: var(--text-color);
        font-weight: 600;
        margin: 0 0 11px 0;
      }

      .tags-item {
        display: flex;
        flex-wrap: wrap;
        column-gap: 6px;
        row-gap: 6px;
        padding-bottom: 29px;
        span {
          background: #ffffff;
          border: 1px solid rgba(164, 178, 194, 0.3);
          border-radius: 2px;
          font-size: 12px;
          color: var(--text-color);
          padding: 2px 6px;
        }
        .open {
          border-color: transparent;
          color: var(--theme-color);
          cursor: pointer;
          svg {
            margin-left: 3px;
          }
        }
      }
    }
  }
}
.options {
  padding: 18px;
  width: 100%;
  height: 60px;
  box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.1);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
</style>
