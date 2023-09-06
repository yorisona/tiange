<template>
  <div :style="this.styles || 'height: 300px; width: 100%'" v-loading="loading">
    <base-echarts
      v-if="pieData.length > 0"
      :options="baseOptions"
      style="height: 233px; width: 285px"
      :style="{ height: this.pieHeight + 'px', width: this.pieWidth + 'px' }"
    ></base-echarts>
    <Empty v-else />
  </div>
</template>

<script>
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index';
import { barPieLoopColors } from '@/utils/format';
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
      default: 285,
    },
    title: {
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
    formatterModal: {
      type: Function,
      default: null,
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
    seriesOpt: {
      type: Object,
      default: () => ({
        radius: ['45%', '65%'],
      }),
    },
  },
  data() {
    const legend = this.legend;
    return {
      baseOptions: {
        title: this.title,
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
        color: barPieLoopColors,
        series: [
          {
            name: this.pieData
              ? this.pieData.map(item => {
                  return item.name;
                })
              : [],
            type: 'pie',
            selectedMode: 'single',
            avoidLabelOverlap: true,
            bottom: -20,
            label: {
              align: 'left',
              normal: {
                textStyle: {
                  fontSize: 12,
                  color: '#606974',
                },
              },
            },
            data: this.pieData
              ? this.pieData.map(item => {
                  return {
                    name: item.name,
                    value: item.value,
                  };
                })
              : [],
            ...this.seriesOpt,
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
            name: this.pieData
              ? this.pieData.map(item => {
                  return item.name;
                })
              : [],
            type: 'pie',
            selectedMode: 'single',
            avoidLabelOverlap: true,
            label: {
              align: 'left',
              normal: {
                textStyle: {
                  fontSize: 12,
                  color: '#606974',
                },
              },
            },
            data: this.pieData
              ? this.pieData.map(item => {
                  return {
                    name: item.name,
                    value: item.value,
                  };
                })
              : [],
            ...this.seriesOpt,
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
      font-weight: 600;
    }
    &.tooltip-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 12px;
    }
  }
}
</style>
