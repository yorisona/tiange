<!--
 * @Description: 供应商管理-供应商合同-新增结算单
 * @Author: 白青
 * @Date: 2019-09-04 14:34:12
 * @LastEditTime: 2021-12-21 11:16:26
 * @LastEditors: 肖槿
 -->
<style lang="scss" scoped>
@import '@/styles/vars.scss';
@import '@/assets/scss/public.scss';
$color-primary: var(--theme-color);
#addAttachmentDialog {
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
      padding: 0 20px;
      .contract_num {
        margin-left: 125px;
        background: #f6f6f6;
        padding: 7.6px 0;
        border-radius: 4px;
        padding-right: 10px;
      }
      /deep/ .el-input__inner {
        border-radius: 4px;
        height: 36px;
      }
      .el-form-item {
        margin-bottom: 10px;
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
      }
      .uploaded-list {
        span {
          position: relative;
          display: inline-block;
          img {
            vertical-align: middle;
            // margin-right: 5px;
          }
          // a {
          //   text-decoration: none;
          // }
          em {
            font-style: normal;
            vertical-align: middle;
            color: #396fff;
            margin: 0 50px 0 5px;
          }
          i {
            vertical-align: middle;
            font-size: 20px;
            color: #aaa;
            cursor: pointer;
            position: absolute;
            top: 12px;
            right: 25px;
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
    }
    .content-body {
      padding: 0 30px;
      margin-top: -15px;
      padding-bottom: 20px;
      .line-status {
        background: #f6f6f6;
        padding: 10px;
        margin-bottom: 20px;

        & /deep/ .el-form-item__label:first-child {
          width: 113px;
        }
      }
      /deep/ .el-input {
        width: 160px !important;
      }
      .add_tr {
        border: 1px dashed #e1e2e6;
        line-height: 40px;
        color: $add-form-color;
        text-align: center;
        cursor: pointer;
      }
      .add_tr:hover {
        border: 1px dashed $color-primary;
      }
      /deep/ .el-form-item__content {
        margin-left: 0 !important;
      }
      /deep/ .el-form-item {
        margin-bottom: 0 !important;
      }

      /deep/ .el-form {
        .form-grid {
          display: grid;
          grid-template-columns: 33.3% 33.3% 33.3%;
          /deep/ .el-form-item__label {
            width: 112px;
          }
        }
        /deep/ .el-form-item__content {
          margin-right: 30px;
          margin-bottom: 15px;
        }
      }
      /deep/ .el-input__inner {
        height: 36px !important;
      }
    }
    .form-remark {
      /deep/ .el-form-item__error {
        position: relative;
        left: -467px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-dialog {
  padding: 0px !important;
}
/deep/ .el-dialog__header {
  text-align: left !important;
  padding-left: 20px !important;
}
/deep/ .add-attachment-dialog {
  .el-dialog__header {
    background-color: #f2f6f9;
    padding: 0;
    height: 50px;
    line-height: 50px;
    .title {
      color: var(--text-color);
      font-size: 14px;
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
      width="990px"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="add-attachment-dialog"
      @close="handleDialogClose"
    >
      <template #title>
        <div class="title">新增结算单</div>
      </template>
      <el-form
        class="dialog-content"
        ref="contract_attachment_form"
        :model="contract_attachment_form"
        :rules="contract_attachment_rules"
        label-width="120px"
      >
        <div class="box1">
          <div class="content-block-header">
            <span>结算单基本信息</span>
          </div>
          <div class="form-block">
            <el-form-item label="关联供应商合同：" prop="partner_name">
              <el-radio-group
                v-model="contract_attachment_form.contract_type"
                :disabled="editData.isEdit"
              >
                <el-radio :label="4">框架合同</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="contract_num" label="关联合同编号：" prop="contract_no">
              <!-- <el-input size="small" placeholder="请输入合同编号"></el-input> -->
              <!-- <el-autocomplete
              class="inline-input"
              v-model="contract_attachment_form.contract_no"
              :fetch-suggestions="getCustmerByContractNo"
              placeholder="请输入合同编号"
              :trigger-on-focus="false"
              size="small"
              style="width:100%"
              @select="handleSelect"
            ></el-autocomplete>-->
              <el-select
                v-model="contract_attachment_form.contract_no"
                :disabled="editData.isEdit"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请搜索并选择合同编号"
                :remote-method="getCustmerByContractNo"
                style="width: 100%"
                size="small"
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
            <el-form-item label="供应商名称：" prop="partner_name">
              <el-input
                size="small"
                :disabled="editData.isEdit"
                v-model="contract_attachment_form.partner_name"
                placeholder="请先关联合同编号"
              ></el-input>
            </el-form-item>
            <el-form-item label="审批金额：" prop="approval_amount">
              <el-input
                size="small"
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
              <el-radio-group v-model="contract_attachment_form.seal_type">
                <el-radio :label="2">公章</el-radio>
                <el-radio :label="3">合同章</el-radio>
                <el-radio :label="1">不用印章</el-radio>
              </el-radio-group>
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
                <el-button
                  class="upload-btn big-button btn-blue"
                  type="primary"
                  size="small"
                  :class="uploadedAttachmentList.length === 5 ? 'upload-forbid' : ''"
                >
                  <i
                    class="iconfont icon-zhongxinshangchuan"
                    style="position: relative; top: -2px !important; left: -3px !important"
                  ></i
                  >上传文件</el-button
                >
              </el-upload>
              <span class="upload-tips"
                >最多上传5个文件（单个文件大小不超过30M），支持扩展名：.docx .pdf .jpg .xlsx
                .xls</span
              >
              <div class="uploaded-list">
                <div v-for="(item, index) in uploadedAttachmentList" :key="index">
                  <TgIcon name="ico-annex" style="margin-right: 5px"></TgIcon>
                  <em>{{ item.file }}</em>
                  <TgIcon
                    style="margin-left: 15px"
                    name="ico-cross"
                    v-if="item"
                    @click="handleAttachmentClick(index)"
                  ></TgIcon>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="申请内容：" style="margin-top: 5px">
              <el-input
                size="small"
                show-word-limit
                v-model="contract_attachment_form.comment"
                placeholder="请输入文本"
                maxlength="100"
              ></el-input>
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
            <div v-if="contract_attachment_form.settlement_detail.length !== 1 || isFirstDelete">
              <span class="delete_tr" @click="deleteTr(j)"
                ><i class="el-icon-error" style="color: #ccc"></i
              ></span>
            </div>
            <el-form ref="contract_settlement_form" :rules="settlement_status_rules" :model="items">
              <el-form-item label="结算方式：" prop="settle_way">
                <el-radio-group v-model="items.settle_way">
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
                <el-form-item
                  label="下单旺旺名："
                  prop="wangwang_num"
                  v-if="items.settle_way === 3"
                >
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
                <el-form-item label="已付金额：" prop="done_amount">
                  <el-input
                    size="small"
                    @input="value => (items.done_amount = getPositiveNumber(value))"
                    @blur="
                      event =>
                        event.target.value === 0 ? (items.done_amount = '') : items.done_amount
                    "
                    v-model="items.done_amount"
                    placeholder="0.00"
                  ></el-input>
                </el-form-item>
                <el-form-item label="待付金额：" prop="wait_amount">
                  <el-input
                    size="small"
                    v-model="items.wait_amount"
                    placeholder="0.00"
                    @input="value => (items.wait_amount = getPositiveNumber(value))"
                    @blur="
                      event =>
                        event.target.value === 0 ? (items.wait_amount = '') : items.wait_amount
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item label="已收发票金额：" prop="invoice_amount">
                  <el-input
                    size="small"
                    v-model="items.invoice_amount"
                    placeholder="0.00"
                    @input="value => (items.invoice_amount = getPositiveNumber(value))"
                    @blur="
                      event =>
                        event.target.value === 0
                          ? (items.invoice_amount = '')
                          : items.invoice_amount
                    "
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item label="备注：" prop="remark" class="form-remark">
                <el-input
                  show-word-limit
                  size="small"
                  v-model="items.remark"
                  placeholder="不超过20字符"
                  maxlength="20"
                  style="width: 300px !important"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div
            class="add_tr"
            @click="addTr"
            v-if="contract_attachment_form.settlement_detail.length !== 12"
          >
            + 添加
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button style="line-height: 13px" class="big-button" @click="handleDialogClose"
            >取 消</el-button
          >
          <el-button
            style="line-height: 13px"
            type="primary"
            @click="handleAttachmentSubmitClick"
            class="big-button btn-blue"
            >保 存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { newContract } from '@/api/customer';
import { uploadFile } from '@/api/cooperative';
import { getPositiveNumber } from '@/utils/string';
import TgIcon from '@/components/IconFont/tg.vue';
import { Loading } from 'element-ui';
import { GetContractUid } from '@/services/contract';

export default {
  name: 'AddSettlementDialog',
  data() {
    return {
      loading: null,
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
        contract_no: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        approval_amount: [{ required: true, message: '请输入审批金额', trigger: 'blur' }],
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
        done_amount: [{ required: true, message: '请输入已付金额', trigger: 'blur' }],
        wait_amount: [{ required: true, message: '请输入待付金额', trigger: 'blur' }],
        invoice_amount: [{ required: true, message: '请输入已收发票金额', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
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
    };
  },
  conponents: {
    TgIcon,
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
  },
  mounted() {
    if (this.editData && this.editData.isEdit) {
      this.contract_attachment_form.contract_type = this.editData.contract_type;
      this.contract_attachment_form.contract_no = this.editData.contract_uid;
      this.contract_attachment_form.partner_name = this.editData.partner_name;
      this.contract_attachment_form.contract_id = this.editData.contract_id;
      this.contract_attachment_form.partner_id = this.editData.partner_id;
    }
  },
  methods: {
    getPositiveNumber,
    //  --- 添加一行
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

      // 根据合同编号获取客户名称
      // this.getCustmerByContractNo()
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
          this.contract_attachment_form.attachment_url = this.uploadedAttachmentList.map(item => {
            return item.path;
          });
          this.contract_attachment_form.attachment_url =
            this.contract_attachment_form.attachment_url.join(',');
          newContract(this.contract_attachment_form)
            .then(res => {
              if (res.data.success) {
                this.$message.success(res.data.message, {
                  showClose: true,
                  duration: 2000,
                });
                // 触发added事件，提供给父组件监听
                this.$emit('added');
                // 初始化表单
                this.dialogVisible = false;
                this.formResetFun();
                location.reload();
              } else {
                this.$message.error(res.data.message, {
                  showClose: true,
                  duration: 2000,
                });
              }
            })
            .catch(err => {
              this.$message.error('新增合同附件失败，请稍后重试', {
                showClose: true,
                duration: 2000,
              });
              console.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    // 根据合同编号获取合同客户名称
    getCustmerByContractNo(contractNo) {
      if (contractNo === '' || contractNo === undefined) return;
      GetContractUid({
        partner_type: 2,
        contract_status: 2,
        search: contractNo.trim(),
        contract_type: 4, // 供应商-框架合同
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

      const file = value.file;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'contract_statements_attachment');

      this.uploadAttachmentUploading = true;
      this.startLoading();
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
            this.uploadedAttachmentList.push({
              file: value.file.name,
              path: res.data.data.source,
            });
            // 整理并赋值附件地址字段
            const urlList = this.uploadedAttachmentList.map(item => item.path);
            this.contract_attachment_form.attachment_url = urlList.join(',');
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
      const contract_type = this.contract_attachment_form.contract_type;
      const contract_no = this.contract_attachment_form.contract_no;
      const partner_name = this.contract_attachment_form.partner_name;
      Object.assign(this.$data, this.$options.data());
      this.contract_attachment_form.contract_type = contract_type;
      this.contract_attachment_form.contract_no = contract_no;
      this.contract_attachment_form.partner_name = partner_name;
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
