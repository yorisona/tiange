<template>
  <TgCalendarMonth
    class="mgt-10"
    :year="year"
    :month="month"
    :schedules="projectScheduleGroupByDay"
    @calendar:day:click="onClick"
    @month:memo:click="momeClick"
    v-loading="loading"
  />
</template>

<script src="./calendar.month.ts"></script>
