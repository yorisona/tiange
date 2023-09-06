<script src="./index.tsx"></script>
<style lang="less">
@labelColor: var(--text-third-color);
@defaultColor: var(--text-color);
.tg-mcn-collection {
  /deep/ .el-table {
    a,
    .cell,
    .status {
      font-size: 12px;
    }
    .tg-button {
      margin-right: 10px;
    }
  }
  line-height: 1;
  color: var(--text-color);
  position: relative;
  padding: 0 18px 18px 18px;
  .tabs-operation {
    position: absolute;
    top: -48px;
    right: 18px;
    height: 48px;
    display: flex;
    align-items: center;
  }
  .tg-button {
    color: var(--theme-color);
    font-size: 12px;
    border: 0;
    background: transparent;
    padding: 0;
    outline: 0;
    &:hover {
      cursor: pointer;
    }
  }
  .tg-button[disabled] {
    color: var(--text-des-color);
    &:hover {
      cursor: not-allowed;
    }
  }
  .tg-button + .tg-button {
    margin-left: 10px;
  }
  .operation-column {
    display: flex;
  }

  .column-cell {
    display: flex;
    flex-direction: column;
    &-start {
      justify-content: flex-start;
    }
    .label {
      color: @labelColor;
    }
    .column-cell-line {
      display: flex;
    }
  }

  .table_achievement {
    .text {
      color: var(--text-des-color);
    }
  }

  .cell-price-max {
    width: 100%;
    max-width: 140px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
<style lang="less" scoped>
@labelColor: var(--text-third-color);
@defaultColor: var(--text-color);
.collection-table {
  height: calc(100% - 50px) !important;
}
.el-pagination {
  padding-top: 10px;
}
.el-pagination button,
/deep/.el-pagination__total {
  top: 12px;
}
.pop-container {
  width: 316px;
  color: @defaultColor;
  padding: 8px;
  .label {
    color: @labelColor;
  }
  .pop-header {
    font-weight: 600;
  }
  .pop-row {
    margin-top: 10px;
    display: flex;
    .label {
      width: 70px;
      text-align: right;
    }
    .text {
      flex: 1;
    }
  }
}
</style>
