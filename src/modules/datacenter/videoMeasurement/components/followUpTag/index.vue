<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-follow-up-status-tag {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-weight: 400;
  .follow-up-status {
    //height: 20px;
    line-height: 17px;
    border-radius: 10px;
    padding: 0 8px;
    &.not-follow-up {
      color: #ff7a36;
      background-color: #fff7f3;
      border: 1px solid #ffb894;
    }
    &.follow-up {
      color: var(--theme-color);
      background-color: #f2f7ff;
      border: 1px solid #8cb7ff;
    }
    &.lived {
      color: var(--success-color);
      background-color: #f0faf3;
      border: 1px solid #77d194;
    }
    &.not-live {
      color: var(--error-color);
      background-color: #fdf1f1;
      border: 1px solid #ffa5a5;
    }
  }
  .follow-up-edit {
    font-size: 14px;
    margin-left: 8px;
    color: var(--text-third-color);
    &:hover {
      color: var(--theme-color);
    }
  }
}
</style>
<style lang="less">
.tg-video-goods-follow-up-popover {
  width: 300px;
  .follow-up-content {
    .display-grid {
      display: grid;
      grid-template-columns: 144px 106px;
      row-gap: 4px;
      column-gap: 18px;
      .grid-tow-column {
        grid-column-end: span 2;
      }
    }
    .display-flex {
      display: flex;
    }
    .follow-up-field {
    }
    .feedback-field {
      margin-top: 18px;
    }
    .label {
      flex-shrink: 0;
      color: var(--text-third-color);
    }
    .value {
      color: var(--text-color);
    }
    .operator-info {
      margin-top: 2px;
    }
  }
  .data-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-loading {
      color: #888888;
      font-size: 16px;
    }
    span {
      margin-left: 6px;
      color: #5a5a5a;
    }
  }
}
</style>
