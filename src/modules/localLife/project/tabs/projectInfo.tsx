import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  provide,
  Ref,
  ref,
} from '@vue/composition-api';
import projectInfo from '@/modules/live/project/tabs/projectInfo/index.vue';
import live from '@/modules/live/project/tabs/live/index.vue';
import income from '@/modules/live/project/tabs/income/index.vue';
import cost from '@/modules/live/project/tabs/cost/index.vue';
import contract from '@/modules/customer/contract/list/index.vue';
import targetView from '@/modules/live/project/tabs/target/index.vue';
import setting from '@/modules/live/project/tabs/setting/index.vue';
import { LiveProject, LiveProjectDailydata } from '@/types/tiange/live.project';
import {
  GetLiveProjectDetail,
  GetShopLiveDailyReport,
  PostSaveLocalLifeDailyReportProject,
} from '@/services/live.project';
import {
  BusinessTypeMap,
  CooperationTypeEnum,
  CooperationTypeMap,
  SettlementCycleTypeMap,
} from '@/types/tiange/common';
import { HasPermission, usePermission } from '@/use/permission';
import { QueryInProjectReminds } from '@/services/live';
import { useRouter } from '@/use/vue-router';
import { UserInfo } from '@/types/tiange/system';
import Store from '@/store';
import { RIGHT_CODE } from '@/const/rightCode';
import { ProjectStatusEnum } from '@/types/tiange/common';
import { usePageJump } from '@/utils/pageJump';
import { formatAmount, formatAmountWithoutPrefix, get_limited_length_string } from '@/utils/string';
import AddLiveProject from '@/modules/live/project/dialog/projectform/index.vue';
import TeamMember from '@/modules/live/project/dialog/teamMember.vue';
import CalendarPage from '@/modules/commonBusiness/calendar/index.vue';
import projectFinal from '@/modules/live/project/dialog/projectstep/project.final.vue';
import projectTrial from '@/modules/live/project/dialog/projectstep/project.trial.vue';
import projectArea from '@/modules/live/project/dialog/projectstep/project.area.vue';
import RollBackProject from '@/modules/live/project/dialog/rollBack.project.vue';
import { ProjectTeamMemberProps } from '@/types/tiange/live';
import moment from 'moment';
import { RouterNameProjectManage } from '@/const/router';
import gmvTrend from '@/modules/localLife/components/gmv/index.vue';
import { useDialog } from '@/use/dialog';
import finishProject from '@/modules/live/project/dialog/finishProject/index.vue';
import prolongLiquidationPeriod from '@/modules/live/project/dialog/prolongLiquidationPeriod/index.vue';
import noAnchorImage from '@/assets/img/projectDetail/icon-local-life-weiguanlianzhubo.png';
import notFiledImage from '@/assets/img/projectDetail/icon-local-life-weiguidang.png';

