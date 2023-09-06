import { defineComponent, PropType, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import type { CommonBusinessProjectMarket } from '@/types/tiange/commonBusiness/project';
import moment from 'moment';
import limit from '@/utils/inputLimit';

const { debounce } = lodash;

interface ICommissionRate {
  month: string;
  net_sales_rate: string;
}

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
      type: Object as PropType<CommonBusinessProjectMarket>,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const marketForm = ref<ICommissionRate>({
      month: '',
      net_sales_rate: '',
    });
    const months = ref<{ label: string; value: string }[]>([]);
    const rules = {
      month: [{ required: true, message: '请选择月份' }],
      net_sales_rate: [{ required: true, message: '请填写净销比例' }],
    };

    const currentDate = moment();
    currentDate.add(-1, 'M');
    months.value.push({
      label: currentDate.format('YYYY年MM月'),
      value: currentDate.format('YYYYMM'),
    });
    currentDate.add(1, 'M');
    months.value.push({
      label: currentDate.format('YYYY年MM月'),
      value: currentDate.format('YYYYMM'),
    });
    currentDate.add(1, 'M');
    months.value.push({
      label: currentDate.format('YYYY年MM月'),
      value: currentDate.format('YYYYMM'),
    });

    const onCloseBtnClick = () => {
      ctx.emit('dialog:close');
      ctx.root.$nextTick(resetForm);
    };
    /** 重置表单 */
    const resetForm = () => {
      marketForm.value.month = '';
      marketForm.value.net_sales_rate = '';
    };

    /** 点击保存 */
    const submit = () => {
      formRef.value?.validate(valid => {
        if (valid) {
          const payload: ICommissionRate = {
            ...marketForm.value,
          };

          ctx.emit('saveCommissinRate', payload);
        } else {
          return false;
        }
      });
    };

    const inputAmount = (key: 'net_sales_rate', value: string) => {
      marketForm.value[key] = limit.NumberRange(0, 100)(value);
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);
    return {
      months,
      onCloseBtnClick,
      onSaveBtnClick,
      marketForm,
      formRef,
      inputAmount,
      rules,
    };
  },
});
