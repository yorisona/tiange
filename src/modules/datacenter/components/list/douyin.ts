import { defineComponent, computed, PropType } from '@vue/composition-api';
import { numberFormat } from '@/utils/formatMoney';
import { DefText } from '@/components/DefText/dt';
import { formatAmount, getPositiveNumber } from '@/utils/string';
import { DisplayDailyData } from '@/types/tiange/commonBusiness/project';
import Decimal from 'decimal.js';
const showRadio = (val: number | string | undefined): string => {
  const str = val ? new Decimal(val).mul(new Decimal(100)).toFixed(2) : '0';
  return `${str}%`;
};
const showPrice = (val: number | undefined): string => {
  const str = val ? formatAmount(val / 100, 'None') : '0';
  return str;
};
const showInt = (val: number | string | undefined): string => {
  const str = val ? formatAmount(val, 'None', true) : '0';
  return str;
};
export default defineComponent({
  name: 'dataCenterList',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    restDates: {
      type: Array as PropType<string[]>,
    },
    currentDateType: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const dateList = computed(() => {
      const list = JSON.parse(JSON.stringify(props.list));
      return list;
    });
    /** 列设置 */
    const columns = [
      {
        label: '有效直播场次',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.valid_live_room_count || row.valid_live_room_count === 0
              ? showRadio(row.valid_live_room_count)
              : DefText();
          } else {
            return row.valid_live_room_count || row.valid_live_room_count === 0
              ? showInt(row.valid_live_room_count)
              : DefText();
          }
        },
      },
      {
        label: '总直播时长 (h)',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.live_duration || row.live_duration === 0
              ? showRadio(row.live_duration)
              : DefText();
          } else {
            if (row.live_duration || row.live_duration === 0) {
              const hour: number = row.live_duration / 60;
              return getPositiveNumber(String(hour));
            } else {
              return DefText();
            }
          }
        },
      },
      {
        label: '直播间曝光人数',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.room_watch_person || row.room_watch_person === 0
              ? showRadio(row.room_watch_person)
              : DefText();
          } else {
            return row.room_watch_person || row.room_watch_person === 0
              ? showInt(row.room_watch_person)
              : DefText();
          }
        },
      },
      {
        label: '直播间曝光次数',
        minWidth: 130,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.room_watch_times || row.room_watch_times === 0
              ? showRadio(row.room_watch_times)
              : DefText();
          } else {
            return row.room_watch_times || row.room_watch_times === 0
              ? showInt(row.room_watch_times)
              : DefText();
          }
        },
      },
      {
        label: '曝光点击率',
        minWidth: 130,
        formatter: (row: DisplayDailyData) => {
          return row.watch_cnt_show_ratio || row.watch_cnt_show_ratio === 0
            ? showRadio(row.watch_cnt_show_ratio)
            : DefText();
        },
      },
      {
        label: '直播间浏览量 (人次)',
        minWidth: 160,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.room_user_views || row.room_user_views === 0
              ? showRadio(row.room_user_views)
              : DefText();
          } else {
            return row.room_user_views || row.room_user_views === 0
              ? showInt(row.room_user_views)
              : DefText();
          }
        },
      },
      {
        label: '累计观看人数',
        minWidth: 130,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.cumulative_watch_person || row.cumulative_watch_person === 0
              ? showRadio(row.cumulative_watch_person)
              : DefText();
          } else {
            return row.cumulative_watch_person || row.cumulative_watch_person === 0
              ? showInt(row.cumulative_watch_person)
              : DefText();
          }
        },
      },
      {
        label: '商品曝光人数',
        minWidth: 130,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.product_watch_person || row.product_watch_person === 0
              ? showRadio(row.product_watch_person)
              : DefText();
          } else {
            return row.product_watch_person || row.product_watch_person === 0
              ? showInt(row.product_watch_person)
              : DefText();
          }
        },
      },
      {
        label: '商品点击人数',
        minWidth: 130,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.product_click_person || row.product_click_person === 0
              ? showRadio(row.product_click_person)
              : DefText();
          } else {
            return row.product_click_person || row.product_click_person === 0
              ? showInt(row.product_click_person)
              : DefText();
          }
        },
      },
      {
        label: '商品点击率 (人数)',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          return row.product_click_person_rate || row.product_click_person_rate === 0
            ? showRadio(row.product_click_person_rate)
            : DefText();
        },
      },
      {
        label: '直播间成交人数',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.pay_ucnt || row.pay_ucnt === 0 ? showRadio(row.pay_ucnt) : DefText();
          } else {
            return row.pay_ucnt || row.pay_ucnt === 0 ? showInt(row.pay_ucnt) : DefText();
          }
        },
      },
      {
        label: '点击成交转化率（人数）',
        minWidth: 160,
        formatter: (row: DisplayDailyData) => {
          return row.click_to_trade_person_rate || row.click_to_trade_person_rate === 0
            ? showRadio(row.click_to_trade_person_rate)
            : DefText();
        },
      },
      {
        label: '看播成交转化率（人数）',
        minWidth: 160,
        formatter: (row: DisplayDailyData) => {
          return row.watch_convert_to_trade_rate || row.watch_convert_to_trade_rate === 0
            ? showRadio(row.watch_convert_to_trade_rate)
            : DefText();
        },
      },
      {
        label: '客单价',
        minWidth: 120,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.per_customer_price || row.per_customer_price === 0
              ? showRadio(row.per_customer_price)
              : DefText();
          } else {
            return row.per_customer_price || row.per_customer_price === 0
              ? showPrice(row.per_customer_price)
              : DefText();
          }
        },
      },
      {
        label: '直播间成交金额 (元)',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.gmv || row.gmv === 0 ? showRadio(row.gmv) : DefText();
          } else {
            return row.gmv || row.gmv === 0 ? showPrice(row.gmv) : DefText();
          }
        },
      },
      {
        label: '预估佣金 (元)',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.estimated_institution_commission ||
              row.estimated_institution_commission === 0
              ? showRadio(row.estimated_institution_commission)
              : DefText();
          } else {
            return row.estimated_institution_commission ||
              row.estimated_institution_commission === 0
              ? showPrice(row.estimated_institution_commission)
              : DefText();
          }
        },
      },
      {
        label: '结算率',
        minWidth: 150,
        formatter: (row: DisplayDailyData) => {
          return row.settled_rate || row.settled_rate === 0
            ? showRadio(row.settled_rate)
            : DefText();
        },
      },
      {
        label: '新增粉丝数',
        minWidth: 120,
        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.incr_new_fans_num || row.incr_new_fans_num === 0
              ? showRadio(row.incr_new_fans_num)
              : DefText();
          } else {
            return row.incr_new_fans_num || row.incr_new_fans_num === 0
              ? showInt(row.incr_new_fans_num)
              : DefText();
          }
        },
      },
      {
        label: '转粉率',
        minWidth: 120,
        formatter: (row: DisplayDailyData) => {
          return row.new_fans_rate || row.new_fans_rate === 0
            ? showRadio(row.new_fans_rate)
            : DefText();
        },
      },
      {
        label: '新加团人数',
        minWidth: 120,

        formatter: (row: DisplayDailyData) => {
          if (row.weeK_str === '环比') {
            return row.incr_new_add_group_person || row.incr_new_add_group_person === 0
              ? showRadio(row.incr_new_add_group_person)
              : DefText();
          } else {
            return row.incr_new_add_group_person || row.incr_new_add_group_person === 0
              ? showInt(row.incr_new_add_group_person)
              : DefText();
          }
        },
      },
      {
        label: '加团率',
        minWidth: 120,

        formatter: (row: DisplayDailyData) => {
          return row.add_group_rate || row.add_group_rate === 0
            ? showRadio(row.add_group_rate)
            : DefText();
        },
      },
    ];
    const computedRestDate = computed(() => props.restDates ?? []);
    const is_rest = (day: number | string) => {
      if (computedRestDate.value.length === 0) {
        return false;
      }
      const findItem = computedRestDate.value.find(el => {
        const items = el.split('-');
        const restDay = `${Number(items[items.length - 1])}`;
        if (restDay === `${day}`) {
          return el;
        }
      });
      return findItem ? true : false;
    };
    return {
      is_rest,
      dateList,
      columns,
      numberFormat,
    };
  },
});
