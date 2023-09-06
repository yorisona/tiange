<template>
  <div :style="this.styles || 'height: 300px; width: 100%'" v-loading="loading">
    <base-echarts
      v-if="pieData.length > 0"
      :options="baseOptions"
      style="height: 233px; width: 565px"
      :style="{ height: this.pieHeight + 'px', width: this.pieWidth + 'px' }"
    ></base-echarts>
    <Empty v-else />
  </div>
</template>

<script>
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index';
import { PieRadarColors } from '@/utils/format';
import formatData from '@/utils/formatData';
const { tranNumber } = formatData;

export default {
  name: 'BasePie',
  components: {
    BaseEcharts,
    Empty,
  },
  props: {
    pieHeight: {
      type: Number,
      default: 233,
    },
    pieWidth: {
      type: Number,
      default: 585,
    },
    title: {
      type: Object,
      default: () => ({
        text: '',
      }),
    },
    titleTwo: {
      type: Object,
      default: () => ({
        text: '',
      }),
    },
    loading: {
      type: Boolean,
      default: true,
    },
    pieData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pieTwoData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    styles: {
      type: String,
      default: '',
    },
    legend: {
      type: Object,
      default: () => ({
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        type: 'scroll',
        bottom: -5,
      }),
    },
  },
  data() {
    const legend = this.legend;
    return {
      baseOptions: {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'white',
          formatter: params => {
            const html = `<div class="tooltip-wrapper">
                          <p class="p-row tooltip-title">${params.marker}${params.name}</p>
                          <p class="p-row">
                            <span>数值：</span>
                            <span class="left">${tranNumber(params.value)}</span>
                          </p>
                          <p class="p-row">
                            <span>占比：</span>
                            <span class="left"><span>${params.percent}%</span></span>
                          </p>
                        <div>`;
            return html;
          },
        },
        legend,
        color: PieRadarColors,
        series: [
          {
            title: this.title,
            type: 'pie',
            id: 'pie',
            gridIndex: 1,
            radius: ['45%', '58%'],
            center: ['28%', '45%'],
            emphasis: {
              focus: 'self',
            },
            label: {
              show: true,
              position: 'center',
              formatter: () => {
                return '销售额';
              },
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012',
            },
            avoidLabelOverlap: true,
            bottom: -20,
            data: this.pieData
              ? this.pieData.map(item => {
                  return {
                    itemName: '销售额',
                    name: item.name,
                    value: item.value,
                  };
                })
              : [],
          },
          {
            title: this.title,
            type: 'pie',
            id: 'pie1',
            gridIndex: 2,
            radius: ['45%', '58%'],
            center: ['72%', '45%'],
            emphasis: {
              focus: 'self',
            },
            label: {
              show: true,
              position: 'center',
              formatter: () => {
                return '销量';
              },
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012',
            },
            avoidLabelOverlap: true,
            bottom: -20,
            data: this.pieTwoData
              ? this.pieTwoData.map(item => {
                  return {
                    itemName: '销量',
                    name: item.name,
                    value: item.value,
                  };
                })
              : [],
          },
        ],
      },
    };
  },
  watch: {
    pieData: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.baseOptions = {
        ...this.baseOptions,
        series: [
          {
            type: 'pie',
            id: 'pie',
            title: this.title,
            gridIndex: 1,
            radius: ['45%', '58%'],
            center: ['28%', '45%'],
            emphasis: {
              focus: 'self',
            },
            label: {
              show: true,
              position: 'center',
              formatter: () => {
                return '销售额';
              },
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012',
            },
            avoidLabelOverlap: true,
            bottom: -20,
            data: this.pieData
              ? this.pieData.map(item => {
                  return {
                    itemName: '销售额',
                    name: item.name,
                    value: item.value,
                  };
                })
              : [],
          },
          {
            type: 'pie',
            id: 'pie1',
            title: this.title,
            gridIndex: 2,
            radius: ['45%', '58%'],
            center: ['72%', '45%'],
            emphasis: {
              focus: 'self',
            },
            label: {
              show: true,
              position: 'center',
              formatter: () => {
                return '销量';
              },
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012',
            },
            avoidLabelOverlap: true,
            bottom: -20,
            data: this.pieTwoData
              ? this.pieTwoData.map(item => {
                  return {
                    itemName: '销量',
                    name: item.name,
                    value: item.value,
                  };
                })
              : [],
          },
        ],
      };
    },
  },
};
</script>

<style lang="less">
.tooltip-wrapper {
  width: 100%;
  height: 100%;
  /* margin-left: -5%;
  margin-bottom: -5%;*/
  padding: 8px 10px;
  background: rgba(255, 255, 255, 1);
  /*box-shadow: 0px 2px 8px 0px rgba(11, 14, 33, 0.13);*/
  border-radius: 6px;
  .p-row {
    color: #606974;
    font-size: 12px;
    line-height: 16px !important;
    .left {
      margin-right: 5px;
      color: var(--text-color);
      font-weight: 400;
    }
    &.tooltip-title {
      font-size: 14px;
      font-weight: 400;
      color: var(--text-color);
      margin-bottom: 12px;
    }
  }
}
</style>
