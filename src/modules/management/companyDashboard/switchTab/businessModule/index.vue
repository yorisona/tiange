<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-business-module-page-container {
  position: relative;
  /deep/ .empty-chart {
    padding-top: 60px !important;
  }
  .dashboard-chart {
    padding-top: 40px;
  }
  .statistics-latitude {
    position: absolute;
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
    column-gap: 8px;
    top: 0;
    left: 0;
    &::before {
      // content: '\7edf\8ba1\7ef4\5ea6\ff1a';
      content: '\7edf\8ba1\7ef4\5ea6:';
      font-size: 12px;
      color: #5a5a5a;
    }
    .item {
      display: inline-block;
      background: #ffffff;
      border: 1px solid #d8d8d8;
      border-radius: 2px;
      font-size: 12px;
      padding: 1px 10px 2px;
      color: #888888;
      cursor: pointer;
      &[actived] {
        color: white;
        background-color: var(--theme-color);
        border-color: var(--theme-color);
      }
    }
  }
}
</style>
