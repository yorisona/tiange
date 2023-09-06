/**
 * 店铺代播 - 项目管理 - 列表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 13:34:11
 */
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useList } from './use/list';
import AddLiveProject from '@/modules/live/project/dialog/projectform/index.vue';
import { LiveProject, LiveProjectQueryParams } from '@/types/tiange/live.project';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { useRouter } from '@/use/vue-router';
import { useStore } from '@/use/vuex';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { usePageJump } from '@/utils/pageJump';
import { ProjectStatusEnum } from '@/types/tiange/common';
const isDev = process.env.NODE_ENV === 'development';
import addProject from './modules/addProject/index.vue';
import { useDialog } from '@/use/dialog';
import { BusinessTypeEnum } from '@/types/tiange/common';

export default defineComponent({
  name: 'TgLiveProject',
  components: {
    AddLiveProject,
  },
  setup(props, ctx) {
    const router = useRouter();
    const store = useStore();
    const source = router.currentRoute.query.source;
    const search_type = router.currentRoute.query.search_type;

    const queryForm = ref<LiveProjectQueryParams>({
      search_type: source === 'console' ? 5 : 6,
      search_value: source === 'console' ? store.state.user?.userinfo?.username : '',
      project_status: -1,
      page_num: 1,
      num: 20,
    });
    const dialogProject = useDialog({
      component: addProject,
      title: '项目立项审批',
      footer: false,
      width: '760px',
    });

    if (search_type) {
      queryForm.value.search_type = parseInt(search_type.toString(), 10);
    }

    const search_value_type = computed(() => {
      const typeMap = new Map([
        [1, '项目编号'],
        [2, '客户名称'],
        [3, '品牌名称'],
        [4, '客户经理'],
        [5, '项目经理'],
        [6, '项目名称'],
        [8, '团队成员'],
      ]);

      return typeMap.get(queryForm.value.search_type ?? 6);
    });

    const listLogic = useList(ctx);
    const onAddProjectModalClose = async (success: boolean) => {
      listLogic.toggleAddProjectModalVisible(false);
      if (success) {
        await reload();
      }
    };

    /** 查询 */
    const onQuerySearchClick = () => {
      reload();
    };

    /** 重置查询form */
    const resetQueryForm = () => {
      queryForm.value.search_type = 6;
      queryForm.value.search_value = '';
      queryForm.value.project_status = -1;
      queryForm.value.page_num = 1;
      queryForm.value.num = 20;
    };

    /** 重置查询 */
    const onQueryResetClick = () => {
      resetQueryForm();

      reload();
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

    const reload = async (clean = true) => {
      if (clean) {
        queryForm.value.page_num = 1;
      }
      const queryData: LiveProjectQueryParams = {
        page_num: queryForm.value.page_num,
        num: queryForm.value.num,
      };
      if (queryForm.value.search_type !== -1) {
        queryData.search_type = queryForm.value.search_type;

        if (queryForm.value.search_value !== '') {
          queryData.search_value = queryForm.value.search_value;
        }
      }

      if (queryForm.value.project_status !== -1) {
        queryData.project_status = queryForm.value.project_status;
      }

      await listLogic.loadData(queryData);
    };

    // const { jump } = useJump({}, ctx);
    const { jumpProjectDetail } = usePageJump();

    // const isTeamMember = (row: LiveProject) => {
    //   const userinfo = computed<UserInfo | null>(() => Store.getters['user/getUserInfo']);
    //   const userId = userinfo.value?.id;
    //   const find = row.team_members.find(el => el.id === userinfo.value?.id);
    //   if (
    //     userId === row.customer_manager_id ||
    //     userId === row.project_manager_id ||
    //     userId === row.add_by ||
    //     find
    //   ) {
    //     return true;
    //   }
    //   return false;
    // };

    // 行点击跳转详情页
    const onRowClick = (row: LiveProject) => {
      // if (!isTeamMember(row)) {
      //   ctx.root.$message.error('没有查看当前项目的权限，请联系项目经理或者客户经理');
      //   return;
      // }
      jumpProjectDetail(BusinessTypeEnum.supplyChain, {
        project_id: row.id,
        liveType: 'SupplyChainDetail',
      });
    };

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.supply_view_project);
      const canEdit = HasPermission(RIGHT_CODE.supply_edit_project);
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
      pagename: 'live_project',
    });
    return {
      ProjectStatusEnum,
      search_value_type,
      Permission,
      reload,
      queryForm,
      isDev,
      handlePageSizeChange,
      handleCurrentChange,
      onQueryResetClick,
      onQuerySearchClick,
      onAddProjectModalClose,
      onRowClick,
      ...listLogic,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      dialogProject,
    };
  },
  async mounted() {
    this.queryLiveProjectList();
  },
  methods: {
    async queryLiveProjectList() {
      await this.reload();
    },
  },
});
