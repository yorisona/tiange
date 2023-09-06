<template>
  <div class="tg-live-project-detail-page">
    <router-view v-if="(inProject || permission.local_life_view_all_project) && project" />
  </div>
</template>

<script src="./detail.ts"></script>
<style lang="less">
@import './detail.less';
</style>
