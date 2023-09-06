import { CloseAccountPeriod } from '@/services/finance';
import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

interface BillingPeriodOperateForm {
  account_month: string | undefined;
}
export interface BillingPeriodOperateType {
  show: (disabledDate: number[]) => void;
}

export default defineComponent({
  name: 'billingPeriodOperate',
  setup(props, ctx) {
    const initForm = (): BillingPeriodOperateForm => {
      return {
        account_month: undefined,
      };
    };

    const visible = ref(false);
    const saveLoading = ref(false);
    const billingForm = ref(initForm());
    const elFormRef = ref<ElForm | undefined>(undefined);
    const disabledDateList = ref<number[]>([]);

    const refMethods: BillingPeriodOperateType = {
      show(disabledDate: number[]) {
        disabledDateList.value = disabledDate;
        visible.value = true;
      },
    };

    const methods = {
      onCloseHandler() {
        visible.value = false;
        setTimeout(() => {
          billingForm.value.account_month = undefined;
          elFormRef.value?.clearValidate();
        }, 500);
      },
      onSaveHandler() {
        elFormRef.value?.validate(valid => {
          if (valid) {
            methods.closeAccountPeriod();
          }
        });
      },
      async closeAccountPeriod() {
        saveLoading.value = true;
        const { account_month } = billingForm.value;
        const res = await CloseAccountPeriod({
          account_month,
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
      pickerOptions: {
        disabledDate(time: any) {
          const minMoment = moment('2021-01');
          const maxMoment = moment();
          const date = moment(time);
          if (date.isBefore(minMoment, 'month') || date.isAfter(maxMoment, 'month')) {
            return true;
          }
          return disabledDateList.value?.find(el => {
            if (el) {
              return moment(el * 1000).isSame(date, 'month');
            }
          });
        },
      },
    };
    return {
      saveLoading,
      billingForm,
      visible,
      elFormRef,
      ...refMethods,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          title="关闭账期"
          class="tg-dialog-classic tg-dialog-vcenter-new tg-billing-period-operate-container"
          width="340px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form
            ref="elFormRef"
            size="mini"
            label-width="80px"
            props={{ model: this.billingForm }}
          >
            <el-form-item
              label="选择账期："
              prop="account_month"
              rules={{ required: true, message: '请选择账期', trigger: 'change' }}
            >
              <el-date-picker
                style="width: 210px;"
                v-model={this.billingForm.account_month}
                type="month"
                placeholder="请选择月份"
                format="yyyy.MM"
                value-format="yyyy-MM"
                editable={false}
                picker-options={this.pickerOptions}
              ></el-date-picker>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <tg-button onClick={this.onCloseHandler}>取消</tg-button>
            <tg-button type="primary" onClick={this.onSaveHandler}>
              确认
            </tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
