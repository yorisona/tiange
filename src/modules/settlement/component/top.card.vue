<script src="./top.card.tsx"></script>

<style lang="less">
.tg-top-card {
  .top-card-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .top-card-amount {
      color: var(--warning-color);
      font-size: 18px;
      font-weight: 600;
    }
    .top-card-amount-tax {
      display: flex;
      align-items: center;
      > span {
        flex-shrink: 0;
        margin-left: 18px;
        margin-right: 12px;
      }
      .el-select {
        width: 94px;
      }
      .el-input {
        // width: 94px;

        > input {
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          border-color: rgba(var(--tip-icon-rgb-color), 0.5);
          color: var(--text-color);
        }
        .el-input__suffix .el-input__icon {
          line-height: 28px;
        }
        .el-input-group__append {
          text-align: center;
          width: 38px;
          padding: 0 10px;
          background-color: #f6f6f6;
          color: var(--text-third-color);
        }
      }
      .el-input-group.is-disabled {
        > input,
        > .el-input-group__append {
          padding: 0 10px;
          background-color: #f6f6f6;
          color: var(--text-third-color);
        }
      }
      .el-input-group--append {
        width: 108px;
      }
      // .tg-tax-rate {
      //     > .el-input__inner {
      //         background: transparent;
      //     }
      // }
      .amount-label {
        color: var(--text-second-color);
      }
    }
  }
  .tg-top-card-default {
    display: flex;
    align-items: center;
    height: 24px;
    line-height: 24px;
    .top-card-title {
      font-size: 14px;
      color: var(--text-color);
      line-height: 18px;
      font-weight: 600;
    }
    .top-card-title.default {
      font-size: 14px;
      color: var(--text-color);
      line-height: 18px;
      font-weight: normal;
    }
    .top-card-amount {
      margin-left: 6px;
    }
  }

  .top-card-amount {
    color: var(--warning-color);
    font-size: 18px;
    font-weight: 600;
  }
  .tg-top-card-content {
    display: flex;
    justify-content: space-around;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .content-label {
      color: var(--text-third-color);
    }
    .content-value {
      color: var(--warning-color);
      font-weight: 600;
      font-size: 16px;
    }
  }
  .title-name {
    > span {
      &:first-of-type {
        font-weight: 400;
        color: var(--text-third-color);
      }
    }
  }
}

.taxed-popper-class {
  width: 94px;
}
</style>
