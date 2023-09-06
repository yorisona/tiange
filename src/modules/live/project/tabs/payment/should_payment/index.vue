<script src="./should_payment.tsx"></script>

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
          left: 3.5px;
        }
      }
    }
  }
  /deep/ .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 150px;
      text-align: left;
      margin-right: -40px;
    }
  }
  line-height: 1;
  color: @defaultColor;
  position: relative;
  padding: 0 18px;

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
    display: flex;
    .payment-btn {
      margin-right: 18px;
    }
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
  .table_approval {
    cursor: pointer;
    &:hover {
      color: var(--theme-color);
    }
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
