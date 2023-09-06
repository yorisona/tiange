import { ObjectFilterEmpty } from '@/utils/func';
import { ListResponse, HttpResponse } from '@/types/base/http';
import { Get, Post } from '@/utils/request';
import { IGPageQuery } from '@/types/tiange/general';

/** 资产归还列表 */
export const QueryFixedAssetReturnRecord = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_return_record', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
        ...pager,
      }),
    },
  });

/** 资产归还审批**/
export const ApproveForFixedAssetReturnRecord = async (payload: {
  asset_relation_list: {
    receive_status: number;
    return_status: number;
  }[];
  id: number;
}): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/approve_for_fixed_asset_return_record`, ObjectFilterEmpty(payload));

/** 查询资产分配记录 */
export const QueryFixedAssetAllocationRecord = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_allocation_record', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
        ...pager,
      }),
    },
  });

/** 查询资产维修记录 */
export const QueryFixedAssetMaintenanceRecord = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_maintenance_record', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
        ...pager,
      }),
    },
  });

/** 查询资产报废记录 */
export const QueryFixedAssetScrappedRecord = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_scrapped_record', {
    params: {
      ...ObjectFilterEmpty({
        ...payload,
        ...pager,
      }),
    },
  });

/** 资产维修审批**/
export const ApproveForFixedAssetMaintenanceRecord = async (payload: {
  id: number;
  maintenance_amount: number;
}): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/approve_for_fixed_asset_maintenance_record`, ObjectFilterEmpty(payload));
/** 查询资产类型列表 */
export const QueryFixedAssetType = async (
  payload?: any,
): Promise<
  HttpResponse<
    {
      asset_type_code: string;
      asset_type_name: string;
      billing_plan: string;
      id: number;
    }[]
  >
> =>
  Get('/api/fixed_asset/query_fixed_asset_type', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 查询资产分类列表 */
export const QueryFixedAssetClass = async (
  payload?: any,
): Promise<
  HttpResponse<
    {
      asset_class_code: string;
      asset_class_name: string;
      billing_plan: string;
      id: number;
      asset_class_age: number;
    }[]
  >
> =>
  Get('/api/fixed_asset/query_fixed_asset_class', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 查询资产存放列表 */
export const QueryFixedAssetWarehousePosition = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_warehouse_position', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });
/** 查询资产管理列表 */
export const QueryFixedAssetList = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_list', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 可发起维修的资产列表 */
export const QueryFixedAssetListAllowReturn = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_list/allow_return', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 可发起报废的资产列表	 */
export const QueryallowScrapped = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_list/allow_scrapped', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 新增/编辑资产信息**/
export const InsertOrUpdateFixedAsset = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/insert_or_update_fixed_asset`, ObjectFilterEmpty(payload));

/** 资产盘盈处理**/
export const ProfitFixedAssetInventoryDetail = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/profit_fixed_asset_inventory_detail`, ObjectFilterEmpty(payload));

/** 资产盘亏处理**/
export const LossFixedAssetInventoryDetail = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/loss_fixed_asset_inventory_detail`, ObjectFilterEmpty(payload));

/** 新增/编辑资产分类**/
export const InsertOrUpdateFixedAssetClass = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/batch_operate_fixed_asset_class`, {
    data: payload,
  });

/** 批量新增/编辑/删除资产类型**/
export const BatchOperateFixedAssetType = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/batch_operate_fixed_asset_type`, {
    data: payload,
  });

/** 新增/编辑存放地址**/
export const InsertOrUpdateFixedAssetWarehousePosition = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Post(
    `/api/fixed_asset/insert_or_update_fixed_asset_warehouse_position`,
    ObjectFilterEmpty(payload),
  );

/** 删除存放地址**/
export const DeleteFixedAssetWarehousePosition = async (payload: {
  id: number;
}): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/delete_fixed_asset_warehouse_position`, ObjectFilterEmpty(payload));

/** 锁定/解锁**/
export const FixedAssetReceiveLockOrUnlock = async (payload: {
  asset_id_list: number | number[];
  lock_or_unlock: number; //锁定状态；0-解锁，1-锁定
}): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/fixed_asset_receive_lock_or_unlock`, ObjectFilterEmpty(payload));

/** 资产分配申请**/
export const ApplyForFixedAssetAllocationRecord = async (payload: {
  asset_id_list: number[];
  department_id?: number;
  project_id?: number;
  user_id: number;
}): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/apply_for_fixed_asset_allocation_record`, ObjectFilterEmpty(payload));

/** 资产维修申请**/
export const ApplyForFixedAssetMaintenanceRecord = async (payload: {
  asset_id: number;
  company_id?: number;
  user_id: number;
}): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/apply_for_fixed_asset_maintenance_record`, ObjectFilterEmpty(payload));

/** 发起资产报废申请**/
export const ApplyForFixedAssetScrappedRecord = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/apply_for_fixed_asset_scrapped_record`, ObjectFilterEmpty(payload));

