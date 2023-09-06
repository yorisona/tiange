<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-23 15:56:34
-->
<script src="./index.tsx"></script>

<style lang="less" scoped>
.target-daily-detail-container {
  display: grid;
  grid-template-columns: 100px 1fr;
  margin: 0 18px;
  & ::-webkit-scrollbar {
    border-style: none solid solid solid;
    border-width: 1px;
    border-color: #e3e8ec;
  }
  .table-header-left {
    z-index: 2;
    padding-top: 1px;
    border-left: 1px solid #e3e8ec;
    overflow-y: hidden;
    font-weight: 600;
    font-size: 12px;
    .cell {
      background-color: #ffffff;
      width: 99px;
      .context {
        div {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;

          &:nth-child(1) {
            font-weight: 600;
          }
        }
      }
    }
  }
  .table-body {
    overflow-x: auto;
    border: 1px solid #e3e8ec;
    border-left: none;
    display: grid;
    grid-template-columns: repeat(12, minmax(114px, 1fr));
    padding-left: 99px;
    margin-left: -99px;
  }
  .cell {
    border: solid 1px #e3e8ec;
    border-left: none;
    border-top: none;
    font-size: 12px;
    /deep/ .target-input {
      .el-input__inner {
        font-size: 12px;
        height: 100%;
        line-height: 29px;
        text-align: right;
        border: none;
      }
    }
    .context {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      .show-txt {
        width: 100%;
        padding: 0 12px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        user-select: none;
        &.complete-percent {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          > img {
            width: 14px;
            height: 14px;
            margin-right: 2px;
          }
        }
      }
      .rest {
        position: absolute;
        left: 0;
        top: 32px;
        right: 0;
        bottom: 0;
        font-size: 24px;
        color: var(--text-third-color);
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
        background-color: #ffffff;
        &.small {
          font-size: 18px;
        }
      }
      div {
        height: 32px;
        border-top: solid 1px #e3e8ec;
        overflow: hidden;
        &:nth-child(1) {
          border-top: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f6f6;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
