import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DrawerHeader',
  props: {
    /** 标题内容 */
    title: {
      type: String,
      default: undefined,
    },
  },
});
