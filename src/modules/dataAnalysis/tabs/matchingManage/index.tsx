import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { useDrawer } from '@/use/dialog';
import addMatching from '@/modules/dataAnalysis/dialog/addMatching/index.vue';
import { Confirm } from '@/use/asyncConfirm';
import {
  Delete_Goods_Collocation,
  GetQueryDouyinReportProjects,
  Query_Goods_Collocation,
} from '@/services/datacenter';
import { FunctionSelect, EFunctionSelectType } from '@/gm/component/select/FunctionSelect';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
// import moment from 'moment';
// import { useRouter } from '@/use/vue-router';
// import { RouterDataCenter } from '@/const/router';
import { usePermission } from '@/use/permission';
import moment from 'moment';
import { downloadFileFromLink } from '@/utils/func';
import { Message } from 'element-ui';
import { formatAmount } from '@/utils/string';
// import { ExportList } from '@/modules/datacenter/competitor/use';

type List = TG.HttpListResultType<typeof Query_Goods_Collocation>;
type FormData = TG.PaginationParams<typeof Query_Goods_Collocation> & { create_date?: string };

export default defineComponent({
  components: {
    Appendix,
  },
  setup: () => {
    const permission = usePermission();
    const isAddMatching = ref(true);
    const columns: TgTableColumn<List>[] = [
      {
        label: '搭配主题',
        minWidth: 219,
        prop: 'topic',
        'show-overflow-tooltip': true,
      },
      {
        label: '发起人',
        align: 'center',
        prop: 'sponsor_name',
        minWidth: 80,
      },
      {
        label: '所属项目',
        align: 'left',
        headerAlign: 'center',
        minWidth: 120,
        prop: 'project_name',
        'show-overflow-tooltip': true,
      },
      {
        label: '搭配数量',
        align: 'right',
        minWidth: 120,
        prop: 'quantity',
        'show-overflow-tooltip': true,
        // dataType: 'number',
        formatter: row => {
          return formatAmount(row.quantity || 0, 'None', true);
        },
      },
      {
        label: '上传日期',
        align: 'center',
        minWidth: 120,
        prop: 'gmt_create',
        dataType: 'date',
        // formatter: row => {
        //   return `${moment(row.train_start_time).format('HH:mm')} - ${moment(
        //     row.train_end_time,
        //   ).format('HH:mm')}`;
        // },
      },
      {
        label: '相关附件',
        align: 'center',
        minWidth: 100,
        prop: 'attachments',
        formatter: row => {
          if (!row.attachments?.length) {
            return '--';
          }
          return (
            <el-popover
              popper-class="matching-attachment-popover"
              trigger="hover"
              open-delay="300"
              width={240}
              placement="right-start"
            >
              <div>
                {/* <upload-file-list v-model={row.attachments} /> */}
                {/* {row.attachments.map((el, index) => (
                  // <div v-for="(column, index) in item.settlement_files" :key="column" class="file-item">
                  // <fileItem showPreview={false} key={index} filepath={el} readonly={true} />
                  // </div>
                ))} */}
                {/* <appendix style="width: 650px; float: left" list={row.attachments || []} /> */}
                <upload-file-list
                  class="matching-attachment-file-list"
                  v-model={row.attachments}
                  delete={false}
                  scopedSlots={{
                    append: (url: string) => {
                      return (
                        <div class="file-options" style="flex-shrink: 0; font-size: 12px;">
                          <tg-button
                            style="font-size: 12px"
                            type="link"
                            onClick={() => downloadFileFromLink(url)}
                          >
                            下载
                          </tg-button>
                        </div>
                      );
                    },
                  }}
                />
              </div>
              <tg-button slot="reference" type="link">
                查看
              </tg-button>
            </el-popover>
          );
        },
      },
      {
        label: '操作',
        align: 'center',
        minWidth: 90,
        formatter(row) {
          return (
            <div>
              {permission.trainingManage_edit && (
                <tg-button
                  size="mini"
                  type="link"
                  class="mgr-10"
                  onClick={(e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isAddMatching.value = false;
                    dialogCompanyInformation.update({ title: '编辑搭配' }).show(row);
                  }}
                >
                  编辑
                </tg-button>
              )}
              {permission.trainingManage_delete && (
                <tg-button
                  size="mini"
                  type="link"
                  onClick={async (e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await Confirm('确定删除吗?');
                    const res = await reqDelete.runAsync({ id: row.id });
                    res.data.success
                      ? Message.success(res.data.message)
                      : Message.error(res.data.message);
                    reqList.reload();
                  }}
                >
                  删除
                </tg-button>
              )}
            </div>
          );
        },
      },
    ];
    const reqList = usePagination(Query_Goods_Collocation);
    const reqDelete = useRequest(Delete_Goods_Collocation, { manual: true });
    const reqProject = useRequest(GetQueryDouyinReportProjects, { manual: true });
    const initFormData = (): FormData => ({ create_date: undefined, sponsor_id: undefined } as any);
    const formData = ref<FormData>(initFormData());

    // const router = useRouter();
    const dialogCompanyInformation = useDrawer({
      component: addMatching,
      title: '新增搭配',
      width: 600,
      props: {},
      okText: '保存',
      on: {
        submit() {
          if (isAddMatching.value) {
            reqList.pagination.onCurrentChange(1);
          } else {
            reqList.reload();
          }
        },
      },
    });
    const config = {
      reset() {
        formData.value = initFormData();
      },
      showExport: permission.trainingManage_export ? true : false,
      exportURL: '/api/goods_train/export_goods_collocation',
      searchBefor() {
        const { create_date, ...other } = formData.value;
        const params = {
          ...other,
        };
        if (create_date) {
          params.create_start_date = moment(create_date).startOf('month').format('YYYY-MM-DD');
          params.create_end_date = moment(create_date).endOf('month').format('YYYY-MM-DD');
        }

        return params;
      },
      table: {
        border: true,
        //   rowClick(row) {
        //     router.push({
        //       name: RouterDataCenter.trainingManageDetail,
        //       query: {
        //         id: row.id,
        //       },
        //     });
        //   },
      },
    };

    onMounted(() => {
      reqProject.runAsync({
        exclude_project_status: [5, 6],
      });
    });

    const pickerOptions = {
      disabledDate(time: Date) {
        const maxDate = moment();
        return moment(time).isAfter(maxDate);
      },
    };

    return {
      columns,
      reqList,
      reqProject,
      dialogCompanyInformation,
      formData,
      config,
      pickerOptions,
      permission,
      isAddMatching,
      initFormData,
    };
  },
  render() {
    const { columns, reqList, dialogCompanyInformation, formData, config, permission } = this;
    return (
      <ListGenerallyTemplate
        service={reqList}
        columns={columns}
        value={formData}
        config={config}
        class="page-container"
      >
        <el-form-item label="项目名称：">
          {/* <el-input placeholder="请输入项目" v-model={formData.project_id} /> */}
          <el-select
            clearable
            filterable
            placeholder="请输入并选择项目"
            v-model={formData.project_id}
          >
            {this.reqProject.data?.projects.map((el: any) => (
              <el-option
                label={el.project_name}
                value={el.project_id}
                key={el.project_id}
              ></el-option>
            ))}
          </el-select>
        </el-form-item>
        <el-form-item label="发起人：">
          <FunctionSelect
            clearable={true}
            modeType={EFunctionSelectType.FLOWER_NAME}
            placeholder="请输入并选择花名"
            v-model={formData.sponsor_id}
          />
        </el-form-item>
        {/* <el-form-item label="培训人：">
          <FunctionSelect
            clearable={true}
            modeType={EFunctionSelectType.FLOWER_NAME}
            placeholder="请输入培训人花名"
            v-model={formData.trainer_id}
          />
        </el-form-item> */}
        <el-form-item label="上传时间：">
          <el-date-picker
            style="width:100%"
            type="month"
            placeholder="请选择月份"
            format="yyyy.MM"
            value-format="yyyy-MM"
            v-model={formData.create_date}
            picker-options={this.pickerOptions}
          />
        </el-form-item>
        {/* <div slot="searchBtn">
          <tg-button
            class="el-btn-mini"
            type="primary"
            onClick={() => {
              this.reqList.pagination.reQuery(formData);
            }}
          >
            查询
          </tg-button>
          <tg-button
            class="mgl-8 el-btn-mini"
            onClick={() => {
              this.config.reset();
              this.reqList.pagination.reQuery(this.initFormData());
            }}
          >
            重置
          </tg-button>
          {permission.trainingManage_export && (
            <tg-button
              class="mgl-8 el-btn-mini"
              onClick={() => {
                ExportList(formData, '/api/goods_train/export_goods_collocation');
              }}
            >
              导出
            </tg-button>
          )}
        </div> */}
        {permission.trainingManage_edit && (
          <tg-button
            slot="btnLine"
            size="mini"
            type="primary"
            onClick={() => {
              this.isAddMatching = true;
              dialogCompanyInformation.update({ title: '新增搭配' }).show();
            }}
            rows="4"
            icon="ico-btn-add"
          >
            新增搭配
          </tg-button>
        )}
      </ListGenerallyTemplate>
    );
  },
});
