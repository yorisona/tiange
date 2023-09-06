<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 18px 24px;
  .special-radio {
    height: 100% !important;
    display: flex;
    align-items: baseline;
    /deep/.el-radio__label {
      height: 100% !important;
    }
  }
  .radio-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 220px !important;
    line-height: unset !important;
    max-height: 300px !important;
    overflow: auto;
  }
  .img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px !important;
    margin-top: 6px;
    margin-bottom: 6px;
    /deep/.el-radio__label {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 12px;
    }
    &:last-child {
      margin-bottom: 0;
    }
    img {
      width: 60px;
      height: 60px;
      margin-bottom: 2px;
    }
  }
  .trend {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
    .tg-btn {
      height: 28px;
      line-height: 26px;
      font-size: 12px;
      border: 1px solid var(--border-line-color);
      &:first-of-type {
        margin-left: 0;
      }
      &[selected] {
        border: 1px solid rgba(var(--theme-rgb-color), 0.9);
        color: var(--theme-color);
        background-color: rgba(var(--theme-rgb-color), 0.1);
      }
    }
  }
  .form-box {
    // max-height: 230px;
    overflow: hidden;
    overflow-y: auto;
  }
  .item-scope {
    margin-right: 0;
  }
  .numbers {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .el-input {
      width: 256px;
    }
    .ico-btn-delete {
      font-size: 20px;
      color: #cccccc;
      margin-left: 10px;
    }
  }
}
</style>
