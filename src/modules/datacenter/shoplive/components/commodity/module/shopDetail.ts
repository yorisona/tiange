/*
 * @Author       : yunie
 * @Date         : 2022-07-19 15:07:57
 * @LastEditTime : 2022-07-25 11:13:39
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\module\shopDetail.ts
 * @Description  :
 */
import { ref, defineComponent, h, watch, Ref, inject, computed } from '@vue/composition-api';
// import { useMarket } from '@/modules/datacenter/marketAnalysis/use';
import { useSaleGoodsShopLiveTop } from '@/modules/datacenter/shoplive/tabs/projectDetail/use/useData';
// import { chartParams } from '@/modules/datacenter/commodityAnalysis/types';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';

export default defineComponent({
  setup(props, ctx) {
    const searchProjectName = ref('');
    // const { getCategory_1: categoryList, getCategory } = useMarket(ctx);
    // getCategory();
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const select_cat_id = ref(undefined);
    const third_tiange_cat_id = ref(undefined);
    const projectAndDate = computed(() => {
      return {
        start_date: searchParams.value.start_date,
        end_date: searchParams.value.end_date,
        project_id: searchParams.value.project_id,
        // tiange_cat_id: select_cat_id.value,
        // first_tiange_cat_id: 1,
        second_tiange_cat_id: select_cat_id.value,
        third_tiange_cat_id: third_tiange_cat_id.value,
        title: searchProjectName.value,
        is_from_project: searchParams.value.is_from_project,
      };
    });
    const saleInfo = ref({
      num: 10,
      page_num: 1,
      sort: '',
      // title: '',
    });
    const defaultSort = ref({
      prop: 'sale_count',
      order: 'descending',
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
    } = useSaleGoodsShopLiveTop(ctx);
    getCategory_2({
      start_date: projectAndDate.value.start_date,
      end_date: projectAndDate.value.end_date,
      project_id: projectAndDate.value.project_id,
      level: 1,
      // category_id: 1,
    });
    const onSelectCatIdChange = (val: number) => {
      third_tiange_cat_id.value = undefined;
      getCategory_3({
        start_date: projectAndDate.value.start_date,
        end_date: projectAndDate.value.end_date,
        project_id: projectAndDate.value.project_id,
        level: 2,
        category_id: select_cat_id.value,
      });
    };
    const tableSort = (column: { prop: string; order: string }) => {
      const { prop, order } = column;
      defaultSort.value = {
        prop,
        order,
      };
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
    const onQueryResetClick = () => {
      searchProjectName.value = '';
      select_cat_id.value = undefined;
      third_tiange_cat_id.value = undefined;
      searchInfo();
    };
    const handlePageSizeChange = (num: number) => {
      saleInfo.value.num = num;
      searchInfo();
    };
    watch(
      () => searchParams.value,
      async data => {
        if (data === undefined) return;
        await getCategory_2({
          start_date: projectAndDate.value.start_date,
          end_date: projectAndDate.value.end_date,
          project_id: projectAndDate.value.project_id,
          level: 1,
          // category_id: 1,
        });
        await searchInfo();
      },
      { deep: true },
    );
    infoColumn.value[0].width = 268;
    return {
      onCurrentChange,
      third_tiange_cat_id,
      handlePageSizeChange,
      onQueryResetClick,
      searchInfo,
      saleInfo,
      onSelectCatIdChange,
      projectAndDate,
      tableSort,
      saleInfoData,
      getSaleInfo,
      saleInfoLoading,
      infoTotal,
      infoColumn,
      select_cat_id,
      categoryList,
      categoryList2,
      searchProjectName,
      defaultSort,
    };
  },
});
