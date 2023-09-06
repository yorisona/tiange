<!--
 * @Author: 肖槿
 * @Date: 2022-05-20 14:40:41
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-05-24 15:44:13
 * @FilePath: \goumee-star-frontend\src\modules\commonBusiness\project\tabs\setting\index.vue
-->
<template>
  <div class="tg-live-s2b2c-detail-tab-calendar">
    <div class="setting-form">
      <el-form
        @submit.native.prevent
        size="mini"
        label-width="134px"
        style="padding: 33px"
        label-position="right"
        ref="settingFormRef"
        :model="settingForm"
        :rules="formRules"
      >
        <!--        <div class="setting-description">分成设置</div>-->
        <head-lines style="margin: 0px 0px 16px 0px" title="营收预估" />
        <el-form-item label="佣金比例：" prop="commission_rate" class="setting-item">
          <el-input
            style="width: 248px"
            placeholder="请输入比例"
            @input="
              val => {
                divideRateInput('commission_rate', val);
              }
            "
            maxlength="6"
            v-model.trim="settingForm.commission_rate"
            ><span slot="append">%</span></el-input
          >
        </el-form-item>
        <head-lines style="margin: 0px 0px 16px 0px" title="分成设置" />
        <el-form-item label="达人线下分成比例：" prop="kol_divide" class="setting-item">
          <el-input
            style="width: 248px"
            placeholder="请输入比例"
            @input="
              val => {
                divideRateInput('kol_divide', val);
              }
            "
            maxlength="6"
            v-model.trim="settingForm.kol_divide"
            ><span slot="append">%</span></el-input
          >
        </el-form-item>
        <head-lines style="margin: 0px 0px 16px 0px" title="开票设置" />
        <el-row>
          <el-form-item label="达人能否开票：" prop="invoice_enable" class="setting-item inline">
            <el-select
              popper-class="el-select-popper-mini"
              style="width: 88px"
              v-model.trim="settingForm.invoice_enable"
              placeholder="请选择"
            >
              <el-option label="能" value="1"></el-option>
              <el-option label="不能" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="settingForm.invoice_enable === '1'"
            label=""
            label-width="0px"
            prop="invoice_tax_rate"
            class="setting-item inline"
          >
            <el-input
              style="width: 152px; vertical-align: baseline"
              placeholder="请输入比例"
              @input="
                val => {
                  divideRateInput('invoice_tax_rate', val);
                }
              "
              maxlength="6"
              v-model.trim="settingForm.invoice_tax_rate"
              ><span slot="append">%</span></el-input
            >
          </el-form-item>
          <el-form-item
            v-else
            label=""
            label-width="10px"
            prop="invoice_enable"
            class="setting-item inline"
          >
            <el-select
              popper-class="el-select-popper-mini"
              style="width: 152px"
              v-model.trim="settingForm.invoice_platform"
              placeholder="请选择"
            >
              <el-option label="灵活用工平台" value="1"></el-option>
              <el-option label="公司代扣代缴" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <head-lines style="margin: 0px 0px 16px 0px" title="费用分摊设置" />
        <div class="setting-table">
          <el-row class="setting-table-head">
            <el-col class="td">费用类型</el-col>
            <el-col class="td">达人承担比例</el-col>
            <el-col class="td">操作</el-col>
          </el-row>
          <el-row class="setting-table-body">
            <el-row
              v-for="(item, typeKey) in settingForm.cost_share"
              :key="item.expense_type_id"
              class="setting-table-tr"
            >
              <el-col class="td">
                <el-select
                  popper-class="el-select-popper-mini"
                  v-model="item.expense_type_id"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="remoteMethod"
                  :loading="typeLoading"
                  placeholder="请选择费用类型"
                  class="form-item"
                  size="mini"
                >
                  <el-option
                    v-for="typeItem in typeData"
                    :label="typeItem.expense_type"
                    :value="typeItem.id"
                    :disabled="shareIds.includes(typeItem.id)"
                    :key="typeItem.expense_type + typeItem.id"
                  />
                </el-select>
              </el-col>
              <el-col class="td">
                <el-input
                  @input="
                    val => {
                      shareProportionHandler(item, val);
                    }
                  "
                  v-model="item.share_proportion"
                  placeholder="请输入承担比例"
                  class="form-item"
                  size="mini"
                >
                  <span slot="append">%</span>
                </el-input>
              </el-col>
              <el-col class="td delete-btn">
                <tg-icon @click="deleteType(typeKey)" name="ico-btn-delete"></tg-icon>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="setting-table-foot">
            <el-col class="btn" style="height: 40px; padding-top: 6px">
              <el-button size="mini" type="text" icon="el-icon-plus" @click="addType">
                新增费用
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top: 32px">
          <tg-button type="primary" @click="onSubmit" style="padding: 0 24px !important"
            >保存</tg-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less" scoped>
.tg-live-s2b2c-detail-tab-calendar {
  .setting-table {
    .setting-table-tr,
    .setting-table-head {
      display: flex;
      & .td {
        border: 1px solid #ddd;
        &.delete-btn {
          text-align: center;
          line-height: 48px;
          & .ico-btn-delete {
            cursor: pointer;
            font-size: 18px;
            color: var(--text-third-color);
            &:hover {
              color: var(--error-color);
            }
          }
        }
      }
      & .form-item {
        width: 100%;
      }
    }
    .setting-table-head {
      & .td {
        text-align: center;
        font-weight: 600;
        font-size: 12px;
        color: var(--text-color);
        height: 32px;
        line-height: 32px;
        background: rgba(164, 178, 194, 0.1);
        border: 1px solid #e3e8ec;
        border-bottom: 0;
        &:nth-child(1) {
          width: 328px;
        }
        &:nth-child(2) {
          width: 200px;
          border-left: 0;
        }
        &:nth-child(3) {
          width: 65px;
          border-left: 0;
        }
      }
    }
    .setting-table-tr {
      margin-top: -1px;
      & .td {
        text-align: center;
        font-weight: 500;
        font-size: 14px;
        height: 48px;
        line-height: 48px;
        border: 1px solid #e3e8ec;
        padding: 0 12px;
        &:nth-child(1) {
          width: 328px;
        }
        &:nth-child(2) {
          width: 200px;
          border-left: 0;
        }
        &:nth-child(3) {
          width: 65px;
          border-left: 0;
        }
      }
    }
    .setting-table-foot {
      text-align: center;
      width: 593px;
      height: 40px;
      border: 1px solid #e3e8ec;
      margin-top: -1px;
      & .el-button {
        color: var(--theme-color);
      }
    }
  }
  & .setting-description {
    position: relative;
    padding-left: 6px;
    font-weight: 600;
    font-size: 16px;
    color: var(--text-color);
    line-height: 22px;
    margin-bottom: 16px;
    &:after {
      content: ' ';
      position: absolute;
      width: 3px;
      height: 15px;
      background: var(--theme-color);
      top: 3px;
      left: 0;
      border-radius: 1px;
    }
  }
  & .setting-item {
    margin-bottom: 32px;
    &.inline {
      display: inline-block;
    }
  }
}
</style>
