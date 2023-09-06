import { computed, defineComponent, ref, UnwrapRef } from '@vue/composition-api';
import { useList } from '@/modules/live/project/use/list';
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
import addProject from '@/modules/live/project/dialog/addProject/index.vue';
import { useDialog } from '@/use/dialog';
import newProject from '@/modules/localLife/dialog/newProject.vue';
export default defineComponent({
  name: 'TgLocalLifeProject',
  components: {
    AddLiveProject,
    newProject,
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
      cooperation_type: -1,
      business_type: 7,
      page_num: 1,
      num: 20,
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
      queryForm.value.cooperation_type = -1;
      queryForm.value.business_type = 7;
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

      if (queryForm.value.cooperation_type !== -1) {
        queryData.cooperation_type = queryForm.value.cooperation_type;
      }

      if (queryForm.value.business_type !== -1) {
        queryData.business_type = queryForm.value.business_type;
      }
      await listLogic.loadData(queryData);
    };

    // const { jump } = useJump({}, ctx);

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
    const { jumpProjectDetail } = usePageJump();
    // 行点击跳转详情页
    const onRowClick = (row: LiveProject) => {
      const useId = store.state.user?.userinfo?.id;
      const permiss =
        row.team_members.some(el => el.id === useId) ||
        row.customer_manager_id === useId ||
        row.project_manager_id === useId ||
        HasPermission(RIGHT_CODE.local_life_view_all_project);
      if (!permiss) {
        return ctx.root.$message.warning('您没有查看该项目的权限');
      }
      jumpProjectDetail(row.business_type, {
        project_id: row.id,
      });
    };

    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.local_life_project_view);
      const canEdit = HasPermission(RIGHT_CODE.local_life_project_save);
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
    const addNewRef = ref<UnwrapRef<{ show: (value: Boolean) => void }> | null>(null);
    const creatProjectClick = () => {
      addNewRef.value && addNewRef.value.show(true);
    };
    const creatCommonProjectClick = (value: string = '0') => {
      if (value === '1') {
        const dialogProject = useDialog({
          component: addProject,
          title: '项目立项审批',
          props: {
            businessType: 7,
          },
          footer: false,
          width: '760px',
          on: {
            close() {
              addNewRef.value && addNewRef.value.show(false);
            },
            submit() {
              reload();
              addNewRef.value && addNewRef.value.show(false);
            },
          },
        });
        dialogProject.show();
      } else if (value === '2') {
        const dialogProject = useDialog({
          component: addProject,
          props: {
            isSingleField: true,
            businessType: 7,
          },
          title: '新增项目',
          footer: false,
          width: '760px',
          on: {
            close() {
              addNewRef.value && addNewRef.value.show(false);
            },
            submit() {
              reload();
              addNewRef.value && addNewRef.value.show(false);
            },
          },
        });
        dialogProject.show();
      }
    };
    return {
      creatCommonProjectClick,
      creatProjectClick,
      addNewRef,
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
