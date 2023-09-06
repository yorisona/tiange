<script src="./index.tsx"></script>
<style lang="less" scoped>
.target-budget-container {
  background: #f6f6f6;
  min-width: 1266px;
  overflow: auto;
  overflow: overlay;
  .tg-card {
    background: #f6f6f6;
  }
  .budget-background-card {
    background: white;
    /deep/.tg-card-bd {
      padding: 0 16px;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .budget-filter-form {
        width: 300px;
        .el-form-item {
          width: 204px;
          margin-bottom: 0;
        }
      }

      .des-value {
        font-size: 12px;
        color: var(--text-third-color);
        line-height: 18px;
      }
    }
  }
  .budget-card {
    background: url('~@/assets/img/management/icon_target_all_bg.png') no-repeat;
    background-size: 100% 620px;
    .budget-div {
      padding: 16px 0 32px 16px;
      width: 100%;
      display: flex;
      flex-direction: column;
      .target-value {
        flex: 1;
        display: flex;
        justify-content: center;
        padding: 16px;
        .gmv {
          flex: 1;
          .gmv-value {
            font-size: var(--small-font-size);
            font-weight: 600;
            line-height: 18px;
            white-space: nowrap;
            word-break: break-all;
            word-wrap: break-word;
            span {
              font-size: var(--default-font-size);
            }
          }
          .gmv-label {
            font-size: var(--default-font-size);
            color: var(--text-second-color);
            line-height: 18px;
          }
        }
      }
      .header-div {
        height: 156px;
        display: flex;
        justify-content: flex-start;
        .all-target-div {
          width: 424px;
          height: 156px;
          background: url('~@/assets/img/management/icon_target_bg.png') no-repeat;
          background-size: 100% 100%;
          background-color: var(--theme-color);
          cursor: pointer;
          &:hover {
            background-color: rgba(var(--theme-rgb-color), 0.65);
          }
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          color: #ffffff;
          .title {
            font-weight: 600;
            font-size: 18px;
            margin: 24px 0 0 62px;
          }
          .target-value {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px 32px;
            .gmv {
              flex: 1;
              .gmv-value {
                font-size: 28px;
                line-height: 40px;
                color: #ffffff;
                span {
                  font-size: 20px;
                }
              }
              .gmv-label {
                font-size: 18px;
                color: #ffffff;
                line-height: 26px;
              }
            }
          }
        }
        .project-div {
          flex: 1;
          display: grid;
          justify-content: flex-start;
          grid-template-columns: repeat(3, minmax(268px, 350px));
          row-gap: 12px;
          flex-wrap: wrap;
          margin: 0 4px 0 16px;
          .project-type-item {
            .target-value {
              text-align: center;
              padding: 16px 4px;
            }
            margin-right: 12px;
            flex: 1;
            height: 72px;
            background: #ffffff;
            &:hover {
              background-color: #ffffff88;
            }
            cursor: pointer;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
            border-radius: 8px;
            display: flex;
            padding-left: 14px;
            align-items: center;
            &:nth-child(5n + 2) .title {
              background: #ffefdd;
            }
            &:nth-child(5n + 3) .title {
              background: #ffeeef;
            }
            &:nth-child(5n + 4) .title {
              background: #e8effd;
            }
            &:nth-child(5n) .title {
              background: #e7f5ec;
            }
            .title {
              width: 48px;
              height: 48px;
              padding: 8px;
              line-height: 16px;
              text-align: center;
              border-radius: 48px;
              background: #f4edfc;
            }
            .look-btn {
              text-align: center;
              font-size: 16px;
              width: 100%;
              flex: 1;
              color: var(--theme-color);
              .icon {
                color: var(--theme-color);
              }
            }
          }
        }
      }
      .department-div {
        margin-top: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        padding-right: 16px;
        .left,
        .right {
          width: 34px;
          height: 34px;
          background: #ffffff;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
          border-radius: 34px;
          cursor: pointer;
          padding: 6px;
          &.disabled {
            /deep/ svg.icon {
              color: var(--disabled-color) !important;
            }
          }
          /deep/ svg.icon {
            color: #a4b2c2;
            font-size: 20px;
          }
          &:hover {
            /deep/ svg.icon {
              color: var(--theme-color);
            }
          }
          .icon {
            margin: 5px 4px;
            font-size: 24px;
            color: #a4b2c2;
            &:hover {
              color: var(--theme-color);
            }
          }
        }
        .left {
          margin-right: 8px;
        }
        .right {
          margin-left: 8px;
        }
        .department-all {
          flex: 1;
          width: 100%;
          overflow: hidden;
          height: 115px;
          scroll-behavior: smooth;
          .department {
            display: flex;
            height: 115px;
            .department-item {
              flex-shrink: 0;
              width: 212px;
              height: 115px;
              background: rgba(255, 255, 255, 0.75);
              border-radius: 12px;
              margin-right: 16px;
              border: 2px solid rgba(255, 255, 255, 0.75);
              &:hover {
                background: rgba(255, 255, 255, 1);
                border-color: rgba(255, 255, 255, 1);
              }
              cursor: pointer;
              &.selected {
                background: url('~@/assets/img/management/icon_department_bg.png') no-repeat;
                background-size: 100% 100%;
                border: 2px solid var(--theme-color);
                background-color: rgba(255, 255, 255, 1);
              }

              .title {
                display: flex;
                justify-content: space-between;
                line-height: 20px;
                align-items: center;
                margin: 20px 18px 16px 18px;
                span {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  -o-text-overflow: ellipsis;
                  font-weight: 600;
                  font-size: var(--small-font-size);
                }
              }
              .right {
                background-color: transparent;
                border: 1px solid var(--border-line-color);
                box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
                height: 18px;
                width: 18px;
                display: flex;
                align-items: center;
                padding: 0;
                .icon {
                  margin: 0;
                  width: 20px;
                  font-size: 18px;
                  color: var(--theme-color);
                }
                &:hover {
                  background: #e9f1ff;
                  border-color: var(--theme-color);
                }
              }
              .target-value {
                padding: 0 18px;
                .gmv-label {
                  color: var(--text-third-color);
                }
              }
            }
          }
        }
      }
      .ground-background-div {
        flex: 1;
        height: calc(100vh - 470px);
        min-height: 400px;
        margin-top: 16px;

        .ground-div {
          height: calc(100vh - 470px);
          min-height: 380px;
          margin: 0 16px 0 0;
          padding: 24px 8px 16px 24px;
          flex-direction: column;
          background-color: #ffffff;
          border: 2px solid var(--theme-color);
          box-shadow: 0 0 16px 0 rgba(20, 51, 89, 0.06);
          border-radius: 12px;
          display: flex;
          .ground-header-div {
            display: grid;
            grid-template-columns: repeat(2, 192px);
            column-gap: 16px;
            height: 36px;
            overflow-x: hidden;
            scroll-behavior: smooth;
            .ground-title {
              flex-shrink: 0;
              width: 192px;
              height: 36px;
              .title {
                text-align: center;
              }
            }
          }
          .ground-body-div {
            flex: 1;
            //width: 100%;
            display: flex;
            background-image: url('~@/assets/img/management/icon_project_bg.png');
            background-origin: border-box;
            background-repeat: no-repeat;
            background-position: right;
            align-items: center;
            .left,
            .right {
              height: 32px;
              width: 26px;
              cursor: pointer;
              border-color: transparent !important;
              background: white !important;
              padding: 0;
              margin: 4px;
              margin-top: -20px;
              text-align: center;
              outline: none;
              /deep/ .tg-btn-content {
                column-gap: 0;
              }
              &.disabled {
                color: #c1c1c1 !important;
                /deep/ .icon {
                  color: #c1c1c1 !important;
                }
              }
              /deep/ .icon {
                //margin: 5px 4px;
                font-size: 24px;
                color: #a4b2c2;
                &:hover {
                  color: var(--theme-color);
                }
              }
            }
            .ground-all-item {
              flex: 1;
              display: grid;
              grid-template-columns: repeat(2, 182px);
              column-gap: 16px;
              height: calc(100vh - 550px);
              min-height: 300px;
              width: 100%;
              overflow-y: auto;
              overflow-y: overlay;
              overflow-x: hidden;
              scroll-behavior: smooth;
              .no-project-div {
                color: var(--text-third-color);
                font-size: 14px;
                margin-top: 16px;
              }
              .ground-item {
                flex-shrink: 0;
                height: 100%;
                width: 192px;
                display: flex;
                flex-direction: column;
                .goal-div {
                  margin: 0 0 12px 0;
                  width: 192px;
                  height: 66px;
                  padding: 12px 14px;
                  background: #f7f7f7;
                  border-radius: 8px 8px 0 0;
                  .line-div {
                    display: flex;
                    color: var(--text-color);
                    font-size: 12px;
                    align-items: center;
                    margin-bottom: 4px;
                    .item-icon {
                      img {
                        height: 10px;
                        width: 10px;
                      }
                      margin-right: 8px;
                    }
                    .gmv-value {
                      font-weight: 600;
                      font-size: 14px;
                      span {
                        font-size: 12px;
                      }
                    }
                  }
                }
                .project-all-div {
                  flex: 1;
                  background: #f7f7f7;
                  border-radius: 8px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  .project-item-div {
                    width: 155px;
                    height: 152px;
                    background: #ffffff;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
                    border-radius: 4px;
                    margin-top: 12px;
                    &:last-child {
                      margin-bottom: 16px;
                    }
                    color: var(--text-color);
                    font-size: 12px;
                    .item-title {
                      width: 155px;
                      height: 32px;
                      line-height: 32px;
                      background: rgba(var(--theme-rgb-color), 0.15);
                      border-radius: 4px 4px 0 0;
                      display: flex;
                      align-items: center;
                      .circle {
                        display: inline-block;
                        width: 4px;
                        height: 4px;
                        background: var(--theme-color);
                        margin-left: 12px;
                        margin-right: 8px;
                      }
                    }
                    .target-value {
                      flex-direction: column;
                      padding: 16px 0 0 18px;
                      .gmv {
                        margin-bottom: 12px;
                        .gmv-value {
                          font-weight: 400;
                        }
                        .gmv-label {
                          display: flex;
                          align-items: center;
                          .line {
                            width: 3px;
                            height: 12px;
                            opacity: 0.5;
                            border-radius: 1px;
                            margin-right: 4px;
                            &.blue {
                              background: var(--theme-color);
                            }
                            &.orange {
                              background: #fb8500;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
