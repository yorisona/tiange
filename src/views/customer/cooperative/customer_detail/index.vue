<template>
  <div class="tg-page-container tg-customer-list-page" v-if="CustomerDetail !== null">
    <TgBreadcrumbs :routes="routes" class="flex-none">
      <span>{{ addByFormat(CustomerDetail) }}</span>
    </TgBreadcrumbs>
    <!-- [基础信息] -->
    <CustomerDetailBase
      class="flex-none"
      :customer="CustomerDetail"
      :editable="UserRoles.includes(RIGHT_CODE.update_customer)"
      :deletable="UserRoles.includes(RIGHT_CODE.del_customer)"
      @edit="editCustomer"
      @delete="delCustomer"
    />
    <!-- [洽谈记录] -->
    <!-- <CustomerDetailChatRecord
      class="flex-none mgt-10"
      @record:create="createRecord"
      @record:more="showMoreRecord"
    /> -->
    <!-- [合作列表] -->
    <!-- <CustomerCooperationList
      class="flex-auto"
      @cooperation:create="addCooperation"
      @cooperation:show="showCooperation"
    /> -->
    <!-- [客户联系人] -->
    <CustomerContactList
      class="flex-auto"
      @cooperation:create="addContact(true)"
      @cooperation:edit="addContact(false, $event)"
    />
    <!-- [编辑客户] -->
    <add-customer
      :visible="customerVisible"
      @close="close"
      @save="saveCustomer"
      :customer-form-edit="detailFormEdit"
      :id="id"
    />
    <!-- [新增洽谈] -->
    <!-- <AddChatRecord ref="AddChatRecord" /> -->
    <!-- [更多洽谈记录] -->
    <!-- <ChatRecordList ref="ChatRecordList" /> -->
    <!-- [新增合作] -->
    <!-- <AddCooperationDialog ref="addCooperation" /> -->
    <!-- [新增联系人] -->
    <AddContactDialog ref="addContact" :is_create="is_create" />
    <!-- [合作详情] -->
    <!-- <CooperationDetailMainDialog ref="cooperationDetailMainDialog" /> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { delCustomer } from '@/api/customer';
import { RIGHT_CODE } from '@/const/roleCode';
import { addDateFormat } from '@/utils/format';
// import CustomerCooperationList from './components/CustomerCooperationList.vue';
import addCustomer from '../../components/addCustomer';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
// import AddCooperationDialog from '../cooperation/AddCooperation.vue';
import AddContactDialog from '../contact/AddContact.vue';
// import CooperationDetailMainDialog from '../cooperation/CooperationDetailMain.vue';
import { parse } from '@/utils/func';
import CustomerDetailBase from '@/modules/customer/list/shop/detail/base';
// import CustomerDetailChatRecord from '@/modules/customer/list/shop/detail/chat_record';
// import AddChatRecord from '../chat_record/AddChatRecord';
// import ChatRecordList from '../chat_record/ChatRecordList.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
// import { RouterNameProjectManage } from '@/const/router';
import { RouterNameCustomer } from '@/const/router';

import CustomerContactList from './components/CustomerContactList.vue';

