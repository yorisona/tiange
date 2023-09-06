<template>
  <div class="tg-page-container tg-customer-brand-page">
    <tg-card :padding="[16, 16, 4, 16]">
      <el-form size="mini" :show-message="false" label-width="60px" @submit.native.prevent>
        <div class="filter-form-div">
          <div class="filter-form-item single">
            <el-form-item label="品牌名称：">
              <el-input
                v-key-enter="onQuerySearchClick"
                class="input"
                size="mini"
                placeholder="请输入品牌名称"
                v-model="queryForm.brand_name"
              />
            </el-form-item>
          </div>
          <div class="filter-form-item single">
            <el-form-item label-width="0">
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
                <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </tg-card>
    <tg-card v-loading="loading" class="mgt-10 flex-auto" :padding="[12, 0, 0, 16]">
      <div class="brand-operation-area" v-if="Permission.canEdit">
        <tg-button @click="toggleAddBrandModalVisible(true)" type="primary" icon="ico-btn-add"
          >新增品牌</tg-button
        >
      </div>
      <div class="brand-item-card-container">
        <template v-for="item in list">
          <brand-item-card :brand-item="item" :key="item.id">
            <tg-icon
              v-if="Permission.canDelete"
              class="ico-btn"
              name="ico-delete"
              @click="handleBrandDelete(item)"
            ></tg-icon>
            <tg-icon
              v-if="Permission.canEdit"
              class="ico-btn"
              name="ico-edit-lite"
              @click="handleBrandEdit(item)"
            ></tg-icon>
          </brand-item-card>
        </template>
        <div class="empty-data" v-if="list.length <= 0">
          <empty-common detail-text="暂无品牌"></empty-common>
        </div>
      </div>
    </tg-card>
    <AddBrand
      :visible="AddBrandVisible"
      @dialog:close="onAddBrandModalClose"
      :brand="currentBrand"
    />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
