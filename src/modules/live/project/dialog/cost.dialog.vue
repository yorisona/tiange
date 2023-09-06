<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-03-10 16:05:13
-->
<script src="././cost.dialog.tsx"></script>
<style lang="less">
.cost-dialog-achievement-container {
  padding: 24px;
  overflow-y: auto;
  line-height: 1;
  .el-form {
    display: grid;
    row-gap: 18px;
    .el-form-item {
      margin: 0;
      .el-form-item__label {
        color: var(--text-second-color);
        line-height: 16px;
        padding: 0;
        margin-bottom: 6px;
        font-size: 12px;
      }
    }
  }

  .form-block-header {
    font-weight: 600;
    margin-bottom: 10px;
  }

  // /deep/ .el-form-item {
  //   margin-bottom: 16px;

  //   &:last-child {
  //     margin-bottom: 0;

  //     .el-form-item__error {
  //       padding-top: 1px;
  //     }
  //   }

  //   .el-select {
  //     display: block;
  //   }
  // }
  .radio-form-item-children {
    border-radius: 4px;
    margin-left: 78px;
    background: #f6f6f6;
    padding: 16px;
    margin-bottom: 16px;
  }

  .upload-operation {
    display: grid;
    grid-template-columns: repeat(2, max-content);
  }
  .uploaded-list {
    margin-top: 10px;
    display: grid;
    .upload-item {
      display: grid;
      grid-template-columns: repeat(3, max-content);
      align-items: center;
      grid-column-gap: 4px;
      .clear-uploaded-file {
        cursor: pointer;
      }
      span {
        color: var(--theme-color);
      }
      img {
        width: 14px;
        height: 14px;
      }
    }
  }
}

.cost-dialog-achievement-container {
  .mgb0 {
    margin-bottom: 0;
  }
}
</style>
