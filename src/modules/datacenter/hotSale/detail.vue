<template>
  <div class="tg-hot-sale-detail-page">
    <tg-card
      class="flex-auto"
      :padding="[0, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <div class="top-handle-box">
        <div class="date-switch">
          <div class="btn-circle" @click="onPrevDay">
            <tg-icon name="ico-arrow-left"></tg-icon>
          </div>
          <span class="live-date">{{ currentDay }}</span>
          <div class="btn-circle" @click="onNextDay">
            <tg-icon name="ico-arrow-right"></tg-icon>
          </div>
        </div>
        <tg-button type="primary" @click="showMonitorDialog">监控设置</tg-button>
      </div>

      <el-table stripe :data="list" v-loading="loading" v-bind="tableProps">
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无数据"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="total > 0"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <Monitor :visible.sync="monitorVisible" />
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.hot-sale-detail-popper-class {
  width: 350px;
}
.hot-sale-detail-talk-time {
  width: 208px;
  padding-top: 8px !important;
  padding-bottom: 18px !important;
}
.talk-time-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .talk-time-item {
    font-size: 12px;
    color: #606974;
    line-height: 16px;
  }
}
.tg-hot-sale-detail-page {
  .el-table tbody > tr > td {
    font-size: 12px;
    padding: 10px 0px !important;
  }
  .top-handle-box {
    height: 56px;
    margin-bottom: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .date-switch {
      display: flex;
      align-items: center;
      .btn-circle {
        width: 28px;
        height: 28px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 16px;
        font-size: 18px;
        color: var(--text-second-color);
        border: 1px solid rgba(var(--tip-icon-rgb-color), 0.3);
        cursor: pointer;
        &:hover {
          > svg.icon {
            .fgc(var(--theme-color));
          }
        }
      }
      .live-date {
        margin: 0 12px;
        color: var(--text-color);
        //font-weight: 600;
        font-size: 16px;
      }
    }
  }
  .el-table tbody > tr > td > .cell {
    overflow: visible;
  }
  .shop-box {
    display: flex;
    overflow: visible;
    .pic-box {
      width: 80px;
      height: 80px;
      margin-right: 10px;
      position: relative;
      .goods-image {
        width: 80px;
        height: 80px;
        border-radius: 2px;
      }
      .hot-icon {
        width: 32px;
        height: 32px;
        position: absolute;
        top: -2px;
        left: -2px;
        z-index: 10;
      }
    }
    .info-box {
      flex: 1;
      padding-right: 40px;
      .commodity-name {
        margin-top: 2px;
        font-size: 12px;
        height: 34px;
        line-height: 16px;
        display: -webkit-box;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          color: var(--theme-color);
        }
      }
      .price-line {
        margin-top: 10px;

        font-weight: 600;
        font-size: 12px;
      }
    }
  }
  .talk-time {
    cursor: pointer;
    &:hover {
      color: var(--theme-color);
    }
  }
}
</style>
