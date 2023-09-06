<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-21 14:55:51
-->

<script src="./index.tsx"></script>
<style lang="less">
.data-center-page-container {
  padding: 0 18px;

  .data-center-switch {
    padding: 20px 16px 18px;
    border-bottom: 1px solid #e5e5e5;
    .tg-btn-link {
      color: var(--text-second-color);
      font-size: var(--small-font-size);
      &[selected] {
        font-weight: 600;
        color: var(--theme-color);
      }
    }
    .line-ver {
      color: var(--border-line-color);
    }
  }
  .data-center-operation {
    padding: 14px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .data-center-operation-date {
      display: flex;
      align-items: center;
    }
    .data-center-operation-update-date-desc {
      color: var(--text-third-color);
      font-size: 12px;
      margin-right: 8px;
    }
    .tg-btn-link {
      width: 28px;
      height: 28px;
      border-radius: 14px;
      border: 1px solid #e3e8ec;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      .icon {
        font-size: 16px;
        color: var(--text-color);
      }
      &:not([disabled]):hover {
        .icon {
          color: var(--theme-color);
        }
        border-color: var(--theme-color);
      }
      &[disabled] {
        .icon {
          color: var(--text-third-color);
          &:hover {
            color: var(--text-third-color) !important;
          }
        }
      }
    }
    .data-center-date {
      font-size: 16px;
      //font-weight: 600;
      color: var(--text-color);
    }
  }
  .data-center-template {
    padding-bottom: 32px;
    height: calc(100% - 59px - 56px);
  }
}
</style>
