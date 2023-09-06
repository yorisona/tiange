<template>
  <section class="logs-detail">
    <el-row class="logs-list-tit">
      <el-col :span="12">新增信息列表</el-col>
      <el-col :span="12">更新信息列表</el-col>
      <!-- <el-col :span="6">失败信息列表</el-col>
    <el-col :span="6">失败原因</el-col> -->
    </el-row>
    <el-row class="logs-list gm-scrollBar-style">
      <el-col :span="12">
        <div
          :class="index % 2 === 0 ? 'is-normal' : 'is-gray'"
          v-for="(item, index) in logsDetailData.add_item"
          :key="index"
        >
          <span>
            {{ item }}
          </span>
        </div>
        <div v-show="logsDetailData.add_item.length === 0">暂无~</div>
      </el-col>
      <el-col :span="12">
        <div
          :class="indexs % 2 === 0 ? 'is-normal' : 'is-gray'"
          v-for="(items, indexs) in logsDetailData.update_item"
          :key="indexs"
        >
          <span>
            {{ items }}
          </span>
        </div>
        <div v-show="logsDetailData.update_item.length === 0">暂无~</div>
      </el-col>
      <!-- <el-col :span="6">
      <div :class="index%2 === 0 ? 'is-normal':'is-gray'" v-for="(arg, index) in logsDetailData.failed_item" :key="index">
        <span>{{arg.title}}</span>
      </div>
      <div v-show="logsDetailData.failed_item.length === 0">暂无~</div>
    </el-col>
    <el-col :span="6">
      <div :class="index%2 === 0 ? 'is-normal':'is-gray'" v-for="(arg, index) in logsDetailData.failed_item" :key="index">
        <span>{{arg.failed_message}}</span>
      </div>
      <div v-show="logsDetailData.failed_item.length === 0">暂无~</div>
    </el-col> -->
    </el-row>
  </section>
</template>

<script>
export default {
  name: 'logsTable',
  props: ['logsDetailData'],
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.logs-detail {
  border: 1px solid #eee;
  border-radius: 10px;
}
.logs-list-tit {
  .el-col {
    background: #f2f6f9;
    color: #666;
    padding: 10px 10px;
    font-weight: 600;
    // border:1px solid rgba(235,238,246,1);
  }
}
.logs-list {
  max-height: 370px;
  overflow-y: auto;
  .el-col {
    div {
      overflow: hidden;
      // white-space: nowrap;
      text-overflow: ellipsis;
      height: 36px;
      line-height: 36px;
    }
    .is-gray {
      padding: 5px 0;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    .is-normal {
      padding: 5px 0;
      background: #fff;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
  }
}
</style>
