<!--
 * @Description: 垫款申请弹窗
 * @Autor: 神曲
 * @Date: 2020-04-13 10:39:40
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-21 11:17:21
 -->
<template>
  <common-dialog
    ref="applicationDialog"
    :isAppendToBody="true"
    title="垫款申请单"
    :width="800"
    :top="70"
    :isfooter="true"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
    class="sty-add-dialog tg-dialog-vcenter-new"
  >
    <div class="warp">
      <el-form
        :rules="application_list_rules"
        :model="application_list"
        ref="application_list"
        label-width="130px"
      >
        <el-form-item prop="level_two_types" label="垫款类型：">
          <el-radio v-model="application_list.level_two_types" :label="1">成本安排</el-radio>
        </el-form-item>
        <el-form-item label="垫款金额：" prop="borrowing_amount">
          <!-- 限制只能输入数字及小数点最多2位 -->
          <el-input
            :maxlength="inputMaxL"
            @input="value => (application_list.borrowing_amount = getPositiveNumber(value))"
            v-model="application_list.borrowing_amount"
            placeholder="请输入垫款金额"
            @mousewheel.native.prevent
            ref="autoFocuseRef"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="垫款理由：" prop="borrowing_reason">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="100"
            v-model.trim="application_list.borrowing_reason"
            placeholder="请输入文本"
            @mousewheel.native.prevent
          ></el-input>
        </el-form-item>
        <el-form-item label="客户(公司)名称：" prop="company_name" class="value-select">
          <!-- <div class="v-bgc">
          </div>-->
          <el-select
            v-model="application_list.company_name"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索并选择客户名称"
            :remote-method="getAllStoreName"
            style="width: 100%"
            size="medium"
            @change="handleShopNameChange"
          >
            <el-option
              v-for="(item, index) in isShopName ? allCompanyName : []"
              :key="index"
              :label="item.company_name"
              :value="item.id"
            >
              <span>{{ item.company_name }}</span>
              <span style="color: var(--text-des-color)">{{
                item.shop_name ? '(' + item.shop_name + ')' : '(' + '--' + ')'
              }}</span>
            </el-option>
          </el-select>
          <el-form-item
            prop="contract_uid"
            class="v-bgc"
            v-if="application_list.company_name !== ''"
            label-width="127px"
          >
            <template #label>
              <span>
                关联客户合同:
                <el-popover
                  placement="top"
                  trigger="hover"
                  effect="light"
                  content="垫款申请需要先与客户签订合同"
                >
                  <template slot="reference">
                    <i class="el-icon-question" style="cursor: pointer; margin-right: 5px"></i>
                  </template>
                </el-popover>
              </span>
            </template>
            <el-select
              size="small"
              v-model="application_list.contract_uid"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              :remote-method="getContract"
              placeholder="请搜索并选择客户合同"
              class="contract_el"
              @change="val => selectContractUidChange(val)"
            >
              <el-option
                v-for="item in application_list.contractVal ? contract_id_list : []"
                :key="item.contract_id"
                :label="item.contract_uid"
                :value="item.contract_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item label="回款时间：" prop="back_date">
          <el-date-picker
            size="small"
            placeholder="请选择回款时间"
            style="width: 100%"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model="application_list.back_date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="回款销售金额：">
          <el-input
            oninput="value=value.replace(/[^\d.]/g,'')"
            :maxlength="inputMaxL"
            @input="
              inputMaxL = /^\d+\.?\d{0,1}$/.test(application_list.back_amount)
                ? null
                : application_list.back_amount.length - 1
            "
            v-model="application_list.back_amount"
            placeholder="请输入回款销售金额"
            @mousewheel.native.prevent
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="附件：" prop="gather_certificate_pic">
          <div>
            <template>
              <el-upload
                action
                class="upload-btn-wrap"
                :disabled="borrowing_apply_annex.length === 5"
                :show-file-list="false"
                :multiple="false"
                :http-request="uploadAttachmentFile"
                accept=".docx,.doc,.xlsx,.xls"
              >
                <el-button
                  class="upload-btns btn-blue big-button"
                  size="small"
                  type="primary"
                  :disabled="borrowing_apply_annex.length === 5"
                >
                  <i class="iconfont icon-zhongxinshangchuan"></i>
                  {{ borrowing_apply_annex.length === 5 ? '最多传5个' : '上传文件' }}
                </el-button>
                <span class="upload-tips"
                  >最多上传5个文件（单个文件大小不超过30M） 支持扩展名：.docx .doc .xlsx .xls
                </span>
              </el-upload>
            </template>

            <div class="uploaded-list">
              <p
                class="uploaded-name"
                v-for="(item, index) in borrowing_apply_annex"
                :key="index"
                style="margin-right: 10px; line-height: 30px"
              >
                <i class="iconfont iconfujian mr5"></i>
                <span v-if="item">{{
                  decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')
                }}</span>
                <i v-if="item" class="iconfont icon-shanchu" @click="clearUploadedFile(index)"></i>
              </p>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="图片：" prop="gather_certificate_pic">
          <div>
            <template>
              <el-upload
                action
                class="upload-btn-wrap"
                :disabled="borrowing_apply_photo.length === 5"
                :multiple="false"
                :http-request="uploadAttachmentImg"
                :show-file-list="false"
                accept=".jpg,.jpeg"
              >
                <el-button
                  class="upload-btns btn-blue big-button"
                  size="small"
                  type="primary"
                  :disabled="borrowing_apply_photo.length === 5"
                >
                  <i class="iconfont icon-zhongxinshangchuan"></i>
                  {{ borrowing_apply_photo.length === 5 ? '最多传5个' : '上传图片' }}
                </el-button>
                <span class="upload-tips">
                  <span>最多上传5张图片（单张图片大小不超过2M）</span>
                  <span>支持扩展名：.jpg .jpeg</span>
                </span>
              </el-upload>
            </template>

            <div class="uploaded-list">
              <span
                v-for="(item, index) in borrowing_apply_photo"
                :key="index"
                style="margin-right: 10px; line-height: 30px"
                class="img-list"
              >
                <img :src="item + '?Authorization=' + getToken()" />
                <span v-if="item" @click="clearUploadedImg(index)">x</span>
              </span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="100"
            v-model.trim="application_list.remark"
            placeholder="请输入文本"
            @mousewheel.native.prevent
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </common-dialog>
</template>

