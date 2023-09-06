import { defineComponent, ref, watch } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import {
  GetShopLiveChangeStatisticsTrendsList,
  GetShopLiveChangeDayStatisticsTrendsList,
  GetShopLiveChangeStatisticsList,
  GetShopLiveChangeProjectStatisticsList,
} from '@/services/datacenter/shoplive';
import moment from 'moment';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import sunburst from '@/modules/datacenter/shoplive/components/sunburst/index.vue';
import funnel_item_1 from '@/assets/img/datacenter/funnel_item_1.png';
import funnel_item_2 from '@/assets/img/datacenter/funnel_item_2.png';
import funnel_item_3 from '@/assets/img/datacenter/funnel_item_3.png';
import funnel_item_4 from '@/assets/img/datacenter/funnel_item_4.png';
import funnel_item_5 from '@/assets/img/datacenter/funnel_item_5.png';
import funnel_item_arrow_bottom from '@/assets/img/datacenter/funnel_item_arrow_bottom.png';
import funnel_item_arrow_right from '@/assets/img/datacenter/funnel_item_arrow_right.png';
import funnel_item_arrow_top from '@/assets/img/datacenter/funnel_item_arrow_top.png';
import formatPriceForm from '@/utils/formatData';

export default defineComponent({
  name: 'changeIndex',
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
    const singleTable = ref<any>(null);
    const project_id = ref(0);
    const project_name = ref('');
    const list = ref<any[]>([]);
    const project_trends = ref<any>({});
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
          name: '观看-点击率',
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
            formatter: '{value}%',
          },
        },
        {
          type: 'value',
          name: '观看-成交率',
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
          axisPointer: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
          },
          nameTextStyle: {
            padding: [0, 6, 12, 12],
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
            color: 'var(--text-des-color)',
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
          name: '观看-点击率',
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
          axisPointer: {
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
            formatter: '{value}%',
          },
        },
        {
          type: 'value',
          name: '观看-成交率',
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
          nameTextStyle: {
            padding: [0, 6, 12, 12],
          },
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [] as any[],
    });
    const unitY = ref(AxisUnit.yuan);
    const trendLoading = ref(false);
    const daytrendLoading = ref(false);
    const detailLoading = ref(false);
    const loudouLoading = ref(false);
    const getTrendList = () => {
      unitY.value = AxisUnit.yuan;
      trendLoading.value = true;
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const select_str = props.analyseType === 1 ? 'w' : 'M';
      const start_time = select_currentDate.startOf(select_str).format(dateFormat);
      const end_time = select_currentDate.endOf(select_str).format(dateFormat);
      project_names.value = [];
      GetShopLiveChangeStatisticsTrendsList({
        start_date: start_time,
        end_date: end_time,
        statistics_cycle: props.analyseType === 1 ? 2 : 3,
        department_id: props.projectGroundId !== 0 ? props.projectGroundId : undefined,
        business_type: props.business_type,
      }).then(({ data }) => {
        trendLoading.value = false;
        if (data.success) {
          const obj = [
            {
              name: props.analyseType === 2 ? '本月观看-点击率' : '本周观看-点击率',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#2877FF',
              // stack: 'Total',
              data: (data.data.present_watch_click_ratio || []).map((item: number) => {
                return item || 0;
              }),
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: props.analyseType === 2 ? '上月观看-点击率' : '上周观看-点击率',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#4FCA50',
              // stack: 'Total',
              data: (data.data.history_watch_click_ratio || []).map((item: number) => {
                return item || 0;
              }),
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: props.analyseType === 2 ? '本月观看-成交率' : '本周观看-成交率',
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
              data: (data.data.present_watch_pay_ratio || []).map((item: number) => {
                return item || 0;
              }),
            },
            {
              name: props.analyseType === 2 ? '上月观看-成交率' : '上周观看-成交率',
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
              data: (data.data.history_watch_pay_ratio || []).map((item: number) => {
                return item || 0;
              }),
            },
          ];
          project_names.value = data.data.project_names || [];
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
      GetShopLiveChangeStatisticsList({
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
            project_name.value = list.value[0].project_name;
            project_id.value = list.value[0].project_id;
            getOneProjectList();
          }
        } else {
          list.value = [];
          project_name.value = '';
          project_id.value = 0;
          project_trends.value = {
            history: undefined,
            present: undefined,
          };
          baseProjectOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
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
      GetShopLiveChangeDayStatisticsTrendsList({
        start_date: start_time,
        end_date: end_time,
        statistics_cycle: props.analyseType === 1 ? 2 : 3,
        project_id: project_id.value !== 0 ? project_id.value : undefined,
        business_type: props.business_type,
      }).then(({ data }) => {
        daytrendLoading.value = false;
        if (data.success) {
          const objproject = [
            {
              name: '观看-点击率',
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
              data: (data.data.watch_click_ratio || []).map((item: number) => {
                return item || 0;
              }),
            },
            {
              name: '观看-成交率',
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
              data: (data.data.watch_pay_ratio || []).map((item: number) => {
                return item || 0;
              }),
            },
          ];
          baseProjectOptions.value.series = data.data.is_show ? objproject : [];
          show_time_arr.value = data.data.dates || [];
        } else {
          baseProjectOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      loudouLoading.value = true;
      GetShopLiveChangeProjectStatisticsList({
        start_date: start_time,
        end_date: end_time,
        statistics_cycle: props.analyseType === 1 ? 2 : 3,
        project_id: project_id.value !== 0 ? project_id.value : undefined,
        business_type: props.business_type,
      }).then(({ data }) => {
        loudouLoading.value = false;
        if (data.success) {
          project_trends.value = {
            history: data.data.history,
            present: data.data.present,
          };
        } else {
          project_trends.value = {
            history: undefined,
            present: undefined,
          };
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    getTrendList();
    const onViewBtnClick = (row: any) => {
      singleTable.value.setCurrentRow(row);
      project_id.value = row.project_id;
      project_name.value = row.project_name;
      project_trends.value = {
        history: undefined,
        present: undefined,
      };
      baseProjectOptions.value.series = [];
      getOneProjectList();
    };
    watch(
      () => [props.selectDate, props.projectGroundId, props.business_type],
      () => {
        list.value = [];
        project_name.value = '';
        project_id.value = 0;
        project_trends.value = {
          history: undefined,
          present: undefined,
        };
        baseOptions.value.series = [];
        baseProjectOptions.value.series = [];
        getTrendList();
      },
    );
    const { formatPriceToThousand } = formatPriceForm;
    return {
      singleTable,
      project_name,
      project_trends,
      project_id,
      funnel_item_1,
      funnel_item_2,
      funnel_item_3,
      funnel_item_4,
      funnel_item_5,
      funnel_item_arrow_bottom,
      funnel_item_arrow_right,
      funnel_item_arrow_top,
      onViewBtnClick,
      baseProjectOptions,
      list,
      baseOptions,
      trendLoading,
      daytrendLoading,
      detailLoading,
      formatAmount,
      formatPriceToThousand,
    };
  },
});
