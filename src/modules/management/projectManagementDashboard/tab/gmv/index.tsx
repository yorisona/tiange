import { computed, defineComponent, ref } from '@vue/composition-api';
import {
  statusColor,
  getIncreaseColor,
  statusStr,
  getStatusImg,
  chartItemColor,
  getIncreateRateNode,
  getAmountFormatUnion,
  ratioFormat,
  gmvKeyType,
} from '@/modules/management/use';
import dualAxisPlot from '@/modules/management/components/charts/gmv/index.vue';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import { gmvLineTypeOptions } from '@/modules/management/use';
export default defineComponent({
  components: {
    dualAxisPlot,
  },
  props: {
    gmvData: {
      type: Object,
    },
    showZoom: {
      type: Boolean,
      default: () => false,
    },
  },
  setup: (props, ctx) => {
    const computedGMVData = computed(() => props.gmvData);
    const computedShowZoom = computed(() => props.showZoom);
    const lineType = ref<gmvKeyType>('gmv');
    const methods = {
      statusColor,
      getAmountFormatUnion,
      getStatusImg,
      getIncreaseColor,
      chartItemColor,
      ratioFormat,
      getIncreateRateNode,
      statusStr,
      getIncreaseRateDom: (rate: number | undefined) => {
        return getIncreateRateNode(rate, {
          textStyle: {
            color: 'var(--text-third-color)',
          },
        });
      },
      getCalculateItemDom: (
        title: string,
        amount: number | undefined,
        increase_rate: number | undefined,
      ) => {
        const amountUnion = getAmountFormatUnion(amount);
        return (
          <div class="calculate-item">
            <div class="header">
              <span>{title}</span>
              <span class="header-value">{methods.getIncreaseRateDom(increase_rate)}</span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">{amountUnion.amountStr}</span>
                {amountUnion.unit ? <span class="unit">{amountUnion.unit}</span> : null}
              </div>
            </div>
          </div>
        );
      },
    };

    const showGoal = computed(
      () => lineType.value === 'gmv' || lineType.value === 'livestream_gmv',
    );

    const yUnit = computed(() => {
      const findItem = computedGMVData.value?.trend?.find((el: any) => {
        const gmv = Math.abs(el[lineType.value] ?? 0) / 100;
        if (!showGoal.value) return gmv > 10000;
        const goal_gmv = Math.abs(el.goal_gmv ?? 0) / 100;
        return gmv > 10000 || goal_gmv > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });
    // console.log({
    //   data: props.gmvData,
    // });
    return {
      yUnit,
      computedGMVData,
      computedShowZoom,
      gmvLineTypeOptions,
      lineType,
      showGoal,
      ...methods,
    };
  },
  render() {
    const { overview, trend } = this.computedGMVData as any;
    const gmvUnion = this.getAmountFormatUnion(overview?.gmv);
    const goalUnion = this.getAmountFormatUnion(overview?.goal_gmv);
    const gmv_increase_rate = overview?.gmv_increase_rate || 0;
    const goal_gmv_complete_rate = overview?.goal_gmv_complete_rate;
    const trendList = trend || [];
    return (
      <div class="tg-gmv-container">
        <div class="summary-info">
          <div class="summary-info-left">
            <div class="title">
              <div class="title-desc">总GMV</div>
              {this.getIncreateRateNode(gmv_increase_rate, {
                textStyle: {
                  color: 'var(--text-color)',
                },
              })}
            </div>
            <div class="gmv">
              <span class="value">{gmvUnion.amountStr}</span>
              {(gmvUnion.unit?.length || 0) > 0 && <span class="unit">{gmvUnion.unit}</span>}
            </div>
          </div>
          <div class="summary-info-right">
            <div class="process-summary">
              {this.getStatusImg(goal_gmv_complete_rate)}
              <div class="process-desc">
                预算目标：<span class="goal-value">{goalUnion.amountStr}</span>
                {goalUnion.unit ? <span class="goal-unit">{goalUnion.unit}</span> : null}
                （进度&nbsp;
                <span
                  class="process-value"
                  style={`color: ${this.statusColor(goal_gmv_complete_rate)}`}
                >
                  {this.ratioFormat(goal_gmv_complete_rate)}
                </span>
                ）
                <span class="status" style={`color: ${this.statusColor(goal_gmv_complete_rate)}`}>
                  {this.statusStr(goal_gmv_complete_rate)}
                </span>
              </div>
              <el-progress
                color={this.statusColor(goal_gmv_complete_rate)}
                define-back-color="#E4E4E4"
                show-text={false}
                stroke-width={12}
                percentage={
                  (overview?.goal_gmv_complete_rate || 0) > 100
                    ? 100
                    : overview?.goal_gmv_complete_rate || 0
                }
              ></el-progress>
            </div>
            <div class="calculate">
              <span class="operator">=</span>
              {this.gmvLineTypeOptions
                .filter((el, idx) => idx > 0)
                .map((el, idx) => (
                  <fragments>
                    {idx !== 0 && <span class="operator">+</span>}
                    {this.getCalculateItemDom(
                      el.label,
                      overview?.[el.gmvKey],
                      overview?.[el.gmvIncreaseRateKey],
                    )}
                  </fragments>
                ))}
              {/*{this.getCalculateItemDom(*/}
              {/*  '抖音直播',*/}
              {/*  overview?.livestream_gmv,*/}
              {/*  overview?.livestream_gmv_increase_rate,*/}
              {/*)}*/}
              {/*<span class="operator">+</span>*/}
              {/*{this.getCalculateItemDom(*/}
              {/*  '橱窗',*/}
              {/*  overview?.showcase_gmv,*/}
              {/*  overview?.showcase_gmv_increase_rate,*/}
              {/*)}*/}
              {/*<span class="operator">+</span>*/}
              {/*{this.getCalculateItemDom(*/}
              {/*  '短视频',*/}
              {/*  overview?.shortvideo_gmv,*/}
              {/*  overview?.shortvideo_gmv_increase_rate,*/}
              {/*)}*/}
              {/*<span class="operator">+</span>*/}
              {/*{this.getCalculateItemDom(*/}
              {/*  '其它',*/}
              {/*  overview?.others_gmv,*/}
              {/*  overview?.others_gmv_increase_rate,*/}
              {/*)}*/}
              {/*<span class="operator">+</span>*/}
              {/*{this.getCalculateItemDom(*/}
              {/*  '微信视频号',*/}
              {/*  overview?.wechat_video_gmv,*/}
              {/*  overview?.wechat_video_gmv_increase_rate,*/}
              {/*)}*/}
            </div>
          </div>
        </div>
        <div class="chart-title">GMV趋势</div>
        <div class="chart-field">
          <dualAxisPlot
            key={trendList}
            showZoom={this.computedShowZoom}
            trendList={trendList}
            class="dashboard-chart border"
            yUnit={this.yUnit}
            style="height: 236px;"
            loading={this.profitRatioLoading}
            xData={trendList.map((el: any) => el.date)}
            series={[
              {
                singleAxisIndex: 0,
                coordinateSystem: 'singleAxis',
                type: 'scatter',
                data: trendList.map((el: any) => {
                  const length = el.live_comments?.length || 0;
                  return length === 0 ? 0 : 8;
                }),
                symbol: 'circle', //roundRect
                color: '#FFBF00',
                symbolSize: function (val: number) {
                  return val;
                },
                symbolOffset: [0, '50%'],
              },
              {
                name: '完成GMV',
                type: 'line',
                itemStyle: {
                  color: '#2877ff',
                },
                lineStyle: {
                  width: 3,
                  shadowColor: '#2877ff3d',
                  shadowOffsetX: 0,
                  shadowOffsetY: 11,
                  shadowBlur: 11,
                },
                data: trendList.map((el: any) => {
                  let value = el[this.lineType];
                  value = value !== null && value !== undefined ? value / 100 : null;
                  return value;
                }),
              },
              this.showGoal && {
                name: '预算目标',
                type: 'line',
                // smooth: true,
                showSymbol: false,
                // yAxisIndex: 1,
                itemStyle: {
                  color: '#FF7F00',
                },
                lineStyle: {
                  width: 3,
                  shadowColor: '#FF7F003d',
                  shadowOffsetX: 0,
                  shadowOffsetY: 11,
                  shadowBlur: 11,
                },
                // stack: 'Total',
                data: trendList.map((el: any) => {
                  const value = el.goal_gmv;
                  return value !== null && value !== undefined ? value / 100 : null;
                }),
              },
            ].filter(Boolean)}
          ></dualAxisPlot>
          {trendList.length > 0 && (
            <div class="chart-filter">
              <div class="line-filter">
                <el-radio-group v-model={this.lineType}>
                  {this.gmvLineTypeOptions.map(el => (
                    <el-radio label={el.gmvKey}>{el.label}</el-radio>
                  ))}
                </el-radio-group>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
});
