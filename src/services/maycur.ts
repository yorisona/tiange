import { HttpResponse, ListResponse } from '@/types/base/http';
import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import { SpendingCategory, AccountingSubjects } from '@/types/tiange/spendingCategory';
import { IGPageQuery } from '@/types/tiange/general';

// 会计科目列表
export const MaycurListExpenseCategories = (
  pager: IGPageQuery = {} as IGPageQuery,
  payload?: {
    expense_category_name?: string;
    expense_type_name?: string;
  },
): Promise<ListResponse<SpendingCategory>> =>
  Get('/api/maycur/list_expense_categories', {
    params: {
      ...ObjectFilterEmpty(pager),
      ...ObjectFilterEmpty(payload || {}),
    },
  });
// 会计科目保存 /编辑
export const MaycurSaveExpenseCategory = (
  payload: Pick<
    SpendingCategory,
    'id' | 'expense_category_code' | 'expense_category_name' | 'is_active'
  >,
): Promise<HttpResponse<SpendingCategory[]>> =>
  Post('/api/maycur/save_expense_category', ObjectFilterEmpty(payload));

type IGPageQueryAndActive = IGPageQuery & { is_active?: number };
// 支出类别
export const MaycurListExpenseTypes = (
  payload: IGPageQueryAndActive = {} as IGPageQueryAndActive,
): Promise<ListResponse<AccountingSubjects>> =>
  Get('/api/maycur/list_expense_types', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 支出类别 保存 /编辑
export const MaycurSaveExpenseType = (
  payload: Pick<
    AccountingSubjects,
    | 'id'
    | 'expense_type_biz_code'
    | 'expense_type_name'
    | 'expense_category_code'
    | 'is_active'
    | 'is_allocated'
  >,
): Promise<ListResponse<AccountingSubjects>> =>
  Post('/api/maycur/save_expense_type', ObjectFilterEmpty(payload));

// 查询管报科目接口
export const query_report_subject = (
  pager: IGPageQuery,
  payload?: {
    // 科目名称
    subject_name?: string;
  },
): Promise<ListResponse<any>> =>
  Get('/api/maycur/query_report_subject', {
    params: {
      ...ObjectFilterEmpty(pager),
      ...ObjectFilterEmpty(payload || {}),
    },
  });

// 新增/修改管报科目
export const add_report_subject = (
  type: 'add' | 'update',
  payload: {
    subject_name: string;
    // update 时必须带上
    old_subject_name?: string;
    expense_type_biz_codes: string[];
  },
): Promise<HttpResponse<any>> =>
  Post(
    type === 'add' ? '/api/maycur/add_report_subject' : '/api/maycur/update_report_subject',
    ObjectFilterEmpty(payload),
  );

// 删除管报科目
export const delete_report_subject = (payload: {
  subject_name: string;
}): Promise<HttpResponse<any>> =>
  Post('/api/maycur/delete_report_subject', ObjectFilterEmpty(payload));
