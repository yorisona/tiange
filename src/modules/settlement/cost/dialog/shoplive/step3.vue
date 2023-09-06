<template>
  <SettlementStep3Layout class="settlement-step3-shoplive" :amount="total_amount">
    <template #top>
      <top-card
        :amount="total_amount"
        :taxed="settlement.is_include_tax"
        :invoice_type="settlement.invoice_type"
        :name="settlement.company_name"
        type="value2"
        :tax_rate_disabled="true"
      ></top-card>
    </template>

    <!-- 抖音店播 佣金 -->
    <template #left>
      <CardLayout>
        <template #title>主播工资</template>
        <template #desc>
          <div style="cursor: pointer; line-height: 14px; height: 14px; margin-left: -6px">
            <el-popover
              :offset="130"
              popper-class="kol-tips-popper"
              placement="bottom"
              trigger="hover"
            >
              <div>
                <div style="color: var(--text-color); font-weight: 600">时薪工资</div>
                <div style="color: #6a7b92">主播工资 = 单价 * 时长</div>
                <div style="color: var(--text-color); font-weight: 600">底薪/提成（取高的）</div>
                <div style="color: #6a7b92">主播工资 = 底薪和（净销额）*提成比例取高的</div>
                <div style="color: var(--text-color); font-weight: 600">底薪+提成</div>
                <div style="color: #6a7b92">主播工资 = 底薪 + （净销额）*提成比例</div>
              </div>
              <template slot="reference">
                <tg-icon style="font-size: 14px" name="ico-question"></tg-icon>
              </template>
            </el-popover>
          </div>
        </template>
        <div>
          <div
            class="one-item-block"
            v-for="(item, index) in DataForm.kol_salary_infos"
            :key="index"
          >
            <div style="color: var(--text-color); height: 18px; line-height: 18px; display: flex">
              <div
                style="
                  font-weight: 600;
                  padding-right: 8px;
                  margin-left: 6px;
                  text-align: center;
                  display: inline-block;
                  font-size: 14px;
                "
              >
                {{ item.kol_name }}
              </div>
              <div style="display: inline-block">
                <div
                  style="
                    padding: 0 6px;
                    font-size: 12px;

                    color: #5e98ff;
                    background-color: #eef4ff;
                    border: 1px solid #5e98ff;
                    border-radius: 12px;
                  "
                >
                  {{ item.salary_type_str }}
                </div>
              </div>
            </div>
            <div class="one-block">
              <div class="label">实发工资：</div>
              <div>
                <span style="color: var(--text-color); font-weight: 600">
                  {{ item.real_salary_str }}</span
                ><br /><span style="color: #a4b2c2">{{ item.salary_description }}</span>
              </div>
            </div>
            <div class="one-block" v-if="item.adjust_info.length > 0">
              <div class="label">手工调账：</div>
              <div>
                <div
                  style="margin-bottom: 12px"
                  v-for="(adjustItem, seq) in item.adjust_info"
                  :key="seq"
                >
                  <div style="display: inline-block; width: 20px; text-align: center; padding: 0">
                    {{ seq + 1 }}.
                  </div>
                  <span style="color: var(--text-color)"
                    >调整金额： {{ formatAmountWithoutPrefix(adjustItem.adjust_amount) }}元</span
                  ><br /><span style="padding-left: 20px; color: #a4b2c2"
                    >调整原因：{{ adjustItem.adjust_reason }}</span
                  >
                </div>
              </div>
            </div>
            <div
              v-if="
                index + 1 < DataForm.kol_salary_infos.length &&
                DataForm.kol_salary_infos.length !== 0
              "
              style="
                border-bottom: 1px dashed rgba(164, 178, 194, 0.3);
                margin-top: 18px;
                margin-bottom: 18px;
              "
            ></div>
          </div>
        </div>
      </CardLayout>
    </template>
    <template #right>
      <CardLayout class="tg-files-container" :padding="[0, 0, 0, 0]">
        <template #title>文件</template>
        <div style="padding: 18px 0 12px 0; height: 187px; overflow-y: auto">
          <div class="file-block-content">
            <div style="height: 18px; font-size: 12px; color: #6a7b92">主播工资明细</div>
            <div style="margin-top: 12px; font-size: 14px; color: var(--text-color)">
              <div class="fileItem" v-if="kolSalaryDataUrl && kolSalaryDataUrl !== ''">
                <tg-icon
                  slot="icon"
                  name="ico-excel"
                  style="width: 20px; height: 20px; line-height: 20px"
                />
                <div
                  style="
                    margin-left: 2px;
                    margin-right: 12px;
                    height: 18px;
                    line-height: 20px;
                    width: 222px;
                  "
                  class="line-clamp-1"
                >
                  主播工资明细.xlsx
                </div>
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex"
                  type="link"
                  @click="downloadKolAPIFile(kolSalaryDataUrl, '主播工资明细.xlsx')"
                  >下载</tg-button
                >
              </div>
            </div>
          </div>
          <div class="file-block-content" style="margin-top: 18px">
            <div style="height: 18px; font-size: 12px; color: #6a7b92">主播排班信息</div>
            <div style="margin-top: 12px; font-size: 14px; color: var(--text-color)">
              <div class="fileItem" v-for="(item, index) in schedule_file_list" :key="index">
                <tg-icon
                  slot="icon"
                  name="ico-excel"
                  style="width: 20px; height: 20px; line-height: 20px"
                />
                <div
                  style="
                    margin-left: 2px;
                    margin-right: 12px;
                    height: 18px;
                    line-height: 20px;
                    width: 222px;
                  "
                  class="line-clamp-1"
                >
                  {{ item.name }}直播排班.xlsx
                </div>
                <tg-button
                  style="line-height: 20px; height: 18px; display: flex"
                  type="link"
                  @click="downloadKolAPIFile(item.url, `${item.name}直播排班.xlsx`)"
                  >下载</tg-button
                >
              </div>
            </div>
          </div>
        </div>
        <div style="border-bottom: 1px solid rgba(164, 178, 194, 0.3)"></div>
        <div class="file-block-content">
          <div class="statements-file-block" :style="readonly ? 'height: 130px;' : 'height: 180px'">
            <div class="statements-file" style="padding: 18px 0 12px 0">
              <div>
                <div class="title"><span style="color: red" v-if="!readonly">*</span>结算文件</div>
                <div
                  style="
                    display: flex;
                    line-height: 32px;
                    height: 32px;
                    width: 100%;
                    font-size: 14px;
                  "
                  v-if="!readonly"
                >
                  <el-upload
                    v-if="uploadedFileList.length < 50"
                    action="/"
                    accept=".docx,.pdf,.jpg,.jpeg,.xlsx,.png,.xls"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadFileHandler"
                  >
                    <tg-button size="small" icon="ico-btn-upload">上传文件</tg-button>
                  </el-upload>
                  <tg-button v-else size="small" :disabled="true" icon="ico-btn-upload"
                    >上传文件</tg-button
                  >
                  <div
                    style="
                      display: inline-block;
                      margin-left: 6px;
                      font-size: 12px;
                      width: 166px;
                      color: #a4b2c2;
                      height: 32px;
                      line-height: 16px;
                      font-weight: 400;
                    "
                  >
                    支持.docx .pdf .jpg .png .xlsx .xls(单个文件大小不超过30M)
                  </div>
                </div>
              </div>
              <div class="fileList" style="margin-top: 12px">
                <div class="fileItem" v-for="(item, index) in uploadedFileList" :key="index">
                  <FileItem
                    :key="index"
                    :filepath="item.path"
                    @remove="handleRemoveFileClick(index)"
                    :readonly="readonly"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </template>
    <template #button v-if="!readonly">
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">提交</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep3Layout>
</template>

