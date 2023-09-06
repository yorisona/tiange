<!--
 * @Description: 店铺代播 - 直播场次 - 场次详情 排班
-->
<template>
  <div class="tg-live-project-user-schedule-dialog">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="528px"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
    >
      <div class="content-container">
        <el-form label-width="60px" size="mini" label-position="top">
          <div class="content">
            <!-- 主播排班 -->
            <el-timeline v-if="type === 'anchor'">
              <el-timeline-item
                v-for="(item, index) in kol_schedule_infos"
                :key="index"
                placement="top"
              >
                <i
                  v-if="
                    index !== 0 &&
                    kol_schedule_infos.length !== 1 &&
                    !isAutoObtain &&
                    !hasImportKolData
                  "
                  class="delete-btn-time el-icon-error"
                  @click="deleteAnchorTime(index)"
                ></i>
                <div class="timeline-back">
                  <el-form-item label="直播时间：">
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
                        :picker-options="item.limitDate"
                        @change="kolWorkTime(index)"
                        placeholder="选择日期时间"
                      >
                      </el-date-picker>
                      <span style="font-size: 12px"> ~ {{ item.end_time || '待设置' }}</span>

                      <!-- <el-date-picker
                        :picker-options="item.limitDate"
                        v-model="kol_schedule_infos[index].start_time_data"
                        clearable
                        :editable="false"
                        type="date"
                        range-separator="~"
                        placeholder="日期"
                        format="yyyy.MM.dd"
                        value-format="yyyy-MM-dd"
                        style="width: 135px"
                        @change="changeDate(index)"
                      /> -->
                      <!-- <el-time-picker
                        :disabled="index === 0"
                        v-model="kol_schedule_infos[index].start_time_temp"
                        style="margin-left: 6px; width: 105px"
                        placeholder="时间"
                        @change="value => changeTime(value, index)"
                        value-format="HH:mm"
                        format="HH:mm"
                      />
                      ~ {{ item.end_time.replace(/-/g, '.').replace('null', ' ') }} -->
                    </div>
                    <!-- {{ item.start_time.replace(/-/g, '.') }} ~ -->
                    <!-- {{ item.end_time.replace(/-/g, '.').replace('null', ' ') }} -->
                  </el-form-item>
                  <el-form-item style="margin-bottom: 0" label="排班人员：" />
                  <div>
                    <el-select
                      size="mini"
                      style="width: 432px"
                      :clearable="!hasImportKolData"
                      multiple
                      reserve-keyword
                      filterable
                      :disabled="isAutoObtain"
                      v-defaultSelect="item.importKols || []"
                      :value="item.kol_ids"
                      placeholder="请输入并选择排班人员"
                      @change="changeValue => onSelectUserChanged(changeValue, index)"
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
                <div
                  :disabled="isAutoObtain || hasImportKolData"
                  class="add-timeline"
                  @click="() => addTimeLine(true)"
                  v-if="index === kol_schedule_infos.length - 1"
                >
                  <i class="el-icon-circle-plus" style="font-size: 16px"></i>添加时间点
                </div>
              </el-timeline-item>
              <el-timeline-item placement="top" style="height: 18px"></el-timeline-item>
            </el-timeline>
            <!-- 运营排班 -->
            <el-timeline v-if="type === 'assistant'">
              <el-timeline-item
                v-for="(item, index) in kol_schedule_infos"
                :key="index"
                placement="top"
              >
                <i
                  v-if="kol_schedule_infos.length !== 1"
                  class="delete-btn-time el-icon-error"
                  @click="deleteAnchorTime(index)"
                ></i>
                <div class="timeline-back">
                  <el-form-item label="直播时间：">
                    <div>
                      <el-date-picker
                        style="width: 176px"
                        v-model="item.start_time"
                        type="datetime"
                        :disabled="index === 0"
                        :clearable="false"
                        format="yyyy.MM.dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        :picker-options="item.limitDate"
                        @change="kolWorkTime(index)"
                        placeholder="选择日期时间"
                      >
                      </el-date-picker>
                      <span style="font-size: 12px"> ~ {{ item.end_time || '待设置' }}</span>

                      <!-- <el-date-picker
                        :picker-options="item.limitDate"
                        v-model="kol_schedule_infos[index].start_time_data"
                        clearable
                        :editable="false"
                        type="date"
                        range-separator="~"
                        placeholder="日期"
                        format="yyyy.MM.dd"
                        value-format="yyyy-MM-dd"
                        style="width: 135px"
                        @change="changeDate(index)"
                      />
                      <el-time-picker
                        :disabled="index === 0"
                        v-model="kol_schedule_infos[index].start_time_temp"
                        style="margin-left: 6px; width: 105px"
                        placeholder="时间"
                        @change="value => changeTime(value, index)"
                        value-format="HH:mm"
                        format="HH:mm"
                      />
                      ~ {{ item.end_time.replace(/-/g, '.') }}
                    </div>
                    <div v-else>
                      {{ item.start_time.replace(/-/g, '.') }} ~
                      {{ item.end_time.replace(/-/g, '.') }} -->
                    </div>
                  </el-form-item>
                  <el-form-item style="margin-bottom: 0" label="排班人员：" />
                  <div>
                    <el-select
                      size="mini"
                      style="width: 432px"
                      clearable
                      multiple
                      reserve-keyword
                      filterable
                      :value="item.kol_ids"
                      placeholder="请输入并选择排班人员"
                      @change="changeValue => onSelectUserChanged(changeValue, index)"
                      popper-class="el-select-popper-mini"
                      remote
                      :remote-method="getKolList"
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
                <div
                  class="add-timeline"
                  @click="addTimeLine"
                  v-if="index === kol_schedule_infos.length - 1"
                >
                  <i class="el-icon-circle-plus"></i>添加时间点
                </div>
              </el-timeline-item>
              <el-timeline-item placement="top" style="height: 18px"></el-timeline-item>
            </el-timeline>
          </div>
        </el-form>
      </div>
      <div class="dialog-footer">
        <tg-button-line justifyContent="center">
          <tg-button @click="closeDialog">取消</tg-button>
          <tg-button type="primary" @click="save">保存</tg-button>
        </tg-button-line>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./LiveScheduleForm.ts"></script>

<style lang="scss" scoped>
@import '@/modules/live/display/dialog/anchor.arrange.form.scss';
// @import '@/assets/scss/common-system.scss';
</style>

<style lang="less">
@charset 'utf-8';

.tg-live-project-user-schedule-dialog {
  .el-select--mini {
    height: auto;
  }
  .delete-btn-time {
    cursor: pointer;
    position: absolute;
    top: -4px;
    right: 7px;
    font-size: var(--small-font-size);
    &:hover {
      color: var(--error-color);
    }
  }
  .el-form-item--small .el-form-item__label {
    line-height: 16px;
  }
  .add-timeline {
    &[disabled='disabled'] {
      cursor: not-allowed !important;
      color: fade(#3c5269, 40) !important;
    }
  }
  .tg-dialog-vcenter-new .content-container {
    overflow: overlay;
  }
}
</style>
