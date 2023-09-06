<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-manager-project-management-dashboard-container {
  min-width: 1264px;
  .query-field {
    display: flex;
    background-color: white;
    padding: 16px;
    .query-item {
      margin-left: 18px;
      display: flex;
      align-items: center;
      width: 264px;
      flex-shrink: 0;
      &:first-of-type {
        margin-left: 0;
      }
      .label {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--text-second-color);
      }
    }
  }
  .scroll-container {
    flex: 1;
    margin-top: 10px;
    // display: flex;
    // flex-direction: column;
    overflow: overlay;
    padding: 16px 16px 36px;
    background: white;
  }
  .summary-field {
    // padding: 16px 16px 4px;
    // background-color: white;
    .summsry-detail {
      display: grid;
      grid-template-columns: 1fr 260px;
      column-gap: 16px;
      .summary-detail-left {
        background-image: linear-gradient(90deg, #f9fbfd 0%, #f0f2f7 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 12px 18px;
        position: relative;
        .project-logo {
          z-index: 1;
          width: 64px;
          height: 64px;
          border-radius: 32px;
          background: white;
          border: 1px solid #e5e5e5;
          box-shadow: 0 5px 12px 0 #26446a0f;
          flex-shrink: 0;
          overflow: hidden;
          /deep/ .el-image {
            width: 100%;
            height: 100%;
            .image-slot {
              display: flex;
              justify-content: center;
              align-items: center;
              color: var(--text-third-color);
              font-size: 18px;
              width: 100%;
              height: 100%;
              line-height: 20px;
              > div {
                width: 42px;
                text-align: center;
              }
            }
          }
        }
        .project-info {
          flex: 1;
          margin-left: 18px;
          .project-info-top {
            display: flex;
            justify-content: space-between;
            padding: 0px 0 8px 0;
            border-bottom: 1px solid #e5e5e5;
            .project-name {
              display: flex;
              align-items: center;
              .name {
                font-size: 16px;
              }
              .status {
                border: 1px solid var(--theme-color);
                border-radius: 12px;
                padding: 0px 7px;
                margin-left: 16px;
                font-size: 12px;
                color: var(--theme-color);
              }
            }
            .project-cycle {
              display: flex;
              align-items: center;
              .time {
                margin-left: 18px;
                .time-label {
                  color: var(--text-third-color);
                }
              }
              .icon_warning {
                width: 18px;
                height: 18px;
                margin-left: 8px;
              }
              .key-info {
                display: flex;
                align-items: center;
                .label {
                  flex-shrink: 0;
                  color: var(--text-third-color);
                }
                .check-btn {
                  margin-left: 4px;
                  font-size: 12px;
                  flex-shrink: 0;
                }
              }
            }
          }
          .project-info-bottom {
            display: grid;
            grid-template-columns: repeat(4, 1fr) 1.5fr;
            column-gap: 16px;
            row-gap: 4px;
            margin-top: 8px;
            font-size: 12px;
            .project-info-bottom-item {
              display: flex;
              align-items: center;
            }
            .label {
              // width: 60px;
              // text-align: right;
              flex-shrink: 0;
              color: var(--text-third-color);
            }
            .check-btn {
              margin-left: 4px;
              font-size: 12px;
              flex-shrink: 0;
            }
          }
        }
        .logo-bg {
          position: absolute;
          width: 84px;
          height: 80px;
          left: 0;
          top: 0;
          > img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .summary-detail-right {
        padding-bottom: 2px;
        .date-type-btns {
          margin-top: 4px;
          display: flex;
          font-size: 12px;
          color: var(--text-color);
          .item {
            padding: 5px 12px;
            border-top: 1px solid #e3e8ec;
            border-bottom: 1px solid #e3e8ec;
            cursor: pointer;
            &:first-of-type {
              border-left: 1px solid #e3e8ec;
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
            &:nth-last-of-type(2) {
              border-left: 1px solid #e3e8ec;
              border-right: 1px solid #e3e8ec;
            }
            &:last-of-type {
              border-right: 1px solid #e3e8ec;
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
            }
          }
          &[actived='year'] {
            .year {
              color: #2877ff;
              border-color: #4e8fff;
              background-color: #e9f1ff;
            }
            .month {
              border-left-color: #4e8fff;
            }
          }
          &[actived='month'] {
            .month {
              color: #2877ff;
              border-color: #4e8fff;
              background-color: #e9f1ff;
            }
          }
          &[actived='day'] {
            .day {
              color: #2877ff;
              border-color: #4e8fff;
              background-color: #e9f1ff;
            }
            .month {
              border-right-color: #4e8fff;
            }
          }
        }
        .date-picker {
          margin-top: 16px;
        }
        .tips {
          display: flex;
          font-size: 12px;
          margin-top: 14px;
          color: #ff7a36;
          border: 1px solid #ffb894;
          background-color: #fff7f3;
          border-radius: 2px;
          padding: 6px 12px 8px 8px;
          .icon {
            flex-shrink: 0;
            font-size: 20px;
            margin-right: 4px;
            margin-top: -2px;
          }
        }
      }
    }
    .summsry-tabs {
      margin-top: 18px;
      .tab {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 16px;
        .tab-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid var(--border-line-div-color);
          border-radius: 6px;
          padding: 10px 16px;
          cursor: pointer;
          .left {
            display: flex;
            align-items: center;
            .icon-bg {
              width: 30px;
              height: 30px;
              border-radius: 15px;
              background: #ebebeb;
              display: flex;
              align-items: center;
              justify-content: center;
              > .icon {
                width: 16px;
                height: 16px;
                pointer-events: none;
                color: #cacaca;
                &.ico-common-GMV {
                  width: 14px;
                  height: 15px;
                }
                &.ico-common-yingshou {
                  width: 18px;
                  height: 18px;
                }
              }
            }
            .icon-label {
              font-size: 18px;
              margin-left: 12px;
            }
          }
          .right {
            .value {
              font-size: 20px;
              font-weight: 600;
            }
            .unit {
              margin-left: 4px;
              font-size: 16px;
            }
            .no-support-tip {
              color: var(--text-third-color);
            }
          }
          &[actived] {
            background: #2877ff;
            color: white;
            box-shadow: 0 4px 12px 0 #182a5533;
            .icon-bg {
              background: #ffffff4c;
              > .icon {
                color: white;
              }
            }
            .no-support-tip {
              color: white;
            }
          }
        }
      }
    }
  }
  .detail-field {
    // padding: 16px 16px 36px;
    // background-color: white;
    margin-top: 18px;
    // flex: 1;
    .border-container {
      height: 420px;
      border-radius: 6px;
      border: 1px solid #2877ff;
      position: relative;
      display: flex;
      flex-direction: column;
      .angle {
        transition: 0.5s ease-in-out 0s left;
        position: absolute;
        border-left: 1px solid #2877ff;
        border-top: 1px solid #2877ff;
        transform: rotate(45deg);
        background: white;
        width: 22px;
        height: 22px;
        left: 0;
        top: -12px;
      }
    }
  }
}
</style>
<style lang="less">
.tg-project-management-cycle-popover {
  min-width: auto;
  max-width: 160px;
}
</style>
