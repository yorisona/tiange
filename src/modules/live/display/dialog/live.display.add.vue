<template>
  <div class="tg-live-display-dialog-add-page tg-dialog-vcenter">
    <el-drawer
      class="tg-dialog-classic"
      :visible="visible"
      :wrapperClosable="false"
      :close-on-press-escape="false"
      @close="handleCloseAction"
    >
      <template #title
        ><span>{{ title }}</span></template
      >
      <div class="ta-live-display-content">
        <el-form
          label-position="top"
          ref="formRef"
          :model="numOfSessionsForm"
          :rules="formRules"
          size="mini"
          label-width="106px"
        >
          <!-- 新增时显示 -->
          <head-lines style="margin-bottom: 12px; margin-left: -10px" title="场次信息" />
          <el-form-item class="one-item" label="直播标题" :prop="isDataImport ? '' : 'live_title'">
            <el-input
              v-model.trim="numOfSessionsForm.live_title"
              placeholder="请输入直播标题"
              maxlength="20"
              clearable
              :disabled="isDataImport"
            />
          </el-form-item>
          <div class="four-item">
            <el-form-item label="直播时间" prop="live_start_time" class="date-picker-item">
              <el-date-picker
                v-model="numOfSessionsForm.startTimeAndEndTime"
                :clearable="false"
                type="datetimerange"
                style="width: 482px"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                @change="onLiveTimeChange"
                popper-class="live-time-layer"
                :disabled="isDataImport"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <el-form-item
            class="one-item"
            label="直播间"
            prop="studio_id"
            :rules="
              studioRequired
                ? { required: true, message: '请选择直播间', trigger: ['blur', 'change'] }
                : undefined
            "
          >
            <el-select
              remote
              reserve-keyword
              :clearable="!studioRequired"
              :disabled="project_id === ''"
              v-model="numOfSessionsForm.studio_name"
              filterable
              placeholder="请选择直播间"
              :remote-method="queryStudio"
              @change="studioChanged"
            >
              <el-option
                v-for="item in studioList"
                :key="item.id"
                :label="item.studio_name"
                :value="item.studio_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <section class="schedule-list three-item" style="margin-top: 29px; margin-right: 24px">
            <head-lines style="margin-left: -10px" title="主播排班信息" />
            <div style="margin-top: 12px">
              <tg-button
                type="primary"
                :disabled="
                  !!numOfSessionsForm.kol_schedule_infos.length ||
                  !numOfSessionsForm.live_start_time ||
                  (!numOfSessionsForm.studio_id && studioRequired) ||
                  isNotOneDay ||
                  isAutoObtain ||
                  hasImportKolData
                "
                @click="onAddkolSchedule"
              >
                添加排班
              </tg-button>
              <tg-button
                type="default"
                class="mgl-12"
                :disabled="
                  !numOfSessionsForm.kol_schedule_infos.length || isAutoObtain || hasImportKolData
                "
                @click="onDeleteKolSchedule"
              >
                清除排班
              </tg-button>
            </div>
            <div
              style="display: flex; width: 100%"
              v-if="!!numOfSessionsForm.kol_schedule_infos.length"
            >
              <div
                style="
                  margin-right: 9px;
                  position: relative;
                  margin-top: 18px;
                  width: 2px;
                  flex-shrink: 0;
                "
              >
                <div
                  style="
                    margin: 8px 0;
                    height: calc(100% - 22px);
                    background: rgba(164, 178, 194, 0.3);
                  "
                ></div>
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -2px;
                    width: 6px;
                    height: 6px;
                    -moz-border-radius: 3px;
                    -webkit-border-radius: 3px;
                    border-radius: 3px;
                    background: rgba(164, 178, 194, 0.3);
                  "
                ></div>
                <div
                  style="
                    position: absolute;
                    bottom: 7px;
                    left: -2px;
                    width: 6px;
                    height: 6px;
                    -moz-border-radius: 3px;
                    -webkit-border-radius: 3px;
                    border-radius: 3px;
                    background: rgba(164, 178, 194, 0.3);
                  "
                ></div>
              </div>
              <div style="width: calc(100% - 11px)">
                <div
                  style="position: relative"
                  v-for="(item, index) in numOfSessionsForm.kol_schedule_infos"
                  :key="index"
                >
                  <i
                    v-if="index > 0 && !isAutoObtain && !hasImportKolData"
                    class="delete-btn-time el-icon-error"
                    @click="deleteKolTime(index)"
                  ></i>
                  <div
                    style="
                      padding: 18px 18px 12px 18px;
                      background: #f6f6f6;
                      color: #666;
                      margin-top: 18px;
                      border-radius: 4px;
                      width: 100%;
                    "
                  >
                    <el-form-item style="width: 100%" label="直播时间">
                      <div>
                        <el-date-picker
                          style="width: 176px"
                          v-model="item.start_time"
                          type="datetime"
                          :disabled="
                            index === 0 || isAutoObtain || (item.importKols || []).length > 0
                          "
                          :clearable="false"
                          format="yyyy.MM.dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm"
                          :picker-options="item.pickerOptions"
                          @change="kolWorkTime(index)"
                          placeholder="选择日期时间"
                        >
                        </el-date-picker>
                        <span> ~ {{ item.end_time || '待设置' }}</span>
                      </div>
                    </el-form-item>
                    <el-form-item
                      style="width: 100%; margin-bottom: 0"
                      label="排班人员"
                      :rules="{
                        required: true,
                        message: '请选择排版人员',
                      }"
                    />
                    <div>
                      <el-select
                        :clearable="!hasImportKolData"
                        style="width: 100%"
                        multiple
                        reserve-keyword
                        :disabled="isAutoObtain"
                        filterable
                        :value="item.kol_ids"
                        placeholder="请输入并选择排班人员"
                        v-defaultSelect="item.importKols || []"
                        @change="changeValue => onSelectKolUserChanged(changeValue, index)"
                      >
                        <el-option
                          v-for="anchorKol in anchorKolList"
                          :key="anchorKol.kol_id"
                          :label="`${anchorKol.kol_name}(${anchorKol.real_name})`"
                          :value="anchorKol.kol_id"
                          :disabled="(item.importKols || []).includes(anchorKol.kol_id)"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div
                  :disabled="isAutoObtain || hasImportKolData"
                  class="add-timeline"
                  @click="() => addKolTimeLine(true)"
                >
                  <i class="el-icon-circle-plus"></i>添加时间点
                </div>
              </div>
            </div>
          </section>
          <!-- 运营排班信息 -->
          <section class="schedule-list three-item" style="margin-top: 29px; margin-right: 24px">
            <head-lines style="margin-left: -10px" title="运营排班信息" />
            <div style="margin-top: 12px">
              <tg-button
                type="primary"
                :disabled="
                  !!numOfSessionsForm.operator_schedule_infos.length ||
                  !numOfSessionsForm.live_start_time ||
                  (!numOfSessionsForm.studio_id && studioRequired) ||
                  isNotOneDay
                "
                @click="onAddOperatorSchedule"
              >
                添加排班
              </tg-button>
              <tg-button
                type="default"
                class="mgl-12"
                :disabled="!numOfSessionsForm.operator_schedule_infos.length"
                @click="onDeleteOperatorSchedule"
              >
                清除排班
              </tg-button>
            </div>
            <div
              v-if="!!numOfSessionsForm.operator_schedule_infos.length"
              style="display: flex; width: 100%"
            >
              <div
                style="
                  margin-right: 9px;
                  position: relative;
                  margin-top: 18px;
                  width: 2px;
                  flex-shrink: 0;
                "
              >
                <div
                  style="
                    margin: 8px 0;
                    height: calc(100% - 22px);
                    background: rgba(164, 178, 194, 0.3);
                  "
                ></div>
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -2px;
                    width: 6px;
                    height: 6px;
                    -moz-border-radius: 3px;
                    -webkit-border-radius: 3px;
                    border-radius: 3px;
                    background: rgba(164, 178, 194, 0.3);
                  "
                ></div>
                <div
                  style="
                    position: absolute;
                    bottom: 7px;
                    left: -2px;
                    width: 6px;
                    height: 6px;
                    -moz-border-radius: 3px;
                    -webkit-border-radius: 3px;
                    border-radius: 3px;
                    background: rgba(164, 178, 194, 0.3);
                  "
                ></div>
              </div>
              <div style="width: calc(100% - 11px)">
                <div
                  style="position: relative"
                  v-for="(item, index) in numOfSessionsForm.operator_schedule_infos"
                  :key="index"
                >
                  <i
                    v-if="index > 0"
                    class="delete-btn-time el-icon-error"
                    @click="deleteOperateTime(index)"
                  ></i>
                  <div
                    style="
                      padding: 18px 18px 12px 18px;
                      background: #f6f6f6;
                      color: #666;
                      margin-top: 18px;
                      border-radius: 4px;
                      width: 100%;
                    "
                  >
                    <el-form-item style="width: 100%" label="直播时间">
                      <div>
                        <el-date-picker
                          style="width: 176px"
                          v-model="item.start_time"
                          type="datetime"
                          :disabled="index === 0"
                          :clearable="false"
                          format="yyyy.MM.dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm"
                          :picker-options="item.pickerOptions"
                          @change="kolOperateTime(index)"
                          placeholder="选择日期时间"
                        >
                        </el-date-picker>
                        <span> ~ {{ item.end_time || '待设置' }}</span>
                      </div>
                    </el-form-item>
                    <el-form-item
                      style="width: 100%; margin-bottom: 0"
                      label="排班人员"
                      :rules="{
                        required: true,
                        message: '请选择排版人员',
                      }"
                    />
                    <div>
                      <el-select
                        clearable
                        multiple
                        style="width: 100%"
                        reserve-keyword
                        filterable
                        :value="item.operator_ids"
                        placeholder="请输入并选择排班人员"
                        @change="changeValue => onSelectOperateUserChanged(changeValue, index)"
                        popper-class="el-select-popper-mini"
                        remote
                        :remote-method="getOprateList"
                      >
                        <el-option
                          v-for="item in oprateList"
                          :key="item.id"
                          :label="item.username"
                          :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="add-timeline" @click="addOperateTimeLine">
                  <i class="el-icon-circle-plus"></i>添加时间点
                </div>
              </div>
            </div>
          </section>
        </el-form>
        <div class="live-display-add-footer">
          <tg-button @click="handleCloseAction">取消</tg-button>
          <tg-button type="primary" @click="handleSaveHandler">保存</tg-button>
        </div>
      </div>
    </el-drawer>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./live.display.add.ts"></script>

