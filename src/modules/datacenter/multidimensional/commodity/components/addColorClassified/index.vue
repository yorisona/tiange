<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-add-color-classified-page-container {
  height: 550px;
  padding: 18px 18px 24px;
  display: flex;
  flex-direction: column;
  .table-field {
    flex: 1;
  }
  .add-field {
    flex-shrink: 0;
    height: 32px;
    /deep/ .tg-btn-link {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e5e5e5;
      border-top: none;
      span {
        margin-left: 4px;
      }
    }
  }
}
</style>
