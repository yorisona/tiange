<script src="./index.tsx"></script>
<style lang="less" scoped>
.replay {
  position: relative;
  padding: 0px 18px 32px 18px;
  display: grid;
  grid-row-gap: 12px;
  margin-top: 0 !important;

  /deep/ .el-button--medium {
    padding: 8px 18px;
  }

  dl,
  dd,
  dt {
    margin: 0;
    padding: 0;
  }

  .contrast {
    display: grid;
    grid-template-rows: repeat(auto-fit, 56px);
    align-items: center;

    .contrast-info {
      color: #a4b2c2;
      height: 56px;
      display: flex;
      align-items: center;
      border-bottom: solid 1px rgba(164, 178, 194, 0.3);

      b {
        font-size: 16px;
        color: var(--text-color);
        font-weight: normal;
        padding: 0 12px;
      }

      i {
        cursor: pointer;
      }
    }

    /deep/ .is-disabled {
      background-color: #c4cbd2 !important;
      border-color: #c4cbd2 !important;
    }
  }

  dl {
    dt {
      height: 40px;
      line-height: 40px;
      align-items: center;
      font-size: 14px;
      color: var(--text-color);
    }

    dd {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      padding: 0;
      margin: 0 0 12px 0;
      background-color: rgb(247, 248, 249);
    }

    .info {
      box-sizing: border-box;
      height: 100px;
      display: flex;
      flex-direction: column;
      padding-left: 30px;
      justify-content: flex-start;
      padding-top: 25px;
      font-size: 18px;

      &:before {
        display: block;
        width: 100%;
        font-size: 14px;
        content: attr(data-title);
        color: #a4b2c2;
        grid-column: 1/3;
        margin-bottom: 10px;
      }

      .after {
        margin-top: 11px;
        display: block;
        content: attr(data-value);
        font-size: 18px;
        color: #00222d;
      }

      .angle {
        font-size: 14px;
        border-width: 1px;
        border-style: solid;
        border-radius: 16px;
        padding: 0 8px;
        margin-left: 8px;

        &:after {
          font-family: element-icons !important;
        }

        &.down {
          border-color: var(--success-color);
          color: var(--success-color);

          &:after {
            content: '\e6eb';
          }
        }

        &.up {
          &:after {
            content: '\e6e6';
          }

          border-color: #ec1e1e;
          color: #ec1e1e;
        }
      }
    }

    .textarea {
      grid-column: ~'1 / 6';
      display: flex;
      flex-direction: column;
      padding: 12px 30px 24px 30px;

      &:before {
        content: attr(data-title);
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        color: #6a7b92;
      }
    }

    dd.article_goods_analysis {
      grid-template-columns: repeat(4, 1fr);

      .info {
        min-height: 164px;
        justify-content: flex-start;

        &:before {
          margin-top: 24px;
          margin-bottom: 14px;
        }

        &:after {
          content: none;
        }

        span {
          font-size: 18px;
          color: var(--text-color);
          line-height: 20px;
          margin-bottom: 12px;
        }
      }

      .textarea {
        grid-column: 1/5;
      }
    }
  }

  .footer {
    @offset: 100px;

    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 0;
    width: calc(100vw - 198px);
    bottom: 0;
    height: 56px;
    background-color: #ffffff;
    z-index: 1000;

    .btn-view {
      border: solid 1px var(--theme-color);
      color: var(--theme-color);
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: 0.1s;
      font-weight: 600;
      padding: 8px 55px;
      border-radius: 3px;
      font-size: 14px;
    }

    /deep/ .el-button {
      padding: 8px 55px;
      border-radius: 3px;
      margin-left: 20px;
    }
  }

  .select-contract {
    display: grid;
    grid-template-rows: repeat(2, auto, 32px);
    grid-row-gap: 6px;

    & > span {
      font-size: 12px;
      color: #6a7b92;
    }

    .empty {
      height: 12px;
    }

    /deep/ .el-input--small {
      width: 100%;
    }
  }
}
</style>
