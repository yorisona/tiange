<template>
  <div class="tg-finance-settlement-cost-page">
    <tg-card :padding="[16, 0, 4, 16]" @rect:update="onTopCardRectUpdate">
      <el-form size="mini" label-width="60px">
        <div class="filter-form-div">
          <div class="filter-form-item" style="min-width: 314px">
            <el-form-item label="项目搜索：">
              <el-input
                placeholder="请输入关键字"
                v-model="filterForm.search_value"
                class="input-with-select"
                style="width: 234px"
                v-key-enter="reload"
              >
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model="filterForm.search_type"
                  slot="prepend"
                  placeholder="请选择"
                  style="width: 100px; padding-left: 6px"
                >
                  <el-option label="项目名称" value="1"></el-option>
                  <el-option label="项目编码" value="2"></el-option>
                  <!--                  <el-option label="客户名称(公司)" value="3"></el-option>-->
                  <el-option label="供应商名称" value="4"></el-option>
                  <el-option label="结算编号" value="5"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算类型：">
              <el-select
                popper-class="el-select-popper-mini settlement-type"
                v-model="filterForm.settlement_type"
                style="width: 100%"
              >
                <el-option value="" label="全部" />
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
                v-model="filterForm.status"
                style="width: 100%"
              >
                <el-option value="" label="全部" />
                <template v-for="opt in SettlementStatusOptions">
                  <el-option
                    v-if="opt.value !== 0"
                    :value="opt.value"
                    :key="opt.value"
                    :label="opt.label"
                  />
                </template>
              </el-select>
            </el-form-item>
          </div>
          <div class="filter-form-item">
            <el-form-item label="结算周期：">
              <el-date-picker
                v-model="filterForm.month"
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
                v-model="filterForm.account_month"
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
                v-model="filterForm.settlement_scan_status"
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
          <div class="filter-form-item" style="margin-right: 0; min-width: 120px">
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
      class="result-list Customer-contract mgt-10"
      :class="cardFlexClass"
      :padding="[16, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <tg-button-line v-if="CanIUse.createBtn" class="mgb-12">
        <tg-button
          type="primary"
          icon="ico-btn-add"
          @click="onCreateBtnClick"
          :disabled="project === undefined"
          >{{ buttonContent }}</tg-button
        >
      </tg-button-line>
      <el-table
        stripe
        border
        show-summary
        v-loading="loading"
        :data="data"
        v-bind="tableProps"
        :summary-method="summaryMethod"
      >
        <el-table-column v-for="(col, colIndex) in financeColumns" v-bind="col" :key="colIndex" />
        <template #empty>
          <empty-common detail-text="暂无成本结算"></empty-common>
        </template>
      </el-table>
      <el-pagination
        :current-page.sync="filterForm.page_num"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="filterForm.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
        v-if="total > 0"
      />
    </tg-card>
    <settlement-detail-dialog
      ref="settlementDetailDialogRef"
      @success:refuse="reload()"
      @success:confirm="onConfirmSuccuss"
    />
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
    <tg-mask-loading :visible="isFetchingDetail" content="正在获取详情，请稍候..." />
  </div>
</template>

<script type="ts">
import setup from '@/modules/settlement/cost/list';
export default setup('TgFinanceSettlementCost');
</script>

<style lang="less">
@import '~@/styles/utils/index.less';
.tg-finance-settlement-cost-page {
  .number-div {
    display: flex;
    justify-content: center;
    .number-span {
      width: 140px;
      text-align: left;
      margin-right: -30px;
    }
  }
  flex: auto;
  .reason-dialog-content {
    .fc(14px, var(--text-color));
    line-height: 22px;
    .pd(24px);
  }
  .tg-btn-link {
    font-size: 12px;
  }
  a {
    font-size: 12px;
  }
}
.tg-finance-settlement-cost-page {
  .el-input {
    color: var(--text-color);
    .el-input__inner {
      border-color: var(--border-line-color);
    }
  }
  .input-with-select .el-input-group__prepend {
    width: 88px;
    .el-select {
      .el-input .el-input__inner {
        border-color: transparent;
      }
    }
  }
}
</style>
