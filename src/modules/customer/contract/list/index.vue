<script src="./collection.tsx"></script>

<style lang="less">
@import '~@/components/OAFlows/flows.less';
@labelColor: var(--text-des-color);
.tg-marketing-contract {
  height: calc(100vh - 48px - 54px - 56px);
  line-height: 1;
  color: var(--text-color);
  position: relative;
  padding: 0 !important;

  .tg-card-bd {
    overflow: hidden;
  }
  .search-div {
    margin: 0 8px 12px 0;
    width: 378px;
  }
  .line-div {
    background: #f4f5f6;
    height: 10px;
    width: 100%;
  }
  .el-table {
    margin: 0 18px;
    width: calc(100% - 36px);
  }
  .header-div {
    padding: 12px 18px 0;
    display: flex;
    flex-wrap: wrap;
    .btns-line {
      min-width: 312px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      line-height: 28px;
      height: 28px;
      margin: 0 18px 12px 0;
      .tg-btn {
        margin-bottom: 0;
      }
    }

    .reverse-div {
      line-height: 28px;
      height: 28px;
      margin: 0 0 12px;
      display: inline-block;
      .el-checkbox {
        .el-checkbox__input {
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
    }
  }

  .tabs-operation {
    position: absolute;
    top: -48px;
    right: 18px;
    display: flex;
    align-items: center;
    height: 48px;
    span {
      padding: 0 10px;
      color: var(--theme-color);
    }
  }

  .header {
    line-height: 32px;
    height: 32px;
    margin: 12px 0;
    .label {
      color: @labelColor;
    }
    .text {
      margin-right: 30px;
      font-weight: 600;
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
    }
    .column-cell-line {
      display: flex;
    }
  }
  .contract-recycled-tag {
    display: inline-block;
    border-radius: 10px;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
    font-size: 12px;
  }
  .contract-recycled-tag-no {
    background-color: #f4f4f4;
    color: var(--text-des-color);
  }
  .contract-recycled-tag-yes {
    background-color: #ecf7f3;
    color: #3eaf90;
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
.oa-approve-progress-popper {
  .pd(0);
  .oa-flows-new {
    max-height: 240px;
    margin-bottom: 30px;
    .el-step__line {
      width: 2px !important;
      top: 26px !important;
      bottom: 0;
      left: 10px !important;
    }
    .el-step__icon {
      border-width: 0.5px !important;
      top: 5px !important;
      position: relative;
      z-index: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 16px !important;
      height: 16px !important;
      font-size: 14px;
      box-sizing: border-box;
      background: #fff;
      transition: 0.15s ease-out;
      left: 3px !important;
    }
    .oa-flows-bd {
      flex: auto;
      overflow-y: auto;
      max-height: 300px - 56px;
      .pdl(0);
      &::-webkit-scrollbar {
        width: 6px;
      }
      .oa-flow-content {
        width: 167px;
        .fc(14px, #333);
      }
      .oa-flow-footer {
        .fc(12px, var(--text-des-color));
        margin-bottom: 10px;
      }
      > .el-steps.el-steps--vertical > .el-step.is-vertical {
        &:last-of-type {
          overflow: hidden;
        }
      }
      .error-reason {
        color: rgba(var(--error-rgb-color), 0.8);
      }
    }
    /deep/ .el-step__line {
      width: 2px !important;
      top: 25px !important;
      bottom: 0;
      left: 10px !important;
    }
    .ico-right {
      height: 12px;
      line-height: 12px;
      color: rgba(var(--theme-rgb-color), 0.8);
      font-weight: 400;
    }
    /deep/ .ico-right {
      height: 12px;
      line-height: 12px;
      color: rgba(var(--theme-rgb-color), 0.8);
      font-weight: 400;
    }
    .el-step__icon-inner {
      margin-top: -2px;
      height: 12px;
      line-height: 12px;
      font-weight: 400;
    }
    /deep/ .el-step__icon-inner {
      margin-top: -2px;
      height: 12px;
      line-height: 12px;
      font-weight: 400;
    }
    /deep/ .el-step__icon {
      border-width: 0.5px !important;
      top: 5px !important;
      position: relative;
      z-index: 1;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 16px !important;
      height: 16px !important;
      font-size: 14px;
      box-sizing: border-box;
      background: #fff;
      transition: 0.15s ease-out;
      left: 3px !important;
    }
    .el-step__head.is-error {
      width: 16px;
      transform: translateY(3px);
      .el-step__line {
        left: 7px;
      }
    }

    .el-step__head:not(.is-error) {
      transform: translateY(3px);
      .el-step__line {
        left: 7px;
        background-color: #e3e8ec;
      }
      &.is-finish {
        color: rgba(var(--theme-rgb-color), 0.7);
        border-color: rgba(var(--theme-rgb-color), 0.7);
        .el-step__line {
          background-color: rgba(var(--theme-rgb-color), 0.7);
        }
        .el-step__icon {
          border-width: 1px;
          border-color: rgba(var(--theme-rgb-color), 0.8);
        }
      }

      .el-step__icon {
        @size: 16px;
        .wh(@size, @size);
        border-width: 1px;
        border-color: fade(#3c5269, 40);
        &.is-text {
          border-radius: 100%;
        }
      }
    }
    .el-step__head.is-error {
      color: white;
      .el-step__icon {
        background-color: fade(#ec1e1e, 80);
        @size: 14px;
        .wh(@size, @size);
        border: none;
        font-size: 12px;
        &.is-text {
          border-radius: 100%;
        }
      }
    }
    .el-step__description.is-error {
      display: grid;
      //row-gap: 6px;
      .pd(0 0 0 0);
    }
    .el-step__description {
      margin-top: 0px !important;
    }
  }
}
</style>
<style lang="less" scoped>
@labelColor: var(--text-des-color);

.pop-container {
  width: 316px;
  color: var(--text-color);
  padding: 10px;
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

/*临时兼容引入老弹框样式不对问题*/
.customer-dialog {
  .el-dialog__header {
    padding-left: 20px !important;
  }
}
</style>
