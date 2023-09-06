import { defineComponent, reactive, ref, nextTick, inject } from '@vue/composition-api';
import { RouterDataCenter } from '@/const/router';
import moment from 'moment';
import { ShopLiveGetDpShopOrdersPresell } from '@/services/datacenter';
import { usePagination } from '@gm/hooks/ahooks';
import { TgTableColumn } from '@/types/vendor/column';
import { useRouter } from '@/use/vue-router';
import { getToken } from '@/utils/token';
import qs from 'query-string';
import { ObjectFilterEmpty } from '@/utils/func';
import emptyGoods from '@/assets/img/goods-empty.png';
import { numberFormat } from '@/utils/formatMoney';
import ImageViewer from '@/components/Image/ImageViewer';

const routes = [
  {
    name: RouterDataCenter.commodityAnalysis,
    title: '品牌商品分析',
  },
  {
    path: '',
    title: '预售商品分析',
  },
];
type Col = TgTableColumn<any>;
const preSaleTypeMap = new Map([
  [-1, '全部'],
  [1, '全款预售'],
  [0, '现货发货'],
  [2, '阶梯发货'],
]);
// const seasonMap = ['未知', '春季', '夏季', '秋季', '冬季'];
export default defineComponent({
  setup: () => {
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const router = useRouter();
    const { project_id, project_name } = router.currentRoute.query;
    const project_info = ref<{ end_date: string; start_date: string; update_date: string }>(
      {} as any,
    );
    const dataOverView = ref([]);
    const dataDetailed = ref([]);
    const dayType = ref<number | string>(1);
    const start_date = ref();
    const end_date = ref();
    const pre_sale_type = ref();
    const reqShopOrders = usePagination(ShopLiveGetDpShopOrdersPresell, {
      defaultPageSize: 10,
      manual: true,
      onSuccess(_: any, { data: { project, statistics_data, items } }: any) {
        project_info.value = project;
        dataOverView.value = statistics_data;
        dataDetailed.value = items;
      },
    });

    const query = () => {
      reqShopOrders
        .runAsync(
          {
            page_num: 1,
            num: 10,
          },
          {
            project_id,
            start_date: start_date.value,
            end_date: end_date.value,
            pre_sale_type: pre_sale_type.value,
          } as any,
        )
        .then((data: any) => {
          const list = data.data.data.statistics_data;
          nextTick(() => {
            list.forEach((row: any) => {
              if (pre_sale_type.value === row.pre_sale_type) {
                tableRef.value?.tableRef.setCurrentRow(row);
              }
            });
          });
        });
    };

    // 概览
    const columnsOverView: Col[] = [
      {
        label: '发货模式',
        prop: 'pre_sale_type',
        align: 'center',
        formatter: row => {
          return preSaleTypeMap.get(row.pre_sale_type);
        },
      },
      {
        label: '款数及占比',
        prop: 'item_count_rate',
        headerAlign: 'center',
        align: 'center',
        minWidth: 140,
        formatter: row => {
          let item_count = row.item_count;
          if (item_count === null) item_count = '--';
          let item_count_rate = row.item_count_rate;
          if (item_count_rate === null) item_count_rate = '--';
          else {
            item_count_rate = `${numberFormat(item_count_rate, 2)}%`;
          }
          return (
            <span class="item_count_rate_box">
              <span class="item_count">{item_count}</span>
              <span>|</span>
              <span class="item_count_rate">{item_count_rate}</span>
            </span>
          );
        },
      },
      {
        label: '店铺销量',
        prop: 'sale_count',
        headerAlign: 'center',
        align: 'right',
        dataType: 'money',
        minWidth: 150,
      },
      {
        label: '店铺销售额 (元)',
        headerAlign: 'center',
        prop: 'gmv',
        minWidth: 160,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
        align: 'right',
      },
      {
        label: '发货前退款销售额 (元)',
        prop: 'shop_refund_status21_gmv',
        headerAlign: 'center',
        minWidth: 180,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
        align: 'right',
      },
      {
        label: '已发货销售额 (元)',
        prop: 'sent_gmv',
        align: 'right',
        minWidth: 160,
        headerAlign: 'center',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        label: '未发货销售额及占比',
        prop: 'not_send_gmv_rate',
        headerAlign: 'center',
        dataType: {
          suffix: '%',
        },
        minWidth: 180,
        formatter: row => {
          let not_send_gmv = row.not_send_gmv;
          if (not_send_gmv === null) not_send_gmv = '--';
          else not_send_gmv = '￥' + numberFormat(not_send_gmv / 100, 2, '.', ',');
          let not_send_gmv_rate = row.not_send_gmv_rate;
          if (not_send_gmv_rate === null) not_send_gmv_rate = '--';
          else {
            not_send_gmv_rate = `${numberFormat(not_send_gmv_rate, 2)}%`;
          }
          return (
            <span class="item_count_rate_box">
              <span class="item_count">{not_send_gmv}</span>
              <span>|</span>
              <span class="item_count_rate">{not_send_gmv_rate}</span>
            </span>
          );
        },
      },
    ];
    // 明细
    const columnsDetailed: Col[] = [
      {
        label: '商品信息',
        minWidth: 320,
        headerAlign: 'center',
        formatter: row => {
          return (
            <div class="commodity-box">
              <div class="pic-box">
                <el-image
                  fit="contain"
                  src={row.image_url ? row.image_url : emptyGoods}
                  onClick={() => {
                    ImageViewer.show([row.image_url]);
                  }}
                />
              </div>
              <div class="info-box">
                <div class="id-line">
                  <p class="commodity-id">{row.item_id}</p>
                </div>
                <a
                  target="_blank"
                  href={`https://haohuo.jinritemai.com/views/product/item2?id=${row.item_id}`}
                  class="commodity-name"
                >
                  {row.title}
                </a>
                <p class="code">{row.item_sn ? row.item_sn : '--'}</p>
              </div>
            </div>
          );
        },
      },
      {
        label: '官方类目',
        minWidth: 150,
        align: 'center',
        // prop: 'third_tiange_cat',
        formatter: text => {
          const { first_tiange_cat, second_tiange_cat, third_tiange_cat } = text as any;
          return (
            <span class="goods_code">
              {first_tiange_cat + '-' + second_tiange_cat + '-' + third_tiange_cat}
            </span>
          );
        },
      },
      // {
      //   label: '年度季节',
      //   minWidth: 110,
      //   align: 'center',
      //   prop: 'season',
      //   formatter: row => {
      //     if (row.year === 0 && row.season === 0) return '未知';
      //     return `${row.year === 0 ? '未知' : row.year} ${seasonMap[row.season]}`;
      //   },
      // },
      {
        label: '发货模式',
        minWidth: 80,
        align: 'center',
        prop: 'pre_sale_type',
        formatter: row => {
          return preSaleTypeMap.get(row.pre_sale_type);
        },
      },
      {
        label: '平均销售价 (元)',
        prop: 'avg_price',
        minWidth: 120,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
        headerAlign: 'center',
        align: 'right',
      },
      {
        label: '点击率',
        align: 'right',
        headerAlign: 'center',
        prop: 'click_rate',
        minWidth: 80,
        dataType: { suffix: '%' },
      },
      {
        label: '转化率',
        align: 'right',
        headerAlign: 'center',
        prop: 'pay_rate',
        minWidth: 80,
        dataType: { suffix: '%' },
      },
      {
        label: '店铺销量',
        prop: 'sale_count',
        dataType: 'money',
        minWidth: 80,
        headerAlign: 'center',
        align: 'right',
      },
      {
        label: '店铺销售额 (元)',
        prop: 'gmv',
        minWidth: 120,
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
        align: 'right',
      },
      {
        label: '发货前退款销售额 (元)',
        minWidth: 180,
        prop: 'shop_refund_status21_gmv',
        align: 'right',
        headerAlign: 'center',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        label: '已发货销量',
        prop: 'sent_sale_count',
        align: 'right',
        headerAlign: 'center',
        minWidth: 100,
      },
      {
        label: '已发货销售额 (元)',
        prop: 'sent_gmv',
        align: 'right',
        headerAlign: 'center',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
        minWidth: 140,
      },
      {
        label: '未发货销量',
        prop: 'not_send_count',
        headerAlign: 'center',
        align: 'right',
        dataType: 'money',
        minWidth: 100,
      },
      {
        label: '未发货销售额及占比',
        prop: 'not_send_gmv_rate',
        dataType: { suffix: '%' },
        width: 180,
        formatter: row => {
          let not_send_gmv = row.not_send_gmv;
          if (not_send_gmv === null) not_send_gmv = '--';
          else not_send_gmv = '￥' + numberFormat(not_send_gmv / 100, 2, '.', ',');

          let not_send_gmv_rate = row.not_send_gmv_rate;
          if (not_send_gmv_rate === null) not_send_gmv_rate = '--';
          else {
            not_send_gmv_rate = `${numberFormat(not_send_gmv_rate, 2)}%`;
          }
          return (
            <span class="item_count_rate_box" style="grid-template-columns: 110px auto 63px;">
              <span class="item_count">{not_send_gmv}</span>
              <span>|</span>
              <span class="item_count_rate">{not_send_gmv_rate}</span>
            </span>
          );
        },
      },
    ];

    const onRowClick = (row: any) => {
      pre_sale_type.value = row.pre_sale_type === -1 ? undefined : row.pre_sale_type;
      query();
    };
    const changeDayType = (num: number | string, day?: string) => {
      switch (num) {
        case 1:
        case 3:
        case 7:
        case 15:
        case 30:
          start_date.value = moment().subtract(num, 'days').startOf('day').format('YYYY-MM-DD');
          end_date.value = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD');
          dayType.value = num;
          break;
        case 'day':
          start_date.value = moment(day).startOf('day').format('YYYY-MM-DD');
          end_date.value = moment(day).endOf('day').format('YYYY-MM-DD');
          dayType.value = num;
          break;
        case 'week':
          start_date.value = moment(day).subtract(1, 'days').startOf('day').format('YYYY-MM-DD');
          end_date.value = moment(day).add(5, 'days').endOf('day').format('YYYY-MM-DD');
          dayType.value = num;
          break;
        case 'month':
          start_date.value = moment(day).format('YYYY-MM-DD');
          end_date.value = moment(day).endOf('month').format('YYYY-MM-DD');
          dayType.value = num;
          break;
      }
      reqShopOrders.pagination.page_num = 1;
      reqShopOrders.pagination.page_size = 10;
      query();
    };
    const tableRef = ref<any>();
    changeDayType(1);
    const popoverVisible = reactive({
      day: false,
      week: false,
      month: false,
    });
    const exportQuick = () => {
      const par = reqShopOrders.params[1];
      const _paramsstr = qs.stringify({ ...ObjectFilterEmpty(par) });
      const token = getToken();
      window.open(
        `${process.env.VUE_APP_BASE_API}/api/shop_live/export_dp_shop_orders_presell_stat_day?${_paramsstr}&Authorization=${token}`,
      );
    };

    return reactive({
      reqShopOrders,
      project_name,
      columnsOverView,
      columnsDetailed,
      query,
      dataOverView,
      dataDetailed,
      project_info,
      onRowClick,
      tableRef,
      dayType,
      popoverVisible,
      changeDayType,
      exportQuick,
    });
  },
  render() {
    return (
      <div class="competitive-pre-sale">
        <tg-card padding={[16]}>
          <el-form class="filter-form flex-form" size="mini" show-message={false} inline={true}>
            <el-form-item label="项目名称：">
              <el-select popper-class="el-select-popper-mini" disabled value={this.project_name} />
            </el-form-item>
          </el-form>
        </tg-card>
        <tg-card class="pre-sale-body mgt-10" padding={[16, 16, 16, 16]}>
          <div class="filter-bar mgb-18">
            <span class="date">
              {this.project_info.start_date === this.project_info.end_date
                ? this.project_info.start_date
                : `${this.project_info.start_date} ～ ${this.project_info.end_date}`}
            </span>
            <span class="split" />
            <span class="tips">数据更新于 {this.project_info.update_date}</span>
            <span class="flex-fill" />
            <div class="days">
              <span
                class={this.dayType === 1 ? 'day active' : 'day'}
                onClick={() => {
                  this.changeDayType(1);
                }}
              >
                近1天
              </span>
              <span
                class={this.dayType === 3 ? 'day active' : 'day'}
                onClick={() => {
                  this.changeDayType(3);
                }}
              >
                近3天
              </span>
              <span
                class={this.dayType === 7 ? 'day active' : 'day'}
                onClick={() => {
                  this.changeDayType(7);
                }}
              >
                近7天
              </span>
              <span
                class={this.dayType === 15 ? 'day active' : 'day'}
                onClick={() => {
                  this.changeDayType(15);
                }}
              >
                近15天
              </span>
              <span
                class={this.dayType === 30 ? 'day active' : 'day'}
                onClick={() => {
                  this.changeDayType(30);
                }}
              >
                近30天
              </span>
              <el-popover trigger="click" v-model={this.popoverVisible.day}>
                <span slot="reference" class={this.dayType === 'day' ? 'day active' : 'day'}>
                  自然日
                </span>
                <el-date-picker
                  size="small"
                  placeholder="选择一个自然日"
                  onInput={(value: any) => {
                    this.changeDayType('day', value);
                    this.popoverVisible.day = false;
                  }}
                />
              </el-popover>
              <el-popover trigger="click" v-model={this.popoverVisible.week}>
                <span slot="reference" class={this.dayType === 'week' ? 'day active' : 'day'}>
                  自然周
                </span>
                <el-date-picker
                  size="small"
                  placeholder="选择一个自然周"
                  format="yyyy 第 WW 周"
                  type="week"
                  onInput={(value: any) => {
                    this.changeDayType('week', value);
                    this.popoverVisible.week = false;
                  }}
                />
              </el-popover>
              <el-popover trigger="click" v-model={this.popoverVisible.month}>
                <span slot="reference" class={this.dayType === 'month' ? 'day active' : 'day'}>
                  自然月
                </span>
                <el-date-picker
                  size="small"
                  placeholder="选择一个自然月"
                  type="month"
                  onInput={(value: any) => {
                    this.changeDayType('month', value);
                    this.popoverVisible.month = false;
                  }}
                />
              </el-popover>
              <tg-button
                icon="ico-btn-export"
                size="mini"
                type="default"
                class="day"
                onclick={this.exportQuick}
              >
                导出
              </tg-button>
            </div>
          </div>
          <div class="tilte-bar mgb-12">
            <span class="title">数据概览</span>
            <span class="split" />
            <span style="font-size:12px">了解发货数据、提升运营效果</span>
          </div>
          <div class="table mgb-18">
            <tg-table
              border
              ref="tableRef"
              columns={this.columnsOverView}
              data={this.dataOverView}
              onRow-click={this.onRowClick}
              highlight-current-row
            />
          </div>
          <div class="tilte-bar mgb-12">
            <span class="title">商品明细</span>
          </div>
          <div class="table table-detail">
            <tg-table
              style="width:100%"
              border
              stripe
              columns={this.columnsDetailed}
              data={this.dataDetailed}
              pagination={this.reqShopOrders.pagination}
              scopedSlots={{
                empty: () => {
                  return (
                    <div style="position: static;">
                      <empty-common
                        style="marginTop:20px"
                        img-height="100"
                        img-width="150"
                        detail-text="暂无数据~"
                      ></empty-common>
                    </div>
                  );
                },
              }}
            />
          </div>
        </tg-card>
      </div>
    );
  },
});
