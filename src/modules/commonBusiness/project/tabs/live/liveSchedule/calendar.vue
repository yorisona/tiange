<!--
 * @Brief: 直播场次-日历
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-01-14 15:22:02
-->
<template>
  <div class="tg-live-schedule-calendar" style="overflow: overlay" v-loading="loading">
    <div class="calender">
      <div class="grid-item grid-item-header" v-for="week in weeks" :key="week">
        {{ week }}
      </div>
      <!-- 上个月 -->
      <!-- <div
        class="grid-item grid-item-content"
        v-for="day in prefixDays"
        :key="day + 'pre'"
        disabled
      >
        <div class="day-no">
          {{ day }}
        </div>
      </div> -->
      <!-- 当前月 -->
      <div
        class="grid-item grid-item-content"
        :class="isToday(day) ? 'today' : ''"
        v-for="(day, dayIndex) in calendarData"
        :key="dayIndex + 'cur'"
      >
        <div class="grid-item-content-header">
          <div class="day-no">
            {{ day.day }}
          </div>
          <div
            class="rest"
            :class="day.status === 1 ? 'is-rest' : ''"
            :disabled="is_rest_disabled(day)"
            @click="onRestHandle(day)"
          >
            休
          </div>
        </div>
        <div class="grid-item-content-detail">
          <div v-if="day.status === 2" style="display: flex; flex-direction: column">
            <el-popover
              v-for="(live, liveIndex) in two_live(day)"
              :key="liveIndex + 'live'"
              placement="right-start"
              :open-delay="300"
              trigger="hover"
              :disabled="!is_live_abnormal(live)"
              :style="liveIndex < 1 ? '' : 'margin-top: 8px;'"
            >
              <div>
                <div
                  :class="tipIndex > 0 ? 'mgt-12' : ''"
                  v-for="(tip, tipIndex) in abnormal_live_tips(live)"
                  :key="tipIndex + 'tip'"
                >
                  {{ tip }}
                </div>
              </div>
              <div
                slot="reference"
                class="live"
                :class="is_live_abnormal(live) ? 'abnormal' : ''"
                @click="jumpDetail(live)"
              >
                <div class="live_item" v-if="liveIndex < 2">
                  <span>{{ live.time_str }}</span>
                  <span>{{
                    live.live_type === 60 ? '直播' : live.live_type === 61 ? '短视频' : '图文'
                  }}</span>
                </div>
              </div>
            </el-popover>
          </div>
          <div
            v-if="day.status === 0"
            style="
              text-align: center;
              margin-top: 40px;
              color: var(--disabled-color);
              font-size: var(--small-font-size);
            "
          >
            暂无排期
          </div>
          <div
            v-if="day.status === 1"
            style="
              text-align: center;
              margin-top: 11px;
              color: #c1c1c1;
              font-size: 56px;
              font-weight: 400;
            "
          >
            休
          </div>
        </div>
        <!-- <div class="grid-item-content-footer"> -->
        <div
          class="grid-item-content-footer"
          v-if="day.status === 2 && day.shop_live_list.length > 2"
        >
          <el-popover
            popper-class="more-live"
            trigger="hover"
            placement="right-start"
            :open-delay="300"
          >
            <tg-icon slot="reference" name="ico-Icon_24px_gengduo"></tg-icon>
            <div class="live-list">
              <div
                class="live"
                v-for="(live, liveIndex) in day.shop_live_list"
                :key="liveIndex + 'live'"
                :class="is_live_abnormal(live) ? 'abnormal' : ''"
                @click="jumpDetail(live)"
              >
                <div class="live_item">
                  <span>{{ live.time_str }}</span>
                  <span>{{
                    live.live_type === 60 ? '直播' : live.live_type === 61 ? '短视频' : '图文'
                  }}</span>
                </div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <!-- 下个月 -->
      <!-- <div
        class="grid-item grid-item-content"
        v-for="day in surfixDays"
        :key="day + 'sur'"
        disabled
      >
        <div class="day-no">
          {{ day }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<script src="./calendar.ts"></script>

<style lang="less">
@import './calendar.less';
</style>
