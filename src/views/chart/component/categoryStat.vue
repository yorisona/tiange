<template>
  <section class="cate-stat">
    <div>
      <div style="margin: 10px; overflow: hidden">
        <span class="stat-name">类目统计</span>
        <div class="category-dropdown" style="float: right">
          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            @visible-change="isRightArrow = !isRightArrow"
          >
            <span class="el-dropdown-link"
              >选择维度
              <i :class="isRightArrow ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, index) in categoryStatDimension"
                  :style="{ color: item.color }"
                  :key="index"
                  @click="selectDimen(item, index)"
                >
                  <i class="circle-dot" :style="{ background: item.color }"></i>
                  {{ item.value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-dropdown class="cate-recent-day" trigger="click" :hide-on-click="true">
          <span class="el-dropdown-link"
            >{{ categorystatRecentDay }}<i class="el-icon-arrow-down"></i
          ></span>
          <template #dropdown>
            <el-dropdown-menu style="float: left; margin-left: 12px">
              <el-dropdown-item
                v-for="(item, index) in categoryRecentDayDimension"
                :key="index"
                @click="selectDay(item, index)"
              >
                {{ item.value }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div id="cate-chart"></div>
  </section>
</template>
<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { categoryRecentDayDimension } from '@/const/options';
import { noDataOption } from '@/const/optionChart';

export default {
  props: {
    categoryStatChartInfo: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  name: 'cateStatChart',
  data() {
    return {
      categoryStatDimension: [
        {
          value: '直播场次',
          color: '#7484b7',
        },
        {
          value: '每小时观看人数',
          color: '#4dcdb1',
        },
      ],
      isRightArrow: true,
      categorystatRecentDay: '最近15天',
      currentDay: 0,
      categoryCurrentColor: '',
      categoryRecentDayDimension,
      isClickCateDimen: false,

      cateChart: null,
      isMounted: false,
      noDataOption,
    };
  },
  created() {
    this.categoryCurrentColor = this.categoryStatDimension.map(item => {
      return item.color;
    });
  },
  mounted() {
    this.isMounted = true;
    this.$nextTick(() => {
      if (this.categoryStatChartInfo.length > 0) {
        this.initCateChart();
      } else {
        this.initCateNoData();
      }
    });
    window.addEventListener('resize', this.winResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.winResize);
  },
  watch: {
    categoryStatChartInfo(_val) {
      if (this.isMounted) {
        if (this.categoryStatChartInfo.length > 0) {
          this.initCateChart();
        } else {
          this.initCateNoData();
        }
      }
    },
  },
  methods: {
    selectDimen(item, index) {
      const currentColor = this.categoryCurrentColor[index];
      if (item.color !== '#999') {
        item.color = '#999';
      } else if (item.color === '#999') {
        item.color = currentColor;
      }
      this.cateChart.dispatchAction({
        type: 'legendToggleSelect',
        name: item.value,
      });
    },
    selectDay(item, index) {
      if (item.value !== this.categorystatRecentDay) {
        this.categorystatRecentDay = item.value;
        this.currentDay = index;
        this.initCateChart();
      }
    },
    initCateChart() {
      this.cateChart = echarts.init(document.getElementById('cate-chart'));
      this.cateChart.clear();
      if (this.categoryStatChartInfo.length === 0) {
        this.initCateNoData();
      } else if (this.categoryStatChartInfo[this.currentDay].categorys.length === 0) {
        this.initCateNoData();
      } else {
        const categoryStatChartShowInfo = this.categoryStatChartInfo[this.currentDay];
        for (
          let i = 0, len = categoryStatChartShowInfo.categorys_average_watch_persons.length;
          i < len;
          i++
        ) {
          categoryStatChartShowInfo.categorys_average_watch_persons[i] = parseInt(
            categoryStatChartShowInfo.categorys_average_watch_persons[i],
            10,
          );
        }
        this.cateChart.setOption({
          color: ['#4dcdb1', '#7484b7'],
          legend: {
            show: true,
            x: 'center',
            top: '-999',
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.8)',
            textStyle: { color: '#333', fontSize: 12 },
            axisPointer: {
              type: 'shadow',
              shadowStyle: { color: 'rgba(69, 93, 161, 0.1)' },
            },
            formatter(params) {
              let res = `<div style="color:#5273D3;font-size:14px;font-weight:bold">${params[0].axisValue}</div>`;
              let seriesName, color, data;
              for (let i = 0; i < params.length; i++) {
                color = params[i].color;
                seriesName = params[i].seriesName;
                data = params[i].data;
                res += '<div style="color:' + color + '">' + seriesName + '：' + data + '</div>';
              }
              return res;
            },
          },
          grid: {
            x: 72,
            x2: 46,
            y: 36,
            y2: 46,
            borderWidth: 0,
          },
          // x轴设置
          xAxis: {
            type: 'category',
            axisTick: { show: false },
            axisLine: { lineStyle: { color: 'var(--text-second-color)' } },
            data: categoryStatChartShowInfo.categorys,
          },
          // y轴设置
          yAxis: [
            {
              type: 'value',
              axisTick: { show: false },
              axisLine: {
                lineStyle: { color: '#bebebe' },
              },
              splitLine: {
                lineStyle: { type: 'dashed', color: '#f0efef' },
              },
            },
            {
              type: 'value',
              axisTick: { show: false },
              axisLine: {
                lineStyle: { color: '#bebebe' },
              },
              splitLine: {
                lineStyle: { type: 'dotted', color: '#ececec' },
              },
            },
          ],
          series: [
            {
              type: 'bar',
              data: categoryStatChartShowInfo.categorys_average_watch_persons,
              name: '每小时观看人数',
              barMaxWidth: '6px',
              itemStyle: {
                barBorderRadius: 3,
              },
            },
            {
              type: 'bar',
              data: categoryStatChartShowInfo.categorys_displays,
              name: '直播场次',
              yAxisIndex: 1,
              barMaxWidth: '6px',
              itemStyle: {
                barBorderRadius: 3,
              },
            },
          ],
        });
      }
    },
    initCateNoData() {
      this.cateChart = echarts.init(document.getElementById('cate-chart'));
      this.cateChart.clear();
      this.cateChart.setOption(this.noDataOption);
    },
    winResize() {
      this.cateChart.resize();
    },
  },
};
</script>

<style lang="scss" scoped>
.cate-stat {
  width: 50%;
  height: 420px;
  float: right;
  background: #fff;
  .stat-name {
    float: left;
    color: var(--text-color);
  }
  .category-dropdown {
    cursor: pointer;
    span {
      font-size: 12px;
    }
  }
  .cate-recent-day {
    display: inline-block;
    // background: #f1f2f3;
    padding: 2px 20px;
    border-radius: 20px;
    margin-left: 12px;
    cursor: pointer;
    .el-dropdown-link {
      font-size: 12px;
      color: #666;
      .date-form-icon {
        width: 20px;
        height: 20px;
        background: url(../../../assets/img/personal_sprite.png) -11px -106px;
        float: right;
        margin-left: 12px;
        position: relative;
        bottom: 2px;
      }
    }
  }
}
.circle-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  font-size: 12px;
  line-height: 22px;
  color: #666;
}
#cate-chart {
  width: 100%;
  height: 356px;
}
</style>
