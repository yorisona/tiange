<!--
 * @Author: 矢车
 * @Date: 2021-01-12 15:44:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-02 11:03:04
 * @Description: 店铺代播 - 直播场次 - 场次详情
-->
<template>
  <div class="live-arrange dialog-sty">
    <div class="content-container">
      <div class="descript">
        <span class="des-label">直播时间：</span>
        <span class="des-value"
          >{{ liveDisplay.live_start_time.replace(/-/g, '.') }} ~
          {{ liveDisplay.live_end_time.replace(/-/g, '.') }}</span
        >
        <span class="des-explain">
          <a @click="scheduleQuery">排班查询</a>
        </span>
      </div>
      <div class="content">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in kol_schedule_infos"
            :key="index"
            placement="top"
          >
            <div class="anchor-time" v-if="index !== 0">
              <el-date-picker
                :picker-options="item.limitDate"
                v-model="item.start_time_data"
                type="date"
                placeholder="选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                @change="changeDate(index)"
                :clearable="false"
              />
              <el-time-select
                v-model="item.start_time_temp"
                :picker-options="getLimitTimeSetting(index)"
                placeholder="选择时间"
                @change="changeTime(index)"
                :clearable="false"
              />
              <i class="delete-btn-time el-icon-error" @click="deleteAnchorTime(index)"></i>
            </div>
            <div v-else>
              {{ liveDisplay.live_start_time.replace(/-/g, '.') }}
            </div>
            <div class="timeline-back">
              <div class="title" v-if="!item.start_time">直播时间：待设置</div>
              <div class="title" v-else>
                直播时间：{{ item.start_time.replace(/-/g, '.') }} ~
                <span>{{
                  index === kol_schedule_infos.length - 1 ||
                  kol_schedule_infos[index + 1].start_time
                    ? index === kol_schedule_infos.length - 1
                      ? liveDisplay.live_end_time.replace(/-/g, '.')
                      : kol_schedule_infos[index + 1].start_time.replace(/-/g, '.')
                    : '未设置'
                }}</span>
              </div>
              <ul>
                <li>
                  <span class="li-title">{{ type === 'anchor' ? '主播：' : '运营助理：' }}</span>
                  <div v-for="(item_id, itemIndex) in item.kol_ids" :key="item_id">
                    <!-- <div v-if="type === 'anchor'"> -->
                    <el-select
                      v-if="item_id >= 0 && type === 'anchor'"
                      :value="kol_name(item_id)"
                      filterable
                      placeholder="请选择主播"
                      @change="verifyAnchor($event, index, itemIndex)"
                      :class="
                        item.kol_ids_verify[itemIndex] && item.kol_ids_verify[itemIndex].show
                          ? 'error-form'
                          : ''
                      "
                    >
                      <el-option
                        v-for="item in anchorKolList"
                        :key="item.kol_id"
                        :label="item.kol_name"
                        :value="item.kol_id"
                        :disabled="isOptDisabled(index, item.kol_id)"
                      />
                    </el-select>
                    <el-select
                      v-if="item_id < 0 && type === 'anchor'"
                      v-model="kol_schedule_infos[index].kol_ids[itemIndex]"
                      filterable
                      placeholder="请选择主播"
                      @change="verifyAnchor($event, index, itemIndex)"
                      :class="
                        item.kol_ids_verify[itemIndex] && item.kol_ids_verify[itemIndex].show
                          ? 'error-form'
                          : ''
                      "
                    >
                      <el-option
                        v-for="item in anchorKolList"
                        :key="item.kol_id"
                        :label="item.kol_name"
                        :value="item.kol_id"
                        :disabled="isOptDisabled(index, item.kol_id)"
                      />
                    </el-select>
                    <!-- </div> -->
                    <el-select
                      v-if="type === 'assistant'"
                      v-model="kol_schedule_infos[index].kol_ids[itemIndex]"
                      filterable
                      placeholder="请选择运营助理"
                      @change="verifyAnchor($event, index, itemIndex)"
                      :class="
                        item.kol_ids_verify[itemIndex] && item.kol_ids_verify[itemIndex].show
                          ? 'error-form'
                          : ''
                      "
                    >
                      <el-option
                        v-for="item in oprateList"
                        :key="item.id"
                        :label="item.username"
                        :value="item.id"
                        :disabled="isOptDisabled(index, item.id)"
                      >
                      </el-option>
                    </el-select>
                    <i
                      v-show="item.kol_ids.length !== 1"
                      class="delete-btn el-icon-error"
                      @click="deleteAnchor(index, itemIndex)"
                    ></i>
                    <div
                      class="error-tips"
                      v-show="item.kol_ids_verify[itemIndex] && item.kol_ids_verify[itemIndex].show"
                    >
                      <!-- 排期冲突年月日显示规则: 不显示年月日,如果跨天显示 结束时间(需要年月日) ~ 开始时间(时分), 跨天的开始时间显示,次日+时分 -->
                      排期冲突：{{ item.kol_ids_verify[itemIndex].info.conflictTime }}
                      {{ item.kol_ids_verify[itemIndex].info.studio_name }}
                    </div>
                  </div>
                </li>
                <li style="margin-bottom: 0; margin-top: -10px" @click="addAnchor(index)">
                  <p class="add-table-line ml70">
                    <i class="el-icon-plus"></i
                    >{{ type === 'anchor' ? '添加主播' : '添加运营助理' }}
                  </p>
                </li>
              </ul>
            </div>
            <div
              class="add-timeline"
              @click="addTimeLine"
              v-if="index === kol_schedule_infos.length - 1"
            >
              <i class="el-icon-circle-plus"></i>添加时间点
            </div>
          </el-timeline-item>
          <el-timeline-item placement="top" style="height: 18px">
            <div class="descript">
              {{ liveDisplay.live_end_time.replace(/-/g, '.') }}
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <div class="dialog-footer">
      <tg-button-line justifyContent="center">
        <tg-button @click="closeDialog">取消</tg-button>
        <tg-button type="primary" @click="save">保存</tg-button>
      </tg-button-line>
    </div>
  </div>
</template>

<script src="./anchor.arrange.form.ts"></script>

<style lang="scss" scoped>
@import './anchor.arrange.form.scss';
@import '@/assets/scss/common-system.scss';
.el-select-dropdown__item {
  display: block;
  width: 340px;
}
</style>
