<!--
 * @Brief: 店铺代播-直播场次
 * @Author: tingzhu
 * @Date: 2020-12-28 16:54:33
-->
<template>
  <div class="tg-live-display-page">
    <tg-card :padding="[16, 16, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="small" :show-message="false" label-width="70px">
        <div class="filter-form-div">
          <div class="filter-form-item">
            <el-form-item label="直播状态：">
              <el-select v-model="queryParams.live_status" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="status in liveStatusList"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="直播日期：">
              <el-date-picker
                style="width: 100%"
                v-model="queryParams.live_start_date"
                type="date"
                :editable="false"
                placeholder="请选择直播日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="业务类型：">
              <el-select
                v-model="queryParams.business_type"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="status in businessTypeList"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="min-width: 314px">
            <el-form-item label="直播搜索：">
              <el-input
                type="text"
                clearable
                placeholder="请输入关键词"
                style="width: 244px"
                class="input-with-select"
                v-model.trim="queryParams.search_value"
              >
                <el-select
                  class="live_search_type"
                  v-model="queryParams.search_type"
                  slot="prepend"
                  style="width: 100px"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="type in searchTypeList"
                    :label="type.label"
                    :value="type.value"
                    :key="type.value"
                  ></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label-width="0">
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="handleQueryAction">查询</tg-button>
                <tg-button class="mgl-12" @click="handleResetAction">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </tg-card>
    <tg-card
      class="live-display-content mgt-18 flex-auto"
      :padding="[18, 18, 0, 18]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div class="add-live-display-btn" v-if="Permission.canEdit">
        <tg-button
          @click="handleAddLiveDisplayAction"
          type="primary"
          size="small"
          icon="ico-btn-add"
          >新增场次</tg-button
        >
      </div>
      <el-table
        stripe
        :data="list"
        :cell-style="{ cursor: 'pointer' }"
        @row-click="jumpDetail"
        v-loading="loading"
        v-bind="tableProps"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <!-- 空白页 -->
        <template #empty>
          <empty-common detail-text="暂未添加直播场次"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="Permission.canViewList && total > 0"
        :current-page.sync="queryParams.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParams.num"
        layout="total, slot, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      >
      </el-pagination>
    </tg-card>
    <liveDisplayAddDialog
      :visible="shouldEditing"
      @succeed="handleSaveSucceedAction"
      @closeAction="handleCloseAction"
    />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
