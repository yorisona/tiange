<!--
 * @Brief: 营销业务-项目管理 详情 执行结束 弹窗
 * @Author: wuyou
 * @Date: 2021-04-14 16:52:34
-->
<template>
  <div class="tg-marketing-project-finish-dialog tg-dialog-vcenter">
    <el-dialog
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="440px"
      class="tg-dialog-classic"
      @close="onCloseBtnClick"
    >
      <template #title>执行结束</template>
      <div class="form-content">
        <el-form
          :model="ProjectConfirmForm"
          :rules="formRules"
          ref="formRef"
          label-position="top"
          size="mini"
          label-width="106px"
        >
          <el-form-item label="执行结果" prop="end_type">
            <el-select
              size="mini"
              class="info-name-select"
              v-model="ProjectConfirmForm.end_type"
              placeholder="请选择执行结果"
            >
              <el-option :value="1" label="正常结束"></el-option>
              <el-option :value="2" label="意外终止"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="ProjectConfirmForm.end_type === 2">
            <el-form-item label="终止处理" prop="unexpected_terminate_type">
              <el-radio-group
                class="radioGroup"
                v-model="ProjectConfirmForm.unexpected_terminate_type"
              >
                <el-radio :label="1">补播</el-radio>
                <el-radio :label="2">退款</el-radio>
                <el-radio :label="3">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="caseTextarea"
              label=""
              v-if="ProjectConfirmForm.unexpected_terminate_type === 3"
              prop="unexpected_terminate_detail"
            >
              <el-input
                maxlength="20"
                v-model="ProjectConfirmForm.unexpected_terminate_detail"
                placeholder="请输入处理方案"
                type="textarea"
                :show-word-limit="true"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div style="color: var(--text-third-color)">执行结束后，不允许进行成本和收入结算</div>
      </div>
      <template #footer>
        <tg-button @click="onCloseBtnClick">取消</tg-button>
        <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./form.ts"></script>

<style lang="less">
@import './form.less';
</style>
