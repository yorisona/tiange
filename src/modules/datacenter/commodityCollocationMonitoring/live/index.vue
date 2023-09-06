<script src="./index.tsx"></script>
<style lang="less" scoped>
fill {
  display: block;
  flex: 1;
}

.tg-page-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 16px;

  .tg-page-body {
    flex: 1 1 0;
    overflow: auto;
    padding: 0 18px;

    &.edit {
      .live-item-box {
        grid-template-columns: auto 96px 1fr 405px;
        user-select: none;
        cursor: pointer;

        &:hover {
          border-color: var(--theme-color);
        }

        &.selected {
          background: #e9eff4;
          border-color: #d6dde9;
        }

        .live-info-bottom .item {
        }

        .live-check {
          display: flex;
          pointer-events: none;
        }

        .live-side .setting {
          display: none;
        }
      }
    }
  }

  .sort-box {
    display: flex;
    align-items: center;
    padding: 0 18px;
    margin-bottom: 12px;

    .label {
      color: var(--text-second-color);
    }

    .sort {
      display: flex;
      align-items: center;
      border: solid 1px var(--table-border-color);
      background-color: #f9fcff;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        height: 34px;
        border-color: transparent;
        border-width: 0 1px;
        border-style: solid;
        cursor: pointer;
        margin-left: -1px;

        &:last-child {
          margin-right: -1px;
        }

        &.true {
          background-color: #ffffff;
          color: var(--theme-color);
          cursor: default;
          border-color: var(--table-border-color);
        }
      }
    }

    setting-box {
      display: flex;
      align-items: center;

      .tg-btn + .tg-btn {
        margin-left: 8px;
      }

      label {
        margin-right: 40px;
      }
    }

    .filter-associate {
      margin-left: 24px;
    }
  }

  .live-item-box {
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: 96px 1fr 435px;
    grid-template-rows: 170px;
    background: #ffffff;
    border: solid 1px transparent;

    &.combination-type-3,
    &.combination-type-null {
      .goods-box {
        display: flex !important;
        justify-content: center;
        align-items: center;

        .status,
        .goods,
        .good-detail {
          display: none !important;
        }
      }
    }

    &.combination-type-2 {
      .goods-box {
        .status {
          background-color: #eaf2ff !important;
          color: #2877ff;
        }
      }
    }

    .live-check {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-right: 16px;
    }

    .live-box {
      overflow: hidden;
      border-radius: 0 0 2px 2px;
      position: relative;

      .video-img {
        width: 100%;
        height: 100%;
        border-radius: 4px;

        &.no {
          display: flex;
          background: #000000;
          color: #ffffff;
          justify-content: center;
          align-items: center;
          padding-top: 10px;
        }

        /deep/ .el-image__error {
          background: #000000;
        }
      }

      .play {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 50%;
        margin-top: -12px;
        z-index: 1;
        cursor: pointer;
        left: 50%;
        margin-left: -12px;
        opacity: 0.6;
      }

      .enlarge-box {
        position: absolute;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.75);
        border-radius: 8px 0 0 0;
        display: flex;
        color: var(--text-second-color);
        padding: 3px 4px 3px 6px;
        align-items: center;
        cursor: pointer;

        svg {
          margin-right: 2px;
        }
      }
    }

    .live-info {
      display: flex;
      flex-direction: column;
      padding-right: 16px;
      padding-left: 12px;

      .live-info-top {
        color: var(--text-third-color);
        margin-bottom: 10px;

        b {
          color: var(--text-color);
        }
      }

      .live-info-middle {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto 1fr;
        grid-column-gap: 12px;
        color: var(--text-third-color);
        line-height: 18px;

        img {
          display: block;
          width: 80px;
          height: 80px;
          grid-row-end: span 3;
          border-radius: 4px;
        }

        .title {
          font-size: 14px;
          color: var(--text-color);
          padding-bottom: 4px;
          line-height: 20px;
        }
      }

      .live-info-bottom {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: 10px;
        margin-top: 12px;

        .item {
          height: 48px;
          background: rgba(var(--theme-rgb-color), 0.05);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          &.true {
            background: #dfeaff;
          }

          span {
            &:nth-child(1) {
              font-size: 16px;
              color: var(--text-color);
            }

            &:nth-child(2) {
              color: var(--text-third-color);
            }
          }
        }
      }
    }

    .live-side {
      display: flex;
      flex-direction: column;

      .setting {
        text-align: right;
        margin-bottom: 6px;
      }

      .goods-box {
        flex: 1;
        padding-left: 20px;
        border-left: 1px solid #d8d8d8;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        grid-column-gap: 18px;
        color: #fb8500;

        .status {
          grid-row-end: span 2;
          width: 24px;
          background: #ffe9d8;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          writing-mode: vertical-lr;
          letter-spacing: 10px;
        }

        .goods {
          display: grid;
          grid-template-columns: repeat(auto-fill, 80px);
          grid-template-rows: 80px;
          grid-column-gap: 16px;

          .good-img {
            background-color: #f1f1f1;
            border: 1px solid #d8d8d8;
            border-radius: 4px;
            position: relative;
            cursor: pointer;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            span {
              position: absolute;
              display: block;
              left: 0;
              top: 0;
              color: var(--theme-color);
              height: 16px;
              background: #e3ecfa;
              line-height: 16px;
              border-radius: 2px;
              padding: 0 4px;

              &.recommend {
                color: #fb8500;
              }
            }

            &.selected {
              border-color: #2877ff;
              cursor: default;
            }
          }
        }

        .good-detail {
          margin-top: 10px;
          display: flex;
          flex-direction: column;

          span {
            color: var(--text-third-color);
            line-height: 18px;

            &:nth-child(1) {
              color: var(--text-color);
              line-height: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
