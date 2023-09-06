<template>
  <div class="commodity-analysis-sales">
    <tg-card
      class="flex-none"
      :padding="[16]"
      @rect:update="onTopCardRectUpdate"
      style="border-bottom: 10px #f4f5f6 solid"
    >
      <el-form
        class="filter-form flex-form"
        style="align-items: center"
        size="mini"
        :show-message="false"
        :inline="true"
        label-width="60px"
        @submit.native.prevent
      >
        <el-form-item label="项目名称：" prop="" v-if="!isFromGoodsAnalysis">
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
            @change="typeChange"
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
        <el-form-item style="display: flex; align-items: center">
          <tg-button class="mgr-8" type="primary" @click="onQueryClick">查询</tg-button>
          <tg-button class="mgr-8" type="default" @click="onReQueryClick">重置</tg-button>
          <tg-button
            v-loading="exportLoading"
            type="default"
            icon="ico-btn-export"
            @click="onExportExcel"
            >导出</tg-button
          >
        </el-form-item></el-form
      ></tg-card
    >
    <tg-card
      class="flex-none category-table exteriorStyles"
      :padding="[0, 0, 0, 0]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <head-lines
        v-show="query_date_type !== 3"
        style="margin: 18px 18px 16px"
        :titleFont="14"
        title="目标达成进度"
      />
      <div v-loading="targetLoading" v-if="query_date_type !== 3">
        <el-table border :data="tableTargetCompleteData" style="width: 100%">
          <el-table-column
            v-for="(col, subIndex) in targetCompleteColumns(index)"
            v-bind="col"
            :key="subIndex"
          />
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </el-table>
      </div>
      <div v-loading="targetLoading" v-if="query_date_type === 1">
        <el-table
          class="target-table"
          :span-method="objectSpanMethod"
          border
          :data="tableTargetTimeData"
          style="width: 100%"
          :header-cell-style="setHeader"
          :row-class-name="isCell ? tableRowClassName : ''"
          @cell-mouse-enter="handleCellMouseEnter"
          @cell-mouse-leave="handleCellMouseLeave"
        >
          <el-table-column
            v-for="(col, subIndex) in targetTimeColumns(index)"
            v-bind="col"
            :key="subIndex"
          />
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </el-table>
      </div>
      <div class="category-header-line">
        <span />{{
          query_date_type === 3 ? '日' : query_date_type === 1 ? '周' : '月'
        }}TOP占比及库存情况
      </div>
      <div class="tag-list" style="margin-bottom: 12px">
        <div class="tag-content">
          <span
            v-for="item in topData.sortOptions"
            :key="item.value"
            :class="['tag-btn', { 'tag-btn-active': item.value === topData.sortTop }]"
            @click="topData.changeSort(item.value)"
            >{{ item.label }}</span
          >
        </div>
      </div>
      <div v-loading="topLoading" v-if="query_date_type === 1">
        <el-table
          highlight-current-row
          class="top-stock-table"
          border
          :data="topTable"
          style="width: 100%"
        >
          <el-table-column
            v-for="(col, subIndex) in topData.topColumns"
            v-bind="col"
            :key="subIndex"
          />
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </el-table>
      </div>
      <div v-loading="topLoading" v-else-if="query_date_type === 2">
        <el-table border :data="topTable" style="width: 100%">
          <el-table-column
            v-for="(col, subIndex) in topData.topMonthColumns"
            v-bind="col"
            :key="subIndex"
          />
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </el-table>
      </div>
      <div v-loading="topLoading" v-else-if="query_date_type === 3">
        <el-table border :data="topTable" style="width: 100%">
          <el-table-column
            v-for="(col, subIndex) in topData.topDayColumns"
            v-bind="col"
            :key="subIndex"
          />
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </el-table>
      </div>
      <div class="category-header-refund" v-if="query_date_type !== 3">
        <head-lines style="padding: 20px 0 16px" :titleFont="14" title="品类退货分析" />
        <el-form
          v-if="topData.cateList && topData.cateList.length > 0"
          size="mini"
          label-width="80px"
          label-position="right"
        >
          <el-form-item label="一级类目：">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="topData.firstActive"
              style="width: 204px"
            >
              <el-option
                v-for="item in topData.cateList"
                :key="item.id"
                :value="item.id"
                :label="item.cat_name"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="refundLoading" v-if="query_date_type !== 3">
        <el-table
          class="sell-table"
          border
          height="100%"
          :data="newRefundList"
          :summary-method="getRefundSummaries"
          show-summary
          ref="sellTableData"
        >
          <el-table-column
            prop="name"
            label="品类"
            min-width="100"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <span class="pinlei-name">{{ scoped.row.name }}</span>
            </template></el-table-column
          >
          <el-table-column
            prop="gmv"
            label="总销售额"
            min-width="120"
            align="right"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{
                  scoped.row.gmv !== null
                    ? formatPriceFormYuan(scoped.row.gmv === 0 ? 0 : scoped.row.gmv / 100, 2, true)
                    : '--'
                }}</span>
              </div>
            </template></el-table-column
          >
          <el-table-column
            v-for="(item, index) in ['总退货', '售前退货', '售后退货']"
            :key="item"
            :column-key="item"
            :label="item"
            min-width="170"
          >
            :class-name=" index % 2 === 0 ? 'department-fund-statement-head-even' :
            'department-fund-statement-head-odd' "
            <el-table-column
              class-name="sub_cell"
              :prop="
                index === 0
                  ? 'refund_number'
                  : index === 1
                  ? 'befor_refund_number'
                  : 'after_refund_number'
              "
              label="退货量"
              min-width="80"
              align="right"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  <span>{{
                    index === 0
                      ? scoped.row.refund_number !== null
                        ? scoped.row.refund_number || 0
                        : '--'
                      : index === 1
                      ? scoped.row.befor_refund_number !== null
                        ? scoped.row.befor_refund_number || 0
                        : '--'
                      : index === 2
                      ? scoped.row.after_refund_number !== null
                        ? scoped.row.after_refund_number || 0
                        : '--'
                      : '--'
                  }}</span>
                </div>
              </template></el-table-column
            >
            <el-table-column
              :prop="
                index === 0 ? 'refund_gmv' : index === 1 ? 'befor_refund_gmv' : 'after_refund_gmv'
              "
              label="退货额"
              min-width="95"
              align="right"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  <span>{{
                    index === 0
                      ? scoped.row.refund_gmv !== null
                        ? formatPriceFormYuan(
                            scoped.row.refund_gmv === 0 ? 0 : scoped.row.refund_gmv / 100,
                            2,
                            true,
                          )
                        : '--'
                      : index === 1
                      ? scoped.row.befor_refund_gmv !== null
                        ? formatPriceFormYuan(
                            scoped.row.befor_refund_gmv === 0
                              ? 0
                              : scoped.row.befor_refund_gmv / 100,
                            2,
                            true,
                          )
                        : '--'
                      : index === 2
                      ? scoped.row.after_refund_gmv !== null
                        ? formatPriceFormYuan(
                            scoped.row.after_refund_gmv === 0
                              ? 0
                              : scoped.row.after_refund_gmv / 100,
                            2,
                            true,
                          )
                        : '--'
                      : '--'
                  }}</span>
                </div>
              </template></el-table-column
            >
            <el-table-column
              :prop="
                index === 0
                  ? 'refund_percent'
                  : index === 1
                  ? 'befor_refund_percent'
                  : 'after_refund_percent'
              "
              label="退货率"
              min-width="95"
              align="right"
              :show-overflow-tooltip="true"
            >
              <template #header>
                <div style="display: flex; justify-content: center">
                  <span>退货率</span
                  ><el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    content="退货率=退货额/总销额"
                  >
                    <el-button class="icon-btn" slot="reference">
                      <tg-icon
                        name="ico-icon_explain"
                        style="font-size: 14px; color: var(--text-third-color)"
                      ></tg-icon>
                    </el-button>
                  </el-popover>
                </div>
              </template>
              <template slot-scope="scoped">
                <div>
                  <span>{{
                    index === 0
                      ? scoped.row.refund_percent !== null
                        ? (scoped.row.refund_percent || 0) + '%'
                        : '--'
                      : index === 1
                      ? scoped.row.befor_refund_percent !== null
                        ? (scoped.row.befor_refund_percent || 0) + '%'
                        : '--'
                      : index === 2
                      ? scoped.row.after_refund_percent !== null
                        ? (scoped.row.after_refund_percent || 0) + '%'
                        : '--'
                      : '--'
                  }}</span>
                </div>
              </template></el-table-column
            >
          </el-table-column>
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </el-table>
      </div>
      <head-lines
        style="padding: 18px 0 16px; border-top: 1px dashed #e3e8ec"
        :titleFont="14"
        title="价格带销售分析"
      />
      <div v-loading="priceLoading">
        <el-table border :data="priceList" style="width: 100%">
          <el-table-column v-for="(col, index) in priceColumns" v-bind="col" :key="index" />
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </el-table>
      </div>
      <div class="category-header-line">
        <span />{{ query_date_type === 3 ? '日' : query_date_type === 1 ? '周' : '月' }}爆款对比分析
      </div>
      <div class="tag-list">
        <div class="tag-content">
          <span
            v-for="item in topData.sortOptions"
            :key="item.value"
            :class="['tag-btn', { 'tag-btn-active': item.value === topData.sortHot }]"
            @click="topData.changeWeekSort(item.value)"
            >{{ item.label }}</span
          >
        </div>
      </div>
      <div v-loading="weekLoading" v-if="query_date_type === 3">
        <div style="font-size: 12px; margin: 12px 0">
          <!-- {{ getMonthAndDay() }} -->
        </div>
        <week-month-top-compare
          class="mgb-12"
          :table_week_data="lastData"
          :is_month="query_date_type === 2"
        />
      </div>
      <template v-else>
        <div v-loading="weekLoading">
          <div style="font-size: 12px; margin: 12px 0">
            {{ query_date_type === 1 ? '第' : '' }}{{ lastWeekNum
            }}{{ query_date_type === 1 ? '周' : '月' }}
          </div>
          <week-month-top-compare :table_week_data="lastData" :is_month="query_date_type === 2" />
        </div>
        <div v-loading="weekLoading">
          <div style="font-size: 12px; margin: 12px 0">
            {{ query_date_type === 1 ? '第' : '' }}{{ lastLastWeekNum
            }}{{ query_date_type === 1 ? '周' : '月' }}
          </div>
          <week-month-top-compare :table_week_data="lastLastData" :is_last_week="false" />
        </div>
      </template>
      <template v-if="query_date_type !== 3">
        <div class="category-header-refund" style="margin-top: 32px">
          <head-lines style="padding: 20px 0 16px" :titleFont="14" title="新品动销分析" /><span
            style="font-size: 12px; color: #ffac15; margin: 21px 0 0 -18px"
            >（此处新品主要指第一次上架直播间的商品链接，数据可能存在偏差，仅供参考）</span
          >
        </div>
        <div :style="!isFromGoodsAnalysis && 'margin-bottom: 32px'" v-loading="newShopLoading">
          <vxe-table
            :merge-cells="mergeCells"
            :show-header="false"
            border
            :row-config="{ isHover: true }"
            :data="new_array"
          >
            <vxe-column align="center" field="name" title="排行" width="130" header-align="center">
              <template #default="scope">
                {{ scope.row.name }}
              </template>
            </vxe-column>
            <vxe-column
              v-for="(item, index) in newShopList"
              :key="'arrayHeader' + index"
              :title="index + 1"
              :field="item.title"
              width="164"
              align="center"
              :show-overflow="false"
            >
              <template #default="scope">
                <div v-if="scope.row.name === '商品主图'">
                  <div
                    class="goods-div"
                    @click="
                      () => {
                        ImageViewer.show([
                          newShopList[Number(scope.column.title) - 1].image_url || defaultImage,
                        ]);
                      }
                    "
                  >
                    <el-image
                      lazy
                      class="first-row-img"
                      :src="newShopList[Number(scope.column.title) - 1].image_url || defaultImage"
                      @error="defaultImage"
                    >
                      <div slot="error">
                        <el-image :src="defaultImage"> </el-image>
                      </div>
                      <div slot="placeholder"><el-image :src="defaultImage"> </el-image></div>
                    </el-image>
                  </div>
                </div>
                <span v-if="scope.row.name === '商品编码'">
                  {{ newShopList[Number(scope.column.title) - 1].item_id || '--' }}</span
                >
                <span v-if="scope.row.name === '商品款号'">
                  {{ newShopList[Number(scope.column.title) - 1].sn || '--' }}</span
                >
                <!--              <div class="goods_name" v-if="scope.row.name === '商品名称'">
                {{ newShopList[Number(scope.column.title) - 1].title || '&#45;&#45;' }}
              </div>-->
                <a
                  v-if="scope.row.name === '商品名称'"
                  :href="
                    'https://haohuo.jinritemai.com/views/product/item2?id=' +
                    newShopList[Number(scope.column.title) - 1].item_id
                  "
                  target="_blank"
                  class="goods_name"
                  :title="newShopList[Number(scope.column.title) - 1].title"
                >
                  {{ newShopList[Number(scope.column.title) - 1].title || '--' }}
                </a>
                <span v-if="scope.row.name === '讲解次数'">
                  {{
                    newShopList[Number(scope.column.title) - 1].talk_times !== null
                      ? numberFormat(
                          Number(newShopList[Number(scope.column.title) - 1].talk_times),
                          0,
                          '.',
                          ',',
                        )
                      : '--'
                  }}</span
                >
                <span v-if="scope.row.name === '销量'">
                  {{
                    newShopList[Number(scope.column.title) - 1].sale_count !== null
                      ? numberFormat(
                          Number(newShopList[Number(scope.column.title) - 1].sale_count),
                          0,
                          '.',
                          ',',
                        )
                      : '--'
                  }}</span
                >
                <span v-if="scope.row.name === '销售额'">
                  {{
                    newShopList[Number(scope.column.title) - 1].gmv !== null
                      ? formatPriceFormYuan(
                          Number(newShopList[Number(scope.column.title) - 1].gmv / 100),
                          2,
                          true,
                        )
                      : '--'
                  }}</span
                >
                <div
                  :class="
                    newShopList.length > 6
                      ? 'dongxiaolv-div'
                      : newShopList.length > 3
                      ? 'dongxiaolv-div small'
                      : 'dongxiaolv-div mini'
                  "
                  v-if="scope.row.name === '总动销率'"
                >
                  {{
                    newShopList[Number(scope.column.title) - 1].new_sku_sales_ratio !== null
                      ? (
                          parseInt(
                            String(
                              Number(
                                newShopList[Number(scope.column.title) - 1].new_sku_sales_ratio ||
                                  0,
                              ) * 100,
                            ),
                            10,
                          ) / 100
                        ).toFixed(2) + '%'
                      : '--'
                  }}
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </template>
      <slot></slot>
    </tg-card>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
