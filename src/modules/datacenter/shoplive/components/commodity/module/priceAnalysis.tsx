import { defineComponent, inject, onBeforeMount, Ref, ref, watch, h } from '@vue/composition-api';
import pieEcharts from '@/modules/datacenter/shoplive/components/performance/shop/price/pieIndex.vue';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { GetDouyinItemPieChart } from '@/services/datacenter/shoplive';
import { wait } from '@/utils/func';
import { useDialog } from '@/use/dialog';
import detail from '@/modules/datacenter/shoplive/components/launchnchor/dialog/detail.vue';
import formatPriceForm from '@/utils/formatData';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
const { formatPriceFormYuan } = formatPriceForm;

const toFixedSimple = (num: number) => {
  return (num.toFixed(2) as any) - 0;
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
// const formatterModal = (label: string) => {
//   return function (params: any) {
//     return `<div class="tooltip-wrapper">
//               <p class="p-row">
//                 <span class="right">${params.name}</span>
//               </p>
//               <p class="p-row">
//                 ${params.marker}
//                 <span>${label}：</span>
//                 <span>${params.value}</span>
//                 <span style="padding-left: 12px">${params.percent}%</span>
//               </p>
//             <div>`;
//   };
// };
const legend = {
  show: true,
  bottom: '-2%',
  left: 'center',
  type: 'scroll',
  icon: 'circle',
};
// const seriesOpt = {
//   radius: ['45%', '60%'],
//   label: {
//     show: false,
//   },
// };
export default defineComponent({
  components: {
    pieEcharts,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    catId: {
      type: Number,
      default: 0,
    },
    is_table: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const checkChartOrTable = ref(props.is_table);
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const loading = ref(false);
    const itemGmvPieData = ref<any>([]);
    const itemSalePieData = ref<any>([]);
    const priceGoodsGmvColumn = ref<any>([
      {
        label: '价格带',
        prop: 'name',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '销售额',
        prop: 'value',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: (val: any, _: any) => {
          return val.value !== null ? formatPriceFormYuan(val.value || 0, 2, false) : '--';
        },
      },
      {
        label: '销售额占比',
        prop: 'ratio',
        align: 'center',
        minWidth: 100,
        headerAlign: 'center',
      },
      {
        label: '销量',
        prop: 'sales',
        align: 'center',
        minWidth: 100,
        headerAlign: 'center',
      },
      {
        label: '销量占比',
        prop: 'salesRatio',
        align: 'center',
        minWidth: 100,
        headerAlign: 'center',
      },
      {
        label: '明细查看',
        // prop: 'ratio',
        align: 'center',
        minWidth: 90,
        headerAlign: 'center',
        formatter: (val: any, _: any) => {
          return h(
            'a',
            {
              style: {
                fontSize: '12px',
              },
              on: {
                click: () => {
                  // const $router = ctx.root.$router;
                  // const routeUrl = $router.resolve({
                  //   path:
                  //     '/datacenter/projectDetail/projectShopDetail/' +
                  //     searchParams.value.project_id,
                  //   query: {
                  //     start_date: searchParams.value.start_date,
                  //     end_date: searchParams.value.end_date,
                  //     // project_id: searchParams.value.project_id,
                  //     min_price:
                  //       (val?.name.match(/\d+/g).length > 1
                  //         ? val?.name.match(/\d+/g)[0]
                  //         : undefined) ?? undefined,
                  //     max_price:
                  //       val?.name.match(/\d+/g).length === 1
                  //         ? val?.name.match(/\d+/g)[0]
                  //         : val?.name.match(/\d+/g)[1] ?? undefined,
                  //     is_from_project: searchParams.value.is_from_project,
                  //   } as any,
                  // });
                  // window.open(routeUrl.href, '_blank');
                  dialogProject.show({
                    start_date: searchParams.value.start_date,
                    end_date: searchParams.value.end_date,
                    project_id: searchParams.value.project_id,
                    min_price:
                      (val?.name.match(/\d+/g).length > 1
                        ? val?.name.match(/\d+/g)[0]
                        : undefined) ?? undefined,
                    max_price:
                      val?.name.match(/\d+/g).length === 1
                        ? val?.name.match(/\d+/g)[0]
                        : val?.name.match(/\d+/g)[1] ?? undefined,
                    is_from_project: searchParams.value.is_from_project,
                  });
                  // console.log(
                  //   val,
                  //   val.name.match(/\d+/g),
                  //   (val?.name.match(/\d+/g)).length,
                  //   'ctx.root.$router',
                  // );
                },
              },
            },
            '查看',
          );
        },
      },
    ]);
    const { business_type } = useProjectBaseInfo();
    const getData = async (payload: any) => {
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetDouyinItemPieChart({ ...payload }, business_type.value), //, cat_id: props.catId
      );
      loading.value = false;
      if (response.success) {
        const pie_chart = response.data.pie_chart;
        const gmvTotal = pie_chart.reduce(
          (total: number, item: any) => (total = item.gmv + total),
          0,
        );
        const saleTotal = pie_chart.reduce(
          (total: number, item: any) => (total = item.sale_count + total),
          0,
        );

        itemGmvPieData.value = pie_chart.map((item: any, idx: number) => {
          const obj = {
            name: '',
            value: toFixedSimple(item.gmv / 100),
            ratio: gmvTotal > 0 ? ((item.gmv / gmvTotal) * 100).toFixed(2) + '%' : '0',
            sales: item.sale_count,
            salesRatio:
              saleTotal > 0 ? ((item.sale_count / saleTotal) * 100).toFixed(2) + '%' : '0',
          };
          if (idx <= 0 && item.min_price === 0) {
            obj.name = toFixedSimple(item.max_price / 100) + '以下';
          } else if (idx === pie_chart.length - 1 && !item.max_price) {
            obj.name = toFixedSimple(item.min_price / 100) + '以上';
          } else {
            obj.name =
              '￥' +
              toFixedSimple(item.min_price / 100) +
              '-' +
              '￥' +
              toFixedSimple(item.max_price / 100);
          }
          return obj;
        });

        itemSalePieData.value = pie_chart.map((item: any, idx: number) => {
          const obj = {
            name: '',
            value: item.sale_count,
            ratio: saleTotal > 0 ? ((item.sale_count / saleTotal) * 100).toFixed(2) + '%' : '0',
          };
          if (idx <= 0 && item.min_price === 0) {
            obj.name = toFixedSimple(item.max_price / 100) + '以下';
          } else if (idx === pie_chart.length - 1 && !item.max_price) {
            obj.name = toFixedSimple(item.min_price / 100) + '以上';
          } else {
            obj.name =
              '￥' +
              toFixedSimple(item.min_price / 100) +
              '-' +
              '￥' +
              toFixedSimple(item.max_price / 100);
          }
          return obj;
        });
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    onBeforeMount(() => {
      if (!searchParams.value.project_id) return;
      if (props.visible) {
        getData(searchParams.value);
      }
    });
    watch(
      () => props.visible,
      val => {
        if (val) {
          getData(searchParams.value);
        }
      },
    );
    // watch(
    //   () => props.catId,
    //   val => {
    //     if (val) {
    //       getData(searchParams.value);
    //     }
    //   },
    // );
    watch(
      () => searchParams.value,
      val => {
        getData(searchParams.value);
      },
      { deep: true },
    );
    return {
      checkChartOrTable,
      itemGmvPieData,
      itemSalePieData,
      loading,
      priceGoodsGmvColumn,
    };
  },
  render() {
    return (
      <div class="pirce-pie">
        <div class={this.checkChartOrTable ? 'pie-main ' : 'pie-main hide'}>
          <div class="pie">
            <pie-echarts
              title={{
                text: '销售额',
                x: '10',
                y: '10',
                textStyle: {
                  color: 'var(--text-color)',
                  fontWeight: 400,
                  fontSize: 14,
                },
              }}
              title-two={{
                text: '销量',
                x: '90',
                y: '90',
                textStyle: {
                  color: 'var(--text-color)',
                  fontWeight: 400,
                  fontSize: 14,
                },
              }}
              legend={legend}
              pieWidth={560}
              styles={'width: 560px; height:233px'}
              pie-data={this.itemGmvPieData}
              pie-two-data={this.itemSalePieData}
              loading={this.loading}
            />
          </div>
        </div>
        <div class={this.checkChartOrTable ? 'table-main hide' : 'table-main '}>
          <div class="table">
            <tg-table
              height="235"
              width="100%"
              v-loading={this.loading}
              border
              data={this.itemGmvPieData}
            >
              {this.priceGoodsGmvColumn.map((item: any) => {
                return <el-table-column attrs={{ ...item }} />;
              })}
              <fragments slot="empty">
                <empty-common imgHeight="80" imgWidth="120" detail-text="暂无数据"></empty-common>
              </fragments>
            </tg-table>
          </div>
        </div>
      </div>
    );
  },
});
