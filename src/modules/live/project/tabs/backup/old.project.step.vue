<!--
 * @Author: 矢车
 * @Date: 2021-01-08 10:39:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-03 13:48:37
 * @Description: 店铺代播 - 项目管理 - 项目详情 - 项目阶段
 *
 * 步骤组件在组件库中是有的,但是UI图上涉及多种图标更换以及基本布局和组件不一样,
 * 要改的比较多,所以索性自己写了一个,也好维护
-->
<template>
  <div class="project-step" v-if="Permission.canEdit && !isCurrentProjectUndef">
    <a v-if="isStep2" class="basic-final" @click="$refs.projectTrial.isDialog = true"> 试播结束 </a>
    <a
      v-else-if="isStep3 || isStep4"
      class="basic-final"
      @click="$refs.projectFinal.isDialog = true"
    >
      项目完结
    </a>
    <span
      v-if="isStep4 && CurrentProject.cooperation_type === 2"
      class="basic-final"
      style="right: 68px"
    >
      |
    </span>
    <a
      v-if="isStep4 && CurrentProject.cooperation_type === 2"
      class="basic-final"
      @click="$refs.projectArea.isDialog = true"
      style="right: 82px"
    >
      区域执行
    </a>
    <!-- 自营-项目试播 -->
    <projectTrial ref="projectTrial" :step="CurrentProject.project_status" />
    <!-- 区域-区域执行 -->
    <projectArea ref="projectArea" @getDetail="getDetail" />
    <!-- 项目完结 -->
    <projectFinal ref="projectFinal" @getDetail="getDetail" />
  </div>
</template>

<script src="./project.step.ts"></script>

<style lang="less">
.project-step {
  .pos-r();
  .basic-final {
    position: absolute;
    right: 0;
    transform: translateY(-101px);
    color: var(--theme-color);
  }
}
</style>
