<template>
  <div v-loading="loading">
    <switchs v-if="list.length > 0" :showicon="list.length > 0 ? true : false" style="width: 100%">
      <!-- <template #pre v-if="list.length ? false : true">
      <i class="el-icon-arrow-left pre" @click="pre"></i>
    </template> -->
      <div class="itemBox">
        <template>
          <div class="item" v-for="(item, i) in list" :key="item">
            <div class="item-img">
              <img
                class="ranking"
                v-if="i < 3"
                :src="require(`@/assets/img/projectDetail/ranking${i + 1}.png`)"
                alt=""
              />
              <div class="failed" v-else>{{ i + 1 }}</div>
              <span class="second">连带成交</span>
              <span class="value">{{ item.suit_num }}<span style="font-size: 12px">套</span></span>
            </div>
            <div class="item-info">
              <div class="item-second" v-for="it in item.product" :key="it">
                <!-- <div class="logs"></div> -->
                <img
                  class="logs"
                  @click="toShopDetail(it.item_id)"
                  :src="it.image_url || emptyGoods"
                  alt=""
                />
                <div class="info">
                  <!-- <div class="title">{{ it.title }}</div> -->
                  <el-tooltip
                    :enterable="false"
                    :disabled="it.title.length > 20 ? false : true"
                    effect="dark"
                    :content="it.title"
                    placement="top"
                  >
                    <div class="title" @click="toShopDetail(it.item_id)">
                      {{ it.title.length > 21 ? get_folded_text(it.title, 21) : it.title }}
                    </div>
                  </el-tooltip>
                  <span class="second">讲解次数：{{ it.talk_times }}</span>
                  <div>
                    <span class="second">成交金额：</span>
                    <span class="value"
                      >¥ {{ numberMoneyFormat(it.gmv / 100, 2, '.', ',', false) }}</span
                    >
                  </div>
                </div>
              </div>
              <!-- <div class="item-second">
            <div class="logs"></div>
            <div class="info">
              <div class="title">波司登2022年新款ins风羽绒服潮酷工装风新款…</div>
              <span class="second">讲解次数：8</span>
              <div>
                <span class="second">成交金额：</span>
                <span class="value">¥ 99,999,999.99</span>
              </div>
            </div>
          </div> -->
            </div>
          </div>
        </template>
      </div>
      <!-- <template #next v-if="list.length ? false : true">
      <i class="el-icon-arrow-right next" @click="next"></i>
    </template> -->
    </switchs>
    <empty-common :imgWidth="150" :imgHeight="100" v-else detail-text="暂无数据"></empty-common>
  </div>
</template>

<script src="./setSales.ts"></script>
<style lang="less" scoped>
.itemBox {
  display: flex;
  align-items: center;
  height: 100%;
  // min-width: 1200px;
  min-height: 208px;
  justify-content: center;
  .item {
    width: 358px;
    height: 208px;
    border: 1px solid var(--border-line-div-color);
    border-radius: 4px;
    margin-right: 12px;
    display: flex;
    .item-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 29%;
      .ranking {
        width: 32px;
        height: 32px;
      }
      .failed {
        width: 24px;
        height: 24px;
        background: #f0f0f0;
        border-radius: 2px;
        text-align: center;
        line-height: 24px;
        font-family: AlibabaPuHuiTi_2_65_Medium;
        font-weight: 400;
        font-size: 13px;
        color: var(--text-third-color);
        letter-spacing: 0;
      }
      .second {
        font-weight: 400;
        font-size: 12px;
        color: var(--text-second-color);
        letter-spacing: 0;
      }
      .value {
        font-weight: 400;
        font-size: 16px;
        color: var(--text-color);
        letter-spacing: 0;
        text-align: center;
      }
    }
    .item-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      flex: 1;
      .second {
        font-weight: 400;
        font-size: 12px;
        color: var(--text-third-color);
      }
      .item-second {
        height: 80px;
        display: flex;
        .logs {
          width: 80px;
          height: 80px;
          cursor: pointer;
          border-radius: 2px;
          margin-right: 8px;
        }
        .info {
          display: flex;
          flex-direction: column;
          .title {
            white-space: normal;
            width: 156px;
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
  }
}
</style>
