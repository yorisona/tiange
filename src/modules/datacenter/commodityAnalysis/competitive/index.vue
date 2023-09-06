<template>
  <div class="competitive-product-analysis" ref="scrollRef" @scroll="onScroll">
    <tg-card
      style="border-bottom: 10px #f4f5f6 solid"
      class="flex-none"
      :padding="[16, 0, 16, 16]"
      @rect:update="onTopCardRectUpdate"
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
        <el-form-item label="竞品账号：">
          <el-select
            size="mini"
            popper-class="el-select-popper-mini"
            style="width: 252px"
            clearable
            multiple
            :multiple-limit="3"
            collapse-tags
            collapse-tags-tooltip
            filterable
            v-model="queryForm.shop_name"
            placeholder="请选择竞品账号"
          >
            <el-option
              v-for="item in competitiveList"
              :key="item.shop_name"
              :label="item.shop_name"
              :value="item.shop_name"
            >
              <span>{{ item.shop_name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <!-- <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.dateType"
            class="search-type-select"
            @change="timeChange"
          >
            <el-option label="按周分析" :value="1" />
            <el-option label="按月分析" :value="2" />
          </el-select> -->
          <!-- <el-date-picker
            class="search-type-date"
            v-model="queryForm.date"
            @change="timeChange"
            :clearable="false"
            :picker-options="queryForm.dateType === 1 ? pickerWeekOptions : pickerMonthOptions"
            :type="queryForm.dateType === 1 ? 'week' : 'month'"
            :format="queryForm.dateType === 1 ? 'yyyy.MM.dd 第 WW 周' : 'yyyy.MM'"
            :value-format="queryForm.dateType === 1 ? 'yyyy-MM-dd' : 'yyyy-MM'"
            :placeholder="queryForm.dateType === 1 ? '选择周' : '选择月'"
          /> -->
          <el-date-picker
            style="width: 252px"
            v-model="queryForm.date"
            :clearable="false"
            :picker-options="pickerDayOptions"
            type="daterange"
            :format="'yyyy.MM.dd'"
            :value-format="'yyyy-MM-dd'"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @blur="isRestart = true"
          />
        </el-form-item>
        <el-form-item>
          <tg-button type="primary" @click="onQueryClick" v-loading="top_loading"
            >开始对比</tg-button
          >
          <tg-button
            class="mgl-8"
            v-loading="exportLoading"
            type="default"
            icon="ico-btn-export"
            @click="onExportExcel"
            >导出</tg-button
          >
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="flex-none category-table"
      :padding="[0, 0, 0, 0]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div style="padding: 0 0 32px; background: white">
        <head-lines style="padding: 18px 0 16px" :titleFont="14" title="TOP分布对比分析" />
        <div class="tag-list">
          <div class="tag-content">
            <span
              v-for="item in topData.sortTopOptions"
              :key="item.value"
              :class="['tag-btn', { 'tag-btn-active': item.value === topData.topSort }]"
              @click="topData.changeTopSort(item.value)"
              >{{ item.label }}</span
            >
          </div>
        </div>
        <div style="margin: 10px 0 0 0" v-loading="top_loading">
          <div
            style="height: 100%; max-height: 478px"
            v-if="tableTOPData && tableTOPData.length > 0"
          >
            <el-table class="top-table" border :data="tableTOPData" style="width: 100%">
              <el-table-column prop="name" label="TOP分类" width="100" fixed="left" align="left" />
              <el-table-column
                v-for="(shop, index) in [tableTOPData[0].shop_live, ...tableTOPData[0].competitive]"
                :label="index > 0 ? '竞店 (' + shop.shop_name + ')' : '本店'"
                :class-name="
                  index === 1 || index === 3
                    ? 'department-fund-statement-head-even'
                    : index === 2
                    ? 'department-fund-statement-head-odd'
                    : ''
                "
                :fixed="index === 0 ? 'left' : ''"
                :key="shop.shop_name + tableTOPData[0].competitive.length"
                :column-key="shop.shop_name + tableTOPData[0].competitive.length"
                :min-width="
                  tableTOPData[0].competitive.length === 3
                    ? 127
                    : tableTOPData[0].competitive.length === 2
                    ? 169
                    : 255
                "
              >
                <el-table-column
                  v-for="(col, subIndex) in topShopColumns(index)"
                  v-bind="col"
                  :key="subIndex"
                />
              </el-table-column>
              <div class="tg-page-empty" slot="empty">
                <empty-common img-height="100" img-width="150" />
              </div>
            </el-table>
          </div>
          <div class="tg-page-empty" v-else>
            <empty-common img-height="100" img-width="150" />
          </div>
        </div>
      </div>
      <div>
        <head-lines
          style="padding: 18px 0 16px; border-top: 1px dashed #e3e8ec"
          :titleFont="14"
          title="品类销售对比分析"
        />
        <div>
          <div style="height: 100%; max-height: 478px">
            <div class="first-category-box" v-if="firstCategory.length > 1">
              <el-button-group>
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
                    class="mgb-16"
                    @click="changeFirst(item.id)"
                    >{{
                      item.cat_name.length > 3 ? get_folded_text(item.cat_name, 4) : item.cat_name
                    }}
                  </el-button>
                </el-tooltip>
              </el-button-group>
            </div>
            <template v-if="summariesData && list && list.length > 0">
              <tg-table
                class="sales-table"
                style="max-height: 380px"
                v-loading="loading"
                :data="list"
                ref="tableRef"
                :row-key="row => getRowKey(row)"
                border
                :row-style="rowHightlight"
                default-expand-all
                :show-summary="false"
                :summary-method="getSummaries"
                height="100%"
                @row-click="onRowClick"
                highlight-current-row
              >
                <el-table-column prop="category_name" label="二级类目" min-width="130" fixed="left">
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
                  v-for="(shop, index) in [
                    summariesData.total.own,
                    ...summariesData.total.competitive,
                  ]"
                  :label="index > 0 ? '竞店 (' + shop.shop_name + ')' : '本店'"
                  :class-name="
                    index === 1 || index === 3
                      ? 'department-fund-statement-head-even'
                      : index === 2
                      ? 'department-fund-statement-head-odd'
                      : ''
                  "
                  :fixed="index === 0 ? 'left' : ''"
                  :key="shop.shop_name + '1' + summariesData.total.competitive.length"
                  :column-key="shop.shop_name + '1' + summariesData.total.competitive.length"
                  :min-width="
                    summariesData.total.competitive.length === 3
                      ? 130
                      : summariesData.total.competitive.length === 2
                      ? 173
                      : 260
                  "
                >
                  <el-table-column
                    v-for="(col, subIndex) in topSellColumns(index)"
                    v-bind="col"
                    :key="subIndex"
                  />
                </el-table-column>
                <div class="tg-page-empty" slot="empty">
                  <empty-common img-height="100" img-width="150" />
                </div>
              </tg-table>
            </template>
            <template v-else>
              <div class="tg-page-empty">
                <empty-common img-height="100" img-width="150" />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div>
        <div class="category-header-line" style="border-top: 1px dashed #e3e8ec; margin-top: 32px">
          <head-lines
            style="padding: 20px 0 16px"
            :titleFont="14"
            title="当前销售趋势对比类目："
          /><span class="category-name">{{ categoryName }}</span>
        </div>
        <div class="tag-list">
          <div class="tag-content">
            <span
              v-for="item in tagList"
              :key="item.value"
              :class="['tag-btn', { 'tag-btn-active': item.value === defaultTag }]"
              @click="handleTagFilter(item.value)"
              >{{ item.label }}</span
            >
          </div>
        </div>
        <div class="single-line-box">
          <LineEcharts
            v-if="defaultTag === 1"
            :date="LineDate"
            :list="salesAmountLineList"
            :color="['#59B6DF', '#FF9C69', '#C673F0', '#52CCC2']"
            :loading="echartsLoading"
          />
          <LineEcharts
            v-if="defaultTag === 2"
            :date="LineDate"
            :list="saleCountLineList"
            :color="['#59B6DF', '#FF9C69', '#C673F0', '#52CCC2']"
            :loading="echartsLoading"
          />
          <LineEcharts
            v-if="defaultTag === 3"
            :date="LineDate"
            :list="watchLineList"
            :color="['#59B6DF', '#FF9C69', '#C673F0', '#52CCC2']"
            :loading="echartsLoading"
          />
          <LineEcharts
            v-if="defaultTag === 4"
            :percentage="true"
            :date="LineDate"
            :list="turnLineList"
            :color="['#59B6DF', '#FF9C69', '#C673F0', '#52CCC2']"
            :loading="echartsLoading"
          />
        </div>
      </div>
      <div class="category-header-line" style="border-top: 1px dashed #e3e8ec; margin-top: 32px">
        <head-lines style="padding: 20px 0 16px" :titleFont="14" title="类目销售TOP榜对比：" /><span
          class="category-name"
          >{{ categoryName }}</span
        >
      </div>
      <div class="tag-list">
        <div class="tag-content">
          <span
            v-for="item in topData.sortOptions"
            :key="item.value"
            :class="['tag-btn', { 'tag-btn-active': item.value === topData.sort }]"
            @click="topData.changeSort(item.value)"
            >{{ item.label }}</span
          >
        </div>
        <tg-button type="default" size="mini" icon="ico-btn-export" @click="topData.exportPDF"
          >导出</tg-button
        >
      </div>
      <div v-loading="topData.weekLoading">
        <div style="font-size: 12px; margin: 12px 0">
          自营品牌: {{ lastQueryForm.project_name }}
        </div>
        <week-month-top-compare :table_week_data="topData.left" :is_competitive="true" />
      </div>
      <div v-loading="topData.weekLoading">
        <div style="font-size: 12px; margin: 18px 0 16px">
          <div class="category-header">
            竞品品牌:
            <span>{{
              lastQueryForm.shop_names.split(',') &&
              lastQueryForm.shop_names.split(',').length === 1
                ? lastQueryForm.shop_names.split(',')[0]
                : ''
            }}</span>
            <el-select
              v-if="lastQueryForm.shop_names && lastQueryForm.shop_names.split(',').length > 1"
              size="mini"
              popper-class="el-select-popper-mini"
              v-model="select_shop_name"
              style="width: 204px"
            >
              <el-option
                v-for="item in lastQueryForm.shop_names.split(',')"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
          </div>
        </div>
        <week-month-top-compare
          :table_week_data="getCompetitiveShop"
          :is_competitive="true"
          :is_competitive_shop="true"
        />
      </div>
      <div class="empty" />
      <div class="backtop" v-if="showBackTop" @click="backTop">
        <tg-icon name="ico-icon_tongyong_zhiding" />
      </div>
    </tg-card>
  </div>
</template>

<script src="./index.tsx"></script>

<style lang="less" scoped>
@import './index.less';
</style>
