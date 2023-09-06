import { computed, defineComponent, ref } from '@vue/composition-api';
import { FeiShuDepartment } from '@/types/tiange/live';
import { GetFeishuDepartmentList } from '@/services/live';
import { departmentFilterDisabled } from '@/utils/filter';
import { ElTree } from 'element-ui/types/tree';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { QueryProjectGMVCompletionRate, QueryProjectGMVCompletionTrend } from '@/services/finance';
import moment from 'moment';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import { formatAmount } from '@/utils/string';

export default defineComponent({
  name: 'gmvEcharts',
  components: { BaseEcharts },
  setup(_, ctx) {
    const gmv_all_list = ref<any[]>([]);
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const getFeishuDepartmentList = async () => {
      const res = await GetFeishuDepartmentList({});
      const list = res.data.data.data;
      //设置一级选项不让选择
      departmentFilterDisabled(list, true, 3);
      feishuDepartmentList.value = list;
    };
    getFeishuDepartmentList();
    const is_three_department: any = ref(false);
    const feishu_department_id: any = ref('');
    const feishu_department_name: any = ref('');
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    const cb_department_tree = ref<ElTree<number, FeiShuDepartment> | undefined>(undefined);
    const handleCheckChange = (data: FeiShuDepartment) => {
      cb_department_tree.value?.setCheckedKeys([]);
      if (data.id === feishu_department_id.value) {
        feishu_department_id.value = undefined;
        feishu_department_name.value = '';
        is_three_department.value = false;
      } else {
        feishu_department_id.value = data.id;
        is_three_department.value = data.level === 3;
        feishu_department_name.value = data.name;
        cb_department_tree.value?.setCheckedKeys([data.id]);
      }
    };
    const default_checked_department_ids = computed(() => {
      return feishu_department_id.value ? [feishu_department_id.value] : [];
    });
    const resetDepartment = () => {
      feishu_department_id.value = undefined;
      feishu_department_name.value = '';
      cb_department_tree.value?.setCheckedKeys([]);
      getGMVList();
    };
    const unitY = ref(AxisUnit.yuan);
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-des-color)',
          },
        },
        formatter(params: any) {
          let res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px">${params[0].axisValue}</div>`;
          let seriesName, color, data;
          for (let i = 0; i < params.length; i++) {
            color = params[i].color;
            seriesName = params[i].seriesName;
            data = params[i].data;
            if (i === params.length - 1) {
              res +=
                '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                color +
                '"></div>' +
                seriesName +
                '：' +
                '<div style="color: var(--text-color);font-weight: 400;"> ' +
                formatAmount(Number(data || 0), 'None') +
                '% </div>' +
                '</div>';
            } else {
              res +=
                '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                color +
                '"></div>' +
                seriesName +
                '：' +
                '<div style="color: var(--text-color);font-weight: 400;">  ¥ ' +
                formatAmount(Number(data || 0), 'None') +
                '</div>' +
                '</div>';
            }
          }
          return res;
        },
        textStyle: {
          color: '#343F4C',
          fontSize: 14,
          fontWeight: 'bold',
        },
        extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
      },
      legend: {
        show: true,
        // data: props.xData ?? [],
        right: '0',
        top: '0',
        type: 'scroll',
        width: 500,
        itemGap: 20,
        itemWidth: 20,
      },
      grid: {
        left: 68,
        right: 48,
        bottom: 30,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ] as string[],
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
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0,156,255,0.02)', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0,156,255,0.15)', // 100% 处的颜色
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
          color: '#6A7B92',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '单位：元',
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
          nameTextStyle: {
            padding: [0, 22, 10, 0],
          },
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
        {
          type: 'value',
          position: 'right',
          alignTicks: true,
          splitLine: {
            lineStyle: {
              type: [6, 5],
              color: '#F2F2F2',
              cap: 'round',
              dashOffset: 6,
            },
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [] as any[],
    });
    const currentYear = moment().add(0, 'years').get('year');
    //.add(1, 'months')
    const currentMonth = moment().get('month') + 1;
    const all_total_gmv = ref('');
    const all_completion_rate = ref(0);
    const all_total_goal_gmv = ref('');
    const month_total_gmv = ref('');
    const month_completion_rate = ref(0);
    const month_total_goal_gmv = ref('');
    const trendLoading = ref(true);
    const TargetLoading = ref(true);
    const MonthLoading = ref(true);
    //获取全年的数据
    const getGMVList = () => {
      TargetLoading.value = true;
      MonthLoading.value = true;
      QueryProjectGMVCompletionRate({
        second_department_id: is_three_department.value ? undefined : feishu_department_id.value,
        third_department_id: is_three_department.value ? feishu_department_id.value : undefined,
        start_date: currentYear + '-01-01',
        end_date: currentYear + '-12-31',
      }).then(({ data }) => {
        TargetLoading.value = false;
        if (data.success) {
          all_total_gmv.value = data.data.total_gmv;
          all_total_goal_gmv.value = data.data.total_goal_gmv;
          all_completion_rate.value = Number(Number(data.data.completion_rate || 0).toFixed(2));
          parentClick();
        } else {
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      //获取到当月的数据
      const currentDate = moment(currentYear + '-' + currentMonth + '-01');
      const dateFormat = 'yyyy-MM-DD';
      const end_time = String(currentDate.endOf('M').format(dateFormat));
      QueryProjectGMVCompletionRate({
        second_department_id: is_three_department.value ? undefined : feishu_department_id.value,
        third_department_id: is_three_department.value ? feishu_department_id.value : undefined,
        start_date: currentYear + '-01-01',
        end_date: end_time,
      }).then(({ data }) => {
        MonthLoading.value = false;
        if (data.success) {
          month_total_gmv.value = data.data.total_gmv;
          month_total_goal_gmv.value = data.data.total_goal_gmv;
          month_completion_rate.value = Number(Number(data.data.completion_rate || 0).toFixed(2));
          parentMonthClick();
        } else {
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      unitY.value = AxisUnit.yuan;
      trendLoading.value = true;
      QueryProjectGMVCompletionTrend({
        second_department_id: is_three_department.value ? undefined : feishu_department_id.value,
        third_department_id: is_three_department.value ? feishu_department_id.value : undefined,
        start_date: currentYear + '-01-01',
        end_date: currentYear + '-12-31',
      }).then(({ data }) => {
        trendLoading.value = false;
        if (data.success) {
          const completion_rate_arr = ref<any[]>([]);
          const gmv_arr = ref<any[]>([]);
          const goal_gmv_arr = ref<any[]>([]);
          const settlement_gmv_arr = ref<any[]>([]);
          gmv_all_list.value = data.data.datas;
          gmv_all_list.value.forEach((item: any) => {
            const gmv_amount = item.gmv || 0;
            const settlement_gmv_amount = item.settlement_gmv || 0;
            const goal_gmv_amount = item.goal_gmv || 0;
            const iswantype =
              Number(gmv_amount) > 1000000
                ? true
                : Number(settlement_gmv_amount) > 1000000
                ? true
                : Number(goal_gmv_amount) > 1000000
                ? true
                : false;
            if (iswantype) {
              unitY.value = AxisUnit.wan;
            }
            completion_rate_arr.value.push(
              item.completion_rate || item.completion_rate === 0
                ? Number(item.completion_rate || '0')
                : undefined,
            );
            const gmv_amount_num = item.gmv || item.gmv === 0 ? item.gmv / 100 : undefined;
            const settlement_gmv_amount_num =
              item.settlement_gmv || item.settlement_gmv === 0
                ? item.settlement_gmv / 100
                : undefined;
            const goal_gmv_amount_num =
              item.goal_gmv || item.goal_gmv === 0 ? item.goal_gmv / 100 : undefined;
            gmv_arr.value.push(gmv_amount_num);
            goal_gmv_arr.value.push(goal_gmv_amount_num);
            settlement_gmv_arr.value.push(settlement_gmv_amount_num);
          });
          const obj = [
            {
              name: '目标GMV',
              type: 'bar',
              barMaxWidth: '28',
              barMinWidth: '8',
              barGap: 0.4,
              barCategoryGap: '30%',
              color: '#4FCA50',
              // stack: 'Total',
              data: goal_gmv_arr.value,
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: '完成GMV',
              type: 'bar',
              barMaxWidth: '28',
              barMinWidth: '8',
              barGap: 0.4,
              barCategoryGap: '30%',
              color: '#2877FF',
              // stack: 'Total',
              data: gmv_arr.value,
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: '结算GMV',
              type: 'bar',
              barMaxWidth: '28',
              barGap: 0.4,
              barCategoryGap: '30%',
              barMinWidth: '8',
              color: '#FF7F00',
              // stack: 'Total',
              data: settlement_gmv_arr.value,
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: '目标完成率',
              type: 'line',
              smooth: true,
              showSymbol: false,
              yAxisIndex: 1,
              itemStyle: {
                color: '#FF7F00',
              },
              lineStyle: {
                width: 3,
                shadowColor: '#FF7F003d',
                shadowOffsetX: 0,
                shadowOffsetY: 11,
                shadowBlur: 11,
              },
              data: completion_rate_arr.value,
            },
          ];
          baseOptions.value.yAxis[0].name = '单位：' + '' + unitY.value;
          baseOptions.value.series = obj;
        } else {
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    setTimeout(() => {
      getGMVList();
    }, 100);
    const allTargetInterval = ref();
    const allMonthInterval = ref();
    const allMonthIndexInterval = ref();
    const allTargetIndexInterval = ref();
    const tagetdeg = ref<any>(undefined);
    const monthdeg = ref<any>(undefined);
    const targetnewdeg = ref(0);
    const monthnewdeg = ref(0);
    const targetIndex = ref(0);
    const monthIndex = ref(0);
    const parentClick = () => {
      if (allTargetInterval.value) {
        clearInterval(allTargetInterval.value);
      }
      if (allTargetIndexInterval.value) {
        clearInterval(allTargetIndexInterval.value);
      }
      targetnewdeg.value = 0;
      targetIndex.value = 0;
      allTargetInterval.value = setInterval(funTarget, 10);
      allTargetIndexInterval.value = setInterval(funTargetIndex, 10);
    };
    const parentMonthClick = () => {
      if (allMonthInterval.value) {
        clearInterval(allMonthInterval.value);
      }
      if (allMonthIndexInterval.value) {
        clearInterval(allMonthIndexInterval.value);
      }
      monthnewdeg.value = 0;
      monthIndex.value = 0;
      allMonthInterval.value = setInterval(funMonth, 10);
      allMonthIndexInterval.value = setInterval(funMonthIndex, 10);
    };
    const funTarget = () => {
      const box = tagetdeg.value as any;
      if (box) {
        const deg = targetnewdeg.value;
        box.style.transform = `rotate(${deg}deg)`;
        box.style.transformOrigin = '145px 3px';
        if (Number(all_completion_rate.value || 0) <= 0) {
          clearInterval(allTargetInterval.value);
          return;
        }
        targetnewdeg.value = deg + 1;
        const tagdeg = (180 * Number(all_completion_rate.value || 0)) / 120;
        const max_arr = []; //一个角度
        let maxdeg = tagdeg;
        //按格数显示
        for (let i = 1; i <= 24; i++) {
          max_arr.push(i * 7.5);
          if (tagdeg < i * 7.5) {
            maxdeg = (i - 1) * 7.5 + 2;
            if (tagdeg > (i - 1) * 7.5 + 4) {
              maxdeg = i * 7.5;
            }
            break;
          }
        }
        if (maxdeg >= 180) {
          maxdeg = 183;
        }
        if (targetnewdeg.value >= maxdeg + 1 || targetnewdeg.value > 184) {
          clearInterval(allTargetInterval.value);
        }
      }
    };

    const funMonth = () => {
      const box = monthdeg.value as any;
      if (box) {
        const deg = monthnewdeg.value;
        box.style.transform = `rotate(${deg}deg)`;
        box.style.transformOrigin = '145px 3px';
        if (Number(month_completion_rate.value || 0) <= 0) {
          clearInterval(allMonthInterval.value);
          return;
        }
        monthnewdeg.value = deg + 1;
        const tagdeg = (180 * Number(month_completion_rate.value || 0)) / 120;
        const max_arr = []; //一个角度
        let maxdeg = tagdeg;
        //按格数显示
        for (let i = 1; i <= 24; i++) {
          max_arr.push(i * 7.5);
          if (tagdeg < i * 7.5) {
            maxdeg = (i - 1) * 7.5 + 2;
            if (tagdeg > (i - 1) * 7.5 + 4) {
              maxdeg = i * 7.5;
            }
            break;
          }
        }
        if (maxdeg >= 180) {
          maxdeg = 183;
        }
        if (monthnewdeg.value >= maxdeg) {
          clearInterval(allMonthInterval.value);
        }
      }
    };
    const funTargetIndex = () => {
      if (
        (targetIndex.value >= Number(all_completion_rate.value || 0) - 1 &&
          targetIndex.value <= Number(all_completion_rate.value || 0)) ||
        targetIndex.value > 200
      ) {
        targetIndex.value = Number(all_completion_rate.value || 0);
        clearInterval(allTargetIndexInterval.value);
        return;
      }
      targetIndex.value = targetIndex.value + 1;
    };
    const funMonthIndex = () => {
      if (
        (monthIndex.value >= Number(month_completion_rate.value || 0) - 1 &&
          monthIndex.value <= Number(month_completion_rate.value || 0)) ||
        monthIndex.value > 200
      ) {
        monthIndex.value = Number(month_completion_rate.value || 0);
        clearInterval(allMonthIndexInterval.value);
        return;
      }
      monthIndex.value = monthIndex.value + 1;
    };
    return {
      currentMonth,
      parentClick,
      tagetdeg,
      monthdeg,
      formatAmount,
      trendLoading,
      TargetLoading,
      MonthLoading,
      baseOptions,
      unitY,
      all_total_gmv,
      all_completion_rate,
      all_total_goal_gmv,
      month_total_gmv,
      month_completion_rate,
      month_total_goal_gmv,
      getGMVList,
      allTargetInterval,
      allMonthInterval,
      allMonthIndexInterval,
      allTargetIndexInterval,
      targetIndex,
      monthIndex,
      resetDepartment,
      feishuDepartmentList,
      handleCheckChange,
      cb_department_tree,
      treeProps,
      feishu_department_id,
      feishu_department_name,
      default_checked_department_ids,
    };
  },
});
