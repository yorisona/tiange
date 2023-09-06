<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 0px;
  height: 100vh;
  font-size: 28px;
  background-color: #ffffff;
  overflow: auto;

  .dialog-container-body {
    width: 1132px;
    margin: 0 auto;
    padding-top: 60px;
    display: grid;
    grid-template-columns: 1fr 332px;
    grid-column-gap: 40px;
    padding-bottom: 108px;
  }

  .news-body {
    .header {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      border-bottom: solid 1px #e5e5e5;

      .title {
        font-weight: 600;
        font-size: 30px;
        color: var(--text-color);
        line-height: 1.3;
      }

      .description {
        margin-top: 24px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--text-third-color);

        span {
          display: block;
        }

        .empty {
          flex: 1;
        }

        .form {
          border-radius: 2px;
          padding: 2px 6px;
        }

        .time {
        }

        .el-icon-time {
          margin-right: 8px;
        }
      }
    }

    .content {
      padding: 24px 0px 16px 0px;
      line-height: 1.6em;
      text-indent: 2em;
      flex: 1 1 0;
      font-weight: 400;
      font-size: 16px;
      text-align: left;
    }

    .source {
      padding: 0px 0 33px 0px;

      a {
        color: var(--theme-color);
        display: block;
      }
    }
  }

  .side {
    .hot-news {
      border: 1px solid #e5e5e5;
      height: 550px;
      display: flex;
      flex-direction: column;

      .hot-news-title {
        height: 44px;
        color: #ffffff;
        font-weight: 600;
        font-size: 16px;
        display: flex;
        padding-left: 20px;
        align-items: center;
        background: url('~@/assets/img/external/news-title-bg.jpg') no-repeat;
        background-size: cover;
      }
    }

    .content {
      position: relative;
      padding-left: 32px;
      padding-top: 30px;
      margin-bottom: 30px;
      flex: 1 1 0;
      overflow: auto;
    }

    .new {
      display: flex;
      flex-direction: column;
      padding: 0px 30px 24px 24px;
      position: relative;

      .line {
        position: absolute;
        left: 0px;
        top: 0;
        height: 100%;
        width: 1px;
        background-color: #e5e5e5;

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

      .time {
        color: var(--text-third-color);
      }

      .title {
        font-weight: 400;
        font-size: 14px;
        color: var(--text-color);
        padding: 4px 0 0 0;
        cursor: pointer;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

        &.active {
          color: var(--theme-color);
        }

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

    .more {
      width: 110px;
      height: 32px;
      background: #ffffff;
      border: 1px solid var(--border-line-color);
      border-radius: 3px;
      font-weight: 400;
      font-size: 14px;
      color: var(--text-second-color);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 25px auto;
      cursor: pointer;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 88px;
    background: #ffffff;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;

    .btns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 16px;

      button {
        width: 92px;
        height: 32px;
        background: #ffffff;
        border: 1px solid var(--border-line-color);
        border-radius: 3px;
        font-size: 14px;
        color: var(--text-second-color);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          border-color: var(--theme-color);
          color: var(--theme-color);
        }
        &[disabled] {
          color: #c1c1c1;
          border-color: var(--border-line-color);
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
