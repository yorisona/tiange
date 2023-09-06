<template>
  <div class="subpanel-container">
    <div :class="iserect ? 'erect-content-title' : 'content-title'">
      {{ title }}
    </div>
    <div class="content-text">
      <slot />
    </div>
  </div>
</template>

<script>
/**
 * 二级Panel组件
 */
export default {
  name: 'SubPanel',
  /**
   * title: 标题
   * iserect: ？
   */
  props: ['title', 'iserect'],
};
</script>

<style lang="scss" scoped>
@import '../../styles/vars.scss';
.subpanel-container {
  .content-title {
    margin-top: 30px;
    border-bottom: 1px dashed #efefef;
    line-height: 1;
    font-size: 14px;
    color: #666666;
    font-weight: 600;
    position: relative;
    padding: 0 0 20px 12px;
  }
  .erect-content-title {
    height: 18px;
    line-height: 1;
    font-size: 14px;
    color: var(--text-color);
    font-weight: 600;
    padding: 16px 0 8px 20px;
    border-radius: 10px;
  }
  // .content-text {
  //   padding-bottom: 20px;
  // }
}
</style>
