<template>
  <div class="tg-page-container tg-marketing-import-log">
    <tg-block class="flex-none">
      <el-form
        class="filter-form flex-form pdt-10 pdb-10"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="70px"
      >
        <el-form-item label="选择日期：" class="flex-form-item">
          <el-date-picker
            v-model="queryForm.date_range"
            clearable
            :editable="false"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '00:00:00']"
            style="width: 276px"
            class="dateInputPicker"
          />
        </el-form-item>
        <el-form-item
          label="状态："
          class="flex-form-item"
          style="margin-right: 18px; margin-bottom: 14px"
        >
          <el-select v-model="queryForm.status" class="select" placeholder="" style="width: 246px">
            <el-option label="全部" :value="0" />
            <el-option label="成功" :value="1" />
            <el-option label="失败" :value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="导入人："
          class="flex-form-item"
          style="margin-right: 18px; margin-bottom: 14px"
        >
          <el-select
            v-model="queryForm.operator"
            filterable
            clearable
            placeholder="请输入关键词"
            style="width: 246px"
          >
            <el-option
              v-for="(item, index) in importUserList"
              :key="index"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label=" "
          class="flex-form-item order-100"
          style="margin-right: 18px; margin-bottom: 14px"
        >
          <tg-button type="primary" @click="onQuerySearchClick">查询</tg-button>
          <tg-button type="negative" class="mgl-12" @click="onQueryResetClick">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-block>
    <tg-block v-loading="loading" class="flex-none mgt-18" bodyStyle="padding: 18px">
      <el-table stripe v-if="Permission.canViewImportLogList" :data="datalist">
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        <template #empty>
          <empty-common detail-text="暂无记录 "></empty-common>
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
        v-if="Permission.canViewImportLogList && total > 0"
      />
    </tg-block>
    <MarketingImortLogDetail
      :importLogDetail="checkedImportLogDetail"
      :visible="ImportLogDetailVisible"
      @dialog:close="onImportLogDetailModalClose"
    />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
.tg-marketing-import-log {
  .el-range-editor.el-input__inner {
    border: 1px solid rgba(164, 178, 194, 0.5);
  }
  .el-range-editor.el-input__inner input {
    color: var(--text-color);
  }
}
</style>
