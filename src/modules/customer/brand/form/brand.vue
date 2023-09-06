<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-11-10 09:39:36
-->
<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    width="378px"
    top="20vh"
    class="customer-dialog brand-form-modal el-dialog-center-rewrite"
    @close="onCancelBtnClick"
  >
    <template #title>
      <span>{{ formTitle }}</span>
    </template>
    <div class="dialog-content">
      <el-form
        ref="formRef"
        :rules="brandFormRules"
        :model="brandForm"
        @submit.native.prevent
        label-height="18px"
        label-position="top"
        size="mini"
      >
        <el-form-item label="品牌名称" prop="brand_name">
          <el-input
            :maxlength="20"
            size="mini"
            style="width: 100%"
            v-model.trim="brandForm.brand_name"
            placeholder="请输入品牌名称"
            ref="autoFocuseRef"
          />
        </el-form-item>
        <el-form-item label="关联公司" required>
          <div
            class="company-item"
            v-for="(conmpayId, idx) in brandForm.customer_ids"
            :key="conmpayId"
          >
            <el-select
              style="width: 100%"
              filterable
              remote
              reserve-keyword
              v-model="brandForm.customer_ids[idx]"
              placeholder="请输入并选择公司"
              :remote-method="queryCompanyList"
              :loading="companyListServe.loading"
            >
              <el-option
                v-for="opt in displayComplayList"
                :label="opt.company_name"
                :value="opt.id"
                :key="opt.id"
                :disabled="optionDisabled(conmpayId, opt.id)"
              ></el-option>
            </el-select>
            <el-button
              v-if="brandForm.customer_ids.length > 1"
              class="del-company"
              icon="el-icon-close"
              circle
              @click="() => onDelCompanyHandler(idx)"
            >
              <!-- <i class="el-icon-close"></i> -->
            </el-button>
          </div>
          <tg-button
            class="add-company"
            @click="onAddCompanyHandler"
            style="color: var(--theme-color)"
          >
            <i class="el-icon-plus"></i>
            <span>新增公司</span>
          </tg-button>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <tg-button @click="onCancelBtnClick">取消</tg-button>
      <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
    </template>
  </el-dialog>
</template>

<script src="./brand.ts"></script>
<style lang="less">
@import './brand.less';
</style>
<style lang="less" scoped>
.dialog-content {
  max-height: 310px;
  overflow: overlay;
  .el-form {
    padding: 0 24px;
    /deep/ .el-form-item {
      margin-right: 0;
      .el-form-item__label {
        line-height: 20px;
        height: 20px;
        padding-bottom: 0;
        margin-bottom: 4px;
      }
    }
  }
}
.company-item {
  margin-bottom: 12px;
  position: relative;
  &:hover {
    .del-company {
      visibility: visible;
    }
  }
  .del-company {
    width: 16px;
    height: 16px;
    border: none;
    line-height: 16px;
    padding: 0;
    background-color: #d1d8e0;
    visibility: hidden;
    position: absolute;
    top: -8px;
    right: -5px;
    color: #ffffff !important;
    &:hover {
      background-color: var(--error-color);
    }
  }
}
.add-company {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(164, 178, 194, 0.5);
  width: 100%;
  > span {
    margin-left: 5px;
  }
}
</style>
