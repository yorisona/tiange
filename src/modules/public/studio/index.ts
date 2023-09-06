/**
 * 公共管理 - 直播间管理
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 09:43:40
 */
import { StudioQueryParams } from '@/types/tiange/studio';
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useFilter } from './use/filter';
import { useList } from './use/list';

import AddStudio from '@/modules/public/studio/form/studio.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import getRectHeightData from '@/utils/autoHeight';
import { BusinessTypeEnum, BusinessTypeOptions } from '@/types/tiange/common';

export default defineComponent({
  name: 'TgPublicStudio',
  components: {
    AddStudio,
  },
  setup(props, ctx) {
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();

    const queryForm = ref<StudioQueryParams>({
      studio_name: '',
      page_num: 1,
      business_type: '',
      select_business_type: -1,
      num: 20,
    });

    const listLogic = useList(ctx);
    const onAddStudioModalClose = async (success: boolean) => {
      listLogic.currentStudio.value = undefined;

      listLogic.toggleAddStudioModalVisible();
      if (success) {
        await reload();
      }
    };

    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }

      const queryData: StudioQueryParams = {
        page_num: queryForm.value.page_num,
        num: queryForm.value.num,
        business_type: '',
      };

      if (queryForm.value.studio_name) {
        queryData.studio_name = queryForm.value.studio_name;
      }
      if (queryForm.value.select_business_type !== -1) {
        const select_business_type = queryForm.value.select_business_type ?? '';
        queryData.business_type = select_business_type.toString();
      }

      await listLogic.loadData(queryData);
    };
    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      reload(false);
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.value.num = num;
      reload();
    };

    /** 查询 */
    const onQuerySearchClick = () => {
      reload();
    };

    /** 重置查询 */
    const onQueryResetClick = () => {
      queryForm.value.studio_name = '';
      queryForm.value.select_business_type = -1;
      reload();
    };

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.live_studio_view);
      const canEdit = HasPermission(RIGHT_CODE.live_studio_modify);
      return { canEdit, canViewList };
    });

    return {
      BusinessTypeOptions: BusinessTypeOptions.filter(it => it.value !== BusinessTypeEnum.mcn),
      Permission,
      queryForm,
      handleCurrentChange,
      handlePageSizeChange,
      onQuerySearchClick,
      onQueryResetClick,
      ...useFilter(),
      onAddStudioModalClose,
      ...listLogic,
      reload,
      onTopCardRectUpdate,
      ...tableHeightLogic,
    };
  },
  async mounted() {
    this.queryBrandList();
  },
  methods: {
    async queryBrandList() {
      await this.reload();
    },
  },
});
