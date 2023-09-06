<script src="./index.tsx"></script>
<style lang="less">
.backed-detail {
  .item {
    font-size: 12px;
    line-height: 24px;
    .project-name {
      color: #606974;
      line-height: 16px;
    }
    .project-status {
      line-height: 16px;
      &.unsubmit {
        color: #606974;
      }
      &.wait-confirm {
        color: var(--warning-color);
      }
      &.confirmed {
        color: var(--success-color);
      }
      &.backed {
        color: var(--error-color);
      }
    }
  }
}
</style>
