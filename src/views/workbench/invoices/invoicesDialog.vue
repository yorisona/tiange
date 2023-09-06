<!--
 * @Description: 申请发票弹窗
 * @Autor: 神曲
 * @Date: 2020-04-13 10:44:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-23 15:17:59
 -->
<template>
  <common-dialog
    ref="invoicesDialog"
    :isAppendToBody="true"
    title="开票申请单"
    :width="800"
    :top="70"
    :isfooter="true"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
    class="sty-add-dialog tg-dialog-vcenter-new"
  >
    <div class="warp">
      <el-form
        :rules="invoices_list_rules"
        :model="invoices_list"
        ref="invoices_list"
        label-width="145px"
      >
        <div class="box1">
          <el-form-item prop="level_two_types">
            <template #label>
              <span>
                <span style="color: var(--error-color); margin-right: 3px">*</span>发票类型：
              </span>
            </template>
            <el-radio v-model="invoices_list.level_two_types" :label="1">普通发票</el-radio>
            <el-radio v-model="invoices_list.level_two_types" :label="2">专用发票</el-radio>
            <el-radio v-model="invoices_list.level_two_types" :label="3">电子发票</el-radio>
            <el-radio v-model="invoices_list.level_two_types" :label="4">收据</el-radio>
          </el-form-item>
          <el-form-item label="开票金额：" prop="invoice_amount">
            <!-- 限制只能输入数字及小数点最多2位 -->
            <!-- <el-input
              oninput="value=value.replace(/[^\d.]/g,'')"
              :maxlength="inputMaxL"
              @input="value=> invoices_list.invoice_amount=value.replace(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/)"
              @input="
                inputMaxL = /^\d+\.?\d{0,1}$/.test(invoices_list.invoice_amount)
                  ? null
                  : invoices_list.invoice_amount.length - 1
              "
              v-model="invoices_list.invoice_amount"
              placeholder="请输入开票金额"
              @mousewheel.native.prevent
            ></el-input> -->
            <el-input
              @input="value => (invoices_list.invoice_amount = getPositiveNumber(value))"
              v-model="invoices_list.invoice_amount"
              placeholder="请输入开票金额"
              @mousewheel.native.prevent
              ref="autoFocuseRef"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <template #label>
              <span>
                <span style="color: var(--error-color); margin-right: 3px">*</span>款项是否收到：
              </span>
            </template>
            <el-radio v-model="invoices_list.is_received" :label="1">是</el-radio>
            <el-radio v-model="invoices_list.is_received" :label="0">否</el-radio>
          </el-form-item>
          <el-form style="margin-left: 145px; background: #f6f6f6; padding: 19.7px 10px">
            <el-form-item style="margin-bottom: 0">
              <template #label>
                <span>
                  <span style="color: var(--error-color); margin-right: 3px">*</span
                  >{{ invoices_list.is_received ? '' : '预计' }}收款时间：
                </span>
              </template>
              <el-date-picker
                :clearable="false"
                size="small"
                placeholder="请选择收款时间"
                style="width: 50%"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                v-model="invoices_list.received_date"
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <el-form-item>
            <template #label>
              <span>
                <span style="color: var(--error-color); margin-right: 3px">*</span>发票寄送方式：
              </span>
            </template>
            <el-radio v-model="invoices_list.invoice_send_type" :label="1">快递寄送</el-radio>
            <el-radio v-model="invoices_list.invoice_send_type" :label="2">自行送达</el-radio>
          </el-form-item>
        </div>
        <div class="sty-lines"></div>
        <div class="box2">
          <p class="title">开票信息2</p>
          <div class="v-bgc v-invoice">
            <div style="display: flex">
              <el-form-item label="公司名称：" prop="collecting_company">
                <el-input
                  maxlength="20"
                  placeholder="请输入公司名称"
                  @mousewheel.native.prevent
                  v-model.trim="invoices_list.collecting_company"
                ></el-input>
              </el-form-item>
              <el-form-item label="纳税人识别号：" prop="tax_number">
                <el-input
                  maxlength="20"
                  placeholder="请输入纳税人识别号"
                  @mousewheel.native.prevent
                  @keyup.native="inputChange($event)"
                  @keydown.native="inputChange($event)"
                  v-model.trim="invoices_list.tax_number"
                ></el-input>
              </el-form-item>
            </div>
            <div style="display: flex">
              <el-form-item label="地址：" prop="address">
                <el-input
                  maxlength="100"
                  placeholder="请输入地址"
                  @mousewheel.native.prevent
                  v-model.trim="invoices_list.address"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话：" prop="phone">
                <el-input
                  maxlength="20"
                  @input="value => (invoices_list.phone = value.replace(/[^\d-]/g, ''))"
                  placeholder="请输入电话"
                  @mousewheel.native.prevent
                  v-model="invoices_list.phone"
                ></el-input>
              </el-form-item>
            </div>
            <div style="display: flex">
              <el-form-item label="开户行：" prop="bank_of_deposit">
                <!-- 这里直接用 oninput 控制，输入了中文 必填验证会通不过 -->
                <el-input
                  maxlength="50"
                  placeholder="请输入开户行"
                  @keyup.native="inputChanges($event)"
                  @keydown.native="inputChanges($event)"
                  @mousewheel.native.prevent
                  v-model.trim="invoices_list.bank_of_deposit"
                ></el-input>
              </el-form-item>
              <el-form-item label="账号：" prop="bank_card_number">
                <el-input
                  maxlength="25"
                  @keyup.native="inputNumberChange($event)"
                  @keydown.native="inputNumberChange($event)"
                  placeholder="请输入账号"
                  @mousewheel.native.prevent
                  v-model.trim="invoices_list.bank_card_number"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="sty-lines"></div>
        <div class="box3 input-limit">
          <el-form-item label="关联客户合同：">
            <el-select
              size="small"
              v-model="invoices_list.contract_uid"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteContractUid"
              placeholder="请搜索并选择客户合同"
              @change="val => selectContractUidChange(val)"
            >
              <el-option
                v-for="item in invoices_list.isContractUid ? contract_id_list : []"
                :key="item.contract_id"
                :label="item.contract_uid"
                :value="item.contract_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联业绩：" prop="achievement_uid">
            <el-select
              size="small"
              v-model="invoices_list.achievement_uid"
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteAchievementUid"
              placeholder="搜索并选择收款编号"
              @change="val => selectAchievementUid(val)"
            >
              <el-option
                v-for="item in invoices_list.isAchievementUid ? achievement_uids : []"
                :key="item.achievement_id"
                :label="item.achievement_uid"
                :value="item.achievement_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              maxlength="100"
              type="textarea"
              :rows="2"
              v-model.trim="invoices_list.remark"
              placeholder="请输入备注"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </common-dialog>
