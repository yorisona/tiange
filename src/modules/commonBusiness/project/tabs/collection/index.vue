<script src="./collection.tsx"></script>

<style lang="less">
@labelColor: var(--text-third-color);
@defaultColor: var(--text-color);

.tg-mcn-collection {
  .reverse-div {
    display: inline-block;
    line-height: 18px;
    .el-checkbox__input {
      margin-top: -1px;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1px;
          width: 3px;
          height: 6px;
          left: 3.5px;
        }
      }
    }
  }
  height: calc(100vh - 54px - 48px - 6px - 54px - 28px);
  // overflow: hidden;
  .tg-card-bd {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .el-table {
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
  color: @defaultColor;
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

  .header {
    line-height: 32px;
    margin: 12px 0;
    .label {
      font-weight: 400;
      color: @labelColor;
      font-size: 14px;
      line-height: 18px;
      display: inline-block;
      margin-bottom: 0;
    }
    .text {
      margin-right: 32px;
      color: @defaultColor;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      display: inline-block;
      margin-bottom: 0;
    }
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
    // margin-left: 10px;
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
