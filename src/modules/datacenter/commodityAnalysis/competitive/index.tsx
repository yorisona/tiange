import {
  defineComponent,
  reactive,
  ref,
  computed,
  nextTick,
  watch,
  ComputedRef,
  inject,
} from '@vue/composition-api';
import { useData } from '@/modules/datacenter/commodityAnalysis/competitive/use';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import moment from 'moment';
import LineEcharts from '@/modules/datacenter/components/line/index.vue';
import {
  GetCompetitiveShops,
  GetCompetitiveTopShops,
  GetQueryDouyinReportProjects,
  GetCompetitiveAnalysisShops,
  GetSystemFirstCategory,
  ShopLiveQueryDouyinCategoryCompetitiveItemsTotal,
  PostCompetitiveExportExcel,
} from '@/services/datacenter';
import { useRequest } from '@gm/hooks/ahooks';
import qs from 'query-string';
import { getToken } from '@/utils/token';
import { ProjectStatusEnum } from '@/types/tiange/common';
import {
  CompetitiveAnalysisDetail,
  competitorSellItem,
  competitorTopItem,
  ITabProps,
} from '@/modules/datacenter/commodityAnalysis/types';
import { wait } from '@/utils/func';
import { get_folded_text } from '@/utils/string';
import { numberFormat } from '@/utils/formatMoney';
import { analysisTopItem } from './use';
import formatPriceForm from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;
import weekMonthTopCompare from '../components/weekMonthTopCompare/index';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { Confirm } from '@/use/asyncConfirm';

const routes = [
  {
    name: RouterDataCenter.commodityAnalysis,
    title: '品牌商品分析',
  },
  {
    path: '',
    title: '竞品销售分析',
  },
];
const getMoney = (value: any, divisor = 100, fixed = 2) => {
  if (value) {
    return value !== null
      ? formatPriceFormYuan(value === 0 ? 0 : value / divisor, fixed, false)
      : '--';
  }
  return '--';
};
const useTopData = () => {
  const reqShoLive = useRequest(ShopLiveQueryDouyinCategoryCompetitiveItemsTotal, { manual: true });
  const sort = ref('shop_gmv_desc');
  const topSort = ref('sale_count');
  const sortTopOptions = [
    {
      label: '销量',
      value: 'sale_count',
    },
    {
      label: '销售额',
      value: 'gmv',
    },
  ];
  const sortOptions = [
    {
      label: '销售额',
      value: 'shop_gmv_desc',
    },
    {
      label: '销量',
      value: 'shop_sale_count_desc',
    },
    {
      label: '转化率',
      value: 'pay_rate_desc',
    },
  ];
  let lastParams: any;
  const changeSort = (value: string) => {
    sort.value = value;
    query(lastParams);
  };
  const changeTopSort = (value: string) => {
    topSort.value = value;
  };
  const weekLoading = ref(false);
  const query = async (params: any) => {
    weekLoading.value = true;
    const { category_id: tiange_cat_id, ...rest } = params;
    lastParams = params;
    await reqShoLive.run({
      ...rest,
      tiange_cat_id,
      sort: sort.value,
    });
    weekLoading.value = false;
  };

  const exportPDF = () => {
    const { category_id: tiange_cat_id = 1, ...rest } = lastParams;
    const _paramsstr = qs.stringify({ ...rest, tiange_cat_id, sort: sort.value });
    const token = getToken();
    const url = '/api/shop_live/export_douyin_category_competitive_items_total';
    window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
  };

  return reactive({
    weekLoading,
    left: computed(() => {
      return (reqShoLive.data?.items || []).map((item: analysisTopItem, index: number) => {
        item.rank = index + 1;
        return item;
      });
    }),
    right: computed(() => {
      return (reqShoLive.data?.competitive_shop_items || []).map((item: any) => {
        const sub_items = item.items.map((sub: analysisTopItem, index: number) => {
          sub.rank = index + 1;
          return sub;
        });
        item.items = sub_items;
        return item;
      });
    }),
    exportPDF,
    topSort,
    sortTopOptions,
    sortOptions,
    sort,
    query,
    changeSort,
    changeTopSort,
  });
};

