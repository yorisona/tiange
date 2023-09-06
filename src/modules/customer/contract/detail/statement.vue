<template>
  <div class="tg-customer-contract-detail-tab-annex">
    <el-table stripe class="" :data="data" v-loading="loading">
      <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      <template #empty>
        <empty-common detail-text="您还没有结算单详情哦~"></empty-common>
      </template>
    </el-table>
    <el-pagination
      class="mgt-10"
      :current-page.sync="queryForm.page_num"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="queryForm.num"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total"
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
      v-if="total > 0"
    />
    <SettlementDetailDialog :visible="visible" @close="closeDetail" @dialog:clsoe="closeDetail" />
    <AnnexDialog no-status @dialog:close="onAnnexDialogClose" />
  </div>
</template>

<script src="./statement.ts"></script>
