<template>
  <el-dialog
    class="customer-dialog settlement-detail-dialog"
    :visible="visible"
    width="1136px"
    @close="emitClose"
  >
    <template #title>
      <span>结算情况</span>
    </template>
    <div style="padding: 10px 20px">
      <el-table stripe :data="details">
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script src="./settlement_detail.ts"></script>
