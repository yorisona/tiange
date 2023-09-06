<!--
 * @Description: 用款申请弹窗
 * @Autor: 神曲
 * @Date: 2020-04-02 14:13:48
 * @LastEditors: 神曲
 * @LastEditTime: 2020-04-28 18:24:37
 -->

<template>
  <common-dialog
    ref="ApplyDialog"
    :isAppendToBody="true"
    title="用款申请单"
    :width="800"
    :top="70"
    :isfooter="true"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
  >
    <div class="warp">
      <el-form :rules="transfer_list_rules" :model="transfer_list" ref="transfer_list">
        <el-form-item label-width="90px" prop="radio">
          <template #label>
            <span>
              <span style="color: var(--error-color); margin-right: 3px">*</span>用款类型:
            </span>
          </template>
          <el-radio v-model="radio" label="1">成本安排</el-radio>
        </el-form-item>
        <el-form-item label="用款金额：" label-width="90px" prop="transfer_amount">
          <!-- 限制只能输入数字及小数点2位 -->
          <el-input
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="transfer_list.transfer_amount"
            :maxlength="inputMaxL"
            @input="
              inputMaxL = /^\d+\.?\d{0,1}$/.test(transfer_list.transfer_amount)
                ? null
                : transfer_list.transfer_amount.length - 1
            "
            placeholder="请输入开票金额"
            @mousewheel.native.prevent
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="用款日期：" label-width="90px" prop="transfer_date">
          <el-date-picker
            :clearable="false"
            size="small"
            placeholder="请选择收款时间"
            style="width: 100%"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model="transfer_list.transfer_date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="90px">
          <template #label><p class="font-b">收款方式:</p></template>
          <p class="font-b">对公银行</p>
          <div class="v-bgc">
            <div style="display: flex">
              <el-form-item label="银行卡号：" label-width="90px" prop="bank_card_number">
                <el-input
                  maxlength="40"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="请输入银行卡号"
                  @mousewheel.native.prevent
                  v-model="transfer_list.bank_card_number"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司名称：" label-width="110px" prop="collecting_company">
                <el-input
                  maxlength="40"
                  placeholder="请输入公司名称"
                  @mousewheel.native.prevent
                  v-model.trim="transfer_list.collecting_company"
                ></el-input>
              </el-form-item>
            </div>
            <div style="display: flex">
              <el-form-item
                label="开户行："
                label-width="90px"
                prop="bank_of_deposit"
                class="bank-deposit"
              >
                <el-input
                  style="width: 78%"
                  maxlength="40"
                  placeholder="请输入开户行"
                  @mousewheel.native.prevent
                  v-model.trim="transfer_list.bank_of_deposit"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="店铺名称：" label-width="90px" prop="collecting_shop_name">
          <el-input
            maxlength="40"
            v-model.trim="transfer_list.collecting_shop_name"
            placeholder="请输入店铺名称"
            @mousewheel.native.prevent
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="90px">
          <el-input
            maxlength="100"
            v-model.trim="transfer_list.remark"
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
          <!-- 循环版 -->
          <el-steps direction="vertical" class="steps-line">
            <div
              v-for="(item, index) in select_data"
              :key="index"
              :class="[
                { 'line-show-1': transfer_list.transfer_amount < 100000 },
                {
                  'line-show-2':
                    transfer_list.transfer_amount >= 100000 &&
                    transfer_list.transfer_amount < 500000,
                },
                { 'line-show-3': transfer_list.transfer_amount >= 500000 },
              ]"
            >
              <el-step
                v-if="
                  !select_data[index].limit_amount ||
                  transfer_list.transfer_amount >= select_data[index].limit_amount
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
        </el-form-item>
      </el-form>
    </div>
  </common-dialog>
</template>

