<script src="./index.tsx"></script>
<style lang="less" scoped>
@title: #0a0a0a;

@project: #3f8ef6;
@collaborative: #984dff;
@other: #09ce98;
@overtime: #fe365c;
.ellipsis(@width: 100%) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: @width;
}

.orderStatistics-box {
  padding: 0 25px 24px;
  min-width: 1366px;
  /deep/ .tg-breadcrumbs {
    padding: 0;
  }
  /deep/.gm-generally-search-bar {
    padding-left: 0;
  }
  .my_project_popover_wrap_box_title {
    font-weight: 600;
    font-size: 14px;
    color: rgba(10, 10, 10, 0.6);
    letter-spacing: 0;
    padding: 0 14px;
    --popoverCirColor: #3f8ef6;
    position: relative;
    margin-bottom: 5px;
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: var(--popoverCirColor);
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 35%;
    }
  }
  .header-box {
    // height: 53px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 12px 12px 0;
    border: 1px solid #f4f8ff;
    border-radius: 5px;
    margin-bottom: 12px;
    flex-shrink: 0;
    .el-form .el-form-item--mini {
      margin-bottom: 12px;
    }
  }
  .content_box {
    display: flex;
    width: 100%;
    height: 100%;
    &__left {
      margin-right: 12px;
      width: 362px;
      display: flex;
      flex-direction: column;
      &__top {
        // height: 220px;
        flex: 1;
        margin-bottom: 12px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        &__title {
          font-weight: 400;
          font-size: 14px;
          color: #0a0a0a;
          letter-spacing: 0;
          padding: 12px 15px;
          border-bottom: 1px solid #f4f8ff;
          display: flex;
          justify-content: space-between;
          span:nth-child(2) {
            font-weight: 400;
            font-size: 12px;
            color: rgba(10, 10, 10, 0.4);
            letter-spacing: 0;
          }
        }
        &__wrap {
          display: flex;
          flex-direction: column;
          padding: 12px;
          // max-height: calc(220px - 35px);
          overflow-y: auto;
          flex: 1;
          .content {
            overflow-y: auto;
            max-height: calc(100% - 50px);
          }
          /deep/.project_left2_popover_wrap {
            padding: 0;
          }
          .project_popover_box {
            max-height: 380px;
            overflow-y: auto;
            &_title {
              padding: 0 12px;
              height: 50px;
              font-weight: 400;
              font-size: 14px;
              color: #0a0a0a;
              letter-spacing: 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #f4f8ff;
              span {
                &:first-child {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  flex: 1;
                }
                &:last-child {
                  font-weight: 600;
                  font-size: 20px;
                  color: #0a0a0a;
                  letter-spacing: 0;
                }
              }
            }
            .project_popover_box_content {
              border-radius: 2px;
              font-weight: 400;
              font-size: 11px;
              color: #0a0a0a;
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              width: 100%;
              flex-wrap: wrap;
              // cursor: pointer;
              .name {
                width: 36px;
                height: 20px;
                line-height: 20px;
                background: #f4edff;
                border-radius: 2px;
                font-weight: 400;
                font-size: 11px;
                color: #0a0a0a;
                text-align: center;
                margin-right: 5px;

                // cursor: pointer;
              }
              .value-box {
                display: flex;
                align-items: center;
                justify-content: space-between;
                // width: 100%;
                flex: 1;
                height: 20px;
                background: #f0f5ff;
                border-radius: 2px;
                font-weight: 400;
                font-size: 11px;
                color: #0a0a0a;
                padding: 0 5px;
                // cursor: pointer;
                .value {
                  width: 110px;
                  white-space: nowrap; /* 防止换行 */
                  overflow: hidden; /* 溢出隐藏 */
                  text-overflow: ellipsis; /* 添加省略号 */
                }
              }
            }
          }
          .tooltip-box {
            width: 100%;
            height: 100%;
            align-items: center;
            position: absolute;
            .tooltip {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 100%;
              font-weight: 400;
              font-size: 12px;
              color: #000000;
              padding: 0 10px;
              cursor: pointer;
            }
          }
          /deep/.el-collapse {
            border: none;
            &-item__header {
              border: none;
              height: 36px;
              background: #f4f8ff;
              padding: 0 8px;
              border-radius: 2px;
              margin-bottom: 12px;
              transition: 0.3s;
              &:hover {
                background: #edf3fc;
              }
            }
            .el-collapse-item__wrap {
              border: none;
            }
            &-item__content {
              padding: 0;
              border: none;
            }
            .collapse_title_box {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding-right: 8px;
              font-weight: 400;
              font-size: 14px;
              color: #0a0a0a;
              .value {
                font-weight: 600;
                font-size: 14px;
                color: #0a0a0a;
              }
            }
            .no_son {
              .el-collapse-item__arrow {
                visibility: collapse;
              }
            }
            .el-collapse-item__arrow {
              transform: rotate(-90deg);
            }
            .el-collapse-item__arrow.is-active {
              transform: rotate(90deg);
            }
          }
          &__item {
            width: 100%;
            padding: 0 15px 0 20px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f4f8ff;
            border-radius: 2px;
            font-weight: 400;
            font-size: 14px;
            color: #000000;
            letter-spacing: 0;
            position: relative;
            overflow: hidden;
            margin-bottom: 10px;
            cursor: pointer;
            &:last-child {
              margin-bottom: 0;
            }
            &::before {
              content: '';
              display: block;
              width: 6px;
              height: 45px;
              background: #3f8ef6;
              left: 0;
              position: absolute;
            }
            &.project::before {
              background: @project;
            }
            &.collaborative::before {
              background: @collaborative;
            }
            &.other::before {
              background: @other;
            }
            &.overtime::before {
              background: @overtime;
            }

            .cross {
              position: relative;
              width: 20px;
              height: 20px;
            }

            .cross::after,
            .cross::before {
              content: '';
              position: absolute;
              top: calc(50% - 2px);
              left: 0;
              right: 0;
              background-color: black;
            }

            .cross::after {
              height: 4px;
            }

            .cross::before {
              content: '';
              position: absolute;
              top: 0;
              bottom: 0;
              width: 4px;
              left: calc(50% - 2px);
            }
            .cross.project::before,
            .cross.project::after {
              background-color: @project;
            }
            .cross.collaborative::before,
            .cross.collaborative::after {
              background-color: @collaborative;
            }
            .cross.other::before,
            .cross.other::after {
              background-color: @other;
            }
            .cross.overtime::before,
            .cross.overtime::after {
              background-color: @overtime;
            }
          }
        }
      }
      &__bottom {
        flex: 1;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        &__title {
          font-weight: 400;
          font-size: 14px;
          color: #0a0a0a;
          letter-spacing: 0;
          padding: 12px 15px;
          border-bottom: 1px solid #f4f8ff;
        }
        &__wrap {
          padding: 12px;
          overflow-y: auto;
          flex: 1;
        }
      }
    }
    &__right {
      flex: 1;
      background-color: #fff;
      overflow: auto;
      &__title {
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px 0 20px;
        font-weight: 400;
        font-size: 12px;
        color: #323233;
        .time {
          height: 21px;
          padding: 0 8px;
          background: #f4f8ff;
          border-radius: 2px;
          text-align: center;
          line-height: 21px;
          font-size: 12px;
          color: #0a0a0a;
        }
      }
    }
  }
}
.body-container {
  flex: 1;
  overflow: hidden;
  overflow-y: auto;

  &.empty {
    background-color: #ffffff;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}
</style>
