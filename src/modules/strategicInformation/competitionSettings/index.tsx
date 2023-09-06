import { defineComponent, inject, ref } from '@vue/composition-api';
import { ITemplateConfig, ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { useDialog } from '@/use/dialog';
import companyInformation from '@/modules/strategicInformation/dialog/companyInformation/form.vue';
import { Delete_Opponent_Company, Query_Opponent_Company } from '@/services/strategicInformation';
import { Confirm } from '@/use/asyncConfirm';
import { get_folded_text } from '@/utils/string';
import { RouterNameStrategicInformation } from '@/const/router';
type List = TG.HttpListResultType<typeof Query_Opponent_Company>;
type FormData = TG.PaginationParams<typeof Query_Opponent_Company>;
export default defineComponent({
  setup: () => {
    const routes = [
      {
        title: '竞对数据',
        name: RouterNameStrategicInformation.competitionData,
      },
      {
        title: '竞对设置',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const columns: TgTableColumn<List>[] = [
      {
        label: '公司',
        minWidth: 119,
        prop: 'name',
        'show-overflow-tooltip': true,
      },
      {
        label: '简介',
        align: 'left',
        // 'show-overflow-tooltip': true,
        prop: 'introduction',
        minWidth: 131,
        formatter(row: any) {
          return (
            <el-tooltip
              // enterable={false}
              disabled={row.introduction.length > 16 ? false : true}
              popper-class="introduction-tip"
              effect="dark"
              content={row.introduction}
              // placement="top"
            >
              <span>
                {row.introduction.length > 16
                  ? get_folded_text(row.introduction, 16)
                  : row.introduction}
              </span>
            </el-tooltip>
          );
        },
      },
      {
        label: '人员',
        align: 'left',
        minWidth: 131,
        prop: 'team_info',
        'show-overflow-tooltip': true,
      },
      {
        label: '合作品牌数',
        align: 'center',
        minWidth: 100,
        prop: 'cooperative_brand_infos',
        formatter(row) {
          return row.cooperative_brand_infos.length;
        },
      },
      {
        label: '操作',
        align: 'left',
        minWidth: 100,
        formatter(row) {
          return (
            <div>
              <tg-button
                size="mini"
                type="link"
                class="mgr-10"
                onClick={() => dialogCompanyInformation.show(row)}
              >
                编辑
              </tg-button>
              <tg-button
                size="mini"
                type="link"
                onClick={async () => {
                  await Confirm('确定删除吗?');
                  await reqDelete.runAsync(row.id);
                  reqList.reload();
                }}
              >
                删除
              </tg-button>
            </div>
          );
        },
      },
    ];
    const reqList = usePagination(Query_Opponent_Company);
    const reqDelete = useRequest(Delete_Opponent_Company, { manual: true });
    const formData = ref<FormData>({ name: '' });

    const dialogCompanyInformation = useDialog({
      component: companyInformation,
      title: '公司信息',
      width: '800px',
      props: {},
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const config: ITemplateConfig = {
      reset() {
        formData.value = { name: '' };
      },
    };
    return {
      columns,
      reqList,
      dialogCompanyInformation,
      formData,
      config,
    };
  },
  render() {
    const { columns, reqList, dialogCompanyInformation, formData, config } = this;
    return (
      <ListGenerallyTemplate service={reqList} columns={columns} value={formData} config={config}>
        <el-form-item label="公司名称：">
          <el-input placeholder="请输入公司名称" v-model={formData.name} />
        </el-form-item>
        <tg-button
          slot="btnLine"
          size="mini"
          onClick={() => dialogCompanyInformation.show()}
          rows="4"
        >
          新增公司
        </tg-button>
      </ListGenerallyTemplate>
    );
  },
});
