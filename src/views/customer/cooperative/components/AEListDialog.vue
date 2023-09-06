<template>
  <common-dialog ref="AEListDialog" :isAppendToBody="true" :title="title" :width="800">
    <div class="addcost-container">
      <el-table
        stripe
        :data="shopLink"
        border
        style="width: 100%; margin-top: 15px; margin-bottom: 10px"
        :header-cell-style="{
          background: '#F5F6F9',
          height: '42px',
          color: '#666666',
          fontWeight: 'bold',
        }"
      >
        <el-table-column label="序号" width="60" fixed="left" type="index" align="center">
        </el-table-column>
        <el-table-column width="289" label="商品名称">
          <template #default="{ row }">
            <span class="overflow-table">{{ row.item_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="289" label="商品链接">
          <template #default="{ row }">
            <a class="overflow-table" :href="row.item_url" target="_blank">{{ row.item_url }}</a>
          </template>
        </el-table-column>
        <el-table-column width="120" label="样品是否安排" align="center">
          <template #default="{ row }">
            <p v-if="row.is_sample_arrange" style="text-align: center">是</p>
            <p v-else style="text-align: center">否</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </common-dialog>
</template>

<script>
export default {
  name: 'AEListDialog',
  props: {
    shopLink: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    shopLink: {
      handler: 'init',
      deep: true,
    },
  },
  data() {
    return {
      title: 'V任务链接',
    };
  },
  methods: {
    init() {
      // console.log(this.shopLink, 111)
    },
    // 显示
    show() {
      this.$refs.AEListDialog.dialogOpen();
    },
  },
};
</script>

<style lang="less" scoped>
.addcost-container {
  min-height: 300px;
  padding: 20px;
  padding-top: 0;
}
.overflow-table {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
