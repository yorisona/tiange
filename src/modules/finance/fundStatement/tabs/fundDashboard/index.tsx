import { formatAmount, imgTokenUrl } from '@/utils/string';
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import pie from '@/modules/finance/fundStatement/components/charts/pie/index.vue';
import bar from '@/modules/finance/fundStatement/components/charts/bar/index.vue';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import {
  FinanceAccountDetail,
  FinanceOverview,
  FinancePie,
  FinanceTrends,
} from '@/services/finance';
import { wait } from '@/utils/func';
import {
  ClassifyType,
  FinanceAccountDetailModel,
  FinanceOverviewModel,
  FinancePieModel,
  FinanceTrendsModel,
} from '@/types/tiange/finance/finance';
import icon_fund_statement_annual_cost from '@/assets/img/finance/icon_fund_statement_annual_cost.png';
import icon_fund_statement_annual_income from '@/assets/img/finance/icon_fund_statement_annual_income.png';
import icon_fund_statement_balence from '@/assets/img/finance/icon_fund_statement_balence.png';
import icon_fund_statement_financing_balance from '@/assets/img/finance/icon_fund_statement_financing_balance.png';
import account_icom_default from '@/assets/img/finance/account_icom_default.png';
import account_alipay_logo from '@/assets/img/finance/account_alipay_logo.png';
import { usePieColors } from '../../use/useColors';

