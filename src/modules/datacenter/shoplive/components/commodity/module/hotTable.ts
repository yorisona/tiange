import { defineComponent, PropType } from '@vue/composition-api';
import formatPriceForm from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;
import { numberFormat } from '@/utils/formatMoney';
import { IHotEveryWeek } from '@/modules/datacenter/commodityAnalysis/types';
import emptyGoods from '@/assets/img/goods-empty.png';

export default defineComponent({
  name: 'TgCommodityAnalysisWeekPopularTable',
  props: {
    list: {
      type: Array as PropType<IHotEveryWeek[]>,
      default: () => [] as IHotEveryWeek[],
    },
    rowStyle: {
      type: Function,
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const openDouyin = (item_id: string) => {
      window.open(`https://haohuo.jinritemai.com/views/product/item2?id=${item_id}`);
    };
    const seasonType = (type: number) => {
      switch (type) {
        case 1:
          return '春季';
        case 2:
          return '夏季';
        case 3:
          return '秋季';
        case 4:
          return '冬季';
        default:
          return '其他';
      }
    };

    const rankChinese = (val: number) => {
      switch (val) {
        case 1:
          return '一';
        case 2:
          return '二';
        case 3:
          return '三';
        case 4:
          return '四';
        case 5:
          return '五';
        case 6:
          return '六';
        case 7:
          return '七';
        case 8:
          return '八';
        case 9:
          return '九';
        case 10:
          return '十';
        default:
          return val;
      }
    };

    return { emptyGoods, openDouyin, formatPriceFormYuan, numberFormat, seasonType, rankChinese };
  },
});
