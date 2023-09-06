import { defineComponent, ref } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import moment from 'moment';

export default defineComponent({
  name: 'InvoiceVoidDetailDialog',
  components: {
    WorkbenchTimeLine,
  },
  setup(props, ctx) {
    const edit = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const baseData = ref(null);

    // 抛出关闭事件
    const emitClose = () => {
      visible.value = false;
      ctx.emit('close');
    };

    const show = (data: any) => {
      baseData.value = data;
      visible.value = true;
    };

    const reClose = () => {
      emitClose();
      ctx.emit('success');
    };

    return {
      visible,
      emitClose,
      numberFormat,
      edit,
      baseData,
      reClose,
      show,
      moment,
    };
  },
});
