import { defineComponent, PropType, ref } from '@vue/composition-api';
import goodsDetail from '@/modules/datacenter/videoMeasurement/components/goodsDetail/index.vue';
import flvVideo from '@/modules/datacenter/ctr/components/flvVideo/index.vue';
import associateGoods from '@/modules/datacenter/videoMeasurement/dialog/associateGoods/index.vue';
import { useDialog } from '@/use/dialog';
import { VideoRecordItem } from '@/types/tiange/datacenter';
import { formatAmount } from '@/utils/string';
import Decimal from 'decimal.js';
import moment from 'moment';
import { videoDuration } from '@/modules/datacenter/videoMeasurement/common/common';
import { AsyncConfirm } from '@/use/asyncConfirm';
import showModel from '@/modules/supplier/components/showModel/index.vue';
import { Model } from '@/types/tiange/supplier';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import {
  Get_query_video_comment,
  get_video_audience_data,
  Update_Video_To_Private,
} from '@/services/datacenter';
import { Message } from 'element-ui';
import formatData, { FD } from '@/utils/formatData';
import ImageViewer from '@/components/Image/ImageViewer';
import baseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
(window as any).Decimal = Decimal;
import { getToken } from '@/utils/token';
import infiniteList from '@/modules/datacenter/videoMeasurement/components/infinite-list/index.vue';
import { usePermission } from '@/use/permission';
const PositionEnum = {
  goods: 'goods',
  video: 'video',
};
export default defineComponent({
  components: {
    goodsDetail,
    flvVideo,
    showModel,
    infiniteList,
    baseEcharts,
  },
  props: {
    info: {
      type: Object as PropType<VideoRecordItem>,
      default: () => {},
    },
    sortType: {
      type: Number as PropType<E.datacenter.VideoSortType>,
    },
    current: {
      type: Boolean,
    },
    // 在那个页面显示
    position: {
      type: String as PropType<'video' | 'goods'>,
      default: () => 'video',
    },
  },
  setup(props, ctx) {
    const reqHidden = useRequest(Update_Video_To_Private, { manual: true });
    const showModelRef = ref<{ show: (...args: any) => void }>();
    const permission = usePermission();
    const methods = {
      onCurrentChange(num: number) {
        ctx.emit('pageChange', num);
      },
      onSizeChange(size: number) {
        ctx.emit('sizeChange', size);
      },
      formatCount(count: number) {
        if (count === undefined || count === null) return '--';
        if (count >= 10000) {
          const newVal = count / 10000;
          return new Decimal(newVal).toFixed(1) + 'w';
        } else {
          return formatAmount(count, 'None', true);
        }
      },
      vidoeCreateDatetime(create_datetime: string | undefined) {
        if (!create_datetime) return '--';
        const newVal = moment(create_datetime).format('YYYY.MM.DD HH:mm');
        return newVal;
      },
      async onVideoHidden(video_id: string) {
        const result = await AsyncConfirm(ctx, '确定隐藏该短视频吗？隐藏后数据将不计入统计');
        if (!result) {
          return;
        }
        const res = await reqHidden.runAsync({
          video_id,
        });
        if (res.data.success) {
          Message.success(res.data.message);
          ctx.emit('save');
        }
      },
      onModal(model?: Model) {
        showModelRef.value?.show(model);
      },
      formatAmount,
    };
    const reqFans = useRequest(get_video_audience_data, {
      manual: true,
      transform(data) {
        let allAge = 0;
        data.age.forEach(it => (allAge += it.value));
        data.age.forEach(it => {
          it.process = ((it.value / allAge) * 100).toFixed(1) + '%';
        });
        return data;
      },
    });
    const associateGoodsDialog = useDialog({
      component: associateGoods,
      title: '关联',
      width: '434px',
      okText: '确定',
      props: {},
      on: {
        submit() {
          ctx.emit('save');
        },
      },
    });
    const searchVal = ref('');
    const commentList = ref<any>();
    const Pagination = ref({
      total: 0,
      page_size: 10,
      page_num: 1,
      num: 10,
    });
    const pageComment = usePagination(Get_query_video_comment, {
      manual: true,
      defaultParams: [
        {
          num: 10,
          page_num: Pagination.value.page_num,
          page_size: 10,
          video_id: '7189877346449558844',
        },
      ],
    });

    const onSearch = (val?: string) => {
      searchVal.value = val || '';
      Pagination.value.page_num = 1;
      pageComment
        .runAsync({
          num: 10,
          page_num: 1,
          page_size: 10,
          video_id: props.info.video_id,
          comment_text: searchVal.value,
        })
        .then(res => {
          commentList.value = res.data.data.data;
          Pagination.value.total = res.data.data.total;
        });
    };
    const load = (item: any) => {
      if (pageComment.loading || commentList.value.length >= Pagination.value.total) return;

      Pagination.value.page_num++;
      pageComment
        .runAsync({
          num: Pagination.value.num,
          page_num: Pagination.value.page_num,
          page_size: Pagination.value.page_size,
          video_id: item.video_id,
          comment_text: searchVal.value,
        })
        .then(res => {
          if (res.data.data.data.length > 0) {
            commentList.value.push(...res.data.data.data);
          }
        });
    };

    const onShow = () => {
      reqFans.runAsync({ video_id: props.info.video_id as any });
    };

    return {
      permission,
      showModelRef,
      // pagination,
      associateGoodsDialog,
      reqHidden,
      onSearch,
      Pagination,
      commentList,
      pageComment,
      load,
      ...methods,
      reqFans,
      onShow,
    };
  },
  methods: {
    render_effective_play(video: VideoRecordItem) {
      if (video.effective_play_count < 3000) return <div class="num invalid">无效数据</div>;
      const hasLow = video.index_num < 100;
      return <div class={`num ${hasLow}`}>{FD.formatEmpty(video.index_num)}</div>;
    },
  },
  render() {
    const video = this.info;
    const VideoSortMap = new Map();
    const VideoSortType = E.datacenter.VideoSortType;
    const { reqFans } = this;
    E.datacenter.VideoSortTypeOption.forEach(item => {
      if (item.value === this.sortType) VideoSortMap.set(item.value, 'current');
    });

    const Gender = reqFans.data?.gender || [];
    const Age = reqFans.data?.age || [];
    return (
      <div
        class={`list-item ${this.current && 'current'} ${
          this.position === PositionEnum.video && 'click'
        }`}
        onClick={() => {
          this.$emit('click');
        }}
      >
        <div class="video">
          <flvVideo
            type="mp4"
            playMode="click"
            isLive={false}
            class="video-item"
            poster={video.video_img_url}
            src={video.video_url}
            download={`${
              process.env.VUE_APP_BASE_API
            }/api/short_video/download_video_mp4?video_id=${
              video.video_id
            }&Authorization=${getToken()}`}
          />
          <div class="video-time">{videoDuration(video.video_duration)}</div>
        </div>
        <div class="video-info">
          <div class="video-title-field">
            <div class="line-clamp-1 video-title" title={video.video_title}>
              {FD.formatEmpty(video.video_title)}
            </div>
            <div class="fill" />
            <div class="playback-volume">5天</div>
            {this.position === PositionEnum.video && this.permission.short_video_test_private && (
              <div class="video-btn mgl-16" on-click={() => this.onVideoHidden(video.video_id)}>
                <tg-icon name="ico-a-common-hide-linear" />
                <span class="video-btn-title">隐藏</span>
              </div>
            )}
          </div>
          <div class="video-info-content">
            <div class="video-info-details">
              <div class="line-1">
                <img src={require('@/assets/img/dataAnalysis/icon-wave.png')} />
                {this.render_effective_play(video)}
                <div>短视频测款指数</div>
              </div>
              <div class="fill" />
              <div class="line-2">
                <div class={`block ${VideoSortMap.get(VideoSortType.play_count)}`}>
                  <span>{this.formatCount(video.play_count)}</span>
                  <span>播放量</span>
                </div>

                <el-popover width="100%" class="popper" trigger="hover" onShow={this.onShow}>
                  <div slot="reference" class="popper-box">
                    <div
                      class={`block playbackRate ${VideoSortMap.get(
                        VideoSortType.effective_play_rate,
                      )}`}
                    >
                      <span>{formatData.formatEmpty(video.effective_play_ratio, '%')}</span>
                      <span>有效播放率</span>
                    </div>
                    <div
                      class={`block playbackRate ${VideoSortMap.get(
                        VideoSortType.effective_play_count,
                      )}`}
                    >
                      <span>{this.formatCount(video.effective_play_count)}</span>
                      <span>有效播放量</span>
                    </div>
                  </div>

                  <div class="fanPortrait" v-loading={this.reqFans.loading}>
                    <div class="title">粉丝画像</div>
                    <div class="chart-box chart-box-34131745">
                      <div class="chart-title">性别分布</div>
                      <div>
                        {Gender.length > 0 && (
                          <base-echarts
                            options={{
                              grid: {
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                              },
                              color: ['#FF82AC', '#1E8DFF'],
                              series: [
                                {
                                  type: 'pie',
                                  radius: ['41%', '58%'],
                                  label: {
                                    show: true,
                                    position: 'outside',
                                    formatter: (obj: any) => {
                                      return `${Math.floor(obj.percent)}%\n${obj.name}`;
                                    },
                                  },
                                  labelLine: {
                                    // show: false
                                    length: 6,
                                    length2: 8,
                                  },
                                  data: Gender.map(it => {
                                    return {
                                      value: it.value,
                                      name: it.key,
                                    };
                                  }),
                                },
                              ],
                            }}
                          />
                        )}
                        {Gender.length === 0 && <empty-common class="empty" />}
                      </div>
                    </div>

                    <div class="chart-box age-distribution chart-box-34131745">
                      <div class="chart-title">年龄分布</div>
                      {Age.length > 0 && (
                        <div class="distribution">
                          {Age.map(item => {
                            return (
                              <div>
                                <span>{item.key}</span>
                                <span style={{ width: item.process }}></span>
                                <span>{item.process}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {Age.length === 0 && <empty-common />}
                    </div>
                  </div>
                </el-popover>

                <div class="fill" />
                <el-popover
                  placement="right"
                  width="496"
                  trigger="click"
                  popper-class="commodity_detail"
                  onShow={() => {
                    this.onSearch();
                  }}
                  onHide={() => {
                    (this.$refs.infiniteList as any)?.hide();
                  }}
                >
                  <infinite-list
                    ref="infiniteList"
                    onLoad={() => this.load(video)}
                    onSearch={this.onSearch}
                    loading={this.pageComment.loading}
                    data={this.commentList || []}
                    total={this.Pagination.total}
                    style="height:262px"
                  />
                  <tg-button slot="reference" class="mgl-10  el-btn-mini">
                    评论
                  </tg-button>
                </el-popover>
                {this.position === PositionEnum.video && this.permission.short_video_test_relation && (
                  <tg-button
                    class="mgl-8 el-btn-mini"
                    type="primary"
                    onClick={() => this.associateGoodsDialog.show(video)}
                  >
                    关联
                  </tg-button>
                )}
              </div>
              <div class="fill" />
              <div class="line-3">
                <div>账号：{video.douyin_name || '--'}</div>
                <div class="mgl-18">
                  发布时间：{this.vidoeCreateDatetime(video.create_datetime)}
                </div>
                <div>
                  模特：
                  {(video.model_list?.length || 0) > 0 ? (
                    <el-popover
                      disabled={(video.model_list?.length || 0) === 1}
                      popper-class="video-tab-model-popover"
                      placement="top"
                      trigger="click"
                      open-delay={300}
                    >
                      <div class="more-model-list">
                        {(video.model_list || []).map(el => (
                          <tg-button
                            type="link"
                            on-click={() => {
                              ImageViewer.show(el.images);
                            }}
                          >
                            {el.flower_name}
                          </tg-button>
                        ))}
                      </div>
                      <tg-button
                        style="font-size: 12px"
                        type="link"
                        slot="reference"
                        on-click={() => {
                          if ((video.model_list?.length || 0) === 1) {
                            ImageViewer.show((video as any).model_list[0]?.images);
                          }
                        }}
                      >
                        {(video.model_list?.length || 0) === 1
                          ? (video.model_list || [])?.[0].flower_name || '--'
                          : '查看'}
                      </tg-button>
                    </el-popover>
                  ) : (
                    '暂未关联'
                  )}
                </div>
                <div class="mgl-18">
                  拍摄时间：{video.shooting_date?.replace(/-/g, '.') || '--'}
                </div>
              </div>
            </div>
            <div class="other-detail">
              <div
                class={`other-detail-item ${
                  VideoSortMap.get(VideoSortType.digg_count) ||
                  VideoSortMap.get(VideoSortType.digg_count_rate)
                }`}
              >
                <div class="count">
                  {this.formatCount(video.digg_count)}/{FD.formatEmpty(video.play_digg_ratio, '%')}
                </div>
                <div class="title">点赞量/率</div>
              </div>
              <div class={`other-detail-item ${VideoSortMap.get(VideoSortType.play_finish_ratio)}`}>
                <div class="count">
                  {video.play_finish_ratio !== null ? `${video.play_finish_ratio}%` : '--'}
                </div>
                <div class="title">完播率</div>
              </div>
              <div
                class={`other-detail-item ${
                  VideoSortMap.get(VideoSortType.comment_count) ||
                  VideoSortMap.get(VideoSortType.comment_count_rate)
                }`}
              >
                <div class="count">
                  {this.formatCount(video.comment_count)}/
                  {FD.formatEmpty(video.play_comment_ratio, '%')}
                </div>
                <div class="title">评论量/率</div>
              </div>
              <div class={`other-detail-item ${VideoSortMap.get(VideoSortType.new_fans_count)}`}>
                <div class="count">{this.formatCount(video.new_fans_count)}</div>
                <div class="title">新增粉丝量</div>
              </div>
              <div
                class={`other-detail-item ${
                  VideoSortMap.get(VideoSortType.share_count) ||
                  VideoSortMap.get(VideoSortType.share_count_rate)
                }`}
              >
                <div class="count">
                  {this.formatCount(video.share_count)}/
                  {FD.formatEmpty(video.play_share_ratio, '%')}
                </div>
                <div class="title">分享量/率</div>
              </div>
              <div class={`other-detail-item ${VideoSortMap.get(VideoSortType.play_avg_time)}`}>
                <div class="count">{FD.formatEmpty(video.play_avg_time, 's')}</div>
                <div class="title">平均时长 </div>
              </div>
            </div>
          </div>
        </div>
        <showModel ref="showModelRef" />
        <tg-mask-loading visible={this.reqHidden.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
