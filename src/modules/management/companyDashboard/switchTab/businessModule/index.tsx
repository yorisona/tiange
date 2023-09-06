import { computed, defineComponent, PropType, ref, watchEffect } from '@vue/composition-api';
import dualAxisPlot from '@/modules/management/companyDashboard/charts/businessModule/index.vue';
import { useRequest } from '@gm/hooks/ahooks';
import { query_business_gmv_trend } from '@/services/management';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import { SwitchTabQueryForm } from '@/modules/management/companyDashboard/switchTab/switchTabUse';
import { latitudeOptions, LatitudeValueType } from '@/modules/management/use';

export default defineComponent({
  components: {
    dualAxisPlot,
  },
  props: {
    queryForm: {
      type: Object as PropType<SwitchTabQueryForm>,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const reqGMVTrend = useRequest(query_business_gmv_trend, {
      manual: true,
    });
    const activedType = ref<LatitudeValueType>(1);
    const methods = {};
    const yUnit = computed(() => {
      const findItem = reqGMVTrend.data?.find((el: any) => {
        const gmv = Math.abs(el.gmv ?? 0) / 100;
        const goal_gmv = Math.abs(el.goal_gmv ?? 0) / 100;
        return gmv > 10000 || goal_gmv > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });
    watchEffect(() => {
      const { start_date, end_date, group_by } = props.queryForm;
      if (!start_date || !end_date) return;
      const activedOption = latitudeOptions.find(el => el.value === activedType.value);
      reqGMVTrend.runAsync({
        start_date,
        end_date,
        group_by,
        department_ids: activedOption?.department_ids,
        not_department_ids: activedOption?.not_department_ids,
        // business_type: activedType.value,
      });
    });
    return { yUnit, reqGMVTrend, activedType, latitudeOptions, ...methods };
  },
  render() {
    const { yUnit, reqGMVTrend, latitudeOptions } = this;
    const { loading, data } = reqGMVTrend;
    const trendList = data || [];
    return (
      <div class="tg-business-module-page-container">
        <dualAxisPlot
          showZoom={false}
          showSingleAxis={false}
          trendList={trendList}
          class="dashboard-chart"
          yUnit={yUnit}
          style="height: 236px;"
          loading={loading}
          xData={trendList.map((el: any) => el.date)}
          series={[
            {
              name: '实际GMV',
              type: 'line',
              showSymbol: false,
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
                let value = el.gmv;
                value = value !== null && value !== undefined ? value / 100 : null;
                return {
                  value,
                };
              }),
            },
            {
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
              data: trendList.map((el: any) => {
                const value = el.goal_gmv;
                return value !== null && value !== undefined ? value / 100 : null;
              }),
            },
          ]}
        ></dualAxisPlot>
        <div class="statistics-latitude">
          {latitudeOptions.map(el => {
            return (
              <div
                actived={this.activedType === el.value}
                class="item"
                key={el.value}
                onClick={() => {
                  this.activedType = el.value;
                }}
              >
                {el.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
