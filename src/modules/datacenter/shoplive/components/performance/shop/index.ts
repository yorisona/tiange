import {
  defineComponent,
  onBeforeMount,
  ref,
  watch,
  nextTick,
  provide,
} from '@vue/composition-api';
import LineCharts from '@/modules/datacenter/commodityAnalysis/components/line/index.vue';
import PriceNew from '@/modules/datacenter/shoplive/components/performance/shop/price/index.vue';
import { GetPerfromanceShopList } from '@/services/datacenter/shoplive';
import { wait } from '@/utils/func';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
const { formatPriceFormYuan } = formatPriceForm;
import moment from 'moment';
import { get_folded_text } from '@/utils/string';
import { useSaleGoodsShopLiveTop } from '@/modules/datacenter/commodityAnalysis/use';
import { useDialog } from '@/use/dialog';
import detail from '@/modules/datacenter/shoplive/components/launchnchor/dialog/detail.vue';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
const kol_id = ref(0);
const dialogProject = useDialog({
  component: detail,
  title: '商品明细',
  footer: false,
  width: '1100px',
  class: 'zIndex',
  props: {
    kol_id,
  },
});

export default defineComponent({
  name: 'shopIndex',
  components: {
    LineCharts,
    PriceNew,
  },
  props: {
    performanceId: {
      type: Number,
      default: 0,
    },
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup: (props: any, ctx: any) => {
    const searchParams = ref({
      is_from_project: props.projectData ? props.projectData.from_project : false,
      room_id: props.performanceId,
      project_id: props.projectData ? props.projectData.project_id : 0,
      end_date: props.projectData ? props.projectData.end_time : '',
      start_date: props.projectData ? props.projectData.start_time : '',
      sort: 'shop_gmv_desc',
    });
    provide('searchOneParams', searchParams);
    if (props.projectData && props.projectData.project_name) {
      provide('searchProjectName', props.projectData.project_name);
    }
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
    const list = ref<any[]>([]);
    const summariesData = ref<Record<string, any>>();
    const { business_type } = useProjectBaseInfo();
    const getDouyinCategoryReport = async (payload: any) => {
      loading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetPerfromanceShopList(payload, business_type.value),
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
          message: response.message || '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    onBeforeMount(async () => {
      await getDouyinCategoryReport({
        ...searchParams.value,
        sort: sortVal.value,
      });
      nextTick(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 1000);
      });
    });

    watch(
      () => props.projectData,
      async () => {
        searchParams.value = {
          is_from_project: props.projectData ? props.projectData.from_project : false,
          room_id: props.performanceId,
          project_id: props.projectData ? props.projectData.project_id : 0,
          end_date: props.projectData ? props.projectData.end_time : '',
          start_date: props.projectData ? props.projectData.start_time : '',
          sort: 'shop_gmv_desc',
        };
        projectAndDate.value = {
          is_from_project: props.projectData ? props.projectData.from_project : false,
          room_id: props.performanceId,
          project_id: props.projectData ? props.projectData.project_id : 0,
          end_date: props.projectData ? props.projectData.end_time : '',
          start_date: props.projectData ? props.projectData.start_time : '',
        };
        if (props.projectData) {
          provide('searchParams', searchParams);
          provide('searchProjectName', props.projectData.project_name);
        }
        await getDouyinCategoryReport({
          ...searchParams.value,
          // category_id: firstActive.value,
          sort: sortVal.value,
        });
        await getCategory_2({
          start_date: projectAndDate.value.start_date,
          end_date: projectAndDate.value.end_date,
          project_id: projectAndDate.value.project_id,
          level: 1,
          // category_id: 1,
          room_id: String(searchParams.value.room_id),
        });
        searchInfo();
      },
      { deep: true },
    );

    const catId = ref(0);
    const onSaleDetailClick = (row: any) => {
      dialogProject.show({
        room_id: String(searchParams.value.room_id),
        project_name: props.projectData.project_name || row.project_name,
        project_id: String(searchParams.value.project_id),
        first_tiange_cat_id: row.first_tiange_cat_id,
        second_tiange_cat_id: row.second_tiange_cat_id,
        third_tiange_cat_id: row.third_tiange_cat_id,
        start_date: moment(searchParams.value.start_date).format('YYYY-MM-DD'),
        end_date: moment(searchParams.value.end_date).format('YYYY-MM-DD'),
        is_from_project: props.projectData ? props.projectData.from_project : false,
      });
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
        // category_id: firstActive.value,
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
        'shop_refund_gmv_rate',
        'shop_refund_gmv',
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

    const getRowKey = (row: any) => {
      if (row.children !== undefined) return row.id + 'only';
      return row.id;
    };
    const projectAndDate = ref({
      is_from_project: props.projectData ? props.projectData.from_project : false,
      room_id: props.performanceId,
      project_id: props.projectData ? props.projectData.project_id : 0,
      end_date: props.projectData ? props.projectData.end_time : '',
      start_date: props.projectData ? props.projectData.start_time : '',
    });
    const saleInfo = ref({
      num: 10,
      page_num: 1,
      sort: '',
      title: '',
      select_cat_id: undefined as any,
      third_tiange_cat_id: undefined as any,
    });
    const {
      saleData: saleInfoData,
      getData: getSaleInfo,
      loading: saleInfoLoading,
      total: infoTotal,
      hotGoodsColumn: infoColumn,
      category_2: categoryList,
      category_3: categoryList2,
      getCategory_2,
      getCategory_3,
    } = useSaleGoodsShopLiveTop();
    getCategory_2({
      start_date: projectAndDate.value.start_date,
      end_date: projectAndDate.value.end_date,
      project_id: projectAndDate.value.project_id,
      level: 1,
      // category_id: 1,
      room_id: String(searchParams.value.room_id),
    });
    const onSelectCatIdChange = (val: number) => {
      saleInfo.value.third_tiange_cat_id = undefined;
      getCategory_3({
        start_date: projectAndDate.value.start_date,
        end_date: projectAndDate.value.end_date,
        project_id: projectAndDate.value.project_id,
        level: 2,
        category_id: saleInfo.value.select_cat_id,
        room_id: String(searchParams.value.room_id),
      });
    };
    const tableSort = (column: { prop: string; order: string }) => {
      const { prop, order } = column;
      if (order === null) {
        saleInfo.value.sort = 'sale_count_desc';
      } else {
        saleInfo.value.sort = order === 'ascending' ? prop : prop + '_desc';
      }
      searchInfo();
    };
    const searchInfo = () => {
      if (projectAndDate.value.start_date) {
        getSaleInfo({ ...projectAndDate.value, ...saleInfo.value });
      }
    };
    searchInfo();
    const onCurrentChange = (page_num: number) => {
      saleInfo.value.page_num = page_num;
      searchInfo();
    };
    /*   watch(
      () => [saleInfo.value.title, saleInfo.value.cat_id],
      async () => {
        searchInfo();
      },
      { deep: true },
    );*/

    const onQueryResetClick = () => {
      saleInfo.value.page_num = 1;
      saleInfo.value.num = 10;
      saleInfo.value.select_cat_id = undefined;
      saleInfo.value.third_tiange_cat_id = undefined;
      saleInfo.value.title = '';
      searchInfo();
    };
    const handlePageSizeChange = (num: number) => {
      saleInfo.value.page_num = 1;
      saleInfo.value.num = num;
      searchInfo();
    };
    return {
      handlePageSizeChange,
      onQueryResetClick,
      searchInfo,
      onSelectCatIdChange,
      categoryList,
      categoryList2,
      onCurrentChange,
      saleInfo,
      projectAndDate,
      tableSort,
      saleInfoData,
      getSaleInfo,
      saleInfoLoading,
      infoTotal,
      infoColumn,
      sortChange,
      loading,
      onTopCardRectUpdate,
      heightList,
      lowList,
      list,
      showSort,
      formatPriceFormYuan,
      numberFormat,
      get_folded_text,
      catId,
      rowHightlight,
      getSummaries,
      getRowKey,
      onSaleDetailClick,
    };
  },
});
