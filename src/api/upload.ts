// @ts-nocheck
import request from '@/utils/request';

export function queryLog(logpass) {
  return request({
    url: '/api/upload/query_log',
    method: 'get',
    params: logpass,
  });
}
export function uploadFile(logpass) {
  return request({
    url: '/api/upload/upload_file',
    method: 'post',
    data: logpass,
  });
}
