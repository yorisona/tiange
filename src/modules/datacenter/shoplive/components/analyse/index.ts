/**
 * 周/月/年分析
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import moment from 'moment';
import { DashboardSunburstDataModel } from '@/types/tiange/finance/finance';
import { wait } from '@/utils/func';
import {
  useSunburstColors,
  useBubblePieColors,
} from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
import Decimal from 'decimal.js';
import sunburst from '@/modules/datacenter/shoplive/components/sunburst/index.vue';
import { formatAmount } from '@/utils/string';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import {
  GetShopLiveDepartMentGmvSunburstGroundList,
  GetShopLiveDepartMentGmvPieGroundList,
  GetShopLiveDepartMentGmvComletionRateGroundList,
  GetShopLiveDepartMentProjectGmvGroundList,
} from '@/services/datacenter/shoplive';

const getNewGoal = (val: number, goal: number) => {
  if (!goal) {
    goal = val;
  }
  if (val > goal) {
    goal = val;
  }
  if (!val && !goal) {
    return 10000;
  }
  // @ts-ignore
  let goalstr = String((goal * 1.2).toFixed(0));
  if (goalstr.length > 7) {
    const one = Number(goalstr.substr(0, 3));
    const two = (one + 1) * Math.pow(10, Number(goalstr.length - 3));
    return two;
  } else {
    goalstr = Number(goalstr || 0) < 10000 ? '10000' : goalstr;
    const one = Number(goalstr.substr(0, 2));
    return (one + 1) * Math.pow(10, Number(goalstr.length - 2));
  }
  return goalstr;
};
export default defineComponent({
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
    projectGroundName: {
      type: String,
      default: '品牌中心',
    },
    business_type: {
      type: Number,
      default: undefined,
    },
  },
  components: {
    sunburst,
    BaseEcharts,
  },
  setup(props, ctx) {
    const selectosunBurstData = ref<any>([]);
    const selectOneProjectGroundId = ref<number | undefined>(undefined);
    const selectOneProjectGroundName = ref<number | undefined>(undefined);
    //目标完成度
    const completion_rate_obj = ref<any>({});
    const completion_rate_daily = ref<any>({});
    const all_completion_rate = ref(0);
    const echartsBurstLoading = ref(false);
    const getCompletionRate = async () => {
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const selectstr = props.analyseType === 1 ? 'w' : props.analyseType === 2 ? 'M' : 'y';
      const start_time = select_currentDate.startOf(selectstr).format(dateFormat);
      const end_time = select_currentDate.endOf(selectstr).format(dateFormat);
      echartsBurstLoading.value = true;
      const [res] = await wait(
        500,
        GetShopLiveDepartMentGmvComletionRateGroundList({
          start_date: start_time,
          end_date: end_time,
          third_department_id: props.projectGroundId !== 0 ? props.projectGroundId : undefined,
          business_type: props.business_type,
        }),
      );
      echartsBurstLoading.value = false;
      if (res.data.success) {
        completion_rate_obj.value = res.data.data.total || {};
        all_completion_rate.value = completion_rate_obj.value.completion_rate || 0;
        parentClick();
        completion_rate_daily.value = res.data.data.child || [];
      } else {
        completion_rate_obj.value = {};
        all_completion_rate.value = 0;
        completion_rate_daily.value = [];
        ctx.root.$message.error(res.data.message || '数据获取失败');
      }
    };
    getCompletionRate();

    //饼图
    const piearr = ref<any[]>([]);
    const pieOption = ref({
      /* title: {
        text: '',
        left: 'left',
      },*/
      tooltip: {
        trigger: 'item',
        formatter(params: any) {
          const data = params.data;
          const title = data.name;
          let totalAmount = 0;
          piearr.value.forEach((item: any) => {
            const value = item.value || 0;
            totalAmount = totalAmount + value;
          });
          if (!title || !totalAmount) {
            return undefined;
          }
          const radio = new Decimal(data.value ?? 0)
            .mul(new Decimal(10000))
            .div(new Decimal(totalAmount))
            .toFixed(2);
          const listItem = `
            <div style="font-size: 12px; line-height: 16px;">
              <span style="display: inline-block; font-weight: 400; color: #606974;">${title}：</span><span style="font-weight: 400; color: var(--text-color);">¥ ${formatAmount(
            data.value,
            'None',
          )}</span>
            </div>
            <div style="font-size: 12px; line-height: 16px; margin-top: 12px;">
              <span style="display: inline-block; font-weight: 400; color: #606974;">占比：</span><span style="font-weight: 400; color: var(--text-color);">${
                radio || 0
              }%</span>
            </div>
            `;

          return `
            <div style="margin: 8px; text-align: left;">
              <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${
                title ? title : '--'
              }</div>
              <div style="margin-top: 18px;">
                ${listItem}
              </div>
            </div>
          `;
        },
      },
      legend: {
        show: false,
        // type: 'scroll',
        itemGap: 20,
        width: 100,
        itemWidth: 20,
        top: 10,
        left: 400,
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          selectedMode: 'single',
          radius: ['68', '86%'],
          label: {
            show: false,
            minAngle: 8,
            width: 50,
            overflow: 'truncate',
            position: 'inside',
            formatter: (params: any) => {
              const data = params.data;
              const title = data.name;
              let totalAmount = 0;
              (piearr.value || []).map((item: any) => {
                totalAmount = (item.value || 0) + totalAmount;
              });
              if (!title || !totalAmount) {
                return '';
              }
              const radio = new Decimal(data.value || 0)
                .mul(new Decimal(100))
                .div(new Decimal(totalAmount / 100))
                .toFixed(2);
              return Number(radio) > 5 ? params.data.name : '';
            },
          },
          data: [] as any[],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });

    //旭日图
    const sunBurstData = ref<DashboardSunburstDataModel[]>([]);
    const osunBurstData = ref<any>([]);
    const osunBurstChildrenData = ref<any>([]);
    // const sunburstTotalAmount = ref();
    const sunBurstLoading = ref(false);
    const transformFenToYuan = (val: number | null | undefined) => {
      if (!val) {
        return val;
      }
      return +new Decimal(val).div(new Decimal(100)).toNumber().toFixed(2);
    };
    const getPercentSunburstList = async () => {
      sunBurstLoading.value = true;
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const selectstr = props.analyseType === 1 ? 'w' : props.analyseType === 2 ? 'M' : 'y';
      const start_time = select_currentDate.startOf(selectstr).format(dateFormat);
      const end_time = select_currentDate.endOf(selectstr).format(dateFormat);
      if (props.projectGroundId === 0) {
        const [res] = await wait(
          500,
          GetShopLiveDepartMentGmvSunburstGroundList({
            start_date: start_time,
            end_date: end_time,
            business_type: props.business_type,
          }),
        );
        sunBurstLoading.value = false;
        if (res.data.success) {
          sunBurstData.value = res.data.data || [];
          osunBurstChildrenData.value = [];
          selectosunBurstData.value = [];
          osunBurstData.value = (sunBurstData.value || [])
            .filter(el => {
              return el.children?.find(subEl => (subEl.value || 0) > 0);
            })
            .map((el: any, index: number) => {
              let valueall = 0;
              (el.children || []).map((subEl: any) => {
                const value = (subEl.value || 0) < 0 ? 0 : subEl.value;
                valueall = valueall + value;
              });
              return {
                name: el.department_name,
                itemStyle: {
                  color: useSunburstColors[index]?.color,
                },
                value: transformFenToYuan(valueall),
                /* children: ,*/
              };
            });
          (sunBurstData.value || [])
            .filter(el => {
              return el.children?.find(subEl => (subEl.value || 0) > 0);
            })
            .map((el: any, index: number) => {
              (el.children || []).map((subEl: any, subElIndex: number) => {
                if ((subEl.value || 0) > 0) {
                  osunBurstChildrenData.value.push({
                    name: subEl.project_name,
                    itemStyle: {
                      color: useSunburstColors[index]?.children[subElIndex],
                    },
                    value: transformFenToYuan(subEl.value),
                  });
                }
              });
            });
          selectosunBurstData.value = osunBurstData.value;
        } else {
          sunBurstData.value = [];
          osunBurstData.value = [];
          osunBurstChildrenData.value = [];
          ctx.root.$message.error(res.data.message || '数据获取失败');
        }
      } else {
        const [res] = await wait(
          500,
          GetShopLiveDepartMentGmvPieGroundList({
            start_date: start_time,
            end_date: end_time,
            third_department_id: props.projectGroundId,
            business_type: props.business_type,
          }),
        );
        sunBurstLoading.value = false;
        if (res.data.success) {
          piearr.value = res.data.data;
          pieOption.value.series[0].data = (piearr.value || []).map((el, index) => {
            return {
              name: el.project_name,
              itemStyle: {
                color: useBubblePieColors[index],
              },
              value: transformFenToYuan(el.value),
            };
          });
          selectosunBurstData.value = pieOption.value.series[0].data;
        } else {
          pieOption.value.series[0].data = [];
          piearr.value = [];
          ctx.root.$message.error(res.data.message || '数据获取失败');
        }
      }
    };
    getPercentSunburstList();
    const selectClick = (param: any) => {
      select_show_index.value = 1;
      if (props.projectGroundId === 0) {
        //点击旭日图
        const subobj: any = ref(undefined);
        const index = ref(0);
        const obj: any = (sunBurstData.value || [])
          .filter(el => {
            return el.children?.find(subEl => (subEl.value || 0) > 0);
          })
          .find((item: any, elindex: number) => {
            item.children.map((subItem: any) => {
              if (subItem.project_name === param.data.name) {
                subobj.value = subItem;
                index.value = elindex;
              }
            });
            if (item.department_name === param.data.name) {
              index.value = elindex;
            }
            return item.department_name === param.data.name;
          });
        if (obj) {
          selectosunBurstData.value = [];
          (obj.children || []).map((subEl: any, subElIndex: number) => {
            if ((subEl.value || 0) > 0) {
              selectosunBurstData.value.push({
                name: subEl.project_name,
                itemStyle: {
                  color: useSunburstColors[index.value]?.children[subElIndex],
                },
                value: transformFenToYuan(subEl.value),
              });
            }
          });
          selectOneProjectGroundId.value = obj.department_id || undefined;
          selectOneProjectGroundName.value = obj.department_name || undefined;
          getTrendList();
        } else {
          selectosunBurstData.value = [];
          /*const arr: any[] = (sunBurstData.value || []).filter(el => {
            return el.children?.find(subEl => (subEl.value || 0) > 0);
          });
          (arr[index.value].children || []).map((subEl: any, subElIndex: number) => {
            if ((subEl.value || 0) > 0) {
              selectosunBurstData.value.push({
                name: subEl.project_name,
                itemStyle: {
                  color: useSunburstColors[index.value]?.children[subElIndex],
                },
                value: transformFenToYuan(subEl.value),
              });
            }
          });*/
          selectosunBurstData.value = [param.data];
          selectOneProjectGroundId.value = subobj.value ? subobj.value.project_id : undefined;
          selectOneProjectGroundName.value = subobj.value.project_name || undefined;
          getTrendList(false);
        }
      } else {
        //点击扇形
        const obj: any = (piearr.value || []).find((item: any) => {
          return item.project_name === param.data.name;
        });
        if (obj) {
          selectOneProjectGroundId.value = obj.project_id || undefined;
          selectOneProjectGroundName.value = obj.project_name || undefined;
          getTrendList(false);
        }
      }
    };
    //趋势图

    const day_arr = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
    const show_time_arr: any = ref([]);
    const baseOptions = ref({
      dataZoom:
        props.analyseType === 2
          ? [
              {
                type: 'slider',
                show: true,
                start: 0,
                end: 50,
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
            ]
          : [],
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
          } else if (props.analyseType === 2) {
            const select_currentDate = moment(props.selectDate);
            const select_str = 'M';
            const start_day = select_currentDate.startOf(select_str).format('MM');
            const title =
              params[0].axisValue.length === 2 ? '0' + params[0].axisValue : params[0].axisValue;
            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${start_day}月${title}</div>`;
          } else if (props.analyseType === 3) {
            const select_currentDate = moment(props.selectDate);
            const start_day = select_currentDate.startOf('M').format('YYYY');
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
        // data: props.xData ?? [],
        right: 80,
        top: 12,
        type: 'scroll',
        width: 700,
        itemGap: 20,
        itemWidth: 20,
      },
      grid: {
        left: 48,
        right: 58,
        bottom: props.analyseType === 2 ? 60 : 30,
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
            padding: [0, 42, 15, 0],
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
          axisPointer: {
            show: false,
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
    const unitY = ref(AxisUnit.yuan);
    const trendLoading = ref(false);
    const getTrendList = (isDepartMent = true) => {
      // unitY.value = AxisUnit.yuan;
      trendLoading.value = true;
      const select_currentDate = moment(props.selectDate);
      const dateFormat = 'yyyy-MM-DD';
      const selectstr = props.analyseType === 1 ? 'w' : props.analyseType === 2 ? 'M' : 'y';
      const start_time = select_currentDate.startOf(selectstr).format(dateFormat);
      const end_time = select_currentDate.endOf(selectstr).format(dateFormat);
      if (props.analyseType === 2) {
        const arr: any = ref([]);
        const end_day = select_currentDate.endOf(selectstr).format('DD');
        for (let i = 1; i <= Number(end_day); i++) {
          arr.value.push(i + '日');
        }
        baseOptions.value.xAxis.data = arr;
        day_arr.value = arr;
      } else if (props.analyseType === 1) {
        baseOptions.value.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        day_arr.value = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      } else {
        day_arr.value = [
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
        ];
        baseOptions.value.xAxis.data = day_arr.value;
      }
      GetShopLiveDepartMentProjectGmvGroundList(
        {
          start_date: start_time,
          end_date: end_time,
          group_by: props.analyseType === 3 ? 'month' : undefined,
          third_department_id: isDepartMent
            ? props.projectGroundId !== 0
              ? props.projectGroundId
              : selectOneProjectGroundId.value
            : undefined,
          project_id: isDepartMent === false ? selectOneProjectGroundId.value : undefined,
          business_type: props.business_type,
        },
        isDepartMent,
      ).then(({ data }) => {
        trendLoading.value = false;
        if (data.success) {
          const completion_rate_arr = ref<any[]>([]);
          const gmv_arr = ref<any[]>([]);
          const goal_gmv_arr = ref<any[]>([]);
          const gmv_all_list = data.data.datas;
          gmv_all_list.forEach((item: any) => {
            const gmv_amount = item.gmv || 0;
            const goal_gmv_amount = item.goal_gmv || 0;
            const iswantype =
              Number(gmv_amount) > 1000000
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
                : 0,
            );
            const gmv_amount_num = item.gmv || item.gmv === 0 ? item.gmv / 100 : 0;
            const goal_gmv_amount_num =
              item.goal_gmv || item.goal_gmv === 0 ? item.goal_gmv / 100 : 0;
            gmv_arr.value.push(gmv_amount_num);
            goal_gmv_arr.value.push(goal_gmv_amount_num);
          });
          const obj = [
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
              barMaxWidth: '20',
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
              data: completion_rate_arr.value,
            },
          ];
          baseOptions.value.yAxis[0].name = '单位：' + '' + unitY.value;
          const arr: any[] = gmv_all_list.filter((el: any) => {
            return el.completion_rate !== null || el.gmv !== null || el.goal_gmv !== null;
          });
          baseOptions.value.series = arr.length < 1 ? [] : obj;
          show_time_arr.value = data.data.dates;
        } else {
          unitY.value = AxisUnit.yuan;
          baseOptions.value.yAxis[0].name = '单位：' + '' + unitY.value;
          baseOptions.value.series = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    getTrendList();

    watch(
      () => [props.selectDate],
      () => {
        select_show_index.value = 1;
        sunBurstData.value = [];
        osunBurstData.value = [];
        osunBurstChildrenData.value = [];
        baseOptions.value.series = [];
        piearr.value = [];
        pieOption.value.series[0].data = [];
        selectosunBurstData.value = [];
        getCompletionRate();
        getPercentSunburstList();
        if (selectOneProjectGroundId.value) {
          getTrendList(false);
        } else {
          getTrendList();
        }
      },
    );
    watch(
      () => [props.projectGroundId, props.projectGroundName, props.business_type],
      () => {
        select_show_index.value = 1;
        sunBurstData.value = [];
        osunBurstData.value = [];
        osunBurstChildrenData.value = [];
        piearr.value = [];
        pieOption.value.series[0].data = [];
        baseOptions.value.series = [];
        selectosunBurstData.value = [];
        selectOneProjectGroundId.value = undefined;
        selectOneProjectGroundName.value = undefined;
        getCompletionRate();
        getPercentSunburstList();
        getTrendList();
      },
    );
    const getGoalList = (val: number, goal: number) => {
      const goalvalue = Number(getNewGoal(val, goal));
      return [
        0,
        goalvalue > 100000000
          ? formatAmount(Number(goalvalue / 5000000).toFixed(0), 'None', true) + 'w'
          : formatAmount(Number(goalvalue / 500).toFixed(0), 'None', true),
        goalvalue > 100000000
          ? formatAmount(Number((goalvalue * 2) / 5000000).toFixed(0), 'None', true) + 'w'
          : formatAmount(Number((goalvalue * 2) / 500).toFixed(0), 'None', true),
        goalvalue > 100000000
          ? formatAmount(Number((goalvalue * 3) / 5000000).toFixed(0), 'None', true) + 'w'
          : formatAmount(Number((goalvalue * 3) / 500).toFixed(0), 'None', true),
        goalvalue > 100000000
          ? formatAmount(Number((goalvalue * 4) / 5000000).toFixed(0), 'None', true) + 'w'
          : formatAmount(Number((goalvalue * 4) / 500).toFixed(0), 'None', true),
        goalvalue > 100000000
          ? formatAmount(Number(goalvalue / 1000000).toFixed(0), 'None', true) + 'w'
          : formatAmount(Number(goalvalue / 100).toFixed(0), 'None', true),
      ];
    };
    const allTargetInterval = ref();
    const allTargetIndexInterval = ref();
    const tagetdeg = ref<any>(undefined);
    const targetnewdeg = ref(0);
    const targetIndex = ref(0);

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
    const funTarget = () => {
      const box = tagetdeg.value as any;
      if (box) {
        const deg = targetnewdeg.value;
        box.style.transform = `rotate(${deg}deg)`;
        box.style.transformOrigin = '120px 6px';
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
            maxdeg = (i - 1) * 7.5;
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
    const onClickAllColor = () => {
      selectosunBurstData.value = osunBurstData.value;
    };
    const select_show_index = ref(1);
    const select_show_size = ref(9);
    const get_total_num = () => {
      const total_num = selectosunBurstData.value.length;
      const i = Number((total_num / select_show_size.value).toFixed(0) || 0);
      return i * select_show_size.value >= selectosunBurstData.value.length ? i : i + 1;
    };
    return {
      select_show_size,
      select_show_index,
      get_total_num,
      onClickAllColor,
      selectOneProjectGroundName,
      completion_rate_daily,
      completion_rate_obj,
      targetIndex,
      tagetdeg,
      parentClick,
      funTarget,
      funTargetIndex,
      getNewGoal,
      getGoalList,
      pieOption,
      selectClick,
      baseOptions,
      sunBurstData,
      osunBurstData,
      sunBurstLoading,
      trendLoading,
      formatAmount,
      piearr,
      echartsBurstLoading,
      osunBurstChildrenData,
      selectosunBurstData,
    };
  },
});
