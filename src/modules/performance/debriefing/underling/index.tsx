import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import {
  useDebriefingDetailDialog,
  useDebriefingDetailRequest,
  useDeriefingUnderlingColumns,
  viewDebriefingDetailBtn,
} from '@/modules/performance/debriefing/use';
import { usePagination } from '@gm/hooks/ahooks';
import { query_report_details } from '@/services/performance';
import { usePermission } from '@/use/permission';
import { Select } from '@gm/component';
import { GetAuthQueryUser } from '@/services/supplier';
export default defineComponent({
  setup: (props, ctx) => {
    const permission = usePermission();
    const detailDialog = useDebriefingDetailDialog();
    const columns = ref([
      ...useDeriefingUnderlingColumns(),
      {
        label: '操作',
        align: 'center',
        width: 80,
        formatter: (row: any) => {
          return (
            permission.debriefing_manage_view && (
              <div>{viewDebriefingDetailBtn(row, detailDialog, reqDetail)}</div>
            )
          );
        },
      },
    ]);
    const reqList = usePagination(query_report_details, { manual: true });
    const reqDetail = useDebriefingDetailRequest();
    const formData = ref<any>({ is_sub: true });
    const userList = ref<any[]>([]);
    const config = {
      reset() {
        formData.value = { is_sub: true };
      },
    };
    const methods = {
      reload() {
        reqList.runAsync(
          {
            num: reqList.pagination.num,
            page_num: 1,
          },
          {
            ...formData.value,
          },
        );
      },
      async queryUserList(keyword: string | undefined) {
        const res = await GetAuthQueryUser({
          search_type: 2,
          search_value: keyword,
          page_num: 1,
          num: 1000,
        });
        if (res?.data) {
          userList.value =
            (res?.data as any)?.map((el: any) => {
              return {
                label: el.username,
                value: el.id,
              };
            }) || [];
        }
      },
    };
    onMounted(() => {
      methods.reload();
    });
    return { columns, reqList, formData, config, reqDetail, userList, ...methods };
  },
  render() {
    return (
      <div class="tg-debriefing-underling-page-container tg-page-container">
        <ListGenerallyTemplate
          columns={this.columns}
          service={this.reqList}
          value={this.formData}
          config={this.config}
        >
          <el-form-item label="述职人：" label-width="48px">
            <Select
              options={this.userList}
              v-model={this.formData.user_id}
              filterable
              remote
              remote-method={this.queryUserList}
              placeholder="请输入并选择述职人"
              // remote-method={(name: string) => this.groupOptions.pagination.reQuery({ name })}
            />
          </el-form-item>
        </ListGenerallyTemplate>
        <tg-mask-loading visible={this.reqDetail.loading} content="  正在获取详情，请稍候..." />
      </div>
    );
  },
});
