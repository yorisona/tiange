import request from '@/utils/request';

// 新增跟进任务
export function AddFollowTask(data: Record<string, any>) {
  return request({
    url: '/api/sales_manage/follow_missions',
    method: 'post',
    data: data,
  });
}
