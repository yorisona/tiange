<template>
  <div class="commodity-analysis-timer">
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
            :clearable="false"
            @change="timeChange"
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
          <tg-button class="mgl-8" type="default" icon="ico-btn-export" @click="onExportExcel"
            >导出</tg-button
          >
        </el-form-item></el-form
      ></tg-card
    >
    <tg-card
      class="flex-none category-table"
      :padding="[12, 18, 6, 18]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <el-button-group>
        <el-radio-group v-model="timeType" size="mini">
          <el-radio-button label="season" value="season">按季节</el-radio-button>
          <el-radio-button label="year" value="year">按年度</el-radio-button>
        </el-radio-group>
      </el-button-group>
      <tg-table
        v-if="timeType === 'season'"
        class="mgt-12"
        border
        :row-style="rowHightlightSeason"
        :data="listSeason"
        @row-click="onRowClick"
        v-loading="loading"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-bind="tableProps"
      >
        <el-table-column label="季节" min-width="100" fixed="left">
          <template slot-scope="scope">
            <span v-if="!scope.row.children && scope.row.season !== '合计'"></span>
            <span v-else>
              {{ scope.row.season !== null ? scope.row.season || '0' : '--' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="年度款" align="center" min-width="100" fixed="left">
          <template slot-scope="scope">
            {{ scope.row.year !== null ? scope.row.year || '0' : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="款数" align="center" min-width="80">
          <template slot-scope="scope">{{
            scope.row.item_count !== null
              ? numberFormat(Number(scope.row.item_count || 0), 0, '.', ',')
              : '--'
          }}</template>
        </el-table-column>
        <el-table-column label="店铺销量" align="right" min-width="100">
          <template slot-scope="scope">{{
            scope.row.shop_gmv !== null
              ? numberFormat(Number(scope.row.shop_sale_count || 0), 0, '.', ',')
              : '--'
          }}</template>
        </el-table-column>
        <el-table-column
          label="店铺销售额 (元)"
          min-width="140"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>
              {{
                scope.row.shop_gmv !== null
                  ? formatPriceFormYuan((scope.row.shop_gmv || 0) / 100, 2, false)
                  : '--'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pie"
          label="店铺销售额环比"
          min-width="140"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.shop_gmv_rate !== null ? `${scope.row.shop_gmv_rate || 0}%` : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pie"
          label="销售额占比"
          min-width="120"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.shop_gmv_pie !== null ? `${scope.row.shop_gmv_pie || 0}%` : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前库存" align="right" min-width="80">
          <template slot-scope="scope">{{
            scope.row.item_count !== null
              ? numberFormat(Number(scope.row.stock_num || 0), 0, '.', ',')
              : '--'
          }}</template>
        </el-table-column>
        <el-table-column label="货值" align="right" min-width="100">
          <template slot-scope="scope">
            {{
              scope.row.stock_products_worth !== null
                ? formatPriceFormYuan((scope.row.stock_products_worth || 0) / 100, 2, false)
                : '--'
            }}</template
          >
        </el-table-column>
        <el-table-column
          prop="pie"
          label="库存货值占比"
          min-width="130"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.stock_products_worth_pie !== null
                ? `${scope.row.stock_products_worth_pie || 0}%`
                : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查看" width="100px" align="center">
          <template>
            <a class="btn-text">商品明细</a>
          </template>
        </el-table-column>
        <template #empty>
          <empty-common :detail-text="empty_text || '暂无数据'"></empty-common>
        </template>
      </tg-table>
      <tg-table
        v-else
        class="mgt-16"
        border
        :row-style="rowHightlightYear"
        :data="listYear"
        @row-click="onRowClick"
        v-loading="loading"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-bind="tableProps"
      >
        <el-table-column label="年度款" min-width="100" fixed="left">
          <template slot-scope="scope">
            <span v-if="!scope.row.children && scope.row.year !== '合计'"></span>
            <span v-else>
              {{ scope.row.year !== null ? scope.row.year || '0' : '--' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="季节" align="center" min-width="100" fixed="left">
          <template slot-scope="scope">
            <span>
              {{ scope.row.season !== null ? scope.row.season || '0' : '--' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="款数" align="center" min-width="100">
          <template slot-scope="scope">{{
            scope.row.item_count !== null
              ? numberFormat(Number(scope.row.item_count || 0), 0, '.', ',')
              : '--'
          }}</template>
        </el-table-column>
        <el-table-column label="店铺销量" align="right" min-width="120">
          <template slot-scope="scope">{{
            scope.row.shop_gmv !== null
              ? numberFormat(Number(scope.row.shop_sale_count || 0), 0, '.', ',')
              : '--'
          }}</template>
        </el-table-column>
        <el-table-column
          label="店铺销售额"
          min-width="120"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>
              {{
                scope.row.shop_gmv !== null
                  ? formatPriceFormYuan((scope.row.shop_gmv || 0) / 100)
                  : '--'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pie"
          label="店铺销售额环比"
          min-width="140"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.shop_gmv_rate !== null ? `${scope.row.shop_gmv_rate || 0}%` : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pie"
          label="销售额占比"
          min-width="120"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.shop_gmv_pie !== null ? `${scope.row.shop_gmv_pie}%` : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前库存" align="right" min-width="80">
          <template slot-scope="scope">{{
            scope.row.stock_num !== null
              ? numberFormat(Number(scope.row.stock_num || 0), 0, '.', ',')
              : '--'
          }}</template>
        </el-table-column>
        <el-table-column label="货值" align="right" min-width="100">
          <template slot-scope="scope">{{
            scope.row.stock_products_worth !== null
              ? formatPriceFormYuan((scope.row.stock_products_worth || 0) / 100, 2, false)
              : '--'
          }}</template>
        </el-table-column>
        <el-table-column
          prop="pie"
          label="库存货值占比"
          min-width="130"
          align="right"
          label-class-name="add-padding-right"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.stock_products_worth_pie !== null
                ? `${scope.row.stock_products_worth_pie || 0}%`
                : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查看" width="100px" align="center">
          <template>
            <a class="btn-text">商品明细</a>
          </template>
        </el-table-column>
        <template #empty>
          <empty-common :detail-text="empty_text || '暂无数据'"></empty-common>
        </template>
      </tg-table>
    </tg-card>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
.commodity-analysis-timer {
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
  /deep/ .el-table thead > tr > th {
    padding: 5px 12px !important;
    font-size: 12px;
    .cell {
      padding-left: 0px;
      height: 22px;
      line-height: 22px;
      text-align: center;
    }
  }
  /deep/ .el-table tbody > tr > td {
    padding: 4px 0px !important;
    font-size: 12px;
    .cell {
      padding-left: 12px;
      line-height: 22px;
    }
  }
  /deep/ .el-table .caret-wrapper {
    height: 22px;
    .sort-caret.ascending {
      top: 0px;
    }
    .sort-caret.descending {
      bottom: 0px;
    }
  }
  .el-table {
    //max-width: 1000px;
    margin-bottom: 32px;
    overflow: visible !important;
  }
  /deep/.el-table thead > tr > th,
  /deep/.el-table tbody > tr > td {
    border-right: 1px solid var(--table-border-color);
    border-bottom: 1px solid var(--table-border-color);
  }
  /deep/.el-table tbody > tr > td {
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12px;
  }
  /deep/.el-table thead > tr > th {
    padding-top: 2px;
    padding-bottom: 2px;
    font-size: 12px;
    .cell {
      min-height: 22px;
      line-height: 22px;
    }
  }
  /deep/ .el-table .caret-wrapper {
    height: 22px;
    .sort-caret.ascending {
      top: 0px;
    }
    .sort-caret.descending {
      bottom: 0px;
    }
  }
  /deep/.add-padding-right {
    padding-right: 30px;
  }
  .span-padding-right {
    padding-right: 20px;
  }
  .btn-text {
    font-size: 12px !important;
  }
  .el-radio-group {
    column-gap: 0;
  }
  /deep/ .el-radio-button__orig-radio + .el-radio-button__inner {
    min-width: 82px;
    font-size: 12px;
    height: 28px;
  }
  /deep/ .el-radio-button__inner {
    color: var(--text-second-color);
    &:hover {
      color: var(--theme-color);
    }
  }
  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: var(--theme-color);
    min-width: 82px;
    color: #fff;
  }
  /deep/ .category-table {
    .el-table tr {
      cursor: pointer;
      &:hover {
        td {
          background-color: var(--table-current-row-bg-color);
        }
      }
    }
  }
}
</style>
