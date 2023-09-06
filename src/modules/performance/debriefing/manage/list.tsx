import { defineComponent, inject, onMounted, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import {
  useDebriefingDetailDialog,
  useDebriefingDetailRequest,
  useDeriefingManageListColumns,
  viewDebriefingDetailBtn,
} from '@/modules/performance/debriefing/use';
import { usePagination } from '@gm/hooks/ahooks';
import { query_report_management_details } from '@/services/performance';
import { useRouter } from '@/use/vue-router';
import { usePermission } from '@/use/permission';
import { Select } from '@gm/component';
import { GetAuthQueryUser } from '@/services/supplier';
import { BreadcrumbsRoutes } from '@/types/components/breadcrumbs';
import { RouterNamePerformance } from '@/const/router';
export default defineComponent({
  setup: (props, ctx) => {
    const routes: BreadcrumbsRoutes[] = [
      { title: '述职管理', name: RouterNamePerformance.debriefing.manage },
      { title: '述职清单' },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const router = useRouter();
    const permission = usePermission();
    const detailDialog = useDebriefingDetailDialog();
    const reqDetail = useDebriefingDetailRequest();
    const columns = ref([
      ...useDeriefingManageListColumns(),
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
    const reqList = usePagination(query_report_management_details, { manual: true });
    const id = router.currentRoute.params.id;
    const formData = ref<any>({ id });
    const userList = ref<any[]>([]);
    const config = {
      reset() {
        formData.value = { id };
      },
    };
    const methods = {
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
    return { columns, reqList, reqDetail, formData, config, userList, ...methods };
  },
  render() {
    return (
      <div class="tg-debriefing-manage-list-page-container tg-page-container">
        <ListGenerallyTemplate
          columns={this.columns}
          service={this.reqList}
          value={this.formData}
          config={this.config}
        >
          <el-form-item label="述职人：" label-width="48px">
            {/*<el-input*/}
            {/*  v-key-enter={this.reload}*/}
            {/*  clearable*/}
            {/*  placeholder="请输入述职人花名"*/}
            {/*  v-model={this.formData.user_name}*/}
            {/*/>*/}
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
          <el-form-item label="部门：" label-width="36px">
            <department-select
              selectMultiple
              placeholder="请选择部门"
              checkOnClickNode={true}
              // levelDisabled={(level: number) => level !== 2}
              // levelHidden={(level: number) => level > 2}
              clearable
              v-model={this.formData.department_ids}
            />
          </el-form-item>
        </ListGenerallyTemplate>
        <tg-mask-loading visible={this.reqDetail.loading} content="  正在获取详情，请稍候..." />
      </div>
    );
  },
});
