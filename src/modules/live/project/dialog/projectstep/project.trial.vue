<!--
 * @Author: 矢车
 * @Date: 2021-01-11 09:59:47
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-21 18:20:11
 * @Description: 店铺代播 - 项目管理 - 项目详情 - 项目阶段 - 项目试播
-->
<template>
  <div class="tg-live-project-trail-dialog tg-dialog-vcenter">
    <el-dialog
      width="428px"
      :visible="visible"
      :destroy-on-close="true"
      @close="closeDialog"
      :close-on-click-modal="false"
      class="customer-dialog project-form-modal"
    >
      <template #title>项目试播</template>
      <div class="dialog-content">
        <el-form size="mini" ref="ruleForm" :rules="rules" :model="form" label-width="106px">
          <el-form-item label="试播结束时间：" prop="try_live_end_date">
            <el-date-picker
              style="width: 275px"
              v-model="form.try_live_end_date"
              type="date"
              placeholder="选择日期"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button-line justify-content="center">
          <tg-button @click="closeDialog">取消</tg-button>
          <tg-button type="primary" @click="submitForm('ruleForm')">保存</tg-button>
        </tg-button-line>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./project.trial.ts"></script>

<style lang="less">
.tg-live-project-trail-dialog {
  .el-dialog {
    width: 428px !important;
    .el-form .el-form-item {
      margin-bottom: 0;
    }
    .dialog-content {
      padding: 18px 18px 24px 18px !important;
      .el-form {
        .el-form-item {
          margin-bottom: 0;
          &:nth-of-type(2) {
            margin-top: 7px;
            margin-bottom: 1px;
          }
          .el-radio {
            &:nth-of-type(2) {
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
