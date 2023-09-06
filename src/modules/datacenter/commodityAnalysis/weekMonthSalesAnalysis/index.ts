import {
  computed,
  defineComponent,
  h,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  SetupContext,
  watch,
  provide,
} from '@vue/composition-api';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import {
  GetQueryDouyinReportProjects,
  GetSystemFirstCategory,
  GetWeekMonthHotStyleEveryWeek,
  GetWeekMonthNewShopList,
  GetWeekMonthPriceList,
  GetWeekMonthRefundCategory,
  GetWeekMonthTargetCompleteAchievement,
  GetWeekMonthTopStock,
  PostWeekMonthExportExcel,
} from '@/services/datacenter';
import { ProjectStatusEnum } from '@/types/tiange/common';
import { RouterDataCenter } from '@/const/router';
import { TgTableColumn } from '@/types/vendor/column';
/*import emptyGoods from '@/assets/img/goods-empty.png';
import reXiaoImg from '@/assets/img/icon-rexiao.png';*/
import { ITabProps, IThirdCategory } from '@/modules/datacenter/commodityAnalysis/types';
import { wait } from '@/utils/func';
import weekMonthTopCompare from '../components/weekMonthTopCompare/index';
import {
  IWeekMonthNewShopRow,
  IWeekMonthPriceRow,
  IWeekMonthTargetCompleteRow,
  IWeekMonthTopStockRow,
} from './types';
import formatPriceForm from '@/utils/formatData';
import { Confirm } from '@/use/asyncConfirm';
import { numberFormat } from '@/utils/formatMoney';
import defaultImage from '@/assets/img/goods-empty.png';
import ImageViewer from '@/components/Image/ImageViewer';

