<script src="./index.tsx"></script>
<style lang="less" scoped>
.detail-container {
  .detail-body {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    padding: 16px 16px 16px + 24px 16px;
    flex: 1;
    overflow: auto;
  }

  .title-area {
    display: flex;
    align-items: center;
    font-size: var(--small-font-size);
    &.mgt-25 {
      margin-top: 25px;
    }
    &:before {
      display: inline-block;
      content: ' ';
      width: 3px;
      height: 14px;
      background: var(--theme-color);
      border-radius: 1px;
      margin-right: 7px;
    }
    .fill {
      flex: 1;
    }
  }

  .label {
    width: 90px;
    text-align: right;
    color: var(--text-third-color);
    display: inline-block;
  }
  .topic,
  .info-item {
    font-size: 12px;
    .tg-btn-link {
      font-size: 12px;
    }
  }
  .info-item {
    display: grid;
    grid-template-columns: auto 1fr;
  }
  .topic {
    margin-top: 13px;
    display: flex;
    span:nth-child(2n + 1) {
      color: var(--text-third-color);
      margin-left: 80px;
    }
    span:nth-child(1) {
      margin-left: 0;
    }
  }
  /deep/ .courseware-list {
    display: flex;
    .list-box {
      flex: 1;
      .upload-file-list {
        line-height: 22px;
      }
    }
    .file-item {
      margin-bottom: 8px;
    }
    .file-options {
      display: grid;
      grid-template-columns: auto auto;
      align-items: center;
      grid-column-gap: 8px;
      margin-left: 16px;
    }
  }

  .table-box {
    width: 100%;
    flex: 1;
  }
}
</style>
