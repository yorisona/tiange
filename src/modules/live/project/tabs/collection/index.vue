<script src="./collection.tsx"></script>

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
  padding: 0 18px 18px 18px;
  min-width: 1100px;
  .reverse-div {
    display: inline-block;
    /deep/.el-checkbox__input {
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
    height: 48px;
    display: flex;
    align-items: center;
  }

  .header {
    line-height: 32px;
    height: 32px;
    margin: 12px 0;
    padding: 0px;
    white-space: nowrap;
    .label {
      font-weight: 400;
      font-size: 14px;
      color: @labelColor;
    }
    .text {
      margin-right: 32px;
      font-size: 16px;
      font-weight: 400;
      color: @defaultColor;
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
  .operation-column {
    display: flex;
    align-items: center;
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

  .cell-price-max {
    width: 100%;
    max-width: 140px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
    .text {
      flex: 1;
    }
  }
}
</style>

<style lang="less">
.text {
  color: var(--text-color);
}
.label {
  color: var(--text-third-color);
}
</style>
