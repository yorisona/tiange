<script src="./index.tsx"></script>
<style lang="less">
.projectDetail_detes {
  z-index: 3001 !important;
}
</style>
<style lang="less" scoped>
.all-project {
  min-width: 1300px;
  display: flex;
  overflow: auto;
  flex-direction: column;
  flex: 1;
}
.overview-container {
  position: sticky;
  top: 1px;
  z-index: 10;
  background: #fff;
  height: 130px;
  align-items: center;
  margin-bottom: 6px;
  // background: white;
  // padding: 0 18px;
  display: grid;
  // grid-template-columns: repeat(4, auto);
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  // grid-template-rows: 138px;
  column-gap: 16px;
  .overview-item {
    padding: 18px 20px 20px;
    cursor: pointer;
    border-radius: 2px;
    background: #fafafa;
    border: 1px solid var(--border-line-div-color);
    text-align: center;
    height: 96px;
    &:hover {
      // border-color: rgba(var(--theme-rgb-color), 0.80);
      // outline: 4px solid rgba(77, 161, 255, 0.07);
    }
    &[selected] {
      border-color: transparent;
      background: #fff;
      box-shadow: 0px 8px 14px -3px rgba(0, 0, 0, 0.08);
    }
    &.sessions[selected] {
      border-color: #00a3ff;
    }
    &.commodity[selected] {
      border-color: #fe9c25;
    }
    &.launchnchor[selected] {
      border-color: #5f59f7;
    }
    &.flow[selected] {
      border-color: var(--theme-color);
    }
    &.fans[selected] {
      border-color: #14c900;
    }
    &.launch[selected] {
      border-color: var(--theme-color);
    }
  }
  .item-header {
    justify-content: center;
    align-items: center;
    display: flex;
    .item-title {
      margin-left: 8px;

      font-weight: 400;
      font-size: 16px;
      color: var(--text-second-color);
      letter-spacing: 0;
    }
    .item-icon {
      // width: 40px;
      // height: 40px;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .item-amount {
    color: var(--text-color);
    font-size: 18px;
    margin-top: 6px;
    height: 40px;
    line-height: 40px;
    display: block;
    // font-weight: 600;
    // &:last-child:before {
    //   content: '¥';
    //   font-size: 16px;
    //   margin-right: 8px;
    //   // font-weight: 600;
    // }
  }
  .money {
    &:before {
      content: '¥';
      font-size: 16px;
      margin-right: 8px;
      // font-weight: 600;
    }
  }
  .profit {
    &:after {
      content: '%';
      font-size: 16px;
      margin-left: 8px;
      margin-right: -16px;
      // font-weight: 600;
    }
  }
  .item-average-amount {
    color: var(--text-second-color);
    margin-top: 8px;
    font-size: var(--small-font-size);
    // font-weight: 400;
    &.hidden {
      display: none;
    }
  }
}
.date-switch {
  // display: flex;
  // justify-content: space-between;
  // padding: 16px 0 18px;
  /deep/ .el-input__inner {
    cursor: pointer;
    border: transparent !important;
    text-align: center;
    padding: 0 12px;
    caret-color: transparent;
    font-size: var(--small-font-size);
  }
  // .date-box {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   z-index: 10;
  // }
}
.tg-datacenter-shoplive {
  min-width: 1200px;
  width: 100%;
  // margin-top: 2px;
  // height: 108px;
  z-index: 10;
  height: 52px;
  .bar {
    height: 10px;
    width: 100%;
    background: #f6f6f6;
  }
  .tg-breadcrumbs {
    margin-bottom: 0;
    position: fixed;
    height: 50px;
    width: 100%;
  }
  .tabs {
    position: relative;
    z-index: 10;
    height: 50px;
    /deep/ .tg-tabs-header {
      position: fixed;
      width: 100%;
      height: 54px !important;
      padding-top: 4px;
      background-color: #fff;
      border-bottom: 1px solid var(--border-line-div-color);
    }
    /deep/ .tg-tabs-body {
      // position: absolute;
      position: fixed;
      // width: 222px;
      right: 0px;
      // height: 54px;
      padding-top: 20px;
      background-color: #fff;
      // border-bottom: 1px solid #e3e8ec;
      display: flex;
      align-items: center;
      padding-right: 18px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      line-height: 28px;
      height: 28px;

      .update-time {
        color: var(--text-third-color);
        z-index: 100;
        font-size: 12px;
        text-align: left;
        margin-right: 12px;
      }

      .dates {
        margin-left: 32px;
        & .active {
          background: #e9f1ff;
          border: 1px solid #4e8fff;
          margin-right: 0;
          // border-radius: 2px 0 0 2px;
          color: var(--theme-color);
        }
        .el-button.el-button--small {
          width: 48px;
          height: 28px;
          line-height: 6px;
        }
      }
      .time-btn {
        height: 28px;
        width: 28px;
        border: 1px solid fade(#a4b2c2, 30);
        border-radius: 14px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        .icon {
          color: var(--text-second-color);
        }
        &:hover {
          border-color: var(--theme-color);
          .icon {
            color: var(--theme-color);
          }
        }
        &[disabled] {
          border-color: #e3e8ec;
          .icon {
            color: #e3e8ec;
          }
        }
      }
      .display-time {
        color: var(--text-color);
        font-size: 16px;
        // font-weight: 600;
        margin: 0 12px;
      }
    }
    &.project {
      background: red;
      margin-top: 0px;
    }
  }
}
.div-conent {
  flex: 1;
  width: 100%;
  min-width: 1300px;
  background: white;
  overflow: auto;
  overflow: overlay;
}
.main-content {
  background: #ffffff;
  padding: 68px 18px 64px 18px;
  position: relative;
  .backLog-box {
    background: url('~@/assets/img/semicircle.png') no-repeat;
    background-size: 152px 76px;
    width: 152px;
    height: 76px;
    color: red;
    position: absolute;
    left: 50%;
    margin-left: calc(-152px / 2);
    .log-box {
      width: 104px;
      height: 104px;
      background: #ffffff;
      border: 1px solid var(--border-line-div-color);
      border-radius: 50%;
      box-shadow: 0 4px 12px 0 rgba(30, 61, 109, 0.08);
      position: absolute;
      top: -50px;
      left: 24px;
      /deep/ img {
        border-radius: 50%;
      }
      /deep/ .project-icon {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        // outline: 1px solid var(--border-line-div-color);
        display: block;
        .el-image__error {
          font-size: 12px;
        }
      }
    }
  }
  .bor {
    border: 1px solid var(--border-line-div-color);
    padding: 18px;
    border-radius: 4px;
    margin-bottom: 18px;
    .amount-data {
      display: flex;
      .lt,
      .rt {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 16px;
        align-content: flex-start;
        .item {
          width: 260px;
          height: 32px;
          line-height: 32px;
        }
        .label {
          font-weight: 400;
          font-size: 12px;
          color: var(--text-color);
          letter-spacing: 0;
        }
        .value {
          font-weight: 400;
          font-size: 14px;
          color: var(--text-color);
          letter-spacing: 0;
        }
        .up-num {
          font-weight: 400;
          font-size: 12px;
          color: var(--text-third-color);
          letter-spacing: 0;
        }
      }
      .rt {
        padding-left: 155px;
      }
    }

    .chart-box {
      display: flex;
      column-gap: 17.5px;
      .lt,
      .rt {
        flex: 1;
        min-width: 530px;
        display: flex;
        width: 578px;
        background: #f6fafb;
        border: 0 solid var(--border-line-div-color);
        border-radius: 8px;
        justify-content: center;
        align-items: center;
        .item {
          width: 260px;
          height: 32px;
        }
      }
      // .lt {
      // }
      .line {
        // width: 2px;
        // height: 341px;
        // border: 1px dashed var(--border-line-div-color);
        width: 1px;
        height: 341px;
        background: linear-gradient(to bottom, #d1d8e0 0%, #d1d8e0 50%, transparent 50%);
        background-size: 2px 12px;
        background-repeat: repeat-y;
      }
    }
    .progress-box {
      margin-top: 40px;
      height: 150px;
      width: 100%;
      display: flex;
      // align-items: center;
      position: relative;
      flex-direction: column;
      .linegk {
        width: 100%;
        height: 31px;
      }
      .line1 {
        padding-left: 28%;
        /* padding: 0 6%; */
        padding-right: 5.5%;
        position: relative;
        .linegk {
          width: 100%;
          height: 31px;
          border-top: 1px solid rgba(178, 186, 198, 0.7);
          border-left: 1px solid rgba(178, 186, 198, 0.7);
          position: relative;
        }
        .arrow-up {
          width: 9px;
          height: 33px;
          position: absolute;
          right: 64px;
          top: 0;
          right: -5px;
          top: -1px;
        }
        .up-box {
          position: absolute;
          margin-left: 30%;
          margin-top: -7px;
          background: #fff;
          padding: 0 18px;
          z-index: 1;
          .value {
            width: 33px;
            height: 16px;
            font-family: AlibabaPuHuiTi_2_65_Medium;
            font-weight: 500;
            font-size: 14px;
            color: var(--text-color);
          }
          .up-num {
            font-weight: 400;
            font-size: 12px;
            color: var(--text-third-color);
            letter-spacing: 0;
          }
        }
      }
      .line2 {
        padding-left: 5%;
        /* padding: 0 6%; */
        padding-right: 5.5%;
        transform: rotateX(180deg);
        position: relative;
        .linegk {
          width: 100%;
          height: 31px;
          border-top: 1px solid rgba(178, 186, 198, 0.7);
          border-left: 1px solid rgba(178, 186, 198, 0.7);
          position: relative;
        }
        .arrow-up {
          width: 9px;
          // transform: rotateX(180deg);
          height: 33px;
          position: absolute;
          right: -5px;
          top: -1px;
        }
        .up-box {
          transform: rotateX(180deg);
          position: absolute;
          margin-left: 43%;
          margin-top: -7px;
          background: #fff;
          padding: 0 18px;
          z-index: 1;
          .value {
            width: 33px;
            height: 16px;
            font-family: AlibabaPuHuiTi_2_65_Medium;
            font-weight: 500;
            font-size: 14px;
            color: var(--text-color);
          }
          .up-num {
            font-weight: 400;
            font-size: 12px;
            color: var(--text-third-color);
            letter-spacing: 0;
          }
        }
      }
      .progress-wrap {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .item {
          flex: 1;
          text-align: center;
          .up-box {
            text-align: left;
            padding-left: 10px;
            .value {
              width: 33px;
              height: 16px;
              font-family: AlibabaPuHuiTi_2_65_Medium;
              font-weight: 500;
              font-size: 14px;
              color: var(--text-color);
            }
            .up-num {
              font-weight: 400;
              font-size: 12px;
              color: var(--text-third-color);
              letter-spacing: 0;
            }
          }
        }
        .arrow {
          width: 80%;
          min-width: 105px;
          height: 22px;
        }
        .box {
          width: 137px;
          height: 70px;
          border: 1px solid #2b79fe;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .label {
            font-weight: 400;
            font-size: 12px;
            color: var(--text-color);
            text-align: center;
            margin-bottom: 2px;
          }
          .value {
            font-family: AlibabaPuHuiTi_2_65_Medium;
            font-weight: 500;
            font-size: 18px;
            color: #000000;
          }
        }
        .gk {
          position: relative;
          .linegk {
            position: absolute;
            // transform: rotateX(180deg);
            transform: scale(0.5);
          }
        }
      }
    }
    .lookEcharts-box {
      width: 100%;
      height: 100%;
      margin-top: 30px;
      .line {
        width: 100%;
        height: 1px;
        background: linear-gradient(to right, #d1d8e0 0%, #d1d8e0 50%, transparent 50%);
        background-size: 12px 2px;
        background-repeat: repeat-x;
        margin-bottom: 31.5px;
      }
    }
  }
}
/deep/ .el-table {
  .el-table--border {
    > .el-table__body-wrapper.is-scrolling-none {
      overflow-y: auto;
      overflow-y: overlay;
    }
    thead > tr > th > .cell {
      text-align: center;
      padding: 0px !important;
      border-color: var(--border-line-div-color);
    }
    .el-table__row > td {
      border-color: var(--border-line-div-color);
    }
    th.el-table__cell.is-leaf {
      border-color: var(--border-line-div-color);
    }
  }
}
/deep/ .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-color: var(--border-line-div-color) !important;
}
/deep/ .el-table::before {
  content: '';
  position: absolute;
  background-color: var(--border-line-div-color) !important;
}
/deep/ .el-table.el-table--border th.el-table__cell.is-leaf,
.el-table.el-table--border th.el-table__cell.is-leaf {
  border-color: var(--border-line-div-color) !important;
}
/deep/ .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-color: var(--border-line-div-color) !important;
}
/deep/ .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: var(--border-line-div-color) !important;
}
/deep/ .el-table--border,
.el-table--group {
  border: 1px solid var(--border-line-div-color);
  border-bottom-width: 0;
  border-right-width: 0;
}
/deep/.el-table {
  &::before {
    z-index: 8;
  }
}
/deep/.el-loading-mask {
  z-index: 8;
}
</style>
