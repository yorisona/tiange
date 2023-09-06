/**
 * 时间线内排期组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 00:50:06
 */
import { VNode } from 'vue';
import { computed, defineComponent, h, PropType, ref } from '@vue/composition-api';
import { ScheduleInMap, TimelineSchedule, UserTimelineSchedule } from '@/types/components/calendar';
import {
  MILLIONSECONDS_OF_DAY,
  MILLIONSECONDS_OF_HOUR,
  MILLIONSECONDS_OF_MINUTE,
} from '@/const/time';
import { isStyleFallback as isStyleFallbackFn } from '@/use/browser';
import { intervalFilter, isCoverAll } from '@/utils/interval';
import { PointInterval } from '@/types/base/advanced';
import moment from 'moment';

const format = (date: Date | number, fmt: string) => moment(date).format(fmt);

type TimelineScheduleAny = TimelineSchedule<Record<string, any>>;

const isStyleFallback = isStyleFallbackFn();

const getHours = (timestamp: string | number) =>
  ((moment(timestamp).valueOf() - new Date().getTimezoneOffset() * MILLIONSECONDS_OF_MINUTE) %
    MILLIONSECONDS_OF_DAY) /
  MILLIONSECONDS_OF_HOUR;

// 排期区块按时间跨度转高度表(含整点和半点)
const heights = [
  20, 40, 61, 81, 102, 122, 143, 163, 184, 204, 225, 245, 266, 286, 307, 327, 348, 368, 389, 409,
  430, 450, 471, 491, 512, 532, 553, 573, 594, 614, 635, 655, 676, 696, 717, 737, 758, 778, 799,
  819, 840, 860, 881, 901, 922, 942, 963, 983, 1004, 1024, 1045, 1065, 1086, 1106, 1127, 1147, 1168,
  1188, 1209, 1229, 1250, 1270, 1291, 1311, 1332, 1352, 1373, 1393, 1414, 1434, 1455, 1475, 1496,
  1516, 1537, 1557, 1578, 1598, 1619, 1639, 1660, 1680, 1701, 1721, 1742, 1762, 1783, 1803, 1824,
  1844, 1865, 1885, 1906, 1926, 1947, 1967, 1988, 2008, 2029, 2049,
];

/**
 * 将排期数据按时间段合并
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-13 10:12:03
 */
const groupByTime = (list: UserTimelineSchedule[]) => {
  const map = new Map<string, ScheduleInMap>();

  list.forEach(el => {
    const { start_time, duration, name, end_time } = el;

    const oldEl = map.get(start_time);

    if (oldEl === undefined) {
      map.set(start_time, {
        start_time,
        duration,
        name: [name],
        end_time,
      });
    } else {
      map.delete(start_time);
      map.set(start_time, {
        ...oldEl,
        name: [...oldEl.name, name],
      });
    }
  });

  return Array.from(map.values());
};

// 气泡
const TgTimelineSchedulePopover = defineComponent({
  props: {
    type: { type: String },
    time: { type: String },
    name: { type: Array as PropType<string[]> },
    styles: { type: Object as PropType<StyleSheet> },
  },
  render() {
    const { type, time, name } = this;

    return (
      <div class="tg-timeline-schedule-popover" style={this.styles}>
        <div class="tg-timeline-schedule-popover-arrow"></div>
        <div>{time}</div>
        <div>{type}</div>
        <div>{name?.join('、')}</div>
      </div>
    );
  },
});

/**  */
interface ScheduleInMapEx extends ScheduleInMap {
  isFirst: boolean;
  isLast: boolean;
  empty?: boolean;
}

/**
 * 人员排期的函数式组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-14 15:13:08
 */
const TgTimelineItem = defineComponent({
  props: {
    type: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    name: {
      type: Array as PropType<string[]>,
      required: true,
    },
    height: {
      type: Number,
    },
    isFirst: {
      type: Boolean,
    },
    isLast: {
      type: Boolean,
    },
    radiusPosition: {
      type: String as PropType<'left' | 'right'>,
      required: true,
    },
    empty: {
      type: Boolean,
    },
  },
  setup(props) {
    const { radiusPosition } = props;

    const topRadiusStyle = computed(() => ({
      [`border-top-${radiusPosition}-radius`]: '4px',
    }));

    const bottomRadiusStyle = computed(() => ({
      [`border-bottom-${radiusPosition}-radius`]: '4px',
    }));

    return { topRadiusStyle, bottomRadiusStyle };
  },
  render() {
    const { time, name, height, isFirst, isLast, empty } = this;

    const nameNodes: VNode[] = [];

    name.forEach((el, elIndex) => {
      // * flex + gap 在低版本 Webkit/Blink 内核下的降级处理
      if (isStyleFallback && elIndex > 0) {
        nameNodes.push(<span style={{ marginLeft: '10px' }}></span>);
      }

      nameNodes.push(
        h(
          'span',
          {
            class: 'item-name',
            style: isStyleFallback ? { marginBottom: '4px' } : {},
          },
          [el ?? '待排班'],
        ),
      );
    });

    const props = {
      class: ['item'],
      style: {
        height: height === 0 ? '100%' : `${height}px`,
        ...(isFirst ? this.topRadiusStyle : {}),
        ...(isLast ? this.bottomRadiusStyle : {}),
      },
    };

    return (
      <div {...props}>
        <div class="item-time">{time}</div>
        <div class={['item-names', empty ? 'empty' : '']}>{nameNodes}</div>
      </div>
    );
  },
});

