/**
 * 日历 - 日
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 13:05:10
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import { DaySchedule } from '@/types/components/calendar';
import { getDate } from '@/utils/time';

export default defineComponent({
  name: 'TgCalendarDay',
  props: {
    /** 日 */
    date: {
      type: Number,
      required: true,
    },
    /** 安排列表 */
    schedules: {
      type: Array as PropType<DaySchedule[]>,
      required: true,
    },
    /** 禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    /** 当天是否无安排 */
    const isEmpty = computed(() => props.schedules.length === 0);

    /** 是否为当天 */
    const isToday = computed(() => getDate().getDate() === props.date);

    return { isEmpty, isToday };
  },
  render() {
    const addBtnProps = {
      on: {
        click: () => {
          this.$emit('click');
        },
      },
    };

    /** 无安排空节点 */
    const emptyNode = this.isEmpty ? (
      <div class="tg-calendar-day-empty">{this.$slots.empty}</div>
    ) : (
      ''
    );

    /** 安排(显示用) */
    const scheduleNodes = this.schedules.map(schedule =>
      h(
        'tg-calendar-memo',
        {
          props: { color: schedule.color },
          nativeOn: {
            click: () => {
              this.$emit('memo:click', schedule.id);
            },
          },
        },
        [
          h('span', { slot: 'title' }, [schedule.title]),
          h('span', { slot: 'content' }, [schedule.content]),
        ],
      ),
    );

    // 顶层样式类
    const dayClass = [
      'tg-calendar-day',
      {
        disabled: this.disabled,
        active: this.isToday && !this.disabled,
      },
    ];

    return (
      <div class={dayClass}>
        <div class="tg-calendar-day-hd">
          <span class="tg-calendar-day-hd-title">{this.date}</span>
          {this.disabled ? (
            ''
          ) : (
            <div class="add-btn" {...addBtnProps}>
              <tg-icon name="ico-add-filled" />
            </div>
          )}
        </div>
        {this.disabled ? '' : <div class="tg-calendar-day-bd">{scheduleNodes}</div>}
        {this.disabled ? '' : emptyNode}
      </div>
    );
  },
});