/** 资产领用	列表 */
export const QueryFixedAssetReceiveRecord = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_receive_record', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 资产领用审批**/
export const ApproveForFixedAssetReceiveRecord = async (payload: {
  asset_relation_list: {
    receive_status: number;
    relation_id: number;
  }[];
  id: number;
}): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/approve_for_fixed_asset_receive_record`, ObjectFilterEmpty(payload));

// 我的资产
/** 查询资产管理列表 */
export const QueryUsedFixedAssetList = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_used_fixed_asset_list/self', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 查询部门资产管理列表 */
export const QueryUsedFixedAssetListDepartment = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_used_fixed_asset_list/self_department', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 查询我的领用资产管理列表 */
export const QueryFixedAssetListAllowUse = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_list/allow_use', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 查询我的申请资产管理列表 */
export const QueryFixedAssetReceiveRecordSelf = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_receive_record/self', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });
/** 个人修改资产存放地点**/
export const UpdateSelfFixedAssetPositionSelf = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/update_self_fixed_asset_position/self`, ObjectFilterEmpty(payload));

/** 部门修改资产存放地点**/
export const UpdateSelfFixedAssetPositionSelfDepartment = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Post(
    `/api/fixed_asset/update_self_fixed_asset_position/self_department`,
    ObjectFilterEmpty(payload),
  );
/** 归还**/
export const ApplyForFixedAssetReturnRecord = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/apply_for_fixed_asset_return_record/self`, ObjectFilterEmpty(payload));

/** 部门归还**/
export const ApplyForFixedAssetReturnRecordDepartment = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Post(
    `	/api/fixed_asset/apply_for_fixed_asset_return_record/self_department`,
    ObjectFilterEmpty(payload),
  );

/** 调拨**/
export const ApplyForFixedAssetAllocationRecordSelf = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/apply_for_fixed_asset_allocation_record/self`, ObjectFilterEmpty(payload));

/** 部门调拨**/
export const ApplyForFixedAssetAllocationRecordSelfDepartment = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Post(
    `/api/fixed_asset/apply_for_fixed_asset_allocation_record/self_department	`,
    ObjectFilterEmpty(payload),
  );

/** 申请领用**/
export const ApplyForFixedAssetReceiveRecord = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/apply_for_fixed_asset_receive_record`, ObjectFilterEmpty(payload));

/** ------资产费用 */

/** 查询资产月度费用列表 */
export const QueryFixedAssetAmountConfirmMonth = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_amount_confirm_month', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 查询资产月度费用明细 */
export const QueryFixedAssetAmountDetailRecord = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_amount_detail_record', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 费用明细新增/编辑**/
export const InsertOrUpdateFixedAssetAmountDetailRecord = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Post(
    `/api/fixed_asset/insert_or_update_fixed_asset_amount_detail_record`,
    ObjectFilterEmpty(payload),
  );

/** 费用明细删除**/
export const DeleteFixedAssetAmountDetailRecord = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/delete_fixed_asset_amount_detail_record`, ObjectFilterEmpty(payload));

/** 费用明细月度费用确认**/
export const ConfirmMonthFixedAssetAmount = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/confirm_month_fixed_asset_amount`, ObjectFilterEmpty(payload));

/** 资产盘点-------------**/

/** 查询盘点列表 */
export const QueryFixedAssetInventoryRecord = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_inventory_record', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 发起盘点**/
export const InitiateFixedAssetInventory = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/initiate_fixed_asset_inventory`, ObjectFilterEmpty(payload));

/** 删除盘点**/
export const DeleteFixedAssetInventory = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/delete_fixed_asset_inventory`, ObjectFilterEmpty(payload));

/** 查询盘点详情列表 */
export const QueryFixedAssetInventoryDetail = async (
  pager?: IGPageQuery,
  payload?: any,
): Promise<ListResponse<any>> =>
  Get('/api/fixed_asset/query_fixed_asset_inventory_detail', {
    params: {
      ...ObjectFilterEmpty({
        ...pager,
        ...payload,
      }),
    },
  });

/** 删除存放地址**/
export const GetFixedAssetDetail = async (payload: { id: number }): Promise<HttpResponse<any>> =>
  Get(`/api/fixed_asset/get_fixed_asset_detail`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 资产盘亏处理**/
export const CompleteFixedAssetInventory = async (payload: any): Promise<HttpResponse<any>> =>
  Post(`/api/fixed_asset/complete_fixed_asset_inventory`, ObjectFilterEmpty(payload));

/**------------------ 资产统计 */

/** 资产使用饼图**/
export const QueryFixedAssetUsedStatistics = async (payload: {
  search_type: 1 | 2;
}): Promise<HttpResponse<any>> =>
  Get(`/api/fixed_asset/kanban/query_fixed_asset_used_statistics`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 资产分布饼图**/
export const QueryFixedAssetProjectDepartmentUsedStatistics = async (payload: {
  search_type: 1 | 2;
}): Promise<HttpResponse<any>> =>
  Get(`/api/fixed_asset/kanban/query_fixed_asset_project_department_used_statistics`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 看板页面，查询资产统计**/
export const QueryFixedAssetStatisticsRecord = async (payload: {
  year: string;
  month?: string;
}): Promise<HttpResponse<any>> =>
  Get(`/api/fixed_asset/kanban/query_fixed_asset_statistics_record`, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
