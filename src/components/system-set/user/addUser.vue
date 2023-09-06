<!--
 * @Author: 矢车
 * @Date: 2020-12-29 18:05:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-16 13:50:37
 * @Description: 系统设置 -用户管理 - 新增/编辑用户
 *
 * 树结构这个表单因为自己定义的,所以一些东西需要自己实现
 *  1. 右边 select 框 icon 添加以及改变时的动画效果
 *  2. 如果是展开状态,点击其他的select框不会自动收缩,这里需要自己控制
 *  3. 不属于表单验证范畴,需要自己做判断以及加上表单验证的样式和交互
-->
<template>
  <div class="tg-user-create-dialog tg-dialog-vcenter">
    <el-dialog
      class="customer-dialog"
      :title="`${type}用户`"
      :visible.sync="isDialog"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      width="440px"
      @close="closeDialog"
    >
      <div class="dialog-content dialog-content-form360 pdt-18 pdb-18 pdl-18 pdr-18">
        <el-form
          ref="ruleForm"
          :rules="rules"
          :model="form"
          label-width="98px"
          label-position="top"
          size="mini"
        >
          <el-form-item label="花名" prop="username">
            <el-input
              ref="usernameRef"
              v-model="form.username"
              placeholder="请输入用户花名"
              @input="value => (form.username = value.replace(/[^\u4E00-\u9FA5]/g, ''))"
              :maxlength="10"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              @input="value => (form.phone = value.replace(/[^\d]/g, ''))"
              :maxlength="11"
            />
          </el-form-item>
          <div class="form-verify-position-flex">
            <el-form-item label="部门岗位" prop="department_id" class="form-verify-position">
              <el-popover
                placement="bottom-start"
                trigger="click"
                popper-class="popper-class el-tree-popper-mini"
                @show="popoverShow('select-icon-user-add')"
                @hide="popoverHide('select-icon-user-add')"
              >
                <div slot="reference" class="repain-select" style="display: inline-block">
                  <el-input
                    :class="form_other.isVerify ? 'color-error' : ''"
                    v-if="!form_other.department_name"
                    style="color: var(--text-des-color)"
                    placeholder="请选择部门"
                    readonly
                  >
                    <template #suffix>
                      <i class="select-icon select-icon-user-add el-icon-arrow-down"></i>
                    </template>
                  </el-input>
                  <el-input
                    :class="form_other.isVerify ? 'color-error' : ''"
                    v-else
                    :value="form_other.department_name"
                    readonly
                  >
                    <template #suffix>
                      <i class="select-icon select-icon-user-add el-icon-arrow-down"></i>
                    </template>
                  </el-input>
                  <!-- <label v-show="form_other.isVerify" class="color-error-font">请选择部门</label> -->
                </div>
                <singleTrees
                  ref="singleTree"
                  :c_treeData="treeData"
                  style="overflow-y: auto"
                  @handleTreeDataCall="p_handleTreeDataCall($event)"
                />
              </el-popover>
            </el-form-item>
            <el-form-item label="岗位" prop="job_id" class="form-job-item mgl-18">
              <el-select
                popper-class="el-select-popper-mini"
                placeholder="请选择岗位"
                v-model="form.job_id"
                class="form-select-two"
                @focus="selectControlPopoverHide"
              >
                <el-option
                  v-for="item in form_other.job_list"
                  :key="item.id"
                  :value="item.id"
                  :label="item.job_name"
                />
              </el-select>
            </el-form-item>
          </div>
          <!-- 控制点击 select 部门树不收缩的问题 -->
          <label v-show="false" class="controlPopoverHide"></label>
          <el-form-item class="form-item-business-type" label="业务类型" prop="business_type">
            <el-checkbox-group v-model="form.business_type" style="margin-bottom: 6px">
              <el-checkbox v-for="item in enumBussinessType()" :key="item.value" :label="item.value"
                >{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            style="margin-top: -8px"
            label="密码"
            prop="password"
            v-if="type === '新增'"
          >
            <el-input
              type="password"
              @input="value => (form.password = value.replace(/\s/g, ''))"
              v-model="form.password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item style="margin-top: -8px" label="重置密码" v-else>
            <el-input
              type="password"
              @input="value => (form.password = value.replace(/\s/g, ''))"
              v-model="form.password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item label="状态" prop="is_checked">
            <el-radio
              v-for="item in enumUserStatus()"
              :key="item.value"
              v-model="form.is_checked"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onCancelClick">取消</tg-button>
        <tg-button type="primary" @click="submitForm('ruleForm')">保存</tg-button>
      </template>
    </el-dialog>
  </div>
</template>

<script src="./addUser.ts"></script>

<style lang="less">
@import '~@/styles/utils/index.less';
.tg-user-create-dialog {
  .el-popover__reference-wrapper {
    .el-button {
      color: var(--text-color);
      &:focus {
        border-color: #dcdfe6;
      }
    }
    .el-button.el-button--default:not([disabled]):not(.is-disabled):not(.el-button--primary):hover {
      color: var(--text-color);
    }
  }

  .el-form-item {
    margin-bottom: 18px;
    // &:nth-of-type(3) {
    //   margin-bottom: 7px !important;
    // }
    // &:nth-of-type(4) {
    //   margin-bottom: 7px !important;
    // }
    // &:nth-of-type(5) {
    //   margin-bottom: 7px !important;
    // }
    &:nth-of-type(6) {
      margin-bottom: 0px !important;
    }
  }

  .el-form {
    .el-form-item {
      .el-form-item__label {
        font-size: 12px;
        color: var(--text-second-color);
        line-height: 16px;
        margin-bottom: 0px;
        padding: 0;
      }
    }
    .form-verify-position-flex {
      display: flex;
    }
    .form-job-item {
      .el-form-item__label {
        color: transparent;
        &::before {
          content: '';
        }
      }
    }
  }

  .el-checkbox {
    margin: 0 0 0 24px;
    color: var(--text-color);
    font-weight: normal;
    &:first-of-type {
      margin-left: 0;
    }
    .el-checkbox__label {
      padding-left: 4px;
    }
  }

  .el-radio {
    .el-radio__label {
      padding-left: 4px;
    }
    &:first-of-type {
      margin-left: 12px;
    }
    &:last-of-type {
      margin-left: 24px;
    }
  }

  .form-item-business-type {
    .el-form-item__error {
      .mgt(-10px);
    }
  }
}

.popper-class {
  .tree-container {
    max-height: 362px;
    overflow: auto;
    margin-right: -18px;
    padding-right: 18px;
  }
}
</style>
