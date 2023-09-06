/**
 * 卡片 - 单元格容器
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 17:23:27
 */
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TgCalendarCard',
  render() {
    return <div class="tg-calendar-card">{this.$slots.default}</div>;
  },
});