// 创建节点
const makeNodes = (
  schedule: ScheduleInMapEx,
  radiusPosition: 'left' | 'right' = 'left',
  onMouseenter: (
    event: MouseEvent,
    time: string,
    name: string[],
    type: string,
    top: number,
  ) => void,
  onMouseleave: (event: MouseEvent) => void,
) => {
  const { start_time, end_time, name, duration, isFirst, isLast } = schedule;

  /** 时间段 */
  const [startDate, endDate] = [start_time, end_time].map(el => moment(el).toDate());
  const time = (
    format(startDate, 'YYYY-MM-DD') === format(endDate, 'YYYY-MM-DD')
      ? [format(startDate, 'HH:mm'), format(endDate, 'HH:mm')]
      : [format(startDate, 'HH:mm'), format(endDate, '次日 HH:mm')]
  ).join(' ~ ');

  const minStart = startDate.getMinutes();
  const minEnd = endDate.getMinutes();

  const isSingle = isFirst && isLast;
  // 是否从半点开始
  // 半点开始的高度需要再减1px
  const isStartFrom30 = minStart === 30;
  const isEndAt30 = minEnd === 30;

  const isDurationHasHalfHour = (minStart + minEnd) % 60 !== 0;

  const 半点开始的第一个排班额外修正高度 = isDurationHasHalfHour && isFirst ? 0 : 0;

  const heightMain = heights[duration * 2 - 1];

  /** 当前时间段占据高度 */
  const height = isSingle
    ? 0
    : !isFirst && !isLast
    ? heightMain
    : heightMain -
      (isFirst && isStartFrom30 ? 2 : 0) -
      (isFirst && !isStartFrom30 ? 3 : 0) -
      (isLast && !isEndAt30 ? 3 : 0) -
      (isLast && isEndAt30 ? 1 : 0) -
      (isFirst && isDurationHasHalfHour ? 1 : 0) -
      半点开始的第一个排班额外修正高度;

  const nameNodes: VNode[] = [];

  name.forEach((el, elIndex) => {
    // * flex + gap 在低版本 Webkit/Blink 内核下的降级处理
    if (isStyleFallback && elIndex > 0) {
      nameNodes.push(<span style={{ marginLeft: '10px' }}></span>);
    }

    nameNodes.push(
      h(
        'span',
        {
          class: 'item-name',
          style: isStyleFallback ? { marginBottom: '4px' } : {},
        },
        [el ?? '待排班'],
      ),
    );
  });

  /** 是否是无排班 */
  const isEmpty = schedule.empty === true || name.includes(null);

  return (
    <TgTimelineItem
      {...{
        attrs: {
          type: radiusPosition === 'left' ? '运营助理' : '主播',
          time,
          name,
          height: height,
          isFirst: isFirst,
          isLast: isLast,
          radiusPosition,
          empty: isEmpty,
        },
        nativeOn: {
          mouseenter: (event: MouseEvent) => {
            const top = getHours(start_time);

            onMouseenter(
              event,
              time,
              name.map(el => el ?? '待排班'),
              radiusPosition,
              top,
            );
          },
          mouseleave: (event: MouseEvent) => {
            onMouseleave(event);
          },
        },
      }}
    />
  );
};

