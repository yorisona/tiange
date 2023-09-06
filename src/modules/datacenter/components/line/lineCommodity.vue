<template>
  <div style="height: 314px; width: 100%" v-loading="loading">
    <base-echarts v-if="date.length > 0" :options="baseOptions"></base-echarts>
    <Empty v-else />
  </div>
</template>

<script>
import BaseEcharts from '../baseEcharts/chart';
import formatData from '@/utils/formatData';
import Empty from '../empty/index.vue';
import { lineRadarColors, truncateStr } from '@/utils/format';
// const { formatBigNumber, tranNumber } = formatData;
const { tranNumber } = formatData;
const toFixed2 = (num, index) => {
  const value = num - 0;
  if (index === 0) return num;
  if (isNaN(value)) return num;
  return value.toFixed(2);
};
export default {
  name: 'BaseLine',
  components: {
    BaseEcharts,
    Empty,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Array,
      default: () => {
        return [];
      },
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    legend: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    color: {
      type: Array,
    },
    percentage: {
      type: Boolean,
    },
    unit: {
      type: String,
      default: '%',
    },
  },
  data() {
    return {
      baseOptions: {
        grid: {
          top: 10,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 0,
          formatter: params => {
            const maxRow = 15;
            let dataDom = '';
            let split = Math.round(params.length / maxRow) + 1;
            for (let index = 0; index < params.length; ) {
              const echar = index === 1 || index === 2 ? this.unit : '';
              dataDom += `<div style="display: flex; line-height: 24px;padding: 0 15px;color: #606974;font-size: 12px;font-weight: normal">`;
              for (let split_index = 0; split_index < split; split_index++) {
                if (index >= params.length) {
                  continue;
                }
                const hasNull = params[index].value === undefined || params[index].value === null;
                dataDom += `<div style="display: flex;align-items: center;margin-right: 10px;flex: 1;">${
                  params[index].marker
                }<span>${truncateStr(params[index].seriesName, 15)}</span>
                  <span style="padding-left: 18px;">${
                    hasNull ? '--' : toFixed2(tranNumber(params[index].value), index)
                  }${hasNull ? '' : echar}</span></div>`;
                index += 1;
              }
              dataDom += `</div>`;
            }
            const tooltipDom = `<div style="padding-bottom: 10px">
              <p style="padding:10px;">
                <span>${params[0].name}</span>
                <span style="float:right;"></span>
              </p>
              ${dataDom}
            </div>`;
            return tooltipDom;
          },
          textStyle: {
            color: '#343F4C',
            fontSize: 14,
            fontWeight: 'bold',
          },
          extraCssText: 'box-shadow: 1px 2px 8px 0px  rgba(0, 0, 0, 0.26);',
        },
        legend: {
          show: this.legend,
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: 'rgba(52,63,76,0.30)',
            },
          },
          axisTick: {
            lineStyle: {
              opacity: 0,
            },
          },
          axisLabel: {
            color: '#606974',
            fontSize: 11,
          },
          splitLine: {
            show: false,
          },
        },
        color: this.color ? this.color : lineRadarColors,
        yAxis: [
          {
            type: 'value',
            scale: true,
            nameTextStyle: {
              color: '#666',
              fontSize: 14,
            },
            min: 0,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eee'],
                type: 'dashed',
              },
            },
            axisTick: {
              lineStyle: {
                opacity: 0,
              },
            },
            axisLabel: {
              color: '#606974',
              formatter: (...args) => {
                const result = tranNumber(...args);
                if (this.percentage === true) {
                  return `${result}%`;
                }
                return result;
              },
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(52,63,76,0.30)',
                width: '1',
              },
            },
          },
          {
            type: 'value',
            scale: true,
            position: 'right',
            nameTextStyle: {
              color: '#666',
              fontSize: 14,
            },
            min: 0,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eee'],
                type: 'dashed',
              },
            },
            axisTick: {
              lineStyle: {
                opacity: 0,
              },
            },
            axisLabel: {
              color: '#606974',
              formatter: (...args) => {
                const result = tranNumber(...args);
                return `${result}${this.unit}`;
              },
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: 'rgba(52,63,76,0.30)',
                width: '1',
              },
            },
          },
        ],
        series: [],
      },
    };
  },
  created() {
    this.init();
  },
  watch: {
    date: {
      handler() {
        this.init();
      },
      deep: true,
    },
    list: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    init() {
      const list = JSON.parse(JSON.stringify(this.list));
      this.baseOptions.xAxis.data = this.date;
      this.baseOptions.series = list;
    },
  },
};
</script>
