import { computed, inject, ref } from '@vue/composition-api';
import { Ref } from '@vue/composition-api';
import type { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import type { LiveProject } from '@/types/tiange/live.project';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { RouterNameProjectManage, RouterNameFinance } from '@/const/router';
import { useRouter } from '@/use/vue-router';

/**
 * 获取项目基本信息
 */
export const useProjectBaseInfo = () => {
  const router = useRouter();
  /** 路由名称 */
  const routeName = computed(() => router.currentRoute.name ?? '');
  /** 项目ID */
  const project_id = computed(() => parseInt(router.currentRoute.params.id, 10));
  /** 是否营销业务 */
  const isFromMarketing = computed(
    () =>
      routeName.value === RouterNameProjectManage.marketing.project.detail ||
      routeName.value.indexOf('Marketing') >= 0,
  );
  /** 是否店播业务 */
  const isFromLive = computed(
    () =>
      routeName.value === RouterNameProjectManage.live.project.detail ||
      routeName.value.indexOf('SSLive') >= 0,
  );
  /** 是否供应链 */
  const isFromSupplyChain = computed(() => {
    return router.currentRoute.fullPath.indexOf('supplyChain') >= 0;
    // return routeName.value === RouterNameProjectManage.supplyChain.detail;
  });
  /** 是否本地生活 */
  const isFromLocalLife = computed(() => routeName.value.indexOf('SSLocalLife') >= 0);
  /** 是否抖音店播生活 */
  const isFromLiveDouyin = computed(() => routeName.value.indexOf('SSTikTokLive') >= 0);
  /** 是否通用业务 */
  const isFromCommon = computed(
    () =>
      routeName.value === RouterNameProjectManage.commonBusiness.project.detail ||
      routeName.value.indexOf('CommonBusiness') >= 0,
  );
  /** 项目详情 */
  const project = computed<
    MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined
  >(() => {
    if (isFromMarketing.value) {
      const marketing_project =
        inject<Ref<MarketingProjectDetail | undefined>>('MarketingProject') ?? ref(undefined);
      return { ...marketing_project.value, project__type: 'marketing' } as MarketingProjectDetail;
    } else if (isFromLive.value || isFromLiveDouyin.value) {
      const live_project = inject<Ref<LiveProject | undefined>>('live_project') ?? ref(undefined);
      return { ...live_project.value, project__type: 'live' } as LiveProject;
    } else if (isFromSupplyChain.value) {
      const live_project = inject<Ref<LiveProject | undefined>>('live_project') ?? ref(undefined);
      return { ...live_project.value, project__type: 'supply_chain' } as LiveProject;
    } else if (isFromLocalLife.value) {
      const live_project = inject<Ref<LiveProject | undefined>>('live_project') ?? ref(undefined);
      return { ...live_project.value, project__type: 'local_life' } as LiveProject;
    } else if (isFromCommon.value) {
      const common_project =
        inject<Ref<CommonBusinessProjectDetail | undefined>>('common_project') ?? ref(undefined);
      return { ...common_project.value, project__type: 'common' } as CommonBusinessProjectDetail;
    } else {
      return undefined;
    }
  });

  /** 项目类型 */
  const project_type = computed(() => {
    if (isFromMarketing.value) {
      return 'marketing';
    } else if (isFromLive.value || isFromLiveDouyin.value) {
      return 'live';
    } else if (isFromSupplyChain.value) {
      return 'supply_chain';
    } else if (isFromLocalLife.value) {
      return 'local_life';
    } else if (isFromCommon.value) {
      return 'common';
    } else if (router.currentRoute.name === RouterNameFinance.settlement) {
      return 'finance';
    } else {
      return 'finance_cost';
    }
  });

  /** 业务类型 */
  const business_type = computed(() => {
    if (project.value === undefined || project.value.project__type === undefined) {
      return undefined;
    } else if (project.value.project__type === 'marketing') {
      return E.project.BusinessType.marketing;
    } else if (project.value.project__type === 'supply_chain') {
      return E.project.BusinessType.supplyChain;
    } else if (project.value.project__type === 'local_life') {
      return E.project.BusinessType.locallife;
    } else if (project.value.project__type === 'common') {
      return E.project.BusinessType.s2b2c;
    } else if (project.value.project__type === 'live') {
      return project.value.business_type;
    } else {
      return undefined;
    }
  });

  return {
    project_id,
    isFromMarketing,
    isFromLive,
    isFromLocalLife,
    isFromLiveDouyin,
    isFromSupplyChain,
    isFromCommon,
    project,
    project_type,
    business_type,
  };
};
