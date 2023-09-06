<!--
 * @Description: 客户列表 - 店铺管理 - 列表
 * @Author: 白青
 * @Date: 2019-09-29 15:22:06
 * @LastEditTime: 2021-08-24 17:58:54
 * @LastEditors: 肖槿
 -->
<template>
  <div class="customer-index-wrapper">
    <tg-card class="flex-none" :padding="[6, 18, 6, 18]" @rect:update="onTopCardRectUpdate">
      <template v-if="filterFormVisible">
        <tg-label-group
          class="first-weight"
          v-model="categoryIndex"
          :options="categoryList.map(el => ({ label: el.value, value: el.key }))"
          @change="updatePageAndReload"
        >
          <template #label>店铺类目</template>
        </tg-label-group>
      </template>
      <div class="mgt-12" v-if="hideToggleFilterFormVisibleBtn">
        <tg-button type="link" @click="toggleFilterFormVisible()"
          >{{ filterFormVisible ? '收拢' : '展开' }}店铺类型筛选</tg-button
        >
      </div>
      <!-- [筛选项] -->
      <el-form
        class="customer-search-bar filter-form"
        style="padding-top: 7px"
        :inline="true"
        size="small"
        :show-message="false"
      >
        <el-form-item style="margin-right: 18px" label="店铺类型：">
          <el-select v-model="shopTypeIndex" placeholder="请选择店铺类型" style="width: 150px">
            <template v-for="item in shopType">
              <el-option :key="item.value" :label="item.value" :value="item.type" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 18px" label="客户类型：">
          <el-select v-model="companyTypeIndex" placeholder="请选择客户类型" style="width: 150px">
            <template v-for="item in companyType">
              <el-option :key="item.value" :label="item.value" :value="item.type" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 18px" label="客户分类：">
          <el-select
            v-model="customerClass"
            placeholder="全部"
            style="width: 150px"
            @change="selectCustomerClass"
          >
            <template v-for="item in customerClassList">
              <el-option :key="item.value" :label="item.value" :value="item.type" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 18px" label="年框客户：">
          <el-select v-model="is_year_customer" placeholder="请选择年框客户" style="width: 150px">
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型：" style="margin-right: 18px">
          <el-select v-model="business_type" style="width: 150px">
            <el-option value="" label="全部" />
            <el-option
              :label="opt.label"
              :value="opt.value"
              :key="opt.value"
              v-for="opt in BusinessTypeOptions"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 89px" label="名称搜索：">
          <el-input
            placeholder="请输入内容"
            v-model.trim="inputValue"
            class="input-with-select"
            style="width: 388px"
          >
            <el-select
              v-model="searchValue"
              slot="prepend"
              placeholder="请选择"
              @change="searchValueHandle"
              style="width: 150px; color: var(--text-color)"
            >
              <el-option label="录入人" value="1"></el-option>
              <el-option label="店铺/公司" value="2"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label=" " class="flex-form-item order-100">
          <tg-button type="primary" @click="clickQueryCustomer">查询</tg-button>
          <tg-button class="mgl-12" @click="resetCustomer">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <!-- [数据列表] -->
    <tg-card
      class="list-center mgt-18"
      :class="cardFlexClass"
      @rect:update="onRectUpdate"
      :padding="[12, 18, 0, 18]"
      v-bind="cardProps"
    >
      <!-- [操作行] -->
      <tg-button-line class="flex-none">
        <tg-button
          v-if="Permission.canCreate"
          type="primary"
          icon="ico-btn-add"
          @click="addCustomer"
          >新增店铺
        </tg-button>
        <tg-button icon="ico-btn-export" @click="exportCustomers" v-if="Permission.canExport"
          >导出</tg-button
        >
        <tg-button
          type="negative"
          icon="ico-btn-delete"
          :disabled="selectedCount === 0"
          @click="delCustomer"
          v-if="Permission.canDelete"
          >删除</tg-button
        >
      </tg-button-line>
      <!-- [数据表格] -->
      <el-table
        stripe
        class="mgt-12 customer-table"
        v-loading="loading"
        :data="list"
        v-bind="tableProps"
        @row-click="openDetailDrawer"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        <template #empty>
          <div class="empty-box no_data" style="padding: 40px 0">
            <img src="@/assets/img/anchor_nodata.png" />
            <p>暂时木有内容呀~</p>
          </div>
        </template>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.currentPage"
        :page-sizes.sync="pagination.pageSizes"
        :page-size.sync="pagination.pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes, jumper"
      />
    </tg-card>
    <add-customer :visible="customerVisible" @close="close" @save="saveCustomer" />
    <company-detail ref="detailDrawerRef" :data="rowDetail" />
  </div>
</template>

<script src="./index.tsx"></script>

<style lang="scss">
@import './index.scss';
</style>

<style lang="less">
@import './index.less';
.customer-table {
  a {
    font-size: 12px;
  }
}
</style>
