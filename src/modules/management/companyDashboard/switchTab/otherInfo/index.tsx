import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  watchEffect,
  ref,
} from '@vue/composition-api';
import otherInfo from '@/modules/management/companyDashboard/charts/otherInfo/index.vue';
import {
  SwitchTabQueryForm,
  useOtherLogic,
} from '@/modules/management/companyDashboard/switchTab/switchTabUse';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import moment from 'moment';
export default defineComponent({
  components: {
    otherInfo,
  },
  props: {
    queryForm: {
      type: Object as PropType<SwitchTabQueryForm>,
    },
  },
  setup(props, ctx) {
    const logic = useOtherLogic();
    const business_type = ref<number | undefined>(undefined);
    const methods = {
      getType() {
        return props.queryForm?.is_department ? 'department' : 'company';
      },
      queryProjectTrend() {
        // const { start_date, end_date } = props.queryForm || {};
        // if (!start_date || !end_date || !logic.project_id.value) return;
        if (!logic.project_id.value) return;
        const yearstodayMoment = moment().subtract(1, 'day');
        const start_date = yearstodayMoment.clone().subtract(14, 'day');
        const formatStr = 'YYYY-MM-DD';
        logic.reqProjectTrend.runAsync(
          {
            start_date: start_date.format(formatStr),
            end_date: yearstodayMoment.format(formatStr),
            project_id: logic.project_id.value,
          },
          methods.getType(),
        );
      },
      queryRenewalContracts() {
        const { is_department, department_id } = props.queryForm || {};
        // if (!start_date || !end_date) return;
        if (is_department && !department_id) return;
        logic.reqRenewalContracts.runAsync(
          {
            // start_date,
            // end_date,
            department_id,
            business_type: business_type.value,
          },
          methods.getType(),
        );
      },
      queryProjectList() {
        const { is_department, department_id } = props.queryForm || {};
        if (is_department && !department_id) return;
        logic.reqProjectList.runAsync({ department_id }, methods.getType());
      },
    };
    const yUnit = computed(() => {
      const findItem = (logic.reqProjectTrend.data || []).find((el: any) => {
        const value = el[logic.lineType.value];
        const absValue = Math.abs(value ?? 0) / 100;
        return absValue > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });
    onMounted(() => {
      methods.queryProjectList();
    });
    watchEffect(() => {
      methods.queryProjectTrend();
    });
    watchEffect(() => {
      methods.queryRenewalContracts();
    });
    return {
      business_type,
      yUnit,
      logic,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-other-info-page-container">
        <div class="chart-field" v-loading={this.logic.reqProjectList.loading}>
          <div class="title">新项目成长趋势</div>
          <div class="filter">
            <div>
              <span>新项目：</span>
              <el-select size="mini" v-model={this.logic.project_id.value} filterable>
                {(this.logic.reqProjectList.data || []).map((el: any) => (
                  <el-option
                    label={el.project_name}
                    value={el.project_id}
                    key={el.project_id}
                  ></el-option>
                ))}
              </el-select>
            </div>
            <div>
              <el-radio-group v-model={this.logic.lineType.value}>
                <el-radio label="gmv">
                  <div class="legend-line">
                    <div class="legend-text">GMV</div>
                  </div>
                </el-radio>
                <el-radio label="income">
                  <div class="legend-line income">
                    <div class="legend-text">营收</div>
                  </div>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-container">
            <otherInfo
              yUnit={this.yUnit}
              xData={(this.logic.reqProjectTrend.data || []).map((el: any) => el.date)}
              style="height: 247px; margin-top: 16px;"
              loading={this.logic.reqProjectTrend.loading}
              trendList={this.logic.reqProjectTrend.data || []}
              lineType={this.logic.lineType.value}
              series={[
                {
                  name: '占营收比例',
                  type: 'line',
                  smooth: true,
                  showSymbol: false,
                  itemStyle: {
                    color: this.logic.lineType.value === 'gmv' ? '#2877ff' : '#FF7F00',
                  },
                  lineStyle: {
                    width: 3,
                    shadowColor: this.logic.lineType.value === 'gmv' ? '#2877ff3d' : '#FF7F003d',
                    shadowOffsetX: 0,
                    shadowOffsetY: 11,
                    shadowBlur: 11,
                  },
                  // stack: 'Total',
                  // data: trendList.map((el: any) => {
                  //   const key = this.barType + '_percent';
                  //   const value = el[key];
                  //   return value;
                  // }),
                  data: (this.logic.reqProjectTrend.data || []).map((el: any) => {
                    const value = el[this.logic.lineType.value];
                    return (value || 0) / 100;
                  }),
                },
              ]}
            ></otherInfo>
          </div>
        </div>
        <div class="line"></div>
        <div class="table-container">
          <div class="header-div">
            <div class="title">合同续签提醒</div>
            {!this.queryForm?.is_department && (
              <div>
                <span class="label">项目类型：</span>
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model={this.business_type}
                  class="budget-select"
                  placeholder="请选择项目类型"
                  style="width: 150px"
                  size="mini"
                  on-change={this.queryRenewalContracts}
                >
                  <el-option label="全部" value={undefined} key={undefined}></el-option>
                  {E.management.BusinessTypeOption.map((el, index) => {
                    return (
                      <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                    );
                  })}
                </el-select>
              </div>
            )}
          </div>
          <div class="mgt-12">
            <tg-table
              height={298}
              border
              stripe
              row-style={{ cursor: 'pointer' }}
              columns={this.logic.columns.value}
              data={this.logic.reqRenewalContracts.data || []}
              v-loading={this.logic.reqRenewalContracts.loading}
              on-row-click={this.logic.onContractClick}
            ></tg-table>
          </div>
        </div>
        <tg-mask-loading visible={this.logic.contractLoading.value} content="正在加载，请稍候..." />
      </div>
    );
  },
});
