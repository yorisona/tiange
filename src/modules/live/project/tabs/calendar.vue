<template>
  <div class="tg-live-project-detail-tab-calendar">
    <div class="calendar-hd">
      <div class="calendar-hd-left">
        <div class="btn-circle" @click="calendarPageUp">
          <tg-icon name="ico-arrow-left" />
        </div>
        <div class="btn-circle mgl-16" @click="calendarPageDown">
          <tg-icon name="ico-arrow-right" />
        </div>
        <div class="calendar-date-range mgl-16" v-if="isWeek">{{ weekStr }}</div>
        <div class="calendar-date-range mgl-16" v-if="isMonth">{{ monthStr }}</div>
      </div>
      <div class="calendar-hd-right">
        <div class="role-label-group mgr-20" v-if="isWeek">
          <div class="role-label" v-for="role in roles" :key="role.name">
            <div class="role-color" :style="`background-color: ${role.color}`"></div>
            <div>{{ role.name }}</div>
          </div>
        </div>
        <TgBtnCapsule
          class="btn-capsule"
          :value="calendar === 'week' ? 'left' : 'right'"
          @click="onCapsuleClick"
        >
          <template #left>周</template>
          <template #right>月</template>
        </TgBtnCapsule>
      </div>
    </div>
    <TgTabCalendarWeek
      ref="CalenderWeekRef"
      v-if="isWeek"
      @calendar:day:click="onDayClick"
      @week:memo:click="onWeekMemoClick"
    />
    <TgTabCalendarMonth
      ref="CalenderMonthRef"
      v-if="isMonth"
      @calendar:day:click="onDayClick"
      @month:memo:click="onMonthMemoClick"
    />
    <liveDisplayAdd
      :visible="showLiveDisplay"
      :defaultDisplay="liveDisplay"
      :start_date_disabled="true"
      @closeAction="liveDisplayClosed"
      @succeed="liveDisplaySaveSucceed"
    />
  </div>
</template>

<script src="./calendar.ts"></script>

<style lang="less">
@import './calendar.less';
</style>
