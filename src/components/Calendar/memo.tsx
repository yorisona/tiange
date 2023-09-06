/**
 * 小型条状便签(日历用)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-11 09:40:31
 */

import { defineComponent, PropType } from '@vue/composition-api';

export default defineComponent({
  name: 'TgCalendarMemo',
  props: {
    color: {
      type: String as PropType<'gray' | 'yellow' | 'green'>,
      default: 'gray',
    },
  },
  render() {
    return (
      <div class="tg-calendar-memo">
        <div class="tg-calendar-memo-brd"></div>
        <div class="tg-calendar-memo-title">{this.$slots.title}</div>
        <div class={['tg-calendar-memo-content', this.color]}>{this.$slots.content}</div>
      </div>
    );
  },
});
