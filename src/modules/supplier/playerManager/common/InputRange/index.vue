<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-input-range {
  display: flex;
  align-items: center;
  width: 150px;
  border-radius: 2px;
  border: 1px solid var(--border-line-color);
  span {
    display: block;
    font-size: 12px;
    color: var(--text-color);
  }
  /deep/.el-input {
    flex: 1;
    .el-input__inner {
      border: none;
      border-radius: 0;
      text-align: center;
      &::placeholder {
        text-align: center;
      }
    }
  }
}
</style>
