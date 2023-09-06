import { defineComponent, inject, ref, watchEffect } from '@vue/composition-api';
import gmv from '@/modules/management/projectManagementDashboard/tab/gmv/index.vue';
import revenue from '@/modules/management/projectManagementDashboard/tab/revenue/index.vue';
import profit from '@/modules/management/projectManagementDashboard/tab/profit/index.vue';
import cost from '@/modules/management/projectManagementDashboard/tab/cost/index.vue';
import icon_warning from '@/assets/img/management/icon_warning.png';
import icon_logo_bg from '@/assets/img/management/icon_logo_bg.png';
import {
  Query_Operate_Manage_Poject_Operating_Report_Cost_Overview,
  Query_Operate_Manage_Poject_Operating_Report_Cost_Trend,
  Query_Operate_Manage_Poject_Operating_Report_GMV_Overview,
  Query_Operate_Manage_Poject_Operating_Report_GMV_Trend,
  Query_Operate_Manage_Poject_Operating_Report_Income_Overview,
  Query_Operate_Manage_Poject_Operating_Report_Income_Trend,
  Query_Operate_Manage_Poject_Operating_Report_Revenue_Overview,
  Query_Operate_Manage_Poject_Operating_Report_Revenue_Trend,
  Query_Operate_Manage_Project_List,
  Query_Operate_Manage_Project_Overview,
} from '@/services/management';
import { useRequest } from '@gm/hooks/ahooks';
import { ProjectStatusMap } from '@/types/tiange/common';
import moment from 'moment';
import {
  ManagementDateType,
  ManagementDetailType,
  getAmountFormatUnion,
  ratioFormat,
} from '@/modules/management/use';
import keyInfo from '@/modules/management/projectManagementDashboard/dialog/keyInfo/index.vue';
import { useDialog } from '@/use/dialog';
import { useRouter } from '@/use/vue-router';
interface FormData {
  department_id: number | undefined;
  business_type: number | undefined;
  project_id: number | undefined;
}
interface DateForm {
  dateType: ManagementDateType;
  year: string | undefined;
  month: string | undefined;
  days: string[];
}

