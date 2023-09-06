<template>
  <div class="tg-page-container tg-common-business-project-detail">
    <tg-card class="project-detail" :padding="[0, 0, 0, 0]" overflowInBody>
      <tg-tabs
        v-if="inProject || permission.common_business_view_all_project"
        class="flex-none"
        :tabs="tabs"
        v-model="checkedTab"
        @change="onTabChange"
        bottom
      />
      <component
        v-if="(inProject || permission.common_business_view_all_project) && CommonBusinessProject"
        :is="checkedTab"
        class="component-container"
        @editProjectReload="editProjectReload"
      />
      <div class="abnormal-empty" v-if="!inProject && !permission.common_business_view_all_project">
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

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
