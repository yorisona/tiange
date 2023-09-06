<!--
 * @Brief: 提交结算单-拆分后
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 10:04:03
-->
<template>
  <SettlementStep3Layout
    class="tg-cost-mcn-douyin-step3-after-container"
    :class="settlement.is_estimate === 1 ? 'is_estimate' : readonly ? 'readonly' : ''"
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
        <div class="settlement-mcn-douyin-step3-detail" style="margin-top: 18px">
          <template v-if="DataForm.length > 0">
            <div v-for="(item, index) in DataForm" :key="index" class="item">
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
                  <tg-button
                    v-if="item.type === 1 || (item.type === 8 && isYuFengCompany)"
                    type="link"
                    class="download"
                    @click="downDetail(item.type)"
                    >下载明细</tg-button
                  >
                </div>
                <p v-if="item.remark" class="text">{{ item.remark }}</p>
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

    <!-- <template #files v-if="settlement.is_estimate !== 1"> -->
    <template #files>
      <div class="upload-form">
        <div v-if="!readonly" class="upload-box">
          <p
            class="upload-title"
            style="color: var(--text-second-color); width: 72px; text-align: right; font-size: 12px"
          >
            <span v-if="settlement.is_estimate !== 1" class="star">*</span>结算单：
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
            支持 .docx .pdf .jpg .png .xlsx, 最多上传5个文件(单个文件大小不超过30M)
          </span>
        </div>
        <!-- <div class="file-list-box" v-if="settlementFiles && settlementFiles.length > 0"> -->
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
              style="
                float: left;
                text-align: right;
                width: 72px;
                color: var(--text-third-color);
                font-size: 12px;
              "
            >
              结算单：
            </div>
            <Appendix
              v-if="settlementFiles && settlementFiles.length > 0"
              style="width: 650px; float: left"
              :list="settlementFiles"
            />
            <div style="line-height: 16px; color: rgb(25, 35, 45)" v-else>--</div>
          </div>
        </div>
        <el-form
          size="mini"
          :class="readonly ? 'detail-form' : ''"
          style="margin-top: 12px; width: 750px"
          :style="{ marginTop: readonly ? '2px' : '12px' }"
        >
          <el-form-item
            v-if="!isFromMarketing && settlement.is_estimate !== 1"
            :prop="readonly ? '' : 'seal_type'"
            label="是否盖章："
            label-width="72px"
            :class="readonly ? 'text-item' : ''"
          >
            <template #label> <span v-if="!readonly" class="star">*</span>是否盖章：</template>
            <div v-if="readonly">
              <div
                style="color: var(--text-color); width: 600px; line-height: 18px; font-size: 12px"
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
                :style="{ marginLeft: readonly && !isFromMarketing ? '10px' : '0px' }"
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
              <div v-else style="color: var(--text-color); width: 600px; line-height: 18px">--</div>
            </div>
            <div v-else style="display: flex; align-items: center">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="cooperation_link_contract_id"
                filterable
                remote
                reserve-keyword
                clearable
                :prop="readonly ? '' : seal_type === 2 ? 'contract_id' : ''"
                :remote-method="getContract"
                style="width: 520px"
                :disabled="readonly"
                @change="val => selectContractUidChange(val)"
                :placeholder="
                  readonly ? '--' : contract_id_list.length < 1 ? '暂无有效合同' : '请选择合同'
                "
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
@import '~@/styles/utils/index.less';
.tg-cost-mcn-douyin-step3-after-container {
  width: 1100px;
  &.readonly {
    .step3-layout-content {
      height: 590px;
    }
  }
  // &.is_estimate {
  //   .col-2 {
  //     grid-template-rows: 118px 390px 0px !important;
  //     grid-template-columns: auto 685px 310px auto !important;
  //     .step3-layout-content-left,
  //     .step3-layout-content-right {
  //       .card-layout {
  //         height: 390px !important;
  //         padding-bottom: 10px;
  //       }
  //     }
  //   }
  // }
  .col-2 {
    grid-template-rows: 118px 290px auto !important;
    grid-template-columns: auto 685px 310px auto !important;
    overflow-x: hidden;
  }
  .step3-layout-content {
    height: auto;
    max-height: 574px;
  }
  .step3-layout-content-left,
  .step3-layout-content-right {
    .card-layout {
      height: 300px !important;
      padding-bottom: 10px;
    }
  }
}
.adjust-info-content {
  > .adjust-info-total {
    > .adjust-info-total-lbl {
      .fc(var(--default-font-size), var(--text-third-color));
      line-height: 16px;
    }
    > .adjust-info-total-amount {
      .mgt(6px);
      font-size: var(--small-font-size);
      color: var(--text-color);
      line-height: 18px;
    }
  }
  > .adjust-info-line {
    .brd-t(1px; dashed; rgba(var(--tip-icon-rgb-color), 0.3));
    .mg(12px 0);
  }
  > .adjust-info-list {
    display: grid;
    row-gap: 12px;
    > .adjust-info-item {
      .fc(12px, var(--text-third-color));
      line-height: 16px;
    }
  }
}
.settlement-mcn-douyin-step3-detail {
  padding: 0 10px;
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 140px;
    }
    .empty-text {
      margin-top: -15px;
    }
  }
  .item {
    display: flex;
    margin-bottom: 10px;
    .label {
      color: var(--text-third-color);
      width: 85px;
      text-align: right;
      font-size: 12px;
      line-height: 20px;
    }
    .detail {
      flex: 1;
      .amount {
        display: flex;
        .fee {
          color: var(--text-color);
          font-weight: 600;
          margin-top: 2px;
        }
        .download {
          color: var(--theme-color);
          margin-left: 10px;
          margin-top: 3px;
        }
      }
      .text {
        color: var(--text-third-color);
        font-size: 12px;
      }
    }
  }
}
.star {
  color: var(--error-color);
}
.upload-form {
  margin-top: 12px;
  .upload-box {
    display: flex;
    .upload-title {
      line-height: 28px;
    }
    /deep/.el-loading-spinner {
      .circular {
        width: 20px;
        height: 20px;
        margin-top: 10px;
      }
    }
  }
  .file-list-box {
    margin-top: 10px;
    width: 750px;
  }
}
.file-tips {
  margin-left: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-third-color);
}
.stamp-tips {
  margin-left: 6px;
  font-size: 12px;
  color: var(--text-third-color);
}
.upload-file-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  /deep/ .file-item {
    width: 360px;
    .file-name {
      flex: none;
      max-width: 300px;
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.el-upload .tg-btn.tg-btn-default {
  border-color: var(--border-line-color);
  width: 108px;
}
/deep/.el-form {
  .el-form-item__label {
    padding-right: 0 !important;
  }
}
.contract-div {
  font-size: 12px;
  display: flex;
  align-items: center;
  color: var(--theme-color);
  cursor: pointer;
  &:hover {
    color: var(--theme-color);
  }
}
</style>
