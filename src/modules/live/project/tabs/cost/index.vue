<template>
  <sub-tabs :class="isFromLocalLife || isFromLiveDouyin ? 'local-life-tab' : ''">
    <template v-if="costPermission.canSettlementView && showCostSettlement">
      <settlementCost name="结算"></settlementCost>
    </template>
    <template v-else-if="costPermission.canSettlementView">
      <settlementCost
        name="结算"
        :isAreaCost="true"
        :cooperationType="cooperation_type"
      ></settlementCost>
    </template>
    <template v-if="costPermission.canPaySettlementView">
      <comp1 name="应付" />
      <comp2 name="实付" />
    </template>
  </sub-tabs>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, Ref } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import settlementCost from '@/modules/settlement/cost/list.vue';
import comp1 from '../payment/should_payment/index.vue';
import comp2 from '../payment/index.vue';
import { HasPermission } from '@/use/permission';
import { LiveProject } from '@/types/tiange/live.project';
import { CooperationTypeEnum } from '@/types/tiange/common';
import { useRouter } from '@/use/vue-router';
import { RouterNameProjectManage } from '@/const/router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { RIGHT_CODE } from '@/const/rightCode';

export default defineComponent({
  components: {
    SubTabs,
    settlementCost,
    comp1,
    comp2,
  },
  setup(_, ctx) {
    const injectProject =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);
    const showCostSettlement = computed(
      () => injectProject.value?.cooperation_type === CooperationTypeEnum.selfSupport,
    );
    const project = JSON.stringify(inject('project', { cooperation_type: 1 }));
    const jsonProject = JSON.parse(project);
    let cooperation_type = ref(1);
    if (jsonProject.value) {
      cooperation_type = jsonProject.value.cooperation_type || 1;
    }

    // const project_id = ctx.root.$route.params.id || '';
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const { isFromLocalLife, isFromLiveDouyin, isFromSupplyChain } = useProjectBaseInfo();
    if (isFromLocalLife.value || isFromLiveDouyin.value) {
      const routes = [
        {
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.project.list
            : RouterNameProjectManage.live.project.list,
          title: '项目管理',
        },
        {
          // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.detail.info
            : RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: project_id,
            tab: 'projectInfo',
            liveType: 'calendar',
          },
          title: '项目详情',
        },
        {
          path: '',
          title: '项目成本',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    /** 权限检查 */
    const costPermission = computed(() => {
      const canSettlementView = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_view_settlement)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_settlement_view)
        : HasPermission(RIGHT_CODE.live_project_settlement_view);
      const canPaySettlementView = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_view_cost)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_pay_view)
        : HasPermission(RIGHT_CODE.live_project_pay_view);
      return {
        canSettlementView,
        canPaySettlementView,
      };
    });
    return {
      costPermission,
      isFromLiveDouyin,
      isFromLocalLife,
      cooperation_type,
      showCostSettlement,
    };
  },
});
</script>
<style lang="less">
.local-life-tab {
  background: white;
  .tgb-subtabs-header {
    margin: 0 !important;
  }
}
</style>
