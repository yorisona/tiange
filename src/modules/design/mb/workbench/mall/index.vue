<script src="./index.tsx"></script>
<style lang="less" scoped>
.mall-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
  .top-bar {
    height: 52px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    margin-top: 1px;
    margin-bottom: 10px;
    font-size: var(--small-font-size);
    .left {
      display: flex;
      align-items: center;
      line-height: 19px;
      .des {
      }
    }
    .right {
      .label {
        color: var(--text-third-color);
        svg,
        svg:hover {
          color: #ffb703;
          margin-right: 4px;
        }
        b {
          font-weight: normal;
          color: var(--text-color);
        }
      }
      .view-detail {
        color: var(--theme-color);
        margin-left: 12px;
        cursor: pointer;
      }
    }
  }
  .context {
    background-color: #ffffff;
    overflow: auto;
    padding-bottom: 28px;
    .goods {
      display: grid;
      grid-template-columns: repeat(auto-fill, 228px);
      .good {
        cursor: pointer;
        padding: 28px 24px 24px 24px;
        display: flex;
        flex-direction: column;
        &:hover {
          box-shadow: 0 2px 12px 0 rgba(231, 231, 231, 0.8);
        }
        img {
          display: block;
          width: 180px;
          height: 180px;
        }
        .good-name {
          font-size: 14px;
          color: var(--text-color);
          letter-spacing: -0.1px;
          line-height: 17px;
          margin: 6px 0;
          overflow: hidden;
          white-space: nowrap;
          height: 17px;
          text-overflow: ellipsis;
        }
        .good-desc {
          font-size: 12px;
          color: var(--text-third-color);
          letter-spacing: 0;
          line-height: 17px;
          overflow: hidden;
          white-space: nowrap;
          height: 17px;
          text-overflow: ellipsis;
        }
        /deep/.good-mb {
          margin-top: 10px;
          font-size: 16px;
          color: var(--text-color);
          svg {
            color: #ffb703;
            margin-right: 6px;
          }
        }
        .exchange {
          padding-top: 14px;
        }
      }
    }
  }
  .pagination {
    padding: 0 18px;
    margin-top: 1px;
    background-color: #ffffff;
  }
}
</style>
