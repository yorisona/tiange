<!--
 * @Brief: 店铺代播-项目管理-项目详情-跟踪事项 弹框
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2020-12-30 18:28:31
-->

<template>
  <div class="tg-live-project-dialog-track-event tg-dialog-vcenter">
    <el-dialog
      class="customer-dialog"
      :visible="visible"
      width="440px"
      top="278px"
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>{{ track_master_obj ? '编辑事项' : '新增事项' }}</template>
      <el-form ref="formRef" :model="form" label-width="80px" label-position="top" size="small">
        <el-form-item
          label="跟踪事项"
          prop="track_matter"
          :rules="{ required: true, message: '请输入跟踪事项', trigger: 'blur' }"
        >
          <el-input
            type="textarea"
            placeholder="请输入跟踪事项"
            v-model="form.track_matter"
            maxlength="100"
            show-word-limit
            ref="trackingEventRef"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="是否完成" required>
          <el-select v-model="form.is_complete">
            <el-option :key="false" label="否" :value="false"> </el-option>
            <el-option :key="true" label="是" :value="true"> </el-option>
          </el-select>
          <!-- <el-switch v-model="form.is_complete"></el-switch> -->
        </el-form-item>

        <el-form-item
          label="预计完成"
          v-if="!form.is_complete"
          :rules="{ required: false, message: '', trigger: 'change' }"
          prop="expect_complete_date"
        >
          <el-date-picker
            v-model="form.expect_complete_date"
            type="date"
            :editable="false"
            placeholder="选择日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="完成时间："
          :rules="{ required: true, message: '请选择日期', trigger: 'change' }"
          prop="complete_date"
          v-else
        >
          <el-date-picker
            v-model="form.complete_date"
            type="date"
            placeholder="选择日期"
            :editable="false"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./tracking.event.ts"></script>

<style lang="less">
.tg-live-project-dialog-track-event {
  .el-dialog {
    .el-form {
      display: grid;
      row-gap: 18px;
      margin: 24px;
      .el-form-item {
        margin-bottom: 0;
        .el-form-item__label {
          color: var(--text-second-color);
          font-size: 12px;
          padding: 0;
          margin-bottom: 8px;
          line-height: 16px;
        }
      }
      .el-date-editor {
        display: block;
        width: 100%;
      }
      .el-select {
        display: block;
        width: 100%;
      }
      .el-textarea {
        height: 108px;
        .el-textarea__inner {
          height: 108px;
        }
      }
      // // 调整备注中字数限制span
      // .el-input__count {
      //   height: 18px;
      //   line-height: 18px;
      //   bottom: 5px;
      //   right: 10px;
      // }
    }
  }
}
</style>
