import { defineComponent, ref } from '@vue/composition-api';
import { ITemplateConfig, ListGenerallyTemplate } from '@gm/templates/list';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { useDialog, useDrawer } from '@/use/dialog';
import companyInformation from '@/modules/dataAnalysis/dialog/AddTraining/index.vue';
import { Confirm } from '@/use/asyncConfirm';
import { Delete_Goods_Train, Query_Goods_Train } from '@/services/datacenter';
import { FunctionSelect, EFunctionSelectType } from '@/gm/component/select/FunctionSelect';
import QRCodeBox from '@/modules/dataAnalysis/dialog/QRCodeBox/index.vue';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import { RouterDataCenter } from '@/const/router';
import { usePermission } from '@/use/permission';

type List = TG.HttpListResultType<typeof Query_Goods_Train>;
type FormData = TG.PaginationParams<typeof Query_Goods_Train> & { train_date: string[] };

export default defineComponent({
  setup: () => {
    const permission = usePermission();
    const columns: TgTableColumn<List>[] = [
      {
        label: '培训主题',
        minWidth: 219,
        prop: 'topic',
        'show-overflow-tooltip': true,
      },
      {
        label: '发起人',
        align: 'center',
        'show-overflow-tooltip': true,
        prop: 'sponsor_name',
        minWidth: 80,
      },
      {
        label: '培训人',
        align: 'left',
        minWidth: 131,
        prop: 'trainer_name',
        'show-overflow-tooltip': true,
        formatter: row => {
          return row.trainer_info
            ?.map(item => {
              return item.username;
            })
            ?.join('、');
        },
      },
      {
        label: '培训日期',
        align: 'center',
        minWidth: 120,
        prop: 'train_date',
        formatter: row => {
          const start = moment(row.train_start_time);
          const end = moment(row.train_end_time);
          if (start.isSame(end, 'day')) return start.format('YYYY.MM.DD');
          return `${start.format('YYYY.MM.DD')} ~ ${end.format('YYYY.MM.DD')}`;
        },
      },
      {
        label: '培训时间',
        align: 'center',
        minWidth: 120,
        formatter: row => {
          return `${moment(row.train_start_time).format('HH:mm')} - ${moment(
            row.train_end_time,
          ).format('HH:mm')}`;
        },
      },
      {
        label: '培训时长(h)',
        align: 'center',
        minWidth: 100,
        prop: 'train_duration',
      },
      {
        label: '培训地点',
        align: 'center',
        minWidth: 131,
        prop: 'train_addr',
        'show-overflow-tooltip': true,
      },
      {
        label: '签到',
        align: 'center',
        minWidth: 80,
        formatter: row => {
          return (
            <tg-button
              type="link"
              onClick={(e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                dialogQrcodeBox.update({ title: '培训签到二维码' }).show(1, row.id);
              }}
            >
              二维码
            </tg-button>
          );
        },
      },
      {
        label: '评价',
        align: 'center',
        minWidth: 80,
        formatter: row => {
          return (
            <tg-button
              type="link"
              onClick={(e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                dialogQrcodeBox.update({ title: '培训评价二维码' }).show(2, row.id);
              }}
            >
              二维码
            </tg-button>
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
                    dialogCompanyInformation.update({ title: '编辑培训' }).show(row);
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
                    await reqDelete.runAsync(row.id);
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
    const reqList = usePagination(Query_Goods_Train);
    const reqDelete = useRequest(Delete_Goods_Train, { manual: true });
    const initFormData = (): FormData => ({ train_date: [] } as any);
    const formData = ref<FormData>(initFormData());

    const router = useRouter();
    const dialogCompanyInformation = useDrawer({
      component: companyInformation,
      title: '新增培训',
      width: 500,
      props: {},
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const dialogQrcodeBox = useDialog({
      component: QRCodeBox,
      title: '培训签到二维码',
      width: 246,
      footer: false,
    });
    const config: ITemplateConfig = {
      reset() {
        formData.value = initFormData();
      },
      searchBefor() {
        const { train_date, ...other } = formData.value;
        const params = {
          ...other,
        };
        if (train_date) {
          if (train_date[0]) {
            params.train_start_date = moment(train_date[0]).format('YYYY-MM-DD');
          }
          if (train_date[1]) {
            params.train_end_date = moment(train_date[1]).format('YYYY-MM-DD');
          }
        }

        return params;
      },
      table: {
        border: true,
        rowClick(row) {
          router.push({
            name: RouterDataCenter.trainingManageDetail,
            query: {
              id: row.id,
            },
          });
        },
      },
    };

    return {
      columns,
      reqList,
      dialogCompanyInformation,
      formData,
      config,
      dialogQrcodeBox,
      permission,
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
        <el-form-item label="发起人：">
          <FunctionSelect
            clearable={true}
            modeType={EFunctionSelectType.FLOWER_NAME}
            placeholder="请输入发起人花名"
            v-model={formData.sponsor_id}
          />
        </el-form-item>
        <el-form-item label="培训人：">
          <FunctionSelect
            clearable={true}
            modeType={EFunctionSelectType.FLOWER_NAME}
            placeholder="请输入培训人花名"
            v-model={formData.trainer_id}
          />
        </el-form-item>
        <el-form-item label="培训日期：">
          <el-date-picker
            style="width:100%"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model={formData.train_date}
            format="yyyy.MM.dd"
          />
        </el-form-item>
        <el-form-item label="培训地点：">
          <el-input placeholder="请输入培训地点" v-model={formData.train_addr} />
        </el-form-item>
        {permission.trainingManage_edit && (
          <tg-button
            slot="btnLine"
            size="mini"
            type="primary"
            onClick={() => dialogCompanyInformation.update({ title: '新增培训' }).show()}
            rows="4"
            icon="ico-btn-add"
          >
            新增培训
          </tg-button>
        )}
      </ListGenerallyTemplate>
    );
  },
});
