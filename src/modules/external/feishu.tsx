import { ref, defineComponent, h } from '@vue/composition-api';
export default defineComponent({
  name: '',
  /* 待拓展 */
  setup(props, ctx) {
    const data = ref();
    return {
      data,
    };
  },
  render() {
    return <div></div>;
  },
});
