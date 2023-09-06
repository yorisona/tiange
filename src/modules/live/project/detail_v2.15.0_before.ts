/**
 * 店铺代播 - 项目管理 - 项目详情
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 13:49:39
 * @modifier wuyou <wuyou@goumee.com>
 * @since   2021-01-07 10:00:00
 */
import {
  computed,
  defineComponent,
  onBeforeMount,
  provide,
  ref,
  watch,
} from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';
import { useRefTabs } from '@/use/tab';
import type { Tab } from '@/types/components/tabs';
import { useJump } from './use/jump';
import tracking from './tabs/tracking.vue';
import ProjectBaseInfo from './tabs/baseinfo/index.vue';
import calendar from './tabs/calendar.vue';
import projectStep from './tabs/project.step.vue';
import collection from './tabs/collection/switch/index.vue';
import payment from './tabs/payment/tabs.vue';
import contract from './tabs/contract/index.vue';
import dailydata from './tabs/dailyData/index.vue';
import type { LiveProject } from '@/types/tiange/live.project';
import { GetLiveProjectDetail } from '@/services/live.project';
import { CooperationTypeEnum } from '@/types/tiange/common';
import { usePermission } from '@/use/permission';
import LiveProjectStepBlock from './tabs/project.step.vue';
import settlement_income from '@/modules/settlement/income/list.vue';
import settlement_cost from '@/modules/settlement/cost/list.vue';

const routes = [
  {
    name: RouterNameProjectManage.live.project.list,
    title: '店铺代播',
  },
  {
    name: RouterNameProjectManage.live.project.list,
    title: '项目管理',
  },
  {
    path: '',
    title: '项目详情',
  },
];

export default defineComponent({
  name: 'TgLiveProjectDetail',
  components: {
    LiveProjectStepBlock,
    baseinfo: ProjectBaseInfo,
    tracking,
    calendar,
    projectStep,
    collection,
    payment,
    contract,
    dailydata,
    settlement_income,
    settlement_cost,
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
      default: 'week',
    },
  },
  setup(props, ctx) {
    /** 项目详情 */
    const calendar_type = ref<string>('week');
    const project = ref<LiveProject | undefined>(undefined);
    const permission = usePermission();

    const tabs = useRefTabs(
      computed<Tab<string>[]>(() => {
        const tabs = [
          {
            label: '项目信息',
            value: 'baseinfo',
          },
          // {
          //   label: '跟踪事项',
          //   value: 'tracking',
          // },
        ];
        if (project.value?.cooperation_type === CooperationTypeEnum.selfSupport) {
          tabs.push({
            label: '直播排期',
            value: 'calendar',
          });
        }

        if (permission.live_project_settlement_view) {
          tabs.push({
            label: '收入结算',
            value: 'settlement_income',
          });
        }

        if (
          permission.live_project_settlement_view &&
          project.value?.cooperation_type === CooperationTypeEnum.selfSupport
        ) {
          tabs.push({
            label: '成本结算',
            value: 'settlement_cost',
          });
        }

        if (permission.live_project_gathering_view)
          tabs.push({
            label: '项目收款',
            value: 'collection',
          });
        if (permission.live_project_pay_view)
          tabs.push({
            label: '项目付款',
            value: 'payment',
          });
        if (permission.live_project_contract_view)
          tabs.push({
            label: '合同协议',
            value: 'contract',
          });
        if (permission.view_or_save_shop_daily_report) {
          tabs.push({
            label: '日报数据',
            value: 'dailydata',
          });
        }
        return tabs;
      }),
      props.tab ?? 'baseinfo',
    );

    const final_calendar = computed(() => (props.tab === 'calendar' ? props.calendar : 'none'));

    const getDetail = async () => {
      const { data: response } = await GetLiveProjectDetail(props.id.toString());
      project.value = response.data;
      console.log('project22==', JSON.stringify(response.data));
    };

    onBeforeMount(() => {
      calendar_type.value = ctx.root.$route.params.calendar;
      getDetail();
    });

    const editProjectReload = () => {
      getDetail();
    };

    provide('project', project);
    /** 供项目结算专用以区分项目类型 */
    provide('live_project', project);

    const jumpLogic = useJump(props, ctx);

    watch(
      () => project.value?.project_status,
      val => {
        if (val !== undefined) {
          if (ctx.root.$route.params.tab !== undefined) {
            // do nth
          } else if (
            [3, 4, 5].includes(val) &&
            project.value?.cooperation_type === CooperationTypeEnum.selfSupport
          ) {
            tabs.checkedTab.value = 'calendar';
          } else {
            tabs.checkedTab.value = 'baseinfo';
          }

          // 补足路由参数
          jumpLogic.replace({
            id: props.id,
            tab: tabs.checkedTab.value,
          });
        }
      },
    );

    const onTabChange = (tab: Tab) => {
      tabs.checkedTab.value = tab.value;
      jumpLogic.jump({ tab: tab.value });
    };

    /** 直播排期需要的 月/周 参数*/
    provide('calendar', final_calendar);

    return {
      calendar_type,
      project,
      editProjectReload,
      routes,
      ...tabs,
      onTabChange,
      final_calendar,
      getDetail,
    };
  },
});