<style lang="less">
@charset 'utf-8';

.tg-live-display-dialog-add-page {
  .el-drawer__container > .el-drawer > .el-drawer__header {
    padding: 0 16px;
  }
  .el-form-item__label {
    margin-bottom: 6px;
    line-height: 18px !important;
    height: 18px !important;
  }
  .delete-btn-time {
    cursor: pointer;
    position: absolute;
    top: -4px;
    right: -4px;
    color: #d2d4d9;
    font-size: var(--small-font-size);
    &:hover {
      color: var(--error-color);
    }
  }
  .add-timeline {
    display: inline-block;
    margin-top: 12px;
    color: #396fff;
    cursor: pointer;

    i {
      margin-right: 5px;
    }
    &[disabled='disabled'] {
      cursor: not-allowed;
      color: rgba(var(--text-rgb-color), 0.4);
    }
  }
  .el-drawer {
    width: 532px !important;
    .live-display-add-footer {
      background: #f2f7ff;
      height: 50px;
      line-height: 50px;
      display: grid;
      grid-template-columns: repeat(2, auto);
      align-content: center;
      justify-content: end;
      column-gap: 12px;
      padding: 24px;
    }
  }
  .ta-live-display-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: visible;
  }
  .el-form {
    flex: 1;
    padding: 24px 0 12px 24px;
    // overflow-y: auto;
    overflow: overlay;
    overflow-x: hidden;

    .el-form-item {
      margin-bottom: 18px;
      .el-date-editor {
        width: 100%;
      }
      .el-select {
        display: block;
      }
    }
    .date-picker-item {
      display: inline-block;
    }
    .time-picker-item {
      display: inline-block;
    }

    .remark-input {
      .el-textarea__inner {
        height: 94px;
      }
    }
    .el-input-group__append {
      padding: 0 10px;
      background-color: #f6f6f6;
      color: var(--text-third-color);
    }
    .selection-target-sub-title {
      height: 18px;
      line-height: 18px;
      margin: 6px 0 4px 0;
      span {
        font-size: 12px;
        color: var(--text-third-color);
      }
      div {
        border-top: 1px dashed rgba(var(--text-third-rgb-color), 0.3);
        height: 1px;
        overflow: hidden;
        display: inline-block;
        width: 510px;
        margin-left: 6px;
        margin-bottom: 4px;
      }
    }
  }
  .one-item {
    display: block;
    width: 482px;
  }
  .two-item-left {
    display: inline-block;
    width: 272px;
    margin-right: 18px;
  }
  .two-item-right {
    display: inline-block;
    width: 272px;
    margin-right: 0 !important;
  }
  .el-form-item__label {
    line-height: 16px;
  }
  .el-form-item {
    .el-input--suffix .el-input__inner {
      padding-right: 6px;
    }
  }
  .three-item {
    .el-form-item {
      display: inline-block;
      margin-right: 18px;
      width: 178px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .four-item {
    .el-form-item {
      display: inline-block;
      &:nth-of-type(1) {
        margin-right: 6px;
        width: 141px;
      }
      &:nth-of-type(3) {
        margin-right: 6px;
        width: 141px;
      }
      &:nth-of-type(2) {
        // margin-right: 18px;
        width: 120px;
      }
      &:last-of-type {
        margin-right: 0;
        width: 120px;
      }

      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .mgb-18 {
    margin-bottom: 18px !important;
  }
}

.el-message.is-closable {
  padding: 0 30px 0 20px;
}
.el-picker-panel__footer .el-button.el-picker-panel__link-btn.el-button--text.el-button--mini {
  display: none;
}
.live-time-layer {
  .el-time-panel {
    left: -33px !important;
  }
}
</style>
