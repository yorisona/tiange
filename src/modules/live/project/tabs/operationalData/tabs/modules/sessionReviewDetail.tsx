import { ref, defineComponent, h, inject, reactive } from '@vue/composition-api';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { RouterNameProjectManage } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import { numberFormat } from '@/utils/formatMoney';
import { TgTableColumn } from '@/types/vendor/column';
import { columnTemplate } from '../use';
import performance from '@/modules/datacenter/shoplive/components/performance/index.vue';
import capsuleGroup from '@/components/Button/capsuleGroup';
import sunburst from '@/modules/datacenter/shoplive/components/dailyDetailSunburst/index.vue';
import flow from './flow.vue';
import dailyDetailFunnel from '@/modules/datacenter/shoplive/components/dailyDetailFunnel/funnel.vue';
import { QueryProjectTradeFunnel } from '@/services/datacenter';
import { wait } from '@/utils/func';
import performancePutIndex from '@/modules/datacenter/shoplive/components/performance/put/index.vue';
import shopDetail from './shopDetail.vue';
import { useRequest } from '@gm/hooks/ahooks';
import { get_merge_shop_live_detail, save_review_record_detail } from '@/services/live';
import fanDeal from './fanDeal.vue';
import moment from 'moment';

const fields = [
  { label: '目标', prop: 'goal_gmv', type: 'money' },
  { label: 'GMV', prop: 'gmv', type: 'money' },
  { label: 'PV', prop: 'pv', type: 'num' },
  { label: 'UV', prop: 'uv', type: 'num' },
  { label: '总GPM', prop: 'gpm', type: 'money' },
  { label: '件单价', prop: 'pieces_sale_price', type: 'money' },
  { label: '客单价', prop: 'customer_sale_price', type: 'money' },
  { label: '自然转化率', prop: 'pay_watch_ratio', type: 'percentage' },
  { label: '点击成交转化率', prop: 'pay_click_ratio', type: 'percentage' },
  { label: '互动率', prop: 'interact_num_ratio', type: 'percentage' },
  { label: '转粉率', prop: 'fans_watch_ratio', type: 'percentage' },
  { label: '场次退货率', prop: 'refund_rate', type: 'percentage' },
  { label: '人均连带件数', prop: 'avg_order_combination_sale_count', type: 'num' },
  { label: '投放ROI', prop: 'ad_roi', type: 'percentage' },
];
const getVal = (val: any, type: string) => {
  if (val === undefined || val === null) return '--';
  if (type === 'money') {
    return '¥' + numberFormat(val / 100, 2);
  }
  if (type === 'percentage') {
    return val + '%';
  }
  return val;
};

enum DoubleDiskDimensionEnum {
  '本场策略' = 1,
  '结果分析' = 2,
  '下场调整' = 3,
}

interface ReOfferDetails {
  latitude: DoubleDiskDimensionEnum;
  anchor: string;
  flow: string;
  member: string;
  product: string;
}

