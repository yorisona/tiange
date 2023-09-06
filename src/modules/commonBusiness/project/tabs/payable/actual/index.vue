<template>
  <tg-card
    class="tg-common-business-tab-payable-need flex-auto"
    @rect:update="onRectUpdate"
    v-bind="cardProps"
  >
    <div class="btns-line mgb-12 mgt-12">
      <!--      <tg-button-->
      <!--        v-if="Permission.common_business_project_registration_cost"-->
      <!--        class="mgr-18"-->
      <!--        type="primary"-->
      <!--        icon="ico-btn-add"-->
      <!--        @click="handleAddEventAction"-->
      <!--        >登记成本</tg-button-->
      <!--      >-->
      <label>登记付款：</label>
      <span>{{ formatAmount(info.total_pay_amount) }}</span>
      <label>已付款：</label>
      <span>{{ formatAmount(info.paid_amount) }}</span>
      <label>待付款：</label>
      <span>{{ formatAmount(info.wait_pay_amount) }}</span>
      <label>已核销金额：</label>
      <span>{{ formatAmount(info.write_off_amount) }}</span>
      <label>未核销金额：</label>
      <span>{{ formatAmount(info.not_write_off_amount) }}</span>
      <div class="reverse-div">
        <el-checkbox @change="reload" v-model="isHideReversed" size="small">
          <span>隐藏已冲销数据</span>
        </el-checkbox>
      </div>
    </div>
    <!-- <div class="table-container"> -->
    <el-table
      stripe
      border
      :data="list"
      v-loading="loading"
      v-bind="tableProps"
      @row-click.self="onRowClick"
      :cell-style="{ cursor: 'pointer' }"
    >
      <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      <div v-if="false">
        <el-table-column align="left" label="付款ID" min-width="100">
          <template slot-scope="scope">
            <div :class="scope.row.reversed_id ? 'reverse-red' : ''">
              {{ scope.row.uid }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" label="打款金额" min-width="140">
          <!-- <template slot="header">
            <div class="cell-price-max">打款金额</div>
          </template> -->
          <template slot-scope="scope">
            <div :class="scope.row.reversed_id ? 'reverse-red cell-price-max' : 'cell-price-max'">
              {{ numberMoneyFormat(scope.row.pay_amount, 2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成本类型" min-width="108">
          <!-- <template slot="header">
            <div class="cell-price-max">打款金额</div>
          </template> -->
          <template slot-scope="scope">
            <div :class="scope.row.new_cost_type === 9 ? 'reverse-red' : ''">
              {{ costTypeName(scope.row.new_cost_type) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用款日期" min-width="100">
          <template slot-scope="scope">{{ scope.row.transfer_date }}</template>
        </el-table-column>
        <el-table-column align="left" label="收款方信息" min-width="262">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="label-50">名称：</p>
              <el-popover
                v-if="scope.row.pay_way_detail.name && scope.row.pay_way_detail.name.length > 12"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.pay_way_detail.name"
              >
                <p slot="reference" class="line-clamp-1 customer-name" style="width: 195px">
                  {{ scope.row.pay_way_detail.name }}
                </p>
              </el-popover>
              <p v-else class="customer-name">
                {{ fillEmptyStr(scope.row.pay_way_detail.name) }}
              </p>
            </div>
            <div class="line-info">
              <p class="label-50">方式：</p>
              <p v-if="scope.row.pay_way === 1">银行卡</p>
              <p v-else-if="scope.row.pay_way === 2">v任务</p>
              <p v-else-if="scope.row.pay_way === 3">对公银行</p>
              <p v-else-if="scope.row.pay_way === 4">支付宝</p>
              <p v-else>--</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="付款事由" min-width="204">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.pay_reason && scope.row.pay_reason.length > 25"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.pay_reason"
            >
              <p slot="reference" class="line-clamp-2" style="width: 195px">
                {{ scope.row.pay_reason }}
              </p>
            </el-popover>
            <p v-else style="width: 195px">
              {{ fillEmptyStr(scope.row.pay_reason) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发票" min-width="66">
          <template slot-scope="scope">
            <p v-if="scope.row.is_invoice === 0">未开票</p>
            <el-button
              v-else
              type="text"
              class="button-item"
              @click="showInvoice(scope.row.invoice_info)"
              >查看</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="right" label="税点金额" min-width="140">
          <!-- <template slot="header">
            <div class="cell-price-max">税点金额</div>
          </template> -->
          <template slot-scope="scope">
            <div class="cell-price-max">{{ numberMoneyFormat(scope.row.tax_point, 2) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="财务确认信息" min-width="170">
          <template slot-scope="scope">
            <template v-if="scope.row.pay_type === 2">--</template>
            <template v-else>
              <div v-if="scope.row.is_pay === 0">待打款</div>
              <template v-else>
                <div class="line-info">
                  <p class="label-70">状态：</p>
                  <p>已打款</p>
                </div>
                <div class="line-info">
                  <p class="label-70">打款日期：</p>
                  <p>
                    {{ scope.row.pay_date.replace(/-/g, '.') }}
                  </p>
                </div>
                <div class="line-info">
                  <p class="label-70">凭证：</p>
                  <el-button
                    type="text"
                    class="button-item"
                    @click="showCertificatePic(scope.row.pay_certificate_pic)"
                    >查看</el-button
                  >
                </div>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="left" label="核销状态" min-width="122">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="label-50">状态：</p>
              <p v-if="scope.row.write_off_status === 2" class="write-on">已核销</p>
              <p v-else-if="scope.row.write_off_status === 1" class="write-off">部分核销</p>
              <p v-else class="write-off">未核销</p>
            </div>
            <div v-if="scope.row.write_off_infos.length > 0" class="line-info">
              <p class="label-50">详情：</p>
              <write-list-pop
                :list="scope.row.write_off_infos"
                :type="scope.row.pay_type === 2 ? 'receive' : 'commonBusinessPayableActual'"
              ></write-list-pop>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="冲销状态" min-width="122" align="center">
          <template slot-scope="scope">
            <div style="color: #ff7a36" v-if="scope.row.reverse_status === 1">待确认</div>
            <div style="color: var(--success-color)" v-else-if="scope.row.reverse_status === 2">
              已确认
            </div>
            <div style="color: var(--error-color)" v-else-if="scope.row.reverse_status === 3">
              退回
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="录入人/日期" min-width="102">
          <template slot-scope="scope">
            <div>
              <p slot="reference">
                {{ scope.row.add_by }}
              </p>
              <p class="color-a4b2c2">
                {{ fillEmptyStr(scope.row.add_date) }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="188">
          <template slot-scope="scope">
            <!-- 冲销单 -->
            <div v-if="scope.row.reversed_id">
              <el-button
                v-if="scope.row.reverse_status !== 3"
                type="text"
                class="button-item"
                @click="handleViewReserveReason(scope.row)"
                >查看</el-button
              >

              <el-button
                v-if="scope.row.reverse_status === 3"
                type="text"
                class="button-item mgr-12"
                @click="delCost(scope.row.cost_id, '是否删除该冲销单')"
                style="width: auto; border: none"
                >删除</el-button
              >
              <el-button
                v-if="scope.row.reverse_status === 3"
                type="text"
                class="button-item mgr-12"
                style="width: auto; border: none"
                @click="handleReserve(scope.row, true)"
                >重新提交</el-button
              >
              <el-button
                v-if="scope.row.reverse_status === 3"
                type="text"
                class="button-item"
                style="width: auto; border: none"
                @click="handleViewReserveBackReason(scope.row)"
                >退回原因</el-button
              >
            </div>
            <!-- 非冲销单 -->
            <div v-else>
              <el-button
                v-if="scope.row.is_pay === 1 && !scope.row.reverse_id"
                type="text"
                class="button-item-reverse"
                @click="handleReserve(scope.row, false)"
                >冲销</el-button
              >
              <el-button
                v-if="
                  scope.row.write_off_status !== 2 &&
                  scope.row.is_pay === 1 &&
                  scope.row.pay_type === 1 &&
                  business_type !== 4 &&
                  Permission.common_business_write_off &&
                  !scope.row.reverse_id
                "
                type="text"
                class="button-item"
                style="margin-left: 12px"
                @click="handleWriteOff(scope.row)"
                >核销</el-button
              >
              <template v-if="scope.row.is_pay !== 1 && scope.row.add_by_id === userInfo.id">
                <el-button
                  type="text"
                  class="button-item"
                  style="margin-right: 12px"
                  @click="editCost(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  class="button-item"
                  @click="delCost(scope.row.cost_id, `确认删除该成本？`)"
                  >删除</el-button
                >
              </template>
            </div>
            <tg-button
              v-if="
                scope.row.is_pay && scope.row.pay_type !== 2 && scope.row.reverse_status === null
              "
              type="link"
              @click="
                () => {
                  payRefundVisible = true;
                }
              "
              >退款</tg-button
            >
          </template>
        </el-table-column>
      </div>
      <template #empty>
        <empty-common detail-text="暂无数据"></empty-common>
      </template>
    </el-table>
    <!-- </div> -->
    <payable-actual
      v-if="shouldVisible"
      :visible="shouldVisible"
      @closeAction="handleCloseAction"
      :title="title"
      :data="dialogData"
      @saveSubmit="handleSucceedAction"
    ></payable-actual>
    <invoice-list ref="invoicelistRef"></invoice-list>
    <first-step ref="firstStepRef" @submit="getList" />
    <finance-invoice-detail-dialog
      :visible="invoiceShow"
      :list="invoiceList"
      @closeFinanceInvoiceDetailAction="closeInvoice"
    />
    <reverseOrderDialog ref="reverseOrderDialogRef" />
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter"
      :visible="reasonVisible"
      width="440px"
      @close="onReasonDialogClose"
    >
      <template #title>{{ reasonTitle }}</template>
      <div class="reason-dialog-content">{{ reason }}</div>
    </el-dialog>
    <tg-mask-loading :visible="writeOffLoading" content="正在提交冲销，请稍候..." />
    <tg-mask-loading :visible="saveLoading" content="正在保存，请稍候..." />
    <pay-refund
      :rawAmount="payRefundAmout"
      :visible.sync="payRefundVisible"
      :costId="payRefundCostId"
      :dialogData="payRefundData"
      @save="onPayRefundSave"
    ></pay-refund>
    <refund-write-off
      type="receive"
      :projectType="3"
      :visible.sync="refundWriteOffVisible"
      :notWriteOffAmount="notRefundWriteOffAmount"
      :invoiceId="refundWriteoffId"
      :costId="refundWriteoffCostId"
      @save="onRefundWriteOffSave"
    ></refund-write-off>
    <LoanfinanceDetailModal
      v-if="loanDetailVisible"
      :visible="loanDetailVisible"
      :detail-data="detail_data"
      @dialog:closerow="onLoanDetailClose"
    />
  </tg-card>
</template>
<script src="./index.ts"></script>
<style lang="less">
@import '../index.less';
.tg-common-business-tab-payable-need {
  .reverse-div {
    display: inline-block;
    margin-bottom: 0;
    .el-checkbox__input {
      margin-top: 0;
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &::after {
          top: 1.5px;
          width: 3px;
          height: 6px;
          left: 4px;
        }
      }
    }
  }
  .el-table {
    a,
    .cell,
    .status {
      font-size: 12px;
    }
    .tg-button {
      margin-right: 10px;
    }
  }
}
</style>
