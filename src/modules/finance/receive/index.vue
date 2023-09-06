<template>
  <div class="finance-receive-page flex-auto">
    <tg-card class="flex-none" :padding="[16, 0, 16, 16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="60px"
      >
        <el-form-item label="业务类型：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.business_type"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option
              :key="key"
              :label="item.label"
              :value="item.value"
              v-for="(item, key) in BusinessTypeOptions"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收款类型：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.gather_type"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="佣金" :value="2" />
            <el-option label="服务费" :value="1" />
            <!-- <el-option label="其他" :value="3" /> -->
            <el-option label="退款" :value="5" />
            <el-option label="预收款" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="需要开票：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.is_invoice"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="是" :value="1" />
            <el-option label="否" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="发票上传：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.has_invoice_certificate"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="已上传" :value="1" />
            <el-option label="未上传" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款状态：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.is_gather"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="已收款" :value="1" />
            <el-option label="未收款" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款方式：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.gather_way"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="支付宝" :value="2" />
            <el-option label="V任务" :value="1" />
            <el-option label="对公银行" :value="3" />
            <el-option label="阿里妈妈" :value="4" />
            <el-option label="巨量百应" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="核销状态：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.write_off_status"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="已核销" :value="2" />
            <el-option label="部分核销" :value="1" />
            <el-option label="未核销" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款搜索：" class="form-item-group" @keypress.enter.native="getList">
          <el-input
            placeholder="请输入关键字"
            v-model.trim="queryForm.search_value"
            maxlength="100"
            clearable
            class="input-with-select"
            style="width: 244px"
          >
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请选择"
              v-model="queryForm.search_type"
              style="width: 100px; padding-left: 6px"
              slot="prepend"
            >
              <el-option label="收款编号" :value="1" />
              <el-option label="业绩名称" :value="2" />
              <el-option label="项目编号" :value="3" />
              <el-option label="客户经理" :value="4" />
              <el-option label="客户名称" :value="5" />
              <el-option label="项目名称" :value="6" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="日期选择：" class="flex-form-item-time">
          <el-select
            popper-class="el-select-popper-mini"
            placeholder="请选择"
            v-model="queryForm.query_date_type"
            class="time-select-type"
            style="width: 100px"
          >
            <el-option label="收款时间" :value="1" />
            <el-option label="登记时间" :value="2" />
          </el-select>
          <el-date-picker
            v-model="queryForm.pay_date"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            class="time-select-box"
          />
        </el-form-item>
        <el-form-item label="账期时间：" class="flex-form-item">
          <el-date-picker
            v-model="queryForm.account_month"
            type="month"
            placeholder="请选择月份"
            format="yyyy.MM"
            value-format="yyyy-MM"
            class="time-select-box"
            style="width: 192px"
          />
        </el-form-item>
        <el-form-item label-width="0" style="margin-right: 20px">
          <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
          <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-10"
      :class="cardFlexClass"
      :padding="[12, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div class="main-header">
        <tg-button
          v-if="permission.gathering_export"
          type="default"
          icon="ico-btn-export"
          @click="exportBtnClick"
          >导出</tg-button
        >
        <div class="header">
          <div class="item">
            <span class="label">已收款笔数：</span>
            <span class="text">{{
              statistics && numberFormat(statistics.count_confirmed_gather_amount, 0)
            }}</span>
          </div>
          <div class="item">
            <span class="label">已收款金额：</span>
            <span class="text">{{
              statistics && numberMoneyFormat(statistics.sum_confirmed_gather_amount, 2)
            }}</span>
          </div>
          <div class="item">
            <span class="label">待确认笔数：</span>
            <span class="text gold">{{
              statistics && numberFormat(statistics.count_unconfirmed_gather_amount, 0)
            }}</span>
          </div>

          <div class="item">
            <span class="label">待确认金额：</span>
            <span class="text gold">{{
              statistics && numberMoneyFormat(statistics.sum_unconfirmed_gather_amount, 2)
            }}</span>
          </div>
        </div>
      </div>
      <!--      v-bind="tableProps"-->
      <el-table
        class="mgt-12"
        stripe
        border
        :data="list"
        v-loading="loading"
        v-bind="tableProps"
        @row-click.self="onRowClick"
      >
        <el-table-column v-for="(item, itemIndex) in columns" v-bind="item" :key="itemIndex" />
        <el-table-column label="收款类型" min-width="86" align="center">
          <template slot-scope="scope">
            <div
              :class="
                String(scope.row.reversed_id || '') === '' &&
                String(scope.row.reverse_id || '') === ''
                  ? ''
                  : 'reverse-red'
              "
            >
              <div v-if="scope.row.gather_type === 1">服务费</div>
              <div v-else-if="scope.row.gather_type === 2">佣金</div>
              <div v-else-if="scope.row.gather_type === 3">其他</div>
              <div v-else-if="scope.row.gather_type === 4" class="reverse-red">冲销</div>
              <div v-else-if="scope.row.gather_type === 5">退款</div>
              <div v-else-if="scope.row.gather_type === 6">预收款</div>
              <div v-else>--</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款方式" min-width="108">
          <template slot-scope="scope">
            <div class="line-info">
              <p>{{ receiveType(scope.row.gather_way) }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          className="ProjectInfoColumn"
          label="项目信息"
          min-width="178"
        >
          <template slot-scope="scope">
            <div @click.stop="goProjectDetail(scope.row)">
              <el-popover
                v-if="scope.row.project_name && scope.row.project_name.length > 12"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.project_name"
              >
                <p slot="reference" class="line-clamp-1 empty-data-line hover-link">
                  {{ scope.row.project_name }}
                </p>
              </el-popover>
              <p v-else class="line-clamp-1 empty-data-line hover-link">
                {{ scope.row.project_name || '--' }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="业务类型" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.business_type ? BusinessTypeMap.get(scope.row.business_type) : '--' }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="客户公司" min-width="180">
          <template slot-scope="scope">
            <div class="line-info">
              <el-popover
                v-if="
                  scope.row.customer_info.company_name &&
                  scope.row.customer_info.company_name.length > 10
                "
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.customer_info.company_name"
              >
                <p slot="reference" class="clamp-1 customer-name" style="width: 150px">
                  {{ scope.row.customer_info.company_name }}
                </p>
              </el-popover>
              <p v-else class="clamp-1">
                {{ fillEmptyStr(scope.row.customer_info.company_name) }}
              </p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="left" label="客户店铺" min-width="180">
          <template slot-scope="scope">
            <div class="line-info">
              <el-popover
                v-if="
                  scope.row.customer_info.shop_name && scope.row.customer_info.shop_name.length > 10
                "
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scope.row.customer_info.shop_name"
              >
                <p slot="reference" class="clamp-1 customer-name" style="width: 150px">
                  {{ scope.row.customer_info.shop_name }}
                </p>
              </el-popover>
              <p v-else class="clamp-1 customer-name">
                {{ fillEmptyStr(scope.row.customer_info.shop_name) }}
              </p>
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="是否开票" min-width="110" align="center">
          <template slot-scope="scope">
            <div class="line-info" style="justify-content: center">
              <p
                :style="{
                  width: scope.row.is_invoice === 1 ? '30px' : '100%',
                  textAlign: scope.row.is_invoice === 1 ? 'right' : 'center',
                }"
              >
                {{ scope.row.is_invoice === 1 ? '是' : '否' }}
              </p>
              <p style="width: 60px; text-align: left" v-if="scope.row.is_invoice === 1">
                ({{ scope.row.invoice_info.length >= 1 ? '已上传' : '未上传' }})
              </p>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="收款时间" min-width="90" align="center">
          <template slot-scope="scope">
            <div>
              <span>
                {{
                  scope.row.gather_confirm_detail.order_date
                    ? fillEmptyStr(scope.row.gather_confirm_detail.order_date.replace(/-/gu, '.'))
                    : '--'
                }}</span
              >
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="账期时间" min-width="90" align="center">
          <template slot-scope="scope">
            <div>
              <span> {{ accountDate(scope.row) }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="收款凭证" width="80" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.gather_certificate_pic"
              type="text"
              class="button-item"
              @click.native.stop="checkoutPaymentBtn(scope.row.gather_certificate_pic)"
              >查看</el-button
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="核销状态" min-width="120" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p
                v-if="
                  scope.row.gather_type === 5
                    ? scope.row.refund_write_off_status === 2
                    : scope.row.write_off_status === 2
                "
                class="write-on"
              >
                <write-list-pop
                  v-if="writeOffPopoverVisible(scope.row)"
                  :list="writeOffPopoverInfo(scope.row)"
                  :type="scope.row.gather_type === 5 ? 'commonBusinessPayableActual' : 'receive'"
                  btntitle="已核销"
                  btncolor="var(--text-color)"
                  :showSettlementUid="true"
                  dateText="账期时间"
                ></write-list-pop>
                <template v-else>已核销</template>
              </p>
              <p
                v-else-if="
                  scope.row.gather_type === 5
                    ? scope.row.refund_write_off_status === 1
                    : scope.row.write_off_status === 1
                "
                class="write-off"
              >
                <write-list-pop
                  v-if="writeOffPopoverVisible(scope.row)"
                  :list="writeOffPopoverInfo(scope.row)"
                  :type="scope.row.gather_type === 5 ? 'commonBusinessPayableActual' : 'receive'"
                  btntitle="部分核销"
                  btncolor="#ff7a36"
                  :showSettlementUid="true"
                  dateText="账期时间"
                ></write-list-pop>
                <template v-else>部分核销</template>
              </p>
              <p v-else class="write-off">未核销</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单据状态" min-width="120">
          <template slot-scope="scope">
            <div style="color: #ff7a36" v-if="scope.row.gather_type === 4">
              <span>冲销</span>
              <span style="color: #ff7a36" v-if="scope.row.reverse_status === 1">(待确认)</span>
              <span style="color: var(--success-color)" v-else-if="scope.row.reverse_status === 2"
                >(已确认)</span
              >
              <span style="color: var(--error-color)" v-else-if="scope.row.reverse_status === 3"
                >(退回)</span
              >
            </div>
            <div v-else>
              <div v-if="scope.row.is_gather === 0" class="to-pay">待确认</div>
              <div v-else>已确认</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, itemIndex) in op_columns"
          v-bind="item"
          :key="`op-${itemIndex}`"
        />
        <!-- 空白页 -->
        <template #empty>
          <empty-common detail-text="暂无收款数据"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="total > 0"
        :current-page.sync="queryForm.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.size"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <div class="tg-dialog-vcenter">
      <el-dialog
        class="tg-dialog-classic"
        :visible="receiveConfirmVisible"
        width="440px"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="receiveConfirmCloseAction"
      >
        <template #title>收款确认</template>
        <el-form
          size="mini"
          ref="receiveConfirmRef"
          :model="receiveConfirm"
          :rules="receiveConfirmRules"
          label-width="100px"
          style="margin-top: 20px"
        >
          <el-form-item label="收款时间：" prop="order_date">
            <el-date-picker
              v-model="receiveConfirm.order_date"
              type="date"
              placeholder="请选择收款时间"
              style="width: 300px"
              format="yyyy.MM.dd"
              value-format="yyyy.MM.dd"
              :disabled="confirmRow && confirmRow.revenue_flow_id ? true : false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="gather_way === 2 || gather_way === 3"
            label="收款账号："
            prop="receive_account"
          >
            <el-select
              v-model.trim="receiveConfirm.receive_account"
              placeholder="请选择收款账号"
              clearable
              maxlength="100"
              style="width: 300px"
              @change="receiveAccountChange"
              :disabled="confirmRow && confirmRow.revenue_flow_id ? true : false"
            >
              <el-option
                v-for="item in bankAccounts"
                :key="item.id"
                :label="item.account_number + '(' + item.bank_name + ')'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <template v-if="confirmRow && confirmRow.revenue_flow_id ? true : false">
            <el-form-item v-if="gather_way !== 1" label="名称：">
              <el-input
                v-model.trim="receiveConfirm.pay_company_name"
                placeholder="请输入付款方名称"
                clearable
                maxlength="100"
                style="width: 300px"
                :disabled="gather_way === 2 || gather_way === 3 ? 'disabled' : false"
              />
            </el-form-item>
            <el-form-item v-if="gather_way !== 1" label="账号：">
              <el-input
                v-model.trim="receiveConfirm.account"
                placeholder="请输入付款方账号"
                clearable
                maxlength="100"
                style="width: 300px"
                :disabled="gather_way === 2 || gather_way === 3 ? 'disabled' : false"
              />
            </el-form-item>
            <el-form-item v-if="gather_way === 3" label="开户行：">
              <el-input
                v-model.trim="receiveConfirm.bank_of_deposit"
                placeholder="请输入付款方开户行"
                clearable
                maxlength="100"
                style="width: 300px"
                :disabled="gather_way === 2 || gather_way === 3 ? 'disabled' : false"
              />
            </el-form-item>
          </template>
        </el-form>
        <template #footer>
          <tg-button @click="receiveConfirmCloseAction">取消</tg-button>
          <tg-button type="primary" @click="handleReceiveConfirmSaveAction">保存</tg-button>
        </template>
      </el-dialog>
    </div>
    <div class="tg-dialog-vcenter">
      <el-dialog
        class="tg-dialog-classic upload-dialog-box"
        :visible="uploadVisible"
        width="550px"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="uploadCloseAction"
        @click.native.stop="clearInvoiceListItemActiveIndex"
      >
        <template #title>{{ commonTitle }}</template>
        <el-form
          size="mini"
          ref="uploadRef"
          :model="uploadForm"
          label-width="100px"
          class="upload-invoice-form"
        >
          <div class="list-form-box">
            <p class="list-form-title" style="margin-top: 8px">发票凭证：</p>
            <div
              v-for="(item, index) in uploadForm.list"
              :key="index"
              :class="
                invoiceListItemActiveIndex === index
                  ? 'list-form-item list-form-item-active'
                  : 'list-form-item'
              "
              style="margin-top: 8px"
              @paste="event => handlePaste(event, index)"
              @click.stop="invoiceListItemActiveIndex = index"
            >
              <el-button
                v-if="uploadForm.list.length > 1"
                class="form-item-close"
                icon="el-icon-close"
                circle
                @click="deleteUploadItemBtn(index)"
              />
              <el-form-item
                :prop="'list.' + index + '.show_url'"
                label="发票截图："
                :rules="{
                  required: true,
                  message: '请上传发票截图',
                  trigger: ['change', 'blur'],
                }"
              >
                <el-upload
                  class="avatar-uploader"
                  action
                  :http-request="uploadImage.bind(this, index, false)"
                  :before-upload="beforeAvatarUpload"
                  :show-file-list="false"
                  accept=".jpeg,.jpg,.png"
                >
                  <tg-icon
                    style="font-size: 90px"
                    v-if="item.show_url && item.show_url.includes('.pdf')"
                    name="ico-pdf"
                  />
                  <img v-else-if="item.show_url" :src="item.show_url" class="avatar" />
                  <div v-else class="avatar-uploader-icon" v-loading="loading">
                    <i class="el-icon-plus"></i>
                    <p>上传发票</p>
                  </div>
                  <div
                    style="position: absolute; right: -50px; top: 32px; color: rgb(164, 178, 194)"
                  >
                    支持pdf，图片格式发票上传
                  </div>
                  <div style="line-height: 16px; color: #a4b2c2" class="el-upload__tip" slot="tip">
                    选中灰色区域，粘贴（ctrl+V）添加图片
                  </div>
                </el-upload>
              </el-form-item>
              <el-form-item label="发票号码：">
                <el-input
                  v-model.trim="item.invoice_num"
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  placeholder="请输入8位发票号码"
                  maxlength="8"
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item label="开票时间：">
                <el-date-picker
                  v-model="item.invoice_date"
                  type="date"
                  placeholder="请选择开票时间"
                  style="width: 300px"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="开票金额：" :rule="uploadFormRules.amount">
                <el-input
                  v-model.trim="item.amount"
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  @input="inputLoanAmountCost($event, index)"
                  placeholder="请输入开票金额"
                  clearable
                  style="width: 300px"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="开票单位名称：">
                <el-input
                  v-model.trim="item.institution"
                  placeholder="请输入开票单位名称"
                  maxlength="100"
                  clearable
                  style="width: 300px"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
        <tg-ghost-button
          v-if="uploadForm.list.length < 3"
          class="add-upload-form-btn"
          @click="addUploadItemBtn"
          >点击添加</tg-ghost-button
        >
        <template #footer>
          <tg-button @click="uploadCloseAction">取消</tg-button>
          <tg-button type="primary" @click="uploadSaveAction('uploadRef')">保存</tg-button>
        </template>
      </el-dialog>
    </div>
    <finance-invoice-detail-dialog
      :visible="financeInvoiceDetailVisible"
      :list="invoiceList"
      @closeFinanceInvoiceDetailAction="closeFinanceInvoiceDetailAction"
    />
    <Invoicelist ref="invoicelistRef" />
    <invoices-detail ref="invoicesDetailDialogRef" />
    <reverseAuditDialog ref="reverseAuditDialogRef" />
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      :visible="reasonDialogVisible"
      width="440px"
      @close="onReasonDialogClose"
    >
      <template #title>冲销原因</template>
      <div class="reason-dialog-content">{{ reason }}</div>
    </el-dialog>
    <LoanfinanceDetailModal
      v-if="loanDetailVisible"
      :visible="loanDetailVisible"
      :detail-data="detail_data"
      @dialog:closerow="onLoanDetailClose"
      @dialog:openreceivecertificate="checkoutPaymentBtn"
      @dialog:openreceiveinvoice="checkoutInvoiceDetailBtn"
      @dialog:openreceivecontract="goContractDetail"
      @dialog:openreceiveApproval="handleClickApprovalBtn"
    />
    <!--     -->
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.reason-dialog-content {
  .fc(14px, var(--text-color));
  line-height: 22px;
  .pd(24px);
}

