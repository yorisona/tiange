/*
 * @Author: 肖槿
 * @Date: 2021-12-01 13:46:32
 * @Description: ——
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 16:10:00
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\use.tsx
 */
import { watch, Ref, reactive, ref } from '@vue/composition-api';
import { ItemReportParams } from '../types';
import {
  GetDouyinCategoryReport,
  GetDouyinItemReport,
  GetShopLiveListDouyinSeason,
  GetShopLiveListDouyinSeasonYear,
  GetShopLiveQueryDouyinTiangeCategory,
} from '@/services/datacenter';
import { TableColumn } from '@/types/vendor/column';
import { Message } from 'element-ui';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

// 表格行列转换
interface IConversionRow {
  columns: {
    label: string;
    align?: string;
    prop?: string;
    formatter?: (text?: any, row?: any, column?: any, idx?: number) => any;
    sortable?: string;
  }[];
  data: Ref<any[]>;
  onSortChange?: (...args: any[]) => void;
  defaultSort?: { order: string | null; prop: string };
}

/**
 * 表格数据行列转换
 * @param columns
 * @param data
 */
export const useTableConversionRow = ({
  columns,
  data,
  onSortChange,
  defaultSort = { order: null, prop: '' },
}: IConversionRow) => {
  // 定义表格转换后的真实列
  const converColumns = ref<TableColumn<any>[]>([]);
  const converData = ref<any>([]);
  const sortProp = ref<string>(defaultSort.prop);
  const sortOrder = ref<string | null>(defaultSort.order);
  // 计算列
  const execColumns = (data: any[]) => {
    const columnsLength = columns.length;
    const _data: any[] = new Array(columnsLength).fill(1).map((_, index) => index);
    const _columns: TableColumn<any>[] = new Array(Math.max(data.length + 1, 10))
      .fill(1)
      .map((_, colIndex) => {
        const config: TableColumn<any> = {
          label: `key_${colIndex}`,
          align: 'center',
          minWidth: 164,
          formatter(row, column, _, index) {
            const cColumn = columns[index];

            if (colIndex === 0) {
              const hasSort = cColumn.sortable === 'custom';
              let orderClass: any = '';
              if (sortProp.value === cColumn.prop) {
                orderClass = sortOrder.value;
              }
              let header = columns[index].label;
              if ((columns[index] as any).renderHeader !== undefined) {
                header = (columns[index] as any).renderHeader(columns[index]);
              }
              return (
                <div
                  class="firstcolumn_sort"
                  onclick={() => {
                    if (!hasSort) return;
                    if (sortProp.value !== cColumn.prop) {
                      sortProp.value = cColumn.prop as any;
                      sortOrder.value = 'ascending';
                    } else {
                      sortOrder.value =
                        sortOrder.value === 'ascending'
                          ? 'descending'
                          : sortOrder.value === 'descending'
                          ? null
                          : sortOrder.value === null
                          ? 'ascending'
                          : null;
                    }
                    onSortChange && onSortChange(sortProp.value, sortOrder.value);
                  }}
                >
                  <span class="firstcolumn">{header}</span>
                  {hasSort && (
                    <span class={`caret-wrapper ${orderClass}`}>
                      <i
                        class="sort-caret ascending"
                        onclick={(e: MouseEvent) => {
                          e.stopPropagation();
                          if (sortProp.value !== cColumn.prop) {
                            sortProp.value = cColumn.prop as any;
                            sortOrder.value = 'ascending';
                          } else {
                            sortOrder.value = sortOrder.value === null ? 'ascending' : null;
                          }

                          onSortChange && onSortChange(sortProp.value, sortOrder.value);
                        }}
                      />
                      <i
                        class="sort-caret descending"
                        onclick={(e: MouseEvent) => {
                          e.stopPropagation();

                          if (sortProp.value !== cColumn.prop) {
                            sortProp.value = cColumn.prop as any;
                            sortOrder.value = 'descending';
                          } else {
                            sortOrder.value = sortOrder.value === null ? 'descending' : null;
                          }

                          onSortChange && onSortChange(sortProp.value, sortOrder.value);
                        }}
                      />
                    </span>
                  )}
                </div>
              );
            }
            const cRow = data[colIndex - 1];
            if (cRow === undefined) return '';
            let cText = cRow[cColumn.prop as any];
            if (cText === null) cText = '--';

            if (cColumn.formatter !== undefined) {
              return cColumn.formatter(cText, cRow, cColumn, colIndex);
            }

            return cText;
          },
        };
        // 如果是第一列,设置为固定
        if (colIndex === 0) {
          delete config.minWidth;
          config.width = 130;
          config.fixed = 'left';
        }
        return config;
      });

    converColumns.value = _columns;
    converData.value = _data;
  };

  execColumns(data.value);

  watch(
    () => data.value,
    () => {
      execColumns(data.value);
    },
  );

  return reactive({
    columns: converColumns,
    data: converData,
  });
};

