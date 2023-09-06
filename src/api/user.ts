/*
 * @Author: Administrator
 * @Date:   2018-08-20 15:24:06
 * @Last Modified by:   Administrator
 * @Last Modified time: 2018-08-20 15:26:18
 */
// @ts-nocheck
import request from '@/utils/request';

export function queryUser(userpass) {
  return request({
    url: '/api/auth/query_user',
    method: 'get',
    params: userpass,
  });
}

export function UpdateUser(userpass) {
  return request({
    url: '/api/auth/update_user',
    method: 'post',
    data: userpass,
  });
}

// 删除禁用的用户
export function deleteUser(data) {
  return request({
    url: '/api/auth/delete_user',
    method: 'post',
    data: data,
  });
}
