import { defineComponent } from '@vue/composition-api';
import LineEcharts from '../../components/line/index.vue';
import pieEcharts from '../../components/pie/index.vue';
import { numberMoneyFormat } from '@/utils/formatMoney';

export default defineComponent({
  components: {
    LineEcharts,
    pieEcharts,
  },
  props: {
    summaryData: {
      type: Array,
      default: () => [],
    },
    gmvData: {
      type: Object,
      default: () => ({}),
    },
    gmvRateData: {
      type: Array,
      default: () => [],
    },
    operatingData: {
      type: Object,
      default: () => ({}),
    },
    sessionData: {
      type: Object,
      default: () => ({}),
    },
    liverNumData: {
      type: Object,
      default: () => ({}),
    },
    chartLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    return {
      numberMoneyFormat,
    };
  },
});
