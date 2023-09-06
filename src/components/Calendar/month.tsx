/**
 * 月
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-14 15:33:47
 */
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import { getDate, getDaysInMonth, getWeekDateRange } from '@/utils/time';
import { ScheduleGroup } from '@/types/components/calendar';
import TgTimelineSchedule from './timeline.schedule';
import moment from 'moment';

const dayStr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

type ScheduleGroupAny = ScheduleGroup<Record<string, any>>;

export default defineComponent({
  name: 'TgCalendarMonth',
  components: { TgTimelineSchedule },
  props: {
    /** 年 */
    year: {
      type: Number,
      required: true,
    },
    /** 月 */
    month: {
      type: Number,
      required: true,
    },
    /** 日程列表 */
    schedules: {
      type: Array as PropType<ScheduleGroupAny[]>,
      required: true,
    },
  },
  setup(props, ctx) {
    const days = ref(
      dayStr.map((el, index) => {
        return {
          index,
          name: el,
          className: `day-${el}`,
        };
      }),
    );

    const 本月首日 = computed(
      // () => new Date([`${props.year}`, `${props.month + 1}`.padStart(2, '0'), '01'].join('-')),
      () =>
        moment([`${props.year}`, `${props.month + 1}`.padStart(2, '0'), '01'].join('-')).toDate(),
    );

    const 本月天数 = computed(() => getDaysInMonth(props.year, props.month));

    const 上个月所属年份 = computed(() => (props.month === 0 ? props.year - 1 : props.year));
    const 下个月所属年份 = computed(() => (props.month === 11 ? props.year + 1 : props.year));

    const 上月天数 = computed(() => getDaysInMonth(上个月所属年份.value, (props.month + 11) % 12));

    const 上月末填充本月日历列表 = computed(() => {
      const firstDay = 本月首日.value.getDay();

      return firstDay !== 1
        ? new Array(上月天数.value)
            .fill(0)
            .map((_, index) => {
              return {
                year: 上个月所属年份.value,
                month: (props.month + 11) % 12,
                date: index + 1,
                disabled: true,
                schedules: [],
              };
            })
            .slice(firstDay === 0 ? -6 : 1 - firstDay, 上月天数.value)
        : [];
    });

    const 本月日期列表 = computed(() => {
      const 本月列表 = new Array(本月天数.value).fill(0).map((_, index) => {
        return {
          year: props.year,
          month: props.month,
          date: index + 1,
          disabled: false,
          schedules: props.schedules.filter(el => el.date === index + 1),
        };
      });

      const 当前天数 = 上月末填充本月日历列表.value.length + 本月列表.length;

      const 剩余应当填充天数 = Math.ceil(当前天数 / 7) * 7 - 当前天数;

      const 下月初填充本月日历列表 = new Array(剩余应当填充天数).fill(0).map((_, index) => {
        return {
          year: 下个月所属年份.value,
          month: (props.month + 1) % 12,
          date: index + 1,
          disabled: true,
          schedules: [],
        };
      });

      return [...上月末填充本月日历列表.value, ...本月列表, ...下月初填充本月日历列表].map(el => {
        return {
          ...el,
        };
      });
    });

    /** 基准时间戳是否落在当前实际月份(年月) */
    const isThisMonth = computed(
      () => props.year === getDate().getFullYear() && props.month === getDate().getMonth(),
    );

    const week = computed(() =>
      isThisMonth.value
        ? getWeekDateRange().map(el => {
            const year = el.getFullYear();
            const month = el.getMonth();
            const date = el.getDate();

            const index = 本月日期列表.value.findIndex(
              day => !day.disabled && day.year === year && day.month === month && day.date === date,
            );

            return { index, row: Math.trunc(index / 7), column: index % 7 };
          })
        : [],
    );

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
      本月天数,
      上月天数,
      本月日期列表,
      week,
      isThisMonth,
      headers,
    };
  },
  render() {
    const props = {
      class: 'month-cal',
      props: {
        navHide: true,
        headers: this.headers,
      },
    };

    /** 网格节点 */
    const gridCellNodes = this.本月日期列表.map((cell, index) => {
      const props = {
        class: ['cell-day cell'],
        attrs: {
          'data-year': cell.year,
          'data-month': cell.month + 1,
          'data-date': cell.date,
        },
        style: {
          gridColumn: `${(index % 7) + 1} / ${(index % 7) + 2}`,
          gridRowStart: Math.trunc(index / 7) + 2,
          gridRowEnd: Math.trunc(index / 7) + 3,
        },
        key: `cell-${index}`,
      };

      return <div {...props}></div>;
    });

    /** 日程 */
    const dayDataNodes = this.本月日期列表.map((el, index) => {
      const key = [
        `${el.year}`,
        `${el.month + 1}`.padStart(2, '0'),
        `${el.date}`.padStart(2, '0'),
      ].join('-');

      const props = {
        class: [`day-${dayStr[index]}`],
        style: {
          gridColumn: `${(index % 7) + 1} / ${(index % 7) + 2}`,
          gridRowStart: Math.trunc(index / 7) + 2,
          gridRowEnd: Math.trunc(index / 7) + 3,
        },
        key,
      };

      const dayProps = {
        props: {
          schedules: [...el.schedules],
          date: el.date,
          disabled: el.disabled,
        },
        on: {
          click: () => {
            const { year, month, date } = el;
            this.$emit('calendar:day:click', { year, month, date });
          },
          'memo:click': (id: number) => {
            this.$emit('month:memo:click', id);
          },
        },
        key,
      };

      return (
        <tg-calendar-card {...props}>
          <tg-calendar-day {...dayProps}>
            <span slot="empty">暂无排期</span>
          </tg-calendar-day>
        </tg-calendar-card>
      );
    });

    /** 遮罩层节点 */
    const maskNode = this.isThisMonth ? (
      <tg-calendar-mask
        props={{ direction: 'row', row: this.week[0].row + 1 }}
        style={{ gridColumn: '1 / 9' }}
        key="row"
      />
    ) : (
      ''
    );

    return (
      <tg-calendar {...props}>
        {gridCellNodes}
        {dayDataNodes}
        {maskNode}
      </tg-calendar>
    );
  },
});
