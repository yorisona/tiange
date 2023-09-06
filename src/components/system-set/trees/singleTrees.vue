<!--
 * @Author: 矢车
 * @Date: 2020-12-30 15:58:23
 * @LastEditors: 矢车
 * @LastEditTime: 2020-12-31 11:04:45
 * @Description: 单选树形组件
-->
<template>
  <div class="tree-container">
    <el-tree
      :data="c_treeData"
      :check-strictly="true"
      show-checkbox
      node-key="id"
      ref="single_tree"
      :props="defaultProps"
      @check="check"
    >
    </el-tree>
  </div>
</template>

<script src="./singleTrees.ts"></script>

<style lang="less">
.tree-container {
  /deep/ .el-tree-node__content {
    height: 28px;
    line-height: 28px;
  }
}

.user-serch-popper {
  max-height: 360px;
  overflow-y: auto;
  overflow-y: overlay;
}
</style>
