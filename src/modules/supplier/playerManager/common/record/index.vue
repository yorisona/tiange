<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-25 11:45:51
-->
<template>
  <el-dialog
    class="tg-dialog-classic playermanager-record-dialog tg-dialog-vcenter-new"
    :visible="dialogVisible"
    width="990px"
    title="敏感信息查看记录"
    @close="close"
    lock-scroll
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="filter-area">
      <div class="filter-one">
        <span class="label">操作人：</span>
        <el-input
          size="mini"
          :clearable="false"
          v-model="filterForm.add_by_name"
          placeholder="请输入操作人"
          style="width: 112px"
        ></el-input>
      </div>
      <div class="filter-one">
        <span class="label">主播真名：</span>
        <el-input
          :clearable="false"
          size="mini"
          v-model="filterForm.real_name"
          placeholder="请输入主播真名"
          style="width: 112px"
        ></el-input>
      </div>
      <div class="filter-one">
        <span class="label">主播花名：</span>
        <el-input
          :clearable="false"
          size="mini"
          v-model="filterForm.flower_name"
          placeholder="请输入主播花名"
          style="width: 112px"
        ></el-input>
      </div>
      <div class="filter-one">
        <span class="label">查询日期：</span>
        <el-date-picker
          v-model="filterForm.dates"
          type="daterange"
          size="mini"
          :editable="false"
          :clearable="false"
          range-separator="～"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy.MM.dd"
          value-format="yyyy-MM-dd"
          style="width: 190px"
          :picker-options="pickerOptions"
          @blur="onDateBlur"
        >
        </el-date-picker>
      </div>
      <tg-button type="primary" @click="onQueryClick" class="mgl-18">查询</tg-button>
      <tg-button @click="onResetClick" style="margin-left: 8px">重置</tg-button>
    </div>
    <div style="background: #f6f6f6; height: 12px"></div>
    <div class="data-table">
      <el-table
        :border="list.length ? true : false"
        :class="list.length ? '' : 'hidden-table'"
        :max-height="390"
        :data="list"
      >
        <el-table-column
          v-for="(col, index) in columns"
          :key="index"
          v-bind="col"
        ></el-table-column>
        <template #empty>
          <empty-common detail-text="暂无查看记录"></empty-common>
        </template>
      </el-table>
    </div>
    <!-- visibility: visible; -->
    <div
      class="data-pagination"
      :style="list.length ? 'visibility: visible' : 'visibility: hidden'"
    >
      <el-pagination
        :current-page.sync="filterForm.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size.sync="filterForm.num"
        layout="total, prev, pager, next, sizes"
        :total="filterForm.total"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </el-dialog>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';

.playermanager-record-dialog {
  .filter-area {
    display: flex;
    padding: 12px 18px;
    align-items: center;
    .filter-one {
      margin-left: 18px;
      &:first-of-type {
        margin-left: 0;
      }
      .label {
        font-size: 12px;
        color: var(--text-second-color);
      }
      .el-input {
        font-size: 12px;
        .el-input__inner {
          color: var(--text-color);
        }
      }
      .el-date-editor {
        border-color: var(--border-line-color);
        .el-range-separator {
          width: 12%;
          min-width: 20px;
        }
        .el-range-input {
          width: 44%;
          color: var(--text-color);
        }
        .el-range__close-icon {
          display: none;
        }
      }
    }
    .tg-btn {
      width: 60px;
    }
  }
  .data-table {
    padding: 18px;
    height: 426px;
    .el-table {
      .el-table__header-wrapper thead tr th {
        padding-top: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid #e3e8ec;
        border-right: 1px solid #e3e8ec;
        font-size: 12px;
      }
      .el-table__body-wrapper {
        overflow: overlay;
        .el-table__row > td {
          padding-top: 5px;
          padding-bottom: 5px;
          border-bottom: 1px solid #e3e8ec;
          border-right: 1px solid #e3e8ec;
          font-size: 12px;
        }
      }
    }
    .hidden-table {
      .el-table__header-wrapper {
        visibility: hidden;
      }
    }
  }
  .data-pagination {
    padding: 0 18px;
    border-top: 1px solid #e3e8ec;
  }
  .el-pagination {
    padding-right: 0;
    .el-pagination__sizes {
      margin-right: 0;
    }
  }
}
</style>
