/**
 * 营销业务 - 项目详情
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-07 18:01:54
 */
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  provide,
  ref,
  watch,
  h,
  inject,
} from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import { useRefTabs } from '@/use/tab';
import info from './tabs/info.vue';
import achievement from './tabs/achievement/switch/index.vue';
import ae from './tabs/ae/ae.vue';
import { props2RouteParams } from '@/router/func';
import cost from './tabs/CostSchedule/tabs.vue';
import { resize } from '@/utils/dom';
import contract from '@/modules/customer/contract/list/index.vue';
import AeDialogModal from './dialog/ae/form.vue';
import dailydata from './tabs/dailyData/index.vue';
import ProjectExecuteFinishModal from './dialog/executeFinish/form.vue';
import { GetMarketingProjectDetail } from '@/services/marketing.project';
import type { MarketingProjectDetail as ProjectDetail } from '@/types/tiange/marketing/project';
import {
  MarketingProjectEndTypeEnum,
  MarketingProjectTerminateTypeEnum,
  MarketingProjectTerminateTypeMap,
} from '@/types/tiange/marketing/project';
import { ProjectCooperationStatusEnum } from '@/types/tiange/marketing/project.enum';
import { GetAEList } from '@/services/marketing/ae';
import { sleep } from '@/utils/func';
import moment from 'moment';
import { RouterNameProjectManage } from '@/const/router';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { formatAmount } from '@/utils/string';
import type { Step } from '@/components/Steps/steps';
import settlement_income from '@/modules/settlement/income/list.vue';
import settlement_cost from '@/modules/settlement/cost/list.vue';
import { RollBackProjectInfo } from '@/modules/live/project/dialog/rollBack.project';
import { ProjectTypeEnum } from '@/types/tiange/common';
import RollBackProject from '@/modules/live/project/dialog/rollBack.project.vue';
import { useRouter } from '@/use/vue-router';

