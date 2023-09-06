<!--
 * @Author: 肖槿
 * @Date: 2021-08-05 19:51:00
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-09-02 16:55:07
 * @FilePath: \goumee-star-frontend\src\modules\public\studio\index.vue
-->
<template>
  <div class="tg-page-container tg-public-studio-page">
    <tg-card :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form :show-message="false" @submit.native.prevent size="mini">
        <div class="filter-form-div">
          <div class="filter-form-item">
            <el-form-item
              label="业务类型："
              class="flex-form-item"
              label-width="60px"
              style="margin-bottom: 14px"
            >
              <el-select
                popper-class="el-select-popper-mini"
                class="select"
                v-model="queryForm.select_business_type"
                placeholder=""
                style="width: 100%"
              >
                <el-option label="全部" :value="-1" />
                <el-option
                  :key="key"
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, key) in BusinessTypeOptions"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="直播间名称：" label-width="80px">
              <el-input
                class="input"
                placeholder="请输入直播间名称"
                v-model="queryForm.studio_name"
                v-key-enter="onQuerySearchClick"
              />
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item>
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
                <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </tg-card>
    <tg-card
      v-loading="loading"
      class="mgt-10 flex-auto"
      :padding="[0, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div style="margin-top: 12px" v-if="Permission.canEdit">
        <tg-button @click="toggleAddStudioModalVisible(true)" type="primary" icon="ico-btn-add"
          >新增直播间</tg-button
        >
      </div>
      <el-table stripe style="margin-top: 12px" :data="list" v-bind="tableProps">
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无直播间"></empty-common>
        </template>
      </el-table>
      <el-pagination
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
        v-if="total > 0 && Permission.canViewList"
      />
    </tg-card>
    <AddStudio
      :visible="AddStudioVisible"
      @dialog:close="onAddStudioModalClose"
      :studio="currentStudio"
    />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
.tg-public-studio-page {
  .el-table {
    a,
    .cell,
    .status {
      font-size: 12px;
    }
    .tg-button {
      margin-right: 10px;
    }
  }
}
</style>
