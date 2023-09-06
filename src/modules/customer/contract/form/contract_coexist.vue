<template>
  <div>
    <div class="dialog-content" style="padding: 10px 20px; overflow-y: auto; max-height: 554px">
      <el-form :model="form" :rules="formRules" label-width="134px" ref="formRef">
        <!-- [基础信息] -->
        <div class="subject">合同基础信息</div>
        <el-form-item label="是否补充协议：" prop="contract_type" style="margin-bottom: 0">
          <el-radio-group :value="tabs" @input="tabsChange" style="display: inline-flex">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- [合同编号] -->
        <el-form-item label="合同编号：" prop="contract_uid" style="margin-bottom: 0">
          <div>{{ form.contract_uid }}（系统生成）</div>
        </el-form-item>
        <!-- [合同类型] -->
        <el-form-item label="合同类型：" prop="contract_type">
          <el-radio-group v-model="form.contract_type" style="display: inline-flex">
            <el-radio v-for="item in contractTypeOptions" :key="item.value" :label="item.value">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- [关联框架合同] -->
        <el-form-item
          prop="frame_contract_id"
          label-width="114px"
          class="sub-form-item"
          v-if="isSales"
          key="contract"
        >
          <template #label>
            <el-popover placement="top" trigger="hover">
              <tg-icon
                name="ico-question-gray"
                hover-name="ico-question-blue"
                style="font-size: 14px"
                slot="reference"
              />
              <span>如与客户有签订框架合同请关联（非必填）</span>
            </el-popover>
            <span style="margin-left: 2px">关联合同：</span>
          </template>
          <el-select
            size="small"
            v-model="frame_contract_uid"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索并选择合同编号"
            :remote-method="getCustmerByContractUid"
            :loading="contract_uid_loading"
            @change="onContractUidChange"
            style="width: 100%"
            popper-class="frame_contract_popper-custoner"
          >
            <el-option
              v-for="item in contractInfoRecords"
              :key="item.contract_id"
              :label="item.contract_uid"
              :value="item.contract_id"
            />
          </el-select>
        </el-form-item>
        <!-- 关联店铺 -->
        <el-form-item label="关联店铺：" prop="partner_id">
          <el-select
            filterable
            remote
            reserve-keyword
            :disabled="!is_mcn_type"
            :value="form.partner_id"
            placeholder="请搜索并选择店铺名称"
            size="medium"
            style="width: 100%"
            :remote-method="val => refillShopNameSearchKey(val, true)"
            @change="onShopChanged"
          >
            <el-option
              v-for="(item, index) in allStoreName"
              :key="index"
              :label="item.shop_name"
              :value="item.shop_id || item.id"
            >
              <span>{{ item.shop_name }}</span>
              <span style="color: var(--text-des-color)">{{
                item.shop_type ? '(' + shop_type_str(item.shop_type) + ')' : '(' + '--' + ')'
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- [客户(公司)名称] -->
        <el-form-item label="客户(公司)名称：" prop="company_id" v-if="!is_mcn_type">
          <el-input
            v-model="form.customer_company_name"
            size="medium"
            placeholder="该店铺未设置关联公司，请在客户管理中进行设置"
            :disabled="!is_mcn_type"
          >
            <template #suffix>
              <p
                v-show="!form.customer_company_name && !is_mcn_type"
                class="company-name-slot"
                style="font-size: 12px"
              >
                该店铺没有录入公司名称
                <a @click="handleAddCompanyNameClick" style="font-size: 12px">去补充></a>
              </p>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="客户(公司)名称：" prop="company_id" v-else>
          <el-select
            :value="form.company_id"
            size="medium"
            placeholder="请选择客户(公司)名称"
            filterable
            style="width: 100%"
            @change="onCompanyChanged"
          >
            <el-option
              v-for="(item, index) in mcn_company_options"
              :key="index"
              :label="item.company_name"
              :value="item.company_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- [合作期限] -->
        <el-form-item label="合作期限：" prop="coop_date">
          <el-date-picker
            v-model="form.coop_date"
            type="daterange"
            size="small"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          />
        </el-form-item>
        <!-- [销售渠道] -->
        <el-form-item label="销售渠道：" prop="sale_chance">
          <el-checkbox
            :indeterminate="saleChance.isIndeterminate"
            v-model="saleChance.checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group
            class="contract-checkbox-group"
            v-model="form.sale_chance"
            @change="handleCheckedSaleChanceChange"
          >
            <el-checkbox
              class="chance-checkbox"
              v-for="(chance, index) in saleChances"
              :label="chance.value"
              :key="index"
              style="height: 16px; line-height: 16px"
              >{{ chance.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <!-- [合同明细] -->
        <div class="subject mgt-10">合同明细</div>
        <el-form-item label="产品（销售渠道）：">
          <div style="line-height: 20px; padding-top: 9px">{{ checkedChances }}</div>
        </el-form-item>
        <!-- [合同金额] -->
        <el-form-item
          label="合同金额："
          prop="contract_amount"
          v-if="isSales"
          style="display: inline-block; width: 378px"
        >
          <el-input
            v-model="form.contract_amount"
            placeholder="0.00"
            size="medium"
            @input="inputContractAmount"
            style="width: 244px"
          />
        </el-form-item>
        <!-- [标准单价] -->
        <el-form-item
          label="标准单价："
          prop="price"
          v-if="isSales"
          style="display: inline-block; width: 378px"
        >
          <el-input
            v-model="form.price"
            placeholder="请输入标准单价"
            size="medium"
            @input="inputPrice"
            style="width: 244px"
          />
        </el-form-item>
        <!-- [数量] -->
        <el-form-item
          label="数量："
          prop="num"
          v-if="isSales"
          style="display: inline-block; width: 378px"
        >
          <el-input
            v-model="form.num"
            placeholder="请输入数量"
            size="medium"
            @input="value => onlyPositiveInteger(value)"
            style="width: 244px"
          />
        </el-form-item>
        <!-- [折扣] -->
        <el-form-item
          label="折扣："
          prop="discount"
          v-if="isSales"
          style="display: inline-block; width: 378px"
        >
          <el-input
            v-model="form.discount"
            placeholder="输入1.0 - 10.0的数字"
            size="medium"
            @input="inputDiscount"
            style="width: 244px"
          />
        </el-form-item>
        <!-- [单位] -->
        <el-form-item
          label="单位："
          prop="unit"
          v-if="isSales"
          style="display: inline-block; width: 378px"
        >
          <el-select
            v-model="form.unit"
            class="short-input"
            size="medium"
            placeholder="请选择单位"
            style="width: 244px"
          >
            <el-option label="场" :value="1" />
            <el-option label="次" :value="2" />
          </el-select>
        </el-form-item>
        <!-- [合同附件] -->
        <el-form-item label="合同附件：" prop="attachment_url">
          <el-upload
            action
            class="upload-btn-wrap"
            :show-file-list="false"
            :multiple="false"
            :http-request="uploadAttachmentFile"
            accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.xlsx"
            :disabled="form.attachment_url.length >= 5"
          >
            <tg-button icon="ico-btn-upload" :disabled="form.attachment_url.length >= 5"
              >上传文件</tg-button
            >
          </el-upload>
          <span class="upload-tips mgl-16"
            >支持扩展名：.docx .doc .pdf .jpg .png
            .xlsx；最多上传5个文件（单个文件大小不超过30M）</span
          >
          <div class="uploaded-list">
            <p
              v-for="(item, index) in this.form.attachment_url"
              :key="index"
              style="margin-right: 10px; line-height: 30px"
            >
              <img class="attachment-icon" src="@/assets/img/contract_opreate_icon_annex_1.png" />
              <span v-if="item" class="uploaded-attachment-name">{{
                decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')
              }}</span>
              <i
                v-if="item"
                class="el-icon-circle-close-outline clear-uploaded-file"
                @click="clearUploadedFile(index)"
              ></i>
            </p>
          </div>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input
            type="textarea"
            :rows="2"
            style="width: 620px"
            size="small"
            placeholder="请输入备注"
            v-model.trim="form.remark"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <!-- [收款计划] -->
        <template v-if="isSales">
          <div class="subject mgb-10">收款计划</div>
          <div class="plan-item mgb-10" v-for="(plan, index) in proceeds_plan" :key="index">
            <!-- [下面一行三列] -->
            <div class="settlement-detail-item-grid">
              <el-form-item
                prop="proceeds_amount"
                label="收款金额："
                label-width="106px"
                style="order: 1"
              >
                <el-input
                  size="small"
                  placeholder="0.00"
                  v-model="plan.proceeds_amount"
                  style="width: 140px"
                />
              </el-form-item>
              <el-form-item
                prop="proceeds_plan_date"
                label="计划收款日期："
                label-width="106px"
                style="order: 10"
              >
                <el-date-picker
                  size="small"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  class="plan-date"
                  type="date"
                  placeholder="选择日期"
                  v-model="plan.proceeds_plan_date"
                  style="width: 140px"
                />
              </el-form-item>
              <el-form-item
                prop="obtained_amount"
                label="已收金额："
                label-width="106px"
                style="order: 1"
              >
                <el-input
                  size="small"
                  placeholder="0.00"
                  v-model="plan.obtained_amount"
                  style="width: 140px"
                />
              </el-form-item>
              <el-form-item
                prop="to_obtain_amount"
                label="待收金额："
                label-width="106px"
                style="order: 1"
              >
                <el-input
                  size="small"
                  placeholder="0.00"
                  v-model="plan.to_obtain_amount"
                  style="width: 140px"
                />
              </el-form-item>
              <el-form-item
                prop="invoice_amount"
                label="已开票金额："
                label-width="106px"
                style="order: 1"
              >
                <el-input
                  size="small"
                  placeholder="0.00"
                  v-model="plan.invoice_amount"
                  style="width: 140px"
                />
              </el-form-item>
            </div>
            <div class="close-btn" @click="removePlan(index)" v-if="!isOnlyEmpty">
              <tg-icon name="ico-cross-lite" />
            </div>
          </div>
          <div class="plan-add-btn" @click="addOnePlan">
            <tg-icon name="ico-btn-add" />
            <span>点击添加</span>
          </div>
        </template>
        <tg-block class="contract-frm-block-basic mgt-10" v-if="false">
          <el-table
            stripe
            border
            :header-cell-style="{ backgroundColor: '#f6f6f6', padding: '8px 0' }"
            :data="proceeds_plan"
          >
            <el-table-column
              :formatter="(row, column, cellValue, index) => index + 1"
              label="序号"
              width="60"
              align="center"
            />
            <el-table-column prop="proceeds_amount" label="收款金额" align="right">
              <template #default="{ $index }">
                <el-input v-model="proceeds_plan[$index].proceeds_amount" size="small" />
              </template>
            </el-table-column>
            <el-table-column
              prop="proceeds_plan_date"
              label="计划收款日期"
              align="right"
              width="150"
            >
              <template #default="{ $index }">
                <el-date-picker
                  v-model="proceeds_plan[$index].proceeds_plan_date"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  class="plan-date"
                  type="date"
                  placeholder="选择日期"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column prop="obtained_amount" label="已收金额" align="right">
              <template #default="{ $index }">
                <el-input v-model="proceeds_plan[$index].obtained_amount" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="to_obtain_amount" label="待收金额" align="right">
              <template #default="{ $index }">
                <el-input v-model="proceeds_plan[$index].to_obtain_amount" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="invoice_amount" label="已开票金额" align="right">
              <template #default="{ $index }">
                <el-input v-model="proceeds_plan[$index].invoice_amount" size="small" />
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template #default="{ $index }">
                <i
                  v-if="proceeds_plan.length > 1"
                  class="delete-btn el-icon-delete"
                  @click="handleDeletePlan($index)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
          <p class="add-table-line" @click="addOnePlan">
            <i class="el-icon-circle-plus"></i>点击添加
          </p>
        </tg-block>
      </el-form>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在提交数据，请稍候..." />
  </div>
</template>

<script src="./contract_coexist.ts"></script>

<style lang="less">
@import './contract.less';
</style>