<script>
import {
  getApprovalStream, //获取审批流程人员
  saveTransferApply,
} from '@/api/workbench';
export default {
  name: 'ApplyDialog',
  data() {
    return {
      error_text: '', //审批流程错误提示
      checkedIndex: '',
      inputMaxL: null, //显示小数点后2位
      approver_name: [], //动态绑定审批人姓名
      select_data: '', //审批流程数据
      radio: '1', //单选框默认1
      transfer_list: {
        approval_type: 1, //用款申请
        level_two_types: 1, //成本安排类型
        level_three_types: 3, //对公银行类型
        transfer_amount: '', //用款金额
        transfer_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), //用款日期
        bank_card_number: '', //银行卡号
        bank_of_deposit: '', //开户行
        collecting_company: '', //公司名称
        remark: '', //备注
        collecting_shop_name: '', //店铺名称
        approval_stream: [], //审批流程
      },
      // 验证规则
      transfer_list_rules: {
        transfer_amount: [{ required: true, message: '请输入用款金额', trigger: 'blur' }],
        transfer_date: [{ required: true, message: '请输入用款日期', trigger: 'blur' }],
        bank_card_number: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        bank_of_deposit: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        collecting_company: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        collecting_shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
      },
    };
  },
  activated() {
    // 获取审批人员
    this.getApprovalStreamSelect();
  },
  methods: {
    // 用款类型选择
    // applyTypeChange(radio) {
    //   console.log(radio);
    // },
    // 获取审批流程角色
    getApprovalStreamSelect() {
      getApprovalStream({
        approval_type: 1,
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
      this.$refs.ApplyDialog.dialogOpen();
      if (detail_data) {
        this.transfer_list.transfer_amount = detail_data.transfer_amount_str; //用款金额
        this.transfer_list.transfer_date = detail_data.transfer_date; //用款日期
        this.transfer_list.bank_card_number = detail_data.bank_card_number; //银行卡号
        this.transfer_list.bank_of_deposit = detail_data.bank_of_deposit; //开户行
        this.transfer_list.collecting_company = detail_data.collecting_company; //公司名称
        this.transfer_list.collecting_shop_name = detail_data.collecting_shop_name; //店铺名称
        this.transfer_list.remark = detail_data.remark; //备注
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
        this.transfer_list.approval_stream.splice(this.checkedIndex, 1, ...list);
      }
    },
    // 弹窗确认操作
    handledialogSubmit() {
      if (this.transfer_list.transfer_amount < 100000) {
        if (this.transfer_list.approval_stream.length === 6) {
          this.transfer_list.approval_stream.splice(4, 2);
        }
        if (this.transfer_list.approval_stream.length === 5) {
          this.transfer_list.approval_stream.splice(4, 1);
        }
      }
      if (
        this.transfer_list.transfer_amount >= 100000 &&
        this.transfer_list.transfer_amount < 500000
      ) {
        if (this.transfer_list.approval_stream.length === 6) {
          this.transfer_list.approval_stream.splice(5, 1);
        }
      }

      this.$refs.transfer_list.validate(pass => {
        if (pass) {
          if (this.transfer_list.transfer_amount < 100000) {
            if (this.transfer_list.approval_stream.length !== 4) {
              this.$message.error('请选择审批流程');
            } else {
              saveTransferApply(this.transfer_list).then(res => {
                if (res.data.success) {
                  this.$message.success('保存成功');
                  this.$refs.ApplyDialog.dialogClose();
                } else {
                  this.$message.error(res.data.message);
                }
              });
            }
          }
          if (
            this.transfer_list.transfer_amount >= 100000 &&
            this.transfer_list.transfer_amount < 500000
          ) {
            if (this.transfer_list.approval_stream.length !== 5) {
              this.$message.error('请选择审批流程');
            } else {
              saveTransferApply(this.transfer_list).then(res => {
                if (res.data.success) {
                  this.$message.success('保存成功');
                  this.$refs.ApplyDialog.dialogClose();
                } else {
                  this.$message.error(res.data.message);
                }
              });
            }
          }
          if (
            this.transfer_list.transfer_amount >= 100000 &&
            this.transfer_list.transfer_amount >= 500000
          ) {
            if (this.transfer_list.approval_stream.length !== 6) {
              this.$message.error('请选择审批流程');
            } else {
              saveTransferApply(this.transfer_list).then(res => {
                if (res.data.success) {
                  this.$message.success('保存成功');
                  this.$refs.ApplyDialog.dialogClose();
                } else {
                  this.$message.error(res.data.message);
                }
              });
            }
          }
        }
      });
      // 保存后告诉父组件
      this.$emit('update-info', 'update');
    },
    // 选择审批人
    selectUserId(val, approval_user, index) {
      this.checkedIndex = index;
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
      if (this.transfer_list.approval_stream.length < this.approver_name.length) {
        this.transfer_list.approval_stream.push(arr);
      } else {
        this.transfer_list.approval_stream.splice(index, 1, arr);
      }
      // 排序
      let _arr = this.transfer_list.approval_stream;
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
      this.$refs.transfer_list.resetFields();
      // 清空备注
      this.transfer_list.remark = '';
      // 清空下拉框
      this.transfer_list.approval_stream = [];
      this.approver_name = [];
    },
  },
};
</script>

<style lang="less" scoped>
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
/deep/ .el-dialog__body {
  background: #f6f6f6;
}
.warp {
  // padding: 10px 10px;
  // padding-left: 80px;
  // padding-right: 80px;
  background: #fff;
  // border-radius: 10px;
  .font-b {
    font-weight: 600;
    color: var(--text-color);
    //   background: #f6f6f6;
    // border-radius: 10px;
  }
  /deep/ .el-input__inner {
    height: 32px;
  }
  /deep/ .el-input-group__prepend {
    padding: 0 10px !important;
    background: none;
    border: none;
    color: var(--text-color);
  }
  .v-bgc {
    // .bank-deposit {
    //   width: 292px;
    //   height: 32px;
    // }
    background: #f6f6f6;
    padding: 10px;
    border-radius: 10px;
    /deep/ .el-input__inner {
      border-radius: 10px;
    }
    /deep/ .el-row {
      padding-top: 20px;
      padding-bottom: 20px;
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
  background: #fff;
  border-radius: 10px;
  padding-left: 80px;
  padding-top: 20px;
  /deep/ .el-step__icon.is-text {
    border-radius: 50%;
    border: 5px solid #d6d6d6 !important;
    border-color: inherit;
    background: #d6d6d6;
  }
  /deep/ .el-step__line {
    position: absolute;
    border-color: inherit;
    background-color: #d6d6d6;
    display: block;
  }
  /deep/ .el-step__icon-inner {
    display: none;
  }
  /deep/ .el-step__icon {
    width: 18px;
    height: 18px;
    margin-left: 3px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0px;
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
  /deep/ .el-step.is-vertical .el-step__title {
    line-height: 40px;
    padding-bottom: 0px;
  }
  /deep/ .el-input__icon {
    line-height: 30px;
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
  .line-show-3:last-child {
    /deep/ .el-step__line {
      display: none;
    }
  }
}
</style>
