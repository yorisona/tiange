<!--
 * @Description: 供应商管理-供应商合同-新增结算单
 * @Author: 白青
 * @Date: 2019-09-04 14:34:12
 * @LastEditTime: 2021-12-22 10:32:35
 * @LastEditors: 肖槿
 -->
<style lang="scss" scoped>
@import '@/styles/vars.scss';
@import '@/assets/scss/public.scss';

.contract-select-empty {
  min-width: 158px;
  width: auto;
}

$color-primary: var(--theme-color);

#addAttachmentDialog {
  .box3 {
    ::v-deep .el-form-item__error {
      left: 112px !important;
      width: 150px;
    }
  }

  ::v-deep .el-dialog__body {
    /*height: 614px;*/
    max-height: 716px;
    overflow: auto;
  }

  // ::v-deep .el-dialog__body::-webkit-scrollbar {
  //   display: none;
  // }
  // 上传按钮置灰
  .selected-settlement {
    background-color: #dadee6;
    border-color: #dadee6;
  }

  em {
    font-style: normal;
    vertical-align: middle;
    color: #396fff;
    margin: 0 5px;
    display: inline-block;
    width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .box1 {
    background: #fff !important;
    padding-top: 8px;
    border-radius: 4px;
    padding-bottom: 10px;
  }

  .box2 {
    background: #fff !important;
    margin-top: 10px;
    padding-top: 8px;
    border-radius: 4px;
    padding-bottom: 10px;
  }

  .dialog-content {
    .content-block-header {
      padding: 0 10px;
      height: 37px;
      line-height: 37px;

      span {
        position: relative;
        color: var(--text-color);
        font-weight: 600;
        padding-left: 12px;
      }
    }

    .form-block {
      padding: 0 18px;
      display: flex;
      grid-row-gap: 18px;
      flex-wrap: wrap;
      justify-content: space-between;

      .contract_num {
        margin-left: 125px;
        background: #f6f6f6;
        padding: 7.6px 0;
        border-radius: 4px;
        padding-right: 10px;
      }

      & .contract-attachment-input {
        width: 158px;
      }

      ::v-deep .el-input__inner {
        border-radius: 4px;
      }

      ::v-deep .dsb {
        .el-input__inner {
          padding-right: 12px;
        }
      }

      .el-form-item {
        margin: 0;
      }

      .el-form-item:nth-child(3n) {
        margin-right: 0;
      }

      .upload-attachment {
        display: inline-block;

        .upload-btn {
          width: 100px;
        }
      }

      .upload-tips {
        margin-left: 11px;
        font-size: 12px;
        color: var(--text-third-color);
        position: relative;
        top: 5px;
      }

      .uploaded-list {
        width: 680px;

        ::v-deep .upload-file-list {
          .file-name {
            max-width: 280px;
          }

          & .file-item {
            width: 340px;
          }
        }
      }
    }

    .approval {
      .approval-username {
        display: inline-block;
        width: 64px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        border-radius: 4px;
        background: #f6f6f6;
      }

      .el-icon-arrow-right {
        color: #dadada;
        font-size: 18px;
        font-weight: 600;
        margin: 0 8px;
      }

      .approval-tips {
        font-size: 12px;
        color: #ff8b3d;
        margin-left: 8px;

        .el-icon-warning {
          color: #ff8b3d;
          margin-right: 2px;
        }
      }
    }
  }

  .box3 {
    margin-top: -29px;
    background: white;

    .delete_tr_wrap {
      position: relative;
    }

    .delete_tr {
      position: absolute;
      right: -23px;
      margin-top: -17px;

      .el-icon-error:hover {
        color: red !important;
      }
    }

    .content-header {
      font-weight: 600;
      color: var(--text-color);
      font-size: 14px;
      padding: 30px 20px;
      margin-top: 8px;
    }

    .content-body {
      padding: 0 18px;
      margin-top: -15px;
      padding-bottom: 20px;

      .line-status {
        background: #f6f6f6;
        padding: 9px 18px 16px 18px;
        margin-bottom: 10px;

        & ::v-deep .el-form-item__label:first-child {
          width: 113px;
        }
      }

      ::v-deep .el-input {
        width: 160px !important;
      }

      .add_tr {
        border: 1px dashed #e1e2e6;
        line-height: 30px;
        color: $add-form-color;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;

        > svg.icon {
          font-size: 10px;
          vertical-align: initial;
          font-weight: 600;
        }
      }

      .add_tr:hover {
        border: 1px dashed $color-primary;
      }

      ::v-deep .el-form-item__content {
        margin-left: 0 !important;
      }

      ::v-deep .el-form-item {
        margin-bottom: 0 !important;
        margin-right: 0;
      }

      ::v-deep .el-form {
        .form-grid {
          display: grid;
          margin: 12px 0 16px 0;
          grid-row-gap: 18px;
          flex-wrap: wrap;
          justify-content: space-between;
          grid-template-columns: 238px 238px 238px;

          ::v-deep .el-form-item__label {
            width: 112px;
          }
        }

        ::v-deep .el-form-item__content {
          margin-right: 20px;
          margin-bottom: 15px;
          display: inline-block;
        }
      }

      ::v-deep .el-input__inner {
      }
    }

    .form-remark {
      ::v-deep .el-form-item__error {
        position: relative;
        left: -706px;
      }
    }

    .content-body {
      ::v-deep .el-form-item__error {
        position: relative;
        right: 75px;
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/ .el-dialog__header {
  text-align: left !important;
}

/deep/ .add-attachment-dialog {
  .el-dialog__header {
    background-color: #f2f6f9;
    height: 50px;
    line-height: 50px;

    .title {
      color: var(--text-color);
      font-size: 18px;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      top: 14px;
      font-size: 22px;
      right: 15px;

      .el-dialog__close {
        color: var(--icon-color) !important;
      }
    }
  }

  .el-dialog__body {
    padding: 10px 0;
    padding-top: 0;
    background: #f2f6f9;

    .el-form-item__error {
      padding: 0;
    }
  }

  .el-dialog__footer {
    padding-top: 15px;
    padding-bottom: 15px;
    padding: 0;
    height: 60px;
    line-height: 60px;

    /deep/ .el-button {
      width: 60px;
      padding: 0;
    }
  }
}

.form-remark {
  /deep/ .el-form-item__label {
    width: 112px;
  }
}
</style>

<template>
  <div id="addAttachmentDialog" class="sty-radio sty-input sty-dialog">
    <el-dialog
      :visible="dialogVisible"
      width="822px"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="add-attachment-dialog customer-dialog"
      @close="handleDialogClose"
    >
      <template #title>
        <div>新增供应商结算单</div>
      </template>
      <el-form
        class="dialog-content"
        inline
        ref="contract_attachment_form"
        size="small"
        :model="contract_attachment_form"
        :rules="contract_attachment_rules"
        label-width="92px"
      >
        <div class="box1">
          <div class="content-block-header">
            <span>结算单基本信息</span>
          </div>
          <div class="form-block">
            <el-form-item label="合同编号：" prop="contract_no">
              <el-select
                v-model="contract_attachment_form.contract_no"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请搜索并选择合同编号"
                :remote-method="getCustmerByContractNo"
                class="contract-attachment-input dsb"
                popper-class="contract-select-empty"
                @change="handleSelect"
              >
                <el-option
                  v-for="item in custmerOption"
                  :key="item.contract_uid"
                  :label="item.contract_uid"
                  :value="item.contract_uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商：" prop="partner_name">
              <el-input
                class="contract-attachment-input"
                v-model="contract_attachment_form.partner_name"
                placeholder="请先关联合同编号"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="项目：" :rules="[{ required: true }]">
              <el-input
                class="contract-attachment-input"
                v-model="cooperation_name"
                placeholder="请先关联合同编号"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item v-if="business_type !== 5" label="品牌：">
              <el-input
                class="contract-attachment-input"
                v-model="brand_name"
                placeholder="请先关联合同编号"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="审批金额：" prop="approval_amount">
              <el-input
                class="contract-attachment-input"
                v-model="contract_attachment_form.approval_amount"
                placeholder="请输入审批金额"
                @input="
                  value => (contract_attachment_form.approval_amount = getPositiveNumber(value))
                "
                @blur="
                  event =>
                    event.target.value === 0
                      ? (contract_attachment_form.approval_amount = '')
                      : contract_attachment_form.approval_amount
                "
              ></el-input>
            </el-form-item>
            <el-form-item label="用章情况：" prop="seal_type">
              <el-select
                class="contract-attachment-input"
                v-model="contract_attachment_form.seal_type"
              >
                <el-option style="width: 158px" label="公章" :value="2" />
                <el-option style="width: 158px" label="合同章" :value="3" />
                <el-option style="width: 158px" label="不用印章" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="申请内容：" style="width: 580px">
              <el-input
                type="textarea"
                show-word-limit
                style="width: 426px"
                v-model="contract_attachment_form.comment"
                placeholder="请输入文本"
                maxlength="100"
              ></el-input>
            </el-form-item>
            <el-form-item label="附件单：" prop="attachment_url">
              <el-upload
                action="/"
                class="upload-attachment"
                :multiple="false"
                :show-file-list="false"
                :http-request="uploadAttachmentFile"
                accept=".pdf,.docx,.jpg,.xlsx,.xls"
                :disabled="uploadedAttachmentList.length === 5"
              >
                <tg-button icon="ico-btn-upload" :disabled="uploadedAttachmentList.length >= 5">
                  上传文件
                </tg-button>
              </el-upload>
              <span class="upload-tips">
                最多上传5个文件（单个文件大小不超过30M），支持扩展名：.docx .pdf .jpg .xlsx .xls
              </span>
              <div class="uploaded-list" v-if="uploadedAttachmentList.length">
                <upload-file-list v-model="uploadedAttachmentList" inline />
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div class="box3">
        <div class="content-header content-block-header">结算情况</div>
        <div class="content-body">
          <div
            class="line-status"
            v-for="(items, j) in contract_attachment_form.settlement_detail"
            :key="j"
          >
            <div
              class="delete_tr_wrap"
              v-if="contract_attachment_form.settlement_detail.length !== 1 || isFirstDelete"
            >
              <span class="delete_tr" @click="deleteTr(j)"
                ><i class="el-icon-error" style="color: #ccc"></i
              ></span>
            </div>
            <el-form
              size="small"
              inline
              ref="contract_settlement_form"
              :rules="settlement_status_rules"
              :model="items"
              label-width="78px"
            >
              <el-form-item label="结算方式：" prop="settle_way">
                <el-radio-group v-model="items.settle_way" style="margin-top: 9px">
                  <el-radio :label="1">对公银行</el-radio>
                  <el-radio :label="2">支付宝</el-radio>
                  <el-radio :label="3">V任务</el-radio>
                  <el-radio :label="4">淘宝联盟</el-radio>
                  <el-radio :label="5">巨量百应</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="form-grid">
                <el-form-item label="结算金额：" prop="settle_amount">
                  <el-input
                    size="small"
                    v-model="items.settle_amount"
                    placeholder="0.00"
                    @input="value => (items.settle_amount = getPositiveNumber(value))"
                    @blur="
                      event =>
                        event.target.value === 0 ? (items.settle_amount = '') : items.settle_amount
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item label="店铺名称：" prop="shop_name" v-if="items.settle_way === 3">
                  <el-input
                    size="small"
                    v-model="items.shop_name"
                    placeholder="请输入店铺名称"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
                <el-form-item label="旺旺名：" prop="wangwang_num" v-if="items.settle_way === 3">
                  <el-input
                    size="small"
                    v-model="items.wangwang_num"
                    placeholder="请输入下单旺旺名"
                    :maxlength="20"
                  ></el-input>
                </el-form-item>
                <el-form-item label="开始日期：" prop="start_date">
                  <el-date-picker
                    v-model="items.start_date"
                    type="date"
                    placeholder="请选择日期"
                    size="small"
                    start-placeholder="开始日期"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    style="width: 150px"
                  />
                </el-form-item>
                <el-form-item label="结束日期：" prop="end_date">
                  <el-date-picker
                    v-model="items.end_date"
                    type="date"
                    size="small"
                    placeholder="请选择日期"
                    start-placeholder="结束日期"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    style="width: 150px"
                  />
                </el-form-item>
                <!-- <el-form-item label="已付金额：" prop="done_amount">
                  <el-input
                    size="small"
                    @input="value => (items.done_amount = getPositiveNumberHaveZero(value))"
                    v-model="items.done_amount"
                    placeholder="0.00"
                  ></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="待付金额：" prop="wait_amount">
                  <el-input
                    size="small"
                    v-model="items.wait_amount"
                    placeholder="0.00"
                    @input="value => (items.wait_amount = getPositiveNumberHaveZero(value))"
                  ></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="已收发票金额：" prop="invoice_amount">
                  <el-input
                    size="small"
                    v-model="items.invoice_amount"
                    placeholder="0.00"
                    @input="value => (items.invoice_amount = getPositiveNumberHaveZero(value))"
                  ></el-input>
                </el-form-item> -->
              </div>
              <el-form-item label="备注：" prop="remark" class="form-remark">
                <el-input
                  show-word-limit
                  size="small"
                  v-model="items.remark"
                  placeholder="不超过20字符"
                  maxlength="20"
                  :style="{
                    width: editData && editData.edit ? '456px !important' : '416px !important',
                  }"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div
            class="add_tr"
            @click="addTr"
            v-if="contract_attachment_form.settlement_detail.length !== 12"
          >
            <tg-icon name="ico-btn-add" />
            点击添加
          </div>
        </div>
      </div>

      <template #footer>
        <tg-button @click="handleDialogClose">取 消</tg-button>
        <tg-button
          type="primary"
          @click="handleAttachmentSubmitClick"
          :disabled="isSubmitForbid"
          :class="isSubmitForbid ? 'forbid-btn' : ''"
          >提 交
        </tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="isSubmitForbid" content="  正在提交数据，请稍候..." />
  </div>
</template>

<script>
import {
  SaveContractStatements,
  SaveContractStatementsShop,
  SaveContractStatementsCoop,
  SaveContractStatementsCommonBusiness,
  GetContractUid,
  SaveContractStatementsLocalLife,
  SaveContractStatementsSupplyChain,
} from '@/services/contract';
import { uploadFile } from '@/api/cooperative';
import { getPositiveNumber, getPositiveNumberHaveZero } from '@/utils/string';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { Loading } from 'element-ui';

export default {
  name: 'AddSettlementDialog',
  inject: ['project_add_id', 'project'],
  components: {},
  data() {
    return {
      loading: null,
      isSubmitForbid: false,
      inputMaxL: null,
      radio: 1,
      isAddingEditing: false,
      dialogVisible: false,
      contract_attachment_form: {
        // 关联供应商合同
        contract_type: 4,
        // 用章情况
        seal_type: 2,
        // 关联合同编号
        contract_no: undefined,
        // 合同编号
        partner_name: undefined,
        // 合同id
        contract_id: undefined,
        // 审批金额
        approval_amount: undefined,
        // 申请内容
        comment: '',
        // 附件文件url，以英文","分隔
        attachment_url: '',
        // 合同附件类型(即合作对象类型)，1：客户；2：供应商
        contract_annex_type: 2,
        // 结算情况
        settlement_detail: [
          {
            settle_amount: '', // 结算金额
            settle_way: 1, // 结算方式
            start_date: '', // 开始日期
            end_date: '', // 结束日期
            done_amount: '', // 已收金额/已付金额
            wait_amount: '', // 待收金额/待付金额
            invoice_amount: '', // 已开发票金额/已收发票金额
            remark: '', // 备注
            shop_name: '', // 店铺名称
            wangwang_num: '', // 旺旺号
          },
        ],
      },
      custmerOption: [],
      // 验证规则
      contract_attachment_rules: {
        contract_type: [{ required: true, message: '供应商合同', trigger: 'blur' }],
        contract_no: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        approval_amount: [{ required: true, message: '请输入审批金额', trigger: 'blur' }],
        seal_type: [{ required: true, message: '请输入选择用章情况', trigger: 'change' }],
        comment: [{ required: true, message: '请输入申请内容', trigger: 'blur' }],
        attachment_url: [{ required: true, message: '请上传附件', trigger: 'blur' }],
      },
      settlement_status_rules: {
        settle_amount: [{ required: true, message: '请输入结算金额', trigger: 'blur' }],
        settle_way: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
        shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        wangwang_num: [{ required: true, message: '请输入下单旺旺名', trigger: 'blur' }],
        start_date: [{ required: true, message: '请选择开始日期', trigger: 'blur' }],
        end_date: [{ required: true, message: '请选择结束日期', trigger: 'blur' }],
        // done_amount: [{ required: true, message: '请输入已付金额', trigger: 'blur' }],
        // wait_amount: [{ required: true, message: '请输入待付金额', trigger: 'blur' }],
        // invoice_amount: [{ required: true, message: '请输入已收发票金额', trigger: 'blur' }],
        remark: [{ message: '请输入备注', trigger: 'blur' }],
      },
      uploadAttachmentUploading: false,

      // 已上传的附件列表
      uploadedAttachmentList: [
        // {
        //   file: '蚊子公会主播报asdasdas价清单.docx',
        //   path: 'http://www.baidu.com'
        // },
        // {
        //   file: '蚊子公会主播123报价清单.docx',
        //   path: 'http://www.baidu.com'
        // },
        // {
        //   file: '蚊子公.docx',
        //   path: 'http://www.baidu.com'
        // }
      ],
      // 控制只有一行显不显示删除按钮
      isFirstDelete: false,
      breadcrumb: useBreadcrumb(),
      brand_name: '',
      cooperation_name: '',
      business_type: 0,
    };
  },
  props: {
    editData: {
      type: Object,
    },
  },
  watch: {
    contract_attachment_form: {
      handler: function (val) {
        if (this.contract_attachment_form.settlement_detail.length === 1) {
          let temp = false;
          const val_temp = val.settlement_detail[0];
          for (let key in val_temp) {
            if (key === 'settle_way') {
              continue;
            } else if (val_temp[key]) {
              temp = true;
              break;
            }
          }
          this.isFirstDelete = temp;
        }
      },
      deep: true,
    },
    editData: {
      handler: function (val) {
        if (val && val.isEdit) {
          this.contract_attachment_form.contract_no = val.contract_no;
          this.contract_attachment_form.partner_name = val.partner_name;
          this.contract_attachment_form.contract_id = val.contract_id;
          this.contract_attachment_form.partner_id = val.partner_id;
          this.contract_attachment_form.approval_amount = val.approval_amount;
          this.contract_attachment_form.comment = val.comment;
          this.contract_attachment_form.attachment_url = val.attachment_url;
          this.contract_attachment_form.contract_type = val.contract_type;
          this.contract_attachment_form.settlement_detail = val.settlement_detail.map(item => {
            return {
              settle_amount: item.settle_amount,
              settle_way: item.settle_way,
              start_date: item.start_date,
              end_date: item.end_date,
              done_amount: item.done_amount,
              wait_amount: item.wait_amount,
              invoice_amount: item.invoice_amount,
              remark: item.remark,
              shop_name: item.shop_name,
              wangwang_num: item.wangwang_num,
            };
          });
          this.uploadedAttachmentList = val.attachment_url.split(',');
        }
      },
      deep: true,
    },
  },
  methods: {
    getPositiveNumber,
    getPositiveNumberHaveZero,
    startLoading() {
      // 使用Element loading-start 方法
      this.loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    },
    closeLoading() {
      // 使用Element loading-start 方法
      this.loading.close();
    },
    //  --- 添加一行
    addTr() {
      this.contract_attachment_form.settlement_detail.push({
        settle_amount: '', // 结算金额
        settle_way: 1, // 结算方式
        start_date: '', // 开始日期
        end_date: '', // 结束日期
        done_amount: '', // 已收金额/已付金额
        wait_amount: '', // 待收金额/待付金额
        invoice_amount: '', // 已开发票金额/已收发票金额
        remark: '', // 备注
        shop_name: '', // 店铺名称
        wangwang_num: '', // 旺旺号
      });
      this.isFirstDelete = false;
    },
    // --- 删除某行
    deleteTr(index) {
      /**
       * 1. 数量大于1，可删除任意明细
       * 2. 数量=1，初始数据(未修改) - 不允许删除
       *    数量=1，初始数据(已修改) - 允许删除，并自动添加一条空的明细
       */
      this.contract_attachment_form.settlement_detail.splice(index, 1);
      if (this.contract_attachment_form.settlement_detail.length === 0) {
        this.addTr();
      }
    },
    show() {
      // 重置表单
      this.dialogVisible = true;
      if (this.project.value) {
        this.brand_name = this.project.value.brand_name;
        this.business_type = this.project.value.business_type;
        this.cooperation_name =
          this.project.value.cooperation_name || this.project.value.project_name;
        // 根据合同编号获取客户名称
        // this.getCustmerByContractNo()
      }
      if (this.editData && this.editData.isEdit) {
        this.contract_attachment_form.contract_no = this.editData.contract_no;
        this.contract_attachment_form.partner_name = this.editData.partner_name;
        this.contract_attachment_form.contract_id = this.editData.contract_id;
        this.contract_attachment_form.partner_id = this.editData.partner_id;
        this.contract_attachment_form.approval_amount = this.editData.approval_amount;
        this.contract_attachment_form.comment = this.editData.comment;
        this.contract_attachment_form.attachment_url = this.editData.attachment_url;
        this.contract_attachment_form.settlement_detail = this.editData.settlement_detail.map(
          item => {
            return {
              settle_amount: item.settle_amount,
              settle_way: item.settle_way,
              start_date: item.start_date,
              end_date: item.end_date,
              done_amount: item.done_amount,
              wait_amount: item.wait_amount,
              invoice_amount: item.invoice_amount,
              remark: item.remark,
              shop_name: item.shop_name,
              wangwang_num: item.wangwang_num,
            };
          },
        );
        this.uploadedAttachmentList = this.editData.attachment_url.split(',');
      }
    },
    // 提交合同附件
    handleAttachmentSubmitClick() {
      this.isAddingEditing = true;
      this.$refs.contract_attachment_form.validate(pass => {
        let settle_pass = true;
        for (const val of this.$refs.contract_settlement_form) {
          val.validate(settle_passa => {
            if (!settle_passa) {
              settle_pass = false;
            }
          });
        }
        if (pass && settle_pass) {
          if (this.uploadedAttachmentList.length === 0) {
            this.$message.error('请上传附件', {
              showClose: true,
              duration: 2000,
            });
            return;
          }
          this.contract_attachment_form.attachment_url = this.uploadedAttachmentList.join(',');
          this.isSubmitForbid = true;
          this.contract_attachment_form.current_project_id =
            this.project.value.id || this.project.value.cooperation_id;
          Promise.resolve()
            .then(() => {
              if (this.editData && this.editData.isEdit) {
                if (this.editData.business_type === BusinessTypeEnum.marketing) {
                  return SaveContractStatementsCoop(this.contract_attachment_form);
                } else if (this.editData.business_type === BusinessTypeEnum.mcn) {
                  return SaveContractStatementsCommonBusiness(this.contract_attachment_form);
                } else if (this.editData.business_type === BusinessTypeEnum.locallife) {
                  return SaveContractStatementsLocalLife(this.contract_attachment_form);
                } else if (this.editData.business_type === BusinessTypeEnum.supplyChain) {
                  return SaveContractStatementsSupplyChain(this.contract_attachment_form);
                } else {
                  return SaveContractStatementsShop(this.contract_attachment_form);
                }
              } else {
                if (this.breadcrumb.isLiveDetail) {
                  return SaveContractStatementsShop(this.contract_attachment_form);
                } else if (this.breadcrumb.isCommonBusinessDetail) {
                  return SaveContractStatementsCommonBusiness(this.contract_attachment_form);
                } else if (this.breadcrumb.isCoopDetail) {
                  return SaveContractStatementsCoop(this.contract_attachment_form);
                } else if (this.breadcrumb.isLocalLifeDetail) {
                  return SaveContractStatementsLocalLife(this.contract_attachment_form);
                } else if (this.breadcrumb.isSupplyChainDetail) {
                  return SaveContractStatementsSupplyChain(this.contract_attachment_form);
                } else {
                  return SaveContractStatements(this.contract_attachment_form);
                }
              }

              // return this.project_add_id
              //   ? SaveContractStatementsShop(this.contract_attachment_form)
              //   : newContract(this.contract_attachment_form);
            })
            .then(res => {
              if (res.data.success) {
                this.$message.success(res.data.message, {
                  showClose: true,
                  duration: 2000,
                });
                // 触发added事件，提供给父组件监听
                this.$emit('added', true);
                // 初始化表单
                this.dialogVisible = false;
                this.formResetFun();
              } else {
                this.$message.error(res.data.message, {
                  showClose: true,
                  duration: 2000,
                });
              }
              this.isSubmitForbid = false;
            })
            .catch(err => {
              this.$message.error('新增合同附件失败，请稍后重试', {
                showClose: true,
                duration: 2000,
              });
              console.error(err.message);

              this.isSubmitForbid = false;
            });
        } else {
          return false;
        }
      });
    },
    // 根据合同编号获取合同客户名称
    getCustmerByContractNo(contractNo) {
      let project_type = 1;
      if (this.editData && this.editData.isEdit) {
        if (this.editData.business_type === BusinessTypeEnum.marketing) {
          project_type = 2;
        } else {
          project_type = 1;
        }
      } else {
        if (
          this.breadcrumb.isLiveDetail ||
          this.breadcrumb.isSupplyChainDetail ||
          this.breadcrumb.isLocalLifeDetail ||
          this.breadcrumb.isCommonBusinessDetail
        ) {
          project_type = 1;
        } else if (this.breadcrumb.isCoopDetail) {
          project_type = 2;
        }
      }
      /*  let current_project_id =
        this.project.value.id || this.project.value.cooperation_id || this.project_add_id;*/
      if (contractNo === '' || contractNo === undefined) return;
      GetContractUid({
        partner_type: 2,
        contract_status: 2,
        only_main: 0,
        search: contractNo.trim(),
        // contract_type: this.contract_attachment_form.contract_type, // 供应商-框架合同
        project_type: project_type,
      })
        .then(res => {
          if (res.data.success) {
            this.custmerOption = res.data.data.data;
          }
        })
        .catch(() => {
          this.$message.error('根据合同编号获取合同客户名称失败，请稍后重试', {
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 合同编号选中事件
    handleSelect(value) {
      // console.log(this.custmerOption)
      this.isAddingEditing = false;
      const customer = this.custmerOption.find(item => item.contract_uid === value);
      // 判断该合同的状态以及合同附件的状态(合同未正常状态才可以提交附件，提交过的附件在审批中/已作废状态下无法提交)
      if (customer && customer.contract_status !== 2) {
        this.$message.warning('合同在正常状态下才可以添加合同附件');
        return false;
      } else if (
        customer &&
        (customer.last_annex_status === 4 || customer.last_annex_status === 5)
      ) {
        this.$message.warning(`合同附件在审批中、已作废状态下无法继续添加合同附件`);
        return false;
      }

      this.contract_attachment_form.partner_name = customer ? customer.partner_name : undefined;
      this.contract_attachment_form.contract_id = customer ? customer.contract_id : undefined;
      this.contract_attachment_form.partner_id = customer ? customer.partner_id : undefined;
      this.contract_attachment_form.contract_type = customer ? customer.contract_type : undefined;
    },
    // 上传方法
    uploadAttachmentFile(value) {
      if (this.uploadedAttachmentList.length === 5) {
        this.$message.error('最多上传5个文件');
        return;
      }

      if (value.file.size > 30 * 1025 * 1024) {
        this.$message.error('单个文件大小不超过30M');
        return;
      }
      this.isAddingEditing = false;
      this.startLoading();
      const file = value.file;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'contract_statements_attachment');

      this.uploadAttachmentUploading = true;

      uploadFile(formData)
        .then(res => {
          this.closeLoading();
          if (!res.data.success) {
            this.$message({
              type: 'warning',
              message: res.data.message,
              showClose: true,
              duration: 2000,
            });
          } else {
            // this.contract_attachment_form.attachment_url.push(res.data.data.source)
            this.uploadedAttachmentList.push(res.data.data.source);
            // 整理并赋值附件地址字段
            this.contract_attachment_form.attachment_url = this.uploadedAttachmentList.join(',');
            // 由于按钮没有blur事件，所有要手动校验该字段，使提示文字消失
            this.$refs.contract_attachment_form.validateField('attachment_url');
          }
          this.uploadAttachmentUploading = false;
        })
        .catch(error => {
          this.closeLoading();
          this.$message({
            type: 'warning',
            message: '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          this.uploadAttachmentUploading = false;
          console.log(error.message);
        });
    },
    // 删除已上传的附件
    handleAttachmentClick(index) {
      // debugger
      this.uploadedAttachmentList.splice(index, 1);
    },
    // 弹窗关闭事件回调
    handleDialogClose() {
      this.dialogVisible = false;
      this.formResetFun();
      this.custmerOption = [];
      this.isAddingEditing = false;
      Object.assign(this.$data, this.$options.data());
    },
    // 表单初始化方法
    formResetFun() {
      // 初始化表单
      this.$refs.contract_attachment_form.resetFields();
      // 初始化附件列表及附件url字段
      this.uploadedAttachmentList = [];
      this.contract_attachment_form.attachment_url = '';
      this.departmentName = '';
    },
  },
};
</script>
