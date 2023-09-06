import { defineComponent, ref, reactive, h as vueH, watch } from '@vue/composition-api';
import { useTableConversionRow } from './use';
import { render } from '@/use/vue';
import Charts from '@/modules/datacenter/components/line/lineCommodity.vue';
import hotImg from '@/assets/img/hot_goods.png';
import subHotImg from '@/assets/img/sub_hot_goods.png';
import defaultImage from '@/assets/img/goods-empty.png';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
import ImageViewer from '@/components/Image/ImageViewer';
const { formatPriceFormYuan } = formatPriceForm;
// import { numberFormat } from '@/utils/formatMoney';

export default defineComponent({
  props: {
    parent_form: Object as any,
    table_week_data: { type: Array, default: () => [] },
    is_month: {
      type: Boolean,
      default: false,
    },
    is_last_week: {
      type: Boolean,
      default: true,
    },
    /* 竞品分析top周对比*/
    is_competitive: {
      type: Boolean,
      default: false,
    },
    /* 竞品商品*/
    is_competitive_shop: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    'line-charts': Charts,
  },
  setup: render((props: any, ctx: any) => {
    const exportLoading = ref(false);
    const h: any = vueH;
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
    const tableData = ref({
      columns: [] as any[],
      data: [] as any[],
    });
    watch(
      () => props.table_week_data,
      () => {
        let colunm: {
          label: string;
          align?: string;
          prop?: string;
          type?: string;
          formatter?: (text?: any, row?: any, column?: any, idx?: number) => any;
          sortable?: string;
        }[] = [
          { label: '排行', prop: 'rank' },
          {
            label: '商品主图',
            prop: 'image_url',
            formatter: (text, row, column) => {
              let rate = 0;
              if (row.click_rate !== null && row.click_rate !== undefined) {
                rate = Number(row.click_rate.replace('%', ''));
              }
              return (
                <div
                  class="goods-div"
                  onclick={() => {
                    ImageViewer.show([text]);
                  }}
                >
                  <img
                    class="first-row-img"
                    src={text || defaultImage}
                    onerror={(e: any) => {
                      e.target.src = defaultImage;
                    }}
                  />
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
                <a
                  href={`https://haohuo.jinritemai.com/views/product/item2?id=${row.item_id}`}
                  target="_blank"
                  class="goods_name"
                  title={text}
                >
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
            label: '年度季节',
            prop: 'year',
            formatter: (text, row) => {
              return text !== '--' && row.season !== null ? text + '/' + row.season : '--';
            },
          },
          {
            label: '单价',
            prop: 'discount_price',
            formatter: (text, row) => {
              return text !== '--'
                ? formatPriceFormYuan(text === 0 ? 0 : text / 100, 2, true)
                : '--';
            },
          },
          {
            label: '销量',
            prop: 'shop_sale_count',
            formatter: (text, row) => {
              return text !== '--' ? numberFormat(Number(text || 0), 0, '.', ',') : '--';
            },
          },
          {
            label: '销售额',
            prop: 'shop_gmv',
            formatter: (text, row) => {
              return text !== '--'
                ? formatPriceFormYuan(text === 0 ? 0 : text / 100, 2, true)
                : '--';
            },
          },
          {
            label: '总退货率',
            prop: 'shop_day_refund_gmv_rate',
            formatter: (text, row) => {
              return text !== '--'
                ? (parseInt(String((text || 0) * 100), 10) / 100).toFixed(2) + '%'
                : '--';
            },
          },
        ];
        if (props.is_last_week) {
          colunm.push({ label: '当前库存', prop: 'stock_num' });
          if (props.is_month) {
            colunm.push({ label: '库存可销月数', prop: 'stock_times' });
          } else {
            colunm.push({ label: '库存可销周数', prop: 'stock_times' });
          }
        }
        //竞品
        if (props.is_competitive) {
          colunm = [
            { label: '排行', prop: 'rank' },
            {
              label: '商品主图',
              prop: 'item_image',
              formatter: (text, row, column) => {
                let rate = 0;
                if (row.click_rate !== null && row.click_rate !== undefined) {
                  rate = Number(row.click_rate.replace('%', ''));
                }
                return (
                  <div
                    class="goods-div"
                    onclick={() => {
                      ImageViewer.show([text]);
                    }}
                  >
                    <img
                      class="first-row-img"
                      src={text || defaultImage}
                      onerror={(e: any) => {
                        e.target.src = defaultImage;
                      }}
                    />
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
            {
              label: '商品名称',
              prop: 'item_title',
              formatter: (text, row) => {
                return (
                  <a
                    href={`https://haohuo.jinritemai.com/views/product/item2?id=${row.item_id}`}
                    target="_blank"
                    class="goods_name"
                    title={text}
                  >
                    {text}
                  </a>
                );
              },
            },
            {
              label: '年度季节',
              prop: 'year',
              formatter: (text, row) => {
                return text !== '--' && row.season !== null ? text + '/' + row.season : '--';
              },
            },
            {
              label: '单价 (元)',
              prop: 'shop_avg_price',
              formatter: (text, row) => {
                return text !== '--' ? formatPriceFormYuan((text || 0) / 100, 2, false) : '--';
              },
            },
            {
              label: '销量',
              prop: 'shop_sale_count',
              formatter: (text, row) => {
                return text !== '--' ? numberFormat(Number(text || 0), 0, '.', ',') : '--';
              },
            },
            {
              label: '销售额 (元)',
              prop: 'shop_gmv',
              formatter: (text, row) => {
                return text !== '--' ? formatPriceFormYuan((text || 0) / 100, 2, false) : '--';
              },
            },
            {
              label: '转化率',
              prop: 'pay_rate',
              formatter: (text, row) => {
                return text !== '--'
                  ? (parseInt(String((text || 0) * 100), 10) / 100).toFixed(2) + '%'
                  : '--';
              },
            },
            {
              label: '总退货率',
              prop: 'refund_rate',
              formatter: (text, row) => {
                return text !== '--'
                  ? (parseInt(String((text || 0) * 100), 10) / 100).toFixed(2) + '%'
                  : '--';
              },
            },
          ];
          if (props.is_competitive_shop) {
            colunm = [
              { label: '排行', prop: 'rank' },
              {
                label: '商品主图',
                prop: 'item_image',
                formatter: (text, row, column) => {
                  return (
                    <div
                      class="goods-div"
                      onclick={() => {
                        ImageViewer.show([text]);
                      }}
                    >
                      <el-image
                        lazy
                        class="first-row-img"
                        src={text || defaultImage}
                        onerror={(e: any) => {
                          e.target.src = defaultImage;
                        }}
                      />
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
              {
                label: '商品名称',
                prop: 'item_title',
                formatter: (text, row) => {
                  return (
                    <a
                      href={`https://haohuo.jinritemai.com/views/product/item2?id=${row.item_id}`}
                      target="_blank"
                      class="goods_name"
                      title={text}
                    >
                      {text}
                    </a>
                  );
                },
              },
              {
                label: '单价 (元)',
                prop: 'discount_price',
                formatter: (text, row) => {
                  return text !== '--' ? formatPriceFormYuan((text || 0) / 100, 2, false) : '--';
                },
              },
              {
                label: '销量',
                prop: 'sale_count',
                formatter: (text, row) => {
                  return text !== '--' ? numberFormat(Number(text || 0), 0, '.', ',') : '--';
                },
              },
              {
                label: '销售额 (元)',
                prop: 'gmv',
                formatter: (text, row) => {
                  return text !== '--' ? formatPriceFormYuan((text || 0) / 100, 2, false) : '--';
                },
              },
              {
                label: '转化率',
                prop: 'pay_rate',
                formatter: (text, row) => {
                  return text !== '--'
                    ? (parseInt(String((text || 0) * 100), 10) / 100).toFixed(2) + '%'
                    : '--';
                },
              },
            ];
          }
        }
        const table_data_one = useTableConversionRow({
          columns: colunm,
          data: props.table_week_data,
        });
        tableData.value = table_data_one;
      },
    );

    const tableRef = ref<{ setCurrentRow: () => void }>();
    const selectedRow = ref<any>({});
    const projectTableRef = ref<any>();
    const checkList = ref({
      displayHot: false,
      displaySubHot: false,
      displayOther: true,
      displayRadio: '全部',
    });

    return {
      exportLoading,
      tableData,
      selectedRow,
      checkList,
      tableRef,
      projectTableRef,
      parentParams,
    };
  }),
  render() {
    return (
      <div class="comp">
        <div ref="projectTableRef" class="project-table">
          <tg-table
            show-header={false}
            border={true}
            columns={this.tableData.columns}
            data={this.tableData.data}
            class={this.is_new ? 'new-table' : ''}
          >
            <div class="tg-page-empty" slot="empty">
              <empty-common img-height="100" img-width="150" />
            </div>
          </tg-table>
        </div>
      </div>
    );
  },
});
