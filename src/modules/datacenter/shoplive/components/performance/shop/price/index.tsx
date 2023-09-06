import { defineComponent, h, inject, onBeforeMount, ref, watch } from '@vue/composition-api';
import pieEcharts from './pieIndex.vue';
import moment from 'moment';
import { GetSystemShopLivePieChart } from '@/services/datacenter/shoplive';
import { wait } from '@/utils/func';
import { useDialog } from '@/use/dialog';
import detail from '@/modules/datacenter/shoplive/components/launchnchor/dialog/detail.vue';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

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
const legend = {
  show: true,
  bottom: '-2%',
  left: 'center',
  type: 'scroll',
  icon: 'circle',
};
export default defineComponent({
  components: {
    pieEcharts,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    is_table: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const checkChartOrTable = ref(props.is_table);
    const searchParams = inject<any>('searchOneParams');
    const loading = ref(false);
    const itemGmvPieData = ref<any>([]);
    const itemData = ref<any>([]);
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
        prop: 'gmv_value',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '销售额占比',
        prop: 'gmv_ratio',
        align: 'center',
        minWidth: 100,
        headerAlign: 'center',
      },
      {
        label: '销量',
        prop: 'sale_value',
        align: 'center',
        minWidth: 100,
        headerAlign: 'center',
      },
      {
        label: '销量占比',
        prop: 'sale_ratio',
        align: 'center',
        minWidth: 100,
        headerAlign: 'center',
      },
      {
        label: '明细查看',
        prop: 'ratio',
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
                  dialogProject.show({
                    project_id: searchParams.value.project_id,
                    start_date: moment(searchParams.value.start_date).format('YYYY-MM-DD'),
                    end_date: moment(searchParams.value.end_date).format('YYYY-MM-DD'),
                    room_id: searchParams.value.room_id,
                    // project_id: searchParams.value.project_id,
                    min_price:
                      (val?.name.match(/\d+/g).length > 1
                        ? val?.name.match(/\d+/g)[0]
                        : undefined) || undefined,
                    max_price:
                      val?.name.match(/\d+/g).length === 1
                        ? val?.name.match(/\d+/g)[0]
                        : val?.name.match(/\d+/g)[1] ?? undefined,
                    is_from_project: searchParams.value.is_from_project,
                  });
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
      if (!payload.start_date) {
        return;
      }
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetSystemShopLivePieChart({ ...payload }, business_type.value),
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

        itemData.value = pie_chart.map((item: any, idx: number) => {
          const obj = {
            name: '',
            sale_value: item.sale_count,
            sale_ratio:
              saleTotal > 0 ? ((item.sale_count / saleTotal) * 100).toFixed(2) + '%' : '0',
            gmv_value: toFixedSimple(item.gmv / 100),
            gmv_ratio: gmvTotal > 0 ? ((item.gmv / gmvTotal) * 100).toFixed(2) + '%' : '0',
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
    watch(
      () => searchParams.value,
      val => {
        getData(searchParams.value);
      },
    );
    return {
      itemData,
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
              pieWidth={580}
              styles={'width: 580px; height:233px'}
              pie-data={this.itemGmvPieData}
              pie-two-data={this.itemSalePieData}
              loading={this.loading}
            />
          </div>
        </div>
        <div class={this.checkChartOrTable ? 'table-main hide' : 'table-main '}>
          <div class="table">
            <tg-table v-tableFit height="235" v-loading={this.loading} border data={this.itemData}>
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
