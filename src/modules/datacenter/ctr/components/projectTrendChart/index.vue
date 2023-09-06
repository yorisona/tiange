<template>
  <div :id="`ProjectrendChart${index}`" style="height: 345px; width: 100%" v-loading="loading">
    <base-echarts v-if="date.length > 0" :options="baseOptions"></base-echarts>
    <Empty v-else />
  </div>
</template>

<script>
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart';
import formatData from '@/utils/formatData';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import { lineRadarColors } from '@/utils/format';
import moment from 'moment';
import emptyGoods from '@/assets/img/goods-empty.png';
import { imgTokenUrl } from '@/utils/string';
import formatPriceForm from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;
// const { formatBigNumber, tranNumber } = formatData;
const { tranNumber } = formatData;
export default {
  //   name: 'BaseLine',
  components: {
    BaseEcharts,
    Empty,
  },
  props: {
    loading: {
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
    originDataList: {
      type: Array,
      efault: () => {
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
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    // const index = this.index;
    // const originDataList = this.originDataList;
    const empty = emptyGoods;
    return {
      baseOptions: {
        grid: {
          left: 73,
          right: 73,
          top: 10,
          bottom: 84,
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          padding: 0,
          renderMode: 'html',
          appendToBody: true,
          // confine: true,
          position: (pos, __, dom, _, size) => {
            const chart = document.getElementById(`ProjectrendChart${this.computedIndex}`);
            const innerHeight = window.innerHeight;
            const offsetTop = chart.getBoundingClientRect().top;

            const viewWidth = size.viewSize[0];
            const domWidth = dom.clientWidth;
            // const padding = 73;

            const domH = offsetTop + pos[1] + dom.clientHeight;
            const distance = innerHeight - domH;
            const offsetY = distance < 0 ? distance - 24 : 0;
            if (viewWidth / 2 >= pos[0]) {
              //其中point为当前鼠标的位置,在左侧
              // return [viewWidth - domWidth - padding, -offsetTop];
              return [pos[0] + 30, pos[1] + offsetY];
            } else {
              //其中point为当前鼠标的位置
              // return [padding, -offsetTop];
              return [pos[0] - domWidth - 30, pos[1] + offsetY];
            }
          },
          formatter: params => {
            const tipModel = ({ change_tip: tipNumber }) => {
              let color = undefined;
              let backgroundColor = undefined;
              let text = undefined;
              switch (`${tipNumber}`) {
                case '1': {
                  color = '#556FF6';
                  backgroundColor = '#556ff614';
                  text = '硬装';
                  break;
                }
                case '2': {
                  color = '#00F7E9';
                  backgroundColor = '#00f7e914';
                  text = '灯光';
                  break;
                }
                case '3': {
                  color = '#FF6A39';
                  backgroundColor = '#ff6a3914';
                  text = '机位';
                  break;
                }
                case '4': {
                  color = '#FFBD00';
                  backgroundColor = '#ffbd0014';
                  text = '陈列';
                  break;
                }
                case '5': {
                  color = '#00CE59';
                  backgroundColor = '#00ce5914';
                  text = '贴片';
                  break;
                }
                case '6': {
                  color = '#FF6FCD';
                  backgroundColor = '#ff6fcd14';
                  text = '调色';
                  break;
                }
                default:
                  break;
              }
              return {
                color,
                backgroundColor,
                text,
              };
            };

            const live_time_func = live => {
              // debugger
              if (!live.start_date) {
                return '--';
              }
              if (live.statistics_cycle === 1) {
                const date = moment(live.start_date).format('yyyy.MM.DD');
                return date;
              } else if (live.statistics_cycle === 2) {
                let date = moment(live.start_date).format('yyyy 第 ww 周');
                date = `${date}（${live.start_date.replace(/-/g, '.')} - ${live.end_date.replace(
                  /-/g,
                  '.',
                )}）`;
                return date;
              } else if (live.statistics_cycle === 3) {
                const date = moment(live.start_date).format('yyyy.MM');
                return date;
              }
              // const format = 'yyyy.MM.DD';
              // const start_time = moment(live.live_start_time ).format(format);
              // return start_time;
            };

            const dataIndex = params[0].dataIndex;
            const live = this.computedDataList[dataIndex];
            const change_tips = live?.change_tips ?? [];
            const changeTipsStr =
              change_tips.length === 0
                ? '--'
                : change_tips
                    .map(el => {
                      const tip = tipModel(el);
                      const username = `<span style="margin-left: 4px;font-size: 12px;">(${
                        el.username ? el.username : ''
                      })</span>`;
                      return `<span style="margin-left: 4px; background-color: ${
                        tip.backgroundColor
                      }; color: ${
                        tip.color
                      }; border-radius: 2px; padding: 2px 4px; font-size: 12px;">${
                        tip.text
                      }</span>${el.username ? username : ''}`;
                    })
                    .join('');

            const live_time = live_time_func(live);

            const tooltipDom = `<div style="padding: 18px">
              <p>
                <span>${live_time}</span>
                <span style="float:right;"></span>
              </p>
              <div style="display: grid; grid-template-columns: repeat(1, auto); column-gap: 8px; row-gap: 8px; font-weight: 500; margin-top: 16px;">
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;display: inline-block;width: 95px;text-align: right;">平均进入率(人数): </span>
                  <span style="font-size: 12px; color: var(--text-color);">${
                    live.exposure_watch_ucnt_ratio
                  }%</span>
                </div>
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;display: inline-block;width: 95px;text-align: right;">平均进入率(人次): </span>
                  <span style="font-size: 12px; color: var(--text-color);">${
                    live.exposure_watch_times_ratio
                  }%</span>
                </div>
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;display: inline-block;width: 95px;text-align: right;">直播销售额(元): </span>
                  <span style="font-size: 12px; color: var(--text-color);">${formatPriceFormYuan(
                    live.sum_gmv,
                    2,
                    false,
                  )}</span>
                </div>
              </div>
              <div style="height: 1px; border-top: 1px dashed rgba(164,178,194,0.30); margin: 12px 0;"></div>
              <div style="font-size: 12; font-weight: 400;">
                <span style="color: #606974;">变更信息: </span>
                <div style="width:320px; display: flex;align-items: center;flex-wrap: wrap;margin-top:5px;">
                  ${changeTipsStr}
                </div>
              </div>
              <div style="margin-top: 16px; width: 320px; height: 505px; display: flex; align-items: center; justify-content: center; background-color: #F5F9FC;">
                <img src="${imgTokenUrl(
                  live.live_screenshot,
                )}" style="width: 100%; height: 100%; object-fit: contain; display: ${
              live.live_screenshot ? undefined : 'none'
            }" />
                <img src="${empty}" style="width: 160px; height: 160px; display: ${
              live.live_screenshot ? 'none' : undefined
            }"/>
              </div>
            </div>`;
            return tooltipDom;
          },
          textStyle: {
            color: '#343F4C',
            fontSize: 14,
            fontWeight: 'bold',
          },
          extraCssText: 'box-shadow: 1px 2px 8px 0px rgba(0, 0, 0, 0.26);',
        },
        legend: {
          show: this.legend,
          bottom: 26,
          left: '153',
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
                  // return `${result}%`;
                  return `${args[0]}%`;
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
              show: false,
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
  computed: {
    computedDataList() {
      return this.originDataList;
    },
    computedIndex() {
      return this.index;
    },
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
