import request from '@/utils/request';

// 获取详情
export function GetDetail(id: number) {
  return request({
    url: `/api/sales_manage/follow_missions/${id}`,
    method: 'get',
  });
}

// 获取跟进列表
export function GetFollowList(params: Record<string, any>) {
  return request({
    url: '/api/sales_manage/follow_logs',
    method: 'get',
    params: params,
  });
}

// 新增跟进记录
export function AddFollowLog(data: Record<string, any>) {
  return request({
    url: '/api/sales_manage/follow_logs',
    method: 'post',
    data: data,
  });
}

// 编辑跟进任务
export function EditFollow(data: Record<string, any>) {
  return request({
    url: `/api/sales_manage/follow_missions/${data.mission_id}`,
    method: 'post',
    data: data,
  });
}

// 获取客户经理列表
export function GetCustomerManagerList(params: Record<string, any>) {
  return request({
    url: '/api/auth/get_user_by_role',
    method: 'get',
    params: params,
  });
}

// 获取客户列表
export function GetCustomerList(params: Record<string, any>) {
  return request({
    url: '/api/cust/get_shop_and_brand',
    method: 'get',
    params: params,
  });
}

// 重新指派
export function Reassign(data: Record<string, any>) {
  return request({
    url: `/api/sales_manage/follow_missions/${data.mission_id}/reallocate?customer_manager_uid=${data.customer_manager_uid}`,
    method: 'put',
  });
}

// 关闭跟进任务
export function CloseFollow(data: Record<string, any>) {
  return request({
    url: `/api/sales_manage/follow_missions/${data.mission_id}/close?status=${data.status}`,
    method: 'put',
  });
}
