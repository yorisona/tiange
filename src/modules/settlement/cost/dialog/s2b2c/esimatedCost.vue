<!--
 * @Brief: 结算数据-拆分后
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-07 10:03:49
-->

<template>
  <SettlementStep2Layout
    class="tg-cost-s2b2c-douyin-step2-after-container"
    :amount="total_amount_str"
    :douyinS2b2cSelf="true"
  >
    <template #top>
      <top-card
        :amount="total_amount + ''"
        type="value1"
        :tax_rate_disabled="false"
        :tax_rate="DataForm.tax_rate"
        :invoice_type="DataForm.invoice_type"
        @taxRateChanged="taxRateChanged"
        @invoiceTypeChanged="invoiceTypeChangedHandler"
        @valueChange="taxValueChangeHandler"
      ></top-card>
    </template>
    <template #left>
      <CardLayout class="cost-info" :padding="[0, 20]">
        <template #title>
          <span>成本信息</span>
        </template>
        <template>
          <div class="amount-info-list">
            <div class="company">
              <span class="label">达人：</span>
              <b class="liver">{{ dataJson.kol_name }}</b>
              <span class="company-name">{{ dataJson.company_name }}</span>
              <tg-icon class="edit" name="ico-icon_bianji" @click="dialogCompany.show()" />
            </div>
            <div class="fee-description">达人收入</div>
            <div class="kol-form">
              <div class="form-item">
                <span class="label">机构佣金：</span>
                <span class="value"
                  >{{ formatAmountWithoutPrefix(dataJson.institution_commission_amount) }}元</span
                >
              </div>
              <div class="form-item" v-if="settlement.is_estimate">
                <span class="label">退货率：</span>
                <span class="value">{{
                  dataJson.refund_rate === null ? '--' : `${dataJson.refund_rate}%`
                }}</span>
              </div>
              <div class="form-item">
                <span class="label">达人分成比例：</span>
                <span class="value">{{ formatAmountWithoutPrefix(dataJson.kol_divide) }}%</span>
              </div>
              <div class="form-item">
                <span class="label">达人佣金：</span>
                <span class="value"
                  >{{ formatAmountWithoutPrefix(dataJson.commission_amount) }}元</span
                >
              </div>
              <div class="form-item">
                <span class="label">其他收入：</span>
                <el-input
                  @input="value => getIncomeAmountNumber(value)"
                  v-model="dataJson.other_income_amount"
                  style="width: 166px"
                  placeholder="请输入金额"
                  ><span slot="append">元</span></el-input
                >
              </div>
              <div class="form-item" style="display: flex; justify-content: flex-start">
                <span class="label">账单文件：</span>
                <div class="down-file" style="line-height: 24px">
                  <tg-icon class="icon" name="ico-excel" />
                  <div class="name">{{ fileName }}</div>
                  <tg-icon
                    name="ico-xiazai"
                    class="down-icon"
                    @click="downFile(dataJson.file)"
                  ></tg-icon>
                </div>
              </div>
            </div>
            <div class="fee-description">扣除项</div>
            <div class="kol-form">
              <div
                class="form-item"
                v-for="(item, index) in dataJson.kol_cost_share"
                :key="item.expense_type_name + index"
              >
                <span class="label">{{ item.expense_type_name }}：</span>
                <el-input
                  v-model="item.amount"
                  @input="value => getAdjustAmountNumber(value, index)"
                  style="width: 166px"
                  maxlength="13"
                  placeholder="请输入金额"
                  ><span slot="append">元</span></el-input
                >
              </div>
            </div>
            <div class="fee-description">扣税调整</div>
            <div class="kol-form" style="margin-bottom: 32px">
              <div class="form-item">
                <span class="label">发票税率：</span>
                <span class="value">{{ dataJson.invoice_tax_rate }}%</span>
              </div>
              <div class="form-item">
                <span class="label">调整金额：</span>
                <span class="value">{{ adjustmentAmount }}元</span>
              </div>
            </div>
          </div>
        </template>
        <el-dialog
          class="tg-dialog-classic el-dialog-center-rewrite"
          width="300px"
          :visible="dialogCompany.visible"
          :append-to-body="true"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :wrapperClosable="false"
          @close="dialogCompany.close"
          title="更换公司"
        >
          <el-form size="mini" label-width="76px" :model="dialogCompany.form">
            <div class="dialog_change_company">
              <el-form-item label="选择公司">
                <el-select
                  popper-class="el-select-popper-mini"
                  style="margin-left: 12px"
                  v-model="dialogCompany.form.company"
                  filterable
                  remote
                  :remote-method="dialogCompany.remoteMethod"
                  placeholder="请输入公司名"
                >
                  <el-option
                    v-for="item in dialogCompany.options"
                    :key="item.id"
                    :label="item.company_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <template slot="footer" style="height: 50px">
            <tg-button @click="dialogCompany.close"> 取消</tg-button>
            <tg-button type="primary" @click="dialogCompany.submit"> 确定 </tg-button>
          </template>
        </el-dialog>
      </CardLayout>
    </template>
    <template #right>
      <el-form @submit.native.prevent size="small">
        <TgAdjustAccountForm
          :adjust_info="DataForm.adjust_info"
          @dataChange="onAdjustAccountDataChange"
        />
      </el-form>
    </template>

    <template #button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    </template>
  </SettlementStep2Layout>
</template>

<script src="./esimatedCost.ts"></script>

<style lang="less">
@charset 'utf-8';

.tg-cost-s2b2c-douyin-step2-after-container {
  .step2-cost-layout-content {
    grid-template-rows: 118px 420px !important;
  }
  .adjust-account-content {
    grid-template-rows: 44px 316px !important;
  }
  .cost-info {
    .amount-info-list {
      color: var(--text-third-color);
      .company {
        margin-top: 18px;
        font-size: 12px;
        .label {
          line-height: 24px;
        }
        .liver {
          font-weight: 600;
          font-size: 12px;
          color: var(--text-color);
          padding-right: 12px;
        }
        .edit {
          font-size: 16px;
          cursor: pointer;
          margin-left: 12px;
          vertical-align: sub;
          height: 18px;
          padding-top: 4px;
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
      font-size: 12px;
      margin-bottom: 8px;
      .el-input__inner {
        height: 28px;
        line-height: 26px;
        font-size: 12px;
      }
      .el-input-group__append {
        font-size: 12px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      & .label {
        display: inline-block;
        width: 100px;
        text-align: right;
        color: var(--text-second-color);
      }
      & .value {
        color: var(--text-color);
      }
      & .down-file {
        display: inline-flex;
        align-items: center;
        & .name {
          margin: 0 12px 0 6px;
          color: var(--text-color);
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
}
.dialog_change_company {
  padding: 18px 0 0 0;

  /deep/ .el-form-item__label {
    padding-right: 12px;
  }
}
</style>
