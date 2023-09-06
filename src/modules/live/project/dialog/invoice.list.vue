<script src="./invoice.list.tsx"></script>
<style lang="less" scoped>
.invoice_list_container {
  padding: 20px;
  min-height: 154px;
  overflow-y: auto;
}

.invoice_list_container {
  line-height: 1;
  .text {
    color: var(--text-color);
  }
  .label {
    color: var(--text-des-color);
  }

  // 发票列表
  .invoice_list {
    display: grid;
    grid-row-gap: 20px;
    .voucher {
      .header {
        font-weight: 600;
        margin-bottom: 10px;
      }
      .content {
        background: #f6f6f6;
        padding: 16px;
        display: grid;
        grid-template-columns: 186px 1fr;
        grid-column-gap: 10px;
        .invoice {
          img {
            display: block;
            width: 186px;
            height: 120px;
            background-color: #ffffff;
          }
        }
        .info {
          display: grid;
          grid-template-columns: 70px 1fr;
          grid-row-gap: 10px;
        }
      }
    }
  }
  // 凭证列表
  .voucher_list {
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 10px;
    img {
      max-width: 100%;
      border: solid 1px var(--border-line-color);
      min-height: 20px;
    }
  }
}
</style>
