import {
  defineComponent,
  reactive,
  ref,
  inject,
  UnwrapRef,
  Ref,
  nextTick,
} from '@vue/composition-api';
import { LiveProject } from '@/types/tiange/live.project';
import { SAVE_SHOP_LIVE_COST } from '@/services/live.project';
import { Message } from 'element-ui';
import { ValidateCallback } from '@/types/vendor/form';
import rules from '@/utils/rules';
import moment from 'moment';
import { ElInput } from 'element-ui/types/input';
interface IForm {
  cost_id?: number;
  new_cost_type?: number;
  project_id?: number;
  pay_amount?: number;
  pay_reason: string;
  transfer_date: string;
}

const getSpecifiedDateStr = (day = 15) => {
  const date = new Date();
  const newDate = new Date(date.getFullYear(), date.getMonth(), day);

  return moment(newDate).format('YYYY-MM-DD');
};

const formDefault = {
  id: undefined,
  pay_amount: undefined,
  pay_reason: '',
  transfer_date: getSpecifiedDateStr(),
};
export default defineComponent({
  setup(props, ctx) {
    const saveLoading = ref(false);

    const payAmountRef = ref<ElInput | undefined>(undefined);

    const project = inject<Ref<UnwrapRef<LiveProject>>>('project');
    const form = reactive<IForm>({ ...formDefault });
    const visible = ref(false);
    const show = (obj: any = {}) => {
      Object.entries({ ...formDefault, ...obj }).forEach(([key, value]) => {
        // @ts-ignore
        form[key] = value as any;
      });
      visible.value = true;
      nextTick(() => {
        payAmountRef.value?.focus();
      });
    };

    const formRef =
      ref<UnwrapRef<{ validate: (arg: (valid: boolean) => boolean | undefined) => void } | null>>(
        null,
      );
    const emitClose = (value = false) => {
      ctx.emit('close', value);
      visible.value = false;
    };
    const emitSuccess = () => {
      ctx.emit('added');
      visible.value = false;
      saveLoading.value = false;
    };

    const submit = () => {
      formRef.value?.validate((valid: boolean) => {
        if (!valid) return false;

        const project_id = project ? project.value.id : -1;
        if (project_id === -1) {
          Message.error('项目ID错误');
          return false;
        }

        const query: any = {
          project_id: project_id,
          new_cost_type: 1,
          ...form,
        };
        saveLoading.value = true;

        SAVE_SHOP_LIVE_COST(query)
          .then(res => {
            if (!res.data.success) return Message.error(res.data.message);
            Message.success(res.data.message);
            setTimeout(emitSuccess, 1000);
          })
          .catch(ex => {
            Message.error(ex.message);
            saveLoading.value = false;
          });
      });
    };

    return {
      saveLoading,
      project,
      form,
      formRef,
      emitClose,
      submit,
      visible,
      show,
      payAmountRef,
    };
  },
  render(h) {
    return (
      <div>
        <el-dialog
          class="customer-dialog tg-dialog-vcenter"
          width="478px"
          visible={this.visible}
          title={'登记成本'}
          close-on-click-modal={false}
          onClose={this.emitClose}
        >
          <div class="cost-dialog-achievement-container">
            <el-form
              labelWidth={'78px'}
              ref="formRef"
              size="small"
              labelPosition="top"
              attrs={{
                model: this.form,
              }}
              onInput={() => {
                //
              }}
            >
              <el-form-item label="成本类型">
                <el-input value="人员工资" disabled={true} />
              </el-form-item>
              <el-form-item
                label="打款金额"
                prop="pay_amount"
                rules={[
                  { required: true, message: '请输入打款金额', trigger: 'blur' },
                  {
                    validator: (rule: any, value: string, callback: ValidateCallback) => {
                      if (isNaN(value as any)) return callback(new Error('无效金额'));
                      const reg = /\.(\d+)/g;
                      const match = reg.exec(value);
                      if (!match) return callback();
                      if (match[1].length > 2) return callback(new Error('只能输入2位小数'));
                      callback();
                    },
                    trigger: 'blur',
                  },
                  {
                    validator: (rule: any, value: string, callback: ValidateCallback) => {
                      if (Number(value) <= 0) {
                        callback(new Error('费用金额必须大于0'));
                      }
                      callback();
                    },
                    trigger: 'change',
                  },
                  {
                    validator: rules.number_range(0),
                    trigger: 'blur',
                  },
                ]}
              >
                <el-input
                  placeholder="请输入打款金额"
                  value={this.form.pay_amount}
                  ref="payAmountRef"
                  inputType="price"
                  maxLength={14}
                  onInput={(val: any) => (this.form.pay_amount = val)}
                />
              </el-form-item>
              <el-form-item
                label="用款日期"
                prop="transfer_date"
                rules={[{ required: true, message: '请输入用款日期', trigger: 'change' }]}
              >
                <el-date-picker
                  style="width: 100%"
                  placeholder="请输入用款日期"
                  value={this.form.transfer_date}
                  onInput={(val: any) => (this.form.transfer_date = val)}
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item
                label="付款事由"
                prop="pay_reason"
                inputType="date"
                rules={{ required: true, message: '请输入付款事由', trigger: 'blur' }}
              >
                <el-input
                  type="textarea"
                  placeholder="请输入付款事由"
                  rows={4}
                  maxlength={100}
                  show-word-limit={true}
                  value={this.form.pay_reason}
                  onInput={(val: any) => (this.form.pay_reason = val)}
                />
              </el-form-item>
            </el-form>
          </div>
          <template slot="footer">
            <tg-button onClick={this.emitClose}>取消</tg-button>
            <tg-button type="primary" onClick={this.submit}>
              提交
            </tg-button>
          </template>
        </el-dialog>

        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
