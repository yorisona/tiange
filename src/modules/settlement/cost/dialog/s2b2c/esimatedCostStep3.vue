<template>
  <SettlementStep3Layout
    class="tg-cost-s2b2c-esimated-step3-after-container"
    :class="readonly && settlementFiles && settlementFiles.length > 0 ? 'settlement-layout' : ''"
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
      <card-layout class="cost-info" :padding="[0]">
        <template #title>
          <span>成本信息</span>
        </template>
        <div class="settlement-esimated-step3-detail">
          <template v-if="DataForm.length > 0">
            <div v-for="(item, index) in DataForm" :key="index" class="item">
              <div class="amount-info-list">
                <div class="company">
                  <span class="label">达人：</span>
                  <b class="liver">{{ item.kol_name }}</b>
                </div>
                <div class="fee-description">达人收入</div>
                <div class="kol-form">
                  <div class="form-item">
                    <span class="label">机构佣金：</span>
                    <span class="value"
                      >{{ formatAmountWithoutPrefix(item.institution_commission_amount) }}元</span
                    >
                  </div>
                  <div class="form-item" v-if="settlement.is_estimate">
                    <span class="label">退货率：</span>
                    <span class="value">{{
                      item.refund_rate === null ? '--' : `${item.refund_rate}%`
                    }}</span>
                  </div>
                  <div class="form-item">
                    <span class="label">达人分成比例：</span>
                    <span class="value">{{ formatAmountWithoutPrefix(item.kol_divide) }}%</span>
                  </div>
                  <div class="form-item">
                    <span class="label">达人佣金：</span>
                    <span class="value"
                      >{{ formatAmountWithoutPrefix(item.commission_amount) }}元</span
                    >
                  </div>
                  <div class="form-item">
                    <span class="label">其他收入：</span>
                    <span class="value"
                      >{{ formatAmountWithoutPrefix(item.other_income_amount) }}元</span
                    >
                  </div>
                </div>
                <div class="fee-description">扣除项</div>
                <div class="kol-form">
                  <div
                    class="form-item"
                    v-for="(item, index) in item.kol_cost_share"
                    :key="item.expense_type_name + index"
                  >
                    <span class="label">{{ item.expense_type_name }}：</span>
                    <span class="value">{{ formatAmountWithoutPrefix(item.amount) }}元</span>
                  </div>
                </div>
                <div class="fee-description">扣税调整</div>
                <div class="kol-form" style="margin-bottom: 32px">
                  <div class="form-item">
                    <span class="label">发票税率：</span>
                    <span class="value">{{ item.invoice_tax_rate }}%</span>
                  </div>
                  <div class="form-item">
                    <span class="label">调整金额：</span>
                    <span class="value">{{ item.tax_balance }}元</span>
                  </div>
                </div>
                <template v-if="settlement.order_file">
                  <div class="fee-description">订单明细</div>
                  <div style="display: flex; padding-left: 30px">
                    <Appendix style="flex: 1" :list="[settlement.order_file]" />
                  </div>
                </template>
              </div>
            </div>
          </template>
          <div v-else class="empty">
            <empty-common detail-text="暂无数据"></empty-common>
          </div>
        </div>
      </card-layout>
    </template>
    <template #right>
      <CardLayout>
        <template #title>手工调账</template>
        <div class="adjust-info-content">
          <div class="adjust-info-total">
            <div class="adjust-info-total-lbl">调账&nbsp;{{ adjust_info.length }}&nbsp;笔</div>
            <div class="adjust-info-total-amount">
              <strong>共&nbsp;{{ adjust_info_amount_total }}&nbsp;元</strong>
            </div>
          </div>
          <div class="adjust-info-line"></div>
          <div class="adjust-info-list">
            <template v-for="(item, itemIndex) in adjust_info">
              <div class="adjust-info-item" :key="itemIndex">
                <span>{{ itemIndex + 1 }}.&nbsp;</span>
                <span>调整金额：</span>
                <span>{{ item.adjust_amount }}&nbsp;元</span>
                <span>；调整原因：</span>
                <span>{{ item.adjust_reason }}</span>
              </div>
            </template>
          </div>
        </div>
      </CardLayout>
    </template>

    <template #files>
      <div class="upload-form" style="margin-top: 0px; padding-bottom: 12px">
        <div v-if="!readonly" class="upload-box">
          <p
            class="upload-title"
            style="color: var(--text-second-color); width: 72px; text-align: right"
          >
            <!-- <span class="star">*</span>结算单： -->
            结算单：
          </p>
          <tg-upload
            action="/api/resources/upload_file"
            :data="{ type: 'settlement' }"
            :beforeUpload="beforeUpload"
            :success="successHandle"
            :disabled="isFileUploaderDisabled"
            :show-file-list="false"
          >
            <tg-button icon="ico-btn-upload" :disabled="isFileUploaderDisabled">上传文件</tg-button>
          </tg-upload>
          <span class="file-tips">
            支持 .docx .pdf .jpg .png .xlsx .csv, 最多上传5个文件(单个文件大小不超过150M)
          </span>
        </div>
        <div
          class="file-list-box"
          v-if="(settlementFiles && settlementFiles.length > 0) || readonly"
        >
          <upload-file-list
            style="line-height: 25px; padding-left: 72px"
            v-if="!readonly"
            v-model="settlementFiles"
          />
          <div
            style="width: 100%; min-height: 20px"
            :style="{ height: 26 * settlementFiles.length + 'px' }"
            v-else
          >
            <div
              class="settlement-uploaded-lbl"
              style="float: left; text-align: right; width: 72px; font-size: 12px"
            >
              结算单：
            </div>
            <Appendix
              v-if="settlementFiles && settlementFiles.length > 0"
              style="width: 680px; float: left"
              :list="settlementFiles"
            />
            <div style="line-height: 16px; font-size: 12px" v-else>--</div>
          </div>
        </div>
        <el-form
          size="mini"
          style="margin-top: 15px; width: 100%; margin-bottom: 12px"
          :style="{
            marginTop: readonly
              ? settlementFiles && settlementFiles.length > 0
                ? '2px'
                : '15px'
              : '12px',
          }"
        >
          <el-form-item
            v-if="settlement.is_estimate === 0"
            label="是否盖章："
            label-width="72px"
            :class="readonly ? 'text-item' : ''"
          >
            <template #label><span v-if="!readonly" class="star">*</span>是否盖章：</template>
            <div v-if="readonly">
              <div style="color: var(--text-color); font-size: 12px">
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
              <div class="file-tips" style="margin-top: 0">
                选"是"财务确认结算单后，系统自动发起结算单盖章流程。
              </div>
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
              <div v-else style="width: 700px; font-size: 12px">--</div>
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
                :disabled="readonly"
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

