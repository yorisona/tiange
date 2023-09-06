<script src="./addWork.tsx"></script>
<style lang="less" scoped>
/deep/.el-select .el-input .el-input__suffix {
  padding-top: 6px;
}
/deep/.el-input-group__append {
  padding: 0px 14px;
}
.addWork_box {
  padding: 12px 12px;
  font-weight: 400;
  font-size: 12px;
  color: #0a0a0a;
  .addWork_box_title {
    margin-bottom: 8px;
  }
  .el-form-item {
    margin: 0;
  }
  .project_item {
    display: flex;
    align-items: center;
    &_left {
      margin-right: 10px;
      flex: 0 0 243px;
    }
  }
  .date-box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    // margin-top: 14px;
    grid-column-gap: 10px;
    margin-bottom: 12px;
    span {
      margin-bottom: 8px;
    }
  }
  .textarea {
    margin-top: 10px;
    // /deep/ .el-textarea__inner {
    //   background-color: rgb(247, 247, 247);
    // }
  }
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background: #f4f8ff;
  padding: 0 12px;
  border-radius: 0 0 4px 4px;
  .btn {
    width: 80px;
    height: 36px;
  }
  .hours {
    font-weight: 400;
    font-size: 14px;
    color: #0a0a0a;
    letter-spacing: 0;
    padding-left: 16px;
    position: relative;
    --cirColor: #3f8ef6;
    .tip {
      color: var(--error-color);
      margin-left: 10px;
      font-size: 12px;
    }
    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: var(--cirColor);
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 6px;
    }
  }
}
</style>
