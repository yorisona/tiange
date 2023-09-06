<script src="./index.tsx"></script>
<style lang="less" scoped>
.design-card {
  box-sizing: border-box;
  width: 225px;
  height: 255px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 13px 12px 0 12px;
  user-select: none;
  position: relative;
  .card-corner-mark {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #ff4545;
    top: -6px;
    right: -6px;
    border-radius: 12px;
  }
  &.design-card-await {
    background: #e6e6e6;
    color: #666666;
    .line {
      span:nth-child(1) {
        color: #666666;
      }
    }
    .card-title {
      &:after {
        background: #e6e6e6;
      }
    }
  }
  .card-title {
    border-bottom: solid 1px #cccccc;
    font-weight: 600;
    font-size: 17px;
    height: 58px;
    position: relative;
    line-height: 24px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    word-break: break-all;
    &:after {
      content: ' ';
      position: absolute;
      width: 100%;
      height: 8px;
      background: #ffffff;
      left: 0;
      bottom: 0;
    }

    .level {
      position: absolute;
      left: 0;
      top: 3px;
      width: 28px;
      height: 18px;
      text-indent: 0px;
      overflow: hidden;
      line-height: 18px;
      font-size: 13px;
      text-align: center;
      border-radius: 4px;
      background-color: #dbddde;
      color: #ffffff;
      &.level-empty {
        color: var(--text-third-color);
      }
    }
    .level-text {
      padding-left: 34px;
    }
  }
  .card-body {
    flex: 1;
    padding-top: 10px;
    .red {
      color: #d70000;
      .level-label {
        color: #d70000 !important;
      }
    }

    .blue {
      color: var(--theme-color);
      .level-label {
        color: var(--theme-color) !important;
      }
    }
  }
  .overflowHidden {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .line {
    line-height: 24px;
    font-size: 14px;
    span:nth-child(1) {
      color: #323233;
      font-weight: 600;
      margin-right: 6px;
    }
  }
  .card-footer {
    height: 67px;
    border-top: solid 1px #cccccc;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .status {
      display: inline-block;
      height: 20px;
      padding: 0 6px;
      line-height: 20px;
      background: #f5f7f8;
      color: var(--text-third-color);
      font-size: 12px;
      border-radius: 10px;
    }
    .status-0 {
      color: var(--text-third-color);
      background: #f5f7f8;
    }
    .status-1 {
      background: #fff7f3;
      color: #ff7a36;
    }
    .status-2 {
      background: #f2f7ff;
      color: var(--theme-color);
    }
    .status-3 {
      background: #f0faf3;
      color: var(--success-color);
    }
    .status-4 {
      background: #fdf1f1;
      color: var(--error-color);
    }
    .status-5 {
      background: #d1d1d1;
      color: #747474;
    }
    .status-6 {
      background: #f0faf3;
      color: var(--success-color);
    }
    .status-7 {
      background: #ffffff;
      color: var(--theme-color);
    }
    .status-overdue {
      background: #fdf1f1;
      color: var(--error-color);
      margin-left: 8px;
    }
  }

  .flex-row {
    display: flex;
    align-items: center;
  }
  .empty {
    flex: 1 1 0;
  }
  &:not(.design-card-await) {
    .icon-delete {
      display: none;
    }
  }
  .icon-delete {
    justify-self: flex-end;
    width: 24px;
    height: 24px;
    background-color: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c1c1c1;
    &:hover {
      svg {
        color: #2570f1 !important;
      }
    }
  }
}
</style>
