<template>
  <div>
    <SettlementStep3Layout
      class="tg-settlement-submit-form col-2-mcn"
      :leftItemExpand="true"
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
          <template>
            <div class="settlement-step3-detail">
              <template
                v-if="
                  settlementDetail.amount_info_list && settlementDetail.amount_info_list.length > 0
                "
              >
                <div :key="index" v-for="(item, index) in settlementDetail.amount_info_list">
                  <template v-if="item.type === 10">
                    <div class="item">
                      <p class="label">总GMV：</p>
                      <div class="detail">
                        <div class="amount">
                          <p class="fee">
                            {{
                              item.total_gmv ? formatAmount(item.total_gmv, 'None') + ' 元' : '--'
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="item">
                      <p class="label">退货率：</p>
                      <div class="detail">
                        <div class="amount">
                          <p class="fee">
                            {{ item.refund_rate ? item.refund_rate + '%' : '--' }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="item" v-if="item.version === 2">
                      <p class="label">预估机构佣金：</p>
                      <div class="detail">
                        <div class="amount">
                          <p class="fee">
                            {{
                              item.commission_amount
                                ? formatAmount(item.commission_amount, 'None') + ' 元'
                                : '--'
                            }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="item" v-else>
                      <p class="label">平均佣金比例：</p>
                      <div class="detail">
                        <div class="amount">
                          <p class="fee">
                            {{ item.commission_rate ? item.commission_rate + ' %' : '--' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="item">
                    <p class="label">
                      {{
                        item.type === 10
                          ? 'CPS收入'
                          : item.type === 11
                          ? '佣金'
                          : item.type === 12
                          ? '佣金(服务费)'
                          : item.type === 13
                          ? '技术服务费'
                          : settlementTypeFun(item.type)
                      }}：
                    </p>
                    <div class="detail">
                      <div class="amount">
                        <p class="fee">
                          {{ item.amount ? formatAmount(item.amount, 'None') + ' 元' : '--' }}
                        </p>
                        <a
                          v-if="item.file"
                          :href="item.file + `?Authorization=${getToken()}`"
                          class="download"
                          >下载明细</a
                        >
                      </div>
                      <p v-if="item.remark" class="text">{{ item.remark }}</p>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else class="empty">
                <empty-common></empty-common>
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
                  `调整金额 ${
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
            <el-form-item class="settlement-form-item" label-width="74px">
              <template #label>
                <span class="star" v-if="injectSettlement.is_estimate !== 1">*</span
                >结算单：</template
              >
              <div style="display: flex; height: 32px; align-items: center">
                <div>
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
            </el-form-item>
          </el-form>
          <div
            v-show="settlementDetail.settlement_files.length"
            class="fileList"
            style="padding-left: 80px; margin-bottom: 15px; margin-top: -5px"
          >
            <div
              v-for="(item, index) in settlementDetail.settlement_files"
              :key="index"
              style="height: 20px; line-height: 20px; margin-top: 12px"
            >
              <div style="display: inline-flex" class="line-clamp-1 uploaded-file">
                <FileItem
                  :showPreview="false"
                  :key="index"
                  :filepath="item"
                  @remove="handleRemoveFileClick(index)"
                />
              </div>
            </div>
          </div>
          <el-form size="mini">
            <el-form-item
              prop="seal_type"
              label="是否盖章："
              label-width="74px"
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
              label="关联合同："
              style="margin-bottom: 24px !important"
              label-width="74px"
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
    <tg-mask-loading :visible="loading" :content="loadingText" />
  </div>
</template>

<script src="./step3.after.ts"></script>
<style lang="less" scoped>
@import './step3.after.less';
/deep/ .step3-layout-content-files {
  width: 650px;
  .star {
    color: var(--error-color);
  }
  .form-uploaded-file {
    width: 650px;
    .el-upload {
      .tg-btn {
        width: 108px;
      }
    }
  }
}

.tg-settlement-submit-form {
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
.adjust-account-amount {
  font-size: 12px;
  color: var(--text-third-color);
  line-height: 16px;
}
.adjust-account-money {
  margin-top: 6px;
  font-size: 14px;
  color: var(--text-color);
  line-height: 18px;
  font-weight: 600;
}
.content-dash-line {
  border-top: 1px dashed rgba(164, 178, 194, 0.3);
  margin: 12px 0 0;
}
.content-adjust-account-item {
  font-size: 12px;
  color: var(--text-second-color);
  line-height: 16px;
}
.upload-tips {
  width: 500px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  margin-left: 6px;
  color: var(--text-third-color);
  margin-top: 0px;
  display: inline-block;
}
</style>
