<template>
  <div class="import-div">
    <div class="news-body">
      <div v-if="form.settlement_scan_urls.length > 0" class="files-div">
        <FileItem
          v-for="(item, index) in form.settlement_scan_urls"
          :key="item"
          :showPreview="false"
          :filepath="item || ''"
          :readonly="true"
          :showDown="true"
          :isNameClick="true"
          @remove="handleRemoveFileClick(index)"
        />
      </div>
      <div v-if="!readOnly" class="reason-div">
        <el-input
          placeholder="请输入审核意见，限30字"
          type="textarea"
          maxlength="30"
          show-word-limit
          v-model="form.audit_message"
        />
      </div>
      <div class="reason-div" v-if="readOnly && form.audit_message">
        <span style="color: var(--text-third-color)">审核意见</span>：{{ form.audit_message }}
      </div>
    </div>
    <div v-if="!readOnly" class="form-footer">
      <tg-button v-if="!readOnly" type="primary" @click="handleAuditAction(2)">通过</tg-button>
      <tg-button @click="handleAuditAction(3)">驳回</tg-button>
      <tg-button @click="handleCloseAction">取消</tg-button>
    </div>
    <div v-if="readOnly" class="form-footer">
      <tg-button @click="handleCloseAction">取消</tg-button>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less" scoped>
.import-div {
  display: flex;
  flex-direction: column;
  .news-body {
    flex: 1;
    max-height: 380px;
    min-height: 200px;
    overflow-y: auto;
    overflow-y: overlay;
    margin-top: 4px;
    /deep/.el-textarea {
      height: 60px;
      font-size: 12px;
      .el-textarea__inner {
        height: 60px;
      }
    }
    .files-div {
      margin: 10px 0 12px 20px;
      display: flex;
      flex-wrap: wrap;
      /deep/.tg-file-item {
        width: 176px;
        margin-top: 8px;
        margin-right: 16px;
        &:hover {
          color: var(--theme-color);
        }
        cursor: pointer;
        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
    .reason-div {
      margin: 18px 22px 24px 22px;
      color: var(--text-color);
    }
    /deep/ .el-input {
      width: 180px;
    }

    /deep/ .el-input__icon {
      &.el-icon-delete {
        margin-left: 6px;
        color: var(--text-third-color);
      }

      &:hover {
        color: rgba(var(--theme-rgb-color), 0.9);
      }
    }

    .download {
      color: var(--text-color);
      font-size: 12px;

      .ico-xiazai {
        margin-left: 6px;
        color: var(--text-second-color);
      }

      &:hover {
        .ico-xiazai {
          color: rgba(var(--theme-rgb-color), 0.9);
        }
      }
    }
  }
  .form-footer {
    height: 50px;
    display: flex;
    justify-content: center;
    padding: 12px 0;
    background-color: #f4f8ff;
    button {
      margin-right: 12px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
