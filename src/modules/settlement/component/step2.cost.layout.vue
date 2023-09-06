<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-23 11:33:16
-->
<script src="./step2.cost.layout.tsx"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.step2-cost-layout {
  > .step2-cost-layout-content {
    display: grid;
    // grid-template-rows: 118px 320px;
    grid-template-areas:
      'top top'
      'left right';
    // grid-template-columns: 714px 320px;
    row-gap: 18px;
    column-gap: 18px;
    .pd(18px 24px 24px);
    .step2-cost-layout-content-top {
      grid-area: top;
    }
    .step2-cost-layout-content-left {
      grid-area: left;
      display: flex;
      overflow-y: auto;
      overflow-y: overlay;
    }
    .step2-cost-layout-content-right {
      grid-area: right;
      display: flex;
    }
    .step2-cost-layout-content-bottom {
      grid-area: bottom;
    }
    .step2-cost-layout-content-files {
      height: 50px;
      grid-area: files;
    }
  }
  .step2-cost-layout-content.container-bottom {
    grid-template-areas:
      'top top'
      'left right'
      'bottom bottom';
  }
  .step2-cost-layout-content.container-contact-bottom {
    grid-template-areas:
      'top top'
      'left right'
      '. files files .'
      'bottom bottom';
  }
  .step2-cost-layout-content.container-contact {
    grid-template-areas:
      'top top'
      'left right'
      '. files files .';
  }
  .amount-name {
    .fc(14px, var(--text-second-color));
    line-height: 18px;
    font-weight: 400;
  }
  .amount-value {
    .fc(18px, var(--warning-color));
    line-height: 24px;
    font-weight: 600;
    .mgl(6px);
  }
}
</style>
