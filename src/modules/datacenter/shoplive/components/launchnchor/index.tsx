/*
 * @Author       : yunie
 * @Date         : 2022-07-19 16:46:26
 * @LastEditTime : 2022-07-26 10:34:47
 * @FilePath     : \src\modules\datacenter\shoplive\components\launchnchor\index.tsx
 * @Description  :
 */
import { ref, defineComponent, h, inject, Ref, watch, computed } from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { useDialog } from '@/use/dialog';
import { TableColumn } from '@/types/vendor/column';
import detail from './dialog/detail.vue';
// import detail from '@/modules/datacenter/shoplive/tabs/projectDetail/projectShopDetail.vue';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { GetProjectKolScheduleReport } from '@/services/datacenter/shoplive';
import { formatAmount } from '@/utils/string';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

type Col = TableColumn<any>;
//秒转时分秒
const formatSeconds = (value: number) => {
  // const second = value % 60;
  let minute = Math.floor(value / 60);
  const hour = Math.floor(minute / 60);
  minute = minute % 60;
  return `${hour}时${minute}分`;
};
const kol_id = ref(0);
const dialogProject = useDialog({
  component: detail,
  title: '商品明细',
  footer: false,
  width: '1100px',
  class: 'zIndex',
  props: {
    kol_id,
  },
});
export default defineComponent({
  components: {
    BaseEcharts,
  },
  setup(props, ctx) {
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    // const queryForm = reactive<any>({
    //   project_id: computed(() => {
    //     return searchParams.value.project_id;
    //   }),
    //   start_date: computed(() => {
    //     return searchParams.value.start_date;
    //   }),
    //   end_date: computed(() => {
    //     return searchParams.value.end_date;
    //   }),
    // });
    const dataList = ref<any[]>([]);
    const loading = ref(false);
    const prechargeColumn: Col[] = [
      {
        label: '主播',
        property: 'flower_name',
        align: 'center',
        width: 120,
        className: 'project-income-head',
      },
      {
        label: '参与场次',
        property: 'schedule_count',
        align: 'center',
        width: 90,
      },
      {
        label: '直播时长',
        property: 'duration',
        align: 'center',
        width: 120,
        formatter: (row: any) => formatSeconds(row.duration) || '--',
      },
      {
        label: 'GMV (元)',
        property: 'gmv',
        align: 'center',
        width: 120,
        formatter: row => formatAmount(row.gmv / 100, 'None') || '--',
      },
      {
        label: '销售件数',
        property: 'item_num',
        align: 'center',
        width: 120,
        formatter: row => row.item_num || '--',
      },
      {
        label: '讲解次数',
        property: 'talk_times',
        align: 'center',
        width: 120,
      },
      {
        label: '销售款数',
        property: 'product_num',
        align: 'center',
        width: 120,
        className: 'project-income-head',
      },
      {
        label: '退货金额 (元)',
        align: 'center',
        property: 'refund_gmv',
        width: 120,
        formatter: row => formatAmount(row.refund_gmv / 100, 'None') || '--',
      },
      {
        label: '退货率',
        align: 'center',
        property: 'refund_rate',
        width: 120,
        formatter: row => (row.refund_rate || 0) + '%',
      },
      {
        label: '明细',
        width: 78,
        align: 'center',
        formatter: row => {
          return h(
            'a',
            {
              on: {
                click: () => {
                  // console.log({
                  //   project_id: searchParams.value.project_id,
                  //   start_date: searchParams.value.start_date,
                  //   end_date: searchParams.value.end_date,
                  //   kol_id: row.kol_id,
                  //   is_from_project: searchParams.value.is_from_project,
                  // });
                  // dialogProject.update({
                  //   props: {
                  //     kol_id: 111,
                  //   },
                  // }).show;
                  kol_id.value = row.kol_id;
                  dialogProject.show({
                    project_id: searchParams.value.project_id,
                    start_date: searchParams.value.start_date,
                    end_date: searchParams.value.end_date,
                    kol_id: row.kol_id,
                    is_from_project: searchParams.value.is_from_project,
                  });
                  // console.log(row, col, val, index);
                  // const $router = ctx.root.$router;
                  // const routeUrl = $router.resolve({
                  //   path:
                  //     '/datacenter/projectDetail/projectShopDetail/' +
                  //     searchParams.value.project_id,
                  //   query: {
                  //     start_date: searchParams.value.start_date,
                  //     end_date: searchParams.value.end_date,
                  //     kol_id: row.kol_id,
                  //     is_from_project: searchParams.value.is_from_project,
                  //   } as any,
                  // });
                  // window.open(routeUrl.href, '_blank');
                },
              },
            },
            ['查看'],
          );
        },
      },
    ];
    const tableData = ref([
      {
        live_room_start_time: '2020-07-15 11:37:41',
        project_name: '项目名称',
        live_duration: '00:00:00',
        product_nums: '1',
        customer_manager: '张三',
        achievement_uid: '123456789',
        achievement_name: '业绩名称',
        gather_amount: '123456789',
        gather_way: '1',
      },
    ]);
    const pieOption = ref({
      legend: {
        show: false,
        orient: 'vertical',
        top: 'center',
        right: '5%',
        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7'],
        textStyle: {
          color: '#fff',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'item',
        // formatter: `{b} : {c} ({d}%)`,
        formatter: (params: any) => {
          return `${params.name} : ${formatAmount(params.value / 100, 'None')} (${
            params.percent
          }%)`;
        },
      },
      series: {
        // name: '半径模式',
        type: 'pie',
        radius: ['30%', '80%'],
        center: ['50%', '50%'],
        roseType: 'area',
        label: {
          show: true,
          normal: {
            position: 'outside',
            fontSize: 12,
          },
        },
        itemStyle: {
          borderRadius: 8,
        },
        labelLine: {
          length: 1,
          length2: 20,
          smooth: true,
        },
        color: [
          '#1E8DFF',
          '#FFBF00',
          '#10C0D3',
          '#9273F8',
          '#FE9C25',
          '#00B942',
          '#FFCD39',
          '#FF829D',
          '#00A3FF',
          '#3AD08E',
          '#F1DC2F',
          '#845EF7',
          '#FF7F00',
          '#B3DC12',
          '#009999',
          '#2877FF',
          '#D977F2',
          '#FFC073',
          '#768FF3',
          '#81E5B1',
          '#BAC8FF',
          '#E599F8',
          '#FF7E7E',
          '#F7A0B8',
          '#49C6F1',
          '#B197FC',
          '#53D66F',
          '#FF97AD',
          '#FDD866',
        ],
        data: [
          {
            value: 1,
            name: 'rose1',
            itemStyle: {
              // color: 'rgba(50,123,250,0.7)',
              // borderColor: 'rgba(50,123,250,1)',
              borderWidth: 3,
            },
          },
          {
            value: 2,
            name: 'rose2',
            itemStyle: {
              // color: 'rgba(244,201,7,0.7)',
              // borderColor: 'rgba(244,201,7,1)',
              borderWidth: 3,
            },
          },
          {
            value: 3,
            name: 'rose3',
            itemStyle: {
              // color: 'rgba(23,216,161,0.7)',
              // borderColor: 'rgba(23,216,161,1)',
              borderWidth: 3,
            },
          },
          {
            value: 4,
            name: 'rose4',
            itemStyle: {
              // color: 'rgba(122,60,235,0.7)',
              // borderColor: 'rgba(122,60,235,1)',
              borderWidth: 3,
            },
          },
          {
            value: 5,
            name: 'rose5',
            itemStyle: {
              // color: 'rgba(15,197,243,0.7)',
              // borderColor: 'rgba(15,197,243,1)',
              borderWidth: 3,
            },
          },
        ] as any[],
      },
    });
    const max_gmv = ref<number>(0);
    const baseOptions = computed(() => {
      return {
        dataZoom: [],
        tooltip: {
          trigger: 'axis',
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
          formatter: (params: any[]) => {
            let res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${params[0].axisValue}</div>`;
            let seriesName, color, data;
            for (let i = 0; i < params.length; i++) {
              color = params[i].color;
              seriesName = params[i].seriesName;
              data = params[i].value;
              if (i === 1) {
                res +=
                  '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                  '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                  color +
                  '"></div>' +
                  seriesName +
                  '：' +
                  '<div style="color: var(--text-color);font-weight: 400;"> ' +
                  formatSeconds(data) +
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
                  '<div style="color: var(--text-color);font-weight: 400;"> ' +
                  formatAmount(data / 100) +
                  ' </div>' +
                  '</div>';
              }
            }
            return res;
          },
          extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
        },
        legend: {
          show: true,
          right: 104,
          top: 0,
          type: 'scroll',
          width: 700,
          itemGap: 20,
          itemWidth: 20,
        },
        grid: {
          left: 108,
          right: 98,
          bottom: 30,
          containLabel: false,
        },
        xAxis: {
          type: 'category',
          data: dataList.value.map(item => {
            return item.flower_name;
          }),
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
                    color: 'rgba(0,156,255,0.02)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,156,255,0.15)',
                  },
                ],
                global: false,
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
            name: Number(max_gmv.value) < 10000 ? 'GMV (千)' : 'GMV (万)',
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
            nameTextStyle: {
              padding: [0, 64, 0, 0],
            },
            axisLabel: {
              formatter: (value: any) => {
                // console.log(value, this.projectData.data_list, 'value');
                if (max_gmv.value < 10000) {
                  return Number(value / 100000).toFixed(2);
                } else {
                  return Number(value / 1000000).toFixed(0);
                }
                // return Number(value / 1000000).toFixed(0);
              },
            },
          },
          {
            name: '直播时长',
            type: 'value',
            position: 'right',
            nameTextStyle: {
              align: 'left',
              padding: [0, 0, 0, 8],
            },
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
              formatter: (value: number) => {
                return formatSeconds(value);
              },
            },
          },
        ],
        series: [
          {
            name: '完成GMV',
            type: 'bar',
            barMaxWidth: '22',
            barMinWidth: '8',
            barGap: 0.2,
            barCategoryGap: '45%',
            color: '#2877FF',
            data: dataList.value.map(item => {
              return item.gmv;
            }),
            itemStyle: {
              barBorderRadius: 3,
            },
          },
          {
            name: '直播时长',
            yAxisIndex: 1,
            type: 'bar',
            barMaxWidth: '20',
            barMinWidth: '8',
            barGap: 0.2,
            barCategoryGap: '45%',
            color: '#4FCA50',
            data: dataList.value.map(item => {
              return item.duration;
            }),
            itemStyle: {
              barBorderRadius: 3,
            },
          },
          // {
          //   name: '目标完成率',
          //   type: 'line',
          //   smooth: true,
          //   showSymbol: false,
          //   yAxisIndex: 1,
          //   itemStyle: {
          //     color: '#FF7F00',
          //   },
          //   lineStyle: {
          //     width: 3,
          //     shadowColor: '#FF7F003d',
          //     shadowOffsetX: 0,
          //     shadowOffsetY: 11,
          //     shadowBlur: 11,
          //   },
          //   data: [0, 0, 0, 0, 0, 0, 0],
          // },
        ],
      };
    });
    const queryForm = ref<any>({
      page_num: 1,
      num: 20,
      total: 0,
    });
    const { business_type } = useProjectBaseInfo();
    const getList = async () => {
      loading.value = true;
      GetProjectKolScheduleReport(
        {
          start_date: searchParams.value.start_date,
          end_date: searchParams.value.end_date,
          project_id: searchParams.value.project_id,
          is_from_project: searchParams.value.is_from_project,
          page_num: queryForm.value.page_num,
          num: queryForm.value.num,
        },
        business_type.value,
      ).then(({ data }) => {
        loading.value = false;
        if (data.success) {
          dataList.value = data?.data?.data;
          queryForm.value.total = data?.data?.total;
          pieOption.value.series.data = dataList.value.map((item, index) => {
            return { name: item.flower_name, value: item.gmv };
          });
          // baseOptions.value.xAxis.data = dataList.value.map(item => {
          //   return item.flower_name;
          // });
          // baseOptions.value.series[0].data = dataList.value.map(item => {
          //   return item.gmv;
          // });
          // baseOptions.value.series[1].data = dataList.value.map(item => {
          //   return item.duration;
          // });
          max_gmv.value = Math.max(...dataList.value?.map((v: any) => Number(v.gmv / 100)));
        }
      });
    };
    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      getList();
    };
    // 切换页码数
    const currentSizeChange = (num: number) => {
      queryForm.value.num = num;
      getList();
    };
    getList();
    watch(
      () => searchParams.value,
      async data => {
        if (data === undefined) return;
        await getList();
      },
      { deep: true },
    );
    return {
      loading,
      tableData,
      baseOptions,
      pieOption,
      prechargeColumn,
      dataList,
      handleCurrentChange,
      currentSizeChange,
      queryForm,
    };
  },
  render() {
    return (
      <div class="main-box">
        <h3 class="main-item-title">主播销售分析</h3>
        <div class="sale-box">
          <div class="lt" v-loading={this.loading}>
            {this.dataList.length > 0 ? (
              <base-echarts options={this.pieOption}></base-echarts>
            ) : (
              <empty-common detail-text="暂无数据"></empty-common>
            )}
          </div>
          <div class="rt" v-loading={this.loading} style="height: 300px;">
            {this.dataList.length > 0 ? (
              <base-echarts options={this.baseOptions}></base-echarts>
            ) : (
              <empty-common detail-text="暂无数据"></empty-common>
            )}
          </div>
        </div>
        <h3 class="main-item-title">主播销售详情</h3>
        <div class="">
          <tg-table
            stripe
            tooltip-effect="light"
            // height={this.tableData.length > 0 ? 'calc(100vh - 255px)' : 'calc(100vh - 205px)'}
            v-loading={this.loading}
            border
            class="precharge-table"
            data={this.dataList}
          >
            <template slot="empty">
              <empty-common
                style="margin-top:20px"
                imgHeight="100"
                imgWidth="200"
                detail-text="暂无数据"
              ></empty-common>
            </template>
            {this.prechargeColumn.map(v => (
              <el-table-column
                show-overflow-tooltip
                class-name={v.className}
                label={v.label}
                prop={v.property}
                align={v.align}
                headerAlign={v.headerAlign}
                minWidth={v.width}
                formatter={v.formatter}
              />
            ))}
          </tg-table>
          {this.dataList?.length > 0 && (
            <div class="pagination">
              <el-pagination
                class="flex-none"
                current-page={this.queryForm.page_num}
                page-sizes={[10, 20, 30, 50, 100]}
                page-size={20}
                total={this.queryForm.total}
                layout="total, prev, pager, next, sizes"
                on-current-change={this.handleCurrentChange}
                on-size-change={this.currentSizeChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
});
