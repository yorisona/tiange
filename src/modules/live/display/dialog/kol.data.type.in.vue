<!--
 * @Brief: 录入主播数据弹框
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-01-15 11:39:46
-->
<template>
  <div class="tg-live-display-dialog-kol-data-type-in-page tg-dialog-vcenter">
    <el-drawer
      class="tg-dialog-classic tg-live-display-form-dialog"
      title="主播数据录入"
      :wrapperClosable="false"
      :visible="visible"
      @close="close"
    >
      <div class="dialog-body">
        <div class="dialog-content">
          <el-alert
            :closable="false"
            type="warning"
            title="注意：此数据将用于主播工资结算，请确保数据准确"
            show-icon
          >
          </el-alert>
          <el-form label-position="top" ref="formRef" :model="form" label-width="0">
            <div v-for="(row, index) in form.list" :key="index" class="kol-data-row-bg">
              <div
                :style="
                  index === 0
                    ? 'border-top: 1px solid transparent; margin: 0px 0 6px 0'
                    : 'border-top: 1px dashed rgba(60, 82, 105, 0.3); margin: 24px 0 6px 0'
                "
              ></div>
              <el-form-item
                class="kol-name-item"
                :label="`主播${index + 1}`"
                label-width="74px"
                size="medium"
                :prop="'list.' + index + '.kol_id'"
                :rules="{ required: true, message: '请输入主播名称', trigger: ['change'] }"
              >
                <el-select
                  v-if="row.kol_id >= 0"
                  v-model="row.kol_name"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入主播名称"
                  :remote-method="queryKolRequest"
                  :loading="loading"
                  @change="kolValueChanged($event, index)"
                >
                  <el-option
                    v-for="item in kolList"
                    :key="item.kol_id"
                    :label="item.kol_name"
                    :value="item.kol_name"
                  >
                  </el-option>
                </el-select>
                <el-select
                  v-else
                  v-model="row.kol_name"
                  filterable
                  remote
                  clearable
                  reserve-keyword
                  placeholder="请输入主播名称"
                  :remote-method="queryKolRequest"
                  :loading="loading"
                  @change="kolValueChanged($event, index)"
                >
                  <el-option
                    v-for="item in kolList"
                    :key="item.kol_id"
                    :label="item.kol_name"
                    :value="item.kol_name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="live-time-content">
                <el-form-item
                  label="直播时间"
                  label-width="78px"
                  size="medium"
                  :prop="'list.' + index + '.live_start_date'"
                  :rules="{ required: true, message: '请选择开始日期', trigger: ['change'] }"
                >
                  <el-date-picker
                    :editable="false"
                    :clearable="false"
                    v-model="row.live_start_date"
                    type="date"
                    placeholder="开始日期"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    @change="liveTimeChange(index)"
                  />
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="0"
                  size="medium"
                  :prop="'list.' + index + '.live_start_time'"
                  :rules="{ required: true, message: '请选择开始时间', trigger: ['change'] }"
                >
                  <el-time-select
                    :editable="false"
                    :clearable="false"
                    v-model="row.live_start_time"
                    placeholder="开始时间"
                    value-format="HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                    }"
                    @change="liveTimeChange(index)"
                  />
                </el-form-item>
                <span class="date-picker-separator">~</span>
                <el-form-item
                  label=" "
                  label-width="0"
                  size="medium"
                  :prop="'list.' + index + '.live_end_date'"
                  :rules="{ required: true, message: '请选择结束日期', trigger: ['change'] }"
                >
                  <el-date-picker
                    :editable="false"
                    :clearable="false"
                    v-model="row.live_end_date"
                    type="date"
                    placeholder="结束日期"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    @change="liveTimeChange(index)"
                  />
                </el-form-item>
                <el-form-item
                  label=" "
                  label-width="0"
                  size="medium"
                  :prop="'list.' + index + '.live_end_time'"
                  :rules="{ required: true, message: '请选择结束时间', trigger: ['change'] }"
                >
                  <el-time-select
                    :editable="false"
                    :clearable="false"
                    v-model="row.live_end_time"
                    placeholder="结束时间"
                    value-format="HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30',
                    }"
                    @change="liveTimeChange(index)"
                  />
                </el-form-item>
              </div>
              <el-form-item
                class="live-time-duration-item"
                label="直播时长"
                label-width="78px"
                size="medium"
                :prop="'list.' + index + '.real_duration'"
                :rules="{ required: true, message: '请输入直播时长', trigger: ['blur', 'change'] }"
              >
                <el-input
                  placeholder="直播时长"
                  @input="durationChange($event, index)"
                  v-model="row.real_duration"
                >
                  <template slot="append">小时</template>
                </el-input>
              </el-form-item>
              <tg-button
                v-show="form.list.length > 1"
                class="delete-kol"
                type="link"
                @click="deleteKol(index)"
              >
                删除
                <!-- <tg-icon class="delete-kol-icon-normal" name="ico-cross"></tg-icon>
                <tg-icon class="delete-kol-icon-hover" name="ico-cross-red"></tg-icon> -->
              </tg-button>
            </div>
          </el-form>
          <el-button class="add-kol" type="text" icon="el-icon-plus" size="medium" @click="addKol"
            >点击添加</el-button
          >
        </div>
        <div class="dialog-footer">
          <tg-button size="small" @click="close">取消</tg-button>
          <tg-button size="small" type="primary" @click="save">保存</tg-button>
        </div>
      </div>
      <!-- <div class="dialog-content">

      </div> -->
      <!-- <template #footer>
        <tg-button @click="close">取消</tg-button>
        <tg-button type="primary" @click="save">保存</tg-button>
      </template> -->
    </el-drawer>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./kol.data.type.in.ts"></script>

