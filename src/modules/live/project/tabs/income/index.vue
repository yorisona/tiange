<template>
  <sub-tabs
    :selectIndex="selectIndex"
    :class="isFromLocalLife || isFromLiveDouyin ? 'local-life-tab' : ''"
  >
    <template
      v-if="incomePermission.canSettlementView && incomePermission.canGatheringSettlementView"
    >
      <settlementIncome name="结算" :cooperationType="cooperation_type"></settlementIncome>
      <comp1 name="应收" />
      <comp2 name="实收" />
    </template>
    <template v-else-if="incomePermission.canGatheringSettlementView">
      <comp1 name="应收" />
      <comp2 name="实收" />
    </template>
    <template v-else-if="incomePermission.canSettlementView">
      <settlementIncome name="结算"></settlementIncome>
    </template>
    <template>
      <perPayProject name="预收"></perPayProject>
    </template>
  </sub-tabs>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import settlementIncome from '@/modules/settlement/income/list.vue';
import comp1 from '../collection/receivables/index.vue';
import comp2 from '../collection/index.vue';
import { HasPermission } from '@/use/permission';
import perPayProject from '@/modules/components/perPayProject/index.vue';
import { useRouter } from '@/use/vue-router';
import { RouterNameProjectManage } from '@/const/router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { RIGHT_CODE } from '@/const/rightCode';
export default defineComponent({
  components: {
    SubTabs,
    perPayProject,
    settlementIncome,
    comp1,
    comp2,
  },
  setup(_, ctx) {
    const router = useRouter();
    const selectIndex = router.currentRoute.query.type === 'prepay' ? 3 : 0;
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    /** 本地生活 */
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
          title: '项目收入',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    const project = JSON.stringify(inject('project', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(project);
    let cooperation_type = ref(0);
    if (jsonProject.value) {
      cooperation_type = jsonProject.value.cooperation_type || 0;
    }
    /** 权限检查 */
    const incomePermission = computed(() => {
      const canSettlementView = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_view_settlement)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_settlement_view)
        : HasPermission(RIGHT_CODE.live_project_settlement_view);
      const canGatheringSettlementView = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_view_achievement)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_gathering_view)
        : HasPermission(RIGHT_CODE.live_project_gathering_view);
      return {
        canSettlementView,
        canGatheringSettlementView,
      };
    });
    return {
      selectIndex,
      isFromLocalLife,
      isFromLiveDouyin,
      cooperation_type,
      incomePermission,
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
