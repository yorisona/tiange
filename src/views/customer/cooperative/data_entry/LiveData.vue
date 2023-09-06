<template>
  <div class="livedata-container">
    <div class="content">
      <sub-panel title="直播数据" :iserect="true">
        <displayInfo ctype="cooperative" />
      </sub-panel>
    </div>
  </div>
</template>

<script>
import displayInfo from '@/views/display';

export default {
  name: 'LiveData',
  components: {
    displayInfo,
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.livedata-container {
  width: 100%;
  background-color: #f2f6f9;
  // padding-top: 10px;
  .content {
    background-color: #fff;
    padding: 10px 24px;
    // border-radius: 10px;
  }
}
</style>
