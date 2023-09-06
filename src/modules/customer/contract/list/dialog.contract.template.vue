<script src="./dialog.contract.template.tsx"></script>
<style lang="less" scoped>
.abnormal-tip {
  font-size: 12px;
  color: #6a7b92;
  line-height: 19px;
}

.dialog-contact-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 50%);
  height: 202px;

  .block {
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      font-size: 14px;
      color: var(--text-color);
      margin-top: 30px;
      font-weight: 600;
      span:first-child {
        padding-right: 6px;
      }
      svg {
        color: #c4cbd2;
        font-size: 16px;
      }
    }
    .items {
      margin-top: 20px;
      display: flex;
      column-gap: 30px;
      .item {
        cursor: pointer;
      }
    }
  }
  .icon-contract {
    width: 60px;
    height: 60px;
    background-size: 100% 100%;
    margin-bottom: 10px;
  }
  .icon-contract-0 {
    background-image: url('../../../../assets/img/live/icon-customer.png');
  }
  .icon-contract-1 {
    background-image: url('../../../../assets/img/live/icon-supplier.png');
  }
  .text {
    font-size: 12px;
    color: #6a7b92;
    display: inline-block;
    width: 100%;
    text-align: center;
  }
}
</style>
