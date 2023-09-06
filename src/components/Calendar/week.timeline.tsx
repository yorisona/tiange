/**
 * 周 - 时间线
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 11:01:08
 */
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import TgTimelineSchedule from './timeline.schedule';
import { ScheduleGroup, TimelineSchedule } from '@/types/components/calendar';
import { MILLIONSECONDS_OF_DAY } from '@/const/time';
import { getHourStr } from './util';
import moment from 'moment';

const dayStr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

type ScheduleGroupAny = ScheduleGroup<Record<string, any>>;
type TimelineScheduleAny = TimelineSchedule<Record<string, any>>;

export default defineComponent({
  name: 'TgWeekTimeline',
  components: { TgTimelineSchedule },
  props: {
    /** 日程列表 */
    schedules: {
      type: Array as PropType<ScheduleGroupAny[]>,
      required: true,
    },
    /** 是否显示遮罩层 */
    maskShow: {
      type: Boolean,
      default: false,
    },
    /** 起始日期 */
    startDate: {
      type: Number,
      required: true,
    },
    /** 时间线上的日程列表 */
    timelineSchedules: {
      type: Array as PropType<TimelineScheduleAny[]>,
      required: true,
    },
  },
  setup(props) {
    const days = ref(
      dayStr.map((el, index) => {
        return {
          index,
          className: `day-${el}`,
        };
      }),
    );

    const cells = ref(
      new Array(168)
        .fill(0)
        .map((_, index) => index)
        .map(index => {
          const weekday = index % 7;
          const row = Math.trunc(index / 7);

          const className = `cell-${dayStr[weekday]}-${row + 1}`;

          return {
            index,
            weekday: weekday + 1,
            className,
            row,
            hourStart: getHourStr(row),
            hourEnd: getHourStr(row + 1),
          };
        }),
    );

    const today = computed(() => new Date().getDay());

    /** 安排按周几分组 */
    const schedulesGroup = computed(() => {
      const list: ScheduleGroupAny[][] = [[], [], [], [], [], [], []];
      props.schedules.forEach(el => {
        list[(el.day + 6) % 7].push(el);
      });

      return list;
    });

    /** 日程安排 */
    const daySchedules = computed(() =>
      schedulesGroup.value.map(schedule =>
        schedule.map(el => {
          return {
            id: el.id,
            title: el.title,
            content: el.content,
            color: el.color,
          };
        }),
      ),
    );

    /** 时间线内排期数据 */
    const timeSchedules = computed(() => props.timelineSchedules.map(el => ({ ...el })));

    const headers = computed(() =>
      ['全部', '周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((el, index) => {
        return {
          title: undefined,
          subTitle: el,
          class: index === new Date().getDay() ? ['active'] : [],
        };
      }),
    );

    return {
      days,
      cells,
      today,
      schedulesGroup,
      daySchedules,
      timeSchedules,
      headers,
    };
  },
  render() {
    const containerProps = {
      class: ['week-cal'],
      props: {
        headers: this.headers,
      },
    };
    /** 周几节点(背景格子) */
    const dayGridCellNodes = this.days.map(day => (
      <div class={['cell-day cell', day.className]} key={`day-${day.index}`}></div>
    ));

    /** 普通单元格(背景格子) */
    const cellNodes = this.cells.map(cell => {
      const props = {
        class: ['cell-day cell', cell.className],
        attrs: {
          'data-hour-start': cell.hourStart,
          'data-hour-end': cell.hourEnd,
          'data-day': cell.weekday,
        },
        key: `cell-${cell.index}`,
      };

      return <div {...props}></div>;
    });

    /** 日程 */
    const dayDataNodes = this.daySchedules.map((schedules, index) => {
      // const dayDate = new Date(this.startDate + index * MILLIONSECONDS_OF_DAY);
      const dayDate = moment(this.startDate + index * MILLIONSECONDS_OF_DAY).toDate();
      const dayProps = {
        props: {
          schedules,
          date: dayDate.getDate(),
        },
        on: {
          click: () => {
            const year = dayDate.getFullYear();
            const month = dayDate.getMonth();
            const date = dayDate.getDate();
            this.$emit('calendar:day:click', { year, month, date });
          },
          'memo:click': (id: number) => {
            this.$emit('week:memo:click', id);
          },
        },
        key: dayStr[index],
      };

      return (
        <tg-calendar-card class={`day-${dayStr[index]}`} key={dayStr[index]}>
          <tg-calendar-day {...dayProps}>
            <span slot="empty">待排期</span>
          </tg-calendar-day>
        </tg-calendar-card>
      );
    });

    return (
      <tg-calendar {...containerProps}>
        <div class="calendar-bd">
          <div class="tg-calendar-grid week-grid">
            <div class="cell-week cell"></div>
            {dayGridCellNodes}
            <tg-calendar-timeline size="40" class="cell" props={{ start: this.start }} />
            {cellNodes}
            {this.maskShow ? (
              <tg-calendar-mask props={{ direction: 'column', column: this.today }} key="column" />
            ) : (
              ''
            )}
            {dayDataNodes}
            {this.timeSchedules.map(el => (
              <tg-timeline-schedule schedule={el} key={`${el.id}_${el.start_time}`} />
            ))}
          </div>
        </div>
      </tg-calendar>
    );
  },
});
