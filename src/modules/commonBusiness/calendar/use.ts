/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-07-27 10:08:59
 */
import { reactive, ref, SetupContext } from '@vue/composition-api';
import { Moment } from 'moment';
import { LiveProjectDailydata } from '@/types/tiange/live.project';
import { Message } from 'element-ui';

export const useDailyData = (props: any, ctx: SetupContext | undefined = undefined) => {
  const list = ref<LiveProjectDailydata[]>([]);
  const total = ref<LiveProjectDailydata | undefined>();
  const restDate = ref<string[]>([]);
  const find = (day: Moment): LiveProjectDailydata | undefined => {
    return list.value.find(item => item.date + '' === day.format('YYYYMMDD'));
  };

  // 查询数据
  const query = (begin: number, end: number, project_id: string, showError = true) => {
    props.query(begin, end, project_id).then((res: any) => {
      if (res.data.success) {
        list.value = res.data.data.data;
        total.value = list.value.pop();
        restDate.value = res.data.data.rest_days ?? [];
        // total.value = { ...list.value[0] };
      } else {
        if (showError) {
          Message.error(res.data.message);
        }
        if (res.data.error_code === 200) {
          ctx?.emit('withoutPermission');
        }
      }
    });
  };
  const save = (data: LiveProjectDailydata) => {
    return props.save(data);
  };
  return reactive({
    save,
    query,
    list,
    total,
    find,
    restDate,
  });
};
