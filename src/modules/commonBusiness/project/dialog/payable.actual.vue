<template>
  <div class="tg-common-business-payable-actual-dialog tg-dialog-vcenter">
    <el-dialog
      class="tg-dialog-classic"
      :visible="visible"
      width="440px"
      top="119px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      @close="handleCloseAction"
    >
      <template #title>{{ title }}</template>
      <el-form ref="formRef" :model="form" label-position="top" size="mini" label-width="106px">
        <el-form-item
          label="打款金额："
          size="medium"
          prop="pay_amount"
          :rules="{
            required: true,
            validator: (rule, val, callback) => {
              if (val === '' || val === undefined) {
                callback(new Error('请输入打款金额'));
              } else if (Number(val) === 0) {
                callback(new Error('费用金额必须大于0'));
              } else {
                callback();
              }
            },
            trigger: ['blur'],
          }"
        >
          <el-input
            maxlength="18"
            placeholder="请输入打款金额"
            v-model="form.pay_amount"
            @input="value => inputAmount('pay_amount', value)"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="用款日期："
          size="medium"
          :rules="{ required: true, message: '请选择用款日期', trigger: 'change' }"
          prop="transfer_date"
        >
          <el-date-picker
            v-model="form.transfer_date"
            type="date"
            placeholder="请选择用款日期"
            :editable="false"
            format="yyyy.MM.dd"
            value-format="yyyy.MM.dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="收款方："
          size="medium"
          maxlength="20"
          prop="pay_way_detail.name"
          :rules="{ required: true, message: '请输入收款方', trigger: 'blur' }"
        >
          <el-input maxlength="20" placeholder="请输入收款方" v-model="form.pay_way_detail.name">
          </el-input>
        </el-form-item>
        <el-form-item
          label="付款方式："
          size="medium"
          prop="pay_way"
          :rules="{ required: true, message: '请选择付款方式', trigger: 'blur' }"
        >
          <el-radio-group v-model="form.pay_way">
            <el-radio :label="1">对公银行</el-radio>
            <el-radio :label="4">支付宝</el-radio>
            <el-radio :label="2">V任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="付款事由："
          size="medium"
          prop="pay_reason"
          :rules="{ required: true, message: '请输入付款事由', trigger: 'blur' }"
        >
          <el-input
            type="textarea"
            placeholder="请输入付款事由"
            v-model="form.pay_reason"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./payable.actual.ts"></script>

<style lang="less">
.tg-common-business-payable-actual-dialog {
  .el-form {
    margin-top: 4px;
    padding: 20px 24px 0 24px;
    /*padding: 29px 24px 0px;*/
    .el-form-item {
      margin-bottom: 23px;
    }
    .el-form-item__label {
      line-height: 0;
      margin-bottom: 7px;
      color: #6a7b92;
      font-size: 12px;
    }
    .el-date-editor {
      display: block;
      width: 100%;
    }
    .el-textarea {
      height: 108px;
      .el-textarea__inner {
        height: 108px;
      }
    }
  }
}
</style>
