import { defineComponent, ref, watch } from '@vue/composition-api';
import { useList } from './list';
import moment from 'moment';
import { formatAmount } from '@/utils/string';

// @ts-ignore
export default defineComponent({
  name: 'dataDetail',
  props: {
    //1为收入，2为成本，3为利润
    tab_type: {
      type: Number,
      default: 1,
    },
  },
  setup(props, ctx) {
    const methods = {};
    /** 项目列表 logic */
    const listLogic = useList(ctx, props.tab_type);
    const currentYear = moment().add(0, 'years').get('year');
    // const currentMonth = moment().add(1, 'months').get('month');
    listLogic.loadData({ start_date: currentYear + '-01-01', end_date: currentYear + '-12-31' });
    let index_row = 0;
    const tableSpanMethod = ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: any;
      column: any;
      rowIndex: number;
      columnIndex: number;
    }) => {
      //最后一行
      if (rowIndex === newList.value.length - 1) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
      //第一列
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          index_row = 0;
        }
        if (rowIndex < index_row) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        } else {
          let i = 1;
          for (const index in newList.value) {
            const indexrow = Number(index);
            if (newList.value.length > indexrow + 1 && indexrow >= index_row) {
              if (newList.value[indexrow].depart_ment === newList.value[indexrow + 1].depart_ment) {
                i = i + 1;
              } else {
                //不相等,当前循环字段已超过行数
                if (indexrow >= rowIndex) {
                  index_row = index_row + i;
                  if (i === 1) {
                    return {
                      rowspan: 1,
                      colspan: 1,
                    };
                  } else {
                    return {
                      rowspan: i,
                      colspan: 1,
                    };
                  }
                  break;
                } else {
                  i = 1;
                }
              }
            }
          }
          return {
            rowspan: 1,
            colspan: 1,
          };
        }
      }
    };
    const currentMonth = moment().get('month') + 1;
    const newList: any = ref([]);
    const LineRateList: any = ref([]);
    const isLineRate = (item: number) => {
      //第几列
      const arr = listLogic.list.value.find((sub: any) => {
        return sub[monthRateType[item]] ? true : false;
      });
      return arr ? true : false;
    };
    const isLineValueRate = (item: number) => {
      //第几列
      const arr = listLogic.list.value.find((sub: any) => {
        return sub[monthRateType[item]] || sub[monthType[item]] ? true : false;
      });
      return arr ? true : false;
    };
    watch(
      () => listLogic.list.value,
      () => {
        for (let i = 0; i < 12; i++) {
          const isLineValueRate_value = isLineValueRate(i);
          let isLineRate_value = false;
          if (isLineValueRate_value === true) {
            isLineRate_value = isLineRate(i);
          }
          LineRateList.value.push({
            isLineRate: isLineRate_value,
            isLineValueRate: isLineValueRate_value,
          });
        }
        const newarr: any = [];
        newarr.push(...listLogic.list.value);
        newList.value = newarr;
      },
    );
    const monthType = [
      'oneValue',
      'twoValue',
      'threeValue',
      'fourValue',
      'fiveValue',
      'sixValue',
      'sevenValue',
      'eightValue',
      'nineValue',
      'tenValue',
      'elevenValue',
      'twelveValue',
    ];
    const monthRateType = [
      'oneRate',
      'twoRate',
      'threeRate',
      'fourRate',
      'fiveRate',
      'sixRate',
      'sevenRate',
      'eightRate',
      'nineRate',
      'tenRate',
      'elevenRate',
      'twelveRate',
    ];
    const getNewAmount = (value: any, item: number) => {
      if (value) {
        return '¥ ' + formatAmount(Number(value || 0) / 100, 'None');
      } else {
        return Number(currentMonth) >= item ? '--' : '';
      }
    };
    const getNewRate = (val: number | undefined | null) => {
      return val && val !== 0 ? Math.abs(val) + '%' : val;
    };
    const getClassName = (row: any) => {
      if (row.project_name.indexOf('合计') >= 0) {
        return 'alldiv';
      }
      return '';
    };
    return {
      getClassName,
      LineRateList,
      getNewRate,
      getNewAmount,
      monthRateType,
      monthType,
      newList,
      currentMonth,
      tableSpanMethod,
      ...listLogic,
      ...methods,
    };
  },
  mounted(): void {
    setTimeout(() => {
      this.$nextTick(() => {
        const container: any = this.$el.querySelector('.el-table__body-wrapper');
        container.scrollLeft = (this.currentMonth - 1) * 120 + 100;
      });
    }, 100);
  },
});
