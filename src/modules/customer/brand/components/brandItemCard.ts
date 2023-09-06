import { defineComponent, PropType } from '@vue/composition-api';
import { Brand } from '@/types/tiange/brand';
import { getFirstAvatarName } from '@/utils/format';

export default defineComponent({
  name: 'BrandItemCard',
  props: {
    brandItem: {
      type: Object as PropType<Brand>,
      required: true,
    },
  },
  filters: {},
  setup(props, ctx) {
    return {
      getFirstAvatarName,
    };
  },
});
