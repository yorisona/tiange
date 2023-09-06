/** 看板首页 */
import { computed, defineComponent, onMounted, watchEffect } from '@vue/composition-api';
import sunburst from '@/modules/finance/managementDashboard/components/charts/sunburst/index.vue';
import trendLine from '@/modules/finance/managementDashboard/components/charts/trendLine/index.vue';
import laborEffectLine from '@/modules/finance/managementDashboard/components/charts/laborEffectLine/index.vue';
import dualAxisPlot from '@/modules/finance/managementDashboard/components/charts/dualAxisPlot/index.vue';
import bubble from '@/modules/finance/managementDashboard/components/charts/bubble/index.vue';
// import * as echarts from 'echarts';
import { useData, DateRangeType, DisplayDataType } from './use/useData';
import Decimal from 'decimal.js';
import moment from 'moment';
import { useSunburstColors, useBubbleColors, useTrendBarBurstColors } from './use/useColors';
import icon_dashboard_cost from '@/assets/img/finance/icon_dashboard_cost.png';
import icon_dashboard_gmv from '@/assets/img/finance/icon_dashboard_gmv.png';
import icon_dashboard_income from '@/assets/img/finance/icon_dashboard_income.png';
import icon_dashboard_profit from '@/assets/img/finance/icon_dashboard_profit.png';
import { AxisUnit } from '../../type';

