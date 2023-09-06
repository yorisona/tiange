<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-23 15:34:04
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.datacenter-ctr-page-container {
  .filter-contaainer {
    padding: 16px;
    background: white;
    min-width: 1002px;
    .filter-item {
      display: flex;
      align-items: center;

      &:first-of-type {
        .label {
          align-self: flex-start;
          margin-top: 6px;
        }
      }
      .label {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--text-second-color);
      }
      .content {
        width: calc(100% - 70px);
        /deep/.el-input > input {
          border-color: var(--border-line-color);
        }
        /deep/ .date-range {
          .el-input__inner {
            border-color: var(--border-line-color);
          }
        }
        &.trend {
          .tg-btn {
            height: 28px;
            line-height: 26px;
            font-size: 12px;
            padding: 0 24px;
            margin-left: 8px;
            border: 1px solid var(--border-line-color);
            &:first-of-type {
              margin-left: 0;
            }
            &[selected] {
              border: 1px solid rgba(var(--theme-rgb-color), 0.9);
              color: var(--theme-color);
              background-color: rgba(var(--theme-rgb-color), 0.1);
            }
          }
        }
        .date-range {
        }
        /deep/ .project-select {
          .el-tag__close.el-icon-close {
            &:hover {
              background-color: #ec1e1e;
            }
          }
          .el-select__tags {
            max-height: 56px;
            overflow: auto;
            padding-right: 4px;
            max-width: 100% !important;
          }
          .el-input {
            max-height: 64px;
          }
          .el-select__tags-text {
            color: #5a5e66;
          }
          .el-tag--mini {
            height: 24px;
            line-height: 24px;
            .el-tag__close {
              top: 1px;
            }
          }
          .el-input__suffix {
            display: none !important;
          }
        }
      }
    }
    .tg-btn-link {
      font-size: 12px;
      color: var(--text-second-color);
      &:hover {
        color: var(--theme-color);
      }
      &[selected] {
        color: var(--theme-color);
      }
    }
  }
  .data-container {
    min-width: 1002px;
    margin-top: 10px;
    padding: 21px 16px 16px;
    background: white;
    flex: 1;
    overflow: hidden;
    /deep/ .project-ctr {
      overflow: hidden;
      height: 100%;
      .ctr-chart {
        padding-top: 24px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        position: relative;
        height: 404px;
      }
      margin-top: 24px;
      &:first-of-type {
        margin-top: 0;
      }
    }
    .chart-empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
