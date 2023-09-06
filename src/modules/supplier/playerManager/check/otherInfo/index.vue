<script src="./index.tsx"></script>
<style lang="less" scoped>
.other-info {
  display: flex;
  flex-direction: column;
  padding: 24px 18px 48px 18px;
  .label {
    color: var(--text-third-color);
    font-size: 12px;
  }
  .text {
    color: var(--text-color);
    font-size: 12px;
    .tg-btn-link {
      font-size: 12px;
    }
  }
  h1 {
    margin: 0;
    font-size: 12px;
    color: var(--text-color);
    font-weight: 600;
  }
  .show-img {
    cursor: pointer;
  }
  .division {
    margin: 18px 0;
    height: 1px;
    background: rgba(164, 178, 194, 0.3);
  }
  .block {
    display: flex;
    flex-wrap: wrap;
  }

  .columns {
    display: flex;
    max-width: 950px;
    min-width: 710px;
    .column {
      flex: 1;
    }
  }

  /** 两列的基本信息布局 **/
  .structure-left-right {
    h1 {
      margin-bottom: 18px;
    }
    .block {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-row-gap: 12px;
    }
  }
  .imgs {
    display: flex;
    //column-gap: 18px;
    align-items: flex-end;
    img {
      width: 174px;
      height: 109px;
      border-radius: 2px;
      &:first-child {
        margin-right: 12px;
      }
    }
    &.id-card {
      margin-top: 35px;
    }
  }

  .resume {
    margin-top: 18px;
    display: grid;
    grid-template-columns: auto minmax(10px, auto) auto 1fr;
    grid-row-gap: 14px;
    font-size: 12px;
    .text {
      color: var(--text-color);
    }

    .icon {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    .view {
      margin-left: 40px;
      color: var(--theme-color);
      cursor: pointer;
    }
  }
}
</style>
