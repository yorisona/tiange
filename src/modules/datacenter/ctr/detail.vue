<script src="./detail.tsx"></script>
<style lang="less" scoped>
.datacenter-ctr-detail-page-container {
  display: flex;
  flex-direction: column;
  min-width: 1002px;
  .query-container {
    background: white;
    padding: 16px 16px 4px 16px;
    .query-form {
      display: grid;
      grid-template-columns: repeat(2, 314px) 214px 68px;
      /*column-gap: 18px;*/
      .el-form-item {
        /deep/ .el-date-editor {
          .el-input__icon.el-range__close-icon {
            display: none;
          }
          .el-range-separator {
            width: 12%;
            min-width: 20px;
          }
          .el-range-input {
            width: 44%;
          }
        }
      }
    }
  }
  .style-switch-container {
    display: flex;
    background: white;
    padding: 12px 18px;
    justify-content: space-between;
    align-items: center;
    // &[border-bottom] {
    //   border-bottom: 1px solid #e3e8ec;
    // }
    .lt-box {
      display: flex;
      align-items: center;
    }
  }
  .ctr-data-container {
    background: white;
    padding: 0 18px;
    flex: 1;
    overflow: hidden;
    &.chart {
      overflow: visible;
    }
  }
}
</style>
