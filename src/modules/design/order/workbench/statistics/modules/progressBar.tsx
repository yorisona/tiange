import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import './progressBar.less';
interface ProgressBarItem {
  label: string;
  percent: number;
  color: string;
}

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<ProgressBarItem[]>,
      default: () => [
        {
          label: '已完成',
          percent: 32,
          color: '#3F8EF6',
        },
      ],
    },
    styles: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const remainder = computed(() => {
      const total = props.data.reduce((prev: any, cur: any) => prev + cur.percent, 0);
      if (total >= 100) {
        return 0;
      }
      return 100 - total;
    });
    return {
      remainder,
    };
  },
  render() {
    const { data } = this;
    return (
      <div class="progress_bar_20230324" style={{ ...this.styles }}>
        {data.map((item: any, i: number) => (
          <div
            class="progress_bar_item"
            style={{
              background: item?.color || '#3F8EF6',
              width: item.percent + '%',
              borderRadius: i === 0 ? '2px 0 0 2px' : i === data.length - 1 ? '0 2px 2px 0' : '0',
            }}
          ></div>
        ))}
        {/* tooltip作用域插槽 */}
        {this.$scopedSlots.tooltip && this.$scopedSlots.tooltip(data)}
        <div class="remainder" style={{ background: '#F4F8FF', width: this.remainder + '%' }}></div>
      </div>
    );
  },
});
