import { computed, defineComponent, ref, watchEffect } from '@vue/composition-api';
import gmv from '@/modules/management/companyDashboard/tab/gmv/index.vue';
import revenue from '@/modules/management/companyDashboard/tab/revenue/index.vue';
import profit from '@/modules/management/companyDashboard/tab/profit/index.vue';
import cost from '@/modules/management/companyDashboard/tab/cost/index.vue';
import {
  Query_Operate_Manage_Poject_Operating_Report_Cost_Overview,
  Query_Operate_Manage_Poject_Operating_Report_Cost_Trend,
  Query_Operate_Manage_Poject_Operating_Report_GMV_Overview,
  Query_Operate_Manage_Poject_Operating_Report_GMV_Trend,
  Query_Operate_Manage_Poject_Operating_Report_Income_Overview,
  Query_Operate_Manage_Poject_Operating_Report_Income_Trend,
  Query_Operate_Manage_Poject_Operating_Report_Revenue_Overview,
  Query_Operate_Manage_Poject_Operating_Report_Revenue_Trend,
} from '@/services/management';
import { useRequest } from '@gm/hooks/ahooks';
import { ProjectStatusMap } from '@/types/tiange/common';
import moment from 'moment';
import {
  ManagementDateType,
  ManagementDetailType,
  getAmountFormatUnion,
  getIncreateRateNode,
  ratioFormat,
  statusColor,
  statusStr,
} from '../use';
import businessModule from '@/modules/management/companyDashboard/switchTab/businessModule/index.vue';
import dataStructure from '@/modules/management/companyDashboard/switchTab/dataStructure/index.vue';
import departmentOverview from '@/modules/management/companyDashboard/switchTab/departmentOverview/index.vue';
import projectTop from '@/modules/management/companyDashboard/switchTab/projectTop/index.vue';
import otherInfo from '@/modules/management/companyDashboard/switchTab/otherInfo/index.vue';
import { useRouter } from '@/use/vue-router';
import { formatAmount } from '@/utils/string';
interface FormData {
  department_id: string | undefined;
}
interface DateForm {
  dateType: ManagementDateType;
  year: string | undefined;
  month: string | undefined;
  days: string[];
}
type StatisticsType =
  | 'businessModule'
  | 'dataStructure'
  | 'departmentOverview'
  | 'projectTop'
  | 'otherInfo';

