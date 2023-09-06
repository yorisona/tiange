<template>
  <div class="data-center-chart">
    <h3 class="center-chart-title" style="margin: 14px 0 12px 0">汇总数据</h3>
    <div class="center-chart-total" style="margin-bottom: 32px">
      <div class="item" v-for="(item, key) in chartTotal" :key="key">
        <p class="title">{{ item.name }}</p>
        <p class="num"><span v-show="item !== null" class="per">¥</span>{{ item.value }}</p>
      </div>
    </div>
    <div class="line-pie-box">
      <div class="line-box">
        <h3 class="center-chart-title">到账金额趋势</h3>
        <div class="chart-border-box">
          <LineEcharts
            :not-show-more="true"
            :date="dateLineList"
            :list="dataLineList"
            :loading="dataLineLoading"
          />
        </div>
      </div>
      <div class="pie-box">
        <h3 class="center-chart-title">各项目到账金额占比</h3>
        <div class="chart-border-box">
          <pieEcharts :pie-data="pieData" :loading="pieDataLoading" />
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
@import '../../common/chartui.less';
</style>
<style lang="less" scoped>
.data-center-chart {
  .center-chart-total {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
