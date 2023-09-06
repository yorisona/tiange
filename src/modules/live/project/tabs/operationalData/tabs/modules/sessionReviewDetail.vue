<script src="./sessionReviewDetail.tsx"></script>
<style lang="less" scoped>
.setwd (@val) {
  width: @val !important;
}
.box-wrap {
  overflow: auto;
  // overflow-x: hidden;
  min-width: 1260px;
  background-color: #fff;
  padding: 18px 18px 20px;
  .grey {
    color: var(--text-third-color);
  }
  .info-box {
    display: flex;
    align-items: center;
    color: var(--text-color);
    margin-bottom: 24px;
    .info {
      // width: 375px;
      margin-right: 16px;
      display: flex;
      &_right {
        display: flex;
        flex-direction: column;
        flex: 1;
        .title {
          font-size: 18px;
          color: #000000;
          margin-bottom: 12px;
        }
        &_grid-box {
          display: grid;
          grid-template-columns: 118px 1fr;
          grid-template-rows: repeat(4, 1fr);
          grid-column-gap: 24px;
          grid-row-gap: 4px;
          white-space: nowrap;
          .grid-item1 {
            grid-area: 1 / 1 / 2 / 2;
          }
          .grid-item2 {
            grid-area: 1 / 2 / 2 / 3;
          }
          .grid-item3 {
            grid-area: 2 / 1 / 3 / 3;
            margin-top: 2px;
          }
          .grid-item4 {
            grid-area: 3 / 1 / 4 / 3;
            margin-top: -2px;
          }
          .grid-item5 {
            grid-area: 4 / 1 / 5 / 3;
          }
          .btn-box {
            margin-top: 12px;
            .btn {
              padding: 3px 8px;
              background: #ffffff;
              border: 1px solid #d8d8d8;
              border-radius: 2px;
              margin-right: 12px;
              color: #888888;
              cursor: pointer;
              &[selected] {
                background: #2877ff;
                color: #fff;
                border: none;
              }
            }
          }
        }
      }
      .log-box {
        width: 110px;
        height: 110px;
        background: #ffffff;
        border: 1px solid var(--border-line-div-color);
        border-radius: 50%;
        box-shadow: 0 4px 12px 0 rgba(30, 61, 109, 0.08);
        margin-right: 18px;
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
    .info-data {
      flex: 1;
      background-color: rgb(243, 245, 250);
      border-radius: 8px;
      padding: 12px 28px;
      // display: flex;
      // flex-wrap: wrap;
      column-gap: 22px;
      row-gap: 12px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);

      &_item {
        cursor: pointer;
        .icon {
          color: red;
          font-size: 14px;
          &:hover {
            color: none !important;
          }
        }
        .iocn-red {
          &:hover {
            color: red !important;
          }
        }
        .amount {
          font-weight: 600;
          margin-right: 4px;
        }
      }
    }
  }
  .table-box {
    // height: 252px;
    overflow: hidden;
  }
  .flex {
    display: flex;
  }
  /deep/.loudoudiv {
    width: 96%;
    margin-top: 16px;
  }
  @media screen and (min-width: 1500px) {
    /deep/ .loudoudiv {
      width: 1225px;
    }
  }
  /deep/.sundetail-wrap {
    .setwd(520px);
    .sundetail {
      .setwd(340px);
      padding-left: 0;
    }
    .detailtitle {
      .setwd(160px);
      padding-left: 10px;
      margin-left: 8px !important;
      &:first-child {
        margin-left: 0 !important;
      }
    }
  }
  /deep/.flowSource-box {
    width: 307px !important;
    .flowSource-echart-box {
      padding-left: 0 !important;
    }
  }
  .dailyDetailFunnel-wrap {
    /deep/.funnel-line-left {
      padding-left: 0;
      width: 46px;
      margin-right: 0;
    }
    /deep/.funnel-items {
      width: 300px;
      .item {
        &:nth-child(1) {
          .setwd(300px);
        }
        &:nth-child(2) {
          .setwd(280px);
        }
        &:nth-child(3) {
          .setwd(259px);
        }
        &:nth-child(4) {
          .setwd(238px);
        }
        &:nth-child(5) {
          .setwd(217px);
        }
      }
    }
  }
}
/deep/.put-warp {
  margin-top: 0 !important;
  height: 590px !important;
  &-title {
    margin-top: 16px !important;
  }
}
/deep/.explain-shop {
  padding-left: 18px;
}
/deep/.table-main {
  .el-form .el-form-item--mini {
    margin-right: 10px;
  }
}
</style>
<style lang="less">
.popper-20230824 {
  color: var(--text-color);
  .icon {
    color: red;
    font-size: 14px;
  }
  .iocn-red {
    &:hover {
      color: red !important;
    }
  }
  .grey {
    color: var(--text-third-color);
  }
}
</style>
