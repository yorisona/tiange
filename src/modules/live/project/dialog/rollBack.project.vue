<!--
 * @Brief: 已完结项目状态修改弹框
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-27 11:37:31
-->

<template>
  <div class="tg-project-dialog-roll-back">
    <el-dialog
      title="项目变更"
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="428px"
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <el-form
        ref="formRef"
        :rules="rules"
        class="roll-back-form"
        size="mini"
        :model="formData"
        label-width="102px"
      >
        <el-form-item label="变更项目状态为：" prop="status">
          <el-select
            popper-class="el-select-popper-mini"
            v-model="formData.status"
            style="width: 270px"
            placeholder="请选择项目状态"
          >
            <el-option
              v-for="item in projectStatusOptions"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">确定</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./rollBack.project.ts"></script>
<style lang="less">
@charset 'utf-8';

.tg-project-dialog-roll-back {
  .roll-back-form {
    margin: 27px 24px;
    .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
      content: '';
    }
  }
}
</style>
