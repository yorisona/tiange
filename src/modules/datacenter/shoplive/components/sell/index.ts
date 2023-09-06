import { defineComponent, ref, watch } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import moment from 'moment';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Table from '@/modules/datacenter/commodityAnalysis/popular/table.vue';
import {
  IHotEveryWeek,
  IThirdCategory,
  IWeekPopularParams,
} from '@/modules/datacenter/commodityAnalysis/types';
import { wait } from '@/utils/func';
import { HotStyleEveryWeek } from '@/services/datacenter';
import {
  GetShopLiveSellGmvComletionRateDailyGroundList,
  GetShopLiveSellStatisticsList,
  GetShopLiveSellStatisticsTrendsList,
} from '@/services/datacenter/shoplive';

const colors = [
  '#fdf9df',
  '#e9f9fc',
  '#f0f8f3',
  '#eff3fd',
  '#fef3e7',
  '#fef0fb',
  '#e5fdf3',
  '#deedff',
  '#f5f4da',
  '#fee2e2',
];
export default defineComponent({
  name: 'sellIndex',
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
    Table,
  },
  setup(props, ctx) {
    const singleTable = ref<any>(null);
    const project_id = ref(0);
    const project_name = ref('');
    const list = ref<any[]>([]);
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
          // borderColor: 'transparent',
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
                Number(data || 0) +
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
        right: 68,
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
          name: 'GMV：元',
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
            padding: [0, 30, 12, 6],
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
          name: '订单数',
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
            type: 'line',
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}',
          },
          nameTextStyle: {
            padding: [0, 0, 12, 40],
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
            const titlestr = show_time_arr.value[index] || '';
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
            padding: [0, 24, 12, 0],
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
        },
        {
          type: 'value',
          name: '目标完成率',
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
            type: 'line',
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}%',
          },
          nameTextStyle: {
            padding: [0, 6, 12, 20],
          },
        },
      ],
      series: [] as any[],
    });
    const unitY = ref(AxisUnit.yuan);
    const unitYStr = ref(AxisUnit.yuan);
    const trendLoading = ref(false);
    const detailLoading = ref(false);
    const daytrendLoading = ref(false);
    const getTrendList = () => {
      unitY.value = AxisUnit.yuan;
      trendLoading.value = true;
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const select_str = props.analyseType === 1 ? 'w' : 'M';
      const start_time = select_currentDate.startOf(select_str).format(dateFormat);
      const end_time = select_currentDate.endOf(select_str).format(dateFormat);
      project_names.value = [];
      GetShopLiveSellStatisticsTrendsList({
        start_date: start_time,
        end_date: end_time,
        third_department_id: props.projectGroundId !== 0 ? props.projectGroundId : undefined,
        business_type: props.business_type,
      }).then(({ data }) => {
        trendLoading.value = false;
        if (data.success) {
          const gmv_arr = ref<any[]>([]);
          const pre_gmv_arr = ref<any[]>([]);
          const order_arr = ref<any[]>([]);
          const pre_order_arr = ref<any[]>([]);
          const gmv_all_list = data.data.datas;
          gmv_all_list.forEach((item: any) => {
            const gmv_amount = item[0] || 0;
            const pre_gmv_amount = item[1] || 0;
            const iswantype =
              Number(gmv_amount) > 1000000 ? true : Number(pre_gmv_amount) > 1000000 ? true : false;
            if (iswantype) {
              unitY.value = AxisUnit.wan;
            }
            const gmv_amount_num = item[0] ? item[0] / 100 : 0;
            const pre_gmv_amount_num = item[1] ? item[1] / 100 : 0;
            const order_amount = item[2] ? item[2] : 0;
            const pre_order_amount = item[3] ? item[3] : 0;
            gmv_arr.value.push(gmv_amount_num);
            pre_gmv_arr.value.push(pre_gmv_amount_num);
            order_arr.value.push(order_amount);
            pre_order_arr.value.push(pre_order_amount);
          });
          const obj = [
            {
              name: props.analyseType === 2 ? '本月GMV' : '本周GMV',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#2877FF',
              // stack: 'Total',
              data: gmv_arr.value,
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: props.analyseType === 2 ? '上月GMV' : '上周GMV',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#4FCA50',
              // stack: 'Total',
              data: pre_gmv_arr.value,
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: props.analyseType === 2 ? '本月订单数' : '本周订单数',
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
              data: order_arr.value,
            },
            {
              name: props.analyseType === 2 ? '上月订单数' : '上周订单数',
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
              data: pre_order_arr.value,
            },
          ];
          project_names.value = data.data.projects || [];
          baseOptions.value.xAxis.data = data.data.projects || [];
          baseOptions.value.yAxis[0].name = 'GMV：' + '' + unitY.value;
          const arr: any[] = gmv_all_list.filter((el: any) => {
            return el[0] !== null || el[1] !== null || el[2] !== null || el[3] !== null;
          });
          baseOptions.value.series = arr.length > 0 ? obj : [];
          baseOptions.value.dataZoom[0].end =
            project_names.value.length > 18 ? 50 : project_names.value.length > 10 ? 70 : 100;
        } else {
          baseOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      detailLoading.value = true;
      GetShopLiveSellStatisticsList({
        start_date: start_time,
        end_date: end_time,
        statistics_cycle: props.analyseType === 1 ? 2 : 3,
        third_department_id: props.projectGroundId !== 0 ? props.projectGroundId : undefined,
        business_type: props.business_type,
      }).then(({ data }) => {
        detailLoading.value = false;
        if (data.success) {
          list.value = data.data || [];
          if (list.value.length > 0) {
            project_id.value = list.value[0].project_id;
            project_name.value = list.value[0].project_name;
            singleTable.value.setCurrentRow(list.value[0]);
            getOneProjectList();
            getList();
          }
        } else {
          list.value = [];
          lastData.value = [];
          list.value = [];
          project_id.value = 0;
          project_name.value = '';
          baseProjectOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    getTrendList();
    const loading = ref(false);
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
      GetShopLiveSellGmvComletionRateDailyGroundList({
        start_date: start_time,
        end_date: end_time,
        project_id: project_id.value !== 0 ? project_id.value : undefined,
      }).then(({ data }) => {
        daytrendLoading.value = false;
        if (data.success) {
          const gmv_arr = ref<any[]>([]);
          const goal_gmv_arr = ref<any[]>([]);
          const rate_arr = ref<any[]>([]);
          const gmv_all_list = data.data.datas;
          unitYStr.value = AxisUnit.yuan;
          gmv_all_list.forEach((item: any) => {
            const gmv_amount = item[0] || 0;
            const goal_gmv_amount = item[1] || 0;
            const iswantype =
              Number(gmv_amount) > 1000000
                ? true
                : Number(goal_gmv_amount) > 1000000
                ? true
                : false;
            if (iswantype) {
              unitYStr.value = AxisUnit.wan;
            }
            const gmv_amount_num = item[0] ? item[0] / 100 : 0;
            const goal_gmv_amount_num = item[1] ? item[1] / 100 : 0;
            const rate_num = item[2] ? item[2] : 0;
            gmv_arr.value.push(gmv_amount_num);
            goal_gmv_arr.value.push(goal_gmv_amount_num);
            rate_arr.value.push(rate_num);
          });
          const objproject = [
            {
              name: '完成GMV',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#2877FF',
              // stack: 'Total',
              data: gmv_arr.value,
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              name: '目标GMV',
              type: 'bar',
              barMaxWidth: '22',
              barMinWidth: '8',
              barGap: 0.2,
              barCategoryGap: '45%',
              color: '#4FCA50',
              // stack: 'Total',
              data: goal_gmv_arr.value,
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
              data: rate_arr.value,
            },
          ];
          baseProjectOptions.value.yAxis[0].name = '单位：' + '' + unitYStr.value;
          const arr: any[] = gmv_all_list.filter((el: any) => {
            return el[0] !== null || el[1] !== null || el[2] !== null;
          });
          baseProjectOptions.value.series = arr.length > 0 ? objproject : [];
          show_time_arr.value = data.data.dates || [];
        } else {
          baseProjectOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };

    //top对比
    const cateList = ref<IThirdCategory[]>([]);
    const lastWeekNum = ref<string>(moment().weekday(-7).format('WW'));
    const lastLastWeekNum = ref<string>(moment().weekday(-14).format('WW'));
    const lastLastData = ref<IHotEveryWeek[]>([]);
    const lastData = ref<IHotEveryWeek[]>([]);
    // 给列表样式赋值
    const rowColors = ({ row }: { row: any }) => {
      let styleJson: any = {};
      if (lastLastData.value.length > 0 && lastData.value.length > 0) {
        const preWeek = new Set(lastLastData.value);
        const nextWeek = new Set(lastData.value);
        // @ts-ignore
        const sameArr = [...nextWeek].filter(x => [...preWeek].some(y => y.item_id === x.item_id));
        sameArr.map((item: any, index: number) => {
          if (row.item_id === item.item_id) {
            styleJson = { 'background-color': `${colors[index]}` };
          }
        });
        return styleJson;
      }
    };

    const getList = async () => {
      const select_currentDate = moment(props.selectDate);
      const select_one_currentDate = moment(props.selectDate);
      lastWeekNum.value =
        props.analyseType === 1
          ? select_one_currentDate.format('WW')
          : select_one_currentDate.format('MM');
      lastLastWeekNum.value =
        props.analyseType === 1
          ? select_one_currentDate.weekday(-7).format('WW')
          : select_one_currentDate.add(-1, 'months').format('MM');
      const dateFormat = 'yyyy-MM-DD';
      const select_str = props.analyseType === 1 ? 'w' : 'M';
      const start_time = select_currentDate.startOf(select_str).format(dateFormat);
      const end_time = select_currentDate.endOf(select_str).format(dateFormat);
      const payload: IWeekPopularParams = {
        project_id: String(project_id.value || ''),
        start_date: start_time,
        end_date: props.analyseType === 2 ? end_time : undefined,
        business_type: props.business_type,
        sort: 'shop_gmv',
      };
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        HotStyleEveryWeek(payload, props.analyseType === 2),
      );
      loading.value = false;
      if (response.success) {
        lastData.value = response.data.shop_live_douyin_items || [];
        lastLastData.value = response.data.last_week_shop_live_douyin_items || [];
      } else {
        lastData.value = [];
        lastLastData.value = [];
        ctx.root.$message({
          type: 'warning',
          message: response.message || '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    watch(
      () => [props.selectDate, props.projectGroundId, props.business_type],
      () => {
        lastLastData.value = [];
        lastData.value = [];
        baseProjectOptions.value.series = [];
        project_name.value = '';
        project_id.value = 0;
        baseOptions.value.series = [];
        list.value = [];
        baseProjectOptions.value.series = [];
        getTrendList();
      },
    );
    const onViewBtnClick = (row: any) => {
      singleTable.value.setCurrentRow(row);
      project_id.value = row.project_id;
      project_name.value = row.project_name;
      lastLastData.value = [];
      lastData.value = [];
      baseProjectOptions.value.series = [];
      getOneProjectList();
      getList();
    };
    return {
      singleTable,
      daytrendLoading,
      onViewBtnClick,
      project_name,
      project_id,
      detailLoading,
      getList,
      baseProjectOptions,
      lastLastWeekNum,
      lastWeekNum,
      lastLastData,
      lastData,
      rowColors,
      cateList,
      loading,
      list,
      baseOptions,
      trendLoading,
      formatAmount,
    };
  },
});