<style lang="less">
@import './display.form.less';
.tg-live-display-dialog-kol-data-type-in-page {
  .el-drawer {
    width: 520px !important;
    .dialog-body {
      height: 100%;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
    }
    .dialog-content {
      overflow-y: auto;
      overflow: overlay;
      padding-bottom: 18px;
      .el-form {
        margin: 0 24px 24px 24px;
        .el-form-item {
          margin-bottom: 0;
          .el-form-item__label {
            padding: 0;
            margin-top: 18px;
            line-height: 16px;
            font-size: 12px;
          }
          .el-form-item__content {
            margin-top: 6px;
          }
        }
        .kol-data-row-bg {
          position: relative;
          .live-time-content {
            display: flex;
            & > :nth-child(1) {
              width: 118px;
            }
            & > :nth-child(4) {
              width: 118px;
              > .el-form-item__label::before {
                color: transparent !important;
              }
            }
            & > :nth-child(2) {
              width: 102px;
              > .el-form-item__label::before {
                color: transparent !important;
              }
            }
            & > :nth-child(5) {
              width: 102px;
              > .el-form-item__label::before {
                color: transparent !important;
              }
            }
            & > :last-child {
              margin-right: 0px;
            }
          }
          .el-form-item {
            display: inline-block;
            margin-right: 6px;
            .el-date-editor {
              .el-input__inner {
                padding-right: 12px;
              }
            }
            .el-input-group__append {
              padding: 0;
              width: 52px;
              text-align: center;
            }

            // &:nth-child(3) {
            //   width: 118px;
            //   margin-right: 6px;
            // }
            // &:nth-child(4) {
            //   width: 102px;
            // }
            // &:nth-child(6) {
            //   width: 118px;
            // }
            // &:nth-child(7) {
            //   width: 102px;
            //   margin-right: 0;
            // }
            // &:nth-child(2),
            // &:last-of-type {
            //   display: block;
            //   margin-right: 0;
            // }
          }
          .kol-name-item {
            display: block;
            margin-right: 0;
          }
          .date-picker-separator {
            margin-right: 6px;
            display: inline-block;
            padding-top: 48px;
          }
          .live-time-duration-item {
            display: block;
            margin-right: 0;
          }
        }
        .delete-kol {
          position: absolute;
          // width: 16px;
          line-height: 18px;
          padding: 0;
          right: 0px;
          top: 15px;
          color: var(--theme-color);
          &:hover {
            color: #ec1e1e;
          }
        }
      }
      .add-kol {
        display: block;
        color: var(--theme-color);
        width: 472px;
        margin: 0 24px 0;
        // margin-right: 30px;
        border: 1px dashed #dcdfe6;
        box-sizing: border-box;
        &:hover {
          color: fade(#2570f1, 90);
          border: 1px dashed fade(#2570f1, 90);
        }
        &:active {
          color: #2570f1;
          border: 1px dashed #2570f1;
        }
      }
    }
    .dialog-footer {
      padding-right: 6px;
      flex-shrink: 0;
      height: 50px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background: #f4f8ff;
      .tg-btn {
        margin-right: 18px;
      }
    }
  }
}
</style>
