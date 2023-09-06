import { computed, defineComponent, h } from '@vue/composition-api';
import { DefText } from './dt';

export default defineComponent({
  props: {
    content: {
      type: String,
    },
  },
  setup(props) {
    const isEmpty = computed(
      () => props.content === '' || props.content === undefined || props.content === null,
    );

    return () => (isEmpty.value ? DefText() : h('span', [props.content]));
  },
});
