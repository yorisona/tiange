<template>
  <div>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      width="450px"
      :visible="visiable"
      append-to-body
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>分摊费用数据导入</template>
      <div class="news-body">
        <div class="header-title">
          <tg-icon name="ico-warn"></tg-icon>项目房租基于项目人数自动分摊，请在当月人力成本之后导入
        </div>
        <el-form size="mini" :model="form" label-width="86px" ref="formRef">
          <!--<el-form-item label="费用类别：" class="flex-form-item">
            <el-select
              v-model="form.cost_pay_type"
              class="select"
              placeholder="请选择"
              style="width: 192px"
            >
              <el-option label="人力成本" :value="1" />
              <el-option label="其它费用" :value="2" />
            </el-select>
          </el-form-item>-->
          <el-form-item label="上传文件：" style="margin-bottom: 12px">
            <el-upload
              action
              :disabled="form.file_name ? true : false"
              class="upload-btn-wrap"
              :show-file-list="false"
              :multiple="false"
              :http-request="uploadFileHandler"
              accept=".xlsx"
            >
              <tg-button
                :disabled="form.file_name ? true : false"
                style="width: 160px; justify-content: center"
                icon="ico-btn-upload"
                >上传文件</tg-button
              >
            </el-upload>
          </el-form-item>
          <div
            v-if="form.file_name"
            style="margin-left: 85px; width: 300px; margin-top: -5px; margin-bottom: 12px"
          >
            <FileItem
              :showPreview="false"
              :filepath="form.file_name"
              :readonly="false"
              :showDown="false"
              @remove="handleRemoveFileClick()"
            />
          </div>
          <el-form-item label="导入模板：" class="flex-form-item">
            <div class="example-div">
              <p>
                <a
                  class="download"
                  target="_blank"
                  href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/allocated_manpower_template.xlsx"
                  download
                >
                  人力成本导入<tg-icon name="ico-xiazai" style="font-size: 14px"></tg-icon
                ></a>
              </p>
              <p>
                <a
                  class="download"
                  target="_blank"
                  href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/allocated_rent_template.xlsx"
                  download
                  >房租成本导入<tg-icon name="ico-xiazai" style="font-size: 14px"></tg-icon
                ></a>
              </p>
              <p>
                <a
                  class="download"
                  target="_blank"
                  href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/allocated_other_template_20230724.xlsx"
                  download
                  >其它费用导入<tg-icon name="ico-xiazai" style="font-size: 14px"></tg-icon
                ></a>
              </p>
            </div>
          </el-form-item>
          <el-form-item
            v-if="exportErrorTip"
            label="导入失败："
            class="flex-form-item export-error-item"
          >
            <div class="exprot-error-msg">{{ exportErrorTip }}</div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./costImport.ts"></script>
<style lang="less" scoped>
.news-body {
  max-height: 500px;
  overflow: overlay;
  background: white;
  .header-title {
    height: 40px;
    background: rgba(255, 122, 54, 0.06);
    width: 100%;
    font-size: 12px;
    color: #ff7a36;
    line-height: 40px;
    padding: 0 20px;
    /deep/ .ico-warn {
      width: 20px;
      font-size: 16px;
      top: -1px;
      color: #ff7a36;
      height: 20px;
      margin-top: -3px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  /deep/.el-input {
    width: 180px;
  }
  /deep/ .el-form {
    margin-top: 18px;
    .export-error-item {
      .el-form-item__label {
        height: auto;
        line-height: 1.5;
      }
      .el-form-item__content {
        line-height: 1.5;
        color: var(--error-color);
        .exprot-error-msg {
          white-space: pre-line;
          word-break: break-all;
        }
      }
    }
    .flex-form-item {
      margin-right: 24px;
      margin-bottom: 18px;
    }
    .example-div {
      display: flex;
      justify-content: space-between;
      line-height: 28px;
    }
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
</style>
