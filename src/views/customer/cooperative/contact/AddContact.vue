<template>
  <el-dialog
    class="customer-dialog tg-dialog-vcenter"
    :visible.sync="visible"
    ref="AddChatRecordDialog"
    width="440px"
    hight="305px"
    :close-on-click-modal="false"
  >
    <template #title>
      <span style="margin-left: 4px">{{ is_create ? '新增联系人' : '编辑联系人' }}</span>
    </template>
    <el-alert
      :closable="false"
      style="padding: 10px 21px"
      title="该信息仅您和上级可见。"
      type="warning"
      show-icon
    >
    </el-alert>
    <div class="addchat-container">
      <el-form ref="add_contact_form" :model="add_contact_form" :rules="add_contact_rules">
        <el-form-item label="客户姓名" prop="customer_name">
          <el-input
            type="textarea"
            :rows="1"
            :maxlength="100"
            placeholder="请输入客户姓名"
            style="width: 392px"
            v-model="add_contact_form.customer_name"
          >
          </el-input>
        </el-form-item>
        <el-form-item class="with-small-tip" label="联系方式" prop="wechat">
          <div class="small-tip">（至少填写一项）</div>
          <div style="width: 400px">
            <el-input
              v-model="add_contact_form.mobile"
              placeholder="请输入手机号"
              @input.native="inputMobile"
              :maxlength="11"
              style="width: 193px"
            />
            <el-input
              v-model="add_contact_form.wechat"
              placeholder="请输入微信号"
              :maxlength="20"
              style="width: 193px; margin-left: 6px"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <tg-button @click="handledialogCancel">取消</tg-button>
      <tg-button type="primary" @click="handledialogSubmit">保存</tg-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { saveContact } from '@/api/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'AddChatRecord',
  mixins: [CooperativeStore],
  props: ['is_create'],
  data() {
    // 微信号自定义验证规则
    const validateWechat = (rule, value, callback) => {
      const { wechat, mobile } = this.add_contact_form;
      if (wechat === '' && mobile === '') {
        this.goTop();
        callback(new Error('手机号和微信号至少填写一个'));
      } else if (mobile !== '' && !/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(mobile)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    return {
      add_contact_form: {
        id: 0, // 联系人id
        customer_id: 0, // 客户ID
        customer_name: '', // 客户姓名
        mobile: '', // 手机号
        wechat: '', // 微信号
      },
      // 验证规则
      add_contact_rules: {
        customer_name: [
          { required: true, message: '客户姓名不能为空', trigger: 'blur' },
          { max: 20, message: '不能超过20个字', trigger: 'blur' },
        ],
        wechat: [{ required: true, validator: validateWechat, trigger: 'blur' }],
      },
      page: null,
      visible: false,
    };
  },
  methods: {
    ...mapActions({
      GetContact: 'cooperative/GetContact',
    }),
    // 显示
    show(contactrecord, page) {
      if (contactrecord) {
        // 修改
        this.title = '编辑联系人';
        this.add_contact_form = Object.assign(this.add_contact_form, contactrecord);
        if (page) this.page = page;
      } else {
        // 新增
        this.title = '新增联系人';
        this.resetForm();
      }
      this.visible = true;
    },
    // 弹窗取消操作
    handledialogCancel() {
      // this.$refs.add_contact_form.resetFields();
      this.visible = false;
    },
    resetForm() {
      if (this.$refs.add_contact_form) {
        this.$refs.add_contact_form.clearValidate();
      }
      this.add_contact_form.customer_id = 0;
      this.add_contact_form.id = 0;
      this.add_contact_form.customer_name = '';
      this.add_contact_form.mobile = '';
      this.add_contact_form.wechat = '';
    },
    // 弹窗确定操作
    async handledialogSubmit() {
      const result = await new Promise(resolve => {
        this.$refs.add_contact_form.validate(pass => {
          resolve(pass);
        });
      });
      if (!result) {
        return;
      }

      const { id, ...rest } = this.add_contact_form;

      const payload =
        id === 0
          ? {
              ...rest,
              customer_id: this.CustomerDetail.id,
            }
          : {
              id,
              ...rest,
              customer_id: this.CustomerDetail.id,
            };
      const res = await saveContact(payload);

      if (res.data.success) {
        this.$message.success(res.data.message);
        this.GetContact({
          customer_id: this.CustomerDetail.id,
          num: 100,
          page_num: 1,
        });

        this.resetForm();
        this.visible = false;
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>

<style lang="less">
.addchat-container {
  height: 175px;
  padding-top: 24px;
  .el-form {
    padding-left: 24px;
    padding-right: 24px;
    .el-form-item {
      margin-bottom: 18px;
      .el-form-item__content {
        input {
          height: 32px;
        }
        textarea {
          height: 32px;
        }
      }
      .el-form-item__label {
        width: 100%;
        text-align: left;
        height: 16px;
        font-size: 12px;
        color: #6a7b92;
        line-height: 16px;
        font-weight: 400;
      }
    }
  }
}
</style>
<style lang="less" scoped>
@import '~@/styles/utils/index.less';
.with-small-tip {
  position: static;
  .small-tip {
    position: absolute;
    left: 55px;
    width: 96px;
    height: 16px;
    font-size: 12px;
    color: #a4b2c2;
    line-height: 16px;
    font-weight: 400;
  }
}

.addchat-container {
  // .form-block {
  //   padding-right: 100px;
  //   padding-top: 10px;

  //   .el-form-item {
  //     margin-bottom: 16px;
  //   }
  // }
  /deep/ .el-dialog_body {
    .pd(10px 20px);
  }
}

// /deep/ .common-dialog .el-dialog__footer {
//   padding-top: 5px;
//   padding-bottom: 10px;
// }
</style>
