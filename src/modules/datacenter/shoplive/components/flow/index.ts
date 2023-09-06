import { defineComponent, ref, watch } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import moment from 'moment';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import sunburst from '@/modules/datacenter/shoplive/components/sunburst/index.vue';
import { DashboardSunburstDataModel } from '@/types/tiange/finance/finance';
import { useSunburstColors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
import {
  GetShopLiveFlowStatisticsTrendsList,
  GetShopLiveFlowDayStatisticsTrendsList,
  GetShopLiveFlowStatisticsList,
  GetShopLiveFlowProjectSunburstList,
  GetShopLiveFlowProjectPercentSunbursDetail,
} from '@/services/datacenter/shoplive';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'flowIndex',
  props: {
    analyseType: {
      type: Number,
      default: 1,
    },
    selectDate: {
      type: String,
      default: '',
    },
    projectGroundId: {
      type: Number,
      default: 0,
    },
    business_type: {
      type: Number,
      default: undefined,
    },
  },
  components: {
    BaseEcharts,
    sunburst,
  },
  setup(props, ctx) {
    const selectosunBurstData = ref<any>([]);
    const singleTable = ref<any>(null);
    const list = ref<any[]>([]);
    const project_id = ref(0);
    const project_name = ref('');
    const project_names = ref<any>([]);
    //趋势图
    const baseOptions = ref({
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 80,
          xAxisIndex: [0],
          minValueSpan: 8,
          // maxValueSpan: 12,
          // top: 'bottom',
          height: 18,
          bottom: 10,
          textStyle: {
            show: false,
            color: 'white',
          },
          showDataShadow: false,
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-des-color)',
          },
        },
        formatter(params: any) {
          let res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${params[0].axisValue}</div>`;
          let seriesName, color, data;
          for (let i = 0; i < params.length; i++) {
            color = params[i].color;
            seriesName = params[i].seriesName;
            data = params[i].data;
            if (i === params.length - 1 || i === params.length - 2) {
              res +=
                '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                color +
                '"></div>' +
                seriesName +
                '：' +
                '<div style="color: var(--text-color);font-weight: 400;"> ' +
                formatAmount(Number(data || 0), 'None') +
                ' </div>' +
                '</div>';
            } else {
              res +=
                '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                color +
                '"></div>' +
                seriesName +
                '：' +
                '<div style="color: var(--text-color);font-weight: 400;">  ' +
                formatAmount(Number(data || 0).toFixed(0), 'None', true) +
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
        right: 120,
        top: 15,
        type: 'scroll',
        width: 800,
        itemGap: 30,
        itemWidth: 17,
        itemHeight: 14,
      },
      grid: {
        left: 68,
        right: 58,
        bottom: 60,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] as string[],
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
          color: 'var(--text-second-color)',
          formatter(name: string) {
            return project_names.value.length > 10 && name.length > 3
              ? name.slice(0, 3) + '...'
              : project_names.value.length > 6 && name.length > 4
              ? name.slice(0, 4) + '...'
              : name;
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '总观看人数',
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
          axisPointer: {
            type: 'line',
            label: {
              show: true,
            },
            lineStyle: {
              type: [6, 5],
              color: '#A4B2C2',
              cap: 'round',
            },
          },
          nameTextStyle: {
            padding: [0, 12, 12, 12],
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
          name: '人均价值',
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
          axisPointer: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}',
          },
          nameTextStyle: {
            padding: [0, 12, 12, 12],
          },
        },
      ],
      series: [] as any[],
    });
    //趋势图
    const day_arr = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
    const show_time_arr: any = ref([]);
    const baseProjectOptions = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'red',
          },
        },
        formatter(params: any) {
          let res = '';
          if (props.analyseType === 1) {
            const index = day_arr.value.findIndex((item: string) => {
              return item === params[0].axisValue;
            });
            const titlestr = String(show_time_arr.value[index]).replace(/-/g, '.') || '';
            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${params[0].axisValue} (${titlestr})</div>`;
          } else {
            const select_currentDate = moment(props.selectDate);
            const select_str = props.analyseType === 1 ? 'w' : 'M';
            const start_day = select_currentDate.startOf(select_str).format('MM');
            const title =
              params[0].axisValue.length === 2 ? '0' + params[0].axisValue : params[0].axisValue;
            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${start_day}月${title}</div>`;
          }
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
                '</div>' +
                '</div>';
            } else {
              res +=
                '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                color +
                '"></div>' +
                seriesName +
                '：' +
                '<div style="color: var(--text-color);font-weight: 400;">  ' +
                formatAmount(Number(data || 0).toFixed(0), 'None', true) +
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
        right: 120,
        top: 15,
        type: 'scroll',
        width: 800,
        itemGap: 30,
        itemWidth: 17,
        itemHeight: 14,
      },
      grid: {
        left: 68,
        right: 58,
        bottom: 24,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: day_arr.value as string[],
        axisPointer: {
          type: 'line',
          label: {
            show: false,
          },
          lineStyle: {
            type: [6, 5],
            color: '#A4B2C2',
            cap: 'round',
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
      yAxis: [
        {
          type: 'value',
          name: '总观看人数',
          position: 'left',
          splitLine: {
            lineStyle: {
              type: [6, 5],
              color: '#F2F2F2',
              cap: 'round',
              dashOffset: 6,
            },
          },
          axisPointer: {
            show: false,
          },
          alignTicks: true,
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter(value: any) {
              if (unitYStr.value === AxisUnit.wan) {
                if (value) {
                  return parseInt(value, 10) / 10000;
                }
              }
              return value;
            },
          },
          nameTextStyle: {
            padding: [0, 12, 12, 12],
          },
        },
        {
          type: 'value',
          name: '人均价值',
          position: 'right',
          axisPointer: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          alignTicks: true,
          axisLine: {
            show: false,
          },
          // axisLabel: {
          //   formatter: '{value} 元',
          // },
          nameTextStyle: {
            padding: [0, 12, 12, 12],
          },
          axisLabel: {
            formatter(value: any) {
              return value;
            },
          },
        },
      ],
      series: [] as any[],
    });
    const unitY = ref('');
    const unitYStr = ref('');
    const trendLoading = ref(false);
    const daytrendLoading = ref(false);
    const detailLoading = ref(false);
    const sunBurstLoading = ref(false);
    const sunBurstDetailLoading = ref(false);
    const sunBurstDetail = ref<any>(undefined);
    const getTrendList = () => {
      unitY.value = '';
      trendLoading.value = true;
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const select_str = props.analyseType === 1 ? 'w' : 'M';
      const start_time = select_currentDate.startOf(select_str).format(dateFormat);
      const end_time = select_currentDate.endOf(select_str).format(dateFormat);
      project_names.value = [];
      GetShopLiveFlowStatisticsTrendsList({
        start_date: start_time,
        end_date: end_time,
        statistics_cycle: props.analyseType === 1 ? 2 : 3,
        department_id: props.projectGroundId !== 0 ? props.projectGroundId : undefined,
        business_type: props.business_type,
      }).then(({ data }) => {
        trendLoading.value = false;
        if (data.success) {
          unitY.value = '';
          (data.data.present_watch_ucnt || []).forEach((item: number) => {
            const put_amount = item || 0;
            const iswantype = Number(put_amount) > 10000 ? true : false;
            if (iswantype) {
              unitY.value = '万';
            }
          });
          (data.data.history_watch_ucnt || []).forEach((item: number) => {
            const put_amount = item || 0;
            const iswantype = Number(put_amount) > 10000 ? true : false;
            if (iswantype) {
              unitY.value = '万';
            }
          });
          const obj = [
            {
              name: props.analyseType === 2 ? '本月总观看人数' : '本周总观看人数',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#2877FF',
              // stack: 'Total',
              data: (data.data.present_watch_ucnt || []).map((item: number) => {
                return item || 0;
              }),
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: props.analyseType === 2 ? '上月总观看人数' : '上周总观看人数',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#4FCA50',
              // stack: 'Total',
              data: (data.data.history_watch_ucnt || []).map((item: number) => {
                return item || 0;
              }),
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: props.analyseType === 2 ? '本月人均价值' : '本周人均价值',
              type: 'line',
              smooth: true,
              showSymbol: false,
              yAxisIndex: 1,
              itemStyle: {
                color: '#9273F8',
              },
              lineStyle: {
                width: 3,
                shadowColor: '#9273F83d',
                shadowOffsetX: 0,
                shadowOffsetY: 11,
                shadowBlur: 11,
              },
              data: (data.data.present_avg_gmv || []).map((item: number) => {
                return item || 0;
              }),
            },
            {
              name: props.analyseType === 2 ? '上月人均价格' : '上周人均价值',
              type: 'line',
              smooth: true,
              showSymbol: false,
              yAxisIndex: 1,
              itemStyle: {
                color: '#FFBF00',
              },
              lineStyle: {
                width: 3,
                shadowColor: '#FFBF003d',
                shadowOffsetX: 0,
                shadowOffsetY: 11,
                shadowBlur: 11,
              },
              data: (data.data.history_avg_gmv || []).map((item: number) => {
                return item || 0;
              }),
            },
          ];
          project_names.value = data.data.project_names || [];
          baseOptions.value.yAxis[0].name = '总观看人数' + (unitY.value ? '：' + unitY.value : '');
          baseOptions.value.xAxis.data = data.data.project_names || [];
          baseOptions.value.series = data.data.is_show ? obj : [];
          baseOptions.value.dataZoom[0].end =
            project_names.value.length > 18 ? 50 : project_names.value.length > 10 ? 70 : 100;
        } else {
          baseOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });

      detailLoading.value = true;
      GetShopLiveFlowStatisticsList({
        start_date: start_time,
        end_date: end_time,
        statistics_cycle: props.analyseType === 1 ? 2 : 3,
        department_id: props.projectGroundId !== 0 ? props.projectGroundId : undefined,
        business_type: props.business_type,
      }).then(({ data }) => {
        detailLoading.value = false;
        if (data.success) {
          list.value = data.data || [];
          if (list.value.length > 0) {
            singleTable.value.setCurrentRow(list.value[0]);
            project_id.value = list.value[0].project_id;
            project_name.value = list.value[0].project_name;
            getOneProjectList();
          }
        } else {
          list.value = [];
          project_name.value = '';
          project_id.value = 0;
          osunBurstData.value = [];
          osunBurstChildrenData.value = [];
          baseProjectOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    //旭日图

    const sunBurstData = ref<DashboardSunburstDataModel[] | undefined>(undefined);
    const osunBurstData = ref<any>([]);
    const osunBurstChildrenData = ref<any>([]);
    // const sunburstTotalAmount = ref();
    const select_flow = ref<any>(undefined);
    const flow_type = ref<any>(undefined);
    const select_flow_name = ref<any>('');
    const watch_cnt = ref<any>('');
    const { business_type } = useProjectBaseInfo();
    const getOneProjectList = () => {
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const select_str = props.analyseType === 1 ? 'w' : 'M';
      const start_time = select_currentDate.startOf(select_str).format(dateFormat);
      const end_time = select_currentDate.endOf(select_str).format(dateFormat);
      daytrendLoading.value = true;
      if (props.analyseType === 2) {
        const arr: any = ref([]);
        const end_day = select_currentDate.endOf(select_str).format('DD');
        for (let i = 1; i <= Number(end_day); i++) {
          arr.value.push(i + '日');
        }
        baseProjectOptions.value.xAxis.data = arr;
        day_arr.value = arr;
      }
      GetShopLiveFlowDayStatisticsTrendsList(
        {
          start_date: start_time,
          end_date: end_time,
          statistics_cycle: props.analyseType === 1 ? 2 : 3,
          project_id: project_id.value !== 0 ? project_id.value : undefined,
          business_type: props.business_type,
        },
        business_type.value,
      ).then(({ data }) => {
        daytrendLoading.value = false;
        if (data.success) {
          unitYStr.value = '';
          (data.data.watch_ucnt || []).forEach((item: number) => {
            const watch_num = item || 0;
            const iswantype = Number(watch_num) > 10000 ? true : false;
            if (iswantype) {
              unitYStr.value = '万';
            }
          });
          const objproject = [
            {
              name: '总观看人数',
              type: 'line',
              smooth: true,
              showSymbol: false,
              itemStyle: {
                color: '#9273F8',
              },
              lineStyle: {
                width: 3,
                shadowColor: '#9273F83d',
                shadowOffsetX: 0,
                shadowOffsetY: 11,
                shadowBlur: 11,
              },
              // stack: 'Total',
              data: (data.data.watch_ucnt || []).map((item: number) => {
                return item || 0;
              }),
            },
            {
              name: '人均价值',
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
              data: (data.data.avg_gmv || []).map((item: number) => {
                return item || 0;
              }),
            },
          ];
          baseProjectOptions.value.yAxis[0].name =
            '总观看人数' + (unitYStr.value ? '：' + unitYStr.value : '');
          baseProjectOptions.value.series = data.data.is_show ? objproject : [];
          show_time_arr.value = data.data.dates || [];
        } else {
          baseProjectOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      sunBurstLoading.value = true;
      watch_cnt.value = '';
      GetShopLiveFlowProjectSunburstList(
        {
          start_date: start_time,
          end_date: end_time,
          statistics_cycle: props.analyseType === 1 ? 2 : 3,
          project_id: project_id.value !== 0 ? project_id.value : undefined,
          business_type: props.business_type,
        },
        business_type.value,
      ).then(({ data }) => {
        sunBurstLoading.value = false;
        if (data.success) {
          sunBurstData.value = data.data;
          selectosunBurstData.value = [];
          osunBurstChildrenData.value = [];
          osunBurstData.value = (sunBurstData.value || [])
            .filter((el: any) => {
              return (el.source_data || []).find((subEl: any) => (subEl.value || 0) > 0);
            })
            .map((el: any, index: number) => {
              if (index === 0) {
                flow_type.value = el.flow_type;
                select_flow_name.value = el.flow_type_name;
                select_flow_type_name.value = el.flow_type_name;
                watch_cnt.value = el.sum_flow;
                getOneProjectDetail();
              }
              const children = ref<any>([]);
              (el.source_data || []).map((subEl: any, subElIndex: number) => {
                if ((subEl.value || 0) > 0) {
                  children.value.push({
                    name: subEl.source_name,
                    itemStyle: { color: useSunburstColors[index]?.children[subElIndex] },
                    key: subEl.source_key,
                    value: subEl.value,
                    superName: el.flow_type_name,
                  });
                }
              });
              return {
                name: el.flow_type_name,
                itemStyle: {
                  color: useSunburstColors[index]?.color,
                },
                key: el.flow_type,
                value: el.sum_flow,
                children: children.value,
              };
            });
          (sunBurstData.value || [])
            .filter((el: any) => {
              return (el.source_data || []).find((subEl: any) => (subEl.value || 0) > 0);
            })
            .map((el: any, index: number) => {
              (el.source_data || []).map((subEl: any, subElIndex: number) => {
                if ((subEl.value || 0) > 0) {
                  osunBurstChildrenData.value.push({
                    name: subEl.source_name,
                    itemStyle: {
                      color: useSunburstColors[index]?.children[subElIndex],
                    },
                    key: subEl.source_key,
                    value: subEl.value,
                    superName: el.flow_type_name,
                  });
                }
              });
            });
          selectosunBurstData.value = osunBurstData.value;
        } else {
          sunBurstData.value = [];
          osunBurstData.value = [];
          osunBurstChildrenData.value = [];
          sunBurstDetail.value = undefined;
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    getTrendList();
    const onViewBtnClick = (row: any) => {
      select_flow_name.value = '';
      watch_cnt.value = '';
      singleTable.value.setCurrentRow(row);
      flow_type.value = undefined;
      select_flow.value = undefined;
      project_id.value = row.project_id;
      project_name.value = row.project_name;
      baseProjectOptions.value.series = [];
      selectosunBurstData.value = [];
      osunBurstData.value = [];
      osunBurstChildrenData.value = [];
      sunBurstDetail.value = undefined;
      getOneProjectList();
    };
    const getOneProjectDetail = () => {
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const select_str = props.analyseType === 1 ? 'w' : 'M';
      const start_time = select_currentDate.startOf(select_str).format(dateFormat);
      const end_time = select_currentDate.endOf(select_str).format(dateFormat);

      sunBurstDetailLoading.value = true;
      GetShopLiveFlowProjectPercentSunbursDetail(
        {
          start_date: start_time,
          end_date: end_time,
          statistics_cycle: props.analyseType === 1 ? 2 : 3,
          project_id: project_id.value !== 0 ? project_id.value : undefined,
          flow_source: select_flow.value,
          flow_type: flow_type.value,
          business_type: props.business_type,
        },
        business_type.value,
      ).then(({ data }) => {
        sunBurstDetailLoading.value = false;
        if (data.success) {
          sunBurstDetail.value = JSON.stringify(data.data) === '{}' ? undefined : data.data;
        } else {
          sunBurstDetail.value = undefined;
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    watch(
      () => [props.selectDate, props.projectGroundId, props.business_type],
      () => {
        select_flow_name.value = '';
        watch_cnt.value = '';
        project_name.value = '';
        project_id.value = 0;
        baseOptions.value.series = [];
        list.value = [];
        baseProjectOptions.value.series = [];
        selectosunBurstData.value = [];
        osunBurstData.value = [];
        osunBurstChildrenData.value = [];
        sunBurstDetail.value = undefined;
        getTrendList();
      },
    );
    const select_flow_type_name = ref('');
    const selectClick = (param: any) => {
      watch_cnt.value = param.data.value || '';
      select_flow_name.value = param.data.name;
      select_flow_type_name.value = param.data.name;
      selectosunBurstData.value = [];
      if (!param.data.children) {
        select_flow.value = param.data.key;
        flow_type.value = undefined;
        select_flow_type_name.value = param.data.superName || '';
        /*(osunBurstData.value || []).map((item: any) => {
          const objselect = item.children?.find((subEl: any) => {
            return subEl.key === select_flow.value;
          });
          if (objselect && param.data.superName === item.name) {
            selectosunBurstData.value = item.children || [];
          }
        });*/
        selectosunBurstData.value = [param.data];
        getOneProjectDetail();
      } else {
        selectosunBurstData.value = param.data.children || [];
        select_flow.value = undefined;
        flow_type.value = param.data.key;
        getOneProjectDetail();
      }
    };
    const getSecondsabe = (val: string | number | null, index: number, unit: string) => {
      return typeof val === 'string'
        ? val
        : formatAmount(Number(val || 0).toFixed(index), 'None', index === 0) + unit;
    };
    const onClickAllColor = () => {
      selectosunBurstData.value = osunBurstData.value;
    };
    return {
      onClickAllColor,
      singleTable,
      getSecondsabe,
      select_flow_type_name,
      watch_cnt,
      flow_type,
      project_name,
      onViewBtnClick,
      selectClick,
      sunBurstData,
      osunBurstData,
      sunBurstLoading,
      sunBurstDetail,
      sunBurstDetailLoading,
      baseProjectOptions,
      list,
      baseOptions,
      trendLoading,
      daytrendLoading,
      detailLoading,
      select_flow_name,
      formatAmount,
      osunBurstChildrenData,
      selectosunBurstData,
    };
  },
});
