import { ref, defineComponent, h, watch, computed } from '@vue/composition-api';
import { Query_Finish_Assessment, QueryAssessmentStatisticsData } from '@/services/performance';
import { Select } from '@gm/component/select';
import { useRequest } from '@gm/hooks/ahooks';
import { GetAssessment_management_department_list } from '@/services/live';
import treeSelect from '@/components/treeSelect/base/index.vue';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { ExportList } from '@/modules/datacenter/competitor/use';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import { usePermission } from '@/use/permission';
import moment from 'moment';
// import { debounce } from '@/utils/func';

enum EChartType {
  target_setting_time_data = '目标制定耗时数据',
  target_confirm_time_data = '目标确认耗时数据',
  self_evaluation_time_data = '自评耗时数据',
  superior_rating_time_data = '上级评分耗时数据',
  sign_confirm_time_data = '签字确认耗时数据',
}
export default defineComponent({
  name: 'processMonitoring',
  components: {
    Select,
    treeSelect,
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const formData = ref({
      assessment_management_id: undefined,
      department_ids: undefined,
    } as any);
    /* 防抖 */
    // const timer = ref<number | null>(null);
    // const debounce = (fn: Function, delay = 200) => {
    //   if (timer.value !== null) clearTimeout(timer.value);
    //   timer.value = setTimeout(() => fn(), delay);
    // };
    /* 查询 */
    const onQueryClick = () => {
      loading.value = true;
      // query();
      // debounce(function () {
      queryList.run(formData.value);
      // });
      // queryList.run(formData.value);
    };
    function debounce(fn: Function, delay = 200) {
      let timer: number | null = null;
      return function debounced(...args: any[]) {
        console.log(timer, 'timer');

        if (timer !== null) clearTimeout(timer);
        // @ts-ignore
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }
    const loading = ref(true);
    watch(() => formData.value, debounce(onQueryClick, 200), { deep: true });
    /* 考核名称 */
    const assessment_management_options = ref<TG.OptionType[]>([]);
    Query_Finish_Assessment()
      .then(res => {
        if (res.data.success) {
          assessment_management_options.value = res.data.data.map((item: any) => {
            return {
              value: item.assessment_management_id,
              label: item.name,
            };
          });
          if (assessment_management_options.value.length > 0) {
            const getTheCurrentDay = new Date().getDate();
            /* 需求大于15号查看上个月小于则上上个月 */
            if (assessment_management_options.value.length > 1) {
              const getYearMonth = moment()
                .subtract(getTheCurrentDay < 15 ? 2 : 1, 'months')
                .format('YYYY年MM月');
              /* 寻找对应月度 */
              const getYearMonthIndex = assessment_management_options.value.findIndex(el =>
                new RegExp(getYearMonth, 'g').test(el.label),
              );
              // console.log(getYearMonthIndex, getYearMonth, 'index');
              /* 找不到默认第一个 */
              if (getYearMonthIndex === -1) {
                formData.value.assessment_management_id =
                  assessment_management_options.value[0]?.value;
                return;
              }
              formData.value.assessment_management_id =
                assessment_management_options.value[getYearMonthIndex]?.value;
              return;
            }
          }
        }
        onQueryClick();
      })
      .then(() =>
        reqFeishuDep.run({ assessment_management_id: formData.value.assessment_management_id }),
      );
    /* 部门 */
    const reqFeishuDep = useRequest(GetAssessment_management_department_list, {
      manual: true,
      defaultParams: [{ assessment_management_id: formData.value.assessment_management_id }],
      transform(res) {
        return (res.data || []).map(el => {
          return {
            disabled: false,
            ...el,
          };
        });
      },
    });
    // const query = debounce(function () {
    //   console.log(queryList.run(), 'queryList.run');

    //   queryList.run(formData.value);
    // }, 200);
    /* 导出 */
    const onExportList = () => {
      ExportList(
        {
          assessment_management_id: formData.value.assessment_management_id,
          department_ids: formData.value.department_ids?.join(',') ?? undefined,
        },
        '/api/performance_management/export_assessment_statistics_data',
      );
    };
    const allList = ref<any>({});
    const queryList = useRequest(QueryAssessmentStatisticsData, {
      manual: true,
      defaultParams: [{ ...formData.value }],
      transform(res) {
        tableData.value = res.sons;
        allList.value = res;
        tableData.value.unshift(getSummaries());
        getBaseOptions();
        loading.value = false;
        return res;
      },
      onError() {
        loading.value = false;
      },
    });
    /* 图表基础配置 */
    const baseOptions = ref({
      tooltip: {
        trigger: 'axis',
        // triggerOn: 'click',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: 'var(--text-des-color)',
          },
        },
        textStyle: {
          color: '#343F4C',
          fontSize: 14,
          fontWeight: 'bold',
        },
        extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
        formatter: '{b0}: {c0}小时',
      },
      legend: {
        show: true,
        // data: props.xData ?? [],
        left: 20,
        right: 80,
        top: 12,
        type: 'scroll',
        width: 700,
        itemGap: 20,
        itemWidth: 20,
      },
      grid: {
        left: 40,
        right: 30,
        bottom: 30,
        top: 30,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: [] as any[],
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
          name: '小时',
          alignTicks: true,
          axisLine: {
            show: false,
          },
          // axisLabel: {
          //   formatter: '{value} 元',
          // },
          nameTextStyle: {
            padding: [0, 38, 0, 0],
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
      series: [
        {
          type: 'bar',
          data: [],
          barMaxWidth: 20,
          itemStyle: {
            borderRadius: 4,
            color: '#2877FF',
          },
        },
      ] as any[],
    });
    const tableData = ref<any>([] as any);
    /* 各字段图表 */
    const chartCollection = ref<any>(
      (() => {
        const obj: any = {};
        Object.keys(EChartType).forEach(key => {
          const chartType = EChartType[key as keyof typeof EChartType];
          obj[chartType] = JSON.parse(JSON.stringify(baseOptions.value));
        });
        return obj;
      })(),
    );

    const getBaseOptions = () => {
      Object.keys(EChartType).forEach(key => {
        const chartType = EChartType[key as keyof typeof EChartType];
        const chart = JSON.parse(JSON.stringify(baseOptions.value));
        chart.series[0].data = allList.value[key].map((item: any) => item.val);
        chart.xAxis.data = allList.value[key].map((item: any) => item.label);
        // console.log(chart, allList.value, 'chart');

        chartCollection.value[chartType] = chart;
      });
      // console.log(chartCollection.value, 'EChartType');
    };
    /* 合计 */
    const getSummaries = () => {
      const result: Record<string, any> = {
        isSum: true,
      };
      const a = JSON.stringify(allList.value, (key: string, val: any) => {
        if (key === 'sons') {
          return undefined;
        }
        return val;
      });
      return { ...result, ...JSON.parse(a) };
      // columns.map((item: any) => {
      //   if (tableData.value === undefined) return '--';
      //   console.log(allList, 'data');

      //   result[item] = allList.value[item as any];
      //   if (result[item] === undefined) {
      //     result[item] = null;
      //   }
      // });
    };

    const rowHightlight = ({ row }: { row: any }) => {
      let styleJson: any = {};
      if (row.isSum === true) {
        styleJson = { 'background-color': '#E9E9E9 !important' };
        styleJson['font-weight'] = 600;
      }
      return styleJson;
    };
    /* 权限 */
    const permission = usePermission();
    const permissions = computed(() => {
      return {
        export: permission.implement_monitor_process_export,
      };
    });
    return {
      loading,
      formData,
      assessment_management_options,
      reqFeishuDep,
      tableData: Object.freeze(tableData),
      baseOptions,
      onExportList,
      onQueryClick,
      chartCollection,
      getSummaries,
      rowHightlight,
      permissions,
    };
  },
});
