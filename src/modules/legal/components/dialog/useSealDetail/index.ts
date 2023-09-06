import { defineComponent, ref } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import WorkbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import moment from 'moment';
import {
  SealTypeMap,
  UseSealBusinessMap,
  UseSealCompanyMap,
  UseSealMatterMap,
} from '@/types/tiange/workbench';
import { formatAmountWithoutPrefix } from '@/utils/string';

export type SealRecordDetailType = {
  show: (data: any) => void;
};

export default defineComponent({
  // name: 'InvoiceRedDetailDialog',
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
  },
  setup(props, ctx) {
    const edit = ref<boolean>(false);
    const visible = ref<boolean>(false);
    const baseData = ref(undefined);

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

    const task_out_date_str = (data: any) => {
      if (data) {
        const format = 'yyyy.MM.DD';
        const start_moment = moment(data.take_out_start_date * 1000).format(format);
        const end_moment = moment(data.take_out_end_date * 1000).format(format);
        return `${start_moment}~${end_moment}`;
      }
      return '--';
    };
    const amount = (data: any) => {
      if (data) {
        const amount_involved = data.amount_involved >= 0 ? data.amount_involved : '--';
        return formatAmountWithoutPrefix(amount_involved);
      }
      return '--';
    };

    const seal_name = (data: any) => {
      if (data.level_two_types === 5 || data.level_two_types === 6) {
        return '公章';
      }
      if (data && data.seal_type) {
        return SealTypeMap.get(data.seal_type) ?? '--';
      }
      return '--';
    };

    const company_name = (data: any) => {
      if (data && data.company_name_code) {
        return UseSealCompanyMap.get(data.company_name_code) ?? '--';
      }
      return '--';
    };

    const matter_name = (data: any) => {
      if (data && data.matter_type) {
        return UseSealMatterMap.get(data.matter_type) ?? '--';
      }
      return '--';
    };

    const business_type_name = (data: any) => {
      if (data && data.business_type) {
        return UseSealBusinessMap.get(data.business_type) ?? '--';
      }
      return '--';
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
      seal_name,
      company_name,
      matter_name,
      business_type_name,
      task_out_date_str,
      amount,
    };
  },
});
