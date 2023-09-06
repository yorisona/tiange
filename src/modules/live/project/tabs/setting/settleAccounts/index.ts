import { defineComponent, ref } from '@vue/composition-api';
import {
  GetShopLiveAuthStatus,
  GetShopLiveSettingList,
  PostSaveLiveSetting,
} from '@/services/live.project';
import { useRouter } from '@/use/vue-router';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';

export default defineComponent({
  name: 'TgTabSetting',
  components: {},
  setup(props, ctx) {
    const DataForm = ref<any>({
      commission_rate: '',
      service_amount: '',
      settlement_day: '',
      is_enable: 0,
      price_per_hour: '',
    });
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const getSettingDeatil = () => {
      GetShopLiveSettingList(project_id).then(({ data }) => {
        if (data.success && data.data) {
          DataForm.value = {
            commission_rate:
              data.data.commission_rate || data.data.commission_rate === 0
                ? data.data.commission_rate
                : '',
            service_amount:
              data.data.service_amount || data.data.service_amount === 0
                ? data.data.service_amount
                : '',
            price_per_hour:
              data.data.price_per_hour || data.data.price_per_hour === 0
                ? data.data.price_per_hour
                : '',
            settlement_day: data.data.settlement_day || '',
            is_enable: data.data.is_enable || data.data.is_enable === 1 ? 1 : 0,
          };
        }
      });
    };
    getSettingDeatil();
    const onSaveClick = () => {
      // if (DataForm.value.is_enable === 1 && !DataForm.value.price_per_hour) {
      //   ctx.root.$message.warning('请填写小时报价！');
      //   return;
      // }
      // if (DataForm.value.is_enable === 1 && !DataForm.value.service_amount) {
      //   ctx.root.$message.warning('请填写服务费！');
      //   return;
      // }
      if (String(DataForm.value.service_amount) !== '0' && !DataForm.value.service_amount) {
        console.log(DataForm.value.service_amount);
        ctx.root.$message.warning('请填写服务费！');
        return;
      }
      if (!DataForm.value.commission_rate) {
        ctx.root.$message.warning('请填写佣金比例！');
        return;
      }
      if (DataForm.value.is_enable === 1) {
        if (is_shop_auth === 0 || is_shop_auth === false) {
          getProjectuthStatus(true);
          return;
        }
      }
      submit();
    };
    const submit = () => {
      PostSaveLiveSetting({ project_id: project_id, ...DataForm.value }).then(({ data }) => {
        if (data.success) {
          //通知刷新数据
          ctx.emit('editProjectReload');
          ctx.root.$message.success(data.message);
        } else {
          ctx.root.$message.error(data.message ?? '保存结算设置失败');
        }
      });
    };
    const SaleAmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.service_amount = result;
    };
    const PriceHourAmountInput = (value: string) => {
      const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];

      DataForm.value.price_per_hour = result;
    };
    const getPositiveRateNumber = (value: string) => {
      return (/100(?:\.0{0,2})?|(?:[1-9]?\d)(?:\.\d{0,2})?/u.exec(
        value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
      ) ?? [''])[0];
    };
    const CommissionRateInput = (value: string) => {
      const result = getPositiveRateNumber(value);
      DataForm.value.commission_rate = String(result);
    };
    let is_shop_auth: any = false;
    const getProjectuthStatus = (issumit = false) => {
      GetShopLiveAuthStatus(project_id).then(({ data }) => {
        if (data.success && data.data) {
          is_shop_auth = data.data.is_shop_auth || false;
          if (issumit) {
            if (is_shop_auth === 1 || is_shop_auth === true) {
              submit();
            } else {
              ctx.root.$message.error('商家暂未授权，请先去项目信息中商家授权');
            }
          }
        } else {
          if (issumit) {
            ctx.root.$message.error(data.message ?? '保存失败，请重新保存！');
          }
        }
      });
    };
    getProjectuthStatus(false);
    /** 表单校验规则 */
    const FormRules = ref({
      commission_rate: [{ required: true, message: '请输入佣金比例', trigger: ['blur', 'change'] }],
      service_amount: [{ required: true, message: '请输入服务费', trigger: ['blur', 'change'] }],
    });
    return {
      FormRules,
      CommissionRateInput,
      SaleAmountInput,
      PriceHourAmountInput,
      onSaveClick,
      getSettingDeatil,
      DataForm,
      costOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
  },
});