export default defineComponent({
  name: 'TgCommodityCompetitiveProductAnalysis',
  components: {
    LineEcharts,
    weekMonthTopCompare,
  },
  setup(props, ctx) {
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 0;
    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight, -42],
      tableMinHeight: 100,
    });
    const tableRef = ref<any>();
    const preWeek = moment().weekday(-7);
    const queryForm: any = reactive<{
      project_id: string | undefined | number;
      project_name: string | undefined;
      date: [string, string];
      start_date: ComputedRef<string>;
      end_date: ComputedRef<string>;
      shop_name: string[];
      dateType: number;
    }>({
      project_id: '',
      project_name: '',
      date: [
        preWeek.startOf('week').format('YYYY-MM-DD'),
        preWeek.endOf('week').format('YYYY-MM-DD'),
      ],
      start_date: computed<string>(() => queryForm.date[0]),
      end_date: computed<string>(() => queryForm.date[1]),
      shop_name: [],
      dateType: 1,
    });
    const lastQueryForm = ref<{
      project_id: string | undefined | number;
      start_date: string;
      end_date: string;
      shop_names: string;
      self_shop_names: string;
      project_name: string | undefined;
    }>({
      project_id: '',
      project_name: '',
      start_date: preWeek.startOf('week').format('YYYY-MM-DD'),
      end_date: preWeek.endOf('week').format('YYYY-MM-DD'),
      shop_names: '',
      self_shop_names: '',
    });
    const categoryName = ref('全部');
    const categoryId = ref<string | undefined | number>(undefined);
    const emptyText = ref('请选择需要对比的竞品后开始对比');

    const {
      loading: listLoading,
      listColumn,
      echartsLoading,
      getEchartsData,
      LineDate,
      salesAmountLineList,
      saleCountLineList,
      watchLineList,
      turnLineList,
    } = useData(ctx);

    const updateRouterParams = () => {
      const router = useRouter();
      const { project_id, project_name } = router.currentRoute.query;
      queryForm.project_id = project_id ? Number(project_id) : undefined;
      queryForm.project_name = project_name as string | undefined;
      lastQueryForm.value.project_name = queryForm.project_name;
      lastQueryForm.value.project_id = queryForm.project_id;
      // seach()
    };
    updateRouterParams();
    const topData = useTopData();

    const competitiveList = ref<{ shop_name: string; style: number; choice: number | boolean }[]>(
      [],
    );
    const top_loading = ref(false);
    const competitiveTopData = () => {
      top_loading.value = true;
      const params = {
        sort: topData.topSort,
        project_id: Number(queryForm.project_id),
        start_date: queryForm.start_date,
        end_date: queryForm.end_date,
        shop_names:
          (queryForm.shop_name &&
            queryForm.shop_name
              .filter((it: any) => {
                const find: any = competitiveList.value.find(item => item.shop_name === it);
                return find ? find.is_self !== 1 : false;
              })
              .join(',')) ||
          '',
        self_shop_names:
          (queryForm.shop_name &&
            queryForm.shop_name
              .filter((it: any) => {
                const find: any = competitiveList.value.find(item => item.shop_name === it);
                return find ? find.is_self === 1 : false;
              })
              .join(',')) ||
          '',
      };
      GetCompetitiveTopShops(params).then(res => {
        top_loading.value = false;
        if (res.data.success) {
          tableTOPData.value = res.data.data.data;
          tableTOPData.value.push(res.data.data.total);
        }
      });
    };
    const onRowClick = (row: any) => {
      categoryName.value = row.third_category_id
        ? row.third_tiange_cat_name
        : row.second_category_id
        ? row.category_name
        : '全部';
      categoryId.value = row.third_category_id || row.second_category_id || undefined;
      defaultTag.value = 1;
      const params = {
        project_id: lastQueryForm.value
          ? String(lastQueryForm.value.project_id)
          : String(queryForm.project_id),
        start_date: lastQueryForm.value ? lastQueryForm.value.start_date : queryForm.start_date,
        end_date: lastQueryForm.value ? lastQueryForm.value.end_date : queryForm.end_date,
        shop_names: lastQueryForm.value
          ? lastQueryForm.value.shop_names
          : (queryForm.shop_name &&
              queryForm.shop_name
                .filter((it: any) => {
                  const find: any = competitiveList.value.find(item => item.shop_name === it);
                  return find ? find.is_self !== 1 : false;
                })
                .join(',')) ||
            '',
        self_shop_names: lastQueryForm.value
          ? lastQueryForm.value.self_shop_names
          : (queryForm.shop_name &&
              queryForm.shop_name
                .filter((it: any) => {
                  const find: any = competitiveList.value.find(item => item.shop_name === it);
                  return find ? find.is_self === 1 : false;
                })
                .join(',')) ||
            '',
        category_id: categoryId.value,
      };
      getEchartsData(params);
      topData.query(params);
    };
    const select_shop_name = ref('');
    const onQueryClick = async () => {
      categoryName.value = '全部';
      if (!queryForm.shop_name || queryForm.shop_name.length === 0) {
        ctx.root.$message.warning('请选择竞品账号');
        return;
      }
      if (!queryForm.start_date || !queryForm.end_date) {
        ctx.root.$message.warning('请选择对比周期');
        return;
      }
      localStorage.setItem(
        'competitve_names',
        queryForm.shop_name && queryForm.shop_name.join(','),
      );
      const params = {
        project_id: String(queryForm.project_id),
        start_date: queryForm.start_date,
        end_date: queryForm.end_date,
        shop_names:
          (queryForm.shop_name &&
            queryForm.shop_name
              .filter((it: any) => {
                const find: any = competitiveList.value.find(item => item.shop_name === it);
                return find ? find.is_self !== 1 : false;
              })
              .join(',')) ||
          '',
        self_shop_names:
          (queryForm.shop_name &&
            queryForm.shop_name
              .filter((it: any) => {
                const find: any = competitiveList.value.find(item => item.shop_name === it);
                return find ? find.is_self === 1 : false;
              })
              .join(',')) ||
          '',
      };
      lastQueryForm.value = {
        ...params,
        project_name: String(queryForm.project_name),
      };
      competitiveTopData();
      await getFirstCategory(params);
      await getDouyinCategoryReport({
        ...params,
        first_tiange_category_id: firstActive.value,
      });
      nextTick(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 1000);
      });
      await getEchartsData({
        ...params,
        category_id: firstActive.value,
      });
      if (queryForm.shop_name && queryForm.shop_name.length > 0) {
        select_shop_name.value = queryForm.shop_name[0];
      } else {
        select_shop_name.value = '';
      }
      await topData.query({
        ...params,
        category_id: firstActive.value,
      });
      emptyText.value = '暂无数据';
    };
    watch(
      () => topData.topSort,
      () => {
        competitiveTopData();
      },
      {
        deep: true,
      },
    );
    const defaultTag = ref<number>(1);
    const tagList = ref<any>([
      {
        label: '销售额对比',
        value: 1,
      },
      {
        label: '销量对比',
        value: 2,
      },
      {
        label: '浏览量对比',
        value: 3,
      },
      {
        label: '转化率对比',
        value: 4,
      },
    ]);
    const handleTagFilter = (value: number) => {
      defaultTag.value = value;
    };

    const scrollRef = ref<{ scrollTop: number }>();

    const showBackTop = ref(false);

    const onScroll = (e: Event) => {
      const dom = e.target as HTMLElement;
      showBackTop.value = dom.scrollTop > 10;
    };

    const backTop = () => {
      if (scrollRef.value) {
        scrollRef.value.scrollTop = 0;
      }
    };
    const pickerWeekOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() >
            new Date(`${moment().weekday(-1).format('YYYY/MM/DD')} 00:00:01`).getTime() ||
          time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
      firstDayOfWeek: 1,
    };
    const isRestart = ref(true);
    const pickerMinDate = ref<any>('');
    const pickerDayOptions = {
      onPick: ({ maxDate, minDate }: any) => {
        isRestart.value = false;
        pickerMinDate.value = minDate.getTime();
        if (maxDate) {
          pickerMinDate.value = '';
        }
      },
      disabledDate: (time: any) => {
        if (queryForm.date && isRestart.value) {
          // 存在选中的日期且没有重新选择日期 不做禁用处理
          return (
            time.getTime() >
              new Date(`${moment().add(0, 'day').format('YYYY/MM/DD')} 00:00:01`).getTime() ||
            time.getTime() < new Date('2022/01/1 00:00:00').getTime()
          );
        }
        if (pickerMinDate.value !== '') {
          const one = 30 * 24 * 3600 * 1000;
          const minTime = pickerMinDate.value - one;
          const maxTime = pickerMinDate.value + one;
          return (
            time.getTime() < minTime ||
            time.getTime() > maxTime ||
            time.getTime() >
              new Date(`${moment().add(0, 'day').format('YYYY/MM/DD')} 00:00:00`).getTime()
          );
        }
      },
      // disabledDate(time: Date) {
      //   return (
      //     time.getTime() >
      //       new Date(`${moment().add(0, 'day').format('YYYY/MM/DD')} 00:00:01`).getTime() ||
      //     time.getTime() < new Date('2022/01/1 00:00:00').getTime()
      //   );
      // },
      // firstDayOfWeek: 1,
    };
    const pickerMonthOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() >
            new Date(
              `${moment().subtract(1, 'month').endOf('month').format('YYYY/MM/DD')} 00:00:01`,
            ).getTime() || time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
      firstDayOfWeek: 1,
    };
    const timeChange = () => {
      if (queryForm.dateType === 1) {
        let startDate = moment(queryForm.date);
        if (startDate > moment().weekday(-1).endOf('week')) {
          startDate = moment().weekday(-7).endOf('week');
        }
        // queryForm.date = startDate.startOf('week').format('YYYY-MM-DD');
        queryForm.start_date = startDate.startOf('week').format('YYYY-MM-DD');
        queryForm.end_date = startDate.endOf('week').format('YYYY-MM-DD');
      } else {
        let startDate = moment(queryForm.date);
        if (startDate > moment().subtract(1, 'month').endOf('month')) {
          startDate = moment().subtract(1, 'month').endOf('month');
        }
        // queryForm.date = startDate.startOf('month').format('YYYY-MM-DD');
        queryForm.start_date = startDate.startOf('month').format('YYYY-MM-DD');
        queryForm.end_date = startDate.endOf('month').format('YYYY-MM-DD');
      }
    };
    const tableTOPData = ref<competitorTopItem[]>([]);

    const topShopColumns = (index: number) => {
      return [
        {
          label: '款数',
          minWidth: 60,
          align: 'right',
          fixed: index === 0 ? 'left' : '',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorTopItem) => {
            const arr = [row.shop_live, ...row.competitive];
            return arr[index] && arr[index].sku_count !== null
              ? numberFormat(Number(arr[index].sku_count || 0), 0, '.', ',')
              : '--';
          },
        },
        {
          label: '销量',
          minWidth: 80,
          align: 'right',
          fixed: index === 0 ? 'left' : '',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorTopItem) => {
            const arr = [row.shop_live, ...row.competitive];
            return arr[index] && arr[index].sale_count !== null
              ? numberFormat(Number(arr[index].sale_count || 0), 0, '.', ',')
              : '--';
          },
        },
        {
          label: '平均件单价 (元)',
          minWidth: 110,
          align: 'right',
          fixed: index === 0 ? 'left' : '',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorTopItem) => {
            const arr = [row.shop_live, ...row.competitive];
            return arr[index] && arr[index].average_sale_price !== null
              ? formatPriceFormYuan(Number(arr[index].average_sale_price || 0) / 100, 2, false)
              : '--';
          },
        },
        {
          label: '销售额 (元)',
          minWidth: 90,
          align: 'right',
          fixed: index === 0 ? 'left' : '',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorTopItem) => {
            const arr = [row.shop_live, ...row.competitive];
            return arr[index] && arr[index].gmv !== null
              ? formatPriceFormYuan(Number(arr[index].gmv || 0) / 100, 2, false)
              : '--';
          },
        },
        {
          label: '销售额占比',
          minWidth: 90,
          align: 'right',
          fixed: index === 0 ? 'left' : '',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorTopItem) => {
            const arr = [row.shop_live, ...row.competitive];
            return arr[index] && arr[index].gmv_percent !== null
              ? (arr[index].gmv_percent || 0) + '%'
              : '--';
          },
        },
        {
          label: '折扣',
          minWidth: 80,
          align: 'right',
          fixed: index === 0 ? 'left' : '',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorTopItem) => {
            const arr = [row.shop_live, ...row.competitive];
            return arr[index] && arr[index].discount !== null
              ? (arr[index].discount || 0) + '%'
              : '--';
          },
        },
      ];
    };
    const topSellColumns = (index: number) => {
      return [
        {
          label: '款数',
          minWidth: 60,
          align: 'center',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorSellItem) => {
            const arr = [row.own, ...row.competitive];
            return arr[index] && arr[index].sku_count !== null
              ? numberFormat(Number(arr[index].sku_count || 0), 0, '.', ',')
              : '--';
          },
        },
        {
          label: '销量',
          minWidth: 80,
          align: 'center',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorSellItem) => {
            const arr = [row.own, ...row.competitive];
            return arr[index] && arr[index].sale_count !== null
              ? numberFormat(Number(arr[index].sale_count || 0), 0, '.', ',')
              : '--';
          },
        },
        {
          label: '款均销量',
          minWidth: 90,
          align: 'center',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorSellItem) => {
            const arr = [row.own, ...row.competitive];
            return arr[index] && arr[index].average_sale_count !== null
              ? numberFormat(Number(arr[index].average_sale_count || 0), 2, '.', ',')
              : '--';
          },
        },
        {
          label: '平均件单价 (元)',
          minWidth: 110,
          align: 'center',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorSellItem) => {
            const arr = [row.own, ...row.competitive];
            return arr[index] ? getMoney(arr[index].average_price) : '--';
          },
        },
        {
          label: '销售额 (元)',
          minWidth: 90,
          align: 'center',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorSellItem) => {
            const arr = [row.own, ...row.competitive];
            return arr[index] ? getMoney(arr[index].gmv) : '--';
          },
        },
        {
          label: '销售额占比',
          minWidth: 90,
          align: 'center',
          className:
            index === 1 || index === 3
              ? 'department-fund-statement-head-even'
              : index === 2
              ? 'department-fund-statement-head-odd'
              : '',
          formatter: (row: competitorSellItem) => {
            const arr = [row.own, ...row.competitive];
            return arr[index] && arr[index].gmv_ratio !== null
              ? (arr[index].gmv_ratio || 0) + '%'
              : '--';
          },
        },
      ];
    };
    const getClassName = (row: any) => {
      if (row.name.indexOf('小计') >= 0) {
        return 'all-div';
      }
      return '';
    };
    const project_list = ref<
      { project_id: string; project_name: string; project_status: number; new_report: boolean }[]
    >([]);
    const queryData = () => {
      GetQueryDouyinReportProjects().then(res => {
        project_list.value = res.data.data.projects;
      });
    };
    queryData(); //获取竞品店铺
    //竞品销售分析
    const firstCategory = ref<{ cat_name: string; id: number }[]>([]);
    const firstActive = ref(0);
    const list = ref<any[]>([]);
    const loading = ref(false);
    const summariesData = ref<Record<string, any>>();
    const getDouyinCategoryReport = async (payload: CompetitiveAnalysisDetail) => {
      loading.value = true;
      const [{ data: response }] = await wait(500, GetCompetitiveAnalysisShops(payload));
      loading.value = false;
      if (response.success) {
        summariesData.value = response.data;
        const base = response.data.category;
        if (base.length > 0) {
          const arr = [] as any[];
          base.map((it: any) => {
            it = {
              competitive: it.total.competitive,
              own: it.total.own,
              category_name: it.total.own.category_name,
              sku_count: it.total.own.sku_count,
              third_tiange_cat_name: '小计',
              second_category_id: it.second_category_id,
              third_category_id: '',
              category_id: it.second_category_id,
              children: it.children.map((sub: any) => {
                sub = {
                  own: sub.own,
                  competitive: sub.competitive,
                  sku_count: sub.own.sku_count,
                  second_category_id: sub.second_category_id,
                  third_category_id: sub.third_category_id,
                  category_name: '',
                  third_tiange_cat_name: sub.third_category_name,
                  second_category_name: sub.second_category_name,
                  third_category_name: sub.third_category_name,
                  category_id: sub.third_category_id,
                };
                return sub;
              }),
            };
            arr.push(it);
          });
          if (arr.length > 0) {
            arr.unshift(getSummaries());
          }
          nextTick(() => {
            list.value = arr;
          });
        } else {
          list.value = [];
        }
      } else {
        list.value = [];
        summariesData.value = undefined;
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const getFirstCategory = async (params: ITabProps) => {
      const [{ data: response }] = await wait(30, GetSystemFirstCategory(params));
      if (response.success) {
        firstCategory.value = response.data || [];
        if (firstCategory.value.length > 0) {
          firstActive.value = firstCategory.value[0].id;
        }
      } else {
        firstCategory.value = [];
        firstActive.value = 0;
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
      categoryId.value = firstActive.value;
      categoryName.value = '全部';
    };
    const changeFirst = async (id: number) => {
      firstActive.value = id;
      categoryId.value = firstActive.value;
      categoryName.value = '全部';
      const params = {
        project_id: lastQueryForm.value
          ? String(lastQueryForm.value.project_id)
          : String(queryForm.project_id),
        start_date: lastQueryForm.value ? lastQueryForm.value.start_date : queryForm.start_date,
        end_date: lastQueryForm.value ? lastQueryForm.value.end_date : queryForm.end_date,
        shop_names: lastQueryForm.value
          ? lastQueryForm.value.shop_names
          : (queryForm.shop_name &&
              queryForm.shop_name
                .filter((it: any) => {
                  const find: any = competitiveList.value.find(item => item.shop_name === it);
                  return find ? find.is_self !== 1 : false;
                })
                .join(',')) ||
            '',
        self_shop_names: lastQueryForm.value
          ? lastQueryForm.value.self_shop_names
          : (queryForm.shop_name &&
              queryForm.shop_name
                .filter((it: any) => {
                  const find: any = competitiveList.value.find(item => item.shop_name === it);
                  return find ? find.is_self === 1 : false;
                })
                .join(',')) ||
            '',
      };
      getDouyinCategoryReport({
        ...params,
        first_tiange_category_id: firstActive.value,
      });
      await getEchartsData({
        ...params,
        category_id: firstActive.value,
      });
      if (queryForm.shop_name && queryForm.shop_name.length > 0) {
        select_shop_name.value = queryForm.shop_name[0];
      } else {
        select_shop_name.value = '';
      }
      await topData.query({
        ...params,
        category_id: firstActive.value,
      });
      emptyText.value = '暂无数据';
    };
    const getRowKey = (row: any) => {
      if (row.children !== undefined) return row.category_id + 'only';
      return row.category_id + '';
    };
    const rowHightlight = ({ row }: { row: any }) => {
      let styleJson: any = {};
      if (row.third_tiange_cat_name === '小计') {
        styleJson = { 'background-color': 'var(--table-striped-bg-color)' };
      }
      if (row.isSum === true) {
        styleJson = { 'background-color': '#E9E9E9 !important' };
        styleJson['font-weight'] = 600;
      }
      return styleJson;
    };
    const getSummaries = () => {
      const result: Record<string, any> = {
        category_name: '全部',
        third_tiange_cat_name: '合计',
        isSum: true,
        category_id: 0,
      };
      result['competitive'] = summariesData.value ? summariesData.value.total.competitive : [];
      result['own'] = summariesData.value ? summariesData.value.total.own : {};
      return result;
    };
    const getCompetitiveShop = computed(() => {
      const data = topData.right;
      let arr: analysisTopItem[] = [];
      if (select_shop_name.value) {
        data.map((item: any) => {
          if (item.shop_name === select_shop_name.value) {
            arr = item.items;
          }
        });
      }
      return arr;
    });

    //获取竞品店铺
    const competitiveData = async (isFirst = false) => {
      const {
        data: { data },
      } = await GetCompetitiveShops({
        project_id: Number(queryForm.project_id || 0),
        has_self: true,
        local: 1,
      });
      if (data && data.length > 0) {
        competitiveList.value = data || [];
        queryForm.shop_name = (data || [])
          .filter((item: { shop_name: string; style: number; choice: number | boolean }) => {
            return item.choice === 1 || item.choice === true;
          })
          .map((sub: { shop_name: string }) => {
            return sub.shop_name;
          });
        if (isFirst && queryForm.shop_name && queryForm.shop_name.length > 0) {
          setTimeout(() => {
            onQueryClick();
          }, 200);
        }
      }
    };
    competitiveData(true);
    /* 切换项目，获取竞品数据*/
    watch(
      () => queryForm.project_id,
      () => {
        const find = (project_list.value || []).find(
          item => item.project_id === queryForm.project_id,
        );
        if (find) {
          queryForm.project_name = find.project_name || '';
        }
        competitiveData(false);
      },
    );

    const exportLoading = ref(false);
    const onExportExcel = async () => {
      exportLoading.value = true;
      const payload = {
        project_id: lastQueryForm.value
          ? String(lastQueryForm.value.project_id)
          : String(queryForm.project_id),
        start_date: lastQueryForm.value ? lastQueryForm.value.start_date : queryForm.start_date,
        end_date: lastQueryForm.value ? lastQueryForm.value.end_date : queryForm.end_date,
        shop_names: lastQueryForm.value
          ? lastQueryForm.value.shop_names
          : (queryForm.shop_name &&
              queryForm.shop_name
                .filter((it: any) => {
                  const find: any = competitiveList.value.find(item => item.shop_name === it);
                  return find ? find.is_self !== 1 : false;
                })
                .join(',')) ||
            '',
        self_shop_names: lastQueryForm.value
          ? lastQueryForm.value.self_shop_names
          : (queryForm.shop_name &&
              queryForm.shop_name
                .filter((it: any) => {
                  const find: any = competitiveList.value.find(item => item.shop_name === it);
                  return find ? find.is_self === 1 : false;
                })
                .join(',')) ||
            '',
        sort_for_top: topData.topSort,
        sort_for_category: topData.sort,
        category_id: categoryId.value || undefined,
        first_tiange_category_id: firstActive.value || undefined,
        select_field:
          defaultTag.value === 1
            ? 'gmv'
            : defaultTag.value === 2
            ? 'sale_count'
            : defaultTag.value === 3
            ? 'watch_count'
            : 'conversion_rate',
      };
      const [{ data: response }] = await wait(500, PostCompetitiveExportExcel(payload));
      exportLoading.value = false;
      if (response.success) {
        await Confirm({
          title: '导出任务创建成功',
          content: '请稍后去工作台-我的文件查看。',
          confirmText: '确定',
          showCancelBtn: false,
        });
      } else {
        ctx.root.$message.error(response.message || '导出任务创建失败，请重新导出！');
      }
    };

    return {
      exportLoading,
      onExportExcel,
      lastQueryForm,
      getCompetitiveShop,
      select_shop_name,
      loading,
      numberFormat,
      getSummaries,
      rowHightlight,
      getRowKey,
      get_folded_text,
      firstCategory,
      firstActive,
      changeFirst,
      summariesData,
      list,
      ProjectStatusEnum,
      project_list,
      queryData,
      getClassName,
      topSellColumns,
      topShopColumns,
      tableTOPData,
      top_loading,
      pickerWeekOptions,
      pickerMonthOptions,
      pickerDayOptions,
      backTop,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      queryForm,
      timeChange,
      onQueryClick,
      competitiveList,
      listLoading,
      onRowClick,
      listColumn,
      tagList,
      defaultTag,
      handleTagFilter,
      echartsLoading,
      LineDate,
      salesAmountLineList,
      saleCountLineList,
      watchLineList,
      turnLineList,
      categoryName,
      emptyText,
      topData,
      scrollRef,
      showBackTop,
      onScroll,
      tableRef,
      isRestart,
    };
  },
});
