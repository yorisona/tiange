/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-28 13:29:24
 */
import { computed, defineComponent, PropType } from '@vue/composition-api';
import funnel_item_1 from '@/assets/img/datacenter/funnel_item_1.png';
import funnel_item_2 from '@/assets/img/datacenter/funnel_item_2.png';
import funnel_item_3 from '@/assets/img/datacenter/funnel_item_3.png';
import funnel_item_4 from '@/assets/img/datacenter/funnel_item_4.png';
import funnel_item_5 from '@/assets/img/datacenter/funnel_item_5.png';
import funnel_item_arrow_bottom from '@/assets/img/datacenter/funnel_item_arrow_bottom.png';
import funnel_item_arrow_right from '@/assets/img/datacenter/funnel_item_arrow_right.png';
import funnel_item_arrow_top from '@/assets/img/datacenter/funnel_item_arrow_top.png';
import { formatAmount } from '@/utils/string';
import Empty from '@/modules/datacenter/components/empty/index.vue';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
  },
  components: {
    Empty,
  },
  setup(props) {
    const computedData = computed(() => {
      const tempData = props.data ?? [];
      const isEvery = tempData.every(el => el === null || el === undefined);
      return isEvery ? [] : tempData;
    });
    const methods = {
      formatAmount,
    };
    return {
      computedData,
      ...methods,
    };
  },
  render() {
    const [live_bg_num, live_watch_num, goods_gb_num, goods_click_num, deal_num] =
      this.computedData;
    const gb_deal_radio = live_bg_num
      ? `${this.formatAmount((deal_num * 100) / live_bg_num, 'None')}%`
      : '--';
    const gb_watch_radio = live_bg_num
      ? `${this.formatAmount((live_watch_num * 100) / live_bg_num, 'None')}%`
      : '--';
    const watch_goods_radio = live_watch_num
      ? `${this.formatAmount((goods_gb_num * 100) / live_watch_num, 'None')}%`
      : '--';
    const goods_bg_click_radio = goods_gb_num
      ? `${this.formatAmount((goods_click_num * 100) / goods_gb_num, 'None')}%`
      : '--';
    const goods_click_deal_radio = goods_click_num
      ? `${this.formatAmount((deal_num * 100) / goods_click_num, 'None')}%`
      : '--';

    return (
      <div class="tg-datacenter-shoplive-funnel">
        {this.computedData.length ? (
          <div class="funnel-data">
            <section class="funnel-line-left">
              <img class="line-part-top" src={funnel_item_arrow_top} alt="" />
              <div class="line-text-container">
                <div class="value">{gb_deal_radio}</div>
                <div class="label">曝光-成交转化率(人数)</div>
              </div>
              <img class="line-part-bottom" src={funnel_item_arrow_bottom} alt="" />
            </section>
            <section class="funnel-items">
              <div class="item" style="width: 360px;">
                <img class="img" src={funnel_item_1} alt="" />
                <span class="text">
                  直播间曝光人数：{live_bg_num ? this.formatAmount(live_bg_num, 'None', true) : 0}
                </span>
              </div>
              <div class="item" style="width: 337px;">
                <img class="img" src={funnel_item_2} alt="" />
                <span class="text">
                  直播间观看人数：
                  {live_watch_num ? this.formatAmount(live_watch_num, 'None', true) : 0}
                </span>
              </div>
              <div class="item" style="width: 313px;">
                <img class="img" src={funnel_item_3} alt="" />
                <span class="text">
                  商品曝光人数：{goods_gb_num ? this.formatAmount(goods_gb_num, 'None', true) : 0}
                </span>
              </div>
              <div class="item" style="width: 289px;">
                <img class="img" src={funnel_item_4} alt="" />
                <span class="text">
                  商品点击人数：
                  {goods_click_num ? this.formatAmount(goods_click_num, 'None', true) : 0}
                </span>
              </div>
              <div class="item" style="width: 265px;">
                <img class="img" src={funnel_item_5} alt="" />
                <span class="text">
                  成交人数：{deal_num ? this.formatAmount(deal_num, 'None', true) : 0}
                </span>
              </div>
            </section>
            <section class="funnel-line-right">
              <div class="line-container">
                <img src={funnel_item_arrow_right} alt="" />
                <div>
                  <div class="value">{gb_watch_radio}</div>
                  <div class="label">曝光-观看率(人数)</div>
                </div>
              </div>
              <div class="line-container">
                <img src={funnel_item_arrow_right} alt="" />
                <div>
                  <div class="value">{watch_goods_radio}</div>
                  <div class="label">观看-商品曝光率(人数)</div>
                </div>
              </div>
              <div class="line-container">
                <img src={funnel_item_arrow_right} alt="" />
                <div>
                  <div class="value">{goods_bg_click_radio}</div>
                  <div class="label">商品曝光-点击率(人数)</div>
                </div>
              </div>
              <div class="line-container">
                <img src={funnel_item_arrow_right} alt="" />
                <div>
                  <div class="value">{goods_click_deal_radio}</div>
                  <div class="label">商品点击-成交转化率(人数)</div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div class="funnel-data">
            <empty style="margin-top: 22px;" />
          </div>
        )}
      </div>
    );
  },
});
