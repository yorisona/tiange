<!--
 * @Author: 矢车
 * @Date: 2021-01-11 09:59:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-19 15:19:09
 * @Description: 店铺代播 - 项目管理 - 项目详情 - 项目阶段 - 区域执行
-->
<template>
  <div class="tg-live-project-area-dialog tg-dialog-vcenter">
    <el-dialog
      width="428px"
      :visible="visible"
      :destroy-on-close="true"
      @close="closeDialog"
      :close-on-click-modal="false"
      class="customer-dialog project-form-modal"
    >
      <template #title>区域执行</template>
      <div class="dialog-content">
        <el-form size="mini" ref="ruleForm" :rules="rules" :model="form" label-width="106px">
          <el-form-item label="区域合作公司：" prop="supplier_company_id">
            <el-select
              popper-class="el-select-popper-mini"
              style="width: 280px"
              v-model="form.supplier_company_id"
              filterable
              placeholder="请输入搜索区域合作公司"
            >
              <el-option
                v-for="item in list_companyInfo"
                :key="item.company_id"
                :label="item.company_name"
                :value="item.company_id"
              >
              </el-option>
            </el-select>
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

<script src="./project.area.ts"></script>

<style lang="scss" scoped>
@import '@/components/system-set/user/addUser.scss';
@import '@/assets/scss/common-system.scss';

::v-deep .el-dialog {
  width: 428px !important;
  .el-input {
    width: 280px;
  }
}
</style>

<style lang="less">
.tg-live-project-area-dialog {
  .el-dialog__wrapper {
    .el-dialog {
      width: 428px !important;
      .dialog-content {
        padding: 20px 20px 30px 20px !important;
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
}
</style>
