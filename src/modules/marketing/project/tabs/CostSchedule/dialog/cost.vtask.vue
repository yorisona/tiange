<!--
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - V任务链接
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-21 14:54:11
-->

<template>
  <tg-block class="dialog-build-in-cost-vtask">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      :visible="visible"
      width="612px"
      :close-on-click-modal="true"
      @close="close"
    >
      <template #title>V任务链接</template>
      <div style="padding: 24px">
        <el-table stripe :data="vtasks" style="width: 100%">
          <el-table-column prop="v_task_url" label="V任务链接" width="282">
            <template slot-scope="scope">
              <tg-button
                class="line-clamp-1"
                type="link"
                @click="handleUrlClick(scope.row.v_task_url)"
                >{{ scope.row.v_task_url }}</tg-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="item_url" label="商品链接" width="282">
            <template slot-scope="scope">
              <tg-button
                class="line-clamp-1"
                type="link"
                @click="handleUrlClick(scope.row.item_url)"
                >{{ scope.row.item_url }}</tg-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </tg-block>
</template>

<script src="./cost.vtask.ts"></script>
<style lang="less">
@import './cost.vtask.less';
</style>
