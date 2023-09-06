import { defineComponent, PropType, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import type { CommonBusinessProjectMarket } from '@/types/tiange/commonBusiness/project';
import { getPositiveNumber } from '@/utils/string';
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
      type: Object as PropType<CommonBusinessProjectMarket>,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const marketForm = ref<CommonBusinessProjectMarket>({
      income_amount: '',
      ...props.data,
    });

    const onCloseBtnClick = () => {
      ctx.emit('dialog:close');
      ctx.root.$nextTick(resetForm);
    };
    /** 重置表单 */
    const resetForm = () => {
      marketForm.value.income_amount = '';
    };

    /** 点击保存 */
    const submit = () => {
      const payload: CommonBusinessProjectMarket = {
        ...marketForm.value,
      };
      ctx.emit('saveSubmit', payload);
    };

    const inputAmount = (key: 'income_amount', value: string) => {
      marketForm.value[key] = getPositiveNumber(value);
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);
    return {
      onCloseBtnClick,
      onSaveBtnClick,
      marketForm,
      formRef,
      inputAmount,
    };
  },
});
