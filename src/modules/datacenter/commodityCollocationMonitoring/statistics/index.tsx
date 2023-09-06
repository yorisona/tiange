import { defineComponent, ref, inject, set } from '@vue/composition-api';
import videoInfo from '@/modules/datacenter/videoMeasurement/components/videoInfo/index.vue';
import moment from 'moment';
import {
  query_combination_statistics,
  query_shop_live_product_explain_detail,
} from '@/services/datacenter';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import formatData from '@/utils/formatData';
import goodsEmpty from '@/assets/img/goods-empty.png';
export default defineComponent({
  components: {
    videoInfo,
  },
  setup(props, ctx) {
    const defaultDates = () => {
      const currentDateStr = moment().subtract(1, 'day').format('YYYY-MM-DD');
      return [currentDateStr, currentDateStr];
    };
    const formData = inject('formData') as any;
    const order_by = ref(E.datacenter.StatisticsSortType.sale_count);
    const total = ref(0);
    const currentSelect = ref<number>();
    const goodsFormData = ref({
      order_by: E.datacenter.GoodsSortType.shop_gmv,
      datas: defaultDates(),
      project_id: undefined,
    });
    const reqStatistics = usePagination(query_combination_statistics, {
      manual: true,
      transform(data) {
        return data.data.map((item, index) => {
          set(item, 'index', 0);
          return item;
        });
        return data;
      },
    });

    const reqExplainDetail = useRequest(query_shop_live_product_explain_detail, { manual: true });
    const pickDate = ref<Date>();
    const pickerOptions = {
      shortcuts: [
        {
          text: '今天',
          onClick(picker: any) {
            // const end = new Date();
            const start = new Date();
            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, start]);
          },
        },
        {
          text: '昨天',
          onClick(picker: any) {
            // const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, start]);
          },
        },
        {
          text: '近5天',
          onClick(picker: any) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 4);
            picker.$emit('pick', [start, end]);
          },
        },
      ],
      onPick({ maxDate, minDate }: { maxDate: Date; minDate: Date }) {
        if (!maxDate && minDate) {
          pickDate.value = minDate;
        } else {
          pickDate.value = undefined;
        }
      },
      disabledDate(date: Date) {
        const currentMoment = moment();
        const dateMoment = moment(date);
        if (!pickDate.value) {
          return dateMoment.isAfter(currentMoment);
        } else {
          const pickMoment = moment(pickDate.value);
          const minMoment = pickMoment.clone().subtract('29', 'days');
          const maxMoment = pickMoment.clone().add('29', 'days');
          return (
            dateMoment.isBefore(minMoment) ||
            dateMoment.isAfter(maxMoment) ||
            dateMoment.isAfter(currentMoment)
          );
        }
      },
    };

    const loadData = () => {
      const { date = [], ...other } = formData;
      let [start_date, end_date] = date;
      if (start_date) {
        start_date = moment(start_date).format('YYYY-MM-DD');
      }
      if (end_date) {
        end_date = moment(end_date).format('YYYY-MM-DD');
      }
      const params = {
        ...other,
        start_date,
        end_date,
        order_by: order_by.value,
      };
      reqStatistics.runAsync({ num: 20, page_num: 1 }, params);
    };
    const onPopoverShow = (combination_id: number) => {
      const { date = [], project_id } = formData;
      let [start_date, end_date] = date;
      if (start_date) {
        start_date = moment(start_date).format('YYYY-MM-DD');
      }
      if (end_date) {
        end_date = moment(end_date).format('YYYY-MM-DD');
      }
      reqExplainDetail.runAsync({ num: 2000, page_num: 1 }, {
        combination_id,
        project_id,
        start_date,
        end_date,
      } as any);
    };
    loadData();

    const onSearch = () => {
      loadData();
    };
    (ctx.parent as any).setSearchFN(onSearch);
    return {
      formData,
      goodsFormData,
      pickerOptions,
      pickDate,
      reqStatistics,
      reqExplainDetail,
      total,
      currentSelect,
      order_by,
      loadData,
      onPopoverShow,
      onSearch,
    };
  },
  methods: {
    createGridCell(label: string, num: string, hasBold = false) {
      return (
        <div class="label">
          <span class={`num ${hasBold}`}>{num}</span>
          <span class="label">{label}</span>
        </div>
      );
    },
  },
  render() {
    const { reqStatistics, order_by } = this;
    return (
      <div class="tg-page-container">
        <div class="sort-box">
          <span class="label">排序：</span>
          <div class="sort">
            {E.datacenter.StatisticsSortTypeOption.map(item => {
              return (
                <span
                  class={`${item.value === this.order_by}`}
                  onclick={() => {
                    this.order_by = item.value;
                    this.loadData();
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
        <div
          class="tg-page-body"
          style={`${reqStatistics.data?.length === 0 ? 'background:#fff' : ''}`}
        >
          {reqStatistics.data?.length === 0 && (
            <empty-common detail-text="暂无搭配统计" style="margin-top:150px" />
          )}
          <section class="grid-card">
            {reqStatistics.data?.map((_, index) => {
              const color = Number(_.liking_index) < 100 ? 'green' : 'yellow';
              const hasDisabled = _.item_list.length < 3 ? 'disabled' : '';
              let text = '';
              let recommend = '';
              switch (_.combination_type) {
                case 1:
                  text = '推荐';
                  recommend = 'recommend';
                  break;
                case 2:
                  text = '非推荐';
                  break;
              }
              return (
                <card class={`index-${_.index} ${hasDisabled}`}>
                  <subscript class={recommend}>{text}</subscript>
                  <card-summary>
                    <summary class={`${order_by === E.datacenter.StatisticsSortType.sale_count}`}>
                      <span>
                        {formatData.formatEmpty(_.sale_count)}
                        <b>套</b>
                      </span>
                      <span>连带成交</span>
                    </summary>
                    <el-popover
                      open-delay={200}
                      trigger="hover"
                      popper-options={{ boundariesElement: 'body' }}
                      onShow={() => {
                        this.onPopoverShow(_.combination_id);
                      }}
                    >
                      <summary
                        slot="reference"
                        class={`${order_by === E.datacenter.StatisticsSortType.talk_times}`}
                      >
                        <span>
                          {formatData.formatEmpty(_.explain_count)}
                          <b>次</b>
                        </span>
                        <span>搭配讲解次数</span>
                      </summary>
                      <scroll>
                        <popover-card>
                          {this.reqExplainDetail.data?.data.map(item => {
                            const start_time = moment(item.start_time * 1000);
                            const end_time = moment(item.end_time * 1000);
                            let timeText = start_time.format('YYYY-MM-DD HH:mm:ss');
                            timeText += ' - ';
                            if (end_time.isSame(start_time, 'day')) {
                              timeText += end_time.format('HH:mm:ss');
                            } else {
                              timeText += end_time.format('YYYY-MM-DD HH:mm:ss');
                            }
                            return (
                              <popover-card-item>
                                <div class="title">{timeText}</div>
                                <div class="info-box">
                                  <span>
                                    人数变化：<b>{item.num_change}</b>
                                  </span>
                                  <span>
                                    平均在线：<b>{item.avg_online_person}</b>
                                  </span>
                                  <span>
                                    增加粉丝：<b>{item.incr_fans_cnt}</b>
                                  </span>
                                  <span>
                                    增加评论：<b>{item.comment_cnt}</b>
                                  </span>
                                </div>
                              </popover-card-item>
                            );
                          })}
                        </popover-card>
                      </scroll>
                    </el-popover>
                    <summary
                      v-loading={this.reqExplainDetail.loading}
                      class={`${order_by === E.datacenter.StatisticsSortType.liking_index}`}
                    >
                      <span class={color}>{formatData.formatEmpty(_.liking_index)}</span>
                      <span>受欢迎指数</span>
                    </summary>
                  </card-summary>
                  <scroll-box>
                    <good-box>
                      {_.item_list.map((_, index) => {
                        return (
                          <good>
                            <img src={_.image_url ? _.image_url : goodsEmpty} class="good-img" />
                            <div class="title">{formatData.formatEmpty(_.product_name)}</div>
                            <div class="label">讲解次数：{_.explain_count}</div>
                            <div class="label">{formatData.formatEmpty(_.product_sn)}</div>
                          </good>
                        );
                      })}
                    </good-box>
                  </scroll-box>
                  <switching
                    onClick={() => {
                      if (hasDisabled) return;
                      _.index = _.index === 0 ? 1 : 0;
                    }}
                  >
                    <tg-icon name="ico-arrow-right" />
                  </switching>
                </card>
              );
            })}
          </section>
        </div>
        <div style="background: white; border-top: 1px solid #E3E8EC; padding: 0 18px">
          <el-pagination
            total={reqStatistics.pagination.total || 0}
            page-sizes={reqStatistics.pagination.page_sizes}
            layout={'total, prev, pager, next, sizes'}
            page-size={reqStatistics.pagination.page_size}
            current-page={reqStatistics.pagination.page_num}
            on-current-change={reqStatistics.pagination.onCurrentChange}
            on-size-change={reqStatistics.pagination.onSizeChange}
          />
        </div>
      </div>
    );
  },
});