export default {
  name: 'CustomerDetail',
  components: {
    // CustomerCooperationList,
    addCustomer,
    // AddChatRecord,
    // ChatRecordList,
    // AddCooperationDialog,
    AddContactDialog,
    // CooperationDetailMainDialog,
    CustomerDetailBase,
    // CustomerDetailChatRecord,
    CustomerContactList,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      RIGHT_CODE,
      id: 0,
      detailFormEdit: null,
      customerVisible: false,
      is_create: true,
      routes: [
        {
          path: '/customer/shop',
          title: '店铺管理',
        },
        {
          path: '',
          title: '店铺详情',
        },
      ],
      disabled: false,
    };
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.initCustomerInfo(this.$route.params.id);
    } else {
      this.$router.back();
    }
  },
  methods: {
    toggledd() {
      this.disabled = !this.disabled;
    },
    ...mapActions({
      // GetConversation: 'cooperative/GetConversation',
      GetCooperation: 'cooperative/GetCooperation',
      GetContact: 'cooperative/GetContact',
    }),
    // 初始化客户相关信息
    initCustomerInfo(id) {
      // 初始化客户信息
      this.GetCustomerDetail(this.id);
      // 初始化客户洽谈记录
      // this.GetConversation({
      //   customer_id: id,
      //   num: 10,
      //   page_num: 1,
      // });
      // // 初始化客户合作记录
      // this.GetCooperation({
      //   customer_id: id,
      //   num: 10,
      //   page_num: 1,
      // });
      // 初始化客户联系人
      this.GetContact({
        customer_id: id,
        num: 100,
        page_num: 1,
      });
    },
    // 编辑客户
    editCustomer() {
      const detailForm = this.formatForm(parse(this.CustomerDetail));
      // 将部门id转化为字符串，编辑弹窗需要字符串类型的部门id
      detailForm.department += '';

      this.detailFormEdit = parse(detailForm);
      this.customerVisible = true;
    },
    // 删除客户
    async delCustomer() {
      const msg = '此操作将永久删除该数据, 是否继续？';
      const result = await AsyncConfirm({ root: this }, msg);

      if (result) {
        const params = {
          customer_id: this.id,
        };
        delCustomer(params).then(res => {
          if (res.data.success) {
            this.$message.success('删除成功');
            this.$router.push({
              name: RouterNameCustomer.shop,
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
      // });
    },
    // 格式化添加人信息
    addByFormat(customer) {
      return `录入人：${customer.add_by} ${addDateFormat(customer.gmt_create)}`;
    },
    // 格式化表单字段
    formatForm(form) {
      const { manager, manager_id, department, ...rest } = form;
      return {
        ...rest,
        // 店铺名
        shopName: form.shop_name,
        shopType: form.shop_type,
        // 客户类目
        category: form.category,
        // 公司名称
        companyName: form.company_name,
        companyType: form.company_type,
        // 客户姓名
        customerName: form.customer_name,
        // 客户阶段
        level: form.level,
        // 客户分类
        customerClass: form.customer_class || '',
        // 手机号
        mobile: form.mobile,
        // 微信号
        wechat: form.wechat,
        // 客户意向
        intention: form.intention,
        // 省市区列表
        cities: [],
        province: form.addr_province,
        city: form.addr_town,
        county: form.addr_county,
        addrDetail: form.addr_detail,
        // ----------跟进人---------------
        // 客户经理
        manager: {
          username: manager,
          id: manager_id,
          department,
          department_str: '',
        },
        // managerId: form.manager_id,
        // 部门
        department: form.department || '',
        // ----------财务信息---------------
        // 公司开票抬头
        invoiceTitle: form.invoice_title,
        // 地址
        invoiceAddr: form.invoice_addr,
        // 纳税人识别号
        invoiceNumber: form.invoice_number,
        // 账号
        invoiceAccount: form.invoice_account,
        // 开户行
        invoiceBank: form.invoice_bank,
        // 电话号码
        invoicePhone: form.invoice_phone,
        coopAe: form.coop_ae,
        managerName: form.manager_name,
      };
    },
    // 关闭弹窗
    close() {
      this.detailForm = this.detailFormBak;
      this.customerVisible = false;
    },
    // 保存客户
    saveCustomer(_form) {
      this.$message.success('保存成功');
      this.customerVisible = false;
      this.GetCustomerDetail(this.id);
    },
    // 新增洽谈
    createRecord() {
      this.$refs.AddChatRecord.show();
    },
    // 查看更多洽谈记录
    showMoreRecord() {
      this.$refs.ChatRecordList.show();
    },
    // 新增合作
    addCooperation() {
      this.$refs.addCooperation.show();
    },
    // 新增联系人
    addContact(created, row) {
      let new_row = {};
      if (created) {
        this.is_create = true;
        this.$refs.addContact.show();
      } else {
        this.is_create = false;
        new_row = {
          customer_id: row['customer_id'],
          customer_name: row['customer_name'],
          mobile: row['mobile'],
          wechat: row['wechat'],
          id: row['id'],
        };
        this.$refs.addContact.show(new_row);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.box1 {
  background: #f2f6f9;
}
</style>

<style lang="less">
@import '~@/modules/customer/list/shop/detail/base.less';
@import '~@/modules/customer/list/shop/detail/chat_record.less';
</style>
