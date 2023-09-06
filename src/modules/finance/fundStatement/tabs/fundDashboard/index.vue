<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-finance-fund-dashboard-container {
  padding: 10px 10px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  overflow: overlay;
  .summary-field {
    background: white;
    display: grid;
    grid-template-columns: repeat(4, minmax(291px, 1fr));
    grid-template-rows: 146px;
    column-gap: 16px;
    padding: 18px 16px;
    .summary-item {
      text-align: center;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding: 22px 16px 16px;
      .summary-title {
        margin-left: 8px;
        display: inline-block;
        color: var(--text-color);
        font-size: 20px;
        height: 28px;
        line-height: 28px;
      }
      .summary-amount {
        margin-top: 12px;
        color: var(--text-color);
        font-size: 26px;
        height: 40px;
        line-height: 40px;
        &:before {
          content: '\00a5\0020';
          color: var(--text-color);
          font-size: 20px;
        }
      }
      .summary-other {
        color: var(--text-second-color);
        font-size: 14px;
        margin-top: 8px;
        height: 20px;
        line-height: 20px;
      }
    }
  }
  .charts-field {
    margin-top: 10px;
    display: flex;
    .charts-pie {
      background: white;
      width: 40.51%;
      padding: 40px 32px 32px;
    }
    .charts-bar {
      flex: 1;
      background: white;
      margin-left: 10px;
      .harts-bar-title {
        color: var(--text-color);
        font-size: var(--small-font-size);
        font-weight: 500;
        margin-left: 24px;
        margin-top: 18px;
      }
    }
  }
  .banks-field {
    margin-top: 10px;
    background: white;
    padding: 16px;
    flex: 1;
    .banks-llist {
      display: grid;
      grid-template-columns: repeat(4, minmax(291px, 1fr));
      column-gap: 16px;
      row-gap: 16px;
    }
    .bank-item {
      background: #019ce60d;
      display: flex;
      padding: 16px 12px 24px 18px;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      .bank-icon {
        flex-shrink: 0;
        width: 55px;
        height: 55px;
        border-radius: 27.5px;
        overflow: hidden;
        .project-icon-slot {
          img {
            width: 55px;
            height: 55px;
          }
        }
      }
      .bank-icon-bg {
        position: absolute;
        right: 0;
        bottom: -16px;
        width: 100px;
        height: 100px;
        border-radius: 50px;
        overflow: hidden;
        opacity: 0.03;
        pointer-events: none;
        .project-icon-slot {
          img {
            width: 100px;
            height: 100px;
          }
        }
      }
      .bank-info {
        margin-top: 14px;
        margin-left: 16px;
        max-width: calc(100% - 55px - 16px);
        .bank-name {
          font-size: 20px;
          color: var(--text-color);
          height: 28px;
          line-height: 28px;
        }
        .bank-amount {
          margin-top: 21px;
          font-size: 21px;
          color: var(--text-color);
          white-space: nowrap;
          overflow: hidden;
          height: 29px;
          line-height: 29px;
        }
      }
    }
  }
}
</style>
