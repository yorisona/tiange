<template>
  <SettlementStep3Layout
    class="tg-cost-mcn-vtask-step3-after-container"
    :class="settlement.is_estimate === 1 ? 'is_estimate' : ''"
  >
    <template #top>
      <top-card
        :amount="total_amount"
        :taxed="DataForm.is_include_tax"
        :invoice_type="DataForm.invoice_type"
        :tax_rate="DataForm.tax_rate"
        :name="DataForm.company_name"
        name_desc="供应商："
        type="value2"
      ></top-card>
    </template>

    <template #left>
      <CardLayout>
        <template #title>成本信息</template>
        <!-- <template #desc>结算金额 = 机构成本 + 手工调账</template> -->
        <div>
          <div style="display: inline-block">
            <!-- <div class="one-block" style="margin-top: 0; margin-left: 7px">
              <div style="font-weight: 600; color: var(--text-color)">{{ DataForm.company_name }}</div>
            </div> -->
            <div class="one-block">
              <div class="label">结算金额：</div>
              <div style="width: 608px">
                <span style="color: var(--text-color); font-weight: 600">
                  {{ formatAmountStr(settlement.total_settle_amount) }} 元
                </span>
                <!-- <br /><span style="color: #a4b2c2">{{ DataForm.spend_description }}</span> -->
              </div>
            </div>
            <div class="one-block">
              <div class="label">机构成本：</div>
              <div style="width: 608px">
                <span style="color: var(--text-color); font-weight: 600">
                  {{ formatAmountStr(DataForm.spend_amount) }} 元
                </span>
                <!-- <br /><span style="color: #a4b2c2">{{ DataForm.spend_description }}</span> -->
              </div>
            </div>
            <div class="one-block" v-if="DataForm.adjust_info.length > 0">
              <div class="label">手工调账：</div>
              <div>
                <div
                  style="margin-bottom: 12px; font-size: 12px"
                  v-for="(adjustItem, seq) in DataForm.adjust_info"
                  :key="seq"
                >
                  <div style="display: flex">
                    <div style="display: inline-block; text-align: center; padding: 0">
                      {{ seq + 1 }}.&nbsp;
                    </div>
                    <div>
                      <div style="color: var(--text-color)">
                        调整金额：{{ formatAmountStr(adjustItem.adjust_amount) }} 元
                      </div>
                      <div style="color: var(--text-third-color)">
                        调整原因：{{ adjustItem.adjust_reason }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </template>
    <template #right>
      <CardLayout class="tg-files-container" :padding="[0, 0, 0, 0]">
        <template #title>文件</template>
        <div style="padding-top: 18px; height: 149.5px">
          <div class="file-block-content">
            <div style="height: 18px; font-size: 12px; color: var(--text-second-color)">
              下载达人数据（共{{ kol_user_count }}人）
            </div>
            <div style="margin-top: 12px; font-size: 14px; color: var(--text-color)">
              <div class="fileItem" v-if="kolDataUrl">
                <tg-icon
                  slot="icon"
                  name="ico-excel"
                  style="width: 16px; height: 16px; line-height: 16px"
                />
                <div
                  style="
                    margin-left: 2px;
                    margin-right: 12px;
                    height: 18px;
                    line-height: 18px;
                    width: 222px;
                    font-size: 12px;
                  "
                  class="line-clamp-1"
                >
                  {{ DataForm.company_name }}的达人详情.xlsx
                </div>
                <tg-button
                  style="line-height: 18px; height: 16px; display: flex"
                  type="link"
                  :href="kolDataUrl"
                  download=""
                  >下载</tg-button
                >
              </div>
            </div>
          </div>
          <div class="file-block-content" style="margin-top: 18px">
            <div style="height: 18px; font-size: 12px; color: var(--text-second-color)">
              V任务收入文件下载
            </div>
            <div style="margin-top: 12px; font-size: 14px; color: var(--text-color)">
              <div class="fileItem" v-if="vtask_income_file">
                <tg-icon
                  slot="icon"
                  name="ico-excel"
                  style="width: 16px; height: 16px; line-height: 16px"
                />
                <div
                  style="
                    margin-left: 2px;
                    margin-right: 12px;
                    height: 18px;
                    line-height: 18px;
                    width: 222px;
                    font-size: 12px;
                  "
                  class="line-clamp-1"
                >
                  {{ basename(getFileName(vtask_income_file)) }}
                </div>
                <tg-button
                  style="line-height: 18px; height: 16px; display: flex"
                  type="link"
                  @click="downloadFileHandler(vtask_income_file)"
                  >下载</tg-button
                >
              </div>
            </div>
          </div>
        </div>
        <div
          style="border-bottom: 1px solid rgba(164, 178, 194, 0.3); margin: 0px 8px 0px 18px"
        ></div>
        <div class="file-block-content">
          <!-- <div v-if="settlement.is_estimate !== 1" class="statements-file-block-new"> -->
          <div class="statements-file-block-new">
            <div class="statements-file">
              <div>
                <div class="title">
                  结算文件
                  <span style="color: red" v-if="!readonly && settlement.is_estimate !== 1">*</span
                  >结算文件
                </div>
                <div
                  style="
                    display: flex;
                    line-height: 32px;
                    height: 32px;
                    width: 100%;
                    margin-bottom: 6px;
                    font-size: 14px;
                  "
                  v-if="!readonly && settlement.is_estimate !== 1"
                >
                  <el-upload
                    v-if="uploadedFileList.length < 5"
                    action="/"
                    accept=".docx,.pdf,.jpg,.jpeg,.xlsx,.png,.xls"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadFileHandler"
                  >
                    <tg-button icon="ico-btn-upload">上传文件</tg-button>
                  </el-upload>
                  <tg-button v-else :disabled="true" icon="ico-btn-upload">上传文件</tg-button>
                  <div
                    style="
                      display: inline-block;
                      margin-left: 6px;
                      font-size: 12px;
                      width: 166px;
                      color: var(--text-third-color);
                      height: 32px;
                      line-height: 14px;
                      font-weight: 400;
                    "
                  >
                    支持.docx .pdf .jpg .png .xlsx .xls(单个文件大小不超过30M)
                  </div>
                </div>
              </div>
              <div class="fileList" style="margin-top: 12px">
                <div class="fileItem" v-for="(item, index) in uploadedFileList" :key="index">
                  <div style="display: flex">
                    <tg-icon
                      slot="icon"
                      :name="`ico-${item.icon}`"
                      style="width: 16px; height: 16px; line-height: 16px"
                    />
                    <div
                      v-if="readonly"
                      style="
                        margin-left: 2px;
                        margin-right: 12px;
                        height: 18px;
                        line-height: 18px;
                        width: 220px;
                        font-size: 12px;
                      "
                      class="line-clamp-1"
                    >
                      {{ basename(item.name) }}
                    </div>
                    <div
                      v-else
                      style="
                        margin-left: 2px;
                        margin-right: 12px;
                        height: 16px;
                        line-height: 18px;
                        width: 194px;
                      "
                      class="line-clamp-1"
                    >
                      {{ basename(item.name) }}
                    </div>

                    <tg-button
                      style="line-height: 18px; height: 16px; display: flex; flex-shrink: 0"
                      type="link"
                      @click="downloadFileHandler(item.path)"
                      >下载</tg-button
                    >
                  </div>
                  <div class="file-delete-icon" v-if="!readonly">
                    <tg-icon
                      slot="icon"
                      name="ico-frm-delete"
                      hover-name="ico-frm-delete-active"
                      style="
                        margin-left: 13px;
                        font-size: 16px;
                        width: 16px;
                        height: 16px;
                        line-height: 16px;
                        cursor: pointer;
                        margin-top: 1px;
                      "
                      @click="handleRemoveFileClick(index)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>
    </template>
    <!-- <template #files v-if="settlement.is_estimate !== 1"> -->
    <template #files>
      <div>
        <el-form size="mini" style="margin-top: 4px">
          <el-form-item
            label="是否盖章："
            label-width="72px"
            :class="readonly ? 'text-item' : ''"
            v-if="settlement.is_estimate !== 1"
          >
            <template #label><span v-if="!readonly" class="star">*</span>是否盖章：</template>
            <div v-if="readonly">
              <div style="color: var(--text-color); font-size: 12px">
                {{ DataForm.seal_type === 2 ? '是' : DataForm.seal_type === 1 ? '否' : '--' }}
              </div>
            </div>
            <div v-else style="display: flex; align-items: center">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="DataForm.seal_type"
                placeholder="请选择"
                style="width: 107px"
                :disabled="readonly"
              >
                <el-option :key="2" :value="2" label="是"></el-option>
                <el-option :key="1" :value="1" label="否"></el-option>
              </el-select>
              <div class="stamp-tips">选"是"财务确认结算单后，系统自动发起结算单盖章流程。</div>
            </div>
          </el-form-item>
          <el-form-item label="关联合同：" label-width="72px" :class="readonly ? 'text-item' : ''">
            <template #label
              ><span v-if="!readonly && !settlement.is_estimate" class="star">*</span
              >关联合同：</template
            >
            <div v-if="readonly">
              <div
                class="contract-div"
                v-if="cooperation_link_contract_id && contract_info.sign_type_name"
                @click="contractClick"
              >
                {{
                  contract_info.contract_company_name +
                  '  (' +
                  contract_info.sign_type_name +
                  ')  ' +
                  contract_info.coop_start_date +
                  '-' +
                  contract_info.coop_end_date
                }}
              </div>
              <div v-else style="width: 700px">--</div>
            </div>
            <div v-else style="display: flex; align-items: center">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="cooperation_link_contract_id"
                filterable
                remote
                reserve-keyword
                clearable
                :placeholder="
                  readonly ? '--' : contract_id_list.length < 1 ? '暂无有效合同' : '请选择合同'
                "
                :remote-method="getContract"
                style="width: 520px"
                @change="val => selectContractUidChange(val)"
              >
                <el-option
                  v-for="item in contract_id_list"
                  :key="item.contract_id"
                  :label="
                    item.company_name +
                    '  (' +
                    item.sign_type_name +
                    ')  ' +
                    item.coop_start_date +
                    '-' +
                    item.coop_end_date
                  "
                  :value="item.contract_id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </div>
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

<script src="./step3.after.ts"></script>
<style lang="less">
@import './step3.after.less';
</style>
<style lang="less" scoped>
// .is_estimate {
//   /deep/.step2-cost-layout-content {
//     grid-template-rows: 118px 380px 0px !important;
//   }
//   .tg-files-container {
//     height: 380px;
//   }
// }
.tg-files-container {
  height: 300px;
}
.file-block-content {
  min-height: 0px !important;
}
.statements-file .title {
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  color: var(--text-second-color);
}

.statements-file-block-new {
  width: 100%;
  /* height: 220px; */
  display: flex;
  font-size: 14px;
  color: var(--text-second-color);
  font-weight: 400;
  margin-top: 18px;
}
.stamp-tips {
  display: inline-block;
  margin-left: 6px;
  font-size: 12px;
  width: 312px;
  color: var(--text-third-color);
  line-height: 28px;
  height: 28px;
  font-weight: 400;
}
/deep/ .step2-cost-layout-content {
  grid-template-areas:
    'top top'
    'left right'
    'files files';
  grid-template-columns: auto repeat(2, 286px) auto;
}
/deep/ .step2-layout-content-files {
  grid-area: files;
  margin-top: -1px;
}
.contract-div {
  font-size: 12px;
  display: flex;
  width: 700px;
  align-items: center;
  color: var(--theme-color);
  cursor: pointer;
  &:hover {
    color: var(--theme-color);
  }
}
</style>
