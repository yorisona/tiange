<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-11 18:06:36
-->
<template>
  <sub-tabs>
    <template
      v-if="
        permission.common_business_project_settlement_view &&
        permission.common_business_project_view_common_project_paid
      "
    >
      <settlement-cost name="结算"></settlement-cost>
      <comp1 name="应付" />
      <comp2 name="实付" />
    </template>
    <template v-else-if="permission.common_business_project_settlement_view">
      <settlement-cost
        name="结算"
        :isAreaCost="true"
        :cooperationType="cooperation_type"
      ></settlement-cost>
    </template>
    <template v-else-if="permission.common_business_project_view_common_project_paid">
      <comp1 name="应付" />
      <comp2 name="实付" />
    </template>
  </sub-tabs>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import settlementCost from '@/modules/settlement/cost/list.vue';
import comp1 from '../payable/need/index.vue';
import comp2 from '../payable/actual/index.vue';
import { usePermission } from '@/use/permission';

export default defineComponent({
  components: {
    SubTabs,
    settlementCost,
    comp1,
    comp2,
  },
  setup() {
    const permission = usePermission();
    permission.common_business_project_view_common_project_paid;
    // const injectProject = inject('project') ?? ref<any>(undefined);
    // const showCostSettlement = computed(
    //   () => injectProject.value?.cooperation_type === CooperationTypeEnum.selfSupport,
    // );
    const project = JSON.stringify(inject('project', { cooperation_type: 1 }));
    const jsonProject = JSON.parse(project);
    let cooperation_type = ref(1);
    if (jsonProject.value) {
      cooperation_type = jsonProject.value.cooperation_type || 1;
    }
    return {
      permission,
      cooperation_type,
    };
  },
});
</script>

<style scoped></style>
