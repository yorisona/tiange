import { computed, defineComponent, inject, onBeforeMount, ref, Ref } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import {
  CommonBusinessProjectDetail,
  ProjectTypeEnumMap,
} from '@/types/tiange/commonBusiness/project';
import CommonBusinessProjectDialog from '@/modules/commonBusiness/project/dialog/project.form.vue';
import MonthLive from '@/modules/commonBusiness/project/tabs/components/monthLive/index.vue';
import { formatAmountWithoutPrefix } from '@/utils/string';
import { ProjectTeamMemberProps, ShopLiveProfitStatData } from '@/types/tiange/live';
import TeamMember from '@/modules/commonBusiness/project/dialog/teamMember.vue';
import projectFinal from '@/modules/live/project/dialog/projectstep/project.final.vue';
import { QueryProfitStatData } from '@/services/commonBusiness/project';
import { useRouter } from '@/use/vue-router';
import { UserInfo } from '@/types/tiange/system';
import Store from '@/store';
import RollBackProject from '@/modules/live/project/dialog/rollBack.project.vue';
import { RollBackProjectInfo } from '@/modules/live/project/dialog/rollBack.project';
import { ProjectTypeEnum } from '@/types/tiange/common';
import { ProjectStatusEnum } from '@/types/tiange/common';
import { useDialog } from '@/use/dialog';
import finishProject from '@/modules/live/project/dialog/finishProject/index.vue';
import prolongLiquidationPeriod from '@/modules/live/project/dialog/prolongLiquidationPeriod/index.vue';

