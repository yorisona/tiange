import { reactive, ref, watch } from '@vue/composition-api';
import moment from 'moment';

export enum EDateType {
  Month = 0,
  Year = 1,
  Quarter = 2,
  Week = 3,
}

// 定义日期搜索类型配置
export const selectDateConfig = (isQuarter = false, isNeedLimitedtime = false, isWeek = false) => {
  // 定义日期类型
  const dateType = ref(EDateType.Month);
  let dateTypeList = [
    {
      label: '按月查看',
      value: EDateType.Month,
    },
    {
      label: '按年查看',
      value: EDateType.Year,
    },
  ];
  if (isQuarter) {
    dateTypeList = [
      {
        label: '按月查看',
        value: EDateType.Month,
      },
      {
        label: '按季查看',
        value: EDateType.Quarter,
      },
    ];
  }
  if (isWeek) {
    dateTypeList = [
      {
        label: '按月查看',
        value: EDateType.Month,
      },
      {
        label: '按周查看',
        value: EDateType.Week,
      },
    ];
  }
  const dateValue = ref<undefined | any>(undefined);
  // 定义日期列表
  const dateValueList = ref<{ label: string; value: string }[]>([]);

  const initDateValue = () => {
    // 如果是按年查看
    if (dateType.value === EDateType.Year) {
      const currentYear = moment().add(1, 'years');
      dateValueList.value = new Array(10).fill(1).map(() => {
        currentYear.add(-1, 'years');
        return {
          label: currentYear.format('YYYY年'),
          value: currentYear.format('YYYY'),
        };
      });
      dateValue.value = dateValueList.value[0].value;
    } else if (dateType.value === EDateType.Quarter) {
      const currentQuarter = moment().add(1, 'Q');
      dateValueList.value = [];
      new Array(10).fill(1).map(() => {
        currentQuarter.add(-1, 'Q');
        if (isNeedLimitedtime && Number(currentQuarter.format('YYYY')) < 2022) {
          return;
        }
        return dateValueList.value.push({
          label: currentQuarter.format('YYYY年Q季度'),
          value: currentQuarter.format('YYYY-Q'),
        });
      });
      dateValue.value = dateValueList.value[0].value;
    } else if (dateType.value === EDateType.Month) {
      const currentMonth = moment().add(1, 'months');
      dateValueList.value = [];
      new Array(24).fill(1).map(() => {
        currentMonth.add(-1, 'months');
        if (isNeedLimitedtime && Number(currentMonth.format('YYYY')) < 2022) {
          return;
        }
        return dateValueList.value.push({
          label: currentMonth.format('YYYY年MM月'),
          value: currentMonth.format('YYYYMM'),
        });
      });
      dateValue.value = dateValueList.value[0].value;
    } else if (dateType.value === EDateType.Week) {
      const currentQuarter = moment().add(1, 'w');
      dateValueList.value = [];
      new Array(30).fill(1).map(() => {
        currentQuarter.add(-1, 'w');
        if (isNeedLimitedtime && Number(currentQuarter.format('YYYY')) < 2022) {
          return;
        }
        const dateFormat = 'MM.DD';
        const start_time = currentQuarter.startOf('w').format(dateFormat);
        const end_time = currentQuarter.endOf('w').format(dateFormat);
        return dateValueList.value.push({
          label: currentQuarter.format('YYYY年第W周' + '(' + start_time + '-' + end_time + ')'),
          value: currentQuarter.format('YYYY-MM-DD'),
        });
      });
      dateValue.value = dateValueList.value[0].value;
    }
  };
  watch(
    () => dateType.value,
    () => {
      dateValue.value = undefined;
      initDateValue();
    },
  );
  initDateValue();

  return reactive({
    dateType,
    dateTypeList,
    dateValue,
    dateValueList,
  });
};
