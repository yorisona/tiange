<!--
 * @Author: 肖槿
 * @Date: 2021-12-02 13:16:22
 * @Description: 商品榜单
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-12-31 15:50:04
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\components\chart\goodsTop.vue
-->
<template>
  <div class="goods-top">
    <h2>{{ title }}</h2>
    <div class="goods-table-main">
      <h4 class="top-title">
        <span class="tixing"></span>
        <span class="text">{{ topTitle }}</span>
      </h4>
      <div v-if="this.tableData.length" class="goods-row">
        <div class="goods-column" v-for="item in tableData" :key="item.item_id">
          <img :src="item.image_url" />
          <div class="info">
            <h6>{{ item.title }}</h6>
            <div class="gmv">
              <span>售价：{{ formatPriceFormYuan(item.discount_price / 100) }}</span>
              <span>销量：{{ item.sale_count }}</span>
            </div>
            <div class="price">
              <span>销售额：{{ formatPriceFormYuan(item.gmv / 100) }}</span>
              <span>({{ item.gmv_part }}%)</span>
            </div>
          </div>
        </div>
      </div>
      <Empty v-else style="margin-top: 100px" />
    </div>
  </div>
</template>

<script>
import Empty from '@/modules/datacenter/components/empty/index.vue';
import formatPriceForm from '@/utils/formatData';
const { formatPriceFormYuan } = formatPriceForm;
export default {
  components: {
    Empty,
  },
  props: {
    title: {
      type: String,
      default: '畅销商品榜',
    },
    topTitle: {
      type: String,
      default: '爆款商品TOP10',
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    tableColumn: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formatPriceFormYuan,
  },
};
</script>

<style lang="less" scoped>
.goods-top {
  background: #fff;
  border-radius: 2px;
  padding: 18px;
  color: var(--text-color);
  font-size: 14px;

  & h2 {
    font-weight: 600;
    font-size: 14px;
    margin: 0 0 18px 0;
  }

  & .goods-table-main {
    border: 1px solid rgba(209, 216, 224, 0.6);
    border-radius: 8px;
    height: 534px;
    padding-bottom: 12px;

    & .top-title {
      width: 161px;
      height: 32px;
      border-radius: 0;
      margin: 0 auto;
      text-align: center;
      line-height: 32px;
      font-weight: 600;
      font-size: 14px;
      position: relative;

      & .tixing {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 3px;
        transform: perspective(5px) rotateX(-3deg);
        left: 0;
        background: #f3f9ff;
      }
      & .text {
        position: relative;
        z-index: 10;
      }
    }

    & .goods-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 30px;
      overflow-y: auto;
      height: 482px;
      padding: 0 18px;
      margin-top: 18px;
      & .goods-column {
        display: flex;
        & img {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          margin-right: 12px;
        }
        & .info {
          width: 212px;
          & h6 {
            font-weight: 400;
            font-size: 14px;
            margin-bottom: 24px;
            margin: 0;
            height: 38px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          & .gmv {
            font-size: 14px;
            margin: 3px 0;
            color: #a4b2c2;
            display: flex;
            justify-content: space-between;
          }
          & .price {
            font-size: 14px;
            color: rgba(60, 82, 105, 0.9);
          }
        }

        &:last-child {
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>
