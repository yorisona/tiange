import { defineComponent, computed, PropType } from '@vue/composition-api';
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
    restDates: {
      type: Array as PropType<string[]>,
    },
    currentDateType: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const dateList = computed(() => {
      const list = JSON.parse(JSON.stringify(props.list));
      for (let index = 0; index < list.length; index++) {
        delete list[index].合计;
        delete list[index].数据指标;
        delete list[index].业务类型;
      }
      return list;
    });
    const computedRestDate = computed(() => props.restDates ?? []);
    // const computedRestDate = computed(() => ['10-01', '10-12'])
    const tableSpanMethod = ({
      _,
      column,
      rowIndex,
      columnIndex,
    }: {
      _: any;
      column: any;
      rowIndex: any;
      columnIndex: any;
    }) => {
      if (
        columnIndex > 0 &&
        columnIndex <= Object.getOwnPropertyNames(dateList.value[0]).length &&
        is_rest(column.label)
      ) {
        if (rowIndex === 0) {
          return [props.list.length, 1];
        } else {
          return [0, 0];
        }
      }
      return [1, 1];
    };

    const is_rest = (day: number | string) => {
      if (computedRestDate.value.length === 0) {
        return false;
      }
      const findItem = computedRestDate.value.find(el => {
        const items = el.split('-');
        const restDay = `${Number(items[items.length - 1])}`;
        if (restDay === `${day}`) {
          return el;
        }
      });
      return findItem ? true : false;
    };
    return {
      is_rest,
      dateList,
      tableSpanMethod,
      numberFormat,
    };
  },
});