export default defineComponent({
  name: 'CommonBusinessProjectDetailInfo',
  components: { CommonBusinessProjectDialog, TeamMember, projectFinal, MonthLive, RollBackProject },
  setup(props, ctx) {
    const userinfo = computed<UserInfo | null>(() => Store.getters['user/getUserInfo']);
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const project =
      inject<Ref<CommonBusinessProjectDetail>>('project') ?? ref<CommonBusinessProjectDetail>();
    const currentProject = computed(() => project.value);

    const ProjectDetail = computed(() => {
      return {
        ...currentProject.value,
      };
    });

    /** 编辑项目 */
    const ProjectFormVisible = ref(false);
    const toggleProjectModalVisible = async (success: boolean) => {
      ProjectFormVisible.value = success;
    };
    const onProjectFormModalClose = async (success: boolean) => {
      ProjectFormVisible.value = false;
      if (success) {
        getDetail();
      }
    };

    const rollBackProjectVisible = ref<boolean>(false);
    const onRollBackProject = () => {
      rollBackProjectVisible.value = true;
    };

    const otherMembersStr = computed(() => {
      const members = project.value?.team_members.map(el => el.name) ?? [];
      return members.length ? members.join(' ') : '--';
    });

    const projectTypeStr = computed(() => {
      if (project.value?.mcn_project_type) {
        return ProjectTypeEnumMap.get(project.value.mcn_project_type) ?? '--';
      }
      return '--';
    });

    const project_status_str = computed(() => {
      const end_str =
        project.value?.end_type === 1
          ? '正常结束'
          : project.value?.end_type === 2
          ? '意外终止'
          : '';
      return end_str;
    });
    const project_reason_status_str = computed(() => {
      const end_detail =
        project.value?.end_detail.end_handle_type === 2
          ? `${project.value?.end_detail.end_handle_detail}`
          : '退款';
      return project.value?.end_type === 2 ? end_detail : '';
    });
    /** 权限检查 */
    const Permission = computed(() => {
      const canSaveProject = HasPermission(RIGHT_CODE.common_business_project_save);
      const canEditProject = HasPermission(RIGHT_CODE.common_business_project_end_project);
      const canEndEditProject = HasPermission(
        RIGHT_CODE.common_business_project_status_finish_edit,
      );
      return { canSaveProject, canEditProject, canEndEditProject };
    });

    const rollBackProjectInfo = computed((): RollBackProjectInfo => {
      return {
        projectId: project.value?.id,
        projectType: ProjectTypeEnum.common_business,
      };
    });

    // 项目盈收情况
    const profitData = ref<ShopLiveProfitStatData>({
      /** 收入结算金额 */
      income_settlement_amount: '',
      /** 成本结算金额 */
      cost_settlement_amount: '',
      /** 实收金额 */
      real_income_amount: '',
      /** 实付金额 */
      real_paid_amount: '',
      /** 未收金额 */
      unreceived_amount: '',
      /** 未付金额 */
      unpaid_amount: '',
      /** 已开发票 */
      paid_invoice_amount: '',
      /** 已收发票 */
      received_invoice_amount: '',
    });

    const queryShopLiveProfitStatData = async () => {
      const res = await QueryProfitStatData(project_id);
      if (res.data.success) {
        profitData.value = res.data.data;
      } else {
        ctx.root.$message(res.data.message);
      }
    };

    const formatAmount = (money: string) => {
      const new_money = money ? money : '0';
      return formatAmountWithoutPrefix(new_money);
    };
    /** 编辑成员 */
    const teamMemberVisible = ref<boolean>(false);
    const memberForEdit = computed(() => {
      return {
        project_manager_id: project.value?.project_manager_id,
        team_members: project.value?.team_members,
        project_manager_name: project.value?.project_manager,
      } as ProjectTeamMemberProps;
    });
    const onProjectTeamEdit = () => {
      teamMemberVisible.value = true;
    };
    const onTeamMemberSave = () => {
      teamMemberVisible.value = false;
      getDetail();
    };

    /** 编辑项目完结 */
    const ProjectStepFinalFormVisible = ref<boolean>(false);
    const onProjectFinalStepDialogModalClose = () => {
      ProjectStepFinalFormVisible.value = false;
    };
    const openFinishDialog = () => {
      ProjectStepFinalFormVisible.value = true;
    };
    const getDetail = () => {
      ctx.emit('editProjectReload');
    };

    const teamMemberEditEnabled = computed(() => {
      if (userinfo.value?.id && project.value) {
        return (
          userinfo.value.id === project.value.project_manager_id ||
          userinfo.value.id === project.value.add_by
        );
      }
      return false;
    });

    const onProjectRollBackSave = () => {
      rollBackProjectVisible.value = false;
      getDetail();
    };

    onBeforeMount(() => {
      queryShopLiveProfitStatData();
    });
    const project_cycle = computed(() => {
      if (ProjectDetail.value?.start_date && ProjectDetail.value?.end_date) {
        const start_date = ProjectDetail.value?.start_date.replace(/-/g, '.');
        const end_date = ProjectDetail.value?.end_date.replace(/-/g, '.');
        return `${start_date} - ${end_date}`;
      }
      return '--';
    });
    const dialogFinishProject = useDialog({
      title: '项目完结',
      width: 428,
      okText: '提交',
      component: finishProject,
      on: {
        submit() {
          getDetail();
        },
      },
    });
    const onFinishProjectHandler = () => {
      dialogFinishProject.show(project.value?.id);
    };
    const dialogProlongLiquidationPeriod = useDialog({
      title: '延长清算期',
      width: 360,
      okText: '提交',
      component: prolongLiquidationPeriod,
      on: {
        submit() {
          getDetail();
        },
      },
    });
    const onProlongLiquidationPeriodHandler = () => {
      dialogProlongLiquidationPeriod.show({
        ...project.value,
      });
    };
    return {
      onProlongLiquidationPeriodHandler,
      onFinishProjectHandler,
      ProjectStatusEnum,
      project_cycle,
      Permission,
      ProjectDetail,
      projectTypeStr,
      project_status_str,
      project_reason_status_str,
      currentProject,
      otherMembersStr,
      ProjectFormVisible,
      toggleProjectModalVisible,
      onProjectFormModalClose,
      formatAmount,
      profitData,
      teamMemberVisible,
      teamMemberEditEnabled,
      memberForEdit,
      onProjectTeamEdit,
      onTeamMemberSave,
      ProjectStepFinalFormVisible,
      rollBackProjectVisible,
      onRollBackProject,
      onProjectFinalStepDialogModalClose,
      openFinishDialog,
      getDetail,
      rollBackProjectInfo,
      onProjectRollBackSave,
    };
  },
});
