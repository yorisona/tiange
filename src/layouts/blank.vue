<template>
  <tg-block>
    <h2>🚧🚧🚧『{{ $route.meta.name }}』(临时👷)🚧🚧🚧</h2>
    <h3>
      请在路由配置中找到当前路由『{{ $route.meta.name }}』({{
        $route.path
      }})的配置并自行引入实际业务组件
    </h3>
  </tg-block>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Blank',
});
</script>
