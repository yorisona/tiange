/*
 * @Author: 肖槿
 * @Date: 2022-01-05 16:19:54
 * @Description:竞品分析
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-30 16:13:02
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\competitor\index.tsx
 */
import { defineComponent, onMounted, ref, h, computed } from '@vue/composition-api';
import {
  useCategory,
  getCategoryColumn,
  useSummary,
  getSummaryColumn,
  summaryColumnByDate,
  ExportList,
  useTimeline,
} from '../../use';
import competitorDialog from '../../components/competitorDialog.vue';
import moment from 'moment';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
import Charts from '@/modules/datacenter/components/line/lineCommodity.vue';
import { CompeteShopStyleOptions } from '@/const/datacenter';
import { dateAndCateDouyinCompetitiveParams } from '@/modules/datacenter/competitor/types';
import { ExportProductData } from '@/services/datacenter';
import { wait } from '@/utils/func';
import { useRouter } from '@/use/vue-router';
import { RouterWorkbench } from '@/const/router';

const { formatPriceFormYuan } = formatPriceForm;
export default defineComponent({
  components: {
    competitorDialog,
    'line-charts': Charts,
  },
  setup(_, ctx) {
    const radio = ref(1);
    const columns: any = [];
    const curDate = ref<string[]>([]);
    const shopName = computed<string | undefined>(() => {
      if (cummaryParams.value.shop_name === '全部' || !categoryParams.value.shop_name)
        return undefined;
      return categoryParams.value.shop_name;
    });
    const {
      loading,
      getData,
      categoryParams,
      shopList,
      categoryData,
      getShopData,
      total_gmv,
      total_sale_count,
    } = useCategory(ctx);
    const {
      loading: sLoading,
      getData: sgetDataOri,
      cummaryParams,
      summaryData,
      summaryTotal,
    } = useSummary(ctx);

    // 要加一个额外参数..只能这样兼容一下了
    const sgetData = (payload: dateAndCateDouyinCompetitiveParams, value: number) => {
      const transPlayload = {
        style: categoryParams.value.style,
        ...payload,
      };
      return sgetDataOri(transPlayload, value);
    };
    const timeline = useTimeline();
    const getSummaries = () => {
      const sums: Array<any> = [];
      sums[0] = '合计';
      sums[1] = '';
      sums[2] = total_gmv.value === null ? '' : formatPriceFormYuan(total_gmv.value, 2, false);
      sums[3] =
        total_sale_count.value === null ? '' : numberFormat(total_sale_count.value, 0, '.', ',');
      sums[4] = '';
      sums[5] = '';
      return sums;
    };
    const radioChange = () => {
      cummaryParams.value.page_num = 1;
      sgetData(cummaryParams.value, radio.value);
    };
    const search = async () => {
      categoryParams.value.start_date = curDate.value[0];
      categoryParams.value.end_date = curDate.value[1];
      await getData(categoryParams.value);
      // cummaryParams.value.item_cat = categoryData.value[0]?.item_cat;
      summaryData.value = [];
      summaryTotal.value = 0;
      // if (shopName.value !== undefined) return;
      cummaryParams.value.page_num = 1;
      cummaryParams.value.shop_name = shopName.value;
      cummaryParams.value.start_date = categoryParams.value.start_date;
      cummaryParams.value.end_date = categoryParams.value.end_date;
      sgetData(cummaryParams.value, radio.value);
    };
    const exportCategory = () => {
      ExportList(categoryParams.value, '/api/shop_live/export_douyin_competitive_item_categories');
    };
    const router = useRouter();
    const exportLoading = ref(false);
    const exportSummary = async () => {
      const _url =
        radio.value === 1
          ? '/api/shop_live/export_douyin_competitive_items_total'
          : '/api/shop_live/export_douyin_competitive_items';
      // ExportList(
      //   {
      //     style: categoryParams.value.style,
      //     ...cummaryParams.value,
      //   },
      //   _url,
      // );
      exportLoading.value = true;
      const [res] = await wait(200, ExportProductData(_url, cummaryParams.value));
      exportLoading.value = false;
      if (res.data.success) {
        // ctx.root.$message.success('导出成功');
        setTimeout(() => {
          const { href } = router.resolve({
            name: RouterWorkbench.home.mine_files,
          });
          window.open(href, '_blank');
        }, 100);
      } else {
        ctx.root.$message.error(res.data.message || '导出失败');
      }
    };
    const reset = () => {
      const _start = moment().add(-30, 'days').format('YYYY-MM-DD');
      const _end = moment().format('YYYY-MM-DD');
      curDate.value = [_start, _end];
      categoryParams.value.start_date = _start;
      categoryParams.value.end_date = _end;
      categoryParams.value.shop_name = undefined;
      categoryParams.value.style = undefined;
      categoryParams.value.sort = undefined;
      (ctx.refs['tableCategoryRef'] as any).clearSort();

      summaryData.value = [];
      summaryTotal.value = 0;
      cummaryParams.value.page_num = 1;
      categoryParams.value.sort = undefined;
      (ctx.refs['tableSummaryRef'] as any).clearSort();

      getData(categoryParams.value);
    };
    const showDialog = () => {
      (ctx.refs.competitorDialogRef as unknown as { show: (shopList: any[]) => void }).show(
        JSON.parse(JSON.stringify(shopList.value)),
      );
    };
    const dialogClose = (list: any[]) => {
      shopList.value = list;
    };
    const categoryRowClick = (row: any) => {
      const oldCat = cummaryParams.value.third_cat_id;
      if (oldCat === row.third_cat_id) {
        cummaryParams.value.third_cat_id = undefined;
      } else {
        cummaryParams.value.third_cat_id = row.third_cat_id;
      }
      cummaryParams.value.page_num = 1;
      cummaryParams.value.shop_name = shopName.value;
      cummaryParams.value.start_date = categoryParams.value.start_date;
      cummaryParams.value.end_date = categoryParams.value.end_date;
      sgetData(cummaryParams.value, radio.value);
    };
    const onSortChange = (prop: string, order: 'ascending' | 'descending' | null) => {
      cummaryParams.value.page_num = 1;
      if (order === null) {
        cummaryParams.value.sort = undefined;
      } else if (order === 'ascending') {
        cummaryParams.value.sort = `${prop}`;
      } else if (order === 'descending') {
        cummaryParams.value.sort = `${prop}_desc`;
      } else {
        console.log('未知', order);
        return;
      }
      sgetData(cummaryParams.value, radio.value);
    };
    onMounted(() => {
      // getData(categoryParams.value);
      curDate.value = [categoryParams.value.start_date!, categoryParams.value.end_date!];
      getShopData();
      search();
      // sgetData(cummaryParams.value, radio.value);
    });

    return {
      categoryParams,
      shopList,
      radioChange,
      ExportList,
      exportSummary,
      timeline,
      exportCategory,
      cummaryParams,
      summaryTotal,
      sLoading,
      summaryData,
      showDialog,
      dialogClose,
      sgetData,
      radio,
      loading,
      categoryData,
      categoryRowClick,
      columns,
      getData,
      getSummaries,
      search,
      curDate,
      reset,
      onSortChange,
      shopName,
      exportLoading,
    };
  },
  render() {
    // 是否开启分类的排序
    const hasCategoryData = this.categoryData.length > 0;
    const categoryColumn = getCategoryColumn(hasCategoryData);

    //是否开启商品信息的排序
    const hasSummaryData = this.summaryData.length > 0;
    const summaryColumn = getSummaryColumn(hasSummaryData, col => {
      // if (!this.shopName) {
      //   this.$message.warning('请选择竞品账号');
      //   return;
      // }
      this.timeline.queryCategory({
        shop_name: this.categoryParams.shop_name,
        item_id: col.item_id,
      });
    });

    return (
      <div class="data-center-competitor">
        <div class="competitor-form">
          <el-form class="filter-form flex-form" inline label-width="60px" size="mini">
            <el-form-item label="竞品店铺风格：" prop="style" label-width="110">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.categoryParams.style}
                onChange={() => {
                  this.categoryParams.shop_name = undefined;
                }}
              >
                <el-option label="全部" value={undefined} />
                {CompeteShopStyleOptions.map(item => {
                  return <el-option label={item.label} key={item.value} value={item.value} />;
                })}
              </el-select>
            </el-form-item>
            <el-form-item label="竞品账号：" prop="">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.categoryParams.shop_name}
                filterable
                placeholder="全部"
              >
                <el-option label="全部" value={undefined} />
                {this.shopList
                  .filter(item => {
                    if (this.categoryParams.style === undefined) return true;
                    return item.style === (this.categoryParams.style as any);
                  })
                  .map((item, key2) => {
                    return <el-option label={item.shop_name} key={key2} value={item.shop_name} />;
                  })}
              </el-select>
            </el-form-item>
            <el-form-item label="日期：" label-width="42px">
              <el-date-picker
                style="width: 240px"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="~"
                type="daterange"
                v-model={this.curDate}
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                clearable={false}
              />
            </el-form-item>
            <el-form-item>
              <tg-button type="primary" onClick={this.search}>
                查询
              </tg-button>
              <tg-button class="mgl-8" onClick={this.reset}>
                重置
              </tg-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="competitor-main">
          <div class="competitor-category">
            <div class="action-btn">
              <div style="display:flex;alian-item:center">
                <tg-button
                  type="default"
                  icon="ico-btn-export"
                  download
                  onClick={this.exportCategory}
                >
                  导出类目数据
                </tg-button>
                <tg-button class="text " type="link" onClick={this.showDialog}>
                  管理竞品店铺
                </tg-button>
              </div>
              <div>
                <tg-table
                  ref="tableCategoryRef"
                  highlight-current-row={true}
                  v-loading={this.loading}
                  show-summary={true}
                  summary-method={this.getSummaries}
                  height={375}
                  onrow-click={this.categoryRowClick}
                  row-style={{ cursor: 'pointer' }}
                  columns={categoryColumn}
                  data={this.categoryData}
                  scopedSlots={{
                    empty: () => {
                      return (
                        <div style="position: static;">
                          <empty-common detail-text="暂无数据，快去管理竞品店铺新增吧~"></empty-common>
                        </div>
                      );
                    },
                  }}
                  stripe={true}
                  sort={this.categorySort}
                  onSort-change={(params: {
                    column: any;
                    prop: string;
                    order: 'ascending' | 'descending' | null;
                  }) => {
                    let prop = params.prop;
                    prop = prop.replace(/_str$/, '');
                    if (params.order === null) {
                      this.categoryParams.sort = undefined;
                    } else if (params.order === 'ascending') {
                      this.categoryParams.sort = `${prop}`;
                    } else if (params.order === 'descending') {
                      this.categoryParams.sort = `${prop}_desc`;
                    } else {
                      console.log('未知', params.order);
                      return;
                    }
                    this.search();
                  }}
                />
              </div>
            </div>
          </div>
          <div class="competitor-export">
            <div class="action-btn">
              <el-radio-group v-model={this.radio} onChange={this.radioChange}>
                <el-radio class="el-radio-mini" label={1}>
                  汇总查看
                </el-radio>
                <el-radio class="el-radio-mini" label={2}>
                  按日查看明细
                </el-radio>
              </el-radio-group>
              <tg-button
                class="mgl-24"
                type="default"
                icon="ico-btn-export"
                download
                onClick={this.exportSummary}
              >
                导出商品数据
              </tg-button>
            </div>
            <div>
              <tg-table
                ref="tableSummaryRef"
                highlight-current-row={true}
                stripe
                style="padding-bottom: 50px;"
                v-loading={this.sLoading}
                columns={this.radio === 1 ? summaryColumn : summaryColumnByDate}
                data={this.summaryData}
                sortable="custom"
                scopedSlots={{
                  empty: () => {
                    return (
                      <div style="position: static;">
                        <empty-common detail-text="暂无数据，快去管理竞品店铺新增吧~"></empty-common>
                      </div>
                    );
                  },
                }}
                onSort-change={(column: any) => {
                  this.onSortChange(column.prop, column.order);
                }}
              />
              {this.summaryTotal > 0 && (
                <div class="competitor-page">
                  <el-pagination
                    className="mgt-10"
                    current-page={this.cummaryParams.page_num}
                    page-sizes={[10, 20, 50, 100]}
                    pageSize={this.cummaryParams.num}
                    total={this.summaryTotal}
                    oncurrent-change={(page_num: number) => {
                      this.cummaryParams.page_num = page_num;
                      this.sgetData(this.cummaryParams, this.radio);
                    }}
                    onsize-change={(num: number) => {
                      this.cummaryParams.num = num;
                      this.sgetData(this.cummaryParams, this.radio);
                    }}
                    layout="total, prev, pager, next, sizes, jumper"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <competitor-dialog ref="competitorDialogRef" onClose={this.dialogClose} />
        <el-dialog
          class="tg-dialog-classic el-dialog-center-rewrite"
          width="1100px"
          custom-class="competitor-dialog"
          visible={this.timeline.visible}
          append-to-body={true}
          close-on-click-modal={false}
          close-on-press-escape={false}
          wrapperClosable={false}
          title={this.timeline.title}
          onClose={this.timeline.onClose}
        >
          <div class="charts-box" style="padding: 40px 0;">
            <line-charts
              className="line-chart"
              date={this.timeline.charts.data}
              loading={this.timeline.loading}
              list={this.timeline.charts.series}
              unit=" "
            />
          </div>
        </el-dialog>
        <tg-mask-loading visible={this.exportLoading} content="正在导出，请稍候..." />
      </div>
    );
  },
});
