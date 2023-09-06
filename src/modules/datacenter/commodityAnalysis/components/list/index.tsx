import {
  defineComponent,
  inject,
  onBeforeMount,
  Ref,
  ref,
  watch,
  nextTick,
} from '@vue/composition-api';
import { render } from '@/use/vue';
import LineCharts from '@/modules/datacenter/commodityAnalysis/components/line/index.vue';
import Top from '@/modules/datacenter/commodityAnalysis/components/top/index.vue';
import Price from '@/modules/datacenter/commodityAnalysis/components/price/index.vue';
import {
  GetSystemCategoryReport,
  GetSystemFirstCategory,
  GetSystemTimeLine,
  ExportDouyinCategoryReport,
} from '@/services/datacenter';
import {
  CategoryReport,
  ITabProps,
  TimeLine,
  TimeLineData,
} from '@/modules/datacenter/commodityAnalysis/types';
import { wait } from '@/utils/func';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';

const { formatPriceFormYuan } = formatPriceForm;
import { RouterDataCenter } from '@/const/router';
import moment from 'moment';
import { get_folded_text } from '@/utils/string';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
export default defineComponent({
  components: {
    Top,
    Price,
    LineCharts,
  },
  setup: render((props: any, ctx: any) => {
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const searchProjectName = inject('searchProjectName') as Ref<string>;
    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const loading = ref(false);
    const sortVal = ref('shop_gmv_desc');
    const heightList = ref<any[]>([]);
    const lowList = ref<any[]>([]);
    // 是否显示排序按钮
    const showSort = ref(true);
    const firstCategory = ref<{ cat_name: string; id: number }[]>([]);
    const firstActive = ref(0);
    const list = ref<any[]>([]);
    const summariesData = ref<Record<string, any>>();
    const { business_type } = useProjectBaseInfo();
    const getDouyinCategoryReport = async (payload: CategoryReport) => {
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetSystemCategoryReport(payload, business_type.value),
      );
      loading.value = false;
      if (response.success) {
        summariesData.value = response.data;
        let base = response.data.categories;
        if (base.length > 0) {
          base = [].concat(...base.map((it: any) => it.children));
          base.map((item: any) => {
            if (item.category_name === '其他') {
              item.third_tiange_cat_name = '小计';
              item.children = [];
            } else {
              item.third_tiange_cat_name = '小计';
              item.children.map((third: any) => {
                third.category_name = '';
              });
            }
          });
          if (base.length > 0) {
            base.unshift(getSummaries());
          }
          showSort.value = true;
          nextTick(() => {
            list.value = base;
          });
        } else {
          showSort.value = false;
          list.value = [];
        }
      } else {
        list.value = [];
        showSort.value = false;
        summariesData.value = undefined;
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const getFirstCategory = async (payload: ITabProps) => {
      loading.value = true;
      const [{ data: response }] = await wait(30, GetSystemFirstCategory(payload));
      loading.value = false;
      if (response.success) {
        firstCategory.value = response.data;
        if (response.data.length > 0) {
          firstActive.value = firstCategory.value[0].id;
        }
      } else {
        firstCategory.value = [];
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const changeFirst = (id: number) => {
      firstActive.value = id;
      getDouyinCategoryReport({
        ...searchParams.value,
        category_id: firstActive.value,
        sort: sortVal.value,
      });
    };
    onBeforeMount(async () => {
      if (!searchParams.value.project_id) return;
      await getFirstCategory(searchParams.value);
      await getDouyinCategoryReport({
        ...searchParams.value,
        category_id: firstActive.value,
        sort: sortVal.value,
      });
      nextTick(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 1000);
      });
    });

    watch(
      () => searchParams.value,
      async data => {
        if (data === undefined) return;
        await getFirstCategory(searchParams.value);
        await getDouyinCategoryReport({
          ...searchParams.value,
          category_id: firstActive.value,
          sort: sortVal.value,
        });
      },
      { deep: true },
    );

    const lineTrend = ref<any>({ date: [], series: [], loading: true });
    const lineData = ref({
      day: 0,
      moreDay: 0,
      lessDay: 0,
      big: 0,
      mini: 0,
    });
    const getTimeLine = async (payload: TimeLine) => {
      const [{ data: response }] = await wait(30, GetSystemTimeLine(payload));
      if (response.success) {
        const res_data: TimeLineData[] = response.data;
        if (res_data.length === 0) {
          lineTrend.value.loading = false;
          lineTrend.value.date = [];
          lineData.value.big = 0;
          lineData.value.mini = 0;
          lineData.value.moreDay = 0;
          lineData.value.lessDay = 0;
          return false;
        }
        // 品牌对比涨幅
        const increase_balance_list: any[] = [];
        //  天鸽涨幅
        const tiange: any[] = [];
        // 天鸽销售额
        const tiange_data: any[] = [];
        //  大盘销售额
        const competitive_data: any[] = [];
        // 大盘涨幅
        const competitive: any[] = [];
        let moreDay = 0;
        let lessDay = 0;
        const date: any[] = [];
        heightList.value = [];
        lowList.value = [];

        let maxHeightItem: any = null;
        let minLowItem: any = null;

        res_data.forEach((item: any) => {
          increase_balance_list.push(item.increase_balance);
          tiange.push(item.tiange_gmv_increase !== null ? item.tiange_gmv_increase : '--');
          competitive.push(
            item.competitive_gmv_increase !== null ? item.competitive_gmv_increase : '--',
          );
          tiange_data.push(item.tiange_gmv !== null ? item.tiange_gmv / 100 : '--');
          competitive_data.push(item.competitive_gmv !== null ? item.competitive_gmv / 100 : '--');
          if (item.increase_balance > 0) {
            moreDay++;
            heightList.value.push(item);
            if (maxHeightItem === null) maxHeightItem = item;
            if (item.increase_balance > maxHeightItem.increase_balance) maxHeightItem = item;
            item.tipsCn = `${moment(item.day).format('MM月DD日')}，品牌销售额增幅高于大盘销售额 ${
              item.increase_balance
            }%`;
          } else if (item.increase_balance < 0) {
            lessDay++;
            lowList.value.push(item);
            if (minLowItem === null) minLowItem = item;
            if (item.increase_balance < minLowItem.increase_balance) minLowItem = item;
            item.tipsCn = `${moment(item.day).format(
              'MM月DD日',
            )}，品牌销售额增幅低于大盘销售额 ${Math.abs(item.increase_balance)}%`;
          }
          date.push(item.day.replace(/-/g, '.').substring(5, 10));
        });
        if (maxHeightItem) maxHeightItem.isMax = true;
        if (minLowItem) minLowItem.isMax = true;

        lineData.value.day = res_data.length;
        lineData.value.big = Math.max.apply(null, increase_balance_list);
        lineData.value.mini = Math.min.apply(null, increase_balance_list);
        lineData.value.moreDay = moreDay;
        lineData.value.lessDay = lessDay;

        lineTrend.value = {
          date,
          series: [
            {
              smooth: true,
              showSymbol: true,
              type: 'line',
              name: '品牌销售额',
              data: tiange,
              color: '#59B6DF',
              yAxisIndex: 0,
            },
            {
              smooth: true,
              showSymbol: true,
              type: 'line',
              name: '大盘销售额',
              data: competitive,
              color: '#FF9C69',
              yAxisIndex: 0,
            },
            {
              smooth: false,
              showSymbol: false,
              name: '品牌对比涨幅',
              type: 'line',
              itemStyle: {
                opacity: 0,
              },
              lineStyle: {
                opacity: 0,
              },
              yAxisIndex: 0,
              data: increase_balance_list,
            },
            {
              name: '品牌销售额_data',
              smooth: false,
              showSymbol: false,
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {
                opacity: 0,
              },
              lineStyle: {
                opacity: 0,
              },
              data: tiange_data,
            },
            {
              name: '大盘销售额_data',
              yAxisIndex: 1,
              smooth: false,
              showSymbol: false,
              type: 'line',
              itemStyle: {
                opacity: 0,
              },
              lineStyle: {
                opacity: 0,
              },
              data: competitive_data,
            },
          ],
          loading: false,
        };
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    const catId = ref(0);
    const salesVisible = ref<boolean>(false);
    const saleAnalysisClick = (row: any) => {
      catId.value = row.id;
      salesVisible.value = true;
      getTimeLine({ ...searchParams.value, tiange_cat_id: catId.value });
    };
    const onSalesClose = () => {
      salesVisible.value = false;
    };
    const onRowClick = (row: any) => {
      if (row.second_tiange_cat_id) {
        ctx.root.$router.push({
          name: RouterDataCenter.commodityAnalysisDetail,
          query: {
            project_name: searchProjectName.value,
            project_id: searchParams.value.project_id,
            end_date: searchParams.value.end_date,
            start_date: searchParams.value.start_date,
            first_tiange_cat_id: firstActive.value,
            second_tiange_cat_id: row.second_tiange_cat_id,
            third_tiange_cat_id: row.third_tiange_cat_id,
          },
        });
      } else {
        ctx.root.$router.push({
          name: RouterDataCenter.commodityAnalysisDetail,
          query: {
            project_name: searchProjectName.value,
            project_id: searchParams.value.project_id,
            end_date: searchParams.value.end_date,
            start_date: searchParams.value.start_date,
            first_tiange_cat_id: firstActive.value,
            second_tiange_cat_id: row.id,
          },
        });
      }
    };

    const sortChange = ({ order, prop }: { order: string | null; prop: string }) => {
      let sort = '';
      if (order === 'descending') {
        sort = `${prop}_desc`;
      } else if (order === 'ascending') {
        sort = `${prop}`;
      }
      sortVal.value = sort;
      getDouyinCategoryReport({
        ...searchParams.value,
        category_id: firstActive.value,
        sort,
      });
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
      const columns = [
        'item_count',
        'shop_sale_count',
        'shop_gmv',
        'shop_sale_price_avg',
        'shop_gmv_rate',
        'shop_refund_status21_gmv',
        'shop_refund_status21_gmv_rate',
        'last_week_shop_sale_count',
        'last_week_shop_gmv',
        'last_week_shop_sale_price_avg',
        'shop_sale_count_rate',
        'shop_sale_gmv_rate',
        'shop_sale_price_avg_rate',
        'total_shop_sale_count',
        'total_shop_gmv',
        'sale_count',
        'gmv',
        'gmv_rate',
        'last_week_sale_count',
        'last_week_gmv',
        'sale_count_rate',
        'sale_gmv_rate',
        'click_rate',
        'pay_rate',
      ];
      const result: Record<string, any> = {
        category_name: '全部',
        third_tiange_cat_name: '合计',
        isSum: true,
      };
      columns.map((item: any) => {
        if (summariesData.value === undefined) return '--';
        result[item] = summariesData.value['all_' + item];
        if (result[item] === undefined) {
          result[item] = null;
        }
      });
      return result;
    };

    const exportBtnClick = () => {
      const param = {
        ...searchParams.value,
        category_id: firstActive.value,
        sort: sortVal.value,
      };
      ExportDouyinCategoryReport(param);
    };
    const getRowKey = (row: any) => {
      if (row.children !== undefined) return row.id + 'only';
      return row.id;
    };
    return {
      sortChange,
      loading,
      onRowClick,
      onTopCardRectUpdate,
      heightList,
      lowList,
      onSalesClose,
      salesVisible,
      firstCategory,
      firstActive,
      saleAnalysisClick,
      list,
      showSort,
      formatPriceFormYuan,
      numberFormat,
      get_folded_text,
      changeFirst,
      catId,
      lineTrend,
      lineData,
      rowHightlight,
      getSummaries,
      exportBtnClick,
      getRowKey,
    };
  }),
});
