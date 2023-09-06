import { ref, defineComponent, h, computed, provide, inject } from '@vue/composition-api';
import { RouterNameDesign } from '@/const/router';
import { useOrder, Design_Order_Details } from '../useOrder';
import type { Step } from '@/components/Steps/steps';
import moment from 'moment';
import { downloadFileFromLink } from '@/utils/func';
import detailCard from './modules/detailCard.vue';
import designDetails from './designDetails.vue';

export default defineComponent({
  components: {
    detailCard,
    designDetails,
  },
  setup(props, ctx) {
    console.log(ctx.root.$route.path, 'ctx.root.$route.path');

    const info = ref<Design_Order_Details>({} as any);
    const routes = [
      {
        name:
          ctx.root.$route.path.indexOf('workbench') >= 0
            ? RouterNameDesign.workbench.design_order_list
            : RouterNameDesign.design_order_list,
        title: '视觉设计',
      },
      {
        path: '',
        title: '视觉设计明细',
      },
    ];
    if (ctx.root.$route.path.indexOf('workbench') >= 0) {
      routes.splice(0, 0, {
        name: 'Workbench',
        title: '工作台',
      });
    }
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const loadData = async () => {
      info.value = (await useOrder()).data;
    };
    loadData();
    provide('info', info);
    provide('loadData', loadData);
    const steps = computed<Step[]>(() => [
      {
        title: '待接单',
        description: info.value?.gmt_create && `下单时间${info.value.gmt_create}`,
      },
      {
        title: '设计中',
        description:
          info.value?.expectation_delivery_time &&
          `期望时间${info.value.expectation_delivery_time}`,
      },
      {
        title: '审核中',
        description: info.value?.delivery_time && `截止时间${info.value.delivery_time}`,
      },
      {
        title: '已交付',
        description:
          info.value?.actual_delivery_time && `交付时间${info.value.actual_delivery_time}`,
      },
    ]);
    return {
      info,
      routes,
      steps,
    };
  },
  methods: {
    getTime(time: string) {
      return time ? moment(time).format('YYYY.MM.DD HH:mm') : '--';
    },
    downloadAll(list: string[]) {
      if (!list?.length) return this.$message.error('暂无文件可下载');
      list.forEach((item: any) => {
        // window.open(item);
        downloadFileFromLink(item, /tiange-oss/g.test(item) ? false : true);
      });
    },
  },
  render() {
    const { info, steps } = this;
    console.log(info, 'info');

    return (
      <div>
        <div class="detail-box">
          <div class="title">当前进度</div>
          <tg-steps steps={steps} active={info?.step_status ?? 0} />
          <div class="warp-box">
            {/* 需求明细 */}
            <detailCard
              cardsStlye={{ width: 'fit-content', gridArea: '1 / 1 / 3 / 2' }}
              headerStyle={{ color: '#FF7A36', background: 'rgba(255, 122, 54, 0.2)' }}
              title="需求明细"
            >
              <div class="card">
                <div class="card-title-box mgb-14">
                  <span
                    class="dot"
                    style={{
                      background: info?.design_level_color,
                      color: info?.design_level_name === '-' ? 'var(--text-third-color)' : '#fff',
                    }}
                  >
                    {info?.design_level_name || '--'}
                  </span>
                  <span style="padding-left: 34px;">{info.name || '--'}</span>
                </div>
                <div class="mgb-10">
                  <span>项目方：</span>
                  <span class="value mgb-10">{info.brand_name || '--'}</span>
                </div>
                <div class="header-content">
                  <div>
                    <span>下单部门：</span>
                    <span class="value">{info.department_name || '--'}</span>
                  </div>
                  <div>
                    <span>下单人：</span>
                    <span class="value">{info.add_by_name || '--'}</span>
                    <span class="mgl-20">抄送：</span>
                    <span class="value">{info.add_by_leader_name || '--'}</span>
                  </div>
                  <div>
                    <span>下单时间：</span>
                    <span class="value">{this.getTime(info.gmt_create) || '--'}</span>
                  </div>
                  <div>
                    <span>期望时间：</span>
                    <span class="value">
                      {this.getTime(info.expectation_delivery_time) || '--'}
                    </span>
                  </div>
                </div>
                <div class="line"></div>
                <div class="info-item">
                  <span>项目类型：</span>
                  <span class="value">{info.team_label || '--'}</span>
                </div>
                <div class="info-item">
                  <span>制作内容：</span>
                  <span class="value">{info.design_type_name || '--'}</span>
                </div>
                <div class="info-item" v-show={info.construction_location_name}>
                  <span>施工位置：</span>
                  <span class="value">{info.construction_location_name || '--'}</span>
                </div>
                <div class="info-item">
                  <span>附加内容：</span>
                  <span class="value">
                    {info.addition_attachment?.length > 0
                      ? info.addition_attachment.map((i: any) => i.name).join('；')
                      : '--'}
                  </span>
                </div>
                <div class="info-item">
                  <div class="mgb-10">详细内容：</div>
                  <div class="detail">{info.remark || '--'}</div>
                </div>
                <div class="info-item">
                  <div class="mgb-10">附件内容：</div>
                  <div class="file-box">
                    {info.enclosure_list?.length > 0
                      ? info.enclosure_list.map((i: any) => (
                          <file-item
                            limitNameWidth={80}
                            isManualUpload={true}
                            // showPreview={false}
                            filepath={i}
                            readonly={true}
                            onDownload={() => {
                              // console.log(downloadFileFromLink, i, 'i');
                              downloadFileFromLink(i, /tiange-oss/g.test(i) ? false : true);
                              // window.open(i);
                            }}
                          />
                        ))
                      : '--'}
                  </div>
                  <div
                    v-show={info.enclosure_list?.length}
                    onClick={() => this.downloadAll(info.enclosure_list)}
                    class="mgt-20"
                    style="font-weight: 600;font-size: 14px;color: #5090FD;cursor: pointer;"
                  >
                    下载全部附件
                  </div>
                </div>
              </div>
            </detailCard>
            {/* 设计明细 */}
            <designDetails style="grid-area: 1 / 2 / 2 / 3;" />
            {/* <designOrderStatusBox style="grid-area: 2 / 2 / 3 / 3;" /> */}
          </div>
        </div>
      </div>
    );
  },
});
