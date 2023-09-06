<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="486px"
    top="20vh"
    class="customer-dialog studio-form-modal tg-dialog-vcenter"
    @close="onCancelBtnClick"
  >
    <template #title>
      <span>{{ formTitle }}</span>
    </template>
    <div class="dialog-content">
      <el-form
        size="mini"
        ref="formRef"
        :rules="studioFormRules"
        :model="studioForm"
        @submit.native.prevent
        label-width="102px"
      >
        <el-form-item label="直播间名称：" prop="studio_name">
          <el-input
            :maxlength="10"
            style="width: 360px"
            v-model.trim="studioForm.studio_name"
            placeholder="请输入直播间名称"
            ref="autoFocuseRef"
          />
        </el-form-item>
        <el-form-item
          class="checkboxRow"
          label="业务类型："
          prop="business_type"
          style="margin-top: -8px; height: 56px"
        >
          <el-checkbox-group class="studio-checkbox-group" v-model="studioForm.business_type">
            <el-checkbox class="studio-checkbox" :label="1">营销业务</el-checkbox>
            <el-checkbox class="studio-checkbox" :label="3">抖音店播</el-checkbox>
            <el-checkbox class="studio-checkbox" :label="2">淘宝店播</el-checkbox>
            <el-checkbox class="studio-checkbox" :label="8">淘宝甄选</el-checkbox>
            <el-checkbox class="studio-checkbox" :label="7">本地生活</el-checkbox>
            <el-checkbox class="studio-checkbox" :label="9">供应链</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="直播间地址：" prop="studio_address" style="margin-top: -6px">
          <el-input
            type="textarea"
            :rows="5"
            :maxlength="100"
            style="width: 360px"
            show-word-limit
            v-model.trim="studioForm.studio_address"
            placeholder="请输入文本"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <tg-button @click="onCancelBtnClick">取消</tg-button>
      <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
    </template>
  </el-dialog>
</template>

<script src="./studio.ts"></script>
<style lang="less">
@import './studio.less';
</style>
