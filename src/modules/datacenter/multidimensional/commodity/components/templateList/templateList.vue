<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-template-list {
  padding: 0;
  .header {
    padding: 16px 18px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px var(--border-line-other-color);
    .tg-btn {
      flex: 0 0 auto;
    }
  }
  .body {
    padding: 18px 16px;
    height: 283px;
    overflow: auto;
    .item {
      margin-top: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding-right: 16px;
      &:first-child {
        margin-top: 0;
      }
      &:hover {
        background: #e5f7fe;
        .ico-btn-delete {
          opacity: 1;
        }
      }
      &.selected {
        background: #2877ff;
        cursor: default;
        color: #ffffff;
      }
      .ico-common-chenggong-areality {
        font-size: 16px;
        &:hover {
          color: inherit !important;
        }
      }
      .ico-btn-delete {
        font-size: 16px;
        opacity: 0;
        &:hover {
          color: #2877ff !important;
        }
      }
      height: 32px;
      line-height: 32px;
      background: #f6f6f6;
      border-radius: 4px;
      padding-left: 12px;
    }
  }
}
</style>
