import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import Input from '@/utils/inputLimit';
import { Select } from '@gm/component';
import { useRequest } from '@gm/hooks/ahooks';
import { Exchange_Integral_M } from '@/services/integral';
import { Loading, Message } from 'element-ui';

interface DeductForm {
  reason_type: E.mb.IntegralMReasonType;
  exchange_m_num: number;
  comment: string;
  user_id: number;
}

const IntegralMReasonType = E.mb.IntegralMReasonType;
const reason_type = [
  IntegralMReasonType.commodity_exchange,
  IntegralMReasonType.resignation_clearance,
  IntegralMReasonType.other_deduction,
].map(value => {
  return {
    label: E.mb.IntegralMReasonTypeMap.get(value) as string,
    value,
  };
});
export default defineComponent({
  setup(props, ctx) {
    const elFormRef = ref<ElForm | undefined>(undefined);
    const formData = ref<DeductForm>({
      deliver_count: undefined,
      deliver_reason: undefined,
      remark: undefined,
      user_id: undefined,
    } as any);
    const reqSave = useRequest(Exchange_Integral_M, { manual: true });
    const methods = {
      show(row: any) {
        formData.value.user_id = row.user_id;
      },
      onSaveBtnClick() {
        elFormRef.value?.validate(success => {
          if (success) {
            const params = { ...formData.value };
            params.exchange_m_num = 0 - params.exchange_m_num;
            const service = Loading.service({ background: 'rgba(0,0,0,0.1)' });
            Promise.resolve(reqSave.runAsync(params))
              .then(() => {
                Message.success('操作成功');
                ctx.emit('submit');
                ctx.emit('close');
              })
              .finally(() => {
                service.close();
              });
          }
        });
      },
    };

    return {
      elFormRef,
      formData,
      ...methods,
    };
  },
  render() {
    return (
      <div class="m-currency-deduct-dialog">
        <el-form
          ref="elFormRef"
          size="mini"
          label-width="68px"
          attrs={{ model: this.formData }}
          class="m-currency-deduct-dialog-content"
        >
          <el-form-item
            prop="exchange_m_num"
            label="扣除数量："
            rules={{ required: true, message: '请输入扣除数量', trigger: 'blur' }}
          >
            <el-input
              v-model={this.formData.exchange_m_num}
              on-input={(val: string) => {
                let newVal: any = Input.Interger(val);
                if (newVal < 0) newVal = undefined;
                this.formData.exchange_m_num = newVal;
              }}
            />
          </el-form-item>
          <el-form-item
            prop="reason_type"
            label="扣除原因："
            rules={{ required: true, message: '请选择扣除原因', trigger: 'change' }}
          >
            <Select
              v-model={this.formData.reason_type}
              placeholder="请选择"
              options={reason_type}
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              show-word-limit
              type="textarea"
              v-model={this.formData.comment}
              maxlength="100"
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
