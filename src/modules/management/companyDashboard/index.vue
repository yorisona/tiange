<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-manager-project-management-dashboard-container {
  min-width: 1264px;
  .query-field {
    background-color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .date {
      display: flex;
      align-items: center;
      .date-picker {
        width: 236px;
        margin-left: 16px;
      }
      .department {
        display: flex;
        align-items: center;
        margin-left: 24px;
        .label {
          flex-shrink: 0;
        }
        .tg-tree-select-container {
          width: 168px;
        }
      }
    }
    .date-type-btns {
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
    .tips {
      display: flex;
      font-size: 12px;
      color: #ff7a36;
      border: 1px solid #ffb894;
      background-color: #fff7f3;
      border-radius: 2px;
      padding: 4px 12px;
      align-items: center;
      .icon {
        flex-shrink: 0;
        font-size: 20px;
        margin-right: 4px;
        margin-top: -2px;
      }
    }
  }
  .scroll-container {
    flex: 1;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    overflow: overlay;
    // padding: 16px 0 36px;
    // background: white;
    .scroll-container-header {
      color: #000000;
      font-size: 16px;
      padding-bottom: 12px;
    }
  }
  .summary-field {
    // padding: 16px 16px 4px;
    // background-color: white;
    .summsry-tabs {
      .tab {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        column-gap: 16px;
        .tab-item {
          // display: flex;
          // justify-content: space-between;
          // align-items: center;
          border: 1px solid var(--border-line-div-color);
          border-radius: 6px;
          padding: 12px 16px;
          cursor: pointer;
          .top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
              display: flex;
              align-items: center;
              .icon-bg {
                width: 32px;
                height: 32px;
                border-radius: 18px;
                background: #ebebeb;
                display: flex;
                align-items: center;
                justify-content: center;
                > .icon {
                  width: 18px;
                  height: 18px;
                  pointer-events: none;
                  color: #cacaca;
                  &.ico-common-GMV {
                    width: 16px;
                    height: 16px;
                  }
                  &.ico-common-yingshou {
                    width: 20px;
                    height: 20px;
                  }
                }
              }
              .icon-label {
                font-size: 18px;
                margin-left: 10px;
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
          }
          .bottom {
            margin-top: 12px;
            .process {
              display: flex;
              justify-content: space-between;
              .left {
                font-size: 14px;
              }
            }
            .budget {
              font-size: 14px;
              margin-top: 6px;
              &.cost {
                display: flex;
                justify-content: space-between;
              }
              .value {
                // font-weight: 600;
              }
              .unit {
                margin-left: 4px;
              }
            }
          }
          &[actived] {
            background: #2877ff;
            color: white;
            box-shadow: 0 4px 12px 0 #182a5533;
            .icon-bg {
              background: #ffffff4c !important;
              .icon {
                color: white;
              }
            }
            .no-support-tip {
              color: white;
            }
            * {
              color: white !important;
            }
          }
        }
      }
    }
  }
  .detail-field {
    // padding: 16px 16px 36px;
    // background-color: white;
    margin-top: 20px;
    // flex: 1;
    .border-container {
      height: 400px;
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
  .statistics-field {
    margin-top: 10px;
    padding: 16px 16px 24px;
    background-color: white;
    flex: 1;
    .switch-btns {
      display: grid;
      grid-auto-flow: column;
      justify-content: start;
      column-gap: 4px;
      border-bottom: 1px solid #e3e8ec;
      .switch-btn {
        font-size: 14px;
        border-radius: 4px 4px 0px 0px;
        background-color: #fafafa;
        border: 1px solid #e3e8ec;
        border-bottom: none;
        color: var(--text-color);
        padding: 10px 20px;
        cursor: pointer;
        &[actived] {
          color: white;
          border-color: var(--theme-color);
          background-color: var(--theme-color);
        }
      }
    }
    .statistics-detail-container {
      margin-top: 18px;
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
