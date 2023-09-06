<script src="./index.ts"></script>
<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <div class="finance-payment-page flex-auto">
    <tg-card class="flex-none" :padding="[16, 0, 16, 16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="60px"
      >
        <el-form-item label="业务类型：" class="flex-form-item">
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
        <el-form-item label="付款类型：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.pay_type"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="成本" :value="1" />
            <el-option label="退款" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="成本类型：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.new_cost_type"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="人员工资" :value="1" />
            <el-option label="主播服务费" :value="2" />
            <el-option label="固定资产采购" :value="3" />
            <el-option label="水电" :value="4" />
            <el-option label="装修" :value="5" />
            <el-option label="房租" :value="6" />
            <el-option label="营销成本" :value="7" />
            <el-option label="返点" :value="8" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否开票：" class="flex-form-item">
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
        <el-form-item label="打款状态：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.is_pay"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="待打款" :value="0" />
            <el-option label="已打款" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="打款方式：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.pay_way"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" value="" />
            <el-option label="支付宝" :value="4" />
            <el-option label="V任务" :value="2" />
            <el-option label="对公银行" :value="3" />
            <el-option label="银行卡" :value="1" />
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
        <el-form-item label="打款账号：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.payer_bank_account_id"
            class="select"
            placeholder=""
            style="width: 192px"
          >
            <el-option label="全部" :value="undefined" />
            <el-option
              v-for="item in bankList"
              :label="item.bank_name"
              :value="item.id"
              :key="item.id"
            />
            <!-- <el-option label="全部" value="" />
            <el-option label="已拆分" :value="1" />
            <el-option label="未拆分" :value="0" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="付款搜索：" class="flex-form-item form-item-group">
          <el-input
            placeholder="请输入关键字"
            v-model.trim="queryForm.search_value"
            class="input-with-select"
            clearable
            style="width: 244px"
            @keypress.enter.native="getList"
          >
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请选择"
              v-model="queryForm.search_type"
              style="width: 100px; padding-left: 6px"
              slot="prepend"
            >
              <el-option label="用款审批" :value="2" />
              <el-option label="客户名称" :value="3" />
              <el-option label="客户经理" :value="5" />
              <el-option label="付款编号" :value="10" />
              <el-option label="收款编号" :value="6" />
              <el-option label="供应商" :value="8" />
              <!--              <el-option label="公司名称" :value="9" />-->
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="日期选择：" class="flex-form-item flex-form-item-time">
          <div>
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请选择"
              v-model="queryForm.query_date_type"
              class="time-select-type"
            >
              <el-option label="用款日期" :value="1" />
              <el-option label="打款日期" :value="2" />
              <el-option label="登记时间" :value="3" />
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
          </div>
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
        <el-form-item label-width="0" class="flex-form-item order-100" style="margin-right: 20px">
          <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
          <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-10 flex-auto"
      :padding="[12, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div class="main-header">
        <tg-button-line>
          <tg-button
            class="el-btn-mini"
            v-if="permission.link_payment_btn"
            type="default"
            icon="ico-relation"
            @click="showLinkPaymentBtnClick"
            >关联付款</tg-button
          >
          <tg-button
            class="el-btn-mini"
            v-if="permission.payment_export"
            type="default"
            icon="ico-btn-export"
            @click="exportBtnClick"
            >导出</tg-button
          >
        </tg-button-line>
        <div class="header" :style="{ marginLeft: permission.payment_export ? '48px' : '18px' }">
          <div class="item">
            <span class="label">已付款笔数：</span>
            <span class="text">{{
              statistics && numberFormat(statistics.count_confirmed_pay_amount, 0)
            }}</span>
          </div>
          <div class="item">
            <span class="label">已付款金额：</span>
            <span class="text">{{
              statistics && numberMoneyFormat(statistics.sum_confirmed_pay_amount, 2)
            }}</span>
          </div>
          <div class="item">
            <span class="label">待确认笔数：</span>
            <span class="text gold">{{
              statistics && numberFormat(statistics.count_unconfirmed_pay_amount, 0)
            }}</span>
          </div>
          <div class="item">
            <span class="label">待确认金额：</span>
            <span class="text gold">{{
              statistics && numberMoneyFormat(statistics.sum_unconfirmed_pay_amount, 2)
            }}</span>
          </div>
        </div>
      </div>
      <el-table
        stripe
        border
        :data="list"
        v-bind="tableProps"
        v-loading="loading"
        class="mgt-12"
        @row-click.self="onRowClick"
      >
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        <el-table-column label="付款事由" min-width="160">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.pay_reason | emptyData }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="供应商" min-width="180">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.cost_company_name | emptyData }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" min-width="90" align="center">
          <template slot-scope="scope">
            {{ scope.row.business_type ? BusinessTypeMap.get(scope.row.business_type) : '--' }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否开票" min-width="90" align="center">
          <template slot-scope="scope">
            <div style="width: 100%" v-if="scope.row.is_invoice === 0">否</div>
            <div style="width: 100%" v-else>
              <el-button v-if="scope.row.invoice_info.length>0"
                type="text"
                class="button-item"
                @click.native.stop="checkoutInvoiceDetailBtn(scope.row.invoice_info)"
                >查看</el-button
              >
              <span v-if="scope.row.invoice_info.length > 0">是(已上传)</span>
              <span v-else>是(未上传)</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="付款时间" min-width="90" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p>
                {{ scope.row.pay_date.replace(/-/g, '.') || '--' }}
              </p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="账期时间" min-width="90" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p>
                {{ accountDate(scope.row) }}
              </p>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="付款凭证" min-width="90" align="center">
          <template slot-scope="scope">
            <div
              style="width: 100%"
              v-if="scope.row.pay_certificate_pic"
              class="button-item"
              @click.stop="checkoutCertificateBtn(scope.row.pay_certificate_pic)"
            >
              查看
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="核销状态" min-width="120" align="center">
          <template slot-scope="scope">
            <div
              v-if="
                (scope.row.business_type === 1 && scope.row.new_cost_type === 8) ||
                (scope.row.business_type === 2 && scope.row.is_split === 0) ||
                (scope.row.business_type === 3 && scope.row.is_split === 0) ||
                (scope.row.business_type === 8 && scope.row.is_split === 0)
              "
            >
              <p class="write-off">--</p>
            </div>
            <div v-else>
              <div class="line-info">
                <p v-if="scope.row.write_off_status === 2" class="write-on">
                  <write-list-pop
                    v-if="writeOffPopoverVisible(scope.row)"
                    :list="writeOffPopoverInfo(scope.row)"
                    :type="scope.row.pay_type === 2 ? 'receive' : 'commonBusinessPayableActual'"
                    btntitle="已核销"
                    btncolor="#3c5269"
                    :showSettlementUid="true"
                    dateText="账期时间"
                  /><template v-else>已核销</template>
                </p>
                <p v-else-if="scope.row.write_off_status === 1" class="write-off">
                  <write-list-pop
                    v-if="writeOffPopoverVisible(scope.row)"
                    :list="writeOffPopoverInfo(scope.row)"
                    :type="scope.row.pay_type === 2 ? 'receive' : 'commonBusinessPayableActual'"
                    btntitle="部分核销"
                    btncolor="#ff7a36"
                    :showSettlementUid="true"
                    dateText="账期时间"
                  /><template v-else>部分核销</template>
                </p>
                <p v-else class="write-off">未核销</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" min-width="120" align="center">
          <template slot-scope="scope">
            <div style="color: #ff7a36" v-if="scope.row.reversed_id !== null">
              <span>冲销</span>
              <span style="color: #ff7a36" v-if="scope.row.reverse_status === 1">(待确认)</span>
              <span style="color: #02ba3c" v-else-if="scope.row.reverse_status === 2"
                >(已确认)</span
              >
              <span style="color: #e91313" v-else-if="scope.row.reverse_status === 3">(退回)</span>
            </div>
            <div v-else>
              <div v-if="scope.row.is_pay === 0" class="to-pay">待打款</div>
              <div v-else>已打款</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="
            permission.payment_upload_edit_pay_evidence || permission.payment_upload_edit_invoice
          "
          align="left"
          label="操作"
          width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.reversed_id">
              <el-button
                v-if="scope.row.reverse_status === 1"
                type="text"
                class="button-item-padding reverse-red"
                @click.native.stop="handleReverseAduit(scope.row)"
                >冲销确认</el-button
              >
              <el-button
                v-if="scope.row.reverse_status === 2 || scope.row.reverse_status === 3"
                type="text"
                class="button-item-padding"
                @click.native.stop="onReasonViewBtnClick(scope.row)"
                >查看</el-button
              >
            </div>
            <div v-else>
              <el-button
                v-if="permission.payment_upload_edit_pay_evidence && scope.row.is_pay === 0"
                type="text"
                class="button-item-padding"
                @click.native.stop="paymentConfirmClick(scope.row)"
                >打款确认</el-button
              >
              <el-button
                v-else-if="permission.payment_upload_edit_pay_evidence && scope.row.is_pay !== 0"
                type="text"
                class="button-item-padding"
                @click.native.stop="editConfirmClick(scope.row)"
                >编辑凭证</el-button
              >
              <!--              <el-button-->
              <!--                v-if="permission.payment_upload_edit_invoice && scope.row.invoice_info.length < 1"-->
              <!--                type="text"-->
              <!--                class="button-item-padding"-->
              <!--                @click.native.stop="uploadBtnClick(scope.row)"-->
              <!--                >上传发票</el-button-->
              <!--              >-->
              <!--              <el-button-->
              <!--                v-else-if="-->
              <!--                  permission.payment_upload_edit_invoice && scope.row.invoice_info.length >= 1-->
              <!--                "-->
              <!--                type="text"-->
              <!--                class="button-item-padding"-->
              <!--                @click.native.stop="editBtnClick(scope.row)"-->
              <!--                >编辑发票</el-button-->
              <!--              >-->
            </div>
          </template>
        </el-table-column>
        <!-- 空白页 -->
        <template #empty>
          <empty-common detail-text="暂无审批记录"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="total > 0"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <div class="tg-dialog-vcenter">
      <el-dialog
        class="tg-dialog-classic"
        :visible="paymentConfirmVisible"
        width="440px"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="paymentConfirmCloseAction"
        @paste.native="event => handlePaste(event, -1)"
      >
        <template #title>{{ commonTitle }}</template>
        <el-form
          ref="paymentConfirmRef"
          :model="paymentConfirmFrom"
          :rules="paymentConfirmFromRules"
          label-width="100px"
          style="margin-top: 20px"
          size="mini"
        >
          <el-form-item label="打款时间：" prop="pay_date">
            <el-date-picker
              v-model="paymentConfirmFrom.pay_date"
              type="date"
              placeholder="请选择打款时间"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              style="width: 300px"
            >
            </el-date-picker>
          </el-form-item>
          <!-- v-if="permission.payment_upload_edit_pay_evidence && row_is_pay === 0" -->
          <el-form-item label="打款账号：" prop="bank_account_id">
            <el-select
              popper-class="el-select-popper-mini"
              filterable
              placeholder="请选择打款账号"
              v-model="paymentConfirmFrom.bank_account_id"
              style="width: 300px"
            >
              <el-option
                v-for="bank_account in bank_account_list"
                :label="bank_account.account_number + ' (' + bank_account.bank_name + ')'"
                :value="bank_account.id"
                :key="bank_account.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="打款凭证："
            :rules="{
              required: true,
              message: '请上传打款凭证',
              trigger: ['blur', 'change'],
            }"
          >
            <div style="display: flex">
              <div v-for="(item, index) in urlShowList" :key="index" class="confirm-img-box">
                <el-button
                  class="item-close"
                  icon="el-icon-close"
                  circle
                  @click="deleteConfirmItemBtn(index)"
                ></el-button>
                <img :src="item" class="confirm-img" />
              </div>
              <el-upload
                v-if="urlShowList.length < 3"
                class="avatar-uploader"
                action
                :http-request="uploadConfirmImage.bind(this, false)"
                :before-upload="beforeUpload"
                :show-file-list="false"
                accept=".jpeg,.jpg,.png"
              >
                <div class="uploader-icon-box">
                  <p class="el-icon-plus"></p>
                  <p>上传图片</p>
                </div>
              </el-upload>
            </div>
            <div style="line-height: 16px; color: #888" class="el-upload__tip">
              点击任意区域，粘贴（ctrl+V）添加图片
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <tg-button class="el-btn-mini" @click="paymentConfirmCloseAction">取消</tg-button>
          <tg-button
            class="el-btn-mini"
            type="primary"
            @click="handlePaymentConfirmSaveAction('paymentConfirmRef')"
            >保存</tg-button
          >
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
        @click.native="clearInvoiceListItemActiveIndex"
      >
        <template #title>{{ commonTitle }}</template>
        <div style="margin-top: 20px">
          <span style="margin-left: 45px">税额：</span>
          <el-input
            v-model.trim="tax_point"
            oninput="value=value.replace(/[^\d.]/g,'')"
            @input="inputLoanAmountCost(1, $event, 2)"
            placeholder="请输入税点金额"
            clearable
            style="width: 430px"
          >
            <template slot="append">元</template>
          </el-input>
        </div>
        <div class="upload-invoice-div">
          <el-form
            ref="uploadRef"
            :model="uploadForm"
            label-width="100px"
            class="upload-invoice-form"
            size="mini"
          >
            <div class="list-form-box">
              <p class="list-form-title">发票凭证：</p>
              <div
                v-for="(item, index) in uploadForm.list"
                :key="index"
                :class="
                  invoiceListItemActiveIndex === index
                    ? 'list-form-item list-form-item-active'
                    : 'list-form-item'
                "
                @paste="event => handlePaste(event, index)"
                @click.stop="invoiceListItemActiveIndex = index"
              >
                <el-button
                  v-if="uploadForm.list.length > 1"
                  class="form-item-close"
                  icon="el-icon-close"
                  circle
                  @click="deleteUploadItemBtn(index)"
                ></el-button>
                <el-form-item
                  :prop="'list.' + index + '.show_url'"
                  label="发票截图："
                  :rules="{
                    required: true,
                    message: '请上传发票截图',
                    trigger: ['change', 'blur'],
                  }"
                >
                  <!-- style="display: flex; align-items: flex-end;" -->
                  <el-upload
                    class="avatar-uploader"
                    action
                    :http-request="uploadImage.bind(this, index, false)"
                    :before-upload="beforeUpload"
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
                    <div
                      style="line-height: 16px; color: #a4b2c2"
                      class="el-upload__tip"
                      slot="tip"
                    >
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
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="开票金额：">
                  <el-input
                    v-model.trim="item.amount"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    @input="inputLoanAmountCost(index, $event, 1)"
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
        </div>

        <el-button
          v-if="uploadForm.list.length < 3"
          icon="el-icon-plus"
          class="add-upload-form-btn"
          @click="addUploadItemBtn"
          >点击添加</el-button
        >
        <template #footer>
          <tg-button class="el-btn-mini" @click="uploadCloseAction">取消</tg-button>
          <tg-button class="el-btn-mini" type="primary" @click="uploadSaveAction('uploadRef')"
            >保存</tg-button
          >
        </template>
      </el-dialog>
    </div>
    <div class="tg-dialog-vcenter">
      <el-dialog
        class="tg-dialog-classic upload-dialog-box"
        :visible="costSplitVisible"
        width="510px"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="costSplitCloseAction"
      >
        <template #title>成本拆分</template>
        <div class="cost-split-scroll">
          <div class="dialog-line">
            <span class="label-70">打款金额：</span>
            <span>{{ numberMoneyFormat(costSplitForm.pay_amount, 2) }}</span>
          </div>
          <div class="dialog-line">
            <span class="label-70">成本类型：</span>
            <span>{{ costType(costSplitForm.new_cost_type) }}</span>
          </div>
          <div class="dialog-line">
            <span class="label-70">业务类型：</span>
            <span>
              {{
                costSplitForm.business_type
                  ? BusinessTypeMap.get(costSplitForm.business_type)
                  : BusinessTypeMap.get(costSplitForm.business_type_str || 5)
              }}
            </span>
          </div>
          <el-form
            ref="costSplitRef"
            :model="costSplitForm"
            label-width="80px"
            style="margin-top: 10px"
            size="mini"
          >
            <div class="list-form-box">
              <div
                v-for="(item, index) in costSplitForm.cost"
                :key="index"
                class="list-form-item cost-list-form-item"
              >
                <el-button
                  v-if="costSplitForm.cost.length > 1"
                  class="form-item-close"
                  icon="el-icon-close"
                  circle
                  @click="deleteCostSplitItemBtn(index)"
                ></el-button>
                <el-form-item
                  label="所属项目："
                  :prop="'cost.' + index + '.project_id'"
                  :rules="{
                    required: true,
                    message: '请输入项目编号',
                    trigger: ['blur', 'change'],
                  }"
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model="item.project_id"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    placeholder="请输入所属项目"
                    :remote-method="getCustmerByContractNo"
                    style="width: 325px"
                  >
                    <el-option
                      v-for="item in project_options"
                      :key="item.id"
                      :label="item.project_uid"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="费用金额："
                  :prop="'cost.' + index + '.price'"
                  :rules="{
                    required: true,
                    message: '请输入项目分摊金额',
                    trigger: ['blur', 'change'],
                  }"
                >
                  <el-input
                    v-model.trim="item.price"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    @input="inputLoanAmountCost(index, $event, 3)"
                    placeholder="请输入项目分摊金额"
                    clearable
                    style="width: 325px"
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <el-button icon="el-icon-plus" class="cost-split-form-btn" @click="addCostSplitItemBtn"
          >点击添加</el-button
        >
        <template #footer>
          <tg-button class="el-btn-mini" @click="costSplitCloseAction">取消</tg-button>
          <tg-button class="el-btn-mini" type="primary" @click="costSplitSaveAction('costSplitRef')"
            >保存</tg-button
          >
        </template>
      </el-dialog>
    </div>

    <div class="tg-dialog-vcenter">
      <el-dialog
        class="tg-dialog-classic"
        width="868px"
        :visible="linkPaymentVisible"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        @close="linkPaymentCloseAction"
      >
        <template #title>关联付款</template>
        <div class="main-box">
          <div class="link-payment-tips">
            <tg-icon name="ico-warn" style="font-size: 20px" />
            <p>
              注意：关联后不可撤销，谨慎操作，如果存在多条已确认的收款，需要选择一条保留并共享打款凭证及发票等信息；如同时含有已打款和未打款的记录，合并后会自动更新为已打款
            </p>
          </div>
          <div class="link-payment-search">
            <div class="link-payment-header">
              <p class="title">选择付款</p>
              <el-input
                size="mini"
                placeholder="请输入付款ID"
                style="width: 182px; margin-top: 6px"
                @keypress.native.enter="onEnterPressLinkPayment"
                @click.native="onEnterPressLinkPayment"
                suffix-icon="el-icon-search"
                v-model="link_id"
              >
              </el-input>
            </div>
            <el-table
              stripe
              border
              class="customer-table payment-table"
              :data="search_link_payment"
              :header-cell-style="{
                padding: '0',
                color: '#888',
                background: '#ffffff',
                fontWeight: 400,
                height: '35px',
              }"
            >
              <el-table-column align="left" label="付款ID" width="96">
                <template slot-scope="scoped">{{ scoped.row.cost_id }}</template>
              </el-table-column>
              <el-table-column align="right" label="金额 (元)" width="136">
                <template slot-scope="scoped">{{
                  numberMoneyFormat(scoped.row.pay_amount, 2, '.', ',', false)
                }}</template>
              </el-table-column>
              <el-table-column align="left" label="收款方" width="356">
                <template slot-scope="scoped">
                  <template v-if="scoped.row.pay_way === 3">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.company_name &&
                        scoped.row.pay_way_detail.company_name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.company_name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.company_name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.company_name | emptyData }}
                    </p>
                  </template>
                  <template v-if="scoped.row.pay_way === 2">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.wangwang_name &&
                        scoped.row.pay_way_detail.wangwang_name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.wangwang_name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.wangwang_name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.wangwang_name | emptyData }}
                    </p>
                  </template>
                  <template v-if="scoped.row.pay_way === 4">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.name && scoped.row.pay_way_detail.name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.name | emptyData }}
                    </p>
                  </template>
                  <template v-if="scoped.row.pay_way === 1">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.real_name &&
                        scoped.row.pay_way_detail.real_name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.real_name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.real_name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.real_name | emptyData }}
                    </p>
                  </template>
                </template>
              </el-table-column>
              <el-table-column align="left" label="打款状态" width="110">
                <template slot-scope="scoped">
                  <p v-if="scoped.row.is_pay === 1">已打款</p>
                  <p v-else>待打款</p>
                </template>
              </el-table-column>
              <el-table-column align="right" label="" width="76">
                <template slot-scope="scoped">
                  <tg-button
                    size="mini"
                    v-if="!active_id"
                    class="add-btn-link"
                    type="primary"
                    @click="handlePushClick(scoped.row, scoped.$index)"
                    >添加</tg-button
                  >
                  <tg-button size="mini" v-else type="primary" class="add-btn-link" disabled
                    >添加</tg-button
                  >
                </template>
              </el-table-column>
              <template #empty>
                <empty-common
                  img-height="120"
                  img-width="180"
                  detail-text="请搜索付款ID"
                ></empty-common>
              </template>
            </el-table>
          </div>
          <div class="link-payment-main">
            <div class="link-payment-header">
              <p class="title">关联以下付款</p>
            </div>
            <el-table
              stripe
              border
              class="customer-table payment-table"
              max-height="250"
              :data="link_payment_list"
              :header-cell-style="{
                padding: '0',
                color: '#888',
                background: '#ffffff',
                fontWeight: 400,
                height: '35px',
              }"
            >
              <el-table-column align="left" label="付款ID" width="96">
                <template slot-scope="scoped">{{ scoped.row.cost_id }}</template>
              </el-table-column>
              <el-table-column align="right" label="金额 (元)" width="116">
                <template slot-scope="scoped">{{
                  numberMoneyFormat(scoped.row.pay_amount, 2, '.', ',', false)
                }}</template>
              </el-table-column>
              <el-table-column align="left" label="收款方" width="310">
                <template slot-scope="scoped">
                  <template v-if="scoped.row.pay_way === 3">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.company_name &&
                        scoped.row.pay_way_detail.company_name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.company_name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.company_name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.company_name | emptyData }}
                    </p>
                  </template>
                  <template v-if="scoped.row.pay_way === 2">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.wangwang_name &&
                        scoped.row.pay_way_detail.wangwang_name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.wangwang_name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.wangwang_name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.wangwang_name | emptyData }}
                    </p>
                  </template>
                  <template v-if="scoped.row.pay_way === 4">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.name && scoped.row.pay_way_detail.name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.name | emptyData }}
                    </p>
                  </template>
                  <template v-if="scoped.row.pay_way === 1">
                    <el-popover
                      v-if="
                        scoped.row.pay_way_detail.real_name &&
                        scoped.row.pay_way_detail.real_name.length > 20
                      "
                      placement="top-start"
                      width="300"
                      trigger="hover"
                      :content="scoped.row.pay_way_detail.real_name"
                    >
                      <p slot="reference" class="line-clamp-1">
                        {{ scoped.row.pay_way_detail.real_name }}
                      </p>
                    </el-popover>
                    <p v-else class="line-clamp-1">
                      {{ scoped.row.pay_way_detail.real_name | emptyData }}
                    </p>
                  </template>
                </template>
              </el-table-column>
              <el-table-column align="left" label="打款状态" width="86">
                <template slot-scope="scoped">
                  <p v-if="scoped.row.is_pay === 1">已打款</p>
                  <p v-else>待打款</p>
                </template>
              </el-table-column>
              <el-table-column align="left" label="凭证及发票" width="110">
                <template slot-scope="scoped">
                  <el-radio
                    v-if="scoped.row.is_pay === 1"
                    v-model="choose_radio"
                    :label="scoped.row.cost_id"
                    >保留此条</el-radio
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="56">
                <template slot-scope="scoped">
                  <el-button
                    class="add-btn-link"
                    type="text"
                    size="mini"
                    @click="handleRemoveClick(scoped.$index, scoped.row.cost_id)"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
              <template #empty>
                <empty-common
                  img-height="120"
                  img-width="180"
                  detail-text="暂无数据"
                ></empty-common>
              </template>
            </el-table>
          </div>
        </div>
        <template #footer>
          <tg-button class="el-btn-mini" @click="linkPaymentCloseAction">取消</tg-button>
          <tg-button class="el-btn-mini" type="primary" @click="linkPaymentSubmitAction"
            >提交</tg-button
          >
        </template>
      </el-dialog>
    </div>

    <finance-invoice-detail-dialog
      :visible="financeInvoiceDetailVisible"
      :list="invoiceList"
      @closeFinanceInvoiceDetailAction="closeFinanceInvoiceDetailAction"
    />
    <Invoicelist ref="invoicelistRef" />

    <!--    <apply-detail-->
    <!--      v-if="applyDetailDialogVisible"-->
    <!--      ref="applyDetailDialog"-->
    <!--      @close="applyDetailDialogVisible = false"-->
    <!--    />-->
    <PaymentDetailDialog
      v-if="applyDetailDialogVisible"
      :visible="applyDetailDialogVisible"
      :info="approval"
      @dialog:close="applyDetailDialogVisible = false"
    />

    <!--    <refund-detail v-if="refundVisible" ref="refundDetailDialog" @close="refundVisible = false" />-->

    <refund-detail-dialog
      v-if="refundVisible"
      :visible="refundVisible"
      :info="approval"
      @dialog:close="refundVisible = false"
    />

    <!--    <application-detail-->
    <!--      v-if="applicationVisible"-->
    <!--      ref="applicationDetailDialog"-->
    <!--      @close="applicationVisible = false"-->
    <!--    />-->

    <AdvanceDetailDialog
      v-if="applicationVisible"
      :visible="applicationVisible"
      :info="approval"
      @dialog:close="applicationVisible = false"
    />

    <invoices-detail
      v-if="invoicesVisible"
      ref="invoicesDetailDialog"
      @close="invoicesVisible = false"
    />
    <reverseAuditDialog ref="reverseAuditDialogRef" />
    <tg-mask-loading :visible="reverseAuditLoading" content="正在提交，请稍候..." />
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      :visible="reasonDialogVisible"
      width="440px"
      @close="onReasonDialogClose"
    >
      <template #title>冲销原因</template>
      <div class="reason-dialog-content">{{ reason }}</div>
    </el-dialog>
    <div class="tg-dialog-vcenter">
      <LoanfinanceDetailModal
        v-if="loanDetailVisible"
        :visible="loanDetailVisible"
        :detail-data="detail_data"
        :is-from-approval="true"
        @dialog:closerow="onLoanDetailClose"
        @dialog:openpaymentcertificate="checkoutCertificateBtn"
        @dialog:openpaymentinvoice="checkoutInvoiceDetailBtn"
        @dialog:openpaymentcontract="goContractDetail"
        @dialog:openpaymentapproval="handleClickApprovalBtn"
        @dialog:openpaymentimprest="handleClickApplicationBtn"
      />
    </div>
  </div>
</template>
