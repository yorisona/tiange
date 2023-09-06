<!--
 * @Brief: 通用业务-项目管理- 新增/编辑 项目弹框
 * @Author: wuyou
 * @Date: 2021-05-06 16:05:42
-->
<template>
  <div class="tg-common-business-project-form-dialog tg-dialog-vcenter">
    <el-drawer
      :title="title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="tg-dialog-classic"
      :visible="visible"
      :wrapperClosable="false"
      @close="onCloseBtnClick"
    >
      <div class="tg-drawer-form-content">
        <el-form
          :model="ProjectForm"
          :rules="formRules"
          ref="formRef"
          id="ProjectForm"
          label-position="top"
          size="mini"
          label-width="106px"
        >
          <head-lines style="margin: 12px 0px 12px -10px" title="项目信息" />
          <el-form-item class="one-item mgb-18" label="项目名称" prop="project_name">
            <el-input
              maxlength="20"
              v-model.trim="ProjectForm.project_name"
              placeholder="请输入项目名称"
              ref="autoFocuseRef"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="one-item mgb-18" label="业务平台" prop="platform_type">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="ProjectForm.platform_type"
              placeholder="请选择业务平台"
              @change="changeBusinessPlatform"
            >
              <el-option label="抖音平台" :value="1" />
              <el-option label="淘宝平台" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item prop="start_date" label="开始时间" class="two-item-left mgb-18">
            <el-date-picker
              placeholder="开始时间"
              v-model="ProjectForm.start_date"
              type="date"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item prop="end_date" label="结束时间" class="two-item-right mgb-18">
            <el-date-picker
              placeholder="结束时间"
              v-model="ProjectForm.end_date"
              type="date"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item class="one-item mgb-18" label="项目类型" prop="mcn_project_type">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="ProjectForm.mcn_project_type"
              :disabled="!ProjectForm.platform_type"
              placeholder="请选择项目类型"
            >
              <el-option
                v-for="item in projectTypeOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="one-item mgb-18" label="项目经理" prop="project_manager_id">
            <el-select
              popper-class="el-select-popper-mini"
              filterable
              placeholder="请输入并选择项目经理"
              v-model="ProjectForm.project_manager_id"
              remote
              reserve-keyword
              clearable
              :remote-method="getAllManagerName"
            >
              <el-option
                v-for="(item, index) in allManagerName"
                :key="index"
                :label="item.username"
                :value="item.id"
              >
                <span>{{ item.username }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="one-item mgb-18" label="项目所属部门" prop="feishu_department_id">
            <el-popover
              placement="bottom-start"
              trigger="click"
              width="460"
              popper-class="cb-department-tree-popper-class  el-tree-popper-mini"
            >
              <div slot="reference" class="repain-select" style="display: block">
                <el-input
                  :value="ProjectForm.feishu_department_name"
                  style="color: var(--text-des-color)"
                  placeholder="请选择项目所属部门"
                  readonly
                >
                  <template #suffix>
                    <i class="select-icon select-icon-user-add el-icon-arrow-down"></i>
                  </template>
                </el-input>
              </div>
              <div class="department-tree">
                <el-tree
                  ref="cb_department_tree"
                  :props="treeProps"
                  :check-strictly="true"
                  node-key="id"
                  :data="feishuDepartmentList"
                  show-checkbox
                  :default-checked-keys="default_checked_department_ids"
                  :default-expanded-keys="default_checked_department_ids"
                  @check="handleCheckChange"
                >
                </el-tree>
              </div>
            </el-popover>
          </el-form-item>
          <el-form-item
            label="团队成员"
            prop="customer_id"
            class="one-item"
            style="margin-bottom: 0"
          />
          <el-select
            class="mgb-18"
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
            style="width: 470px"
          >
            <el-option
              v-for="member in otherMembers"
              :key="member.id"
              :label="member.username"
              :value="member.username"
            >
            </el-option>
          </el-select>
          <el-form-item label="归属主体" prop="company_subject" class="one-item">
            <el-select
              popper-class="el-select-popper-mini"
              style="width: 100%"
              placeholder="请选择归属主体"
              v-model="ProjectForm.company_subject"
            >
              <el-option
                v-for="(item, index) in ProprietorTypeOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="ProjectForm.platform_type === 1">
            <head-lines style="margin: 0 0 0 -10px" title="项目达人" />
            <div class="is_relate_kol_box">
              <div class="mgr-6">是否关联达人：</div>
              <el-switch v-model="ProjectForm.is_relate_kol" @change="openPlatform_type">
              </el-switch>
            </div>
            <div v-if="ProjectForm.is_relate_kol">
              <div class="project_talent_box" v-for="(v, index) in ProjectForm.kol_infos" :key="v">
                <el-form-item
                  :prop="'kol_infos.' + index + '.kol_id'"
                  :rules="formRules.kol_id"
                  label="达人"
                  class="one-item mgb-18"
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    clearable
                    remote
                    filterable
                    v-model="v.kol_id"
                    :remote-method="val => getAllKolsRequest(val, index)"
                    :loading="kolLoading"
                    placeholder="请选择达人"
                    @change="val => kolChange(val, index)"
                  >
                    <el-option
                      v-for="kol in v.kols"
                      :key="kol.kol_info.kol_name"
                      :label="kol.kol_info.kol_name"
                      :value="kol.kol_info.kol_id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'kol_infos.' + index + '.baiying_id'"
                  :rules="formRules.baiying_id"
                  label="达人百应ID"
                  class="one-item mgb-18"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="v.baiying_id"
                    placeholder="用于查询达人订单"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  :prop="'kol_infos.' + index + '.qianchuan_uid'"
                  :rules="formRules.qianchuan_uid"
                  label="达人UID"
                  style="margin-right: 0px"
                  class="one-item mgb-18"
                >
                  <el-input
                    maxlength="20"
                    v-model.trim="v.qianchuan_uid"
                    placeholder="用于查询达人投放费用"
                  >
                  </el-input>
                </el-form-item>
                <i
                  v-if="ProjectForm.kol_infos.length && ProjectForm.kol_infos.length > 1"
                  class="delete-btn-time el-icon-error"
                  @click="deleteKol(index)"
                ></i>
              </div>
              <tg-button class="mgt-12 mini" type="primary" icon="ico-btn-add" @click="addKol"
                >增加达人</tg-button
              >
            </div>
          </div>
        </el-form>
        <div class="tg-drawer-footer">
          <tg-button @click="onCloseBtnClick">取消</tg-button>
          <tg-button type="primary" @click="onSaveBtnClick">确定</tg-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script src="./project.form.ts"></script>

<style lang="less">
@import './project.form.less';
</style>
