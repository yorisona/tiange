/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-07-27 10:08:59
 */
import { reactive, ref, computed } from '@vue/composition-api';
import moment, { Moment } from 'moment';

export enum ECalendarType {
  // 周
  Week = 0,
  // 月
  Month = 1,
  // 年
  Year = 2,
}

export interface ICalendarConfig {
  range: Moment[];
  currentDate: Moment;
  type: ECalendarType;
}

interface ICalendarInitConfig {
  integerMonth?: boolean;
}

const weekDayMap = [7, 1, 2, 3, 4, 5, 6];

export const useCalendarConfig = (
  _type = ECalendarType.Week,
  Config: ICalendarInitConfig = {},
  isNearSevenData = false,
) => {
  const currentDate = ref(moment());
  const type = ref(_type);
  const startTime = ref(currentDate.value.clone());
  const endTime = ref(currentDate.value.clone());
  const integerMonth = Config.integerMonth;

  const range = computed(() => {
    return [startTime.value, endTime.value];
  });

  const initRange = () => {
    if (type.value === ECalendarType.Month) {
      // 是否整月的日期
      if (integerMonth === true) {
        const start = currentDate.value.clone().startOf('month');
        const end = currentDate.value.clone().endOf('month');
        startTime.value = start;
        endTime.value = end;
        //传统日历
      } else {
        const start = currentDate.value.clone().startOf('month');
        const end = currentDate.value.clone().endOf('month');
        const startDay = weekDayMap[start.day()];
        const endDay = weekDayMap[end.day()];
        if (startDay !== 1) {
          start.add(1 - startDay, 'days');
        }
        if (endDay !== 7) {
          end.add(7 - endDay, 'days');
        }
        startTime.value = start;
        endTime.value = end;
      }
    } else if (type.value === ECalendarType.Week) {
      let start = currentDate.value.clone().startOf('week');
      let end = currentDate.value.clone().endOf('week');
      if (isNearSevenData) {
        start = currentDate.value.clone().subtract(7, 'd').startOf('day');
        end = currentDate.value.clone().subtract(1, 'd').startOf('day');
      }

      startTime.value = start;
      endTime.value = end;
    }
  };
  /**
   * 改变日历类型
   */
  const changeCalendarType = (_type: ECalendarType) => {
    type.value = _type;
    initRange();
  };

  /** 日历操作,增加,后退 **/
  const add = (num = 1) => {
    if (type.value === ECalendarType.Month) {
      currentDate.value = currentDate.value.clone().add(num, 'months');
    } else {
      currentDate.value = currentDate.value.clone().add(num, 'weeks');
    }
    initRange();
  };

  /** 改变日历 **/
  const changeDate = (value: any) => {
    currentDate.value = moment(value);
    initRange();
  };

  initRange();
  return reactive({
    changeDate,
    add,
    currentDate,
    startTime,
    endTime,
    changeCalendarType,
    range,
    type,
  });
};
