import { defineComponent, onBeforeMount, provide, ref, computed } from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';
import { LiveProject } from '@/types/tiange/live.project';
import { GetLiveProjectDetail } from '@/services/live.project';
import { usePermission } from '@/use/permission';
import { useRouter } from '@/use/vue-router';
import { useRefTabs } from '@/use/tab';
import { Tab } from '@/types/components/tabs';
import { CooperationTypeEnum } from '@/types/tiange/common';
import { useJump } from '@/modules/live/project/use/jump';
import { usePageJump } from '@/utils/pageJump';
import { BusinessTypeEnum } from '@/types/tiange/common';

export default defineComponent({
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
    console.log('----=-==-=-=');
    const router = useRouter();
    // const project_id = router.currentRoute.params.id || router.currentRoute.query.id + '';
    const permission = usePermission();
    const loading = ref<boolean>(false);
    const inProject = ref<boolean | undefined>(undefined);

    const project = ref<LiveProject | undefined>(undefined);

    const routes = [
      {
        name: RouterNameProjectManage.supplyChain.detail,
        title: '项目管理',
      },
      {
        path: '',
        title: '项目详情',
      },
    ];

    const tabs = useRefTabs(
      computed<Tab<string>[]>(() => {
        const tabs = [
          {
            label: '项目信息',
            value: 'projectInfo',
          },
        ];
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
        return tabs;
      }),
      props.tab ?? 'projectInfo',
    );

    provide('project', project);
    /** 供项目结算专用以区分项目类型 */
    provide('live_project', project);
    // 注入项目详情
    provide('project3in1', project);
    const jumpLogic = useJump(props, ctx);
    const { jumpProjectDetail } = usePageJump();
    const methods = {
      onTabChange: (tab: Tab) => {
        // let liveType = ctx.root.$route.params.liveType ?? 'calendar';
        // tabs.checkedTab.value = tab.value;
        // if (tab.value !== 'live') {
        //   liveType = 'calendar';
        // }
        // jumpLogic.jump({ tab: tab.value, liveType: liveType });
        jumpProjectDetail(BusinessTypeEnum.supplyChain, {
          project_id: router.currentRoute.params.id || project.value?.id + '',
          liveType: 'SupplyChainDetail',
          tab: tab.value,
        });
      },
      getDetail: async () => {
        const { data: response } = await GetLiveProjectDetail(props.id.toString(), undefined);
        project.value = response.data;
        //存入本地项目详情
        localStorage.setItem('project3Live', JSON.stringify(project));
        const tab = router.currentRoute.params.tab ?? tabs.checkedTab.value;
        const liveType = ctx.root.$route.params.liveType ?? 'calendar';
        console.log('tab', props.id, ctx.root.$route.query, jumpLogic, tab, liveType);
        // jumpLogic.replace({
        //   id: props.id,
        //   tab: tab,
        //   query: ctx.root.$route.query,
        //   liveType,
        // });
      },
    };

    onBeforeMount(async () => {
      // tabs.checkedTab.value = ctx.root.$route.params.tab
      await methods.getDetail();
    });
    const editProjectReload = () => {
      methods.getDetail();
    };
    return {
      editProjectReload,
      loading,
      inProject,
      routes,
      permission,
      ...tabs,
      ...methods,
    };
  },
});
