<template>
  <el-dialog
    :visible="visible"
    ref="ConfirmCooperationDialog"
    class="customer-dialog"
    width="800px"
    @close="handledialogCancel"
    :isfooter="true"
  >
    <template #title> <span>确定合作</span> </template>
    <div class="confirmcooperation-container">
      <div class="box1">
        <CustomerStageProgress :isvertical="false" :stage="2" :issimple="true" />
      </div>
      <el-form
        ref="confirmcooperation_form"
        :model="confirmcooperation_form"
        :rules="confirmcooperation_form_rules"
        label-width="180px"
        style="margin-top: 10px"
      >
        <div class="box2">
          <div class="form-block">
            <el-form-item label="销售金额：" prop="sale_amount">
              <div class="border-r-amount">
                <el-input
                  placeholder="请输入销售金额"
                  type="number"
                  @mousewheel.native.prevent
                  v-model.number="confirmcooperation_form.sale_amount"
                  style="width: 100%"
                >
                  <template #append>元</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="关联客户合同：" prop="has_contract">
              <el-radio
                v-model="confirmcooperation_form.has_contract"
                :label="1"
                @change="val => ContractTypeChange(val, confirmcooperation_form)"
              >
                <el-select
                  size="small"
                  v-model="confirmcooperation_form.contract_uid"
                  style="width: 100%"
                  filterable
                  placeholder="请搜索或选择供应商合同编号"
                  @change="val => selectCostContractUid(val, confirmcooperation_form)"
                >
                  <el-option
                    v-for="confirmcooperation_form in contract_id_list"
                    :key="confirmcooperation_form"
                    :label="confirmcooperation_form"
                    :value="confirmcooperation_form"
                  ></el-option>
                </el-select>
              </el-radio>

              <el-radio
                class="no-contract"
                v-model="confirmcooperation_form.has_contract"
                :label="2"
                @change="val => ContractTypeChange(val, confirmcooperation_form)"
                >无合同</el-radio
              >
            </el-form-item>
            <el-form-item label="是否收款：" prop="is_gather">
              <el-switch
                v-model="confirmcooperation_form.is_gather"
                active-text="是"
                inactive-text="否"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
            <el-form-item
              label="回款时间："
              prop="gather_date"
              v-show="confirmcooperation_form.is_gather === 0"
            >
              <el-date-picker
                size="small"
                placeholder="请选择回款时间"
                style="width: 100%"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                v-model="confirmcooperation_form.gather_date"
                @change="val => dateChangeHandle(val, confirmcooperation_form)"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <tg-button @click="handledialogCancel">取消</tg-button>
      <tg-button type="primary" @click="handledialogSubmit">确定</tg-button>
    </template>
  </el-dialog>
</template>