export default defineComponent({
  name: 'TgTimelineSchedule',
  props: {
    schedule: {
      type: Object as PropType<TimelineScheduleAny>,
      required: true,
    },
    /** single模式仅用于单场次显示排班 */
    single: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const start = computed(() => moment(props.schedule.start_time).toDate());
    const end = computed(() => moment(props.schedule.end_time).toDate());
    const day = computed(() => start.value.getDay());
    const hour_start = computed(() => start.value.getHours());
    const min_start = computed(() => start.value.getMinutes());
    const hour_end = computed(() => end.value.getHours());
    const min_end = computed(() => end.value.getMinutes());

    /** 结束时间点，若跨天则会超过24 */
    const row_end = computed(() => {
      if (moment(start.value).toDate().getDate() !== moment(end.value).toDate().getDate()) {
        return hour_end.value + 24;
      }

      return hour_end.value;
    });

    /** 开始时间是否为半点 */
    const isStartTimeHalfHour = computed(() => min_start.value === 30);

    /** 结束时间是否为半点 */
    const isEndTimeHalfHour = computed(() => min_end.value === 30);

    /** 结束时间是否为00:00 */
    const isEndTime0000 = computed(() => hour_end.value === 0 && min_end.value === 0);

    const paddingTop = computed(
      () => Math.trunc((min_start.value / 60) * 40) + (isStartTimeHalfHour.value ? 1 : 2),
    );

    const paddingBottom = computed(
      () =>
        (isEndTime0000.value && !props.single ? 20 : 0) +
        (isEndTimeHalfHour.value ? 20 : 2) +
        (hour_end.value === 23 && min_end.value === 30 ? 20 : 0),
    );

    /** 运营助理排期 */
    const operatorSchedules = computed(() => groupByTime(props.schedule.operator));
    /** 主播排期 */
    const kolSchedules = computed(() => groupByTime(props.schedule.kol));

    /** 整体区间 */
    const targetInterval = computed<PointInterval>(() => [
      moment(props.schedule.start_time).valueOf(),
      moment(props.schedule.end_time).valueOf(),
    ]);

    /** op 区间集合 */
    const opIntervals = computed<PointInterval[]>(() =>
      operatorSchedules.value.map(el => [
        moment(el.start_time).valueOf(),
        moment(el.end_time).valueOf(),
      ]),
    );

    /** kol 区间集合 */
    const kolIntervals = computed<PointInterval[]>(() =>
      kolSchedules.value.map(el => [
        moment(el.start_time).valueOf(),
        moment(el.end_time).valueOf(),
      ]),
    );

    /** op 是否全覆盖*/
    const isOpCoverAll = computed(() => isCoverAll(targetInterval.value, opIntervals.value));
    /** kol 是否全覆盖*/
    const isKolCoverAll = computed(() => isCoverAll(targetInterval.value, kolIntervals.value));

    /** op 未覆盖区间集合 */
    const opLeftIntervals = computed(() =>
      intervalFilter(targetInterval.value, opIntervals.value).map(el => {
        const [start, end] = el;
        return {
          start_time: format(start, 'YYYY-MM-DD HH:mm'),
          end_time: format(end, 'YYYY-MM-DD HH:mm'),
          name: ['待排班'],
          duration: (end - start) / MILLIONSECONDS_OF_HOUR,
          empty: true,
        };
      }),
    );

    /** kol 未覆盖区间集合 */
    const kolLeftIntervals = computed(() =>
      intervalFilter(targetInterval.value, kolIntervals.value).map(el => {
        const [start, end] = el;
        return {
          start_time: format(start, 'YYYY-MM-DD HH:mm'),
          end_time: format(end, 'YYYY-MM-DD HH:mm'),
          name: ['待排班'],
          duration: (end - start) / MILLIONSECONDS_OF_HOUR,
          empty: true,
        };
      }),
    );

    /** op */
    const joinedOpIntervals = computed(() =>
      isOpCoverAll.value
        ? operatorSchedules.value
        : [...operatorSchedules.value, ...opLeftIntervals.value].sort(
            (acc, cur) => moment(acc.start_time).valueOf() - moment(cur.start_time).valueOf(),
          ),
    );

    /** kol */
    const joinedKolIntervals = computed(() =>
      isKolCoverAll.value
        ? kolSchedules.value
        : [...kolSchedules.value, ...kolLeftIntervals.value].sort(
            (acc, cur) => moment(acc.start_time).valueOf() - moment(cur.start_time).valueOf(),
          ),
    );

    /** 气泡是否显示 */
    const popoverVisible = ref(false);

    /** 气泡数据 */
    const popoverSchedule = ref<{
      time: string;
      name: string[];
      type: string;
      typeStr: string;
    }>({
      time: '',
      name: [],
      type: '',
      typeStr: '',
    });

    /** 触发气泡的dom元素大小位置数据 */
    const popoverRect = ref<{
      x: number;
      y: number;
      width: number;
      height: number;
      top: number;
    }>({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
    });

    /** 鼠标经过 - 设置数据并显示气泡 */
    const onMouseenter = (
      event: MouseEvent,
      time: string,
      name: string[],
      type: string,
      top: number,
    ) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      popoverSchedule.value.time = time;
      popoverSchedule.value.name = name;
      popoverSchedule.value.type = type;
      popoverSchedule.value.typeStr = type === 'left' ? '运营助理' : '主播';

      const { x, y, width, height } = rect;
      popoverRect.value = { x, y, width, height, top };

      popoverVisible.value = true;
    };

    /** 鼠标离开 - 清除数据并隐藏气泡 */
    const onMouseleave = (event: MouseEvent) => {
      popoverSchedule.value.time = '';
      popoverSchedule.value.name = [];
      popoverSchedule.value.type = '';
      popoverSchedule.value.typeStr = '';

      popoverVisible.value = false;
    };

    /** 气泡样式 */
    const popoverStyle = computed(() => {
      const isLeft = popoverSchedule.value.type === 'left';

      const pixels = props.single
        ? Math.ceil(popoverRect.value.width)
        : Math.ceil(popoverRect.value.width * (isLeft ? 1 : 2)) ?? 0;

      const top = popoverRect.value.top - getHours(props.schedule.start_time);

      const leftOffset =
        day.value === 0
          ? 25 - Math.ceil(popoverRect.value.width * (isLeft ? 2 : 1)) ?? 0
          : pixels + 10;

      return {
        opactiy: popoverVisible.value ? 1 : 0,
        ...(isEndTime0000.value
          ? { bottom: '22px' }
          : { top: `${top * 40 + (top === 0 ? 2 : 0)}px` }),
        ...(props.single
          ? isLeft
            ? { left: `${pixels + 10}px` }
            : { right: `${pixels + 10}px` }
          : { left: `${leftOffset}px` }),
      };
    });

    return {
      day,
      hour_start,
      hour_end,
      row_end,
      isEndTime0000,
      isStartTimeHalfHour,
      isEndTimeHalfHour,
      paddingTop,
      paddingBottom,
      operatorSchedules,
      kolSchedules,
      joinedOpIntervals,
      joinedKolIntervals,
      opLeftIntervals,
      kolLeftIntervals,
      isOpCoverAll,
      isKolCoverAll,
      popoverVisible,
      popoverSchedule,
      onMouseenter,
      onMouseleave,
      popoverRect,
      popoverStyle,
    };
  },
  render() {
    const {
      day,
      hour_start,
      hour_end,
      isEndTimeHalfHour,
      row_end,
      paddingTop,
      paddingBottom,
      isEndTime0000,
    } = this;

    const props = {
      class: ['tg-calendar-timeline-card-mixed'],
      attrs: {
        'data-hour-start': hour_start,
        'data-hour-end': isEndTime0000 ? 24 : hour_end,
        'data-day': day,
      },
      style: {
        gridColumnStart: day === 0 ? 8 : day + 1,
        gridColumnEnd: day === 0 ? 9 : day + 2,
        gridRowStart: this.single ? 2 : hour_start + 2,
        gridRowEnd:
          (isEndTime0000 ? 26 : row_end + 2) +
          (this.single ? 0 - hour_start : 0) +
          (isEndTimeHalfHour ? 1 : 0),
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        zIndex: this.popoverVisible ? 500 : 400,
      },
    };

    const innerProps = {
      class: ['tg-calendar-timeline-card-mixed-inner'],
      style: 'overflow: hidden;',
    };

    /** 运营排期节点 */
    const operatorNodes = this.joinedOpIntervals
      .map((op, index) => {
        /** 当前排期持续时间(无相关字段需要计算) */
        const duration =
          (moment(op.end_time).valueOf() - moment(op.start_time).valueOf()) /
          MILLIONSECONDS_OF_HOUR;

        /** 当前是否第一个节点 */
        const isFirst = index === 0;
        /** 当前是否最后一个节点 */
        const isLast = index === this.joinedOpIntervals.length - 1;

        return { ...op, duration, isFirst, isLast };
      })
      .map(el => makeNodes(el, 'left', this.onMouseenter, this.onMouseleave));

    /** 主播排期节点 */
    const kolNodes = this.joinedKolIntervals
      .map((kol, index) => {
        /** 当前是否第一个节点 */
        const isFirst = index === 0;
        /** 当前是否最后一个节点 */
        const isLast = index === this.joinedKolIntervals.length - 1;

        return { ...kol, isFirst, isLast };
      })
      .map(el => makeNodes(el, 'right', this.onMouseenter, this.onMouseleave));

    const popoverProps = {
      class: [
        this.single
          ? `tg-timeline-schedule-popover-${
              this.popoverSchedule.type === 'left' ? 'right' : 'left'
            }`
          : `tg-timeline-schedule-popover-${this.day === 0 ? 'left' : 'right'}`,
      ],
      attrs: {
        time: this.popoverSchedule.time,
        name: this.popoverSchedule.name,
        type: this.popoverSchedule.typeStr,
        styles: { ...this.popoverStyle },
      },
    };

    return (
      <div {...props}>
        <div {...innerProps}>
          <div class="operator">{operatorNodes}</div>
          <div class="kol">{kolNodes}</div>
        </div>
        <TgTimelineSchedulePopover {...popoverProps} />
      </div>
    );
  },
});
