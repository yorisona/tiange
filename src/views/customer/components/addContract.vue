<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 14:10:31
 * @LastEditTime: 2020-04-18 14:42:29
 * @LastEditors: 肖槿
 -->
<style lang="less" scoped>
.box1 {
  background: #fff !important;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
}
.box2 {
  background: #fff !important;
  margin-top: 10px;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
}
.box3 {
  background: #fff !important;
  margin-top: 10px;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
}
.box4 {
  background: #fff !important;
  margin-top: 10px;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
}
/deep/ .el-dialog {
  margin-bottom: 70px;
  padding-bottom: 0;
}
/deep/ .el-dialog__header {
  text-align: left !important;
}
#add-contract {
  // /deep/ .el-button:hover {
  //   background-color: #396fff;
  // }
  /deep/ .el-dialog__header {
    background-color: #f2f6f9;
    margin: 0;
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: var(--text-color);
    }
    .el-dialog__headerbtn {
      top: 12px;
      font-size: 22px;
      .el-dialog__close {
        color: var(--text-third-color) !important;
      }
    }
  }
  /deep/ .el-dialog__body {
    padding: 0;
    background: #f2f6f9;
    .dialog-content {
      // max-height: 550px;
      // overflow-y: auto;
      .content-header {
        font-size: 14px;
        color: var(--text-color);
        height: 40px;
        line-height: 40px;
        padding-left: 52px;
        position: relative;
      }
      .content-body {
        .content-line {
          // height: 52px;
          line-height: 52px;
          .content-label {
            display: inline-block;
            width: 205px;
            text-align: right;
            vertical-align: top;
            em {
              font-style: normal;
              color: #f26467;
              margin-right: 5px;
            }
          }
          .content-value {
            display: inline-block;
            width: 580px;
            .value-select {
              width: 100%;
            }
            .sale-chance-wrap {
              border-radius: 10px;
              background-color: #f6f6f6;
              padding: 12px 20px;
              line-height: 26px;
              margin-top: 10px;
              .chance-checkbox {
                margin: 10px 5px 0 0;
                min-width: 130px;
              }
            }
            .selected-sale-chance-wrap {
              line-height: 24px;
              padding: 10px 0;
              .selected-sale-chance {
                display: inline-block;
                line-height: 24px;
                background-color: #f2f2f2;
                font-size: 14px;
                padding: 0 10px;
                margin-bottom: 10px;
                margin-right: 6px;
              }
            }
            .short-input {
              width: 230px;
            }
            .short-label {
              width: 100px;
              display: inline-block;
              text-align: right;
            }
            .upload-btn-wrap {
              display: inline-block;
              .upload-btn {
                color: #fff;
                position: relative;
                padding-left: 30px;
                i {
                  position: absolute;
                  top: 7px;
                  left: 8px;
                }
              }
            }
            .upload-tips {
              font-size: 12px;
              color: var(--text-third-color);
              margin-left: 11px;
            }
            .uploaded-attachment-name {
              display: inline-block;
              max-width: 250px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: middle;
              color: #396fff;
            }
            .clear-uploaded-file {
              color: #f26467;
              font-size: 18px;
              font-weight: 600;
              vertical-align: middle;
              cursor: pointer;
            }
            .approver {
              width: 64px;
              height: 28px;
              display: inline-block;
              background: #f6f6f6;
              color: #666;
              line-height: 28px;
              text-align: center;
              border-radius: 10px;
            }
            .approver-icon {
              color: #dadada;
              font-size: 20px;
              margin: 0 5px;
              vertical-align: middle;
              font-weight: 600;
            }
            .tips {
              font-size: 12px;
              color: #f8931c;
              i {
                margin: 0 5px;
              }
            }
            .company-name.error {
              /deep/ .el-input__inner {
                border-color: #f34b60;
              }
            }
            .company-name-slot {
              color: #f34b60;
              span {
                color: #396fff;
                margin: 0 13px;
                cursor: pointer;
              }
            }
          }
        }
        .plan-table-wrap {
          padding: 25px 120px;
          .el-input .el-input__inner {
            text-align: right;
          }
          .plan-date {
            width: 100%;
            // .el-input__inner {}
          }
          .add-table-line {
            height: 32px;
            border: #d5e1f3 dashed 1px;
            text-align: center;
            line-height: 32px;
            margin-top: 10px;
            cursor: pointer;
            color: #396fff;
            i {
              margin-right: 6px;
              font-size: 15px;
              color: #396fff;
            }
          }
          .delete-btn {
            font-size: 22px;
            color: #bfc1c8;
            cursor: pointer;
            &:hover {
              // background-position: -118px -64px;
              color: #396fff;
            }
          }
        }
      }
    }
  }
  // /deep/ .el-dialog__footer {
  .footer {
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    text-align: center;
    background: #f2f6f9;
    padding: 20px 0;
    z-index: 2020;
    .el-button {
      min-width: 80px;
      height: 34px;
      padding: 8px 20px;
      // margin-top: 10px;
      &.save-btn {
        color: #fff;
        border-color: #396fff;
        box-shadow: 0px 4px 10px 0px rgba(13, 16, 22, 0.2);
      }
      &.close-btn {
        box-shadow: 0px 4px 10px 0px rgba(13, 16, 22, 0.2);
      }
    }
  }
  // }
}
.attachment-icon {
  width: 25px;
  vertical-align: middle;
}
/deep/ .el-select-dropdown__wrap {
  max-width: 778px;
}
</style>

