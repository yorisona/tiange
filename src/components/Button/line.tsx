/**
 * 按钮行
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-06 11:26:16
 */

import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TgButtonLine',
  props: {
    justifyContent: {
      type: String,
    },
  },
  setup(props) {
    const styles = computed(() => {
      if (props.justifyContent === undefined) {
        return {};
      } else {
        return {
          'justify-content': props.justifyContent,
        };
      }
    });
    return { styles };
  },
  render() {
    const props = {
      class: ['button-line'],
      style: this.styles,
    };
    return <div {...props}>{this.$slots.default}</div>;
  },
});
