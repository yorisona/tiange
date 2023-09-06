/**
 * 店铺代播 - 直播场次
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 11:27:28
 */
import { RouterNameProjectManage } from '@/const/router';
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useFilter } from './use/filter';
import { useList } from './use/list';
import { LiveDisplay, LiveDisplayQueryParams, LiveDisplaySearchType } from '@/types/tiange/live';
import liveDisplayAddDialog from './dialog/live.display.add.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { useRouter } from '@/use/vue-router';
import { useUserInfo } from '@/use/vuex';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'TgPublicStudio',
  components: {
    liveDisplayAddDialog,
  },
  setup(props, ctx) {
    const router = useRouter();
    const shouldEditing = ref<boolean>(false);
    const isFormConsoleLuru = router.currentRoute.query.source === 'console_luru';
    const userinfo = useUserInfo();
    const queryParams = ref<LiveDisplayQueryParams>({
      num: 20,
      // 页码
      page_num: 1,
      // 搜索类型
      search_type: isFormConsoleLuru
        ? LiveDisplaySearchType.operation_assistant_name
        : LiveDisplaySearchType.brand_name,
      // 搜索值
      search_value: isFormConsoleLuru ? userinfo.value.username : undefined,
      // 直播状态
      live_status:
        router.currentRoute.query.source === 'console' ? 1 : isFormConsoleLuru ? 3 : undefined,
      // 直播开始时间
      live_start_date: undefined,
      business_type: undefined,
    });

    const listLogic = useList(ctx);
    // 调转详情
    const jumpDetail = (row: LiveDisplay) => {
      ctx.root.$router.push({
        name: RouterNameProjectManage.live.display.detail,
        params: {
          liveId: `${row.id}`,
          id: `${row.project_id}`,
          tab: 'live',
        },
      });
    };
    const { business_type: project_business_type } = useProjectBaseInfo();
    const reload = async (
      page_num = queryParams.value.page_num,
      num = queryParams.value.num,
      search_type = queryParams.value.search_type,
      search_value = queryParams.value.search_value,
      live_status = queryParams.value.live_status,
      live_start_date = queryParams.value.live_start_date,
      business_type = queryParams.value.business_type,
    ) => {
      const params: LiveDisplayQueryParams = {
        num: num,
        page_num: page_num,
        search_type: search_type,
        search_value: search_value,
        live_status: live_status,
        live_start_date: live_start_date,
        business_type: business_type,
      };
      await listLogic.loadData(params, project_business_type.value);
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryParams.value.page_num = page_num;
      reload(page_num);
    };

    const handlePageSizeChange = (num: number) => {
      queryParams.value.num = num;
      reload(queryParams.value.page_num, num);
    };
    // 查询
    const handleQueryAction = async () => {
      queryParams.value.page_num = 1;
      await listLogic.loadData(queryParams.value, project_business_type.value);
    };

    const handleResetAction = () => {
      queryParams.value = {
        num: queryParams.value.num,
        // 页码
        page_num: 1,
        // 搜索类型
        search_type: LiveDisplaySearchType.brand_name,
        // 搜索值
        search_value: undefined,
        // 直播状态
        live_status: undefined,
        // 直播开始时间
        live_start_date: undefined,
        // 业务类型
        business_type: undefined,
      };
      handleQueryAction();
    };
    // 新增直播场次事件
    const handleAddLiveDisplayAction = () => {
      shouldEditing.value = true;
    };
    // 弹框关闭事件
    const handleCloseAction = () => {
      shouldEditing.value = false;
    };
    // 弹框保存成功回调
    const handleSaveSucceedAction = () => {
      shouldEditing.value = false;
      reload();
    };

    reload();
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_view_shop_live)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_display_view)
        : HasPermission(RIGHT_CODE.live_display_view);
      const canEdit = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_edit_shop_live)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_display_save)
        : HasPermission(RIGHT_CODE.live_display_save);
      return { canEdit, canViewList };
    });

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 31;

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    return {
      Permission,
      shouldEditing,
      ...useFilter(),
      ...listLogic,
      reload,
      queryParams,
      jumpDetail,
      handleCurrentChange,
      handlePageSizeChange,
      handleQueryAction,
      handleResetAction,
      handleAddLiveDisplayAction,
      handleCloseAction,
      handleSaveSucceedAction,
      onTopCardRectUpdate,
      ...tableHeightLogic,
    };
  },
});
