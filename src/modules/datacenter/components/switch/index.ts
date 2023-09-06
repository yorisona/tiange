import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'OverviewTab',
  props: {
    index: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const handleCheckBtn = (item: number) => {
      ctx.emit('checkATab', item);
    };
    return {
      handleCheckBtn,
    };
  },
});
