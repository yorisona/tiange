import {
  QueryGmvSunburst,
  QueryGmvTrend,
  QueryLaborEfficiencyTrend,
  QueryOperationOverview,
  QueryProfitMarginStatistics,
  QueryProjectDistributionBubble,
  QueryProjectPercentSunburst,
  QueryProjectTeamTrend,
} from '@/services/finance';
import { SetupContext, ref, computed } from '@vue/composition-api';
import moment, { unitOfTime } from 'moment';
import { formatAmount } from '@/utils/string';
import { wait } from '@/utils/func';
import {
  DashboardGMVTrendModel,
  DashboardLaborEffectModel,
  DashboardOverviewModel,
  DashboardSunburstDataModel,
  ProfitMarginStatisticsModel,
} from '@/types/tiange/finance/finance';
import Decimal from 'decimal.js';

export enum DateRangeType {
  /** 年度 */
  year = 0,
  /** 季度 */
  quarter,
  /** 月度 */
  month,
}

export enum DisplayDataType {
  /** gmv */
  gmv,
  /** 收入 */
  income,
  /** 成本 */
  cost,
  /** 利润 */
  profit,
}

export const useData = (ctx: SetupContext) => {
  const dateRangeType = ref(DateRangeType.year);
  const currentMoment = ref(moment());

  const displayDate = computed(() => {
    switch (dateRangeType.value) {
      case DateRangeType.year:
        return currentMoment.value.format('yyyy年');
      case DateRangeType.quarter:
        return currentMoment.value.format('yyyy年Q季度');
      case DateRangeType.month:
        return currentMoment.value.format('yyyy年MM月');
      default:
        return '';
    }
  });

  const isCurrentMonth = computed(
    () =>
      dateRangeType.value === DateRangeType.month && currentMoment.value.isSame(moment(), 'month'),
  );
  const noPerCapitaData = computed(
    () => isCurrentMonth.value || dateRangeType.value === DateRangeType.quarter,
  );

  const displayDataType = ref(DisplayDataType.gmv);
  const displayDataTypeStr = computed(() => {
    switch (displayDataType.value) {
      case DisplayDataType.gmv:
        return 'GMV';
      case DisplayDataType.income:
        return isCurrentMonth.value ? '预估收入' : '收入';
      case DisplayDataType.cost:
        return isCurrentMonth.value ? '预估成本' : '成本';
      case DisplayDataType.profit:
        return isCurrentMonth.value ? '预估利润' : '利润';
      default:
        return '';
    }
  });

  const monthOptions = ref<number[]>(
    (() => {
      const month = moment().month();
      const monthArr: number[] = [];
      for (let i = 0; i <= month; i++) {
        monthArr.push(i);
      }
      return monthArr;
    })(),
  );

  const bubbleSelectedMonth = ref<number>(-1);
  const bubblePopoverVisible = ref<boolean>(false);

  const sunBurstLoading = ref(false);
  const trendLoading = ref(false);
  const profitRatioLoading = ref(false);
  const laborEffectLoading = ref(false);
  const projectBubbleLoading = ref(false);

  const overviewData = ref<DashboardOverviewModel | undefined>(undefined);
  const sunBurstData = ref<DashboardSunburstDataModel[] | undefined>(undefined);
  const gmvTrendData = ref<DashboardGMVTrendModel | undefined>(undefined);
  const profitRatioData = ref<ProfitMarginStatisticsModel | undefined>(undefined);
  const laborEffectData = ref<DashboardLaborEffectModel | undefined>(undefined);
  const projectBubbleData = ref<any | undefined>(undefined);

  const methods = {
    async queryOperationOverview() {
      const [start_date, end_date] = methods.displayDatsStr();
      const [res] = await wait(
        500,
        QueryOperationOverview({
          start_date,
          end_date,
        }),
      );
      // const res = await QueryOperationOverview({})
      if (res.data.success) {
        // overviewData.value = res.data.data;
        const data = res.data.data;
        if (data) {
          for (const key in data) {
            if (
              key === 'gmv' ||
              key === 'income' ||
              key === 'cost' ||
              key === 'profit' ||
              key === 'per_capita_gmv' ||
              key === 'per_capita_income' ||
              key === 'per_capita_cost' ||
              key === 'per_capita_profit'
            ) {
              const el = data[key];
              if (el) {
                (data as any)[key] = methods.transformFenToYuan(el);
              }
            }
          }
        }
        overviewData.value = data;
      }
    },
    async querySunbrust() {
      displayDataType.value === DisplayDataType.gmv
        ? await methods.queryGMVSunburst()
        : await methods.queryProjectPercentSunburst();
    },
    async queryTrend() {
      displayDataType.value === DisplayDataType.gmv
        ? await methods.queryGMVTrend()
        : await methods.queryProjectTeamTrendTrend();
    },
    // gmv旭日图
    async queryGMVSunburst() {
      const [start_date, end_date] = methods.displayDatsStr();
      sunBurstLoading.value = true;
      const [res] = await wait(
        500,
        QueryGmvSunburst({
          start_date,
          end_date,
        }),
      );
      // const res = await QueryGmvSunburst({});
      sunBurstLoading.value = false;
      if (res.data.success) {
        methods.resetSuntrustData(res.data.data);
      }
    },
    // gmv趋势图
    async queryGMVTrend() {
      const [start_date, end_date, group_by] = methods.displayDatsStr();
      trendLoading.value = true;
      const [res] = await wait(
        500,
        QueryGmvTrend({
          start_date,
          end_date,
          group_by: group_by as 'day' | 'month',
        }),
      );
      // const res = await QueryGmvTrend({});
      trendLoading.value = false;
      if (res.data.success) {
        // gmvTrendData.value = res.data.data;
        methods.resetTrendData(res.data.data);
      }
    },

    // 收入成本利润旭日图
    async queryProjectPercentSunburst() {
      const [start_date, end_date, _, dataType] = methods.displayDatsStr();

      sunBurstLoading.value = true;
      const [res] = await wait(
        500,
        QueryProjectPercentSunburst(
          {
            start_date,
            end_date,
          },
          parseInt(dataType, 10),
        ),
      );
      // const res = await QueryGmvSunburst({});
      sunBurstLoading.value = false;
      if (res.data.success) {
        // sunBurstData.value = res.data.data;
        methods.resetSuntrustData(res.data.data);
      }
    },
    // 收入成本利润趋势图
    async queryProjectTeamTrendTrend() {
      const [start_date, end_date, group_by, dataType] = methods.displayDatsStr();
      trendLoading.value = true;
      const [res] = await wait(
        500,
        QueryProjectTeamTrend(
          {
            start_date,
            end_date,
            group_by: group_by as 'day' | 'month',
          },
          parseInt(dataType, 10),
        ),
      );
      // const res = await QueryGmvTrend({});
      trendLoading.value = false;
      if (res.data.success) {
        // gmvTrendData.value = res.data.data;
        methods.resetTrendData(res.data.data);
      }
    },
    // 利润率趋势图
    async queryProfitMarginStatistics() {
      const [start_date, end_date] = methods.currentDatsStr();
      profitRatioLoading.value = true;
      const [res] = await wait(
        500,
        QueryProfitMarginStatistics({
          start_date,
          end_date,
        }),
      );
      profitRatioLoading.value = false;
      if (res.data.success) {
        // profitRatioData.value = res.data.data;
        const data = res.data.data;
        if (res.data.data) {
          data.datas = data.datas?.map(el => {
            if (el.key === 'income' || el.key === 'cost' || el.key === 'profit') {
              el.value = el.value.map(amount => methods.transformFenToYuan(amount));
            }
            return el;
          });
        }
        profitRatioData.value = data;
      }
    },
    async queryLaborEfficiencyTrend() {
      const [start_date, end_date] = methods.currentDatsStr();
      laborEffectLoading.value = true;
      const [res] = await wait(
        500,
        QueryLaborEfficiencyTrend({
          start_date,
          end_date,
        }),
      );
      // const res = await QueryLaborEfficiencyTrend({});
      laborEffectLoading.value = false;
      if (res.data.success) {
        // laborEffectData.value = res.data.data;
        const data = res.data.data;
        if (data) {
          if (data.datas?.per_capita_income) {
            data.datas.per_capita_income = data.datas?.per_capita_income?.map(el =>
              methods.transformFenToYuan(el),
            );
          }
          if (data.datas?.per_capita_cost) {
            data.datas.per_capita_cost = data.datas?.per_capita_cost?.map(el =>
              methods.transformFenToYuan(el),
            );
          }
          if (data.datas?.per_capita_profit) {
            data.datas.per_capita_profit = data.datas?.per_capita_profit?.map(el =>
              methods.transformFenToYuan(el),
            );
          }
        }
        laborEffectData.value = data;
      }
    },
    async queryProjectDistributionBubble(month: number | undefined = undefined) {
      const [start_date, end_date] = methods.currentDatsStr(month);
      projectBubbleLoading.value = true;
      const [res] = await wait(
        500,
        QueryProjectDistributionBubble({
          start_date,
          end_date,
        }),
      );
      // const res = await QueryProjectDistributionBubble({});
      projectBubbleLoading.value = false;
      if (res.data.success) {
        // projectBubbleData.value = res.data.data;
        let data = res.data.data;
        if (data) {
          data = data.map((el: any) => {
            return el.map((subEl: any) => {
              return subEl.map((se2: any, se2Index: number) =>
                se2Index <= 2 ? methods.transformFenToYuan(se2) : se2,
              );
            });
          });
        }
        projectBubbleData.value = data;
      }
    },
    reloadAllData() {
      methods.queryOperationOverview();
      methods.queryGMVSunburst();
      methods.queryGMVTrend();
      methods.queryProfitMarginStatistics();
      methods.queryLaborEfficiencyTrend();
      methods.queryProjectDistributionBubble();
    },
    onDateRangeChange(type: DateRangeType) {
      dateRangeType.value = type;
    },
    onDateChange(step: number) {
      if (step === 1) {
        if (nextDateSwitchDisables.value) {
          return;
        }
      } else {
        if (prevDateSwitchDisables.value) {
          return;
        }
      }
      switch (dateRangeType.value) {
        case DateRangeType.year: {
          currentMoment.value = currentMoment.value.clone().add(step, 'year');
          break;
        }
        case DateRangeType.quarter: {
          currentMoment.value = currentMoment.value.clone().add(step, 'quarter');
          break;
        }
        case DateRangeType.month: {
          currentMoment.value = currentMoment.value.clone().add(step, 'month');
          break;
        }
        default:
          break;
      }
    },
    onDisplayDataType(type: DisplayDataType) {
      displayDataType.value = type;
    },
    animateNumberFormater(val: any) {
      return formatAmount(val, 'None');
    },
    onBubbleMonth(month: number) {
      bubbleSelectedMonth.value = month;
      bubblePopoverVisible.value = false;
      methods.queryProjectDistributionBubble(month >= 0 ? month : undefined);
    },
    displayDatsStr() {
      let dateStrs: string[] = [];
      let type: unitOfTime.StartOf = null;
      let group_by: 'day' | 'month' = 'month';
      const format = 'yyyy-MM-DD';
      switch (dateRangeType.value) {
        case DateRangeType.year: {
          type = 'year';
          break;
        }
        case DateRangeType.quarter: {
          type = 'quarter';
          break;
        }
        case DateRangeType.month: {
          type = 'month';
          group_by = 'day';
          break;
        }
      }

      let dataTyp = 0;
      switch (displayDataType.value) {
        case DisplayDataType.income:
          dataTyp = 1;
          break;
        case DisplayDataType.cost:
          dataTyp = 2;
          break;
        case DisplayDataType.profit:
          dataTyp = 3;
          break;
        default:
          break;
      }

      const startMoment = currentMoment.value.clone().startOf(type);
      const endMoment = currentMoment.value.clone().endOf(type);
      dateStrs = [
        startMoment.format(format),
        endMoment.format(format),
        group_by,
        dataTyp.toString(),
      ];
      return dateStrs;
    },
    currentDatsStr(month: number | undefined = undefined) {
      let dateStrs: string[] = [];
      const format = 'yyyy-MM-DD';
      const operatorMoment = month === undefined ? moment() : moment().month(month);
      const startMoment = operatorMoment.clone().startOf(month === undefined ? 'year' : 'month');
      const endMoment = operatorMoment.clone().endOf('month');
      dateStrs = [startMoment.format(format), endMoment.format(format)];
      return dateStrs;
    },
    transformFenToYuan(val: number | null) {
      if (!val) {
        return val;
      }
      return +new Decimal(val).div(new Decimal(100)).toNumber().toFixed(2);
    },
    resetSuntrustData(sunburstData: DashboardSunburstDataModel[]) {
      let data = sunburstData;
      if (data) {
        data = data.map(el => {
          if (el.children) {
            el.children = el.children.map(subEl => {
              if (subEl.value) {
                subEl.value = methods.transformFenToYuan(subEl.value);
              }
              return subEl;
            });
          }
          return el;
        });
      }
      sunBurstData.value = data;
    },
    resetTrendData(trendData: DashboardGMVTrendModel) {
      const data = trendData;
      if (data.datas) {
        data.datas = data.datas.map(el => {
          el.value = el.value.map(amount => methods.transformFenToYuan(amount));
          return el;
        });
      }
      gmvTrendData.value = data;
    },
    formatAmount,
  };

  const prevDateSwitchDisables = computed(() => {
    const minYear = '2022-01-01';
    switch (dateRangeType.value) {
      case DateRangeType.year: {
        const minMoment = moment(minYear).startOf('year');
        return currentMoment.value.isSameOrBefore(minMoment, 'year');
      }
      case DateRangeType.quarter: {
        const minMoment = moment(minYear).startOf('quarter');
        return currentMoment.value.isSameOrBefore(minMoment, 'quarter');
      }
      case DateRangeType.month: {
        const minMoment = moment(minYear).startOf('year');
        return currentMoment.value.isSameOrBefore(minMoment, 'month');
      }
    }
    return false;
  });
  const nextDateSwitchDisables = computed(() => {
    switch (dateRangeType.value) {
      case DateRangeType.year: {
        const maxMoment = moment().endOf('year');
        return currentMoment.value.isSameOrAfter(maxMoment, 'year');
      }
      case DateRangeType.quarter: {
        const maxMoment = moment().endOf('quarter');
        return currentMoment.value.isSameOrAfter(maxMoment, 'quarter');
      }
      case DateRangeType.month: {
        const maxMoment = moment().endOf('month');
        return currentMoment.value.isSameOrAfter(maxMoment, 'month');
      }
    }
    return false;
  });

  return {
    isCurrentMonth,
    monthOptions,
    dateRangeType,
    displayDate,
    displayDataType,
    displayDataTypeStr,
    sunBurstLoading,
    trendLoading,
    profitRatioLoading,
    laborEffectLoading,
    projectBubbleLoading,
    overviewData,
    sunBurstData,
    gmvTrendData,
    profitRatioData,
    laborEffectData,
    projectBubbleData,
    bubbleSelectedMonth,
    bubblePopoverVisible,
    prevDateSwitchDisables,
    nextDateSwitchDisables,
    noPerCapitaData,
    ...methods,
  };
};
