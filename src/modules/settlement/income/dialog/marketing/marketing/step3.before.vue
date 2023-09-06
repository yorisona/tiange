<script src="./step3.before.tsx"></script>
<style lang="less" scoped>
@charset 'utf-8';

.settlement-step3-mcn-taobao-other-before {
  .step2-content-two {
    grid-template-rows: 24px 445px 0px !important;
  }
  .before-customer-list {
    width: 100%;
    padding: 18px 24px;
    overflow-y: overlay;
    border-radius: 2px;
    border: 1px solid rgba(var(--tip-icon-rgb-color), 0.3);
    .before-customer {
      .hr {
        margin: 18px 0;
        width: 552px;
        height: 1px;
        border-bottom: 1px dashed rgba(var(--tip-icon-rgb-color), 0.3);
      }
      .before-customer-name {
        font-weight: 600;
        color: var(--text-color);
      }
      .before-income-row {
        .before-income-row-detail {
          // display: flex;
        }
      }
      .label {
        display: inline-block;
        width: 84px;
        text-align: right;
        color: var(--text-second-color);
      }
      .value {
        display: inline-block;
        width: 122px;
        font-weight: 600;
        color: var(--text-color);
      }
      .down-load {
        margin-left: 12px;
      }
    }
    .other-desc {
      margin: 4px 0 0 84px;
      color: var(--text-third-color);
    }
  }
}
</style>
