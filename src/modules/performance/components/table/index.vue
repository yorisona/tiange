<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-table {
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
  display: flex;
  justify-content: flex-start;
  .tg-table-body {
    min-width: 100%;
    display: grid;
    font-size: 12px;
  }
  .tg-table-cell {
    position: relative;
    /*border: 1px solid var(--table-border-color);*/
    border-bottom: solid 1px var(--table-border-color);
    border-right: solid 1px var(--table-border-color);
    &.bl {
      border-left: solid 1px var(--table-border-color);
    }
    grid-template-columns: 1fr 1fr 1fr;
    min-height: 32px;
    &:hover {
      background-color: var(--table-current-row-bg-color);
    }
    &.is-center {
      text-align: center;
    }
    &.is-left {
      text-align: left;
    }
    &.is-right {
      text-align: right;
    }
  }
  .tg-table-cell-header {
    border-top: solid 1px var(--table-border-color);
    background-color: rgb(246, 246, 246);
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(1) {
      border-left: solid 1px var(--table-border-color);
    }
    padding: 7px 10px;
    text-align: center;
    font-weight: 600;
  }
  .summary-cell {
    background-color: #f6f6f6;
  }
}
</style>
