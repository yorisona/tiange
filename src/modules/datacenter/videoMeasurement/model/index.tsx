import { useRefTabs } from '@/use/tab';
import { defineComponent, inject, onMounted, ref } from '@vue/composition-api';
import videoInfo from '@/modules/datacenter/videoMeasurement/components/videoInfo/index.vue';
import moment from 'moment';
import {
  QueryCTRProjects,
  query_model_video_statistics,
  Query_Video_Record,
} from '@/services/datacenter';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { IGPageQuery } from '@/types/tiange/general';
import FD from '@/utils/formatData';
import { GetModelListNew } from '@/services/supplier';

type FormData = TG.ParameterFirst<typeof query_model_video_statistics> &
  IGPageQuery & { dates?: string[]; model_id?: string };

const filterOptions: TG.OptionType<E.datacenter.ModelVideoOrderType>[] = [
  {
    label: '短视频数量',
    value: E.datacenter.ModelVideoOrderType.video_count,
  },
  {
    label: '总播放量',
    value: E.datacenter.ModelVideoOrderType.play_count,
  },
  {
    label: '总有效播放',
    value: E.datacenter.ModelVideoOrderType.effective_play_count,
  },
  {
    label: '总有效播放率',
    value: E.datacenter.ModelVideoOrderType.effective_play_ratio,
  },
  {
    label: '完播率',
    value: E.datacenter.ModelVideoOrderType.play_finish_ratio,
  },
  {
    label: '点赞量',
    value: E.datacenter.ModelVideoOrderType.digg_count,
  },
  {
    label: '点赞率',
    value: E.datacenter.ModelVideoOrderType.play_digg_ratio,
  },
  {
    label: '评论量',
    value: E.datacenter.ModelVideoOrderType.comment_count,
  },
  {
    label: '评论率',
    value: E.datacenter.ModelVideoOrderType.play_comment_ratio,
  },
  {
    label: '分享量',
    value: E.datacenter.ModelVideoOrderType.share_count,
  },
  {
    label: '分享率',
    value: E.datacenter.ModelVideoOrderType.play_share_ratio,
  },
  {
    label: '新增粉丝数',
    value: E.datacenter.ModelVideoOrderType.new_fans_count,
  },
];
// [
// { label: '销量', value: E.datacenter.GoodsSortType.shop_sale_count },
//   { label: '销售额', value: E.datacenter.GoodsSortType.shop_gmv },
//   { label: '单次讲解销量', value: E.datacenter.GoodsSortType.danci },
// ];
export default defineComponent({
  components: {
    videoInfo,
  },
  setup(props, ctx) {
    const formData = ref<FormData>({
      dates: inject('currentSelectDate'),
      order_by: E.datacenter.ModelVideoOrderType.video_count,
      num: 10,
      page_num: 1,
      project_id: undefined,
      model_id: undefined,
    });
    const total = ref(0);
    const currentSelect = ref<{
      model_id: number;
      start_date?: string;
      end_date?: string;
    }>({} as any);

    const reqProjectList = useRequest(QueryCTRProjects);
    const reqVideoList = usePagination(Query_Video_Record, {
      manual: true,
    });
    const reqModelList = usePagination(GetModelListNew, {
      defaultParams: [{ num: 100000, page_num: 1 }],
    });
    const reqGoodsList = useRequest(query_model_video_statistics, {
      manual: true,
      onSuccess(data: any) {
        if (data.length > 0) {
          changeSelected(data[0].id);
        }
      },
    });
    const changeSelected = (id: number) => {
      const { dates, project_id, order_by } = formData.value;
      const payload = {
        model_id: id,
        start_date: dates?.[0],
        end_date: dates?.[1],
        project_id,
        order_by: order_by !== E.datacenter.ModelVideoOrderType.video_count ? order_by : undefined,
      };
      reqVideoList.runAsync({ num: 20, page_num: 1 }, payload);
      currentSelect.value = payload;
    };

    const methods = {
      queryTheMainInterface() {
        const { dates, num, page_num, ...res } = formData.value;
        reqGoodsList.runAsync({
          start_date: dates?.[0],
          end_date: dates?.[1],
          ...res,
        } as any);
      },
      onQuery() {
        formData.value.page_num = 1;
        currentSelect.value = {} as any;
        this.queryTheMainInterface();
      },
      onReset() {
        formData.value.num = 20;
        formData.value.page_num = 1;
        formData.value.project_id = undefined;
        formData.value.model_id = undefined;
        this.queryTheMainInterface();
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
      videoTabs,
      pickerOptions,
      pickDate,
      reqProjectList,
      reqGoodsList,
      reqVideoList,
      total,
      changeSelected,
      currentSelect,
      ...methods,
      reqModelList,
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
    const { reqVideoList, reqGoodsList, currentSelect, changeSelected, formData, reqModelList } =
      this;
    const hasAllEmpty = (reqGoodsList.data?.length || 0) === 0;
    const hasSideEmpty = (reqVideoList.data?.length || 0) === 0;
    return (
      <div class="tg-page-container tg-video-measurement">
        <section class="section-top">
          <div class="left-filter-field">
            <div class="filter-item">
              <span class="item-label">模特：</span>
              <el-select
                clearable
                filterable
                style="min-width: 116px"
                size="mini"
                v-model={this.formData.model_id}
              >
                {(reqModelList.data || []).map((el: any) => (
                  <el-option
                    label={`${el.flower_name}(${el.real_name})`}
                    value={el.id}
                    key={el.id}
                  />
                ))}
              </el-select>
            </div>
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
                          class={`good-box  ${currentSelect.model_id === item.id}`}
                          key={item.model_id}
                          onClick={() => {
                            if (currentSelect.model_id === item.id) return;
                            changeSelected(item.id);
                          }}
                        >
                          <div class="good-title">
                            {item.flower_name}（{item.real_name}）
                          </div>
                          <div class="good-info">
                            <tg-image
                              class="good-img"
                              fit="contain"
                              src={item.images && item.images[0]}
                            />
                          </div>
                          <div class="grid-info">
                            {this.createGridCell(
                              '短视频数量',
                              FD.formatEmpty(item.video_count),
                              true,
                              formData.order_by === E.datacenter.ModelVideoOrderType.video_count,
                            )}
                            {this.createGridCell(
                              '播放量',
                              FD.formatMoney(item.play_count, 1),
                              true,
                              formData.order_by === E.datacenter.ModelVideoOrderType.play_count,
                            )}
                            {this.createGridCell(
                              '有效播放量/率',
                              FD.formatMoney(item.effective_play_count, 0) +
                                '/' +
                                FD.formatEmpty(item.effective_play_ratio, '%'),
                              true,
                              formData.order_by ===
                                E.datacenter.ModelVideoOrderType.effective_play_count ||
                                formData.order_by ===
                                  E.datacenter.ModelVideoOrderType.effective_play_ratio,
                            )}
                            {this.createGridCell(
                              '点赞量/率',
                              FD.formatMoney(item.digg_count, 0) +
                                '/' +
                                FD.formatEmpty(item.play_digg_ratio, '%'),
                              true,
                              formData.order_by === E.datacenter.ModelVideoOrderType.digg_count ||
                                formData.order_by ===
                                  E.datacenter.ModelVideoOrderType.play_digg_ratio,
                            )}
                            {this.createGridCell(
                              '评论量/率',
                              FD.formatMoney(item.comment_count, 0) +
                                '/' +
                                FD.formatEmpty(item.play_comment_ratio, '%'),
                              true,
                              formData.order_by ===
                                E.datacenter.ModelVideoOrderType.comment_count ||
                                formData.order_by ===
                                  E.datacenter.ModelVideoOrderType.play_comment_ratio,
                            )}
                            {this.createGridCell(
                              '分享量/率',
                              FD.formatMoney(item.share_count, 0) +
                                '/' +
                                FD.formatEmpty(item.play_share_ratio, '%'),
                              true,
                              formData.order_by === E.datacenter.ModelVideoOrderType.share_count ||
                                formData.order_by ===
                                  E.datacenter.ModelVideoOrderType.play_share_ratio,
                            )}
                            {this.createGridCell(
                              '新增粉丝量',
                              FD.formatEmpty(item.new_fans_count),
                              true,
                              formData.order_by === E.datacenter.ModelVideoOrderType.new_fans_count,
                            )}

                            {this.createGridCell(
                              '平均时长',
                              FD.formatEmpty(item.play_avg_time, 's'),
                              true,
                            )}
                            {this.createGridCell(
                              '完播率',
                              FD.formatEmpty(item.play_finish_ratio, '%'),
                              true,
                              formData.order_by ===
                                E.datacenter.ModelVideoOrderType.play_finish_ratio,
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div class="bottom-right">
                {/*<div class="associated-information">*/}
                {/*  已关联视频：<b>{reqVideoList.data?.length ?? 0}</b>*/}
                {/*</div>*/}
                <div class="video-list" v-loading={this.reqVideoList.loading}>
                  {hasSideEmpty && (
                    <div class="empty">
                      <empty-common />
                    </div>
                  )}
                  {!hasSideEmpty &&
                    this.reqVideoList.data?.map(info => {
                      return (
                        <video-info
                          key={info.video_id}
                          sortType={this.formData.order_by}
                          info={info}
                          position="goods"
                        />
                      );
                    })}
                </div>
                <div style="background: white; border-top: 1px solid #E3E8EC; padding: 0 18px">
                  <el-pagination
                    total={reqVideoList.pagination.total}
                    page-size={reqVideoList.pagination.page_size}
                    page-sizes={[10, 20, 50, 100]}
                    layout={'total, prev, pager, next, sizes'}
                    current-page={reqVideoList.pagination.page_num}
                    on-current-change={reqVideoList.pagination.onCurrentChange}
                    on-size-change={reqVideoList.pagination.onSizeChange}
                  />
                </div>
              </div>
            </fragments>
          )}
        </section>
      </div>
    );
  },
});
