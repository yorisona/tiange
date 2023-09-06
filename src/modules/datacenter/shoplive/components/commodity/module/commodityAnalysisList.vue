<template>
  <div class="commodity-analysis-system">
    <div class="first-category-box">品类销售分析</div>
    <div class="category-table">
      <tg-table
        highlight-current-row
        v-loading="loading"
        :data="list"
        @row-click="onRowClick"
        ref="tableSystemAnalysisRef"
        :row-key="row => getRowKey(row)"
        border
        :row-style="rowHightlight"
        default-expand-all
        :class="!showSort ? 'hasShowSort' : ''"
        :default-sort="{ prop: 'shop_gmv', order: 'descending' }"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
        :show-summary="false"
        :summary-method="getSummaries"
        height="100%"
      >
        <el-table-column
          prop="category_name"
          label="二级类目"
          min-width="130"
          fixed="left"
          :label-class-name="showSort ? 'check-label' : ''"
        >
          <template slot-scope="scope">
            <el-tooltip
              :enterable="false"
              :disabled="scope.row.category_name.length > 6 ? false : true"
              class="item"
              effect="dark"
              :content="scope.row.category_name"
              placement="top"
            >
              <span>{{
                scope.row.category_name.length > 6
                  ? get_folded_text(scope.row.category_name, 6)
                  : scope.row.category_name
              }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="third_tiange_cat_name"
          label="三级类目"
          min-width="110"
          fixed="left"
          :label-class-name="showSort ? 'check-label' : ''"
        >
          <template slot-scope="scope">
            <el-tooltip
              :enterable="false"
              :disabled="scope.row.third_tiange_cat_name.length > 6 ? false : true"
              class="item"
              effect="dark"
              :content="scope.row.third_tiange_cat_name"
              placement="top"
            >
              <span>{{
                scope.row.third_tiange_cat_name.length > 6
                  ? get_folded_text(scope.row.third_tiange_cat_name, 6)
                  : scope.row.third_tiange_cat_name
              }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="款数"
          min-width="110"
          align="center"
          prop="item_count"
          :label-class-name="showSort ? 'check-label' : ''"
        >
          <template slot-scope="scope">
            {{
              scope.row.item_count !== null
                ? numberFormat(Number(scope.row.item_count), 0, '.', ',')
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="店铺销量"
          min-width="110"
          prop="shop_sale_count"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_sale_count !== null
                ? numberFormat(Number(scope.row.shop_sale_count), 0, '.', ',')
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="店铺销售额 (元)"
          min-width="150"
          prop="shop_gmv"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_gmv !== null
                ? formatPriceFormYuan(
                    scope.row.shop_gmv === 0 ? 0 : scope.row.shop_gmv / 100,
                    2,
                    false,
                  )
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="平均件单价 (元)"
          min-width="150"
          prop="shop_sale_price_avg"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_sale_price_avg !== (null || undefined)
                ? formatPriceFormYuan(
                    scope.row.shop_sale_price_avg === 0 ? 0 : scope.row.shop_sale_price_avg / 100,
                    2,
                    false,
                  )
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="店铺销售额占比"
          min-width="140"
          prop="shop_gmv_rate"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_gmv_rate !== null
                ? numberFormat(Number(scope.row.shop_gmv_rate), 2) + '%'
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="发货前退款销售额 (元)"
          min-width="180"
          prop="shop_refund_status21_gmv"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_refund_status21_gmv !== null &&
              scope.row.shop_refund_status21_gmv !== undefined
                ? formatPriceFormYuan(
                    scope.row.shop_refund_status21_gmv === 0
                      ? 0
                      : scope.row.shop_refund_status21_gmv / 100,
                    2,
                    false,
                  )
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="发货前退款销售额占比"
          min-width="180"
          prop="shop_refund_status21_gmv_rate"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_refund_status21_gmv_rate !== null &&
              scope.row.shop_refund_status21_gmv_rate !== undefined
                ? numberFormat(Number(scope.row.shop_refund_status21_gmv_rate), 2) + '%'
                : '--'
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="上周店铺销量"
          min-width="140"
          prop="last_week_shop_sale_count"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.last_week_shop_sale_count !== null
                ? numberFormat(Number(scope.row.last_week_shop_sale_count), 0, '.', ',')
                : '--'
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          label="退款销售额 (元)"
          min-width="170"
          prop="shop_refund_gmv"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_refund_gmv !== null && scope.row.shop_refund_gmv !== undefined
                ? formatPriceFormYuan(
                    scope.row.shop_refund_gmv === 0 ? 0 : scope.row.shop_refund_gmv / 100,
                    2,
                    false,
                  )
                : '--'
            }}
            <!-- {{ scope.row.shop_refund_gmv }} -->
          </template>
        </el-table-column>
        <el-table-column
          label="退款销售额占比"
          min-width="160"
          prop="shop_refund_gmv_rate"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.shop_refund_gmv_rate !== null
                ? numberFormat(Number(scope.row.shop_refund_gmv_rate), 2) + '%'
                : '--'
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="上周店铺销售额 (元)"
          min-width="170"
          prop="last_week_shop_gmv"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.gmv !== null
                ? formatPriceFormYuan(
                    scope.row.last_week_shop_gmv === 0 ? 0 : scope.row.last_week_shop_gmv / 100,
                    2,
                    false,
                  )
                : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="上周平均件单价 (元)"
          min-width="170"
          prop="last_week_shop_sale_price_avg"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.last_week_shop_sale_price_avg !== (null || undefined)
                ? formatPriceFormYuan(
                    scope.row.last_week_shop_sale_price_avg === 0
                      ? 0
                      : scope.row.last_week_shop_sale_price_avg / 100,
                    2,
                    false,
                  )
                : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="店铺累计销量"
          min-width="140"
          prop="total_shop_sale_count"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.total_shop_sale_count !== null
                ? numberFormat(Number(scope.row.total_shop_sale_count), 0, '.', ',')
                : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="店铺累计销售额 (元)"
          min-width="170"
          prop="total_shop_gmv"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.total_shop_gmv !== null
                ? formatPriceFormYuan(
                    scope.row.total_shop_gmv === 0 ? 0 : scope.row.total_shop_gmv / 100,
                    2,
                    false,
                  )
                : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="直播销量"
          min-width="110"
          prop="sale_count"
          align="right"
          sortable="custom"
        >
          <template slot-scope="scope">
            {{
              scope.row.sale_count !== null
                ? numberFormat(Number(scope.row.sale_count), 0, '.', ',')
                : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="直播销售额 (元)"
          min-width="160"
          prop="gmv"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.gmv !== null
                ? formatPriceFormYuan(scope.row.gmv === 0 ? 0 : scope.row.gmv / 100, 2, false)
                : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="直播销售额占比"
          min-width="160"
          prop="gmv_rate"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.gmv_rate !== null ? numberFormat(Number(scope.row.gmv_rate), 2) + '%' : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="上周直播销量"
          min-width="160"
          prop="last_week_sale_count"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.last_week_sale_count !== null
                ? numberFormat(Number(scope.row.last_week_sale_count), 0, '.', ',')
                : '--'
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="上周直播销售额 (元)"
          min-width="180"
          prop="last_week_gmv"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.last_week_gmv !== null
                ? formatPriceFormYuan(
                    scope.row.last_week_gmv === 0 ? 0 : scope.row.last_week_gmv / 100,
                    2,
                    false,
                  )
                : '--'
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          label="点击率"
          min-width="100"
          prop="click_rate"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.click_rate !== null
                ? numberFormat(Number(scope.row.click_rate), 2) + '%'
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="转化率"
          min-width="110"
          prop="pay_rate"
          align="right"
          :sortable="showSort ? 'custom' : false"
        >
          <template slot-scope="scope">
            {{
              scope.row.pay_rate !== null ? numberFormat(Number(scope.row.pay_rate), 2) + '%' : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="查看"
          width="87"
          fixed="right"
          prop="view"
          align="center"
          :label-class-name="showSort ? 'check-label' : ''"
        >
          <template slot-scope="scope">
            <div class="overview-btn-box">
              <a
                @click.stop="onSaleDetailClick(scope.row)"
                class="btn-text"
                style="font-weight: normal"
                >商品明细</a
              >
              <!-- <a
                v-if="scope.row.has_feigua_cat"
                @click.stop="saleAnalysisClick(scope.row)"
                class="btn-text"
                style="margin-right: 4px"
                >销售分析</a
              > -->
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <empty-common :imgWidth="200" :imgHeight="100"></empty-common>
        </template>
      </tg-table>
    </div>
    <!-- <div class="pie-box" style="border: 1px solid var(--border-line-div-color); border-radius: 4px; margin-top: 18px">
      <h3 class="box-title" style="margin-left: 12px; font-weight: 400">价格带销售分析</h3>
      <div style="display: flex; justify-content: space-between">
        <PriceNew style="flex: 1" :visible="true" :cat-id="catId" />
        <PriceNew style="flex: 1" :visible="true" :cat-id="catId" :is_table="false" />
      </div>
    </div>
    <div style="margin: 18px 0; border: 1px solid var(--border-line-div-color); border-radius: 4px; padding: 18px 24px">
      <div class="first-category-box">品类销售分析</div>
      <div class="table-main">
        <div>
          <el-input
            size="medium"
            placeholder="请输入商品名称或商品编码"
            v-model="searchProjectName"
            style="width: 400px"
          />
          <el-select
            style="margin-left: 12px"
            placeholder="请选择类目"
            v-model="select_cat_id"
            filterable
          >
            <el-option
              v-for="item in categoryList"
              :label="item.cat_name"
              :key="item.cat_id"
              :value="item.cat_id"
            />
          </el-select>
        </div>
        <div class="table-lalal mgt-12">
          <el-table
            stripe
            class="table-div"
            border
            :data="saleInfoData"
            v-loading="saleInfoLoading"
            @sort-change="tableSort"
            :default-sort="{ prop: 'sale_count', order: 'descending' }"
          >
            <el-table-column v-for="(col, index) in infoColumn" v-bind="col" :key="index" />
            <template slot="empty">
              <empty-common detail-text="暂无数据"></empty-common>
            </template>
          </el-table>
          <div v-if="saleInfoData.length > 0" class="block flex-none" style="margin: 8px 0 10px 0">
            <el-pagination
              class="mgt-12"
              :current-page="saleInfo.page_num"
              :page-sizes="[10]"
              :page-size="saleInfo.num"
              :total="infoTotal"
              @current-change="onCurrentChange"
              layout="total, prev, pager, next, sizes, jumper"
            />
          </div>
        </div>
      </div>
    </div> -->
    <el-dialog
      class="tg-dialog-classic el-dialog-center-rewrite"
      width="780px"
      :visible="salesVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :wrapperClosable="false"
      title="本类目销售分析"
      @close="onSalesClose"
    >
      <div class="sales-analysis-box">
        <div class="line-box">
          <h3 class="box-title">与同类目大盘销售额趋势对比图</h3>
          <div class="charts-box">
            <LineCharts
              :date="lineTrend.date"
              :list="lineTrend.series"
              :loading="lineTrend.loading"
            />
            <div class="chart-tips" v-if="lineTrend.date.length > 0">
              <el-popover
                trigger="hover"
                content="品牌和大盘销售额的涨幅是指每天的销售额对比搜索周期第一天的销售额的涨幅变化"
                placement="top"
                width="360"
              >
                <tg-icon name="ico-question" style="color: #939393" slot="reference" />
              </el-popover>
            </div>
          </div>
          <div class="tips-box">
            <p>
              在近<span class="highlight">{{ lineData.day }}</span
              >天，品牌销售额增幅高于大盘销售额的天数有
              <el-popover
                v-if="lineData.moreDay > 0"
                :trigger="lineData.moreDay > 0 ? 'hover' : 'hover'"
                placement="top"
              >
                <div class="tips-box-list">
                  <div :key="key" v-for="(item, key) in heightList">
                    <span :class="{ isMax: item.isMax }"> {{ item.tipsCn }} </span>
                  </div>
                </div>
                <span class="highlight" style="cursor: pointer" slot="reference">{{
                  lineData.moreDay
                }}</span></el-popover
              >
              <span v-else class="highlight" style="cursor: default">{{ lineData.moreDay }}</span>
              天，最高超过<span class="highlight">{{ Math.abs(lineData.big) }}%</span>；
            </p>
            <p>
              增幅低于大盘销售额的天数有
              <el-popover
                v-if="lineData.lessDay > 0"
                :trigger="lineData.lessDay > 0 ? 'hover' : 'hover'"
                placement="top"
              >
                <div class="tips-box-list">
                  <div :key="key" v-for="(item, key) in lowList">
                    <span :class="{ isMin: item.isMax }"> {{ item.tipsCn }} </span>
                  </div>
                </div>
                <span class="highlight" style="cursor: pointer" slot="reference">{{
                  lineData.lessDay
                }}</span></el-popover
              >
              <span v-else class="highlight" style="cursor: default" slot="reference">{{
                lineData.lessDay
              }}</span>
              天，最低超过<span class="highlight">{{ Math.abs(lineData.mini) }}%</span>
            </p>
          </div>
        </div>
        <div class="pie-box">
          <h3 class="box-title">价格带销售分析</h3>
          <Price :visible="salesVisible" :cat-id="catId" />
        </div>
        <div class="top-box">
          <h3 class="box-title">畅销商品榜</h3>
          <top :visible="salesVisible" :cat-id="catId" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script src="./commodityAnalysisList.tsx"></script>
<style lang="less" scoped>
.hasShowSort {
  /deep/ .caret-wrapper {
    visibility: hidden;
  }
}

.commodity-analysis-system {
  height: 100%;
  width: 100%;
  // padding: 0 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .category-table {
    /deep/ .el-table {
      display: flex;
      flex-direction: column;

      .ico-question {
        font-size: 14px;
      }

      .el-table__empty-block {
        width: 200px !important;
        height: 200px !important;
        position: absolute;
        left: 50%;
        top: 30px;
        margin-left: -100px;
      }

      tbody {
        .is-right {
          padding-right: 24px;
        }
      }

      & > .el-table__body-wrapper {
        flex: 1 1 0;
      }

      .el-table__fixed,
      .el-table__fixed-right {
        bottom: 0;
        background-color: transparent !important;
      }

      /*.el-table__header {
        .check-label {
          padding-top: 0px !important;
        }
      }*/

      thead > tr > th,
      tbody > tr > td {
        border-right: 1px solid var(--table-border-color);
        border-bottom: 1px solid var(--table-border-color);
      }

      tbody > tr > td {
        padding-top: 4px;
        padding-bottom: 4px;
        font-size: 12px;

        .cell {
          min-height: 22px;
          line-height: 22px;
        }
      }

      thead > tr > th {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 12px;

        .cell {
          min-height: 22px;
          line-height: 22px;

          .caret-wrapper {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            height: 22px;
            width: 24px;
            vertical-align: middle;
            cursor: pointer;
            overflow: initial;
            position: relative;

            .sort-caret.ascending {
              // border-bottom-color: #c0c4cc; // ui说点击排序icon要有颜色变化
              top: 0px;
            }

            .sort-caret.descending {
              // border-top-color: #c0c4cc; // ui说点击排序icon要有颜色变化
              bottom: 0px;
            }
          }
        }
      }
    }
  }

  .first-category-box {
    margin: 0 0 12px 0;
    line-height: 1;
    color: var(--text-color);
    font-weight: 400;
    font-size: 14px;
  }

  .overview-btn-box {
    display: flex;
    justify-content: center;
    .btn-text {
      font-size: 12px !important;
    }
  }

  /deep/ .category-table {
    padding: 0;
    display: flex;
    min-height: 320px;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    background-color: #ffffff;
    .el-table tr {
      cursor: pointer;
    }
    .overview-btn-group {
      display: flex;
      justify-content: space-between;
    }
  }
}

.sales-analysis-box {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px 20px 24px 30px;

  .line-box,
  .pie-box,
  .top-box {
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 0 18px;

    .box-title {
      font-weight: 600;
      font-size: 12px;
      color: var(--text-color);
      line-height: 18px;
    }
  }

  .line-box {
    height: 462px;

    .tips-box {
      height: 58px;
      padding: 10px 24px;
      line-height: 20px;
      background: #f4f9fe;
      border-radius: 4px;
      font-size: 12px;
      color: var(--text-color);

      .highlight {
        color: var(--theme-color);
        font-weight: 600;
      }
    }
  }

  .pie-box {
    height: 300px;
  }

  .top-box {
    height: 625px;
  }
}

.charts-box {
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  position: relative;

  .chart-tips {
    position: absolute;
    z-index: 111;
    left: 96px;
    top: 10px;
  }

  h3 {
    font-size: 14px;
    color: var(--text-color);
    padding-left: 18px;
  }

  .line-chart {
    height: 260px !important;
  }
}

.tips-box-list {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
  margin: 0 -12px;
  padding: 0 12px;

  & > div {
    .isMax {
      color: #d9001b;
    }

    .isMin {
      color: #52c41a;
    }

    &:first-child {
      margin-top: 0;
    }

    margin-top: 10px;
  }
}
.table-lalal {
  .table-div {
    min-height: 300px;
    max-height: 938px;
  }
  /deep/.goods-info {
    display: flex;
    img {
      width: 70px;
      height: 70px;
      border-radius: 2px;
      margin-right: 10px;
    }
    .info-row {
      .goods-title {
        width: 140px;
        height: 32px;
        line-height: 16px;
        font-size: 14px;
        color: var(--text-color);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 12px;
      }
    }
  }
  /deep/.el-table__body-wrapper {
    height: auto !important;
    .el-table__row {
      td .cell {
        padding-right: 36px;
      }
    }
  }
}
</style>
