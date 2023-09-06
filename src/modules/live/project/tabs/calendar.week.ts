/**
 * 直播排期(场次) - 周
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-08 14:26:51
 */
import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  Ref,
  ref,
  watch,
} from '@vue/composition-api';
import TgWeekTimeline from '@/components/Calendar/week.timeline';
import { ProjectScheduleQueryParams, ScheduleType } from '@/types/tiange/live';
import { LiveProject } from '@/types/tiange/live.project';
import { format, getStartOfDayTimestamp, getWeekDateRange } from '@/utils/time';
import { useSchedule } from '../use/schedule';
import { RouterNameProjectManage } from '@/const/router';
import { MILLIONSECONDS_OF_DAY } from '@/const/time';
import moment from 'moment';

export default defineComponent({
  name: 'TgTabCalendarWeek',
  components: {
    TgWeekTimeline,
  },
  setup(props, ctx) {
    /** 当天 */
    const todayTime = ref(Date.now());
    /** 基准时间戳(默认当天) */
    const baseTime = inject<Ref<number>>('baseTime') ?? todayTime;
    const {
      projectSchedule,
      loadData,
      projectScheduleGroupByDay,
      projectScheduleGroupByHours: _projectScheduleGroupByHours,
      loading,
    } = useSchedule();

    const weekRange = computed(() => getWeekDateRange(baseTime.value));

    /** 根据基准时间戳获取该周第一天和最后一天 YYYY-mm-dd */
    const week = computed(() => weekRange.value.map(el => format(el, 'YYYY-mm-dd')));

    /** 当前基准时间戳是否在本周范围内 */
    const isThisWeek = computed(() => {
      const [start, end] = weekRange.value;

      return todayTime.value >= start.getTime() && todayTime.value <= end.getTime();
    });

    const startDate = computed(() => weekRange.value[0].getTime());
    const endDate = computed(() =>
      getStartOfDayTimestamp(weekRange.value[1].getTime() + MILLIONSECONDS_OF_DAY),
    );

    /** 日程安排转按时间线显示数据格式，需要在原本基础上过滤掉前一个周日和下一个周一的数据 */
    const projectScheduleGroupByHours = computed(() =>
      _projectScheduleGroupByHours.value.filter(el => {
        // const startDateTimestamp = new Date(el.start_time).getTime();
        const startDateTimestamp = moment(el.start_time).valueOf();
        return startDateTimestamp >= startDate.value && startDateTimestamp < endDate.value;
      }),
    );

    const project = inject<Ref<LiveProject>>('project');

    /** 获取周排期数据 */
    const reload = async () => {
      if (project?.value === undefined) {
        return;
      }

      const [start_date, end_date] = week.value;

      const payload: ProjectScheduleQueryParams = {
        project_id: project.value.id,
        start_date,
        end_date,
        schedule_type: ScheduleType.Week,
      };

      await loadData(payload);
    };

    watch(
      () => project?.value,
      新值 => {
        if (新值) {
          reload();
        }
      },
    );

    watch(
      () => baseTime.value,
      (新值, 旧值) => {
        if (新值 !== 旧值) {
          reload();
        }
      },
    );

    onBeforeMount(() => {
      reload();
    });

    // 继续向上抛出事件
    const onClick = ({ year, month, date }: { year: number; month: number; date: number }) => {
      ctx.emit('calendar:day:click', { year, month, date });
    };

    const momeClick = (id: number) => {
      pushLiveDetail(id);
    };

    const pushLiveDetail = (liveID: number) => {
      const { href } = ctx.root.$router.resolve({
        name: RouterNameProjectManage.live.display.detail,
        params: {
          id: `${liveID}`,
        },
      });
      window.open(href, '_blank');
    };

    return {
      projectSchedule,
      projectScheduleGroupByDay,
      projectScheduleGroupByHours,
      isThisWeek,
      startDate,
      onClick,
      reload,
      momeClick,
      loading,
    };
  },
});
