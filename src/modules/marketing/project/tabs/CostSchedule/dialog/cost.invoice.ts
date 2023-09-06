/*
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 发票详情
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-26 16:00:07
 */
import { InvoiceInfo } from '@/types/tiange/marketing/project';
import { defineComponent, PropType, computed, watch, ref } from '@vue/composition-api';
import { getToken } from '@/utils/token';
import invoice from '@/modules/live/project/dialog/invoice';

export default defineComponent({
  name: 'CostInvoice',
  props: {
    visible: {
      type: Boolean,
    },
    invoices: {
      type: Array as PropType<InvoiceInfo[]>,
    },
  },
  setup(props, ctx) {
    const tokenStr = `Authorization=${getToken()}`;
    const didClosed = ref(false);

    const newInvoices = computed(() => {
      if (props.invoices === undefined || didClosed.value) {
        return [];
      }
      return [...props.invoices];
    });

    watch([() => props.visible], ([newVisible]) => {
      if (newVisible) {
        didClosed.value = false;
      }
    });

    const showImage = (url: string) => {
      invoice.showDetail(url);
    };

    /** methods */
    const close = () => {
      ctx.emit('update:visible', false);
    };

    const closed = () => {
      didClosed.value = true;
    };

    return {
      close,
      closed,
      tokenStr,
      newInvoices,
      showImage,
    };
  },
});
