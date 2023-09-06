<template>
  <div style="height: 345px; width: 100%" v-loading="loading">
    <base-echarts id="lineChart" v-if="date.length > 0" :options="baseOptions"></base-echarts>
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
    /** 图表仅展示10条 */
    notShowMore: {
      type: Boolean,
      default: false,
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
      default: true,
    },
    color: {
      type: Array,
    },
    percentage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      baseOptions: {
        grid: {
          left: 70,
          right: 70,
          top: 10,
          bottom: 100,
        },
        tooltip: {
          trigger: 'axis',
          padding: 0,
          formatter: params => {
            const maxRow = 50;
            let dataDom = '';
            /** 项目管报-整合营销-图表仅展示10条 */
            const list_arr =
              params.length > 10 && this.notShowMore === true
                ? params
                    .sort(function (a, b) {
                      return Number(b.value || 0) - Number(a.value || 0);
                    })
                    .slice(0, 10)
                : params;
            let split =
              Math.round(list_arr.length / maxRow) + 1 > 4
                ? 5
                : Math.round(list_arr.length / maxRow) + 1;
            for (let index = 0; index < list_arr.length; ) {
              dataDom += `<div style="display: flex; line-height: 24px;padding: 0 15px;color: #606974;font-size: 12px;font-weight: normal">`;
              for (let split_index = 0; split_index < split; split_index++) {
                if (index >= list_arr.length) {
                  continue;
                }
                dataDom += `<div style="display: flex;align-items: center;margin-right: 10px;width: 225px;flex: 1;" >${
                  list_arr[index].marker
                }<span>${truncateStr(list_arr[index].seriesName, 22)}</span>
                  <span style="padding-left: 18px;margin-left: auto;">${
                    list_arr[index].value === undefined || list_arr[index].value === null
                      ? '--'
                      : this.percentage
                      ? tranNumber(list_arr[index].value) + '%'
                      : tranNumber(list_arr[index].value)
                  }</span></div>`;

                index += 1;
              }
              dataDom += `</div>`;
              // }
            }
            const tooltipDom = `<div style="padding-bottom: 10px;max-width:50vw;max-height: 80vh;overflow: auto;overflow:overlay;">
              <p style="padding:10px;">
                <span>${params[0].name}</span>
                <span style="float:right;"></span>
              </p>
              ${dataDom}
              `;
            if (params.length > list_arr.length) {
              return (
                tooltipDom +
                `<p style="padding-left:30px;">
                <span>...</span>
                <span style="float:right;"></span>
              </p>
            </div>`
              );
            } else {
              return tooltipDom + `</div>`;
            }
          },
          textStyle: {
            color: 'var(--text-color)',
            fontSize: 12,
            fontWeight: 'bold',
          },
          extraCssText: 'box-shadow: 1px 2px 8px 0px rgba(0, 0, 0, 0.26);',
        },
        legend: {
          show: this.legend,
          type: 'scroll',
          top: 282,
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
      for (let index = 0; index < list.length; index++) {
        for (let child = 0; child < list[index].data.length; child++) {
          if (!list[index].data[child]) {
            list[index].data[child] = 0;
          }
        }
      }
      this.baseOptions.xAxis.data = this.date;
      this.baseOptions.series = list;
    },
  },
};
</script>
