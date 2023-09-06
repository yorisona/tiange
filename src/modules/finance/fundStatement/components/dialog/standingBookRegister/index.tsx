import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { AddFinancialLedger, GetOurBankAccounts, QueryRevenueFlow } from '@/services/finance';
import {
  AccountType,
  AddFinancialLedgerParams,
  BankAccount,
  FlowType,
  RevenueFlowModel,
} from '@/types/tiange/finance/finance';
import { formatAmount } from '@/utils/string';
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

export interface StandingBookRegisterType {
  show: () => void;
}

export default defineComponent({
  name: 'projectFundStatement',
  setup(props, ctx) {
    const initForm = (): AddFinancialLedgerParams => {
      return {
        kind: FlowType.cost,
        date: undefined,
        bank_id: undefined,
        product_name: undefined,

        purchase: undefined,

        redeem: undefined,
        flow_id: undefined,
        profit: undefined,
      };
    };
    const saveLoading = ref(false);
    const visible = ref(false);
    const dataForm = ref(initForm());
    const elFormRef = ref<ElForm | undefined>(undefined);
    const bankList = ref<BankAccount[]>([]);
    const flowData = ref<RevenueFlowModel[]>([]);

    const refMethods: StandingBookRegisterType = {
      show() {
        visible.value = true;
      },
    };
    const methods = {
      onCloseHandler() {
        visible.value = false;
        setTimeout(() => {
          dataForm.value = initForm();
          elFormRef.value?.clearValidate();
        }, 500);
      },
      onSubmitHandler() {
        elFormRef.value?.validate(valid => {
          if (valid) {
            methods.addFinancialLedger();
          }
        });
      },
      async addFinancialLedger() {
        const { purchase, redeem, flow_id, profit, ...rest } = dataForm.value;
        const subParams =
          rest.kind === FlowType.cost
            ? {
                purchase,
              }
            : {
                redeem,
                flow_id,
                profit,
              };
        saveLoading.value = true;
        const res = await AddFinancialLedger({
          ...subParams,
          ...rest,
        });
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          ctx.emit('save');
          methods.onCloseHandler();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async getOurBankAccounts() {
        const res = await GetOurBankAccounts({
          status: 0,
          is_show: 1,
        });
        if (res.data.success) {
          bankList.value = res.data.data ?? [];
        }
      },
      async queryRevenueFlow(bank_id: number) {
        const res = await QueryRevenueFlow({
          bank_id,
          status: 0,
          num: 1000,
          page_num: 1,
        });
        if (res.data.success) {
          flowData.value = res.data.data.data ?? [];
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      onAmountInput(value: string) {
        // isEdited.value = true;
        const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        return result ? result : undefined;
        // dataForm.value.amount = result ? result : undefined;
      },
      recordDate(date: string | undefined) {
        return date ? moment(date).format('M.D') : '--';
      },
      formatAmount,
    };

    onMounted(() => {
      methods.getOurBankAccounts();
    });

    watch(
      () => dataForm.value.kind,
      () => {
        elFormRef.value?.clearValidate();
      },
    );

    watch([() => dataForm.value.bank_id, () => dataForm.value.kind], ([newBankId, _]) => {
      if (newBankId) {
        methods.queryRevenueFlow(newBankId);
      } else {
        flowData.value = [];
      }
    });

    watch([() => dataForm.value.flow_id, () => dataForm.value.redeem], ([newFlowId, newredeem]) => {
      if (!newFlowId) {
        dataForm.value.profit = undefined;
        return;
      }
      const finder = flowData.value?.find(el => el.id === newFlowId);
      if (!finder) {
        dataForm.value.profit = undefined;
        return;
      }
      const amount = new Decimal((finder.income ?? 0) / 100)
        .sub(new Decimal(newredeem ? newredeem : 0))
        .toFixed(2);
      dataForm.value.profit = amount;
      // formatAmount(amount, 'None');
    });

    return {
      bankList,
      elFormRef,
      saveLoading,
      dataForm,
      flowData,
      visible,
      ...refMethods,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          title="理财台账登记"
          class="tg-dialog-classic tg-dialog-vcenter-new tg-standing-book-register-container"
          width="350px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form ref="elFormRef" size="mini" label-width="76px" props={{ model: this.dataForm }}>
            <el-form-item class="text-item" label="登记类型：">
              <el-radio-group v-model={this.dataForm.kind}>
                <el-radio label={FlowType.cost}>买入登记</el-radio>
                <el-radio label={FlowType.income}>到账登记</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="日期："
              prop="date"
              rules={[{ required: true, message: '请选择日期', trigger: 'change' }]}
            >
              <el-date-picker
                style="width: 220px;"
                editable={false}
                clearable={false}
                value-format="yyyy-MM-dd"
                format="yyyy.MM.dd"
                v-model={this.dataForm.date}
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            {this.dataForm.kind === FlowType.cost ? (
              <el-form-item
                label="买入账户："
                prop="bank_id"
                rules={[{ required: true, message: '请选择买入账户', trigger: 'change' }]}
              >
                <el-select
                  style="width: 220px;"
                  v-model={this.dataForm.bank_id}
                  placeholder="请选择"
                >
                  {this.bankList.map(el => {
                    return <el-option label={el.bank_name} value={el.id} key={el.id}></el-option>;
                  })}
                </el-select>
              </el-form-item>
            ) : (
              <el-form-item
                label="所属账户："
                prop="bank_id"
                rules={[{ required: true, message: '请选择所属银行', trigger: 'change' }]}
              >
                <el-select
                  style="width: 220px;"
                  v-model={this.dataForm.bank_id}
                  placeholder="请选择"
                  on-change={() => {
                    this.flowData = [];
                    this.dataForm.flow_id = undefined;
                  }}
                >
                  {this.bankList.map(el => {
                    return <el-option label={el.bank_name} value={el.id} key={el.id}></el-option>;
                  })}
                </el-select>
              </el-form-item>
            )}

            <el-form-item
              label="产品名称："
              prop="product_name"
              rules={[{ required: true, message: '请输入产品名称', trigger: 'blur' }]}
            >
              <el-input style="width: 220px;" v-model={this.dataForm.product_name}></el-input>
            </el-form-item>
            {this.dataForm.kind === FlowType.cost ? (
              <el-form-item
                label="买入金额："
                prop="purchase"
                rules={[{ required: true, message: '请输入买入金额', trigger: 'blur' }]}
              >
                <el-input
                  style="width: 220px;"
                  v-model={this.dataForm.purchase}
                  on-input={(val: string) => {
                    this.dataForm.purchase = this.onAmountInput(val);
                  }}
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            ) : (
              <fragments>
                <el-form-item
                  label="到账记录："
                  prop="flow_id"
                  rules={[{ required: true, message: '请选择到账记录', trigger: 'change' }]}
                >
                  <el-select
                    style="width: 220px;"
                    v-model={this.dataForm.flow_id}
                    placeholder="请选择"
                  >
                    {this.flowData.map(el => (
                      <el-option
                        label={`${this.recordDate(el.revenue_date)} ${
                          el.account_type === AccountType.bank
                            ? el.payer || '--'
                            : el.payment_account || '--'
                        }: ${this.formatAmount((el.income ?? 0) / 100, 'None')}元`}
                        value={el.id}
                        key={el.id}
                      ></el-option>
                    ))}
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="赎回金额："
                  prop="redeem"
                  rules={[{ required: true, message: '请输入赎回金额', trigger: 'blur' }]}
                >
                  <el-input
                    style="width: 220px;"
                    v-model={this.dataForm.redeem}
                    on-input={(val: string) => {
                      this.dataForm.redeem = this.onAmountInput(val);
                    }}
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="产品收益：" prop="profit">
                  <el-input
                    style="width: 220px;"
                    value={this.dataForm.profit ? formatAmount(this.dataForm.profit, 'None') : ''}
                    disabled={true}
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                {/* <div>填写说明：赎回金额与产品收益2选1必填。</div> */}
              </fragments>
            )}
          </el-form>
          <template slot="footer">
            <tg-button type="primary" onClick={this.onSubmitHandler}>
              保存
            </tg-button>
            <tg-button onClick={this.onCloseHandler}>取消</tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
