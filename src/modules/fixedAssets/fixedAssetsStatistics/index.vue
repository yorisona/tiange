<script src="./index.tsx"></script>
<style lang="less" scoped>
.flex-ct() {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap {
  padding: 12px;
  display: flex;
  flex-direction: column;
  .header_box {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 360px;
    grid-column-gap: 12px;
    .header_box_wrap {
      background: #ffffff;
      border-radius: 4px;
      padding: 16px;
      .title_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .syb-btn {
        width: 44px;
        height: 20px;
        border-radius: 2px;
        font-size: 12px;
        color: #888888;
        text-align: center;
        border: 1px solid #d8d8d8;
        cursor: pointer;
        .flex-ct();
        &[selected] {
          background: #2877ff;
          color: #ffffff;
          border: none;
        }
      }
    }
  }
  .list-box {
    width: 100%;
    margin-top: 12px;
    background: #ffffff;
    flex: 1 1 0;
    padding: 16px 19px 24px;
    display: flex;
    flex-direction: column;
    .list-box_titie {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &_right {
        display: flex;
        align-items: center;
      }
    }
    .data-text {
      color: #19232d;
      font-size: 14px;
      padding-left: 9px;
      span:nth-child(even) {
        color: #fb8500;
        font-weight: 600;
        margin-right: 40px;
      }
    }
  }
}
</style>
