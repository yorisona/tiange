<script src="./index.tsx"></script>
<style lang="less" scoped>
/deep/ .repain-select {
  position: relative;
  // .department-input {
  //   .el-input__suffix {
  //     width: 25px;
  //   }
  // }
  .department-select-tags {
    position: absolute;
    left: 0;
    top: 0;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    & > span {
      height: 20px;
      line-height: 20px;
      background: #f4f4f5;
      padding: 0 5px;
      color: #909399;
      font-size: 12px;
      margin: 2px 0 2px 6px;
      display: inline-flex;
      align-items: center;
      border-radius: 4px;
    }
    & .el-icon-close {
      color: white;
      background-color: #c0c4cc;
      flex-shrink: 0;
      border-radius: 50%;
      cursor: pointer;
      height: 16px;
      width: 16px;
      font-size: 12px;
      transform: scale(0.7);
      line-height: 16px;
      right: -2px;
      top: 0;
      position: relative;
      &:before {
        display: block;
        transform: translate(2px, 0);
      }
    }
  }
}
</style>
