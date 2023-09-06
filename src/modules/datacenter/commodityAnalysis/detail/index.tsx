import {
  defineComponent,
  ref,
  nextTick,
  onActivated,
  reactive,
  toRef,
  h as vueH,
  inject,
} from '@vue/composition-api';
import { useCommodityGoodsData, useTableConversionRow } from './use';
import { render } from '@/use/vue';
import Charts from '@/modules/datacenter/components/line/lineCommodity.vue';
import { useRouter } from '@/use/vue-router';
import hotImg from '@/assets/img/hot_goods.png';
import subHotImg from '@/assets/img/sub_hot_goods.png';
import { RouterDataCenter, RouterWorkbench } from '@/const/router';
import { ExportCommodityAnalysisDetailV2 } from '@/services/datacenter';
import { wait } from '@/utils/func';
import ImageViewer from '@/components/Image/ImageViewer';

export default defineComponent({
  components: {
    'line-charts': Charts,
  },
  setup: render((props: any, ctx: any) => {
    const exportLoading = ref(false);
    const h: any = vueH;
    const router = useRouter();
    const parentParams = reactive<{
      is_from_project?: boolean;
      room_id?: string;
      project_id: string | undefined;
      start_date: string | undefined;
      end_date: string | undefined;
      project_name: string | undefined;
      type: string;
      year: string | undefined | number;
      season: string | undefined | number;
      second_tiange_cat_id: string | undefined | number;
      third_tiange_cat_id: string | undefined | number;
      seasonType: string | undefined;
      first_tiange_cat_id: string | undefined | number;
      item_id: string | undefined;
    }>({
      is_from_project: false,
      room_id: '',
      project_id: undefined,
      start_date: undefined,
      end_date: undefined,
      project_name: undefined,
      type: '',
      year: undefined,
      season: undefined,
      second_tiange_cat_id: undefined,
      third_tiange_cat_id: undefined,
      seasonType: undefined,
      first_tiange_cat_id: undefined,
      item_id: undefined,
    });
    const goodData = useCommodityGoodsData();
    let tableData = useTableConversionRow({
      columns: [
        {
          label: '商品主图',
          prop: 'image_url',
          formatter: (text, row, column) => {
            let rate = 0;
            if (row.click_rate !== null && row.click_rate !== undefined) {
              rate = Number(row.click_rate.replace('%', ''));
            }
            if (parentParams.room_id && parentParams.room_id !== '') {
              return (
                <div
                  class="goods-descript"
                  onclick={() => {
                    ImageViewer.show([text]);
                  }}
                >
                  <img class="first-row-img" src={text} />
                </div>
              );
            }
            return (
              <div
                class="goods-descript"
                onclick={() => {
                  ImageViewer.show([text]);
                }}
              >
                <img class="first-row-img" src={text} />
                {rate >= 15 ? (
                  <img class="hot-img" src={hotImg} />
                ) : rate >= 12 ? (
                  <img class="hot-img" src={subHotImg} />
                ) : (
                  ''
                )}
              </div>
            );
          },
        },
        {
          label: '商品编码',
          prop: 'item_id',
          formatter: text => {
            return <span class="goods_code">{text}</span>;
          },
        },
        { label: '商品款号', prop: 'item_sn' },
        {
          label: '商品名称',
          prop: 'title',
          formatter: (text, row) => {
            return (
              <a href={row.item_url} target="_blank" class="goods_name" title={text}>
                {text}
              </a>
            );
          },
        },
        {
          label: '官方类目',
          // prop: 'third_tiange_cat',
          formatter: (text, row, column) => {
            const { first_tiange_cat, second_tiange_cat, third_tiange_cat } = row;
            return (
              <span class="goods_code">
                {first_tiange_cat + '-' + second_tiange_cat + '-' + third_tiange_cat}
              </span>
            );
          },
        },
        {
          label: '年度',
          prop: 'year',
          formatter: (text: string | number) => {
            return text !== null ? text || '0' : '--';
          },
        },
        {
          label: '季节',
          prop: 'season',
          formatter: (text: number) => {
            return text !== null ? text || '0' : '--';
          },
        },
        { label: '吊牌价', prop: 'market_price', sortable: 'custom' },
        { label: '平均销售价 (元)', prop: 'shop_price', sortable: 'custom' },
        { label: '讲解次数', prop: 'talk_times', sortable: 'custom' },
        { label: '直播销量', prop: 'sale_count', sortable: 'custom' },
        { label: '直播销售额 (元)', prop: 'gmv', sortable: 'custom' },
        { label: '店铺销量', prop: 'shop_sale_count', sortable: 'custom' },
        { label: '店铺销售额 (元)', prop: 'shop_gmv', sortable: 'custom' },
        { label: '曝光人数', prop: 'watch_ucnt', sortable: 'custom' },
        { label: '点击人数', prop: 'click_ucnt', sortable: 'custom' },
        { label: '点击率', prop: 'click_rate', sortable: 'custom' },
        { label: '转化率', prop: 'pay_rate', sortable: 'custom' },
        { label: '上周销量', prop: 'last_week_sale_count', sortable: 'custom' },
        { label: '上周销售额 (元)', prop: 'last_week_gmv', sortable: 'custom' },
        { label: '累计销量', prop: 'total_sale_count', sortable: 'custom' },
      ],
      data: toRef(goodData, 'project_report'),
      onSortChange: (prop: string, order: string | null) => {
        if (order === null) {
          sort.value = '';
        } else {
          const orderStr = order === 'descending' ? '_desc' : '';
          sort.value = `${prop}${orderStr}`;
        }
        search();
      },
      defaultSort: { prop: 'shop_sale_count', order: 'descending' },
    });

    const tableRef = ref<{ setCurrentRow: () => void }>();
    const selectedRow = ref<any>({});
    const projectTableRef = ref<any>();
    const checkList = ref({
      displayHot: false,
      displaySubHot: false,
      displayOther: true,
      displayRadio: '全部',
    });
    // 分页
    const page_num = ref(1);
    // 排序
    const sort = ref('shop_sale_count_desc');
    // 路由参数

    const search = () => {
      return goodData.query_project({
        room_id: parentParams.room_id || '',
        project_id: parentParams.project_id,
        start_date: parentParams.start_date,
        end_date: parentParams.end_date,
        page_num: page_num.value,
        hot: checkList.value.displayOther === true ? undefined : Number(checkList.value.displayHot),
        second_hot:
          checkList.value.displayOther === true ? undefined : Number(checkList.value.displaySubHot),
        sort: sort.value,
        year: parentParams.year === '全部' ? undefined : parentParams.year,
        season: parentParams.season === '全部' ? undefined : parentParams.season,
        second_tiange_cat_id: parentParams.second_tiange_cat_id,
        third_tiange_cat_id: parentParams.third_tiange_cat_id,
        first_tiange_cat_id: parentParams.first_tiange_cat_id,
        item_id: parentParams.item_id,
        is_from_project: parentParams.is_from_project,
      } as any);
    };

    const categoryOptions_1 = ref([]);

    const onCurrentChange = (num: number) => {
      page_num.value = num;
      search().then(() => {
        nextTick(() => {
          const dom = document.querySelector('.project-table .el-table__body-wrapper');
          if (dom) {
            dom.scrollLeft = 0;
          }
        });
      });
    };

    const updateRouterParams = () => {
      const router = useRouter();
      const {
        project_id,
        project_name,
        end_date,
        start_date,
        year,
        season,
        second_tiange_cat_id,
        third_tiange_cat_id,
        first_tiange_cat_id,
        type,
      } = router.currentRoute.query;
      parentParams.is_from_project =
        String(router.currentRoute.query.is_from_project) === 'true' ? true : false;
      parentParams.room_id = String(router.currentRoute.query.room_id || '');
      parentParams.project_id = project_id as string | undefined;
      parentParams.start_date = start_date as string | undefined;
      parentParams.end_date = end_date as string | undefined;
      parentParams.project_name = project_name as string | undefined;
      parentParams.second_tiange_cat_id =
        second_tiange_cat_id !== undefined ? Number(second_tiange_cat_id) : second_tiange_cat_id;
      parentParams.third_tiange_cat_id =
        third_tiange_cat_id !== undefined ? Number(third_tiange_cat_id) : third_tiange_cat_id;
      parentParams.year = String(year === '小计' || year === '合计' ? '全部' : year || '');
      parentParams.season = String(season === '小计' || season === '合计' ? '全部' : season || '');
      parentParams.type = type !== undefined ? '2' : '1';
      parentParams.seasonType = type as string;
      parentParams.first_tiange_cat_id = first_tiange_cat_id as any;

      page_num.value = 1;

      if (parentParams.type === '2') {
        goodData.getYearOptions(
          parentParams.project_id,
          parentParams.start_date,
          parentParams.end_date,
          parentParams.seasonType !== 'season' ? parentParams.year : parentParams.season,
          parentParams.seasonType,
        );
      } else {
        goodData.getCategory_1(
          parentParams.project_id,
          parentParams.start_date,
          parentParams.end_date,
          parentParams.room_id !== '' ? '' : first_tiange_cat_id,
          parentParams.room_id !== '' ? '' : parentParams.second_tiange_cat_id,
          parentParams.room_id,
          parentParams.is_from_project,
        );
        goodData.getCategory_2(
          parentParams.project_id,
          parentParams.start_date,
          parentParams.end_date,
          second_tiange_cat_id,
          parentParams.room_id,
          parentParams.is_from_project,
        );
      }
      search();
    };
    updateRouterParams();
    if (parentParams.room_id && parentParams.room_id !== '') {
      tableData = useTableConversionRow({
        columns: [
          {
            label: '商品主图',
            prop: 'image_url',
            formatter: (text, row, column) => {
              let rate = 0;
              if (row.click_rate !== null && row.click_rate !== undefined) {
                rate = Number(row.click_rate.replace('%', ''));
              }
              if (parentParams.room_id && parentParams.room_id !== '') {
                return (
                  <div
                    class="goods-descript"
                    onclick={() => {
                      ImageViewer.show([text]);
                    }}
                  >
                    <img class="first-row-img" src={text} />
                  </div>
                );
              }
              return (
                <div
                  class="goods-descript"
                  onclick={() => {
                    ImageViewer.show([text]);
                  }}
                >
                  <img class="first-row-img" src={text} />
                  {rate >= 15 ? (
                    <img class="hot-img" src={hotImg} />
                  ) : rate >= 12 ? (
                    <img class="hot-img" src={subHotImg} />
                  ) : (
                    ''
                  )}
                </div>
              );
            },
          },
          {
            label: '商品编码',
            prop: 'item_id',
            formatter: text => {
              return <span class="goods_code">{text}</span>;
            },
          },
          { label: '商品款号', prop: 'item_sn' },
          {
            label: '商品名称',
            prop: 'title',
            formatter: (text, row) => {
              return (
                <a href={row.item_url} target="_blank" class="goods_name" title={text}>
                  {text}
                </a>
              );
            },
          },
          {
            label: '官方类目',
            // prop: 'third_tiange_cat',
            formatter: (text, row, column) => {
              const { first_tiange_cat, second_tiange_cat, third_tiange_cat } = row;
              return (
                <span class="goods_code">
                  {first_tiange_cat + '-' + second_tiange_cat + '-' + third_tiange_cat}
                </span>
              );
            },
          },
          // {
          //   label: '年度',
          //   sortable: 'custom',
          //   prop: 'year',
          //   formatter: (text: string | number) => {
          //     if (text === 0) return '--';
          //     return text;
          //   },
          // },
          // {
          //   label: '季节',
          //   prop: 'season',
          //   formatter: (text: number) => {
          //     switch (text) {
          //       case 0:
          //         return '--';
          //       case 1:
          //         return '春季';
          //       case 2:
          //         return '夏季';
          //       case 3:
          //         return '秋季';
          //       case 4:
          //         return '冬季';
          //       default:
          //         return text;
          //     }
          //   },
          // },
          { label: '吊牌价', prop: 'market_price', sortable: 'custom' },
          { label: '平均销售价 (元)', prop: 'shop_price', sortable: 'custom' },
          { label: '讲解次数', prop: 'talk_times', sortable: 'custom' },
          { label: '直播销量', prop: 'sale_count', sortable: 'custom' },
          { label: '直播销售额 (元)', prop: 'gmv', sortable: 'custom' },
          { label: '店铺销量', prop: 'shop_sale_count', sortable: 'custom' },
          { label: '店铺销售额 (元)', prop: 'shop_gmv', sortable: 'custom' },
          { label: '曝光人数', prop: 'watch_ucnt', sortable: 'custom' },
          { label: '点击人数', prop: 'click_ucnt', sortable: 'custom' },
          { label: '点击率', prop: 'click_rate', sortable: 'custom' },
          { label: '转化率', prop: 'pay_rate', sortable: 'custom' },
          { label: '退款销售额 (元)', prop: 'shop_refund_gmv', sortable: 'custom' },
          { label: '退款销售额占比', prop: 'shop_refund_gmv_rate', sortable: 'custom' },
          { label: '累计销量', prop: 'total_sale_count', sortable: 'custom' },
        ],
        data: toRef(goodData, 'project_report'),
        onSortChange: (prop: string, order: string | null) => {
          if (order === null) {
            sort.value = '';
          } else {
            const orderStr = order === 'descending' ? '_desc' : '';
            sort.value = `${prop}${orderStr}`;
          }
          search();
        },
        defaultSort: { prop: 'shop_sale_count', order: 'descending' },
      });
    }

    onActivated(updateRouterParams);

    const routes = ref<any[]>([]);
    routes.value = [
      {
        name: RouterDataCenter.commodityAnalysis,
        title: '品牌商品分析',
      },
      router.currentRoute.params && router.currentRoute.params.fromType === '1'
        ? {
            title: '年度季节分析',
            name: RouterDataCenter.commodityYearSeasonAnalysis,
            query: router.currentRoute.query
              ? {
                  project_name: router.currentRoute.query.project_name || '',
                  project_id: router.currentRoute.query.project_id || '',
                }
              : {},
          }
        : {
            title: '品牌类目分析',
            name: RouterDataCenter.commodityBrandCategoryAnalysis,
            query: router.currentRoute.query
              ? {
                  project_name: router.currentRoute.query.project_name || '',
                  project_id: router.currentRoute.query.project_id || '',
                }
              : {},
          },
      {
        title: '商品列表',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes.value);
    const curDate = ref<any>([parentParams.start_date, parentParams.end_date]);

    const exportBtnClick = async () => {
      const params = {
        project_id: parentParams.project_id,
        start_date: parentParams.start_date,
        end_date: parentParams.end_date,
        hot: checkList.value.displayOther === true ? undefined : Number(checkList.value.displayHot),
        second_hot:
          checkList.value.displayOther === true ? undefined : Number(checkList.value.displaySubHot),
        sort: sort.value,
        year: parentParams.year,
        season: parentParams.season,
        second_tiange_cat_id: parentParams.second_tiange_cat_id,
        third_tiange_cat_id: parentParams.third_tiange_cat_id,
        first_tiange_cat_id: parentParams.first_tiange_cat_id,
        item_id: parentParams.item_id,
        is_from_project: parentParams.is_from_project,
        room_id: parentParams.room_id || '',
      };
      exportLoading.value = true;
      const [res] = await wait(200, ExportCommodityAnalysisDetailV2(params));
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
      // router.push({
      //   name: RouterWorkbench.home.mine_files,
      // });
    };

    return {
      goodData,
      exportLoading,
      tableData,
      selectedRow,
      search,
      checkList,
      onCurrentChange,
      tableRef,
      projectTableRef,
      parentParams,
      curDate,
      categoryOptions_1,
      page_num,
      exportBtnClick,
    };
  }),
  render() {
    const pagination = this.goodData.pagination;
    return (
      <div class="comp">
        <div class="commodity-form">
          <el-form inline label-width="60px" size="mini">
            <el-form-item label="项目名称：">
              <el-select
                popper-class="el-select-popper-mini"
                disabled
                value="1"
                style="width:280px"
              >
                <el-option value="1" label={this.parentParams.project_name} />
              </el-select>
            </el-form-item>
            {(this.parentParams.room_id === '' || !this.parentParams.room_id) && (
              <el-form-item label="查询日期：" label-width="60px">
                <el-date-picker
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  v-model={this.curDate}
                  type="daterange"
                  format="yyyy.MM.dd"
                  range-separator="~"
                  value-format="yyyy-MM-dd"
                  clearable={false}
                  pickerOptions={{
                    disabledDate(time: Date) {
                      return (
                        time.getTime() > Date.now() ||
                        time.getTime() < new Date('2022/01/1 00:00:00').getTime()
                      );
                    },
                  }}
                  onChange={() => {
                    const { project_id, first_tiange_cat_id, room_id } = this.parentParams;
                    const start_date = this.curDate[0];
                    const end_date = this.curDate[1];
                    this.goodData.getCategory_1(
                      project_id,
                      start_date,
                      end_date,
                      first_tiange_cat_id,
                      room_id,
                    );
                    this.parentParams.start_date = start_date;
                    this.parentParams.end_date = end_date;
                    this.parentParams.second_tiange_cat_id = undefined;
                    this.parentParams.third_tiange_cat_id = undefined;
                  }}
                  style="width:280px"
                />
              </el-form-item>
            )}
            {this.parentParams.type === '1' && (
              <fragments>
                <el-form-item label="二级类目：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    style="width:280px"
                    v-model={this.parentParams.second_tiange_cat_id}
                    onChange={() => {
                      const { project_id, start_date, end_date, second_tiange_cat_id, room_id } =
                        this.parentParams;
                      this.goodData.getCategory_2(
                        project_id,
                        start_date,
                        end_date,
                        second_tiange_cat_id,
                        room_id,
                      );
                      this.parentParams.third_tiange_cat_id = undefined;
                    }}
                  >
                    <el-option label="全部" value={undefined} />
                    {this.goodData.category_1.map((item: any) => {
                      return <el-option value={item.value} label={item.label} />;
                    })}
                  </el-select>
                </el-form-item>
                <el-form-item label="三级类目：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    style="width:280px"
                    v-model={this.parentParams.third_tiange_cat_id}
                  >
                    <el-option label="全部" value={undefined} />
                    {this.goodData.category_2.map((item: any) => {
                      return <el-option value={item.value} label={item.label} />;
                    })}
                  </el-select>
                </el-form-item>
              </fragments>
            )}
            {this.parentParams.type === '2' &&
              (this.parentParams.seasonType !== 'season' ? (
                <fragments>
                  <el-form-item label="年度：" label-width="60px">
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:280px"
                      v-model={this.parentParams.year}
                      onchange={() => {
                        this.goodData.filterSeason(this.parentParams.year);
                        this.parentParams.season = undefined;
                      }}
                    >
                      <el-option label="全部" value={undefined} />
                      {this.goodData.year_options.map((item: any) => {
                        return <el-option value={item.value} label={item.label} />;
                      })}
                    </el-select>
                  </el-form-item>
                  <el-form-item label="季节：" label-width="60px">
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:280px"
                      v-model={this.parentParams.season}
                    >
                      <el-option label="全部" value={undefined} />
                      {this.goodData.season_options.map((item: any) => {
                        return <el-option value={item.value} label={item.label} />;
                      })}
                    </el-select>
                  </el-form-item>
                </fragments>
              ) : (
                <fragments>
                  <el-form-item label="季节：" label-width="60px">
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:280px"
                      v-model={this.parentParams.season}
                      onchange={() => {
                        this.goodData.filterSeason(this.parentParams.season);
                        this.parentParams.year = undefined;
                      }}
                    >
                      <el-option label="全部" value={undefined} />
                      {this.goodData.season_options.map((item: any) => {
                        return <el-option value={item.value} label={item.label} />;
                      })}
                    </el-select>
                  </el-form-item>
                  <el-form-item label="年度：" label-width="60px">
                    <el-select
                      popper-class="el-select-popper-mini"
                      style="width:280px"
                      v-model={this.parentParams.year}
                    >
                      <el-option label="全部" value={undefined} />
                      {this.goodData.year_options.map((item: any) => {
                        return <el-option value={item.value} label={item.label} />;
                      })}
                    </el-select>
                  </el-form-item>
                </fragments>
              ))}
            <el-form-item label="商品编码：">
              <el-input
                clearable
                style="width:280px"
                placeholder="请输入商品编码"
                v-model={this.parentParams.item_id}
              />
            </el-form-item>
            <el-form-item>
              <tg-button
                type="primary"
                onclick={() => {
                  this.page_num = 1;
                  this.search();
                }}
              >
                查询
              </tg-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="commodity-filter">
          {(this.parentParams.room_id === '' || !this.parentParams.room_id) && (
            <div>
              <el-radio
                class="hot-check"
                v-model={this.checkList.displayRadio}
                label="全部"
                onInput={() => {
                  this.checkList.displayOther = true;
                  this.checkList.displayHot = false;
                  this.checkList.displaySubHot = false;
                  this.page_num = 1;
                  this.search();
                }}
              />
              <el-radio
                class="hot-check"
                v-model={this.checkList.displayRadio}
                label="只显示爆款"
                onInput={() => {
                  this.checkList.displayOther = false;
                  this.checkList.displayHot = true;
                  this.checkList.displaySubHot = false;
                  this.page_num = 1;
                  this.search();
                }}
              />
              <el-radio
                class="hot-check"
                v-model={this.checkList.displayRadio}
                label="只显示次爆款"
                onInput={() => {
                  this.checkList.displayOther = false;
                  this.checkList.displayHot = false;
                  this.checkList.displaySubHot = true;
                  this.page_num = 1;
                  this.search();
                }}
              />{' '}
            </div>
          )}
          <tg-button
            type="default"
            icon="ico-btn-export"
            class="export-btn"
            onClick={this.exportBtnClick}
          >
            导出
          </tg-button>
        </div>
        <div ref="projectTableRef" class="project-table">
          <tg-table
            v-loading={this.goodData.loading}
            show-header={false}
            border={true}
            columns={this.tableData.columns}
            data={this.tableData.data}
            highlight-current-row
          />
        </div>
        {pagination.total > 0 && (
          <div class="pagination-box">
            <el-pagination
              total={pagination.total}
              page-size={20}
              layout={'total, prev, pager, next'}
              current-page={pagination.page_num}
              oncurrent-change={this.onCurrentChange}
            />
          </div>
        )}
        <tg-mask-loading visible={this.exportLoading} content="正在导出，请稍候..." />
      </div>
    );
  },
});
