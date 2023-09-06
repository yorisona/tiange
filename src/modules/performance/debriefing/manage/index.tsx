import { defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { useDeriefingManageColumns } from '@/modules/performance/debriefing/use';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { useRouter } from '@/use/vue-router';
import { RouterNamePerformance } from '@/const/router';
import addDebriefingResult from '@/modules/performance/debriefing/dialog/addDebriefingResult/index.vue';
import { useDialog } from '@/use/dialog';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { Message } from 'element-ui';
import { delete_report_management, query_report_management } from '@/services/performance';
import { usePermission } from '@/use/permission';
export default defineComponent({
  setup: (props, ctx) => {
    const permission = usePermission();
    const router = useRouter();
    const addDebriefingResultDialog = useDialog({
      title: '述职结果新增',
      width: 400,
      component: addDebriefingResult,
      okText: '确定',
      on: {
        submit() {
          methods.reload();
        },
      },
    });
    const columns = ref([
      ...useDeriefingManageColumns(),
      {
        label: '操作',
        align: 'center',
        width: 100,
        formatter: (row: any) => {
          // console.log('row', row);
          return (
            <div>
              {permission.debriefing_manage_view && (
                <tg-button type="link" onClick={() => methods.onViewHandler(row)}>
                  查看
                </tg-button>
              )}
              {permission.debriefing_manage_edit && (
                <tg-button
                  class="mgl-6"
                  type="link"
                  onClick={async () => {
                    const result = await AsyncConfirm(ctx, {
                      title: '确认删除这条述职记录吗？',
                    });
                    if (!result) return;
                    const res = await reqDelete.runAsync({
                      id: row.id,
                    });
                    if (res.data.success) {
                      methods.reload();
                      Message.success(res.data.message || '删除成功');
                    } else {
                      Message.error(res.data.message || '删除失败');
                    }
                  }}
                >
                  删除
                </tg-button>
              )}
            </div>
          );
        },
      },
    ]);
    const reqList = usePagination(query_report_management);
    const reqDelete = useRequest(delete_report_management, { manual: true });
    const formData = ref<any>({});
    const config = {
      reset() {
        formData.value = {};
      },
    };
    const methods = {
      onViewHandler(row: any) {
        const result = router.resolve({
          name: RouterNamePerformance.debriefing.list,
          params: {
            id: row.id,
          },
        });
        window.open(result.href, '_blank');
      },
      reload() {
        reqList.runAsync(
          {
            page_num: 1,
            num: reqList.pagination.num,
          },
          {
            ...formData.value,
          },
        );
      },
    };
    return {
      columns,
      reqList,
      reqDelete,
      formData,
      config,
      addDebriefingResultDialog,
      permission,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-debriefing-manage-page-container tg-page-container">
        <ListGenerallyTemplate
          columns={this.columns}
          service={this.reqList}
          value={this.formData}
          config={this.config}
        >
          <el-form-item label="述职名称：">
            <el-input
              v-key-enter={this.reload}
              clearable
              placeholder="请输入述职名称"
              v-model={this.formData.name}
            />
          </el-form-item>
          {this.permission.debriefing_manage_edit && (
            <div slot="btnLine" class="btns-line">
              <tg-button
                icon="ico-btn-add"
                type="primary"
                size="small"
                onClick={() => this.addDebriefingResultDialog.show()}
              >
                新增
              </tg-button>
            </div>
          )}
        </ListGenerallyTemplate>
        <tg-mask-loading visible={this.reqDelete.loading} content="  正在删除，请稍候..." />
      </div>
    );
  },
});
