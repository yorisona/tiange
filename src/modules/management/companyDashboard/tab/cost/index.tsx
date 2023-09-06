import { computed, defineComponent, ref } from '@vue/composition-api';
import {
  statusColor,
  getAmountFormatUnion,
  getIncreateRateNode,
  ratioFormat,
} from '@/modules/management/use';
import dualAxisPlot from '@/modules/management/components/charts/cost/index.vue';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
export default defineComponent({
  components: {
    dualAxisPlot,
  },
  props: {
    showZoom: {
      type: Boolean,
      default: () => false,
    },
    costData: {
      type: Object,
    },
    notSupport: {
      type: Boolean,
      default: () => false,
    },
  },
  setup: (props, ctx) => {
    const barType = ref<'cost' | 'anchor_cost' | 'ad_cost' | 'promote_cost' | 'labor_cost'>('cost');
    const computedCostData = computed(() => props.costData);
    const computedShowZoom = computed(() => props.showZoom);
    const methods = {
      statusColor,
      getAmountFormatUnion,
      getCalculateItemDom: (
        title: string,
        amount: number | null,
        rate: number | null,
        increase_rate: number | undefined,
      ) => {
        const amountUnion = getAmountFormatUnion(amount);
        return (
          <div class="calculate-item">
            <div class="header">
              <span>{title}</span>
              <span class="header-value">
                占营收 <span>{ratioFormat(rate)}</span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">{amountUnion.amountStr}</span>
                {amountUnion.unit ? <span class="unit">{amountUnion.unit}</span> : null}
              </div>
              {methods.getIncreaseRateDom(increase_rate)}
            </div>
          </div>
        );
      },
      getIncreaseRateDom: (rate: number | undefined) => {
        return getIncreateRateNode(rate, {
          textStyle: {
            color: 'var(--text-third-color)',
          },
        });
        // const newVal = rate || 0;
        // return (
        //   <div class="ratio">
        //     <span class="label">环</span>
        //     <tg-icon
        //       name={
        //         newVal > 0
        //           ? 'ico-icon_tongyong_shangsheng_16_red'
        //           : 'ico-icon_tongyong_xiajiang_16_green'
        //       }
        //     ></tg-icon>
        //     <span class="value" style={`color: ${getIncreaseColor(newVal)}`}>
        //       {/* <span class="value"> */}
        //       {Math.abs(newVal)}%
        //     </span>
        //   </div>
        // );
      },
    };
    // console.log({
    //   data: props.costData,
    // });
    const yUnit = computed(() => {
      const key = barType.value;
      const findItem = computedCostData.value?.trend?.find((el: any) => {
        const cost = Math.abs(el[key] ?? 0) / 100;
        const income = Math.abs(el.income ?? 0) / 100;
        return cost > 10000 || income > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });
    return {
      barType,
      yUnit,
      computedShowZoom,
      computedCostData,
      ...methods,
    };
  },
  render() {
    const { overview, trend } = this.computedCostData as any;
    const {
      cost,
      cost_increase_rate,
      cost_to_income_percent,
      anchor_cost,
      anchor_cost_increase_rate,
      anchor_cost_percent,
      ad_cost,
      ad_cost_increase_rate,
      ad_cost_percent,
      promote_cost,
      promote_cost_increase_rate,
      promote_cost_percent,
      labor_cost,
      labor_cost_increase_rate,
      labor_cost_percent,
      other_cost,
      other_cost_increase_rate,
      other_cost_percent,
    } = overview || {};
    // const costUnion = this.getAmountFormatUnion(cost);
    // const anchorCostUnion = this.getAmountFormatUnion(anchor_cost);
    const trendList = trend || [];
    if (this.notSupport)
      return (
        <div class="tg-cost-container">
          <div class="empty-no-support">
            <empty-common detail-text="暂无自定义统计数据"></empty-common>
          </div>
        </div>
      );
    return (
      <div class="tg-cost-container">
        <div class="cost-info">
          {this.getCalculateItemDom('总成本', cost, cost_to_income_percent, cost_increase_rate)}
          {/* <div class="calculate-item">
            <div class="header">
              <span>总成本</span>
              <span class="header-value">
                占营收{' '}
                <span>
                  {cost_percent !== null && cost_percent !== undefined ? cost_percent + '%' : '--'}
                </span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">{costUnion.amountStr}</span>
                {costUnion.unit ? <span class="unit">{costUnion.unit}</span> : null}
              </div>
              {this.getIncreaseRateDom(cost_increase_rate)}
            </div>
          </div> */}
          <span class="operator">=</span>
          {this.getCalculateItemDom(
            '主播成本',
            anchor_cost,
            anchor_cost_percent,
            anchor_cost_increase_rate,
          )}
          {/* <div class="calculate-item">
            <div class="header">
              <span>主播成本</span>
              <span class="header-value">
                占营收{' '}
                <span>
                  {anchor_cost_percent !== null && anchor_cost_percent !== undefined
                    ? anchor_cost_percent + '%'
                    : '--'}
                </span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">{anchorCostUnion.amountStr}</span>
                {anchorCostUnion.unit ? <span class="unit">{anchorCostUnion.unit}</span> : null}
              </div>
              {this.getIncreaseRateDom(anchor_cost_increase_rate)}
            </div>
          </div> */}
          <span class="operator">+</span>
          {this.getCalculateItemDom('投放成本', ad_cost, ad_cost_percent, ad_cost_increase_rate)}
          {/* <div class="calculate-item">
            <div class="header">
              <span>投放成本</span>
              <span class="header-value">
                占营收 <span>34.5%</span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">345.34</span>
                <span class="unit">元</span>
              </div>
              <div class="ratio">
                <span class="label">环</span>
                <tg-icon name="ico-icon_tongyong_shangsheng_16_red"></tg-icon>
                <span class="value">3534%</span>
              </div>
            </div>
          </div> */}
          <span class="operator">+</span>
          {this.getCalculateItemDom(
            '营销成本',
            promote_cost,
            promote_cost_percent,
            promote_cost_increase_rate,
          )}
          {/* <div class="calculate-item">
            <div class="header">
              <span>营销成本</span>
              <span class="header-value">
                占营收 <span>34.5%</span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">345.34</span>
                <span class="unit">元</span>
              </div>
              <div class="ratio">
                <span class="label">环</span>
                <tg-icon name="ico-icon_tongyong_shangsheng_16_red"></tg-icon>
                <span class="value">3534%</span>
              </div>
            </div>
          </div> */}
          <span class="operator">+</span>
          {this.getCalculateItemDom(
            '人力成本',
            labor_cost,
            labor_cost_percent,
            labor_cost_increase_rate,
          )}
          {/* <div class="calculate-item">
            <div class="header">
              <span>人力成本</span>
              <span class="header-value">
                占营收 <span>34.5%</span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">345.34</span>
                <span class="unit">元</span>
              </div>
              <div class="ratio">
                <span class="label">环</span>
                <tg-icon name="ico-icon_tongyong_shangsheng_16_red"></tg-icon>
                <span class="value">3534%</span>
              </div>
            </div>
          </div> */}
          <span class="operator">+</span>
          {this.getCalculateItemDom(
            '其他',
            other_cost,
            other_cost_percent,
            other_cost_increase_rate,
          )}
          {/* <div class="calculate-item">
            <div class="header">
              <span>其他</span>
              <span class="header-value">
                占营收 <span>34.5%</span>
              </span>
            </div>
            <div class="detail">
              <div class="amount">
                <span class="value">345.34</span>
                <span class="unit">元</span>
              </div>
              <div class="ratio">
                <span class="label">环</span>
                <tg-icon name="ico-icon_tongyong_shangsheng_16_red"></tg-icon>
                <span class="value">3534%</span>
              </div>
            </div>
          </div> */}
        </div>
        <div class="chart-title">成本走势</div>
        <div class="chart-field">
          <dualAxisPlot
            // showZoom={this.computedShowZoom}
            showZoom={false}
            key={trendList + this.barType}
            trendList={trendList}
            class="dashboard-chart border"
            yUnit={this.yUnit}
            style="height: 236px;"
            loading={this.profitRatioLoading}
            xData={trendList.map((el: any) => el.date)}
            series={[
              {
                name: '成本',
                type: 'bar',
                barMaxWidth: 28,
                barMinWidth: 8,
                barGap: '30%',
                barCategoryGap: '45%',
                itemStyle: {
                  color: '#FFBD3B',
                  borderRadius: 2,
                },
                // label: {
                //   show: true,
                //   position: 'top',
                // },
                data: trendList.map((el: any) => {
                  const value = el[this.barType];
                  return value !== null && value !== undefined ? value / 100 : null;
                }),
              },
              {
                name: '营收',
                type: 'bar',
                barMaxWidth: 28,
                barMinWidth: 8,
                barGap: '30%',
                barCategoryGap: '45%',
                itemStyle: {
                  color: '#2877FF',
                  borderRadius: 2,
                },
                // label: {
                //   show: true,
                //   position: 'top',
                // },
                data: trendList.map((el: any) => {
                  const income = el.income;
                  return income !== null && income !== undefined ? income / 100 : null;
                }),
              },
              {
                name: '占营收比例',
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
                data: trendList.map((el: any) => {
                  const key = this.barType + '_percent';
                  const value = el[key];
                  return value;
                }),
              },
            ]}
          ></dualAxisPlot>
          {trendList.length > 0 && (
            <div class="chart-filter">
              <div class="bar-filter">
                <el-radio-group v-model={this.barType}>
                  <el-radio label="cost">总成本</el-radio>
                  <el-radio label="anchor_cost">主播成本</el-radio>
                  <el-radio label="ad_cost">投放成本</el-radio>
                  <el-radio label="promote_cost">营销成本</el-radio>
                  <el-radio label="labor_cost">人力成本</el-radio>
                </el-radio-group>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
});
