/**
 * 场次和排期相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-15 11:10:35
 */
import { computed, ref } from '@vue/composition-api';
import { GetProjectScheduleDetail } from '@/services/live';
import {
  LiveDisplayStatusColorMap,
  LiveDisplayStatusMap,
  ProjectSchedule,
  ProjectScheduleQueryParams,
} from '@/types/tiange/live';
import { sleep } from '@/utils/func';
import { ScheduleGroup, TimelineSchedule } from '@/types/components/calendar';
import { format, getStartOfDay } from '@/utils/time';
import { MILLIONSECONDS_OF_HOUR } from '@/const/time';
import moment from 'moment';

/**
 * 场次/排期相关逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-15 11:22:48
 */
export const useSchedule = () => {
  /** 排期数据 */
  const projectSchedule = ref<ProjectSchedule[]>([]);

  /** 加载中 */
  const loading = ref(false);

  /** 获取周排期数据 */
  const loadData = async (payload: ProjectScheduleQueryParams) => {
    loading.value = true;
    const [{ data: response }] = await Promise.all([
      await GetProjectScheduleDetail(payload),
      await sleep(300),
    ]);
    loading.value = false;

    if (response.success) {
      projectSchedule.value = response.data;
    } else {
      projectSchedule.value = [];
    }
  };

  /** 日程安排转按天显示数据格式 */
  const projectScheduleGroupByDay = computed(() => {
    return projectSchedule.value.map(el => {
      // const date = new Date(el.live_start_time.replace(' ', 'T'));
      const date = moment(el.live_start_time.replace(' ', 'T')).toDate();

      const { live_start_time, live_end_time } = el;

      const [startDate, endDate] = [live_start_time, live_end_time].map(
        // el => new Date(el.replace(' ', 'T')),
        el => moment(el.replace(' ', 'T')).toDate(),
      );

      /** 标题(开始结束时间) */
      const title = (
        format(startDate, 'YYYY-mm-dd') === format(endDate, 'YYYY-mm-dd')
          ? [format(startDate, 'HH:ii'), format(endDate, 'HH:ii')]
          : [format(startDate, 'HH:ii'), format(endDate, '次日 HH:ii')]
      ).join(' ~ ');

      const newEl: ScheduleGroup<ProjectSchedule> = {
        id: el.id,
        original: el,
        day: date.getDay(),
        date: date.getDate(),
        title,
        content: LiveDisplayStatusMap.get(el.live_status) ?? '',
        color: LiveDisplayStatusColorMap.get(el.live_status) ?? '',
      };

      return newEl;
    });
  });

  /** 日程安排转按时间线显示数据格式() */
  const projectScheduleGroupByHours = computed(() =>
    projectSchedule.value
      .map(el => {
        // 场次拆分
        // const date = new Date(el.live_start_time);
        const date = moment(el.live_start_time).toDate();

        const { live_start_time, live_end_time } = el;

        const ret: TimelineSchedule<ProjectSchedule> = {
          id: el.id,
          original: el,
          day: date.getDay(),
          start_time: live_start_time,
          end_time: live_end_time,
          kol: el.kol_schedule_list.map(kolEl => {
            return {
              start_time: kolEl.start_time,
              end_time: kolEl.end_time,
              name: kolEl.kol_name,
              duration: kolEl.duration,
            };
          }),
          operator: el.operator_schedule_list.map(opEl => {
            return {
              start_time: opEl.start_time,
              end_time: opEl.end_time,
              name: opEl.operator_name,
              duration: opEl.duration,
            };
          }),
        };

        // const liveEndDateTime = new Date(live_end_time);
        const liveEndDateTime = moment(live_end_time).toDate();
        if (
          new Date(live_start_time).getDate() !== liveEndDateTime.getDate() &&
          format(liveEndDateTime, 'HH:ii') !== '00:00'
        ) {
          const { day, start_time, end_time, ...rest } = ret;
          return [
            // { ...rest, day, start_time, end_time: getStartOfDay(new Date(end_time)) },
            // { ...rest, day: day + 1, start_time: getStartOfDay(new Date(end_time)), end_time },
            { ...rest, day, start_time, end_time: getStartOfDay(moment(end_time).toDate()) },
            {
              ...rest,
              day: day + 1,
              start_time: getStartOfDay(moment(end_time).toDate()),
              end_time,
            },
          ];
        }

        return ret;
      })
      .flat()
      .map(el => {
        // 排班拆分
        const { kol, operator, ...rest } = el;

        const newKol = kol
          .map(kolEl => {
            const { start_time, end_time, duration, ...kolRest } = kolEl;

            // const elStartTimeDate = new Date(el.start_time);
            // const elEndTimeDate = new Date(el.end_time);
            // const startTimeDate = new Date(start_time);
            // const endTimeDate = new Date(end_time);
            const elStartTimeDate = moment(el.start_time).toDate();
            const elEndTimeDate = moment(el.end_time).toDate();
            const startTimeDate = moment(start_time).toDate();
            const endTimeDate = moment(end_time).toDate();

            if (
              startTimeDate.getTime() >= elEndTimeDate.getTime() ||
              endTimeDate.getTime() <= elStartTimeDate.getTime()
            ) {
              // 分割后时间区间落在场次外的排除掉
              return [];
            } else {
              const final_start_time =
                startTimeDate.getTime() <= elStartTimeDate.getTime() ? el.start_time : start_time;
              const final_end_time =
                endTimeDate.getTime() >= elEndTimeDate.getTime() ? el.end_time : end_time;

              return {
                start_time: final_start_time,
                end_time: final_end_time,
                duration:
                  // (new Date(final_end_time).getTime() - new Date(final_start_time).getTime()) /
                  (moment(final_end_time).valueOf() - moment(final_start_time).valueOf()) /
                  MILLIONSECONDS_OF_HOUR,
                ...kolRest,
              };
            }
          })
          .flat();

        const newOperator = operator
          .map(operatorEl => {
            const { start_time, end_time, duration, ...operatorRest } = operatorEl;

            // const elStartTimeDate = new Date(el.start_time);
            // const elEndTimeDate = new Date(el.end_time);
            // const startTimeDate = new Date(start_time);
            // const endTimeDate = new Date(end_time);
            const elStartTimeDate = moment(el.start_time).toDate();
            const elEndTimeDate = moment(el.end_time).toDate();
            const startTimeDate = moment(start_time).toDate();
            const endTimeDate = moment(end_time).toDate();

            if (
              startTimeDate.getTime() >= elEndTimeDate.getTime() ||
              endTimeDate.getTime() <= elStartTimeDate.getTime()
            ) {
              return [];
            } else {
              const final_start_time =
                startTimeDate.getTime() <= elStartTimeDate.getTime() ? el.start_time : start_time;
              const final_end_time =
                endTimeDate.getTime() >= elEndTimeDate.getTime() ? el.end_time : end_time;

              return {
                start_time: final_start_time,
                end_time: final_end_time,
                duration:
                  // (new Date(final_end_time).getTime() - new Date(final_start_time).getTime()) /
                  (moment(final_end_time).valueOf() - moment(final_start_time).valueOf()) /
                  MILLIONSECONDS_OF_HOUR,
                ...operatorRest,
              };
            }
          })
          .flat();

        return {
          ...rest,
          kol: newKol,
          operator: newOperator,
        };
      }),
  );

  return {
    projectSchedule,
    loadData,
    loading,
    projectScheduleGroupByDay,
    projectScheduleGroupByHours,
  };
};
