<template>
  <sub-tabs>
    <comp1 name="应收" />
    <comp2 name="实收" />
  </sub-tabs>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import comp1 from '../receivables/index.vue';
import comp2 from '../index.vue';

export default defineComponent({
  components: {
    SubTabs,
    comp1,
    comp2,
  },
});
</script>
