<script src="./index.tsx"></script>
<style lang="less" scoped>
.competitive-pre-sale {
  display: flex;
  flex-direction: column;
  .pre-sale-body {
    flex: 1;
    .split {
      width: 1px;
      height: 12px;
      background: #e3e8ec;
      margin: 0 8px;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      .date {
        font-size: 12px;
        color: var(--text-color);
      }
      .tips {
        font-size: 12px;
        color: var(--text-third-color);
      }
      .days {
        display: flex;
        font-size: 12px;
        align-items: center;
        span.day {
          cursor: pointer;
          padding: 4px 12px;
        }
        .active {
          background: rgba(41, 122, 255, 0.9);
          border-radius: 2px;
          color: #ffffff;
        }
        .tg-btn {
          margin-left: 20px;
        }
      }
    }
    .tilte-bar {
      font-size: 14px;
      color: var(--text-second-color);
      display: flex;
      align-items: center;
      .title {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-color);
      }
    }
  }

  .table-detail {
    position: sticky;
    top: 100px;
  }
}

/deep/ .commodity-box {
  display: flex;
  .pic-box {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
  }
  .info-box {
    flex: 1;
    .id-line {
      display: flex;
      justify-content: space-between;
      position: relative;
      .commodity-id {
        font-weight: 400;
        font-size: 12px;
        color: var(--text-color);
        line-height: 12px;
        margin-top: 6px;
      }
      .rank {
        width: 60px;
        height: 20px;
        position: absolute;
        right: 0;
        top: 0;
        line-height: 20px;
        background: #f04b4b;
        border-radius: 4px;
        text-align: center;
        color: #ffffff;
        font-weight: 600;
        font-size: 12px;
      }
    }
    .commodity-name {
      margin-top: 4px;
      font-size: 12px;
      height: 30px;
      line-height: 15px;
      display: -webkit-box;
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      cursor: pointer;
      color: var(--text-color);
      font-weight: 600;
      &:hover {
        color: var(--theme-color);
      }
    }
    .code {
      font-weight: 400;
      font-size: 12px;
      color: var(--text-color);
      line-height: 12px;
      margin-top: 8px;
    }
  }
}
/deep/ .item_count_rate_box {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  justify-content: center;
  align-items: center;
  & > span {
    padding: 0 2px;
    &:nth-child(2) {
      color: var(--text-third-color);
    }
  }
  .item_count {
    flex: 1;
    text-align: right;
    word-break: initial;
  }
  .item_count_rate {
    flex: 1;
    color: #2570f1;
    text-align: left;
  }
}
</style>
