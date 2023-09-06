import { defineComponent, onMounted, ref, inject } from '@vue/composition-api';
import videoInfo from '@/modules/datacenter/videoMeasurement/components/videoInfo/index.vue';
import moment from 'moment';
import {
  Query_Video_Record,
  Query_Video_Account,
  QueryCTRProjects,
  Query_Video_Item_Detail_V2,
} from '@/services/datacenter';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { IGPageQuery } from '@/types/tiange/general';
import { ObjectFilterEmpty } from '@/utils/func';
import { getToken } from '@/utils/token';
import qs from 'query-string';
import FD from '@/utils/formatData';
import { GetModelListNew } from '@/services/supplier';
import { useDialog } from '@/use/dialog';
import followUp from '@/modules/datacenter/videoMeasurement/dialog/followUp/index.vue';
import followUpTag from '@/modules/datacenter/videoMeasurement/components/followUpTag/index.vue';

type FormData = TG.PaginationParams<typeof Query_Video_Record> &
  IGPageQuery & { dates?: string[]; model_id?: string };
const VideoSortType = E.datacenter.VideoSortType;
const filterOptions: TG.OptionType<E.datacenter.VideoSortType>[] = [
  { label: '短视频测款指数', value: VideoSortType.index_num },
  { label: '播放量', value: VideoSortType.play_count },
  { label: '有效播放量', value: VideoSortType.effective_play_count },
  { label: '有效播放率', value: VideoSortType.effective_play_rate },
  { label: '完播率 ', value: VideoSortType.play_finish_ratio },
  { label: '平均播放时长', value: VideoSortType.play_avg_time },
  { label: '点赞量', value: VideoSortType.digg_count },
  { label: '点赞率', value: VideoSortType.digg_count_rate },
  { label: '评论量', value: VideoSortType.comment_count },
  { label: '评论率', value: VideoSortType.comment_count_rate },
  { label: '分享量', value: VideoSortType.share_count },
  { label: '分享率', value: VideoSortType.share_count_rate },
  { label: '新增粉丝量', value: VideoSortType.new_fans_count },
];
export default defineComponent({
  components: {
    videoInfo,
    followUpTag,
  },
  setup: (props, ctx) => {
    const defaultDates = () => {
      const currentDateStr = moment().subtract(1, 'day').format('YYYY-MM-DD');
      return [currentDateStr, currentDateStr];
    };
    const formData = ref<FormData>({
      dates: inject('currentSelectDate'),
      account_douyin_id: undefined,
      video_title: undefined,
      is_relation_product: undefined,
      order_by: E.datacenter.VideoSortType.play_count,
      num: 10,
      page_num: 1,
      project_id: undefined,
      model_id: undefined,
    });
    const total = ref(0);
    const currentSelect = ref<number>();
    const goodsFormData = ref({
      order_by: E.datacenter.GoodsSortType.shop_gmv,
      datas: defaultDates(),
      project_id: undefined,
    });
    const reqProjectList = useRequest(QueryCTRProjects);
    const reqVideoList = usePagination(Query_Video_Record, {
      manual: true,
      onSuccess(data: any, oData) {
        total.value = (oData.data as any).total;
        if (data.length > 0) {
          const findLastItem = data.find((item: any) => item.video_id === currentSelect.value);
          let selectedId: any = data[0].video_id;
          if (findLastItem) selectedId = findLastItem.video_id;
          changeSelected(selectedId);
        }
      },
    });
    const reqModelList = usePagination(GetModelListNew, {
      defaultParams: [{ num: 100000, page_num: 1 }],
    });
    const changeSelected = (videoId: number) => {
      reqVideoItemDetail.runAsync(videoId);
      currentSelect.value = videoId;
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
    const reqVideoItemDetail = useRequest(Query_Video_Item_Detail_V2, { manual: true });
    const reqAccountList = useRequest(Query_Video_Account);
    const methods = {
      queryVideoList() {
        const { dates, account_douyin_id, num, ...res } = formData.value;
        let account_douyin_id_str: any = '';
        if (Array.isArray(account_douyin_id)) {
          account_douyin_id_str = account_douyin_id.join(',');
        }
        reqVideoList.runAsync(
          {
            num: reqVideoList.pagination.num,
            page_num: 1,
          },
          {
            account_douyin_ids: account_douyin_id_str,
            start_date: dates?.[0],
            end_date: dates?.[1],
            ...res,
          },
        );
      },
      onQuery() {
        currentSelect.value = undefined;
        this.queryVideoList();
      },
      onReset() {
        formData.value.account_douyin_id = undefined;
        formData.value.video_title = undefined;
        formData.value.is_relation_product = undefined;
        formData.value.num = 10;
        formData.value.page_num = 1;
        formData.value.project_id = undefined;
        this.queryVideoList();
      },
      exportUrl() {
        const { is_relation_product, dates, account_douyin_id, video_title, project_id } =
          formData.value;
        let account_douyin_id_str: any = '';
        if (Array.isArray(account_douyin_id)) {
          account_douyin_id_str = account_douyin_id.join(',');
        }
        // const par = reqShopOrders.params[1];
        const _paramsstr = qs.stringify({
          ...ObjectFilterEmpty({
            is_relation_product,
            account_douyin_ids: account_douyin_id_str,
            video_title,
            project_id,
            start_date: dates?.[0],
            end_date: dates?.[1],
          }),
        });
        const token = getToken();
        return `/api/short_video/export_query_video_record?${_paramsstr}&Authorization=${token}`;
      },
      generateURL() {
        const { dates } = formData.value;

        const _paramsstr = qs.stringify({
          ...ObjectFilterEmpty({
            start_date: dates?.[0],
            end_date: dates?.[1],
          }),
        });
        const token = getToken();
        return `/api/short_video/export_video_relation_item_data?${_paramsstr}&Authorization=${token}`;
      },
      exprot() {
        window.open(methods.exportUrl());
      },
      generate() {
        window.open(methods.generateURL());
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

    onMounted(() => {
      methods.onQuery();
      // methods.getQueryDouyinReportProjects();
    });

    return {
      formData,
      goodsFormData,
      pickerOptions,
      pickDate,
      reqProjectList,
      reqVideoList,
      reqAccountList,
      total,
      reqVideoItemDetail,
      changeSelected,
      currentSelect,
      ...methods,
      reqModelList,
      followUpDialog,
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
    const { reqVideoList, reqVideoItemDetail, currentSelect, changeSelected } = this;
    const hasAllEmpty = (reqVideoList.data?.length || 0) === 0;
    const hasSideEmpty = (reqVideoItemDetail.data?.length || 0) === 0;
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
                style="width: 220px"
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
              <span class="item-label">账号名称：</span>
              <el-select
                clearable
                filterable
                multiple
                collapse-tags
                style="width: 220px"
                size="mini"
                placeholder="请输入选择"
                v-model={this.formData.account_douyin_id}
              >
                {(this.reqAccountList.data || []).map(el => (
                  <el-option label={el.douyin_name} value={el.douyin_id} key={el.douyin_id} />
                ))}
              </el-select>
            </div>
            <div class="filter-item">
              <span class="item-label">视频标题：</span>
              <el-input
                clearable
                style="width: 220px"
                size="mini"
                placeholder="请输入"
                v-model={this.formData.video_title}
                nativeOnKeydown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    this.onQuery();
                  }
                  e.stopPropagation();
                  // e.preventDefault();
                }}
              />
            </div>
            <div class="filter-item">
              <span class="item-label">项目名称：</span>
              <el-select
                clearable
                filterable
                style="width: 220px; height:auto;"
                size="mini"
                v-model={this.formData.project_id}
              >
                {(this.reqProjectList.data || []).map((el: any) => (
                  <el-option label={el.project_name} value={el.project_id} key={el.project_id} />
                ))}
              </el-select>
            </div>
            <div class="filter-item">
              <span class="item-label">商品关联：</span>
              <el-select
                clearable
                style="width: 220px"
                size="mini"
                v-model={this.formData.is_relation_product}
                placeholder="请输入选择"
              >
                <el-option label={'不限'} v---alue={undefined} key={undefined} />
                <el-option label={'已关联'} value={true} key={1} />
                <el-option label={'未关联'} value={false} key={0} />
              </el-select>
            </div>
            <div class="filter-item">
              <span class="item-label">模特花名：</span>
              <el-select
                clearable
                style="width: 220px"
                size="mini"
                v-model={this.formData.model_id}
                placeholder="请输入选择"
                filterable
              >
                {(this.reqModelList.data || []).map((el: any) => (
                  <el-option
                    label={`${el.flower_name}(${el.real_name})`}
                    value={el.id}
                    key={el.id}
                  />
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
              <tg-button
                class="el-btn-mini export-item mgl-8"
                icon="ico-btn-export"
                on-click={this.exprot}
              >
                导出
              </tg-button>
              <tg-button
                class="el-btn-mini export-item mgl-8"
                icon="ico-btn-export"
                on-click={this.generate}
              >
                生成报告
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
        <section class="section-bottom" v-loading={reqVideoList.loading && hasAllEmpty}>
          {hasAllEmpty && (
            <div class="empty">
              <empty-common />
            </div>
          )}
          {!hasAllEmpty && (
            <fragments>
              <div class="bottom-left" v-loading={reqVideoList.loading}>
                <div class="left-content">
                  {this.reqVideoList.data?.map(info => {
                    return (
                      <video-info
                        key={info.video_id}
                        current={info.video_id === (currentSelect as any)}
                        info={info}
                        sortType={this.formData.order_by}
                        onSave={() => {
                          this.reqVideoList.reload();
                        }}
                        onClick={() => {
                          if (info.video_id === (currentSelect as any)) return;
                          changeSelected(info.video_id as any);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <div class="bottom-right" v-loading={reqVideoItemDetail.loading}>
                <div class="associated-information">
                  已关联商品：<b>{reqVideoItemDetail.data?.length ?? 0}</b>
                </div>
                {hasSideEmpty && (
                  <div class="empty">
                    <empty-common detail-text="暂无关联商品" />
                  </div>
                )}
                {!hasSideEmpty && (
                  <div class="goods-list">
                    {reqVideoItemDetail.data?.map((item: any) => {
                      const hasEmpty = item.product_id === null;
                      return (
                        <div class={`good-box ${hasEmpty && 'empty'}`} key={item.video_id}>
                          {!hasEmpty && (
                            <fragments>
                              <div class="good-info">
                                <el-image class="good-img" fit="contain" src={item.image_url} />
                                <div class="title display-flex">
                                  <div>{FD.formatEmpty(item.title)}</div>
                                  <followUpTag
                                    class="mgl-12"
                                    item={item}
                                    on-edit={(goodsInfo: any, record: any) => {
                                      this.followUpDialog.show(item, record);
                                    }}
                                  ></followUpTag>
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
                              <div class="grid-info left">
                                <span class="subscript">5天</span>
                                {this.createGridCell(
                                  '销量',
                                  FD.formatMoney(item.five_sale_count, 0),
                                  true,
                                )}
                                {this.createGridCell(
                                  '讲解次数',
                                  FD.formatEmpty(item.five_talk_times),
                                )}
                                {this.createGridCell(
                                  '点击率',
                                  FD.formatEmpty(item.five_click_rate, '%'),
                                )}
                                {this.createGridCell(
                                  '销售额(元)',
                                  FD.formatMoney(item.five_gmv, 1, 100),
                                  true,
                                )}
                                {this.createGridCell(
                                  '单次讲解销量',
                                  FD.formatEmpty(item.five_talk_sale_count),
                                )}
                                {this.createGridCell(
                                  '转化率',
                                  FD.formatEmpty(item.five_pay_rate, '%'),
                                )}
                                {this.createGridCell(
                                  '直播上架次数',
                                  FD.formatMoney(item.five_shelve_count),
                                )}
                              </div>
                              <div class="grid-info right">
                                <span class="subscript">至今</span>
                                {this.createGridCell(
                                  '销量',
                                  FD.formatMoney(item.sale_count, 0),
                                  true,
                                )}
                                {this.createGridCell('讲解次数', FD.formatEmpty(item.talk_times))}
                                {this.createGridCell(
                                  '点击率',
                                  FD.formatEmpty(item.click_rate, '%'),
                                )}
                                {this.createGridCell(
                                  '销售额(元)',
                                  FD.formatMoney(item.gmv, 1, 100),
                                  true,
                                )}
                                {this.createGridCell(
                                  '单次讲解销量',
                                  FD.formatEmpty(item.talk_sale_count),
                                )}
                                {this.createGridCell('转化率', FD.formatEmpty(item.pay_rate, '%'))}
                                {this.createGridCell(
                                  '直播上架次数',
                                  FD.formatMoney(item.shelve_count),
                                )}
                                {this.createGridCell('当前库存', FD.formatEmpty(item.stock_num))}
                              </div>
                            </fragments>
                          )}
                          {hasEmpty && (
                            <fragments>
                              <el-image
                                src={require('@/assets/img/datacenter/icon_video_goods_default2.png')}
                              />
                              <div class="label display-flex">
                                <div>项目：{item.project_name}</div>
                                <followUpTag
                                  className="mgl-12"
                                  item={item}
                                  on-edit={(goodsInfo: any, record: any) => {
                                    this.followUpDialog.show(item, record);
                                  }}
                                ></followUpTag>
                              </div>
                              <div class="label">款号：{item.sn}</div>
                              <div class="label" />
                            </fragments>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </fragments>
          )}
        </section>
        <div style="background: white; border-top: 1px solid #E3E8EC; padding: 0 18px">
          <el-pagination
            total={this.reqVideoList.pagination.total || 0}
            page-sizes={this.reqVideoList.pagination.page_sizes}
            layout={'total, prev, pager, next, sizes'}
            page-size={this.reqVideoList.pagination.page_size}
            current-page={this.reqVideoList.pagination.page_num}
            on-current-change={this.reqVideoList.pagination.onCurrentChange}
            on-size-change={this.reqVideoList.pagination.onSizeChange}
          />
        </div>
      </div>
    );
  },
});
