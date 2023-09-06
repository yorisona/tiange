import { defineComponent, inject, Ref, ref, watch } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import {
  GetShopLiveCrowdProjectStatisticsList,
  GetShopLiveCrowdDayStatisticsTrendsList,
  QueryProjectCrowdDistributeDetail,
} from '@/services/datacenter/shoplive';
import sunburst from '@/modules/datacenter/shoplive/components/sunburst/index.vue';
import lineDiv from '@/modules/datacenter/shoplive/components/crowd/line.vue';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Decimal from 'decimal.js';
import { useBubblePieColors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import moment from 'moment';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'performanceCrowdIndex',
  props: {
    performanceId: {
      type: Number,
      default: 0,
    },
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    sunburst,
    lineDiv,
    BaseEcharts,
  },
  setup(props, ctx) {
    const searchParams = (inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>) || ref({});
    const project_name = ref('');
    const detail_obj = ref<any>({});
    const age_list = ref<any>([]);
    const area_list = ref<any>([]);
    // 每日趋势图
    const daytrendLoading = ref(false);
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
          if (searchParams.value.date_type === 'week') {
            //周
            const index = day_arr.value.findIndex((item: string) => {
              return item === params[0].axisValue;
            });
            const titlestr = String(show_time_arr.value[index]).replace(/-/g, '.') || '';
            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${params[0].axisValue} (${titlestr})</div>`;
          } else if (searchParams.value.date_type === 'month') {
            //月
            // const select_currentDate = moment(searchParams.value.start_date).add(1, 'months');
            // const select_str = 'M';
            const start_day = moment(searchParams.value.start_date).format('MM');
            const title =
              params[0].axisValue.length === 2 ? '0' + params[0].axisValue : params[0].axisValue;
            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${start_day}月${title}</div>`;
          } else if (searchParams.value.date_type === 'date') {
            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${params[0].axisValue}</div>`;
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
              '<div style="color: var(--text-color);font-weight: 400;">  ' +
              formatAmount(Number(data || 0).toFixed(0), 'None', true) +
              '</div>' +
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
        right: 120,
        top: 15,
        type: 'scroll',
        width: 800,
        itemGap: 30,
        itemWidth: 17,
        itemHeight: 14,
      },
      grid: {
        left: 78,
        right: 38,
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
        boundaryGap: false,
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
          name: '人数',
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
            padding: [0, 52, 12, 6],
          },
          axisLabel: {
            padding: [0, 12, 12, 6],
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
      ],
      series: [] as any[],
    });
    const unitYStr = ref('');
    const { business_type } = useProjectBaseInfo();
    const getOneProjectList = () => {
      if (props.performanceId === 0) {
        const select_currentDate = moment(searchParams.value.start_date);
        const select_str = searchParams.value.date_type === 'week' ? 'w' : 'M';
        daytrendLoading.value = true;
        if (searchParams.value.date_type === 'month') {
          const arr: any = ref([]);
          const end_day = select_currentDate.endOf(select_str).format('DD');
          for (let i = 1; i <= Number(end_day); i++) {
            arr.value.push(i + '日');
          }
          baseProjectOptions.value.xAxis.data = arr;
          day_arr.value = arr;
        } else if (searchParams.value.date_type === 'week') {
          baseProjectOptions.value.xAxis.data = [
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六',
            '周日',
          ];
          day_arr.value = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        }

        daytrendLoading.value = true;
        GetShopLiveCrowdDayStatisticsTrendsList(
          {
            is_from_project:
              props.performanceId === 0
                ? searchParams.value.is_from_project || false
                : props.projectData.from_project || false,
            statistics_cycle:
              props.performanceId === 0 && searchParams.value.date_type === 'date' ? 1 : undefined,
            start_date: props.performanceId === 0 ? searchParams.value.start_date : undefined,
            end_date: props.performanceId === 0 ? searchParams.value.end_date : undefined,
            project_id: props.performanceId === 0 ? searchParams.value.project_id : undefined,
            shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
          },
          business_type.value,
        ).then(({ data }) => {
          daytrendLoading.value = false;
          if (data.success) {
            unitYStr.value = '';
            (data.data.incr_fans || []).forEach((item: number) => {
              const watch_num = item || 0;
              const iswantype = Number(watch_num) > 10000 ? true : false;
              if (iswantype) {
                unitYStr.value = '万';
              }
            });
            if (unitYStr.value === '') {
              (data.data.incr_fans_club || []).forEach((item: number) => {
                const watch_num = item || 0;
                const iswantype = Number(watch_num) > 10000 ? true : false;
                if (iswantype) {
                  unitYStr.value = '万';
                }
              });
            }
            const objproject = [
              {
                name: '增粉人数',
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
                data: (data.data.incr_fans || []).map((item: number) => {
                  return item || 0;
                }),
              },
              {
                name: '加团人数',
                type: 'line',
                smooth: true,
                showSymbol: false,
                itemStyle: {
                  color: '#2877FF',
                },
                lineStyle: {
                  width: 3,
                  shadowColor: '#2877FF3d',
                  shadowOffsetX: 0,
                  shadowOffsetY: 11,
                  shadowBlur: 11,
                },
                data: (data.data.incr_fans_club || []).map((item: number) => {
                  return item || 0;
                }),
              },
            ];
            baseProjectOptions.value.yAxis[0].name =
              '人数' + (unitYStr.value ? '：' + unitYStr.value : '');
            baseProjectOptions.value.series = data.data.is_show ? objproject : [];
            show_time_arr.value = data.data.dates || [];
            if (searchParams.value.date_type === 'date') {
              baseProjectOptions.value.xAxis.data = data.data.dates || [];
            }
          } else {
            baseProjectOptions.value.series = [];
            ctx.root.$message.error(data.message || '数据获取失败');
          }
        });
      }
      daytrendLoading.value = true;
      GetShopLiveCrowdProjectStatisticsList(
        {
          is_from_project:
            props.performanceId === 0
              ? searchParams.value.is_from_project || false
              : props.projectData.from_project || false,
          start_date: props.performanceId === 0 ? searchParams.value.start_date : undefined,
          end_date: props.performanceId === 0 ? searchParams.value.end_date : undefined,
          project_id: props.performanceId === 0 ? searchParams.value.project_id : undefined,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
        },
        business_type.value,
      ).then(({ data }) => {
        daytrendLoading.value = false;
        if (data.success) {
          detail_obj.value = data.data;
        } else {
          detail_obj.value = {};
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      QueryProjectCrowdDistributeDetail(
        {
          is_from_project:
            props.performanceId === 0
              ? searchParams.value.is_from_project || false
              : props.projectData.from_project || false,
          start_date: props.performanceId === 0 ? searchParams.value.start_date : undefined,
          end_date: props.performanceId === 0 ? searchParams.value.end_date : undefined,
          project_id: props.performanceId === 0 ? searchParams.value.project_id : undefined,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
        },
        business_type.value,
      ).then(({ data }) => {
        daytrendLoading.value = false;
        if (data.success) {
          age_list.value = data.data.age_dis || [];
          pieOption.value.series[0].data = (data.data.age_dis || []).map(
            (item: any, index: number) => {
              return {
                name: item.distribute_index,
                itemStyle: {
                  color: useBubblePieColors[index],
                },
                value: item.value,
              };
            },
          );
          area_list.value = data.data.province_dis || [];
        } else {
          age_list.value = [];
          area_list.value = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };

    watch(
      () => [searchParams.value, props.performanceId],
      () => {
        project_name.value = '';
        detail_obj.value = {};
        getOneProjectList();
      },
    );
    const getWidthperent = (oneval: number, twoval: number) => {
      if (!twoval && !oneval) {
        return '0%';
      }
      if (!twoval) {
        return '100%';
      }
      const total = oneval + twoval;
      return (oneval * 100) / total + '%';
    };
    getOneProjectList();

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
          const radio = new Decimal(data.value || 0)
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
        show: true,
        type: 'scroll',
        itemGap: 20,
        itemWidth: 20,
        bottom: 6,
        left: 10,
        right: 10,
      },
      series: [
        {
          name: '',
          type: 'pie',
          selectedMode: 'single',
          radius: ['53', '55%'],
          center: ['50%', '38%'],
          label: {
            show: true,
            alignTo: 'edge',
            formatter: '{bili|{d}%}\n {name|{b}} ',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 20,
            rich: {
              name: {
                fontSize: 10,
                color: 'var(--text-des-color)',
              },
              bili: {
                fontSize: 14,
                color: 'var(--text-color)',
              },
            },
          },
          labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80,
          },
          labelLayout: function (params: any) {
            const isLeft = params.labelRect.x < 200;
            const points = params.labelLinePoints;
            // Update the end point.
            points[2][0] = isLeft
              ? params.labelRect.x
              : params.labelRect.x + params.labelRect.width;
            return {
              labelLinePoints: points,
            };
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
    const getColor = (index: number) => {
      return index === 0
        ? '#FF6B6B'
        : index === 1
        ? '#FF9B56'
        : index === 2
        ? '#FFCB49'
        : '#60D6FF';
    };
    return {
      getColor,
      baseProjectOptions,
      daytrendLoading,
      age_list,
      area_list,
      piearr,
      pieOption,
      getWidthperent,
      detail_obj,
      project_name,
      formatAmount,
    };
  },
});