const { formatPriceFormYuan } = formatPriceForm;
const getMoney = (value: any, isHasSymbol = true, divisor = 100, fixed = 2) => {
  if (value) {
    return value !== null
      ? formatPriceFormYuan(value === 0 ? 0 : value / divisor, fixed, isHasSymbol)
      : '--';
  }
  return '--';
};
const routes = [
  {
    name: RouterDataCenter.commodityAnalysis,
    title: '品牌商品分析',
  },
  {
    path: '',
    title: '日/周/月销售分析',
  },
];
type Col = TgTableColumn<{ dataType?: any } & any>;
const useTopData = (ctx: SetupContext<{}>) => {
  const sortHot = ref('shop_sale_count_desc');
  const sortTop = ref('shop_sale_count_desc');
  const sortOptions = [
    {
      label: '销量',
      value: 'shop_sale_count_desc',
    },
    {
      label: '销售额',
      value: 'shop_gmv_desc',
    },
  ];
  const topDayColumns = ref<Col[]>([
    {
      label: '排名分类',
      minWidth: 102,
      align: 'left',
      prop: 'name',
      fixed: 'left',
    },

    {
      label: '款数',
      align: 'right',
      headerAlign: 'center',
      prop: 'sku_number',
      minWidth: 62,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.sku_number !== null
          ? numberFormat(Number(row.sku_number || 0), 0, '.', ',')
          : '--';
      },
    },
    {
      label: '日销量',
      align: 'right',
      headerAlign: 'center',
      prop: 'sale',
      minWidth: 92,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.sale !== null ? numberFormat(Number(row.sale || 0), 0, '.', ',') : '--';
      },
    },
    {
      label: '款均销量',
      align: 'right',
      prop: 'average_sale',
      minWidth: 80,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.average_sale !== null
          ? numberFormat(Number(row.average_sale || 0), 2, '.', ',')
          : '--';
      },
    },
    {
      label: '平均件单价',
      prop: 'average_sale_price',
      minWidth: 120,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.average_sale_price, true);
      },
    },
    {
      label: '日销售额',
      prop: 'gmv',
      minWidth: 100,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.gmv, true);
      },
    },
    {
      label: '销售额占比',
      prop: 'gmv_percent',
      align: 'right',
      headerAlign: 'center',
      minWidth: 90,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.gmv_percent !== null ? (row.gmv_percent || 0) + '%' : '--';
      },
    },
    {
      label: '现有库存',
      align: 'right',
      prop: 'stock',
      minWidth: 80,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock !== null ? numberFormat(Number(row.stock || 0), 0, '.', ',') : '--';
      },
    },
    {
      label: '库存可销日',
      align: 'right',
      prop: 'stock_times',
      minWidth: 90,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock_times !== null
          ? numberFormat(Number(row.stock_times || 0), 2, '.', ',')
          : '--';
      },
    },
    {
      label: '库存占比',
      prop: 'stock_percent',
      align: 'right',
      headerAlign: 'center',
      minWidth: 81,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock_percent !== null ? (row.stock_percent || 0) + '%' : '--';
      },
    },
    {
      label: '平均吊牌价',
      prop: 'average_market_price',
      minWidth: 120,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.average_market_price, true);
      },
    },
    {
      label: '折扣率',
      prop: 'discount',
      align: 'right',
      headerAlign: 'center',
      minWidth: 80,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.discount !== null ? (row.discount || 0) + '%' : '--';
      },
    },
  ]);
  const topColumns = ref<Col[]>([
    {
      label: '排名分类',
      minWidth: 102,
      align: 'left',
      prop: 'name',
      fixed: 'left',
    },

    {
      label: '款数',
      align: 'right',
      headerAlign: 'center',
      prop: 'sku_number',
      minWidth: 62,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.sku_number !== null
          ? numberFormat(Number(row.sku_number || 0), 0, '.', ',')
          : '--';
      },
    },
    {
      label: '周销量',
      align: 'right',
      headerAlign: 'center',
      prop: 'sale',
      minWidth: 92,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.sale !== null ? numberFormat(Number(row.sale || 0), 0, '.', ',') : '--';
      },
    },
    {
      label: '款均销量',
      align: 'right',
      prop: 'average_sale',
      minWidth: 80,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.average_sale !== null
          ? numberFormat(Number(row.average_sale || 0), 2, '.', ',')
          : '--';
      },
    },
    {
      label: '平均件单价',
      prop: 'average_sale_price',
      minWidth: 120,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.average_sale_price, true);
      },
    },
    {
      label: '周销售额',
      prop: 'gmv',
      minWidth: 100,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.gmv, true);
      },
    },
    {
      label: '销售额占比',
      prop: 'gmv_percent',
      align: 'right',
      headerAlign: 'center',
      minWidth: 90,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.gmv_percent !== null ? (row.gmv_percent || 0) + '%' : '--';
      },
    },
    {
      label: '现有库存',
      align: 'right',
      prop: 'stock',
      minWidth: 80,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock !== null ? numberFormat(Number(row.stock || 0), 0, '.', ',') : '--';
      },
    },
    {
      label: '库存可销周',
      align: 'right',
      prop: 'stock_times',
      minWidth: 90,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock_times !== null
          ? numberFormat(Number(row.stock_times || 0), 2, '.', ',')
          : '--';
      },
    },
    {
      label: '库存占比',
      prop: 'stock_percent',
      align: 'right',
      headerAlign: 'center',
      minWidth: 81,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock_percent !== null ? (row.stock_percent || 0) + '%' : '--';
      },
    },
    {
      label: '平均吊牌价',
      prop: 'average_market_price',
      minWidth: 120,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.average_market_price, true);
      },
    },
    {
      label: '折扣率',
      prop: 'discount',
      align: 'right',
      headerAlign: 'center',
      minWidth: 80,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.discount !== null ? (row.discount || 0) + '%' : '--';
      },
    },
  ]);
  const topMonthColumns = ref<Col[]>([
    {
      label: '排名分类',
      minWidth: 102,
      align: 'left',
      prop: 'name',
      fixed: 'left',
    },

    {
      label: '款数',
      align: 'right',
      headerAlign: 'center',
      prop: 'sku_number',
      minWidth: 62,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.sku_number !== null
          ? numberFormat(Number(row.sku_number || 0), 0, '.', ',')
          : '--';
      },
    },
    {
      label: '月销量',
      align: 'right',
      headerAlign: 'center',
      prop: 'sale',
      minWidth: 92,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.sale !== null ? numberFormat(Number(row.sale || 0), 0, '.', ',') : '--';
      },
    },
    {
      label: '款均销量',
      align: 'right',
      prop: 'average_sale',
      minWidth: 80,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.average_sale !== null
          ? numberFormat(Number(row.average_sale || 0), 2, '.', ',')
          : '--';
      },
    },
    {
      label: '平均件单价',
      prop: 'average_sale_price',
      minWidth: 120,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.average_sale_price, true);
      },
    },
    {
      label: '月销售额',
      prop: 'gmv',
      minWidth: 100,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.gmv, true);
      },
    },
    {
      label: '销售额占比',
      prop: 'gmv_percent',
      align: 'right',
      headerAlign: 'center',
      minWidth: 90,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.gmv_percent !== null ? (row.gmv_percent || 0) + '%' : '--';
      },
    },
    {
      label: '现有库存',
      align: 'right',
      prop: 'stock',
      minWidth: 80,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock !== null ? numberFormat(Number(row.stock || 0), 0, '.', ',') : '--';
      },
    },
    {
      label: '库存可销月',
      align: 'right',
      prop: 'stock_times',
      minWidth: 90,
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock_times !== null
          ? numberFormat(Number(row.stock_times || 0), 2, '.', ',')
          : '--';
      },
    },
    {
      label: '库存占比',
      prop: 'stock_percent',
      align: 'right',
      headerAlign: 'center',
      minWidth: 81,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.stock_percent !== null ? (row.stock_percent || 0) + '%' : '--';
      },
    },
    {
      label: '平均吊牌价',
      prop: 'average_market_price',
      minWidth: 120,
      align: 'right',
      headerAlign: 'center',
      formatter: (row: IWeekMonthPriceRow) => {
        return getMoney(row.average_market_price, true);
      },
    },
    {
      label: '折扣率',
      prop: 'discount',
      align: 'right',
      headerAlign: 'center',
      minWidth: 80,
      formatter: (row: IWeekMonthPriceRow) => {
        return row.discount !== null ? (row.discount || 0) + '%' : '--';
      },
    },
  ]);
  const changeSort = (value: string) => {
    sortTop.value = value;
  };
  const changeWeekSort = (value: string) => {
    sortHot.value = value;
  };
  const cateList = ref<IThirdCategory[]>([]);
  const firstActive = ref<number | undefined>(undefined);
  const getFirstCategory = async (params: ITabProps) => {
    const [{ data: response }] = await wait(500, GetSystemFirstCategory(params));
    if (response.success) {
      cateList.value = response.data;
      if (response.data.length > 0) {
        firstActive.value = cateList.value[0].id;
      }
    } else {
      cateList.value = [];
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  return reactive({
    getFirstCategory,
    cateList,
    firstActive,
    sortOptions,
    sortHot,
    sortTop,
    topColumns,
    topDayColumns,
    topMonthColumns,
    changeSort,
    changeWeekSort,
  });
};
export default defineComponent({
  name: 'TgDataCenterCommodityWeekMonthAnalysis',
  components: {
    weekMonthTopCompare,
  },
  props: {
    // 项目管理/项目详情/运营数据/货盘分析用到
    isFromGoodsAnalysis: {
      type: Boolean,
      default: false,
    },
    extendsData: {
      type: Object,
    },
  },
  setup(_, ctx) {
    if (!_.isFromGoodsAnalysis) {
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
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
    const preWeek = moment().weekday(0);
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
      const { project_id, project_name } = _.extendsData || router.currentRoute.query;
      console.log('project_id', project_id, project_name);

      queryForm.value.project_id = project_id ? Number(project_id) : undefined;
      queryForm.value.project_name = project_name as string | undefined;
    };
    updateRouterParams();
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
    const methods = {
      getAccess() {
        project_list.value.map((item: any) => {
          if (item.project_id === queryForm.value.project_id) {
            queryForm.value.project_name = item.project_name;
          }
        });
      },
    };
    const pickerWeekOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() >
            new Date(
              `${moment().weekday(6).endOf('week').format('YYYY/MM/DD')} 00:00:01`,
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
            new Date(`${moment().add(0, 'day').format('YYYY/MM/DD')} 00:00:01`).getTime() ||
          time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
      firstDayOfWeek: 1,
    };
    const typeChange = () => {
      const dateType = queryForm.value.date_type;
      let startDate;

      switch (dateType) {
        case 1:
          startDate = moment().endOf('week');
          break;
        case 2:
          startDate = moment().endOf('month');
          break;
        default:
          startDate = moment().subtract(1, 'day');
          queryForm.value.date = startDate.format('YYYY-MM-DD');
          queryForm.value.start_date = startDate.format('YYYY-MM-DD');
          queryForm.value.end_date = startDate.format('YYYY-MM-DD');
          return;
      }

      // queryForm.value.date = startDate.format('YYYY-MM-DD');
      queryForm.value.start_date = startDate
        .clone()
        .startOf(dateType === 1 ? 'week' : 'month')
        .format('YYYY-MM-DD');
      queryForm.value.end_date = startDate.format('YYYY-MM-DD');
    };

    const timeChange = () => {
      if (queryForm.value.date_type === 1) {
        let startDate = moment(queryForm.value.date);
        // console.log(startDate, moment().weekday(-1).endOf('week'));

        if (startDate > moment().weekday(1).endOf('week')) {
          startDate = moment().weekday(-7).endOf('week');
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
        // 默认展示昨天的数据
        queryForm.value.date = startDate.format('YYYY-MM-DD');
        queryForm.value.start_date = startDate.format('YYYY-MM-DD');
        queryForm.value.end_date = startDate.format('YYYY-MM-DD');
      }
    };

    const tableTargetCompleteData = ref<IWeekMonthTargetCompleteRow[]>([]);
    const targetCompleteColumns = (index: number) => {
      return [
        {
          label: '时间',
          minWidth: 100,
          prop: 'title_name',
          fixed: 'left',
          align: 'center',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.title_name || '--';
          },
        },
        {
          label: '销售额目标',
          minWidth: 160,
          prop: 'goal_gmv',
          align: 'right',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.goal_gmv !== null
              ? formatPriceFormYuan((row.goal_gmv || 0) / 100, 2, true)
              : '--';
          },
        },
        {
          label: '销售额达成',
          minWidth: 160,
          prop: 'gmv',
          align: 'right',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.gmv !== null ? formatPriceFormYuan((row.gmv || 0) / 100, 2, true) : '--';
          },
        },
        {
          label: '销售额达成率',
          minWidth: 160,
          prop: 'gmv_percent',
          align: 'right',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.gmv_percent !== null ? (row.gmv_percent || 0) + '%' : '--';
          },
        },
        {
          label: '净销额目标',
          minWidth: 160,
          prop: 'goal_net_gmv',
          align: 'right',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.goal_net_gmv !== null
              ? formatPriceFormYuan((row.goal_net_gmv || 0) / 100, 2, true)
              : '--';
          },
        },
        {
          label: '净销额达成',
          minWidth: 160,
          prop: 'net_gmv',
          align: 'right',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.net_gmv !== null
              ? formatPriceFormYuan((row.net_gmv || 0) / 100, 2, true)
              : '--';
          },
        },
        {
          label: '净销额达成率',
          minWidth: 160,
          prop: 'net_gmv_percent',
          align: 'right',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.net_gmv_percent !== null ? (row.net_gmv_percent || 0) + '%' : '--';
          },
        },
        {
          label: '时间进度',
          minWidth: 160,
          prop: 'schedule',
          align: 'right',
          formatter: (row: IWeekMonthTargetCompleteRow) => {
            return row.schedule !== null ? (row.schedule || 0) + '%' : '/';
          },
        },
      ];
    };

    const targetTimeColumns = (index: number) => {
      return [
        {
          label: '时间',
          minWidth: 180,
          prop: 'week_index',
          align: 'center',
          formatter: (row: any) => {
            return h('div', { class: 'shop-box' }, [
              h('div', { class: 'pic-box' }, '第' + row.week_index + '周'),
              h(
                'div',
                { class: 'pic-box' },
                '(' +
                  row.start_date.replace(/-/g, '.') +
                  ' - ' +
                  row.end_date.replace(/-/g, '.') +
                  ')',
              ),
            ]);
          },
        },
        {
          label: '时间',
          minWidth: 100,
          prop: 'sub_name',
          align: 'center',
          formatter: (row: any) => {
            return row.sub_name;
          },
        },
        {
          label: '周一',
          minWidth: 100,
          prop: 'one',
          align: 'right',
          formatter: (row: any) => {
            return row.one;
          },
        },
        {
          label: '周二',
          minWidth: 100,
          align: 'right',
          formatter: (row: any) => {
            return row.two;
          },
        },
        {
          label: '周三',
          minWidth: 100,
          align: 'right',
          formatter: (row: any) => {
            return row.three;
          },
        },
        {
          label: '周四',
          minWidth: 100,
          align: 'right',
          formatter: (row: any) => {
            return row.four;
          },
        },
        {
          label: '周五',
          minWidth: 100,
          align: 'right',
          formatter: (row: any) => {
            return row.five;
          },
        },
        {
          label: '周六',
          minWidth: 100,
          align: 'right',
          formatter: (row: any) => {
            return row.six;
          },
        },
        {
          label: '周日',
          minWidth: 100,
          align: 'right',
          formatter: (row: any) => {
            return row.seven;
          },
        },
        {
          label: '合计',
          minWidth: 150,
          fixed: 'right',
          align: 'right',
          formatter: (row: any) => {
            return row.all;
          },
        },
      ];
    };
    //合并单元
    const tableTargetTimeData = ref<any[]>([]);
    const targetLoading = ref(false);
    const getTargetCompleteList = async () => {
      targetLoading.value = true;
      const payload = {
        project_id: Number(queryForm.value.project_id),
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
      };
      const [{ data: response }] = await wait(
        500,
        GetWeekMonthTargetCompleteAchievement(payload, queryForm.value.date_type === 2),
      );
      targetLoading.value = false;
      if (response.success) {
        tableTargetCompleteData.value = [
          { ...response.data.year, title_name: response.data.year.name + '年' },
          { ...response.data.month, title_name: response.data.month.name + '月' },
        ];
        if (queryForm.value.date_type === 1) {
          tableTargetCompleteData.value.push({
            ...response.data.week,
            title_name: '第' + response.data.week.name + '周',
          });

          const arr = (response.data.simple || []).map((item: any) => {
            const week = item.data || [];
            return {
              ...item,
              sub_name: '销售额达成',
              one: week.length > 0 ? getMoney(week[0], true) : '',
              two: week.length > 1 ? getMoney(week[1], true) : '',
              three: week.length > 2 ? getMoney(week[2], true) : '',
              four: week.length > 3 ? getMoney(week[3], true) : '',
              five: week.length > 4 ? getMoney(week[4], true) : '',
              six: week.length > 5 ? getMoney(week[5], true) : '',
              seven: week.length > 6 ? getMoney(week[6], true) : '',
              all: week.length > 7 ? getMoney(week[7], true) : '',
            };
          });
          const getTimeValue = (week: any[], arr_index: number, index: number) => {
            return week.length > arr_index
              ? index === 0
                ? getMoney(week[arr_index].goal_gmv, true)
                : index === 1
                ? getMoney(week[arr_index].gmv, true)
                : index === 2
                ? week[arr_index].gmv_percent
                  ? week[arr_index].gmv_percent + '%'
                  : '--'
                : index === 3
                ? week[arr_index].gmv_rate
                  ? week[arr_index].gmv_rate + '%'
                  : '--'
                : ''
              : '';
          };
          const detail_arr = ['销售额目标', '销售额达成', '销售额达成率', '销售额环比'].map(
            (item: string, index: number) => {
              const week = response.data.detail;
              return {
                end_date: queryForm.value.end_date,
                start_date: queryForm.value.start_date,
                week_index: moment(queryForm.value.end_date).week(),
                sub_name: item,
                one: getTimeValue(week, 0, index),
                two: getTimeValue(week, 1, index),
                three: getTimeValue(week, 2, index),
                four: getTimeValue(week, 3, index),
                five: getTimeValue(week, 4, index),
                six: getTimeValue(week, 5, index),
                seven: getTimeValue(week, 6, index),
                all: getTimeValue(week, 7, index),
              };
            },
          );
          tableTargetTimeData.value = [...arr, ...detail_arr];
          getSpanArr();
        }
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    // 合并表头
    const setHeader = ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: any;
      column: any;
      rowIndex: number;
      columnIndex: number;
    }) => {
      if (rowIndex === 0) {
        row[0].colSpan = 0;
        row[1].colSpan = 2;
        if (columnIndex === 0) {
          return { display: 'none' };
        }
      }
    };

    let spanFirstColumnArr = [] as any[];
    let spanSecondColumnArr = [] as any[];
    let firstPos = 0;
    let secondPos = 0;
    // 因为要合并的行数是不固定的，此函数是实现合并随意行数的功能
    const getSpanArr = () => {
      const data = tableTargetTimeData.value;
      spanFirstColumnArr = [];
      spanSecondColumnArr = [];
      firstPos = 0;
      secondPos = 0;
      for (let i = 0; i < data.length; i++) {
        data[i].rank = i + 1;
        if (i === 0) {
          // 如果是第一条记录（即索引是0的时候），向数组中加入１
          spanFirstColumnArr.push(1);
          spanSecondColumnArr.push(1);
          firstPos = 0;
          secondPos = 0;
          data[i].myRowIndex = 1;
          data[i].mySecondRowIndex = 1;
        } else {
          if (data[i].week_index === data[i - 1].week_index) {
            // 如果itemCode相等就累加，并且push 0
            data[i].myRowIndex = data[i - 1].myRowIndex;
            spanFirstColumnArr[firstPos] += 1;
            spanFirstColumnArr.push(0);
          } else {
            // 不相等push 1
            data[i].myRowIndex = data[i - 1].myRowIndex + 1;
            spanFirstColumnArr.push(1);
            firstPos = i;
          }
          if (data[i].sub_name === data[i - 1].sub_name) {
            // 如果itemCode相等就累加，并且push 0
            data[i].mySecondRowIndex = data[i - 1].mySecondRowIndex;
            spanSecondColumnArr[secondPos] += 1;
            spanSecondColumnArr.push(0);
          } else {
            // 不相等push 1
            data[i].mySecondRowIndex = data[i - 1].mySecondRowIndex + 1;
            spanSecondColumnArr.push(1);
            secondPos = i;
          }
        }
      }
    };
    getSpanArr();
    const objectSpanMethod = ({
      row,
      column,
      rowIndex,
      columnIndex,
    }: {
      row: any;
      column: any;
      rowIndex: number;
      columnIndex: number;
    }) => {
      // columnIndex === xx 找到第xx列，实现合并随机出现的行数
      if (columnIndex === 0) {
        const _row = spanFirstColumnArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      } else if (columnIndex === 1) {
        const _row = spanSecondColumnArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    };
    //top占比
    const topData = useTopData(ctx);
    const topTable = ref<IWeekMonthTopStockRow[]>([]);
    const topLoading = ref(false);
    const getTopDataList = async () => {
      topLoading.value = true;
      const payload = {
        project_id: Number(queryForm.value.project_id),
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
        sort_by: topData.sortTop === 'shop_gmv_desc' ? 1 : 2,
      };
      const [{ data: response }] = await wait(500, GetWeekMonthTopStock(payload));
      topLoading.value = false;
      if (response.success) {
        topTable.value = response.data.data;
        topTable.value.push(response.data.total);
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    //退货分析
    const newRefundList = ref([]);
    const newRefundTotal = ref<any>(undefined);
    const refundLoading = ref(false);
    const sellTableData = ref<any>();
    const getRefundList = async () => {
      refundLoading.value = true;
      const payload = {
        project_id: Number(queryForm.value.project_id),
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
        first_cat_id: topData.firstActive || undefined,
      };
      const [{ data: response }] = await wait(500, GetWeekMonthRefundCategory(payload));
      refundLoading.value = false;
      if (response.success) {
        newRefundList.value = response.data.category;
        newRefundTotal.value = response.data.total;
        nextTick(() => {
          sellTableData.value?.doLayout();
        });
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    const getRefundSummaries = (param: any) => {
      const { columns } = param;
      const sums: string[] = [];
      columns.forEach((column: any, index: number) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (newRefundTotal.value) {
          let values = newRefundTotal.value[column.property];
          if (
            column.property === 'gmv' ||
            column.property === 'befor_refund_gmv' ||
            column.property === 'after_refund_gmv' ||
            column.property === 'refund_gmv'
          ) {
            values =
              newRefundTotal.value[column.property] !== null
                ? formatPriceFormYuan(
                    newRefundTotal.value[column.property] === 0
                      ? 0
                      : newRefundTotal.value[column.property] / 100,
                    2,
                    true,
                  )
                : '--';
          }
          if (
            column.property === 'after_refund_percent' ||
            column.property === 'befor_refund_percent' ||
            column.property === 'refund_percent'
          ) {
            values =
              newRefundTotal.value[column.property] !== null
                ? Number(
                    parseInt(String((newRefundTotal.value[column.property] || 0) * 100), 10) / 100,
                  ).toFixed(2) + '%'
                : '--';
          }
          sums[index] = values || '--';
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    };
    //价格带
    const priceList = ref<IWeekMonthPriceRow[]>([]);
    const priceColumns = [
      {
        label: '价格带',
        minWidth: 120,
        align: 'center',
        formatter: (row: IWeekMonthPriceRow) => {
          if (row.min_price && Number(row.min_price) > 900000) {
            return '¥9000以上';
          }
          return '¥' + row.min_price / 100 + ' - ¥' + row.max_price / 100;
        },
      },
      {
        label: '款数',
        minWidth: 120,
        align: 'right',
        formatter: (row: IWeekMonthPriceRow) => {
          return row.sku_number !== null ? row.sku_number || 0 : '--';
        },
      },
      {
        label: '款数占比',
        minWidth: 120,
        align: 'right',
        formatter: (row: IWeekMonthPriceRow) => {
          return row.sku_number_percent !== null ? (row.sku_number_percent || 0) + '%' : '--';
        },
      },
      {
        label: '销量',
        minWidth: 120,
        align: 'right',
        formatter: (row: IWeekMonthPriceRow) => {
          return row.sale !== null ? row.sale || 0 : '--';
        },
      },
      {
        label: '销售额',
        minWidth: 120,
        align: 'right',
        formatter: (row: IWeekMonthPriceRow) => {
          return getMoney(row.gmv, true);
        },
      },
      {
        label: '销量占比',
        minWidth: 120,
        align: 'right',
        formatter: (row: IWeekMonthPriceRow) => {
          return row.sale_percent !== null ? (row.sale_percent || 0) + '%' : '--';
        },
      },
      {
        label: '销售额占比',
        minWidth: 120,
        align: 'right',
        formatter: (row: IWeekMonthPriceRow) => {
          return row.gmv_percent !== null ? (row.gmv_percent || 0) + '%' : '--';
        },
      },
    ];
    const priceLoading = ref(false);
    const getPriceList = async () => {
      priceLoading.value = true;
      const payload = {
        project_id: Number(queryForm.value.project_id),
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
      };
      const [{ data: response }] = await wait(500, GetWeekMonthPriceList(payload));
      priceLoading.value = false;
      if (response.success) {
        priceList.value = response.data;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    //周
    const weekLoading = ref(false);
    const lastWeekNum = ref<string>(moment().weekday(-7).format('WW'));
    const lastLastWeekNum = ref<string>(moment().weekday(-14).format('WW'));
    const lastLastData = ref<any[]>([]);
    const lastData = ref<any[]>([]);
    const getWeekList = async () => {
      weekLoading.value = true;
      const payload = {
        project_id: String(queryForm.value.project_id),
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
        sort_by: topData.sortHot === 'shop_gmv_desc' ? '1' : '2',
      };
      const [{ data: response }] = await wait(500, GetWeekMonthHotStyleEveryWeek(payload));
      weekLoading.value = false;
      if (response.success) {
        lastData.value = (response.data.shop_live_douyin_items ?? []).map(
          (item: any, index: number) => {
            item.rank = index + 1;
            item.title = item.item_sn ? item.title.replace(item.item_sn, '') : item.title;
            return item;
          },
        );
        lastLastData.value = (response.data.last_region_shop_live_douyin_items ?? []).map(
          (item: any, index: number) => {
            item.rank = index + 1;
            item.title = item.item_sn ? item.title.replace(item.item_sn, '') : item.title;
            return item;
          },
        );
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const newShopList = ref<IWeekMonthNewShopRow[]>([]);
    const mergeCells = ref([{ row: 7, col: 0, rowspan: 1, colspan: 10 }]);
    const newShopLoading = ref(false);
    const getNewShopList = async () => {
      newShopLoading.value = true;
      const payload = {
        project_id: Number(queryForm.value.project_id),
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
      };
      const [{ data: response }] = await wait(500, GetWeekMonthNewShopList(payload));
      newShopLoading.value = false;
      if (response.success) {
        newShopList.value = response.data.items.map((item: IWeekMonthNewShopRow) => {
          item.new_sku_sales_ratio = response.data.new_sku_sales_ratio;
          return item;
        });
        mergeCells.value = [{ row: 7, col: 1, rowspan: 1, colspan: newShopList.value.length }];
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    watch(
      [() => topData.sortTop],
      () => {
        getTopDataList();
      },
      {
        deep: true,
      },
    );
    watch(
      [() => topData.sortHot],
      () => {
        getWeekList();
      },
      {
        deep: true,
      },
    );
    watch(
      [() => topData.firstActive],
      () => {
        getRefundList();
      },
      {
        deep: true,
      },
    );
    const query_date_type = ref(queryForm.value.date_type);
    const onQueryClick = async () => {
      getTargetCompleteList();
      getTopDataList();
      getPriceList();
      query_date_type.value = queryForm.value.date_type;
      console.log(query_date_type.value, 'query_date_type.value');

      lastWeekNum.value =
        query_date_type.value === 1
          ? moment(queryForm.value.start_date).weekday(0).format('WW')
          : moment(queryForm.value.start_date).format('MM');
      lastLastWeekNum.value =
        query_date_type.value === 1
          ? moment(queryForm.value.start_date).weekday(-7).format('WW')
          : moment(queryForm.value.start_date).subtract(1, 'months').format('MM');
      getWeekList();
      getNewShopList();
      refundRefresh();
    };
    const refundRefresh = async () => {
      await topData.getFirstCategory(queryForm.value);
      getRefundList();
    };
    const onReQueryClick = () => {
      updateRouterParams();
      queryForm.value.start_date = preWeek.startOf('week').format('YYYY-MM-DD');
      queryForm.value.end_date = preWeek.endOf('week').format('YYYY-MM-DD');
      queryForm.value.date = preWeek.startOf('week').format('YYYY-MM-DD');
      queryForm.value.date_type = 1;
      onQueryClick();
    };
    onQueryClick();

    const exportLoading = ref(false);
    const onExportExcel = async () => {
      exportLoading.value = true;
      const payload = {
        project_id: queryForm.value.project_id,
        start_date: queryForm.value.start_date,
        end_date: queryForm.value.end_date,
        top_and_stock_sort_by: topData.sortTop === 'shop_gmv_desc' ? 1 : 2,
        refund_by_category_first_cat_id: topData.firstActive || '',
        hot_style_in_region_sort_by: topData.sortHot === 'shop_gmv_desc' ? 1 : 2,
      };

      const [{ data: response }] = await wait(500, PostWeekMonthExportExcel(payload));
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

    provide('searchParams', queryForm);
    return {
      ImageViewer,
      new_array: [
        { name: '商品主图' },
        { name: '商品编码' },
        { name: '商品款号' },
        { name: '商品名称' },
        { name: '讲解次数' },
        { name: '销量' },
        { name: '销售额' },
        { name: '总动销率' },
      ],
      mergeCells,
      numberFormat,
      defaultImage,
      exportLoading,
      query_date_type, //控制周切换月，页面展示
      newShopList,
      newShopLoading,
      formatPriceFormYuan,
      onReQueryClick,
      onExportExcel,
      weekLoading,
      lastWeekNum,
      lastLastWeekNum,
      lastData,
      lastLastData,
      priceLoading,
      priceList,
      priceColumns,
      getRefundSummaries,
      refundLoading,
      newRefundList,
      topLoading,
      sellTableData,
      topTable,
      topData,
      setHeader,
      targetLoading,
      targetTimeColumns,
      objectSpanMethod,
      tableTargetTimeData,
      tableTargetCompleteData,
      targetCompleteColumns,
      timeChange,
      pickerDayOptions,
      pickerWeekOptions,
      pickerMonthOptions,
      ProjectStatusEnum,
      ...methods,
      queryForm,
      project_list,
      loading,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      onQueryClick,
      currentIndex: 0,
      currentSecondIndex: 0,
      isCell: true,
      typeChange,
    };
  },
  methods: {
    // 根据keys数组所有字段去做合并
    handleCellMouseEnter(row: any) {
      //当前第几行
      this.isCell = true;
      //是合并的首行
      this.currentIndex = row.myRowIndex;
      this.currentSecondIndex = row.mySecondRowIndex;
    },
    handleCellMouseLeave() {
      this.isCell = false;
      this.currentIndex = 0;
      this.currentSecondIndex = 0;
    },
    tableRowClassName({ row }: { row: any }) {
      return row.sub_name === '销售额目标' &&
        row.myRowIndex === this.currentIndex &&
        this.currentSecondIndex > 1
        ? 'my-hover-row'
        : row.mySecondRowIndex === this.currentSecondIndex && row.rank === 1
        ? 'my-hover-second-row'
        : '';
    },
    // 获取月日
    getMonthAndDay() {
      return moment().month() + 1 + '月' + moment().date() + '日';
    },
  },
});
