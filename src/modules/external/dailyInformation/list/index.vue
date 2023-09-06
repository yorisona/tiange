<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 0px;
  width: 100%;
  height: 100vh;
  font-size: 28px;
  background-color: #ffffff;
  .empty {
    flex: 1 1 0;
  }
  .scale-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    max-width: 1080px;
    margin: 0 auto;
  }

  .header {
    width: 100%;
    display: flex;
    border-bottom: solid 2px #eaeaea;
    padding: 60px 0 30px 0;
    justify-content: space-between;
    margin-bottom: 40px;

    .header-title {
      font-weight: 500;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0.26px;
      text-align: justify;
      display: flex;
      align-items: center;
      &:before {
        display: block;
        content: ' ';
        width: 4px;
        height: 24px;
        margin-right: 10px;
        overflow: hidden;
        background-color: var(--theme-color);
        border-radius: 1px;
      }
    }
    .header-options {
      display: flex;
      align-items: center;
    }
    .left,
    .right {
      width: 28px;
      height: 28px;
      background: #ffffff;
      border: 1px solid rgba(164, 178, 194, 0.3);
      border-radius: 32px;
      font-size: 18px;
      color: var(--text-third-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0 12px;
      &:hover {
        border-color: var(--theme-color);
      }
    }

    .date {
      display: flex;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0.17px;
      align-items: center;

      .year {
        align-self: end;
        padding-right: 8px;
      }
      .week {
        align-self: start;
      }
    }
  }
  .content {
    padding: 14px 0 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1080px;
    flex: 1;
    overflow-y: auto;
    .new {
      display: flex;
      flex-direction: column;
      padding: 0px 0 32px 44px;
      position: relative;
      width: 960px;
      .line {
        position: absolute;
        left: 0px;
        top: 0;
        height: 100%;
        width: 1px;
        background-color: #c1c1c1;
        &:before {
          position: absolute;
          content: ' ';
          display: block;
          width: 16px;
          height: 16px;
          left: -8px;
          top: 2px;
          background-color: #d1e2ff;
          border-radius: 16px;
        }
        &:after {
          position: absolute;
          content: ' ';
          display: block;
          width: 8px;
          height: 8px;
          left: -4px;
          top: 6px;
          background-color: var(--theme-color);
          border-radius: 16px;
        }
      }
      .title {
        font-weight: 600;
        font-size: 16px;
        color: var(--text-color);
        padding: 12px 0;
        cursor: pointer;
        &:hover {
          color: var(--theme-color);
        }
      }
      .new-content {
        font-weight: 400;
        font-size: 14px;
        color: var(--text-second-color);
        letter-spacing: 0.29px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      .new-footer {
        font-size: 14px;
        color: var(--text-second-color);
        .form {
        }
      }
    }
    .empty {
      font-size: 14px;
      padding-top: 100px;
    }
  }
}
</style>
