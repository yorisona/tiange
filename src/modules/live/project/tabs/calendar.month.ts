/**
 * 直播排期(场次) - 月
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-14 15:18:14
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
import { ProjectScheduleQueryParams, ScheduleType } from '@/types/tiange/live';
import { LiveProject } from '@/types/tiange/live.project';
import { format, getDate, getDaysInMonth } from '@/utils/time';
import { useSchedule } from '../use/schedule';
import { RouterNameProjectManage } from '@/const/router';
import moment from 'moment';

export default defineComponent({
  name: 'TgTabCalendarMonth',
  props: {},
  setup(props, ctx) {
    /** 当天 */
    const todayTime = ref(Date.now());
    /** 基准时间戳(默认当天) */
    const baseTime = inject<Ref<number>>('baseTime') ?? todayTime;

    /** 年 */
    const year = computed(() => getDate(baseTime.value).getFullYear());
    /** 月 */
    const month = computed(() => getDate(baseTime.value).getMonth());

    const 本月首日 = computed(
      // () => new Date([`${year.value}`, `${month.value + 1}`.padStart(2, '0'), '01'].join('-')),
      () =>
        moment([`${year.value}`, `${month.value + 1}`.padStart(2, '0'), '01'].join('-')).toDate(),
    );
    const 本月天数 = computed(() => getDaysInMonth(year.value, month.value));
    const 本月最后一日 = computed(() =>
      // new Date(
      moment(
        [
          `${year.value}`,
          `${month.value + 1}`.padStart(2, '0'),
          `${本月天数.value}`.padStart(2, '0'),
        ].join('-'),
      ).toDate(),
    );

    const { projectSchedule, loadData, projectScheduleGroupByDay, loading } = useSchedule();

    const project = inject<Ref<LiveProject>>('project');

    /** 获取周排期数据 */
    const reload = async () => {
      if (project?.value === undefined) {
        return;
      }

      const payload: ProjectScheduleQueryParams = {
        project_id: project.value.id,
        start_date: format(本月首日.value, 'YYYY-mm-dd'),
        end_date: format(本月最后一日.value, 'YYYY-mm-dd'),
        schedule_type: ScheduleType.Month,
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
      baseTime,
      year,
      month,
      projectSchedule,
      projectScheduleGroupByDay,
      onClick,
      reload,
      momeClick,
      loading,
    };
  },
});
