<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-25 10:39:21
-->
<template>
  <el-dialog
    class="tg-dialog-classic playermanager-maintainer-dialog tg-dialog-vcenter-new"
    :visible="dialogVisible"
    width="368px"
    title="选择维护人"
    @close="close"
    lock-scroll
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="dataForm" ref="formRef" label-width="56px" size="mini">
      <el-form-item
        label="维护人："
        prop="maintainer_name"
        :rules="{
          required: true,
          message: '请选择维护人',
          trigger: 'change',
        }"
      >
        <el-select
          popper-class="el-select-popper-mini"
          v-model="dataForm.maintainer_name"
          placeholder="请输入并选择维护人"
          filterable
          remote
          reserve-keyword
          :remote-method="getUserReq"
          :loading="getUserLoading"
          @change="onMaintainerChanged"
          style="width: 240px"
        >
          <el-option
            v-for="(user, index) in userInfoList"
            :value="user.username"
            :label="user.username"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <tg-button @click="close">取消</tg-button>
      <tg-button type="primary" @click="save">确定</tg-button>
    </template>
  </el-dialog>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';

.playermanager-maintainer-dialog {
  .el-form {
    padding: 18px 18px 24px;
    .el-form-item {
      margin-bottom: 0px;
      .el-form-item__label::before {
        content: '';
      }
    }
  }
}
</style>
