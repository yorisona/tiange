/**
 * oa审批流
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-02 13:08:35
 */

import { computed, defineComponent, inject, PropType, ref, Ref } from '@vue/composition-api';
import { ApprovalFlow } from '@/types/oa/approval';
import { ApprovalStatus } from '@/types/tiange/system';

export default defineComponent({
  props: {
    /** 移除OA审批流节点名称中自带的序号 */
    removeOaNodeNameIndex: {
      type: Boolean,
      default: false,
    },
    /** 状态 */
    status: {
      type: Number as PropType<ApprovalStatus>,
    },
  },
  setup(props) {
    /** 原始oa流程数据 */
    const originalFlows = inject<Ref<ApprovalFlow[]>>('flows') ?? ref<ApprovalFlow[]>([]);
    /** 流程接收人员 */
    const receivedPersons = originalFlows.value[originalFlows.value.length - 1]?.receivedPersons;
    /** 流程是否失败 */
    const isFailure = computed(() => props.status === ApprovalStatus.Failure);
    /** 流程是否进行中 */
    const isProcessing = computed(() => props.status === ApprovalStatus.Processing);
    /** 流程节点长度 */
    const length =
      originalFlows.value.length + (receivedPersons !== '' && !isFailure.value ? 1 : 0);
    /** 获取拒绝理由或备注 */
    const get_node_result = (node: ApprovalFlow) => node.oa_review_result ?? node.remark;

    return {
      flows: computed(() =>
        originalFlows.value
          .map(el =>
            props.removeOaNodeNameIndex
              ? {
                  ...el,
                  nodeName: el.nodeName.replace(/^\d+\./u, ''),
                }
              : el,
          )
          .map((el, index) => {
            const isFinishNode = index < originalFlows.value.length - 1;
            const isFailureNode = !isFinishNode && isFailure.value;

            return {
              ...el,
              isFinishNode,
              isFailureNode,
            };
          })
          .reverse(),
      ),
      receivedPersons,
      length,
      get_node_result,
      isProcessing,
    };
  },
});
