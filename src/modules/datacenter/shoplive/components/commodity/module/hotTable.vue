<template>
  <div class="popular-top-table">
    <el-table height="1048" :data="list" border :row-style="rowStyle">
      <el-table-column type="index" label="排行" width="50" align="center"> </el-table-column>
      <el-table-column label="商品信息" min-width="320">
        <template slot-scope="scope">
          <div class="commodity-box" v-if="scope.row.item_id">
            <div class="pic-box">
              <el-image
                style="cursor: pointer"
                fit="contain"
                :src="scope.row.image_url || emptyGoods"
                @click="openDouyin(scope.row.item_id)"
              ></el-image>
            </div>
            <div class="info-box">
              <div class="id-line">
                <p class="commodity-id">{{ scope.row.item_id }}</p>
                <p class="rank" v-if="rank && scope.row.last_week_rank">
                  上周第{{ rankChinese(scope.row.last_week_rank) }}
                </p>
              </div>
              <p class="commodity-name" @click="openDouyin(scope.row.item_id)">
                {{ scope.row.title }}
              </p>
              <p class="code">{{ scope.row.item_sn ? scope.row.item_sn : '--' }}</p>
            </div>
          </div>
          <div v-else style="height: 80px; text-align: center; line-height: 80px">--</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="年份/季节" width="90" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.year ? scope.row.year : '其他' }}</div>
          <div>{{ seasonType(scope.row.season) }}</div>
        </template>
      </el-table-column> -->
      <el-table-column label="官方类目" min-width="82" align="center">
        <template slot-scope="scope">{{
          scope.row.first_tiange_cat +
          '-' +
          scope.row.second_tiange_cat +
          '-' +
          scope.row.third_tiange_cat
        }}</template>
      </el-table-column>
      <el-table-column label="单价 (元)" min-width="90" align="right">
        <template slot-scope="scope">{{
          formatPriceFormYuan(scope.row.discount_price / 100, 2, false)
        }}</template>
      </el-table-column>
      <el-table-column label="销量" min-width="75" align="right">
        <template slot-scope="scope">{{
          numberFormat(scope.row.shop_sale_count, 0, '.', ',')
        }}</template>
      </el-table-column>
      <el-table-column label="销售额 (元)" min-width="100" align="right">
        <template slot-scope="scope">{{
          formatPriceFormYuan(scope.row.shop_gmv / 100, 2, false)
        }}</template>
      </el-table-column>
      <el-table-column v-if="rank" label="发货前退款额 (元)" width="130" align="right">
        <template slot-scope="scope">{{
          formatPriceFormYuan(scope.row.shop_refund_status21_gmv / 100, 2, false)
        }}</template>
      </el-table-column>
      <el-table-column v-if="rank" label="发货前退款比例" width="120" align="right">
        <template slot-scope="scope">{{ scope.row.shop_refund_status21_gmv_rate }}%</template>
      </el-table-column>
      <el-table-column v-if="rank" width="100" align="right">
        <template slot="header" slot-scope="scope"
          >{{ scope.column.label }}
          <el-popover placement="top" trigger="hover" content="截止到今日凌晨库存">
            <span slot="reference">
              当日库存 <tg-icon name="ico-question" style="color: #939393" />
            </span>
          </el-popover>
        </template>
        <template slot-scope="scope">{{ scope.row.stock_num }}</template>
      </el-table-column>
      <template #empty>
        <empty-common detail-text="暂无数据"></empty-common>
      </template>
    </el-table>
  </div>
</template>

<script src="./hotTable.ts"></script>

<style lang="less" scoped>
.popular-top-table {
  ::-webkit-scrollbar {
    width: 6px !important;
    cursor: pointer;
  }
  /deep/.el-table__body-wrapper {
    // overflow-x: auto;
    // overflow-y: overlay;
    // .el-table__body {
    //   width: 100% !important;
    // }
  }
  // /deep/.el-table__body-wrapper,
  // /deep/.el-table__fixed {
  //   tbody tr td {
  //     padding: 0 !important;
  //     .cell {
  //       padding: 0 !important;
  //       line-height: 32px;
  //     }
  //   }
  // }
  /deep/.el-table tbody > tr > td {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  /deep/.el-table thead > tr > th {
    padding: 7px 10px;
    .cell {
      text-align: center;
    }
  }
  /deep/.el-table thead .el-table__cell:first-child .cell {
    padding-left: 0;
  }
  /deep/.el-table__empty-block {
    border-bottom: 2px solid #ebeef5;
  }
  .commodity-box {
    display: flex;
    .pic-box {
      width: 80px;
      height: 80px;
      margin-right: 10px;
      border-radius: 2px;
      overflow: hidden;
    }
    .info-box {
      flex: 1;
      .id-line {
        display: flex;
        justify-content: space-between;
        position: relative;
        .commodity-id {
          font-weight: 400;
          font-size: 12px;
          color: var(--text-third-color);
          line-height: 12px;
          margin-top: 6px;
        }
        .rank {
          width: 60px;
          height: 20px;
          position: absolute;
          right: 0;
          top: 0;
          line-height: 20px;
          background: #f04b4b;
          border-radius: 4px;
          text-align: center;
          color: #ffffff;
          font-weight: 600;
          font-size: 12px;
        }
      }
      .commodity-name {
        margin-top: 4px;
        font-size: 12px;
        height: 30px;
        line-height: 15px;
        display: -webkit-box;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        cursor: pointer;
        color: var(--text-color);
        font-weight: 600;
        &:hover {
          color: var(--theme-color);
        }
      }
      .code {
        font-weight: 400;
        font-size: 12px;
        color: var(--text-color);
        line-height: 12px;
        margin-top: 8px;
      }
    }
  }
}
</style>
