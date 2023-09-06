import { ref, defineComponent, PropType, Ref, computed } from '@vue/composition-api';
// import { useMarket } from '@/modules/datacenter/marketAnalysis/use';
import {
  useSaleGoodsShopLiveTop,
  useProjectKolItemReport,
} from '@/modules/datacenter/shoplive/tabs/projectDetail/use/useData';
import getRectHeightData from '@/utils/autoHeight';
// import { chartParams } from '@/modules/datacenter/commodityAnalysis/types';
// import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';

export default defineComponent({
  props: {
    kol_id: {
      type: Object as PropType<Ref>,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const searchProjectName = ref('');
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const datas = ref<any>({});
    const projectAndDate = computed(() => {
      return {
        ...datas.value,
        is_from_project: String(datas.is_from_project) === 'true',
        ...(props.kol_id
          ? { first_cat_id: select_cat_id.value, second_cat_id: third_tiange_cat_id.value }
          : {
              // first_tiange_cat_id: 1,
              second_tiange_cat_id: select_cat_id.value,
              third_tiange_cat_id: third_tiange_cat_id.value,
            }),
      };
    });
    const show = (data: any) => {
      select_cat_id.value = data.second_tiange_cat_id;
      datas.value = data;
      getCategory_2({
        level: props.kol_id ? undefined : 1,
        category_id: undefined,
        ...projectAndDate.value,
      });
      if (select_cat_id.value) onSelectCatIdChange();
      third_tiange_cat_id.value = data.third_tiange_cat_id;
      searchInfo();
    };
    // const kol_id = ctx.root.$route.query.kol_id;
    const select_cat_id: any = ref(undefined);
    const third_tiange_cat_id: any = ref(undefined);
    const saleInfo = ref({
      num: 5,
      page_num: 1,
      sort: '',
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
    } = props.kol_id ? useProjectKolItemReport(ctx) : useSaleGoodsShopLiveTop(ctx);

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
      getSaleInfo({
        ...projectAndDate.value,
        ...saleInfo.value,
        title: searchProjectName.value,
      });
    };
    // searchInfo();
    const onCurrentChange = (page_num: number) => {
      saleInfo.value.page_num = page_num;
      searchInfo();
    };
    const onSelectCatIdChange = () => {
      third_tiange_cat_id.value = undefined;
      getCategory_3({
        start_date: projectAndDate.value.start_date,
        end_date: projectAndDate.value.end_date,
        project_id: projectAndDate.value.project_id,
        level: 2,
        kol_id: props.kol_id || undefined,
        category_id: select_cat_id.value,
      });
    };
    const onQueryResetClick = () => {
      searchProjectName.value = '';
      third_tiange_cat_id.value = undefined;
      select_cat_id.value = undefined;
      saleInfo.value.page_num = 1;
      searchInfo();
    };
    // watch(
    //   () => searchParams.value,
    //   async data => {
    //     if (data === undefined) return;
    //     await getCategory_1({
    //       start_date: projectAndDate.value.start_date,
    //       end_date: projectAndDate.value.end_date,
    //       project_id: projectAndDate.value.project_id,
    //     });
    //     await searchInfo();
    //   },
    //   { deep: true },
    // );
    return {
      onTopCardRectUpdate,
      ...tableHeightLogic,
      onCurrentChange,
      onQueryResetClick,
      searchInfo,
      saleInfo,
      projectAndDate,
      tableSort,
      saleInfoData,
      getSaleInfo,
      saleInfoLoading,
      infoTotal,
      infoColumn,
      select_cat_id,
      categoryList,
      searchProjectName,
      categoryList2,
      onSelectCatIdChange,
      third_tiange_cat_id,
      show,
    };
  },
});
