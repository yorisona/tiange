<template>
  <div class="tg-workbench-tab-mine">
    <!-- [筛选项] -->
    <tg-block class="tg-filter-block" bodyStyle="padding: 10px 0 0 20px">
      <el-form size="mini" :inline="true" label-width="60px">
        <el-form-item label="项目名称：">
          <el-input
            size="mini"
            placeholder="请输入项目名称"
            v-model="queryForm.project_name"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="文件名称：">
          <el-input
            size="mini"
            placeholder="请输入文件名称"
            v-model="queryForm.file_name"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="审批编号：">
          <el-input
            size="mini"
            placeholder="请输入审批编号"
            v-model="queryForm.approval_uid"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="审批类型：">
          <el-select
            popper-class="el-select-popper-mini"
            placeholder="请选择审批类型"
            v-model="queryForm.approval_type"
            style="width: 150px"
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
            size="mini"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker
            v-model="queryForm.end_time"
            unlink-panels
            type="daterange"
            size="mini"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label=" " label-width="0">
          <tg-button type="primary" @click="reload">搜索</tg-button>
          <tg-button type="default" class="mgl-8" @click="reset">重置</tg-button>
        </el-form-item>
      </el-form>
    </tg-block>
    <!-- [列表] -->
    <div class="mgt-12 flex-fill table-container" bodyStyle="padding:0">
      <tg-block class="tab-wrapper" bodyStyle="padding:6px 0 0">
        <tg-tabs :tabs="tabs" v-model="checkedTab" />
      </tg-block>
      <el-table
        stripe
        class="mgt-10 table-wrapper"
        size="medium"
        height="calc(100% - 119px)"
        v-loading="loading"
        :data="data"
        @row-click="onRowClick"
      >
        <template slot="empty">
          <div class="nodata">
            <empty-common></empty-common>
          </div>
        </template>
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      </el-table>
      <el-pagination
        v-if="data.length > 0"
        class="pagination-wrapper"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="queryForm.num"
        :total="total"
        layout="total, prev, pager, next, sizes, jumper"
      />
    </div>
  </div>
</template>

<script src="./list.tsx"></script>

<style lang="less" scoped>
.tg-workbench-tab-mine {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
  .table-container {
    background: white;
    overflow: hidden;
  }
  .flex-fill {
    flex: 1;
    display: flex;
    flex-direction: column;
    .tab-wrapper {
      border-bottom: 1px solid rgba(164, 178, 194, 0.3);
      .tg-tabs-header-tab-item {
        width: auto;
      }
    }
    .table-wrapper {
      flex: 1;
      // display: flex;
      // flex-direction: column;
      /deep/ .status-box {
        display: flex;
        .point {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-top: 6px;
          margin-right: 6px;
          border-radius: 50%;
          &.waiting {
            background: rgba(255, 122, 54, 0.7);
          }
          &.success {
            background: rgba(var(--success-rgb-color), 0.6);
          }
          &.failure {
            background: rgba(var(--error-rgb-color), 0.7);
          }
          &.cancel {
            background: rgba(var(--fail-rgb-color), 0.6);
          }
        }
      }
      /deep/ .el-table__header {
        height: 40px;
      }
      /deep/ .el-table__body-wrapper {
        flex: 1;
      }
      // height: calc(100vh - 341px);
      // overflow: scroll;
      padding: 0 18px;
      // @media only screen and (min-width: 1562px) {
      //   height: calc(100vh - 292px);
      // }
      // /deep/ .el-table::before {
      //   height: 0;
      // }
    }
    .pagination-wrapper {
      margin: 12px 16px 24px 16px !important;
    }
  }
}
</style>
