<template>
  <router-view :class="className" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TgRouterView',
  props: {
    version: {
      type: Number,
      default: 2,
    },
  },
  setup(props) {
    const isNewVer = computed(() => props.version >= 2);

    const className = computed(() =>
      isNewVer.value ? 'tg-router-view tg-page-container' : 'tg-router-view',
    );

    return {
      isNewVer,
      className,
    };
  },
});
</script>
