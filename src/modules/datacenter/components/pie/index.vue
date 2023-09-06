<template>
  <div :style="this.styles || 'height: 300px; width: 100%'" v-loading="loading">
    <base-echarts
      v-if="pieData.length > 0"
      :options="baseOptions"
      :style="this.styles || ''"
    ></base-echarts>
    <Empty v-else />
  </div>
</template>

<script>
import BaseEcharts from '../baseEcharts/chart';
import Empty from '../empty/index.vue';
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
                          <p class="p-row">
                            <span class="right">${params.marker}${params.name}</span>
                          </p>
                          <p class="p-row"><span class="left">数值：<span>${tranNumber(
                            params.value,
                          )}</span></span></p>
                          <p class="p-row"><span class="left">占比：<span>${
                            params.percent
                          }%</span></span></p>
                        <div>`;
            return this.formatterModal ? this.formatterModal(params) : html;
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
  .tooptip-title {
    color: var(--text-color);
    font-size: 14px;
  }
  .right {
    font-size: 14px;
    color: #343f4c;
    font-weight: 600;
    line-height: 24px;
  }
  .p-row {
    margin-top: 3px;
    color: #606974;
    font-size: 12px;
    font-weight: normal;
    line-height: 28px;
    .left {
      margin-right: 5px;
    }
  }
}
</style>
