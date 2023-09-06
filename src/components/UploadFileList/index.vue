<!--
 * @Author: 肖槿
 * @Date: 2021-08-13 17:51:42
 * @Description: style
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-08-16 16:38:13
 * @FilePath: \goumee-star-frontend\src\modules\supplier\playerManager\common\UploadFileList\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.upload-file-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &.column-3 {
    margin-top: 10px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    .file-item {
      width: 320px;
      margin-bottom: 10px;
      .file-name {
        flex: none;
        max-width: 280px;
      }
    }
  }
  &.column-2 {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    /deep/ .file-item {
      width: 360px;
      .file-name {
        flex: none;
        max-width: 300px;
      }
    }
  }
  .file-item {
    display: flex;
    align-items: center;
    row-gap: 14px;
    color: var(--text-color);
    cursor: default;
    /*&:hover {*/
    /*  color: var(--theme-color);*/
    /*  .icon-delete {*/
    /*    color: #f04b4b !important;*/
    /*  }*/
    /*}*/
    /*新版规则，咱也不知道为啥，要问UI*/
    .icon-delete {
      &:hover {
        color: #f04b4b !important;
      }
    }
    svg {
      width: 16px;
      height: 16px;
      margin-top: 2px;
      flex: 0 0 auto;
      fill: currentColor;
      &:nth-child(1) {
        height: 16px;
      }
    }
    .file-name {
      padding: 0 6px 0 4px;
      overflow: hidden;
      flex: 1;
      font-size: 12px;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--text-color);
    }

    .icon-delete {
      width: 16px;
      height: 16px;
      margin-top: 3px;
      cursor: pointer;
      color: #d1d8e0;
    }
  }
  &.upload-file-list-inline {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    & .file-item {
      display: inline-block;
      & svg {
        vertical-align: middle;
      }
      & p {
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
}
</style>
