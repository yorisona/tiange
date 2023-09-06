/**
 * 日 - 时间线
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-21 12:13:11
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import { KolSchedule, OperatorSchedule } from '@/types/tiange/live';
import { MILLIONSECONDS_OF_HOUR } from '@/const/time';
import { format, getDate } from '@/utils/time';

export default defineComponent({
  name: 'TgDayTimeline',
  props: {
    schedules: {
      type: Object as PropType<{
        kolSchedules: KolSchedule[];
        operatorSchedules: OperatorSchedule[];
      }>,
      required: true,
    },
    timeRange: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  setup(props) {
    /** 起始时间 */
    const start = computed(() => props.timeRange?.[0]);
    /** 结束时间 */
    const end = computed(() => props.timeRange?.[1]);

    /** 是否半点开始 */
    const isStartFrom30 = computed(() => getDate(start.value).getMinutes() === 30);

    /** 是否半点结束 */
    const isEndFrom30 = computed(() => getDate(end.value).getMinutes() === 30);

    const isTimeDurationHasHalfHour = computed(
      () => getDate(start.value).getMinutes() + (getDate(end.value).getMinutes() % 60) === 30,
    );

    /** 时间线起始时间 */
    const timelineStart = computed(() => {
      const date = getDate(start.value);

      return date.getTime() - (date.getMinutes() === 30 ? MILLIONSECONDS_OF_HOUR / 2 : 0);
    });

    /** 时间线结束时间 */
    const timelineEnd = computed(() => {
      const date = getDate(end.value);

      return (
        date.getTime() +
        (date.getMinutes() === 30 ? MILLIONSECONDS_OF_HOUR / 2 : MILLIONSECONDS_OF_HOUR)
      );
    });

    /** 持续时间(向上取整) */
    const duration = computed(() => Math.ceil((end.value - start.value) / MILLIONSECONDS_OF_HOUR));

    const timelineDuration = computed(
      () => Math.ceil(timelineEnd.value - timelineStart.value) / MILLIONSECONDS_OF_HOUR,
    );

    const time_range = computed(() => [start, end].map(el => format(el.value, 'YYYY-mm-dd HH:ii')));

    const time_range2 = computed(() =>
      [timelineStart, timelineEnd].map(el => format(el.value, 'YYYY-mm-dd HH:ii')),
    );

    const hours = computed(() =>
      new Array(timelineDuration.value)
        .fill(0)
        .map((_, index) => timelineStart.value + index * MILLIONSECONDS_OF_HOUR),
    );

    return {
      start,
      end,
      duration,
      timelineStart,
      timelineEnd,
      timelineDuration,
      time_range,
      time_range2,
      hours,
      isStartFrom30,
      isEndFrom30,
      isTimeDurationHasHalfHour,
    };
  },
  render() {
    // const { isTimeDurationHasHalfHour } = this;
    const props = {
      class: ['tg-calendar', 'tg-calendar-day-timeline'],
      style: {
        'grid-template-rows': `repeat(${this.timelineDuration + 1}, 40px)`,
      },
    };

    // 时间线节点
    const timelineNode = h(
      'div',
      {
        class: ['tg-calendar-timeline', 'timeline'],
        style: {
          'grid-template-rows': `repeat(${this.timelineDuration - 1}, 40px)`,
          gridRowStart: 1,
          gridRowEnd: this.timelineDuration + 2,
        },
        attrs: {
          // 添加small属性，用于样式筛选
          size: '40',
        },
      },
      this.hours.map((hour, hourIndex) => {
        const hourStr = format(hour, 'HH:ii');

        return <div class="time" data-hour={hourStr} data-index={hourIndex}></div>;
      }),
    );

    // 普通网格节点
    const gridCells = new Array(this.timelineDuration + 2).fill(0).map((_, index) =>
      h('div', {
        class: 'cell',
        style: {
          gridRowStart: index + 1,
          gridRowEnd: index + 2,
          gridColumnStart: 2,
          gridColumnEnd: 3,
          zIndex: 100,
        },
      }),
    );

    const scheduleNode = h('tg-timeline-schedule', {
      props: {
        schedule: this.schedules,
        single: true,
      },
      style: {
        gridColumnStart: 2,
        gridColumnEnd: 3,
        zIndex: 300,
        paddingBottom: `${
          !this.isStartFrom30 && !this.isEndFrom30 ? 2 : this.isEndFrom30 ? 20 : 2
        }px`,
      },
    });

    return (
      <div {...props}>
        {gridCells}
        {timelineNode}
        {scheduleNode}
      </div>
    );
  },
});
