<!--
 * @Author       : yunie
 * @Date         : 2022-07-19 15:07:26
 * @LastEditTime : 2022-07-26 13:30:46
 * @FilePath     : \src\modules\datacenter\shoplive\tabs\projectDetail\projectShopDetail.vue
 * @Description  :
-->
<template>
  <div class="table-main">
    <tg-card :padding="[18, 18, 18]">
      <!-- <el-input
        size="medium"
        placeholder="请输入商品名称或商品编码"
        v-model="searchProjectName"
        style="width: 400px"
      />
      <el-select
        style="margin-left: 12px"
        placeholder="请选择类目"
        v-model="select_cat_id"
        filterable
      >
        <el-option
          v-for="item in categoryList"
          :label="item.cat_name"
          :key="item.cat_id"
          :value="item.cat_id"
        />
      </el-select> -->
      <el-form
        style="height: 28px"
        :inline="true"
        ref="formRef"
        label-width="60px"
        size="mini"
        label-position="left"
      >
        <el-form-item label="商品信息">
          <el-input
            v-model.trim="searchProjectName"
            placeholder="请输入商品名称或商品编码"
            style="width: 204px"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 14px" label="二级类目">
          <el-select
            style="width: 144px"
            placeholder="请选择类目"
            v-model="select_cat_id"
            filterable
            @change="onSelectCatIdChange"
          >
            <el-option label="全部" :value="undefined" />
            <el-option
              v-for="item in categoryList"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 14px" label="三级类目">
          <el-select
            style="width: 144px"
            placeholder="请选择类目"
            v-model="third_tiange_cat_id"
            filterable
          >
            <el-option label="全部" :value="undefined" />
            <el-option
              v-for="item in categoryList2"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 14px">
          <tg-button type="primary" @click="searchInfo">查询</tg-button>
          <tg-button class="mgl-12" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <div style="background-color: rgb(246, 246, 246); height: 10px"></div>
    <tg-card
      class="flex-auto live-display-content"
      :padding="[18, 18, 0, 18]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-table
        stripe
        border
        :data="saleInfoData"
        v-loading="saleInfoLoading"
        @sort-change="tableSort"
        :default-sort="{ prop: 'sale_count', order: 'descending' }"
        height="100%"
        :header-cell-style="{
          background: '#ffffff',
          height: '36px !important',
          color: 'var(--text-color)',
          fontSize: '12px',
          padding: 0,
          fontWeight: 'bold',
          borderBottom: '1px solid var(--table-border-color)',
        }"
      >
        <el-table-column v-for="(col, index) in infoColumn" v-bind="col" :key="index" />
        <template slot="empty">
          <empty-common detail-text="暂无数据"></empty-common>
        </template>
      </tg-table>
      <div class="block flex-none" style="margin: 0 0 3px 0">
        <el-pagination
          v-if="infoTotal > 0"
          class="mgt-12"
          :current-page="saleInfo.page_num"
          :page-size="saleInfo.num"
          :total="infoTotal"
          @current-change="onCurrentChange"
          layout="total, prev, pager, next, jumper"
        />
      </div>
    </tg-card>
  </div>
</template>
<script src="./detail.tsx"></script>
<!--<style lang="less">
.zIndex {
  .el-dialog__body {
    max-height: calc(100vh - 160px);
  }
}
</style>-->
<style lang="less" scoped>
// .table-div {
//   min-height: 300px;
//   max-height: 938px;
// }
/deep/.tg-card.inner-overflow {
  height: 557px !important;
}
/deep/.goods-info {
  display: flex;
  flex: 1;
  img {
    width: 70px;
    height: 70px;
    border-radius: 2px;
    margin-right: 10px;
  }
  .info-row {
    .goods-title {
      width: 120px;
      height: 32px;
      line-height: 16px;
      font-size: 12px;
      color: var(--text-color);
      font-weight: 600;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 12px;
      &:hover {
        color: var(--theme-color);
      }
    }
  }
}
/deep/ .el-table {
  thead > tr > th {
    line-height: 22px;
    padding: 5px 12px !important;
    .cell {
      .caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 22px;
        width: 18px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
        .sort-caret.ascending {
          // border-bottom-color: #c0c4cc; // ui说点击排序icon要有颜色变化
          top: 0px;
        }
        .sort-caret.descending {
          // border-top-color: #c0c4cc; // ui说点击排序icon要有颜色变化
          bottom: 0px;
        }
      }
    }
  }
}
/deep/.el-pagination .el-pagination__jump {
  margin-left: 12px !important;
}
</style>
<!--<style lang="less">
.v-modal {
  z-index: 2002 !important;
}
.zIndex {
  z-index: 2002 !important;
}
</style>-->
