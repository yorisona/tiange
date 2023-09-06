import { defineComponent } from '@vue/composition-api';
import { numberMoneyFormat } from '@/utils/formatMoney';

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, ctx) {
    return {
      numberMoneyFormat,
    };
  },
});
