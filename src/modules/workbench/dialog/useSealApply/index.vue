<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-12 09:51:42
-->
<script src="./index.tsx"></script>
<style lang="less">
.workbench-use-seal-dialog {
  .el-form {
    padding: 18px 18px;
    height: 475px;
    overflow: overlay;
    .grid-three-column {
      display: grid;
      grid-template-columns: repeat(3, 216px);
    }
    .grid-three-area {
      display: grid;
      grid-template-columns: repeat(3, 216px);
      // grid-template-columns: 216px 216px 216px;
      grid-template-rows: auto;
      grid-template-areas:
        'one two three'
        'four four four'
        'five six seven';
    }
    .el-form-item {
      .el-form-item__label {
        height: 16px !important;
        line-height: 16px !important;
        padding: 0;
        margin-bottom: 4px;
        font-size: 12px;
      }
      .el-select {
        width: 100%;
      }
      .el-textarea .el-textarea__inner {
        height: 48px;
      }
      .el-date-editor {
        width: 100%;
        .el-range__close-icon {
          display: none;
        }
        .el-range-input {
          width: 44%;
        }
        .el-range-separator {
          width: 12%;
          min-width: 20px;
        }
      }
    }
    .grid-one {
      grid-area: one;
    }
    .grid-two {
      grid-area: two;
    }
    .grid-three {
      grid-area: three;
    }
    .grid-four {
      grid-area: four;
    }
    .grid-five {
      grid-area: five;
    }
  }
  .upload-box {
    display: flex;
    align-items: center;
    .update-desc {
      padding-left: 12px;
      color: var(--text-third-color);
      font-size: 12px;
      line-height: 22px;
    }
  }
  .file-list-box {
    .upload-file-list {
      display: grid;
      grid-template-columns: repeat(3, 198px);
      column-gap: 18px;
      .file-item .file-name {
        flex: 0 0 auto;
        max-width: 175px;
      }
    }
  }
}
</style>
