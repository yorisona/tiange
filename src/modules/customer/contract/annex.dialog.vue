<template>
  <el-dialog
    :visible="visible"
    class="customer-dialog annex-dialog"
    width="450px"
    @close="emitClose"
    top="0"
  >
    <template #title>{{ title }}</template>
    <div style="max-height: 480px; overflow-y: auto; padding: 18px 20px 32px">
      <el-table stripe :data="annex">
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script src="./annex.dialog.ts"></script>

<style lang="less">
@import './annex.dialog.less';
</style>
