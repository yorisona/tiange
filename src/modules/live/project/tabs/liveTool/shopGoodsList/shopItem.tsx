import { defineComponent, PropType } from '@vue/composition-api';
import { FD } from '@/utils/formatData';
import { useDialog } from '@/use/dialog';
import modifySelectionGoods from '@/modules/live/project/dialog/modifySelectionGoods/index.vue';
import { useRequest } from '@gm/hooks/ahooks';
import { add_store_product, delete_store_product } from '@/services/live';
import { useRouter } from '@/use/vue-router';
import { Message } from 'element-ui';
export type LiveToolProductUpdateType = 'add' | 'subtract' | 'edit' | 'none';
export default defineComponent({
  props: {
    readonly: {
      type: Boolean,
      default: () => false,
    },
    sortType: {
      type: Number as PropType<E.project.LiveToolGoodsSortType>,
    },
    isStored: {
      type: Boolean,
      default: () => false,
    },
    showRank: {
      type: Boolean,
      default: () => false,
    },
    showOtherInfo: {
      type: Boolean,
      default: () => false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const reqAdd = useRequest(add_store_product, { manual: true });
    const reqDelete = useRequest(delete_store_product, { manual: true });
    const methods = {
      emitUpdate(type: LiveToolProductUpdateType) {
        ctx.emit('updated', type);
      },
      async onAddOrRemoveHandler() {
        if (props.isStored) {
          const res = await reqDelete.runAsync({
            project_id,
            product_id: props.data?.product_id,
          });
          if (res.data.success) {
            Message.success(res.data.message || '移出商品成功');
            // ctx.emit('updated');
            methods.emitUpdate('subtract');
          } else {
            Message.success(res.data.message || '移出商品失败');
          }
        } else {
          const res = await reqAdd.runAsync({
            project_id,
            product_id: props.data?.product_id,
            amount: props.data?.amount,
            sell_point: props.data?.sell_point,
          });
          if (res.data.success) {
            Message.success(res.data.message || '添加商品成功');
            // ctx.emit('updated');
            methods.emitUpdate('add');
          } else {
            Message.success(res.data.message || '添加商品失败');
          }
        }
      },
    };
    const dialogModifySelectionGoods = useDialog({
      component: modifySelectionGoods,
      title: '编辑商品',
      width: 500,
      okText: '确定',
      on: {
        submit() {
          // ctx.emit('updated');
          methods.emitUpdate('edit');
        },
      },
    });
    return { dialogModifySelectionGoods, ...methods };
  },
  render() {
    const {
      data,
      showOtherInfo,
      showRank,
      sortType,
      readonly,
      isStored,
      dialogModifySelectionGoods,
      onAddOrRemoveHandler,
    } = this;
    const rankClass = `tag tag-rank-${data?.item_rank}`;
    return (
      <div class="tg-shop-item-page-container">
        <section class="goods-summary">
          <div>
            <el-image src={data?.product_pic?.[0]}></el-image>
          </div>
          <div class="goods-summary-right">
            <div class="rank-name-field">
              <div class="rank-name">
                {/*<span class="rank">top1</span>*/}
                {showRank && data?.item_rank && (data?.item_rank || 0) < 11 && (
                  <span class={rankClass}>TOP {data?.item_rank}</span>
                )}
                {/*<span class="name">播2022夏季新款宽松休闲松紧腰提花半裙提花蓬蓬裙女BDP2BD</span>*/}
                <el-popover
                  popper-class="live-tool-shop-item-goods-name-component-popover"
                  // width={360}
                  disabled={!data?.product_name}
                  placement="top"
                  trigger="hover"
                  open-delay={300}
                  content={data?.product_name || '--'}
                >
                  <span slot="reference" class="name line-clamp-1">
                    {data?.product_name || '--'}
                  </span>
                </el-popover>
              </div>
              {!readonly && (
                <tg-button
                  size="mini"
                  class="product-operator"
                  type={isStored ? 'default' : 'primary'}
                  onClick={onAddOrRemoveHandler}
                >
                  {isStored ? '移出商品库' : '加入商品库'}
                </tg-button>
              )}
            </div>
            <div class="goods-summary-detail">
              <div class="label-value line-clamp-1">款号：{FD.formatEmpty(data?.sn)}</div>
              <div class="label-value line-clamp-1">品类：{FD.formatEmpty(data?.first_name)}</div>
              <div class="label-value">
                吊牌价：{FD.formatPriceFormYuan(data?.reference_price, 2, true)}
              </div>
              <div class="label-value">
                昨日直播价：{FD.formatPriceFormYuan(data?.discoount_price, 2, true)}
              </div>
              <div class="label-value">当前库存：{FD.formatEmpty(data?.stock_num)}</div>
              <div class="label-value">讲解次数：{FD.formatEmpty(data?.talk_times)}</div>
              <div class="label-value">单次讲解销量：{FD.formatEmpty(data?.talk_times_sale)}</div>
            </div>
          </div>
        </section>
        <section class="goods-detail">
          <div class="display-list">
            <div class="item" active={sortType === E.project.LiveToolGoodsSortType.Sales}>
              <div class="value">
                {FD.formatPriceToThousand(data?.last_7day_sale_count, 0, false)}
              </div>
              <div class="label">销量</div>
            </div>
            <div class="item" active={sortType === E.project.LiveToolGoodsSortType.SalesAmount}>
              <div class="value">
                {FD.formatPriceFormYuan(data?.last_7day_sale_amount, 2, true)}
              </div>
              <div class="label">销售额</div>
            </div>
            <div class="item">
              <div class="value">{FD.formatEmpty(data?.combination_count)}</div>
              <div class="label">搭配销售</div>
            </div>
            <div class="item" active={sortType === E.project.LiveToolGoodsSortType.ClickRate}>
              <div class="value">
                {FD.formatEmpty(data?.last_7day_click_rate) +
                  (FD.isEmpty(data?.last_7day_click_rate) ? '' : '%')}
              </div>
              <div class="label">点击率</div>
            </div>
            <div class="item" active={sortType === E.project.LiveToolGoodsSortType.PayRate}>
              <div class="value">
                {FD.formatEmpty(data?.last_7day_pay_rate) +
                  (FD.isEmpty(data?.last_7day_pay_rate) ? '' : '%')}
              </div>
              <div class="label">转化率</div>
            </div>
            <div
              class="item"
              active={sortType === E.project.LiveToolGoodsSortType.MeasurementIndex}
            >
              <div class={(data?.measurement_index || 0) < 100 ? 'value green' : 'value orange'}>
                {FD.formatEmpty(data?.measurement_index)}
              </div>
              <div class="label">测款综合指数</div>
            </div>
            <div class="item" active={sortType === E.project.LiveToolGoodsSortType.PotentialIndex}>
              <div class={(data?.potential_index || 0) < 100 ? 'value green' : 'value orange'}>
                {FD.formatEmpty(data?.potential_index)}
              </div>
              <div class="label">潜力指数</div>
            </div>
            <div class="item" active={sortType === E.project.LiveToolGoodsSortType.PopularIndex}>
              <div class={(data?.popular_index || 0) < 100 ? 'value green' : 'value orange'}>
                {FD.formatEmpty(data?.popular_index)}
              </div>
              <div class="label">受欢迎指数</div>
            </div>
          </div>
          {showOtherInfo && (
            <fragments>
              <div class="line"></div>
              <div class="other-info">
                <div class="left">
                  <div>直播定价：{FD.formatPriceFormYuan(data?.amount, 2, true)}</div>
                  <div>上架顺序：{FD.formatEmpty(data?.listed_index)}</div>
                  <div>卖点：{FD.formatEmpty(data?.sell_point)}</div>
                </div>
                {!readonly && (
                  <tg-icon
                    class="right"
                    name="ico-common-bianji-linear"
                    onClick={() => {
                      dialogModifySelectionGoods.show(data);
                    }}
                  ></tg-icon>
                )}
              </div>
            </fragments>
          )}
        </section>
      </div>
    );
  },
});