<script src="./esimatedCostStep3.ts"></script>
<style lang="less">
// .tg-cost-s2b2c-douyin-step3-after-container {
.tg-cost-s2b2c-esimated-step3-after-container {
  .file-name {
    padding-top: 2px;
    line-height: 20px;
  }
  .el-upload {
    .tg-btn {
      width: 107px;
      .el-input__inner {
        border-color: var(--border-line-color);
      }
    }
  }
  &.settlement-layout {
    .step3-layout-content {
      height: 590px;
    }
  }
  .step3-layout-content {
    column-gap: 16px !important;
    row-gap: 16px !important;
    grid-template-areas:
      'top top'
      'left right'
      'files files';
    grid-template-columns: auto repeat(2, 286px) auto;
    .el-form {
      .el-form-item__label {
        // height: 32px;
        // line-height: 32px;
        padding-right: 0 !important;
      }

      .el-form-item__content {
        // height: 32px;
        // line-height: 32px;

        .el-input {
          // height: 32px;
          // line-height: 32px;
        }

        .el-input__inner {
          // height: 32px;
          // line-height: 32px;
        }
      }
    }
  }
  .step3-layout-content-files {
    grid-area: files;
    .upload-form .file-list-box {
      margin-top: 12px;
      width: 950px;
    }
  }
  width: 1100px;
  .col-2 {
    grid-template-columns: auto 685px 310px auto !important;
  }
  .step3-layout-content {
    grid-template-rows: 118px 300px 100px !important;
    height: 596px;
  }
  .tg-top-card {
    height: 140px !important;
    .card-layout {
      height: 120px !important;
    }
    .card-layout-bd {
      padding-bottom: 0px !important;
    }
    .card-layout-bd {
      height: 60px !important;
    }
  }
  .step3-layout-content-left,
  .step3-layout-content-right {
    .card-layout {
      height: 300px !important;
      padding-bottom: 10px;
    }
  }
  .settlement-esimated-step3-detail {
    padding: 0 18px !important;
  }
}
.cost-info {
  .amount-info-list {
    color: var(--text-third-color);
    .company {
      margin-top: 18px;
      font-size: 14px;
      .label {
      }
      .liver {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-color);
        padding-right: 12px;
      }
      .edit {
        font-size: 16px;
        cursor: pointer;
        margin-left: 12px;
        vertical-align: sub;
      }
    }
  }
  & .fee-description {
    position: relative;
    padding-left: 10px;
    line-height: 22px;
    margin: 16px 0 16px 0;
    font-size: 12px;
    color: var(--text-color);
    &:after {
      content: ' ';
      position: absolute;
      width: 3px;
      height: 12px;
      background: var(--theme-color);
      top: 5px;
      left: 0;
      border-radius: 1px;
    }
  }
}
& .kol-form {
  & .form-item {
    margin-bottom: 4px;
    &:last-child {
      margin-bottom: 0;
    }
    & .label {
      display: inline-block;
      width: 100px;
      text-align: right;
      color: var(--text-third-color);
      line-height: 24px;
    }
    & .value {
      color: var(--text-color);
      font-size: 12px;
    }
    & .down-file {
      display: inline-flex;
      align-items: center;
      & .name {
        margin: 0 12px 0 6px;
      }
      & .icon {
        font-size: 16px;
      }
      & .down-icon {
        color: #a4b2c2;
        cursor: pointer;
      }
    }
  }
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
.upload-title {
  font-size: 12px;
  color: var(--text-second-color);
}
</style>
