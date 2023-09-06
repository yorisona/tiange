import { useRefTabs } from '@/use/tab';
import { defineComponent, inject, onMounted, ref } from '@vue/composition-api';
import videoInfo from '@/modules/datacenter/videoMeasurement/components/videoInfo/index.vue';
import moment from 'moment';
import {
  Query_Top_Video_Relation_Item,
  QueryCTRProjects,
  Get_item_video_detail,
} from '@/services/datacenter';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { IGPageQuery } from '@/types/tiange/general';
import FD from '@/utils/formatData';
import { useDialog } from '@/use/dialog';
import followUp from '@/modules/datacenter/videoMeasurement/dialog/followUp/index.vue';
import followUpTag from '@/modules/datacenter/videoMeasurement/components/followUpTag/index.vue';

type FormData = TG.PaginationParams<typeof Query_Top_Video_Relation_Item> &
  IGPageQuery & { dates?: string[] };

const filterOptions: TG.OptionType<E.datacenter.GoodsSortType>[] = [
  { label: '销量', value: E.datacenter.GoodsSortType.shop_sale_count },
  { label: '销售额', value: E.datacenter.GoodsSortType.shop_gmv },
  { label: '单次讲解销量', value: E.datacenter.GoodsSortType.danci },
  { label: '综合测款指数', value: E.datacenter.GoodsSortType.comprehensive_measurement_index },
];
export default defineComponent({
  components: {
    videoInfo,
    followUpTag,
  },
  setup: (props, ctx) => {
    const defaultDates = () => {
      const currentDateStr = moment().subtract(21, 'day').format('YYYY-MM-DD');
      return [currentDateStr, currentDateStr];
    };
    const formData = ref<FormData>({
      dates: inject('currentSelectDate'),
      order_by: E.datacenter.GoodsSortType.shop_sale_count,
      num: 10,
      page_num: 1,
      project_id: undefined,
      follow_up_status: undefined,
    });
    const total = ref(0);
    const currentSelect = ref<{
      project_id: number;
      sn: string;
    }>({} as any);
    const goodsFormData = ref({
      order_by: E.datacenter.GoodsSortType.shop_gmv,
      datas: defaultDates(),
      project_id: undefined,
    });
    const reqProjectList = useRequest(QueryCTRProjects);
    const reqVideoList = useRequest(Get_item_video_detail, {
      manual: true,
      transform(e: any) {
        return e.video_detail_list;
      },
    });
    const reqGoodsList = usePagination(Query_Top_Video_Relation_Item, {
      manual: true,
      onSuccess(data: any) {
        if (data.length > 0) {
          changeSelected(data[0].project_id, data[0].sn);
        }
      },
    });
    const changeSelected = (project_id: number, sn: string) => {
      const payload = { project_id, sn };
      reqVideoList.runAsync(payload);
      currentSelect.value = payload;
    };
    const followUpDialog = useDialog({
      component: followUp,
      title: '测款跟进',
      width: 468,
      okText: '确定',
      cancelText: '取消',
      on: {
        submit() {
          methods.onQuery();
        },
      },
    });
    const methods = {
      queryTheMainInterface() {
        const { dates, num, page_num, ...res } = formData.value;
        reqGoodsList.runAsync(
          {
            num: reqGoodsList.pagination.num,
            page_num: 1,
          },
          {
            start_date: dates?.[0],
            end_date: dates?.[1],
            ...res,
          },
        );
      },
      onQuery() {
        formData.value.page_num = 1;
        currentSelect.value = {} as any;
        this.queryTheMainInterface();
      },
      onReset() {
        formData.value.num = 10;
        formData.value.page_num = 1;
        formData.value.project_id = undefined;
        formData.value.follow_up_status = undefined;
        this.queryTheMainInterface();
      },
      onFollowUpHandler(item: any, e: PointerEvent) {
        followUpDialog.show(item);
        e.stopPropagation();
      },
      toPopover(text: string) {
        if (!text) return '--';
        return (
          <el-popover open-delay={300} trigger="hover" placement="top">
            <div class="line-clamp-1" slot="reference">
              {text}
            </div>
            <div>{text}</div>
          </el-popover>
        );
      },
    };
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
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
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
    const videoTabs = useRefTabs(
      E.datacenter.VideoSortTypeOption.map(el => ({
        label: el.label,
        value: `${el.value}`,
      })),
      `${E.datacenter.VideoSortType.play_count}`,
    );

    onMounted(() => {
      methods.onQuery();
    });

    return {
      formData,
      goodsFormData,
      videoTabs,
      pickerOptions,
      pickDate,
      reqProjectList,
      reqGoodsList,
      reqVideoList,
      total,
      followUpDialog,
      changeSelected,
      currentSelect,
      ...methods,
    };
  },
  methods: {
    createGridCell(label: string, num: string, hasBold = false, hasSelect = false) {
      return (
        <div class={`label ${hasSelect}`}>
          <span class={`num ${hasBold}`}>{num}</span>
          <span class="label">{label}</span>
        </div>
      );
    },
  },
  render() {
    const { reqVideoList, reqGoodsList, currentSelect, changeSelected, formData } = this;
    const hasAllEmpty = (reqGoodsList.data?.length || 0) === 0;
    const hasSideEmpty = (reqVideoList.data?.length || 0) === 0;
    console.log(reqGoodsList.pagination.page_num);
    return (
      <div class="tg-page-container tg-video-measurement">
        <section class="section-top">
          <div class="left-filter-field">
            <div class="filter-item">
              <span class="item-label">选择日期：</span>
              <el-date-picker
                editable={false}
                clearable={false}
                size="mini"
                style="width: 200px"
                v-model={this.formData.dates}
                type="daterange"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                on-focus={() => (this.pickDate = undefined)}
                picker-options={this.pickerOptions}
                on-change={this.onQuery}
              />
            </div>
            <div class="filter-item">
              <span class="item-label">项目：</span>
              <el-select
                clearable
                filterable
                style="min-width: 116px"
                size="mini"
                v-model={this.formData.project_id}
              >
                {(this.reqProjectList.data || []).map((el: any) => (
                  <el-option label={el.project_name} value={el.project_id} key={el.project_id} />
                ))}
              </el-select>
            </div>
            <div class="filter-item">
              <span class="item-label">跟进状态：</span>
              <el-select
                clearable
                filterable
                style="min-width: 200px"
                size="mini"
                v-model={this.formData.follow_up_status}
              >
                {E.datacenter.FollowUpStatusOption.map((el: any) => (
                  <el-option label={el.label} value={el.value} key={el.value} />
                ))}
              </el-select>
            </div>
            <div class="filter-item">
              <tg-button class="el-btn-mini" type="primary" on-click={this.onQuery}>
                查询
              </tg-button>
              <tg-button class="mgl-8 el-btn-mini" on-click={this.onReset}>
                重置
              </tg-button>
            </div>
          </div>
        </section>
        <section class="section-sort">
          <div class="vidoe-sort-section">
            <span class="sort-desc">排序：</span>
            <div class="sort-item-list">
              {filterOptions.map(el => (
                <div
                  class={el.value === this.formData.order_by ? 'sort-item actived' : 'sort-item'}
                  key={el.value}
                  on-click={() => {
                    if (this.formData.order_by === el.value) return;
                    this.formData.order_by = el.value;
                    this.onQuery();
                  }}
                >
                  {el.label}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section class="section-bottom" v-loading={reqGoodsList.loading && hasAllEmpty}>
          {hasAllEmpty && (
            <div class="empty">
              <empty-common />
            </div>
          )}
          {!hasAllEmpty && (
            <fragments>
              <div class="bottom-left" v-loading={reqGoodsList.loading}>
                <div class="left-content">
                  <div class="goods-list">
                    {reqGoodsList.data?.map((item: any, index: number) => {
                      return (
                        <div
                          class={`good-box  ${
                            currentSelect.project_id === item.project_id &&
                            currentSelect.sn === item.sn
                          }`}
                          key={item.video_id}
                          onClick={() => {
                            if (
                              currentSelect.project_id === item.project_id &&
                              currentSelect.sn === item.sn
                            )
                              return;
                            changeSelected(item.project_id, item.sn);
                          }}
                        >
                          <div class="good-info">
                            <el-image class="good-img" fit="contain" src={item.image_url} />
                            <div class="title">
                              {item.item_rank !== null && (
                                <span class={`top top-${item.item_rank}`}>
                                  TOP {item.item_rank}
                                </span>
                              )}

                              <div class="line-clamp-1" style="margin-right: auto;">
                                {item.title}
                              </div>
                              <follow-up-tag
                                class="mgl-12"
                                item={item}
                                on-edit={(goodsInfo: any, record: any) => {
                                  this.followUpDialog.show(item, record);
                                }}
                              ></follow-up-tag>
                            </div>
                            <div class="label">
                              <span class="name">项目：</span>
                              {this.toPopover(item.project_name)}
                            </div>
                            <div class="label">
                              <span class="name">款号：</span>
                              {this.toPopover(item.sn)}
                            </div>
                            <div class="label span-2">
                              <span class="name">品类：</span>
                              {this.toPopover(item.second_cname)}
                            </div>
                            <div class="label">
                              首次销售时间：{item.first_sale_date?.replace(/-/g, '.') || '--'}
                            </div>
                            <div class="label">
                              综合测款指数：
                              <span
                                class={
                                  item.composite_index === null ||
                                  item.composite_index === undefined
                                    ? 'composite-index'
                                    : item.composite_index >= 100
                                    ? 'composite-index orange'
                                    : 'composite-index green'
                                }
                              >
                                {FD.formatEmpty(item.composite_index)}
                              </span>
                            </div>
                            <div class="label">
                              潜力指数：
                              <span
                                class={
                                  item.potential_index === null ||
                                  item.potential_index === undefined
                                    ? 'composite-index'
                                    : item.potential_index >= 23
                                    ? 'composite-index orange'
                                    : 'composite-index green'
                                }
                              >
                                {FD.formatEmpty(item.potential_index)}
                              </span>
                            </div>
                            <div class="label">
                              受欢迎指数：
                              <span
                                class={
                                  item.popularity_index === null ||
                                  item.popularity_index === undefined
                                    ? 'composite-index'
                                    : item.popularity_index >= 100
                                    ? 'composite-index orange'
                                    : 'composite-index green'
                                }
                              >
                                {FD.formatEmpty(item.popularity_index)}
                              </span>
                            </div>
                          </div>
                          <div class="grid-info">
                            {this.createGridCell(
                              '销量',
                              FD.formatEmpty(item.sale_count),
                              true,
                              formData.order_by === E.datacenter.GoodsSortType.shop_sale_count,
                            )}
                            {this.createGridCell(
                              '销售额(元)',
                              FD.formatMoney(item.gmv, 1, 100),
                              true,
                              formData.order_by === E.datacenter.GoodsSortType.shop_gmv,
                            )}
                            {this.createGridCell('讲解次数', FD.formatEmpty(item.talk_times), true)}
                            {this.createGridCell(
                              '单次讲解销量',
                              FD.formatEmpty(item.talk_sale_count),
                              true,
                            )}

                            {this.createGridCell(
                              '点击率',
                              FD.formatEmpty(item.click_rate, '%'),
                              true,
                            )}

                            {this.createGridCell(
                              '转化率',
                              FD.formatEmpty(item.pay_rate, '%'),
                              true,
                            )}
                            {this.createGridCell(
                              '直播上架次数',
                              FD.formatEmpty(item.shelve_count),
                              true,
                            )}
                            {this.createGridCell('当前库存', FD.formatEmpty(item.stock_num), true)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div class="bottom-right">
                <div class="associated-information">
                  已关联视频：<b>{reqVideoList.data?.length ?? 0}</b>
                </div>
                <div class="video-list" v-loading={this.reqVideoList.loading}>
                  {hasSideEmpty && (
                    <div class="empty">
                      <empty-common />
                    </div>
                  )}
                  {!hasSideEmpty &&
                    this.reqVideoList.data?.map(info => {
                      return <video-info key={info.video_id} info={info} position="goods" />;
                    })}
                </div>
              </div>
            </fragments>
          )}
        </section>
        <div style="background: white; border-top: 1px solid #E3E8EC; padding: 0 18px">
          <el-pagination
            total={reqGoodsList.pagination.total}
            page-size={reqGoodsList.pagination.page_size}
            page-sizes={[10, 20, 50, 100]}
            layout={'total, prev, pager, next, sizes'}
            current-page={reqGoodsList.pagination.page_num}
            on-current-change={reqGoodsList.pagination.onCurrentChange}
            on-size-change={reqGoodsList.pagination.onSizeChange}
          />
        </div>
      </div>
    );
  },
});