export default defineComponent({
  name: 'TgLocalLifeProjectDetail',
  components: {
    projectInfo,
    live,
    income,
    cost,
    contract,
    targetView,
    setting,
    AddLiveProject,
    TeamMember,
    CalendarPage,
    projectFinal,
    projectTrial,
    projectArea,
    RollBackProject,
    gmvTrend,
  },
  props: {
    /** 项目ID */
    id: {
      type: Number,
      required: true,
    },
    tab: {
      type: String,
    },
    calendar: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const routes = [
      {
        name: RouterNameProjectManage.localLife.project.list,
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
    const permission = usePermission();
    const loading = ref<boolean>(false);
    const project_obj = inject<Ref<LiveProject | undefined>>('live_project') ?? ref(undefined);
    const project = ref<LiveProject | undefined>(project_obj.value);
    if (project_obj.value && project_obj.value?.id + '' === project_id + '') {
      project.value = project_obj.value;
    }
    provide('project', project);
    /** 供项目结算专用以区分项目类型 */
    provide('live_project', project);
    // 注入项目详情
    provide('project3in1', project);
    const teamMemberVisible = ref(false);
    const editProjectVisible = ref(false);
    const rollBackProjectVisible = ref(false);
    const ProjectStepAreaFormVisible = ref(false);
    const ProjectStepFinalFormVisible = ref(false);
    const ProjectStepTrialFormVisible = ref(false);
    const { jumpLocalLifeDetail } = usePageJump();
    const project_reminds = ref<any>({});
    const jumpToDetail = (type: number) => {
      jumpLocalLifeDetail({
        project_id: router.currentRoute.params.id || project.value?.id + '',
        business_type: project.value?.business_type + '',
        pathName:
          type === 1
            ? RouterNameProjectManage.localLife.detail.display
            : type === 2
            ? RouterNameProjectManage.localLife.detail.income
            : type === 3
            ? RouterNameProjectManage.localLife.detail.cost
            : type === 4
            ? RouterNameProjectManage.localLife.detail.contract
            : type === 5
            ? RouterNameProjectManage.localLife.detail.data
            : type === 6
            ? RouterNameProjectManage.localLife.detail.target
            : type === 8
            ? RouterNameProjectManage.localLife.detail.setting
            : '',
      });
    };
    const methods = {
      getDetail: async () => {
        const { data: response } = await GetLiveProjectDetail(
          project_id,
          E.project.BusinessType.locallife,
        );
        project.value = response.data;
        //存入本地项目详情
        localStorage.setItem('project3Live', JSON.stringify(project));
      },
      onTabChange: (type: number) => {
        if (type === 5) {
          ctx.root.$message.warning('暂不支持自动抓取');
          return;
        }
        if (type === 8 || type === 7) {
          ctx.root.$message.warning('敬请期待！');
          return;
        }
        if (permission.local_life_display_view && type === 1) {
          if (project.value?.cooperation_type === CooperationTypeEnum.selfSupport) {
            jumpToDetail(1);
          } else {
            ctx.root.$message.warning('暂不支持场次排班');
          }
        } else if (
          (permission.local_life_project_settlement_view ||
            permission.local_life_project_gathering_view) &&
          type === 2
        ) {
          jumpToDetail(2);
        } else if (
          ((permission.local_life_project_settlement_view &&
            project.value?.cooperation_type === CooperationTypeEnum.selfSupport) ||
            permission.local_life_project_pay_view) &&
          type === 3
        ) {
          jumpToDetail(3);
        } else if (permission.local_life_project_contract_view && type === 4) {
          jumpToDetail(4);
        } else if (permission.local_life_view_or_save_shop_daily_report && type === 5) {
          if (project.value?.cooperation_type === CooperationTypeEnum.selfSupport) {
            jumpToDetail(5);
          } else {
            ctx.root.$message.warning('只支持自营项目查看');
          }
        } else if (permission.local_life_project_target_view && type === 6) {
          if (project.value?.cooperation_type === CooperationTypeEnum.selfSupport) {
            jumpToDetail(6);
          } else {
            ctx.root.$message.warning('暂不支持目标设置');
          }
        } else if (type === 8) {
          jumpToDetail(8);
        } else {
          ctx.root.$message.warning('暂无权限');
        }
      },

      QueryInProjectRemind: async () => {
        loading.value = true;
        const res = await QueryInProjectReminds(project_id);
        loading.value = false;
        if (res.data.success) {
          project_reminds.value = res.data.data;
        }
      },
      onProjectEdit: () => {
        editProjectVisible.value = true;
      },
      onCustomerCompany: (customer_company_id: number | string) => {
        const path = '/customer/company/' + customer_company_id.toString();
        window.open(path);
      },
      onShopName: (shop_id: number) => {
        const path = '/customer/shop/' + shop_id.toString();
        window.open(path);
      },
      onProjectTeamEdit: () => {
        teamMemberVisible.value = true;
      },
      onEditProjectClose: async (success: boolean) => {
        editProjectVisible.value = false;
        if (success) {
          methods.getDetail();
        }
      },
      queryDailyData: (_: number, __: number) => {
        return GetShopLiveDailyReport(undefined, undefined, project_id);
      },
      onProjectTrailStepDialogModalClose: () => {
        ProjectStepTrialFormVisible.value = false;
      },
      onProjectFinalStepDialogModalClose: () => {
        ProjectStepFinalFormVisible.value = false;
      },
      onProjectAreaStepDialogModalClose: () => {
        ProjectStepAreaFormVisible.value = false;
      },
      openTestLiveDialog: () => {
        ProjectStepTrialFormVisible.value = true;
      },
      openAreaDialog: () => {
        ProjectStepAreaFormVisible.value = true;
        ProjectStepAreaFormVisible.value = true;
      },
      openFinishDialog: () => {
        ProjectStepFinalFormVisible.value = true;
      },
      onProjectRollBackEdit: () => {
        rollBackProjectVisible.value = true;
      },
      onTeamMemberSave: () => {
        teamMemberVisible.value = false;
        methods.getDetail();
      },

      formatAmountWithoutPrefix: (money: string) => {
        const new_money = money ? money : '0';
        return formatAmountWithoutPrefix(new_money);
      },
    };

    const editProjectReload = () => {
      methods.getDetail();
    };

    onBeforeMount(() => {
      // tabs.checkedTab.value = ctx.root.$route.params.tab
      /** 获取事件提醒 */
      methods.QueryInProjectRemind();
    });
    const project_cycle = computed(() => {
      if (project.value?.start_date && project.value?.end_date) {
        const start_date = project.value?.start_date.replace(/-/g, '.');
        const end_date = project.value?.end_date.replace(/-/g, '.');
        return `${start_date} - ${end_date}`;
      }
      return '--';
    });
    const userinfo = computed<UserInfo | null>(() => Store.getters['user/getUserInfo']);
    const isCustomerManager = computed(() => {
      if (userinfo.value?.id && project.value) {
        return userinfo.value.id === project.value.customer_manager_id;
      }
      return false;
    });
    const teamMemberEditEnabled = computed(() => {
      if (userinfo.value?.id && project.value) {
        return (
          userinfo.value.id === project.value.customer_manager_id ||
          userinfo.value.id === project.value.project_manager_id ||
          userinfo.value.id === project.value.add_by
        );
      }
      return false;
    });
    /** 权限检查 */
    const detailPermission = computed(() => {
      const canProjectEdit = HasPermission(RIGHT_CODE.local_life_project_save);
      const canEditProjectStatus = HasPermission(RIGHT_CODE.local_life_project_status_edit);
      const canEndEditProjectStatus = HasPermission(
        RIGHT_CODE.local_life_project_status_finish_edit,
      );
      const canUpdateEndProject = permission.local_life_update_end_project;
      return {
        canProjectEdit,
        canEditProjectStatus,
        canEndEditProjectStatus,
        canUpdateEndProject,
      };
    });
    const cooperation_type_str = computed(() =>
      CooperationTypeMap.get(project.value?.cooperation_type ?? 0),
    );
    const memberForEdit = computed(() => {
      return {
        project_manager_id: project.value?.project_manager_id,
        customer_manager_id: project.value?.customer_manager_id,
        project_manager_name: project.value?.project_manager,
        customer_manager_name: project.value?.customer_manager,
        team_members: project.value?.team_members,
      } as ProjectTeamMemberProps;
    });
    const project_status = computed(() => project.value?.project_status ?? -1);

    const project_status_str = computed(() => {
      if (
        project.value?.project_status === ProjectStatusEnum.regionExecution &&
        project.value?.supplier_company_name
      ) {
        return project.value.supplier_company_name;
      }
      const end_str =
        project.value?.end_type === 1
          ? '正常结束'
          : project.value?.end_type === 2
          ? '意外终止'
          : '';
      return end_str;
    });
    const project_end_time = computed(() => {
      const end_time = project.value?.end_time ?? 0;
      return moment(end_time * 1000).format('yyyy.MM.DD');
    });
    const project_reason_status_str = computed(() => {
      const end_detail =
        project.value?.end_detail.end_handle_type === 2
          ? `${project.value?.end_detail.end_handle_detail}`
          : '退款';
      return project.value?.end_type === 2 ? end_detail : '';
    });
    const getnewcoopcompany = (str: string) => {
      const { folded_text } = get_limited_length_string(str, 10);
      return folded_text;
    };
    const business_type_str = computed(() => {
      const str = BusinessTypeMap.get(project.value?.business_type ?? 0);
      return str;
    });
    const otherMembersStr = computed(() => {
      const members = project.value?.team_members.map(el => el.name) ?? [];
      return members.length ? members.join(' ') : '--';
    });
    const selectMonth = ref(moment().format('YYYY-MM'));
    const nextDateSwitchDisables = computed(() => {
      const maxMoment = moment().endOf('month');
      return moment(selectMonth.value).isSameOrAfter(maxMoment, 'month');
    });
    const onDateChange = (step: number) => {
      selectMonth.value = moment(selectMonth.value).clone().add(step, 'month').format('YYYY-MM');
      dailyDataHandle();
    };

    const rangeDays = ref([]);
    const dailyList = ref<LiveProjectDailydata[]>([]);
    const dailyGmv = ref(0);
    const dailyTrendList = ref<LiveProjectDailydata[]>([]);
    const daysArr = ref<number[]>([]);
    const dailyDataHandle = async () => {
      const begin = moment(selectMonth.value).startOf('month').format('YYYYMMDD');
      const end = moment(selectMonth.value).endOf('month').format('YYYYMMDD');
      const res = await GetShopLiveDailyReport(begin, end, project_id);
      if (res.data.success) {
        dailyList.value = res.data.data.data;
        const arr = (res.data.data.data || []).map(
          (item: { gmv: number; date: string | number | null }) => {
            return item.date ? item.gmv || 0 : 0;
          },
        );
        dailyGmv.value = arr.reduce(function (prev: number, cur: number) {
          return prev + cur;
        });

        if (dailyList.value.length === 28) {
          daysArr.value = Array.from({ length: 28 }, (x, i) => i);
        } else {
          daysArr.value = Array.from({ length: 35 }, (x, i) => i);
        }
        dailyTrendList.value = (JSON.parse(JSON.stringify(res.data.data.data)) || []).map(
          (item: LiveProjectDailydata) => {
            return {
              ...item,
              gmv: item.gmv !== null ? Number(item.gmv || 0) * 100 : null,
              goal_gmv: item.goal_gmv !== null ? Number(item.goal_gmv || 0) * 100 : null,
              goal_gmv_complete_rate: item.gmv_percent,
            };
          },
        );
      }
    };
    dailyDataHandle();
    const onInputBlur = (item: any) => {
      if (clickProjectDate.value === '') {
        return;
      }
      clickProjectDate.value = '';
      PostSaveLocalLifeDailyReportProject({
        goal_gmv: item.goal_gmv !== null ? item.goal_gmv + '' : '',
        gmv: item.gmv !== null ? item.gmv + '' : '',
        date: item.date,
        project_id: project_id,
      }).then(() => {
        dailyDataHandle();
      });
    };
    const clickProjectDate = ref('');
    const dialogFinishProject = useDialog({
      title: '项目完结',
      width: 428,
      okText: '提交',
      component: finishProject,
      on: {
        submit() {
          methods.getDetail();
        },
      },
    });
    const onFinishProjectHandler = () => {
      dialogFinishProject.show(project.value?.id, {
        isFromLocalLife: true,
      });
    };
    const dialogProlongLiquidationPeriod = useDialog({
      title: '延长清算期',
      width: 360,
      okText: '提交',
      component: prolongLiquidationPeriod,
      on: {
        submit() {
          methods.getDetail();
        },
      },
    });
    const onProlongLiquidationPeriodHandler = () => {
      dialogProlongLiquidationPeriod.show({
        ...project.value,
        isFromLocalLife: true,
      });
    };
    const settlement_cycle_type_str = computed(
      () => SettlementCycleTypeMap.get(project.value?.settlement_cycle_type ?? -1) ?? '',
    );
    const targetRef = ref<any>(null);
    return {
      targetRef,
      dailyGmv,
      settlement_cycle_type_str,
      noAnchorImage,
      notFiledImage,
      onProlongLiquidationPeriodHandler,
      onFinishProjectHandler,
      daysArr,
      dailyTrendList,
      clickProjectDate,
      onInputBlur,
      dailyDataHandle,
      rangeDays,
      dailyList,
      onDateChange,
      nextDateSwitchDisables,
      selectMonth,
      project_reminds,
      otherMembersStr,
      business_type_str,
      getnewcoopcompany,
      project_reason_status_str,
      project_end_time,
      project_status,
      project_status_str,
      ProjectStepTrialFormVisible,
      memberForEdit,
      ProjectStepFinalFormVisible,
      ProjectStepAreaFormVisible,
      rollBackProjectVisible,
      editProjectVisible,
      teamMemberVisible,
      ProjectStatusEnum,
      cooperation_type_str,
      detailPermission,
      isCustomerManager,
      teamMemberEditEnabled,
      project_cycle,
      loading,
      project,
      permission,
      editProjectReload,
      ...methods,
    };
  },
  render() {
    const { project, detailPermission, project_reminds } = this;
    const monthStr =
      project_reminds && project_reminds.need_set_goal_months
        ? project_reminds.need_set_goal_months.join(',')
        : '';
    return (
      <div v-loading={this.loading} class="tg-local-life-project-detail-page">
        <div class="project-info-scroll">
          <div class="project-info-left">
            {/*  项目基础信息 */}
            <div class="project-name-info filter-form-item-btn">
              <span class="project-name">{project?.project_name}</span>
              {project && detailPermission.canProjectEdit && (
                <tg-button class="project-edit" on-click={this.onProjectEdit}>
                  编辑项目
                </tg-button>
              )}
            </div>
            <div class="project-uid">{project?.project_uid}</div>
            {project?.project_status !== ProjectStatusEnum.finish && (
              <div class="project-status">
                <div style="width: 100%; display: flex; flex-direction: row; -ms-flex-align: start">
                  <div style="color: var(--text-third-color)">状态：</div>
                  <div style="width: 150px">
                    {project?.project_status === ProjectStatusEnum.tryLive && (
                      <div class="status" style="font-size: 12px; color: var(--warning-color)">
                        试播中
                        {project && detailPermission.canEditProjectStatus && (
                          <tg-button
                            class="edit-button"
                            type="link"
                            on-click={this.openTestLiveDialog}
                          >
                            <tg-icon name="ico-edit"></tg-icon>
                          </tg-button>
                        )}
                      </div>
                    )}
                    {project?.project_status === ProjectStatusEnum.execution && (
                      <div class="status" style="font-size: 12px; color: var(--warning-color)">
                        项目执行中
                        <tg-button
                          v-if="detailPermission.canEditProjectStatus"
                          class="edit-button"
                          type="link"
                          on-click={this.onFinishProjectHandler}
                        >
                          <tg-icon name="ico-edit"></tg-icon>
                        </tg-button>
                      </div>
                    )}
                    {project?.project_status === ProjectStatusEnum.executionEnd && (
                      <div class="status" style="font-size: 12px; color: var(--warning-color)">
                        执行结束
                        {/*{detailPermission.canEditProjectStatus && (
                          <tg-button
                            class="edit-button"
                            type="link"
                            on-click={this.openFinishDialog}
                          >
                            <tg-icon name="ico-edit"></tg-icon>
                          </tg-button>
                        )}*/}
                      </div>
                    )}
                    {project &&
                      project.cooperation_type === 2 &&
                      project.project_status === ProjectStatusEnum.regionExecution && (
                        <div class="status" style="font-size: 12px; color: var(--warning-color)">
                          区域执行中
                          {detailPermission.canEditProjectStatus && (
                            <tg-button
                              class="edit-button"
                              type="link"
                              on-click={this.onFinishProjectHandler}
                            >
                              <tg-icon name="ico-edit"></tg-icon>
                            </tg-button>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            {project &&
              !(
                (project.cooperation_type === 2 &&
                  project.project_status === ProjectStatusEnum.regionExecution) ||
                project.project_status !== ProjectStatusEnum.finish
              ) && (
                <div class="project-status">
                  <div style="width: 100%; display: flex; flex-direction: row; -ms-flex-align: start">
                    <div style="color: var(--text-third-color)">状态：</div>
                    <div style="width: 150px">
                      <div class="project-status-desc">
                        <div
                          class="status"
                          style={{
                            fontSize: '12px',
                            color:
                              project?.end_type === 1
                                ? 'var(--success-color)'
                                : 'var(--error-color)',
                          }}
                        >
                          {this.project_status_str}
                        </div>
                        {detailPermission.canUpdateEndProject ? (
                          <tg-button
                            class="edit-button"
                            type="link"
                            on-click={this.onProlongLiquidationPeriodHandler}
                          >
                            <tg-icon name="ico-edit"></tg-icon>
                          </tg-button>
                        ) : (
                          ''
                        )}
                      </div>
                      {/* {project?.end_time ? (
                        <div style="margin-top: 2px; color: var(--text-des-color); font-size: 12px">
                          {this.project_end_time}
                        </div>
                      ) : (
                        ''
                      )}*/}
                    </div>
                  </div>
                </div>
              )}
            {/*{project?.end_type === 2 && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  '-ms-flex-align': 'start',
                  'margin-top': '8px',
                }}
              >
                <div style="color: var(--text-third-color)">处理方案：</div>
                <div style="width: 180px; white-space: normal; word-wrap: break-word; overflow: hidden">
                  {this.project_reason_status_str}
                </div>
              </div>
            )}*/}
            {project &&
              project.cooperation_type === 2 &&
              (project.project_status === ProjectStatusEnum.regionExecution ||
                project.project_status === ProjectStatusEnum.finish ||
                project.project_status === ProjectStatusEnum.executionEnd) && (
                <div style="margin-top: 8px">
                  <span style="color: #6a7b92">合作公司：</span>
                  {project?.supplier_company_name && (
                    <span class="status" style="margin-right: 2px">
                      {detailPermission.canEditProjectStatus &&
                        project &&
                        (project.project_status === ProjectStatusEnum.regionExecution
                          ? project.supplier_company_name.length > 10
                          : project.supplier_company_name.length > 11) && (
                          <el-popover placement="right-start" trigger="hover">
                            <div>{project.supplier_company_name}</div>
                            <div
                              slot="reference"
                              class="live"
                              style={{
                                width: detailPermission.canEditProjectStatus ? '' : '162px',
                                display: 'inline-block',
                              }}
                            >
                              {this.getnewcoopcompany(project.supplier_company_name)}
                            </div>
                          </el-popover>
                        )}
                      {detailPermission.canEditProjectStatus &&
                        project &&
                        (project.project_status === ProjectStatusEnum.regionExecution
                          ? project.supplier_company_name.length <= 10
                          : project.supplier_company_name.length <= 11) && (
                          <div
                            class="live"
                            style={{
                              width: detailPermission.canEditProjectStatus ? '' : '162px',
                              display: 'inline-block',
                            }}
                          >
                            {project?.supplier_company_name || '--'}
                          </div>
                        )}
                      {detailPermission.canEditProjectStatus &&
                        project.project_status === ProjectStatusEnum.regionExecution && (
                          <tg-button class="edit-button" type="link" on-click={this.openAreaDialog}>
                            <tg-icon name="ico-edit"></tg-icon>
                          </tg-button>
                        )}
                    </span>
                  )}

                  {detailPermission.canEditProjectStatus &&
                  project.project_status === ProjectStatusEnum.regionExecution &&
                  !project?.supplier_company_name ? (
                    <tg-button type="link" on-click={this.openAreaDialog}>
                      点击添加
                    </tg-button>
                  ) : !project?.supplier_company_name ? (
                    '--'
                  ) : (
                    ''
                  )}
                </div>
              )}
            <div class="project-business-type">
              <span class="label">业务类型：</span>
              <span>{this.business_type_str}</span>
              <span
                class="cooperation-type"
                style={{
                  color: project?.cooperation_type === 2 ? '#FF7A36' : 'var(--warning-color)',
                  borderColor: project?.cooperation_type === 2 ? '#FF7A36' : 'var(--warning-color)',
                }}
              >
                {this.cooperation_type_str}
              </span>
            </div>
            <div class="feishu-department">
              <span class="label">所属部门：</span>
              <span>{project?.feishu_department_name ? project.feishu_department_name : '--'}</span>
            </div>
            <div class="customer-company">
              <span class="label">客户公司：</span>
              <tg-button
                class="arrow-btn"
                type="link"
                on-click={() => this.onCustomerCompany(project ? project.company_id : 0)}
              >
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  open-delay={300}
                  content={project?.customer_company_name}
                >
                  <span slot="reference" class="line-clamp-2" style="width: 130px">
                    {project?.customer_company_name}
                  </span>
                </el-popover>
                <tg-icon name="ico-arrow-right"></tg-icon>
              </tg-button>
            </div>
            <div class="shop-brand">
              <span class="label">品牌名称：</span>
              <span>{project?.brand_name || '--'}</span>
            </div>
            <div class="studio">
              <span class="label">直播间：</span>
              <span>{project?.studio_name || '--'}</span>
            </div>
            <div class="project-circle" style="margin-top: 24px">
              <span class="label">项目周期：</span>
              <span>{this.project_cycle}</span>
            </div>
            <div class="settlement-circle">
              <span class="label">结算周期：</span>
              <span>{this.settlement_cycle_type_str}</span>
            </div>
            <div class={!this.teamMemberEditEnabled ? 'mgt-24 project-manager' : 'project-manager'}>
              <span class="label">项目经理：</span>
              <span>{project?.project_manager || '--'}</span>
            </div>
            <div class="customer-manager">
              <span class="label">客户经理：</span>
              <span>{project?.customer_manager || '--'}</span>
            </div>
            <div class="other-members">
              <span class="label">其他成员：</span>
              <span>
                <span>{this.otherMembersStr}</span>
                {this.teamMemberEditEnabled && (
                  <tg-button
                    class="edit-people-button"
                    type="link"
                    on-click={this.onProjectTeamEdit}
                  >
                    <tg-icon name="ico-edit"></tg-icon>
                  </tg-button>
                )}
              </span>
            </div>
          </div>
          <div class="project-info-right">
            <div class="box-right">
              <div class="tab-box">
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(1);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico"></tg-button>
                      <span>直播场次</span>
                    </div>
                    {project?.cooperation_type !== CooperationTypeEnum.selfSupport ? (
                      <div class="decrease">暂不支持场次排班</div>
                    ) : project_reminds &&
                      (project_reminds.not_archive_live_count ||
                        project_reminds.not_associate_live_count) ? (
                      <div class="decrease reminds live">
                        {project_reminds.not_associate_live_count > 0 && (
                          <div>
                            <span>{project_reminds.not_associate_live_count}</span>
                            场直播未关联主播
                            {/* <el-popover trigger={'hover'} width="640" placement="bottom-start">
                              <div style="display:inline-block;margin-left:4px " slot="reference">
                                <tg-icon
                                  name="ico-icon_explain"
                                  style="font-size: 14px; color: var(--icon-color)"
                                ></tg-icon>
                              </div>
                              <div class="date-box">
                                <div class="date-box-content">
                                  <img
                                    style="height:320px;width:600px;border: 1px solid var(--border-line-color);"
                                    src={this.noAnchorImage}
                                    onerror={(e: any) => {
                                      e.target.src = this.noAnchorImage;
                                    }}
                                  />
                                </div>
                              </div>
                            </el-popover>*/}
                          </div>
                        )}
                        {project_reminds.not_archive_live_count > 0 && (
                          <div>
                            <span>{project_reminds.not_archive_live_count}</span>
                            场直播未完成归档
                            <el-popover trigger={'hover'} width="640" placement="bottom-start">
                              <div style="display:inline-block;margin-left:4px" slot="reference">
                                <tg-icon
                                  name="ico-icon_explain"
                                  style="font-size: 14px; color: var(--icon-color)"
                                ></tg-icon>
                              </div>
                              <div class="date-box">
                                <div class="date-box-content">
                                  <img
                                    style="height:320px;width:600px;border: 1px solid var(--border-line-color);"
                                    src={this.notFiledImage}
                                    onerror={(e: any) => {
                                      e.target.src = this.notFiledImage;
                                    }}
                                  />
                                </div>
                              </div>
                            </el-popover>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div class="decrease">暂无待办事项</div>
                    )}
                  </div>
                  <div class="live-session-bg"></div>
                </div>
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(2);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico income"></tg-button>
                      <span>项目收入</span>
                    </div>
                    {project_reminds &&
                    (project_reminds.not_write_off_receivable_count > 0 ||
                      project_reminds.not_received_achievement_count > 0) ? (
                      <div class="decrease reminds">
                        {project_reminds.not_write_off_receivable_count > 0 && (
                          <div>
                            <span>{project_reminds.not_write_off_receivable_count}</span>
                            笔应收款未完成核销
                          </div>
                        )}
                        {project_reminds.not_received_achievement_count > 0 && (
                          <div>
                            <span>{project_reminds.not_received_achievement_count}</span>
                            笔预收款未到账
                          </div>
                        )}
                      </div>
                    ) : (
                      <div class="decrease">暂无待办事项</div>
                    )}
                  </div>
                  <div class="live-session-bg income"></div>
                </div>
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(3);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico cost"></tg-button>
                      <span>项目成本</span>
                    </div>
                    {project_reminds && project_reminds.not_write_off_invoice_cost_count > 0 ? (
                      <div class="decrease reminds">
                        {project_reminds.not_write_off_invoice_cost_count > 0 && (
                          <div>
                            <span>{project_reminds.not_write_off_invoice_cost_count}</span>
                            笔成本未核销发票
                          </div>
                        )}
                      </div>
                    ) : (
                      <div class="decrease">暂无待办事项</div>
                    )}
                  </div>
                  <div class="live-session-bg cost"></div>
                </div>
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(4);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico contract"></tg-button>
                      <span>合同协议</span>
                    </div>
                    <div class="decrease reminds contract">
                      <div class="left">
                        <div>
                          客户合同
                          <span>
                            {(project_reminds && project_reminds.customer_contract_count) || 0}
                          </span>
                        </div>
                      </div>
                      <div class="right">
                        <div>
                          供应商合同
                          <span>
                            {(project_reminds && project_reminds.supplier_contract_count) || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="live-session-bg contract"></div>
                </div>
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(5);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico data"></tg-button>
                      <span>运营数据</span>
                    </div>
                    <div class="decrease">暂不支持自动抓取</div>
                    {/* {project_reminds && this.is_support_auto ? (
                      <div class="decrease reminds">更新时间：2023.06.03 9:11</div>
                    ) : (
                      <div class="decrease">暂不支持自动抓取</div>
                    )}*/}
                  </div>
                  <div class="live-session-bg data"></div>
                </div>
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(6);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico target"></tg-button>
                      <span>目标设置</span>
                    </div>
                    {project?.cooperation_type !== CooperationTypeEnum.selfSupport ? (
                      <div class="decrease">暂不支持目标设置</div>
                    ) : project_reminds &&
                      project_reminds.need_set_goal_months &&
                      project_reminds.need_set_goal_months.length > 0 ? (
                      <div ref="targetRef" class="decrease reminds target">
                        <div
                          style={{
                            'flex-direction':
                              monthStr.length * 11 > (this.targetRef?.clientWidth || 168)
                                ? 'column'
                                : 'row',
                          }}
                        >
                          <span>{monthStr}</span>
                          <span class="des-span">月份目标待设置</span>
                        </div>
                      </div>
                    ) : (
                      <div class="decrease">暂无待办事项</div>
                    )}
                  </div>
                  <div class="live-session-bg target"></div>
                </div>
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(7);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico streaming"></tg-button>
                      <span>直播工具</span>
                    </div>
                    <div class="decrease">敬请期待！</div>
                  </div>
                  <div class="live-session-bg streaming"></div>
                </div>
                <div
                  class="value-box"
                  on-click={() => {
                    this.onTabChange(8);
                  }}
                >
                  <div class="value-div">
                    <div class="value">
                      <tg-button class="live-session-ico setting"></tg-button>
                      <span>项目设置</span>
                    </div>
                    <div class="decrease">敬请期待！</div>
                    {/*{(project_reminds &&
                      project_reminds.is_auto_settlement_enable &&
                      project_reminds.is_stock_monitor_enable) ||
                    !project_reminds ? (
                      <div class="decrease reminds">
                        <div>暂无待办事项</div>
                      </div>
                    ) : (
                      <div class="decrease">
                        自动结算
                        {project_reminds.is_auto_settlement_enable ? '已开启' : '暂未开启'}
                        、库存设置
                        {project_reminds.is_stock_monitor_enable ? '已开启' : '暂未开启'}
                      </div>
                    )}*/}
                  </div>
                  <div class="live-session-bg setting"></div>
                </div>
              </div>
              <div>
                <div class="schedule-header btns mgr-12">
                  <div class="date-select">
                    <tg-button
                      disabled={this.prevDateSwitchDisables}
                      class="time-btn"
                      type="link"
                      on-click={() => this.onDateChange(-1)}
                    >
                      <tg-icon name="ico-arrow-left"></tg-icon>
                    </tg-button>
                    {/* <span class="display-time">{this.displayDate}</span> */}
                    {/* {console.log(this.dateV[this.dateType], 'click')} */}
                    <el-date-picker
                      size="mini"
                      clearable={false}
                      v-model={this.selectMonth}
                      picker-options={{
                        disabledDate: (current: any) => {
                          const end = moment();
                          return current.valueOf() > end.valueOf();
                        },
                      }}
                      type={'month'}
                      prefix-icon="null"
                      // picker-options="{ firstDayOfWeek: 1 }"
                      // format="yyyy第WW周"
                      format="yyyy年MM月"
                      placeholder="选择月"
                      class="date-switch"
                      popper-class="projectDetail_detes"
                      style={{
                        width: '100px',
                        height: '32px',
                      }}
                      on-change={this.dailyDataHandle}
                    ></el-date-picker>
                    <tg-button
                      disabled={this.nextDateSwitchDisables}
                      class="time-btn"
                      type="link"
                      on-click={() => this.onDateChange(1)}
                    >
                      <tg-icon name="ico-arrow-right"></tg-icon>
                    </tg-button>
                  </div>
                </div>
                <div class="schedule-header mgr-12">
                  <head-lines
                    style="margin: 0 0 12px 0;width:200px"
                    title-font={14}
                    title={'GMV趋势'}
                  />
                </div>
                <gmv-trend
                  showZoom={false}
                  gmvData={{
                    trend: this.dailyTrendList,
                  }}
                  fontSize={14}
                  heightChart={150}
                  style="margin-left:-12px;"
                ></gmv-trend>
                <div class="schedule-header mgr-12">
                  <head-lines
                    style="margin: 16px 0 12px 0;width:200px"
                    title-font={14}
                    title={'GMV录入'}
                  />
                  <div class="gmv-div">
                    {moment(this.selectMonth).format('MM')}月GMV：
                    <span>{formatAmount(this.dailyGmv || '0', '¥', true)}</span>
                  </div>
                </div>
                <div class="daily-div ">
                  {this.daysArr.map((num: number) => {
                    if (num < this.dailyList.length) {
                      const item = this.dailyList[num];
                      return item && item.date ? (
                        <div class="date-div">
                          <div class="date">{moment(item.date + '').format('DD日')}</div>
                          {this.clickProjectDate === item.date + '' ? (
                            <div class={['el-input-div ']}>
                              <el-input
                                v-focus
                                v-model={item.gmv}
                                size="mini"
                                onInput={(value: string) => {
                                  const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
                                  item.gmv = match ? match[0] : '';
                                }}
                                onBlur={() => {
                                  this.onInputBlur(item);
                                }}
                                v-key-enter={() => {
                                  this.onInputBlur(item);
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              class={['information-div ']}
                              on-dblclick={() => {
                                this.clickProjectDate = item.date + '';
                              }}
                            >
                              {item.gmv && formatAmount(String(item.gmv || 0), 'None', false)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div class="date-div"></div>
                      );
                    }
                    return <div class="date-div"></div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <add-live-project
          visible={this.editProjectVisible}
          project={project}
          isEditForm={true}
          on={{
            'dialog:close': this.onEditProjectClose,
          }}
        />
        <project-trial
          ref="projectTrial"
          visible={this.ProjectStepTrialFormVisible}
          step={this.project_status}
          on={{
            'ProjectTrailStep:close': this.onProjectTrailStepDialogModalClose,
            getDetail: this.getDetail,
          }}
        />
        <project-area
          ref="projectArea"
          visible={this.ProjectStepAreaFormVisible}
          on={{
            'ProjectAreaStep:close': this.onProjectAreaStepDialogModalClose,
            getDetail: this.getDetail,
          }}
        />
        <project-final
          ref="projectFinal"
          visible={this.ProjectStepFinalFormVisible}
          status={project?.project_status}
          on={{
            'ProjectFinalStep:close': this.onProjectFinalStepDialogModalClose,
            getDetail: this.getDetail,
          }}
        />
        <team-member
          projectId={project?.id}
          member={this.memberForEdit}
          creator={project?.add_by_username}
          visible={this.teamMemberVisible}
          on={{
            close: () => {
              this.teamMemberVisible = false;
            },
            save: this.onTeamMemberSave,
          }}
        ></team-member>
      </div>
    );
  },
});
