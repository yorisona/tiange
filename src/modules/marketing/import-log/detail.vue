<template>
  <div class="tg-dialog-vcenter">
    <el-dialog class="tg-dialog-classic" :visible="visible" width="612px" @close="onCancelBtnClick">
      <template #title>
        <span>导入客户信息</span>
      </template>
      <div
        style="
          min-height: 300px;
          max-height: 660px;
          padding: 24px;
          overflow-y: auto;
          overflow-x: hidden;
        "
      >
        <el-table stripe :data="datalist">
          <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script src="./detail.ts"></script>
