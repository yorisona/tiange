import { defineComponent } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';

export default defineComponent({
  name: 'dataCenterList',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props, ctx) {
    const getWidth = (item: any): any => {
      const str = String(item[0]);
      if (str.length >= 7) {
        return '160';
      } else if (str.length > 5) {
        return '100';
      } else if (str.length > 4) {
        return '90';
      } else if (str.length > 3) {
        return '80';
      }
      return '71';
    };
    return {
      getWidth,
      numberFormat,
    };
  },
});
