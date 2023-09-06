<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-associateGoods-container {
  height: 358px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .tips {
    display: flex;
    background: #fff7f3;
    color: #ff7a36;
    font-size: 12px;
    padding: 10px;
    .icon {
      font-size: 18px;
    }
  }
  .tg-tabs {
    margin-top: 8px;
    border-bottom: 1px solid #e3e8ec;
  }
  .madol-field {
    margin-top: 10px;
    overflow: overlay;
    .time {
      padding: 13px 54px 24px 24px;
    }
    .modal-title {
      display: flex;
      align-items: center;
      padding: 0 24px;
      &::before {
        content: ' ';
        background: var(--theme-color);
        width: 3px;
        height: 12px;
        margin-right: 4px;
        border-radius: 1px;
      }
    }
    .list {
      padding: 9px 24px 18px;
      .item {
        display: grid;
        grid-template-columns: 356px 20px;
        column-gap: 10px;
        margin-top: 12px;
        align-items: center;
        justify-items: center;
        &:first-of-type {
          margin-top: 0;
        }
        .icon {
          font-size: 14px;
          height: 15px;
          color: #c1c1c1;
          cursor: pointer;
          &:hover {
            color: var(--error-color);
          }
        }
      }
    }
  }
  .goods-field {
    display: flex;
    overflow: overlay;
    flex: 1;
    flex-direction: column;
    margin-top: 10px;
    .list {
      padding: 18px 24px;
      .item {
        display: grid;
        grid-template-columns: 144px 202px 20px;
        column-gap: 10px;
        margin-top: 12px;
        align-items: center;
        justify-items: center;
        &:first-of-type {
          margin-top: 0;
        }
        .icon {
          font-size: 14px;
          // height: 28px;
          height: 15px;
          color: #c1c1c1;
          cursor: pointer;
          &:hover {
            color: var(--error-color);
          }
        }
      }
    }
  }
}
</style>
