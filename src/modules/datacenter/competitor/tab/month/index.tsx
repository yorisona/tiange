import { useRequest } from '@gm/hooks/ahooks';
import { computed, defineComponent, h, nextTick, onMounted, ref } from '@vue/composition-api';
import {
  Douyin_Competitive_Items_By_Month,
  Douyin_Competitive_Items_Month_Top10,
  Export_Douyin_Competitive_Items_By_Month,
  GetCompetitiveShops,
} from '@/services/datacenter';
import moment from 'moment';
import { formatAmount } from '@/utils/string';
import { ObjectFilterEmpty } from '@/utils/func';
import { getToken } from '@/utils/token';
import qs from 'query-string';
import formatPriceForm from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;

// type CompetitiveList = TG.HttpResultType<typeof Douyin_Competitive_Items_By_Month>;
type CompetitiveFormData = TG.ParameterFirst<typeof Douyin_Competitive_Items_Month_Top10> & {
  date?: string;
  item_cat_name?: string;
};

type Top10ItemListType = TG.HttpResultType<typeof Douyin_Competitive_Items_Month_Top10>;
type ListElementType<T> = T extends (infer U)[] ? U : never;
type Top10ItemType = ListElementType<Top10ItemListType>;

// Douyin_Competitive_Items_Month_Top10

