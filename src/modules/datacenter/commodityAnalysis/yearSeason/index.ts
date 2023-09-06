import {
  computed,
  defineComponent,
  ref,
  watch,
  onBeforeMount,
  onMounted,
  inject,
  onActivated,
} from '@vue/composition-api';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { ITabProps, YearAndSeasonList } from '@/modules/datacenter/commodityAnalysis/types';
import {
  GetCommodityYearList,
  GetCommoditySeasonList,
  GetQueryDouyinReportProjects,
} from '@/services/datacenter';
import { wait } from '@/utils/func';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
const { formatPriceFormYuan } = formatPriceForm;
import { ProjectStatusEnum } from '@/types/tiange/common';
import moment from 'moment';
import qs from 'query-string';
import { getToken } from '@/utils/token';

export default defineComponent({
  name: 'TgDataCenterCommodityTimer',
  setup(_, ctx) {
    const routes = [
      {
        name: RouterDataCenter.commodityAnalysis,
        title: '品牌商品分析',
      },
      {
        path: '',
        title: '年度季节分析',
      },
    ];
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
    const loading = ref(false);
    const timeType = ref('season');
    const preWeek = moment().weekday(-7);
    const queryForm = ref({
      project_id: undefined as number | string | undefined,
      project_name: undefined as string | undefined,
      start_date: preWeek.startOf('week').format('YYYY-MM-DD'),
      end_date: preWeek.endOf('week').format('YYYY-MM-DD'),
      date_type: 1,
      date: preWeek.startOf('week').format('YYYY-MM-DD'),
    });
    const updateRouterParams = () => {
      const router = useRouter();
      const { project_id, project_name } = router.currentRoute.query;
      queryForm.value.project_id = project_id ? Number(project_id) : undefined;
      queryForm.value.project_name = project_name as string | undefined;
    };
    updateRouterParams();
    const listYear = ref<YearAndSeasonList[]>([]);
    const listSeason = ref<YearAndSeasonList[]>([]);
    const empty_text = ref('');
    const getYearList = async (payload: ITabProps) => {
      loading.value = true;
      empty_text.value = '';
      const [{ data: response }] = await wait(500, GetCommodityYearList(payload));
      loading.value = false;
      if (response.success) {
        if (response.data === null) {
          empty_text.value = '请先设置年度季节分析规则';
          listYear.value = [];
        } else {
          const list = response.data.reports;
          if (list.length > 0) {
            list.unshift({
              id: 0,
              year: '合计',
              season: '小计',
              shop_gmv_pie:
                response.data.total.shop_gmv_pie || response.data.total.total_shop_gmv_pie || null,
              gmv: response.data.total.total_gmv,
              item_count: response.data.total.total_item_count,
              sale_count: response.data.total.total_sale_count,
              shop_gmv: response.data.total.total_shop_gmv,
              shop_gmv_rate: response.data.total.total_shop_gmv_rate,
              shop_sale_count: response.data.total.total_shop_sale_count,
              stock_num: response.data.total.total_stock_num,
              stock_products_worth: response.data.total.total_stock_products_worth,
              stock_products_worth_pie:
                response.data.total.stock_products_worth_pie ||
                response.data.total.total_stock_products_worth_pie,
            });
          }
          listYear.value = list;
        }
      } else {
        listYear.value = [];
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    const getSeasonList = async (payload: ITabProps) => {
      loading.value = true;
      empty_text.value = '';
      const [{ data: response }] = await wait(500, GetCommoditySeasonList(payload));
      loading.value = false;
      if (response.success) {
        if (response.data === null) {
          empty_text.value = '请先设置年度季节分析规则';
          listSeason.value = [];
        } else {
          const list = response.data.reports;
          if (list.length > 0) {
            list.unshift({
              id: 0,
              year: '小计',
              season: '合计',
              shop_gmv_pie:
                response.data.total.shop_gmv_pie || response.data.total.total_shop_gmv_pie || null,
              gmv: response.data.total.total_gmv,
              item_count: response.data.total.total_item_count,
              sale_count: response.data.total.total_sale_count,
              shop_gmv: response.data.total.total_shop_gmv,
              shop_gmv_rate: response.data.total.total_shop_gmv_rate,
              shop_sale_count: response.data.total.total_shop_sale_count,
              stock_num: response.data.total.total_stock_num,
              stock_products_worth: response.data.total.total_stock_products_worth,
              stock_products_worth_pie:
                response.data.total.stock_products_worth_pie ||
                response.data.total.total_stock_products_worth_pie,
            });
          }
          listSeason.value = list;
        }
      } else {
        listSeason.value = [];
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    onBeforeMount(() => {
      getSeasonList(queryForm.value);
    });
    const onQueryClick = () => {
      if (timeType.value === 'season') {
        getSeasonList(queryForm.value);
      } else {
        getYearList(queryForm.value);
      }
    };
    onQueryClick();
    watch(
      () => timeType.value,
      val => {
        if (val === 'season') {
          getSeasonList(queryForm.value);
        } else {
          getYearList(queryForm.value);
        }
      },
      {
        deep: true,
      },
    );
    const onRowClick = (row: any) => {
      if (timeType.value === 'season') {
        ctx.root.$router.push({
          name: RouterDataCenter.commodityAnalysisDetail,
          query: {
            project_name: String(queryForm.value.project_name),
            project_id: String(queryForm.value.project_id),
            end_date: String(queryForm.value.end_date),
            start_date: String(queryForm.value.start_date),
            year: row.year ? row.year : undefined,
            season: row.season,
            type: timeType.value,
          },
          params: {
            fromType: '1',
          },
        });
      } else {
        ctx.root.$router.push({
          name: RouterDataCenter.commodityAnalysisDetail,
          query: {
            project_name: String(queryForm.value.project_name),
            project_id: String(queryForm.value.project_id),
            end_date: String(queryForm.value.end_date),
            start_date: String(queryForm.value.start_date),
            year: row.year,
            season: row.season ? row.season : undefined,
            type: timeType.value,
          },
        });
      }
    };
    const rowHightlightSeason = ({ row }: { row: any }) => {
      let styleJson = {};
      if (row.year === '小计') {
        styleJson = { 'background-color': 'var(--table-striped-bg-color)' };
      }
      if (row.season === '合计') {
        styleJson = { 'background-color': 'rgb(233, 233, 233) !important', 'font-weight': 600 };
      }
      //  rgb(233, 233, 233) !important
      return styleJson;
    };

    const rowHightlightYear = ({ row }: { row: any }) => {
      let styleJson = {};
      if (row.season === '小计') {
        styleJson = { 'background-color': 'var(--table-striped-bg-color)' };
      }
      if (row.year === '合计') {
        styleJson = { 'background-color': 'rgb(233, 233, 233) !important', 'font-weight': 600 };
      }
      return styleJson;
    };
    const project_list = ref<
      { project_id: string; project_name: string; project_status: number; new_report: boolean }[]
    >([]);
    const queryData = () => {
      return GetQueryDouyinReportProjects().then(res => {
        project_list.value = res.data.data.projects;
        return res.data.data;
      });
    };
    onMounted(() => {
      queryData().then(() => {});
    });
    onActivated(() => {
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    });
    const methods = {
      getAccess() {
        project_list.value.map((item: any) => {
          if (item.project_id === queryForm.value.project_id) {
            queryForm.value.project_name = item.project_name;
          }
        });
        /*if (timeType.value === 'season') {
          getSeasonList(queryForm.value);
        } else {
          getYearList(queryForm.value);
        }*/
      },
    };
    const pickerWeekOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() >
            new Date(
              `${moment().weekday(1).endOf('week').format('YYYY/MM/DD')} 00:00:01`,
            ).getTime() || time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
      firstDayOfWeek: 1,
    };
    const pickerMonthOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() >
            new Date(
              `${moment().subtract(0, 'month').endOf('month').format('YYYY/MM/DD')} 00:00:01`,
            ).getTime() || time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
      firstDayOfWeek: 1,
    };
    const pickerDayOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() >
            new Date(`${moment().add(-1, 'day').format('YYYY/MM/DD')} 00:00:01`).getTime() ||
          time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
      firstDayOfWeek: 1,
    };
    const timeChange = () => {
      if (queryForm.value.date_type === 1) {
        let startDate = moment(queryForm.value.date);
        if (startDate > moment().weekday(1).endOf('week')) {
          startDate = moment().weekday(-7);
        }
        queryForm.value.date = startDate.startOf('week').format('YYYY-MM-DD');
        queryForm.value.start_date = startDate.startOf('week').format('YYYY-MM-DD');
        queryForm.value.end_date = startDate.endOf('week').format('YYYY-MM-DD');
      } else if (queryForm.value.date_type === 2) {
        let startDate = moment(queryForm.value.date);
        if (startDate > moment().subtract(0, 'month').endOf('month')) {
          startDate = moment().subtract(1, 'month').endOf('month');
        }
        queryForm.value.date = startDate.startOf('month').format('YYYY-MM-DD');
        queryForm.value.start_date = startDate.startOf('month').format('YYYY-MM-DD');
        queryForm.value.end_date = startDate.endOf('month').format('YYYY-MM-DD');
      } else {
        const startDate = moment(queryForm.value.date);
        queryForm.value.date = startDate.format('YYYY-MM-DD');
        queryForm.value.start_date = startDate.format('YYYY-MM-DD');
        queryForm.value.end_date = startDate.format('YYYY-MM-DD');
      }
    };
    const onExportExcel = async () => {
      const payload = {
        project_id: queryForm.value.project_id,
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
        sort: timeType.value || '',
      };
      const _paramsstr = qs.stringify({ ...payload });
      const token = getToken();
      const url = '/api/shop_live/export_douyin_season_year_report';
      window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
    };
    return {
      onExportExcel,
      empty_text,
      onQueryClick,
      timeChange,
      pickerDayOptions,
      pickerWeekOptions,
      pickerMonthOptions,
      ProjectStatusEnum,
      ...methods,
      queryForm,
      project_list,
      listYear,
      listSeason,
      timeType,
      loading,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      formatPriceFormYuan,
      numberFormat,
      onRowClick,
      rowHightlightSeason,
      rowHightlightYear,
    };
  },
});
