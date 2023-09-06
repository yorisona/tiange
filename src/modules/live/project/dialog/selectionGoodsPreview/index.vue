<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-selection-goods-preview-page-container {
  padding: 18px 0 24px;
  height: 440px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .header {
    color: #888888;
    padding-left: 18px;
    padding-bottom: 12px;
  }
  .list {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 18px;
  }
  .goods-item {
    padding-bottom: 16px;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
    &:not(:last-of-type) {
      border-bottom: 1px solid var(--border-line-other-color);
    }
  }
}
</style>
