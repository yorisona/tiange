<!--
 * @Author: 肖槿
 * @Date: 2021-07-20 16:13:55
 * @Description: 达人管理
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-09 15:15:56
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\index.vue
-->

<template>
  <div class="customer-kol-manage tg-page-container" style="min-width: 1100px">
    <tg-card class="search-box" :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <!-- [筛选项] -->
      <el-form size="mini" :show-message="false" label-width="60px">
        <div class="filter-form-div no-wrap">
          <div class="filter-form-item more">
            <el-form-item label="达人名称：">
              <el-input
                v-key-enter="clickQueryCustomer"
                v-model.trim="filterParams.kol_name"
                style="width: 100%"
                placeholder="请输入达人名称"
                clearable
              />
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label="业务类型：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="filterParams.business_type"
                style="width: 100%"
              >
                <el-option value label="全部" />
                <el-option
                  :label="opt.label"
                  :value="opt.value"
                  :key="opt.value"
                  v-for="opt in businessTypeOptions"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label="达人标签：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="filterParams.kol_tag"
                style="width: 100%"
              >
                <el-option value label="全部" />
                <el-option
                  :label="opt.label"
                  :value="opt.value"
                  :key="opt.value"
                  v-for="opt in kolTagList"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label="擅长平台：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="filterParams.platform"
                style="width: 100%"
              >
                <el-option
                  :label="opt.label"
                  :value="opt.value"
                  :key="opt.value"
                  v-for="opt in newPlatformList"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label-width="0">
              <div style="min-width: 208px; max-width: 208px">
                <tg-button class="mgr-8" @click="changeShowMoreParams">高级筛选</tg-button>
                <tg-button class="mgr-8" type="primary" @click="clickQueryCustomer">查询</tg-button>
                <tg-button class="mgr-8" @click="resetCustomer">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
        <div v-if="show" class="filter-form-div no-wrap">
          <div class="filter-form-item more">
            <el-form-item label="审核状态：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="filterParams.verify_status"
                style="width: 100%"
              >
                <el-option value label="全部" />
                <el-option
                  :label="opt.label"
                  :value="opt.value"
                  :key="opt.value"
                  v-for="opt in kolVerifyStatusFilter"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label="创建人：">
              <el-input
                v-model.trim="filterParams.add_by"
                style="width: 100%"
                placeholder="请输入创建人"
                clearable
              />
            </el-form-item>
          </div>
          <div class="filter-form-item more">
            <el-form-item label="更新日期：">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy.MM.dd"
                size="mini"
                style="width: 100%; min-width: 134px"
                v-model="filterParams.gmt_modified_gte"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item more"></div>
          <div class="filter-form-item more"></div>
        </div>
      </el-form>
      <tg-label-group
        class="tg-label-group-mini"
        style="margin-top: 5px"
        v-if="show"
        v-model="filterParams.area"
        :options="myAreaType"
        label="擅长类目"
      />
    </tg-card>
    <tg-card
      class="list-center mgt-10"
      :class="cardFlexClass"
      @rect:update="onRectUpdate"
      :padding="[12, 16, 0, 16]"
      v-bind="cardProps"
    >
      <!-- [操作行] -->
      <tg-button-line class="flex-none">
        <tg-button v-if="Permission.canCreateKol" type="primary" icon="ico-btn-add" @click="addCol">
          新增达人
        </tg-button>
      </tg-button-line>
      <!-- [数据表格] -->
      <el-table
        v-if="Permission.canViewKolList"
        class="supplier-list-kol-list"
        :class="Permission.canCreateKol ? 'mgt-12' : 'mgt-4'"
        border
        style="cursor: pointer"
        stripe
        v-loading="tableLoading"
        :data="customerList"
        v-bind="tableProps"
        @row-click="goDetail"
      >
        <el-table-column v-for="(col, index) in kolColumn" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无数据"></empty-common>
        </template>
      </el-table>
      <div class="block flex-none">
        <el-pagination
          v-if="Permission.canViewKolList && customerList.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size.sync="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next, sizes, jumper"
        />
      </div>
    </tg-card>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
.supplier-list-kol-list {
  /deep/ .el-button {
    font-size: 12px;
  }
}
/deep/ .tg-label-group-label {
  width: 60px;
  margin-left: -18px;
}
/deep/ .el-button {
  color: var(--theme-color);
  font-weight: normal;
}
</style>
