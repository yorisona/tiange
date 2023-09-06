<script src="./index.tsx"></script>
<style lang="less" scoped>
.page-container {
  display: flex;
  flex-direction: column;
}
.bodyContainer {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .btnLine {
    padding: 0px 16px 10px 16px;
  }
  .company-container {
    padding-bottom: 30px;
    flex: 1;
    overflow: auto;
    &.nodata {
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .company-item {
      background-color: #ffffff;
      margin-bottom: 10px;
      padding: 12px 16px 16px 16px;
      .company-info {
        .header {
          display: flex;
          justify-content: space-between;
          padding-bottom: 12px;
          .title {
            display: flex;
            align-items: center;
            font-size: var(--small-font-size);
          }

          .company-name {
            display: flex;
            align-items: center;
            &:before {
              display: block;
              content: ' ';
              width: 3px;
              height: 14px;
              background: var(--theme-color);
              border-radius: 1px;
              margin-right: 6px;
            }
          }
          .company-year {
            margin-left: 32px;
          }
          .company-gmv {
            color: #fb8500;
          }
          .expansion {
            user-select: none;
            color: var(--theme-color);
            cursor: pointer;
            font-size: var(--default-font-size);
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
            text-align: right;
          }
        }
      }
    }
    /deep/.company-item {
      tbody {
        tr:last-child {
          background-color: #f5f7fa;
        }
      }
    }
  }
}
</style>
