import { defineComponent, inject, onBeforeMount, Ref, ref, watch } from '@vue/composition-api';
import pieEcharts from '@/modules/datacenter/commodityAnalysis/components/pie/index.vue';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';

import { GetDouyinItemPieChart } from '@/services/datacenter';
import { wait } from '@/utils/func';

const toFixedSimple = (num: number) => {
  return (num.toFixed(2) as any) - 0;
};

const formatterModal = (label: string) => {
  return function (params: any) {
    return `<div class="tooltip-wrapper">
                      <p class="p-row">
                        <span class="right">${params.name}</span>
                      </p>
                      <p class="p-row">
                        ${params.marker}
                        <span>${label}：</span>
                        <span>${params.value}</span>
                        <span style="padding-left: 12px">${params.percent}%</span>
                      </p>
                    <div>`;
  };
};
const legend = {
  bottom: '-2%',
  left: 'center',
  type: 'scroll',
  icon: 'circle',
};
const seriesOpt = {
  radius: ['30%', '45%'],
  label: {
    show: false,
  },
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
    catId: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const checkChartOrTable = ref(true);
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const loading = ref(false);
    const itemGmvPieData = ref<any>([]);
    const itemSalePieData = ref<any>([]);
    const priceGoodsColumn = ref<any>([
      {
        label: '价格带',
        prop: 'name',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '销量',
        prop: 'value',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '占比',
        prop: 'ratio',
        align: 'center',
        width: 90,
        headerAlign: 'center',
      },
    ]);
    const priceGoodsGmvColumn = ref<any>([
      {
        label: '价格带',
        prop: 'name',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '销售额',
        prop: 'value',
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '占比',
        prop: 'ratio',
        align: 'center',
        width: 90,
        headerAlign: 'center',
      },
    ]);
    const getData = async (payload: any) => {
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetDouyinItemPieChart({ ...payload, cat_id: props.catId }),
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
          checkChartOrTable.value = true;
          getData(searchParams.value);
        }
      },
    );
    return {
      checkChartOrTable,
      itemGmvPieData,
      itemSalePieData,
      loading,
      priceGoodsColumn,
      priceGoodsGmvColumn,
    };
  },
  render() {
    return (
      <div class="pirce-pie">
        <div class="icon-row">
          <tg-icon
            onClick={() => (this.checkChartOrTable = true)}
            class={this.checkChartOrTable ? 'icon left active' : 'icon left'}
            name="ico-icon_tongyong_bingtu2"
          />
          <span class="line"></span>
          <tg-icon
            onClick={() => (this.checkChartOrTable = false)}
            class={!this.checkChartOrTable ? 'icon right active' : 'icon right'}
            name="ico-icon_tongyong_liebiao1"
          />
        </div>

        <div class={this.checkChartOrTable ? 'pie-main ' : 'pie-main hide'}>
          <div class="pie">
            <pie-echarts
              title={{
                text: '销量',
                x: 'center',
                y: 'center',
                textStyle: {
                  color: 'var(--text-color)',
                  fontWeight: 400,
                  fontSize: 14,
                },
              }}
              legend={legend}
              seriesOpt={seriesOpt}
              styles={'width: 100%; height:233px'}
              pie-data={this.itemSalePieData}
              loading={this.loading}
              formatterModal={formatterModal('销量')}
            />
          </div>
          <div class="pie">
            <pie-echarts
              title={{
                text: '销售额',
                x: 'center',
                y: 'center',
                textStyle: {
                  color: 'var(--text-color)',
                  fontWeight: 400,
                  fontSize: 14,
                },
              }}
              legend={legend}
              seriesOpt={seriesOpt}
              styles={'width: 100%; height:233px'}
              pie-data={this.itemGmvPieData}
              loading={this.loading}
              formatterModal={formatterModal('销售额')}
            />
          </div>
        </div>
        <div class={this.checkChartOrTable ? 'table-main hide' : 'table-main '}>
          <div class="table">
            <tg-table height="235" v-loading={this.loading} border data={this.itemSalePieData}>
              {this.priceGoodsColumn.map((item: any) => {
                return <el-table-column attrs={{ ...item }} />;
              })}
            </tg-table>
          </div>
          <div class="table">
            <tg-table height="235" v-loading={this.loading} border data={this.itemGmvPieData}>
              {this.priceGoodsGmvColumn.map((item: any) => {
                return <el-table-column attrs={{ ...item }} />;
              })}
            </tg-table>
          </div>
        </div>
      </div>
    );
  },
});
