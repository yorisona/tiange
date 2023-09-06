/**
 * 日历遮罩层
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 14:29:19
 */
import { computed, defineComponent, PropType } from '@vue/composition-api';

export default defineComponent({
  name: 'TgCalendarMask',
  props: {
    /**
     * ```
     * 遮罩层方向
     * row---行遮罩
     * column---列遮罩(默认)
     * ```
     */
    direction: {
      type: String as PropType<'row' | 'column'>,
      default: 'column',
    },
    /** 行索引(仅限行遮罩层)*/
    row: {
      type: Number,
      default: 1,
    },
    /** 列索引(仅限列遮罩层)*/
    column: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const maskClass = computed(() =>
      props.direction === 'row' ? 'tg-calendar-row-mask' : 'tg-calendar-column-mask',
    );

    const maskStyle = computed(() => {
      return props.direction === 'row'
        ? {
            'grid-row': `${props.row + 1} / ${props.row + 2}`,
          }
        : { 'grid-column': `${props.column + 1} / ${props.column + 2}` };
    });

    return { maskClass, maskStyle };
  },
  render() {
    const props = {
      class: this.maskClass,
      style: this.maskStyle,
      key: this.direction,
    };

    return <div {...props}></div>;
  },
});
