<!--
 * @Author: 矢车
 * @Date: 2021-01-11 09:59:47
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-11 16:22:14
 * @Description: 店铺代播 - 项目管理 - 项目详情 - 项目阶段 - 项目完结
-->
<template>
  <div class="tg-live-project-final-dialog tg-dialog-vcenter">
    <el-dialog
      width="428px"
      :visible="visible"
      :destroy-on-close="true"
      @close="closeDialog"
      :close-on-click-modal="false"
      class="customer-dialog project-form-modal"
    >
      <template #title>项目完结</template>
      <div class="dialog-content dialog-content-form360">
        <el-form ref="ruleForm" :rules="rules" :model="form" label-width="68px" size="mini">
          <el-form-item label="执行结果：" prop="end_type">
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请选择执行结果"
              v-model="form.end_type"
              class="form-select-two"
              style="width: 310px"
            >
              <template v-for="item in enumEndType()"
                ><el-option
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                  v-if="!(status === ProjectStatusEnum.executionEnd && item.value === 3)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="终止处理："
            style="margin-top: 16px"
            prop="end_handle_type"
            v-if="form.end_type === 2"
          >
            <el-radio
              v-for="item in enumEndHandleType()"
              :key="item.value"
              v-model="form.end_handle_type"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-form-item>
          <el-form-item label="" prop="end_handle_detail" v-if="form.end_handle_type === 2">
            <el-input
              class="handle-input"
              type="text"
              placeholder="请输入处理方案"
              v-model="form.end_handle_detail"
              maxlength="20"
              show-word-limit
              style="width: 310px"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="完结时间："
            style="margin-top: 16px"
            prop="end_time"
            v-if="form.end_type !== 3"
          >
            <el-date-picker
              v-model="form.end_time"
              type="date"
              placeholder="请选择完结时间"
              format="yyyy.MM.dd"
              value-format="timestamp"
              style="width: 310px"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div
          style="
            margin-top: 16px;
            color: var(--text-third-color);
            font-size: 12px;
            margin-left: 6px;
          "
          v-if="form.end_type !== 3"
        >
          项目完结后，不允许进行成本和收入结算
        </div>
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

<script src="./project.final.ts"></script>

<style lang="less">
.tg-live-project-final-dialog {
  .el-dialog__wrapper {
    .el-dialog {
      width: 428px !important;
      .dialog-content {
        padding: 18px 18px 24px 18px !important;
        .el-form {
          .el-form-item {
            .el-input--mini {
              &.handle-input {
                .el-input__suffix {
                  width: 42px;
                }
              }
            }
            margin-bottom: 0;
            &:nth-of-type(2) {
              margin-top: 7px;
              margin-bottom: 1px;
            }
            .el-radio {
              line-height: 28px;
              &:nth-of-type(2) {
                margin-left: 20px;
              }
            }
            .el-date-editor {
              width: auto;
              display: block;
              & > .el-input__inner {
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
</style>
