<script src="./projectDaily.tsx"></script>
<style lang="less" scoped>
.projectDaily-wrap {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .projectDaily {
    flex: 1;
    // overflow: overlay;
    overflow: auto;
    /deep/.tg-datacenter-shoplive-daily-detail {
      height: unset !important;
      .data-field {
        padding: 12px 18px 18px;
      }
    }
  }
  .bar {
    background-color: #f6f6f6;
    height: 12px;
    width: 100%;
  }
  .date-wrap {
    height: 60px;
    margin-top: 54px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    .date-box {
      display: flex;
      /deep/.el-input--suffix .el-input__inner {
        padding-right: 0px !important;
      }
    }
  }
}
</style>
