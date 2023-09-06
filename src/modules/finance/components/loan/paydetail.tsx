/**
 * 用款审批单详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 10:38:31
 */
import { defineComponent, PropType, ref } from '@vue/composition-api';
import { FinancePayment } from '@/types/tiange/finance/finance';
import Decimal from 'decimal.js';
import { Decimal2String, fillEmptyStr } from '@/utils/string';
import Invoicelist from '@/modules/live/project/dialog/invoice.list.vue';
import { BusinessTypeMap } from '@/types/tiange/common';
import ImageViewer from '@/components/Image/ImageViewer';
export default defineComponent({
  name: 'PaymentLoanDetailModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    detailData: {
      type: Object as PropType<FinancePayment>,
    },
    isFromApproval: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    Invoicelist,
  },
  mounted(): void {
    //
  },
  setup(props, ctx) {
    // 抛出关闭事件
    const invoicelistRef = ref<any | undefined>(undefined);
    const emitClose = () => ctx.emit('dialog:closerow');
    //抛出付款凭证展示事件
    const checkoutPaymentBtn = (gather_certificate_pic: string) => {
      if (gather_certificate_pic) {
        checkoutCertificateBtn(gather_certificate_pic);
        // ctx.emit('dialog:openpaymentcertificate', gather_certificate_pic);
      }
    };
    //抛出合同打开事件
    const checkoutPaymentcontractBtn = (contract_id: number, contract_type: number) => {
      goContractDetail(contract_id, contract_type);
      // ctx.emit('dialog:openpaymentcontract', contract_id, contract_type);
    };
    //抛出退款用款事件
    const checkoutPaymentApprovalBtn = (row: any) => {
      return;
      ctx.emit('dialog:openpaymentapproval', row);
    };
    //抛出垫款展示事件
    const checkoutPaymentImprestBtn = (row: any) => {
      return;
      ctx.emit('dialog:openpaymentimprest', row);
    };
    const getnomalAmount = (amount: number) => {
      return `￥${Decimal2String(new Decimal(amount))}`;
    };
    const gettwonomalAmount = (amount: number) => {
      return `${Decimal2String(new Decimal(amount))}`;
    };

    const checkoutCertificateBtn = (link: string) => {
      const list = link.split(',');
      ImageViewer.show(list);
    };

    const invoiceList = ref<any | undefined>(undefined);

    const goContractDetail = (contract_id: number | '', contract_type: number) => {
      if (!contract_id) {
        return;
      }
      if (contract_type === 1 || contract_type === 2) {
        window.open('/legal/contract/customer/' + contract_id);
      } else if (contract_type === 5) {
        window.open('/legal/contract/customerTemplate/' + contract_id);
      } else if (contract_type === 6) {
        window.open('/legal/contract/supplierTemplate/' + contract_id);
      } else if (contract_type === 7) {
        window.open('/legal/contract/anchorTemplate/' + contract_id);
      } else {
        window.open('/legal/contract/supplier/' + contract_id);
      }
    };

    return {
      BusinessTypeMap,
      getnomalAmount,
      gettwonomalAmount,
      checkoutPaymentImprestBtn,
      checkoutPaymentApprovalBtn,
      checkoutPaymentcontractBtn,
      emitClose,
      checkoutPaymentBtn,
      fillEmptyStr,
      invoiceList,
      invoicelistRef,
    };
  },
  methods: {
    receiveType(type: number) {
      if (type === 1) {
        return 'V任务';
      } else if (type === 2) {
        return '支付宝';
      } else if (type === 3) {
        return '对公银行';
      } else if (type === 4) {
        return '阿里妈妈';
      } else if (type === 5) {
        return '巨量百应';
      } else {
        return '--';
      }
    },
  },
});
