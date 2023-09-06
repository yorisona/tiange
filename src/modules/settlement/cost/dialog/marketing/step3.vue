<template>
  <SettlementStep3Layout
    class="settlement-step3-marketing"
    :amount="total_settle_amount"
    :class="
      settlement.is_estimate === 1
        ? 'is_estimate'
        : business_type === 1
        ? 'marketing-settlement'
        : ''
    "
  >
    <template #top>
      <top-card
        :amount="total_settle_amount"
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
        <!-- <template #desc>支出=实际填写支出</template> -->
        <div class="income-amount">
          <span>支出</span>
          <span style="margin: 0 4px; font-weight: 600; color: var(--text-color)">{{
            spend_amount
          }}</span>
          <span style="font-weight: 600; color: var(--text-color)">元</span>
        </div>
      </CardLayout>
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
                <span>{{ item.adjust_amount }} 元</span>
                <span>；调整原因：</span>
                <span>{{ item.adjust_reason }}</span>
              </div>
            </template>
          </div>
        </div>
      </CardLayout>
    </template>
    <template #files>
      <el-form
        :class="readonly ? 'detail-form' : ''"
        size="mini"
        :model="step3Frm"
        :rules="step3FrmRules"
        ref="step3FrmRef"
        v-if="!readonly"
      >
        <el-form-item
          label="结算单："
          :prop="readonly || settlement.is_estimate ? '' : 'settlement_files'"
          class="form-item-settlement-files"
          label-width="72px"
          style="margin-bottom: 12px !important"
        >
          <div class="form-item-content">
            <el-upload
              v-model="step3Frm.settlement_files"
              action="/"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadFileHandler"
              accept=".docx,.pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              :disabled="isFileUploaderDisabled"
              style="height: 28px; width: 107px"
            >
              <tg-button
                style="width: 107px"
                icon="ico-btn-upload"
                :disabled="isFileUploaderDisabled"
                >上传文件</tg-button
              >
            </el-upload>
            <div class="upload-tips">
              支持 .docx .pdf .jpg .png .xlsx .xls,最多上传5个文件(单个文件大小不超过30M)
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div
        class="settlement-uploaded-files-container"
        :style="!readonly ? 'margin-left: 66px' : ''"
      >
        <div
          class="settlement-uploaded-lbl"
          style="color: var(--text-third-color)"
          v-if="readonly"
          :style="{
            paddingRight: readonly ? '0px' : '0',
            marginBottom: readonly ? '0px' : '0px',
            width: readonly ? '72px' : '10px',
          }"
        >
          {{ readonly ? '结算单：' : '&nbsp;' }}
        </div>
        <div
          v-if="step3Frm.settlement_files && step3Frm.settlement_files.length > 0"
          class="settlement-uploaded-files"
          :style="{ marginBottom: !readonly ? '12px' : '' }"
        >
          <template v-for="(item, index) in step3Frm.settlement_files">
            <FileItem
              :showPreview="settlement.status !== 0"
              :key="index"
              :filepath="item"
              @remove="onRemoveFile(index)"
              :readonly="readonly"
            />
          </template>
        </div>
        <div v-else-if="readonly">--</div>
      </div>
      <el-form
        size="mini"
        style="margin-top: 0; padding-bottom: 12px"
        :class="readonly ? 'detail-form' : ''"
        :model="step3Frm"
        :rules="step3FrmRules"
        ref="step3FrmSecondRef"
      >
        <el-form-item
          v-if="business_type !== 1"
          :prop="readonly ? '' : 'seal_type'"
          label="是否盖章："
          label-width="72px"
          :class="readonly ? 'text-item' : ''"
        >
          <div v-if="readonly">
            <div style="color: var(--text-color); font-size: 12px">
              {{ step3Frm.seal_type === 2 ? '是' : step3Frm.seal_type === 1 ? '否' : '--' }}
            </div>
          </div>
          <div v-else style="display: flex; align-items: center">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="step3Frm.seal_type"
              placeholder="请选择"
              style="width: 108px"
              :style="{ marginLeft: readonly && !isFromMarketing ? '10px' : '0px' }"
              :disabled="readonly"
            >
              <el-option :key="2" :value="2" label="是"></el-option>
              <el-option :key="1" :value="1" label="否"></el-option>
            </el-select>
            <div class="upload-tips">选"是"财务确认结算单后，系统自动发起结算单盖章流程。</div>
          </div>
        </el-form-item>
        <el-form-item
          label="关联合同："
          :prop="readonly || settlement.is_estimate ? '' : 'contract_id'"
          label-width="72px"
          :class="readonly ? 'text-item' : ''"
        >
          <div v-if="readonly">
            <div
              class="contract-div"
              v-if="step3Frm.contract_id && contract_info.sign_type_name"
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
            <div v-else>--</div>
          </div>
          <div v-else style="display: flex; align-items: center">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="step3Frm.contract_id"
              filterable
              remote
              reserve-keyword
              clearable
              :placeholder="
                readonly ? '--' : contract_id_list.length < 1 ? '暂无有效合同' : '请选择合同'
              "
              :remote-method="getContract"
              style="width: 520px"
              :style="{ marginLeft: readonly && !isFromMarketing ? '10px' : '0px' }"
              @change="val => selectContractUidChange(val)"
              :disabled="readonly"
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
    </template>
    <template #button v-if="!readonly">
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="submit">提交</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep3Layout>
</template>

