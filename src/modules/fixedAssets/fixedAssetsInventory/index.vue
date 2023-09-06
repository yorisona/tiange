<script src="./index.tsx"></script>
<style lang="less">
.popover20230725 {
  .grid-wrap {
    .grid-item {
      color: var(--text-third-color);
      display: grid;
      grid-template-columns: auto 1fr;
      margin-bottom: 5px;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        &:nth-child(1) {
          color: var(--text-third-color);
        }
        &:nth-child(2) {
          color: var(--text-color);
        }
      }
    }
  }
}
.flex-box20230727 {
  display: flex;
  justify-content: center;
  align-items: center;
  .point.process {
    background: #ff955f;
  }
  .point.success {
    background: #33ba5d;
  }
  .point {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-top: 3px;
    margin-right: 5px;
  }
}
</style>
