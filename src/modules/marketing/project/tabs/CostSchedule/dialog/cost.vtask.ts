/*
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - V任务链接
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-21 14:54:11
 */

import { VTask } from '@/types/tiange/marketing/project';
import { defineComponent, PropType } from '@vue/composition-api';

export default defineComponent({
  name: 'CostVTask',
  props: {
    visible: {
      type: Boolean,
    },
    vtasks: {
      type: Array as PropType<VTask[]>,
    },
  },
  setup(props, ctx) {
    /** methods */
    const close = () => {
      ctx.emit('update:visible', false);
    };
    const handleUrlClick = (url: string) => {
      window.open(url, 'blank');
    };
    return {
      close,
      handleUrlClick,
    };
  },
});
