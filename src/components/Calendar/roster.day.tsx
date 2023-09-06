/**
 * 排班-日 复一日
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-20 09:38:42
 * 赶工期先不追求代码优雅了
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import { getDate, format } from '@/utils/time';
import { MILLIONSECONDS_OF_DAY } from '@/const/time';
import { getHourStr } from './util';
import { OperatorScheduleDetail, OperatorScheduleInQuery } from '@/types/tiange/live';
import { parse } from '@/utils/func';
import moment from 'moment';

const dayStr = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const dateStr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export interface ScheduleInQuery extends OperatorScheduleInQuery {
  live_times: string[];
}

// 场次卡片
const TgRosterDayMemo = (ctx: {
  props: {
    live_times: string[];
    project_name: string;
    studio_name: string;
    key: string;
    click: () => void;
  };
}) => {
  return (
    <div class="memo" key={ctx.props.key} onclick={ctx.props.click}>
      <div class="item-project-name">{ctx.props.project_name ?? '--'}</div>
      <div class="item-names">{ctx.props.studio_name}</div>
      {ctx.props.live_times.map((live_time, index) => (
        // (<div class="item-time">{live_time}</div>)
        <div class="item-time">
          <span></span>
          {index === ctx.props.live_times.length - 1 ? undefined : <span></span>}
          {live_time}
        </div>
      ))}
    </div>
  );
};

const timeStr = (start_time: string, end_time: string) => {
  // return [start_time, end_time].map(time => format(new Date(time), 'HH:ii')).join('~');
  return [start_time, end_time].map(time => format(moment(time).valueOf(), 'HH:ii')).join('~');
};

export default defineComponent({
  name: 'TgRosterDay',
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
    /** 日程列表 */
    schedules: {
      type: Array as PropType<OperatorScheduleDetail[]>,
      required: true,
    },
  },
  setup(props, ctx) {
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
          dateStrSimple: format(timestamp, 'YYYY.mm.dd'),
        };
      });
    });

    // 表头
    const headers = computed(() =>
      ['运助', ...days.value.map(el => el.dateStr)].map((el, index) => {
        const elArr = el.split(' ');
        return {
          title: elArr[0],
          subTitle: elArr[1],
          // class: index === new Date().getDay() ? ['active'] : [],
          class: [],
        };
      }),
    );

    // 单元格
    const cells = computed(() =>
      new Array((props.schedules.length > 0 ? props.schedules.length : 1) * daysCount.value)
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

    const names = computed(() =>
      props.schedules.length > 0 ? props.schedules.map(el => el.username) : [''],
    );

    const dataList = computed(() =>
      props.schedules.map(schedule => {
        const { operator_schedule_list, ...rest } = schedule;

        return {
          ...rest,
          operator_schedule_list: days.value.map(day =>
            operator_schedule_list.filter(el => {
              // const dateStr = format(new Date(el.start_time).getTime(), 'YYYY.mm.dd');
              // const dateStr = format(moment(el.start_time).valueOf(), 'YYYY.mm.dd');
              const dateStr = moment(el.start_time).format('YYYY.MM.DD');
              return day.dateStrSimple === dateStr;
            }),
          ),
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
      names,
      dataList,
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

    const nameNodes = this.names.map((name, index) => {
      const props = {
        class: ['cell timeline-cell'],
        style: {
          gridRowStart: index + 2,
          gridRowEnd: index + 3,
          gridColumnStart: 1,
          gridColumnEnd: 2,
        },
      };
      return <div {...props}>{name}</div>;
    });

    const dayDataNodes = this.dataList.map((el, rowIndex) => {
      return el.operator_schedule_list
        .map((schedules, columnIndex) => {
          const props = {
            class: 'tg-calendar-day-card',
            style: {
              gridRowStart: rowIndex + 2,
              gridRowEnd: rowIndex + 3,
              gridColumnStart: columnIndex + 2,
              gridColumnEnd: columnIndex + 3,
            },
          };
          // let commonSchedule: ScheduleInQuery | undefined = undefined;
          const commonScheduleList: ScheduleInQuery[] = [];
          schedules
            .sort(
              (firstEl, secondEl) =>
                // new Date(firstEl.start_time).getTime() - new Date(secondEl.start_time).getTime(),
                moment(firstEl.start_time).valueOf() - moment(secondEl.start_time).valueOf(),
            )
            .forEach(schedule => {
              const { shop_live_id } = schedule;

              let commonSchedule = commonScheduleList.filter(
                commonScheduleItem => commonScheduleItem.shop_live_id === shop_live_id,
              )[0];
              if (!commonSchedule) {
                commonSchedule = parse(schedule) as ScheduleInQuery;
                commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
                commonScheduleList.push(commonSchedule);
              } else {
                if (shop_live_id === commonSchedule.shop_live_id) {
                  commonSchedule.live_times.push(timeStr(schedule.start_time, schedule.end_time));
                } else {
                  commonSchedule = parse(schedule) as ScheduleInQuery;
                  commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
                  commonScheduleList.push(commonSchedule);
                }
              }
            });
          // .map(schedule => {
          //   const { start_time, shop_live_id } = schedule;

          //   if (!commonSchedule) {
          //     commonSchedule = parse(schedule) as ScheduleInQuery;
          //     commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
          //     return commonSchedule;
          //   } else {
          //     const startDate = start_time.split(' ')[0];
          //     const commonStartDate = commonSchedule.start_time.split(' ')[0];
          //     if (startDate === commonStartDate && shop_live_id === commonSchedule.shop_live_id) {
          //       commonSchedule.live_times.push(timeStr(schedule.start_time, schedule.end_time));
          //       return undefined;
          //     } else {
          //       commonSchedule = parse(schedule) as ScheduleInQuery;
          //       commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
          //       return commonSchedule;
          //     }
          //   }
          // });

          const schedulesNodes = h(
            'div',
            { class: 'tg-calendar-day-card-inner' },
            commonScheduleList.map(schedule => {
              if (schedule) {
                const { start_time, live_times, studio_name: name, project_name } = schedule;
                return h(
                  'el-popover',
                  {
                    props: {
                      placement: 'right',
                      width: 168,
                      trigger: 'hover',
                      popperClass: 'tg-calendar-day-popover',
                      closeDelay: 0,
                      // offset: 0,
                    },
                    scopedSlots: {
                      reference: () => {
                        return h('div', [
                          <TgRosterDayMemo
                            props={{
                              live_times,
                              project_name,
                              studio_name: name,
                              key: start_time,
                              click: () => {
                                this.$emit('clickItem', schedule);
                              },
                            }}
                          />,
                        ]);
                      },
                    },
                  },
                  [
                    <div class="popover-content">
                      <div class="popover-header">
                        <div>{project_name ?? '--'}</div>
                        <div>{`直播间：${name ? name : '--'}`}</div>
                      </div>
                      <div class="popover-times">
                        {live_times.map((item_live_time, timeIndex) => (
                          // (<div class="item-time">{live_time}</div>)
                          <div class="item-time">
                            <span></span>
                            {timeIndex === live_times.length - 1 ? undefined : <span></span>}
                            {item_live_time}
                          </div>
                        ))}
                      </div>
                    </div>,
                  ],
                );
                // return <TgRosterDayMemo props={{ live_times, project_name, studio_name: name, key: start_time }} />;
              } else {
                return undefined;
              }
            }),
          );

          // const schedulesNodes = h(
          //   'div',
          //   { class: 'tg-calendar-day-card-inner' },
          //   schedules
          //     .sort(
          //       (firstEl, secondEl) =>
          //         new Date(firstEl.start_time).getTime() - new Date(secondEl.start_time).getTime(),
          //     )
          //     .map(schedule => {
          //       const { start_time, end_time, studio_name: name } = schedule;

          //       const time = [start_time, end_time]
          //         .map(time => format(new Date(time), 'HH:ii'))
          //         .join(' - ');

          //       return <TgRosterDayMemo props={{ time, name, key: time }} />;
          //     }),
          // );

          const emptyNode = <div class="tg-calendar-day-card-empty">暂无排期</div>;

          return <div {...props}>{schedules.length > 0 ? schedulesNodes : emptyNode}</div>;
        })
        .flat();
    });

    return (
      <tg-calendar class="day-cal" headers={this.headers}>
        {cellNodes}
        {nameNodes}
        {dayDataNodes}
      </tg-calendar>
    );
  },
});
