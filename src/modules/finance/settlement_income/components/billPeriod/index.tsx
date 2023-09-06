import { QueryAccountPeriod } from '@/services/finance';
import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

interface BillingPeriodForm {
  date: string | undefined;
}

export interface BillingPeriodType {
  show: () => void;
  close: () => void;
}

export default defineComponent({
  name: 'billingPeriod',
  props: {
    saveLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const initForm = (): BillingPeriodForm => {
      return {
        date: undefined,
      };
    };
    const visible = ref(false);
    const billingForm = ref(initForm());
    const elFormRef = ref<ElForm | undefined>(undefined);
    const disabledMonth = ref<number[] | undefined>(undefined);
    const refMethods: BillingPeriodType = {
      show() {
        methods.queryAccountPeriod();
        visible.value = true;
        billingForm.value = {
          date: moment().format('YYYY-MM-DD'),
        };
      },
      close() {
        methods.onCloseHandler();
      },
    };

    const methods = {
      onCloseHandler() {
        visible.value = false;
      },
      onSaveHandler() {
        elFormRef.value?.validate(valid => {
          if (valid) {
            ctx.emit('save', billingForm.value.date);
          }
        });
        // methods.claimRevenueFlow();
      },
      async queryAccountPeriod() {
        const res = await QueryAccountPeriod({
          num: 1000,
          page_num: 1,
          account_month: undefined,
          effective_month: '2021-01',
          // effective_month: moment().subtract(1, 'year').format('yyyy-MM'),
        });
        if (res.data.success) {
          disabledMonth.value =
            res.data.data.data.map(el => {
              return el.period_date_start || 0;
            }) || [];
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
          return disabledMonth.value?.find(el => {
            if (el) {
              return moment(el * 1000).isSame(date, 'month');
            }
          });
        },
      },
    };
    return {
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
          title="账期选择"
          class="tg-dialog-classic tg-dialog-vcenter-new tg-billing-period-operate-container"
          width="340px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form
            ref="elFormRef"
            size="small"
            label-width="80px"
            props={{ model: this.billingForm }}
          >
            <el-form-item
              label="账期时间："
              prop="date"
              rules={{ required: true, message: '请选择日期', trigger: 'change' }}
            >
              <el-date-picker
                style="width: 210px;"
                v-model={this.billingForm.date}
                type="date"
                placeholder="请选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
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
