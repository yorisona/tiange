<template>
  <common-dialog ref="vLinkDialog" :isAppendToBody="true" :title="title" :width="800">
    <div class="addcost-container">
      <el-table
        stripe
        :data="vLink"
        border
        style="width: 100%; margin-top: 15px; margin-bottom: 10px"
        :header-cell-style="{
          background: '#F5F6F9',
          height: '42px',
          color: '#666666',
          fontWeight: 'bold',
        }"
      >
        <el-table-column label="序号" width="60" fixed="left" type="index" border align="center">
        </el-table-column>
        <el-table-column width="349" border label="V任务链接">
          <template #default="{ row }">
            <a class="overflow-table" :href="row.v_task_url" target="_blank">{{
              row.v_task_url
            }}</a>
          </template>
        </el-table-column>
        <el-table-column border label="商品链接">
          <template #default="{ row }">
            <a class="overflow-table" :href="row.item_url" target="_blank">{{ row.item_url }}</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </common-dialog>
</template>

<script>
export default {
  name: 'VLinkDialog',
  props: {
    vLink: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    vLink: {
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
      /* do nth */
    },
    // 显示
    show() {
      this.$refs.vLinkDialog.dialogOpen();
    },
  },
};
</script>

<style lang="scss" scoped>
.addcost-container {
  min-height: 300px;
  padding: 20px;
  // padding-top: 0;
}
.overflow-table {
  text-decoration: none;
  color: #396fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-table--border {
  border-radius: 10px;
}
</style>
