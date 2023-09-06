<script src="./index.tsx"></script>
<style lang="less" scoped>
.bodyContainer {
  overflow: auto;
  .btnLine {
    padding: 12px 16px 0px 16px;
    background-color: #ffffff;
  }
  .company-container {
    height: 100%;
    .company-item {
      background-color: #ffffff;
      margin-bottom: 10px;
      padding: 16px 16px 16px 16px;
      .company-info {
        .header {
          display: flex;
          justify-content: space-between;
          padding-bottom: 12px;

          .company-name {
          }
          .company-year {
            margin-left: 40px;
          }
          .company-gmv {
            color: #fb8500;
          }
          .expansion {
            user-select: none;
            color: var(--theme-color);
            cursor: pointer;
            svg {
              margin-right: 6px;
            }
          }
        }
        .companyDetails {
          display: grid;
          grid-template-columns: auto 1fr;
          font-size: 12px;
          color: var(--text-second-color);
          grid-row-gap: 8px;
          padding-bottom: 16px;
          span:nth-child(2n + 1) {
            color: var(--text-third-color);
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.el-tooltip__popper {
  max-width: 40%;
}
.introduction-tip {
  max-height: 200px;
  overflow: auto;
}
</style>
