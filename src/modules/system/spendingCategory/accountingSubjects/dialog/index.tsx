import { defineComponent, ref } from '@vue/composition-api';
import { SpendingCategory } from '@/types/tiange/spendingCategory';
import { ElForm } from 'element-ui/types/form';
import { MaycurSaveExpenseCategory } from '@/services/maycur';
import { useRequest } from '@gm/hooks/ahooks';

export default defineComponent({
  setup: (props, ctx) => {
    const formRef = ref<ElForm | null>(null);
    const form = ref<{
      expense_category_code: string;
      expense_category_name: string;
      is_active: boolean;
    }>({} as any);

    const reqSaveCategory = useRequest(MaycurSaveExpenseCategory, {
      manual: true,
      onSuccess: (_, res) => {
        ctx.root.$message.success((res as any).message ?? '保存成功');
      },
      onError: msg => {
        ctx.root.$message.error(msg ?? '保存失败');
      },
    });

    const show = (row: SpendingCategory | undefined) => {
      if (row === undefined) form.value = { is_active: true } as any;
      else {
        form.value = {
          ...row,
        };
      }
    };

    const dialogSubmit = () => {
      formRef.value?.validate(async (valid: any) => {
        if (!valid) return;
        await reqSaveCategory.runAsync(form.value as any);
        ctx.emit('close');
        ctx.emit('submit');
      });
    };

    return {
      formRef,
      show,
      dialogSubmit,
      form,
    };
  },
  render() {
    const form = this.form;
    return (
      <div class="dialog-content">
        <el-form
          ref="formRef"
          attrs={{
            model: form,
          }}
          label-width="70px"
          size="mini"
          hide-required-asterisk={true}
        >
          <el-form-item
            label="科目编码："
            prop="expense_category_code"
            rules={{ required: true, message: '请输入科目编码', trigger: ['blur'] }}
          >
            <el-input
              v-model={form.expense_category_code}
              placeholder="请输入"
              maxlength={30}
              onInput={(value: string) => {
                form.expense_category_code = value.replace(/[^.\d]/g, '');
              }}
            />
          </el-form-item>
          <el-form-item
            label="科目名称："
            prop="expense_category_name"
            rules={{ required: true, message: '请输入科目名称', trigger: ['blur'] }}
          >
            <el-input
              v-model={form.expense_category_name}
              maxlength={15}
              placeholder="请输入 (限15字)"
            />
          </el-form-item>
          <el-form-item
            class="text-item"
            label="状态："
            prop="is_active"
            rules={{ required: true, message: '请选择状态', trigger: ['blur'] }}
          >
            <el-radio v-model={form.is_active} label={true}>
              启用
            </el-radio>
            <el-radio v-model={form.is_active} label={false}>
              停用
            </el-radio>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
