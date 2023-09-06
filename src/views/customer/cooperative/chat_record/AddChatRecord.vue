<template>
  <el-dialog
    class="customer-dialog tg-dialog-vcenter"
    :visible.sync="visible"
    ref="AddChatRecordDialog"
    width="500px"
    :close-on-click-modal="false"
  >
    <template #title>
      <span>{{ title }}</span>
    </template>
    <div class="addchat-container">
      <el-form
        ref="add_chat_record_form"
        :model="add_chat_record_form"
        :rules="add_chat_record_rules"
        label-width="130px"
      >
        <el-form-item label="店铺名称：">
          <span>{{ CustomerDetail.shop_name || '--' }}</span>
        </el-form-item>
        <el-form-item label="洽谈时间：" prop="conversation_date">
          <el-date-picker
            size="small"
            placeholder="请选择洽谈时间"
            style="width: 260px"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model="add_chat_record_form.conversation_date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="洽谈内容：" prop="conversation_content">
          <el-input
            type="textarea"
            :rows="4"
            :maxlength="200"
            placeholder="请输入洽谈内容"
            style="width: 260px"
            v-model="add_chat_record_form.conversation_content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="备 注：" prop="note">
          <el-input
            type="textarea"
            :rows="2"
            :maxlength="100"
            placeholder="请输入备注"
            style="width: 260px"
            v-model="add_chat_record_form.note"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="跟进人：">
          <span>{{ UserInfo ? UserInfo.username : '--' }}</span>
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
import { saveConversation } from '@/api/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'AddChatRecord',
  mixins: [CooperativeStore],
  data() {
    return {
      title: '',
      add_chat_record_form: {
        customer_id: 0, // 客户ID
        conversation_id: 0, // 洽谈ID
        conversation_date: '2019/11/12', // 洽谈时间
        conversation_content: '', // 洽谈内容
        note: '', // 备注
      },
      // 验证规则
      add_chat_record_rules: {
        conversation_date: [{ required: true, message: '洽谈时间不能为空', trigger: 'blur' }],
      },
      page: null,
      visible: false,
    };
  },
  methods: {
    ...mapActions({
      GetConversation: 'cooperative/GetConversation',
    }),
    // 显示
    show(chatrecord, page) {
      if (chatrecord) {
        console.log({ ...chatrecord });
        // 修改
        this.title = '修改洽谈记录';
        this.add_chat_record_form = Object.assign(this.add_chat_record_form, chatrecord);
        if (page) this.page = page;
      } else {
        // 新增
        this.title = '新增洽谈记录';
        this.add_chat_record_form.conversation_date = new Date()
          .toLocaleDateString()
          .replace('/', '-')
          .replace('/', '-');
      }
      // this.$refs.AddChatRecordDialog.dialogOpen();
      this.visible = true;
    },
    // 弹窗取消操作
    handledialogCancel() {
      this.$refs.add_chat_record_form.resetFields();
      this.visible = false;
    },
    resetForm() {
      this.add_chat_record_form.customer_id = 0;
      this.add_chat_record_form.conversation_id = 0;
      this.add_chat_record_form.conversation_date = '2019/11/12';
      this.add_chat_record_form.conversation_content = '';
      this.add_chat_record_form.note = '';
    },
    // 弹窗确定操作
    async handledialogSubmit() {
      const result = await new Promise(resolve => {
        this.$refs.add_chat_record_form.validate(pass => {
          resolve(pass);
        });
      });
      if (!result) {
        return;
      }

      const { conversation_id, ...rest } = this.add_chat_record_form;

      const payload =
        conversation_id === 0
          ? {
              ...rest,
              customer_id: this.CustomerDetail.id,
            }
          : {
              conversation_id,
              ...rest,
              customer_id: this.CustomerDetail.id,
            };

      const res = await saveConversation(payload);

      if (res.data.success) {
        this.$message.success(res.data.message);
        if (!payload?.conversation_id) {
          // 新增
          // 添加洽谈记录
          this.GetConversation({
            customer_id: this.CustomerDetail.id,
            num: 10,
            page_num: 1,
          });
        } else {
          // 修改
          // 更新洽谈记录
          this.GetConversation({
            customer_id: this.CustomerDetail.id,
            num: this.page.pageSize,
            page_num: this.page.currentPage,
          });
        }

        this.resetForm();
        this.visible = false;
      } else {
        this.$message.error(res.data.message);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@/styles/utils/index.less';

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
