<!--
 * @Description: 供应商管理-供应商合同-新增补充协议
 * @Author: 白青
 * @Date: 2019-09-04 14:34:12
 * @LastEditTime: 2021-12-14 15:12:00
 * @LastEditors: Please set LastEditors
 -->
<style lang="scss" scoped>
@import '@/styles/vars.scss';
@import '@/assets/scss/public.scss';
#addAttachmentDialog {
  .selected-settlement {
    background-color: #dadee6;
    border-color: #dadee6;
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
      margin-top: 15px;
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
      .upload-attachment {
        display: inline-block;
        .upload-btn {
          width: 100px;
          i {
            position: relative;
            top: -2px !important;
            left: -3px !important;
          }
        }
      }
      .upload-tips {
        margin-left: 11px;
        font-size: 12px;
        color: var(--text-third-color);
      }
      .uploaded-list {
        div {
          position: relative;
          display: block;
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
            margin: 0 5px;
            display: inline-block;
            width: 160px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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
}
</style>
<style lang="scss" scoped>
#addAttachmentDialog /deep/ .add-attachment-dialog {
  .el-form-item__error {
    padding: 0;
  }
}
</style>

<template>
  <div id="addAttachmentDialog" class="sty-radio sty-input sty-dialog add-attachment-dialog">
    <el-form
      class="dialog-content"
      ref="contract_attachment_form"
      :model="contract_attachment_form"
      :rules="contract_attachment_rules"
      label-width="126px"
      v-loading.fullscreen="isLoading"
    >
      <div class="box1">
        <!-- <div class="content-block-header">
            <span>附件基础信息</span>
          </div> -->
        <div class="form-block">
          <el-form-item label="是否补充协议：" style="margin-bottom: 0">
            <el-radio-group
              :value="tabs"
              @input="tabsChange"
              style="display: inline-flex; margin-top: 0"
            >
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联合同编号：" prop="contract_no">
            <el-select
              v-model="contract_attachment_form.contract_no"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入或者搜索合同编号"
              :remote-method="getCustmerByContractNo"
              style="width: 100%"
              size="small"
              @change="handleSelect"
              :disabled="editData && editData.isEdit"
            >
              <el-option
                v-for="item in contractVal ? custmerOption : []"
                :key="item.contract_uid"
                :label="item.contract_uid"
                :value="item.contract_uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商名称：" prop="partner_name">
            <el-input
              size="small"
              v-model="contract_attachment_form.partner_name"
              placeholder="请先输入合同编号"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="审批金额：" prop="approval_amount">
            <el-input
              size="small"
              v-model="contract_attachment_form.approval_amount"
              @input="
                value =>
                  (contract_attachment_form.approval_amount = getPositiveNumberHaveZero(value))
              "
              placeholder="请输入审批金额"
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
              accept=".pdf,.docx,.jpg,.xlsx"
              :http-request="uploadAttachmentFile"
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
                  style="font-size: 14px; top: -1px !important; left: -3px !important"
                ></i
                >上传文件</el-button
              >
            </el-upload>
            <span class="upload-tips"
              >最多上传5个文件（单个文件大小不超过30M），支持扩展名：.docx .pdf .jpg .xlsx</span
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
          <el-form-item label="申请内容：" prop="comment">
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
    <tg-mask-loading :visible="isSubmitForbid" content="  正在提交数据，请稍候..." />
  </div>
</template>

<script>
import { uploadContractAttachment, saveContractAnnex, getUserByRole } from '@/api/customer';
import {
  SaveContractAnnexShop,
  SaveContractAnnexCoop,
  SaveContractAnnexCommonBusiness,
  GetContractUid,
} from '@/services/contract';
import { ROLE_CODE } from '@/const/roleCode';
import { getPositiveNumberHaveZero } from '@/utils/string';
import TgIcon from '@/components/IconFont/tg.vue';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { Loading } from 'element-ui';

export default {
  name: 'addAttachmentDialog',
  inject: ['project_add_id'],
  conponents: {
    TgIcon,
  },
  props: {
    editData: {
      type: Object,
    },
    tabs: {},
  },
  data() {
    return {
      loading: null,
      isSubmitForbid: false,
      radio: 1,
      isLoading: false,
      isAddingEditing: false,
      dialogVisible: false,
      contractVal: '',
      contract_attachment_form: {
        // 合同编号
        contract_no: undefined,
        // 客户名称
        partner_name: undefined,
        // 合同id
        contract_id: undefined,
        // 审批金额
        approval_amount: undefined,
        // 申请内容
        comment: '',
        // 附件文件url，以英文","分隔
        attachment_url: '',
        // 客户经理id
        manager_id: undefined,
        // 部门id
        department: undefined,
        // 合作对象id(包括客户和供应商)
        partner_id: undefined,
        // 合同附件类型(即合作对象类型)，1：客户；2：供应商
        contract_annex_type: 2,
        // 合同类型 3：供应商采买合同；4：供应商框架合同
        contract_type: -1,
        // 用章情况 1：不用印章；2：公章；3：合同章
        seal_type: 2,
      },
      // 验证规则
      contract_attachment_rules: {
        contract_type: [{ required: true, message: '请选择关联供应商', trigger: 'blur' }],
        contract_no: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        partner_name: [{ required: true, message: '请先输入合同编号', trigger: 'blur' }],
        approval_amount: [{ required: true, message: '请输入审批金额', trigger: 'blur' }],
        seal_type: [{ required: true, message: '请选择用章情况', trigger: 'blur' }],
        attachment_url: [{ required: true, message: '请上传附件', trigger: 'blur' }],
      },
      // 客户名称选项
      custmerOption: [],
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
      breadcrumb: useBreadcrumb(),
    };
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
    tabsChange(e) {
      this.$emit('tabsChange', e);
    },
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
    getPositiveNumberHaveZero,
    changeContract(val) {
      this.contract_attachment_form.contract_no = '';
      // this.formResetFun(this.contract_attachment_form.contract_type);
    },
    show() {
      // 重置表单
      this.dialogVisible = true;

      // 获取管理员
      // this.getCustmerManager();
      // 根据合同编号获取客户名称
      // this.getCustmerByContractNo()
    },
    onSaveBtnClick() {
      return this.handleAttachmentSubmitClick();
    },
    // 提交合同附件
    handleAttachmentSubmitClick() {
      this.isAddingEditing = true;
      this.$refs.contract_attachment_form.validate(pass => {
        if (pass) {
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

          this.isSubmitForbid = true;
          Promise.resolve()
            .then(() => {
              if (this.breadcrumb.isLiveDetail) {
                return SaveContractAnnexShop(this.contract_attachment_form);
              } else if (this.breadcrumb.isCommonBusinessDetail) {
                return SaveContractAnnexCommonBusiness(this.contract_attachment_form);
              } else if (this.breadcrumb.isCoopDetail) {
                return SaveContractAnnexCoop(this.contract_attachment_form);
              } else {
                return saveContractAnnex(this.contract_attachment_form);
              }
              // return this.project_add_id
              //   ? SaveContractAnnexShop(this.contract_attachment_form)
              //   : saveContractAnnex(this.contract_attachment_form);
            })
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
                if (this.editData && this.editData.isEdit) {
                  if (location.href.indexOf('activeName') > -1) {
                    location.href = location.href.split('&activeName')[0];
                  } else {
                    location.reload();
                  }
                }
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
    // 获取客户经理
    getCustmerManager() {
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
    // 根据合同编号获取合同客户名称
    getCustmerByContractNo(contractNo) {
      let project_type = 1;
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
      this.contractVal = contractNo;
      if (contractNo === '' || contractNo === undefined) return;
      GetContractUid({
        partner_type: 2,
        contract_status: 2,
        search: contractNo.trim(),
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
      this.contractVal = '';
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
      // this.isLoading = true;
      if (value.file.size > 30 * 1025 * 1024) {
        this.$message.error('单个文件大小不超过30M');
        this.isLoading = false;
        return;
      }
      this.isAddingEditing = false;
      const formData = new FormData();
      formData.append('file', value.file, value.file.name);
      formData.append('attachment_type', 'contract_annex');
      this.uploadAttachmentUploading = true;
      this.startLoading();
      uploadContractAttachment(formData)
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
            // this.contract_attachment_form.attachment_url = urlList.join(',');
            this.contract_attachment_form.attachment_url = urlList;
            // 由于按钮没有blur事件，所有要手动校验该字段，使提示文字消失
            this.$refs.contract_attachment_form.validateField('attachment_url');
          }
          this.uploadAttachmentUploading = false;
          this.isLoading = false;
        })
        .catch(error => {
          this.closeLoading();
          this.$message({
            type: 'warning',
            message: '上传失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          this.isLoading = false;
          this.uploadAttachmentUploading = false;
          console.log(error.message);
        });
    },
    // 删除已上传的附件
    handleAttachmentClick(index) {
      // debugger
      this.uploadedAttachmentList.splice(index, 1);
    },
    // 选中客户经理下拉选项
    handleCustmerManagerChange(value) {
      this.isAddingEditing = false;
      const manager = this.accountManager.find(item => item.id === value);
      this.contract_attachment_form.department = manager ? manager.department : undefined;
      this.departmentName = manager ? manager.department_str : '';
    },
    // 弹窗关闭事件回调
    handleDialogClose() {
      this.formResetFun();
      this.dialogVisible = false;
      this.custmerOption = [];
      this.isAddingEditing = false;
      Object.assign(this.$data, this.$options.data());
    },
    // 表单初始化方法
    formResetFun(contract_type = 3) {
      // 初始化表单
      this.$refs.contract_attachment_form.resetFields();
      this.contract_attachment_form.contract_type = contract_type;
      // 初始化附件列表及附件url字段
      this.uploadedAttachmentList = [];
      this.contract_attachment_form.attachment_url = '';
      this.departmentName = '';
    },
  },
};
</script>
