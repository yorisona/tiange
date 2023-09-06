<template>
  <div class="center-project-list">
    <div v-for="item in list" :key="item.id" @click="handleClick(item)" class="item">
      <p v-if="item.project_status == ProjectStatusEnum.finish">【已完结】{{ item.title }}</p>
      <p v-else-if="item.is_reach_end_date">【已结束】{{ item.title }}</p>
      <p v-else>{{ item.title }}</p>
      <span v-if="item.latest_daily_report_date">（{{ item.latest_daily_report_date }}）</span>
    </div>
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less">
.center-project-list {
  padding: 0 6px 0 18px;
  &:after,
  &:before {
    content: ' ';
    clear: both;
    display: block;
  }

  .item {
    width: 224px;
    height: 54px;
    padding: 0 18px;
    border: 1px solid var(--border-line-other-color);
    border-radius: 2px;
    float: left;
    line-height: 54px;
    font-size: 14px;
    color: var(--text-color);
    margin-bottom: 12px;
    margin-right: 12px;
    display: flex;
    cursor: pointer;
    &:hover {
      border: 1px solid var(--theme-color);
      color: var(--theme-color);
    }
    p {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span {
      display: inline-block;
      width: 62px;
      text-align: center;
      color: #ff7a36;
    }
  }
}
</style>
