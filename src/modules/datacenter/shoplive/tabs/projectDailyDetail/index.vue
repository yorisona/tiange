<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-datacenter-shoplive-daily-detail {
  /*padding: 18px;*/
  display: flex;
  min-width: 1200px;
  flex-direction: column;
  flex: 1;
  // margin-top: 50px;
  .filter-field {
    padding: 0px 25px 18px 25px;
    display: flex;
    background-color: white;
    .filter-item {
      /deep/ .el-date-editor {
        input {
          cursor: pointer;
        }
      }
      .label {
        color: #6a7b92;
      }
      &.date {
      }
      &.group {
        margin-left: 25px;
      }
    }
  }
  /deep/ .data-field {
    flex: 1;
    background-color: white;
    padding: 12px 18px 64px;
    overflow: overlay;
    .projects-data {
    }
    .project-charts-row {
      .project-title {
        .project-label {
          font-size: var(--small-font-size);
          color: var(--text-second-color);
        }
        .project-name {
          font-size: var(--small-font-size);
          color: var(--text-color);
          font-weight: 600;
        }
      }
      .project-charts {
        display: flex;
        height: 402px;
        margin-top: 24px;
        .charts-title {
          color: var(--text-color);
          font-weight: 500;
          padding: 18px 24px;
          font-size: var(--small-font-size);
        }
        .project-sunburst {
          width: 37.97%;
          min-width: 480px;
          border-radius: 4px;
          border: 1px solid var(--border-line-div-color);
        }
        .project-funnel {
          flex: 1;
          min-width: 669px;
          margin-left: 24px;
          border-radius: 4px;
          border: 1px solid var(--border-line-div-color);
        }
      }
    }
    .one-project-table {
      margin-top: 24px;
      .one-project-title {
        font-weight: 600;
        color: var(--text-color);
        font-size: var(--small-font-size);
      }
      .goods-name {
        cursor: pointer;
        line-height: 16px;
        font-weight: 600;
        margin-bottom: 2px;
        &:hover {
          color: var(--theme-color);
        }
      }
    }
    .product-info {
      display: flex;
      align-items: center;
      .el-image {
        flex-shrink: 0;
        margin-right: 10px;
      }
      .product-items {
        font-size: 12px;
        color: var(--text-color);
      }
    }
    .price-items {
      font-size: 12px;
      .price-label {
        color: var(--text-second-color);
        width: 60px;
        display: inline-block;
        text-align: right;
      }
    }
    .sort-container {
      color: var(--text-third-color);
      display: flex;
      align-items: center;
      .sort-icon {
        width: 7px;
      }
    }
  }
}
</style>
