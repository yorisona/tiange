/** 固定资产 */

declare global {
  namespace M.fixedAssets {
    /** 资产费用 */
    interface AssetExpenses {
      add_by: number;
      amount: number;
      confirm_date: string;
      gmt_create: string;
      gmt_modified: string;
      id: number;
      modified_by: number;
      month: number;
      status: number;
      year: number;
    }
    /** 费用明细 */
    interface ExpenseDetails {
      add_by: number;
      add_by_name: null | string;
      amount: number;
      asset_code: string;
      asset_id: number;
      asset_model: string;
      asset_name: string;
      asset_usage_id: number;
      confirm_date: string;
      department_id: null | number;
      department_name: null | string;
      expense_type: number;
      flag: number;
      gmt_create: string;
      gmt_modified: string;
      id: number;
      image: string;
      modified_by: number;
      modified_by_name: null | string;
      month: number;
      project_id: number;
      project_name: string;
      status: number;
      year: number;
    }
    /** 资产盘点 */
    interface InventoryRecord {
      add_by: number;
      add_by_name: string;
      flag: number;
      gmt_create: string;
      gmt_modified: string;
      id: number;
      initiator_datetime: string;
      inventory_code: string;
      inventory_range: number;
      inventory_result: number;
      inventory_status: number;
      modified_by: number;
      modified_by_name: string;
      relation_data: {
        department_list: {
          department_id: number;
          department_name: string | null;
          inventory_id: number;
          relation_key: number;
        }[];
        project_list: any[];
      };
    }
  }
}
export {};
