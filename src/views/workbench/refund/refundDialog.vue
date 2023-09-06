<!--
 * @Description: 退款申请弹窗
 * @Autor: 神曲
 * @Date: 2020-04-13 10:12:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-10 16:33:23
 -->
<template>
  <common-dialog
    ref="refundDialog"
    :isAppendToBody="true"
    title="退款申请单"
    :width="800"
    :top="70"
    :isfooter="true"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
  >
    <div class="warp">
      <el-form :rules="refund_list_rules" :model="refund_list" ref="refund_list">
        <el-form-item label-width="90px" prop="radio">
          <template #label>
            <span>
              <span style="color: var(--error-color); margin-right: 3px">*</span>退款类型:
            </span>
          </template>
          <el-radio v-model="radio" label="1">业绩退款</el-radio>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="关联业绩：" prop="achievement_uid" label-width="90px">
            <el-select
              size="small"
              v-model="refund_list.achievement_uid"
              style="padding-right: 6px"
              filterable
              clearable
              placeholder="搜索并选择收款编号"
              @change="val => selectAchievementUid(val, refund_list)"
            >
              <el-option
                v-for="refund_list in achievement_uids"
                :key="refund_list"
                :label="refund_list"
                :value="refund_list"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="gatherAmountStr-bgc">
            <span>该笔业绩收款金额:</span>
            <span class="gatherAmountStr" style="width: 400px">{{
              refund_list.gather_amount ? '￥' + refund_list.gather_amount : '--'
            }}</span>
          </div>
        </div>
        <el-form-item label="退款金额：" label-width="90px" prop="refund_amount">
          <!-- 限制只能输入数字及小数点最多2位 -->
          <el-input
            oninput="value=value.replace(/[^\d.]/g,'')"
            :maxlength="inputMaxL"
            @input="
              inputMaxL = /^\d+\.?\d{0,1}$/.test(refund_list.refund_amount)
                ? null
                : refund_list.refund_amount.length - 1
            "
            v-model="refund_list.refund_amount"
            placeholder="请输入退款金额"
            @mousewheel.native.prevent
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="退款方式：" prop="level_three_types" label-width="90px">
          <el-radio
            v-model="refund_list.level_three_types"
            :label="1"
            @change="val => vTaskChange(val)"
            >V任务</el-radio
          >
          <el-radio
            v-model="refund_list.level_three_types"
            :label="2"
            @change="val => accountChange(val)"
            >支付宝</el-radio
          >
          <el-radio
            v-model="refund_list.level_three_types"
            :label="3"
            @change="val => payMentChange(val)"
            >对公银行</el-radio
          >
        </el-form-item>
        <div v-if="refund_list.level_three_types === 1">
          <el-form-item label-width="90px">
            <div class="v-bgc" key="1">
              <el-form-item label="V任务id：" label-width="90px" prop="v_task_id">
                <el-input
                  maxlength="40"
                  placeholder="请输入v任务id"
                  @mousewheel.native.prevent
                  v-model.trim="refund_list.v_task_id"
                ></el-input>
              </el-form-item>
              <el-form-item label="旺旺名：" label-width="90px" prop="wangwang_name">
                <el-input
                  maxlength="40"
                  placeholder="请输入公司名称"
                  v-model.trim="refund_list.wangwang_name"
                ></el-input>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
        <div v-if="refund_list.level_three_types === 2">
          <el-form-item label-width="90px">
            <div class="v-bgc" key="2">
              <el-form-item label="姓名：" label-width="90px" prop="name">
                <el-input
                  maxlength="40"
                  placeholder="请输入姓名"
                  @mousewheel.native.prevent
                  v-model.trim="refund_list.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="账号：" label-width="90px" prop="account">
                <el-input
                  maxlength="40"
                  placeholder="请输入账号"
                  v-model.trim="refund_list.account"
                ></el-input>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
        <div v-if="refund_list.level_three_types === 3">
          <el-form-item label-width="90px">
            <div class="v-bgc" key="3">
              <el-form-item label="银行卡号：" label-width="90px" prop="bank_card_number">
                <el-input
                  maxlength="40"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入银行卡号"
                  @mousewheel.native.prevent
                  v-model.trim="refund_list.bank_card_number"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司名称：" label-width="90px" prop="company_name">
                <el-input
                  maxlength="40"
                  placeholder="请输入公司名称"
                  v-model.trim="refund_list.company_name"
                ></el-input>
              </el-form-item>
              <el-form-item
                maxlength="40"
                label="开户行："
                label-width="90px"
                prop="bank_of_deposit"
                class="bank-deposit"
              >
                <el-input
                  maxlength="40"
                  placeholder="请输入开户行"
                  v-model.trim="refund_list.bank_of_deposit"
                ></el-input>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="退款理由：" label-width="90px" prop="refund_reason">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="100"
            v-model.trim="refund_list.refund_reason"
            placeholder="请输入退款理由"
            @mousewheel.native.prevent
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="90px">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="100"
            v-model.trim="refund_list.remark"
            placeholder="请输入备注"
            @mousewheel.native.prevent
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="flow">
      <el-form>
        <el-form-item label="审批流程：" label-width="90px">
          <p v-if="error_text" style="color: #f43846">{{ error_text }}</p>
          <div>
            <!-- 循环版 -->
            <el-steps direction="vertical" class="steps-line">
              <div
                v-for="(item, index) in select_data"
                :key="index"
                :class="[
                  { 'line-show-1': refund_list.refund_amount < 100000 },
                  {
                    'line-show-2':
                      refund_list.refund_amount >= 100000 && refund_list.refund_amount < 500000,
                  },
                  { 'line-show-3': refund_list.refund_amount >= 500000 },
                ]"
              >
                <el-step
                  v-if="
                    !select_data[index].limit_amount ||
                    refund_list.refund_amount >= select_data[index].limit_amount
                  "
                  style="height: 82px"
                >
                  <template #title>
                    <span v-if="item.role_code !== 804 && item.role_code !== 802">{{
                      item.role_name
                    }}</span>
                    <!-- 分管副总 -->
                    <span v-if="item.role_code === 804">{{
                      item.role_name + '（用款金额大于10万元）'
                    }}</span>
                    <!-- 副总经理 -->
                    <span v-if="item.role_code === 802">{{
                      item.role_name + '（用款金额大于50万元）'
                    }}</span>
                  </template>
                  <template #description>
                    <div>
                      <span style="color: var(--error-color); margin-right: 3px">*</span>
                      <span class="flow-select">审批人:</span>
                      <el-select
                        v-model="approver_name[index]"
                        :clearable="false"
                        filterable
                        placeholder="请选择"
                        @change="val => selectUserId(val, select_data[index].approval_user, index)"
                      >
                        <el-option
                          v-for="item in select_data[index].approval_user
                            ? select_data[index].approval_user
                            : ''"
                          :key="item.user_id"
                          :value="item.username"
                        ></el-option>
                      </el-select>
                    </div>
                  </template>
                </el-step>
              </div>
            </el-steps>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </common-dialog>
