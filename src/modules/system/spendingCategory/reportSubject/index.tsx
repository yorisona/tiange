import { defineComponent, ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
type Col = TableColumn<any>;
import { delete_report_subject, query_report_subject } from '@/services/maycur';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import addReportSubject from '@/modules/system/spendingCategory/reportSubject/dialog/addReportSubject/index.vue';
import { useDialog } from '@/use/dialog';
import { AsyncConfirm } from '@/use/asyncConfirm';
export default defineComponent({
  setup: (props, ctx) => {
    const reqCategoriesData = usePagination(query_report_subject, {
      defaultPageSize: 10000,
    });
    const reqCategoryDelete = useRequest(delete_report_subject, {
      manual: true,
      onSuccess: (_, res) => {
        ctx.root.$message.success((res as any).message);
      },
      onError: msg => {
        ctx.root.$message.success(msg);
      },
    });

    const dialog = useDialog({
      component: addReportSubject,
      // title: '新增管报科目',
      width: '800px',
      okText: '保存',
      on: {
        submit: reqCategoriesData.reload,
      },
    });

    const columns = ref<Col[]>([
      {
        label: '管报科目代码',
        prop: 'id',
        minWidth: 100,
        align: 'center',
      },
      {
        label: '管报科目',
        prop: 'subject_name',
        minWidth: 100,
        align: 'left',
      },
      {
        label: '费用类别',
        prop: 'expense_type_biz_code_name',
        align: 'left',
        showOverflowTooltip: true,
        minWidth: 250,
      },
      {
        label: '操作',
        width: 120,
        align: 'center',
        prop: 'is_active',
        formatter: row => {
          return (
            <div class="status-box">
              <tg-button
                type="link"
                onClick={() => {
                  dialog.update({ title: '编辑管报科目' }).show(row);
                }}
              >
                编辑
              </tg-button>
              <tg-button
                type="link"
                class="mgl-12"
                onClick={async () => {
                  const result = await AsyncConfirm(ctx, '确认删除此条记录吗？');
                  if (result) {
                    const res = await reqCategoryDelete.runAsync({
                      subject_name: row.subject_name,
                    });
                    if (res.data.success) {
                      reqCategoriesData.reload();
                    }
                  }
                }}
              >
                删除
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
      reqCategoryDelete,
    };
  },
  render() {
    return (
      <div class="tg-gb-category-page-container">
        <div class="mgt-10 mgb-12">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            onClick={() => {
              this.dialog.update({ title: '新增管报科目' }).show();
            }}
          >
            新增
          </tg-button>
        </div>
        <div class="content flex-fill">
          <tg-table
            stripe
            columns={this.columns}
            height={'100%'}
            v-loading={this.reqCategoriesData.loading}
            data={this.reqCategoriesData.data}
          />
        </div>
        <tg-mask-loading visible={this.reqCategoryDelete.loading} content="正在删除，请稍候..." />
      </div>
    );
  },
});
