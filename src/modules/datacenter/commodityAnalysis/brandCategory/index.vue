<template>
  <div class="commodity-analysis-brand">
    <tg-card
      class="flex-none"
      :padding="[16]"
      @rect:update="onTopCardRectUpdate"
      style="border-bottom: 10px #f4f5f6 solid"
    >
      <el-form
        class="filter-form flex-form"
        size="mini"
        :show-message="false"
        :inline="true"
        label-width="60px"
        @submit.native.prevent
      >
        <el-form-item label="项目名称：" prop="">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.project_id"
            @change="getAccess"
            filterable
            style="width: 264px"
          >
            <el-option
              v-for="item in project_list"
              :label="item.project_name"
              :key="item.project_id"
              :value="item.project_id"
              >{{ item.project_name }}
              <span v-if="item.project_status === ProjectStatusEnum.finish">(已完结)</span>
              <span v-else-if="item.project_status === ProjectStatusEnum.executionEnd"
                >(执行结束)</span
              >
              <span v-else>(进行中)</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.date_type"
            class="search-type-select"
            @change="timeChange"
          >
            <el-option label="按日分析" :value="3" />
            <el-option label="按周分析" :value="1" />
            <el-option label="按月分析" :value="2" />
          </el-select>
          <el-date-picker
            class="search-type-date"
            v-model="queryForm.date"
            @change="timeChange"
            :clearable="false"
            :picker-options="
              queryForm.date_type === 1
                ? pickerWeekOptions
                : queryForm.date_type === 3
                ? pickerDayOptions
                : pickerMonthOptions
            "
            :type="
              queryForm.date_type === 1 ? 'week' : queryForm.date_type === 3 ? 'date' : 'month'
            "
            :format="
              queryForm.date_type === 1
                ? 'yyyy.MM.dd 第 WW 周'
                : queryForm.date_type === 3
                ? 'yyyy.MM.dd'
                : 'yyyy.MM'
            "
            :value-format="queryForm.date_type !== 2 ? 'yyyy-MM-dd' : 'yyyy-MM'"
            :placeholder="
              queryForm.date_type === 1 ? '选择周' : queryForm.date_type === 3 ? '选择日' : '选择月'
            "
          />
        </el-form-item>
        <el-form-item>
          <tg-button type="primary" @click="onQueryClick">查询</tg-button>
          <tg-button type="default" class="mgl-8" icon="ico-btn-export" @click="exportBtnClick"
            >导出</tg-button
          >
        </el-form-item></el-form
      ></tg-card
    >
    <tg-card
      class="flex-none category-table"
      :padding="[0, 0, 0, 0]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div class="commodity-analysis-system">
        <div class="first-category-box" v-if="firstCategory.length > 1">
          <el-button-group v-if="firstCategory.length > 1">
            <el-tooltip
              :enterable="false"
              :disabled="item.cat_name.length > 3 ? false : true"
              class="item"
              v-for="item in firstCategory"
              :key="item.id"
              effect="dark"
              :content="item.cat_name"
              placement="top"
            >
              <el-button
                style="width: 100px"
                :type="firstActive === item.id ? 'primary' : ''"
                @click="changeFirst(item.id)"
                >{{ item.cat_name.length > 3 ? get_folded_text(item.cat_name, 4) : item.cat_name }}
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
        <div class="category-table">
          <tg-table
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
                    ? numberFormat(Number(scope.row.item_count || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="店铺销量"
              min-width="100"
              prop="shop_sale_count"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.shop_sale_count !== null
                    ? numberFormat(Number(scope.row.shop_sale_count || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="款均销量"
              min-width="100"
              prop="shop_avg_sale_count"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.shop_avg_sale_count !== null
                    ? numberFormat(Number(scope.row.shop_avg_sale_count || 0), 2, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="款均讲解次数"
              min-width="130"
              prop="avg_talk_times"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.avg_talk_times !== null
                    ? numberFormat(Number(scope.row.avg_talk_times || 0), 2, '.', ',')
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
                    ? formatPriceFormYuan((scope.row.shop_gmv || 0) / 100, 2, false)
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
                    ? formatPriceFormYuan((scope.row.shop_sale_price_avg || 0) / 100, 2, false)
                    : '--'
                }}
              </template>
            </el-table-column>
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
                    ? numberFormat(Number(scope.row.click_rate || 0), 2) + '%'
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
                  scope.row.pay_rate !== null
                    ? numberFormat(Number(scope.row.pay_rate || 0), 2) + '%'
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="销量占比"
              min-width="120"
              prop="shop_sale_count_percent"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.shop_sale_count_percent !== null
                    ? numberFormat(Number(scope.row.shop_sale_count_percent || 0), 2) + '%'
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
                    ? numberFormat(Number(scope.row.shop_gmv_rate || 0), 2) + '%'
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="店铺销量环比"
              min-width="140"
              prop="shop_sale_count_qoq"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.shop_sale_count_qoq !== null
                    ? numberFormat(Number(scope.row.shop_sale_count_qoq || 0), 2) + '%'
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="店铺销售额环比"
              min-width="140"
              prop="shop_gmv_qoq"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.shop_gmv_qoq !== null
                    ? numberFormat(Number(scope.row.shop_gmv_qoq || 0), 2) + '%'
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="件单价环比"
              min-width="140"
              prop="shop_sale_price_avg_qoq"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.shop_sale_price_avg_qoq !== null
                    ? numberFormat(Number(scope.row.shop_sale_price_avg_qoq || 0), 2) + '%'
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="当前库存"
              min-width="100"
              prop="stock_num"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.stock_num !== null
                    ? numberFormat(Number(scope.row.stock_num || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="
                '库存可销' +
                (queryForm.date_type === 1 ? '周' : queryForm.date_type === 2 ? '月' : '天') +
                '数'
              "
              min-width="140"
              prop="stock_times"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.stock_times !== null
                    ? numberFormat(Number(scope.row.stock_times || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="货值"
              min-width="130"
              prop="stock_products_worth"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.stock_products_worth !== (null || undefined)
                    ? formatPriceFormYuan((scope.row.stock_products_worth || 0) / 100, 2, false)
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="库存货值占比"
              min-width="140"
              prop="stock_products_worth_percent"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.stock_products_worth_percent !== null
                    ? numberFormat(Number(scope.row.stock_products_worth_percent || 0), 2) + '%'
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
                    ? formatPriceFormYuan((scope.row.shop_refund_status21_gmv || 0) / 100, 2, false)
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
                    ? numberFormat(Number(scope.row.shop_refund_status21_gmv_rate || 0), 2) + '%'
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="上周店铺销量"
              min-width="140"
              prop="last_week_shop_sale_count"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.last_week_shop_sale_count !== null
                    ? numberFormat(Number(scope.row.last_week_shop_sale_count || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <!--              :label="
                (queryForm.date_type === 3 ? '昨天' : queryForm.date_type === 1 ? '上周' : '上月') +
                '店铺销售额 (元)'
              "-->
            <el-table-column
              label="上周店铺销售额 (元)"
              min-width="170"
              prop="last_week_shop_gmv"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.gmv !== null
                    ? formatPriceFormYuan((scope.row.last_week_shop_gmv || 0) / 100, 2, false)
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
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
                        (scope.row.last_week_shop_sale_price_avg || 0) / 100,
                        2,
                        false,
                      )
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="店铺累计销量"
              min-width="140"
              prop="total_shop_sale_count"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.total_shop_sale_count !== null
                    ? numberFormat(Number(scope.row.total_shop_sale_count || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="店铺累计销售额 (元)"
              min-width="170"
              prop="total_shop_gmv"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.total_shop_gmv !== null
                    ? formatPriceFormYuan((scope.row.total_shop_gmv || 0) / 100, 2, false)
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="直播销量"
              min-width="110"
              prop="sale_count"
              align="right"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{
                  scope.row.sale_count !== null
                    ? numberFormat(Number(scope.row.sale_count || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="直播销售额 (元)"
              min-width="160"
              prop="gmv"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.gmv !== null
                    ? formatPriceFormYuan((scope.row.gmv || 0) / 100, 2, false)
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="直播销售额占比"
              min-width="160"
              prop="gmv_rate"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.gmv_rate !== null
                    ? numberFormat(Number(scope.row.gmv_rate || 0), 2) + '%'
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="上周直播销量"
              min-width="160"
              prop="last_week_sale_count"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.last_week_sale_count !== null
                    ? numberFormat(Number(scope.row.last_week_sale_count || 0), 0, '.', ',')
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="上周直播销售额 (元)"
              min-width="180"
              prop="last_week_gmv"
              align="right"
              :sortable="showSort ? 'custom' : false"
            >
              <template slot-scope="scope">
                {{
                  scope.row.last_week_gmv !== null
                    ? formatPriceFormYuan((scope.row.last_week_gmv || 0) / 100, 2, false)
                    : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="查看"
              width="137"
              fixed="right"
              prop="view"
              :label-class-name="showSort ? 'check-label' : ''"
            >
              <template slot-scope="scope">
                <div class="overview-btn-box">
                  <a class="btn-text" style="font-weight: normal">商品明细</a>
                  <a
                    v-if="scope.row.has_feigua_cat"
                    @click.stop="saleAnalysisClick(scope.row)"
                    class="btn-text"
                    style="margin-right: 4px"
                    >销售分析</a
                  >
                </div>
              </template>
            </el-table-column>
            <template #empty>
              <empty-common detail-text="暂无数据"></empty-common>
            </template>
          </tg-table>
        </div>

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
                  在近<span class="highlight">{{ lineData.day }}</span>
                  天，品牌销售额增幅高于大盘销售额的天数有
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
                    }}</span>
                  </el-popover>
                  <span v-else class="highlight" style="cursor: default">{{
                    lineData.moreDay
                  }}</span>
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
                    }}</span>
                  </el-popover>
                  <span v-else class="highlight" style="cursor: default" slot="reference">{{
                    lineData.lessDay
                  }}</span
                  >天，最低超过<span class="highlight">{{ Math.abs(lineData.mini) }}%</span>
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
    </tg-card>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
.commodity-analysis-brand {
  min-width: 1200px;
  .el-select {
    /deep/ .el-tag {
      .el-select__tags-text {
        max-width: 120px;
      }
    }

    &.search-type-select {
      margin-right: 0;
      width: 100px;

      /deep/ .el-input__inner {
        border-right-width: 0;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }

  .search-type-date {
    width: 180px;

    /deep/ .el-input__inner {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }

  .hasShowSort {
    /deep/ .caret-wrapper {
      visibility: hidden;
    }
  }

  .commodity-analysis-system {
    padding-top: 16px;
    height: calc(100vh - 133px);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    /deep/ .el-table {
      display: flex;
      flex-direction: column;

      .ico-question {
        font-size: 14px;
      }

      .el-table__empty-block {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
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

    .first-category-box {
      display: flex;
      background-color: #ffffff;
      align-items: center;
      padding: 0 16px 12px;
      justify-content: space-between;
    }

    .overview-btn-box {
      display: flex;
      justify-content: space-between;

      .btn-text {
        font-size: 12px !important;
      }
    }

    /deep/ .category-table {
      padding: 0 16px 32px 16px;
      display: flex;
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
}
.sales-analysis-box {
  display: flex;
  flex-direction: column;
  padding: 24px 20px 24px 30px;

  .line-box,
  .pie-box,
  .top-box {
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 0 18px;
    margin-bottom: 20px;
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
</style>
