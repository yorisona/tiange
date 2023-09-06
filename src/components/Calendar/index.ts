/**
 * 日历相关组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 13:24:04
 */
import { PluginObject, VueConstructor } from 'vue';
import TgCalendar from './container';
import TgCalendarTimeline from './timeline';
import TgCalendarMask from './mask';
import TgCalendarCard from './card';
import TgCalendarMemo from './memo';
import TgCalendarDay from './day';
import TgCalendarMonth from './month';
import TgTimelineSchedule from './timeline.schedule';
import TgRosterTimeline from './roster.timeline';
import TgRosterDay from './roster.day';
import TgDayTimeline from './day.timeline';

const install: PluginObject<undefined> = {
  install: (vue: VueConstructor) => {
    vue.component(TgCalendar.name, TgCalendar);
    vue.component(TgCalendarTimeline.name, TgCalendarTimeline);
    vue.component(TgCalendarMask.name, TgCalendarMask);
    vue.component(TgCalendarCard.name, TgCalendarCard);
    vue.component(TgCalendarMemo.name, TgCalendarMemo);
    vue.component(TgCalendarDay.name, TgCalendarDay);
    vue.component(TgTimelineSchedule.name, TgTimelineSchedule);
    vue.component(TgCalendarMonth.name, TgCalendarMonth);
    vue.component(TgCalendarMonth.name, TgCalendarMonth);
    vue.component(TgRosterTimeline.name, TgRosterTimeline);
    vue.component(TgRosterDay.name, TgRosterDay);
    vue.component(TgDayTimeline.name, TgDayTimeline);
  },
};

export default install;
