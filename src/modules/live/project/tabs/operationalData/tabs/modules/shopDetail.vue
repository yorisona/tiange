<!--
 * @Author       : yunie
 * @Date         : 2022-07-19 15:07:26
 * @LastEditTime : 2022-07-25 11:12:57
 * @FilePath     : \src\modules\datacenter\shoplive\components\commodity\module\shopDetail.vue
 * @Description  :
-->
<template>
  <div class="table-main">
    <div>
      <el-form :inline="true" ref="formRef" label-width="60px" size="mini" label-position="left">
        <el-form-item label="商品信息">
          <el-input
            v-model.trim="searchProjectName"
            placeholder="请输入商品名称或商品编码"
            style="width: 264px"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 14px" label="二级类目">
          <el-select
            style="width: 264px"
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
            style="width: 264px"
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
          <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-lalal">
      <el-table
        stripe
        class="table-div"
        border
        height="100%"
        :data="saleInfoData"
        :key="saleInfoLoading"
        v-loading="saleInfoLoading"
        @sort-change="tableSort"
        :default-sort="defaultSort"
      >
        <el-table-column v-for="(col, index) in infoColumn" v-bind="col" :key="index" />
        <template #empty>
          <empty-common :imgWidth="200" :imgHeight="100" />
        </template>
      </el-table>
      <div v-if="saleInfoData.length > 0" class="block flex-none">
        <el-pagination
          :current-page="saleInfo.page_num"
          :page-sizes="[10, 20]"
          :page-size="saleInfo.num"
          :total="infoTotal"
          @current-change="onCurrentChange"
          @size-change="handlePageSizeChange"
          layout="total, prev, pager, next, sizes, jumper"
        />
      </div>
    </div>
  </div>
</template>
<script src="./shopDetail.tsx"></script>
<style lang="less" scoped>
/deep/.goods-info {
  display: flex;
  img {
    width: 70px;
    height: 70px;
    border-radius: 2px;
    margin-right: 10px;
  }
  .info-row {
    .goods-title {
      width: 164px;
      height: 32px;
      line-height: 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-color);
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
.table-lalal {
  margin-top: 4px;
}
/deep/ .el-table {
  // .el-table__empty-block {
  //   width: 200px !important;
  //   height: 200px !important;
  //   position: absolute;
  //   top: 20px;
  //   margin-left: -100px;
  // }

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
</style>
