<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-21 14:55:51
-->

<script src="./index.tsx"></script>
<style lang="less">
.daily-data-table-component {
  height: 100%;
  display: grid;
  grid-template-columns: auto 184px;
  .table-left {
    border-bottom-left-radius: 3px;
    .el-table__body-wrapper {
      overflow-x: auto;
      overflow-y: overlay;
      .el-table__body {
        width: 100% !important;
      }
    }
    .el-table__body-wrapper,
    .el-table__fixed {
      tbody tr td {
        padding: 0 !important;
        .cell {
          padding: 0 !important;
          line-height: 32px;
        }
      }
    }
    &.resize {
      .el-table__fixed {
        .el-table__fixed-header-wrapper .el-table__header,
        .el-table__fixed-body-wrapper .el-table__body,
        .el-table__fixed-footer-wrapper .el-table__footer {
          width: calc(100% + 10px) !important;
        }
      }
    }
    .el-table__fixed {
      width: 155px !important;
    }
    .el-table__fixed,
    .el-table__fixed-right {
      bottom: 0;
      background: transparent;
    }
    thead tr:first-of-type th:first-of-type:before {
      content: '日期';
      text-align: center;
      position: absolute;
      width: 24px;
      height: 17px;
      line-height: 17px;
      bottom: 6px;
      left: 16px;
      color: var(--text-color);
      font-weight: 600;
    }
    thead tr:first-of-type th:first-of-type:after {
      content: '指标';
      text-align: center;
      position: absolute;
      width: 24px;
      height: 17px;
      line-height: 17px;
      top: 6px;
      right: 16px;
      color: var(--text-color);
      font-weight: 600;
    }
    thead tr:first-of-type th:first-of-type .cell {
      position: absolute;
      top: 0;
      left: 0;
      width: 190px;
      height: 1px;
      background-color: #e3e8ec;
      display: block;
      text-align: center;
      transform: rotate(12.5deg);
      transform-origin: top left;
      -ms-transform: rotate(12.5deg);
      -ms-transform-origin: top left;
      -webkit-transform: rotate(12.5deg);
      -webkit-transform-origin: top left;
    }
    // .el-table__header-wrapper {

    // }
  }
  .table-right {
    border-bottom-right-radius: 3px;
    .el-table__body-wrapper {
      overflow: hidden;
      .el-table__body {
        height: 100%;
        tbody tr {
          &:hover {
            td {
              background: white;
            }
          }
          td {
            // padding: 0 22px;
            .cell {
              height: 100%;
            }
          }
        }
      }
    }
    &.editEnabled {
      .el-table__body-wrapper {
        .el-table__body {
          height: 100%;
          tbody tr {
            td {
              .cell {
                &:hover {
                  cursor: pointer;
                  background: white;
                  border: 1px solid var(--theme-color);
                }
              }
            }
          }
        }
      }
    }
  }
  .el-table {
    thead tr th {
      font-size: 12px;
      padding: 0 22px;
      font-weight: 600;
      // padding-left: 0;
      height: 34px;
      line-height: 34px;
      // line-height: 17px;
      // height: 17px;
      & .cell {
        height: 34px;
        line-height: 34px;
      }
    }
    tbody tr td {
      font-size: 12px;
      padding: 0;
      height: 32px;
      line-height: 32px;
    }
    th.gutter {
      display: none;
      width: 0;
    }
    colgroup col[name='gutter'] {
      display: none;
      width: 0;
    }
  }
  .date-week {
    margin-left: 10px;
    color: var(--text-second-color);
    font-size: 12px;
  }
  .date-day {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }
  .gmv-target-none {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-third-color);
  }
  .gmv-target {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    .el-input .el-input__inner {
      border: none;
    }
  }
  .table-cell-container {
    padding: 0 22px;
    line-height: 32px;
    height: 32px;
    &.el-input-div {
      padding: 0;
      .el-input {
        .el-input__inner {
          padding: 0 22px !important;
          background: transparent;
          border-width: 0;
          text-align: right;
          &:focus {
            background: white;
            border-width: 1px;
            //text-align: left;
            padding: 0 6px;
          }
        }
      }
    }
  }

  .empty {
    background: url('../../../../../../assets/images/calendar-bg.jpg') repeat;
    background-size: 8px 8px;
  }
  .el-table__fixed-footer-wrapper tbody td.el-table__cell {
    background: #f6f6f6 !important;
    font-weight: 600;
    .cell {
      line-height: 32px;
      height: 32px;
      padding-left: 22px;
      padding-right: 22px;
    }
  }
  .el-table__footer-wrapper tbody td.el-table__cell,
  .el-table__header-wrapper tbody td.el-table__cell {
    background: #f6f6f6 !important;
    font-weight: 600;
    .cell {
      line-height: 32px;
      height: 32px;
      padding-left: 22px;
      padding-right: 22px;
    }
  }
}
</style>
