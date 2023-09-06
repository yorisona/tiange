<template>
  <div class="moreitems-container">
    <el-popover
      v-if="items.length > 1"
      popper-class="moreitems-popover"
      placement="top"
      width="150"
      trigger="hover"
    >
      <template slot="reference">
        <span class="moreitems-reference">
          {{ items[0] }}
          <i class="icon-arrow el-icon-arrow-down"></i>
        </span>
      </template>
      <ul class="moreitems">
        <li v-for="(item, index) in items" :key="index">{{ item }}</li>
      </ul>
    </el-popover>
    <span v-else-if="items.length === 1">{{ items[0] }}</span>
    <span v-else>--</span>
  </div>
</template>

<script>
/**
 * 多文本内容气泡展示
 */
export default {
  name: 'MoreItems',
  /** 文本内容数组 */
  props: ['items'],
};
</script>

<style lang="less" scoped>
.moreitems-container {
  .moreitems-reference {
    cursor: pointer;
    position: relative;
    padding-right: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .icon-arrow {
      position: absolute;
      top: 3px;
      right: 0;
      margin-left: 6px;
    }
  }
}
</style>
<style>
.moreitems-popover.el-popover {
  min-width: 300px;
}
.moreitems-popover .moreitems li {
  display: inline-block;
  background: #f2f2f2;
  margin: 3px;
  padding: 4px 6px;
}
.moreitems-popover .moreitems li:last-child {
  border-bottom: none;
}
</style>
