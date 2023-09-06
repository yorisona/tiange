/* * @Brief: 系统设置-消息管理*/
import { computed, defineComponent, ref, Ref, SetupContext } from '@vue/composition-api';
import { GetSystemNewsList, PostNewsSetStatus } from '@/services/system/news';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
// @ts-ignore
import settingDialog from './settingDialog/index.vue';

export default defineComponent({
  name: 'TgNewsManage',
  components: {
    settingDialog,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      /** 系统角色管理 */
      const canViewList = HasPermission(RIGHT_CODE.system_news_list);
      const canEdit = HasPermission(RIGHT_CODE.system_news_list);
      return { canEdit, canViewList };
    });
    const routes: { title: string; path?: string; name?: string; params?: any }[] = [
      { title: '系统设置' },
      { title: '消息管理' },
    ];

    return { routes, Permission, ...systemRoleDataList(ctx) };
  },
});

// 列表
function systemRoleDataList(ctx: SetupContext) {
  const shouldEditing = ref(false);
  const loading = ref<boolean>(false);
  const msgType = ref<number>(1);
  const evtType = ref<number>(0);
  // 列表数据
  const list = ref<any[]>([]);
  // 当前编辑rule对象
  const editingId = ref<any | undefined>(undefined);
  // 编辑
  const handleEditAction = (id: number, msg_type: number, event_type: number) => {
    shouldEditing.value = !shouldEditing.value;
    msgType.value = msg_type;
    evtType.value = event_type;
    editingId.value = id;
  };
  //更新状态
  const handleUploadAction = async (id: number, status: any) => {
    const payload = {
      config_id: id,
      status: status === '1' || status === 1 ? 0 : 1,
    };
    const { data } = await PostNewsSetStatus(payload);
    if (data.success) {
      ctx.root.$message.success('状态修改成功');
      getSystemUserListRequest(list, loading);
    } else {
      ctx.root.$message.error(data.message || '状态修改失败');
    }
  };
  // 编辑成功回调
  const handleEditingSucceedAction = () => {
    getSystemUserListRequest(list, loading);
    shouldEditing.value = !shouldEditing.value;
  };
  // 请求列表数据
  getSystemUserListRequest(list, loading);

  // 自适应表格高度部分
  const buttonLineHeight = 0;
  const paginationLineHeight = 0;
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
    handleUploadAction,
    list,
    shouldEditing,
    loading,
    msgType,
    evtType,
    handleEditAction,
    editingId,
    handleEditingSucceedAction,
    onTopCardRectUpdate,
    ...tableHeightLogic,
  };
}

async function getSystemUserListRequest(listData: Ref, loading: Ref<boolean>) {
  loading.value = true;
  const { data } = await GetSystemNewsList();
  loading.value = false;
  if (data.success) {
    listData.value = data.data.data;
  }
}