</template>

<script>
import {
  getApprovalStream, //获取审批流程人员
  saveRefundApply,
  queryAchievementUid,
} from '@/api/workbench';
export default {
  name: 'refundDialog',
  data() {
    return {
      inputMaxL: null,
      error_text: '', //审批流程错误提示
      index: '',
      approver_name: [], //动态绑定审批人姓名
      select_data: '', //审批流程数据
      radio: '1', //单选框默认1
      refund_list: {
        approval_type: 2, //退款申请
        level_two_types: 1, //业绩退款类型
        level_three_types: 1, //打款方式 1:v任务 2:支付宝 3:对公银行
        achievement_id: '', //收款编号
        achievement_uid: '', //业绩uid
        refund_amount: '', //退款金额
        name: '', //姓名
        account: '', //账户
        v_task_id: '', //v任务id
        wangwang_name: '', //旺旺名称
        bank_card_number: '', //银行卡号
        bank_of_deposit: '', //开户行
        company_name: '', //公司名称
        refund_reason: '', //退款理由
        remark: '', //备注
        approval_stream: [], //审批流程
        gather_amount: '', //业绩金额
      },

      achievement_uids: [], //业绩uid集合
      list: [], //审批流程所有数据集合
      list_uid: [], //关联业绩所有数据的集合
      // 验证规则
      refund_list_rules: {
        achievement_uid: [{ required: true, message: '请选择关联业绩', trigger: 'change' }],
        refund_amount: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
        level_three_types: [{ required: true, message: '请选择退款方式', trigger: 'change' }],
        v_task_id: [{ required: true, message: '请输入v任务id', trigger: 'blur' }],
        wangwang_name: [{ required: true, message: '请输入旺旺名', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        bank_card_number: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        bank_of_deposit: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        refund_reason: [{ required: true, message: '请输入退款理由', trigger: 'blur' }],
        company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
      },
    };
  },
  activated() {
    // 获取审批人员
    this.getApprovalStreamSelect();
  },
  methods: {
    // 获取审批流程角色
    getApprovalStreamSelect() {
      getApprovalStream({
        approval_type: 2,
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
      this.getApprovalStreamSelect();
      this.$refs.refundDialog.dialogOpen();
      if (detail_data) {
        this.refund_list.gather_amount = detail_data.gather_amount; //该业绩收款金额
        this.refund_list.achievement_id = detail_data.achievement_id; //收款编号
        this.refund_list.achievement_uid = detail_data.achievement_uid; //业绩uid
        this.refund_list.refund_amount = detail_data.refund_amount_str; //退款金额
        this.refund_list.level_three_types = detail_data.level_three_types; //退款方式 1:v任务 2:支付宝 3:对公银行
        this.refund_list.v_task_id =
          detail_data.level_three_types === 1 ? detail_data.refund_way_detail.v_task_id : ''; //v任务id
        this.refund_list.wangwang_name =
          detail_data.level_three_types === 1 ? detail_data.refund_way_detail.wangwang_name : ''; //旺旺名
        this.refund_list.name =
          detail_data.level_three_types === 2 ? detail_data.refund_way_detail.name : ''; //姓名
        this.refund_list.account =
          detail_data.level_three_types === 2 ? detail_data.refund_way_detail.account : ''; //账户
        this.refund_list.bank_card_number =
          detail_data.level_three_types === 3 ? detail_data.refund_way_detail.bank_card_number : ''; //银行卡号
        this.refund_list.bank_of_deposit =
          detail_data.level_three_types === 3 ? detail_data.refund_way_detail.bank_of_deposit : ''; //开户行
        this.refund_list.company_name =
          detail_data.level_three_types === 3 ? detail_data.refund_way_detail.company_name : ''; //公司名称
        this.refund_list.refund_reason = detail_data.refund_reason; //退款理由
        this.refund_list.remark = detail_data.remark; //备注
        // 审批流程
        const list = [];
        for (let i = 0; i < detail_data.approval_stream.length; i++) {
          this.approver_name.push(detail_data.approval_stream[i].username);
          list.push({
            index: detail_data.approval_stream[i].index,
            user_id: detail_data.approval_stream[i].user_id,
            role_code: detail_data.approval_stream[i].role_code,
          });
        }
        this.refund_list.approval_stream.splice(this.index, 1, ...list);
      }
      this.getAchievementUIds();
    },
    // 选择收款编号
    selectAchievementUid(val, _refund_list) {
      // 业绩对应的金额
      for (let i = 0; i < this.list_uid.length; i++) {
        if (this.list_uid[i].achievement_uid === val) {
          this.refund_list.gather_amount = this.list_uid[i].gather_amount;
          this.refund_list.achievement_id = this.list_uid[i].achievement_id;
        }
      }
    },
    // 选择v任务
    vTaskChange(val) {
      if (val === 1) {
        this.refund_list.bank_card_number = '';
        this.refund_list.company_name = '';
        this.refund_list.bank_of_deposit = '';
        this.refund_list.name = '';
        this.refund_list.account = '';
      }
    },
    // 选择支付宝
    accountChange(val) {
      if (val === 2) {
        this.refund_list.bank_card_number = '';
        this.refund_list.company_name = '';
        this.refund_list.bank_of_deposit = '';
        this.refund_list.v_task_id = '';
        this.refund_list.wangwang_name = '';
      }
    },
    // 选择对公银行
    payMentChange(val) {
      if (val === 3) {
        this.refund_list.name = '';
        this.refund_list.account = '';
        this.refund_list.v_task_id = '';
        this.refund_list.wangwang_name = '';
      }
    },
    // 获取当前安排的成本编号
    getAchievementUIds() {
      queryAchievementUid({
        partner_type: 2,
      }).then(res => {
        this.achievement_uids = res.data.data.data.map(a => a.achievement_uid);
        this.list_uid = res.data.data.data;
      });
    },
    // 弹窗确认操作
    handledialogSubmit() {
      if (this.refund_list.refund_amount < 100000) {
        if (this.refund_list.approval_stream.length === 6) {
          this.refund_list.approval_stream.splice(4, 2);
        }
        if (this.refund_list.approval_stream.length === 5) {
          this.refund_list.approval_stream.splice(4, 1);
        }
      }
      if (this.refund_list.refund_amount >= 100000 && this.refund_list.refund_amount < 500000) {
        if (this.refund_list.approval_stream.length === 6) {
          this.refund_list.approval_stream.splice(5, 1);
        }
      }
      this.$refs.refund_list.validate(pass => {
        if (pass) {
          if (this.refund_list.refund_amount === 0) {
            this.$message.error('金额不得小于等于0');
          } else {
            if (this.refund_list.refund_amount < 100000) {
              if (this.refund_list.approval_stream.length !== 4) {
                this.$message.error('请选择审批流程');
              } else {
                saveRefundApply(this.refund_list).then(res => {
                  if (res.data.success) {
                    this.$message.success('保存成功');
                    this.$refs.refundDialog.dialogClose();
                  } else {
                    this.$message.error(res.data.message);
                  }
                });
              }
            }
            if (
              this.refund_list.refund_amount >= 100000 &&
              this.refund_list.refund_amount < 500000
            ) {
              if (this.refund_list.approval_stream.length !== 5) {
                this.$message.error('请选择审批流程');
              } else {
                saveRefundApply(this.refund_list).then(res => {
                  if (res.data.success) {
                    this.$message.success('保存成功');
                    this.$refs.refundDialog.dialogClose();
                  } else {
                    this.$message.error(res.data.message);
                  }
                });
              }
            }
            if (
              this.refund_list.refund_amount >= 100000 &&
              this.refund_list.refund_amount >= 500000
            ) {
              if (this.refund_list.approval_stream.length !== 6) {
                this.$message.error('请选择审批流程');
              } else {
                saveRefundApply(this.refund_list).then(res => {
                  if (res.data.success) {
                    this.$message.success('保存成功');
                    this.$refs.refundDialog.dialogClose();
                  } else {
                    this.$message.error(res.data.message);
                  }
                });
              }
            }
          }
        }
      });
      // 保存后告诉父组件
      this.$emit('update-info', 'update');
    },
    // 选择审批人
    selectUserId(val, approval_user, index) {
      this.index = index;
      let arr = [];
      for (let i = 0; i < approval_user.length; i++) {
        if (val === approval_user[i].username) {
          arr = {
            index: index,
            user_id: approval_user[i].user_id,
            role_code: approval_user[i].role_code,
          };
        }
      }
      // 循环后插入
      if (this.refund_list.approval_stream.length < this.approver_name.length) {
        this.refund_list.approval_stream.push(arr);
      } else {
        this.refund_list.approval_stream.splice(index, 1, arr);
      }
      // 排序
      let _arr = this.refund_list.approval_stream;
      function compare(arg) {
        return function (a, b) {
          return a[arg] - b[arg];
        };
      }
      _arr = _arr.sort(compare('index'));
    },
    // 关闭弹窗
    handledialogCancel() {
      // 清空表单
      this.$refs.refund_list.resetFields();
      // 清空备注
      this.refund_list.remark = '';
      // 清空下拉框
      this.refund_list.approval_stream = [];
      this.refund_list.gather_amount = '--';
      this.approver_name = [];
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  background: #f6f6f6;
}
/deep/ .common-dialog .el-dialog__footer {
  padding-top: 0px;
}
.warp {
  // padding: 10px 10px;
  // padding-left: 80px;
  // padding-right: 80px;
  background: #fff;
  // border-radius: 10px;
  .gatherAmountStr {
    color: #ff731e;
    font-weight: 600;
    width: 400px;
  }
  .gatherAmountStr-bgc {
    border-radius: 10px;
    background: rgba(245, 248, 250, 1);
    padding: 0 5px;
    min-width: 46%;
    height: 32px;
    margin-top: 5px;
    line-height: 32px;
  }
  /deep/ .el-input__inner {
    height: 32px;
  }
  /deep/ .el-textarea__inner {
    border-radius: 10px;
  }
  /deep/ .el-input-group__prepend {
    padding: 0 10px !important;
    background: none;
    border: none;
    color: var(--text-color);
  }
  .v-bgc {
    background: #f6f6f6;
    padding: 10px;
    padding-right: 22px;
    padding-top: 22px;
    border-radius: 10px;
    /deep/ .el-input__inner {
      border-radius: 10px;
    }
    /deep/ .el-row {
      padding-top: 20px;
      padding-bottom: 10px;
    }
    /deep/ .el-form-item__content {
      background: #f6f6f6;
      border-radius: 10px;
    }
  }
  /deep/ .el-form-item {
    margin-bottom: 12px;
  }
  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: var(--text-color);
  }
  /deep/ .el-input-group__append {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
.flow {
  .flow-select {
    color: var(--text-color);
    font-size: 14px;
  }
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  padding-left: 80px;
  padding-top: 20px;
  /deep/ .el-step__icon-inner {
    display: none;
  }
  /deep/ .el-step__icon.is-text {
    border-radius: 50%;
    border: 5px solid #d6d6d6 !important;
    border-color: inherit;
    background: #d6d6d6;
  }
  /deep/ .el-step__icon {
    width: 18px;
    height: 18px;
    margin-left: 3px;
  }
  /deep/ .el-step__line {
    position: absolute;
    border-color: inherit;
    background-color: #d6d6d6;
    display: block;
  }
  /deep/ .el-step.is-vertical .el-step__line {
    top: 36px;
    bottom: -4px;
  }
  /deep/ .el-step__title.is-wait {
    color: var(--text-color);
    font-size: 14px;
  }
  /deep/ .el-input--suffix {
    width: 309px;
    height: 32px;
  }
  /deep/ .el-input__inner {
    height: 32px;
  }
  /deep/ .el-input__icon {
    line-height: 30px;
  }
  /deep/ .el-step.is-vertical .el-step__title {
    line-height: 40px;
    padding-bottom: 0px;
  }
  // 金额小于10万状态下
  .line-show-1:nth-child(4) {
    /deep/ .el-step__line {
      display: none;
    }
  }
  // 金额大于10万小于50万状态下
  .line-show-2:nth-child(5) {
    /deep/ .el-step__line {
      display: none;
    }
  }
  // 金额大于50万状态下
  .line-show-3:nth-child(6) {
    /deep/ .el-step__line {
      display: none;
    }
  }
}
</style>
