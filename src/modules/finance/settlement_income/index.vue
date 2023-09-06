<template>
  <div class="finance-settlement flex-auto">
    <tg-card :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form :model="queryParams" size="mini" label-width="60px">
        <div class="filter-form-div">
          <div class="filter-form-item" style="min-width: 314px">
            <el-form-item label="项目搜索：">
              <el-input
                placeholder="请输入关键字"
                v-model="queryParams.search_value"
                class="input-with-select"
                style="width: 234px"
                v-key-enter="reload"
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model="queryParams.search_type"
                  slot="prepend"
                  placeholder="请选择"
                  style="width: 100px; padding-left: 6px"
                >
                  <el-option label="项目名称" value="1"></el-option>
                  <el-option label="项目编码" value="2"></el-option>
                  <el-option label="客户名称" value="3"></el-option>
                  <el-option label="结算编号" value="5"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算类型：">
              <el-select
                popper-class="el-select-popper-mini settlement-type"
                v-model="queryParams.settlement_type"
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <template v-for="group in SettlementTypeOptions">
                  <template v-if="group.options.length > 0">
                    <el-option-group :key="group.label" :label="group.label">
                      <el-option
                        v-for="opt in group.options"
                        :value="opt.value"
                        :label="opt.label"
                        :key="opt.value"
                      />
                    </el-option-group>
                  </template>
                  <template v-else>
                    <el-option :value="group.value" :label="group.label" :key="group.value" />
                  </template>
                </template>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算状态：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="queryParams.status"
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <template v-for="opt in SettlementStatusOptions">
                  <el-option
                    v-if="opt.value !== 0"
                    :value="opt.value"
                    :label="opt.label"
                    :key="opt.value"
                  />
                </template>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算周期：">
              <el-date-picker
                v-model="queryParams.month"
                type="month"
                placeholder="选择月"
                style="width: 100%"
                format="yyyy.MM"
                value-format="yyyy-MM"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="账期时间：">
              <el-date-picker
                v-model="queryParams.account_month"
                type="month"
                placeholder="选择月"
                style="width: 100%"
                format="yyyy.MM"
                value-format="yyyy-MM"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="扫描件：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="queryParams.settlement_scan_status"
                style="width: 100%"
              >
                <el-option label="全部" value="" />
                <el-option
                  v-for="opt in ScanStatusOptions"
                  :value="opt.value"
                  :label="opt.label"
                  :key="opt.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item" style="min-width: auto; flex: 0; margin-right: 0">
            <el-form-item label-width="0">
              <div class="filter-form-item-btn">
                <tg-button type="primary" @click="reload">查询</tg-button>
                <tg-button class="mgl-8" @click="reset">重置</tg-button>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </tg-card>
    <tg-card
      v-loading="loading"
      class="mgt-10"
      :class="cardFlexClass"
      :padding="[16, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <el-table
        stripe
        border
        show-summary
        :data="data"
        v-bind="tableProps"
        :summary-method="summaryMethod"
      >
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        <template #empty>
          <empty-common detail-text="暂无收入结算"></empty-common>
        </template>
      </el-table>
      <el-pagination
        :current-page.sync="queryParams.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParams.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
        v-if="total > 0"
      />
    </tg-card>
    <buessiness-settlement @success="reload" ref="BuessinessSettlement" />
    <reverseAuditDialog ref="reverseAuditDialogRef" />
    <tg-mask-loading :visible="reverseAuditLoading" content="正在提交，请稍候..." />
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      :visible="reasonDialogVisible"
      width="440px"
      @close="onReasonDialogClose"
    >
      <template #title>冲销原因</template>
      <div class="reason-dialog-content">{{ reason }}</div>
    </el-dialog>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
.finance-settlement {
  .tg-btn-link {
    font-size: 12px;
  }
  a {
    font-size: 12px;
  }
}
</style>
