/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-09-29 09:49:49
 */

import {
  BusinessTypeEnum,
  BusinessTypeMap,
  CooperationTypeEnum,
  CooperationTypeMap,
  ProjectTypeEnum,
  SettlementCycleTypeMap,
} from '@/types/tiange/common';
import { LiveProject } from '@/types/tiange/live.project';
import { TableColumn } from '@/types/vendor/column';
import { defineComponent, computed, h, ref, inject, Ref } from '@vue/composition-api';
import AddLiveProject from '@/modules/live/project/dialog/projectform/index.vue';
import TeamMember from '../../dialog/teamMember.vue';
import CalendarPage from '@/modules/commonBusiness/calendar/index.vue';
import { GetShopLiveAuthStatus, GetShopLiveDailyReport } from '@/services/live.project';
import { useRouter } from '@/use/vue-router';
import projectFinal from '@/modules/live/project/dialog/projectstep/project.final.vue';
import projectTrial from '@/modules/live/project/dialog/projectstep/project.trial.vue';
import projectArea from '@/modules/live/project/dialog/projectstep/project.area.vue';
import RollBackProject from '@/modules/live/project/dialog/rollBack.project.vue';
import {
  ProjectShopLive,
  ProjectShopLiveParams,
  ProjectTeamMemberProps,
  ShopLiveProfitStatData,
  TodaySchedule,
} from '@/types/tiange/live';
import {
  QueryProjectShopLive,
  QueryShopLiveProfitStatData,
  QueryTodayLiveScheduleDetail,
  QueryTodayLiveScheduleWarningDetail,
  querySupplyChainScheduledWarning,
} from '@/services/live';
import moment from 'moment';
import { formatAmountWithoutPrefix, get_limited_length_string } from '@/utils/string';
import { HasPermission, usePermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { UserInfo } from '@/types/tiange/system';
import Store from '@/store';
import { RollBackProjectInfo } from '@/modules/live/project/dialog/rollBack.project';
import { ProjectStatusEnum } from '@/types/tiange/common';
import { usePageJump } from '@/utils/pageJump';
import prolongLiquidationPeriod from '@/modules/live/project/dialog/prolongLiquidationPeriod/index.vue';
import finishProject from '@/modules/live/project/dialog/finishProject/index.vue';
import { useDialog } from '@/use/dialog';
import { RouterNameProjectManage } from '@/const/router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import notFiledImage from '@/assets/img/projectDetail/icon-local-life-weiguidang.png';
import live from '@/assets/img/projectDetail/icon-local-life-live-session-ico.png';
import income from '@/assets/img/projectDetail/icon-local-life-income-ico.png';
import cost from '@/assets/img/projectDetail/icon-local-life-cost-ico.png';
import contract from '@/assets/img/projectDetail/icon-local-life-contract-ico.png';
import data from '@/assets/img/projectDetail/icon-local-life-data-ico.png';
import target from '@/assets/img/projectDetail/icon-local-life-target-ico.png';
// import live from '@/assets/img/projectDetail/icon-local-life-live-session-ico.png';
import setting from '@/assets/img/projectDetail/icon-local-life-setting-ico.png';

import liveBg from '@/assets/img/projectDetail/icon-local-life-live-session-bg.png';
import incomeBg from '@/assets/img/projectDetail/icon-local-life-income-bg.png';
import costBg from '@/assets/img/projectDetail/icon-local-life-cost-bg.png';
import contractBg from '@/assets/img/projectDetail/icon-local-life-contract-bg.png';
import dataBg from '@/assets/img/projectDetail/icon-local-life-data-bg.png';
import targetBg from '@/assets/img/projectDetail/icon-local-life-target-bg.png';
// import liveBg from '@/assets/img/projectDetail/icon-local-life-live-session-bg.png';
import settingBg from '@/assets/img/projectDetail/icon-local-life-setting-bg.png';

export default defineComponent({
  components: {
    AddLiveProject,
    TeamMember,
    CalendarPage,
    projectFinal,
    projectTrial,
    projectArea,
    RollBackProject,
  },
  setup(props, ctx) {
    const permission = usePermission();
    const currentDate = moment();
    // const remindsData = ref<any>({});
    const { business_type, isFromSupplyChain } = useProjectBaseInfo();
    const userinfo = computed<UserInfo | null>(() => Store.getters['user/getUserInfo']);
    // const reqQueryReminds = useRequest(QueryInProjectReminds, {
    //   manual: true,
    //   onSuccess(data) {
    //     remindsData.value = data || {};
    //   },
    // });

    /** 权限检查 */
    const Permission = computed(() => {
      const canProjectEdit = HasPermission(
        isFromSupplyChain.value ? RIGHT_CODE.supply_edit_project : RIGHT_CODE.live_project_save,
      );
      const canEditProjectStatus = HasPermission(
        isFromSupplyChain.value
          ? RIGHT_CODE.supply_edit_project_status
          : RIGHT_CODE.live_project_status_edit,
      );
      const canEndEditProjectStatus = HasPermission(
        isFromSupplyChain.value
          ? RIGHT_CODE.supply_edit_project_status
          : RIGHT_CODE.live_project_status_finish_edit,
      );
      const canUpdateEndProject = isFromSupplyChain.value
        ? RIGHT_CODE.supply_update_project_end_status
        : permission.update_end_project;
      return {
        canProjectEdit,
        canEditProjectStatus,
        canEndEditProjectStatus,
        canUpdateEndProject,
      };
    });

    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const injectProject =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);
    const project = computed(() => {
      if (injectProject.value) {
        if (injectProject.value.cooperation_type === CooperationTypeEnum.selfSupport) {
          if (injectProject.value.business_type === 2 || injectProject.value.business_type === 8) {
            methods.queryTodayLiveScheduleDetail(); //今日排班，淘宝
          } else if (isFromSupplyChain.value) {
            methods.querySupplyChainScheduledWarning(); //排班预警，抖音
          } else {
            methods.QueryTodayLiveScheduleWarningDetail(); //排班预警，抖音
          }
          methods.queryProjectShopLive();
        }
      }
      return injectProject.value ?? {};
    });
    const project_cycle = computed(() => {
      if (injectProject.value?.start_date && injectProject.value?.end_date) {
        const start_date = injectProject.value?.start_date.replace(/-/g, '.');
        const end_date = injectProject.value?.end_date.replace(/-/g, '.');
        return `${start_date} - ${end_date}`;
      }
      return '--';
    });
    const cooperation_type_str = computed(() =>
      CooperationTypeMap.get(injectProject.value?.cooperation_type ?? 0),
    );
    const business_type_str = computed(() => {
      const str = BusinessTypeMap.get(injectProject.value?.business_type ?? 0);
      return str;
    });
    const settlement_cycle_type = computed(() =>
      SettlementCycleTypeMap.get(injectProject.value?.settlement_cycle_type ?? 0),
    );

    const project_end_time = computed(() => {
      const end_time = injectProject.value?.end_time ?? 0;
      return moment(end_time * 1000).format('yyyy.MM.DD');
    });

    const withoutDailyDataPermission = ref<boolean>(false);
    const withoutLiveDisplayPermission = ref<boolean>(false);

    const liveDatas = ref<ProjectShopLive[]>([]);
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

    const todayScheduleData = ref<TodaySchedule | undefined>(undefined);
    const scheduleWarningObj = ref({
      live_no_kol: 0,
      long_live_kol_id: undefined,
      live_no_file: 0,
      long_live_file_id: undefined,
    });
    const editProjectVisible = ref<boolean>(false);
    const teamMemberVisible = ref<boolean>(false);

    const ProjectStepTrialFormVisible = ref<boolean>(false);
    const ProjectStepAreaFormVisible = ref<boolean>(false);
    const ProjectStepFinalFormVisible = ref<boolean>(false);
    const rollBackProjectVisible = ref<boolean>(false);

    // const project_status_str = computed(() => {
    //   return ProjectStatusMap.get(injectProject.value?.project_status ?? 0);
    // });
    const project_status = computed(() => injectProject.value?.project_status ?? -1);

    const project_status_str = computed(() => {
      if (
        injectProject.value?.project_status === ProjectStatusEnum.regionExecution &&
        injectProject.value?.supplier_company_name
      ) {
        return injectProject.value.supplier_company_name;
      }
      const end_str =
        injectProject.value?.end_type === 1
          ? '正常结束'
          : injectProject.value?.end_type === 2
          ? '意外终止'
          : '';

      return end_str;
    });
    const project_reason_status_str = computed(() => {
      const end_detail =
        injectProject.value?.end_detail.end_handle_type === 2
          ? `${injectProject.value?.end_detail.end_handle_detail}`
          : '退款';
      return injectProject.value?.end_type === 2 ? end_detail : '';
    });

    const otherMembersStr = computed(() => {
      const members = injectProject.value?.team_members.map(el => el.name) ?? [];
      return members.length ? members.join(' ') : '--';
    });

    const memberForEdit = computed(() => {
      return {
        project_manager_id: injectProject.value?.project_manager_id,
        customer_manager_id: injectProject.value?.customer_manager_id,
        project_manager_name: injectProject.value?.project_manager,
        customer_manager_name: injectProject.value?.customer_manager,
        team_members: injectProject.value?.team_members,
      } as ProjectTeamMemberProps;
    });

    const isCustomerManager = computed(() => {
      if (userinfo.value?.id && injectProject.value) {
        return userinfo.value.id === injectProject.value.customer_manager_id;
      }
      return false;
    });
    const teamMemberEditEnabled = computed(() => {
      if (userinfo.value?.id && injectProject.value) {
        return (
          userinfo.value.id === injectProject.value.customer_manager_id ||
          userinfo.value.id === injectProject.value.project_manager_id ||
          userinfo.value.id === injectProject.value.add_by
        );
      }
      return false;
    });

    const noTodayKolScheduleData = computed(() => {
      return (todayScheduleData.value?.kol_schedule_list ?? []).length ? false : true;
    });
    const noTodayOperatorScheduleData = computed(() => {
      return (todayScheduleData.value?.operator_schedule_list ?? []).length ? false : true;
    });

    const rollBackProjectInfo = computed((): RollBackProjectInfo => {
      return {
        projectId: injectProject.value?.id,
        cooperationType: injectProject.value?.cooperation_type,
        projectType: ProjectTypeEnum.live,
      };
    });

    const liveColumns = computed<TableColumn<ProjectShopLive>[]>(() => [
      {
        label: '直播标题',
        minWidth: 160,
        formatter: row => {
          return h(
            'div',
            {
              class: methods.is_today(row.live_start_time) ? 'today line-clamp-1' : 'line-clamp-1',
            },
            [row.live_title ? row.live_title : '--'],
          );
        },
      },
      {
        label: '直播时间',
        minWidth: 186,
        align: 'left',
        formatter: row => {
          if (row.live_start_time && row.live_end_time) {
            const startDate = moment(row.live_start_time);
            const endDate = moment(row.live_end_time);
            const isSameDay = startDate.isSame(endDate, 'd');
            let live_time = `${startDate.format('MM.DD HH:mm')} ~ ${endDate.format('HH:mm')}`;
            if (!isSameDay) {
              const dateOfStartDate = startDate.date();
              const dateOfEndDate = endDate.date();
              const tomorrowDate = startDate.clone().date(dateOfStartDate + 1);
              const sameOfTomorrow = tomorrowDate.isSame(endDate, 'd');

              if (sameOfTomorrow) {
                live_time = `${live_time}(次日)`;
              } else {
                live_time = `${live_time}(${dateOfEndDate}日)`;
              }
            }
            return live_time;
          }
          return '--';
        },
      },
      {
        label: '人员排班',
        minWidth: 84,
        align: 'right',
        formatter: row => {
          const is_finished = row.is_kol_scheduled;
          const classNmae = methods.is_before(row.live_start_time) && !is_finished ? 'warning' : '';
          return h(
            'div',
            {
              class: 'live-status',
            },
            [
              h('span', {
                class: classNmae,
              }),
              h('span', [is_finished ? '已排班' : '未排班']),
            ],
          );
        },
      },
      {
        label: '数据录入',
        minWidth: 84,
        align: 'center',
        formatter: row => {
          const is_finished = row.is_entry_live_data;
          const classNmae = methods.is_before(row.live_start_time) && !is_finished ? 'warning' : '';
          return h(
            'div',
            {
              class: 'live-status',
              style: {
                justifyContent: 'center',
              },
            },
            [
              h('span', {
                class: classNmae,
              }),
              h('span', [is_finished ? '已录入' : '待录入']),
            ],
          );
        },
      },
      {
        label: '是否归档',
        minWidth: 84,
        align: 'right',
        formatter: row => {
          const is_finished = row.live_status === 4;
          const classNmae = methods.is_before(row.live_start_time) && !is_finished ? 'warning' : '';
          return h(
            'div',
            {
              class: 'live-status',
            },
            [
              h('span', {
                class: classNmae,
              }),
              h('span', [is_finished ? '已归档' : '未归档']),
            ],
          );
        },
      },
    ]);

    const methods = {
      // 调转详情
      jumpDetail: (row: { id: number }) => {
        if (row.id && row.id !== 0) {
          usePageJump().jumpLiveDisplayDetail({
            project_id: `${project_id}`,
            live_id: `${row.id}`,
            newWindow: true,
          });
        }
      },
      onProjectEdit: () => {
        editProjectVisible.value = true;
      },
      onCustomerCompany: (customer_company_id: number) => {
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
      /** 项目阶段
       * 1-项目创建
       * 2-项目试播
       * 3-项目执行
       * 4-区域执行
       * 5-项目完结
       */
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
      getDetail: () => {
        ctx.emit('editProjectReload');
      },
      onTeamMemberSave: () => {
        teamMemberVisible.value = false;
        methods.getDetail();
      },
      /** 获取直播场次数据 */
      queryProjectShopLive: async () => {
        let baseDate = currentDate;
        if (injectProject.value?.project_status === ProjectStatusEnum.finish) {
          baseDate = moment(injectProject.value.end_date);
        }
        const time_format = 'yyyy-MM-DD';
        const start_day = baseDate.clone().startOf('week');
        const end_day = baseDate.clone().endOf('week');

        const params: ProjectShopLiveParams = {
          project_id: project_id,
          live_start_date: start_day.format(time_format),
          live_end_date: end_day.format(time_format),
          is_rest_day: 0,
          num: 1000,
          page_num: 1,
        };
        const res = await QueryProjectShopLive(params, business_type.value);
        if (res.data.success) {
          withoutLiveDisplayPermission.value = false;
          liveDatas.value = res.data.data.data;
        } else {
          if (res.data.error_code === 200) {
            withoutLiveDisplayPermission.value = true;
          } else {
            withoutLiveDisplayPermission.value = false;
          }
        }
      },
      queryShopLiveProfitStatData: async () => {
        const res = await QueryShopLiveProfitStatData(project_id);
        if (res.data.success) {
          profitData.value = res.data.data;
        }
      },
      is_before: (day: string) => {
        const liveDate = moment(day);
        return liveDate.isBefore(currentDate, 'd');
      },
      is_today: (day: string) => {
        const liveDate = moment(day);
        return liveDate.isSame(currentDate, 'd');
      },
      formatAmountWithoutPrefix: (money: string) => {
        const new_money = money ? money : '0';
        return formatAmountWithoutPrefix(new_money);
      },
      withoutPermission: () => {
        withoutDailyDataPermission.value = true;
      },
      queryTodayLiveScheduleDetail: async () => {
        const res = await QueryTodayLiveScheduleDetail(project_id);
        if (res.data.success) {
          todayScheduleData.value = res.data.data;
        }
      },
      QueryTodayLiveScheduleWarningDetail: async () => {
        const res = await QueryTodayLiveScheduleWarningDetail(project_id);
        if (res.data.success) {
          scheduleWarningObj.value = {
            live_no_kol: res.data.data.not_kol_scheduled || 0,
            live_no_file: res.data.data.live_status_not_4 || 0,
            long_live_kol_id: res.data.data.first_not_kol_scheduled
              ? res.data.data.first_not_kol_scheduled.id
              : undefined,
            long_live_file_id: res.data.data.first_live_status_not4
              ? res.data.data.first_live_status_not4.id
              : undefined,
          };
        }
      },
      querySupplyChainScheduledWarning: async () => {
        console.log('querySupplyChainScheduledWarning');

        const res = await querySupplyChainScheduledWarning(project_id);
        if (res.data.success) {
          scheduleWarningObj.value = {
            live_no_kol: res.data.data.not_kol_scheduled || 0,
            live_no_file: res.data.data.live_status_not_4 || 0,
            long_live_kol_id: res.data.data.first_not_kol_scheduled
              ? res.data.data.first_not_kol_scheduled.id
              : undefined,
            long_live_file_id: res.data.data.first_live_status_not4
              ? res.data.data.first_live_status_not4.id
              : undefined,
          };
        }
      },
      onProjectRollBackSave: () => {
        rollBackProjectVisible.value = false;
        methods.getDetail();
      },
    };
    const getnewcoopcompany = (str: string) => {
      const { folded_text } = get_limited_length_string(str, 10);
      return folded_text;
    };
    // methods.queryProjectShopLive();
    methods.queryShopLiveProfitStatData();
    const linkAccess = () => {
      getProjectuthStatus();
      window.open(injectProject.value?.shop_auth_url ? injectProject.value?.shop_auth_url : '');
    };
    let is_shop_auth: any = false;
    const getProjectuthStatus = () => {
      const internal = setInterval(() => {
        GetShopLiveAuthStatus(project_id).then(({ data }) => {
          if (data.success && data.data) {
            is_shop_auth = data.data.is_shop_auth || false;
            if (is_shop_auth === 1 || is_shop_auth === true) {
              clearInterval(internal);
              methods.getDetail();
            }
          }
        });
      }, 3000);
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
    const onProlongLiquidationPeriodHandler = () => {
      dialogProlongLiquidationPeriod.show(injectProject.value);
    };
    const onFinishProjectHandler = () => {
      dialogFinishProject.show(injectProject.value?.id);
    };
    const onPageItemHandler = (name: string) => {
      ctx.root.$router.push({
        name,
        params: {
          id: project_id,
        },
      });
    };

    // watchEffect(() => {
    //   reqQueryReminds.runAsync(project_id, business_type.value);
    // });

    return {
      // remindsData,
      BusinessTypeEnum,
      scheduleWarningObj,
      moment,
      ProjectStatusEnum,
      getnewcoopcompany,
      injectProject,
      linkAccess,
      noTodayKolScheduleData,
      noTodayOperatorScheduleData,
      todayScheduleData,
      isCustomerManager,
      teamMemberEditEnabled,
      userinfo,
      Permission,
      memberForEdit,
      editProjectVisible,
      teamMemberVisible,
      liveColumns,
      liveDatas,
      project,
      project_cycle,
      cooperation_type_str,
      business_type_str,
      settlement_cycle_type,
      project_status_str,
      project_reason_status_str,
      project_status,
      otherMembersStr,
      ProjectStepTrialFormVisible,
      ProjectStepAreaFormVisible,
      ProjectStepFinalFormVisible,
      rollBackProjectVisible,
      profitData,
      rollBackProjectInfo,
      withoutDailyDataPermission,
      withoutLiveDisplayPermission,
      project_end_time,
      dialogProlongLiquidationPeriod,
      onProlongLiquidationPeriodHandler,
      onFinishProjectHandler,
      onPageItemHandler,
      RouterNameProjectManage,
      live,
      income,
      cost,
      contract,
      data,
      target,
      setting,
      liveBg,
      incomeBg,
      costBg,
      contractBg,
      dataBg,
      targetBg,
      settingBg,
      notFiledImage,
      ...methods,
    };
  },
});
