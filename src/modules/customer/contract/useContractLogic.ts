/**
 * 合同复用逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-08 10:45:52
 */

import { computed, ComputedRef, Ref, unref } from '@vue/composition-api';
import { Contract, ContractType } from '@/types/tiange/contract';

/** 合同类型&关联XX合同 映射 */
const Type2LabelMap = new Map([
  [ContractType.Sales, '关联框架合同'],
  [ContractType.Framework, '关联销售合同'],
  [ContractType.Purchase, '关联框架合同'],
  [ContractType.SupplierFramework, '关联采买合同'],
]);

// * 合同类型
// * 数据来源不定，存在未初始化的可能
type ContractOrNull = Contract | null | undefined;

/**
 * 关联合同相关数据逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-08 10:57:24
 */
export const useRelatedContract = (
  contract: ContractOrNull | Ref<ContractOrNull> | ComputedRef<ContractOrNull>,
) => {
  /** 解包出合同 */
  const unrefContract = computed(() => unref(contract));

  /** 关联XX合同 */
  const related_contract_label = computed(
    () => Type2LabelMap.get(unref(unrefContract.value)?.contract_info.contract_type ?? -1) ?? '',
  );

  /** 关联合同 */
  const related_contracts = computed(() => {
    const contract_info = unref(unrefContract.value)?.contract_info;
    if (contract_info === undefined) {
      return [];
    } else if (contract_info.frame_contract_id !== null) {
      // * 关联框架合同
      // * 在列表中会取不到 frame_contract_uid
      return [
        {
          id: contract_info.frame_contract_id,
          contract_uid: contract_info.frame_contract_uid,
          template_info: contract_info.template_info,
          frame_contract_type: contract_info.frame_contract_type,
        },
      ];
    } else {
      // * 关联销售(采买)合同
      return unref(unrefContract.value)?.contract_info.related_contracts ?? [];
    }
  });

  /** 是否包含关联合同 */
  const has_related_contracts = computed(() => related_contracts.value.length > 0);

  /** 生成关联合同详情访问地址 */
  const getContractLink = (contract: { contract_uid: string; id: number }) =>
    `/marketing/contract/customer/${contract.id}`;

  return {
    related_contract_label,
    related_contracts,
    has_related_contracts,
    getContractLink,
  };
};