export default defineComponent({
  components: {
    sunburst,
    trendLine,
    laborEffectLine,
    dualAxisPlot,
    bubble,
  },
  setup(props, ctx) {
    const dataLogic = useData(ctx);

    const trendYUnit = computed(() => {
      // const
      const findItem = dataLogic.gmvTrendData.value?.dates?.find((_, dateIndex) => {
        const amount = dataLogic.gmvTrendData.value?.datas?.reduce(
          (prev, curr) => prev.add(new Decimal(curr.value[dateIndex] ?? 0)),
          new Decimal(0),
        );
        return amount?.abs()?.greaterThanOrEqualTo(new Decimal(10000));
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });

    const profitRadioUnit = computed(() => {
      const findItem = dataLogic.profitRatioData.value?.datas?.find(el => {
        if (
          el.key === 'income' ||
          el.key === 'cost' ||
          el.key === 'profit' ||
          el.key === 'profit_ratio'
        ) {
          return el.value.find(amount => (amount ? Math.abs(amount) > 10000 : false))
            ? true
            : false;
        } else {
          return false;
        }
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });

    const laborEffectYUnt = computed(() => {
      const fintItem1 = dataLogic.laborEffectData.value?.datas?.per_capita_income?.find(el =>
        el ? Math.abs(el) > 10000 : false,
      );
      const fintItem2 = dataLogic.laborEffectData.value?.datas?.per_capita_cost?.find(el =>
        el ? Math.abs(el) > 10000 : false,
      );
      const fintItem3 = dataLogic.laborEffectData.value?.datas?.per_capita_profit?.find(el =>
        el ? Math.abs(el) > 10000 : false,
      );
      return fintItem1 || fintItem2 || fintItem3 ? AxisUnit.wan : AxisUnit.yuan;
    });

    const bubbleUnit = computed(() => {
      const xFindItem = dataLogic.projectBubbleData.value?.find((el: any) => {
        return el.find((sunEl: any) => {
          return Math.abs(sunEl[0] ?? 0) > 10000 ? true : false;
        })
          ? true
          : false;
      });
      const yFindItem = dataLogic.projectBubbleData.value?.find((el: any) => {
        return el.find((sunEl: any) => {
          return Math.abs(sunEl[1] ?? 0) > 10000 ? true : false;
        })
          ? true
          : false;
      });
      return [xFindItem ? AxisUnit.wan : AxisUnit.yuan, yFindItem ? AxisUnit.wan : AxisUnit.yuan];
    });

    watchEffect(() => {
      dataLogic.queryOperationOverview();
      dataLogic.querySunbrust();
      dataLogic.queryTrend();
    });

    onMounted(() => {
      dataLogic.queryProfitMarginStatistics();
      dataLogic.queryLaborEfficiencyTrend();
      dataLogic.queryProjectDistributionBubble();
    });

    return {
      useSunburstColors,
      useBubbleColors,
      // icon_dashboard_cost,
      // icon_dashboard_income,
      // icon_dashboard_gmv,
      // icon_dashboard_profit,
      useTrendBarBurstColors,
      trendYUnit,
      profitRadioUnit,
      laborEffectYUnt,
      bubbleUnit,
      ...dataLogic,
    };
  },
  render() {
    const sunBurstData = (this.sunBurstData ?? [])
      .filter(el => {
        return el.children?.find(subEl => (subEl.value ?? 0) > 0);
      })
      .map((el, index) => {
        const color = this.useSunburstColors[index]?.color;
        const colorObj = color
          ? {
              color: color,
            }
          : {};
        return {
          name: el.project_name,
          itemStyle: {
            ...colorObj,
          },
          value: el.value,
          children: (el.children ?? []).map((subEl, subElIndex) => {
            const subElColor = this.useSunburstColors[index]?.children[subElIndex];
            const subElColorObj = subElColor
              ? {
                  color: subElColor,
                }
              : {};
            return {
              name: subEl.project_name,
              itemStyle: {
                ...subElColorObj,
              },
              value: subEl.value,
            };
          }),
        };
      });

    // const sunburstTotalAmount = sunBurstData
    //   .flatMap(el => [el, ...el.children])
    //   .reduce((sum, curr) => sum.add((curr.value ?? 0) < 0 ? 0 : curr.value ?? 0), new Decimal(0));
    const updateTime = this.overviewData?.update_time
      ? moment(this.overviewData.update_time * 1000).format('yyyy.MM.DD HH:mm')
      : '--';

    const datas = [...(this.gmvTrendData?.datas ?? [])];
    // if (datas.length > 0) {
    //   datas.push(datas.shift() as any);
    // }
    const gmvTrendData = datas.map((el, index) => {
      const color = this.useTrendBarBurstColors[index];
      const colorObj = color
        ? {
            color: color,
          }
        : {};
      const shadowColorObj = color
        ? {
            shadowColor: `${color}3d`,
            shadowOffsetX: 0,
            shadowOffsetY: 11,
            shadowBlur: 11,
          }
        : {};
      // const areaaColor = this.useGmvTrendLineColors[index]?.areaColor;
      // const areaaColorObj = areaaColor
      //   ? {
      //       type: 'linear',
      //       x: 0,
      //       y: 1,
      //       x2: 0,
      //       y2: 0,
      //       colorStops: [
      //         {
      //           offset: 0,
      //           color: areaaColor ? `${areaaColor}00` : undefined, // 0% 处的颜色
      //         },
      //         {
      //           offset: 1,
      //           color: areaaColor, // 100% 处的颜色
      //         },
      //       ],
      //       global: false, // 缺省为 false
      //     }
      //   : {};

      return {
        name: el.key,
        type: 'line',
        // stack: 'Total',
        // emphasis: {
        //   focus: 'series',
        // },
        lineStyle: {
          width: 3,
          ...shadowColorObj,
        },
        // areaStyle: {
        //   color: {
        //     ...areaaColorObj,
        //   },
        //   // origin: 'start'
        // },
        itemStyle: {
          ...colorObj,
        },
        smooth: true,
        showSymbol: false,
        data: (el.value ?? []).map(el => (el ? el : 0)),
      };
    });

    const bubbleSelectedMonth = this.bubbleSelectedMonth;
    const projectBubbleData = (this.projectBubbleData ?? []).map((el: any, index: number) => {
      const name = el[0]?.[4];
      const color = this.useBubbleColors[index];
      const colorObj = color
        ? {
            borderColor: color,
            color: `${color}4c`,
          }
        : {};
      const hoverColorObj = color
        ? {
            color: `${color}7f`,
            // shadowOffsetX: 0,
            // shadowOffsetY: 6,
            // shadowBlur: 10,
            // shadowColor: `${color}33`
          }
        : {};
      return {
        name: name,
        data: el.map((arr: any) => {
          const pname = arr[3];
          if (!pname) {
            arr[3] = '--';
          }
          return arr;
        }),
        type: 'scatter',
        symbolSize: function (data: any) {
          return Math.sqrt(data[2]) / (bubbleSelectedMonth === -1 ? 15e1 : 10e1);
        },
        emphasis: {
          focus: 'series',
          // label: {
          //   show: true,
          //   formatter: function (param: any) {
          //     return param.data[3];
          //   },
          //   position: 'top',
          // },
          itemStyle: {
            // color:'red',
            ...hoverColorObj,
            borderWidth: 2,
          },
        },
        itemStyle: {
          // shadowBlur: 10,
          // shadowColor: 'rgba(120, 36, 50, 0.5)',
          // shadowOffsetY: 5,
          borderWidth: 1,
          ...colorObj,
        },
      };
    });

    return (
      <div class="tg-management-dashboard-page-container">
        <div style="min-width: 1164px; overflow: visible;">
          <section class="dashboard-description">
            <div style="display: flex; align-items: center;">
              <el-popover trigger="hover" placement="bottom-start">
                <div style="width: 246px; font-size: 12px; color: var(--text-color); line-height: 20px;">
                  <div>1. 只统计自营抖音店播项目；</div>
                  <div>2. GMV数据统计时效性为T+1；</div>
                  <div>3. 人效数据只统计实际已发薪资的月份；</div>
                  <div>4. 当月收入、成本、利润为基于当前GMV的预测数据。</div>
                </div>
                <div class="desction" slot="reference" style="cursor: pointer;">
                  <tg-icon class="desction-icon" name="ico-icon_explain"></tg-icon>
                  <span class="desction-text">数据统计规则说明</span>
                </div>
              </el-popover>
              <span class="update-time">数据更新时间：{updateTime}</span>
            </div>
            <div class="operators">
              <tg-button
                disabled={this.prevDateSwitchDisables}
                class="time-btn"
                type="link"
                on-click={() => this.onDateChange(-1)}
              >
                <tg-icon name="ico-arrow-left"></tg-icon>
              </tg-button>
              <span class="display-time">{this.displayDate}</span>
              <tg-button
                disabled={this.nextDateSwitchDisables}
                class="time-btn"
                type="link"
                on-click={() => this.onDateChange(1)}
              >
                <tg-icon name="ico-arrow-right"></tg-icon>
              </tg-button>
              <div class="date-switch">
                <tg-button
                  class="date-switch-year"
                  selected={this.dateRangeType === DateRangeType.year}
                  type="link"
                  on-click={() => this.onDateRangeChange(DateRangeType.year)}
                >
                  全年
                </tg-button>
                <tg-button
                  class="date-switch-quarter"
                  selected={this.dateRangeType === DateRangeType.quarter}
                  type="link"
                  on-click={() => this.onDateRangeChange(DateRangeType.quarter)}
                >
                  季度
                </tg-button>
                <tg-button
                  class="date-switch-month"
                  selected={this.dateRangeType === DateRangeType.month}
                  type="link"
                  on-click={() => this.onDateRangeChange(DateRangeType.month)}
                >
                  月度
                </tg-button>
              </div>
            </div>
          </section>
          <section
            class={
              this.noPerCapitaData ? 'overview-container no-per-capitaData' : 'overview-container'
            }
          >
            <div
              class="overview-item gmv"
              selected={this.displayDataType === DisplayDataType.gmv}
              on-click={() => this.onDisplayDataType(DisplayDataType.gmv)}
            >
              <div class="item-header">
                <div class="item-icon">
                  <img src={icon_dashboard_gmv} alt="" />
                </div>
                <div class="item-title">GMV</div>
              </div>
              <animate-number
                class="item-amount"
                from="0"
                to={`${this.overviewData?.gmv ?? 0}`}
                key={`${this.overviewData?.gmv ?? 'gmv'}`}
                easing="easeInOutQuad"
                duration="1000"
                formatter={this.animateNumberFormater}
              ></animate-number>
              <div
                class={this.noPerCapitaData ? 'item-average-amount hidden' : 'item-average-amount'}
              >
                人均贡献&nbsp;&nbsp;¥&nbsp;
                {this.formatAmount(this.overviewData?.per_capita_gmv ?? 0, 'None')}
              </div>
            </div>
            <div
              class="overview-item income"
              selected={this.displayDataType === DisplayDataType.income}
              on-click={() => this.onDisplayDataType(DisplayDataType.income)}
            >
              <div class="item-header">
                <div class="item-icon">
                  <img src={icon_dashboard_income} alt="" />
                </div>
                <div class="item-title">{this.isCurrentMonth ? '预估收入' : '收入'}</div>
              </div>
              <animate-number
                class="item-amount"
                from="0"
                to={this.overviewData?.income ?? 0}
                key={`${this.overviewData?.income ?? 'income'}`}
                easing="easeInOutQuad"
                duration="1000"
                formatter={this.animateNumberFormater}
              ></animate-number>
              <div
                class={this.noPerCapitaData ? 'item-average-amount hidden' : 'item-average-amount'}
              >
                人均贡献&nbsp;&nbsp;¥&nbsp;
                {this.formatAmount(this.overviewData?.per_capita_income ?? 0, 'None')}
              </div>
            </div>
            <div
              class="overview-item cost"
              selected={this.displayDataType === DisplayDataType.cost}
              on-click={() => this.onDisplayDataType(DisplayDataType.cost)}
            >
              <div class="item-header">
                <div class="item-icon">
                  <img src={icon_dashboard_cost} alt="" />
                </div>
                <div class="item-title">{this.isCurrentMonth ? '预估成本' : '成本'}</div>
              </div>
              <animate-number
                class="item-amount"
                from="0"
                to={this.overviewData?.cost ?? 0}
                key={this.overviewData?.cost ?? 'cost'}
                easing="easeInOutQuad"
                duration="1000"
                formatter={this.animateNumberFormater}
              ></animate-number>
              <div
                class={this.noPerCapitaData ? 'item-average-amount hidden' : 'item-average-amount'}
              >
                人均成本&nbsp;&nbsp;¥&nbsp;
                {this.formatAmount(this.overviewData?.per_capita_cost ?? 0, 'None')}
              </div>
            </div>
            <div
              class="overview-item profit"
              selected={this.displayDataType === DisplayDataType.profit}
              on-click={() => this.onDisplayDataType(DisplayDataType.profit)}
            >
              <div class="item-header">
                <div class="item-icon">
                  <img src={icon_dashboard_profit} alt="" />
                </div>
                <div class="item-title">{this.isCurrentMonth ? '预估利润' : '利润'}</div>
              </div>
              <animate-number
                class="item-amount"
                from="0"
                to={this.overviewData?.profit ?? 0}
                key={this.overviewData?.profit ?? 'profit'}
                easing="easeInOutQuad"
                duration="1000"
                formatter={this.animateNumberFormater}
              ></animate-number>
              <div
                class={this.noPerCapitaData ? 'item-average-amount hidden' : 'item-average-amount'}
              >
                人均贡献&nbsp;&nbsp;¥&nbsp;
                {this.formatAmount(this.overviewData?.per_capita_profit ?? 0, 'None')}
              </div>
            </div>
          </section>
          <section class="ratio-trend-charts-container">
            {/* GMV、收入、成本和利润旭日图 */}
            <div style="width: 30%; min-width: 330px; max-width: 520px;">
              <div class="chart-title">{this.displayDataTypeStr}占比</div>
              <sunburst
                class="dashboard-chart"
                itemName={this.displayDataTypeStr}
                style="height: 282px; margin-top: 24px;"
                loading={this.sunBurstLoading}
                // totalAmount={sunburstTotalAmount}
                series={{
                  data: sunBurstData,
                }}
              ></sunburst>
            </div>
            {/* GMV、收入、成本和利润趋势图 */}
            <div style="flex: 1;">
              <div class="chart-title" style="margin-left: 34px;">
                {this.displayDataTypeStr}趋势
              </div>
              <trendLine
                class="dashboard-chart"
                yUnit={this.trendYUnit}
                style="height: 320px; margin-top: 24px;"
                loading={this.trendLoading}
                xData={this.gmvTrendData?.dates ?? []}
                series={gmvTrendData}
              ></trendLine>
            </div>
          </section>
          {/* 利润率趋势图 */}
          <section class="profix-trend-container">
            <div class="chart-title">利润率趋势</div>
            <dualAxisPlot
              class="dashboard-chart border"
              yUnit={this.profitRadioUnit}
              style="height: 389px; margin-top: 16px;"
              loading={this.profitRatioLoading}
              xData={this.profitRatioData?.dates ?? []}
              series={[
                {
                  name: '收入',
                  type: 'bar',
                  barMaxWidth: 28,
                  barMinWidth: 8,
                  barGap: '30%',
                  barCategoryGap: '45%',
                  itemStyle: {
                    color: '#4FCA50',
                    borderRadius: 2,
                  },
                  data: (
                    this.profitRatioData?.datas?.find(el => el.key === 'income')?.value ?? []
                  ).map(el => (el ? el : 0)),
                },
                {
                  name: '成本',
                  type: 'bar',
                  barMaxWidth: 28,
                  barMinWidth: 8,
                  barGap: '30%',
                  barCategoryGap: '45%',
                  itemStyle: {
                    color: '#2877FF',
                    borderRadius: 2,
                  },
                  data: (
                    this.profitRatioData?.datas?.find(el => el.key === 'cost')?.value ?? []
                  ).map(el => (el ? el : 0)),
                },
                {
                  name: '利润',
                  type: 'bar',
                  barMaxWidth: 28,
                  barMinWidth: 8,
                  barGap: '30%',
                  barCategoryGap: '45%',
                  itemStyle: {
                    color: '#FF7F00',
                    borderRadius: 2,
                  },
                  data: (
                    this.profitRatioData?.datas?.find(el => el.key === 'profit')?.value ?? []
                  ).map(el => (el ? el : 0)),
                },
                {
                  name: '利润率',
                  type: 'line',
                  smooth: true,
                  showSymbol: false,
                  yAxisIndex: 1,
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
                  data: (
                    this.profitRatioData?.datas?.find(el => el.key === 'profit_ratio')?.value ?? []
                  ).map(el => (el ? el : 0)),
                },
              ]}
            ></dualAxisPlot>
          </section>
          <section class="labor-project-charts-container">
            {/* 人效趋势图 */}
            <div>
              <div class="chart-title">人效趋势</div>
              <laborEffectLine
                class="dashboard-chart border"
                yUnit={this.laborEffectYUnt}
                style="height: 543px; margin-top: 16px;"
                loading={this.laborEffectLoading}
                xData={this.laborEffectData?.dates ?? []}
                series={[
                  {
                    name: '人均贡献收入',
                    type: 'line',
                    itemStyle: {
                      color: '#4FCA50',
                    },
                    lineStyle: {
                      width: 3,
                      shadowColor: '#4FCA503d',
                      shadowOffsetX: 0,
                      shadowOffsetY: 11,
                      shadowBlur: 11,
                    },
                    smooth: true,
                    showSymbol: false,
                    data: (this.laborEffectData?.datas?.per_capita_income ?? []).map(el =>
                      el ? el : 0,
                    ),
                  },
                  {
                    name: '人均成本',
                    type: 'line',
                    itemStyle: {
                      color: '#2877FF',
                    },
                    lineStyle: {
                      width: 3,
                      shadowColor: '#2877FF3d',
                      shadowOffsetX: 0,
                      shadowOffsetY: 11,
                      shadowBlur: 11,
                    },
                    smooth: true,
                    showSymbol: false,
                    data: (this.laborEffectData?.datas?.per_capita_cost ?? []).map(el =>
                      el ? el : 0,
                    ),
                  },
                  {
                    name: '人均贡献利润',
                    type: 'line',
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
                    smooth: true,
                    showSymbol: false,
                    data: (this.laborEffectData?.datas?.per_capita_profit ?? []).map(el =>
                      el ? el : 0,
                    ),
                  },
                ]}
              ></laborEffectLine>
            </div>
            {/* 项目分布气泡图 */}
            <div style="position: relative;">
              <div class="chart-title">项目分布气泡图</div>
              <bubble
                class="dashboard-chart border"
                yUnit={this.bubbleUnit[0]}
                xUnit={this.bubbleUnit[1]}
                style="height: 543px; margin-top: 16px;"
                loading={this.projectBubbleLoading}
                series={projectBubbleData}
              ></bubble>
              <el-popover
                // v-model={this.bubblePopoverVisible}
                popper-class="dashboard-month-popover"
                trigger="hover"
                placement="left"
              >
                <div class="month-list">
                  {[...this.monthOptions, -1].map(el => (
                    <div
                      selected={el === this.bubbleSelectedMonth}
                      class="month-list-item"
                      on-click={() => this.onBubbleMonth(el)}
                    >
                      {el === -1 ? '汇总' : `${el + 1}月`}
                    </div>
                  ))}
                </div>
                <div class="bubble-month-display" slot="reference" style="cursor: pointer;">
                  <span style="font-size: 14px;">
                    {this.bubbleSelectedMonth === -1 ? '汇总' : `${this.bubbleSelectedMonth + 1}月`}
                  </span>
                  <tg-icon style="margin-left: 0px;" name="ico-triangle-down"></tg-icon>
                </div>
              </el-popover>
              <div class="bubble-tips">
                <i class="el-icon-warning-outline tip-icon"></i>
                <span class="tip-text">气泡面积大小代表GMV高低</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
});
