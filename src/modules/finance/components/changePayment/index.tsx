import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { EditApproveCostSettlement, QueryAccountPeriod } from '@/services/finance';
import moment from 'moment';
import { wait } from '@/utils/func';

interface FormData {
  allocated_time?: string;
}
export default defineComponent({
  setup(props, ctx) {
    const initFormData = (): FormData => {
      return {
        allocated_time: undefined,
      };
    };
    /** 1为收入，2为成本 */
    const settlement_type = ref(1);
    const formRef = ref<ElForm>();
    const formRules = ref({
      allocated_time: [{ required: true, message: '请选择账期', trigger: 'change' }],
    });
    const formData = ref(initFormData());
    const disabledMonth = ref<any[]>([]);
    const currentcolumn = ref<any>({});
    const queryAccountPeriod = async () => {
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
    };
    const show = (row: any, type = 1) => {
      currentcolumn.value = row;
      settlement_type.value = type;
      queryAccountPeriod();
    };
    const confirmLoading = ref(false);
    /* const isMerchantSettlement = computed(() => {
      return currentcolumn.value?.shop_live_live_goods_id;
    });*/
    const onSaveBtnClick = async () => {
      if (!formData.value.allocated_time) {
        ctx.root.$message.error('请选择账期');
        return;
      }
      /* const result = await AsyncConfirm(ctx, '确定通过这条结算吗？');
      if (!result) {
        return;
      }*/

      confirmLoading.value = true;
      /** type:1为收入，2为成本 */
      const [{ data: response }] = await wait(
        500,
        EditApproveCostSettlement(
          {
            account_month: formData.value.allocated_time,
            settlement_id: currentcolumn.value.id,
          },
          settlement_type.value,
        ),
      );
      confirmLoading.value = false;

      if (response.success) {
        ctx.root.$message.success(response.message ?? '确认结算成功');
        ctx.emit('close');
        ctx.emit('submit');
      } else {
        ctx.root.$message.error(response.message ?? '确认结算失败');
      }
      /*} else {
        confirmLoading.value = true;
        const { data } = isMerchantSettlement.value
          ? await ApproveMerchantSettlementFinancial(currentcolumn.value.id)
          : await ApproveSettlement(currentcolumn.value.id, {
              account_detail_date: formData.value.allocated_time,
            });
        confirmLoading.value = false;
        if (!data.success) {
          ctx.root.$message({
            type: 'warning',
            message: data.message ?? '提交失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
        } else {
          ctx.root.$message({
            type: 'success',
            message: '提交成功',
            duration: 2000,
            showClose: true,
          });
          ctx.emit('close');
          ctx.emit('submit');
        }
      }*/
    };
    const pickerOptions = {
      disabledDate(time: any) {
        const minMoment = moment('2021-01');
        const maxMoment = moment();
        const date = moment(time);
        if (date.isBefore(minMoment, 'month') || date.isAfter(maxMoment, 'month')) {
          return true;
        }
        return disabledMonth.value.find(el => {
          if (el) {
            return moment(el * 1000).isSame(date, 'month');
          }
        });
      },
    };
    return {
      formRef,
      formRules,
      formData,
      pickerOptions,
      confirmLoading,
      show,
      onSaveBtnClick,
    };
  },
  render() {
    return (
      <div class="tg-new-cost-sharing-container">
        <el-form
          size="mini"
          rules={this.formRules}
          label-width="44px"
          ref="formRef"
          props={{ model: this.formData }}
        >
          <el-form-item label="账期：" prop="allocated_time">
            <el-date-picker
              type="month"
              editable={false}
              v-model={this.formData.allocated_time}
              placeholder="请选择"
              format="yyyy.MM"
              value-format="yyyy-MM"
              style="width: 100%"
              picker-options={this.pickerOptions}
              // on-change={this.onAccountDateChange}
            />
          </el-form-item>
        </el-form>
        <div class="tips">
          <div class="label">说明：</div>
          <div>
            <div>结算单账期调整后，请同步手动调整金蝶系统账期。</div>
          </div>
        </div>
        <tg-mask-loading visible={this.confirmLoading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
