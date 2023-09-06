<!--
 * @Author: 肖槿
 * @Date: 2021-11-10 16:52:24
 * @Description: 添加模特
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-11-10 20:28:37
 * @FilePath: \goumee-star-frontend\src\modules\supplier\components\addModelDialog\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less">
.add-model-dialog {
  & .model-body {
    padding: 24px;
  }
  & .upload-tip {
    position: absolute;
    width: 300px;
    color: var(--text-third-color);
    font-size: 12px;
    top: 158px;
    left: 73px;
  }
  & .add-model-item {
    width: 260px;

    & .el-input {
      width: 210px;
    }
  }
  .el-form--inline .el-form-item:nth-child(even) {
    margin-right: 0;
  }
  .el-form--inline .el-form-item:nth-child(odd) {
    margin-right: 24px;
  }
  .upload-btn {
    width: 90px;
    height: 90px;
    border: dashed 1px rgba(164, 178, 194, 0.5);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i {
      font-size: 28px;
      width: 28px;
      height: 28px;
      display: block;
      margin-bottom: -12px;
    }
    span {
      margin-top: 10px;
      line-height: 20px;
    }
    font-size: 12px;
    color: var(--text-third-color);
  }
  .file-wrapper {
    width: 90px;
    height: 90px;
    position: relative;

    .file {
      width: 90px;
      height: 90px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      border: 1px solid #d2d9e1;

      img {
        width: 100%;
      }
    }
    .icon {
      position: absolute;
      right: -7px;
      top: -7px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      font-size: 16px;
      color: #d1d8e0;
      border-radius: 50%;
      background-color: #fff;

      &:hover {
        color: #f04b4b !important;
      }
    }
  }
  .picture-list {
    display: grid;
    column-gap: 18px;
    row-gap: 18px;
    grid-template-columns: repeat(5, 1fr);
    margin: 4px 0 0 12px;
  }
}
</style>
