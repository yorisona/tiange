<!--
 * @Author: 矢车
 * @Date: 2021-01-07 16:34:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-05 14:52:39
-->
<template>
  <div class="tg-live-project-detail-page">
    <TgBreadcrumbs :routes="routes" />
    <LiveProjectStepBlock @getDetail="getDetail" :CurrentProject="project" />
    <tg-card class="mgt-18 flex-auto" :padding="[6, 0, 0, 0]" overflowInBody>
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" />
      <div class="line"></div>
      <component
        :is="checkedTab"
        @editProjectReload="editProjectReload"
        :type.sync="calendar_type"
      />
    </tg-card>
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
