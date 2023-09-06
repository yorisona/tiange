<template>
  <div class="tg-public-commodity-page">
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
          <el-input
            style="width: 192px"
            clearable
            placeholder="请输入项目名称"
            v-model="queryForm.project_name"
          />
        </el-form-item>
        <el-form-item label="商品编码：">
          <el-input
            style="width: 192px"
            clearable
            placeholder="请输入商品编码"
            :maxlength="20"
            v-model="queryForm.item_id"
          />
        </el-form-item>
        <el-form-item label="商品款号：">
          <el-input
            style="width: 192px"
            clearable
            placeholder="请输入商品款号"
            :maxlength="20"
            v-model="queryForm.item_sn"
          />
        </el-form-item>
        <el-form-item label="商品年度：">
          <el-date-picker
            style="width: 192px"
            v-model="queryForm.year"
            value-format="yyyy"
            type="year"
            placeholder="请选择年度"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品季度：">
          <el-select
            popper-class="el-select-popper-mini"
            style="width: 192px"
            clearable
            v-model="queryForm.season"
            placeholder="请选择季度"
          >
            <el-option
              style="width: 100%"
              v-for="item in quarterList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人：">
          <el-select
            popper-class="el-select-popper-mini"
            style="width: 192px"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="getUserList"
            @change="onUserIdChange"
            v-model="queryForm.add_by"
            placeholder="请输入并选择创建人"
          >
            <el-option
              v-for="(item, index) in userList"
              :key="index"
              :label="item.username"
              :value="item.id"
            >
              <span>{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
          <tg-button class="mgl-8" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-card>
    <tg-card
      class="mgt-10 flex-auto"
      :padding="[12, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line v-if="canUpdate">
        <tg-upload
          action="/api/data_center/upload_goods_data"
          :show-file-list="false"
          :beforeUpload="beforeMerchantUpload"
          :success="successMerchantUpload"
        >
          <tg-button type="primary" icon="ico-upload-lite">商品上传</tg-button>
        </tg-upload>

        <tg-button style="color: var(--theme-color)" type="link" @click="downloadModelxlsx"
          >下载模板</tg-button
        >
        <span class="empty" />
        <tg-button @click="showTargetRule">目标设置</tg-button>
      </tg-button-line>
      <el-table
        border
        :class="canUpdate ? 'mgt-12' : 'mgt-4'"
        stripe
        :data="list"
        v-loading="loading"
        v-bind="tableProps"
      >
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
    <edit-commodity
      :visible.sync="editVisible"
      :item="currentCommodity"
      @save="onSave"
    ></edit-commodity>
    <targetRule ref="targetRuleRef" />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
/deep/ .el-table thead > tr > th {
  padding: 6px 12px;
  font-size: 12px;
  .cell {
    padding-left: 0px;
    height: 22px;
    line-height: 22px;
  }
}
/deep/ .el-table tbody > tr > td {
  padding: 6px 0px;
  font-size: 12px;
  .cell {
    padding-left: 12px;
    line-height: 22px;
    .operation {
      font-size: 12px;
      line-height: 22px;
      a {
        font-size: 12px !important;
      }
    }
  }
}
.button-line {
  grid-template-columns: auto auto 1fr auto;
}
</style>
