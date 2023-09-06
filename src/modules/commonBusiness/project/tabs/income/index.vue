<template>
  <sub-tabs :selectIndex="selectIndex">
    <template
      v-if="
        permission.common_business_project_settlement_view &&
        permission.common_business_project_gathering_view
      "
    >
      <settlementIncome
        v-if="permission.common_business_project_settlement_view"
        name="结算"
        :cooperationType="cooperation_type"
      ></settlementIncome>
      <comp1 name="应收" />
      <comp2 name="实收" />
    </template>
    <template v-else-if="permission.common_business_project_gathering_view">
      <comp1 name="应收" />
      <comp2 name="实收" />
    </template>
    <settlementIncome
      v-else-if="permission.common_business_project_settlement_view"
      name="结算"
      :cooperationType="cooperation_type"
    ></settlementIncome>
    <template>
      <perPayProject name="预收"></perPayProject>
    </template>
  </sub-tabs>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import settlementIncome from '@/modules/settlement/income/list.vue';
import comp1 from '../collection/receivables/index.vue';
import comp2 from '../collection/index.vue';
import { usePermission } from '@/use/permission';
import perPayProject from '@/modules/components/perPayProject/index.vue';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  components: {
    SubTabs,
    settlementIncome,
    comp1,
    comp2,
    perPayProject,
  },
  setup() {
    const router = useRouter();
    const selectIndex = router.currentRoute.query.type === 'prepay' ? 3 : 0;
    const permission = usePermission();
    const project = JSON.stringify(inject('project', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(project);
    let cooperation_type = ref(0);
    if (jsonProject.value) {
      cooperation_type = jsonProject.value.cooperation_type || 0;
    }
    return {
      selectIndex,
      cooperation_type,
      permission,
    };
  },
});
</script>
