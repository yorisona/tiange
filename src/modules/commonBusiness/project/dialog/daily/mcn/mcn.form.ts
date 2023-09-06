import { defineComponent, PropType, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import type { CommonBusinessProjectMCN } from '@/types/tiange/commonBusiness/project';
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
      type: Object as PropType<CommonBusinessProjectMCN>,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const mcnForm = ref<CommonBusinessProjectMCN>({
      gmv: '',
      operating_amount: '',
      live_count: '',
      live_duration: '',
      anchor_count: '',
      ...props.data,
    });

    const onCloseBtnClick = () => {
      ctx.emit('dialog:close');
      ctx.root.$nextTick(resetForm);
    };
    /** 重置表单 */
    const resetForm = () => {
      mcnForm.value.gmv = '';
      mcnForm.value.operating_amount = '';
      mcnForm.value.live_count = '';
      mcnForm.value.live_duration = '';
      mcnForm.value.anchor_count = '';
    };

    /** 点击保存 */
    const submit = () => {
      const payload: CommonBusinessProjectMCN = {
        ...mcnForm.value,
      };
      ctx.emit('saveSubmit', payload);
    };

    const inputAmount = (key: 'gmv' | 'operating_amount' | 'live_duration', value: string) => {
      mcnForm.value[key] = getPositiveNumber(value);
    };

    const inputInteger = (key: 'live_count' | 'anchor_count', value: string) => {
      mcnForm.value[key] = value.replace(/[^\d]/g, '');
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);
    return {
      onCloseBtnClick,
      onSaveBtnClick,
      mcnForm,
      formRef,
      inputAmount,
      inputInteger,
    };
  },
});
