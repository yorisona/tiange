/**
 * 审批流程
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-29 23:08:41
 */
import { computed, h } from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import type { Step } from '@/components/Steps/steps';
import type { ApprovalInfo, ApprovalFlowDetail } from '@/types/tiange/workbench';

/**
 * ```
 * 读取工作台审批流数据
 * 并转换成步骤条可用数据
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-29 23:08:56
 */
export const useApproval = (ctx: SetupContext) => {
  const workbenchState = computed(() => ctx.root.$store.state.workbench);
  const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);

  const steps = computed<Step[]>(() => {
    const reverseApproval: ApprovalFlowDetail[] =
      approval.value?.approval_flow_detail.map(el => ({ ...el })).reverse() ?? [];
    const flows: Step[] = reverseApproval.map(el => {
      const result = el.approval_result
        ? el.approval_result === 1
          ? '（已同意）'
          : '（已拒绝）'
        : '';

      return {
        title: el.role_name,
        description: () =>
          h('div', [h('div', [`审批人：${el.operatorName}${result}`]), h('div', [el.operateDate])]),
      };
    });

    if (approval.value?.approval_status === 1) {
      // 审批中附加下一节点审批人信息
      const lastNode = reverseApproval[reverseApproval.length - 1];
      flows.push({
        title: lastNode.receivedPersons,
        description: '',
      });
    } else if (approval.value?.approval_status === 4) {
      // 撤销附加撤销人操作信息
      flows.push({
        title: '申请人',
        description: () =>
          h('div', [
            h('div', [approval.value?.username + '（已撤销）']),
            h('div', [approval.value?.gmt_modified]),
          ]),
      });
    }

    return flows;
  });

  // 无数据索引 0
  // 审批中最后一个节点是当前处理中节点故索引减1
  // 其余均等同流程长度，完成
  const activeNumber = computed(() =>
    approval.value === undefined
      ? 0
      : approval.value?.approval_status === 1
      ? steps.value.length - 1
      : steps.value.length,
  );

  return {
    steps,
    activeNumber,
  };
};
