import { defineComponent, ref, watch } from '@vue/composition-api';
import { useList } from './list';
import moment from 'moment';
import { formatAmount } from '@/utils/string';
// @ts-ignore
export default defineComponent({
  name: 'gmvDataDetail',
  setup(_, ctx) {
    const methods = {};
    /** 项目列表 logic */
    const listLogic = useList(ctx, 0);
    const currentYear = moment().add(0, 'years').get('year');
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
    watch(
      () => listLogic.list.value,
      () => {
        const newarr: any = [];
        newarr.push(...listLogic.list.value);
        newList.value = newarr;
      },
    );
    const monthTargetType = [
      'oneTargetValue',
      'twoTargetValue',
      'threeTargetValue',
      'fourTargetValue',
      'fiveTargetValue',
      'sixTargetValue',
      'sevenTargetValue',
      'eightTargetValue',
      'nineTargetValue',
      'tenTargetValue',
      'elevenTargetValue',
      'twelveTargetValue',
      'allTargetValue',
    ];
    const monthCompleteType = [
      'oneCompleteValue',
      'twoCompleteValue',
      'threeCompleteValue',
      'fourCompleteValue',
      'fiveCompleteValue',
      'sixCompleteValue',
      'sevenCompleteValue',
      'eightCompleteValue',
      'nineCompleteValue',
      'tenCompleteValue',
      'elevenCompleteValue',
      'twelveCompleteValue',
      'allCompleteValue',
    ];
    const monthRateType = [
      'oneCompleteRate',
      'twoCompleteRate',
      'threeCompleteRate',
      'fourCompleteRate',
      'fiveCompleteRate',
      'sixCompleteRate',
      'sevenCompleteRate',
      'eightCompleteRate',
      'nineCompleteRate',
      'tenCompleteRate',
      'elevenCompleteRate',
      'twelveCompleteRate',
      'allCompleteRate',
    ];
    const getNewAmount = (value: any, item: number, noDecimal = true) => {
      if (value) {
        return noDecimal
          ? formatAmount(Number(value || 0) / 100, 'None')
          : formatAmount((Number(value || 0) / 100).toFixed(0), 'None', true);
      } else {
        return Number(currentMonth) >= item ? '--' : '';
      }
    };
    const getNewRate = (value: any, item: number) => {
      if (value) {
        return Number(value || 0).toFixed(2) + '%';
      } else {
        return Number(currentMonth) >= item ? '--' : '';
      }
    };
    const getRateWidth = (value: any) => {
      if (value) {
        return Number(value || 0) >= 100 ? '100%' : Number(value || 0) * 1.1 + 'px';
      } else {
        return '0px';
      }
    };
    const getClassName = (row: any) => {
      if (row.project_name.indexOf('合计') >= 0) {
        return 'alldiv';
      }
      return '';
    };
    const getImgClassName = (value: any, index: number) => {
      if (value) {
        if (index === currentMonth) {
          return Number(value || 0) >= 100 ? 'current' : Number(value || 0) > 0 ? 'current' : '';
        }
        return Number(value || 0) >= 100
          ? 'success'
          : Number(value || 0) >= 40
          ? 'process'
          : 'block';
      } else {
        return '';
      }
    };
    return {
      getImgClassName,
      getClassName,
      getRateWidth,
      getNewRate,
      getNewAmount,
      monthCompleteType,
      monthTargetType,
      monthRateType,
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
        container.scrollLeft = (this.currentMonth - 1) * 360 - 150;
      });
    }, 100);
  },
});