export default defineComponent({
  components: {},
  setup: (_, ctx) => {
    const defaultDate = () => moment().subtract(1, 'month').startOf('month');
    const exportLoading = ref(false);
    const selectRow = ref<any>();
    const initFormData = (): CompetitiveFormData => ({
      shop_name: undefined,
      end_date: undefined,
      start_date: undefined,
      date: defaultDate().format('YYYY-MM'),
      sort: 'sale',
      third_tiange_cat_id: undefined,
    });
    const formData = ref<CompetitiveFormData>(initFormData());
    const reqCompetitiveList = useRequest(Douyin_Competitive_Items_By_Month, {
      manual: true,
      onSuccess: (data: any) => {
        const firstData = data[0];
        selectRow.value = firstData;
        methods.resetColGroups();
        formData.value.third_tiange_cat_id = firstData?.third_tiange_cat_id;
        formData.value.item_cat_name = firstData?.item_cat;
        methods.sendTop10Req();
        methods.scrollTableToRight();
      },
    });
    const reqTop10ObjList = ref([
      {
        month: 0,
        req: useRequest(Douyin_Competitive_Items_Month_Top10, { manual: true }),
      },
      {
        month: 0,
        req: useRequest(Douyin_Competitive_Items_Month_Top10, { manual: true }),
      },
    ]);
    const reqShop = useRequest(GetCompetitiveShops, {
      manual: true,
      onSuccess: data => {
        const finder = data?.find((el: any) => el.shop_name === '伊芙丽官方旗舰店')?.shop_name;
        formData.value.shop_name = finder || data?.[0]?.shop_name;
        methods.search();
      },
    });
    const reqExprot = useRequest(Export_Douyin_Competitive_Items_By_Month, { manual: true });
    const colGroups = ref<any[]>([]);
    const methods = {
      search() {
        reqCompetitiveList.runAsync(methods.getCompetitiveParams().main);
      },
      reset() {
        formData.value = initFormData();
        reqShop.runAsync();
      },
      exprot() {
        // const par = reqShopOrders.params[1];
        const _paramsstr = qs.stringify({
          ...ObjectFilterEmpty(methods.getCompetitiveParams().exprot),
        });
        const token = getToken();
        window.open(
          `${process.env.VUE_APP_BASE_API}/api/shop_live/export_douyin_competitive_items_by_month?${_paramsstr}&Authorization=${token}`,
        );
        // reqExprot.runAsync(methods.getCompetitiveParams().exprot);
      },
      pickerOptions: {
        disabledDate(time: Date) {
          const maxDate = defaultDate();
          return moment(time).isAfter(maxDate);
        },
      },
      sendTop10Req() {
        reqTop10ObjList.value.forEach((el, index) => {
          const { start_date, end_date, ...res } = methods.getCompetitiveParams().top10;
          const params = {
            start_date: moment(end_date)
              .subtract(index, 'month')
              .startOf('month')
              .format('YYYY-MM-DD'),
            end_date: moment(end_date).subtract(index, 'month').endOf('month').format('YYYY-MM-DD'),
            ...res,
          };
          el.month = moment(params.end_date).month();
          el.req.runAsync(params);
          // .then(() => {
          //   if (scrollToRight) {
          //     methods.scrollTableToRight();
          //   }
          // })
          // .catch(() => {
          //   if (scrollToRight) {
          //     methods.scrollTableToRight();
          //   }
          // });
        });
      },
      getCompetitiveParams() {
        const { date, sort, third_tiange_cat_id, item_cat_name, ...res } = formData.value;
        res.start_date = moment(date).startOf('year').format('YYYY-MM-DD');
        res.end_date = moment(date).endOf('month').format('YYYY-MM-DD');
        return {
          main: {
            ...res,
          },
          top10: {
            sort,
            third_tiange_cat_id,
            ...res,
          },
          exprot: {
            top10_months: 2,
            sort,
            third_tiange_cat_id,
            ...res,
          },
        };
      },
      arrowIcon: (rate?: number) => {
        const tempRate = rate || 0;
        if (tempRate > 0) {
          return (
            <span
              style="display: inline-block; width: 20px; text-align: left; padding-top: 0px"
              class="tgicon"
            >
              <tg-icon
                style="margin: auto 1px auto 6px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
          );
        } else if (tempRate < 0) {
          return (
            <span
              style="display: inline-block; width: 20px; text-align: left; padding-top: 0px"
              class="tgicon"
            >
              <tg-icon
                style="margin: auto 1px auto 6px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
          );
        } else {
          return <span style="display: inline-block; margin: 0 6px"></span>;
        }
        // else {
        //   return null;
        // }
      },
      resetColGroups: () => {
        const month = moment(formData.value.date).month();
        const numbers = Array.from(Array(month + 1).keys(), n => n);
        colGroups.value = numbers.map((el, index) => {
          const evenNumber = index % 2 === 0;
          return {
            title: `${el + 1}月`,
            // fixed: el === month ? 'right' : undefined,
            // headerClassName: `department-fund-statement-group-head-${evenNumber ? 'even' : 'odd'}`,
            headerClassName: `group-head-${evenNumber ? 'even' : 'odd'}`,
            align: 'center',
            subColumns: [
              {
                label: '销量',
                align: 'right',
                headerAlign: 'center',
                // fixed: el === month ? 'right' : undefined,
                width: 180,
                field: 'sale',
                className: `head-${evenNumber ? 'even' : 'odd'}`,
                scopedSlots: {
                  default: ({ row }: { row: any }) => {
                    const monthItem = row.months?.find((rMonth: any) => rMonth.month === el + 1);
                    return (
                      <div>
                        {(monthItem?.sale === undefined || monthItem?.sale === null) &&
                        (monthItem?.sale_incr_rate === undefined ||
                          monthItem?.sale_incr_rate === null) ? (
                          '--'
                        ) : (
                          <fragments>
                            {' '}
                            <span>
                              {monthItem?.sale !== undefined && monthItem?.sale !== null
                                ? formatAmount(monthItem?.sale, 'None', true)
                                : '--'}
                            </span>
                            {methods.arrowIcon(monthItem?.sale_incr_rate)}
                            <span>
                              {monthItem?.sale_incr_rate !== undefined &&
                              monthItem?.sale_incr_rate !== null
                                ? `${Math.abs(monthItem.sale_incr_rate)}%`
                                : '--'}
                            </span>
                          </fragments>
                        )}
                      </div>
                    );
                  },
                },
                // className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
              },
              {
                label: '销售额',
                align: 'right',
                headerAlign: 'center',
                // fixed: el === month ? 'right' : undefined,
                width: 180,
                field: 'gmv',
                // className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
                className: `head-${evenNumber ? 'even' : 'odd'}`,
                scopedSlots: {
                  default: ({ row }: { row: any }) => {
                    const monthItem = row.months?.find((rMonth: any) => rMonth.month === el + 1);
                    return (
                      <div>
                        {((monthItem?.gmv === undefined || monthItem?.gmv === null) &&
                          monthItem?.gmv_incr_rate === undefined) ||
                        monthItem?.gmv_incr_rate === null ? (
                          '--'
                        ) : (
                          <fragments>
                            {' '}
                            <span>
                              {monthItem?.gmv !== undefined && monthItem?.gmv !== null
                                ? formatPriceFormYuan(monthItem.gmv / 100, 2, false)
                                : '--'}
                            </span>
                            {methods.arrowIcon(monthItem?.gmv_incr_rate)}
                            <span>
                              {monthItem?.gmv_incr_rate !== undefined &&
                              monthItem?.gmv_incr_rate !== null
                                ? `${Math.abs(monthItem.gmv_incr_rate)}%`
                                : '--'}
                            </span>
                          </fragments>
                        )}
                      </div>
                    );
                  },
                },
              },
              {
                label: '平均件单价',
                align: 'right',
                // fixed: el === month ? 'right' : undefined,
                headerAlign: 'center',
                width: 180,
                field: 'average_sale_price',
                // className: `department-fund-statement-head-${evenNumber ? 'even' : 'odd'}`,
                className: `head-${evenNumber ? 'even' : 'odd'}`,
                scopedSlots: {
                  default: ({ row }: { row: any }) => {
                    const monthItem = row.months?.find((rMonth: any) => rMonth.month === el + 1);
                    return (
                      <div>
                        {(monthItem?.average_sale_price === undefined ||
                          monthItem?.average_sale_price === null) &&
                        (monthItem?.average_sale_price_incr_rate === undefined ||
                          monthItem?.average_sale_price_incr_rate === null) ? (
                          '--'
                        ) : (
                          <fragments>
                            <span>
                              {monthItem?.average_sale_price !== undefined &&
                              monthItem?.average_sale_price !== null
                                ? formatAmount(monthItem?.average_sale_price / 100, '¥ ')
                                : '--'}
                            </span>
                            {methods.arrowIcon(monthItem?.average_sale_price_incr_rate)}
                            <span>
                              {monthItem?.average_sale_price_incr_rate !== undefined &&
                              monthItem?.average_sale_price_incr_rate !== null
                                ? `${Math.abs(monthItem.average_sale_price_incr_rate)}%`
                                : '--'}
                            </span>
                          </fragments>
                        )}
                      </div>
                    );
                  },
                },
              },
            ],
          };
        });
      },
      openGoodsDetail: (url: string | undefined) => {
        if (!url) return;
        window.open(url, '__blank');
      },
      scrollTableToRight: () => {
        nextTick(() => {
          const scrollView = document.querySelector('.vxe-table--body-wrapper.body--wrapper');
          if (scrollView) {
            setTimeout(() => {
              scrollView.scrollLeft = scrollView.scrollWidth;
            }, 10);
          }
        });
      },
    };

    const top10Row = ref([
      {
        key: 'item_image',
        title: '商品主图',
        formatter: (item: Top10ItemType) => {
          if (!item?.item_image) return null;
          return (
            <div class="item-image">
              <el-image
                style="width: 80px; height: 80px; cursor: pointer"
                src={item?.item_image}
                fit="contain"
                on-click={() => methods.openGoodsDetail(item?.url)}
              ></el-image>
            </div>
            // <img
            //   style="width: 80px; height: 80px;object-fit: contain;"
            //   src={item?.item_image}
            //   alt=""
            // />
          );
        },
      },
      {
        key: 'item_id',
        title: '商品编码',
        formatter: (item: Top10ItemType) => {
          return <div class="item-id">{item?.item_id}</div>;
        },
      },
      {
        key: 'item_title',
        title: '商品名称',
        formatter: (item: Top10ItemType) => {
          return (
            <el-popover
              trigger="hover"
              content={item?.item_title}
              width={200}
              open-delay={300}
              placement="top"
            >
              <div
                slot="reference"
                class="item-title line-clamp-2"
                style={{ cursor: 'pointer' }}
                on-click={() => methods.openGoodsDetail(item?.url)}
              >
                {item?.item_title}
              </div>
            </el-popover>
          );
        },
      },
      {
        key: 'average_sale_price',
        title: '平均件单价',
        formatter: (item: Top10ItemType) => {
          if (!item) return null;
          const text =
            item?.average_sale_price !== undefined && item?.average_sale_price !== null
              ? formatAmount(item.average_sale_price / 100, '¥ ')
              : '--';
          return <div>{text}</div>;
        },
      },
      {
        key: 'sale',
        title: '销量',
        formatter: (item: Top10ItemType) => {
          if (!item) return null;
          const text =
            item?.sale !== undefined && item?.sale !== null
              ? formatAmount(item.sale, 'None', true)
              : '--';
          return <div>{text}</div>;
        },
      },
      {
        key: 'gmv',
        title: '销售额',
        formatter: (item: Top10ItemType) => {
          if (!item) return null;
          const text =
            item?.gmv !== undefined && item?.gmv !== null
              ? formatPriceFormYuan(item.gmv / 100, 2, false)
              : '--';
          return <div>{text}</div>;
        },
      },
    ]);

    onMounted(() => {
      reqShop.runAsync();
    });

    const top10Columns = computed(() => {
      return reqTop10ObjList.value.map(el => {
        const numbers = Array.from(Array(10).keys(), n => n + 1);
        const cols = numbers.map(number => {
          return {
            label: number,
            align: 'right',
            headerAlign: 'center',
            minWidth: 170,
            field: 'sale',
            formatter: (row: any, column: any) => {
              return row.formatter(el.req.data?.[number - 1]);
            },
          };
        });
        return [
          {
            label: '排行',
            align: 'center',
            headerAlign: 'center',
            minWidth: 100,
            field: 'sale',
            formatter: (row: any, column: any, value: any, index: number) => {
              return row?.title;
            },
          },
          ...cols,
        ];
      });
    });

    return {
      exportLoading,
      colGroups,
      reqShop,
      reqTop10ObjList,
      reqExprot,
      formData,
      reqCompetitiveList,
      top10Row,
      top10Columns,
      selectRow,
      ...methods,
    };
  },
  render() {
    return (
      <div class="data-center-competitor tg-page-container">
        <div class="competitor-form">
          <el-form class="filter-form flex-form" inline label-width="60px" size="mini">
            <el-form-item label="竞品账号：" prop="">
              <el-select
                style="width: 200px"
                popper-class="el-select-popper-mini"
                v-model={this.formData.shop_name}
                filterable
                placeholder="全部"
              >
                {/* <el-option label="全部" value={undefined} /> */}
                {this.reqShop.data?.map((item: any, key2: number) => {
                  return <el-option label={item.shop_name} key={key2} value={item.shop_name} />;
                })}
              </el-select>
            </el-form-item>
            <el-form-item label="日期：" label-width="42px">
              <el-date-picker
                style="width: 200px"
                placeholder="请选择月份"
                type="month"
                v-model={this.formData.date}
                format="yyyy.MM"
                value-format="yyyy-MM"
                clearable={false}
                picker-options={this.pickerOptions}
                editable={false}
              />
            </el-form-item>
            <el-form-item>
              <tg-button type="primary" onClick={this.search}>
                查询
              </tg-button>
              <tg-button class="mgl-8" onClick={this.reset}>
                重置
              </tg-button>
              <tg-button class="mgl-8" onClick={this.exprot}>
                导出
              </tg-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="content-field">
          <div class="section-title">销售环比情况</div>
          <vxe-table
            border
            class="vxe-table-style"
            row-class-name="vxe-table-row-customer"
            cell-class-name={({ row }: { row: any }) => {
              if (row === this.selectRow) {
                return 'actived';
              }
              return null;
            }}
            on-cell-click={({ row }: { row: any }) => {
              this.selectRow = row;
              this.formData.third_tiange_cat_id = row.third_tiange_cat_id;
              this.formData.item_cat_name = row.item_cat;
              this.sendTop10Req();
            }}
            highlight-hover-row
            tooltip-config={{
              theme: 'light',
            }}
            show-overflow
            height={'370px'}
            // max-height="478px"
            v-loading={this.reqCompetitiveList.loading}
            data={this.reqCompetitiveList.data || []}
            // footer-method={() => ['合计', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '44', '67', '-', '2', '1']}
          >
            <template slot="empty">
              <empty-common detail-text="暂无数据"></empty-common>
            </template>
            {(this.reqCompetitiveList.data ?? []).length > 0 && (
              <vxe-column
                width={160}
                title="类目"
                align="left"
                headerAlign="center"
                fixed="left"
                show-overflow
                formatter={({ row }: { row: any }) => {
                  return row.item_cat;
                }}
              ></vxe-column>
            )}
            {this.colGroups.map(group => {
              return (
                <vxe-colgroup
                  title={group.title}
                  header-class-name={group.headerClassName}
                  align={group.align}
                  fixed={group.fixed}
                  key={group}
                >
                  {group.subColumns.map((v: any) => (
                    <vxe-column
                      header-class-name={v.className}
                      title={v.label}
                      field={v.field}
                      align={v.align}
                      // fixed={v.fixed}
                      headerAlign={v.headerAlign}
                      minWidth={v.width}
                      // fixed={v.fixed}
                      // formatter={v.formatter}
                      scopedSlots={v.scopedSlots}
                      key={v}
                    />
                  ))}
                </vxe-colgroup>
              );
            })}
          </vxe-table>
          <div class="section-title" style="margin-top: 32px;">
            各类目销售TOP榜：{this.formData.item_cat_name || '--'}
          </div>
          <div>
            <span
              class={this.formData.sort === 'sale' ? 'sort-item actived' : 'sort-item'}
              on-click={() => {
                if (this.formData.sort === 'sale') return;
                this.formData.sort = 'sale';
                this.sendTop10Req();
              }}
            >
              销量
            </span>
            <span
              class={this.formData.sort === 'gmv' ? 'sort-item actived' : 'sort-item'}
              on-click={() => {
                if (this.formData.sort === 'gmv') return;
                this.formData.sort = 'gmv';
                this.sendTop10Req();
              }}
            >
              销售额
            </span>
          </div>
          <div>
            {this.top10Columns.map((el, index) => {
              // const tempDate = moment(this.getCompetitiveParams().top10.end_date);
              // const month = tempDate.subtract(index, 'month').month() + 1;
              const reqObj = this.reqTop10ObjList[index];
              return (
                <div key={el}>
                  <div class="top10-month">{reqObj.month + 1}月</div>
                  <tg-table
                    stripe
                    border
                    // border={this.config?.table?.border}
                    // v-loading={this.reqData?.loading}
                    columns={el}
                    // height="300px"
                    data={this.top10Row}
                    v-loading={reqObj.req.loading}
                  ></tg-table>
                </div>
              );
            })}
          </div>
        </div>
        <tg-mask-loading visible={this.exportLoading} content="正在导出，请稍候..." />
      </div>
    );
  },
});
