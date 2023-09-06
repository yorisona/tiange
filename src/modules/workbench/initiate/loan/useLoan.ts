/**
 * 用款申请相关
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-19 11:32:08
 */
import { computed, ref } from '@vue/composition-api';
import { ApprovalInfo } from '@/types/tiange/workbench';
import { GetApprovalInfo } from '@/services/workbentch';

export const useLoan = () => {
  /** 审批单详情 */
  const approvalInfo = ref<ApprovalInfo | undefined>(undefined);

  /** 获取详情 */
  const fetchApprovalInfo = async (approval_id: number) => {
    const { data: response } = await GetApprovalInfo({ approval_id });

    if (response.success) {
      approvalInfo.value = response.data;
    }
  };

  /** 步骤 */
  const step_status = computed(() => {
    if (approvalInfo.value === undefined) {
      return 0;
    } else if ([2, 3].includes(approvalInfo.value?.approval_status ?? -1)) {
      return approvalInfo.value.steps + 1;
    } else {
      return approvalInfo.value.steps;
    }
  });

  return { approvalInfo, step_status, fetchApprovalInfo };
};
