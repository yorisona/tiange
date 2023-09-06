<script src="./index.tsx"></script>
<style lang="less">
.my_project_popover_wrap {
  padding: 0 !important;
}
.project_popover_box20230410 {
  &_title {
    padding: 0 20px;
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
      &:last-child {
        font-weight: 600;
        font-size: 20px;
        color: #0a0a0a;
        letter-spacing: 0;
      }
    }
  }
  .project_popover_box20230410_content {
    padding: 12px;
    max-height: 235px;
    overflow: auto;
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
    }
  }
}
</style>
<style lang="less" scoped>
.statistics_box {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 53px 274px 1fr;
  grid-column-gap: 12px;
  grid-row-gap: 12px;
  min-width: 1180px;
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
  .common() {
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    // padding: 15px 12px;
    .title {
      font-weight: 400;
      font-size: 14px;
      color: #0a0a0a;
      padding: 15px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f4f8ff;
      .sub_title {
        font-weight: 400;
        font-size: 12px;
        color: rgba(10, 10, 10, 0.4);
      }
      .next {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.2);
        cursor: pointer;
        &:hover {
          color: #2877ff;
        }
      }
    }
    .content {
      padding: 12px;
    }
  }
  .statistics_box_header {
    grid-area: 1 / 1 / 2 / 4;
    background-color: #fff;
    height: 53px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border: 1px solid #f4f8ff;
    border-radius: 5px;
    margin-bottom: 12px;
    flex-shrink: 0;
    .el-form .el-form-item--mini {
      margin-bottom: 0;
    }
  }
  .statistics_box_left1 {
    grid-area: 2 / 1 / 3 / 2;
    .common();
    .content {
      width: 100%;
      height: calc(100% - 50px);
    }
  }
  .statistics_box_left2 {
    grid-area: 3 / 1 / 4 / 2;
    .common();
    .content {
      overflow-y: auto;
      max-height: calc(100% - 50px);
    }
    /deep/.project_left2_popover_wrap {
      padding: 0;
    }
    .project_popover_box {
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
          &:last-child {
            font-weight: 600;
            font-size: 20px;
            color: #0a0a0a;
            letter-spacing: 0;
          }
        }
      }
      .project_popover_box_content {
        padding: 9px;
        max-height: 364px;
        overflow: auto;
        display: grid;
        grid-template-columns: 36px 1fr;
        grid-gap: 5px;
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
          cursor: pointer;
        }
        .value-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
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
  }
  .statistics_box_center {
    grid-area: 2 / 2 / 4 / 3;
    .common();
    .statistics_box_center_wrap {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
      overflow-y: auto;
      max-height: calc(100% - 50px);
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE10+ */
      user-select: none;

      .statistics_box_center_wrap_item {
        padding: 10px 12px;
        grid-template-columns: repeat(2, 1fr);
        display: grid;
        background: #f4f8ff;
        border-radius: 2px;
        // width: 182px;
        // height: 100px;
        cursor: pointer;
        &_title {
          font-weight: 400;
          font-size: 14px;
          grid-column: 1 / -1;
          color: #0a0a0a;
          margin-bottom: 23px;
        }
        .sub_item {
          display: flex;
          flex-direction: column;
          span {
            &:first-child {
              font-weight: 600;
              font-size: 20px;
              color: #0a0a0a;
              font-family: PingFang SC, Microsoft Yahei, Microsoft Sans Serif, Hiragino Sans GB,
                Tahoma, Arial, serif;
              letter-spacing: 0;
            }
            &:last-child {
              font-weight: 400;
              font-size: 12px;
              color: #0a0a0a;
              letter-spacing: 0;
            }
          }
        }
      }
      /deep/.my_project_popover_wrap {
        padding: 0;
      }
      .project_popover_box {
        &_title {
          padding: 0 20px;
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
            &:last-child {
              font-weight: 600;
              font-size: 20px;
              color: #0a0a0a;
              letter-spacing: 0;
            }
          }
        }
        .project_popover_box_content {
          padding: 12px;
          max-height: 235px;
          overflow: auto;
        }
      }
    }
  }
  .statistics_box_right {
    grid-area: 2 / 3 / 4 / 4;
    .common();
    .statistics_box_right_wrap {
      display: grid;
      // grid-template-columns: repeat(3, 1fr);
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      grid-gap: 10px;
      overflow-y: auto;
      max-height: calc(100% - 50px);
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE10+ */
      user-select: none;

      .statistics_box_right_wrap_item {
        cursor: pointer;
        padding: 10px 12px;
        grid-template-columns: 1fr;
        display: grid;
        background: rgba(152, 77, 255, 0.1);
        border-radius: 2px;
        &_title {
          font-weight: 400;
          font-size: 14px;
          color: #0a0a0a;
          margin-bottom: 23px;
        }
        .sub_item {
          display: flex;
          flex-direction: column;
          span {
            &:first-child {
              font-weight: 600;
              font-size: 20px;
              color: #0a0a0a;
              font-family: PingFang SC, Microsoft Yahei, Microsoft Sans Serif, Hiragino Sans GB,
                Tahoma, Arial, serif;
              letter-spacing: 0;
            }
            &:last-child {
              font-weight: 400;
              font-size: 12px;
              color: #0a0a0a;
              letter-spacing: 0;
            }
          }
        }
      }
    }
  }
}
</style>
