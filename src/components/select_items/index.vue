<template>
  <div class="selectitem-container">
    <div class="choose-block">
      <div class="name">{{ title }}:</div>
      <div class="category-list" v-if="dataitems && dataitems.length > 0">
        <div
          class="category-item"
          :class="{ current: currentIndex === item[value] }"
          v-for="item in dataitems"
          :key="item[value]"
          @click="handleSelectItem(item[value])"
        >
          {{ item[label] }}
        </div>
      </div>
      <span v-else>--</span>
    </div>
  </div>
</template>

<script>
/**
 * 选择项组件
 */
export default {
  name: 'SelectItems',
  /**
   * title: 标题
   * dataitems: 选项数据数组
   * value: ?
   * label: ?
   */
  props: ['title', 'dataitems', 'value', 'label'],
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    handleSelectItem(val) {
      this.currentIndex = val;
      this.$emit('select-click', val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.selectitem-container {
  .choose-block {
    min-height: 60px;
    box-sizing: border-box;
    font-size: 0;
    padding: 15px 12px;
    display: flex;
    .name {
      font-size: 16px;
      color: var(--text-des-color);
      line-height: 30px;
      display: inline-block;
      width: 80px;
    }
    .category-list {
      display: inline-block;
      flex: 1;
      .category-item {
        display: inline-block;
        font-size: 16px;
        color: var(--text-des-color);
        line-height: 30px;
        padding: 0 10px;
        margin: 0 10px;
        border-bottom: #fff solid 2px;
        cursor: pointer;
      }
    }
  }
}
</style>
