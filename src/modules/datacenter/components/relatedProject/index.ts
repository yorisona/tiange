import { defineComponent, PropType } from '@vue/composition-api';
import { ProjectStatusEnum } from '@/types/tiange/common';

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<
        {
          title: string;
          time: string;
          id: number;
        }[]
      >,
      default: () => {
        return [];
      },
    },
  },
  setup(props, ctx) {
    const handleClick = (id: any) => {
      ctx.emit('viewDetail', id);
    };
    return {
      handleClick,
      ProjectStatusEnum,
    };
  },
});