export default defineComponent({
  name: 'fundDashboard',
  components: {
    pie,
    bar,
  },
  setup(props, ctx) {
    const overviewLoading = ref(false);
    const pieLoading = ref(false);
    const yearIncomeDetailLoading = ref(false);
    const accountLoading = ref(false);

    const overviewData = ref<FinanceOverviewModel | undefined>(undefined);
    const pieData = ref<FinancePieModel[] | undefined>(undefined);
    const trendData = ref<FinanceTrendsModel | undefined>(undefined);
    const accountData = ref<FinanceAccountDetailModel[] | undefined>(undefined);

    const yearIncomeDetailUnit = computed(() => {
      const findItem = trendData.value?.datas?.find(el => {
        const income = Math.abs(el.income ?? 0) / 100;
        const cost = Math.abs(el.cost ?? 0) / 100;
        const balance = Math.abs(el.balance ?? 0) / 100;
        return income > 10000 || cost > 10000 || balance > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });

    const methods = {
      async financeOverview() {
        overviewLoading.value = true;
        const [res] = await wait(500, FinanceOverview());
        overviewLoading.value = false;
        if (res.data.success) {
          overviewData.value = res.data.data;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async financePie() {
        pieLoading.value = true;
        const [res] = await wait(500, FinancePie());
        pieLoading.value = false;
        if (res.data.success) {
          pieData.value = res.data.data;
        }
      },
      async financeTrends() {
        yearIncomeDetailLoading.value = true;
        const [res] = await wait(500, FinanceTrends());
        yearIncomeDetailLoading.value = false;
        if (res.data.success) {
          trendData.value = res.data.data;
        }
      },
      async financeAccountDetail() {
        accountLoading.value = true;
        const [res] = await wait(500, FinanceAccountDetail());
        accountLoading.value = false;
        if (res.data.success) {
          accountData.value = res.data.data;
        }
      },
      reloadAll() {
        methods.financeOverview();
        methods.financePie();
        methods.financeTrends();
        methods.financeAccountDetail();
      },
      pieItemColorObj(index: number) {
        const color = usePieColors[index];
        return color ? { color } : {};
      },
      bankBgColor(classify: ClassifyType) {
        switch (classify) {
          case ClassifyType.alipay:
            return '#02A9F10D';
          case ClassifyType.zhaoshangBank:
            return '#D600000D';
          case ClassifyType.nongyeBank:
            return '#009B810D';
          case ClassifyType.gongshangBank:
            return '#EF00010D';
          case ClassifyType.hangzhouBank:
            return '#019CE60D';
          case ClassifyType.lianheBank:
            return '#07A74C0D';
          case ClassifyType.beijingBank:
            return '#FE00160D';
          case ClassifyType.ningboBank:
            return '#FAB2060D';
          default:
            return '#019CE60D';
        }
      },
      bankLogo(bank: FinanceAccountDetailModel) {
        if (bank.classify === ClassifyType.alipay) {
          return account_alipay_logo;
        }
        return imgTokenUrl(bank.logo);
      },
      formatAmount,
      imgTokenUrl,
    };

    onMounted(() => {
      methods.reloadAll();
    });

    return {
      overviewLoading,
      pieLoading,
      yearIncomeDetailLoading,
      accountLoading,
      yearIncomeDetailUnit,
      overviewData,
      pieData,
      trendData,
      accountData,
      usePieColors,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-finance-fund-dashboard-container">
        <div style="min-width: 1244px; display: flex; flex: 1; flex-direction: column;">
          <section class="summary-field" v-loading={this.overviewLoading}>
            <div class="summary-item">
              <div>
                <img style="width: 16px; height: 16px;" src={icon_fund_statement_balence} alt="" />
                <div class="summary-title">可用余额</div>
              </div>
              <div class="summary-amount">
                {this.formatAmount((this.overviewData?.total_balance ?? 0) / 100, 'None')}
              </div>
              <div class="summary-other">
                <span style="margin-right: 8px;">待支付</span>
                <span>{this.formatAmount((this.overviewData?.total_unpaid ?? 0) / 100, '¥ ')}</span>
              </div>
            </div>
            <div class="summary-item">
              <div>
                <img
                  style="width: 16px; height: 16px;"
                  src={icon_fund_statement_financing_balance}
                  alt=""
                />
                <div class="summary-title">理财资金</div>
              </div>
              <div class="summary-amount">
                {this.formatAmount((this.overviewData?.financing_balance ?? 0) / 100, 'None')}
              </div>
              <div class="summary-other">
                <span style="margin-right: 8px;">累计收益</span>
                <span>
                  {this.formatAmount((this.overviewData?.financing_earn ?? 0) / 100, '¥ ')}
                </span>
              </div>
            </div>
            <div class="summary-item">
              <div>
                <img
                  style="width: 16px; height: 16px;"
                  src={icon_fund_statement_annual_income}
                  alt=""
                />
                <div class="summary-title">年度收入</div>
              </div>
              <div class="summary-amount">
                {this.formatAmount((this.overviewData?.annual_income ?? 0) / 100, 'None')}
              </div>
              <div class="summary-other">
                <span style="margin-right: 8px;">本月收入</span>
                <span>
                  {this.formatAmount((this.overviewData?.monthly_income ?? 0) / 100, '¥ ')}
                </span>
              </div>
            </div>
            <div class="summary-item">
              <div>
                <img
                  style="width: 16px; height: 16px;"
                  src={icon_fund_statement_annual_cost}
                  alt=""
                />
                <div class="summary-title">年度支出</div>
              </div>
              <div class="summary-amount">
                {this.formatAmount((this.overviewData?.annual_cost ?? 0) / 100, 'None')}
              </div>
              <div class="summary-other">
                <span style="margin-right: 8px;">本月支出</span>
                <span>{this.formatAmount((this.overviewData?.monthly_cost ?? 0) / 100, '¥ ')}</span>
              </div>
            </div>
          </section>
          <section class="charts-field">
            <div class="charts-pie">
              <pie
                style="height: 293px;"
                loading={this.pieLoading}
                // totalAmount={sunburstTotalAmount}
                series={{
                  data:
                    this.pieData?.map((el, elIdx) => ({
                      name: el.account_name,
                      value: (el.value ?? 0) / 100,
                      itemStyle: {
                        ...this.pieItemColorObj(elIdx),
                      },
                    })) ?? [],
                }}
              ></pie>
            </div>
            <div class="charts-bar">
              <div class="harts-bar-title">年度收支明细</div>
              <bar
                yUnit={this.yearIncomeDetailUnit}
                style="height:298px; margin-top: 24px;"
                loading={this.yearIncomeDetailLoading}
                xData={this.trendData?.months ?? []}
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
                    data: this.trendData?.datas?.map(el => (el.income ?? 0) / 100) ?? [],
                    balanceChange:
                      this.trendData?.datas?.map(el => (el.balance_change ?? 0) / 100) ?? [],
                    // (
                    //   this.profitRatioData?.datas?.find(el => el.key === 'income')?.value ?? []
                    // ).map(el => (el ? el : 0)),
                  },
                  {
                    name: '支出',
                    type: 'bar',
                    barMaxWidth: 28,
                    barMinWidth: 8,
                    barGap: '30%',
                    barCategoryGap: '45%',
                    itemStyle: {
                      color: '#2877FF',
                      borderRadius: 2,
                    },
                    data: this.trendData?.datas?.map(el => (el.cost ?? 0) / 100) ?? [],
                    //  (
                    //   this.profitRatioData?.datas?.find(el => el.key === 'cost')?.value ?? []
                    // ).map(el => (el ? el : 0)),
                  },
                  {
                    name: '余额',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
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
                    data: this.trendData?.datas?.map(el => (el.balance ?? 0) / 100) ?? [],
                    // (
                    //   this.profitRatioData?.datas?.find(el => el.key === 'profit_ratio')?.value ?? []
                    // ).map(el => (el ? el : 0)),
                  },
                ]}
              ></bar>
            </div>
          </section>
          <section class="banks-field" v-loading={this.accountLoading}>
            {(this.accountData ?? []).length > 0 ? (
              <div class="banks-llist">
                {(this.accountData ?? []).map(el => {
                  return (
                    <div
                      class="bank-item"
                      style={`background-color: ${this.bankBgColor(el.classify)}`}
                    >
                      <el-image class="bank-icon-bg" src={this.bankLogo(el)}>
                        <div slot="placeholder" class="project-icon-slot">
                          <img src={account_icom_default} alt="" />
                        </div>
                        <div slot="error" class="project-icon-slot">
                          <img src={account_icom_default} alt="" />
                        </div>
                      </el-image>
                      {/* <img class="bank-icon" src={el.logo} alt="" /> */}
                      <el-image class="bank-icon" src={this.bankLogo(el)}>
                        <div slot="placeholder" class="project-icon-slot">
                          <img src={account_icom_default} alt="" />
                        </div>
                        <div slot="error" class="project-icon-slot">
                          <img src={account_icom_default} alt="" />
                        </div>
                      </el-image>
                      <div class="bank-info">
                        {/* <tg-textPopover
                          class="bank-name"
                          text={el.account_name}
                          maxWidth={186}
                        ></tg-textPopover> */}
                        <el-popover
                          open-delay={300}
                          placement="top-start"
                          trigger="hover"
                          // offset={100}
                        >
                          <div slot="reference">
                            <div class="bank-name line-clamp-1">{el.account_name}</div>
                            <div class="bank-amount">
                              {this.formatAmount((el.balance ?? 0) / 100, '¥ ')}
                            </div>
                          </div>
                          <div>
                            <div style="color: var(--text-color); font-size: 14px; font-weight: 500; line-height: 18px; height: 18px;">
                              {el.account_name}
                            </div>
                            <div class="mgt-18" style="font-size: 12px; color: var(--text-color);">
                              <span style="color: #606974;">可用余额：</span>
                              <span>
                                {this.formatAmount((el.available_balance ?? 0) / 100, '¥ ')}
                              </span>
                            </div>
                            <div class="mgt-12" style="font-size: 12px; color: var(--text-color);">
                              <span style="color: #606974;">理财余额：</span>
                              <span>
                                {this.formatAmount((el.financing_balance ?? 0) / 100, '¥ ')}
                              </span>
                            </div>
                          </div>
                        </el-popover>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style="height: 300px; display: flex; flex-direction: column; justify-content: center;">
                <empty-common detail-text="暂无数据"></empty-common>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  },
});
