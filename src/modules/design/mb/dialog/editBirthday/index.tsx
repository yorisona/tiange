import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { useRequest } from '@gm/hooks/ahooks';
import { Update_Integral_M_User } from '@/services/integral';

export default defineComponent({
  setup(_, ctx) {
    const elFormRef = ref<ElForm | undefined>(undefined);
    const formData = ref<{ birthday: string | undefined }>({
      birthday: undefined,
    });
    const user_id = ref<number>(0);
    const reqUpdate = useRequest(Update_Integral_M_User, { manual: true });
    const methods = {
      show(row: any) {
        user_id.value = row.user_id;
      },
      onSaveBtnClick() {
        elFormRef.value?.validate(success => {
          if (success) {
            const birth_date = formData.value.birthday?.replace(/^\d+-/, '') as string;
            reqUpdate.runAsync({ user_id: user_id.value, birth_date }).then(() => {
              ctx.emit('submit');
              ctx.emit('close');
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
      <div class="m-currency-edit-birthday-dialog">
        <el-form
          ref="elFormRef"
          size="mini"
          label-width="68px"
          attrs={{ model: this.formData }}
          class="m-currency-edit-birthday-dialog-content"
        >
          <el-form-item
            prop="birthday"
            label="编辑生日："
            rules={{ required: true, message: '请选择生日', trigger: 'change' }}
          >
            <el-date-picker
              style="width: 100%"
              editable={false}
              type="date"
              placeholder="选择生日"
              format="MM.dd"
              value-format="yyyy-MM-dd"
              popper-class="date-picker-202211041041"
              v-model={this.formData.birthday}
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
