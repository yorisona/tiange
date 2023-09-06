import { defineComponent, inject, ref } from '@vue/composition-api';
import { useRequest } from '@gm/hooks/ahooks';
import { Get_Goods_Train } from '@/services/datacenter';
import { useRouter } from '@/use/vue-router';
import { RouterDataCenter } from '@/const/router';
import { downloadFileFromLink, hasPreviewFile, previewFile } from '@/utils/func';
import { TgTableColumn } from '@/types/vendor/column';
import { ExportList } from '@/modules/datacenter/competitor/use';
import { usePermission } from '@/use/permission';
import moment from 'moment';
type TableColumn = TG.ArraySource<
  TG.ReadProperty<TG.HttpResultType<typeof Get_Goods_Train>, 'evaluation_info'>
>;
export default defineComponent({
  setup: () => {
    const permission = usePermission();
    const columns = ref<TgTableColumn<TableColumn>[]>([
      { label: '序号', type: 'index', width: 60, align: 'center' },
      { label: '花名', prop: 'user_name', minWidth: 80, align: 'center' },
      { label: '所属部门', prop: 'department', minWidth: 200, align: 'left' },
      {
        label: '提交时间',
        prop: 'gmt_create',
        dataType: 'datetime',
        minWidth: 160,
        align: 'center',
      },
      { label: '培训评分', prop: 'train_score', minWidth: 80, align: 'center' },
      {
        label: '培训等级',
        prop: 'train_grade_desc',
        minWidth: 80,
        align: 'center',
        formatter: row => {
          return `${row.train_grade} (${row.train_grade_desc})`;
        },
      },
    ]);
    const router = useRouter();
    const reqDetail = useRequest(Get_Goods_Train, {
      defaultParams: [router.currentRoute.query.id as any],
    });
    const routes = [
      {
        name: RouterDataCenter.trainingManage,
        title: '培训管理',
      },
      {
        title: '培训详情',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const exportReviews = () => {
      ExportList(
        { goods_train_id: reqDetail.params[0] },
        '/api/goods_train/export_goods_train_evaluation',
      );
    };
    return {
      reqDetail,
      columns,
      exportReviews,
      permission,
    };
  },
  render() {
    const { reqDetail, columns, exportReviews, permission } = this;
    const data = reqDetail.data;

    if (!data) return <div class="detail-container" loading={true} />;
    return (
      <div class="detail-container">
        <div class="detail-body">
          <div class="title-area">培训信息</div>
          <div class="topic">
            <span class="label">培训主题：</span>
            <span>{data.topic}</span>
            <span>发起人：</span>
            <span>{data.sponsor_name}</span>
            <span>培训人 ：</span>
            <span>{data.trainer_info?.map(it => it.username).join('、')}</span>
          </div>
          <div class="topic mgt-16">
            <span class="label">培训时间：</span>
            <span>
              {moment(data.train_start_time).format('YYYY.MM.DD')}
              &nbsp;
              {moment(data.train_start_time).format('HH:mm')} -
              {moment(data.train_end_time).format('HH:mm')}
            </span>
            <span>培训地点：</span>
            <span>{data.train_addr}</span>
          </div>
          <div class="info-item mgt-16">
            <span class="label">签到人员 ({data.sign_in_info.length})：</span>
            <span>
              {data.sign_in_info.map(it => it.username).join('、')}
              {data.sign_in_info.length === 0 && '--'}
            </span>
          </div>
          <div class="info-item mgt-16">
            <span class="label">签退人员 ({data.sign_out_info.length})：</span>
            <span>
              {data.sign_out_info.map(it => it.username).join('、')}{' '}
              {data.sign_out_info.length === 0 && '--'}
            </span>
          </div>
          <div class="info-item  mgt-16 courseware-list">
            <span class="label" style="line-height:22px">
              相关课件：
            </span>
            <div class="list-box" style="line-height">
              {data.train_courseware?.length === 0 && '--'}
              <upload-file-list
                v-model={data.train_courseware}
                delete={false}
                scopedSlots={{
                  append: (url: string) => {
                    return (
                      <div class="file-options">
                        {hasPreviewFile(url) && (
                          <tg-button type="link" onClick={() => previewFile(url)}>
                            预览
                          </tg-button>
                        )}
                        <tg-button type="link" onClick={() => downloadFileFromLink(url)}>
                          下载
                        </tg-button>
                      </div>
                    );
                  },
                }}
              />
            </div>
          </div>
          <div class="title-area mgt-25">
            <span>培训评价</span>
            <span class="fill" />
            {permission.trainingManage_export && data.evaluation_info?.length > 0 && (
              <tg-button icon="ico-btn-export" size="mini" onClick={exportReviews}>
                导出
              </tg-button>
            )}
          </div>
          <div class="table-box mgt-16">
            <tg-table
              height={'100%'}
              columns={columns}
              data={data.evaluation_info}
              v-loading={reqDetail.loading}
              border={true}
            >
              <empty-common slot="empty" />
            </tg-table>
          </div>
        </div>
      </div>
    );
  },
});