.form-item-group {
  .el-input-group__prepend {
    background: transparent;
  }
  .contract-input {
    .el-input__inner {
      width: 100%;
      padding-right: 10px;
    }
  }
}

.finance-receive-page {
  display: flex;
  overflow-y: auto;
  overflow-y: overlay;
  .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 160px;
      text-align: left;
      margin-right: -35px;
    }
  }
  .main-header {
    display: flex;
    .header {
      flex: 1;
      line-height: 28px;
      height: 28px;
      margin-left: 48px;
      font-size: 16px;
      display: flex;
      .label {
        color: var(--text-second-color);
        line-height: 30px;
        font-size: 14px;
      }
      .text {
        margin-right: 48px;
        font-weight: 600;
        color: var(--text-color);
        &.gold {
          color: #ff7a36;
        }
      }
    }
  }
  tr {
    cursor: pointer;
  }
  .el-table__fixed,
  .el-table__fixed-right {
    height: auto !important;
    bottom: 13px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0 !important;
  }
  .el-card__body {
    padding: 18px !important;
  }
  .form-item-group .el-input-group__prepend {
    color: var(--text-color);
  }
}
</style>

<style scoped lang="less">
/deep/.input-with-select .el-input-group__prepend {
  width: 88px;
  .el-select {
    .el-input .el-input__inner {
      border-color: transparent;
    }
  }
}
/deep/.tg-btn-link {
  font-size: 12px;
}
/deep/ a {
  font-size: 12px;
}
.pop-finance {
  width: 316px;
  padding: 5px 10px;
  .pop-header {
    font-weight: 600;
  }
  .label {
    color: var(--text-third-color);
  }
  .pop-row {
    margin-top: 10px;
    display: flex;
    .label {
      width: 70px;
      text-align: right;
    }
  }
}
.flex-form-item-time {
  display: flex;
  margin-right: 24px;
  margin-bottom: 14px;
  /deep/.el-select .el-input.is-focus .el-input__inner {
    border-color: var(--border-line-color) !important;
  }
  /deep/.el-select .el-input__inner:focus {
    border-color: var(--border-line-color) !important;
  }
  .time-select-box {
    width: 220px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -2px;
    padding-right: 4px !important;
    /*margin-top: -2px;*/
    flex: 1;
    /deep/ &.el-range-editor.el-input__inner {
      /*top: -1px;*/
      //padding: 3px 10px 2px 10px;
    }
  }
}
.empty-data-line {
  cursor: pointer;
  color: var(--text-color);
  &:hover {
    color: var(--theme-color);
  }
}
.finance-receive-page {
  .ProjectInfoColumn:hover {
    color: var(--text-color);
    p {
      color: var(--theme-color);
    }
  }
  .el-button--text {
    font-weight: 400;
  }
  .button-item {
    width: 30px;
    padding: 0;
    color: var(--theme-color);
    font-weight: 400;
    font-size: 12px;
  }
  .button-item-padding {
    padding: 0 2px;
    color: var(--theme-color);
    font-weight: 400;
  }
  .color-999 {
    color: #999999;
  }
  .line-info {
    display: flex;
    font-size: 12px;
    width: 100%;
    p {
      width: 100%;
    }
    .label-50 {
      width: 42px;
      text-align: right;
    }
    .label-70 {
      width: 70px;
      text-align: right;
    }
    .customer-name {
      flex: 1;
      text-align: left;
    }
    .clamp-1 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .button-item {
      width: 30px;
      padding: 0;
      font-size: 12px;
    }
    .write-on {
      color: var(--text-color);
      width: 100%;
    }
    .write-off {
      color: #ff7a36;
      width: 100%;
    }
  }
  .upload-dialog-box {
    margin-top: 20px;
    .upload-invoice-form {
      margin-top: 14px;
      max-height: 465px;
      margin-bottom: 20px;
      overflow-y: scroll;
    }
    .list-form-box {
      .list-form-title {
        color: var(--text-second-color);
        width: 70px;
        margin-left: 20px;
        line-height: 35px;
        float: left;
      }
      .list-form-item {
        width: 425px;
        float: right;
        margin-right: 25px;
        margin-bottom: 20px;
        background: #f6f6f6;
        border-radius: 4px;
        padding: 10px 10px 0;
        cursor: pointer;
        box-sizing: border-box;
        border: 1px dashed transparent;
        .form-item-close {
          padding: 0;
          width: 18px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          border: none;
          color: #ffffff;
          background: #cccccc;
          font-size: 12px;
          &:hover {
            color: #ffffff;
            background: var(--error-color);
          }
          float: right;
          margin-top: -18px;
          margin-right: -18px;
        }
      }
      .list-form-item-active {
        border-color: rgba(var(--theme-rgb-color), 0.9);
      }
    }
    .add-upload-form-btn {
      width: 425px;
      margin: -5px 0 30px 95px;
      border: 1px dashed #dcdfe6;
      color: var(--theme-color);
    }
    .avatar-uploader-icon {
      width: 90px;
      height: 90px;
      font-size: 12px;
      color: #8c939d;
      border-radius: 4px;
      text-align: center;
      border: 1px dashed #d5d5d5;
      background: #ffffff;
      &:hover {
        color: #5c82ff;
        border: 1px dashed #5c82ff;
      }
      .el-icon-plus {
        font-size: 20px;
        margin-top: 26px;
      }
      p {
        line-height: 20px;
        margin-top: -10px;
      }
    }
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 4px;
      display: block;
      border: 1px dashed #d5d5d5;
    }
  }
}
</style>
