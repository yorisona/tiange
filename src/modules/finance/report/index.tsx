/*
 * @Author: 肖槿
 * @Date: 2021-12-14 10:21:59
 * @Description: 财务报表tsx
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-05-19 11:09:42
 * @FilePath: \goumee-star-frontend\src\modules\finance\report\index.tsx
 */
import { defineComponent, provide, nextTick, computed, watch, ref } from '@vue/composition-api';
import financeDetails from './financeDetails/index.vue';
import financePrecharge from './financePrecharge/index.vue';
import {
  IncomeOrPaySearchType,
  IncomeSearchTypeOptions,
  PaySearchTypeOptions,
  reportFilterParams,
} from './reportType';
import financePrepay from './financePrepay/index.vue';
import financeQuick from './financeQuick/index.vue';
// import unWriteOff from './unWriteOff/index.vue';
import dailyCost from './dailyCost/index.vue';
import { exportQuick, exportReport, useReport, useUnWriteOff } from './useReport';
import { useRefTabs } from '@/use/tab';
import { Tab } from '@/types/components/tabs';
import days from 'moment';
import { usePermission } from '@/use/permission';
import { BusinessTypeOptions } from '@/types/tiange/common';

export default defineComponent({
  components: {
    financeDetails,
    financePrecharge,
    financePrepay,
    financeQuick,
    // unWriteOff,
    dailyCost,
  },
  setup(prop, ctx) {
    const tabsArr = [
      { label: '收支明细', value: 'financeDetails' },
      { label: '预收', value: 'financePrecharge' },
      { label: '预付', value: 'financePrepay' },
      // { label: '未核销发票', value: 'unWriteOff' },
      // { label: '历史快照', value: 'financeQuick' },
      { label: '日支出报表', value: 'dailyCost' },
    ];
    const activeRoute = computed(() =>
      tabsArr.filter((item: any) => ctx.root.$route.meta?.tab.includes(item.value)),
    );
    const allTabs: any = computed(() => ctx.root.$route.meta?.tab);
    const { checkedTab, tabs } = useRefTabs(activeRoute, allTabs.value?.[0]);
    const { params: reportParams } = useReport(ctx);
    const { params: queryForm } = useUnWriteOff(ctx);
    provide('filterParams', reportParams);
    const query = () => {
      nextTick(() => {
        (
          ctx.refs[checkedTab.value] as unknown as { query: (params: reportFilterParams) => void }
        ).query(reportParams.value);
      });
    };
    watch(
      () => ctx.root.$route,
      () => {
        checkedTab.value = ctx.root.$route.meta?.tab[0];
      },
    );
    const reset = () => {
      reportParams.value.business_type = undefined;
      reportParams.value.project_name = undefined;
      reportParams.value.page_num = 1;
      reportParams.value.num = 30;
      reportParams.value.income_search_type = IncomeOrPaySearchType.incomeDate;
      reportParams.value.pay_search_type = IncomeOrPaySearchType.payDate;
      reportParams.value.income_date = undefined;
      reportParams.value.pay_date = undefined;
      reportParams.value.settlement_date = undefined;
      reportParams.value.date = days(new Date())
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM');
      reportParams.value.account_detail_date = days(new Date())
        .subtract(1, 'months')
        .startOf('month')
        .format('YYYY-MM');
      query();
    };
    const unWriteOfQuery = () => {
      nextTick(() => {
        (ctx.refs.unWriteOff as unknown as { query: (params: any) => void }).query(queryForm.value);
      });
    };
    const unWriteOfReset = () => {
      queryForm.value.num = 1;
      queryForm.value.num = 30;
      queryForm.value.buyer_name = '';
      queryForm.value.seller_name = '';
      queryForm.value.invoice_number = '';
      queryForm.value.invoice_type = '';
      queryForm.value.is_special = '';
      queryForm.value.invoice_status = '1';
      queryForm.value.not_full_write_off = '1';
      unWriteOfQuery();
    };
    const permission = usePermission();
    const exportHandler = () => {
      if (checkedTab.value === 'financeDetails') {
        exportDetailsHandler();
      } else if (checkedTab.value === 'financeQuick') {
        exportQuickHandler();
      }
    };
    const exportQuickHandler = () => {
      exportQuick(reportParams.value);
    };
    //收支明细
    const exportDetailsHandler = () => {
      const {
        account_detail_date,
        project_name,
        business_type,
        settlement_date,
        income_or_pay_search_type,
        income_or_pay_date,
        income_search_type,
        income_date,
        pay_search_type,
        pay_date,
      } = reportParams.value;
      const newParams = {
        account_detail_date,
        project_name,
        business_type,
        settlement_date,
        income_or_pay_search_type,
        income_or_pay_date,
      };
      if (income_date) {
        newParams.income_or_pay_search_type = income_search_type;
        newParams.income_or_pay_date = income_date;
      } else if (pay_date) {
        newParams.income_or_pay_search_type = pay_search_type;
        newParams.income_or_pay_date = pay_date;
      } else {
        newParams.income_or_pay_search_type = undefined;
        newParams.income_or_pay_date = undefined;
      }

      exportReport(newParams);
    };
    const topCardHeight = ref(158);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    return {
      businessTypeOptions: [{ value: undefined, label: '全部' }, ...BusinessTypeOptions],
      topCardHeight,
      onTopCardRectUpdate,
      IncomeSearchTypeOptions,
      PaySearchTypeOptions,
      checkedTab,
      tabs,
      reportParams,
      queryForm,
      query,
      reset,
      allTabs,
      unWriteOfQuery,
      unWriteOfReset,
      permission,
      exportHandler,
    };
  },
  render() {
    const tabsProps = {
      props: {
        tabs: this.tabs,
        bottom: true,
        value: this.checkedTab,
      },
      on: {
        change: (tab: Tab<string>) => {
          this.checkedTab = tab.value;
        },
      },
    };
    return (
      <div class="page-report" v-loading={this.loading}>
        {this.allTabs.length > 1 && <tg-tabs {...tabsProps} />}
        {this.checkedTab !== 'dailyCost' && (
          <tg-card padding={[16, 0, 16, 16]} on={{ 'rect:update': this.onTopCardRectUpdate }}>
            {this.checkedTab !== 'unWriteOff' && (
              <el-form
                class="filter-form"
                size="mini"
                label-width="60px"
                attrs={{
                  model: this.formData,
                }}
              >
                <div class="filter-form-div">
                  {(this.checkedTab === 'financeDetails' || this.checkedTab === 'financeQuick') && (
                    <div class="filter-form-item">
                      <el-form-item label="账期时间：">
                        <el-date-picker
                          editable={false}
                          v-model={this.reportParams.account_detail_date}
                          type="month"
                          placeholder="选择月"
                          style="width: 100%"
                          format="yyyy.MM"
                          value-format="yyyy-MM"
                        />
                      </el-form-item>
                    </div>
                  )}
                  <div class="filter-form-item">
                    <el-form-item label="业务类型：">
                      <el-select
                        popper-class="el-select-popper-mini"
                        v-model={this.reportParams.business_type}
                        class="select"
                        placeholder="请选择业务类型"
                        style="width: 100%"
                      >
                        {this.businessTypeOptions.map(el => (
                          <el-option label={el.label} value={el.value} key={el.value}></el-option>
                        ))}
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item" style="width:302px">
                    <el-form-item label="项目名称：">
                      <el-input
                        v-model={this.reportParams.project_name}
                        placeholder="请输入项目名称"
                        v-key-enter={this.query}
                      />
                    </el-form-item>
                  </div>
                  {(this.checkedTab === 'financeDetails' || this.checkedTab === 'financeQuick') && (
                    <fragments>
                      <div class="filter-form-item">
                        <el-form-item label="结算周期：">
                          <el-date-picker
                            editable={false}
                            v-model={this.reportParams.settlement_date}
                            type="month"
                            placeholder="选择月"
                            style="width: 100%"
                            format="yyyy.MM"
                            value-format="yyyy-MM"
                          />
                        </el-form-item>
                      </div>
                      <div class="filter-form-item">
                        <el-form-item label="收款搜索：">
                          <div class="item-groups">
                            <el-select
                              disabled={this.reportParams.pay_date}
                              v-model={this.reportParams.income_search_type}
                            >
                              {this.IncomeSearchTypeOptions.map(el => (
                                <el-option
                                  label={el.label}
                                  value={el.value}
                                  key={el.value}
                                ></el-option>
                              ))}
                            </el-select>
                            <el-date-picker
                              editable={false}
                              disabled={this.reportParams.pay_date}
                              v-model={this.reportParams.income_date}
                              type="month"
                              placeholder="选择月"
                              style="width: 100%"
                              format="yyyy.MM"
                              value-format="yyyy-MM"
                            />
                          </div>
                        </el-form-item>
                      </div>
                      <div class="filter-form-item">
                        <el-form-item label="付款搜索：">
                          <div class="item-groups">
                            <el-select
                              disabled={this.reportParams.income_date}
                              v-model={this.reportParams.pay_search_type}
                            >
                              {this.PaySearchTypeOptions.map(el => (
                                <el-option
                                  label={el.label}
                                  value={el.value}
                                  key={el.value}
                                ></el-option>
                              ))}
                            </el-select>
                            <el-date-picker
                              editable={false}
                              disabled={this.reportParams.income_date}
                              v-model={this.reportParams.pay_date}
                              type="month"
                              placeholder="选择月"
                              style="width: 100%"
                              format="yyyy.MM"
                              value-format="yyyy-MM"
                            />
                          </div>
                        </el-form-item>
                      </div>
                    </fragments>
                  )}
                  <div class="filter-form-item">
                    <el-form-item label-width="0">
                      <div class="filter-form-item-btn">
                        <tg-button type="primary" onClick={this.query}>
                          查询
                        </tg-button>
                        <tg-button class="mgl-8" onClick={this.reset}>
                          重置
                        </tg-button>
                        {(this.checkedTab === 'financeDetails' ||
                          this.checkedTab === 'financeQuick') &&
                          this.permission.invoice_report_export && (
                            <tg-button
                              class="mgl-8"
                              type="default"
                              icon="ico-btn-export"
                              download
                              onclick={this.exportHandler}
                            >
                              导出
                            </tg-button>
                          )}
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            )}
            {this.checkedTab === 'unWriteOff' && (
              <el-form
                class="filter-form un-writeoff-form"
                size="mini"
                label-width="60px"
                attrs={{
                  model: this.formData,
                }}
              >
                <div class="filter-form-div">
                  <div class="filter-form-item">
                    <el-form-item label="购买方：">
                      <el-input
                        placeholder="请输入购买方"
                        v-model={this.queryForm.buyer_name}
                        v-key-enter={this.unWriteOfQuery}
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item">
                    <el-form-item label="销售方：">
                      <el-input
                        placeholder="请输入销售方"
                        v-model={this.queryForm.seller_name}
                        v-key-enter={this.unWriteOfQuery}
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item">
                    <el-form-item label="发票号码：">
                      <el-input
                        placeholder="请输入关键字"
                        v-model={this.queryForm.invoice_number}
                        v-key-enter={this.unWriteOfQuery}
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item">
                    <el-form-item label="发票类型：">
                      <el-select
                        popper-class="el-select-popper-mini"
                        v-model={this.queryForm.invoice_type}
                      >
                        <el-option label="全部" value="" />
                        <el-option label="销售发票" value="1" />
                        <el-option label="采购发票" value="2" />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item">
                    <el-form-item label="是否专票：">
                      <el-select
                        popper-class="el-select-popper-mini"
                        v-model={this.queryForm.is_special}
                      >
                        <el-option label="全部" value="" />
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-form-item">
                    <el-form-item label-width="0">
                      <div class="filter-form-item-btn">
                        <tg-button type="primary" onClick={this.unWriteOfQuery}>
                          查询
                        </tg-button>
                        <tg-button class="mgl-8" onClick={this.unWriteOfReset}>
                          重置
                        </tg-button>
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
            )}
          </tg-card>
        )}
        <this.checkedTab
          class="page-report-body"
          from_height={this.topCardHeight}
          ref={this.checkedTab}
        />
      </div>
    );
  },
});
