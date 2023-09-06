import { ClaimRevenueFlow } from '@/services/finance';
import {
  AccountType,
  FlowRevenueType,
  FlowRevenueTypeMap,
  RevenueFlowModel,
} from '@/types/tiange/finance/finance';
import { computed, defineComponent, ref } from '@vue/composition-api';

// enum AccountType {
//   bank,
//   zfb,
// }

interface ClaimForm {
  id: number | undefined;
  revenue_type: number | undefined;
  remark: string | undefined;
  account_type: AccountType;
}

export interface IncomeClaimType {
  show: (flow: RevenueFlowModel) => void;
}

export default defineComponent({
  name: 'projectFundStatement',
  setup(props, ctx) {
    const initForm = (): ClaimForm => {
      return {
        id: undefined,
        revenue_type: undefined,
        remark: undefined,
        account_type: AccountType.bank,
      };
    };

    const visible = ref(false);
    const saveLoading = ref(false);
    const claimForm = ref(initForm());
    const old_revenue_type = ref<number | undefined>(undefined);
    const old_revenue_type_display = ref<string>('');
    const refMethods: IncomeClaimType = {
      show(flow: RevenueFlowModel) {
        visible.value = true;
        const { id, revenue_type, revenue_type_display, remark, account_type } = flow;

        claimForm.value = {
          id,
          revenue_type:
            revenue_type === FlowRevenueType.fundTransfer ||
            revenue_type === FlowRevenueType.zfbWithdraw ||
            revenue_type === FlowRevenueType.vTaskIncome
              ? undefined
              : revenue_type,
          remark,
          account_type,
        };
        old_revenue_type_display.value = revenue_type_display || '';
        old_revenue_type.value = claimForm.value.revenue_type;
      },
    };

    const incomeTypeList = computed(() => {
      const tempList: {
        value: FlowRevenueType;
        name: string;
        disabled: Boolean;
      }[] = [];
      FlowRevenueTypeMap.forEach((val, key) => {
        if (claimForm.value.account_type === AccountType.bank) {
          if (key === FlowRevenueType.otherIncome) {
            tempList.push({
              value: key,
              name: val,
              disabled: false,
            });
          }
        } else if (claimForm.value.account_type === AccountType.zfb) {
          if (
            key === FlowRevenueType.staffRepayment ||
            key === FlowRevenueType.damageIndemnity ||
            key === FlowRevenueType.otherIncome ||
            key === FlowRevenueType.redEnvelopeReturn
          ) {
            tempList.push({
              value: key,
              name: val,
              disabled: false,
            });
          }
        }
      });
      if (old_revenue_type.value) {
        const find = tempList.find(it => it.value === old_revenue_type.value);
        if (!find) {
          tempList.push({
            value: old_revenue_type.value || 0,
            name: old_revenue_type_display.value || '',
            disabled: true,
          });
        }
      }
      return tempList;
    });

    const methods = {
      onCloseHandler() {
        visible.value = false;
      },
      onSaveHandler() {
        methods.claimRevenueFlow();
      },
      async claimRevenueFlow() {
        saveLoading.value = true;
        const res = await ClaimRevenueFlow({
          ...claimForm.value,
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
    };
    return {
      saveLoading,
      incomeTypeList,
      claimForm,
      visible,
      ...refMethods,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          title="收入认领"
          class="tg-dialog-classic tg-dialog-vcenter-new tg-income-claim-container"
          width="340px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form size="mini" label-width="70px">
            <el-form-item label="收入类型：">
              <el-select
                popper-class="el-select-popper-mini"
                clearable
                style="width: 220px;"
                v-model={this.claimForm.revenue_type}
                placeholder="请选择"
              >
                {this.incomeTypeList.map(el => (
                  <el-option
                    label={el.name}
                    value={el.value}
                    key={el.value + '____' + el.name}
                    disabled={el.disabled}
                  ></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="收入备注：">
              <el-input
                style="width: 220px;"
                type="textarea"
                v-model={this.claimForm.remark}
                placeholder="选填（限20字）"
                maxlength={20}
              ></el-input>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <tg-button type="primary" onClick={this.onSaveHandler}>
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
