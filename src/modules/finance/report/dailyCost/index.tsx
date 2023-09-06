/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-03-14 16:52:38
 */

import { GetDailyCostList, GetOurBankAccounts } from '@/services/finance';
import {
  BankAccount,
  DailyCostModel,
  DailyCostQueryForm,
  DailyCostQueryParams,
  FinaceFeeType,
  FinaceFeeTypeMap,
  FinaceSpendingType,
  FinaceSpendingTypeMap,
} from '@/types/tiange/finance/finance';
import { getToken } from '@/utils/token';
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import moment from 'moment';
import { useColumns } from '../../invoice/use/dailyCostColumns';
import dialogImport from './dialogImport/index.vue';
import { useDialog } from '@/use/dialog';
import { numberFormat } from '@/utils/formatMoney';
import { MaycurListExpenseCategories } from '@/services/maycur';
import { usePagination } from '@gm/hooks/ahooks';

const search_type_map = new Map([
  ['付款编号', 'form_code'],
  ['申请人', 'add_by_name'],
  ['户名', 'bank_acct_name'],
  ['项目名称', 'project_name'],
  ['付款事由', 'fksy'],
  ['备注', 'bz'],
  ['管报科目', 'subject_name'],
]);

export default defineComponent({
  setup(props, ctx) {
    const initQueryForm = (): DailyCostQueryForm => {
      return {
        date: undefined,
        pay_type: undefined,
        payer_bank_account_id: undefined,
        department_name: undefined,
        expense_category_code: undefined,
        project_name: undefined,
        page_num: 1,
        num: 20,
        search_type: '付款编号',
      };
    };

    const dialog = useDialog({
      component: dialogImport,
      width: '844px',
      title: '导入支出报表',
      footer: false,
      on: {
        submit() {
          queryForm.value.page_num = 1;
          methods.queryDailyCostReq();
        },
      },
    });
    const queryForm = ref<DailyCostQueryForm>(initQueryForm());
    const tableData = ref<DailyCostModel[]>([]);
    const total = ref<number>(0);
    const loading = ref<boolean>(false);
    const activeRoute = computed(() => ctx.root.$route.meta?.tab[0]);

    const reqExpenseCategories = usePagination(MaycurListExpenseCategories, {
      defaultPageSize: 10000,
    });
    const feeTypeList = computed(() => {
      const feeTypes: { value: FinaceFeeType; name: string }[] = [];
      FinaceFeeTypeMap.forEach((name, val) => {
        feeTypes.push({
          value: val,
          name,
        });
      });
      return feeTypes;
    });

    const spendingTypeList = computed(() => {
      const spendingTypes: { value: FinaceSpendingType; name: string }[] = [];
      FinaceSpendingTypeMap.forEach((name, val) => {
        spendingTypes.push({
          value: val,
          name,
        });
      });
      return spendingTypes;
    });

    const accountList = ref<BankAccount[]>([]);

    const columns = useColumns(tableData);

    const pickerOptions = {
      disabledDate(time: Date) {
        const minMomen = moment('2021-01-01');
        return moment(time).isBefore(minMomen);
      },
    };

    const methods = {
      query() {
        queryForm.value.page_num = 1;
        methods.queryDailyCostReq();
      },
      reset() {
        queryForm.value = initQueryForm();
        methods.queryDailyCostReq();
      },
      exprotDailyCost() {
        const queryParams = Object.keys(queryForm.value).reduce((prev, curr) => {
          if (curr === 'page_num' || curr === 'num') {
            return prev;
          }
          const val = (queryForm.value as Record<string, any>)[curr];
          if (val) {
            if (curr === 'date') {
              return `${prev}&start_date=${val[0]}&end_date=${val[1]}`;
            } else if (curr === 'project_name') {
              const search_type_key = search_type_map.get(queryForm.value.search_type as string);
              return `${prev}&${search_type_key}=${val}`;
            } else {
              return `${prev}&${curr}=${val}`;
            }
          }
          return prev;
        }, `Authorization=${getToken()}`);
        const urlPath = '/api/financial/export_daily_pay';
        const url = queryParams.length ? `${urlPath}?${queryParams}` : urlPath;
        window.open(url, '_blank');
      },
      queryDailyCostReq: async () => {
        const { date, project_name, search_type, ...rest } = queryForm.value;
        const search_type_key = search_type_map.get(search_type as string);

        const params: DailyCostQueryParams = {
          ...rest,
          start_date: date?.[0],
          end_date: date?.[1],
          [search_type_key as any]: project_name,
        } as any;
        loading.value = true;
        const res = await GetDailyCostList(params);
        loading.value = false;
        if (res.data.success) {
          tableData.value = res.data.data.data;
          total.value = res.data.data.total;
          statistics_data.value = (res.data.data as any).statistics_data;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      handleCurrentChange(val: number) {
        queryForm.value.page_num = val;
        methods.queryDailyCostReq();
      },
      currentSizeChange(val: number) {
        queryForm.value.num = val;
        methods.queryDailyCostReq();
      },
    };

    onMounted(async () => {
      methods.queryDailyCostReq();
      const res = await GetOurBankAccounts();
      if (res.data.success) {
        accountList.value = res.data.data;
      }
    });
    const statistics_data = ref<any>();
    const summaryMethod = () => {
      if (statistics_data.value === undefined) return [];
      return [
        '合计',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        numberFormat(statistics_data.value.sum_tax_excluded_amount, 2),
        numberFormat(statistics_data.value.sum_tax_amount, 2),
        numberFormat(statistics_data.value.sum_payment_amount, 2),
        numberFormat(statistics_data.value.sum_loan_write_off, 2),
        numberFormat(statistics_data.value.sum_approved_amount, 2),
        '--',
        '--',
        '--',
        '--',
        '--',
      ];
    };
    // 自适应表格高度部分
    // const topCardHeightStr = ref('calc(100vh - 290px)');
    const topCardHeight = ref(158);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    const topCardHeightStr = computed(() => {
      const height = total.value <= 0 ? 85 : 138;
      const topCardHeight_s = String(Number(topCardHeight.value + height).toFixed(0));
      return 'calc(100vh - ' + topCardHeight_s + 'px)';
    });
    return {
      topCardHeight,
      topCardHeightStr,
      onTopCardRectUpdate,
      total,
      queryForm,
      tableData,
      activeRoute,
      columns,
      feeTypeList,
      spendingTypeList,
      accountList,
      pickerOptions,
      loading,
      summaryMethod,
      dialog,
      ...methods,
      reqExpenseCategories,
    };
  },
  render() {
    return (
      <tg-card class="daily-cost-container" padding={0}>
        <tg-card
          class="daily-cost-background-card"
          style="min-width: 1088px;"
          padding={[16, 0, 4, 16]}
          on={{ 'rect:update': this.onTopCardRectUpdate }}
        >
          <el-form
            class="daily-cost-filter-form"
            size="mini"
            label-width="60px"
            attrs={{
              model: this.formData,
            }}
          >
            <div class="daily-cost-filter-form-div">
              <div class="daily-cost-filter-form-item">
                <el-form-item label="日期选择：">
                  <el-date-picker
                    v-model={this.queryForm.date}
                    type="daterange"
                    style="width: 100%"
                    clearable
                    range-separator="～"
                    value-format="yyyy-MM-dd"
                    format="yyyy.MM.dd"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    pickerOptions={this.pickerOptions}
                    editable={false}
                  />
                </el-form-item>
              </div>
              <div class="daily-cost-filter-form-item">
                <el-form-item label="支出类型：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.queryForm.pay_type}
                    class="daily-cost-select"
                    placeholder="请选择支出类型"
                    style="width: 100%"
                  >
                    <el-option label="全部" value={undefined} key={0} />
                    {this.spendingTypeList.map((el, index) => {
                      return (
                        <el-option label={el.name} value={el.value} key={index + 1}></el-option>
                      );
                    })}
                  </el-select>
                </el-form-item>
              </div>
              <div class="daily-cost-filter-form-item">
                <el-form-item label="转出路径：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.queryForm.payer_bank_account_id}
                    class="daily-cost-select"
                    placeholder="请选择转出路径"
                    style="width: 100%"
                  >
                    <el-option label="全部" value={undefined} key={0} />
                    {this.accountList.map((el, index) => {
                      return (
                        <el-option label={el.bank_name} value={el.id} key={index + 1}></el-option>
                      );
                    })}
                  </el-select>
                </el-form-item>
              </div>
              <div class="daily-cost-filter-form-item">
                <el-form-item label="归属部门：">
                  <el-input
                    v-model={this.queryForm.department_name}
                    placeholder="请输入归属部门"
                    v-key-enter={this.query}
                  />
                </el-form-item>
              </div>
              <div class="daily-cost-filter-form-item">
                <el-form-item label="会计科目：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    v-model={this.queryForm.expense_category_code}
                    class="daily-cost-select"
                    placeholder="请选择会计科目"
                    style="width: 100%"
                  >
                    <el-option label="全部" value={undefined} key={0} />
                    {this.reqExpenseCategories.data
                      ?.filter(it => it.is_active)
                      .map((el, index) => {
                        return (
                          <el-option
                            label={el.expense_category_name}
                            value={el.expense_category_code}
                            key={index + 1}
                          ></el-option>
                        );
                      })}
                  </el-select>
                </el-form-item>
              </div>
              <div class="daily-cost-filter-form-item form-item-project">
                <el-form-item label="其他搜索：">
                  <el-input
                    v-model={this.queryForm.project_name}
                    placeholder={`请输入${this.queryForm.search_type}`}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      slot="prepend"
                      v-model={this.queryForm.search_type}
                      style="width: 100px; padding-left: 6px"
                    >
                      <el-option label="付款编号" value="付款编号" />
                      <el-option label="项目名称" value="项目名称" />
                      <el-option label="申请人" value="申请人" />
                      <el-option label="户名" value="户名" />
                      <el-option label="管报科目" value="管报科目" />
                      {/*<el-option label="付款事由" value="付款事由" />*/}
                      {/*<el-option label="备注" value="备注" />*/}
                    </el-select>
                  </el-input>
                </el-form-item>
              </div>
              <div class="daily-cost-filter-form-item">
                <el-form-item label-width="0">
                  <div class="daily-cost-filter-form-item-btn">
                    <tg-button type="primary" onClick={this.query}>
                      查询
                    </tg-button>
                    <tg-button class="mgl-8" onClick={this.reset}>
                      重置
                    </tg-button>
                    <tg-button class="mgl-8" onClick={this.dialog.show}>
                      导入
                    </tg-button>
                    <tg-button class="mgl-8" onClick={this.exprotDailyCost}>
                      导出
                    </tg-button>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </tg-card>
        <tg-card
          class="daily-cost-background-card mgt-10"
          style="min-width: 1088px;"
          padding={[16, 16, 0, 16]}
        >
          <tg-table
            height={
              this.activeRoute === 'dailyCost' || this.tableData.length <= 0
                ? this.topCardHeightStr
                : 'calc(100vh - 300px)'
            }
            v-loading={this.loading}
            border
            stripe
            class="daily-cost-precharge-table"
            data={this.tableData}
            columns={this.columns}
            show-summary={true}
            summary-method={this.summaryMethod}
          >
            <template slot="empty">
              <empty-common detail-text="暂无数据"></empty-common>
            </template>
            {/* {this.columns.map(v => (
              <el-table-column props={{ ...v }} />
            ))} */}
          </tg-table>

          {this.tableData.length > 0 && (
            <div class="daily-cost-pagination">
              <el-pagination
                class="flex-none"
                current-page={this.queryForm.page_num}
                page-sizes={[10, 20, 30, 50, 100]}
                page-size={this.queryForm.num}
                total={this.total}
                layout="total, prev, pager, next, sizes, jumper"
                on-current-change={this.handleCurrentChange}
                on-size-change={this.currentSizeChange}
              />
            </div>
          )}
        </tg-card>
      </tg-card>
    );
  },
});