const useProjectStep = (
  project: Ref<ProjectDetail | undefined>,
  reloadCallback: (reload: boolean) => void,
) => {
  /** 权限检查 */
  const Permission = computed(() => {
    const canEditProjectStep = HasPermission(RIGHT_CODE.marketing_project_step_edit);
    const canEndEditProjectStep = HasPermission(RIGHT_CODE.marketing_project_status_finish_edit);
    const canEditProject = HasPermission(RIGHT_CODE.marketing_project_save);
    return { canEditProjectStep, canEditProject, canEndEditProjectStep };
  });

  /** 是否可以操作 指定AE 按钮 */
  /** 是否可以操作 执行结束 按钮 */
  const canChangeAeList = computed(
    () => (project.value?.cooperation_status ?? -1) <= ProjectCooperationStatusEnum.ExecuteProject,
  );

  /** 是否可以操作 执行结束 按钮 */
  const canConfirmEndStatus = computed(
    () => (project.value?.cooperation_status ?? -1) === ProjectCooperationStatusEnum.ExecuteProject,
  );

  // AE部分
  /** 指定AE */
  const AeDialogVisible = ref(false);
  const changeAeBtnClick = () => {
    AeDialogVisible.value = true;
  };

  const onAeDialogModalClose = () => {
    AeDialogVisible.value = false;
  };
  const execute_result = computed(() => {
    const end_type = project.value?.end_type;
    const end_time = project.value?.end_time ?? 0;
    const end_time_str = moment(end_time * 1000).format('yyyy.MM.DD');
    if (end_type === MarketingProjectEndTypeEnum.normal) {
      return `正常结束 ${end_time_str}`;
    } else if (end_type === MarketingProjectEndTypeEnum.unexpected) {
      let result;
      if (project.value?.end_detail) {
        const terminate_type = parseInt(
          (project.value?.end_detail.unexpected_terminate_type ?? -1).toString(),
          10,
        );
        const terminate_detail = project.value?.end_detail.unexpected_terminate_detail ?? '';

        const terminate_type_str = MarketingProjectTerminateTypeMap.get(terminate_type) ?? '';

        if (terminate_type === MarketingProjectTerminateTypeEnum.refund) {
          result =
            '退款 ' +
            (project.value.refund_total_amount_str !== ''
              ? formatAmount(project.value.refund_total_amount)
              : '--');
        } else {
          result = terminate_type_str + ' ' + terminate_detail;
        }
      } else {
        result = '';
      }
      return `意外终止：${result} ${end_time_str}`;
    } else {
      return '执行结果';
    }
  });

  /** 执行结束 弹窗 */
  const ProjectExecuteFinishVisible = ref(false);
  const changeProjectExecuteBtnClick = () => {
    ProjectExecuteFinishVisible.value = true;
  };
  const onProjectExecuteDialogModalClose = () => {
    ProjectExecuteFinishVisible.value = false;
  };

  const rollBackProjectVisible = ref<boolean>(false);
  const onProjectRollBackSave = () => {
    rollBackProjectVisible.value = false;
    // methods.getDetail();
    reloadCallback(true);
  };

  const steps = computed<Step[]>(() => [
    {
      title: '确定合作',
      description: project.value?.gmt_create
        ? moment(project.value?.gmt_create * 1000).format('YYYY.MM.DD')
        : '--',
    },
    {
      title: '执行项目',
      description: () =>
        h('div', [
          h('div', ['指定AE']),
          Permission.value.canEditProjectStep && canChangeAeList.value
            ? h(
                'a',
                {
                  style: {
                    fontSize: 'var(--small-font-size)',
                  },
                  on: {
                    click: () => {
                      changeAeBtnClick();
                    },
                  },
                },
                ['指定AE'],
              )
            : '',
        ]),
    },
    {
      title: () =>
        h('div', [
          h('span', ['执行结束']),
          Permission.value.canEndEditProjectStep && project.value?.end_type
            ? h(
                'tg-button',
                {
                  props: {
                    type: 'link',
                  },
                  style: {
                    marginLeft: '22px',
                    fontSize: '12px',
                  },
                  on: {
                    click: () => {
                      rollBackProjectVisible.value = true;
                    },
                  },
                },
                ['修改'],
              )
            : '',
        ]),
      //  '执行结束',
      description: () =>
        h('div', [
          h('div', [execute_result.value]),
          Permission.value.canEditProjectStep && canConfirmEndStatus.value
            ? h(
                'a',
                {
                  on: {
                    click: () => {
                      changeProjectExecuteBtnClick();
                    },
                  },
                },
                ['执行结束'],
              )
            : '',
        ]),
    },
  ]);
  const stepActiveNumber = computed(() => {
    const status = project.value?.cooperation_status;

    switch (status) {
      case ProjectCooperationStatusEnum.ImportData:
      case ProjectCooperationStatusEnum.ExecuteEnd: {
        return 3;
      }
      case ProjectCooperationStatusEnum.ExecuteProject: {
        return 2;
      }
      case ProjectCooperationStatusEnum.DetermineCooperation: {
        return 1;
      }
      case ProjectCooperationStatusEnum.InterestedCustomer:
      case undefined:
      default: {
        return 0;
      }
    }
  });

  const rollBackProjectInfo = computed((): RollBackProjectInfo => {
    return {
      projectId: project.value?.cooperation_id,
      projectType: ProjectTypeEnum.marketing,
    };
  });

  return {
    steps,
    stepActiveNumber,
    AeDialogVisible,
    changeAeBtnClick,
    onAeDialogModalClose,
    ProjectExecuteFinishVisible,
    changeProjectExecuteBtnClick,
    onProjectExecuteDialogModalClose,
    rollBackProjectVisible,
    onProjectRollBackSave,
    rollBackProjectInfo,
  };
};

