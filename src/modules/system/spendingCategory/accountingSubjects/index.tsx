import { defineComponent, ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { SpendingCategory } from '@/types/tiange/spendingCategory';
type Col = TableColumn<SpendingCategory>;
import { MaycurListExpenseCategories, MaycurSaveExpenseCategory } from '@/services/maycur';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import dialogSubjects from './dialog/index.vue';
import { useDialog } from '@/use/dialog';
import { Confirm } from '@/use/asyncConfirm';
export default defineComponent({
  setup: (props, ctx) => {
    const reqCategoriesData = usePagination(MaycurListExpenseCategories, {
      defaultPageSize: 10000,
    });
    const reqCategorySave = useRequest(MaycurSaveExpenseCategory, {
      manual: true,
      onSuccess: (_, res) => {
        ctx.root.$message.success((res as any).message);
      },
      onError: msg => {
        ctx.root.$message.success(msg);
      },
    });

    const dialog = useDialog({
      component: dialogSubjects,

      width: '370px',
      okText: '保存',
      on: {
        submit: reqCategoriesData.reload,
      },
    });
    const activeToggle = async (row: SpendingCategory) => {
      const params = {
        ...row,
        is_active: !row.is_active,
      };
      await Confirm(`确定要${row.is_active ? '停用' : '启用'}吗?`);
      console.log('para', params);
      reqCategorySave.runAsync(params).then(reqCategoriesData.reload);
    };

    const columns = ref<Col[]>([
      {
        label: '编码',
        prop: 'expense_category_code',
        minWidth: 80,
        align: 'center',
      },
      {
        label: '科目名称',
        prop: 'expense_category_name',
        minWidth: 100,
        align: 'left',
      },
      {
        label: '费用类别',
        prop: 'expense_types',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 250,
      },
      {
        label: '状态',
        prop: 'is_active',
        minWidth: 88,
        align: 'center',
        formatter: row => {
          return row.is_active ? '启用' : '停用';
        },
      },
      {
        label: '操作',
        minWidth: 118,
        align: 'center',
        prop: 'is_active',
        formatter: row => {
          return (
            <div class="status-box">
              <tg-button type="link" class="mgr-12" onClick={() => activeToggle(row)}>
                {row.is_active ? '停用' : '启用'}
              </tg-button>
              <tg-button
                type="link"
                onClick={() => {
                  dialog.update({ title: '编辑会计科目' }).show(row);
                }}
              >
                编辑
              </tg-button>
            </div>
          );
        },
      },
    ]);
    return {
      columns,
      reqCategoriesData,
      dialog,
    };
  },
  render() {
    return (
      <div class="spendingCategory">
        <div class="mgt-10 mgb-12">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            onClick={() => {
              this.dialog.update({ title: '新增会计科目' }).show();
            }}
          >
            新增科目
          </tg-button>
        </div>
        <div class="content flex-fill ">
          <tg-table
            stripe
            columns={this.columns}
            height={'100%'}
            v-loading={this.reqCategoriesData.loading}
            data={this.reqCategoriesData.data}
          />
        </div>
      </div>
    );
  },
});
