<!--
 * @Author: 肖槿
 * @Date: 2022-02-18 13:50:13
 * @Description: 商品大盘分析
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 20:24:27
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\marketAnalysis\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.data-center-market-analysis {
  /deep/ .el-table__body tr {
    &:hover > td.el-table__cell {
      background-color: var(--table-current-row-bg-color);
    }
    &.current-row {
      background: var(--table-focus-row-bg-color);
      &:hover > td.el-table__cell {
        background-color: var(--table-focus-row-bg-color);
      }
    }
  }
  position: relative;
  & .competitor-main {
    padding: 12px 16px 50px 16px;
    background-color: #fff;
    /deep/.el-table__empty-block {
      grid-template-rows: 60px minmax(93px, auto) 60px;
    }
    & .competitor-category {
      & .action-btn {
        & > div {
          margin-bottom: 12px;
          & .text {
            padding: 0;
            margin-left: 24px;
            color: var(--theme-color);
          }
        }
      }
    }
    & .competitor-export {
      border-top: 1px dashed #e3e8ec;
      padding-top: 24px;
      margin-top: 24px;
      min-height: calc(100vh - 500px);

      & .title {
        font-weight: 400;
        font-size: 14px;
        color: var(--text-second-color);
        line-height: 18px;
        margin: 0 0 24px 0;
        & span {
          color: var(--text-color);
        }
      }
      & .price-range-and-area-and-region {
        & .price-range-and-age {
          display: flex;
          grid-gap: 24px;
          & .sub-title {
            font-weight: 600;
            font-size: 12px;
            color: var(--text-color);
            margin-bottom: 16px;
          }
          & .price-range {
            flex: 1;
            & .progress-main {
              width: 100%;
              height: 300px;
              border: 1px solid #f0f0f0;
              border-radius: 4px;
              padding: 30px 25px;
              display: inline-block;
              & .row {
                display: flex;
                &:last-child {
                  & .price-progress {
                    margin-bottom: 0;
                  }
                }
                & .label {
                  width: 70px;
                  font-weight: 600;
                  font-size: 12px;
                  color: var(--text-second-color);
                  text-align: right;
                  margin-right: 12px;
                }
                & .unit {
                  width: 50px;
                  margin-left: 12px;
                  text-align: right;
                  font-size: 12px;
                  font-weight: 600;
                  color: var(--text-second-color);
                }
                & .price-progress {
                  flex: 1;
                  margin-bottom: 16px;

                  & /deep/.el-progress-bar__outer {
                    height: 16px !important;
                    border-radius: 0;
                    & .el-progress-bar__inner {
                      border-radius: 0;
                    }
                  }
                }
              }
            }
          }
          & .age-range {
            flex: 1;
            & .sub-title {
              margin: 0 0 16px 0;
              font-size: 12px;
              font-weight: 600;
            }
            & .range-main {
              width: 100%;
              height: 300px;
              border: 1px solid #f0f0f0;
              border-radius: 4px;
            }
          }
        }
        & .region-range {
          flex: 1;
          height: 500px;
          & .sub-title {
            margin: 24px 0 16px 0;
            font-size: 12px;
            font-weight: 600;
          }
          & .map-and-table {
            height: 95%;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            display: flex;
            & .echarts-table {
              width: 50%;
              padding: 35px 40px 0 40px;
              /deep/.el-table__row .cell,
              .el-table__cell .cell {
                padding-left: 30px;
              }
            }
            & .echarts-map {
              overflow: hidden;
              flex: 1;
              margin-right: 18px;
              #myChartChina {
                height: 460px !important;
              }
            }
            & .border {
              width: 1px;
              border-left: 1px dashed #ddd;
              height: 25vw;
              margin: auto 0;
            }
          }
        }
      }
    }
  }
  & .competitor-form {
    background-color: #ffffff;
    display: flex;
    padding: 16px;
    margin-bottom: 10px;
    .search-type-select {
      width: 100px;
      margin-right: 0;
      /deep/.el-input__inner {
        border-radius: 2px 0 0 2px;
        border-right: 0;
      }
    }
    .search-type-date {
      /deep/.el-input__inner {
        border-radius: 0 2px 2px 0;
      }
    }
  }
  /deep/.competitor-goods-info {
    display: flex;
    padding: 5px 12px;
    & .goods-image {
      width: 70px;
      height: 70px;
      border-radius: 2px;
      margin-right: 10px;
    }
    & .goods-info {
      font-size: 12px;
      flex: 1;
      & p {
        color: var(--text-color);
        margin-bottom: 6px;
      }
    }
    .two-omit-item {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .competitor-page {
    height: 60px;
    position: fixed;
    right: 0px;
    bottom: 0px;
    z-index: 100;
    width: calc(100vw - 200px);
    background-color: #fff;
    //padding: 15px 32px;
  }
}
/deep/.market-analysis-table {
  &.cctv {
    margin: auto;
    width: 30vw;
    height: 30vw;
  }
  .el-table__body tr.current-row > td.el-table__cell {
    background-color: var(--table-focus-row-bg-color);
    // &:hover {
    //   & td {
    //     background-color: #cce6ff !important;
    //   }
    // }
  }
  .market-analysis-first {
    & > td:first-child .cell {
      padding-left: 10px;
    }
  }
  .market-analysis-second {
    & > td:first-child .cell {
      padding-left: 40px;
    }
  }
  .market-analysis-second,
  .market-analysis-first {
    cursor: pointer;
    .label {
      display: inline-block;
      width: 90px;
      text-align: left;
      color: var(--text-third-color);
      padding-left: 8px;
      .icon {
        margin: 0 !important;
      }
    }
  }
}

.data-center-market-analysis /deep/.el-table--border::after {
  content: '';
  position: absolute;
  background-color: #ffffff;
  z-index: 1;
}
</style>
<style lang="less">
.market-analysis-table.category-market-table {
  .market-analysis-second,
  .el-table__header-wrapper,
  .market-analysis-first {
    td {
      padding-top: 6px;
      font-size: 12px;
      padding-bottom: 7px;
      border-bottom: 1px solid var(--table-border-color) !important;
      //border-left: 1px solid #ebeef5 !important;
    }
  }
}
.market-analysis-table.cctv {
  .el-table__row {
    td {
      padding-top: 6px;
      font-size: 12px;
      padding-bottom: 7px;
    }
  }
}
</style>
