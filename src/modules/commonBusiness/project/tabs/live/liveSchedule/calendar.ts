import {
  QueryProjectScheduleCalendarMcn,
  ScheduleCancelRest,
  ScheduleSetRest,
} from '@/services/live';
import { defineComponent, computed, ref, watch } from '@vue/composition-api';
import {
  ProjectScheduleCalendarData,
  ProjectScheduleLiveData,
  QueryProjectScheduleCalendarParams,
} from '@/types/tiange/live';
import { useRouter } from '@/use/vue-router';
import moment from 'moment';
import { sleep } from '@/utils/func';
import lodash from '@/utils/lodash/custom';
import { RouterNameProjectManage } from '@/const/router';

const { debounce } = lodash;

const dateFormat = 'yyyy-MM-DD';

interface CalednarData extends ProjectScheduleCalendarData {
  day: number;
  new_date: moment.Moment;
  /** 0: 无排期, 1: 休息, 2: 正常有排期 */
  status: number;
}

export default defineComponent({
  name: 'Calendar',
  props: {
    displayDate: {
      type: Date,
    },
  },
  setup(props, ctx) {
    const loading = ref<boolean>(false);

    const calendarData = computed<CalednarData[]>(() => {
      return liveDays.value.map(day => {
        const live = originData.value.find(item => {
          return methods.is_same_day(day, item.date);
        });

        const retDate = live?.date ? moment(live?.date) : moment(day);
        const status = live ? methods.status_of_day(live) : 0;
        return {
          date: day,
          day: retDate.date(),
          new_date: retDate,
          status,
          shop_live_list: live?.shop_live_list ?? [],
        };
      });
    });
    const originData = ref<ProjectScheduleCalendarData[]>([]);

    const router = useRouter();
    const project_id = router.currentRoute.params.id;

    const currentDisplayDate = computed(() => {
      return props.displayDate ? moment(props.displayDate) : moment();
      // const currentDate = props.displayDate ?? new Date();
      // return {
      //   year: currentDate.getFullYear(),
      //   month: currentDate.getMonth(),
      // };
    });

    const days = computed(() => currentDisplayDate.value.clone().endOf('month').date());

    const prefixWeekday = computed(() => {
      // const day = getWeekday(currentDisplayDate.value.year(), currentDisplayDate.value.month());
      const day = currentDisplayDate.value.clone().startOf('month').day();
      return (day === 0 ? 7 : day) - 1;
    });
    const surfixWeekday = computed(() => {
      // const day = getWeekday(currentDisplayDate.value.year(), currentDisplayDate.value.month(), days.value);
      const day = currentDisplayDate.value.clone().endOf('month').day();
      return day ? 7 - day : 0;
    });

    const liveDays = computed(() => {
      const dayArr = [];
      const currentMonthDate = currentDisplayDate.value.clone();

      for (let i = 0; i < methods.prefixDays.value.length; i++) {
        const preDay = methods.prefixDays.value[i];
        const preMonthDate = currentMonthDate
          .clone()
          .month(currentMonthDate.month() - 1)
          .date(preDay);
        dayArr.push(preMonthDate.format(dateFormat));
      }
      for (let i = 1; i <= days.value; i++) {
        const curDate = currentMonthDate.clone().date(i);
        dayArr.push(curDate.format(dateFormat));
      }
      for (let i = 0; i < methods.surfixDays.value.length; i++) {
        const surDay = methods.surfixDays.value[i];
        const surMonthDate = currentMonthDate
          .clone()
          .month(currentMonthDate.month() + 1)
          .date(surDay);
        dayArr.push(surMonthDate.format(dateFormat));
      }
      return dayArr;
    });

    const methods = {
      //  休息按钮 点击事件
      onRest: async (day: CalednarData) => {
        if (methods.is_rest_disabled(day)) {
          return;
        }
        if (day.status === 1) {
          //  取消休息
          const res = await ScheduleCancelRest(day.shop_live_list[0].id);
          if (res.data.success) {
            methods.queryProjectScheduleCalendar();
            ctx.root.$message.success(res.data.message ?? '取消休息日成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '休息日取消失败，请稍后重试');
          }
          return;
        }
        //  设置休息
        const res = await ScheduleSetRest(project_id, day.date);
        if (res.data.success) {
          methods.queryProjectScheduleCalendar();
          ctx.root.$message.success(res.data.message ?? '设置休息日成功');
        } else {
          ctx.root.$message.error(res.data.message ?? '休息日设置失败，请稍后重试');
        }
      },
      //  是否是今天
      isToday: (day: CalednarData) => {
        const todayDay = moment();
        if (todayDay.format(dateFormat) === day.date) {
          return true;
        }
        return false;
      },
      surfixDays: computed(() => {
        const surfixDayArr = [];
        for (let i = 1; i <= surfixWeekday.value; i++) {
          surfixDayArr.push(i);
        }
        return surfixDayArr;
      }),
      prefixDays: computed(() => {
        const prefixDayArr = [];
        // const prefixMonthDays = getDay(currentDisplayDate.value.year(), currentDisplayDate.value.month());
        const prefixMonthDays = currentDisplayDate.value
          .clone()
          .month(currentDisplayDate.value.month() - 1)
          .endOf('month')
          .date();
        for (let i = 0; i < prefixWeekday.value; i++) {
          prefixDayArr.push(prefixMonthDays + i - prefixWeekday.value + 1);
        }
        return prefixDayArr;
      }),
      // saveLoading.value = true;
      // const [{ data: response }, _] = await Promise.all([
      //   await SaveLiveProject(payload),
      //   await sleep(200),
      // ]);
      // saveLoading.value = false;

      queryProjectScheduleCalendar: async () => {
        // const year = currentDisplayDate.value.year();
        // const month = currentDisplayDate.value.month() + 1;
        // const lastDayOfMonth = getDay(year, month);
        const params: QueryProjectScheduleCalendarParams = {
          project_id: project_id,
          start_date: liveDays.value[0],
          end_date: liveDays.value[liveDays.value.length - 1],
        };
        loading.value = true;
        const [res, _] = await Promise.all([
          await QueryProjectScheduleCalendarMcn(params),
          await sleep(500),
        ]);
        // const res = await QueryProjectScheduleCalendar(params)
        loading.value = false;
        const resData = res.data.data ?? [];
        if (res.data.success) {
          originData.value = resData;
        } else {
          originData.value = [];
          ctx.root.$message.error(res.data.message ?? '获取直播场次信息失败，请稍后重试');
        }
      },
      /**
       * 状态
       * @param day
       * @param dateData
       * @returns 0: 无排期, 1: 休息, 2: 正常有排期
       */
      status_of_day: (dateData: ProjectScheduleCalendarData): number => {
        const findItem = dateData.shop_live_list.find(el => el.is_rest_day);
        if (findItem) {
          return 1;
        } else {
          return dateData.shop_live_list.length ? 2 : 0;
        }
      },
      is_same_day: (day: string, other_day: string) => {
        if (other_day && other_day.length) {
          if (moment(other_day).isSame(moment(day), 'day')) {
            return true;
          }
        }
        return false;
      },
      is_rest_disabled: (day: CalednarData) => {
        return day.status === 2;
      },
      two_live: (live_data: ProjectScheduleCalendarData) => {
        return live_data.shop_live_list.filter((_, index) => index < 2);
      },
      is_live_abnormal: (live: ProjectScheduleLiveData & { is_overdue: any }) => {
        let is_abnormal = false;
        if (live.is_overdue === 1 && live.live_status === 1) {
          is_abnormal = true;
        }
        return is_abnormal;
      },
      abnormal_live_tips: (live: ProjectScheduleLiveData & { is_overdue: any }) => {
        const tips = [];
        if (live.is_overdue === 1 && live.live_status === 1) {
          tips.push(`${tips.length + 1}、已过结束时间未归档的场次`);
        }
        // if (!live.is_relation_plugin) {
        //   tips.push(`${tips.length + 1}、未关联场次`);
        // }
        // if (!live.is_entry_live_data) {
        //   tips.push(`${tips.length + 1}、未录入直播数据`);
        // }
        return tips;
      },
      // 调转详情
      jumpDetail: (row: { id: number }) => {
        router.push({
          name: RouterNameProjectManage.commonBusiness.project.detail_display,
          params: {
            id: `${project_id}`,
            liveId: `${row.id}`,
            tab: 'live',
            liveType: 'list',
          },
        });
      },
      reloadData: () => {
        methods.queryProjectScheduleCalendar();
      },
    };

    const weeks = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
    watch([() => props.displayDate], ([_]) => {
      methods.queryProjectScheduleCalendar();
    });
    methods.queryProjectScheduleCalendar();

    const onRestHandle = debounce(methods.onRest, 200);

    return {
      onRestHandle,
      loading,
      calendarData,
      // liveDays,
      weeks,
      ...methods,
    };
  },
  activated(): void {
    this.queryProjectScheduleCalendar();
  },
});

/**
 * @brief:
 * @param[in]:
 * @param[out]:
 * @return {*}
 * @note:
 * @param {number} year
 * @param {number} month 1-12
 */
// function getDay(year: number, month: number, day = 0): number {
//   const _d = new Date(year, month, day);
//   return _d.getDate();
// }

// function getWeekday(year: number, month: number, day = 1): number {
//   const _d = new Date(year, month, day);
//   return _d.getDay();
// }
