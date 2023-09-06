import { ref, defineComponent, computed } from '@vue/composition-api';
// import { useMarket } from '@/modules/datacenter/marketAnalysis/use';
import {
  useSaleGoodsShopLiveTop,
  useProjectKolItemReport,
} from '@/modules/datacenter/shoplive/tabs/projectDetail/use/useData';
import getRectHeightData from '@/utils/autoHeight';
// import { chartParams } from '@/modules/datacenter/commodityAnalysis/types';
// import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';

export default defineComponent({
  setup(props, ctx) {
    const searchProjectName = ref('');
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const kol_id = ctx.root.$route.query.kol_id;
    const select_cat_id = ref(undefined);
    const third_tiange_cat_id = ref(undefined);
    const projectAndDate = computed<any>(() => {
      return {
        project_id: ctx.root.$route.params.id,
        ...ctx.root.$route.query,
        is_from_project: String(ctx.root.$route.query.is_from_project) === 'true',
        ...(kol_id
          ? { first_cat_id: select_cat_id.value, second_cat_id: third_tiange_cat_id.value }
          : {
              first_tiange_cat_id: 1,
              second_tiange_cat_id: select_cat_id.value,
              third_tiange_cat_id: third_tiange_cat_id.value,
            }),
      };
    });
    const saleInfo = ref({
      num: 10,
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
    } = kol_id ? useProjectKolItemReport(ctx) : useSaleGoodsShopLiveTop(ctx);
    getCategory_2({
      // start_date: projectAndDate.value.start_date,
      // end_date: projectAndDate.value.end_date,
      // project_id: projectAndDate.value.project_id,
      level: kol_id ? undefined : 1,
      category_id: undefined,
      ...projectAndDate.value,
    });
    console.log(categoryList, 'categoryList');

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
      getSaleInfo({ ...projectAndDate.value, ...saleInfo.value });
    };
    searchInfo();
    const onCurrentChange = (page_num: number) => {
      saleInfo.value.page_num = page_num;
      searchInfo();
    };
    const onSelectCatIdChange = (val: number) => {
      third_tiange_cat_id.value = undefined;
      getCategory_3({
        start_date: projectAndDate.value.start_date,
        end_date: projectAndDate.value.end_date,
        project_id: projectAndDate.value.project_id,
        level: 2,
        kol_id: kol_id || undefined,
        category_id: select_cat_id.value,
      });
    };
    const onQueryResetClick = () => {
      searchProjectName.value = '';
      third_tiange_cat_id.value = undefined;
      select_cat_id.value = undefined;
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
    };
  },
});
