import { LiveScheduleQuery } from '@/services/live';
import { KolSchedule, OperatorSchedule } from '@/types/tiange/live';
import { wait } from '@/utils/func';
import { ref } from '@vue/composition-api';

// 获取排班数据相关逻辑
export const useSchedules = () => {
  const schedule = ref<{
    kolSchedules: KolSchedule[];
    operatorSchedules: OperatorSchedule[];
  }>({
    kolSchedules: [],
    operatorSchedules: [],
  });

  const loading = ref(false);

  const loadData = async (
    id: number | string,
    business_type: number | undefined = E.project.BusinessType.douyin,
  ) => {
    // loading.value = true;
    const [{ data: response }] = await wait(300, LiveScheduleQuery(id, business_type));
    // loading.value = false;

    if (response.success) {
      schedule.value.kolSchedules = response.data.kol_schedule_list;
      schedule.value.operatorSchedules = response.data.operator_schedule_list;
    } else {
      schedule.value.kolSchedules = [];
      schedule.value.operatorSchedules = [];
    }
  };

  return { loading, loadScheduleData: loadData, ScheduleData: schedule };
};
