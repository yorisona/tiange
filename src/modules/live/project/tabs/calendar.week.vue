<template>
  <TgWeekTimeline
    class="mgt-10"
    :schedules="projectScheduleGroupByDay"
    :timeline-schedules="projectScheduleGroupByHours"
    :mask-show="isThisWeek"
    :start-date="startDate"
    @calendar:day:click="onClick"
    @week:memo:click="momeClick"
    v-loading="loading"
  />
</template>

<script src="./calendar.week.ts"></script>
