import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import {
  useDebriefingDetailDialog,
  useDebriefingDetailRequest,
  useDeriefingMineColumns,
  viewDebriefingDetailBtn,
} from '@/modules/performance/debriefing/use';
import { usePagination } from '@gm/hooks/ahooks';
import { query_report_details } from '@/services/performance';
// import { usePermission } from '@/use/permission';
export default defineComponent({
  setup: (props, ctx) => {
    // const permission = usePermission();
    const detailDialog = useDebriefingDetailDialog();
    const columns = ref([
      ...useDeriefingMineColumns(),
      {
        label: '操作',
        align: 'center',
        width: 80,
        formatter: (row: any) => {
          return <div>{viewDebriefingDetailBtn(row, detailDialog, reqDetail)}</div>;
        },
      },
    ]);
    const reqList = usePagination(query_report_details, { manual: true });
    const reqDetail = useDebriefingDetailRequest();
    const formData = ref<any>({
      is_sub: false,
    });
    const config = {
      reset() {
        formData.value = { is_sub: false };
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
    };
    onMounted(() => {
      methods.reload();
    });
    return { columns, reqList, reqDetail, formData, config, ...methods };
  },
  render() {
    return (
      <div class="tg-debriefing-mine-page-container tg-page-container">
        <ListGenerallyTemplate
          columns={this.columns}
          service={this.reqList}
          value={this.formData}
          config={this.config}
        ></ListGenerallyTemplate>
        <tg-mask-loading visible={this.reqDetail.loading} content="  正在获取详情，请稍候..." />
      </div>
    );
  },
});
