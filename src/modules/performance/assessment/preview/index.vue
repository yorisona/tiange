<script src="./index.tsx"></script>
<style lang="less" scoped>
.page-content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .container {
    background-color: white;
    overflow: hidden;
    flex: 1;
    padding: 16px 18px 40px;
    display: flex;
    flex-direction: column;
    .userinfo-box {
      display: flex;
      margin-bottom: 24px;
      align-items: center;

      .avatar {
        width: 64px;
        height: 64px;
        margin-right: 16px;
      }
      .userinfo {
        display: flex;
        flex-direction: column;
        .name {
          font-size: 20px;
          color: var(--text-color);
          line-height: 26px;
          margin-bottom: 6px;
        }
        .job {
          font-size: 16px;
          color: var(--text-third-color);
          line-height: 22px;
        }
      }
    }
    /deep/.table-box {
      overflow: auto;
      .el-table__body tr {
        &:hover > td {
          background-color: transparent;
        }
        & > td {
          &:hover {
            background-color: var(--table-current-row-bg-color);
          }
        }
      }
    }
  }
  .steps-box {
    margin-bottom: 24px;
  }
}
</style>