<script>
import { getCostContractUid } from '@/api/cooperative';
import CustomerStageProgress from '../components/CustomerStageProgress';
import { mapActions } from 'vuex';
import { confirmCooperation } from '@/api/cooperative';
import { showProDateFormat } from '@/utils/format';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'ConfirmCooperation',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CustomerStageProgress,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      confirmcooperation_form: {
        contract_id: '', //供应商客户id
        contract_uid: '', //供应商合同编号
        has_contract: '', //关联客户合同 1有合同 2无合同
        cooperation_id: 0, // 合作ID
        sale_amount: '', // 销售金额
        is_gather: 0, // 是否收款
        gather_date: '', // 收款日期
        is_update: 0, // 是否更新
      },
      list: [], //合同编号和客户id接口数据集合
      contract_id_list: [], //客户合同uid集合
      // 验证规则
      confirmcooperation_form_rules: {
        sale_amount: [{ required: true, message: '请输入销售金额', trigger: 'blur' }],
        has_contract: [
          // 关联客户合同
          { required: true, message: '请选择关联客户合同', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    ...mapActions({
      GetAchievementList: 'cooperative/GetAchievementList',
      GetCoostList: 'cooperative/GetCoostList',
    }),
    dateChangeHandle(val, confirmcooperation_form) {
      if (val === null) {
        confirmcooperation_form.gather_date = '';
      }
    },
    // 显示
    show(type) {
      if (type) {
        // 更新
        this.confirmcooperation_form.contract_id =
          this.CooperationDetail.has_contract === 2 ? '' : this.CooperationDetail.contract_id;
        this.confirmcooperation_form.contract_uid =
          this.CooperationDetail.has_contract === 2 ? '' : this.CooperationDetail.contract_uid;
        this.confirmcooperation_form.has_contract = this.CooperationDetail.has_contract;
        this.confirmcooperation_form.is_update = 1;
        this.confirmcooperation_form.sale_amount = this.CooperationDetail.sale_amount;
        this.confirmcooperation_form.is_gather = this.CooperationDetail.is_gather;
        this.confirmcooperation_form.gather_date =
          this.CooperationDetail.gather_date !== ''
            ? showProDateFormat(this.CooperationDetail.gather_date)
            : '';
      } else {
        this.confirmcooperation_form.contract_uid =
          this.CooperationDetail.has_contract === 2 ? '' : this.CooperationDetail.contract_uid;
        this.confirmcooperation_form.is_update = 0;
        this.confirmcooperation_form.gather_date = new Date(
          new Date().setDate(new Date().getDate() + 45),
        )
          .toLocaleDateString()
          .replace('/', '-')
          .replace('/', '-');
      }
      this.confirmcooperation_form.has_contract = this.CooperationDetail.has_contract;
      this.confirmcooperation_form.contract_id =
        this.CooperationDetail.has_contract === 2 ? '' : this.CooperationDetail.contract_id;
      this.confirmcooperation_form.cooperation_id = this.CooperationDetail.cooperation_id;
      this.visible = true;
      this.getCostContractUidSelect();
    },
    // 取消弹窗
    handledialogCancel() {
      this.$refs.confirmcooperation_form.resetFields();
      this.onClose();
    },
    //  partner_id: this.CustomerDetail.id
    // 获取当前安排的合同编号
    getCostContractUidSelect() {
      getCostContractUid({
        partner_type: 1,
      }).then(res => {
        this.contract_id_list = res.data.data.data.map(a => a.contract_uid);
        this.list = res.data.data.data;
      });
    },
    // 选择客户合同编号
    ContractTypeChange(val, _item) {
      if (val === 2) {
        this.confirmcooperation_form.contract_uid = '';
      }
    },
    // 选择供应商Id
    selectCostContractUid(val, confirmcooperation_form) {
      if (val) {
        confirmcooperation_form.has_contract = 1;
      }
      // console.log(this.list)
      for (let i = 0; i < this.list.length; i++) {
        if (val === this.list[i].contract_uid) {
          confirmcooperation_form.contract_id = this.list[i].contract_id;
        }
      }
    },
    // 弹窗提交操作
    handledialogSubmit() {
      if (
        (this.confirmcooperation_form.has_contract === 1 &&
          this.confirmcooperation_form.contract_uid) ||
        this.confirmcooperation_form.has_contract === 2
      ) {
        this.$refs.confirmcooperation_form.validate(pass => {
          if (pass) {
            const confirmcooperation_form = JSON.parse(
              JSON.stringify(this.confirmcooperation_form),
            );
            confirmCooperation(confirmcooperation_form)
              .then(res => {
                if (res.data.success) {
                  this.$message.success(res.data.message);
                  // 更新合作详情
                  this.GetCooperationDetail({
                    customer_id: this.CustomerDetail.id,
                    cooperation_id: this.CooperationDetail.cooperation_id,
                  });
                  // 更新合作详情状态
                  this.SetCooperationdetailStatus(2);
                  // 获取业绩记录
                  this.GetAchievementList({
                    cooperation_id: this.CooperationDetail.cooperation_id,
                    num: 10,
                    page_num: 1,
                  });
                  // 获取安排记录
                  this.GetCoostList({
                    cooperation_id: this.CooperationDetail.cooperation_id,
                    num: 10,
                    page_num: 1,
                  });
                  // this.visible = false;
                  this.onClose();
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch(err => {
                console.error(err);
              });
          }
        });
      } else {
        this.$message.error('请选择关联客户合同');
      }
    },
    onClose() {
      this.$emit('dialog:close');
    },
  },
};
</script>

<style lang="less" scoped>
.confirmcooperation-container {
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 130px;
  }
  /deep/ .no-contract {
    margin-left: 50px;
  }
  .form-block {
    .border-r-amount {
      /deep/ .el-input__inner {
        height: 32px;
      }
    }
    padding-right: 100px;

    .el-form-item {
      margin-bottom: 16px;
    }
  }
  .line {
    border: 1px solid #f5f5f5;
  }
  /deep/ .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
    span {
      font-size: 12px;
    }
  }
  /*打开时文字位置设置*/
  /deep/ .el-switch__label--right {
    z-index: 1;
    right: 21px;
    bottom: 1px;
  }
  /*关闭时文字位置设置*/
  /deep/ .el-switch__label--left {
    z-index: 1;
    left: 21px;
    bottom: 1px;
  }
  /*显示文字*/
  /deep/ .el-switch__label.is-active {
    display: block;
  }
  /deep/.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 60px !important;
  }
}
/deep/ .common-dialog .el-dialog__footer {
  padding-top: 13px;
  padding-bottom: 13px;
}
/deep/ .el-dialog__body {
  margin: 10px;
  background: #f2f6f9 !important;
}
.box1 {
  padding: 13px 0;
  background: #fff !important;
}
.box2 {
  background: #fff !important;
  padding-top: 20px;
  padding-bottom: 60px;
}
</style>
