<template>
  <SettlementStep3Layout
    class="settlement-step3-marketing settlement-income-limit"
    :amount="total_settle_amount"
    :class="settlement.is_estimate === 1 ? 'is_estimate' : ''"
  >
    <template #top>
      <top-card
        :is_cost="false"
        :amount="total_settle_amount"
        :taxed="DataForm.is_include_tax"
        :invoice_type="DataForm.invoice_type"
        :tax_rate="DataForm.tax_rate"
        :name="DataForm.company_name"
        type="value2"
      ></top-card>
    </template>
    <template #left>
      <CardLayout>
        <template #title>收入信息</template>
        <!-- <template #desc>收入=实际填写收入</template> -->
        <div class="income-amount">
          <span>服务费</span>
          <span style="font-weight: 600">&nbsp;{{ income_amount }}&nbsp;元</span>
        </div>
      </CardLayout>
    </template>
    <template #right>
      <CardLayout>
        <template #title>手工调账</template>
        <div class="adjust-info-content">
          <div class="adjust-info-total">
            <div class="adjust-info-total-lbl">调账 {{ adjust_info.length }} 笔</div>
            <div class="adjust-info-total-amount">
              共&nbsp;{{ adjust_info_amount_total }}&nbsp;元
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
      <el-form size="mini" :model="step3Frm" :rules="step3FrmRules" ref="step3FrmRef">
        <el-form-item label="结算单：" prop="settlement_files" label-width="76px">
          <div style="display: flex; align-items: center">
            <el-upload
              v-model="step3Frm.settlement_files"
              action="/"
              :multiple="false"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadFileHandler"
              accept=".docx,.pdf,.jpg,.jpeg,.png,.xlsx,.xls"
              :disabled="isFileUploaderDisabled"
              style="width: 100px"
            >
              <tg-button class="upload-btn" icon="ico-btn-upload" :disabled="isFileUploaderDisabled"
                >上传文件</tg-button
              >
            </el-upload>
            <div
              style="
                display: inline-block;
                height: 16px;
                line-height: 16px;
                font-size: 12px;
                margin-left: 6px;
                color: var(--text-third-color);
              "
            >
              支持 .docx .pdf .jpg .png .xlsx .xls,最多上传5个文件(单个文件大小不超过30M)
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div
        class="settlement-uploaded-files"
        v-if="step3Frm.settlement_files && step3Frm.settlement_files.length > 0"
        style="margin-top: -5px; padding-bottom: 15px; margin-bottom: 0"
      >
        <template v-for="(item, index) in step3Frm.settlement_files">
          <FileItem
            :showPreview="settlement.status !== 0"
            :key="index"
            :filepath="item"
            @remove="onRemoveFile(index)"
          />
        </template>
      </div>
      <el-form
        size="mini"
        style="margin-top: 0"
        :model="step3Frm"
        :rules="step3FrmRules"
        ref="step3FrmSecondRef"
      >
        <!-- <el-form-item
          prop="seal_type"
          label="是否盖章："
          :style="{ marginBottom: readonly ? '2px' : '12px' }"
          label-width="76px"
        >
          <div v-if="readonly">
            <div style="color: var(--text-color)">{{ step3Frm.seal_type  || '否' }}</div>
          </div>
          <div v-else style="display: flex; align-items: center">
            <el-select
              v-model="step3Frm.seal_type"
              placeholder="请选择"
              size="medium"
              style="width: 117px"
              :style="{ marginLeft: readonly && !isFromMarketing ? '10px' : '0px' }"
              :disabled="readonly"
            >
    <el-option :key="2" :value="2" label="是"></el-option>
              <el-option :key="1" :value="1" label="否"></el-option>
            </el-select>
            <div class="upload-tips">选"是"财务确认结算单后，系统自动发起结算单盖章流程。</div>
          </div>
        </el-form-item>-->
        <el-form-item
          label="关联合同："
          :prop="step3Frm.seal_type === 2 ? 'contract_id' : ''"
          style="margin-bottom: 30px"
          label-width="76px"
        >
          <div style="display: flex; align-items: center">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="step3Frm.contract_id"
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
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="submit">提交</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep3Layout>
</template>

<script src="./step3.marketing.ts"></script>

<style lang="less" scoped>
/deep/ .step3-layout-content.col-2 {
  grid-template-areas:
    '. top top .'
    '. left right .'
    'files files files files';
  grid-template-columns: auto repeat(2, 286px) auto;
}
.income-amount {
  font-size: 14px;
  color: var(--text-color);
  line-height: 18px;
  span:first-child {
    font-size: 12px;
  }
}
.settlement-step3-marketing.settlement-income-limit {
  .settlement-uploaded-files {
    padding-left: 80px;
  }
  // &.is_estimate {
  //   /deep/ .step3-layout-content {
  //     grid-template-rows: 118px 350px 50px !important;
  //     .step3-layout-content-left > .card-layout,
  //     .step3-layout-content-right > .card-layout {
  //       height: 350px;
  //     }
  //   }
  // }
}
/deep/ .step3-layout-content-files {
  width: 640px;
  align-items: center;
  margin: 0 auto;
}
.adjust-info-total-amount {
  font-weight: 600;
}
</style>
