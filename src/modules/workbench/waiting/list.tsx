/**
 * 工作台 - 审批 - 待我审批
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 16:21:32
 */
import { defineComponent, inject, Ref, ref, watch } from '@vue/composition-api';
import { useList } from '../useList';
import { useApprovalInfo } from '../useApprovalInfo';

export default defineComponent({
  setup(props, ctx) {
    const { openDetailModal: _, ...rest } = useApprovalInfo(ctx);

    const listLogic = useList(1);

    const reloadSymbol = inject<Ref<number>>('reloadSymbol') ?? ref(0);

    watch(
      () => reloadSymbol.value,
      (val, prevVal) => {
        if (val !== prevVal) {
          listLogic.reset();
        }
      },
    );

    return {
      ...listLogic,
      ...rest,
    };
  },
});
