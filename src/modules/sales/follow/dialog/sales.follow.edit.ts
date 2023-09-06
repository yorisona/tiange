import { defineComponent, PropType, ref, toRefs } from '@vue/composition-api';
import {
  SalesFollowDetailEditForm,
  SalesFollowDetailFields,
} from '@/types/tiange/sales/salesFollow';
import { EditFollow, GetCustomerList } from '@/api/sales.follow.detail';
import { ObjectFilterEmpty } from '@/utils/func';
import { ElForm } from 'element-ui/types/form';

export default defineComponent({
  name: 'SalesFollowEditDialog',
  props: {
    salesFollowDetail: {
      type: Object as PropType<SalesFollowDetailFields>,
      required: true,
    },
    dialogVisible: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, ctx) {
    const { salesFollowDetail } = toRefs(props);
    const handleEditCloseAction = () => {
      ctx.emit('edit-close');
    };

    const validateWechat = (rule: any, value: any, callback: any) => {
      const { wechat, phone } = salesFollowDetail.value;
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

    const validateMarketingCooperationType = (rule: any, value: any, callback: any) => {
      const { business_type, cooperation_type } = salesFollowDetail.value;
      if (business_type === 1 && cooperation_type.length === 0) {
        callback(new Error('请选择合作类型'));
      }
      callback();
    };

    const checkContact = (rule: any, value: any, callbacks: any) => {
      if (!value) {
        callbacks(new Error('请输入联系人姓名'));
      }
      if (value.length > 30) {
        callbacks(new Error('联系人姓名少于30个字'));
      } else {
        callbacks();
      }
    };
    const salesFollowDetailRules = {
      customer_name: { required: true, message: '请输入客户名称', trigger: ['blur', 'change'] },
      business_type: { required: true, message: '请选择业务类型', trigger: 'change' },
      customer_intention: { required: true, message: '请选择客户意向', trigger: 'change' },
      contact_name: { required: true, validator: checkContact, trigger: ['change', 'blur'] },
      wechat: [{ required: true, validator: validateWechat, trigger: 'blur' }],
      cooperation_type: [
        { required: true, validator: validateMarketingCooperationType, trigger: 'change' },
      ],
    };

    const customerList = ref([]);

    const handleCustomerFocus = () => {
      if (salesFollowDetail.value.customer_uid) {
        customerList.value = [];
      }
    };

    const onCustomerNameChange = (customer_uid: number) => {
      salesFollowDetail.value.customer_uid = customer_uid + '';
    };

    const getCustomerList = async (query: string) => {
      const res = await GetCustomerList({ shop_name: query });
      if (res.data.success) {
        customerList.value = res.data.data;
      } else {
        ctx.root.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    };
    const formRef = ref<ElForm | null>(null);

    const handleEditSaveAction = async () => {
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }

      const payload: SalesFollowDetailEditForm = {
        mission_id: parseInt(ctx.root.$route.params.id, 10),
        customer_uid: salesFollowDetail.value.customer_uid,
        business_type: salesFollowDetail.value.business_type,
        cooperation_type: salesFollowDetail.value.cooperation_type,
        contact: salesFollowDetail.value.contact_name,
        customer_intention: salesFollowDetail.value.customer_intention,
        phone: salesFollowDetail.value.phone,
        wechat: salesFollowDetail.value.wechat,
        estimate_money: salesFollowDetail.value.estimate_money
          ? parseFloat((salesFollowDetail.value.estimate_money * 100).toFixed(10))
          : '',
        estimate_time: salesFollowDetail.value.estimate_time,
        remark: salesFollowDetail.value.remark,
      };

      const res = await EditFollow({ ...ObjectFilterEmpty(payload) });
      if (res.data.success) {
        ctx.emit('edit-detail-success');
        ctx.root.$message({
          type: 'success',
          message: '编辑成功！',
        });
      } else {
        ctx.root.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    };

    return {
      formRef,
      onCustomerNameChange,
      handleEditCloseAction,
      handleEditSaveAction,
      handleCustomerFocus,
      getCustomerList,
      salesFollowDetailRules,
      customerList,
    };
  },
});
