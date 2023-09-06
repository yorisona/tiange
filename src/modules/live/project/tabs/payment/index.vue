<script src="./collection.tsx"></script>

<style lang="less">
.third-content-color {
  color: var(--tip-icon-color);
}
</style>

<style lang="less" scoped>
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
@labelColor: var(--text-third-color);
@defaultColor: var(--text-color);

.project-collection {
  line-height: 1;
  color: @defaultColor;
  position: relative;
  padding: 0 18px;
  min-width: 1000px;
  .reverse-div {
    display: inline-block;
    /deep/ .el-checkbox__input {
      margin-top: -1px;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1px;
          width: 3px;
          height: 6px;
          left: 4px;
        }
      }
    }
  }
  .tabs-operation {
    position: absolute;
    top: -48px;
    right: 18px;
    display: flex;
    align-items: center;
    height: 48px;
  }

  .header {
    line-height: 32px;
    height: 32px;
    margin: 12px 0;
    column-gap: 0px;
    row-gap: 0px;
    .label {
      font-weight: 400;
      font-size: 14px;
      color: @labelColor;
    }
    .text {
      margin-right: 32px;
      font-weight: 400;
      font-size: 16px;
      color: @defaultColor;
    }
  }
  .tg-button {
    color: var(--theme-color);
    font-size: 14px;
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
  // .tg-button + .tg-button {
  //   margin-left: 10px;
  // }
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
      width: 70px;
      text-align: right;
    }
    .column-cell-line {
      display: flex;
    }
  }
  .label-pay {
    width: 70px;
    text-align: right;
  }
  .cell-price-max {
    width: 100%;
    max-width: 140px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0;
  }
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
  }
}
.limitLines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}
</style>
