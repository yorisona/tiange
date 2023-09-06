<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-09-28 18:09:15
-->
<template>
  <div class="tg-live-project-detail-page">
    <TgBreadcrumbs :routes="routes" />
    <tg-card class="flex-auto" :padding="[0]" overflowInBody v-loading="loading">
      <tg-tabs
        v-if="inProject || permission.view_all_project"
        :tabs="tabs"
        v-model="checkedTab"
        @change="onTabChange"
      />
      <!-- <component
        v-if="inProject || permission.view_all_project"
        style="border-top: 1px solid #ebebeb"
        :is_from_project="true"
        :is="checkedTab"
        @editProjectReload="editProjectReload"
      /> -->
      <router-view></router-view>
      <div class="abnormal-empty" v-if="!inProject && !permission.view_all_project">
        <div class="abnormal-empty-content">
          <empty-common
            :detail-text="
              inProject === undefined ? '获取项目详情失败，请稍后重试' : '暂无查看当前项目的权限'
            "
          ></empty-common>
        </div>
      </div>
    </tg-card>
  </div>
</template>

<script src="./detal.ts"></script>
<style lang="less">
@import './detail.less';
</style>
