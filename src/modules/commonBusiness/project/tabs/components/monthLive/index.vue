<template>
  <div class="month-live-wrapper">
    <div class="project-live">
      <div class="table-box">
        <div class="live-header">
          <div class="title">
            <span class="bar"></span>
            <span>本月场次</span>
          </div>
        </div>
        <el-table
          class="month-live-table"
          :data="liveDatas"
          stripe
          :height="liveParams.total > 20 ? 230 : 275"
          @row-click="onLiveRowClick"
        >
          <el-table-column
            v-for="(col, index) in liveColumns"
            :key="index"
            v-bind="col"
          ></el-table-column>
          <template #empty>
            <empty-common
              :detail-text="withoutLiveDisplayPermission ? '权限不足，需要查看权限' : '暂无场次'"
            ></empty-common>
          </template>
        </el-table>
        <el-pagination
          v-if="liveParams.total > 20"
          class="live-pagination"
          :current-page.sync="liveParams.page_num"
          :page-sizes="[20, 5, 10, 50]"
          :page-size="liveParams.num"
          layout="total, prev, pager, next, sizes, jumper"
          :total="liveParams.total"
          @current-change="liveCurrentChange"
          @size-change="livePageSizeChange"
        />
      </div>
    </div>
    <div class="project-live">
      <div class="table-box">
        <div class="live-header">
          <div class="title">
            <span class="bar"></span>
            <span>招商商品</span>
          </div>
          <div v-if="shop_live_name" class="tag-box">
            <div class="tag-box-line">
              {{ shop_live_name }}
              <tg-icon class="close-icon" name="ico-a-quseguanbiicon2x" @click="closeShopName" />
            </div>
          </div>
        </div>
        <el-table :data="goodsDatas" stripe :height="merchantGoodsParams.total > 20 ? 460 : 490">
          <el-table-column
            v-for="(col, index) in goodsColumns"
            :key="index"
            v-bind="col"
          ></el-table-column>
          <template #empty>
            <empty-common
              :detail-text="withoutLiveDisplayPermission ? '权限不足，需要查看权限' : '暂无商品'"
            ></empty-common>
          </template>
        </el-table>
        <el-pagination
          v-if="merchantGoodsParams.total > 20"
          class="live-pagination"
          :current-page.sync="merchantGoodsParams.page_num"
          :page-sizes="[20, 5, 10, 50]"
          :page-size="merchantGoodsParams.num"
          layout="total, prev, pager, next, sizes, jumper"
          :total="merchantGoodsParams.total"
          @current-change="merchantCurrentChange"
          @size-change="merchantPageSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import './index.less';
</style>
