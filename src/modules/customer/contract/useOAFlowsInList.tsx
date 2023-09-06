/**
 * 列表内使用OA审批流
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-07 13:58:33
 */

import { h, provide, ref } from '@vue/composition-api';
import {
  GetAssociateContractApprovalFlow,
  GetContractAnnexApprovalFlow,
  GetContractApprovalFlow,
  GetContractStatementsApprovalFlow,
} from '@/services/contract';
import { ApprovalFlow } from '@/types/oa/approval';
import { sleep } from '@/utils/func';
import { useCache } from '@/use/cache';
import { ApprovalStatus } from '@/types/tiange/system';

const fetchFnMap = new Map([
  ['contract', GetContractApprovalFlow],
  ['annex', GetContractAnnexApprovalFlow],
  ['statement', GetContractStatementsApprovalFlow],
]);

export const useOAFlows = (
  type: 'contract' | 'annex' | 'statement' = 'contract',
  isAssociate = false,
) => {
  const { getCache, setCache } = useCache<ApprovalFlow[]>();
  const flows = ref<ApprovalFlow[]>([]);
  const flowsLoading = ref(false);
  const flowsError = ref('');
  provide('flows', flows);

  /** 获取OA数据流 */
  const fetchContractApprovalFlow = async (id: number, project_uid?: string) => {
    flowsLoading.value = true;
    const [{ data: response }, _] = await Promise.all([
      !isAssociate
        ? await (fetchFnMap.get(type) ?? GetContractApprovalFlow)(id)
        : await GetAssociateContractApprovalFlow({
            contract_id: id,
            project_uid: project_uid || '',
          }),
      await sleep(200),
    ]);
    flowsLoading.value = false;
    if (response.success) {
      const flowsData = response.data;
      setCache(id, flowsData);
      flowsError.value = '';
      return flowsData;
    } else {
      flowsError.value = response.message;
    }
  };

  /** 显示 */
  const onFlowsShow = async (id: number, project_uid?: string) => {
    flows.value = [];
    const checkedFlow = getCache(id) ?? (await fetchContractApprovalFlow(id, project_uid));
    if (checkedFlow !== undefined) {
      flows.value = checkedFlow;
    }
  };

  /** 隐藏 */
  const onFlowsHide = () => {
    flowsError.value = '';
    flowsLoading.value = false;
  };

  /** 审批流渲染函数 */
  const oaflowsRender = (status: number) => {
    const failure = status === ApprovalStatus.Failure;
    const receivedPersons = flows.value[flows.value.length - 1]?.receivedPersons;
    const length = flows.value.length + (receivedPersons !== '' && !failure ? 1 : 0);

    return h(
      'div',
      {
        class: ['oa-flows-new'],
      },
      [
        <div class="oa-flows-hd">审批进度</div>,
        <div class="oa-flows-bd" style="overflow-x: hidden !important;margin-top:4px;">
          <el-steps direction="vertical" active={length}>
            {flows.value.map((node, index) => {
              const isFinishNode = index < flows.value.length - 1;
              const isFailureNode = !isFinishNode && failure;

              const iconNode = isFailureNode ? (
                <tg-icon slot="icon" name="ico-cross-red" style="font-size: 12px" />
              ) : (
                <tg-icon slot="icon" name="ico-right" style="font-size: 12px" />
              );
              let stepClass = '';
              if (receivedPersons !== '' && !failure) {
                stepClass = 'oa-flow-step-padding-bottom';
              }
              return (
                <el-step class={stepClass} key={index} status={isFailureNode ? 'error' : 'finish'}>
                  {iconNode}
                  <div
                    slot="description"
                    class="oa-flow-content"
                    style="height:18px;line-height:18px;margin-top:12px !important；color:var(--text-color);"
                  >
                    {node.nodeName}
                  </div>
                  <div
                    slot="description"
                    class="oa-flow-content mgt-6"
                    style="height:18px;line-height:18px"
                  >
                    <span style="color: #6A7B92">审批人：{node.operatorName}</span>
                  </div>
                  {isFailureNode && (node.oa_review_result || node.remark) ? (
                    <div
                      slot="description"
                      class="oa-flow-content mgt-6"
                      style="line-height:18px;color:var(--error-color)"
                    >
                      <span class="error-reason">{node.oa_review_result ?? node.remark}</span>
                    </div>
                  ) : (
                    ''
                  )}
                  {!isFailureNode ? (
                    <div slot="description" style="color:#A4B2C2" class="oa-flow-footer mgt-6">
                      {node.operateDate} {node.operateTime}
                    </div>
                  ) : (
                    ''
                  )}
                </el-step>
              );
            })}
            {receivedPersons !== '' && !failure ? (
              <el-step status="wait">
                <div slot="icon" style="font-size: 12px;color:#A4B2C2;">
                  <div style="width:30px;text-align: center;">{flows.value.length + 1}</div>
                </div>
                <div slot="description" class="oa-flow-content wait">
                  <div style="color:#A4B2C2">{receivedPersons}</div>
                  <div class="mgt-6" style="color:#A4B2C2">
                    待处理
                  </div>
                </div>
              </el-step>
            ) : (
              ''
            )}
          </el-steps>
        </div>,
      ],
    );
  };

  return {
    flowsError,
    flowsLoading,
    oaflowsRender,
    onFlowsHide,
    onFlowsShow,
  };
};
