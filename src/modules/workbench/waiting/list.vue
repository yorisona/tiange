<template>
  <div class="tg-workbench-tab-waiting flex-auto">
    <tg-block class="tg-filter-block flex-none" bodyStyle="padding: 10px 20px 0 20px">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="审批编号：">
          <el-input
            size="medium"
            placeholder="请输入审批编号"
            v-model="queryForm.approval_uid"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="审批类型：">
          <el-select
            size="medium"
            placeholder="请选择审批类型"
            v-model="queryForm.approval_type"
            style="width: 240px"
          >
            <el-option
              v-for="opt in typeOptions"
              :label="opt.label"
              :value="opt.value"
              :key="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发起时间：">
          <el-date-picker
            v-model="queryForm.start_time"
            unlink-panels
            type="daterange"
            size="small"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="queryForm.end_time"
            unlink-panels
            type="daterange"
            size="small"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="" label-width="0">
          <tg-button type="primary" @click="reload">搜索</tg-button>
          <tg-button type="default" class="mgl-20" @click="reset">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-block>
    <tg-block class="mgt-10 flex-auto">
      <el-table stripe size="medium" v-loading="loading" :data="data" @row-click="onRowClick">
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      </el-table>
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="queryForm.num"
        :total="total"
        layout="total, prev, pager, next, sizes, jumper"
        style="margin: 24px 0 14px 0"
      />
    </tg-block>
  </div>
</template>

<script src="./list.tsx"></script>