<script>
import {
  getApprovalStream, //获取审批流程人员
  saveBorrowingApply, //保存垫款
  queryContractUid, //获取合同编号
  uploadAttachment, //上传文件
} from '@/api/workbench';
import { getToken } from '@/utils/token';
import { QueryShopAndCompany } from '@/services/customers';
import { getPositiveNumber } from '@/utils/string';
import { ref } from '@vue/composition-api';
import { Loading } from 'element-ui';

export default {
  name: 'applicationDialog',
  setup(props, ctx) {
    const autoFocuseRef = ref(undefined);
    return {
      autoFocuseRef,
    };
  },
  data() {
    return {
      loading: null,
      saveLoading: false,
      inputMaxL: null,
      getToken,
      isShopName: '',
      error_text: '', //审批流程错误提示
      checkedIndex: '',
      approver_name: [], //动态绑定审批人姓名
      select_data: '', //审批流程数据
      borrowing_apply_annex: [], //附件
      borrowing_apply_photo: [], //图片
      application_list: {
        approval_type: 3, //垫款申请
        level_two_types: 1, //成本安排类型
        company_name: '', //客户(公司)名称
        customer_id: '', //公司名称对应id
        contract_id: '', //客户合同id
        contract_uid: '', //客户合同uid
        contractVal: '', //  输入的关联客户合同值
        borrowing_amount: '', //垫款金额
        back_amount: '', //回款金额
        borrowing_reason: '', //垫款理由
        borrowing_apply_annex_list: '', //附件列表
        borrowing_apply_photo_list: '', //照片列表
        back_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), //回款时间
        remark: '', //备注
        approval_stream: [], //审批流程
      },
      allCompanyName: [], // 所有店铺选项
      contract_id_list: [], //客户合同编号集合
      // 验证规则
      application_list_rules: {
        level_two_types: [{ required: true, message: '请搜索并选择垫款类型', trigger: 'change' }],
        borrowing_amount: [{ required: true, message: '请输入垫款金额', trigger: 'blur' }],
        borrowing_reason: [{ required: true, message: '请输入垫款理由', trigger: 'blur' }],
        back_date: [{ required: true, message: '请选择回款时间', trigger: 'blur' }],
        company_name: [{ required: true, message: '请搜索并选择客户名称', trigger: 'change' }],
        contract_uid: [{ required: true, message: '请搜索并选择客户合同', trigger: 'change' }],
      },
    };
  },
  activated() {
    // 获取审批人员
    this.getApprovalStreamSelect();
  },
  methods: {
    getPositiveNumber,
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
    // 获取审批流程角色
    getApprovalStreamSelect() {
      getApprovalStream({
        approval_type: 3,
      }).then(res => {
        if (res && res.data && res.data.success) {
          this.select_data = res.data.data;
          this.list = res.data.data;
        } else {
          this.error_text = res.data.message;
        }
      });
    },
    // 显示
    show(detail_data) {
      this.$refs.application_list?.resetFields();
      this.getApprovalStreamSelect();
      this.$refs.applicationDialog.dialogOpen();
      if (detail_data) {
        this.application_list.level_two_types = detail_data.level_two_types; //垫款类型 1:成本安排
        this.application_list.borrowing_amount = detail_data.borrowing_amount_str; //垫款金额
        this.application_list.borrowing_reason = detail_data.borrowing_reason; //垫款理由
        this.application_list.company_name = detail_data.company_name; //客户(公司)名称
        this.application_list.customer_id = detail_data.customer_id; //客户(公司)名称对应id
        this.application_list.contract_uid = detail_data.contract_uid; //关联客户合同
        this.application_list.contract_id = detail_data.contract_id; //关联客户合同对应id
        this.application_list.back_date = detail_data.back_date; //回款时间
        this.application_list.back_amount = detail_data.back_amount_str; //回款金额
        this.borrowing_apply_annex = detail_data.borrowing_apply_annex_list; //附件
        this.borrowing_apply_photo = detail_data.borrowing_apply_photo_list; //图片
        this.application_list.remark = detail_data.remark; //备注
        // 审批流程
        const list = [];
        for (let index = 0; index < detail_data.approval_stream.length; index++) {
          this.approver_name.push(detail_data.approval_stream[index].username);
          list.push({
            index: detail_data.approval_stream[index].index,
            user_id: detail_data.approval_stream[index].user_id,
            role_code: detail_data.approval_stream[index].role_code,
          });
        }
        this.application_list.approval_stream.splice(this.checkedIndex, 1, ...list);
      } else {
        this.$nextTick(() => {
          this.$refs.autoFocuseRef.focus();
          // this.autoFocuseRef.focus();
        });
      }
    },
    // 弹窗确认操作
    handledialogSubmit() {
      this.application_list.borrowing_apply_photo_list = this.borrowing_apply_photo;
      this.application_list.borrowing_apply_annex_list = this.borrowing_apply_annex;

      if (this.application_list.borrowing_amount < 100000) {
        if (this.application_list.approval_stream.length === 6) {
          this.application_list.approval_stream.splice(4, 2);
        }
        if (this.application_list.approval_stream.length === 5) {
          this.application_list.approval_stream.splice(4, 1);
        }
      }
      if (
        this.application_list.borrowing_amount >= 100000 &&
        this.application_list.borrowing_amount < 500000
      ) {
        if (this.application_list.approval_stream.length === 6) {
          this.application_list.approval_stream.splice(5, 1);
        }
      }
      this.$refs.application_list.validate(pass => {
        if (pass) {
          if (
            this.application_list.borrowing_amount === 0 ||
            (this.application_list.back_amount === 0 && this.application_list.back_amount !== '')
          ) {
            this.$message.error('金额不得小于等于0');
          } else {
            if (this.application_list.borrowing_amount < 100000) {
              this.saveLoading = true;
              saveBorrowingApply(this.application_list).then(res => {
                if (res.data.success) {
                  this.$message.success('保存成功');
                  this.$refs.applicationDialog && this.$refs.applicationDialog.dialogClose();
                  if (this.$parent.$parent.customerVisible) {
                    this.$parent.$parent.customerVisible = false;
                  }
                  this.$emit('reloadTable');
                } else {
                  this.$message.error(res.data.message);
                }
                this.saveLoading = false;
              });
            }
            if (
              this.application_list.borrowing_amount >= 100000 &&
              this.application_list.borrowing_amount < 500000
            ) {
              this.saveLoading = true;
              saveBorrowingApply(this.application_list).then(res => {
                if (res.data.success) {
                  this.$message.success('保存成功');
                  this.$refs.applicationDialog && this.$refs.applicationDialog.dialogClose();
                  if (this.$parent.$parent.customerVisible) {
                    this.$parent.$parent.customerVisible = false;
                  }
                  this.$emit('reloadTable');
                } else {
                  this.$message.error(res.data.message);
                }
                this.saveLoading = false;
              });
            }
            if (
              this.application_list.borrowing_amount >= 100000 &&
              this.application_list.borrowing_amount >= 500000
            ) {
              this.saveLoading = true;
              saveBorrowingApply(this.application_list).then(res => {
                if (res.data.success) {
                  this.$message.success('保存成功');
                  this.$refs.applicationDialog && this.$refs.applicationDialog.dialogClose();
                  if (this.$parent.$parent.customerVisible) {
                    this.$parent.$parent.customerVisible = false;
                  }
                  this.$emit('reloadTable');
                  this.$emit('close');
                } else {
                  this.$message.error(res.data.message);
                }
                this.saveLoading = false;
              });
            }
          }
        }
      });
      // setTimeout(() => {
      //   if (this.$parent.$parent.customerVisible) {
      //     this.$parent.$parent.customerVisible = false;
      //   }
      //   this.$emit('reloadTable');
      //   // 保存后告诉父组件
      //   // this.$emit('update-info', 'update');
      // }, 1000);
    },
    // 获取公司店铺名
    async getAllStoreName(shop_name) {
      this.isShopName = shop_name;
      const { data: response } = await QueryShopAndCompany({ shop_name });
      if (response.success) {
        if (Array.isArray(response.data)) {
          this.allCompanyName = response.data;
        }
      } else {
        this.$message.error(response.message);
      }
    },
    // 关联客户合同输入值获取
    getContract(val) {
      this.application_list.contractVal = val;
      queryContractUid({
        partner_type: 1,
        contract_status: 2,
        partner_id: this.application_list.customer_id,
        flag: 1,
        search: val,
      }).then(({ data }) => {
        this.$set(this, 'contract_id_list', data.data.data || []);
      });
    },
    // 获取所有正常状态客户合同
    getAllContractUidSelect(_id) {
      queryContractUid({
        partner_type: 1,
        contract_status: 2,
        // partner_id: id,
        flag: 1,
      }).then(res => {
        if (res.data.data.data instanceof Array) {
          this.contract_id_list = res.data.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 检测关联店铺选择事件，赋值所选店铺的公司名称
    handleShopNameChange(value) {
      this.isShopName = '';
      this.application_list.contract_uid = '';
      this.application_list.contractVal = '';
      const shop = this.allCompanyName.find(item => item.id === value);
      if (shop) {
        this.application_list.company_name = shop.company_name;
        this.application_list.customer_id = shop.id;
        this.getAllContractUidSelect(shop.id);
      }
    },
    // 选择客户合同Id
    selectContractUidChange(val) {
      this.application_list.contractVal = '';
      const contract_data = this.contract_id_list.find(item => item.contract_id === val);
      if (contract_data) {
        this.application_list.contract_uid = contract_data.contract_uid;
        this.application_list.contract_id = contract_data.contract_id;
      }
      // for (var i = 0; i < this.list.length; i++) {
      //   if (val === this.list[i].contract_uid) {
      //     item.contract_id = this.list[i].contract_id;
      //   }
      // }
    },
    // 选择审批人
    selectUserId(val, approval_user, index) {
      this.checkedIndex = index;
      let arr = [];
      for (let $index = 0; $index < approval_user.length; $index++) {
        if (val === approval_user[$index].username) {
          arr = {
            index: index,
            user_id: approval_user[$index].user_id,
            role_code: approval_user[$index].role_code,
          };
        }
      }
      // 循环后插入
      if (this.application_list.approval_stream.length < this.approver_name.length) {
        this.application_list.approval_stream.push(arr);
      } else {
        this.application_list.approval_stream.splice(index, 1, arr);
      }
      // 排序
      let _arr = this.application_list.approval_stream;
      function compare(arg) {
        return function (aa, bb) {
          return aa[arg] - bb[arg];
        };
      }
      _arr = _arr.sort(compare('index'));
    },
    // 上传附件
    uploadAttachmentFile(value) {
      if (value.file.size > 30 * 1025 * 1024) {
        this.$message.error('单个文件大小不超过30M');
        return;
      }
      const formData = new FormData();
      formData.append('file', value.file);
      formData.append('attachment_type', 'borrowing_apply_annex');
      this.startLoading();
      uploadAttachment(formData)
        .then(res => {
          this.closeLoading();
          if (res.data.success) {
            this.borrowing_apply_annex.push(res.data.data.source);
            this.$message.success('上传附件成功');
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(error => {
          this.closeLoading();
          this.$message({
            type: 'warning',
            message: '上传附件失败，稍后重试',
            showClose: true,
            duration: 2000,
          });
          console.log(error.message);
        });
    },
    // 上传图片
    uploadAttachmentImg(value) {
      const formData = new FormData();
      formData.append('file', value.file);
      formData.append('attachment_type', 'borrowing_apply_photo');
      const isLt2M = value.file.size / 1024 / 1024 < 2;
      uploadAttachment(formData).then(res => {
        if (res && res.data && res.data.success) {
          if (isLt2M) {
            this.borrowing_apply_photo.push(res.data.data.source);
            this.$message.success('上传图片成功');
          } else {
            this.$message.error('上传图片大小不能超过 2MB!');
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除已上传的附件
    clearUploadedFile(index) {
      this.borrowing_apply_annex.splice(index, 1);
    },
    // 删除已上传的图片
    clearUploadedImg(index) {
      this.borrowing_apply_photo.splice(index, 1);
    },
    // 关闭弹窗
    handledialogCancel() {
      // 清空表单
      // 清空备注
      this.application_list.remark = '';
      // 清空回款销售金额
      this.application_list.back_amount = '';
      // 清空下拉框
      this.application_list.approval_stream = [];
      // 清空附件
      this.borrowing_apply_annex = [];
      // 清空图片
      this.borrowing_apply_photo = [];
      //清空流程
      this.approver_name = [];
      this.$refs.application_list.resetFields();
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/public.scss';
::v-deep .el-dialog__header {
  padding-left: 20px;
  .title {
    padding: 0;
  }
}

::v-deep .dialog-footer {
  .tg-btn:first-child {
    margin-right: 18px;
  }
  .tg-btn:last-child {
    margin-left: 0;
  }
}

::v-deep .el-dialog__footer {
  text-align: center;
}

::v-deep .el-dialog__wrapper {
  display: flex;
  align-items: center;
}
.uploaded-list {
  margin-top: 10px;
}
// ::v-deep .dialog-footer {
//   ::v-deep .el-button:first-child {
//     margin-right: 19px;
//   }
//   ::v-deep .el-button:last-child {
//     margin-left: 0;
//   }
// }
.flow {
  .flow-select {
    color: var(--text-color);
    font-size: 14px;
  }
  margin-top: 10px;
  padding: 10px 30px;
}
::v-deep .el-dialog__body {
  background: #f6f6f6;
}
.warp {
  // padding: 10px 10px;
  // padding-left: 80px;
  // padding-right: 80px;
  background: #fff;
  // border-radius: 4px;
  .upload-tips {
    font-size: 12px;
  }
  .uploaded-name {
    .icon-shanchu:before {
      color: #f43846;
      font-size: 18px;
    }
    .iconfujian:before {
      color: var(--text-des-color);
    }
    p {
      display: inline-block;
    }
    i {
      display: inline-block;
    }
    span {
      vertical-align: bottom;
      color: #396fff;
      display: inline-block;
      width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 5px;
    }
  }
  ::v-deep .el-input__inner {
    height: 36px;
    font-size: 14px;
  }
  ::v-deep .el-textarea__inner {
    border-radius: 4px !important;
    padding-left: 10px;
  }
  ::v-deep .el-input-group__prepend {
    padding: 0 10px !important;
    background: none;
    border: none;
    color: var(--text-color);
  }
  .img-list {
    position: relative;
    margin-right: 30px;
    line-height: 30px;
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid #e1e2e6;
    img {
      width: 100%;
      height: 100%;
    }
    span {
      position: absolute;
      width: 15px;
      height: 15px;
      line-height: 15px;
      background: black;
      opacity: 0.56;
      border-radius: 50%;
      top: -8px;
      right: -8px;
      cursor: pointer;
      text-align: center;
      font-size: 13px;
      color: #fff;
    }
  }
  .v-bgc {
    background: #f6f6f6;
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
  }
  ::v-deep .el-form {
    padding: 20px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 12px;

    ::v-deep .el-form-item__label {
      color: var(--text-color);
    }
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: var(--text-color);
  }
  ::v-deep .el-input-group__append {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
::v-deep .el-textarea__inner {
  border-radius: 4px;
}
.flow {
  background: #fff;
  border-radius: 4px;
  padding-left: 80px;
  ::v-deep .el-step__icon.is-text {
    border-radius: 50%;
    border: 5px solid #d6d6d6 !important;
    border-color: inherit;
    background: #d6d6d6;
  }
  ::v-deep .el-step__icon-inner {
    display: none;
  }
  ::v-deep .el-step.is-vertical .el-step__title {
    line-height: 40px;
    padding-bottom: 0px;
  }
  ::v-deep .el-step__line {
    position: absolute;
    border-color: inherit;
    background-color: #d6d6d6;
    display: block;
  }
  ::v-deep .el-step.is-vertical .el-step__line {
    top: 36px;
    bottom: -4px;
  }
  ::v-deep .el-step__title.is-wait {
    color: var(--text-color);
    font-size: 14px;
  }
  ::v-deep .el-step__icon {
    width: 18px;
    height: 18px;
    margin-left: 3px;
  }

  ::v-deep .el-input--suffix {
    width: 309px;
    height: 32px;
  }
  ::v-deep .el-input__inner {
    height: 32px;
  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  // 金额小于10万状态下
  .line-show-1:nth-child(4) {
    ::v-deep .el-step__line {
      display: none;
    }
  }
  // 金额大于10万小于50万状态下
  .line-show-2:nth-child(5) {
    ::v-deep .el-step__line {
      display: none;
    }
  }
  // 金额大于50万状态下
  .line-show-3:nth-child(6) {
    ::v-deep .el-step__line {
      display: none;
    }
  }
}
.contract_el {
  ::v-deep .el-input__inner {
    border-radius: 4px !important;
  }
}
.upload-btns {
  margin-right: 10px;
  i {
    position: relative;
    top: -3px;
    left: -3px;
  }
}
::v-deep .dialog-footer {
  ::v-deep .el-button {
    span {
      position: relative;
      left: -2px;
      top: -2px;
    }
  }
}
::v-deep .el-button.el-button--primary[disabled],
.el-button.el-button--primary.is-disabled {
  background-color: #e3e4e6;
  border-color: #e3e4e6;
}
</style>
