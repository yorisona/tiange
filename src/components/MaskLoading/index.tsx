/**
 * 一个简单的带遮罩层加载中组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-18 11:30:07
 */
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TgMaskLoading',
  props: {
    /** 是否可见 */
    visible: {
      type: Boolean,
      default: false,
    },
    /** 内容文本 */
    content: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const display = computed(() => {
      return {
        style: { display: props.visible ? 'grid' : 'none' },
      };
    });

    return { display };
  },
  render() {
    const props = {
      class: ['tg-mask tg-mask-loading-container'],
      ...this.display,
    };

    return (
      <div {...props}>
        <div class="tg-mask-loading">
          <div class="tg-mask-icon">
            <tg-icon name="ico-loading-v2" />
          </div>
          <span class="tg-mask-content">{this.content.trim()}</span>
        </div>
      </div>
    );
  },
});
