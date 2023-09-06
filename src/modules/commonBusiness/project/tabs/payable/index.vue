<template>
  <sub-tabs>
    <comp1 name="应付" />
    <comp2 name="实付" />
  </sub-tabs>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import comp1 from './need/index.vue';
import comp2 from './actual/index.vue';

export default defineComponent({
  components: {
    SubTabs,
    comp1,
    comp2,
  },
});
</script>
