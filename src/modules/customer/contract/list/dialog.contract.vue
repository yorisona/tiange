<script src="./dialog.contract.tsx"></script>
<style lang="less">
.dialog-contact-container {
  line-height: 1;
  height: 202px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 50%);
  align-items: center;
  justify-items: center;
  padding-left: 30px;
  padding-right: 30px;
  .block {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -10px;
  }
  .icon-contract {
    width: 72px;
    height: 72px;
    background-size: 100% 100%;
    margin-bottom: 14px;
  }
  .icon-contract-0 {
    background-image: url('../../../../assets/img/live/icon-customer.png');
  }
  .icon-contract-1 {
    background-image: url('../../../../assets/img/live/icon-supplier.png');
  }
  .text {
    color: var(--text-color);
    font-weight: 600;
  }
}
</style>
