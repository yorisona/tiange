<template>
  <div class="tg-sales-dialog-add-page tg-dialog-vcenter">
    <el-drawer
      :title="title"
      class="tg-dialog-classic"
      :visible="true"
      :wrapperClosable="false"
      @close="handleCloseAction"
    >
      <div class="ta-sales-content">
        <el-form
          label-position="top"
          ref="formAddRef"
          :model="formAdd"
          :rules="formRules"
          size="small"
          label-width="106px"
        >
          <div class="tg-dialog-section-title"><span></span>跟进信息</div>

          <el-form-item label="客户名称" size="small" prop="customer_name" class="one-item">
            <el-select
              v-model="formAdd.customer_name"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入并选择客户名称"
              :remote-method="getCustomerList"
              @focus="handleCustomerFocus"
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.shop_name"
                :value="item.id"
              >
                <span>{{ item.shop_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型" size="small" prop="business_type">
            <el-radio-group
              v-model="formAdd.business_type"
              style="margin-top: 12px; margin-left: 12px"
              @change="handleBusinessTypeChange"
            >
              <el-radio :label="1">营销业务</el-radio>
              <el-radio :label="3">抖音店播</el-radio>
              <el-radio :label="2">淘宝店播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="合作类型"
            size="small"
            prop="cooperation_type"
            style="padding: 18px; background-color: rgba(164, 178, 194, 0.09)"
            v-if="cooperation_type_show"
          >
            <el-checkbox-group v-model="formAdd.cooperation_type">
              <el-checkbox label="1" style="margin: 0 12px">直播</el-checkbox>
              <el-checkbox label="2" style="margin: 0 12px">视频</el-checkbox>
              <el-checkbox label="3" style="margin: 0 12px">图文</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="客户意向" size="small" prop="customer_intention">
            <el-select v-model="formAdd.customer_intention">
              <el-option :value="1" label="标三">标三</el-option>
              <el-option :value="2" label="方案">方案</el-option>
              <el-option :value="3" label="重点">重点</el-option>
              <el-option :value="4" label="预测">预测</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" size="small" prop="contact" class="two-item-left">
            <el-input v-model.trim="formAdd.contact" placeholder="请输入联系人姓名" clearable />
          </el-form-item>
          <el-form-item size="small" prop="wechat" class="two-item-right">
            <label slot="label">
              <span>联系方式</span>
              <span style="color: #a4b2c2">（至少一项）</span>
            </label>
            <el-input
              v-model.trim="formAdd.phone"
              placeholder="请输入手机号"
              clearable
              maxlength="11"
              size="small"
              style="width: 131px"
            />
            <el-input
              v-model.trim="formAdd.wechat"
              placeholder="请输入微信号"
              clearable
              size="small"
              maxlength="20"
              style="width: 130px; margin-left: 6px"
            />
          </el-form-item>
          <el-form-item label="预估金额：" size="small" class="two-item-left">
            <el-input
              v-model.trim="formAdd.estimate_money"
              oninput="value=value.replace(/[^\d.]/g,'')"
              @input="inputLoanAmountCost(index, $event)"
              placeholder="请输入预估金额"
              clearable
            />
          </el-form-item>
          <el-form-item label="预估到账：" size="small" class="two-item-right">
            <el-date-picker
              v-model="formAdd.estimate_time"
              type="date"
              value-format="yyyy.MM.dd"
              format="yyyy.MM.dd"
              placeholder="请选择预估到账日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：" size="small">
            <el-input
              clearable
              maxlength="100"
              show-word-limit
              type="textarea"
              v-model="formAdd.remark"
              placeholder="请输入文本"
              :rows="4"
            />
          </el-form-item>
          <div class="tg-dialog-section-title"><span></span>跟进记录</div>

          <el-form-item label="跟进时间：" size="small" prop="follow_time" class="two-item-left">
            <el-date-picker
              v-model="formAdd.follow_time"
              value-format="yyyy.MM.dd"
              format="yyyy.MM.dd"
              type="date"
              :picker-options="pickerOptions1"
              placeholder="请选择跟进时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="下次跟进：" size="small" class="two-item-right">
            <el-date-picker
              v-model="formAdd.next_time"
              value-format="yyyy.MM.dd"
              format="yyyy.MM.dd"
              type="date"
              :picker-options="pickerOptions2"
              placeholder="请选择下次跟进时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户情况：" size="small" prop="customer_info">
            <el-input
              clearable
              maxlength="200"
              show-word-limit
              type="textarea"
              v-model="formAdd.customer_info"
              placeholder="请输入文本"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="客户经理" size="small" class="two-item-left">
            <el-input :value="customer_manager" disabled />
          </el-form-item>
        </el-form>
        <div class="sales-add-footer">
          <tg-button size="small" @click="handleCloseAction">取消</tg-button>
          <tg-button size="small" type="primary" @click="handleSaveAction('formAddRef')">
            保存
          </tg-button>
        </div>
      </div>
    </el-drawer>
    <!--    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />-->
  </div>
</template>

<script>
import { GetCustomerList } from '@/api/sales.follow.detail';
import { AddFollowTask } from '@/api/sales.follow.add';
import { ObjectFilterEmpty } from '@/utils/func';

const day = new Date();
day.setTime(day.getTime());
const today = day.getFullYear() + '.' + (day.getMonth() + 1) + '.' + day.getDate();

export default {
  name: 'FollowAdd',
  props: {
    formAdd: {
      type: Object,
      default() {
        return {
          customer_uid: '',
          customer_name: '',
          contact: '',
          remark: '',
          estimate_money: '',
          business_type: 1,
          cooperation_type: [],
          customer_intention: 1,
          estimate_time: '',
          phone: '',
          wechat: '',
          follow_time: today,
          next_time: '',
          customer_info: '',
        };
      },
    },
  },
  data() {
    const validateWechat = (rule, value, callback) => {
      const { wechat, phone } = this.formAdd;
      if (wechat === '' && phone === '') {
        callback(new Error('手机号和微信号至少填写一个'));
      } else if (wechat !== '' && phone !== '' && !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
        callback(new Error('请输入正确的手机号'));
      } else if (phone !== '' && !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone) && wechat === '') {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };

    const validateMarketingCooperationType = (rule, value, callback) => {
      const { business_type, cooperation_type } = this.formAdd;
      if (business_type === 1 && cooperation_type.length === 0) {
        callback(new Error('请选择合作类型'));
      }
      callback();
    };

    const checkContact = (rule, value, callbacks) => {
      if (!value) {
        callbacks(new Error('请输入联系人姓名'));
      }
      if (value.length > 30) {
        callbacks(new Error('联系人姓名少于30个字'));
      } else {
        callbacks();
      }
    };

    return {
      cooperation_type_show: true,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now(); //当天之前的时间可选（包括当天）
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //当天之后的时间可选
        },
      },
      title: '新增跟进任务',
      formRules: {
        customer_name: { required: true, message: '请输入客户名称', trigger: ['blur', 'change'] },
        contact: { required: true, validator: checkContact, trigger: ['change', 'blur'] },
        business_type: { required: true, message: '请选择业务类型', trigger: 'change' },
        customer_intention: { required: true, message: '请选择客户意向', trigger: 'change' },
        follow_time: { required: true, message: '请选择跟进时间', trigger: ['change', 'blur'] },
        customer_info: { required: true, message: '请输入客户情况', trigger: ['change', 'blur'] },
        wechat: [{ required: true, validator: validateWechat, trigger: 'blur' }],
        cooperation_type: [
          { required: true, validator: validateMarketingCooperationType, trigger: 'change' },
        ],
      },
      customerList: [],
    };
  },
  computed: {
    customer_manager() {
      const vuexData = localStorage.getItem('vuex');
      return JSON.parse(vuexData).user.userinfo.username;
    },
  },
  methods: {
    handleBusinessTypeChange(businessType) {
      this.cooperation_type_show = businessType === 1;
    },

    inputLoanAmountCost(index, value) {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      this.formAdd.estimate_money = result[0];
    },
    async getCustomerList(query) {
      const res = await GetCustomerList({ shop_name: query });
      if (res.data.success) {
        this.customerList = res.data.data;
      } else {
        this.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    },

    handleCustomerFocus() {
      if (!this.formAdd.customer_uid) {
        this.customerList = [];
      }
    },

    handleCloseAction() {
      this.$emit('closeAction');
    },
    handleSaveAction(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = this.formAdd;
          params.estimate_money = this.formAdd.estimate_money
            ? parseFloat((this.formAdd.estimate_money * 100).toFixed(10))
            : '';
          params.customer_uid = this.formAdd.customer_name;
          const query = JSON.parse(JSON.stringify(params));
          delete query.customer_name;
          const res = await AddFollowTask({ ...ObjectFilterEmpty(query) });
          if (res.data.success) {
            this.$emit('succeed');
            this.$message({
              type: 'success',
              message: '添加成功！',
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="less">
.tg-sales-dialog-add-page {
  .el-checkbox__input + .el-checkbox__label {
    color: var(--text-color);
    font-weight: 400;
  }

  .el-radio__input + .el-radio__label {
    color: var(--text-color);
    font-weight: 400;
  }

  .el-drawer {
    width: 612px !important;

    .sales-add-footer {
      background: #f4f8ff;
      height: 50px;
      line-height: 50px;
      display: grid;
      grid-template-columns: repeat(2, auto);
      align-content: center;
      justify-content: end;
      column-gap: 18px;
      padding: 24px;

      .tg-btn {
        height: 32px;
        justify-content: center;
      }
    }
  }

  .tg-dialog-section-title {
    height: 40px;
    font-size: 14px;
    font-weight: 600;
    line-height: 40px;
    color: var(--text-color);
    position: relative;

    & > span {
      position: absolute;
      display: inline-block;
      width: 3px;
      height: 14px;
      background: rgba(var(--theme-rgb-color), 0.8);
      left: -9px;
      top: 12.5px;
      border-radius: 1px;
    }
  }

  .ta-sales-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: visible;
  }

  .el-form {
    flex: 1;
    padding: 18px 24px 12px 30px;
    overflow-y: auto;

    .el-form-item {
      margin-bottom: 12px;

      .el-form-item__label {
        padding: 0;
        line-height: 28px;
        font-size: 12px;
        color: var(--text-second-color);
      }

      .el-date-editor {
        width: 100%;
      }

      .el-select {
        display: block;
      }
    }

    .date-picker-item {
      display: inline-block;
    }

    .time-picker-item {
      display: inline-block;
    }

    .remark-input {
      .el-textarea__inner {
        height: 94px;
      }
    }

    .el-input-group__append {
      padding: 0 10px;
      background-color: #f6f6f6;
      color: var(--text-third-color);
    }

    .selection-target-sub-title {
      height: 18px;
      line-height: 18px;
      margin: 6px 0 4px 0;

      span {
        font-size: 12px;
        color: var(--tip-icon-color);
      }

      div {
        border-top: 1px dashed rgba(var(--tip-icon-rgb-color), 0.3);
        height: 1px;
        overflow: hidden;
        display: inline-block;
        width: 510px;
        margin-left: 6px;
        margin-bottom: 4px;
      }
    }
  }

  .one-item {
    display: block;
    width: 552px;
  }

  .two-item-left {
    display: inline-block;
    width: 267px;
    margin-right: 18px;
  }

  .two-item-right {
    display: inline-block;
    width: 267px;
    margin-right: 0;
  }

  .three-item {
    .el-form-item {
      display: inline-block;
      margin-right: 18px;
      width: 172px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  .four-item {
    .el-form-item {
      display: inline-block;

      &:nth-of-type(1) {
        margin-right: 6px;
        width: 141px;
      }

      &:nth-of-type(3) {
        margin-right: 6px;
        width: 141px;
      }

      &:nth-of-type(2) {
        margin-right: 18px;
        width: 120px;
      }

      &:last-of-type {
        margin-right: 0;
        width: 120px;
      }

      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  .mgb-18 {
    margin-bottom: 18px !important;
  }
}
</style>
