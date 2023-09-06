<template>
  <tg-card
    class="tg-marketing-project-tab-achievement flex-none"
    @rect:update="onRectUpdate"
    v-bind="cardProps"
  >
    <div class="btns-line">
      <label>应收金额：</label>
      <span class="cost-headers-sumary-value">{{ moneyFormat(statInfo.receivable) }}</span>
      <label>已核销金额：</label>
      <span class="cost-headers-sumary-value">{{ moneyFormat(statInfo.write_off) }}</span>
      <label>未核销金额：</label>
      <span class="cost-headers-sumary-value">{{ moneyFormat(statInfo.not_write_off) }}</span>
      <div class="reverse-div">
        <el-checkbox @change="reloadData" v-model="isHideReversed" size="small">
          <span>隐藏已冲销数据</span>
        </el-checkbox>
      </div>
    </div>
    <!-- <div v-if="Permission.canViewList" class="table-container"> -->
    <el-table
      stripe
      border
      v-if="Permission.canViewList"
      :data="data"
      v-loading="loading"
      v-bind="tableProps"
    >
      <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
      <template #empty>
        <empty-common detail-text="暂无数据"></empty-common>
      </template>
    </el-table>
    <!-- </div> -->
    <el-dialog
      class="tg-dialog-classic"
      title="发票详情"
      width="440px"
      height="600px"
      :visible="invoiceDialogVisible"
      @close="closeInvoiceDialog"
    >
      <div class="incoice-dialog-content">
        <div class="incoice-item" v-for="(item, itemIndex) in invoices" :key="itemIndex">
          <div class="item-name">凭证{{ itemIndex + 1 }}</div>
          <div class="item-pic" @click="showInvoicePic(item.pic_url)">
            <img :src="item.pic_url" :alt="item.institution" loading="lazy" />
          </div>
          <div class="item item-num">
            <label>发票号码：</label>
            <span>{{ item.invoice_num || '--' }}</span>
          </div>
          <div class="item item-date">
            <label>开票日期：</label>
            <span>{{ item.invoice_date || '--' }}</span>
          </div>
          <div class="item item-amount">
            <label>开票金额：</label>
            <span>{{ item.amount || '--' }}</span>
          </div>
          <div class="item item-institution line-clamp-1">
            <label>开票公司：</label>
            <span>{{ item.institution || '--' }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-drawer
      v-if="Permission.canChange"
      :title="drawerTitle"
      height="100vh"
      :size="520"
      :visible="drawerVisible"
      :wrapperClosable="false"
      @close="closeDrawer"
    >
      <div class="achievement-drawer-content" style="padding-top: 18px">
        <DrawerHeader title="客户信息" />
        <DrawerCustomer
          :customerName="shop_name"
          :customerManager="manager_name"
          :companyName="company_name"
        />
        <div class="mgt-18"></div>
        <DrawerHeader title="业绩信息" />
        <div style="padding: 0 30px">
          <el-form
            ref="formRef"
            class="el-form-vertical"
            :model="archievement_form"
            :rules="formRules"
            style="padding: 0"
          >
            <el-form-item label="业绩名称" prop="achievement_name">
              <el-input
                size="small"
                :maxlength="15"
                v-model.trim="archievement_form.achievement_name"
                placeholder="请输入业绩名称"
              />
            </el-form-item>
            <el-form-item label="收款类型" prop="gather_type">
              <el-radio-group
                v-model="archievement_form.gather_type"
                style="width: 100%; height: 32px; line-height: 32px"
              >
                <el-radio v-for="opt in gatherTypeOptions" :label="opt.value" :key="opt.value">{{
                  opt.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="关联合同" prop="contract_id">
              <el-select
                size="small"
                placeholder="请输入并选择合同编号"
                v-model.trim="contract_uid"
                filterable
                remote
                clearable
                @change="onContractChange"
                :remote-method="onContractSearch"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, key) in contract_list"
                  :key="key"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="收款金额" prop="gather_amount">
              <el-input
                size="small"
                v-model.trim="archievement_form.gather_amount"
                @input="onInputGatherAmount"
                placeholder="请输入收款金额"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="收款方式" prop="gather_way" style="margin-bottom: 6px">
              <el-radio-group
                v-model="archievement_form.gather_way"
                style="width: 100%; height: 32px; line-height: 32px"
              >
                <el-radio v-for="opt in gatherWayOptions" :label="opt.value" :key="opt.value">{{
                  opt.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- [V任务] -->
            <template v-if="archievement_form.gather_way === 1">
              <div class="form-inner-block">
                <el-form-item label="V任务ID" prop="task_id">
                  <el-input
                    size="small"
                    :maxlength="50"
                    v-model.trim="archievement_form.task_id"
                    placeholder="请输入V任务ID"
                  />
                </el-form-item>
                <el-form-item label="下单旺旺名" prop="order_wangwang_id">
                  <el-input
                    size="small"
                    :maxlength="50"
                    v-model.trim="archievement_form.order_wangwang_id"
                    placeholder="请输入下单旺旺名"
                  />
                </el-form-item>
                <el-form-item label="接单日期" prop="order_date">
                  <el-date-picker
                    placeholder="请选择接单日期"
                    v-model="archievement_form.order_date"
                    type="date"
                    size="small"
                    value-format="yyyy-MM-dd"
                    format="yyyy.MM.dd"
                    style="width: 240px"
                  />
                </el-form-item>
              </div>
            </template>
            <template v-else>
              <div class="form-inner-block">
                <el-form-item
                  label="打款公司"
                  prop="pay_company_name"
                  style="grid-column-start: 1; grid-column-end: 3"
                >
                  <el-input
                    size="small"
                    :maxlength="50"
                    v-model.trim="archievement_form.pay_company_name"
                    placeholder="请输入打款公司"
                  />
                </el-form-item>
              </div>
            </template>
            <!-- [支付宝] -->
            <!-- [对公银行] -->
            <el-form-item label="收款凭证" prop="gather_certificate_pic" style="margin-top: 18px">
              <div class="pic-container">
                <Upp
                  action=""
                  :value="archievement_form.gather_certificate_pic"
                  :http-request="uploadAttachmenFile"
                  @remove="onPicRemove"
                />
                <span class="tips">支持扩展名：.jpg .jpeg .png</span>
              </div>
            </el-form-item>
            <el-form-item label="是否开票" prop="is_invoice">
              <el-radio-group
                v-model="archievement_form.is_invoice"
                style="width: 100%; height: 32px; line-height: 32px"
              >
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="el-drawer-footer">
        <tg-button @click="closeDrawer">取消</tg-button>
        <tg-button type="primary" @click="onSubmit">保存</tg-button>
      </div>
    </el-drawer>
    <InvoiceDetail ref="dialogRef" />
    <TgMaskLoading content="正在提交业绩，请稍候..." :visible="submitLoading" />
    <TgMaskLoading content="正在删除业绩，请稍候..." :visible="deleteLoading" />
    <first-step ref="firstStepRef" @submit="reloadData" />
  </tg-card>
</template>

<script src="./achievement_receivable.ts"></script>

<style lang="less">
@import './achievement.less';
.tg-marketing-project-tab-achievement {
  .reverse-div {
    display: inline-block;
    margin-bottom: 0;
    .el-checkbox__input {
      margin-top: -1px;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1px;
          width: 3px;
          height: 6px;
          left: 3.5px;
        }
      }
    }
  }
  a,
  .status {
    font-size: 12px;
  }
  .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 130px;
      text-align: left;
      margin-right: -25px;
    }
  }
}
</style>
