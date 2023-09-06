import { Tab } from '@/types/components/tabs';
import { useRefTabs } from '@/use/tab';
import { useJump } from './use/jump';
import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  provide,
  ref,
} from '@vue/composition-api';
import projectInfo from './tabs/projectInfo/index.vue';
import live from './tabs/live/index.vue';
import income from './tabs/income/index.vue';
import cost from './tabs/cost/index.vue';
import contract from '@/modules/customer/contract/list/index.vue';
import TbDailyData from './tabs/dailyData/index.vue';
import dailyData from '@/modules/datacenter/shoplive/tabs/projectDetail/index.vue';
import targetView from './tabs/target/index.vue';
import setting from './tabs/setting/index.vue';
// import { RouterNameProjectManage } from '@/const/router';
import { LiveProject } from '@/types/tiange/live.project';
import { GetLiveProjectDetail } from '@/services/live.project';
import { CooperationTypeEnum } from '@/types/tiange/common';
import { usePermission } from '@/use/permission';
import { QueryInProjectTeam } from '@/services/live';
import { useRouter } from '@/use/vue-router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

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
    TbDailyData,
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
    const project_id =
      router.currentRoute.params.project_id ||
      router.currentRoute.params.id ||
      router.currentRoute.query.id + '';
    const permission = usePermission();
    const loading = ref<boolean>(false);
    const inProject = ref<boolean | undefined>(undefined);

    const project = ref<LiveProject | undefined>(undefined);
    const jumpLogic = useJump(props, ctx);
    const routes = [
      {
        name: jumpLogic.back(),
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
    // 注入项目详情
    provide('project3in1', project);
    const { isFromSupplyChain } = useProjectBaseInfo();

    const tabs = useRefTabs(
      computed<Tab<string>[]>(() => {
        const tabs = [
          {
            label: '项目信息',
            value: 'projectInfo',
          },
        ];
        if (!isFromSupplyChain.value) {
          if (
            project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
            permission.live_display_view
          ) {
            tabs.push({
              label: '直播场次',
              value: 'live',
            });
          }
          if (permission.live_project_settlement_view || permission.live_project_gathering_view) {
            tabs.push({
              label: '收入',
              value: 'income',
            });
          }
          if (
            (permission.live_project_settlement_view &&
              project.value?.cooperation_type === CooperationTypeEnum.selfSupport) ||
            permission.live_project_pay_view
          ) {
            tabs.push({
              label: '成本',
              value: 'cost',
            });
          }
          if (permission.live_project_contract_view) {
            tabs.push({
              label: '合同',
              value: 'contract',
            });
          }
          if (permission.view_or_save_shop_daily_report) {
            if (
              project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
              (project.value?.business_type === 3 || project.value?.business_type === 7)
            ) {
              tabs.push({
                label: '数据',
                value: 'dailyData',
              });
            } else {
              tabs.push({
                label: '日报',
                value: 'TbDailyData',
              });
            }
          }
          if (
            project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
            (project.value?.business_type === 3 ||
              project.value?.business_type === 7 ||
              project.value?.business_type === 8)
          ) {
            if (permission.live_project_target_view) {
              tabs.push({
                label: '目标',
                value: 'targetView',
              });
            }
            tabs.push({
              label: '设置',
              value: 'setting',
            });
          }
        } else {
          if (
            project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
            permission.supply_view_shop_live
          ) {
            tabs.push({
              label: '直播场次',
              value: 'live',
            });
          }
          if (permission.supply_view_settlement || permission.supply_view_achievement) {
            tabs.push({
              label: '收入',
              value: 'income',
            });
          }
          if (
            (permission.supply_view_settlement &&
              project.value?.cooperation_type === CooperationTypeEnum.selfSupport) ||
            permission.supply_view_cost
          ) {
            tabs.push({
              label: '成本',
              value: 'cost',
            });
          }
          if (permission.supply_view_contract) {
            tabs.push({
              label: '合同',
              value: 'contract',
            });
          }
          if (permission.supply_view_daily_report) {
            if (
              project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
              (project.value?.business_type === 3 ||
                project.value?.business_type === 7 ||
                project.value?.business_type === 9)
            ) {
              tabs.push({
                label: '数据',
                value: 'dailyData',
              });
            } else {
              tabs.push({
                label: '日报',
                value: 'TbDailyData',
              });
            }
          }
          if (
            project.value?.cooperation_type === CooperationTypeEnum.selfSupport &&
            (project.value?.business_type === 3 ||
              project.value?.business_type === 7 ||
              project.value?.business_type === 8 ||
              project.value?.business_type === 9)
          ) {
            if (permission.supply_view_goal) {
              tabs.push({
                label: '目标',
                value: 'targetView',
              });
            }
            tabs.push({
              label: '设置',
              value: 'setting',
            });
          }
        }
        return tabs;
      }),
      props.tab ?? 'projectInfo',
    );

    const methods = {
      getDetail: async () => {
        const { data: response } = await GetLiveProjectDetail(
          props.id.toString(),
          isFromSupplyChain.value ? 9 : undefined,
        );
        project.value = response.data;
        //存入本地项目详情
        localStorage.setItem('project3Live', JSON.stringify(project));
      },
      onTabChange: async (tab: Tab) => {
        let liveType = ctx.root.$route.params.liveType ?? 'calendar';
        tabs.checkedTab.value = tab.value;
        if (tab.value !== 'live' && liveType !== 'SupplyChainDetail') {
          liveType = 'calendar';
        }
        await jumpLogic.jump(
          { tab: tab.value, liveType: liveType },
          isFromSupplyChain.value ? 'SupplyChain' : 'live',
        );
        showBackTitleHandle(routes);
      },
      queryInProjectTeam: async () => {
        loading.value = true;
        const res = await QueryInProjectTeam(project_id, isFromSupplyChain.value ? 9 : undefined);
        loading.value = false;
        if (res.data.success) {
          inProject.value = res.data.data.in_project ? true : false;
          if (inProject.value) {
            methods.getDetail();
          }
        }
      },
    };

    const editProjectReload = () => {
      methods.getDetail();
    };

    onBeforeMount(() => {
      // tabs.checkedTab.value = ctx.root.$route.params.tab
      methods.queryInProjectTeam();
    });

    onBeforeMount(async () => {
      const tab = ctx.root.$route.params.tab ?? tabs.checkedTab.value;
      const liveType = ctx.root.$route.params.liveType ?? 'calendar';
      console.log(tab, liveType, ctx.root.$route, 'ffff');
      await jumpLogic.replace(
        {
          id: props.id,
          tab: tab,
          query: ctx.root.$route.query,
          liveType,
        },
        isFromSupplyChain.value ? 'SupplyChain' : 'live',
      );
      showBackTitleHandle(routes);
    });

    return {
      project,
      isFromSupplyChain,
      loading,
      inProject,
      routes,
      permission,
      editProjectReload,
      ...tabs,
      ...methods,
    };
  },
});
