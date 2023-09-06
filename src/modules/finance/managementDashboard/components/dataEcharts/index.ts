import { defineComponent, ref } from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import moment from 'moment';
import { QueryProjectPercentSunburst, QueryProjectTeamTrend } from '@/services/finance';
import { DashboardSunburstDataModel } from '@/types/tiange/finance/finance';
import {
  useSunburstColors,
  useTrendBarBurstColors,
} from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
// import Decimal from 'decimal.js';
import sunburst from '@/modules/finance/managementDashboard/components/charts/sunburst/index.vue';
import { wait } from '@/utils/func';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import { formatAmount } from '@/utils/string';
import Decimal from 'decimal.js';

export default defineComponent({
  name: 'dataEcharts',
  props: {
    //1为收入，2为成本，3为利润
    tab_type: {
      type: Number,
      default: 1,
    },
  },
  components: { BaseEcharts, sunburst },
  setup(props, ctx) {
    const currentMonth = moment().get('month') + 1;
    const currentYear = moment().add(0, 'years').get('year');
    const month_arr = ref<string[]>([]);
    for (let i = 1; i <= Number(currentMonth); i++) {
      month_arr.value.push(i + '月');
    }
    month_arr.value.push('汇总');
    const unitY = ref(AxisUnit.yuan);
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        formatter(params: any) {
          // `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px">${params[0].axisValue}</div>`
          let res = '';
          let seriesName, color, data;
          for (let i = 0; i < params.length; i++) {
            color = params[i].color;
            seriesName = params[i].data.name;
            data = params[i].data.value;
            res +=
              '<div style="display: flex;margin-bottom: 0px;height: 20px;line-height: 20px;font-size: 12px;color:var(--text-second-color);font-weight: 400;"><div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
              color +
              '"></div>' +
              seriesName +
              '：' +
              '<div style="color: var(--text-color);font-weight: 400;">  ¥ ' +
              formatAmount(Number(data || 0), 'None') +
              '</div>' +
              '</div>';
          }
          return res;
        },
        textStyle: {
          color: 'var(--text-color)',
          fontSize: 14,
          fontWeight: 'bold',
        },
        extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
      },
      legend: {
        show: true,
      },
      grid: {
        left: 98,
        right: 70,
        top: 10,
        bottom: 30,
        containLabel: false,
      },
      yAxis: {
        type: 'category',
        // boundaryGap: false,
        data: [] as string[],
        axisPointer: {
          type: 'shadow',
          label: {
            show: false,
          },
          shadowStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0,156,255,0.15)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0,156,255,0.02)', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#F2F2F2',
          },
        },
        axisLabel: {
          color: 'var(--text-second-color)',
        },
      },
      xAxis: {
        type: 'value',
        name: `单位：${unitY.value}`,
        position: 'left',
        splitLine: {
          //   show: false,
          lineStyle: {
            type: [6, 5],
            color: '#F2F2F2',
            cap: 'round',
            dashOffset: 6,
          },
        },
        alignTicks: true,
        axisLine: {
          show: false,
        },
        // axisLabel: {
        //   formatter: '{value} 元',
        // },
        axisLabel: {
          formatter(value: any) {
            if (unitY.value === AxisUnit.wan) {
              if (value) {
                return parseInt(value, 10) / 10000;
              }
            }
            return value;
          },
        },
      },
      series: [] as any[],
    });
    const sunBurstData = ref<DashboardSunburstDataModel[] | undefined>(undefined);
    const selectMonth = ref(currentMonth + 1);
    const selectTrendMonth = ref(currentMonth + 1);
    const osunBurstData = ref();
    // const sunburstTotalAmount = ref();
    const sunBurstLoading = ref(false);
    //获取到当月的数据
    const transformFenToYuan = (val: number | null | undefined) => {
      if (!val) {
        return val;
      }
      return +new Decimal(val).div(new Decimal(100)).toNumber().toFixed(2);
    };
    const getPercentSunburstList = async () => {
      sunBurstLoading.value = true;
      let start_currentDate = moment(currentYear + '-' + selectMonth.value + '-01');
      let end_currentDate = moment(currentYear + '-' + selectMonth.value + '-01');
      if (selectMonth.value > currentMonth) {
        start_currentDate = moment(currentYear + '-01-01');
        end_currentDate = moment(currentYear + '-12-01');
      }
      const dateFormat = 'yyyy-MM-DD';
      const start_time = String(start_currentDate.startOf('M').format(dateFormat));
      const end_time = String(end_currentDate.endOf('M').format(dateFormat));
      const [res] = await wait(
        500,
        QueryProjectPercentSunburst(
          {
            start_date: start_time,
            end_date: end_time,
          },
          props.tab_type,
        ),
      );
      sunBurstLoading.value = false;
      if (res.data.success) {
        sunBurstData.value = res.data.data;
        osunBurstData.value = (sunBurstData.value ?? [])
          .filter(el => {
            return el.children?.find(subEl => (subEl.value ?? 0) > 0);
          })
          .map((el, index) => {
            return {
              name: el.project_name,
              itemStyle: {
                color: useSunburstColors[index]?.color,
              },
              value: transformFenToYuan(el.value),
              children: (el.children ?? []).map((subEl, subElIndex) => {
                return {
                  name: subEl.project_name,
                  itemStyle: {
                    color: useSunburstColors[index]?.children[subElIndex],
                  },
                  value: transformFenToYuan(subEl.value),
                };
              }),
            };
          });
        // sunburstTotalAmount.value = osunBurstData.value
        //   .flatMap((el: any) => [el, ...el.children])
        //   .reduce(
        //     (sum: any, curr: any) => sum.add(!curr.value || curr.value < 0 ? 0 : curr.value),
        //     new Decimal(0),
        //   );
      } else {
        ctx.root.$message.error(res.data.message || '数据获取失败');
      }
    };
    getPercentSunburstList();
    const teamTrend = ref<any[]>([]);
    const oteamTrend = ref<any[]>([]);
    const teamTrendLoading = ref(false);
    const getTeamTrendList = () => {
      teamTrendLoading.value = true;
      let start_currentDate = moment(currentYear + '-' + selectTrendMonth.value + '-01');
      let end_currentDate = moment(currentYear + '-' + selectTrendMonth.value + '-01');
      if (selectTrendMonth.value > currentMonth) {
        start_currentDate = moment(currentYear + '-01-01');
        end_currentDate = moment(currentYear + '-12-01');
      }
      const dateFormat = 'yyyy-MM-DD';
      const start_time = String(start_currentDate.startOf('M').format(dateFormat));
      const end_time = String(end_currentDate.endOf('M').format(dateFormat));
      QueryProjectTeamTrend(
        {
          start_date: start_time,
          end_date: end_time,
        },
        props.tab_type,
      ).then(({ data }) => {
        teamTrendLoading.value = false;
        if (data.success) {
          teamTrend.value = data.data.datas || [];
          const name_str =
            props.tab_type === 1 ? '总收入' : props.tab_type === 2 ? '总成本' : '总利润';
          const allamount = ref(1);
          oteamTrend.value = (teamTrend.value ?? []).map((el, index) => {
            const value_arr: any = [];
            const value_amount = el.value[0] || 0;
            if (index === 0 && value_amount > 0) {
              allamount.value = value_amount;
            }
            const iswantype = Number(value_amount) > 1000000 ? true : false;
            if (iswantype) {
              unitY.value = AxisUnit.wan;
            }
            const value_amount_num =
              el.value[0] || el.value[0] === 0 ? el.value[0] / 100 : undefined;
            value_arr.push(value_amount_num);
            return {
              name: el.key === '总计' ? name_str : el.key,
              itemStyle: {
                color: useTrendBarBurstColors[index],
                maxWidth: 100,
                barBorderRadius: 3,
              },
              type: 'bar',
              color: useTrendBarBurstColors[index],
              value: value_amount_num,
              label: {
                show: props.tab_type === 3 || index === 0 ? false : true,
                distance: 5,
                align: 'right',
                width: 100,
                offset: [40, 0],
                position: ['102%', '30%'],
                color: useTrendBarBurstColors[index],
                formatter(params: any) {
                  const percentage = (((params.value * 100) / allamount.value) * 100).toFixed(1);
                  return percentage + '%';
                },
              },
            };
          });
          baseOptions.value.xAxis.name = '单位：' + unitY.value;
          baseOptions.value.series = [
            {
              data: oteamTrend.value,
              type: 'bar',
              barMaxWidth: 30,
              barMinWidth: 8,
            },
          ];
          baseOptions.value.yAxis.data = data.data.datas
            ? data.data.datas.map((el: any) => {
                return el.key === '总计' ? name_str : el.key;
              })
            : [];
        } else {
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    getTeamTrendList();
    const onBubbleMonth = (val: any) => {
      selectMonth.value = val;
      getPercentSunburstList();
    };
    const onTrendBubbleMonth = (val: any) => {
      selectTrendMonth.value = val;
      getTeamTrendList();
    };
    return {
      unitY,
      useTrendBarBurstColors,
      onTrendBubbleMonth,
      selectTrendMonth,
      teamTrend,
      getTeamTrendList,
      teamTrendLoading,
      sunBurstLoading,
      // sunburstTotalAmount,
      osunBurstData,
      getPercentSunburstList,
      month_arr,
      onBubbleMonth,
      selectMonth,
      currentMonth,
      baseOptions,
    };
  },
});
