<script src="./goodsAnalysis.tsx"></script>
<style lang="less" scoped>
.goodsAnalysis-wrap {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 54px;
  .goodsAnalysis {
    flex: 1;
    overflow: overlay;
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
  /deep/.commodity-analysis-sales {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  /deep/.exteriorStyles {
    height: unset !important;
    overflow: auto;
    flex: 1;
  }
}
</style>
