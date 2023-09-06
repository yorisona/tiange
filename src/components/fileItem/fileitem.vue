<script src="./fileitem.tsx"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.tg-file-item {
  display: flex;
  align-items: center;
  color: var(--text-color);
  > .file-icon {
    flex: none;
    .mgr(2px);
    > svg {
      .fs(16px);
    }
  }
  > .basename {
    flex: 0 1 auto;
    word-break: break-all;
    max-width: 300px;
    font-size: 12px;
  }
  > .extname {
    flex: none;
    font-size: 12px;
  }
  > .downlink {
    flex: none;
    cursor: pointer;
    .mgl(12px);
    font-size: 12px;
  }
  > .file-remove-icon {
    .mgl(12px) !important;
    flex: none;
    cursor: pointer;
  }
  &:hover {
    > .file-remove-icon {
      opacity: 1;
    }
  }
}
</style>