</template>

<script>
import {
  getApprovalStream, //获取审批流程人员
  saveInvoiceApply,
  queryAchievementUid, //获取业绩编号
  queryContractUid, //获取合同编号
} from '@/api/workbench';
import { getPositiveNumber } from '@/utils/string';
import { ref } from '@vue/composition-api';

export default {
  name: 'invoicesDialog',
  setup() {
    const autoFocuseRef = ref(undefined);
    return {
      autoFocuseRef,
    };
  },
  data() {
    return {
      saveLoading: false,
      inputMaxL: null,
      error_text: '', //审批流程错误提示
      checkedIndex: '',
      approver_name: [], //动态绑定审批人姓名
      select_data: '', //审批流程数据
      achievement_uids: [], //业绩uid集合
      contract_id_list: [], //客户合同集合
      invoices_list: {
        approval_type: 4, //开票申请
        level_two_types: 1, //发票类型 1:普通发票 2:专用发票
        invoice_amount: '', //开票金额
        is_received: 1, // 款项是否收到
        received_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 收款时间 / 预计收款时间
        invoice_send_type: 1, // 发票寄送方式
        collecting_company: '', //公司名称
        phone: '', //电话
        tax_number: '', //纳税人识别号、
        address: '', //地址
        bank_card_number: '', //账号
        bank_of_deposit: '', //开户行
        contract_id: undefined, //合同id
        contract_uid: '', //合同uid
        isContractUid: '', // 控制关联客户合同取消下拉选择
        achievement_id: '', //收款编号
        achievement_uid: '', //收款编号
        isAchievementUid: '', //控制关联业绩取消下拉选择
        remark: '', //备注
        approval_stream: [], //审批流程
      },
      // 验证规则
      invoices_list_rules: {
        invoice_amount: [{ required: true, message: '请输入开票金额', trigger: 'blur' }],
        bank_card_number: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        bank_of_deposit: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        collecting_company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        tax_number: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        achievement_uid: [{ required: true, message: '请选择关联收款编号', trigger: 'change' }],
        phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
      },
    };
  },
  activated() {
    // 获取审批人员
    this.getApprovalStreamSelect();
  },
  methods: {
    getPositiveNumber,
    // 获取审批流程角色
    getApprovalStreamSelect() {
      getApprovalStream({
        approval_type: 4,
      }).then(res => {
        if (res && res.data && res.data.success) {
          this.select_data = res.data.data;
          this.list = res.data.data;
        } else {
          this.error_text = res.data.message;
        }
      });
    },
    inputChange(event) {
      this.invoices_list.tax_number = this.publicFunc.inputCharOrNumber(event);
    },
    // 显示
    show(detail_data) {
      this.getApprovalStreamSelect();
      this.$refs.invoicesDialog.dialogOpen();
      if (detail_data) {
        this.invoices_list.level_two_types = detail_data.level_two_types; //发票类型
        this.invoices_list.contract_id = detail_data.contract_id; //客户合同id
        this.invoices_list.achievement_id = detail_data.achievement_id; //收款编号
        this.invoices_list.invoice_amount = detail_data.invoice_amount_str; //开票金额
        this.invoices_list.collecting_company = detail_data.collecting_company; //公司名称
        this.invoices_list.bank_card_number = detail_data.bank_card_number; //账号
        this.invoices_list.bank_of_deposit = detail_data.bank_of_deposit; //开户行
        this.invoices_list.phone = detail_data.phone; //电话
        this.invoices_list.tax_number = detail_data.tax_number; // 纳税人识别号;
        this.invoices_list.address = detail_data.address; //地址
        this.invoices_list.contract_uid = detail_data.contract_uid; //客户合同uid
        this.invoices_list.achievement_uid = detail_data.achievement_uid; //业绩uid
        this.invoices_list.remark = detail_data.remark; //备注
        // 审批流程
        const list = [];
        for (let idx = 0; idx < detail_data.approval_stream.length; idx++) {
          this.approver_name.push(detail_data.approval_stream[idx].username);
          list.push({
            index: detail_data.approval_stream[idx].index,
            user_id: detail_data.approval_stream[idx].user_id,
            role_code: detail_data.approval_stream[idx].role_code,
          });
        }
        this.invoices_list.approval_stream.splice(this.checkedIndex, 1, ...list);
      } else {
        this.$nextTick(() => {
          this.$refs.autoFocuseRef?.focus();
        });
      }
      this.getAllContractUidSelect();
      this.getAllAchievementUidSelect();
    },
    // 弹窗确认操作
    handledialogSubmit() {
      this.$refs.invoices_list.validate(pass => {
        if (pass) {
          if (this.invoices_list.invoice_amount === 0) {
            this.$message.error('金额不得小于等于0');
          } else {
            this.saveLoading = true;
            saveInvoiceApply(this.invoices_list).then(res => {
              if (res.data.success) {
                this.$message.success('保存成功');
                this.$refs.invoicesDialog?.dialogClose();
                // 跳转到 '我发起的' tab页
                // this.$parent.$parent.$parent.$parent.checkedTab = 'mine';
              } else {
                this.$message.error(res.data.message);
              }
              this.saveLoading = false;
            });
          }
        }
      });
      if (!this.$refs.invoicesDialog.dialogVisible) {
        setTimeout(() => {
          if (this.$parent.$parent.customerVisible) {
            this.$parent.$parent.customerVisible = false;
          }
          this.$emit('reloadTable');
          // 保存后告诉父组件
          // this.$emit('update-info', 'update');
        }, 1000);
      }
    },
    /**
     * @Author: 矢车
     * @Date: 2020-11-16 16:04:49
     * @Description: 调用全局方法，只能输入中文
     */
    inputChanges(event) {
      this.invoices_list.bank_of_deposit = this.publicFunc.inputChinese(event);
    },
    inputNumberChange(event) {
      this.invoices_list.bank_card_number = this.publicFunc.inputNumberLimit(event);
    },
    // 获取所有正常状态客户合同
    getAllContractUidSelect() {
      queryContractUid({
        partner_type: 1,
        contract_status: 2,
        flag: 1,
        GOUMEE: 'GOUMEE',
      }).then(res => {
        if (res.data.data.data instanceof Array) {
          this.contract_id_list = res.data.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取所有业绩编号
    getAllAchievementUidSelect() {
      queryAchievementUid().then(res => {
        if (res.data.data.data instanceof Array) {
          this.achievement_uids = res.data.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 选择关联客户合同
    selectContractUidChange(val) {
      this.invoices_list.isContractUid = '';
      const contract_data = this.contract_id_list.find(item => item.contract_id === val);
      if (contract_data) {
        this.invoices_list.contract_uid = contract_data.contract_uid;
        this.invoices_list.contract_id = contract_data.contract_id;
      }
    },
    // 控制关联客户合同取消下拉选择
    remoteContractUid(val) {
      this.invoices_list.isContractUid = val;
      queryContractUid({
        partner_type: 1,
        contract_status: 2,
        flag: 1,
        GOUMEE: 'GOUMEE',
        search: val,
      }).then(({ data }) => {
        this.$set(this, 'contract_id_list', data.data.data || []);
      });
    },
    // 选择关联业绩
    selectAchievementUid(val) {
      this.invoices_list.isAchievementUid = '';
      const achievement_data = this.achievement_uids.find(item => item.achievement_id === val);
      if (achievement_data) {
        this.invoices_list.achievement_uid = achievement_data.achievement_uid;
        this.invoices_list.achievement_id = achievement_data.achievement_id;
      }
    },
    // 控制关联业绩取消下拉选择
    remoteAchievementUid(val) {
      this.invoices_list.isAchievementUid = val;
      queryAchievementUid({
        search: val,
      }).then(({ data }) => {
        this.$set(this, 'achievement_uids', data.data.data || []);
      });
    },
    // 选择审批人
    selectUserId(val, approval_user, index) {
      this.checkedIndex = index;
      let arr = [];
      for (let idx = 0; idx < approval_user.length; idx++) {
        if (val === approval_user[idx].username) {
          arr = {
            index: index,
            user_id: approval_user[idx].user_id,
            role_code: approval_user[idx].role_code,
          };
        }
      }
      // 循环后插入
      if (this.invoices_list.approval_stream.length < this.approver_name.length) {
        this.invoices_list.approval_stream.push(arr);
      } else {
        this.invoices_list.approval_stream.splice(index, 1, arr);
      }
      // 排序
      let _arr = this.invoices_list.approval_stream;
      function compare(arg) {
        return function (aa, bb) {
          return aa[arg] - bb[arg];
        };
      }
      _arr = _arr.sort(compare('index'));
    },
    // 关闭弹窗
    handledialogCancel() {
      // 清空表单
      this.$refs.invoices_list.resetFields();
      // 清空备注
      this.invoices_list.remark = '';
      // 清空下拉框
      this.invoices_list.approval_stream = [];
      this.approver_name = [];
      this.invoices_list.contract_uid = '';
      this.invoices_list.contract_id = undefined;
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

.flow {
  .flow-select {
    color: var(--text-color);
    font-size: 14px;
  }
  .flow-title {
    margin-bottom: 10px;
    color: var(--text-color);
    font-weight: 600;
  }
  margin-top: 10px;
  padding: 10px 30px;
}
::v-deep .el-dialog__body {
  background: #f6f6f6;
}
.warp {
  overflow: hidden;
  .box1 {
    background: #fff;
    border-radius: 4px;
    padding-right: 25px;
  }
  .box2 {
    margin-top: 10px;
    background: #fff;
    border-radius: 4px;
    padding: 10px;
    padding-right: 50px;
    .title {
      color: var(--text-color);
      font-weight: 600;
      margin-left: 10px;
    }
  }
  .input-limit {
    ::v-deep .el-form-item__label {
      width: 134px !important;
    }
    ::v-deep .el-form-item__content {
      margin-left: 134px !important;
    }
  }
  .box3 {
    margin-top: 10px;
    background: #fff;
    border-radius: 4px;
    padding: 10px;
    padding-right: 25px;
  }
  // padding: 10px 10px;
  // padding-left: 80px;
  // padding-right: 80px;
  ::v-deep .el-input__inner {
    height: 36px;
    font-size: 14px;
  }
  ::v-deep .el-textarea__inner {
    border-radius: 4px;
  }
  ::v-deep .el-input-group__prepend {
    padding: 0 10px !important;
    background: none;
    border: none;
    color: var(--text-color);
  }
  .v-invoice {
    ::v-deep .el-form-item__label {
      width: 123px !important;
    }
    ::v-deep .el-input__inner {
      width: 203px;
    }
    ::v-deep .el-form-item__content {
      margin-left: 125px !important;
      margin-right: 15px;
    }
  }
  .v-bgc {
    background: white;
    .bank-deposit {
      width: 292px;
      height: 32px;
    }
    padding: 10px;
    border-radius: 4px;
    ::v-deep .el-input__inner {
      border-radius: 4px;
    }
    ::v-deep .el-row {
      padding-top: 20px;
      padding-bottom: 20px;
    }
    ::v-deep .el-form-item__content {
      border-radius: 4px;
    }
  }
  ::v-deep .el-form-item {
    margin-bottom: 12px;
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: var(--text-color);
  }
  ::v-deep .el-input-group__append {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
.flow {
  background: #fff;
  border-radius: 4px;
  padding-left: 80px;
  padding-top: 20px;
  ::v-deep .el-step__icon-inner {
    display: none;
  }
  ::v-deep .el-step__icon.is-text {
    border-radius: 50%;
    border: 5px solid #d6d6d6 !important;
    border-color: inherit;
    background: #d6d6d6;
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
  ::v-deep .el-step.is-vertical .el-step__title {
    line-height: 40px;
    padding-bottom: 0px;
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
    height: 36px;
  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  // 步骤条最后一个
  .line-show-1:last-child {
    ::v-deep .el-step__line {
      display: none;
    }
  }
}
.v-invoice {
  ::v-deep .el-input {
    background: white;
  }
}
.sty-lines {
  margin-left: 0px !important;
}
::v-deep .el-button {
  span {
    position: relative;
    left: -2px;
    top: -2px;
  }
}

::v-deep .el-radio {
  margin: 0 !important;

  ::v-deep .el-radio__label {
    padding: 0 20px 0 6px;
  }
}
</style>
