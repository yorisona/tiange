<!--
 * @Brief: 变更标记
-->
<template>
  <div>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      width="312px"
      :visible="visiableSign"
      height="400px"
      append-to-body
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>标记变更</template>
      <div style="margin: 0px 8px 8px 8px">
        <el-checkbox-group v-model="selectSigns">
          <el-checkbox
            v-for="chance in formList"
            class="chance-checkbox"
            :value="chance.value"
            :key="chance.value"
            :label="chance.value"
            style="height: 32px; line-height: 32px; color: var(--text-color); font-weight: 400"
          >
            {{ chance.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./sign.ts"></script>
<style>
.tpc .el-time-spinner__wrapper {
  width: 100% !important;
}
.tpc .el-time-spinner__wrapper:nth-of-type(2) {
  display: none !important;
}
</style>
<style lang="less" scoped>
/deep/.el-checkbox-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding-left: 18px;
  padding-right: 12px;
  margin-top: 18px;
  margin-bottom: 24px;
  .el-checkbox {
    margin-right: 15px;
    height: 32px;
    line-height: 32px;
  }
  .el-checkbox__input {
    padding-top: 2px;
  }
  .el-checkbox__label {
    color: var(--text-color);
    width: 45px;
    font-size: 12px;
    display: inline-block;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
    line-height: 1;
    vertical-align: middle;
    padding-left: 6px;
  }
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: var(--text-color);
}
/deep/.el-checkbox + .el-checkbox {
  margin-left: 0px;
  line-height: 24px;
  height: 24px;
}
/deep/ el-checkbox__inner {
  border: 1px solid #dcdfe6;
}
</style>
