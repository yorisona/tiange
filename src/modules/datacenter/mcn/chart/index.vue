<!--
 * @Author: 肖槿
 * @Date: 2021-07-09 10:27:03
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 17:25:48
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\chart\index.vue
-->
<template>
  <div class="data-center-chart">
    <h3 class="center-chart-title" style="margin: 14px 0 12px 0">汇总数据</h3>
    <div class="center-chart-total" style="margin-bottom: 32px">
      <template v-if="summaryData && summaryData.length > 0">
        <div v-for="(item, keys) in summaryData[0]" :key="keys" class="item">
          <p class="title">{{ keys }}</p>
          <p class="num" v-if="keys === '运营费用'">
            <span v-show="item !== null" class="per">¥</span>
            {{ numberMoneyFormat(item, 2).replace('￥', '') }}
          </p>
          <p class="num" v-else-if="keys === 'GMV'">
            <span v-show="item !== null" class="per">¥</span>
            {{ item ? item.toLocaleString() : '--' }}
          </p>
          <p class="num" v-else>{{ item ? item.toLocaleString() : '--' }}</p>
        </div>
      </template>
      <template v-else>
        <div style="width: 100%; height: 160px"><empty-common /></div>
      </template>
    </div>
    <div class="line-pie-box">
      <div class="line-box">
        <p class="center-chart-title">GMV变化趋势</p>
        <div class="chart-border-box" v-if="gmvData">
          <LineEcharts :date="gmvData.dates" :list="gmvData.lists" :loading="chartLoading" />
        </div>
        <div
          v-else
          style="
            width: 100%;
            padding-top: 100px;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            height: 364px;
            line-height: 364px;
          "
        >
          <empty-common />
        </div>
      </div>
      <div class="pie-box">
        <p class="center-chart-title">各项目GMV占比</p>
        <div class="chart-border-box" v-if="gmvRateData">
          <pieEcharts :pie-data="gmvRateData" :loading="chartLoading" />
        </div>
        <div
          v-else
          style="
            width: 100%;
            padding-top: 100px;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            height: 364px;
            line-height: 364px;
          "
        >
          <empty-common />
        </div>
      </div>
    </div>
    <p class="center-chart-title">运营费用趋势</p>
    <div class="single-line-box" v-if="operatingData">
      <LineEcharts
        :date="operatingData.dates"
        :list="operatingData.lists"
        :loading="chartLoading"
      />
    </div>
    <div
      v-else
      style="
        width: 100%;
        padding-top: 100px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        height: 364px;
        line-height: 364px;
        margin-bottom: 32px;
      "
    >
      <empty-common />
    </div>
    <p class="center-chart-title">直播场次趋势</p>
    <div class="single-line-box" v-if="sessionData">
      <LineEcharts :date="sessionData.dates" :list="sessionData.lists" :loading="chartLoading" />
    </div>
    <div
      v-else
      style="
        width: 100%;
        padding-top: 100px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        height: 364px;
        line-height: 364px;
        margin-bottom: 32px;
      "
    >
      <empty-common />
    </div>
    <div class="line-pie-box">
      <div class="line-box">
        <p class="center-chart-title">开播主播数趋势</p>
        <div class="single-line-box" v-if="liverNumData">
          <LineEcharts
            :date="liverNumData.dates"
            :list="liverNumData.lists"
            :loading="chartLoading"
          />
        </div>
        <div
          v-else
          style="
            width: 100%;
            padding-top: 100px;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            height: 364px;
            line-height: 364px;
            margin-bottom: 32px;
          "
        >
          <empty-common />
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
@import '../../common/chartui.less';
</style>
