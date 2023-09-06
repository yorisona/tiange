<template>
  <div class="data-center-chart">
    <h3 class="center-chart-title" style="margin: 14px 0 12px 0">汇总数据</h3>
    <div class="center-chart-total">
      <div class="item">
        <p class="title">GMV</p>
        <p class="num" v-if="numberFormat(summaryData.GMV, 2) === null">--</p>
        <p class="num" v-else><span class="per">¥</span>{{ numberFormat(summaryData.GMV, 2) }}</p>
      </div>
      <div class="item">
        <p class="title">预估净销售额</p>
        <p class="num" v-if="numberFormat(summaryData.预估净销额, 2) === null">--</p>
        <p class="num" v-else>
          <span class="per">¥</span>{{ numberFormat(summaryData.预估净销额, 2) }}
        </p>
      </div>
      <div class="item">
        <p class="title">预估佣金收入</p>
        <p class="num" v-if="numberFormat(summaryData.预估佣金收入, 2) === null">--</p>
        <p class="num" v-else>
          <span class="per">¥</span>{{ numberFormat(summaryData.预估佣金收入, 2) }}
        </p>
      </div>
      <div class="item">
        <p class="title">到账金额</p>
        <p class="num" v-if="numberFormat(summaryData.到账金额, 2) === null">--</p>
        <p class="num" v-else>
          <span class="per">¥</span>{{ numberFormat(summaryData.到账金额, 2) }}
        </p>
      </div>
    </div>
    <div class="center-chart-total" style="margin-bottom: 32px">
      <div class="item">
        <p class="title">直播时长</p>
        <p class="num" v-if="summaryData['直播时长(小时)']">
          {{ summaryData['直播时长(小时)'].toLocaleString() }}&nbsp;<span class="per">h</span>
        </p>
        <p class="num" v-else>--</p>
      </div>
      <div class="item">
        <p class="title">新增粉丝数</p>
        <p class="num">
          {{ summaryData['新增粉丝数'] ? summaryData['新增粉丝数'].toLocaleString() : '--' }}
        </p>
      </div>
      <div class="item">
        <p class="title">同时最高在线人数</p>
        <p class="num">
          {{
            summaryData['同时最高在线人数']
              ? summaryData['同时最高在线人数'].toLocaleString()
              : '--'
          }}
        </p>
      </div>
      <div class="item">
        <p class="title">用户停留时长</p>
        <p class="num" v-if="summaryData['用户停留时长(秒)']">
          {{ summaryData['用户停留时长(秒)'].toLocaleString() }}&nbsp;<span class="per">s</span>
        </p>
        <p class="num" v-else>--</p>
      </div>
    </div>
    <div class="line-pie-box">
      <div class="line-box">
        <h3 class="center-chart-title">到账金额趋势</h3>
        <div class="chart-border-box">
          <LineEcharts
            :date="IncomeAmountTrend.date"
            :list="IncomeAmountTrend.data"
            :loading="IncomeAmountTrend.loading"
          />
        </div>
      </div>
      <div class="pie-box">
        <h3 class="center-chart-title">各项目到账金额占比</h3>
        <div class="chart-border-box">
          <pieEcharts :pie-data="IncomeAmountPercentData" :loading="IncomeAmountPercentLoading" />
        </div>
      </div>
    </div>
    <h3 class="center-chart-title">预估净销额趋势</h3>
    <div class="single-line-box">
      <LineEcharts
        :date="NetSalesAmountTrend.date"
        :list="NetSalesAmountTrend.data"
        :loading="NetSalesAmountTrend.loading"
      />
    </div>
    <h3 class="center-chart-title">预估佣金趋势</h3>
    <div class="single-line-box">
      <LineEcharts
        :date="CommissonAmountTrend.date"
        :list="CommissonAmountTrend.data"
        :loading="CommissonAmountTrend.loading"
      />
    </div>

    <div class="line-pie-box">
      <div class="line-box">
        <h3 class="center-chart-title">GMV变化趋势</h3>
        <div class="chart-border-box">
          <LineEcharts :date="GmvTrend.date" :list="GmvTrend.data" :loading="GmvTrend.loading" />
        </div>
      </div>
      <div class="pie-box">
        <h3 class="center-chart-title">各项目GMV占比</h3>
        <div class="chart-border-box">
          <pieEcharts :pie-data="GmvPercentData" :loading="GmvPercentLoading" />
        </div>
      </div>
    </div>

    <h3 class="center-chart-title">直播效果趋势</h3>
    <div class="tag-list">
      <span class="tag-lable">维度：</span>
      <div class="tag-content">
        <span
          v-for="item in tagList"
          :key="item.value"
          :class="['tag-btn', { 'tag-btn-active': item.value === defaultTag }]"
          @click="handleTagFilter(item.value)"
          >{{ item.label }}</span
        >
      </div>
    </div>
    <div class="single-line-box">
      <LineEcharts
        :date="LiveEffectTrend[defaultTag].date"
        :list="LiveEffectTrend[defaultTag].data"
        :loading="LiveEffectLoading"
      />
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less">
@import '~@/styles/utils';
@import '../../common/chartui.less';
.chart-border-box {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
