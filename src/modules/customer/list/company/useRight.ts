/**
 * 公司模块权限
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 14:23:36
 */
import { computed, ComputedRef, SetupContext } from '@vue/composition-api';
import { useRoleRight } from '@/use/roleRight';

export interface CompanyRights {
  /** 是否可以查看公司列表 */
  hasRightViewCompany: ComputedRef<boolean>;
  /** 是否可以新增公司 */
  hasRightAddCompany: ComputedRef<boolean>;
  /** 是否可以导出公司 */
  hasRightExportCompany: ComputedRef<boolean>;
  /** 是否可以删除公司管理 */
  hasRightDelCompany: ComputedRef<boolean>;
  /** 是否可以修改公司管理 */
  hasRightUpdateCompany: ComputedRef<boolean>;
  /** 复选框是否可见(导出或删除) */
  hasCheckboxRight: ComputedRef<boolean>;
  /** 是否仅有删除(无导出) --- 仅删除可以禁用不可删除公司 */
  hasOnlyDeleteRight: ComputedRef<boolean>;
}

export const useCompanyRight = (ctx: SetupContext): CompanyRights => {
  const { hasRight, RIGHT_CODE } = useRoleRight(ctx);

  /** 是否可以查看公司列表 */
  const hasRightViewCompany = computed(() => hasRight(RIGHT_CODE.VIEW_CUSTOMER_COMPANY));

  /** 是否可以新增公司 */
  const hasRightAddCompany = computed(() => hasRight(RIGHT_CODE.ADD_CUSTOMER_COMPANY));

  /** 是否可以导出公司 */
  const hasRightExportCompany = computed(() => hasRight(RIGHT_CODE.EXPORT_CUSTOMER_COMPANY));

  /** 是否可以删除公司管理 */
  const hasRightDelCompany = computed(() => hasRight(RIGHT_CODE.DEL_CUSTOMER_COMPANY));

  /** 是否可以修改公司管理 */
  const hasRightUpdateCompany = computed(() => hasRight(RIGHT_CODE.UPDATE_CUSTOMER_COMPANY));

  // 复合权限

  /** 复选框是否可见(导出或删除) */
  const hasCheckboxRight = computed(() => hasRightDelCompany.value || hasRightExportCompany.value);

  /** 是否仅有删除(无导出) --- 仅删除可以禁用不可删除公司 */
  const hasOnlyDeleteRight = computed(
    () => hasRightDelCompany.value && !hasRightExportCompany.value,
  );

  return {
    hasRightViewCompany,
    hasRightAddCompany,
    hasRightExportCompany,
    hasRightDelCompany,
    hasRightUpdateCompany,
    hasCheckboxRight,
    hasOnlyDeleteRight,
  };
};
