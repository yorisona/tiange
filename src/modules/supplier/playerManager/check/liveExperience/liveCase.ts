import { defineComponent, PropType } from '@vue/composition-api';
import { ICase } from '@/types/tiange/supplier';
import { URLHelper } from '@/utils';

export default defineComponent({
  name: 'liveCase',
  props: {
    liveCase: {
      type: Object as PropType<ICase>,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, ctx) {
    const urlHelper = new URLHelper();
    const onCancelBtnClick = () => {
      ctx.emit('dialogClose');
    };
    return { onCancelBtnClick, urlHelper };
  },
});
