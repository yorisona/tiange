<template>
  <div style="height: 314px; width: 100%" v-loading="loading">
    <base-echarts
      v-if="date.length > 0"
      :options="baseOptions"
      style="width: 680px; height: 314px"
    />
    <Empty v-else />
  </div>
</template>

<script>
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index';
import { lineRadarColors, truncateStr } from '@/utils/format';
import formatData from '@/utils/formatData';

const { tranNumber } = formatData;
const toFixed2 = (num, index, uint = '') => {
  if (num === undefined || num === null || num === '' || num === '--') return '--';
  const value = Math.abs(num - 0);
  if (isNaN(value)) return num + uint;
  if (index === 0) return value + uint;
  return value.toFixed(index) + uint;
};

export default {
  name: 'index',
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
          top: 30, // 组件离容器上侧的距离,百分比字符串或整型数字
          left: 10, // 组件离容器左侧的距离,百分比字符串或整型数字
          right: 30,
          bottom: 40,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 0,
          formatter: params => {
            let dataDom = '';
            for (let index = 0; index < 3; index++) {
              dataDom += `<div style="display: flex; line-height: 24px;padding: 0 10px;color: #606974;font-size: 12px;font-weight: normal">`;

              dataDom += `<div style="display: flex;align-items: center;margin-right: 10px; flex: 1;">`;
              const seriesName = params[index].seriesName;
              let isUpDown =
                params[index].value > 0
                  ? 'ico-icon_tongyong_shangsheng_16_red'
                  : 'ico-icon_tongyong_xiajiang_16_green';
              isUpDown = `<svg  aria-hidden="true" class="icon ${isUpDown}" style="color: rgb(196, 203, 210);"><use xlink:href="#${isUpDown}"></use></svg>`;
              if (seriesName === '品牌销售额' || seriesName === '大盘销售额') {
                const realValue = params.find(it => it.seriesName === seriesName + '_data');

                dataDom += `${params[index].marker}<span>${truncateStr(
                  params[index].seriesName,
                  15,
                )}：</span>`;
                dataDom += `<span style="padding-left: 5px; font-weight: 600">${toFixed2(
                  realValue?.value,
                  index,
                )} `;
                if (
                  realValue?.value !== null &&
                  realValue?.value !== undefined &&
                  realValue.value !== '--'
                ) {
                  dataDom += `(${isUpDown}${toFixed2(params[index].value, 0, '%')})`;
                }
                dataDom += `</span>
                  </div>`;
              } else if (params[index].seriesName === '品牌对比涨幅') {
                dataDom += `<span style="padding-left: 16px">${params[index].seriesName}：</span>`;
                if (
                  params[index].value !== undefined &&
                  params[index].value !== null &&
                  params[index].value !== '--'
                ) {
                  dataDom += `<span style="padding-left: 5px; font-weight: 600">${isUpDown}${toFixed2(
                    tranNumber(params[index].value),
                    0,
                    '%',
                  )}</span>`;
                } else {
                  dataDom += `<span style="padding-left: 5px; font-weight: 600">--</span>`;
                }

                dataDom += `</div>`;
                dataDom += `</div>`;
                break;
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
          data: ['品牌销售额', '大盘销售额'],
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: 'rgba(52,63,76,0.30)',
            },
            onZero: false,
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
            name: '销售额涨幅%',
            nameLocation: 'end',
            nameTextStyle: {
              color: '#606974',
              fontSize: 12,
            },
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
            show: false,
            nameLocation: 'end',
            nameTextStyle: {
              color: '#606974',
              fontSize: 12,
            },
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
      this.baseOptions = {
        ...this.baseOptions,
      };
    },
  },
};
</script>

<style scoped></style>
