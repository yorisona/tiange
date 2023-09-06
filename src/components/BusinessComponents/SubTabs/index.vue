<script src="./index.tsx"></script>

<style lang="less" scoped>
.tgb-subtabs {
  flex: 1;
  .tgb-subtabs-header {
    min-height: 54px;
    background: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: solid 1px #e5e5e5;
    margin: 0 18px;
    div {
      font-size: 14px;
      color: var(--text-second-color);
      padding-right: 18px;
      padding-left: 18px;
      position: relative;
      cursor: pointer;
      &.active {
        color: var(--theme-color);
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
      &:after {
        display: block;
        content: ' ';
        width: 1px;
        height: 12px;
        background: rgba(164, 178, 194, 0.5);
        overflow: hidden;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -6px;
      }
    }
  }
}
</style>