type TabModel = { name: string; type: StatisticsType }[];
export default defineComponent({
  components: {
    gmv,
    revenue,
    cost,
    profit,
    businessModule,
    dataStructure,
    departmentOverview,
    projectTop,
    otherInfo,
  },
  props: {
    isDepartment: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props, ctx) {
    const departmentSelectRef = ref<any>();
    const departmentLevel = ref<number>(2);
    const router = useRouter();
    const { department_id } = router.currentRoute.query || {};
    const currentDate = moment();
    const initFormData = (): FormData => {
      return {
        // 默认选中商业化中心
        department_id: props.isDepartment
          ? ((department_id || 'cf5fc249ebb158b6') as string)
          : undefined,
      };
    };
    const formData = ref<FormData>(initFormData());
    // const currentDatestr = currentDate.format('YYYY-MM-DD');
    const dateFrom = ref<DateForm>({
      dateType: 'year',
      year: currentDate.format('yyyy'),
      month: currentDate.format('yyyy-MM'),
      // days: [currentDatestr, currentDatestr],
      days: [],
    });
    const detailType = ref<ManagementDetailType>('revenue');
    const reqGMVOverview = useRequest(Query_Operate_Manage_Poject_Operating_Report_GMV_Overview, {
      manual: true,
    });
    const reqGMVTrend = useRequest(Query_Operate_Manage_Poject_Operating_Report_GMV_Trend, {
      manual: true,
    });
    const reqIncomeOverview = useRequest(
      Query_Operate_Manage_Poject_Operating_Report_Income_Overview,
      {
        manual: true,
      },
    );
    const reqIncomeTrend = useRequest(Query_Operate_Manage_Poject_Operating_Report_Income_Trend, {
      manual: true,
    });
    const reqCostOverview = useRequest(Query_Operate_Manage_Poject_Operating_Report_Cost_Overview, {
      manual: true,
    });
    const reqCostTrend = useRequest(Query_Operate_Manage_Poject_Operating_Report_Cost_Trend, {
      manual: true,
    });
    const reqRevenueOverview = useRequest(
      Query_Operate_Manage_Poject_Operating_Report_Revenue_Overview,
      {
        manual: true,
      },
    );
    const reqRevenueTrend = useRequest(Query_Operate_Manage_Poject_Operating_Report_Revenue_Trend, {
      manual: true,
    });
    const pickDate = ref<Date>();
    const methods = {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker: any) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker: any) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
        onPick({ maxDate, minDate }: { maxDate: Date; minDate: Date }) {
          if (!maxDate && minDate) {
            pickDate.value = minDate;
          } else {
            pickDate.value = undefined;
          }
        },
        disabledDate(date: Date) {
          const currentMoment = moment();
          const dateMoment = moment(date);
          if (!pickDate.value) {
            return dateMoment.isAfter(currentMoment);
          } else {
            const pickMoment = moment(pickDate.value);
            const minMoment = pickMoment.clone().subtract('20', 'days');
            const maxMoment = pickMoment.clone().add('30', 'days');
            return (
              dateMoment.isBefore(minMoment) ||
              dateMoment.isAfter(maxMoment) ||
              dateMoment.isAfter(currentMoment)
            );
          }
        },
      },
      getAmountFormatUnion,
      getDateParams() {
        const format = 'yyyy-MM-DD';
        let start_date = dateFrom.value.days[0];
        let end_date = dateFrom.value.days[1];
        const group_by: 'day' | 'month' = dateFrom.value.dateType === 'year' ? 'month' : 'day';
        switch (dateFrom.value.dateType) {
          case 'year': {
            const currentYearMoment = moment(dateFrom.value.year);
            start_date = currentYearMoment.startOf('year').format(format);
            end_date = currentYearMoment.endOf('year').format(format);
            break;
          }
          case 'month': {
            const currentYearMoment = moment(dateFrom.value.month);
            start_date = currentYearMoment.startOf('month').format(format);
            end_date = currentYearMoment.endOf('month').format(format);
            break;
          }
          case 'day': {
            break;
          }
          default:
            break;
        }
        return {
          start_date,
          end_date,
          group_by,
        };
      },
      getIncreateRateNode(rate: number | undefined) {
        return getIncreateRateNode(rate, {
          text: '环比',
          textStyle: {
            color: 'var(--text-color)',
          },
        });
      },
      getType() {
        return props.isDepartment ? 'department' : 'company';
      },
      onDepartmentCheck() {
        departmentLevel.value = departmentSelectRef.value?.getCheckedNodes()?.[0]?.level;
      },
      statusColor,
      statusStr,
      ratioFormat,
    };

    watchEffect(() => {
      const { start_date, end_date, group_by } = methods.getDateParams();
      const { department_id } = formData.value;
      if (!start_date || !end_date) return;
      if (props.isDepartment && !department_id) return;
      const params = {
        start_date,
        end_date,
        department_id: department_id,
      };
      reqGMVOverview.runAsync(params, methods.getType());
      reqIncomeOverview.runAsync(params, methods.getType());
      reqGMVTrend.runAsync(
        {
          ...params,
          group_by,
        },
        methods.getType(),
      );

      reqIncomeTrend.runAsync(
        {
          ...params,
          // start_date: moment(start_date).startOf('month').format('YYYY-MM-DD'),
          // end_date: moment(end_date).endOf('month').format('YYYY-MM-DD'),
          group_by,
        },
        methods.getType(),
      );

      if (dateFrom.value.dateType !== 'day') {
        // 不支持成本喝利润自定义日期查询
        reqCostOverview.runAsync(
          {
            ...params,
            /*   start_date: moment(start_date).startOf('year').format('YYYY-MM-DD'),
            end_date: moment(end_date).endOf('year').format('YYYY-MM-DD'),*/
          },
          methods.getType(),
        );
        reqRevenueOverview.runAsync(
          {
            ...params,
            /*     start_date: moment(start_date).startOf('year').format('YYYY-MM-DD'),
            end_date: moment(end_date).endOf('year').format('YYYY-MM-DD'),*/
          },
          methods.getType(),
        );
        // if (dateFrom.value.dateType !== 'month') {
        reqCostTrend.runAsync(
          {
            ...params,
            start_date: moment(start_date).startOf('year').format('YYYY-MM-DD'),
            end_date: moment(end_date).endOf('year').format('YYYY-MM-DD'),
            group_by: 'month',
            // group_by,
          },
          methods.getType(),
        );
        reqRevenueTrend.runAsync(
          {
            ...params,
            start_date: moment(start_date).startOf('year').format('YYYY-MM-DD'),
            end_date: moment(end_date).endOf('year').format('YYYY-MM-DD'),
            group_by: 'month',
            // group_by,
          },
          methods.getType(),
        );
        // }
      }
    });
    const activedSwitchBtn = ref<StatisticsType>(
      !props.isDepartment ? 'businessModule' : 'dataStructure',
    );
    const switchBtns: TabModel = [
      !props.isDepartment && {
        name: '业务模块',
        type: 'businessModule',
      },
      {
        name: '数据结构',
        type: 'dataStructure',
      },
      {
        name: props.isDepartment ? '项目经营概况' : '部门经营概况',
        type: 'departmentOverview',
      },
      {
        name: '项目榜单',
        type: 'projectTop',
      },
      {
        name: '其它信息',
        type: 'otherInfo',
      },
    ].filter(Boolean) as TabModel;
    // const departmentLevel = computed(() => {
    //   return departmentSelectRef.value?.getCheckedNodes()?.[0];
    // });
    const dateInfo = computed(() => {
      const params = methods.getDateParams();
      const { start_date, end_date, group_by } = params;
      return {
        start_date,
        end_date,
        group_by,
        department_id: formData.value.department_id,
        is_department: props.isDepartment,
        date_type: dateFrom.value.dateType,
        department_level: departmentLevel.value,
      };
    });

    return {
      departmentSelectRef,
      formData,
      dateFrom,
      detailType,
      ProjectStatusMap,
      reqGMVOverview,
      reqGMVTrend,
      reqIncomeOverview,
      reqIncomeTrend,
      reqCostOverview,
      reqCostTrend,
      reqRevenueOverview,
      reqRevenueTrend,
      pickDate,
      switchBtns,
      activedSwitchBtn,
      dateInfo,
      ...methods,
      projectTypeOption: E.project.ProjectTypeOption,
    };
  },
  render() {
    const leftBase =
      this.detailType === 'gmv'
        ? 0
        : this.detailType === 'revenue'
        ? 1
        : this.detailType === 'cost'
        ? 2
        : 3;
    const angleLeft = `calc((100% - 48px) / 8 - 11px + ${leftBase} * ((100% - 48px) / 4 + 16px))`;
    const gmvOverview = this.reqGMVOverview.data || {};
    const incomeOverview = this.reqIncomeOverview.data || {};
    const costOverview = this.reqCostOverview.data || {};
    const profitOverview = this.reqRevenueOverview.data || {};

    const gmvOverviewUnion = this.getAmountFormatUnion(gmvOverview?.gmv);
    const goalGmvUnion = this.getAmountFormatUnion(gmvOverview?.goal_gmv);
    const goal_gmv_complete_rate = gmvOverview.goal_gmv_complete_rate;

    const revenueOverviewUnion = this.getAmountFormatUnion(incomeOverview?.income);
    const goalIncomeUnion = this.getAmountFormatUnion(incomeOverview?.goal_income);
    const goal_income_complete_rate = incomeOverview.goal_income_complete_rate;

    const costOverviewUnion = this.getAmountFormatUnion(
      this.dateFrom.dateType === 'day' ? undefined : costOverview?.cost,
    );
    const goalCostUnion = this.getAmountFormatUnion(
      this.dateFrom.dateType === 'day' ? undefined : costOverview?.goal_cost,
    );

    const profitOverviewUnion = this.getAmountFormatUnion(
      this.dateFrom.dateType === 'day' ? undefined : profitOverview?.net_profit,
    );
    const avgLaborProfitUnion = this.getAmountFormatUnion(
      this.dateFrom.dateType === 'day' ? undefined : profitOverview?.avg_labor_profit,
    );

    return (
      <div class="tg-manager-project-management-dashboard-container">
        <section class="query-field">
          <div class="date">
            <div class="date-type-btns" actived={this.dateFrom.dateType}>
              <div
                class="item year"
                actived={this.dateFrom.dateType === 'year'}
                on-click={() => (this.dateFrom.dateType = 'year')}
              >
                年度
              </div>
              <div
                class="item month"
                actived={this.dateFrom.dateType === 'month'}
                on-click={() => (this.dateFrom.dateType = 'month')}
              >
                月度
              </div>
              <div
                class="item day"
                actived={this.dateFrom.dateType === 'day'}
                on-click={() => (this.dateFrom.dateType = 'day')}
              >
                自定义
              </div>
            </div>
            <div class="date-picker">
              {/* {this.dateFrom.dateType === 'year' ? ( */}
              <el-date-picker
                clearable={false}
                editable={false}
                v-model={this.dateFrom.year}
                type="year"
                placeholder="选择年"
                size="mini"
                style={
                  this.dateFrom.dateType === 'year' ? 'width: 100%' : 'width: 100%; display: none;'
                }
                format="yyyy年"
                value-format="yyyy"
              ></el-date-picker>
              {/* ) : this.dateFrom.dateType === 'month' ? ( */}
              <el-date-picker
                clearable={false}
                editable={false}
                v-model={this.dateFrom.month}
                type="month"
                placeholder="选择月"
                size="mini"
                style={
                  this.dateFrom.dateType === 'month' ? 'width: 100%' : 'width: 100%; display: none;'
                }
                format="yyyy年MM月"
                value-format="yyyy-MM"
              ></el-date-picker>
              {/* ) : ( */}
              <el-date-picker
                clearable={false}
                editable={false}
                v-model={this.dateFrom.days}
                type="daterange"
                align="right"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                picker-options={this.pickerOptions}
                size="mini"
                style={
                  this.dateFrom.dateType === 'day' ? 'width: 100%' : 'width: 100%; display: none;'
                }
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                on-focus={() => (this.pickDate = undefined)}
              ></el-date-picker>
              {/* )} */}
            </div>
            {this.isDepartment && (
              <div class="department">
                <span class="label">所属部门：</span>
                <department-select
                  nodeKey="department_id"
                  levelDisabled={(level: number) => level === 1}
                  ref="departmentSelectRef"
                  levelHidden={(level: number) => level >= 4}
                  clearable={false}
                  v-model={this.formData.department_id}
                  defaultExpandedKeys={[this.formData.department_id]}
                  queryForm={{
                    need_department_names: '商业化中心,杭州煜丰电子商务有限公司,上海分公司',
                  }}
                  onCheck={this.onDepartmentCheck}
                ></department-select>
              </div>
            )}
          </div>
          {/* <div class="tips">
            <tg-icon name="ico-icon_tongyong_jinggao_mianxingbeifen-01"></tg-icon>
            <div>1、每月12号完成上月收入与成本结算；2、未完成结算前收入为预估数据。</div>
          </div>*/}
        </section>
        <div class="scroll-container">
          <div style="padding: 16px; background-color: white">
            {/* <div class="scroll-container-header">{this.isDepartment ? '部门' : '公司'}经营情况</div> */}
            <section class="summary-field">
              <div class="summary-container">
                <div class="summsry-tabs">
                  <div class="tab">
                    {/* gmv */}
                    <div
                      class="tab-item"
                      actived={this.detailType === 'gmv'}
                      on-click={() => (this.detailType = 'gmv')}
                    >
                      <div class="top">
                        <div class="left">
                          <div class="icon-bg">
                            {/* <img src={icon_gmv} alt="" /> */}
                            <tg-icon name="ico-common-GMV"></tg-icon>
                          </div>
                          <span class="icon-label">GMV</span>
                        </div>
                        <div class="right">
                          <span class="value">{gmvOverviewUnion.amountStr}</span>
                          {(gmvOverviewUnion.unit?.length || 0) > 0 && (
                            <span class="unit">{gmvOverviewUnion.unit}</span>
                          )}
                        </div>
                      </div>
                      <div class="bottom">
                        <div class="process">
                          <div class="left">
                            <span>进度</span>
                            <span
                              style={`color: ${this.statusColor(
                                goal_gmv_complete_rate,
                              )}; margin-left: 4px`}
                            >
                              {this.ratioFormat(goal_gmv_complete_rate)}
                            </span>
                            {goal_gmv_complete_rate !== null &&
                              goal_gmv_complete_rate !== undefined && (
                                <span
                                  style={`color: ${this.statusColor(
                                    goal_gmv_complete_rate,
                                  )}; margin-left: 6px`}
                                >
                                  ({this.statusStr(goal_gmv_complete_rate)})
                                </span>
                              )}
                          </div>
                          {this.getIncreateRateNode(gmvOverview.gmv_increase_rate)}
                        </div>
                        <div class="budget">
                          <span>预算：</span>
                          <span class="value">{goalGmvUnion.amountStr}</span>
                          {(goalGmvUnion.unit?.length || 0) > 0 && (
                            <span class="unit">{goalGmvUnion.unit}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* 营收 */}
                    <div
                      class="tab-item"
                      actived={this.detailType === 'revenue'}
                      on-click={() => (this.detailType = 'revenue')}
                    >
                      <div class="top">
                        <div class="left">
                          <div class="icon-bg">
                            {/* <img src={icon_revenue} alt="" /> */}
                            <tg-icon name="ico-common-yingshou"></tg-icon>
                          </div>

                          <span class="icon-label">营收</span>
                        </div>
                        <div class="right">
                          <span class="value">{revenueOverviewUnion.amountStr}</span>
                          {(revenueOverviewUnion.unit?.length || 0) > 0 && (
                            <span class="unit">{revenueOverviewUnion.unit}</span>
                          )}
                        </div>
                      </div>
                      <div class="bottom">
                        <div class="process">
                          <div class="left">
                            <span>进度</span>
                            <span
                              style={`color: ${this.statusColor(
                                goal_income_complete_rate,
                              )}; margin-left: 4px`}
                            >
                              {this.ratioFormat(goal_income_complete_rate)}
                            </span>
                            {goal_income_complete_rate !== null &&
                              goal_income_complete_rate !== undefined && (
                                <span
                                  style={`color: ${this.statusColor(
                                    goal_income_complete_rate,
                                  )}; margin-left: 6px`}
                                >
                                  ({this.statusStr(goal_income_complete_rate)})
                                </span>
                              )}
                          </div>
                          {this.getIncreateRateNode(incomeOverview.income_increase_rate)}
                        </div>
                        <div class="budget">
                          <span>预算：</span>
                          <span class="value">{goalIncomeUnion.amountStr}</span>
                          {(goalIncomeUnion.unit?.length || 0) > 0 && (
                            <span class="unit">{goalIncomeUnion.unit}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* 成本 */}
                    <div
                      class="tab-item"
                      actived={this.detailType === 'cost'}
                      on-click={() => (this.detailType = 'cost')}
                    >
                      <div class="top">
                        <div class="left">
                          <div class="icon-bg">
                            {/* <img src={icon_cost} alt="" /> */}
                            <tg-icon name="ico-common-chengben"></tg-icon>
                          </div>
                          <span class="icon-label">成本</span>
                        </div>
                        <div class="right">
                          {this.dateFrom.dateType === 'day' ? (
                            <div class="no-support-tip">不支持自定义统计</div>
                          ) : (
                            <fragments>
                              <span class="value">{costOverviewUnion.amountStr}</span>
                              {(costOverviewUnion.unit?.length || 0) > 0 && (
                                <span class="unit">{costOverviewUnion.unit}</span>
                              )}
                            </fragments>
                          )}
                        </div>
                      </div>
                      <div class="bottom">
                        <div class="process">
                          <div class="left">
                            <span>占营收</span>
                            <span style={`margin-left: 4px`}>
                              {this.ratioFormat(
                                this.dateFrom.dateType === 'day'
                                  ? undefined
                                  : costOverview.cost_to_income_percent,
                              )}
                            </span>
                          </div>
                          {this.getIncreateRateNode(
                            this.dateFrom.dateType === 'day'
                              ? undefined
                              : costOverview.cost_increase_rate,
                          )}
                        </div>
                        <div class="budget cost">
                          <span>
                            <span>预算：</span>
                            <span class="value">{goalCostUnion.amountStr}</span>
                            {(goalCostUnion.unit?.length || 0) > 0 && (
                              <span class="unit">{goalCostUnion.unit}</span>
                            )}
                          </span>
                          <span>
                            投产比：
                            {costOverview && (costOverview.roi || costOverview.roi === 0)
                              ? formatAmount(costOverview?.roi || '0', 'None', true)
                              : '--'}
                            <el-popover trigger={'hover'} placement="top-start">
                              <div style="display:inline-block;margin-left:4px " slot="reference">
                                <tg-icon
                                  name="ico-icon_explain"
                                  style="font-size: 14px; color: var(--icon-color)"
                                ></tg-icon>
                              </div>
                              <div class="date-box">
                                <div class="date-box-content">
                                  {this.isDepartment
                                    ? '部门投产比=部门营收/部门成本'
                                    : '公司投产比=公司营收/公司成本'}
                                </div>
                              </div>
                            </el-popover>
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 净利润 */}
                    <div
                      class="tab-item"
                      actived={this.detailType === 'profit'}
                      on-click={() => (this.detailType = 'profit')}
                    >
                      <div class="top">
                        <div class="left">
                          <div class="icon-bg">
                            {/* <img src={icon_profit} alt="" /> */}
                            <tg-icon name="ico-common-jinglirun"></tg-icon>
                          </div>
                          <span class="icon-label">净利润</span>
                        </div>
                        <div class="right">
                          {this.dateFrom.dateType === 'day' ? (
                            <div class="no-support-tip">不支持自定义统计</div>
                          ) : (
                            <fragments>
                              <span class="value">{profitOverviewUnion.amountStr}</span>
                              {(profitOverviewUnion.unit?.length || 0) > 0 && (
                                <span class="unit">{profitOverviewUnion.unit}</span>
                              )}
                            </fragments>
                          )}
                        </div>
                      </div>
                      <div class="bottom">
                        <div class="process">
                          <div class="left">
                            <span>净利率</span>
                            <span style={`margin-left: 4px`}>
                              {this.ratioFormat(
                                this.dateFrom.dateType === 'day'
                                  ? undefined
                                  : profitOverview.net_profit_rate,
                              )}
                            </span>
                          </div>
                          {this.getIncreateRateNode(
                            this.dateFrom.dateType === 'day'
                              ? undefined
                              : profitOverview.net_profit_increase_rate,
                          )}
                        </div>
                        <div class="budget">
                          <span class="value">人均产值：</span>
                          <span>{avgLaborProfitUnion.amountStr}</span>
                          {(avgLaborProfitUnion.unit?.length || 0) > 0 && (
                            <span class="unit">{avgLaborProfitUnion.unit}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section class="detail-field">
              <div class="border-container">
                <this.detailType
                  notSupport={this.dateFrom.dateType === 'day'}
                  showZoom={this.getDateParams().group_by === 'day'}
                  // showZoom={false}
                  gmvData={{
                    overview: this.reqGMVOverview.data,
                    trend: this.reqGMVTrend.data,
                  }}
                  revenueData={{
                    overview: this.reqIncomeOverview.data,
                    trend: this.reqIncomeTrend.data,
                  }}
                  costData={{
                    overview: this.reqCostOverview.data,
                    trend:
                      this.dateFrom.dateType === 'year' || this.dateFrom.dateType === 'month'
                        ? this.reqCostTrend.data
                        : [],
                  }}
                  profitData={{
                    overview: this.reqRevenueOverview.data,
                    trend:
                      this.dateFrom.dateType === 'year' || this.dateFrom.dateType === 'month'
                        ? this.reqRevenueTrend.data
                        : [],
                  }}
                ></this.detailType>
                <div class="angle" style={`left: ${angleLeft}`}></div>
              </div>
            </section>
          </div>
          <section class="statistics-field">
            <div class="switch-btns">
              {this.switchBtns.map(el => (
                <div
                  actived={this.activedSwitchBtn === el.type}
                  class="switch-btn"
                  key={el.name}
                  onClick={() => {
                    this.activedSwitchBtn = el.type;
                  }}
                >
                  {el.name}
                </div>
              ))}
            </div>
            <div class="statistics-detail-container">
              {<this.activedSwitchBtn queryForm={this.dateInfo}></this.activedSwitchBtn>}
            </div>
          </section>
        </div>
      </div>
    );
  },
});
