<!--
 * @Author: 矢车
 * @Date: 2020-12-30 15:58:23
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-04 11:20:10
 * @Description: 多选树形组件
-->
<template>
  <div>
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

<script src="./checkTrees.ts"></script>

<style scoped lang="less">
/deep/ .el-tree-node__content {
  height: 28px;
  line-height: 28px;
}
</style>