<script src="./step3.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.settlement-step3-marketing.step3-layout {
  &.marketing-settlement {
    .step3-layout-content {
      height: 530px;
    }
  }
  > .step3-layout-content {
    grid-template-rows: 118px 250px auto;
    .step3-layout-content-left > .card-layout,
    .step3-layout-content-right > .card-layout {
      height: 250px;
    }
    .settlement-uploaded-files-container {
      display: flex;
      // column-gap: 12px;
      align-items: flex-start;
      line-height: 28px;
      // margin-left: 66px;
      .settlement-uploaded-lbl {
        font-size: 12px;
        width: 80px;
        flex: none;
        .ta-rt();
      }
      .settlement-uploaded-files {
        display: inline-grid;
        flex: auto;
        margin-bottom: 4px;
      }
    }
  }
}

.settlement-step3-marketing {
  .income-amount {
    .fc(14px, var(--text-third-color));
    line-height: 18px;
    span:first-child {
      font-size: var(--default-font-size);
    }
  }
  .adjust-info-total-lbl {
    .fc(var(--default-font-size), var(--text-third-color));
    line-height: 16px;
  }
  .adjust-info-total-amount {
    .fc(var(--small-font-size), var(--text-color));
    line-height: 18px;
    .mgt(6px);
  }
  .adjust-info-line {
    width: 250px;
    height: 1px;
    border-top: 1px dashed rgba(var(--tip-icon-rgb-color), 0.3);
    .mg(12px 0);
  }
  .adjust-info-list {
    display: grid;
    row-gap: 12px;
    > .adjust-info-item {
      .fc(12px, var(--text-third-color));
      line-height: 16px;
    }
  }

  .upload-tips {
    .d-ib();
    .fc(12px, var(--text-third-color));
    line-height: 16px;
    .mgl(8px);
  }
  .form-item-settlement-files {
    width: 100%;
    min-width: 620px;
    display: flex;
    align-items: center;
    > .el-form-item__label {
      flex: none;
    }
    > .el-form-item__content {
      flex: auto;
      display: flex;
      align-items: center;
      width: max-content;
      margin-left: 0 !important;
      color: var(--text-color);
    }
    .form-item-content {
      display: flex;
      align-items: center;
      width: max-content;
    }
  }
}
</style>
<style lang="less" scoped>
/deep/ .step3-layout-content.col-2 {
  grid-template-areas:
    '. top top .'
    '. left right .'
    'files files files files';
  grid-template-columns: auto repeat(2, 286px) auto;
}
/deep/ .step3-layout-content-files {
  width: 640px;
  align-items: center;
  margin: 0 auto;
}
.settlement-step3-marketing.step3-layout {
  // &.is_estimate {
  //   /deep/ .step3-layout-content {
  //     height: 540px;
  //     grid-template-rows: 118px 350px 0px !important;
  //     .step3-layout-content-left > .card-layout,
  //     .step3-layout-content-right > .card-layout {
  //       height: 350px;
  //     }
  //   }
  // }
}
.settlement-step3-marketing {
  /deep/.el-form {
    .el-form-item .el-form-item__label {
      padding-right: 0 !important;
    }
  }
  .el-form-item__content {
    color: var(--text-color);
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
