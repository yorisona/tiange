import { defineComponent, PropType, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import type { CommonBusinessPayableActual } from '@/types/tiange/commonBusiness/project';
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
      default: '',
    },
    data: {
      type: Object as PropType<CommonBusinessPayableActual>,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const form = ref<CommonBusinessPayableActual>({
      pay_amount: '',
      transfer_date: '',
      pay_reason: '',
      pay_way: 1,
      pay_way_detail: {
        name: '',
      },
      ...props.data,
    });
    // watch(
    //   () => props.visible,
    //   newVal => {
    //     if (newVal) {
    //       formRef.value?.resetFields();
    //       form.value.pay_amount = props.data?.pay_amount ? props.data?.pay_amount : '';
    //       form.value.transfer_date = props.data?.transfer_date ? props.data?.transfer_date : '';
    //       form.value.pay_reason = props.data?.pay_reason ? props.data?.pay_reason : '';
    //       form.value.pay_way = props.data?.pay_way ? props.data?.pay_way : 1;
    //       form.value.pay_way_detail.name = props.data?.pay_way_detail.name
    //         ? props.data?.pay_way_detail.name
    //         : '';
    //     }
    //   },
    // );

    const handleCloseAction = () => {
      ctx.emit('closeAction');
      ctx.root.$nextTick(resetForm);
    };
    /** 重置表单 */
    const resetForm = () => {
      // formRef.value?.clearValidate();
      form.value.pay_amount = '';
      form.value.transfer_date = '';
      form.value.pay_reason = '';
      form.value.pay_way = 1;
      form.value.pay_way_detail.name = '';

      setTimeout(() => {
        formRef.value?.clearValidate();
      }, 100);
    };

    /** 点击保存 */
    const submit = () => {
      (ctx.refs.formRef as ElForm).validate((valid: boolean) => {
        if (valid) {
          const payload: CommonBusinessPayableActual = {
            ...form.value,
            pay_amount: Number(form.value.pay_amount),
          };
          ctx.emit('saveSubmit', payload);
        }
      });
    };

    const inputAmount = (key: 'pay_amount', value: string) => {
      form.value[key] = getPositiveNumber(value);
    };

    /** 保存 */
    const handleSaveAction = debounce(submit, 200);
    return {
      handleCloseAction,
      handleSaveAction,
      form,
      formRef,
      inputAmount,
      Error,
      Number,
    };
  },
});
