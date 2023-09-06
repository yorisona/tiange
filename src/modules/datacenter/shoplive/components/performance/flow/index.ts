import { defineComponent, h, inject, Ref, ref, watch } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import sunburst from '@/modules/datacenter/shoplive/components/sunburst/index.vue';
import { DashboardSunburstDataModel } from '@/types/tiange/finance/finance';
import { useSunburstColors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
import {
  GetShopLiveFlowProjectSunburstList,
  GetShopLiveFlowProjectPercentSunbursDetail,
  GetShopLiveFlowDayStatisticsTrendsList,
  GetShopLiveFlowProjectVideoList,
} from '@/services/datacenter/shoplive';
import moment from 'moment';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'performanceFlowIndex',
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
    BaseEcharts,
  },
  setup(props, ctx) {
    const searchParams = (inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>) || ref({});
    const selectosunBurstData = ref<any>([]);
    const sunBurstLoading = ref(false);
    const sunBurstDetailLoading = ref(false);
    const sunBurstDetail = ref<any>(undefined);
    const prechargeColumn: any[] = [
      {
        label: '短视频',
        property: 'title',
        align: 'left',
        minWidth: 140,
        className: 'project-income-head',
        showOverflowTooltip: true,
      },
      {
        label: '投稿时间',
        property: 'publish_time',
        align: 'center',
        minWidth: 130,
        sortable: true,
      },
      {
        label: '短视频直播入口曝光次数',
        property: 'exposure_times',
        align: 'right',
        minWidth: 150,
        className: 'text-right',
        sortable: true,
      },
      {
        label: '短视频引流直播间次数',
        property: 'product_click_times',
        align: 'right',
        minWidth: 150,
        className: 'text-right',
        sortable: true,
        // formatter: (row:any) => row.project_manager || '--',
      },
      {
        label: '短视频直播入口点击率(次数)',
        property: 'exposure_click_times_rate',
        align: 'right',
        className: 'text-right',
        minWidth: 180,
        sortable: true,
        formatter: (row: any) =>
          row.exposure_click_times_rate !== undefined && row.exposure_click_times_rate !== null
            ? `${row.exposure_click_times_rate}%`
            : '',
      },
      {
        label: '操作',
        minWidth: 60,
        align: 'center',
        formatter: (row: any) => {
          return h(
            'a',
            {
              on: {
                click: () => {
                  window.open(row.url || '');
                },
              },
            },
            ['查看'],
          );
        },
      },
    ];
    const tableData = ref<any>([]);
    const paginationData = ref<any>({
      total: 0,
      page_num: 1,
      num: 10,
    });
    const handleCurrentChange = (page_num: number) => {
      paginationData.value.page_num = page_num;
      getList();
      // getList();
    };
    const handlePageSizeChange = (num: number) => {
      paginationData.value.num = num;
      paginationData.value.page_num = 1;
      getList();
      // getList();
    };
    // const getList = () => {
    //   loading.value = true;
    //   GetLiveRoomInfo({
    //     start_date: searchParams.value.start_date,
    //     end_date: searchParams.value.end_date,
    //     project_id: searchParams.value.project_id,
    //     page_num: paginationData.value.page_num,
    //     num: 20,
    //   }).then(({ data }) => {
    //     loading.value = false;
    //     if (data.success) {
    //       tableData.value = data?.data?.data;
    //       paginationData.value.total = data?.data?.total;
    //     }
    //   });
    // };
    // getList();
    //旭日图

    const sunBurstData = ref<DashboardSunburstDataModel[] | undefined>(undefined);
    const osunBurstData = ref<any>([]);
    const osunBurstChildrenData = ref<any>([]);
    // const sunburstTotalAmount = ref();
    const select_flow = ref<any>(undefined);
    const flow_type = ref<any>(undefined);
    const select_flow_name = ref<any>('');
    const watch_cnt = ref<any>('');
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
            if (i !== 0) {
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
        left: 78,
        right: 68,
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
            padding: [0, 30, 12, 6],
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
        {
          type: 'value',
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
            padding: [0, 6, 12, 12],
            formatter(value: any) {
              if (unitYType.value === AxisUnit.wan) {
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
    const unitYType = ref('');
    const { business_type } = useProjectBaseInfo();
    const getOneProjectList = () => {
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
      if (props.performanceId === 0) {
        GetShopLiveFlowDayStatisticsTrendsList(
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
            unitYType.value = '';
            (data.data.watch_ucnt || []).forEach((item: number) => {
              const watch_num = item || 0;
              const iswantype = Number(watch_num) > 10000 ? true : false;
              if (iswantype) {
                unitYStr.value = '万';
              }
            });
            (data.data.natural_flow || []).forEach((item: number) => {
              const watch_num = item || 0;
              const iswantype = Number(watch_num) > 10000 ? true : false;
              if (iswantype) {
                unitYType.value = '万';
              }
            });
            if (unitYType.value === '') {
              (data.data.at_flow || []).forEach((item: number) => {
                const watch_num = item || 0;
                const iswantype = Number(watch_num) > 10000 ? true : false;
                if (iswantype) {
                  unitYType.value = '万';
                }
              });
            }
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
                name: '付费流量',
                type: 'line',
                smooth: true,
                showSymbol: false,
                yAxisIndex: 1,
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
                data: (data.data.at_flow || []).map((item: number) => {
                  return item || 0;
                }),
              },
              {
                name: '自然流量',
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
                data: (data.data.natural_flow || []).map((item: number) => {
                  return item || 0;
                }),
              },
            ];
            baseProjectOptions.value.yAxis[0].name =
              '总观看人数' + (unitYStr.value ? '：' + unitYStr.value : '');
            baseProjectOptions.value.yAxis[1].name =
              '单位' + (unitYType.value ? '：' + unitYStr.value : '');
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
        getList();
      }
      sunBurstLoading.value = true;
      watch_cnt.value = '';
      GetShopLiveFlowProjectSunburstList(
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
    //获取短视频数据
    const getList = () => {
      GetShopLiveFlowProjectVideoList(
        {
          is_from_project:
            props.performanceId === 0
              ? searchParams.value.is_from_project || false
              : props.projectData.from_project || false,
          num: paginationData.value.num,
          page_num: paginationData.value.page_num,
          start_date: props.performanceId === 0 ? searchParams.value.start_date : undefined,
          end_date: props.performanceId === 0 ? searchParams.value.end_date : undefined,
          project_id: props.performanceId === 0 ? searchParams.value.project_id : undefined,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
        },
        business_type.value,
      ).then(({ data }) => {
        sunBurstLoading.value = false;
        if (data.success) {
          tableData.value = data.data.data || [];
          paginationData.value.total = data.data.total;
        } else {
          tableData.value = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };

    const getOneProjectDetail = () => {
      sunBurstDetailLoading.value = true;
      GetShopLiveFlowProjectPercentSunbursDetail(
        {
          is_from_project:
            props.performanceId === 0
              ? searchParams.value.is_from_project || false
              : props.projectData.from_project || false,
          start_date: props.performanceId === 0 ? searchParams.value.start_date : undefined,
          end_date: props.performanceId === 0 ? searchParams.value.end_date : undefined,
          project_id: props.performanceId === 0 ? searchParams.value.project_id : undefined,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
          flow_source: select_flow.value,
          flow_type: flow_type.value,
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
      () => [props.performanceId, searchParams.value],
      () => {
        select_flow_name.value = '';
        watch_cnt.value = '';
        selectosunBurstData.value = [];
        osunBurstData.value = [];
        osunBurstChildrenData.value = [];
        sunBurstDetail.value = undefined;
        getOneProjectList();
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
    getOneProjectList();
    return {
      baseProjectOptions,
      daytrendLoading,
      onClickAllColor,
      getSecondsabe,
      select_flow_type_name,
      watch_cnt,
      flow_type,
      selectClick,
      sunBurstData,
      osunBurstData,
      sunBurstLoading,
      sunBurstDetail,
      sunBurstDetailLoading,
      select_flow_name,
      formatAmount,
      osunBurstChildrenData,
      selectosunBurstData,
      prechargeColumn,
      tableData,
      handleCurrentChange,
      handlePageSizeChange,
      paginationData,
    };
  },
});
