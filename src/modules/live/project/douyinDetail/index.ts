/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-10-21 09:50:12
 */
/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-09-28 18:09:24
 */

// import { Tab } from '@/types/components/tabs';
// import { useRefTabs } from '@/use/tab';
// import { useJump } from '..//use/jump';
import { defineComponent, inject, onBeforeMount, provide, ref } from '@vue/composition-api';
import projectInfo from '../tabs/projectInfo/index.vue';
import live from '../tabs/live/index.vue';
import income from '../tabs/income/index.vue';
import cost from '../tabs/cost/index.vue';
import contract from '@/modules/customer/contract/list/index.vue';
import TbdailyData from '../tabs/dailyData/index.vue';
import dailyData from '@/modules/datacenter/shoplive/tabs/projectDetail/index.vue';
import targetView from '../tabs/target/index.vue';
import setting from '../tabs/setting/index.vue';
import liveTool from '@/modules/live/project/tabs/liveTool/index.vue';
import { RouterNameProjectManage } from '@/const/router';
import { LiveProject } from '@/types/tiange/live.project';
import { GetLiveProjectDetail } from '@/services/live.project';
// import { CooperationTypeEnum } from '@/types/tiange/common';
import { usePermission } from '@/use/permission';
import { QueryInProjectTeam } from '@/services/live';
import { useRouter } from '@/use/vue-router';
// import { CooperationTypeEnum } from '@/types/tiange/common';

// const routes = [
//   // {
//   //   name: RouterNameProjectManage.live.project.list,
//   //   title: '店铺代播',
//   // },
//   {
//     name: RouterNameProjectManage.live.project.list,
//     title: '项目管理',
//   },
//   {
//     path: '',
//     title: '项目详情',
//   },
// ];

export default defineComponent({
  components: {
    projectInfo,
    live,
    income,
    cost,
    contract,
    dailyData,
    targetView,
    setting,
    TbdailyData,
    liveTool,
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
    const router = useRouter();
    const project_id = router.currentRoute.params.project_id || router.currentRoute.params.id;
    const permission = usePermission();
    const loading = ref<boolean>(false);
    const inProject = ref<boolean | undefined>(undefined);

    const project = ref<LiveProject | undefined>(undefined);

    const routes = [
      {
        name: RouterNameProjectManage.live.project.list,
        title: '项目管理',
      },
      {
        path: '',
        title: '项目详情',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    provide('project', project);
    /** 供项目结算专用以区分项目类型 */
    provide('live_project', project);

    // const jumpLogic = useJump(props, ctx);

    // const tabs = useRefTabs(
    //   computed<Tab<string>[]>(() => {
    //     const tabs = [
    //       {
    //         label: '项目信息',
    //         value: 'projectInfo',
    //       },
    //     ];
    //     if (
    //       project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
    //       permission.live_display_view
    //     ) {
    //       tabs.push({
    //         label: '直播场次',
    //         value: 'live',
    //       });
    //     }
    //     if (permission.live_project_settlement_view || permission.live_project_gathering_view) {
    //       tabs.push({
    //         label: '收入',
    //         value: 'income',
    //       });
    //     }
    //     if (
    //       (permission.live_project_settlement_view &&
    //         project.value?.cooperation_type === CooperationTypeEnum.selfSupport) ||
    //       permission.live_project_pay_view
    //     ) {
    //       tabs.push({
    //         label: '成本',
    //         value: 'cost',
    //       });
    //     }
    //     if (permission.live_project_contract_view) {
    //       tabs.push({
    //         label: '合同',
    //         value: 'contract',
    //       });
    //     }
    //     if (permission.view_or_save_shop_daily_report) {
    //       if (
    //         project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
    //         (project.value?.business_type === 3 || project.value?.business_type === 7)
    //       ) {
    //         tabs.push({
    //           label: '数据',
    //           value: 'dailyData',
    //         });
    //       } else {
    //         tabs.push({
    //           label: '日报',
    //           value: 'TbdailyData',
    //         });
    //       }
    //     }
    //     if (
    //       project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
    //       (project.value?.business_type === 3 ||
    //         project.value?.business_type === 7 ||
    //         project.value?.business_type === 8)
    //     ) {
    //       if (permission.live_project_target_view) {
    //         tabs.push({
    //           label: '目标',
    //           value: 'targetView',
    //         });
    //       }
    //       tabs.push({
    //         label: '设置',
    //         value: 'setting',
    //       });
    //     }
    //     if (project.value?.business_type === 3) {
    //       tabs.push({
    //         label: '直播工具',
    //         value: 'liveTool',
    //       });
    //     }
    //     return tabs;
    //   }),
    //   props.tab ?? 'projectInfo',
    // );

    const methods = {
      getDetail: async () => {
        const { data: response } = await GetLiveProjectDetail(project_id);
        project.value = response.data;
        //存入本地项目详情
        localStorage.setItem('project3Live', JSON.stringify(project));
      },
      // onTabChange: (tab: Tab) => {
      //   let liveType = ctx.root.$route.params.liveType ?? 'calendar';
      //   tabs.checkedTab.value = tab.value;
      //   if (tab.value !== 'live') {
      //     liveType = 'calendar';
      //   }
      //   jumpLogic.jump({ tab: tab.value, liveType: liveType });
      // },
      queryInProjectTeam: async () => {
        loading.value = true;
        const res = await QueryInProjectTeam(project_id);
        loading.value = false;
        if (res.data.success) {
          inProject.value = res.data.data.in_project ? true : false;
          if (inProject.value) {
            await methods.getDetail();
          }
        }
      },
    };

    // watch(
    //   () => project.value?.project_status,
    //   val => {
    //     if (val !== undefined) {
    //       if (ctx.root.$route.params.tab !== undefined) {
    //         // do nth
    //       } else if (
    //         [3, 4, 5].includes(val) &&
    //         project.value?.cooperation_type === CooperationTypeEnum.selfSupport
    //       ) {
    //         tabs.checkedTab.value = 'live';
    //       } else {
    //         tabs.checkedTab.value = 'projectInfo';
    //       }
    //       // 补足路由参数
    //       debugger
    //       jumpLogic.replace({
    //         id: props.id,
    //         tab: tabs.checkedTab.value,
    //       });
    //     }
    //   },
    // );

    const editProjectReload = async () => {
      await methods.getDetail();
    };

    onBeforeMount(() => {
      // tabs.checkedTab.value = ctx.root.$route.params.tab
      methods.queryInProjectTeam();
    });

    return {
      loading,
      project,
      inProject,
      routes,
      permission,
      // onPageItemHandler,
      editProjectReload,
      // ...tabs,
      ...methods,
    };
  },
});
