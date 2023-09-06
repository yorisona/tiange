import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import { getPositiveNumber } from '@/utils/string';
import { CommonBusinessProjectBase } from '@/types/tiange/commonBusiness/project';

const { debounce } = lodash;

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '日报详情',
    },
    data: {
      type: Object as PropType<CommonBusinessProjectBase>,
    },
  },
  setup: function (props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const baseForm = ref<CommonBusinessProjectBase>({
      live_duration: '',
      new_fans_count: '',
      max_uv: '',
      avg_stay: '',
      gmv: '',
      net_sales_rate: '',
      net_sales_amount: '',
      promote_amount: '',
      roi: '',
      commission_rate: '',
      commission_amount: '',
      income_amount: '',
      ...props.data,
    });

    const net_sales_amount = computed(() => {
      const gmv: any = baseForm.value.gmv;
      const net_sales_rate: any = baseForm.value.net_sales_rate;
      const amount = gmv * (net_sales_rate / 100);
      if (Number.isNaN(amount)) return '--';
      const amountString = amount
        .toFixed(2)
        .replace(/\.0+$/g, '')
        .replace(/(\.[^0]+)(0+)$/g, '$1');
      return amountString;
    });

    const commission_amount = computed(() => {
      const gmv: any = baseForm.value.gmv;
      const net_sales_rate: any = baseForm.value.net_sales_rate;
      const bAmount = gmv * (net_sales_rate / 100);
      if (Number.isNaN(bAmount)) return '--';
      const commission_rate: any = baseForm.value.commission_rate;
      const amount = bAmount * (commission_rate / 100);
      if (Number.isNaN(amount)) return '--';
      const amountString = amount
        .toFixed(2)
        .replace(/\.0+$/g, '')
        .replace(/(\.[^0]+)(0+)$/g, '$1');
      return amountString;
    });

    const onCloseBtnClick = () => {
      ctx.emit('dialog:close');
      ctx.root.$nextTick(resetForm);
    };
    /** 重置表单 */
    const resetForm = () => {
      baseForm.value.live_duration = '';
      baseForm.value.new_fans_count = '';
      baseForm.value.max_uv = '';
      baseForm.value.avg_stay = '';
      baseForm.value.gmv = '';
      baseForm.value.net_sales_rate = '';
      baseForm.value.net_sales_amount = '';
      baseForm.value.promote_amount = '';
      baseForm.value.roi = '';
      baseForm.value.commission_rate = '';
      baseForm.value.commission_amount = '';
      baseForm.value.income_amount = '';
    };

    /** 点击保存 */
    const submit = () => {
      const payload: CommonBusinessProjectBase = {
        ...baseForm.value,
      };
      ctx.emit('saveSubmit', payload);
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);

    const inputAmount = (
      key:
        | 'live_duration'
        | 'gmv'
        | 'net_sales_rate'
        | 'net_sales_amount'
        | 'promote_amount'
        | 'roi'
        | 'commission_rate'
        | 'commission_amount'
        | 'income_amount',
      value: string,
    ) => {
      baseForm.value[key] = getPositiveNumber(value);
    };

    const inputInteger = (key: 'new_fans_count' | 'max_uv' | 'avg_stay', value: string) => {
      baseForm.value[key] = value.replace(/[^\d]/g, '');
    };

    return {
      commission_amount,
      net_sales_amount,
      onCloseBtnClick,
      onSaveBtnClick,
      baseForm,
      formRef,
      inputAmount,
      inputInteger,
    };
  },
});
