<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-10-09 16:16:49
-->
<template>
  <div class="tg-mcn-project-team-member">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="478px"
      title="团队成员"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <div class="team-member-content">
        <el-form :model="form" label-width="60px" size="mini" label-position="top">
          <el-form-item label="项目经理：">
            <el-select
              popper-class="el-select-popper-mini"
              filterable
              clearable
              remote
              v-model="form.project_manager_id"
              placeholder="请输入并选择项目经理"
              :remote-method="getAllProjectManagerRequest"
            >
              <el-option
                v-for="(projectManager, pIndex) in projectManagers"
                :key="pIndex"
                :label="projectManager.username"
                :value="projectManager.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="其他成员：" class="mgt-18" />
          <el-select
            size="mini"
            popper-class="el-select-popper-mini"
            clearable
            multiple
            remote
            filterable
            :value="selectNames"
            :remote-method="getAllOtherMembersRequest"
            :loading="otherMemberLoading"
            placeholder="请输入并选择其他成员"
            @change="onOtherMembersChanged"
          >
            <el-option
              v-for="member in otherMembers"
              :key="member.id"
              :label="member.username"
              :value="member.username"
            >
            </el-option>
          </el-select>
          <div class="creator mgt-24">
            <span>创建人：</span>
            <span>{{ computedCreator }}</span>
          </div>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onClose">取消</tg-button>
        <tg-button type="primary" @click="onSave">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>
<script src="./teamMember.ts"></script>
<style lang="less">
@import './teamMember.less';
</style>
