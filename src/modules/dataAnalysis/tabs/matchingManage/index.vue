<script src="./index.tsx"></script>
<style lang="less" scoped></style>

<style lang="less">
.matching-attachment-popover {
  max-height: 350px;
  overflow-y: overlay;
  overflow-x: hidden;
  .matching-attachment-file-list {
    .file-item {
      margin-top: 8px;
      align-items: flex-start;
      width: 100%;
      .icon {
        margin-top: 0;
      }
      &:first-of-type {
        margin-top: 0;
      }
      .file-name {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3; // 显示2行
        -webkit-box-orient: vertical;
        word-break: break-all;
        white-space: normal;
      }
    }
  }
}
</style>
