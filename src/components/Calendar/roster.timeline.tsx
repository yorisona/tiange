/**
 * 排班-时间线
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-19 00:33:23
 */
import { computed, defineComponent, PropType } from '@vue/composition-api';
import TgTimelineScheduleSingle from './timeline.schedule.single';
import { getHourStr } from './util';
import { format, getDate } from '@/utils/time';
import { MILLIONSECONDS_OF_DAY } from '@/const/time';
import { RosterTimelineSchedule } from '@/types/components/calendar';
import { TimeLineHeight } from '@/types/components/calendar';

const dayStr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const dateStr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default defineComponent({
  name: 'TgRosterTimeline',
  components: { TgTimelineScheduleSingle },
  props: {
    /** 起始日期 */
    startDate: {
      type: Number,
      required: true,
    },
    /** 结束日期 */
    endDate: {
      type: Number,
      required: true,
    },
    /** 时间线上的日程列表 */
    timelineSchedules: {
      type: Array as PropType<RosterTimelineSchedule[]>,
      required: true,
    },
    timeLineHeight: {
      type: Number as PropType<TimeLineHeight>,
      default: 84,
    },
  },
  setup(props) {
    /** 日期范围 */
    const daysRange = computed(() => {
      const days = [props.startDate, props.endDate];

      return days.length === 0
        ? [getDate().getTime(), getDate().getTime()]
        : [Math.min(...days), Math.max(...days)];
    });

    /**
     * 日期范围内含多少天
     * ```
     * 最少7天，最多30天
     * 当前版本限定为7天，由传入值决定
     * ```
     */
    const daysCount = computed(() =>
      Math.min(
        30,
        Math.max(7, Math.trunc((daysRange.value[1] - daysRange.value[0]) / MILLIONSECONDS_OF_DAY)),
      ),
    );

    /** 日期列表 */
    const days = computed(() => {
      const [start] = daysRange.value;
      const len = daysCount.value;

      return new Array(len).fill(0).map((_, index) => {
        const timestamp = start + index * MILLIONSECONDS_OF_DAY;
        const day = getDate(timestamp).getDay();
        return {
          index,
          day,
          dateStr: format(timestamp, `YYYY.mm.dd ${dateStr[(day + 6) % 7]}`),
        };
      });
    });

    // 表头
    const headers = computed(() =>
      ['全天', ...days.value.map(el => el.dateStr)].map((el, index) => {
        const elArr = el.split(' ');
        return {
          title: elArr[0],
          subTitle: elArr[1],
          class: [''],
        };
      }),
    );
    // 单元格
    const cells = computed(() =>
      new Array(25 * daysCount.value)
        .fill(0)
        .map((_, index) => index)
        .map(index => {
          const weekday = days.value[index % 7].day;
          const row = Math.trunc(index / daysCount.value);

          const className = `cell-${dayStr[weekday]}-${row + 1}`;

          return {
            index,
            weekday: weekday + 1,
            column: weekday + 1,
            className,
            row,
            hourStart: getHourStr(row),
            hourEnd: getHourStr(row + 1),
          };
        }),
    );

    const today = computed(() => new Date().getDay());

    const schedules = computed(() =>
      props.timelineSchedules.map(el => {
        const column = Math.trunc((el.start_time - props.startDate) / MILLIONSECONDS_OF_DAY);

        return {
          ...el,
          column,
        };
      }),
    );

    return {
      daysRange,
      daysCount,
      days,
      headers,
      cells,
      today,
      schedules,
    };
  },
  render() {
    /** 普通单元格(背景格子) */
    const cellNodes = this.cells.map(cell => {
      const props = {
        class: ['cell-day cell', cell.className],
        attrs: {
          'data-hour-start': cell.hourStart,
          'data-hour-end': cell.hourEnd,
          'data-day': cell.weekday,
        },
        style: {
          gridRow: `${cell.row + 2} / ${cell.row + 3}`,
          gridColumn: `${cell.column + 1} / ${cell.column + 2}`,
        },
        key: `cell-${cell.index}`,
      };

      return <div {...props}></div>;
    });

    const nodes = this.schedules.map(el => {
      const { id, column, start_time } = el;

      const column_start = column + 2;

      const column_end = column_start + 1;

      const props = {
        props: {
          schedule: el,
          popoverPlacement: column === 6 ? 'left' : 'right',
        },
        attrs: {
          'data-col': column,
          'data-column-start': column_start,
          'data-column-end': column_end,
        },
        style: {
          gridColumnStart: column_start,
          gridColumnEnd: column_end,
        },
        on: {
          click: (item: any) => {
            this.$emit('clickSingleSchedule', item);
          },
        },
        key: `${id}_${start_time}_${Date.now()}`,
      };

      return <tg-timeline-schedule-single {...props} />;
    });
    const timeLineHeight = this.timeLineHeight;

    return (
      <tg-calendar size={timeLineHeight} class="timeline-cal" headers={this.headers}>
        <tg-calendar-timeline
          size={timeLineHeight}
          class="cell"
          props={{ start: this.start }}
          style={{
            gridRowStart: 2,
            gridRowEnd: 27,
            gridColumnStart: 1,
            gridColumnEnd: 2,
          }}
        />
        {cellNodes}
        {nodes}
      </tg-calendar>
    );
  },
});
