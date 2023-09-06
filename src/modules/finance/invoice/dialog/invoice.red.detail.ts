import { defineComponent, ref } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import InvoiceRedDialog from '@/modules/finance/invoice/dialog/invoice.red.vue';
import moment from 'moment';

export default defineComponent({
  name: 'InvoiceRedDetailDialog',
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Appendix,
    WorkbenchTimeLine,
    InvoiceRedDialog,
  },
  setup(props, ctx) {
    const edit = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const baseData = ref(null);
    const invoiceRedDialogRef = ref<{ show(): void } | null>(null);

    // 抛出关闭事件
    const emitClose = () => {
      visible.value = false;
      ctx.emit('close');
    };

    const show = (data: any) => {
      baseData.value = data;
      visible.value = true;
    };

    const reSubmit = async () => {
      invoiceRedDialogRef.value?.show();
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
      reSubmit,
      baseData,
      reClose,
      show,
      moment,
      invoiceRedDialogRef,
    };
  },
});
