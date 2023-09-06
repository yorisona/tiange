<template>
  <div class="import-div">
    <div class="news-body">
      <div v-if="!readOnly">
        <!--        <el-upload
          action
          class="upload-btn-wrap"
          :show-file-list="false"
          :multiple="true"
          :http-request="uploadFileHandler"
          accept=".pdf,.jpg,.jpeg,.png"
          :disabled="form.settlement_scan_urls.length > 9"
        >-->
        <tg-upload
          :multiple="true"
          class="upload-btn-wrap"
          action="/api/resources/upload_file"
          :show-file-list="false"
          :data="{ type: 'settlement', storage: 2 }"
          :beforeUpload="beforeUpload"
          :success="successHandle"
        >
          <tg-button style="width: 100px; justify-content: center" icon="ico-btn-upload"
            >上传文件</tg-button
          >
        </tg-upload>
        <div class="icons-title">
          <p>支持：JPG、PNG、PDF, 单个文件不超过20M</p>
        </div>
      </div>
      <div v-if="form.settlement_scan_urls.length > 0" class="files-div">
        <FileItem
          v-for="(item, index) in form.settlement_scan_urls"
          :key="item"
          :showPreview="false"
          :filepath="item || ''"
          :readonly="readOnly"
          :showDown="readOnly"
          :isNameClick="true"
          @remove="handleRemoveFileClick(index)"
        />
      </div>
      <div class="reason-div" v-if="reason_str && !readOnly">审核意见：{{ reason_str }}</div>
    </div>
    <div class="form-footer">
      <tg-button @click="handleCloseAction">取消</tg-button>
      <tg-button v-if="!readOnly" type="primary" @click="handleSaveAction">保存</tg-button>
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
    .upload-btn-wrap {
      width: 100px;
      display: inline-block;
      margin: 16px 8px 0 20px;
    }
    .icons-title {
      display: inline-block;
      font-size: 12px;
      color: var(--text-third-color);
    }
    .files-div {
      margin: 10px 0 12px 20px;
      display: flex;
      flex-wrap: wrap;

      /deep/.tg-file-item {
        width: 180px;
        margin-top: 8px;
        margin-right: 16px;
        &:hover {
          color: var(--theme-color);
        }
        cursor: pointer;
        &:nth-child(2n) {
          margin-right: 0;
        }
        .ico-frm-delete {
          color: var(--border-line-color);
        }
      }
    }
    .reason-div {
      margin: 18px 18px 24px 20px;
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