export default defineComponent({
  name: 'TgMarketingProjectDetail',
  props: {
    id: {
      type: Number,
    },
    tab: {
      type: String,
    },
  },
  components: {
    AeDialogModal,
    ProjectExecuteFinishModal,
    info,
    achievement,
    cost,
    ae,
    contract,
    dailydata,
    settlement_income,
    settlement_cost,
    RollBackProject,
  },
  setup(props, ctx) {
    const routes = [
      {
        name: RouterNameProjectManage.marketing.project.list,
        title: '项目管理',
      },
      {
        path: '',
        title: '项目详情',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const router = useRouter();
    const project_id =
      router.currentRoute.params.project_id ||
      router.currentRoute.params.id ||
      router.currentRoute.query.id + '';
    /** 权限检查 */
    const Permission = computed(() => {
      const canEditProjectStep = HasPermission(RIGHT_CODE.marketing_project_step_edit);
      const canViewAchievementTab = HasPermission(RIGHT_CODE.marketing_project_achievement_view);
      const canViewCostTab = HasPermission(RIGHT_CODE.marketing_project_cost_view);
      const canViewAeTab = HasPermission(RIGHT_CODE.marketing_project_documentary_view);
      const canViewContractTab = HasPermission(RIGHT_CODE.marketing_project_contract_view);
      const view_or_save_coop_daily_report = HasPermission(
        RIGHT_CODE.view_or_save_coop_daily_report,
      );
      const canViewSettlementTab = HasPermission(RIGHT_CODE.marketing_project_settlement_view);

      return {
        canEditProjectStep,
        canViewAchievementTab,
        canViewCostTab,
        canViewAeTab,
        canViewContractTab,
        view_or_save_coop_daily_report,
        canViewSettlementTab,
      };
    });

    const tabs = useRefTabs(
      computed(() => {
        const tabList = [
          {
            label: '项目信息',
            value: 'info',
          },
        ];

        if (Permission.value.canViewSettlementTab) {
          tabList.push({
            label: '收入结算',
            value: 'settlement_income',
          });

          tabList.push({
            label: '成本结算',
            value: 'settlement_cost',
          });
        }

        if (Permission.value.canViewAchievementTab) {
          tabList.push({
            label: '项目收款',
            value: 'achievement',
          });
        }
        if (Permission.value.canViewCostTab) {
          tabList.push({
            label: '项目付款',
            value: 'cost',
          });
        }
        if (Permission.value.canViewAeTab) {
          tabList.push({
            label: '跟单表',
            value: 'ae',
          });
        }

        if (Permission.value.canViewContractTab) {
          tabList.push({
            label: '合同协议',
            value: 'contract',
          });
        }
        if (Permission.value.view_or_save_coop_daily_report) {
          tabList.push({
            label: '日报数据',
            value: 'dailydata',
          });
        }

        return tabList;
      }),
      props.tab ?? 'info',
    );

    watch(
      () => tabs.checkedTab.value,
      async (next, prev) => {
        if (prev !== next) {
          await ctx.root.$router.replace({
            params: props2RouteParams({
              ...props,
              tab: next,
            }),
          });
          showBackTitleHandle(routes);
        }
      },
    );

    onMounted(() => {
      resize();
    });

    const onTabChange = () => {
      // do sth
    };

    const MarketingProject = ref<ProjectDetail | undefined>(undefined);

    /** 获取项目详情 */
    const getProjectDetailHandler = async (reload = false) => {
      const reloadData = async (project_id: string) => {
        const { data: response } = await GetMarketingProjectDetail(project_id);
        MarketingProject.value = response.data;
      };
      if (props.id) {
        await reloadData(props.id.toString());
      } else if (reload) {
        await reloadData(project_id);
      }
    };
    onBeforeMount(() => {
      getProjectDetailHandler();
    });

    /** AE 列表 */
    const ProjectAeList = computed(() => MarketingProject.value?.ae);

    provide('MarketingProject', MarketingProject);
    provide('project', MarketingProject);

    watch(
      () => ctx.root.$store.getters['marketing/getProjectStateInfo'],
      newVal => {
        if (newVal) {
          /** 刷新详情页数据 */
          getProjectDetailHandler(true);
          if (MarketingProject.value?.cooperation_id) {
            getAEList(MarketingProject.value?.cooperation_id.toString());
          }
        }
      },
    );

    const getAEList = async (id: string) => {
      const { data: response } = await GetAEList({ cooperation_id: parseInt(id, 10) });

      if (response.success) {
        ctx.root.$store.dispatch('marketing/setAEList', response.data);
      } else {
        ctx.root.$message.warning('获取AE信息失败，稍后自动重试');

        // 获取失败间隔 5s 自动重新获取
        await sleep(5000);
        getAEList(id);
      }
    };

    onMounted(() => {
      getAEList(ctx.root.$route.params.id);
    });

    watch(
      () => ctx.root.$route.params.id,
      (next, prev) => {
        if (next !== prev) {
          getAEList(next);
        }
      },
    );

    return {
      Permission,
      ProjectAeList,
      MarketingProject,
      ...tabs,
      onTabChange,
      ...useProjectStep(MarketingProject, getProjectDetailHandler),
    };
  },
});
