<template>
  <div class="top-10-wrapper">
    <tg-block class="flex-none" :bodyStyle="{ padding: '0' }" style="margin-bottom: 30px">
      <tg-tabs :tabs="tabs" v-model="checkedTab" @change="onTabChange" bottom />
    </tg-block>
    <div class="list-box">
      <ul class="top-list" v-loading="loading">
        <li v-for="item in list" :key="item.item_id" class="list-item">
          <img :src="item.image_url" alt="" />
          <div class="detail-box">
            <p class="name line-clamp-1">{{ item.title }}</p>
            <div class="sale-data">
              <p>
                售价：{{
                  item.discount_price === null
                    ? '--'
                    : formatPriceFormYuan(item.discount_price === 0 ? 0 : item.discount_price / 100)
                }}
              </p>
              <p v-if="activeIndex === 'gmv_desc'">
                销量：{{
                  item.sale_count === null
                    ? '--'
                    : numberFormat(Number(item.sale_count), 0, '.', ',')
                }}
              </p>
              <p v-else>
                销售额：{{
                  item.gmv === null
                    ? '--'
                    : formatPriceFormYuan(item.gmv === 0 ? 0 : item.gmv / 100)
                }}
              </p>
            </div>
            <div v-if="activeIndex === 'gmv_desc'" class="sales">
              销售额：{{
                item.gmv === null ? '--' : formatPriceFormYuan(item.gmv === 0 ? 0 : item.gmv / 100)
              }}（{{ item.gmv_part === null ? '--' : item.gmv_part + '%' }}）
            </div>
            <div v-else-if="activeIndex === 'click_rate_desc'" class="sales">
              点击率：{{ item.click_rate === null ? '--' : item.click_rate + '%' }}
            </div>
            <div v-else class="sales">
              转化率：{{ item.pay_rate === null ? '--' : item.pay_rate + '%' }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
.top-10-wrapper {
  ::-webkit-scrollbar {
    width: 6px !important;
    cursor: pointer;
  }
  .list-box {
    width: calc(100% + 10px);
    height: 490px;
    overflow: scroll;
  }
  .top-list {
    width: calc(100% - 16px);
    .list-item {
      height: 80px;
      margin-bottom: 30px;
      display: flex;
      img {
        width: 80px;
        height: 80px;
        display: block;
        border-radius: 4px;
        margin-right: 12px;
      }
      .detail-box {
        flex: 1;
        font-size: 12px;
        .name {
          height: 24px;
          margin-top: 4px;
          line-height: 16px;
          font-weight: 600;
          color: var(--text-color);
        }
        .sale-data {
          margin-top: 8px;
          display: flex;
          justify-content: space-between;
          color: var(--text-third-color);
          line-height: 14px;
        }
        .sales {
          margin-top: 9px;
          line-height: 14px;
          color: var(--text-color);
        }
      }
    }
  }
}
</style>
