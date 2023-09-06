<template>
  <div class="commodity-analysis-week-popular">
    <tg-card class="flex-none" :padding="[16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        size="mini"
        :show-message="false"
        :inline="true"
        label-width="60px"
        @submit.native.prevent
      >
        <el-form-item label="项目名称：">
          <el-select popper-class="el-select-popper-mini" disabled value="1" style="width: 204px">
            <el-option value="1" :label="queryForm.project_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="排行规则：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.sort"
            style="width: 204px"
          >
            <el-option value="shop_gmv" label="销售额" />
            <el-option value="shop_sale_count" label="销量" />
          </el-select>
        </el-form-item>
        <el-form-item label="三级类目：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="queryForm.third_tiange_cat_id"
            style="width: 204px"
          >
            <el-option value="" label="全部" />
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.cat_name"
            />
            <el-option :value="2" label="西装" />
          </el-select>
        </el-form-item>
        <el-form-item label="对比时间：">
          <el-date-picker
            style="width: 204px"
            v-model="queryForm.start_date"
            :picker-options="pickerOptions"
            type="week"
            :clearable="false"
            format="yyyy-MM-dd 第 WW 周"
            value-format="yyyy-MM-dd"
            placeholder="选择周"
            @change="timeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <div style="display: flex">
            <tg-button type="primary" @click="onSearchClick">查询</tg-button>
            <tg-button class="mgl-8" @click="onResetClick">重置</tg-button>
            <tg-button
              class="mgl-12"
              icon="ico-btn-export"
              v-if="lastLastData.length || lastData.length"
              @click="exportImage"
              >导出</tg-button
            >
          </div>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card :padding="[0, 0, 16]" class="flex-auto mgt-10" v-bind="cardProps">
      <div class="main" ref="imageTofile">
        <div
          v-loading="loading"
          class="main-item"
          :class="lastData.length === 0 && lastLastData.length === 0 ? 'isnodata' : ''"
        >
          <h3 class="main-item-title">第{{ lastLastWeekNum }}周TOP</h3>
          <Table :list="lastLastData" :row-style="rowColors" />
        </div>
        <div
          v-loading="loading"
          class="main-item last-week"
          style="padding-right: 18px"
          :class="lastData.length === 0 && lastLastData.length === 0 ? 'isnodata' : ''"
        >
          <h3 class="main-item-title">第{{ lastWeekNum }}周TOP</h3>
          <Table :list="lastData" :row-style="rowColors" :rank="true" />
        </div>
      </div>
    </tg-card>
    <tg-mask-loading :visible="exprotImageLoading" content="图片生成中，请稍候..." />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
.commodity-analysis-week-popular {
  .main {
    display: flex;
    justify-content: space-between;
    min-width: 1928px;
    padding: 18px 18px 0;
    .main-item {
      width: calc(42% - 9px);
      padding-bottom: 18px;
      &.isnodata {
        /deep/ .el-table {
          height: 450px;
          .el-table__empty-block {
            /*border-bottom: 2px solid #ebeef5;*/
            height: 450px !important;
          }
        }
      }
      &.last-week {
        width: calc(62% - 9px);
        margin-left: 18px;
        margin-right: 18px;
      }
      .main-item-title {
        margin: 0 0 12px 0;
        line-height: 1;
        color: var(--text-color);
        font-weight: 400;
        font-size: 14px;
      }
    }
  }
}
</style>
