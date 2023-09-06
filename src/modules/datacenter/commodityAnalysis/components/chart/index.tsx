/*
 * @Author: 肖槿
 * @Date: 2021-12-01 13:46:32
 * @Description: 图形展示
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-09 16:00:00
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\components\chart\index.tsx
 */
import { defineComponent, ref } from '@vue/composition-api';
import { useSearch } from '../../use';
import pieEcharts from '@/modules/datacenter/components/pie/index.vue';
import categoryEcharts from '@/modules/datacenter/components/category/index.vue';
import {
  useCategoryPieChart,
  useItemPieChart,
  useSaleGoodsTop,
  useCommodityGoodsData,
  useHotItemReport,
} from '@/modules/datacenter/commodityAnalysis/use';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
// import formatData from '@/utils/formatData';
import { chartParams } from '../../types';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import goodsTop from './goodsTop.vue';

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
  props: {},
  components: {
    pieEcharts,
    goodsTop,
    BaseEcharts,
    categoryEcharts,
    Empty,
  },
  setup(prop, ctx) {
    const { gmvPieData, salePieData, getData, loading } = useCategoryPieChart(ctx);
    const goodData = useCommodityGoodsData(ctx);
    const saleInfo = ref({
      num: 10,
      page_num: 1,
      sort: '',
      title: '',
    });
    const checkChartOrTable = ref<boolean>(true);
    let projectAndDate: chartParams = {
      project_id: undefined,
      start_date: undefined,
      end_date: undefined,
    };
    const {
      gmvPieData: itemGmvPieData,
      salePieData: itemSalePieData,
      getData: getItemData,
      loading: itemLoading,
      priceGoodsColumn,
      priceGoodsGmvColumn,
    } = useItemPieChart(ctx);
    const {
      saleData: topSaleData,
      getData: getTopData,
      loading: topLoading,
    } = useSaleGoodsTop(ctx);

    const {
      saleData: topUnSaleData,
      getData: getUnTopData,
      loading: topUnLoading,
    } = useSaleGoodsTop(ctx);

    const {
      saleData: saleInfoData,
      getData: getSaleInfo,
      loading: saleInfoLoading,
      total: infoTotal,
      hotGoodsColumn: infoColumn,
    } = useSaleGoodsTop(ctx);
    const {
      saleData: hotItemData,
      getData: getHotItemData,
      hotGoodsColumn,
      loading: hotItemLoading,
    } = useHotItemReport(ctx);
    useSearch(data => {
      saleInfo.value.page_num = 1;
      saleInfo.value.title = '';
      const obj: chartParams = {
        start_date: data.start_date,
        end_date: data.end_date,
        project_id: data.project_id,
      };
      projectAndDate = obj;
      getData(obj);
      getItemData(obj);
      getTopData({ ...obj, sort: 'sale_count_desc', num: 10, page_num: 1 });
      getUnTopData({ ...obj, sort: 'sale_count', num: 10, page_num: 1 });
      getHotItemData(obj);
      getSaleInfo({ ...obj, ...saleInfo.value });
      goodData.category_report_query(data).then(() => {
        ctx.emit('report', goodData.category_report);
      });
    });
    const searchInfo = () => {
      getSaleInfo({ ...projectAndDate, ...saleInfo.value });
    };
    const tableSort = (column: { prop: string; order: string }) => {
      const { prop, order } = column;
      if (order === null) {
        saleInfo.value.sort = 'sale_count_desc';
      } else {
        saleInfo.value.sort = order === 'ascending' ? prop : prop + '_desc';
      }
      searchInfo();
    };
    return {
      getData,
      getSaleInfo,
      searchInfo,
      tableSort,
      salePieData,
      priceGoodsColumn,
      priceGoodsGmvColumn,
      saleInfoData,
      hotItemData,
      gmvPieData,
      infoTotal,
      checkChartOrTable,
      infoColumn,
      saleInfo,
      loading,
      itemGmvPieData,
      itemSalePieData,
      topUnSaleData,
      topSaleData,
      itemLoading,
      saleInfoLoading,
      hotGoodsColumn,
      hotItemLoading,
      topUnLoading,
      topLoading,
    };
  },
  render() {
    return (
      <div class="commodity-analysis-chart">
        <div class="analysis-pie-chart">
          <div class="category-pie">
            <h6>类目销售分析</h6>
            <div class="pie-main">
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
                  styles={'width: 332px; height:283px'}
                  pie-data={this.salePieData}
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
                  styles={'width: 332px; height:283px'}
                  pie-data={this.gmvPieData}
                  loading={this.loading}
                  formatterModal={formatterModal('销售额')}
                />
              </div>
            </div>
          </div>
          <div class="pirce-pie">
            <h6>
              <span>价格带销售分析</span>
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
            </h6>

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
                  styles={'width: 332px; height:283px'}
                  pie-data={this.itemSalePieData}
                  loading={this.itemLoading}
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
                  styles={'width: 332px; height:283px'}
                  pie-data={this.itemGmvPieData}
                  loading={this.itemLoading}
                  formatterModal={formatterModal('销售额')}
                />
              </div>
            </div>

            <div class={this.checkChartOrTable ? 'table-main hide' : 'table-main '}>
              <div class="table">
                <tg-table
                  height="235"
                  v-loading={this.itemLoading}
                  border
                  data={this.itemSalePieData}
                >
                  {this.priceGoodsColumn.map((item: any) => {
                    return <el-table-column attrs={{ ...item }} />;
                  })}
                </tg-table>
              </div>
              <div class="table">
                <tg-table
                  height="235"
                  v-loading={this.itemLoading}
                  border
                  data={this.itemGmvPieData}
                >
                  {this.priceGoodsGmvColumn.map((item: any) => {
                    return <el-table-column attrs={{ ...item }} />;
                  })}
                </tg-table>
              </div>
            </div>
          </div>
        </div>
        <div class="analysi-table">
          <div class="best-sale-goods">
            <goods-top
              v-loading={this.topLoading}
              title="畅销商品榜"
              topTitle="爆款商品TOP10"
              tableData={this.topSaleData}
            />
          </div>
          <div class="sale-goods-rate">
            <h2 class="title">爆款商品销售占比</h2>
            <div class="rate-table">
              <el-table height="248" v-loading={this.hotItemLoading} stripe data={this.hotItemData}>
                {this.hotGoodsColumn.map((item: any) => {
                  return <el-table-column attrs={{ ...item }} />;
                })}
              </el-table>
            </div>
            <div class="rate-charts">
              <category-echarts
                style="height: 280px"
                loading={this.hotItemLoading}
                pie-data={this.hotItemData.map(v => ({
                  name: v.title?.replace('爆款商品', ''),
                  value: v.sale_count_part,
                }))}
              />
            </div>
          </div>
          <div class="unsale-goods">
            <goods-top
              v-loading={this.topLoading}
              title="滞销商品榜"
              topTitle="滞销商品TOP10"
              tableData={this.topUnSaleData}
            />
          </div>
        </div>
        <div class="sale-info-table">
          <h2>商品销售详情</h2>
          <div class="table-main">
            <el-input
              v-model_trim={this.saleInfo.title}
              size="mini"
              placeholder="请输入商品名称或商品编码"
              style="width: 400px"
              nativeOn={{
                keyup: (e: KeyboardEvent) => {
                  if (e.keyCode === 13) {
                    this.saleInfo.page_num = 1;
                    this.searchInfo();
                  }
                },
              }}
              // onBlur={() => {
              //   this.searchInfo();
              // }}
            >
              <i class="el-icon-search el-input__icon" slot="prefix" />
            </el-input>
            <div class="table-lalal mgt-12">
              <tg-table
                stripe
                v-loading={this.saleInfoLoading}
                data={this.saleInfoData}
                default-sort={{ prop: 'sale_count', order: 'descending' }}
                on-sort-change={this.tableSort}
                maxHeight={638}
              >
                {this.infoColumn.map((item: any) => {
                  return <el-table-column attrs={{ ...item }} />;
                })}
                <fragments slot="empty">
                  <empty-common detail-text="暂无数据"></empty-common>
                </fragments>
              </tg-table>
              {this.saleInfoData.length > 0 && (
                <div class="block flex-none">
                  <el-pagination
                    current-page={this.saleInfo.page_num}
                    page-sizes={[10]}
                    pageSize={this.saleInfo.num}
                    total={this.infoTotal}
                    oncurrent-change={(page_num: number) => {
                      this.saleInfo.page_num = page_num;
                      this.searchInfo();
                    }}
                    layout="total, prev, pager, next, sizes, jumper"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