.commodity-analysis-sales {
  /deep/ .vxe-table {
    font-size: 12px;
    color: var(--text-color);
    .vxe-table--main-wrapper {
      .vxe-table--body-wrapper {
        .vxe-table--body {
          tbody {
            tr {
              td {
                height: 27px;
                .vxe-cell {
                  height: 27px;
                  line-height: 27px;
                  .dongxiaolv-div {
                    text-align: left;
                    margin-left: 35vw;
                    &.mini {
                      margin-left: 70px;
                    }
                    &.small {
                      margin-left: 250px;
                    }
                  }
                }
              }
            }
            tr:nth-child(1) {
              height: 92px;
              .vxe-cell {
                height: 80px;
                line-height: 80px;
                max-height: 80px;
              }
            }
            tr:nth-child(4) {
              height: 45px;
              line-height: 45px;
              td:first-child {
                .vxe-cell {
                  height: 45px;
                  line-height: 45px;
                }
              }

              .vxe-cell {
                display: block;
                height: 36px;
                line-height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: inherit;
                .goods_name {
                  height: 40px;
                  line-height: 18px;
                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  color: var(--text-color);
                  font-size: 12px;
                  &:hover {
                    color: var(--theme-color);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .target-table {
    /deep/ .my-hover-row {
      td:first-child {
        background: var(--table-current-row-bg-color) !important;
      }
    }
    /deep/ .my-hover-second-row {
      td:nth-child(2) {
        background: #ffffff !important;
      }
    }
  }
  /deep/ .new-table {
    .el-table__body-wrapper .el-table__body tr:last-child {
      td:last-child {
        .cell {
          text-align: left;
          padding-left: 35vw;
          width: 50vw;
          .dongxiaolv-div {
            position: absolute;
            top: 4px;
          }
        }
      }
    }
  }
  .top-stock-table {
    /deep/.el-table__body-wrapper .el-table__body tr:last-child,
    /deep/ .el-table__fixed-body-wrapper .el-table__body tr:last-child {
      background-color: #f5f7fa !important;
      .el-table__cell {
        .cell {
          font-weight: 600;
        }
      }
    }
  }
  .sell-table {
    width: 100%;
    max-height: 380px;
    /deep/ .sub_cell.el-table__cell.is-leaf {
      //padding: 7px 12px !important;
    }
    /deep/ tbody > tr > td:first-child .cell {
      padding-right: 10px;
    }
  }
  /deep/ .goods-div {
    height: 80px;
    .first-row-img {
      display: inline-block;
      width: 80px;
      height: 80px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  /deep/ .hot-img {
    width: 42px;
    height: 42px;
    position: absolute;
    right: 30px;
    top: -2px;
  }
  /deep/ .goods_name {
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis; /* 超出部分省略号 */
    word-break: break-all; /* break-all(允许在单词内换行。) */
    display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
    -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp: 2; /* 显示的行数 */
    color: var(--text-color);
    &:hover {
      color: var(--theme-color);
    }
  }
  /deep/ .commodity-name {
    display: flex;
    padding: 5px 12px;

    & .goods-image {
      width: 80px;
      height: 80px;
      border-radius: 2px;
      margin-right: 10px;
    }

    & .goods-info {
      font-size: 12px;
      flex: 1;

      & p {
        color: var(--text-color);
        margin-bottom: 6px;
      }
    }
  }
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

  .category-header-refund {
    display: flex;
    border-top: 1px dashed #e3e8ec;
    .el-form {
      margin-top: 16px;
    }
  }
  .category-line {
    height: 60px;
    margin-top: 30px;
    line-height: 60px;
    border-top: 1px dashed #e3e8ec;
    font-weight: 400;
    font-size: 14px;
    color: var(--text-second-color);
    .category-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-color);
    }
  }

  /deep/ .el-table thead > tr > th {
    .cell {
      padding-left: 0;
      height: 18px;
      line-height: 18px;
      text-align: center;
    }
    .cell {
      visibility: visible;
    }
    &.department-fund-statement-head-even {
      background-color: #e7fcff !important;
    }
    &.department-fund-statement-head-odd {
      background-color: #f0f5ff !important;
    }
    .icon-btn {
      border-width: 0;
      height: 20px;
      width: 20px;
      padding: 0;
      margin-top: -1px;
      background: transparent;
    }
  }
  /deep/ .el-table tbody > tr > td {
    padding: 4px 0 !important;
    min-height: 18px;
    .cell {
      padding-left: 12px;
      line-height: 18px;
    }
  }
  /deep/ .el-table .caret-wrapper {
    height: 18px;
    .sort-caret.ascending {
      top: 0;
    }
    .sort-caret.descending {
      bottom: 0;
    }
  }
  .el-table {
    //max-width: 1000px;
    margin-bottom: 32px;
  }
  /deep/.el-table thead > tr > th,
  /deep/.el-table tbody > tr > td {
    border-right: 1px solid var(--table-border-color);
    border-bottom: 1px solid var(--table-border-color);
  }
  /deep/.el-table tbody > tr > td {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  /deep/.el-table thead > tr > th {
    padding-top: 4px;
    padding-bottom: 4px;
    .cell {
      min-height: 18px;
      line-height: 18px;
    }
  }
  /deep/ .el-table .caret-wrapper {
    height: 18px;
    .sort-caret.ascending {
      top: 0;
    }
    .sort-caret.descending {
      bottom: 0;
    }
  }
  /deep/.add-padding-right {
    padding-right: 30px;
  }
  .span-padding-right {
    padding-right: 20px;
  }

  /deep/ .el-radio-button__orig-radio + .el-radio-button__inner {
    min-width: 82px;
    height: 28px;
  }
  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: var(--theme-color);
    min-width: 82px;
  }
  .category-table {
    .tg-card-bd {
      > div {
        margin: 0 18px;
        &.category-header-line {
          border-top: 1px dashed rgb(227, 232, 236);
          height: 54px;
          line-height: 20px;
          margin: 0 18px 0;
          padding: 18px 0 16px 10px;
          font-weight: 400;
          font-size: 14px;
          color: var(--text-color);
          position: relative;
          span {
            position: absolute;
            display: inline-block;
            width: 3px;
            height: 14px;
            background: var(--theme-color);
            left: 0;
            top: 21px;
            border-radius: 1px;
          }
        }
      }
    }
    /deep/ .el-table tr {
      //cursor: pointer;
      &:hover {
        td {
          background-color: var(--table-current-row-bg-color);
        }
      }
    }
  }

  .tag-list {
    display: flex;
    justify-content: flex-start;
    gap: 18px;
    .tag-content {
      .tag-btn {
        display: inline-block;
        height: 20px;
        margin-top: 4px;
        margin-right: 8px;
        padding: 0 5px;
        color: var(--text-second-color);
        cursor: pointer;
        border-radius: 2px;
        border: 1px solid rgba(152, 167, 186, 0.3);
        margin-bottom: 6px;

        &:hover {
          background: var(--theme-color);
          color: #ffffff;
        }

        &.tag-btn-active {
          background: var(--theme-color);
          color: #ffffff;
        }
      }
    }
  }
}
</style>
