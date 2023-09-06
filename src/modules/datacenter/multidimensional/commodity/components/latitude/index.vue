<script src="./index.tsx"></script>
<style lang="less" scoped>
.latitude {
  background-color: #ffffff;
  height: 400px;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-row-gap: 12px;
  padding: 16px;
  overflow: hidden;
  .filter {
    display: flex;
    align-items: center;
    .label {
      color: #5a5a5a;
    }
    &.filter-latitude {
      .el-select {
        flex: 1;
        margin-right: 8px;
      }
    }
    &.filter-index {
      display: flex;
      justify-content: space-between;
      button {
        margin-right: 8px;
      }

      .ico-btn-delete {
        font-size: 16px;
        color: #c1c1c1 !important;
        margin-top: 1px;
        /*width: 20px;*/
        /*height: 20px;*/
        cursor: pointer;
        &:hover {
          color: #2877ff !important;
        }
      }
      .operating {
        font-size: 12px;
        color: #888888;
        display: grid;
        grid-template-columns: auto auto;
        grid-column-gap: 4px;
        cursor: pointer;

        &:hover {
          color: #2877ff;
          .ico-btn-delete {
            color: #2877ff !important;
          }
        }
      }
    }
  }
  .chart-box {
    overflow: hidden;
    position: relative;
    background-color: #ffffff;
    .chart {
      width: 100%;
      height: 100%;
    }
    .full-screen {
      position: absolute;
      right: 0px;
      top: 0px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      color: red;
      background-image: url('~@/assets/img/dataAnalysis/fullScreen2.png');
      background-size: cover;

      &:hover {
        background-position-x: -20px;
      }

      &.true {
        right: 20px;
        top: 20px;
        &:hover {
          background-position: 0;
        }
      }
    }
  }
  &.full {
    .full-screen {
      width: 40px;
      height: 40px;
      background-image: url('~@/assets/img/dataAnalysis/exitScreen.png');
    }
  }
}
</style>
