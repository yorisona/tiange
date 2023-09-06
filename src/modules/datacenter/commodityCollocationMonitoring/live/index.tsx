import {
  defineComponent,
  onMounted,
  inject,
  set,
  ref,
  reactive,
  computed,
} from '@vue/composition-api';
import videoInfo from '@/modules/datacenter/videoMeasurement/components/videoInfo/index.vue';
import {
  QueryCTRProjects,
  Query_Video_Item_Detail_V2,
  query_shop_live_product_explain_detail,
  AutomaticInsertExplainCombination,
} from '@/services/datacenter';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import ImageViewer from '@/components/Image/ImageViewer';
import collocationSettings from '../dialog/collocationSettings/index.vue';
import { useDialog } from '@/use/dialog';
import moment from 'moment';
import formatData from '@/utils/formatData';
import playerContainer from './player.vue';
import goodsEmpty from '@/assets/img/goods-empty.png';
import { Message } from 'element-ui';
import { Confirm } from '@/use/asyncConfirm';

export default defineComponent({
  components: {
    videoInfo,
    playerContainer,
  },
  setup(props, ctx) {
    const formData = inject<any>('formData');

    const reqProjectList = useRequest(QueryCTRProjects, { manual: true });
    const reqVideoList = usePagination(query_shop_live_product_explain_detail, {
      manual: true,
      transform(data) {
        data.data.forEach(item => {
          set(item, 'item_index', 0);
        });
        return data.data;
      },
      onSuccess() {
        batchSettings.choose = [];
        batchSettings.hasEdit = false;
      },
    });
    const isShowAssociate = ref(false);
    const order_by = ref(E.datacenter.ExplainOrderKeyType.explain_datetime);
    const batchSettings = reactive({
      hasEdit: false,
      choose: [] as number[],
    });
    const isAll = computed(() => {
      if (batchSettings.choose.length === 0) return false;
      if (batchSettings.choose.length !== reqVideoList.data?.length) return false;
      return true;
    });

    const dialogCollocationSettings = useDialog({
      component: collocationSettings,
      title: '搭配设置',
      width: 420,
      on: {
        submit() {
          reqVideoList.reload();
          batchSettings.choose = [];
          batchSettings.hasEdit = false;
        },
      },
    });

    const reqVideoItemDetail = useRequest(Query_Video_Item_Detail_V2, { manual: true });
    const methods = {
      queryVideoList() {
        const { date, ...other } = formData;
        let [start_date, end_date] = date;
        if (start_date) {
          start_date = moment(start_date).format('YYYY-MM-DD');
        }
        if (end_date) {
          end_date = moment(end_date).format('YYYY-MM-DD');
        }
        reqVideoList.runAsync(
          {
            num: reqVideoList.pagination.num,
            page_num: 1,
          },
          {
            ...other,
            start_date,
            end_date,
            order_by: order_by.value,
            is_combination: isShowAssociate.value ? 0 : undefined,
          },
        );
      },
      onQuery() {
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
    };

    onMounted(() => {
      methods.onQuery();
      // methods.getQueryDouyinReportProjects();
    });

    const onSearch = () => {
      methods.onQuery();
    };
    const playerRef = ref<any>();
    (ctx.parent as any).setSearchFN(onSearch);

    return {
      playerRef,
      formData,
      reqProjectList,
      reqVideoList,
      reqVideoItemDetail,
      dialogCollocationSettings,
      order_by,
      batchSettings,
      ...methods,
      isAll,
      isShowAssociate,
    };
  },
  render() {
    const reqVideoList = this.reqVideoList;
    const { batchSettings, order_by } = this;
    return (
      <div class="tg-page-container">
        <div class="sort-box">
          <span class="label">排序：</span>
          <div class="sort">
            {E.datacenter.ExplainOrderKeyTypeOption.map(item => {
              return (
                <span
                  class={`${item.value === this.order_by}`}
                  onclick={() => {
                    this.order_by = item.value;
                    this.queryVideoList();
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </div>
          <div class="filter-associate">
            <el-checkbox v-model={this.isShowAssociate} onChange={this.queryVideoList}>
              仅显示未配置
            </el-checkbox>
          </div>
          <fill />
          <setting-box>
            {batchSettings.hasEdit && (
              <el-checkbox
                value={this.isAll}
                onChange={() => {
                  if (this.isAll) {
                    batchSettings.choose = [];
                  } else {
                    batchSettings.choose = (reqVideoList.data || []).map((_, index) => {
                      return index;
                    });
                  }
                }}
              >
                全选
              </el-checkbox>
            )}
            <tg-button
              onClick={() => {
                Confirm({
                  title: '确定要自动搭配吗？',
                  content: '本次自动匹配需要3~5分钟时间',
                }).then(() => {
                  const { date, ...other } = this.formData;
                  let [start_date, end_date] = date;
                  if (start_date) {
                    start_date = moment(start_date).format('YYYY-MM-DD');
                  }
                  if (end_date) {
                    end_date = moment(end_date).format('YYYY-MM-DD');
                  }
                  AutomaticInsertExplainCombination({
                    start_date,
                    end_date,
                    ...other,
                  }).then(res => {
                    if (res.data.success) {
                      Message.success('操作成功');
                      this.queryVideoList();
                    } else {
                      Message.error(res.data.message);
                    }
                  });
                });
              }}
            >
              自动搭配
            </tg-button>
            <tg-button
              onClick={() => {
                if (batchSettings.hasEdit === true) {
                  if (batchSettings.choose.length === 0) {
                    Message.warning('至少需要选择一个讲解');
                    return;
                  }
                  const list = batchSettings.choose.map(index => {
                    return (reqVideoList.data || [])[index];
                  });
                  this.dialogCollocationSettings.show(list, this.formData.project_id);
                }
                batchSettings.hasEdit = true;
              }}
              type={batchSettings.hasEdit ? 'primary' : undefined}
            >
              批量搭配
            </tg-button>
            {batchSettings.hasEdit && (
              <tg-button
                onClick={() => {
                  batchSettings.hasEdit = false;
                  batchSettings.choose = [];
                }}
              >
                取消设置
              </tg-button>
            )}
          </setting-box>
        </div>

        <div
          class={`tg-page-body ${batchSettings.hasEdit ? 'edit' : ''}`}
          style={`${reqVideoList.data?.length === 0 ? 'background:#fff' : ''}`}
        >
          {reqVideoList.data?.map((item, key) => {
            let currentGood: typeof item.item_list[0] | undefined;
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
              <div
                class={`live-item-box combination-type-${item.combination_type} ${
                  batchSettings.choose.includes(key) && 'selected'
                }`}
                key={key}
                onClick={() => {
                  if (!batchSettings.hasEdit) return;
                  const index = batchSettings.choose.indexOf(key);
                  console.log('ind', index);
                  if (index === -1) {
                    batchSettings.choose.push(key);
                  } else {
                    batchSettings.choose.splice(index, 1);
                  }
                }}
              >
                <div class="live-check">
                  <el-checkbox value={batchSettings.choose.includes(key)} />
                </div>
                <div class="live-box">
                  {item.stream_screenshot ? (
                    <el-image
                      key={item.combination_id}
                      src={item.stream_screenshot}
                      class="video-img"
                    />
                  ) : (
                    <div class="video-img no">没有封面</div>
                  )}
                  {item.stream_url && (
                    <img
                      src={require('@/assets/img/dataAnalysis/play.png')}
                      alt=""
                      class="play"
                      onclick={() => {
                        this.playerRef.show(item);
                      }}
                    />
                  )}

                  {item.stream_screenshot && (
                    <div
                      class="enlarge-box"
                      onClick={() => ImageViewer.show([item.stream_screenshot])}
                    >
                      <tg-icon name="ico-common-enlarge" class="enlarge" />
                      预览
                    </div>
                  )}
                </div>
                <div class="live-info">
                  <div class="live-info-top">
                    讲解时间: <b>{timeText}</b>
                  </div>
                  <div class="live-info-middle">
                    <img key={item.combination_id} src={item.image_url} alt="" />
                    <div class="title">{formatData.formatEmpty(item.product_name)}</div>
                    <div>{formatData.formatEmpty(item.product_id)}</div>
                    <div>{formatData.formatEmpty(item.product_sn)}</div>
                  </div>
                  <div class="live-info-bottom">
                    <div class={`item ${order_by === E.datacenter.ExplainOrderKeyType.num_change}`}>
                      <span>{item.num_change}</span>
                      <span>人数变化</span>
                    </div>
                    <div
                      class={`item ${order_by === E.datacenter.ExplainOrderKeyType.incr_fans_cnt}`}
                    >
                      <span>{item.incr_fans_cnt}</span>
                      <span>新增粉丝</span>
                    </div>
                    <div
                      class={`item ${
                        order_by === E.datacenter.ExplainOrderKeyType.avg_online_person
                      }`}
                    >
                      <span>{item.avg_online_person}</span>
                      <span>平均在线人数</span>
                    </div>
                    <div
                      class={`item ${order_by === E.datacenter.ExplainOrderKeyType.comment_cnt}`}
                    >
                      <span>{item.comment_cnt}</span>
                      <span>评论数</span>
                    </div>
                  </div>
                </div>
                <div class="live-side">
                  <div class="setting">
                    <tg-button
                      type="link"
                      onClick={() =>
                        this.dialogCollocationSettings.show(item, this.formData.project_id)
                      }
                    >
                      搭配设置
                    </tg-button>
                  </div>
                  <div class="goods-box">
                    <div class="status">
                      {item.combination_type === E.datacenter.CombinationType.use_recommend
                        ? '推荐'
                        : '非推荐'}
                    </div>
                    {item.item_list.length === 0 && (
                      <empty-common
                        img-width="150"
                        img-height={60}
                        detail-text={
                          item.combination_type === E.datacenter.CombinationType.not_use_combination
                            ? '没有使用搭配'
                            : '未设置关联搭配'
                        }
                      />
                    )}
                    <div class="goods">
                      {item.item_list.map((_, key) => {
                        if (key === item.item_index) {
                          currentGood = _;
                        }
                        return (
                          <div
                            class={`good-img ${key === item.item_index && 'selected'}`}
                            onclick={() => {
                              set(item, 'item_index', key);
                            }}
                          >
                            <img src={_.image_url ? _.image_url : goodsEmpty} />
                            {/*<span>非推荐</span>*/}
                          </div>
                        );
                      })}
                    </div>
                    <div class="good-detail">
                      {currentGood && (
                        <fragments>
                          <span>{formatData.formatEmpty(currentGood.product_name)}</span>
                          <span>{formatData.formatEmpty(currentGood.product_id)}</span>
                          <span>{formatData.formatEmpty(currentGood.product_sn)}</span>
                        </fragments>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {reqVideoList.data?.length === 0 && (
            <empty-common detail-text="暂无讲解" style="margin-top:150px" />
          )}
        </div>
        {!batchSettings.hasEdit && (
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
        )}

        <player-container ref="playerRef" />
      </div>
    );
  },
});
