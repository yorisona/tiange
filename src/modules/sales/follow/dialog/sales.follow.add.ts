import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { CustomerAddForm, SalesFollowAddCustomer } from '@/types/tiange/sales.follow';
import { GetCustomerList } from '@/services/sales.follow';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '新增跟进任务',
    },
  },

  setup(props, ctx) {
    // 保存 加载状态
    const saveLoading = ref<boolean>(false);
    const formRef = ref<ElForm | undefined>(undefined);
    const vuexData = localStorage.getItem('vuex');
    const username = JSON.parse(vuexData as string).user.userinfo.username;
    const form = ref<CustomerAddForm>({
      customer_uid: '',
      customer_name: '',
      contact_name: '',
      remark: '',
      estimate_money: '',
      business_type: 1,
      customer_intention: 1,
      estimate_time: '',
      phone: '',
      wechat: '',
      follow_time: '',
      next_time: '',
      customer_info: '',
      customer_manager: username,
    });

    const validatePerson = (rule: any, value: any, callback: any) => {
      if (form.value.phone === '' && form.value.wechat === '') {
        callback(new Error('请输入联系方式'));
      } else {
        callback();
      }
    };

    // 客户名称列表
    const customerList = ref<SalesFollowAddCustomer[]>([]);
    // 校验规则
    const formRules = ref({
      customer_uid: { required: true, message: '请输入客户名称', trigger: ['blur', 'change'] },
      contact_name: { required: true, message: '请输入联系人姓名', trigger: ['change', 'blur'] },
      business_type: { required: true, message: '请选择业务类型', trigger: 'change' },
      customer_intention: { required: true, message: '请选择客户意向', trigger: 'change' },
      validate_person: [{ required: true, validator: validatePerson, trigger: 'blur' }],
      follow_time: { required: true, message: '请选择跟进时间', trigger: ['change', 'blur'] },
      customer_info: { required: true, message: '请输入客户情况', trigger: ['change', 'blur'] },
    });

    // 搜索获取客户名称列表
    async function sendGetCustomerListRequest(query: string) {
      if (query === '') {
        customerList.value = [];
        return;
      }
      const { data: response } = await GetCustomerList(query);
      if (response.success) {
        customerList.value = response.data.data;
      }
    }

    const handleCustomerFocus = () => {
      if (!form.value.customer_uid) {
        customerList.value = [];
      }
    };

    // 处理关闭事件
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    // 处理保存事件
    const handleSaveAction = () => {
      formRef.value?.validate((valid: boolean) => {
        if (valid) {
          //
        }
      });
    };

    return {
      formRef,
      form,
      handleCloseAction,
      handleSaveAction,
      sendGetCustomerListRequest,
      handleCustomerFocus,
      formRules,
      customerList,
      saveLoading,
    };
  },
});
