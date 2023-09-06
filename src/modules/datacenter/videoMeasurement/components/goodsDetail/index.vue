<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-goods-detail-container {
  font-size: 12px;
  // padding-bottom: 13px;
  // border-bottom: 1px solid #e5e5e5;
  // margin-top: 12px;
  &:first-of-type {
    margin-top: 0;
  }
  .goods-item-info {
    display: flex;
    /deep/ .goods-img {
      width: 70px;
      height: 70px;
      border-radius: 2px;
      // background: orange;
      .el-image__error {
        font-size: 12px;
      }
    }
    .goods-detail {
      margin-left: 10px;
      width: 256px;
      .goods-name {
        height: 18px;
        font-weight: 600;
        display: flex;
        align-items: center;
        > .tag {
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
      .goods-desc {
        margin-top: 6px;
        height: 18px;
        color: var(--text-third-color);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 6px;
      }
      .goods-sale-time {
        margin-top: 6px;
        height: 18px;
        color: var(--text-third-color);
      }
      .no-detail-project-name,
      .no-detail-goods-no {
        color: var(--text-second-color);
      }
      .no-detail-project-name {
        margin-top: 2px;
      }
    }
  }
  .goods-item-grid {
    margin-top: 12px;
    display: grid;
    row-gap: 2px;
    // grid-template-columns: 124px 88px 87px;
    grid-template-columns: 124px 100px 97px;
    column-gap: 6px;
  }
  .no-detail-desc {
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c1c1c1;
  }
}
</style>
<style lang="less">
.video-measurement-goods-detail-component-popover {
  max-width: 360px !important;
}
</style>
