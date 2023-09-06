<script src="./index.tsx"></script>
<style lang="less" scoped>
.detail-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  overflow-y: auto;
  .search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 16px 18px 0 18px;
    min-width: 1200px;
    /deep/.btn-capsule {
      height: auto;
      border: none;
      grid-template-columns: 1fr 1fr;
      .btn-capsule-left {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: none;
      }
      .btn-capsule-right {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left: none;
      }
      .sep {
        display: none;
      }
      .btn-capsule-left,
      .btn-capsule-right {
        box-sizing: border-box;
        height: 28px;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: solid 1px var(--border-line-color);
        &.active {
          color: #ffffff;
          background-color: var(--theme-color);
          border: none !important;
        }
      }
    }
  }

  .detail-container-body {
    flex: 1;
    min-width: 1200px;
  }
}
</style>
