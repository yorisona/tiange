<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="696px"
    top="20vh"
    class="customer-dialog live-case tg-dialog-vcenter"
    @close="onCancelBtnClick"
  >
    <template #title>
      <span>查看案例</span>
    </template>
    <div class="dialog-content">
      <div class="case-title">{{ liveCase.title }}</div>
      <p class="case-description">{{ liveCase.description }}</p>
      <div class="case-block">照片</div>
      <div class="case-img">
        <tg-image
          :src="item"
          alt=""
          class="img-item"
          v-for="(item, index) in liveCase.images"
          :key="index"
        />
      </div>
      <div class="case-block">视频</div>
      <div class="case-video" v-for="(item, index) in liveCase.videos" :key="index">
        <div class="video-name">
          {{ urlHelper.getFileInfo(item).fileName }}
        </div>
        <a class="video-url" :href="item">下载</a>
      </div>
    </div>
  </el-dialog>
</template>

<script src="./liveCase.ts"></script>

<style lang="less" scoped>
@import './liveCase.less';
</style>
