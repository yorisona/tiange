<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-09-15 15:45:41
-->
<template>
  <div class="tg-live-project-dialog-pay-refund">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="628px"
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>{{ '付款退款' }}</template>
      <div style="overflow: overlay">
        <el-form
          :rules="rules"
          :model="dataForm"
          ref="formRef"
          label-width="72px"
          size="mini"
          label-position="left"
        >
          <div
            v-if="businessType === 1"
            class="row-pay"
            :style="{ marginBottom: dataForm.register_way === 1 ? '10px' : '0' }"
          >
            <el-form-item
              class="mgb0"
              label="登记方式："
              prop="register_way"
              :rules="{ required: true, message: '请选择登记方式', trigger: ['blur', 'change'] }"
            >
              <el-radio-group v-model="dataForm.register_way" @change="registerWayChange">
                <el-radio :label="1">手动登记(煜丰账户收款)</el-radio>
                <el-radio :label="2">认领流水(构美账户收款)</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div
            class="form-row-two-column"
            v-if="businessType === 1 && dataForm.register_way === 1"
            style="margin-bottom: 10px"
          >
            <el-form-item label="退款金额：" prop="refund_amount">
              <el-input
                clearable
                placeholder="请输入退款金额"
                :value="dataForm.refund_amount"
                @input="refundAmountChange"
              ></el-input>
            </el-form-item>
            <el-form-item label="收款日期：" prop="gather_date">
              <el-date-picker
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                :editable="false"
                type="date"
                placeholder="请选择退款日期"
                v-model="dataForm.gather_date"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="row-pay">
            <el-form-item label="退款方式：" prop="gather_way">
              <el-radio-group
                v-model="dataForm.gather_way"
                @change="gatherWayChange"
                style="
                  width: 400px;
                  display: inline-grid;
                  grid-template-columns: repeat(4, 90px);
                  column-gap: 0;
                "
              >
                <el-radio :label="3">对公银行</el-radio>
                <el-radio :label="2">对公支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <el-form-item
            v-if="businessType !== 1 || dataForm.register_way === 2"
            class="mgt-12"
            label="退款流水："
            prop="capital_revenue_flow_id"
            :rules="{ required: true, message: '请选择关联收入流水', trigger: 'change' }"
          >
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请选择关联收入流水"
              style="width: 100%"
              v-model="dataForm.capital_revenue_flow_id"
              :remote="dataForm.gather_way === 3 ? true : false"
              :filterable="dataForm.gather_way === 3 ? true : false"
              :clearable="dataForm.gather_way === 3 ? true : false"
              @clear="search_revenueFlow"
              :remote-method="search_revenueFlow"
            >
              <el-option
                v-for="item in flowList"
                :key="item.id"
                :value="item.id"
                :label="getLabel(item)"
              />
            </el-select>
          </el-form-item>
          <div class="row-way-detail" v-else>
            <div class="form-row-two-column" v-if="dataForm.gather_way === 3">
              <el-form-item label="银行卡号：" prop="bank_card_number">
                <el-input
                  clearable
                  placeholder="请输入银行卡号"
                  v-model="dataForm.bank_card_number"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司名称：" prop="company_name">
                <el-input
                  clearable
                  placeholder="请输入公司名称"
                  v-model="dataForm.company_name"
                ></el-input>
              </el-form-item>
              <el-form-item label="开户行：" prop="bank_of_deposit">
                <el-input
                  clearable
                  placeholder="请输入开户行"
                  v-model="dataForm.bank_of_deposit"
                ></el-input>
              </el-form-item>
            </div>
            <div class="form-row-two-column" v-if="dataForm.gather_way === 2">
              <el-form-item label="付款人：" prop="name">
                <el-input
                  clearable
                  placeholder="请输入付款人姓名"
                  v-model="dataForm.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="支付宝账号：" label-width="100px" prop="account">
                <el-input
                  clearable
                  placeholder="请输入支付宝账号"
                  v-model="dataForm.account"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="mgt-18">
            <el-form-item label="退款原因：" prop="refund_reason">
              <el-input
                type="textarea"
                :maxlength="100"
                :show-word-limit="true"
                placeholder="请填写退款原因"
                v-model="dataForm.refund_reason"
              ></el-input>
            </el-form-item>
          </div>
          <div class="mgt-18">
            <el-form-item class="upload-certificate" label="上传凭证：" prop="certificate_file">
              <div>
                <div style="height: 32px">
                  <el-upload
                    v-model="dataForm.certificate_file"
                    action="/"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadFileHandler"
                    accept=".jpg,.jpeg,.png"
                    :disabled="dataForm.certificate_file.length >= 1 ? true : false"
                  >
                    <tg-button
                      class="upload-btn"
                      icon="ico-btn-upload"
                      :disabled="dataForm.certificate_file.length >= 1 ? true : false"
                      >上传文件</tg-button
                    >
                  </el-upload>
                </div>
                <div
                  style="
                    height: 16px;
                    line-height: 16px;
                    font-size: 12px;
                    color: var(--text-third-color);
                    margin-top: 6px;
                  "
                >
                  支持扩展名：JPG，JPGE，PNG，最多上传一个文件
                </div>
              </div>
              <div v-if="dataForm.certificate_file.length" class="fileList">
                <div style="height: 20px; line-height: 20px; margin-top: 12px">
                  <div style="display: inline-flex" class="line-clamp-1 uploaded-file">
                    <tg-button class="uploaded-file-btn" type="link">
                      <tg-icon
                        class="uploaded-file-btn-icon"
                        :name="getFileIcon(dataForm.certificate_file)"
                      ></tg-icon>
                      <span style="max-width: 300px" class="line-clamp-1">{{
                        decodeURI(getFileName(dataForm.certificate_file))
                      }}</span>
                    </tg-button>
                    <tg-button
                      class="mgl-12 uploaded-file-del"
                      type="link"
                      @click="handleRemoveFileClick()"
                    >
                      <tg-icon
                        style="width: 16px; height: 16px"
                        name="ico-frm-delete"
                        hoverName="ico-frm-delete-active"
                      ></tg-icon>
                    </tg-button>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./payRefund.ts"></script>
<style lang="less">
@import './payRefund.less';
</style>
