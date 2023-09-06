/**
 * 通用业务 - 项目详情
 * @author  Wuyou <wuyou@goumee.com>
 * @since   2021-05-06 15:02:21
 */
import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  onMounted,
  provide,
  ref,
  watch,
} from '@vue/composition-api';
import { useRefTabs } from '@/use/tab';
import { props2RouteParams } from '@/router/func';
import { resize } from '@/utils/dom';
import { RouterNameProjectManage } from '@/const/router';
import { HasPermission, usePermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { GetCommonBusinessProjectDetail } from '@/services/commonBusiness/project';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import info from './tabs/info.vue';
import contract from '@/modules/customer/contract/list/index.vue';
import dailyData from './tabs/dailydata/index.vue';
import income from './tabs/income/index.vue';
import cost from './tabs/cost/index.vue';
import setting from './tabs/setting/index.vue';
// import merchants from './tabs/merchants/index.vue';
import live from './tabs/live/index.vue';
import { QueryInProjectTeam } from '@/services/live';
import { useRouter } from '@/use/vue-router';
import dataCenter from '@/modules/commonBusiness/project/tabs/dataCenter/index.vue';

export default defineComponent({
  name: 'TgCommonBusinessProjectDetail',
  props: {
    id: {
      type: Number,
    },
    tab: {
      type: String,
    },
  },
  components: {
    info,
    contract,
    dailyData,
    live,
    income,
    cost,
    setting,
    dataCenter,
    // merchants,
  },
  setup(props, ctx) {
    const routes = [
      {
        name: RouterNameProjectManage.commonBusiness.project.list,
        title: '项目管理',
      },
      {
        path: '',
        title: '项目详情',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);

    /** 通用业务的项目详情 */
    const CommonBusinessProject = ref<CommonBusinessProjectDetail | undefined>(undefined);
    const permission = usePermission();
    const router = useRouter();
    const project_id =
      router.currentRoute.params.project_id ||
      router.currentRoute.params.id ||
      router.currentRoute.query.id + '';
    const inProject = ref<boolean | undefined>(undefined);
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewContractTab = HasPermission(RIGHT_CODE.common_business_project_contract_view);
      const canSettingContractTab = HasPermission(
        RIGHT_CODE.common_business_project_status_setting,
      );
      const canViewDailyDataTab = HasPermission(
        RIGHT_CODE.common_business_project_contract_daily_data,
      );
      const canViewSettlementTab = HasPermission(
        RIGHT_CODE.common_business_project_settlement_view,
      );
      const canViewLiveProjectGatherTab = HasPermission(
        RIGHT_CODE.common_business_project_gathering_view,
      );

      return {
        canViewContractTab,
        canViewDailyDataTab,
        canViewSettlementTab,
        canSettingContractTab,
        canViewLiveProjectGatherTab,
      };
    });
    const tabs = useRefTabs(
      computed(() => {
        let hasDouyin = false;
        if (CommonBusinessProject.value && CommonBusinessProject.value.platform_type === 1) {
          hasDouyin = true;
        }
        const tabList = [
          {
            label: '项目信息',
            value: 'info',
          },
        ];
        if (permission.mcn_shop_live_view && hasDouyin) {
          tabList.push({
            label: '场次',
            value: 'live',
          });
        }
        // if (
        //   CommonBusinessProject.value &&
        //   CommonBusinessProject.value.platform_type === 1 &&
        //   permission.common_business_project_tab_merchant
        // ) {
        //   tabList.push({
        //     label: '招商',
        //     value: 'merchants',
        //   });
        // }
        if (
          permission.common_business_project_settlement_view ||
          permission.common_business_project_gathering_view
        ) {
          tabList.push({
            label: '收入',
            value: 'income',
          });
        }

        if (
          permission.common_business_project_settlement_view ||
          permission.common_business_project_view_common_project_paid
        ) {
          tabList.push({
            label: '成本',
            value: 'cost',
          });
        }

        // ! 基地业务暂不开放项目结算
        // if (
        //   Permission.value.canViewSettlementTab &&
        //   CommonBusinessProject.value?.business_type !== BusinessTypeEnum.base
        // ) {
        //   tabList.push({
        //     label: '成本结算',
        //     value: 'settlement_cost',
        //   });
        // }
        // if (Permission.value.canViewProjectPayableTab) {
        //   tabList.push({
        //     label: '项目付款',
        //     value: 'payable',
        //   });
        // }
        if (Permission.value.canViewContractTab) {
          tabList.push({
            label: '合同协议',
            value: 'contract',
          });
        }
        if (
          Permission.value.canViewDailyDataTab &&
          CommonBusinessProject.value?.platform_type === 2
        ) {
          tabList.push({
            label: '日报数据',
            value: 'dailyData',
          });
        }
        if (
          Permission.value.canViewDailyDataTab &&
          CommonBusinessProject.value?.platform_type === 1
        ) {
          tabList.push({
            label: '数据中心',
            value: 'dataCenter',
          });
        }
        if (Permission.value.canSettingContractTab) {
          tabList.push({
            label: '设置',
            value: 'setting',
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

    /** 获取项目详情 */
    const getProjectDetailHandler = async (reload = false) => {
      const reloadData = async (project_id: string) => {
        const { data: response } = await GetCommonBusinessProjectDetail(project_id);
        CommonBusinessProject.value = response.data;
      };
      if (props.id) {
        await reloadData(props.id.toString());
      } else if (reload) {
        await reloadData(project_id);
      }
    };

    const loading = ref<boolean>(false);

    const queryInProjectTeam = async () => {
      loading.value = true;
      const res = await QueryInProjectTeam(project_id, E.project.BusinessType.s2b2c);
      loading.value = false;
      if (res.data.success) {
        inProject.value = res.data.data.in_project ? true : false;
        if (inProject.value) {
          getProjectDetailHandler();
        }
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    onBeforeMount(async () => {
      await queryInProjectTeam();
    });

    provide('project', CommonBusinessProject);
    /** 供项目结算专用以区分项目类型 */
    provide('common_project', CommonBusinessProject);

    const editProjectReload = () => {
      getProjectDetailHandler();
    };

    return {
      editProjectReload,
      Permission,
      CommonBusinessProject,
      inProject,
      permission,
      ...tabs,
      onTabChange,
    };
  },
});
