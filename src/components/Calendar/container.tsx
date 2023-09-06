/**
 * 日历 - 最外层容器
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-08 15:26:05
 */
import { computed, defineComponent, PropType } from '@vue/composition-api';

// const DefHeaders = ['全天', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const classList = ['week', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

interface CalendarHeader {
  /** 日历表头标题 */
  title: string;
  /** 日历表头副标题 */
  subTitle: string;
  /** 日历表头样式类 */
  class: string[];
}

export default defineComponent({
  name: 'TgCalendar',
  props: {
    /** 表头 */
    headers: {
      type: Array as PropType<CalendarHeader[]>,
      required: true,
    },
    /** 是否隐藏侧边 */
    navHide: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const hd = computed(() =>
      props.headers.map((el, index) => ({
        title: el.title,
        subTitle: el.subTitle,
        class: [classList[index], ...el.class],
      })),
    );

    return { hd };
  },
  render() {
    const headerNodes = this.hd
      .filter((_, index) => (this.navHide ? index > 0 : true))
      .map(el => (
        <div class={['calendar-hd', el.class]}>
          <div class="calendar-hd-content">
            <span>{el.title}</span>
            <span>{el.subTitle}</span>
          </div>
        </div>
      ));

    return (
      <div class="tg-calendar">
        {headerNodes}
        {this.$slots.default}
      </div>
    );
  },
});
