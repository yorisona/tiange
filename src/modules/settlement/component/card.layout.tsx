/**
 * 步骤二、三卡片
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-20 15:43:29
 */
import { computed, defineComponent, PropType } from '@vue/composition-api';

const CardLayout = defineComponent({
  props: {
    padding: {
      type: [Number, Array] as PropType<number | number[]>,
      default: () => [18, 18, 12, 18],
    },
    isLiveDouyin: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const paddingList = computed(() =>
      Array.isArray(props.padding)
        ? props.padding
        : [props.padding, props.padding, props.padding, props.padding],
    );

    return { paddingList };
  },
  render() {
    const style = {
      padding: this.paddingList.map(el => `${el}px`).join(' '),
    };
    return (
      <div class={this.isLiveDouyin ? 'card-layout card-layout-livedouyin' : 'card-layout'}>
        <div
          class={this.isLiveDouyin ? 'card-layout-hd livedouyin' : 'card-layout-hd'}
          style={this.isLiveDouyin ? 'height:48px;' : ''}
        >
          <div class="title" style={this.isLiveDouyin ? 'margin-top:12px;' : 'margin-left:6px'}>
            {this.$slots.title}
          </div>
          <div class="description" style={this.isLiveDouyin ? 'margin-top:12px' : ''}>
            {this.$slots.desc ?? ''}
          </div>
          <div class="needrefresh" style={this.isLiveDouyin ? 'margin-top:12px' : ''}>
            {this.$slots.refresh ?? ''}
          </div>
        </div>
        <div class="card-layout-bd" style={style}>
          {this.$slots.default}
        </div>
      </div>
    );
  },
});

export default CardLayout;
