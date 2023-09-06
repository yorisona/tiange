<script src="./index.tsx"></script>
<style lang="less" scoped>
.live-monitoring {
  flex: 1;
  display: flex;
  flex-direction: column;

  .filter-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-content: start;
    margin-bottom: 10px;
    background: #ffffff;
    padding: 16px 10px;
    align-items: center;
    .label {
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: var(--text-second-color);
    }

    .tg-btn-link {
      font-size: 12px;
      color: var(--text-second-color);
      margin-left: 12px;
      &:hover {
        color: var(--theme-color);
      }
    }
    .el-select {
      height: auto;
    }
  }
  .live-container-box {
    flex: 1;
    overflow: auto;
  }

  .live-header {
    padding: 12px 16px 12px 16px;
    background: #ffffff;
    color: var(--text-second-color);
    font-size: 14px;
    b {
      color: #ff7a36;
      font-weight: 600;
      font-size: 14px;
    }
  }

  .live-container {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(284px, 1fr));
    grid-gap: 24px 20px;
    background: #ffffff;
    padding: 0px 16px 16px 16px;
    &.empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .live {
      display: flex;
      flex-direction: column;
      .video-title {
        padding-top: 8px;
        text-align: center;
      }
    }
  }
}
</style>
