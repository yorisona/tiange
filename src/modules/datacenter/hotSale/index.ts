import { defineComponent, onBeforeMount, reactive } from '@vue/composition-api';
import getRectHeightData from '@/utils/autoHeight';
import { useList } from './use/list';
import { IHotProjectSearchParams } from '@/types/tiange/datacenter';

export default defineComponent({
  name: 'TgHotSaleMonitor',
  setup(props, ctx) {
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();

    const queryForm = reactive<IHotProjectSearchParams>({
      project_name: '',
      page_num: 1,
      num: 20,
    });

    const listLogic = useList(ctx);
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.page_num = 1;
      }
      await listLogic.loadData(queryForm);
    };

    const onQueryResetClick = () => {
      queryForm.project_name = '';
      queryForm.page_num = 1;
      queryForm.num = 20;
      reload();
    };

    const onQuerySearchClick = () => {
      reload();
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.page_num = page_num;
      reload(false);
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.num = num;
      reload();
    };
    onBeforeMount(() => {
      reload();
    });

    return {
      onTopCardRectUpdate,
      ...tableHeightLogic,
      reload,
      queryForm,
      onQuerySearchClick,
      onQueryResetClick,
      handleCurrentChange,
      handlePageSizeChange,
      ...listLogic,
    };
  },
});
