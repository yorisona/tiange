// /**
//  * 店铺代播 - 项目管理 - 项目详情 - 直播排期
//  * @author  Jerry <jerry.hz.china@gmail.com>
//  * @since   2020-12-26 15:45:01
//  */
// import {
//   computed,
//   defineComponent,
//   onBeforeMount,
//   provide,
//   inject,
//   ref,
//   Ref,
// } from '@vue/composition-api';
// import { useJump } from '../use/jump';
// import TgBtnCapsule from '@/components/Button/capsule';
// import TgTabCalendarWeek from './calendar.week.vue';
// import TgTabCalendarMonth from './calendar.month.vue';
// import { MILLIONSECONDS_OF_DAY } from '@/const/time';
// import liveDisplayAdd from '@/modules/live/display/dialog/live.display.add.vue';
// import { LiveProject } from '@/types/tiange/live.project';
// import { LiveDisplay } from '@/types/tiange/live';
// import { RouterNameProjectManage } from '@/const/router';
// import { PropType } from '@vue/composition-api';

// import {
//   format,
//   getDate,
//   getDayOfNextMonth,
//   getDayOfPrevMonth,
//   getWeekDateRange,
// } from '@/utils/time';

// export default defineComponent({
//   name: 'TgLiveProjectDetailTabCalendar',
//   props: {
//     type: {
//       type: String as PropType<'month' | 'week'>,
//       default: 'week',
//     },
//   },
//   components: { TgBtnCapsule, TgTabCalendarWeek, TgTabCalendarMonth, liveDisplayAdd },
//   setup(props, ctx) {
//     const project =
//       inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

//     const jumpLogic = useJump(props, ctx);

//     const calendar = ref<string>(props.type);

//     const showLiveDisplay = ref<boolean>(false);
//     const liveDisplay = ref<Partial<LiveDisplay> | undefined>(undefined);

//     const CalenderWeekRef = ref<{ reload: () => void } | undefined>(undefined);
//     const CalenderMonthRef = ref<{ reload: () => void } | undefined>(undefined);

//     /**
//      * 切换 月/周 视图
//      * @author  Jerry <jerry.hz.china@gmail.com>
//      * @since   2020-12-26 15:54:11
//      */
//     const toggleCalendar = (_calendar: 'month' | 'week') => {
//       if (calendar.value === _calendar) {
//         return;
//       }

//       calendar.value = _calendar;

//       jumpLogic.replace({ ...ctx.root.$route.params, calendar: _calendar });
//     };

//     const isMonth = computed(() => calendar.value === 'month');
//     const isWeek = computed(() => calendar.value === 'week');

//     const roles = ref([
//       {
//         name: '运营助理',
//         color: '#ffcdb3',
//       },
//       {
//         name: '主播',
//         color: '#b6cbf2',
//       },
//     ]);

//     /** 基准时间戳(默认取当天) */
//     const baseTime = ref<number>(Date.now());

//     /** 根据基准时间戳获取该周第一天和最后一天 YYYY-mm-dd */
//     const weekStr = computed(() => {
//       const week = getWeekDateRange(baseTime.value);

//       const [start, end] = week;

//       if (start.getFullYear() === end.getFullYear()) {
//         return [format(start, 'YYYY.mm.dd'), format(end, 'mm.dd')].join(' ~ ');
//       } else {
//         return [format(start, 'YYYY.mm.dd'), format(end, 'YYYY.mm.dd')].join(' ~ ');
//       }
//     });

//     const onCapsuleClick = (btn: 'left' | 'right') => {
//       if (btn === 'left') {
//         toggleCalendar('week');
//         baseTime.value = Date.now();
//         ctx.emit('update:type', 'week');
//       } else {
//         toggleCalendar('month');
//         ctx.emit('update:type', 'month');
//       }
//     };

//     /**
//      * 根据基准时间戳获取月份信息
//      * @author  Jerry <jerry.hz.china@gmail.com>
//      * @since   2021-01-14 15:29:34
//      */
//     const monthStr = computed(() => format(getDate(baseTime.value), 'YYYY年mm月'));

//     const calendarPageUp = () => {
//       if (isMonth.value) {
//         baseTime.value = getDayOfPrevMonth(baseTime.value).getTime();
//       } else if (isWeek.value) {
//         baseTime.value -= MILLIONSECONDS_OF_DAY * 7;
//       } else {
//         // do nth
//       }
//     };

//     const calendarPageDown = () => {
//       if (isMonth.value) {
//         baseTime.value = getDayOfNextMonth(baseTime.value).getTime();
//       } else if (isWeek.value) {
//         baseTime.value += MILLIONSECONDS_OF_DAY * 7;
//       } else {
//         // do nth
//       }
//     };

//     // 新增场次 关闭回调
//     const liveDisplayClosed = () => {
//       showLiveDisplay.value = false;
//       liveDisplay.value = undefined;
//     };

//     // 新增场次 保存成功回调
//     const liveDisplaySaveSucceed = () => {
//       showLiveDisplay.value = false;
//       liveDisplay.value = undefined;
//       // 刷新月排期
//       CalenderMonthRef.value?.reload();
//       // 刷新周排期
//       CalenderWeekRef.value?.reload();
//     };

//     provide('baseTime', baseTime);
//     // 替换地址栏路由
//     onBeforeMount(() => {
//       calendar.value = ctx.root.$route.params.calendar;
//       toggleCalendar(props.type);
//     });

//     /** 日历内点击事件回调 */
//     const onDayClick = ({ year, month, date }: { year: number; month: number; date: number }) => {
//       liveDisplay.value = {
//         project_id: project.value?.id,
//         project_uid: project.value?.project_uid,
//         brand_name: project.value?.brand_name,
//         studio_id: project.value?.studio_id ? parseInt(project.value.studio_id, 10) : undefined,
//         studio_name: project.value?.studio_name,
//         live_start_time: `${year}-${month + 1}-${date}`,
//         live_end_time: `${year}-${month + 1}-${date}`,
//         business_type: project.value?.business_type,
//       };
//       showLiveDisplay.value = true;
//     };

//     const pushLiveDetail = (liveID: number) => {
//       const { href } = ctx.root.$router.resolve({
//         name: RouterNameProjectManage.live.display.detail,
//         params: {
//           id: `${liveID}`,
//         },
//       });
//       window.open(href, '_blank');
//     };
//     /**
//      * 周排期内场次点击回调
//      */
//     const onWeekMemoClick = (id: number) => {
//       pushLiveDetail(id);
//     };

//     /**
//      * 月排期内场次点击回调
//      */
//     const onMonthMemoClick = (id: number) => {
//       pushLiveDetail(id);
//     };

//     return {
//       calendar,
//       onCapsuleClick,
//       isMonth,
//       isWeek,
//       roles,
//       calendarPageUp,
//       calendarPageDown,
//       weekStr,
//       monthStr,
//       onDayClick,
//       liveDisplay,
//       showLiveDisplay,
//       liveDisplayClosed,
//       liveDisplaySaveSucceed,
//       onWeekMemoClick,
//       onMonthMemoClick,
//       CalenderWeekRef,
//       CalenderMonthRef,
//     };
//   },
// });
