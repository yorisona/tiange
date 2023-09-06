import { defineComponent, ref } from '@vue/composition-api';
import { AccountingSubjects } from '@/types/tiange/spendingCategory';
import { ElForm } from 'element-ui/types/form';
import {
  MaycurSaveExpenseType,
  MaycurListExpenseCategories,
  query_report_subject,
} from '@/services/maycur';
import { useRequest, usePagination } from '@gm/hooks/ahooks';
import dialogSpendingCategory from '../../accountingSubjects/dialog/index.vue';
import { useDialog } from '@/use/dialog';
export default defineComponent({
  setup: (props, ctx) => {
    const formRef = ref<ElForm | null>(null);
    const form = ref<{
      expense_type_biz_code: string;
      expense_type_name: string;
      expense_category_code: string;
      is_active: boolean;
      is_allocated: boolean;
      subject_name: string;
    }>({ is_active: true, is_allocated: false } as any);

    const reqSaveCategory = useRequest(MaycurSaveExpenseType, {
      manual: true,
      onSuccess: (_, res) => {
        ctx.root.$message.success((res as any).message ?? '保存成功');
      },
      onError: message => {
        ctx.root.$message.error(message ?? '保存失败');
      },
    });
    const reqListCategories = usePagination(MaycurListExpenseCategories, {
      defaultPageSize: 10000,
      manual: true,
    });
    const reqListReportSubject = usePagination(query_report_subject, {
      defaultPageSize: 10000,
    });
    const dialog = useDialog({
      component: dialogSpendingCategory,

      width: '370px',
      title: '新增会计科目',
      on: {
        submit: reqListCategories.reload,
      },
    });
    const show = (row: AccountingSubjects | undefined) => {
      reqListCategories.reload();
      if (row === undefined)
        form.value = {
          is_active: true,
          is_allocated: false,
        } as any;
      else {
        const { is_allocated, ...rest } = row;
        form.value = {
          is_allocated: is_allocated ? true : false,
          ...rest,
        };
      }
    };

    const dialogSubmit = () => {
      formRef.value?.validate(async (valid: any) => {
        if (!valid) return;
        console.log('form.value', form.value);
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
      reqListCategories,
      reqListReportSubject,
      dialog,
    };
  },
  render() {
    const form = this.form;
    return (
      <div class="dialog-content mg-12" style="margin-right:0">
        <el-form
          ref="formRef"
          attrs={{
            model: form,
          }}
          label-width="80px"
          size="mini"
          hide-required-asterisk={true}
        >
          <el-form-item
            label="类别编码："
            prop="expense_type_biz_code"
            rules={{ required: true, message: '请输入费用类别', trigger: ['blur'] }}
          >
            <el-input
              v-model={form.expense_type_biz_code}
              onInput={(value: string) => {
                form.expense_type_biz_code = value.replace(/[^.\d]/g, '');
              }}
              placeholder="请输入"
              style="width:216px"
            />
          </el-form-item>
          <el-form-item
            label="类别名称："
            prop="expense_type_name"
            rules={{ required: true, message: '请输入类别名称', trigger: ['blur'] }}
          >
            <el-input
              v-model={form.expense_type_name}
              maxlength={15}
              placeholder="请输入 (限15字)"
              style="width:216px"
            />
          </el-form-item>
          <el-form-item
            label="会计科目："
            prop="expense_category_code"
            rules={{ required: true, message: '请选择会计科目', trigger: ['blur'] }}
          >
            <div class="expense_category_code">
              <el-select
                popper-class="el-select-popper-mini"
                class="mgr-12"
                style="width:216px"
                v-model={form.expense_category_code}
                filterable
              >
                {this.reqListCategories.data
                  ?.filter(item => item.is_active)
                  .map((item, key) => {
                    return (
                      <el-option
                        key={key}
                        value={item.expense_category_code}
                        label={item.expense_category_name}
                      />
                    );
                  })}
              </el-select>
              <tg-button
                style="padding:0 !important"
                type="link"
                onClick={() => this.dialog.show()}
              >
                新增
              </tg-button>
            </div>
          </el-form-item>
          <el-form-item
            label="管报科目："
            prop="expense_category_code"
            rules={{ required: true, message: '请选择管报科目', trigger: ['blur'] }}
          >
            <div class="expense_category_code">
              <el-select
                popper-class="el-select-popper-mini"
                class="mgr-12"
                style="width:216px"
                v-model={form.subject_name}
                filterable
              >
                {this.reqListReportSubject.data?.map(item => {
                  return (
                    <el-option
                      key={item.subject_name}
                      value={item.subject_name}
                      label={item.subject_name}
                    />
                  );
                })}
              </el-select>
              {/*<tg-button*/}
              {/*  style="padding:0 !important"*/}
              {/*  type="link"*/}
              {/*  onClick={() => this.dialog.show()}*/}
              {/*>*/}
              {/*  新增*/}
              {/*</tg-button>*/}
            </div>
          </el-form-item>
          <el-form-item
            class="text-item"
            label="是否分摊："
            prop="is_allocated"
            rules={{ required: true, message: '请选择是否分摊费用', trigger: ['blur'] }}
          >
            <el-radio v-model={form.is_allocated} label={false}>
              否
            </el-radio>
            <el-radio v-model={form.is_allocated} label={true}>
              是
            </el-radio>
          </el-form-item>
          <el-form-item
            class="text-item"
            label="状态："
            prop="is_active"
            style="margin-top: -5px"
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
