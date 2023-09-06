<template>
  <div class="tg-live-display-dialog-data-input tg-dialog-vcenter">
    <el-dialog
      class="tg-dialog-classic tg-live-display-form-dialog"
      :visible="visible"
      width="440px"
      top="15vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="onCancelBtnClick"
    >
      <template #title>
        <span>直播数据录入</span>
      </template>
      <div class="dialog-content">
        <el-alert
          style="padding: 10px 21px"
          :closable="false"
          type="warning"
          title="注意：此数据将用于和客户之间的结算，请确保数据准确"
          show-icon
        >
        </el-alert>
        <el-form
          label-position="top"
          size="small"
          @submit.native.prevent
          label-width="106px"
          :rules="DisplayDataFormRules"
          :model="DisplayDataForm"
          ref="formRef"
        >
          <el-form-item label="直播开始时间" prop="real_start_time">
            <el-date-picker
              v-model="DateTimeField.start_date"
              style="width: 187px"
              type="date"
              placeholder="开始日期"
            >
            </el-date-picker>
            <el-time-select
              v-model="DateTimeField.start_time"
              style="width: 187px; margin-left: 18px"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:30',
              }"
              placeholder="开始时间"
            >
            </el-time-select>
          </el-form-item>
          <!-- 结束时间 -->
          <el-form-item label="直播结束时间" prop="real_end_time">
            <el-date-picker
              v-model="DateTimeField.end_date"
              style="width: 187px"
              type="date"
              placeholder="结束日期"
            >
            </el-date-picker>
            <el-time-select
              v-model="DateTimeField.end_time"
              style="width: 187px; margin-left: 18px"
              :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '23:30',
              }"
              placeholder="结束时间"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item label="直播时长" prop="real_duration">
            <el-input
              v-model="DisplayDataForm.real_duration"
              :maxlength="4"
              disabled="disabled"
              @input="inputPositiveInteger"
              placeholder="请输入直播时长"
            >
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="直播链接">
            <el-input
              v-model="DisplayDataForm.live_url"
              :maxlength="180"
              placeholder="请输入直播链接"
            />
          </el-form-item>
          <div class="upload-flex-container">
            <el-form-item label="直播时长截图">
              <div style="position: relative; width: 90px; height: 90px; display: inline-block">
                <el-upload
                  action
                  :http-request="uploadDisplayTimeImage"
                  class="img-uploader"
                  accept=".jpeg,.jpg,.png"
                  :multiple="false"
                  :show-file-list="false"
                >
                  <div style="width: 90px; padding: 4px; height: 90px">
                    <img
                      v-if="DisplayDataForm.duration_screenshot"
                      :src="DisplayTimeImageUrl"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus img-uploader-icon"></i>
                    <div
                      style="
                        margin-top: 46px;
                        color: var(--text-des-color);
                        font-size: 12px;
                        line-height: 17px;
                      "
                    >
                      上传图片
                    </div>
                  </div>
                </el-upload>
                <tg-icon
                  v-if="DisplayDataForm.duration_screenshot"
                  @click="removeDurationScreenshot"
                  name="ico-cross-sm"
                  hover-name="ico-cross-red-sm"
                  style="
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    cursor: pointer;
                  "
                />
              </div>
              <div
                style="
                  margin-left: 6px;
                  line-height: 16px;
                  font-size: 12px;
                  display: inline-block;
                  color: #cccccc;
                  position: absolute;
                  bottom: 9px;
                "
              >
                大小不超过2M
              </div>
            </el-form-item>
            <el-form-item label="直播数据截图">
              <div style="position: relative; width: 90px; height: 90px; display: inline-block">
                <el-upload
                  action
                  :http-request="uploadDisplayDataImage"
                  class="img-uploader"
                  :multiple="false"
                  accept=".jpeg,.jpg,.png"
                  :show-file-list="false"
                >
                  <div style="width: 90px; padding: 4px; height: 90px">
                    <img
                      v-if="DisplayDataForm.data_screenshot"
                      :src="DisplayDataImageUrl"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus img-uploader-icon"></i>
                    <div
                      style="
                        margin-top: 46px;
                        color: var(--text-des-color);
                        font-size: 12px;
                        line-height: 17px;
                      "
                    >
                      上传图片
                    </div>
                  </div>
                </el-upload>
                <tg-icon
                  v-if="DisplayDataForm.data_screenshot"
                  name="ico-cross-sm"
                  hover-name="ico-cross-red-sm"
                  @click="removeDataScreenshot"
                  style="
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    cursor: pointer;
                  "
                />
              </div>
              <div
                style="
                  margin-left: 6px;
                  line-height: 16px;
                  font-size: 12px;
                  display: inline-block;
                  color: #cccccc;
                  position: absolute;
                  bottom: 9px;
                "
              >
                大小不超过2M
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onCancelBtnClick">取消</tg-button>
        <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
      </template>
    </el-dialog>
  </div>
</template>
<script src="./live.datainput.dialog.ts"></script>

<style lang="less">
@import './display.form.less';
.tg-live-display-dialog-data-input {
  .tg-live-display-form-dialog {
    .el-dialog__body {
      overflow: overlay;
    }
    .el-form {
      margin: 6px 24px 12px 24px;
      .el-form-item {
        margin-bottom: 0;
        .el-form-item__label {
          padding: 0;
          margin-top: 18px;
          line-height: 16px;
          font-size: 12px;
        }
        .el-form-item__content {
          margin-top: 6px;
        }
      }
    }
  }

  .img-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 90px;
    height: 90px;
    line-height: 60px;
    display: block;
    margin: 0;
  }
  .img-uploader:hover {
    border-color: #409eff;
  }
  .img-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    top: 20px;
    left: 35px;
    position: absolute;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
    object-fit: cover;
  }
  img {
    border-radius: 4px;
  }
  .upload-flex-container {
    display: flex;
    > .el-form-item {
      flex: 1 1;
    }
  }
}
</style>
