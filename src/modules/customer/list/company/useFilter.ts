/**
 * 筛选项表单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 10:48:26
 */

import { CompanyListQueryForm } from '@/types/tiange/company';
import { reactive } from '@vue/composition-api';

/**
 * 筛选项表单区块逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 13:12:26
 */
export const useFilter = () => {
  /** 公司列表筛选项表单 */
  const filterForm = reactive<CompanyListQueryForm>({
    company_name: '',
    page_num: 1,
    num: 20,
    verify_status: '',
  });

  /** 获取公司列表查询参数(从表单转化) */
  const getParams = () => ({ ...filterForm });

  /** 重置公司列表筛选项表单(不包括分页) */
  const resetForm = () => {
    filterForm.company_name = '';
    filterForm.verify_status = '';
  };

  return {
    filterForm,
    resetForm,
    getParams,
  };
};
