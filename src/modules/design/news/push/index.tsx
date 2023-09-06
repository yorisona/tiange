import { defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate, ITemplateConfig } from '@gm/templates/list';
import { Select } from '@gm//component';
import { TgTableColumn } from '@/types/vendor/column';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Delete_Daily_News, Query_Daily_Infos_News } from '@/services/daily_infos';
import Push from '../dialog/push/index.vue';
import AutoPush from '../dialog/autopush/index.vue';
import viewInfo from '../dialog/viewInfo/index.vue';
import { useDialog } from '@/use/dialog';
import { Confirm } from '@/use/asyncConfirm';
import { Message } from 'element-ui';
import { usePermission } from '@/use/permission';
import moment from 'moment';

type ListData = TgTableColumn<TG.HttpListResultType<typeof Query_Daily_Infos_News>>;
type FormData = TG.PaginationParams<typeof Query_Daily_Infos_News>;
export default defineComponent({
  setup: () => {
    const columns = ref<ListData[]>([
      { label: '资讯时间', prop: 'news_time', minWidth: 140, dataType: 'datetime' },
      { label: '资讯来源', prop: 'source', minWidth: 80 },
      { label: '标题', prop: 'title', minWidth: 180, 'show-overflow-tooltip': true },
      {
        label: '数据抓取时间',
        prop: 'grab_time',
        minWidth: 140,
        align: 'center',
        dataType: 'datetime',
      },
      {
        label: '操作',
        minWidth: 100,
        formatter: row => {
          return (
            <div>
              <tg-button type="link" class="mgr-10" onClick={() => DialogViewInfo.show(row)}>
                查看
              </tg-button>
              {permission.dailyInformation_delete && (
                <tg-button type="link" onClick={() => onDelete(row.id)}>
                  删除
                </tg-button>
              )}
            </div>
          );
        },
      },
    ]);
    const permission = usePermission();
    const initFormData = () => {
      return {
        news_time: '',
      } as any;
    };
    const formData = ref<FormData>(initFormData());
    const config: ITemplateConfig = {
      searchBefor() {
        const params = { ...formData.value };
        if (params.news_time) params.news_time = moment(params.news_time).format('YYYY-MM-DD');
        if (params.grab_time) params.grab_time = moment(params.grab_time).format('YYYY-MM-DD');
        return params;
      },
      reset() {
        formData.value = initFormData();
      },
    };
    const reqList = usePagination(Query_Daily_Infos_News);
    const reqDelete = useRequest(Delete_Daily_News, { manual: true });
    const DialogPush = useDialog({
      component: Push,
      title: '推送',
      width: 600,
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const DialogAutoPush = useDialog({
      component: AutoPush,
      title: '设置',
      width: 600,
      on: {
        submit() {
          reqList.reload();
        },
      },
    });
    const DialogViewInfo = useDialog({
      component: viewInfo,
      title: '查看资讯',
      width: 720,
      footer: false,
    });
    const onDelete = async (id: number) => {
      await Confirm('确定删除资讯吗?');
      reqDelete.runAsync([id]).then(() => {
        Message.success('删除成功');
        reqList.reload();
      });
    };

    return {
      columns,
      config,
      formData,
      reqList,
      DialogPush,
      DialogAutoPush,
      permission,
    };
  },
  render() {
    const { config, columns, reqList, formData, DialogPush, DialogAutoPush, permission } = this;
    return (
      <ListGenerallyTemplate columns={columns} config={config} service={reqList} value={formData}>
        <el-form-item label="资讯时间：">
          <el-date-picker v-model={formData.news_time} placeholder="请选择资讯时间" />
        </el-form-item>
        <el-form-item label="抓取时间：">
          <el-date-picker v-model={formData.grab_time} placeholder="请选择抓取时间" />
        </el-form-item>
        <el-form-item label="资讯标题：">
          <el-input placeholder="请填写资讯标题" v-model={formData.title} />
        </el-form-item>
        <el-form-item label="资讯来源：">
          <Select
            placeholder="请选择资讯来源"
            options={E.infos.InfoSourceOption}
            v-model={formData.source}
          />
        </el-form-item>
        {(permission.dailyInformation_push_msg || permission.dailyInformation_edit_set) && (
          <div slot="btnLine">
            {permission.dailyInformation_push_msg && (
              <tg-button size="mini" type="primary" class="mgr-8" onClick={DialogPush.show}>
                推送
              </tg-button>
            )}
            {permission.dailyInformation_edit_set && (
              <tg-button size="mini" onClick={DialogAutoPush.show}>
                设置
              </tg-button>
            )}
          </div>
        )}
      </ListGenerallyTemplate>
    );
  },
});
