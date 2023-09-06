/**
 * 时间线
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 11:42:48
 */
import { computed, defineComponent } from '@vue/composition-api';
import { getHourStr } from './util';

export default defineComponent({
  name: 'TgCalendarTimeline',
  props: {
    /** 起始时间 */
    start: {
      type: Number,
      default: 1,
    },
    /** 结束时间 */
    end: {
      type: Number,
      default: 24,
    },
  },
  setup(props) {
    /** 时间点列表(整点) */
    const hours = computed(() =>
      new Array(props.end - props.start + 1)
        .fill(0)
        .map((_, index) => index + props.start)
        .map(el => ({
          index: el,
          hour: getHourStr(el % 24),
          prefix: el === 24 ? '次日' : '',
        })),
    );

    return { hours };
  },
  render() {
    const timelineNode = this.hours.map(hour => (
      <div
        class="time"
        key={`hour-${hour.index}`}
        data-prefix={hour.prefix}
        data-hour={hour.hour}
      ></div>
    ));

    return <div class="tg-calendar-timeline timeline">{timelineNode}</div>;
  },
});
