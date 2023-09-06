/**
 * 筛选项
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 01:27:12
 */
import { reactive, ref } from '@vue/composition-api';
import { ApprovalListQueryForm } from '@/types/tiange/workbench';
import { APPROVAL_TYPE } from '@/types/tiange/workbench.enum';

/**
 * 筛选项区块
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 01:47:50
 */
export const useWorkbenchFilterBlock = () => {
  /** 筛选项表单 */
  const queryForm = reactive<ApprovalListQueryForm>({
    approval_type: undefined,
    approval_uid: '',
    start_time: [],
    project_name: '',
    file_name: '',
    end_time: [],
    approval_status: undefined,
    page_num: 1,
    num: 20,
  });

  /** 获取筛选项表单转换的参数 */
  const getQueryParams = () => {
    const { start_time, end_time, ...rest } = queryForm;
    const [start_time_min, start_time_max] = start_time;
    const [end_time_min, end_time_max] = end_time;

    if (start_time.length > 0 && end_time.length > 0) {
      return { ...rest, start_time_min, start_time_max, end_time_min, end_time_max };
    } else if (start_time.length > 0) {
      return { ...rest, start_time_min, start_time_max };
    } else {
      return { ...rest, end_time_min, end_time_max };
    }
  };

  /**
   * 重置表单数据
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-11-18 01:48:46
   */
  const resetForm = () => {
    queryForm.approval_type = undefined;
    queryForm.approval_uid = '';
    queryForm.start_time = [];
    queryForm.end_time = [];
    queryForm.approval_status = undefined;
    queryForm.page_num = 1;
    queryForm.project_name = '';
    queryForm.file_name = '';
    queryForm.num = 20;
  };

  const typeOptions = ref([
    { value: '', label: '全部' },
    { value: APPROVAL_TYPE.loan, label: '对外付款' },
    { value: APPROVAL_TYPE.refund, label: '退款申请' },
    { value: APPROVAL_TYPE.advance, label: '垫款申请' },
    { value: APPROVAL_TYPE.invoicing, label: '开票申请' },
    { value: APPROVAL_TYPE.void, label: '发票作废申请' },
    { value: APPROVAL_TYPE.red, label: '开红票申请' },
    { value: APPROVAL_TYPE.customer, label: '客户结算单' },
    { value: APPROVAL_TYPE.supplier, label: '供应商结算单' },
    { value: APPROVAL_TYPE.use_seal, label: '非合同类用印' },
    { value: APPROVAL_TYPE.project_approval, label: '立项审批' },
    { value: APPROVAL_TYPE.project_end, label: '项目终止审批' },
    { value: APPROVAL_TYPE.asset_scrapped, label: '固定资产审批' },
  ]);

  return { queryForm, getQueryParams, resetForm, typeOptions };
};