// 商品分析-数据
export const useCommodityGoodsData = () => {
  // 抖音项目类目销售列表
  const category_report = ref<any>([]);
  const project = ref<any>();
  // 项目列表
  const project_report = ref<any>([]);
  // 项目列表分页
  const pagination = reactive({
    total: 0,
    page_num: 0,
  });
  const loading = ref(false);

  const fixed = (num: number) => {
    if (num === null || num === undefined) return '--';
    return num.toFixed(2) as any;
  };
  // 查询类目
  const category_report_query = (props: any) => {
    const params = { ...props };
    params.start_date = props.start_date;
    params.end_date = props.end_date;
    return GetDouyinCategoryReport(params).then(res => {
      category_report.value = res.data.data.categories;
      project.value = res.data.data.project;
    });
  };
  const { business_type } = useProjectBaseInfo();
  // 查询项目。根据传参room_id判断是否是场次，url
  const query_project = (params: ItemReportParams) => {
    return Promise.resolve()
      .then(() => {
        loading.value = true;
      })
      .then(() => {
        return GetDouyinItemReport({ ...params, num: 20 }, business_type.value).then(res => {
          if (!res.data.success) {
            Message.error(res.data.message);
            return;
          }
          res.data.data.items = res.data.data.items.map((item: any) => {
            item.market_price =
              item.market_price === null ? '--' : `${fixed(item.market_price / 100)}`;
            item.shop_gmv = item.shop_gmv === null ? '--' : `${fixed(item.shop_gmv / 100)}`;
            item.shop_price = item.shop_price === null ? '--' : `${fixed(item.shop_price)}`;
            item.discount_price =
              item.discount_price === null ? '--' : `${fixed(item.discount_price / 100)}`;
            item.gmv = item.gmv === null ? '--' : `${fixed(item.gmv / 100)}`;
            item.last_week_gmv =
              item.last_week_gmv === null ? '--' : `${fixed(item.last_week_gmv / 100)}`;
            item.pay_rate = item.pay_rate === null ? '--' : `${item.pay_rate}%`;
            item.click_rate = item.click_rate === null ? '--' : `${item.click_rate}%`;
            //退款相关
            item.shop_refund_gmv =
              item.shop_refund_gmv === null ? '--' : `${fixed(item.shop_refund_gmv / 100)}`;
            item.shop_refund_gmv_rate =
              item.shop_refund_gmv_rate === null ? '--' : `${item.shop_refund_gmv_rate}%`;
            return item;
          });
          pagination.total = res.data.data.total;
          pagination.page_num = params.page_num as number;
          project_report.value = res.data.data.items;
        });
      })
      .then(value => {
        loading.value = false;
        return value;
      })
      .catch((e: Error) => {
        loading.value = false;
        throw e;
      });
  };
  // 年度
  const year_options = ref<any[]>([]);
  const season_options = ref<any[]>([]);
  const yearConfig = ref<any[]>([]);
  const filterSeason = ref<any>(() => {});

  const category_1 = ref<any[]>([]);
  const category_2 = ref([]);

  const oMap = ['其他', '春季', '夏季', '秋季', '冬季'];

  const getYearOptions = async (
    project_id: any,
    start_date: any,
    end_date: any,
    year: any,
    type: string,
  ) => {
    //GetShopLiveListDouyinSeasonYear
    await Promise.resolve({
      project_id,
      start_date,
      end_date,
    })
      .then((payload: any) => {
        if (type !== 'season') return GetShopLiveListDouyinSeason(payload);
        return GetShopLiveListDouyinSeasonYear(payload);
      })
      .then(res => {
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res;
      })
      .then(res => {
        yearConfig.value = res.data.data;
        if (type !== 'season') {
          year_options.value = yearConfig.value.map(_ => {
            return { value: _.year, label: _.year === 0 ? '其他' : _.year };
          });
          filterSeason.value = filterYearSeason;
        } else {
          season_options.value = yearConfig.value.map(_ => {
            return { value: _.season, label: oMap[_.season] };
          });
          filterSeason.value = filterSeasonYear;
        }
      })
      .then(() => {
        filterSeason.value(year);
      })
      .catch((e: Error) => {
        Message.error(e.message);
      });
  };

  const filterSeasonYear = (season: number) => {
    let find = yearConfig.value.find(
      it => it.season === Number(season) || it.season === String(season),
    );
    if (!find) {
      if (season === undefined) {
        find = {
          years: [],
        };
        yearConfig.value.forEach(_ => find.years.push(..._.years));
        find.years = Array.from(new Set(find.years));
      } else {
        year_options.value = [];
        return;
      }
    }
    year_options.value = find.years.map((_: any) => {
      return { value: _, label: _ === 0 ? '0' : _ };
    });
  };
  const filterYearSeason = (year: number) => {
    let find = yearConfig.value.find(it => it.year === Number(year) || it.year === String(year));
    if (!find) {
      if (year === undefined) {
        find = {
          seasons: [],
        };
        yearConfig.value.forEach(_ => find.seasons.push(..._.seasons));
        find.seasons = Array.from(new Set(find.seasons));
      } else {
        season_options.value = [];
        return;
      }
    }
    season_options.value = find.seasons.map((_: any) => {
      return { value: _, label: oMap[_] };
    });
  };
  // 分类-1级类目
  const getCategory_1 = async (
    project_id: any,
    start_date: any,
    end_date: any,
    category_id: any,
    second_tiange_cat_id: any,
    room_id: any,
    is_from_project?: boolean,
  ) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetShopLiveQueryDouyinTiangeCategory(
      {
        project_id,
        start_date,
        end_date,
        category_id,
        level: 1,
        room_id: room_id || undefined,
        is_from_project: is_from_project || false,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_1.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.id,
      };
    });
    if (second_tiange_cat_id === 0) {
      category_1.value.push({
        label: '其他',
        value: 0,
      });
    }
  };
  const getCategory_2 = async (
    project_id: any,
    start_date: any,
    end_date: any,
    category_id: any,
    room_id: any,
    is_from_project?: boolean,
  ) => {
    // GetShopLiveQueryDouyinTiangeCategory
    const res = await GetShopLiveQueryDouyinTiangeCategory(
      {
        project_id,
        start_date,
        end_date,
        category_id,
        level: 2,
        room_id: room_id || undefined,
        is_from_project: is_from_project || false,
      } as any,
      business_type.value,
    );
    if (!res.data.success) {
      Message.error(res.data.message);
      return;
    }
    category_2.value = res.data.data.map((item: any) => {
      return {
        label: item.cat_name,
        value: item.id,
      };
    });
  };

  return reactive({
    project,
    category_report,
    category_report_query,
    project_report,
    query_project,
    pagination,
    category_1,
    category_2,
    year_options,
    season_options,
    getYearOptions,
    filterSeason,
    getCategory_1,
    getCategory_2,
    loading,
  });
};