export default defineComponent({
  components: {
    gmv,
    revenue,
    cost,
    profit,
  },
  setup(props, ctx) {
    const ur_project_id = 84;
    const router = useRouter();
    let project_id: string | undefined = inject('project_id');
    console.log('project_id', project_id);

    let project_name: string | undefined = router.currentRoute.query?.project_name as string;
    const initQueryProjectList = ref(true);
    const defaultProjectOptions = {
      project_id: project_id ? +project_id : ur_project_id,
    };
    const initFormData = (): FormData => {
      return {
        // 默认选中商业化中心
        department_id: project_id ? undefined : 309,
        business_type: undefined,
        project_id: project_id ? Number(project_id) : undefined,
      };
    };

    const formData = ref<FormData>(initFormData());
    const currentDate = moment();
    const dateFrom = ref<DateForm>({
      dateType: 'year',
      year: currentDate.format('yyyy'),
      month: currentDate.format('yyyy-MM'),
      days: [],
    });
    const detailType = ref<ManagementDetailType>('revenue');
    const reqProjectList = useRequest(Query_Operate_Manage_Project_List, {
      manual: true,
      onSuccess(data) {
        if (initQueryProjectList.value) {
          initQueryProjectList.value = false;
          const finder = data?.find(el => el.id === defaultProjectOptions.project_id) || data?.[0];
          formData.value.project_id = finder?.id;
        }
        project_name = undefined;
        if (project_id) {
          project_id = undefined;
          defaultProjectOptions.project_id = ur_project_id;
        }
      },
    });
    const reqProjectOverview = useRequest(Query_Operate_Manage_Project_Overview, { manual: true });
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
      reset() {
        initQueryProjectList.value = true;
        formData.value = initFormData();
      },
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
          // {
          //   text: '最近三个月',
          //   onClick(picker: any) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          //     picker.$emit('pick', [start, end]);
          //   },
          // },
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
      projectCycle() {
        const overviewData = reqProjectOverview.data;
        if (overviewData?.project_start_date && overviewData?.project_end_date) {
          const format = 'yyyy.MM.DD';
          const startDate = moment(overviewData.project_start_date).format(format);
          const endDate = moment(overviewData.project_end_date).format(format);
          return `${startDate} ~ ${endDate}`;
        } else {
          return '--';
        }
      },
      getServiceAmount() {
        const union = methods.getAmountFormatUnion(reqProjectOverview.data?.service_amount);
        return union.unit ? `${union.amountStr}${union.unit}/月` : union.amountStr;
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
      queryProjectList(keywords: string) {
        reqProjectList.runAsync({
          business_type: formData.value.business_type,
          department_id: formData.value.department_id,
          is_end: keywords ? undefined : false,
          project_name: keywords,
          num: 1000,
          page_num: 1,
        });
      },
      ratioFormat,
    };

    watchEffect(() => {
      // console.log('watchEffect');
      reqProjectList.runAsync({
        business_type: formData.value.business_type,
        department_id: formData.value.department_id,
        is_end: project_name ? undefined : false,
        project_name: project_name,
        num: 1000,
        page_num: 1,
      });
    });

    watchEffect(() => {
      const { start_date, end_date } = methods.getDateParams();
      if (!start_date || !end_date || !formData.value.project_id) return;
      reqProjectOverview.runAsync({
        // year: dateFrom.value.year,
        project_id: formData.value.project_id,
        start_date,
        end_date,
      });
    });

    watchEffect(() => {
      const { start_date, end_date, group_by } = methods.getDateParams();
      if (!start_date || !end_date || !formData.value.project_id) return;
      const params = { start_date, end_date, project_id: formData.value.project_id };
      reqGMVOverview.runAsync(params);
      reqIncomeOverview.runAsync(params);
      reqGMVTrend.runAsync({
        ...params,
        group_by,
      });
      reqIncomeTrend.runAsync({
        ...params,
        // start_date: moment(start_date).startOf('month').format('YYYY-MM-DD'),
        // end_date: moment(end_date).endOf('month').format('YYYY-MM-DD'),
        group_by,
      });

      if (dateFrom.value.dateType !== 'day') {
        // 不支持成本喝利润自定义日期查询
        reqCostOverview.runAsync(params);
        reqRevenueOverview.runAsync(params);
        // if (dateFrom.value.dateType !== 'month') {
        reqCostTrend.runAsync({
          ...params,
          start_date: moment(start_date).startOf('year').format('YYYY-MM-DD'),
          end_date: moment(end_date).endOf('year').format('YYYY-MM-DD'),
          group_by: 'month',
        });
        reqRevenueTrend.runAsync({
          ...params,
          start_date: moment(start_date).startOf('year').format('YYYY-MM-DD'),
          end_date: moment(end_date).endOf('year').format('YYYY-MM-DD'),
          group_by: 'month',
        });
      }
      // }
    });

    const dialogKeyInfo = useDialog({
      component: keyInfo,
      title: '关键信息',
      width: '318px',
      okText: '确定',
      props: {},
      footer: false,
      on: {
        submit() {
          // list.reloadDisplayField();
          // ctx.emit('save');
        },
        close() {
          if (!formData.value.project_id) return;
          reqProjectOverview.reload();
        },
      },
    });

    return {
      formData,
      dateFrom,
      detailType,
      defaultProjectOptions,
      reqProjectList,
      reqProjectOverview,
      ProjectStatusMap,
      reqGMVOverview,
      reqGMVTrend,
      reqIncomeOverview,
      reqIncomeTrend,
      reqCostOverview,
      reqCostTrend,
      reqRevenueOverview,
      reqRevenueTrend,
      dialogKeyInfo,
      pickDate,
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
    const overviewData = this.reqProjectOverview.data;
    const gmvOverviewUnion = this.getAmountFormatUnion(this.reqGMVOverview.data?.gmv);
    const revenueOverviewUnion = this.getAmountFormatUnion(this.reqIncomeOverview.data?.income);
    const costOverviewUnion = this.getAmountFormatUnion(this.reqCostOverview.data?.cost);
    const profitOverviewUnion = this.getAmountFormatUnion(this.reqRevenueOverview.data?.net_profit);
    const project_expire_days = overviewData?.project_expire_days || 0;
    const projectCycleTip =
      project_expire_days < 1 ? '已到期' : `剩余合作时长：${project_expire_days}天`;
    return (
      <div class="tg-manager-project-management-dashboard-container">
        <div class="bar"></div>
        <div class="scroll-container">
          <section class="summary-field">
            <div class="summary-container">
              <div class="summsry-detail">
                <div class="summary-detail-left">
                  <div class="project-logo">
                    <el-image src={overviewData?.project_logo}>
                      <div slot="error" class="image-slot">
                        <div>{overviewData?.project_type_name}</div>
                      </div>
                    </el-image>
                  </div>
                  <div class="project-info">
                    <div class="project-info-top">
                      <div class="project-name">
                        <span class="name">{overviewData?.project_name || '--'}</span>
                        {(overviewData?.project_status_name?.length || 0) > 0 && (
                          <span class="status">
                            {/* {this.ProjectStatusMap.get(overviewData?.project_status)} */}
                            {overviewData?.project_status_name || '--'}
                          </span>
                        )}
                      </div>
                      <div class="project-cycle">
                        <span class="time">
                          <span class="time-label">项目周期：</span>
                          {this.projectCycle()}
                        </span>
                        {overviewData?.project_expire_days && project_expire_days <= 60 ? (
                          <el-popover
                            trigger="hover"
                            popper-class="tg-project-management-cycle-popover"
                            placement="top"
                            open-delay={300}
                            content={projectCycleTip}
                            style="height: 18px"
                          >
                            <img class="icon_warning" slot="reference" src={icon_warning} alt="" />
                          </el-popover>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div class="project-info-bottom">
                      <div class="project-info-bottom-item">
                        <span class="label">服务费：</span>
                        <span class="value line-clamp-1">{this.getServiceAmount()}</span>
                      </div>
                      <div class="project-info-bottom-item">
                        <span class="label">佣金比例：</span>
                        <span class="value line-clamp-1">
                          {this.ratioFormat(overviewData?.commission_rate)}
                        </span>
                      </div>
                      <div class="project-info-bottom-item">
                        <span class="label">
                          结算率
                          <el-popover
                            trigger="hover"
                            placement="top"
                            open-delay={300}
                            content="数据来源：年度预算导入"
                          >
                            <tg-icon
                              style="color: #C1C1C1; font-size: 14px"
                              slot="reference"
                              name="ico-common-wenda-areality"
                            ></tg-icon>
                          </el-popover>
                          ：
                        </span>
                        <span class="value line-clamp-1">
                          {this.ratioFormat(overviewData?.settled_rate)}
                        </span>
                      </div>
                      <div class="project-info-bottom-item">
                        <span class="label">结算周期：</span>
                        <span class="value line-clamp-1">
                          {overviewData?.settlement_cycle_type_name || '--'}
                        </span>
                      </div>
                      <div class="project-info-bottom-item">
                        <span class="label">关键信息：</span>
                        <span
                          class="value line-clamp-1"
                          style={
                            overviewData?.latest_project_comment
                              ? ''
                              : 'color: var(--text-third-color)'
                          }
                        >
                          {overviewData?.latest_project_comment || '暂无'}
                        </span>
                        {this.reqProjectOverview.data ? (
                          <tg-button
                            class="check-btn"
                            type="link"
                            on-click={() => {
                              this.dialogKeyInfo.show(overviewData?.project_id);
                            }}
                          >
                            {overviewData?.latest_project_comment ? '查看' : '添加'}
                          </tg-button>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                  <div class="logo-bg">
                    <img src={icon_logo_bg} alt="" />
                  </div>
                </div>
                <div class="summary-detail-right">
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
                        this.dateFrom.dateType === 'year'
                          ? 'width: 100%'
                          : 'width: 100%; display: none;'
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
                        this.dateFrom.dateType === 'month'
                          ? 'width: 100%'
                          : 'width: 100%; display: none;'
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
                        this.dateFrom.dateType === 'day'
                          ? 'width: 100%'
                          : 'width: 100%; display: none;'
                      }
                      format="yyyy.MM.dd"
                      value-format="yyyy-MM-dd"
                      on-focus={() => (this.pickDate = undefined)}
                    ></el-date-picker>
                    {/* )} */}
                  </div>
                </div>
              </div>
              <div class="summsry-tabs">
                <div class="tab">
                  <div
                    class="tab-item"
                    actived={this.detailType === 'gmv'}
                    on-click={() => (this.detailType = 'gmv')}
                  >
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
                  <div
                    class="tab-item"
                    actived={this.detailType === 'revenue'}
                    on-click={() => (this.detailType = 'revenue')}
                  >
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
                  <div
                    class="tab-item"
                    actived={this.detailType === 'cost'}
                    on-click={() => (this.detailType = 'cost')}
                  >
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
                  <div
                    class="tab-item"
                    actived={this.detailType === 'profit'}
                    on-click={() => (this.detailType = 'profit')}
                  >
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
                </div>
              </div>
            </div>
          </section>
          <section class="detail-field">
            <div class="border-container">
              <this.detailType
                notSupport={this.dateFrom.dateType === 'day'}
                // showZoom={false}
                showZoom={this.getDateParams().group_by === 'day'}
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
      </div>
    );
  },
});
