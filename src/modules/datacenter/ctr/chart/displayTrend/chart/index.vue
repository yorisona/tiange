<template>
  <div :id="`trendChart${index}`" style="height: 345px; width: 100%" v-loading="loading">
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
import { formatAmount } from '@/utils/string';
import emptyGoods from '@/assets/img/goods-empty.png';
import { imgTokenUrl } from '@/utils/string';
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
    const index = this.index;
    const originDataList = this.originDataList;
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
          // renderMode: 'html',
          appendToBody: true,
          // confine: true,
          position: function (pos, __, dom, _, size) {
            const chart = document.getElementById(`trendChart${index}`);
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
            // const maxRow = 15;
            // let dataDom = '';
            // let split = Math.round(params.length / maxRow) + 1;
            // for (let index = 0; index < params.length; ) {
            //   dataDom += `<div style="display: flex; line-height: 24px;padding: 0 15px;color: #606974;font-size: 12px;font-weight: normal">`;
            //   for (let split_index = 0; split_index < split; split_index++) {
            //     if (index >= params.length) {
            //       continue;
            //     }
            //     dataDom += `<div style="display: flex;align-items: center;margin-right: 10px;width: 185px;flex: 1;">${
            //       params[index].marker
            //     }<span>${truncateStr(params[index].seriesName, 15)}</span>
            //       <span style="padding-left: 18px;margin-left: auto;">${
            //         params[index].value === undefined || params[index].value === null
            //           ? '--'
            //           : this.percentage
            //           ? tranNumber(params[index].value) + '%'
            //           : tranNumber(params[index].value)
            //       }</span></div>`;
            //     index += 1;
            //   }
            //   dataDom += `</div>`;
            // }

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
              if (!live.live_start_time || !live.live_end_time) {
                return '--';
              }
              const format = 'yyyy.MM.DD HH:mm:ss';
              const start_time = moment(live.live_start_time * 1000).format(format);
              const end_time = moment(live.live_end_time * 1000).format(format);
              // const live_time = `${start_time} ~ ${end_time}`;
              // return live_time;
              return [start_time, end_time];
            };

            const dataIndex = params[0].dataIndex;
            const live = originDataList[dataIndex];
            const change_tips = live.change_tips ?? [];
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

            const [start_time, end_time] = live_time_func(live);

            const tooltipDom = `<div style="padding: 18px">
              <div style="display:flex;">
                <div>场次时间:&nbsp;</div>
                <div>
                  <div>${start_time} ～</div>
                  <div>${end_time}</div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(2, auto); column-gap: 12px; row-gap: 8px; font-weight: 500; margin-top: 16px;">
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;">曝光人数: </span>

                  <span style="font-size: 12px; color: var(--text-color);">${formatAmount(
                    live.room_exposure_ucnt ?? 0,
                    'None',
                    true,
                  )}</span>
                </div>
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;">曝光人次: </span>
                  <span style="font-size: 12px; color: var(--text-color);">${formatAmount(
                    live.room_exposure_times ?? 0,
                    'None',
                    true,
                  )}</span>
                </div>
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;">进入人数: </span>
                  <span style="font-size: 12px; color: var(--text-color);">${formatAmount(
                    live.room_watch_ucnt ?? 0,
                    'None',
                    true,
                  )}</span>
                </div>
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;">进入人次: </span>
                  <span style="font-size: 12px; color: var(--text-color);">${formatAmount(
                    live.room_watch_times ?? 0,
                    'None',
                    true,
                  )}</span>
                </div>
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;">进入率(人数): </span>
                  <span style="font-size: 12px; color: var(--text-color);">${
                    live.exposure_watch_ucnt_ratio
                  }%</span>
                </div>
                <div style="height: 16px; line-height: 16px;">
                  <span style="font-size: 12px; color: #606974;">进入率(人次): </span>
                  <span style="font-size: 12px; color: var(--text-color);">${
                    live.exposure_watch_times_ratio
                  }%</span>
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
                  live.live_screenshot_url,
                )}" style="width: 100%; height: 100%; object-fit: contain; display: ${
              live.live_screenshot_url ? undefined : 'none'
            }"/>
                <img src="${empty}" style="width: 160px; height: 160px; display: ${
              live.live_screenshot_url ? 'none' : undefined
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
