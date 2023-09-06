import { computed, defineComponent, ref } from '@vue/composition-api';
// import icon_check from '@/assets/img/management/icon_check.png';
// import icon_warning from '@/assets/img/management/icon_warning.png';
import {
  statusColor,
  getIncreaseColor,
  statusStr,
  getStatusImg,
  chartItemColor,
  getAmountFormatUnion,
  getIncreateRateNode,
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
      lineType,
      showGoal,
      computedGMVData,
      computedShowZoom,
      gmvLineTypeOptions,
      ...methods,
    };
  },
  render() {
    const { overview, trend } = this.computedGMVData as any;
    const gmvUnion = this.getAmountFormatUnion(overview?.gmv);
    const gmv_increase_rate = overview?.gmv_increase_rate || 0;
    const trendList = trend || [];
    return (
      <div class="tg-gmv-container">
        <div class="summary-info">
          <div class="summary-info-left">
            <div class="title">
              <div class="title-desc">总GMV</div>
              {gmv_increase_rate > 0 && (
                <div class="ratio">
                  <span>环</span>
                  <tg-icon name="ico-icon_tongyong_shangsheng_16_red"></tg-icon>
                  <span style={`color: ${this.getIncreaseColor(gmv_increase_rate)}`}>
                    {gmv_increase_rate}%
                  </span>
                </div>
              )}
              {gmv_increase_rate < 0 && (
                <div class="ratio">
                  <span>环</span>
                  <tg-icon name="ico-icon_tongyong_xiajiang_16_green"></tg-icon>
                  <span style={`color: ${this.getIncreaseColor(gmv_increase_rate)}`}>
                    {Math.abs(gmv_increase_rate)}%
                  </span>
                </div>
              )}
            </div>
            <div class="gmv">
              <span class="value">{gmvUnion.amountStr}</span>
              {(gmvUnion.unit?.length || 0) > 0 && <span class="unit">{gmvUnion.unit}</span>}
            </div>
          </div>
          <div class="summary-info-right">
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
            showSingleAxis={false}
            trendList={trendList}
            class="dashboard-chart border"
            yUnit={this.yUnit}
            style="height: 236px;"
            loading={this.profitRatioLoading}
            xData={trendList.map((el: any) => el.date)}
            series={[
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
