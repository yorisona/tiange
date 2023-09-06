<script src="./index.tsx"></script>
<style lang="less" scoped>
@import '~@/styles/utils/index.less';
.player-detail-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /deep/.tg-breadcrumbs {
    flex-shrink: 0;
  }
  .page-container {
    display: flex;
    //column-gap: 12px;
    flex: auto;
    height: 100%;
    overflow: hidden;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #ffffff;
    overflow: hidden;
    padding-top: 6px;
    .page-content-container {
      flex: 1;
      overflow: auto;
      height: 100%;
    }
    .tab-box {
      border-bottom: 1px solid rgba(164, 178, 194, 0.3);
    }
  }
  .page-side {
    margin-right: 12px;
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
      //column-gap: 12px;
      margin-right: -18px;
      .avatar {
        margin-right: 12px;
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
        margin-top: 7px;
        .flower {
          display: flex;
          margin-right: 12px;
          svg.icon {
            cursor: pointer;
            font-size: 14px;
            color: var(--text-color);
          }
          svg.icon.focusing:focus {
            outline: none;
          }
          .case-edit {
            flex-shrink: 0;
            margin-left: 12px;
            margin-top: 3px;
            &:hover {
              color: var(--theme-color);
            }
          }
          .flower-name {
            color: var(--text-color);
          }
        }
        :nth-child(1) {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 600;
          white-space: nowrap;
        }
        :nth-child(2) {
          font-size: 12px;
          color: var(--text-third-color);
          text-overflow: ellipsis;
          display: block;
          white-space: nowrap;
          overflow: hidden;
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
        font-weight: 600;
      }
    }

    /** 侧边-信息部分 **/
    .player-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 12px;
      font-size: 12px;
      color: var(--text-third-color);
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
        padding-bottom: 18px;
        border-bottom: 1px solid #e3e8ec;
        .btn-box {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          row-gap: 10px;
          .tg-btn {
            padding: 0 22px !important;
          }
        }
      }
      .merge-col {
        grid-column: ~'1/3';
        .ico-question {
          font-size: 14px;
        }
        .tg-btn-link {
          font-size: 12px;
        }
      }
    }
    .add-by-info {
      .info-title {
        height: 40px;
        margin: 0;
        color: var(--text-color);
        font-weight: 600;
        line-height: 40px;
        font-size: 14px;
      }
      .line-add-by {
        display: flex;
        margin-bottom: 8px;
        font-size: 12px;
        .label-name {
          color: var(--text-third-color);
        }
        .label-value {
          color: var(--text-color);
          flex: 1;
        }
        .tg-btn-link {
          font-size: 12px;
        }
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
</style>
