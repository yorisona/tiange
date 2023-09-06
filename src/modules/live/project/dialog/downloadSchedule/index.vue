<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-25 15:32:31
-->
<template>
  <el-dialog
    class="tg-dialog-classic live-project-download-schedule-dialog tg-dialog-vcenter-new"
    :visible="dialogVisible"
    width="390px"
    title="下载排期"
    @close="close"
    lock-scroll
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRef" :model="dataForm" label-width="68px" size="mini">
      <el-form-item
        label="选择时间："
        :rules="{
          required: true,
          message: '请选择排期时间',
          trigger: 'change',
        }"
        prop="date"
      >
        <el-date-picker
          v-model="dataForm.date"
          type="daterange"
          :editable="false"
          :clearable="false"
          range-separator="～"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy.MM.dd"
          value-format="yyyy-MM-dd"
          style="width: 272px"
          :picker-options="pickerOptions"
          @blur="onDateBlur"
        >
        </el-date-picker>
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

.live-project-download-schedule-dialog {
  .el-form {
    padding: 18px 0 24px 18px;
    .el-form-item {
      margin-bottom: 0px;
      .el-form-item__label::before {
        content: '';
      }
      .el-date-editor {
        .el-range-input {
          width: 44%;
        }
        .el-range-separator {
          width: 12%;
          min-width: 20px;
        }
        .el-range__close-icon {
          display: none;
        }
      }
    }
  }
}
</style>
