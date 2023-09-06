<script src="./index.tsx"></script>
<style lang="less" scoped>
.page-content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /deep/.assessment_content {
    color: var(--text-color);
    font-size: var(--small-font-size);
    flex: 1;
    overflow-y: auto;
    padding: 32px 32px;
    background-color: white;
    display: flex;
    flex-direction: column;
    //align-items: flex-start;
    .el-radio__label {
      color: var(--text-color);
    }
  }
}
.tg-tabs {
  flex-direction: row;
  align-items: center;
  border-bottom: solid 1px var(--border-line-div-color);
  .group {
    .tg-btn {
      margin-right: 12px;
      &:last-of-type {
        margin-right: 18px;
      }
    }
  }
}
</style>
