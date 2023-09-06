import { computed, defineComponent, h, inject, ref, SetupContext } from '@vue/composition-api';
import type { PropType, Ref } from '@vue/composition-api';
import { CooperationTypeEnum, ProjectStatusEnum } from '@/types/tiange/common';
import type { LiveProject } from '@/types/tiange/live.project';
import projectFinal from '../dialog/projectstep/project.final.vue';
import projectTrial from '../dialog/projectstep/project.trial.vue';
import projectArea from '../dialog/projectstep/project.area.vue';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'TgLiveProjectStepBlock',
  components: {
    projectFinal,
    projectTrial,
    projectArea,
  },
  emits: ['getDetail'],
  props: {
    CurrentProject: {
      type: Object as PropType<LiveProject>,
    },
  },
  setup(props, ctx: SetupContext) {
    /** 项目阶段表单 */
    const ProjectStepTrialFormVisible = ref(false);
    const ProjectStepAreaFormVisible = ref(false);
    const ProjectStepFinalFormVisible = ref(false);

    /** 店播项目详情 项目阶段 */
    const project =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

    /** 步骤条激活项索引 */
    const stepActiveNumber = computed(() => {
      switch (project.value?.project_status) {
        case 1: {
          return 1;
        }
        case 2: {
          return 1;
        }
        case 3: {
          return 2;
        }
        case 4: {
          return 2;
        }
        case 5: {
          return 4;
        }
        default: {
          return 1;
        }
      }
    });

    /** 完成 */
    const project_end_str = computed(() => {
      const end_str =
        project.value?.end_type === 1
          ? '正常结束'
          : project.value?.end_type === 2
          ? '意外终止'
          : '';

      const end_detail =
        project.value?.end_detail.end_handle_type === 2
          ? `：${project.value?.end_detail.end_handle_detail}`
          : '：退款';

      return end_str + (project.value?.end_type === 2 ? end_detail : '');
    });

    const project_status = computed(() => project.value?.project_status ?? -1);

    const getDetail = () => {
      ctx.emit('getDetail');
    };
    const OpenProjectStepForm = (action_name: string) => {
      if (action_name === '项目完结') {
        ProjectStepFinalFormVisible.value = true;
      } else if (action_name === '区域执行') {
        ProjectStepAreaFormVisible.value = true;
      } else if (action_name === '项目试播') {
        ProjectStepTrialFormVisible.value = true;
      }
    };

    const onProjectTrailStepDialogModalClose = () => {
      ProjectStepTrialFormVisible.value = false;
    };
    const onProjectFinalStepDialogModalClose = () => {
      ProjectStepFinalFormVisible.value = false;
    };
    const onProjectAreaStepDialogModalClose = () => {
      ProjectStepAreaFormVisible.value = false;
    };
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    /** 权限检查 */
    const Permission = computed(() => {
      const canEditProjectStep = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_edit_project_status)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_status_edit)
        : HasPermission(RIGHT_CODE.live_project_status_edit);
      return { canEditProjectStep };
    });

    /** 项目进度数据 */
    const stepDateList = computed(() => {
      const {
        gmt_create,
        try_live_end_date,
        cooperation_type,
        total_live_num,
        total_duration,
        supplier_company_name,
      } = project.value ?? {
        gmt_create: '',
        try_live_end_date: '',
        cooperation_type: CooperationTypeEnum.selfSupport,
        total_live_num: 0,
        total_duration: 0,
        supplier_company_name: null,
      };

      return [
        {
          title: '项目创建',
          description: gmt_create.split(' ')[0].replace(/-/g, '.') ?? '',
        },
        {
          title: '项目试播',
          description: () =>
            h('div', [
              h('div', [try_live_end_date?.split(' ')[0].replace(/-/g, '.') ?? '']),
              Permission.value.canEditProjectStep &&
              project_status.value === ProjectStatusEnum.tryLive
                ? h(
                    'a',
                    {
                      on: {
                        click: () => {
                          OpenProjectStepForm('项目试播');
                        },
                      },
                    },
                    ['项目试播'],
                  )
                : '',
            ]),
        },
        ...(cooperation_type === CooperationTypeEnum.selfSupport
          ? [
              {
                title: '项目执行',
                description:
                  stepActiveNumber.value >= 2
                    ? `累计直播${total_live_num ?? 0}场，${total_duration ?? 0}小时`
                    : '',
              },
            ]
          : [
              {
                title: '区域执行',
                description: () =>
                  h('div', [
                    h('div', [stepActiveNumber.value >= 2 ? supplier_company_name ?? '' : '']),
                    Permission.value.canEditProjectStep &&
                    project_status.value === ProjectStatusEnum.regionExecution
                      ? h(
                          'a',
                          {
                            on: {
                              click: () => {
                                OpenProjectStepForm('区域执行');
                              },
                            },
                          },
                          ['区域执行'],
                        )
                      : '',
                  ]),
              },
            ]),
        {
          title: '项目完结',
          description: () =>
            h('div', [
              stepActiveNumber.value >= 4 ? project_end_str.value : '',
              Permission.value.canEditProjectStep &&
              [ProjectStatusEnum.regionExecution, ProjectStatusEnum.execution].includes(
                project_status.value,
              )
                ? h(
                    'a',
                    {
                      on: {
                        click: () => {
                          OpenProjectStepForm('项目完结');
                        },
                      },
                    },
                    ['项目完结'],
                  )
                : '',
            ]),
        },
      ];
    });

    return {
      Permission,
      onProjectAreaStepDialogModalClose,
      onProjectTrailStepDialogModalClose,
      onProjectFinalStepDialogModalClose,
      OpenProjectStepForm,
      ProjectStepTrialFormVisible,
      ProjectStepAreaFormVisible,
      ProjectStepFinalFormVisible,
      project_status,
      getDetail,
      stepDateList,
      stepActiveNumber,
    };
  },
});
