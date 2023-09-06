<script lang="ts" src="./perPayAudit.tsx"></script>

<style scoped lang="less">
.prepay-approval-container {
  /deep/ .content {
    padding: 16px 24px;
    display: grid;
    grid-row-gap: 18px;
    .row {
      // display: flex;
      // line-height: 32px;
      display: grid;
      grid-template-columns: 68px 1fr;
      // div:last-child {
      //   width: 160px;
      //   margin-left: 4px;
      //   color: var(--text-color);
      // }
      .toHt {
        cursor: pointer;
        color: var(--theme-color);
      }
      div:first-child {
        width: 64px;
        text-align: right;
        color: var(--text-third-color);
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: #f4f8ff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
