<script src="./card.layout.tsx"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.card-layout {
  display: grid;
  grid-template-areas:
    'hd'
    'bd';
  grid-template-rows: 40px auto;
  .brd(1px; solid; rgba(var(--tip-icon-rgb-color), 0.3));
  .brdr(2px);
  flex: auto;
  &.card-layout-livedouyin {
    border-width: 0px;
  }
  > .card-layout-hd {
    display: flex;
    height: 40px;
    .bgc(rgba(var(--tip-icon-rgb-color), 0.09));
    &.livedouyin {
      background-color: white;
    }
    align-items: center;
    .pd(0 12px);
    > .title {
      font-size: 14px;
      color: var(--text-color);
      line-height: 18px;
      font-weight: 600;
    }
    > .description {
      .fc(12px, var(--tip-icon-color));
      font-weight: 400;
      line-height: 16px;
      .mgl(12px);
      flex-grow: 1;
    }
    > .needrefresh {
      .fc(12px, var(--theme-color));
      font-weight: 600;
      line-height: 16px;
      text-align: right;
    }
  }
  > .card-layout-bd {
    display: flex;
    flex-direction: column;
    .bgc(white);
    overflow-y: auto;
    overflow-y: overlay;
  }
}
</style>
