<template>
  <div id="app">
    <router-view #default="{ Component }">
      <transition name="fade" mode="out-in">
        <!-- exclude="detail" -->
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'App',
});
</script>

<style lang="less">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-weight: 400;
  font-size: var(--default-font-size);
  -webkit-font-smoothing: antialiased;
  background-color: #f4f5f6;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
