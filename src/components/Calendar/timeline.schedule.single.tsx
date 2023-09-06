/**
 * 时间线内排期组件 - 单一排期版本
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-19 13:37:35
 */
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import { RosterTimelineSchedule } from '@/types/components/calendar';
import { format } from '@/utils/time';
import moment from 'moment';

export default defineComponent({
  name: 'TgTimelineSceduleSingle',
  props: {
    schedule: {
      type: Object as PropType<RosterTimelineSchedule>,
      required: true,
    },
    /** 气泡位置 */
    popoverPlacement: {
      type: String as PropType<'left' | 'right'>,
      default: 'right',
    },
  },
  setup(props, ctx) {
    // 创建节点
    const { start_time, end_time, name, content } = props.schedule;
    // const start = computed(() => new Date(props.schedule.start_time));
    // const end = computed(() => new Date(props.schedule.end_time));
    const start = computed(() => moment(props.schedule.start_time).toDate());
    const end = computed(() => moment(props.schedule.end_time).toDate());

    const min_start = computed(() => start.value.getMinutes());
    const min_end = computed(() => end.value.getMinutes());
    /** 时间段 */
    const time = computed(() => {
      // const [startDate, endDate] = [start_time, end_time].map(el => new Date(el));
      const [startDate, endDate] = [start_time, end_time].map(el => moment(el).toDate());
      return (
        format(startDate, 'YYYY-mm-dd') === format(endDate, 'YYYY-mm-dd')
          ? [format(startDate, 'HH:ii'), format(endDate, 'HH:ii')]
          : [format(startDate, 'HH:ii'), format(endDate, '次日HH:ii')]
      ).join('~');
    });

    /** 开始时间是否为半点 */
    const isStartTimeHalfHour = computed(() => min_start.value === 30);

    /** 结束时间是否为半点 */
    const isEndTimeHalfHour = computed(() => min_end.value === 30);

    /** 气泡是否显示 */
    const popoverVisible = ref(false);

    const style = computed(() => {
      const day = start.value.getDay();
      const start_hour = start.value.getHours();
      const hour_end = end.value.getHours();
      // const min_start = start.value.getMinutes();
      const min_end = end.value.getMinutes();

      /** 结束时间是否为00:00 */
      const isEndTime0000 = hour_end === 0 && min_end === 0;

      /** 是否半点 */
      const isEndTime30 = min_end === 30;

      const paddingTop = isStartTimeHalfHour.value ? 42 : 0;
      const paddingBottom = (isEndTimeHalfHour.value ? 50 : 8) + (isEndTime0000 ? 0 : 0);

      return {
        gridColumnStart: day + 1,
        gridColumnEnd: day + 2,
        gridRowStart: start_hour + 2,
        gridRowEnd: hour_end === 0 && !isEndTime30 ? 26 : hour_end + 2 + (isEndTime30 ? 1 : 0),
        marginTop: `${paddingTop}px`,
        marginBottom: `${paddingBottom}px`,
        zIndex: popoverVisible.value ? 500 : 400,
      };
    });
    return { time, name, content, style, popoverVisible, isStartTimeHalfHour, isEndTimeHalfHour };
  },
  render() {
    const props = {
      class: 'tg-calendar-timeline-card',
      on: {
        mouseenter: () => {
          this.popoverVisible = true;
        },
        mouseleave: () => {
          this.popoverVisible = false;
        },
      },
      style: this.style,
      attrs: this.$attrs['size'],
    };

    const itemNamesStyle = {
      style: {
        display: this.name ? undefined : 'none',
      },
    };

    const popoverNode = (
      <div
        class={[
          'tg-timeline-schedule-popover',
          `tg-timeline-schedule-popover-${this.popoverPlacement}`,
        ]}
      >
        <div class="tg-timeline-schedule-popover-arrow"></div>
        <div class="popover-row">
          <span class="popover-label">直播时间：</span>
          <span class="popover-value">{this.time}</span>
        </div>
        <div {...itemNamesStyle} class="popover-row">
          <span class="popover-label">直播间：</span>
          <span class="popover-value">{this.name}</span>
        </div>
        <div class="popover-row">
          <span class="popover-label">项目名称：</span>
          <span class="popover-value" n>
            {this.content}
          </span>
        </div>
      </div>
    );

    const itemContentStyle = {
      style: {
        marginTop: this.name ? undefined : '2px',
      },
    };

    return (
      <div {...props}>
        <div
          onclick={() => {
            this.$emit('click', this.$props.schedule);
          }}
          class="tg-calendar-timeline-card-inner"
        >
          <div class="item-time">{this.time}</div>
          <div {...itemNamesStyle} class={['item-names']}>
            <span class="item-name">{this.name}</span>
          </div>
          <div {...itemContentStyle} class="item-content">
            <span>{this.content}</span>
          </div>
        </div>
        {popoverNode}
      </div>
    );
  },
});
