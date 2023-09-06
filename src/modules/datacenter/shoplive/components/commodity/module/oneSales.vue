<!--
 * @Author       : yunie
 * @Date         : 2022-07-22 16:32:42
 * @LastEditTime : 2022-07-26 15:38:11
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\module\oneSales.vue
 * @Description  :
-->
<template>
  <div v-loading="loading">
    <template v-if="list.length > 0">
      <div class="main-box" style="margin-bottom: 18px" v-for="(item, key) in list" :key="item">
        <div class="lt">
          <!-- <div class="num" :style="{ color: color[key] }">{{ key + 1 }}</div> -->
          <img class="num" :src="require(`@/assets/img/projectDetail/num${key + 1}.png`)" alt="" />
          <div class="item-second">
            <img
              class="logs"
              @click="toShopDetail(item.item_id)"
              :src="item.image_url || emptyGoods"
              alt=""
            />
            <div class="info">
              <el-tooltip
                :enterable="false"
                :disabled="item.title.length > 20 ? false : true"
                effect="dark"
                :content="item.title"
                placement="top"
              >
                <div class="title" @click="toShopDetail(item.item_id)">
                  {{ item.title.length > 21 ? get_folded_text(item.title, 21) : item.title }}
                </div>
              </el-tooltip>
              <span class="second">讲解次数：{{ item.talk_times }}</span>
              <div>
                <span class="second">成交金额：</span>
                <span class="value"
                  >¥ {{ numberMoneyFormat(item.gmv / 100, 2, '.', ',', false) }}</span
                >
              </div>
              <div>
                <span class="second">连带销售件数：</span>
                <span class="value">{{ item.relation_num }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rt">
          <switchs :ref="`switchs${key}`">
            <!-- @click="$refs['switchs'].prevDate()" -->
            <template #pre>
              <tg-button class="time-btn" type="link" @click="pre(`switchs${key}`)">
                <tg-icon name="ico-arrow-left"></tg-icon>
              </tg-button>
            </template>
            <div class="itemBox">
              <div class="item" v-for="it in item.sub_list" :key="it">
                <!-- <div class="img"></div> -->
                <img
                  @click="toShopDetail(it.item_id)"
                  class="img"
                  style="cursor: pointer"
                  :src="it.image_url"
                  alt=""
                />
                <div>
                  <span class="second">连带销售件数：</span>
                  <span class="value">{{ it.item_num }}</span>
                </div>
              </div>
            </div>
            <template #next>
              <tg-button class="time-btn" type="link" @click="next(`switchs${key}`)">
                <tg-icon name="ico-arrow-right"></tg-icon>
              </tg-button>
            </template>
          </switchs>
        </div>
      </div>
    </template>
    <empty-common v-else :imgWidth="150" :imgHeight="100" detail-text="暂无数据"></empty-common>
  </div>
</template>

<script src="./oneSales.ts"></script>
<style lang="less" scoped>
.main-box {
  display: flex;
  column-gap: 14px;
  // margin-bottom: 18px;
  padding: 0 1%;
  .lt {
    width: 23%;
    min-width: 323px;
    height: 130px;
    border: 1px solid var(--border-line-div-color);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    column-gap: 18px;
    .num {
      // font-family: AlibabaPuHuiTi_2_65_Medium;
      // font-weight: 500;
      // font-size: 16px;
      // color: #ff4d79;
      // letter-spacing: 0;
      width: 16px;
      height: 13px;
      text-align: center;
    }
    .item-second {
      // height: 80px;
      display: flex;
      .logs {
        width: 98px;
        height: 98px;
        border-radius: 2px;
        margin-right: 8px;
        cursor: pointer;
      }
      .info {
        display: flex;
        flex-direction: column;
        .title {
          white-space: normal;
          // width: 155px;

          font-weight: 600;
          font-size: 12px;
          color: var(--text-color);
          line-height: 14px;
          margin-bottom: 8px;
          &:hover {
            color: var(--theme-color);
            cursor: pointer;
          }
        }
        .value {
          font-weight: 400;
          font-size: 12px;
          color: var(--text-color);
        }
      }
    }
  }
  .rt {
    width: 76%;
    display: flex;
    min-width: 600px;
    align-items: center;
  }
}
.second {
  font-weight: 400;
  font-size: 12px;
  color: var(--text-third-color);
}
.itemBox {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
  margin-left: -15px;
  .item {
    min-width: 110px;
    height: 105px;
    margin-right: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 5px;
    .img {
      width: 80px;
      height: 80px;
      border-radius: 2px;
      margin-bottom: 6px;
    }
    .value {
      font-weight: 400;
      font-size: 12px;
      color: var(--text-color);
    }
  }
}
.time-btn {
  height: 28px;
  width: 28px;
  border: 1px solid fade(#a4b2c2, 30);
  border-radius: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  .icon {
    color: #6a7b92;
  }
  &:hover {
    border-color: var(--theme-color);
    .icon {
      color: var(--theme-color);
    }
  }
  &[disabled] {
    border-color: #e3e8ec;
    .icon {
      color: #e3e8ec;
    }
  }
}
</style>
