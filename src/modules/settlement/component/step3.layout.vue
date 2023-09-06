<script src="./step3.layout.tsx"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.step3-layout {
  &.settlement-douyin-live {
    > .step3-layout-content {
      height: 530px;
      display: grid;
      grid-template-rows: 115px 238px auto !important;
    }
    > .step3-layout-content-left,
    > .step3-layout-content-right,
    > .step3-layout-content-files {
      > .card-layout {
        height: 252px;
        > .card-layout-bd {
          overflow-y: auto;
          overflow-y: overlay;
        }
      }
    }
  }
  > .step3-layout-content {
    height: 540px;
    display: grid;
    grid-template-rows: 118px 202px auto;
    row-gap: 18px;
    column-gap: 18px;
    .pd(19px 24px 0 24px);
    // .mgb(24px);
    overflow-y: auto;
    overflow-y: overlay;
    &.col-2 {
      overflow-x: hidden;
      grid-template-areas:
        '. top top .'
        '. left right .'
        '. files files .';
      grid-template-columns: auto repeat(2, 286px) auto;
      &.col-2-mcn {
        .pd(19px 0 0 0) !important;
        grid-template-columns: auto 604px 294px;
      }
    }
    &.col-3 {
      grid-template-areas:
        'top top top'
        'left center right'
        'files files files';
      grid-template-columns: repeat(3, 286px);
    }
    > .step3-layout-content-top {
      grid-area: top;
    }
    > .step3-layout-content-left {
      grid-area: left;
    }
    > .step3-layout-content-center {
      grid-area: center;
    }
    > .step3-layout-content-right {
      grid-area: right;
    }
    > .step3-layout-content-files {
      grid-area: files;
    }
    > .step3-layout-content-left,
    > .step3-layout-content-right,
    > .step3-layout-content-files {
      > .card-layout {
        height: 220px;
        > .card-layout-bd {
          overflow-y: auto;
          overflow-y: overlay;
        }
      }
    }

    .settlement-uploaded-files {
      display: grid;
      margin-bottom: 4px;
    }
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
