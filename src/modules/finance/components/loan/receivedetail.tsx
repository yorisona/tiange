/**
 * 用款审批单详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 10:38:31
 */
import { defineComponent, PropType } from '@vue/composition-api';
import { FinanceReceive } from '@/types/tiange/finance/finance';
import { numberMoneyFormat } from '@/utils/formatMoney';
import { Decimal2String, fillEmptyStr } from '@/utils/string';
import Decimal from 'decimal.js';
import { BusinessTypeMap } from '@/types/tiange/common';

// import FinanceInvoiceDetailDialog from '../../dialog/finance.invoice.detail';
export default defineComponent({
  name: 'ReceiveLoanDetailModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    detailData: {
      type: Object as PropType<FinanceReceive>,
    },
  },
  components: {},
  mounted(): void {
    //
  },
  setup(props, ctx) {
    // 抛出关闭事件
    const emitClose = () => ctx.emit('dialog:closerow');
    //抛出付款凭证展示事件
    const checkoutPaymentBtn = (gather_certificate_pic: string) => {
      if (gather_certificate_pic) {
        ctx.emit('dialog:openreceivecertificate', gather_certificate_pic);
      }
    };
    //抛出合同打开事件
    const checkoutreceivecontractBtn = (contract_id: number, contract_type: number) => {
      if (contract_id) {
        ctx.emit('dialog:openreceivecontract', contract_id, contract_type);
      }
    };
    //抛出开票事件
    const checkoutreceiveApprovalBtn = (row: any) => {
      return;
      ctx.emit('dialog:openreceiveApproval', row);
    };
    //抛出发票展示事件
    const openinvoicefinance = (invoice_info: any) => {
      ctx.emit('dialog:openreceiveinvoice', invoice_info);
    };
    const gettwonomalAmount = (amount: number) => {
      return `${Decimal2String(new Decimal(amount))}`;
    };
    return {
      BusinessTypeMap,
      numberMoneyFormat,
      gettwonomalAmount,
      checkoutreceiveApprovalBtn,
      fillEmptyStr,
      emitClose,
      openinvoicefinance,
      checkoutPaymentBtn,
      checkoutreceivecontractBtn,
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
