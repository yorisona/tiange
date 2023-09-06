<template>
  <div>
    <SettlementStep3Layout
      class="tg-settlement-submit-form"
      :amount="formatAmount(settlementDetail.total_settle_amount, 'None')"
      :class="injectSettlement.is_estimate === 1 ? 'is_estimate' : ''"
    >
      <template #top>
        <top-card
          :is_cost="false"
          :amount="`${settlementDetail.total_settle_amount.toString()}`"
          :taxed="DataForm.is_include_tax"
          :invoice_type="DataForm.invoice_type"
          :tax_rate="DataForm.tax_rate"
          :name="DataForm.company_name"
          type="value2"
        ></top-card>
      </template>
      <template #left>
        <card-layout style="height: 100%" :padding="[18, 0, 0]">
          <template #title>
            <span>收入信息</span>
          </template>
          <!-- <template v-if="injectSettlement.settlement_type != 4" #desc>
            <span>{{
              injectSettlement.settlement_type === 5
                ? '(上传文件中所有收入金额合计)'
                : '(上传文件中所有收入金额按客户合计)'
            }}</span>
          </template> -->
          <template>
            <div
              style="
                display: flex;
                justify-content: space-between;
                padding: 0 18px;
                height: 18px;
                line-height: 18px;
              "
            >
              <span style="color: var(--text-second-color); font-size: 12px">收入</span>
              <span class="form-content-income">
                {{ formatAmount(settlementDetail.income_amount, 'None') }} 元
              </span>
            </div>
            <div
              v-if="settlementDetail.excel_data.length"
              style="border-bottom: 1px dashed rgba(164, 178, 194, 0.3); margin: 12px 18px 0"
            ></div>
            <div class="form-content-income-list">
              <div
                class="form-content-income-list-row"
                v-for="(item, idx) in settlementDetail.excel_data"
                :key="idx"
                :style="isLastSpecialIncomeData(item, idx) ? 'margin-bottom: 18px' : ''"
              >
                <el-tooltip
                  :disabled="isSpecialIncomeData(item)"
                  :open-delay="300"
                  :content="item.name"
                  placement="top"
                  effect="light"
                >
                  <span
                    class="line-clamp-1"
                    :style="
                      isSpecialIncomeData(item)
                        ? 'max-width: 140px; color: var(--text-second-color);'
                        : 'max-width: 140px'
                    "
                    >{{ item.name }}</span
                  >
                </el-tooltip>
                <span :style="item.value.indexOf('-') !== -1 ? 'color: #EC1E1E;' : ''">{{
                  formatAmount(item.value, 'None')
                }}</span>
              </div>
            </div>
          </template>
        </card-layout>
      </template>
      <template #right>
        <card-layout style="height: 100%">
          <template #title>
            <span>手工调账</span>
          </template>
          <template>
            <div class="adjust-account-amount">
              调账 {{ settlementDetail.adjust_info.length }} 笔
            </div>
            <div class="adjust-account-money mgt-6">
              <span>共</span> {{ adjustTotalAmount() }} 元
            </div>
            <div v-if="settlementDetail.adjust_info.length" class="content-dash-line"></div>
            <div
              class="mgt-12 content-adjust-account-item"
              v-for="(item, index) in settlementDetail.adjust_info"
              :key="index"
            >
              <div style="display: flex">
                <span style="flex-shrink: 1; white-space: pre">{{ `${index + 1}. ` }}</span>
                {{
                  `调整金额：${
                    item.adjust_amount ? formatAmount(item.adjust_amount, 'None') : '--'
                  } 元；调整原因：${item.adjust_reason ? item.adjust_reason : '--'}`
                }}
              </div>
            </div>
          </template>
        </card-layout>
      </template>
      <!-- <template #files v-if="injectSettlement.is_estimate !== 1"> -->
      <template #files>
        <div class="form-uploaded-file">
          <el-form size="mini">
            <el-form-item
              v-if="settlementDetail.income_file"
              class="income-form-item mgl-18 text-item"
              label="收入文件："
            >
              <div>
                <div class="line-clamp-1 uploaded-file" style="flex-shrink: 0">
                  <FileItem
                    :showPreview="false"
                    :key="1000"
                    :filepath="settlementDetail.income_file"
                    :readonly="true"
                  />
                </div>
                <!-- <div v-else>--</div> -->
              </div>
            </el-form-item>
            <el-form-item
              v-if="settlementDetail.detail_file"
              class="income-form-item mgt-12 mgl-18 text-item"
              label="结算明细："
            >
              <div>
                <div class="line-clamp-1 uploaded-file" style="flex-shrink: 0">
                  <FileItem
                    :showPreview="false"
                    :key="1001"
                    :filepath="settlementDetail.detail_file"
                    :readonly="true"
                  />
                </div>
                <!-- <div v-else>--</div> -->
              </div>
            </el-form-item>
            <div
              v-if="settlementDetail.income_file"
              style="border-bottom: 1px solid rgba(164, 178, 194, 0.3); margin: 18px 0"
            ></div>
            <el-form-item
              class="settlement-form-item"
              align="right"
              prop="settlement_files"
              label-width="72px"
            >
              <template #label>
                <span v-if="injectSettlement.is_estimate !== 1" class="star">*</span
                >结算单：</template
              >
              <div style="display: flex; height: 32px; align-items: center">
                <div style="text-align: left">
                  <el-upload
                    v-model="settlementDetail.settlement_files"
                    action="/"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadFileHandler"
                    accept=".docx,.pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                    :disabled="settlementDetail.settlement_files.length >= 5 ? true : false"
                    style="width: 108px"
                  >
                    <tg-button
                      class="upload-btn"
                      icon="ico-btn-upload"
                      :disabled="settlementDetail.settlement_files.length >= 5 ? true : false"
                      >上传文件</tg-button
                    >
                  </el-upload>
                </div>
                <div class="upload-tips">
                  支持 .docx .pdf .jpg .png .xlsx .xls, 最多上传5个文件(单个文件大小不超过30M)
                </div>
              </div>
              <div v-show="settlementDetail.settlement_files.length" class="fileList">
                <div
                  v-for="(item, index) in settlementDetail.settlement_files"
                  :key="index"
                  style="height: 20px; line-height: 20px; margin-top: 12px; margin-bottom: 5px"
                >
                  <div style="display: inline-flex; width: 100%" class="line-clamp-1 uploaded-file">
                    <FileItem
                      :showPreview="false"
                      :key="index"
                      :filepath="item"
                      :readonly="false"
                      @remove="handleRemoveFileClick(index)"
                    />
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              style="margin-top: 12px"
              prop="seal_type"
              label="是否盖章："
              label-width="72px"
              v-if="injectSettlement.is_estimate !== 1"
            >
              <template #label> <span class="star">*</span>是否盖章：</template>
              <div>
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model="DataForm.seal_type"
                  placeholder="请选择"
                  style="width: 108px"
                >
                  <el-option :key="2" :value="2" label="是"></el-option>
                  <el-option :key="1" :value="1" label="否"></el-option>
                </el-select>
                <div class="upload-tips" style="width: 350px; margin-left: 6px">
                  选"是"财务确认结算单后，系统自动发起结算单盖章流程。
                </div>
              </div>
            </el-form-item>
            <el-form-item
              class="settlement-form-item"
              style="margin-top: 12px"
              label="关联合同："
              label-width="72px"
              :style="{ marginBottom: '30px !important' }"
            >
              <template #label>
                <!-- 关联合同：</template -->
                <span v-if="DataForm.seal_type === 2" class="star">*</span>关联合同：</template
              >
              <div style="display: flex; align-items: center">
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model="cooperation_link_contract_id"
                  filterable
                  remote
                  reserve-keyword
                  clearable
                  :placeholder="contract_id_list.length < 1 ? '暂无有效合同' : '请选择合同'"
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
      <template #button>
        <tg-button @click="prev">上一步</tg-button>
        <tg-button type="primary" @click="next">提交</tg-button>
      </template>
    </SettlementStep3Layout>
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script src="./step3.mcn.ts"></script>

<style lang="less" scoped>
@import './step3.mcn.less';
/deep/ .step3-layout-content.col-2 {
  grid-template-areas:
    '. top top .'
    '. left right .'
    'files files files files';
  grid-template-columns: auto repeat(2, 286px) auto;
}
/deep/ .step3-layout-content-files {
  width: 650px;
  align-items: center;
  margin: 0 auto;

  .form-uploaded-file {
    width: 650px;
    .tg-btn {
      width: 108px;
    }
  }
}

.tg-settlement-submit-form {
  /deep/ .star {
    color: var(--error-color);
  }
  height: 540px !important;
  /deep/.step3-layout-content {
    height: 540px;
    grid-template-rows: 118px 262px auto !important;
  }
  // &.is_estimate {
  //   /deep/.step3-layout-content {
  //     height: 540px;
  //     grid-template-rows: 118px 362px auto !important;
  //   }
  // }
}

/deep/.el-form {
  .el-form-item__label {
    height: 32px;
    line-height: 32px;
    padding-right: 0 !important;
  }

  .el-form-item__content {
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
.upload-tips {
  width: 500px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  margin-left: 6px;
  color: var(--text-third-color);
  margin-top: 0px;
  text-align: left;
  display: inline-block;
}
</style>
