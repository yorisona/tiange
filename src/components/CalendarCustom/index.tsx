export * from './use';
import { defineComponent, PropType } from '@vue/composition-api';
import moment, { Moment } from 'moment';
import './index.less';
import { ICalendarConfig, ECalendarType } from './use';

const WeekDayMap = ['日', '一', '二', '三', '四', '五', '六'];

export default defineComponent({
  name: 'CalendarCustom',
  props: {
    /**  配置 例:时间范围[], 当前时间moment, 类型 */
    config: {
      type: Object as PropType<ICalendarConfig>,
      default: () => {
        return {};
      },
    },
  },
  setup(props, ctx) {
    const today = moment();
    return {
      today,
    };
  },
  methods: {
    renderCalendarTd(day: Moment) {
      const $scopedSlots = this.$scopedSlots;
      return (
        <fragments>
          <div class={`tg-calendar-custom-day ${this.today.isSame(day, 'day') && 'active'}`}>
            {day.date()}
          </div>
          {$scopedSlots.render && $scopedSlots.render(day)}
        </fragments>
      );
    },
  },
  render() {
    const { range, currentDate, type } = this.config;
    if (range.length < 2) return <div />;
    const start = range[0].clone();
    const end = range[1].clone();
    const _range: Moment[] = [];
    while (start.isSameOrBefore(end)) {
      _range.push(start.clone());
      start.add(1, 'days');
    }
    const currentMonth = currentDate.month();
    return (
      <div class="tg-calendar-custom">
        {new Array(7).fill(1).map((_, index) => {
          return (
            <div key={`header-${index}`} class="tg-calendar-custom-th">
              周{WeekDayMap[_range[index].day()]}
            </div>
          );
        })}
        {_range.map((item, index) => {
          const tdClass = `tg-calendar-custom-td ${
            ECalendarType.Month === type && item.month() !== currentMonth && 'other-month'
          }`;
          return (
            <div class={tdClass} key={index}>
              {this.renderCalendarTd(item)}
            </div>
          );
        })}
      </div>
    );
  },
});