export default defineComponent({
  components: {
    performance,
    capsuleGroup,
    sunburst,
    flow,
    dailyDetailFunnel,
    performancePutIndex,
    shopDetail,
    fanDeal,
  },
  setup: (props, ctx) => {
    const { isFromLocalLife } = useProjectBaseInfo();
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const routes = [
      {
        name: isFromLocalLife.value
          ? RouterNameProjectManage.localLife.project.list
          : RouterNameProjectManage.live.project.list,
        title: '项目管理',
      },
      {
        // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
        name: isFromLocalLife.value
          ? RouterNameProjectManage.localLife.detail.info
          : RouterNameProjectManage.tiktokLive.project.detail.info,
        params: {
          id: project_id,
          tab: 'projectInfo',
          liveType: 'calendar',
        },
        title: '项目详情',
      },
      {
        name: RouterNameProjectManage.tiktokLive.project.detail.data,
        query: {
          id: project_id,
          tab: 'sessionReview',
          liveType: 'calendar',
        },
        title: '运营数据',
      },
      {
        path: '',
        title: '场次复盘',
      },
    ];
    const start_date = ref<string>('2023-07-21');
    const end_date = ref<string>('2023-07-21');
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    // 对比
    const contrastSelect = ref<1 | 2>(1);
    // 场次
    const shop_live_id = ref<number>();
    // 表格
    const merge_shop_live_id = router.currentRoute.query.merge_live_id as string;
    const tableData: {
      columns: TgTableColumn<any>[];
      data: ReOfferDetails[];
    } = reactive({
      columns: [
        {
          label: '场次复盘',
          minWidth: 112,
          align: 'center',
          formatter: (row: any) => {
            return DoubleDiskDimensionEnum[row.latitude];
          },
        },
        {
          label: '流量',
          minWidth: 260,
          align: 'left',
          formatter: row => {
            return columnTemplate(row, 'flow', () =>
              methods.save_review_record_detail_req.run({
                merge_live_id: merge_shop_live_id,
                review_record_detail: tableData.data,
              }),
            );
          },
        },
        {
          label: '商品',
          minWidth: 260,
          align: 'left',
          formatter: row => {
            return columnTemplate(row, 'product', () =>
              methods.save_review_record_detail_req.run({
                merge_live_id: merge_shop_live_id,
                review_record_detail: tableData.data,
              }),
            );
          },
        },
        {
          label: '团队人员',
          minWidth: 260,
          align: 'left',
          formatter: row => {
            return columnTemplate(row, 'member', () =>
              methods.save_review_record_detail_req.run({
                merge_live_id: merge_shop_live_id,
                review_record_detail: tableData.data,
              }),
            );
          },
        },
        {
          label: '主播',
          minWidth: 260,
          align: 'left',
          formatter: row => {
            return columnTemplate(row, 'anchor', () =>
              methods.save_review_record_detail_req.run({
                merge_live_id: merge_shop_live_id,
                review_record_detail: tableData.data,
              }),
            );
          },
        },
      ],
      data: [
        {
          latitude: DoubleDiskDimensionEnum.本场策略,
          anchor: '',
          flow: '',
          member: '',
          product: '',
        },
        {
          latitude: DoubleDiskDimensionEnum.结果分析,
          anchor: '',
          flow: '',
          member: '',
          product: '',
        },
        {
          latitude: DoubleDiskDimensionEnum.下场调整,
          anchor: '',
          flow: '',
          member: '',
          product: '',
        },
      ],
    });
    // 流量
    const funnelLoading = ref<boolean>(false);
    const funnelData = ref<any[]>([]);
    const methods = {
      async queryProjectTradeFunnel(project_id: number) {
        funnelLoading.value = true;
        const [res] = await wait(
          500,
          QueryProjectTradeFunnel({
            project_id: `${project_id}`,
            // shop_live_id: `${shop_live_id.value}`,
            merge_shop_live_id: `${merge_shop_live_id}`,
            // start_date: '2022-01-01',
            // end_date: '2022-01-01',
            // project_id: '191',
            // start_date: start_date.value,
            // end_date: end_date.value,
          }),
        );
        funnelLoading.value = false;
        if (res.data.success) {
          funnelData.value = res.data.data;
        }
      },
      changeContrastSelect(val: 1 | 2) {
        contrastSelect.value = val;
        methods.get_merge_shop_live_detail.run({
          merge_live_id: merge_shop_live_id,
          comparison_label: contrastSelect.value,
        });
      },
      // 保存场次复盘详情
      save_review_record_detail_req: useRequest(save_review_record_detail, {
        manual: true,
        defaultParams: [
          {
            merge_live_id: merge_shop_live_id,
            review_record_detail: tableData.data,
          },
        ],
        onSuccess: () => {
          init();
        },
      }),
      get_merge_shop_live_detail: useRequest(get_merge_shop_live_detail, {
        manual: true,
        onSuccess: res => {
          if (res.origin_live_list.length) {
            if (!shop_live_id.value) {
              shop_live_id.value = res.origin_live_list[0].id;
            }
            start_date.value = moment(res.origin_live_list[0].live_start_time * 1000).format(
              'YYYY-MM-DD',
            );
            end_date.value = moment(res.origin_live_list[0].live_end_time * 1000).format(
              'YYYY-MM-DD',
            );
          }
          if (res.review_record_detail) {
            tableData.data = res.review_record_detail;
          }
        },
      }),
      // 秒转时分
      secondToHour: (second: number) => {
        const hour = Math.floor(second / 3600);
        const minute = Math.floor((second - hour * 3600) / 60);
        return `${hour}小时${minute}分`;
      },
      // 获取开始结束时间
      getStartAndEndTime: (start_time: number, end_time: number) => {
        if (!start_time || !end_time) return '--';
        return `${moment(start_time).format('YYYY.MM.DD HH:mm')} ~ ${moment(end_time).format(
          'YYYY.MM.DD HH:mm',
        )}`;
      },
    };
    const init = async () => {
      methods.get_merge_shop_live_detail.runAsync({
        merge_live_id: router.currentRoute.query.merge_live_id + '',
        comparison_label: contrastSelect.value,
      });
    };
    init();
    methods.queryProjectTradeFunnel(project_id);
    return {
      tableData,
      contrastSelect,
      shop_live_id,
      funnelLoading,
      funnelData,
      project_id,
      init,
      start_date,
      end_date,
      merge_shop_live_id,
      ...methods,
    };
  },
  render() {
    const { get_merge_shop_live_detail } = this;
    const data = get_merge_shop_live_detail?.data || {};
    return (
      <div class="box-wrap">
        <header>
          <div class="info-box">
            <div class="info">
              <div class="log-box">
                <el-image className="project-icon" src={data.shop_logo}>
                  <div slot="error" class="project-icon-slot">
                    <img src="@/assets/img/image_placeholder.png" alt="" />
                  </div>
                </el-image>
              </div>
              <div class="info_right">
                <span class="title">{data.shop_name || '--'}</span>
                <div class="info_right_grid-box">
                  <div class="grid-item1">
                    <span class="grey">直播时长：</span>
                    <span>{this.secondToHour(data.real_duration) || '--'}</span>
                  </div>
                  <div class="grid-item2">
                    <span class="grey">主播：</span>
                    <span>{data.kol_list?.kol_name || '--'}</span>
                  </div>
                  <div class="grid-item3 grey">直播时间：</div>
                  <div class="grid-item4">
                    {this.getStartAndEndTime(
                      data?.live_start_time * 1000,
                      data?.live_end_time * 1000,
                    )}
                  </div>
                  <div class="grid-item5 grey">
                    数据更新时间：
                    {data?.last_update_time
                      ? moment(data?.last_update_time).format('YYYY.MM.DD HH:mm:ss')
                      : '--'}
                  </div>
                  <div class="btn-box">
                    <span
                      class="btn"
                      selected={this.contrastSelect === 1}
                      onClick={() => {
                        this.changeContrastSelect(1);
                      }}
                    >
                      对比7日均值
                    </span>
                    <span
                      class="btn"
                      selected={this.contrastSelect === 2}
                      onClick={() => {
                        this.changeContrastSelect(2);
                      }}
                    >
                      对比上一场
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-data">
              {fields.map(item => {
                return (
                  <el-popover
                    placement="top-start"
                    title={item.label}
                    trigger="hover"
                    popper-class="popper-20230824"
                  >
                    <div>
                      <span class="amount">
                        {getVal(data?.statistics_data?.[item.prop], item.type)}
                      </span>
                      {data?.comparison_ratio?.[item.prop] > 0 ? (
                        <tg-icon class="icon iocn-red" name="ico-icon_tongyong_shangsheng_16" />
                      ) : (
                        <tg-icon
                          class="icon"
                          style={'color:#20BF55;'}
                          name="ico-icon_tongyong_xiajiang_16"
                        />
                      )}
                      <span class="grey">
                        {getVal(data?.comparison_ratio?.[item.prop], 'percentage')}
                      </span>
                      <div style="margin-top:4px">
                        <span class="grey">7日均值：</span>
                        <span>
                          {getVal(data?.comparison_statistics_data?.[item.prop], item.type)}
                        </span>
                      </div>
                    </div>
                    <div class="info-data_item" slot="reference">
                      <div class="grey mgt-2">{item.label}</div>
                      <span class="amount">
                        {getVal(data?.statistics_data?.[item.prop], item.type)}
                      </span>
                      {data?.comparison_ratio?.[item.prop] > 0 ? (
                        <tg-icon class="icon iocn-red" name="ico-icon_tongyong_shangsheng_16" />
                      ) : (
                        <tg-icon
                          class="icon"
                          style={'color:#20BF55;'}
                          name="ico-icon_tongyong_xiajiang_16"
                        />
                      )}

                      <span class="grey">
                        {getVal(data?.comparison_ratio?.[item.prop], 'percentage')}
                      </span>
                    </div>
                  </el-popover>
                );
              })}
            </div>
          </div>
          <div class="table-box" v-loading={this.save_review_record_detail_req.loading}>
            <tg-table
              height="100%"
              border={true}
              columns={this.tableData.columns}
              data={this.tableData.data}
            >
              <div class="tg-page-empty" slot="empty">
                <empty-common img-height="100" img-width="150" />
              </div>
            </tg-table>
          </div>
        </header>
        <capsule-group
          class="mgt-24 mgb-12"
          v-model={this.shop_live_id}
          options={
            data?.origin_live_list
              ? (data?.origin_live_list || []).map((item: any, index: number) => {
                  return {
                    label: `场次${index + 1}`,
                    value: item.id,
                  };
                })
              : [
                  {
                    label: '场次1',
                    value: undefined,
                  },
                ]
          }
          onChange={this.init}
        />
        {this.shop_live_id ? (
          <fragments>
            {/* 直播 */}
            <performance performanceId={this.shop_live_id} />
            <div class="flex">
              <div style="flex: 1;">
                <head-lines class="head-lines mgt-20 mgb-12" titleFont="14" title="流量来源" />
                <flow
                  merge_shop_live_id={this.merge_shop_live_id}
                  selectDate={this.start_date}
                ></flow>
              </div>
              <div style="flex:1">
                <head-lines class="head-lines mgt-20 mgb-12" titleFont="14" title="成交转化" />
                <dailyDetailFunnel
                  class="dailyDetailFunnel-wrap"
                  style="height: 322px;"
                  v-loading={this.funnelLoading || this.loading}
                  data={this.funnelData.map(v => v.value) ?? []}
                ></dailyDetailFunnel>
              </div>
            </div>
            <head-lines class="head-lines mgt-24 mgb-12" titleFont="14" title="投放数据" />
            <performancePutIndex
              // performanceId={this.shop_live_id}
              merge_shop_live_id={this.merge_shop_live_id}
              projectData={{ project_id: this.project_id, from_project: 1 }}
            />
            <head-lines class="head-lines mgt-24 mgb-12" titleFont="14" title="粉丝成交" />
            <fanDeal
              // performanceId={this.shop_live_id}
              merge_shop_live_id={this.merge_shop_live_id}
              project_id={this.project_id}
            />
            <head-lines class="head-lines mgt-24 mgb-16" titleFont="14" title="商品销售详情" />
            <shopDetail
              project_id={this.project_id}
              start_date={this.start_date}
              end_date={this.end_date}
              // shop_live_id={this.shop_live_id}
              merge_shop_live_id={this.merge_shop_live_id}
            />
          </fragments>
        ) : (
          <empty-common img-height="100" img-width="150" />
        )}
      </div>
    );
  },
});
