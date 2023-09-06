/*
 * @Author       : yunie
 * @Date         : 2022-07-15 11:37:41
 * @LastEditTime : 2022-07-23 11:18:37
 * @FilePath     : \src\modules\datacenter\shoplive\components\sessions\index.tsx
 * @Description  :
 */
import { ref, defineComponent, h, Ref, inject, watch, SetupContext } from '@vue/composition-api';
import { GetLiveRoomInfo } from '@/services/datacenter/shoplive';
import { live_room_info } from '@/modules/datacenter/shoplive/tabs/projectDetail/use/useData';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
//秒转时分秒
const formatSeconds = (value: number) => {
  const second = value % 60;
  let minute = Math.floor(value / 60);
  const hour = Math.floor(minute / 60);
  minute = minute % 60;
  return `${hour}时${minute}分${second}秒`;
};
const prechargeColumn = (ctx: SetupContext, searchParams: any, project_name: string) => {
  return [
    {
      label: '开播时间',
      property: 'start_time',
      align: 'center',
      width: 160,
      className: 'project-income-head',
    },
    {
      label: '下播时间',
      property: 'end_time',
      align: 'center',
      width: 150,
    },
    {
      label: '直播时长',
      property: 'live_duration',
      align: 'center',
      width: 120,
      formatter: (row: any) => formatSeconds(row.live_duration) || '--',
    },
    {
      label: '带货商品数',
      property: 'product_nums',
      align: 'right',
      width: 90,
      formatter: (row: any) => row.product_nums || '--',
    },
    {
      label: '成交订单数',
      property: 'pay_order_cnt',
      align: 'right',
      width: 90,
      formatter: (row: any) => row.pay_order_cnt || '--',
    },
    {
      label: '成交金额 (元)',
      property: 'gmv',
      align: 'right',
      width: 120,
    },
    {
      label: '成交件数',
      property: 'pay_cnt',
      align: 'right',
      width: 120,
      className: 'project-income-head',
    },
    {
      label: '新增粉丝数',
      align: 'right',
      property: 'incr_fans_cnt',
      width: 120,
    },
    {
      label: '直播间曝光人数',
      property: 'exposure_ucnt',
      align: 'right',
      width: 120,
    },
    {
      label: '成交人数',
      property: 'pay_ucnt',
      align: 'right',
      width: 100,
    },
    {
      label: '操作',
      width: 78,
      align: 'center',
      formatter: (row: any) => {
        return h(
          'a',
          {
            on: {
              click: () => {
                let routeUrl = ctx.root.$router.resolve({
                  name: RouterDataCenter.performanceDetail,
                  params: {
                    id: row.shop_live_id,
                  },
                  query: {
                    project_id: searchParams.project_id,
                    project_name: project_name,
                  },
                });
                if (searchParams.is_from_project) {
                  routeUrl = ctx.root.$router.resolve({
                    name: RouterDataCenter.performanceDetail,
                    params: {
                      id: row.shop_live_id,
                    },
                    query: {
                      project_id: searchParams.project_id,
                      project_name: project_name,
                      from_project: '1',
                    },
                  });
                }
                //       根据name获取path
                window.open(routeUrl.href, '_blank');
              },
            },
          },
          ['查看'],
        );
      },
    },
  ];
};

export default defineComponent({
  components: {},
  setup(props, ctx) {
    const router = useRouter();
    let project_name = String(router.currentRoute.query.project_name || '');
    const loading = ref(false);
    const searchParams = inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>;
    const tableData = ref<live_room_info[]>([]);
    const paginationData = ref<any>({
      total: 0,
      page_num: 1,
    });
    const handleCurrentChange = (page_num: number) => {
      paginationData.value.page_num = page_num;
      getList();
    };
    const handlePageSizeChange = (num: number) => {
      paginationData.value.num = num;
      getList();
    };
    const { business_type } = useProjectBaseInfo();
    const getList = () => {
      loading.value = true;
      GetLiveRoomInfo(
        {
          is_from_project: searchParams.value.is_from_project,
          start_date: searchParams.value.start_date,
          end_date: searchParams.value.end_date,
          project_id: searchParams.value.project_id,
          page_num: paginationData.value.page_num,
          num: 20,
        },
        business_type.value,
      ).then(({ data }) => {
        loading.value = false;
        if (data.success) {
          tableData.value = data?.data?.data;
          paginationData.value.total = data?.data?.total;
        }
      });
    };
    getList();
    if (!project_name) {
      const name = inject<Ref>('searchProjectName') || ref('');
      const project = inject<Ref<any>>('project') || ref({ project_name: '' });
      project_name = name.value || (project.value ? project.value.project_name : '');
    }
    const prechargeColumnList = ref(prechargeColumn(ctx, searchParams.value, project_name));
    watch(
      () => searchParams.value,
      async data => {
        if (data === undefined) return;
        if (!project_name) {
          const name = inject<Ref>('searchProjectName') || ref('');
          const project = inject<Ref<any>>('project') || ref({ project_name: '' });
          project_name = name.value || (project.value ? project.value.project_name : '');
        }
        prechargeColumnList.value = prechargeColumn(ctx, searchParams.value, project_name);
        await getList();
      },
      { deep: true },
    );
    // dialogProject.show();
    return {
      loading,
      prechargeColumnList,
      tableData,
      paginationData,
      handleCurrentChange,
      handlePageSizeChange,
    };
  },
  render() {
    return (
      <div>
        <tg-table
          stripe
          tooltip-effect="light"
          // height={this.tableData.length > 0 ? 'calc(100vh - 255px)' : 'calc(100vh - 205px)'}
          v-loading={this.loading}
          border
          class="precharge-table"
          data={this.tableData}
        >
          <template slot="empty">
            <empty-common
              style="margin-top:20px"
              imgHeight="100"
              imgWidth="200"
              detail-text="暂无数据"
            ></empty-common>
          </template>
          {this.prechargeColumnList.map((v: any) => (
            <el-table-column
              show-overflow-tooltip
              class-name={v.className}
              label={v.label}
              prop={v.property}
              align={v.align}
              headerAlign={v.headerAlign}
              minWidth={v.width}
              formatter={v.formatter}
            />
          ))}
        </tg-table>
        {this.tableData.length > 0 && (
          <div class="pagination">
            <el-pagination
              class="flex-none"
              current-page={this.paginationData.page_num}
              // page-sizes={[10, 20, 50, 100]}
              page-size={20}
              total={this.paginationData.total}
              layout="total, prev, pager, next, jumper"
              on-current-change={this.handleCurrentChange}
              // on-size-change={this.handlePageSizeChange}
            />
          </div>
        )}
      </div>
    );
  },
});
