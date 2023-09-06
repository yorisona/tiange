/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-13 15:49:14
 */
import { useRefTabs } from '@/use/tab';
import { defineComponent } from '@vue/composition-api';

import fundDashboard from './tabs/fundDashboard/index.vue';
import fundDailyReport from './tabs/fundDailyReport/index.vue';
import fundYearReport from './tabs/fundYearReport/index.vue';
import financialStandingBook from './tabs/financialStandingBook/index.vue';
import projectFundStatement from './tabs/projectFundStatement/index.vue';

import departmentFundStatement from './tabs/departmentFundStatement/index.vue';
import pendingPayDetail from './tabs/pendingPayDetail/index.vue';
import pendingClaimIncome from './tabs/pendingClaimIncome/index.vue';
import { usePermission } from '@/use/permission';

export default defineComponent({
  components: {
    fundDashboard,
    fundDailyReport,
    fundYearReport,
    financialStandingBook,
    projectFundStatement,
    departmentFundStatement,
    pendingPayDetail,
    pendingClaimIncome,
  },
  setup() {
    const permission = usePermission();

    const getTabArr = () => {
      const tempArr: any[] = [];
      if (permission.fund_dashboard_view)
        tempArr.push({ label: '资金看板', value: fundDashboard.name });
      if (permission.fund_daily_report_view)
        tempArr.push({ label: '资金日报', value: fundDailyReport.name });
      if (permission.fund_year_report_view)
        tempArr.push({ label: '资金年报', value: fundYearReport.name });
      if (permission.financal_standing_book_view)
        tempArr.push({ label: '理财台帐', value: financialStandingBook.name });
      if (permission.project_fund_statement_view)
        tempArr.push({ label: '项目资金报表', value: projectFundStatement.name });
      if (permission.department_fund_statement_view)
        tempArr.push({ label: '部门资金报表', value: departmentFundStatement.name });
      if (permission.pending_pay_detail_view)
        tempArr.push({ label: '待支付明细', value: pendingPayDetail.name });
      if (permission.pending_claim_income_view)
        tempArr.push({ label: '待认领收入', value: pendingClaimIncome.name });
      return tempArr;
    };

    const tabArr = getTabArr();
    const tabs = useRefTabs(tabArr, tabArr[0]?.name);
    const methods = {};
    return {
      ...tabs,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-finance-fund-statement-container">
        <tg-tabs tabs={this.tabs} v-model={this.checkedTab}></tg-tabs>
        <this.checkedTab></this.checkedTab>
      </div>
    );
  },
});
