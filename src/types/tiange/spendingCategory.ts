/**
 * 会计科目
 */
export interface SpendingCategory {
  // 编码
  expense_category_code: string;
  // 科目名称
  expense_category_name: string;
  // 支出类别
  expense_types: string;
  // 状态
  is_active: boolean;
  id: number;
  key: string;
  expense_type_objs: AccountingSubjects[];
}

/**
 * 支出类别
 */
export interface AccountingSubjects {
  expense_category_code: string;
  expense_category_name: string;
  expense_type_biz_code: string;
  expense_type_name: string;
  is_active: boolean;
  id: number;
  /** 是否分摊 */
  is_allocated: boolean;
  subject_name: string;
  key: string;
}
