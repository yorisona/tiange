<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-page-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  .sort-box {
    display: flex;
    align-items: center;
    padding: 0 18px;
    margin-bottom: 12px;

    .label {
      color: var(--text-second-color);
    }
    .sort {
      display: flex;
      align-items: center;
      border: solid 1px var(--table-border-color);
      background-color: #f9fcff;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        height: 34px;
        border-color: transparent;
        border-width: 0 1px;
        border-style: solid;
        cursor: pointer;
        margin-left: -1px;
        &:last-child {
          margin-right: -1px;
        }

        &.true {
          background-color: #ffffff;
          color: var(--theme-color);
          cursor: default;
          border-color: var(--table-border-color);
        }
      }
    }
  }
  .tg-page-body {
    flex: 1 1 0;
    overflow: auto;
    padding: 0 16px;
    .grid-card {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(298px, 1fr));
      grid-template-rows: repeat(auto-fill, minmax(271px, 1fr));
      grid-gap: 12px;
    }
  }
}

scroll {
  display: block;
  overflow-y: auto;
  max-height: 250px;
  padding-right: 16px;
  margin-right: -16px;
  margin-left: -16px;
  padding-left: 18px;
}

/** 推荐卡片 **/
card {
  height: 271px;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 23px 12px 12px;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: minmax(0, 1fr) 18px;
  position: relative;

  grid-row-gap: 12px;
  grid-column-gap: 12px;
  border: solid 1px var(--table-border-color);
  overflow: hidden;

  &.index-1 {
    good-box {
      transform: translateX(-100%);
    }
    switching {
      transform: rotate(180deg);
    }
  }

  card-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 44px;
    grid-column-gap: 2px;
    background: #f7f7f7;
    padding: 6px;
    grid-column-end: span 2;
    cursor: default;
    border-radius: 4px;
    summary {
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 44px;
      &.true {
        background: #dfeaff;
      }
      span {
        &:nth-child(1) {
          color: var(--text-color);
          font-size: 16px;
        }
        &:nth-child(2) {
          color: var(--text-third-color);
        }
        &.yellow {
          color: #fb8500;
        }
        &.green {
          color: #20bf55;
        }
        b {
          font-size: 12px;
        }
      }
    }
  }

  subscript {
    position: absolute;
    left: 0;
    top: 0;
    color: #2877ff;
    padding: 0px 4px;
    background: #e3ecfa;
    border-radius: 3px 0 3px 0;
    height: 16px;
    line-height: 16px;
    &.recommend {
      color: #fb8500;
      background: #ffe9d8;
    }
  }

  &.disabled {
    switching {
      display: none;
    }
  }
  scroll-box {
    overflow: hidden;
    good-box {
      display: grid;
      grid-template-rows: repeat(2, minmax(0, 1fr));
      grid-template-columns: repeat(2, 100%);
      grid-row-gap: 8px;
      grid-auto-flow: column;
      transition: transform 1s;
      transform: translateX(0);

      good {
        background-color: #ffffff;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        grid-template-rows: 36px repeat(2, 18px) auto;
        grid-column-gap: 8px;
        .good-img {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          grid-row-end: span 4;
          object-fit: cover;
          background: #f3faff;
        }
        .title {
          padding-bottom: 4px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .label {
          color: var(--text-third-color);
        }
      }
    }
  }

  switching {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
    background-color: #f6f6f6;
    color: #888888;
    &:hover {
      background: #e7f4ff;
      color: #2877ff;
      svg {
        color: #2877ff !important;
      }
    }
  }
}

/** 悬浮卡片 **/
popover-card {
  --pop-card-left: 14px;
  border-left: solid 1px #d8d8d8;
  padding-left: var(--pop-card-left);
  display: block;
  min-width: 374px;

  popover-card-item {
    display: grid;
    grid-row-gap: 6px;
    margin-bottom: 12px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      background: #d1e2ff;
      display: block;
      left: calc(0px - var(--pop-card-left) - 6px);
      top: 0;
      border-radius: 12px;
    }
    &:after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      background: #2877ff;
      display: block;
      left: calc(0px - var(--pop-card-left) - 3px);
      top: 3px;
      border-radius: 12px;
    }
    &:last-of-type {
      margin-bottom: 0;
    }

    .title {
      font-weight: 600;
    }

    .info-box {
      display: grid;
      background: #f5f9ff;
      border-radius: 2px;
      padding: 8px;
      grid-gap: 2px 10px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      color: var(--text-third-color);
      b {
        color: var(--text-color);
        font-weight: normal;
      }
    }
  }
}
</style>
