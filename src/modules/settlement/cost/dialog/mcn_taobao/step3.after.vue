<template>
  <SettlementStep2Layout
    class="tg-cost-mcn-taobao-step3-after-container"
    :class="settlement.is_estimate === 1 ? 'is_estimate' : ''"
  >
    <template #top>
      <top-card
        :amount="`${settlement.total_settle_amount.toString()}`"
        :taxed="cloneSettlement.is_include_tax"
        :invoice_type="cloneSettlement.invoice_type"
        :name="cloneSettlement.company_name"
        name_desc="供应商："
        :tax_rate="`${cloneSettlement.tax_rate ? cloneSettlement.tax_rate.toString() : ''}`"
        type="value2"
        :tax_rate_disabled="true"
      ></top-card>
    </template>

    <template #left>
      <card-layout :padding="[0]">
        <template #title>
          <span>成本信息</span>
        </template>
        <!-- <template #desc>
          <span>提成 = 主播总收入 * 提成比例</span>
        </template> -->
        <template>
          <section class="expenditure-cost-list">
            <section class="expenditure-cost-list-row">
              <div class="cost-company-name">{{ cloneSettlement.company_name }}</div>
              <section class="commission-info">
                <span class="label">提成：</span>
                <div class="commission-info-detail">
                  <div class="commission-amount">
                    {{ `${formatAmount(cloneSettlement.commission)} 元` }}
                  </div>
                  <div class="commission-amount-desc">
                    {{
                      `总收入 ${cloneSettlement.original_income_amount} 元，提成比例 ${cloneSettlement.commission_rate}%`
                    }}
                  </div>
                </div>
              </section>
              <section
                v-if="(cloneSettlement.adjust_info ? cloneSettlement.adjust_info : []).length"
                class="adjust-info"
              >
                <div class="adjust-info-flex">
                  <span class="label">手工调账：</span>
                  <div class="adjust-info-list">
                    <div
                      v-for="(item, idx) in cloneSettlement.adjust_info"
                      :key="idx"
                      class="adjust-info-list-row"
                    >
                      <span>{{ `${idx + 1}.` }}&nbsp;</span>
                      <div class="adjust-row-detail">
                        <div>{{ `调整金额：${formatAmount(item.adjust_amount)} 元` }}</div>
                        <div>{{ `调整原因：${item.adjust_reason}` }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </section>
        </template>
      </card-layout>
    </template>
    <template #right>
      <card-layout class="card-layout-right" :padding="[0]">
        <template #title>
          <span>文件</span>
        </template>
        <template>
          <section class="tg-cost-mcn-taobao-files">
            <section class="income-files">
              <div>
                <span class="titles">{{ `下载主播数据（共${cloneSettlement.kol_count}人）` }}</span>
                <div class="mgt-12">
                  <div class="line-clamp-1 uploaded-file" style="flex-shrink: 0">
                    <tg-button class="uploaded-file-btn" type="link">
                      <tg-icon class="uploaded-file-btn-icon" name="ico-excel"></tg-icon>
                      <span style="max-width: 300px" class="line-clamp-1">{{
                        `${cloneSettlement.company_name}的主播详情.xlsx`
                      }}</span>
                    </tg-button>
                    <!-- <tg-button
                      class="uploaded-file-download"
                      @click="downloadFile(cloneSettlement.income_file)"
                      target="_blank"
                      type="link"
                      style="flex-shrink: 0"
                      >下载</tg-button
                    > -->
                    <tg-button
                      class="uploaded-file-download"
                      type="link"
                      @click="downKolDataFile"
                      style="flex-shrink: 0"
                      >下载</tg-button
                    >
                    <tg-button
                      class="uploaded-file-download"
                      type="link"
                      @click="previewKolDataFile"
                      style="flex-shrink: 0"
                      >预览</tg-button
                    >
                  </div>
                </div>
              </div>
              <div class="mgt-18">
                <span class="titles">淘宝CPS收入文件下载</span>
                <div class="mgt-12">
                  <div class="line-clamp-1 uploaded-file" style="flex-shrink: 0">
                    <tg-button class="uploaded-file-btn" type="link">
                      <tg-icon
                        class="uploaded-file-btn-icon"
                        :name="getFileIcon(cloneSettlement.income_file)"
                      ></tg-icon>
                      <span style="max-width: 300px" class="line-clamp-1">{{
                        basename(getFileName(cloneSettlement.income_file))
                      }}</span>
                    </tg-button>
                    <tg-button
                      class="uploaded-file-download"
                      @click="downloadFile(cloneSettlement.income_file)"
                      target="_blank"
                      type="link"
                      style="flex-shrink: 0"
                      >下载</tg-button
                    >
                    <tg-button
                      class="uploaded-file-download"
                      @click="tbcpsPreviewFile(cloneSettlement.income_file)"
                      target="_blank"
                      type="link"
                      style="flex-shrink: 0"
                      >预览</tg-button
                    >
                  </div>
                </div>
              </div>
            </section>
            <!-- <section v-if="settlement.is_estimate !== 1" class="settlement-files"> -->
            <section class="settlement-files">
              <div :class="readonly ? 'title' : 'title title-before'">
                <span v-if="settlement.is_estimate !== 1" class="star">*</span>结算文件
              </div>
              <div style="display: flex; height: 32px; align-items: center" v-if="!readonly">
                <div style="flex-shrink: 0">
                  <el-upload
                    v-model="settlementFiles"
                    action="/"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadFileHandler"
                    accept=".docx,.pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                    :disabled="settlementFiles.length >= 5 ? true : false"
                  >
                    <tg-button
                      class="upload-btn"
                      icon="ico-btn-upload"
                      :disabled="settlementFiles.length >= 5 ? true : false"
                      >上传文件</tg-button
                    >
                  </el-upload>
                </div>
                <div style="font-size: 12px; margin-left: 6px; color: var(--text-third-color)">
                  <div>支持 .docx .pdf .jpg .png .xlsx</div>
                  <div>.xls (单个文件大小不超过30M)</div>
                </div>
              </div>
              <div v-show="settlementFiles.length" class="fileList" style="padding-right: 18px">
                <div
                  v-for="(item, index) in settlementFiles"
                  :key="index"
                  style="height: 20px; line-height: 20px; margin-top: 12px"
                >
                  <div class="line-clamp-1 uploaded-file">
                    <tg-button class="uploaded-file-btn" type="link">
                      <tg-icon class="uploaded-file-btn-icon" :name="getFileIcon(item)"></tg-icon>
                      <span style="max-width: 300px" class="line-clamp-1">{{
                        basename(getFileName(item))
                      }}</span>
                    </tg-button>
                    <tg-button
                      class="uploaded-file-download"
                      @click="downloadFile(item)"
                      target="_blank"
                      type="link"
                      style="flex-shrink: 0"
                      >下载</tg-button
                    >
                    <tg-button
                      class="uploaded-file-download"
                      @click="tbcpsPreviewFile(item)"
                      target="_blank"
                      type="link"
                      style="flex-shrink: 0"
                      >预览</tg-button
                    >
                    <tg-button
                      class="mgl-12 uploaded-file-del"
                      type="link"
                      @click="handleRemoveFileClick(index)"
                      v-if="!readonly"
                    >
                      <tg-icon
                        style="width: 16px; height: 16px"
                        name="ico-frm-delete"
                        hoverName="ico-frm-delete-active"
                      />
                    </tg-button>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </template>
      </card-layout>
    </template>
    <!-- <template #files v-if="settlement.is_estimate !== 1"> -->
    <template #files>
      <div>
        <el-form size="mini" style="margin-top: 2px">
          <el-form-item
            label="是否盖章："
            label-width="72px"
            :style="{ marginBottom: readonly ? '0px' : '12px' }"
            :class="readonly ? 'text-item' : ''"
            v-if="settlement.is_estimate !== 1"
          >
            <template #label><span v-if="!readonly" class="star">*</span>是否盖章：</template>
            <div v-if="readonly">
              <div
                style="
                  color: var(--text-color);
                  line-height: 18px;
                  font-size: 12px;
                  margin-top: 1px;
                "
              >
                {{ seal_type === 2 ? '是' : seal_type === 1 ? '否' : '--' }}
              </div>
            </div>
            <div v-else style="display: flex; align-items: center">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="seal_type"
                placeholder="请选择"
                style="width: 108px"
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
              <div v-else style="width: 700px; margin-top: 1px">--</div>
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
  </SettlementStep2Layout>
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
// }
/deep/.el-form {
  .el-form-item__label {
    height: 32px;
    line-height: 32px;
    padding-right: 0 !important;
  }

  .el-form-item__content {
    height: 32px;
    line-height: 32px;

    .el-input {
      height: 32px;
      line-height: 32px;
    }

    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
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
</style>
