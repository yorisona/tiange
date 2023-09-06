import { reactive, ref, watch } from '@vue/composition-api';
import moment from 'moment';
export enum EDateType {
  Month = 0,
  Year = 1,
}

export enum EBiStyle {
  List = 0,
  Chart = 1,
}

// 定义日期搜索类型配置
export const useBiConfig = () => {
  // 定义日期类型
  const dateType = ref(EDateType.Month);
  const dateTypeList = [
    {
      label: '按月查看',
      value: EDateType.Month,
    },
    {
      label: '按年查看',
      value: EDateType.Year,
    },
  ];
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
    } else {
      const currentYear = moment().add(1, 'months');
      dateValueList.value = new Array(24).fill(1).map(() => {
        currentYear.add(-1, 'months');
        return {
          label: currentYear.format('YYYY年MM月'),
          value: currentYear.format('YYYYMM'),
        };
      });
      dateValue.value = dateValueList.value[0].value;
    }
  };

  // 定义Bi表格,图表切换
  const type = ref(EBiStyle.List);
  const list = [
    { icon: 'ico-list', name: '列表样式', type: EBiStyle.List },
    { icon: 'ico-chart', name: '图表样式', type: EBiStyle.Chart },
  ];

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
    type,
    list,
  });
};
