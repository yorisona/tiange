<script src="./shopItem.tsx"></script>
<style lang="less" scoped>
.tg-shop-item-page-container {
  .goods-summary {
    display: flex;
    .el-image {
      width: 70px;
      height: 70px;
      border-radius: 2px;
    }
    .goods-summary-right {
      flex: 1;
      margin-left: 10px;
      .rank-name-field {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .rank-name {
          display: flex;
          align-items: center;
          .tag {
            display: inline-block;
            border: 1px solid rgba(var(--text-rgb-color), 0.3);
            border-radius: 2px;
            font-weight: 400;
            font-size: 12px;
            color: var(--text-third-color);
            line-height: 13px;
            height: 15px;
            padding: 0px 4px;
            flex-shrink: 0;
            margin-right: 6px;
            &.tag-rank-1 {
              color: #f43324;
              border-color: #f4332466;
            }
            &.tag-rank-2 {
              color: #fb8500;
              border-color: #fb850066;
            }
            &.tag-rank-3 {
              color: #3a81fc;
              border-color: #2877ff66;
            }
          }
          .name {
          }
        }
        .product-operator {
          margin-left: 12px;
          flex-shrink: 0;
          height: 20px;
          line-height: 20px;
          padding: 0 4px;
        }
      }
      .goods-summary-detail {
        display: grid;
        grid-template-columns: 1.16fr 1fr 1.36fr 1.6fr;
        gap: 6px;
        margin-top: 4px;
        .label-value {
          color: #888888;
        }
      }
    }
  }
  .goods-detail {
    background: #f6f6f6;
    border-radius: 4px;
    padding: 8px;
    margin-top: 10px;
    .display-list {
      display: grid;
      grid-auto-flow: column;
      align-items: center;
      column-gap: 6px;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2px 0;
        border-radius: 4px;
        &[active] {
          background: #2877ff1f;
        }
        .label {
          color: #888888;
        }
        .value {
        }
      }
    }
    .line {
      width: 100%;
      height: 1px;
      border-top: 1px dashed var(--border-line-other-color);
      margin: 6px 0;
    }
    .other-info {
      display: flex;
      align-items: center;
      color: #888888;
      .left {
        flex: 1;
        display: grid;
        grid-template-columns: 1.6fr 1fr 2.5fr;
        //grid-auto-flow: column;
        //grid-template-columns: minmax(116px, auto) 1fr;
        gap: 6px;
        //div:last-of-type {
        //  grid-column: span 2;
        //}
      }
      .right {
        cursor: pointer;
        margin-left: 12px;
        font-size: 14px;
      }
    }
  }
  .green {
    color: #20bf55;
  }
  .orange {
    color: #fb8500;
  }
}
</style>
<style lang="less">
.live-tool-shop-item-goods-name-component-popover {
  max-width: 360px !important;
}
</style>