<template>
  <div id="add-contract">
    <el-dialog
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="990px"
      top="70px"
      @close="visible = false"
    >
      <template #title>
        <div class="title">{{ type === 'add' ? '新增客户合同' : '编辑客户合同' }}</div>
      </template>
      <div class="dialog-content" id="dialog-content">
        <div class="box1">
          <div class="content-header">合同基础信息</div>
          <div class="content-body">
            <div class="content-line">
              <div class="content-label">合同编号：</div>
              <div class="content-value">{{ form.contract_uid }}（系统生成）</div>
            </div>
            <div class="content-line">
              <div class="content-label"><em>*</em>关联店铺：</div>
              <div class="content-value">
                <el-select
                  v-model="form.partner_id"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请搜索并选择店铺名称"
                  :remote-method="getAllStoreName"
                  class="value-select"
                  size="medium"
                  @change="handleShopNameChange"
                >
                  <el-option
                    v-for="(item, index) in allStoreName"
                    :key="index"
                    :label="item.shop_name"
                    :value="item.id"
                  >
                    <span>{{ item.shop_name }}</span>
                    <span style="color: var(--text-des-color)">{{
                      item.company_name ? '(' + item.company_name + ')' : '(' + '--' + ')'
                    }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label"><em>*</em>客户(公司)名称：</div>
              <div class="content-value">
                <el-input
                  v-model="form.company_name"
                  :class="['company-name', { error: form.company_name === '' }]"
                  size="medium"
                  placeholder="请先关联店铺"
                  disabled
                >
                  <template #suffix>
                    <p v-show="form.company_name === ''" class="company-name-slot">
                      该店铺没有录入公司名称
                      <span @click="handleAddCompanyNameClick">去补充></span>
                    </p>
                  </template>
                </el-input>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label"><em>*</em>合同类型：</div>
              <div class="content-value">
                <el-select
                  v-model="form.contract_type"
                  class="value-select"
                  size="medium"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in contractTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label"><em>*</em>销售渠道：</div>
              <div class="content-value">
                <div class="sale-chance-wrap">
                  <p>
                    <el-checkbox
                      :indeterminate="saleChance.isIndeterminate"
                      v-model="saleChance.checkAll"
                      @change="handleCheckAllChange"
                      >全选</el-checkbox
                    >
                  </p>
                  <el-checkbox-group
                    v-model="form.sale_chance"
                    @change="handleCheckedSaleChanceChange"
                  >
                    <el-checkbox
                      class="chance-checkbox"
                      v-for="(chance, index) in saleChances"
                      :label="chance.value"
                      :key="index"
                      >{{ chance.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                  <!-- <el-checkbox class="chance-checkbox" v-for="(chance, index) in saleChances" :key="index" :label="chance.value">{{chance.label}}</el-checkbox> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box2">
          <div class="content-header">合同明细</div>
          <div class="content-body">
            <div class="content-line">
              <div class="content-label">产品(销售渠道)：</div>
              <div class="content-value">
                <div class="selected-sale-chance-wrap">
                  <span
                    class="selected-sale-chance"
                    v-for="(item, index) in selectedSaleChances"
                    :key="index"
                    >{{ item.label }}</span
                  >
                </div>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label">数量：</div>
              <div class="content-value">
                <el-input
                  class="short-input"
                  type="number"
                  v-model="form.num"
                  placeholder="请输入数量"
                  size="medium"
                  @input="value => onlyPositiveInteger(value)"
                  @mousewheel.native.prevent
                ></el-input>
                <span class="short-label">标准单价：</span>
                <el-input
                  class="short-input"
                  type="number"
                  v-model="form.price"
                  placeholder="请输入标准单价"
                  size="medium"
                  @input="computeContractAmount"
                  @mousewheel.native.prevent
                ></el-input>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label">单位：</div>
              <div class="content-value">
                <!-- <el-input class="short-input" placeholder="场" size="medium"></el-input> -->
                <el-select
                  v-model="form.unit"
                  class="short-input"
                  size="medium"
                  placeholder="请选择单位"
                >
                  <el-option label="场" :value="1"></el-option>
                  <el-option label="次" :value="2"></el-option>
                </el-select>
                <span class="short-label">折扣：</span>
                <el-input
                  class="short-input"
                  type="number"
                  v-model="form.discount"
                  placeholder="输入1.0 - 10.0的数字"
                  size="medium"
                  @input="computeContractAmount"
                  @mousewheel.native.prevent
                ></el-input>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label">
                <em v-show="this.form.contract_type !== 2">*</em>合同金额：
              </div>
              <div class="content-value">
                <el-input
                  class="short-input"
                  type="number"
                  v-model="form.contract_amount"
                  placeholder="0.00"
                  size="medium"
                  @input="handleContractAmountChange"
                  @mousewheel.native.prevent
                ></el-input>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label">合同附件单：</div>
              <div class="content-value">
                <template>
                  <!-- v-show="!uploadAttachment.file" -->
                  <!-- :disabled="uploadAttachment.uploading" -->
                  <el-upload
                    action
                    class="upload-btn-wrap"
                    :disabled="no_upload_click"
                    :show-file-list="false"
                    :multiple="false"
                    :http-request="uploadAttachmentFile"
                    accept="application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  >
                    <!-- :loading="uploadAttachment.uploading" -->

                    <el-button
                      class="upload-btn btn-blue big-button"
                      size="small"
                      type="primary"
                      :disabled="no_upload_click"
                    >
                      <i class="iconfont icon-zhongxinshangchuan"></i>
                      {{ this.form.attachment_url.length === 5 ? '最多传5个' : '上传文件' }}
                    </el-button>
                  </el-upload>
                </template>
                <span class="upload-tips">支持扩展名：.docx .doc .pdf</span>
                <div class="uploaded-list">
                  <p
                    v-for="(item, index) in this.form.attachment_url"
                    :key="index"
                    style="margin-right: 10px; line-height: 30px"
                  >
                    <img
                      class="attachment-icon"
                      src="@/assets/img/contract_opreate_icon_annex_1.png"
                    />
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
                <!-- <span v-if="uploadAttachment.file">
                <span class="uploaded-attachment-name">{{uploadAttachment.file.name}}</span>
                <i
                  class="el-icon-circle-close-outline clear-uploaded-file"
                  @click="clearUploadedFile"
                ></i>
              </span>-->
              </div>
            </div>
          </div>
        </div>
        <div class="box3">
          <div class="content-header">收款计划</div>
          <div class="content-body">
            <div class="plan-table-wrap">
              <el-table
                stripe
                border
                :header-cell-style="{
                  backgroundColor: 'var(--table-thead-th-bg-color)',
                  padding: '8px 0',
                }"
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
                    <el-input
                      v-model="proceeds_plan[$index].proceeds_amount"
                      size="small"
                    ></el-input>
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
                    ></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="obtained_amount" label="已收金额" align="right">
                  <template #default="{ $index }">
                    <el-input
                      v-model="proceeds_plan[$index].obtained_amount"
                      size="small"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="to_obtain_amount" label="待收金额" align="right">
                  <template #default="{ $index }">
                    <el-input
                      v-model="proceeds_plan[$index].to_obtain_amount"
                      size="small"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="invoice_amount" label="已开票金额" align="right">
                  <template #default="{ $index }">
                    <el-input
                      v-model="proceeds_plan[$index].invoice_amount"
                      size="small"
                    ></el-input>
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
            </div>
          </div>
        </div>
        <div class="box4">
          <div class="content-header">跟进人</div>
          <div class="content-body">
            <div class="content-line">
              <div class="content-label"><em>*</em>客户经理：</div>
              <div class="content-value">
                <el-select
                  v-model="form.manager_id"
                  class="value-select"
                  size="medium"
                  placeholder="请选择客户经理"
                  @focus="handleCustomerManagerSelectFocus"
                  @change="handleCustomerManagerSelectChange"
                >
                  <el-option
                    v-for="item in accountManager"
                    :key="item.id"
                    :label="item.username"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label"><em>*</em>所属部门：</div>
              <div class="content-value">
                <el-select
                  v-model="form.department"
                  class="value-select"
                  size="medium"
                  disabled
                  placeholder="请先选择客户经理"
                >
                  <el-option
                    v-for="item in department"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="content-line">
              <div class="content-label"><em>*</em>审批人：</div>
              <div class="content-value">
                <!-- <el-select v-model="form.approver_id" class="value-select" size="medium" placeholder="请选择">
                <el-option
                  v-for="item in approver"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id">
                </el-option>
              </el-select>-->
                <span class="approver">{{
                  getApproverUsername(CONSTRACT_APPROVER.xyx_manager) || '文竹'
                }}</span>
                <i class="el-icon-arrow-right approver-icon"></i>
                <span v-show="form.contract_amount >= 500000" class="approver">{{
                  getApproverUsername(CONSTRACT_APPROVER.general_manager) || '红掌'
                }}</span>
                <i
                  v-show="form.contract_amount >= 500000"
                  class="el-icon-arrow-right approver-icon"
                ></i>
                <span class="approver">{{
                  getApproverUsername(CONSTRACT_APPROVER.risk_control_specialist) || '益智'
                }}</span>
                <span v-show="form.contract_amount >= 500000" class="tips">
                  <i class="el-icon-warning"></i>合同金额大于50万元，需红掌审批
                </span>
              </div>
            </div>
            <!-- <div class="content-line">
            <div class="content-label">创建时间：</div>
            <div class="content-value">
              2019.01.01
            </div>
          </div>-->
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button size="medium" class="big-button close-btn" @click="visible = false"
          >取消</el-button
        >
        <!--  :loading="this.uploadAttachment.uploading" -->
        <el-button
          class="save-btn big-button btn-blue"
          size="medium"
          type="primary"
          @click="handleSubmitSave"
          :disabled="isAddingEditing"
          >{{ type === 'add' ? '保存' : '提交审批' }}</el-button
        >
        <!-- this.uploadAttachment.uploading ? '附件上传中' :  -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contractTypeOptions, saleChances } from '@/const/options';
import {
  uploadContractAttachment,
  getDepartment,
  getApprover,
  saveContract,
  getContractUid,
  getUserByRole,
} from '@/api/customer';
import { ROLE_CODE } from '@/const/roleCode';
import { CONSTRACT_APPROVER } from '@/utils/config';
import { QueryShopAndCompany } from '@/services/customers';
import { RouterNameProjectManage } from '@/const/router';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';

export default {
  name: 'AddContract',
  props: {
    type: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      no_upload_click: false,
      isAddingEditing: false,
      CONSTRACT_APPROVER, // 审批人id常量
      // 新增弹窗显示标志
      visible: false,
      // 选项
      contractTypeOptions,
      saleChances,
      planData: [],
      accountManager: [],
      department: [],
      approver: [],
      // 全选状态
      saleChance: {
        checkAll: false,
        isIndeterminate: false,
      },
      // uploadAttachment: {
      //   uploading: false,
      //   file: null
      // },
      uploadAttachment: [],
      // 合同表单
      form: {
        contract_uid: '',
        customer_name: '',
        contract_type: '',
        sale_chance: [],
        num: undefined,
        price: undefined,
        unit: 1,
        discount: undefined,
        contract_amount: undefined,
        attachment_url: [],
        proceeds_plan: [
          {
            proceeds_plan_date: '',
            proceeds_amount: undefined,
            obtained_amount: undefined,
            to_obtain_amount: undefined,
            invoice_amount: undefined,
          },
        ],
        department: undefined,
        manager_id: undefined,
        // approver_id: undefined
        company_name: undefined,
        partner_id: undefined,
      },
      // 收款计划
      proceeds_plan: [
        {
          proceeds_plan_date: '',
          proceeds_amount: undefined,
          obtained_amount: undefined,
          to_obtain_amount: undefined,
          invoice_amount: undefined,
        },
      ],
      // 删除的收款计划，暂存变量
      deletedPlans: [],
      approverList: [
        { id: 6, username: '' }, // 文竹
        { id: 61, username: '' }, // 益智
        { id: 74, username: '' }, // 红掌
      ],
      allStoreName: [], // 所有店铺选项
      // 客户(公司)名称 字段的提示文字显示标志
      companyNameIsShow: false,
    };
  },
  computed: {
    // 计算选中的销售渠道在合同明细里面显示
    selectedSaleChances() {
      const selectedSaleChances = this.saleChances.filter(item => {
        if (this.form.sale_chance.find(selectedItem => selectedItem === item.value)) {
          return true;
        } else {
          return false;
        }
      });
      return selectedSaleChances;
    },
  },
  methods: {
    // 提供给父组件使用，勿删
    show(contractDetail) {
      this.no_upload_click = false;
      if (this.type === 'add') this.getContractNumber();
      this.getAccountManager();
      this.getDepartment();
      this.getApprover();
      this.resetForm();

      // 如果是编辑 获取详情 写入表单
      if (this.type === 'edit') {
        // console.log(contractDetail)
        // for (let key in this.form) {
        //   this.form[key] = contractDetail.contract_info[key]
        // }
        if (!contractDetail) return false;
        this.saleChance.checkAll =
          contractDetail.contract_info.sale_chance.length === saleChances.length;
        this.saleChance.isIndeterminate =
          contractDetail.contract_info.sale_chance.length !== saleChances.length &&
          contractDetail.contract_info.sale_chance.length !== 0;
        this.uploadAttachment.file = contractDetail.contract_detail.attachment_url
          ? {
              name: contractDetail.contract_detail.attachment_url.split('/')[
                contractDetail.contract_detail.attachment_url.split('/').length - 1
              ],
            }
          : null;
        this.form = {
          contract_uid: contractDetail.contract_info.contract_uid,
          customer_name: contractDetail.contract_info.customer_name,
          contract_type: contractDetail.contract_info.contract_type,
          sale_chance: contractDetail.contract_info.sale_chance.map(item => item.value),
          num: contractDetail.contract_detail.num,
          price: contractDetail.contract_detail.price,
          unit: contractDetail.contract_detail.unit,
          discount: contractDetail.contract_detail.discount,
          contract_amount: contractDetail.contract_detail.contract_amount,
          attachment_url:
            contractDetail.contract_detail.attachment_url === ''
              ? []
              : contractDetail.contract_detail.attachment_url.split(','),
          proceeds_plan: [],
          department: contractDetail.contract_info.department + '',
          manager_id: contractDetail.contract_info.manager_id,
          // approver_id: contractDetail.contract_info.approver_id,
          id: contractDetail.contract_info.id,
          company_name: contractDetail.partner_info.partner_name,
          partner_id: contractDetail.partner_info.id,
        };
        this.proceeds_plan = contractDetail.proceeds_plan.map(item => {
          return {
            proceeds_plan_date: item.proceeds_plan_date_str,
            proceeds_amount: item.proceeds_amount,
            obtained_amount: item.obtained_amount,
            to_obtain_amount: item.to_obtain_amount,
            invoice_amount: item.invoice_amount,
            id: item.id,
          };
        });
      }
      this.visible = true;

      // 自动将滚动条滑到顶部
      setTimeout(() => {
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
      }, 100);
    },
    // 销售渠道全选
    handleCheckAllChange(val) {
      this.form.sale_chance = val ? saleChances.map(item => item.value) : [];
      this.saleChance.isIndeterminate = false;
    },
    // 处理已选中的销售渠道变动（checkbox group）
    handleCheckedSaleChanceChange(value) {
      // console.log(value, saleChances)
      const checkedCount = value.length;
      this.saleChance.checkAll = checkedCount === saleChances.length;
      this.saleChance.isIndeterminate = checkedCount > 0 && checkedCount < saleChances.length;
    },
    // 上传附件
    uploadAttachmentFile(value) {
      // console.log(this.form.attachment_url)
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('attachment_type', 'contract');
      // this.uploadAttachment.uploading = true;
      this.uploadAttachment.file = value.file;

      uploadContractAttachment(formData)
        .then(res => {
          if (!res.data.success) {
            this.uploadAttachment.file = null;
            this.$message({
              type: 'warning',
              message: res.data.message,
              showClose: true,
              duration: 2000,
            });
          } else {
            // this.form.attachment_url = res.data.data.source;
            //   this.uploadAttachment.push({
            //   file: value.file.name,
            //   path: res.data.data.source
            // })
            this.form.attachment_url.push(res.data.data.source);
            if (this.form.attachment_url.length === 5) {
              this.no_upload_click = true;
              //  this.uploadAttachment.uploading = true;
            } else {
              this.no_upload_click = false;
            }
          }
          // this.uploadAttachment.uploading = false;
        })
        .catch(error => {
          this.$message({
            type: 'warning',
            message: '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          // this.uploadAttachment.uploading = false;
          console.log(error.message);
        });
    },
    // 清除已上传的附件
    clearUploadedFile(index) {
      this.form.attachment_url.splice(index, 1);
      this.no_upload_click = false;
    },
    // 添加一条收款计划
    addOnePlan() {
      this.proceeds_plan.push({
        proceeds_plan_date: '',
        proceeds_amount: undefined,
        obtained_amount: undefined,
        to_obtain_amount: undefined,
        invoice_amount: undefined,
      });
    },
    // 移除一条收款计划
    handleDeletePlan(index) {
      if (this.proceeds_plan[index].id) {
        this.proceeds_plan[index].is_delete = 1;
        this.deletedPlans.push(this.proceeds_plan[index]);
      }
      this.proceeds_plan.splice(index, 1);
    },
    onlyPositiveInteger(inputValue) {
      const getPositiveInteger = value => {
        return value.replace(/\D/g, '').replace(REG_REMOVE_PREFIX_ZERO, '');
      };
      console.log('>>>>');
      this.form.num = getPositiveInteger(inputValue);
    },
    // 计算合同金额
    computeContractAmount() {
      // console.log('num', (this.form.num))
      // console.log('price', (this.form.price))
      // console.log('discount', (this.form.discount))
      // debugger
      if (this.form.num < 0)
        setTimeout(() => {
          this.form.num = undefined;
        }, 50);
      if (this.form.price < 0)
        setTimeout(() => {
          this.form.price = undefined;
        }, 50);
      if (this.form.discount < 0) {
        setTimeout(() => {
          this.form.discount = undefined;
        }, 50);
        this.$message({
          type: 'warning',
          message: '折扣不能小于0',
        });
      }
      if (this.form.discount > 10) {
        setTimeout(() => {
          this.form.discount = undefined;
        }, 50);
        this.$message({
          type: 'warning',
          message: '折扣不能大于10',
        });
      }

      setTimeout(() => {
        let amount;
        if (this.form.num && this.form.price && !this.form.discount) {
          amount = this.form.num * this.form.price;
        } else if (this.form.num && this.form.price && this.form.discount) {
          // if (this.form.discount > 10 || this.form.discount < 0) {
          //   this.$message({
          //     type: 'warning',
          //     message: '合同折扣输入有误'
          //   })
          //   return false
          // }
          amount = (this.form.num * this.form.price * this.form.discount) / 10;
        }

        this.form.contract_amount = amount ? amount.toFixed(0) : amount;
      }, 50);
    },
    // 合同金额变动触发
    handleContractAmountChange() {
      if (this.form.contract_amount < 0)
        setTimeout(() => {
          this.form.contract_amount = undefined;
        }, 50);
      this.form.discount = undefined;
    },
    // 获取客户经理
    getAccountManager() {
      // queryUserNames({ role: ROLE_CODE.customer_manager + ',' + ROLE_CODE.major_customer_manager }).then(res => {
      //   if (res.data.success) {
      //     this.accountManager = res.data.data.user_data
      //   } else {
      //     this.$message({
      //       type: 'warning',
      //       message: res.data.message,
      //       duration: 2000,
      //       showClose: true
      //     })
      //   }
      // }).catch(error => {
      //   this.$message({
      //     type: 'error',
      //     message: '客户经理获取失败，稍后重试',
      //     duration: 2000,
      //     showClose: true
      //   })
      //   console.log(error.message)
      // })
      getUserByRole({
        roles: ROLE_CODE.customer_manager + ',' + ROLE_CODE.major_customer_manager,
      })
        .then(res => {
          if (res.data.success) {
            this.accountManager = res.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '客户经理获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 获取部门
    getDepartment() {
      getDepartment()
        .then(res => {
          if (res.data.success) {
            this.department = [];
            for (const key in res.data.data) {
              this.department.push({
                label: res.data.data[key],
                value: key,
              });
            }
            // this.department = res.data.data
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '部门获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 获取合同审批人
    getApprover() {
      getApprover()
        .then(res => {
          if (res.data.success) {
            // this.approver = res.data.data
            res.data.data.forEach(info => {
              this.approverList = this.approverList.map(item => {
                if (item.id === info.id) {
                  item.username = info.username;
                }
                return item;
              });
            });
            // console.log(this.approverList)
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '审批人获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 点击保存
    handleSubmitSave() {
      // 校验五个必填项
      // if (this.form.customer_name === '') {
      //   this.$message({
      //     type: 'warning',
      //     message: '请输入客户名称',
      //     duration: 2000,
      //     showClose: true
      //   })
      //   return false
      // }
      if (!this.form.partner_id) {
        this.$message({
          type: 'warning',
          message: '请选择店铺',
          duration: 2000,
          showClose: true,
        });
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
        return false;
      }
      if (!this.form.company_name) {
        this.$message({
          type: 'warning',
          message: '该店铺没有录入公司名称，请先补充',
          duration: 2000,
          showClose: true,
        });
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
        return false;
      }
      if (this.form.contract_type === '') {
        this.$message({
          type: 'warning',
          message: '请选择合同类型',
          duration: 2000,
          showClose: true,
        });
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
        return false;
      }
      if (this.form.sale_chance.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个销售渠道',
          duration: 2000,
          showClose: true,
        });
        if (document.getElementsByClassName('dialog-content')[0])
          document.getElementsByClassName('dialog-content')[0].scrollTop = 0;
        return false;
      }
      // 当合同类型为框架协议时，合同金额可以为 0
      if (!this.form.contract_amount && this.form.contract_type !== 2) {
        this.$message({
          type: 'warning',
          message: '请输入合同金额',
          duration: 2000,
          showClose: true,
        });
        return false;
      }
      if (!this.form.manager_id) {
        this.$message({
          type: 'warning',
          message: '请选择客户经理',
          duration: 2000,
          showClose: true,
        });
        return false;
      }
      if (!this.form.department) {
        this.$message({
          type: 'warning',
          message: '请选择所属部门',
          duration: 2000,
          showClose: true,
        });
        return false;
      }
      // if (!this.form.approver_id) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择审批人',
      //     duration: 2000,
      //     showClose: true
      //   })
      //   return false
      // }

      // 编辑时 合并已删除的数据
      if (this.type === 'edit') {
        this.form.proceeds_plan = this.proceeds_plan.concat(this.deletedPlans);
      } else {
        this.form.proceeds_plan = this.proceeds_plan;
      }

      // 提交保存
      saveContract(this.form)
        .then(res => {
          if (res.data.success) {
            this.visible = false;
            this.proceeds_plan = [
              {
                proceeds_plan_date: '',
                proceeds_amount: undefined,
                obtained_amount: undefined,
                to_obtain_amount: undefined,
                invoice_amount: undefined,
              },
            ];
            this.deletedPlans = [];
            this.$message({
              type: 'success',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
            if (this.type === 'add') this.$emit('added');
            if (this.type === 'edit') this.$emit('edited');
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '合同保存失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 获取合同编号
    async getContractNumber() {
      getContractUid()
        .then(res => {
          if (res.data.success) {
            this.form.contract_uid = res.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '合同编号获取失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
          console.log(error.message);
        });
    },
    // 重置表单
    resetForm() {
      this.form = {
        contract_uid: '',
        customer_name: '',
        contract_type: '',
        sale_chance: [],
        num: undefined,
        price: undefined,
        unit: 1,
        discount: undefined,
        contract_amount: undefined,
        attachment_url: [],
        proceeds_plan: [
          {
            proceeds_plan_date: '',
            proceeds_amount: undefined,
            obtained_amount: undefined,
            to_obtain_amount: undefined,
            invoice_amount: undefined,
          },
        ],
        department: undefined,
        manager_id: undefined,
        company_name: undefined,
        partner_id: undefined,
        // approver_id: undefined
      };
      this.saleChance.checkAll = false;
      this.saleChance.isIndeterminate = false;
    },
    // 根据id获取审批人名称
    getApproverUsername(id) {
      return this.approverList.find(item => item.id === id).username;
    },
    // 当选择客户经理select处于焦点状态事件，检测选项是否为空，如果没有选项，再次请求
    handleCustomerManagerSelectFocus() {
      if (this.accountManager.length === 0) {
        this.getAccountManager();
      }
    },
    // 客户经理选项发生变化，自动选择部门
    handleCustomerManagerSelectChange(value) {
      const department = this.accountManager.find(item => item.id === value);
      // debugger
      this.form.department = department ? department.department + '' : undefined;
    },
    // 获取所有店铺，关联店铺select使用
    async getAllStoreName(shop_name) {
      const { data: response } = await QueryShopAndCompany({ shop_name });

      if (response.success) {
        if (Array.isArray(response.data)) {
          this.allStoreName = response.data;
        }
      } else {
        this.$message.warning(response.message);
      }
    },
    // 补充公司信息
    handleAddCompanyNameClick() {
      this.visible = false;
      this.$router.push({
        name: RouterNameProjectManage.marketing.customer.list,
      });
    },
    // 检测关联店铺选择事件，赋值所选店铺的公司名称
    handleShopNameChange(value) {
      // console.log(value)
      const shop = this.allStoreName.find(item => item.id === value);
      if (shop) {
        // console.log(shop)
        // thiscompanyNameIsShow = shop.company_name === ''
        this.form.company_name = shop.company_name;
      }
    },
  },
};
</script>
