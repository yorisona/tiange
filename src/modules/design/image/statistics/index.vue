<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-design-image-statistics-container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: overlay;
  margin-top: 10px;
  background: white;
  .operator-field {
    background-color: white;
    padding: 12px 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .date-switch {
      cursor: pointer;
      height: 28px;
      width: 28px;
      border-radius: 14px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(var(--text-third-rgb-color), 0.3);
      .icon {
        color: var(--text-third-color);
      }
      &:hover {
        border-color: var(--theme-color);
      }
      &[disabled] {
        color: var(--text-third-color) !important;
        border-color: #e3e8ec !important;
        cursor: not-allowed !important;
        .icon {
          color: #e3e8ec !important;
        }
      }
    }
    .date-text {
      padding: 0 16px;
      color: var(--text-color);
      font-size: 14px;
    }
    .date-type-switch {
      margin-left: 32px;
      display: flex;
      .date-type-item {
        height: 28px;
        text-align: center;
        line-height: 28px;
        width: 56px;
        font-size: 12px;
        color: var(--text-color);
        border: 1px solid var(--border-line-color);
        cursor: pointer;
        &[selected] {
          color: var(--theme-color);
          background-color: #e9f1ff;
          border: 1px solid #4e8fff;
        }
        &.week {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &.year {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
  }
  .summary-field {
    background: white;
    display: grid;
    grid-template-columns: repeat(5, minmax(192px, 1fr));
    grid-template-rows: 118px;
    -moz-column-gap: 16px;
    column-gap: 16px;
    padding: 0 16px;
    .summary-item {
      text-align: center;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding: 22px 16px 16px;
      .title {
        .icon {
          width: 16px;
          height: 16px;
          position: relative;
          top: -1px;
          &.ico-icon_zongtidanshu {
            color: #ff7f00;
          }
          &.ico-zongjiedanshu {
            color: #14c900;
          }
          &.ico-zongtuidanshu {
            color: #f35d5d;
          }
          &.ico-zonghaoshi {
            color: var(--theme-color);
          }
          &.ico-manyidu {
            color: #5f59f7;
          }
        }
        span {
          margin-left: 8px;
          font-size: 20px;
          color: var(--text-color);
        }
      }
      .content {
        margin-top: 10px;
        color: var(--text-color);
        font-size: 26px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
  .charts-field {
    flex-grow: 1;
    background: white;
    display: grid;
    //grid-template-columns: repeat(2, minmax(592px, 1fr));
    grid-template-columns: 42% 58%;
    grid-template-rows: 460px;
    column-gap: 24px;
    row-gap: 24px;
    padding: 32px 16px 0;
    margin-right: 24px;
    /deep/ .chart-container {
      .empty-chart {
        margin-top: 40px !important;
      }
      &.no-change-empty-top {
        .empty-chart {
          margin-top: 1px !important;
        }
      }
    }
    .business-type-tree {
      width: 144px;
      border: 1px solid var(--border-line-color);
      font-size: 12px;
      padding: 0 18px;
      margin-top: 18px;
      border-radius: 3px;
      .depart-select-box {
        display: flex;
        justify-content: space-between;
      }
    }
    .chart-title {
      color: var(--text-color);
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: var(--small-font-size);
      .icon {
        margin-left: 12px;
        margin-right: 2px;
        font-size: 18px;
        width: 20px;
        height: 20px;
        color: #e18420 !important;
        display: none;
      }
      .desc {
        color: var(--text-third-color);
        font-size: 12px;
        font-weight: 400;
        height: 20px;
        line-height: 20px;
        margin-left: 12px;
      }
    }
    .chart {
      margin-top: 12px;
      height: 370px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
    }
  }
}
</style>