<script src="./step3.ts"></script>

<style lang="less">
.settlement-step3-shoplive {
  .one-item-block {
    .one-block {
      display: flex;
      margin-top: 18px;
      .label {
        display: inline-block;
        width: 76px;
        color: #6a7b92;
        font-size: 14px;
        text-align: right;
      }
    }
  }

  .tg-files-container {
    height: 412px;

    .file-block-content .fileItem:nth-child(n + 2) {
      margin-top: 14px;
    }

    .file-block-content {
      padding: 0 0 0 18px;
      min-width: 620px;
      .fileItem {
        color: var(--text-color);
        font-size: 14px;
        color: var(--text-color);
        text-align: left;
        line-height: 20px;
        height: 20px;
        font-weight: 400;

        display: flex;
        svg {
          float: left;
          width: 16px;
          line-height: 20px;
          height: 16px;
        }
        div {
          float: left;
          padding: 0;
          margin: 0;
        }
      }
    }
  }

  .statements-file-block {
    width: 100%;
    display: flex;
    font-size: 14px;
    color: #6a7b92;
    font-weight: 400;
    overflow-y: auto;

    .statements-file {
      flex: 1;
      .title {
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        margin-bottom: 6px;
        color: var(--text-second-color);
      }
    }

    .fileList {
      margin-top: 12px;

      .fileItem {
        color: var(--text-color);
        font-size: 14px;
        color: var(--text-color);
        text-align: left;
        line-height: 20px;
        height: 20px;
        font-weight: 400;
        flex-shrink: 0;
        display: flex;
        margin-bottom: 12px;

        &:hover {
          .file-delete-icon {
            visibility: visible;
          }
        }

        .file-delete-icon {
          padding-top: 2px;
          line-height: 20px;
          height: 20px;
          visibility: hidden;
        }

        svg {
          float: left;
          height: 16px;
          width: 16px;
          line-height: 20px;
          display: flex;
        }
        div {
          float: left;
          padding: 0;
          margin: 0;
        }
      }
      .tg-btn.tg-btn-default svg.icon {
        color: #6a7b92;
        height: 16px;
      }
    }
  }

  .header {
    width: 100%;
    height: 40px;
    text-indent: 18px;
    background: rgba(164, 178, 194, 0.09);
    line-height: 40px;

    .label {
      color: var(--text-color);
      font-weight: 600;
    }
    .desc {
      font-size: 12px;
      color: #a4b2c2;
      padding-left: 12px;
    }
  }
}

.el-popover.kol-tips-popper {
  line-height: 24px;
  font-size: 12px;
  padding: 10px 18px 8px 18px;
}
</style>
