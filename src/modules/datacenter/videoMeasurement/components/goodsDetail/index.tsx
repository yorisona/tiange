import { computed, defineComponent, PropType } from '@vue/composition-api';
import icon_video_goods_default2 from '@/assets/img/datacenter/icon_video_goods_default2.png';
import { VideoRecordGoodsItem } from '@/types/tiange/datacenter';
import formatPriceForm from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;

export default defineComponent({
  props: {
    showDetail: {
      type: Boolean,
      default: () => false,
    },
    noVideoCount: {
      type: Boolean,
      default: () => false,
    },
    showRank: {
      type: Boolean,
      default: () => false,
    },
    data: {
      type: Object as PropType<VideoRecordGoodsItem>,
    },
  },
  setup(props, ctx) {
    const goodsItem = computed(() => props.data);
    const computedShowDetail = computed(() => {
      return props.showDetail || goodsItem.value?.is_exist;
    });
    const methods = {
      formatPriceFormYuan,
    };
    return {
      goodsItem,
      computedShowDetail,
      ...methods,
    };
  },
  render() {
    const { goodsItem, computedShowDetail, showRank } = this;
    const rankClass = `tag tag-rank-${goodsItem?.item_rank}`;
    return (
      <div class="tg-goods-detail-container">
        <div class="goods-item-info">
          {/* <img
            class="goods-img"
            src={computedShowDetail ? goodsItem?.image_url : icon_video_goods_default2}
            alt=""
          /> */}
          <el-image
            class="goods-img"
            src={computedShowDetail ? goodsItem?.image_url : icon_video_goods_default2}
            // fit="contain"
          ></el-image>
          {computedShowDetail ? (
            <div class="goods-detail">
              <div class="goods-name">
                {showRank && goodsItem?.item_rank && (goodsItem?.item_rank || 0) < 11 && (
                  <span class={rankClass}>TOP {goodsItem?.item_rank}</span>
                )}
                <el-popover
                  popper-class="video-measurement-goods-detail-component-popover"
                  // width={360}
                  disabled={!goodsItem?.title}
                  placement="top"
                  trigger="hover"
                  open-delay={300}
                  content={goodsItem?.title || '--'}
                >
                  <span slot="reference" class="name line-clamp-1">
                    {goodsItem?.title || '--'}
                  </span>
                </el-popover>
              </div>
              <div class="goods-desc">
                <span class="line-clamp-1" style="word-break: break-all">
                  {goodsItem?.project_name || '--'}
                </span>
                <span class="line-clamp-1" style="word-break: break-all">
                  {goodsItem?.sn || '--'}
                </span>
                <span class="line-clamp-1" style="word-break: break-all">
                  {goodsItem?.second_cname || '--'}
                </span>
              </div>
              <div class="goods-sale-time">
                首次销售时间：{goodsItem?.first_sale_date?.replace(/-/g, '.') || '--'}
              </div>
            </div>
          ) : (
            <div class="goods-detail">
              <div class="no-detail-project-name">项目名称：{goodsItem?.project_name || '--'}</div>
              <div class="no-detail-goods-no mgt-6">商品款号：{goodsItem?.sn || '--'}</div>
            </div>
          )}
        </div>
        {computedShowDetail ? (
          <div class="goods-item-grid">
            <div>
              销售额：
              {goodsItem?.gmv !== null && goodsItem?.gmv !== undefined
                ? formatPriceFormYuan(goodsItem.gmv / 100, 2, true)
                : '--'}
            </div>
            <div>销量：{goodsItem?.sale_count !== null ? goodsItem?.sale_count : '--'}</div>
            <div>讲解次数：{goodsItem?.talk_times !== null ? goodsItem?.talk_times : '--'}</div>
            <div>点击率：{goodsItem?.click_rate !== null ? `${goodsItem?.click_rate}%` : '--'}</div>
            <div>转化率：{goodsItem?.pay_rate !== null ? `${goodsItem?.pay_rate}%` : '--'}</div>
            {!this.noVideoCount && (
              <div>关联视频：{goodsItem?.video_count !== null ? goodsItem?.video_count : '--'}</div>
            )}
          </div>
        ) : (
          <div class="no-detail-desc">— 暂无商品数据 —</div>
        )}
      </div>
    );
  },
});
