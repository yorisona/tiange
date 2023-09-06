/*
 * @Author: 矢车
 * @Date: 2020-12-28 16:22:15
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-05 09:59:20
 * @Description: 系统设置接口api
 */
import qs from 'query-string';
import { getToken } from '@/utils/token';

// 用户管理-列表
import { ObjectFilterEmpty } from '@/utils/func';
import request from '@/utils/request';

// 用户管理-获取部门树
/** @deprecated */
export function getDepartmentTree() {
  return request({
    url: '/api/auth/get_department_tree',
    method: 'get',
  });
}

// 用户管理-获取飞书部门树
export function getFeishuDepartmentTree() {
  return request({
    url: '/api/auth/get_feishu_department_tree',
    method: 'get',
  });
}

// 用户管理-获取岗位数据
export function getJobList(params: Record<string, any>) {
  return request({
    url: '/api/auth/get_job_list',
    method: 'get',
    params: { ...ObjectFilterEmpty(params) },
  });
}

// 用户管理-保存用户
export function postSaveUser(data: Record<string, any>) {
  return request({
    url: '/api/auth/save_user',
    method: 'post',
    data: data,
  });
}

// 部门管理 - 删除部门
/** @deprecated */
export function postDelDepartment(id: number) {
  return request({
    url: `/api/auth/del_department/${id}/`,
    method: 'post',
  });
}

// 部门管理 - 新增/编辑部门
/** @deprecated */
export function postSaveDepartment(data: Record<string, any>) {
  return request({
    url: `/api/auth/save_department`,
    method: 'post',
    data: data,
  });
}

// userExport
export const userExport = (params: Record<string, any>) => {
  const props = ObjectFilterEmpty(params);
  const _paramsstr = qs.stringify(props);
  const token = getToken();
  window.open(
    `${process.env.VUE_APP_BASE_API}/api/auth/export_user_rights?${_paramsstr}&Authorization=${token}`,
  );
  // return request({
  //   url: `/api/auth/export_user_rights`,
  //   data: { ...ObjectFilterEmpty(params) },
  // });
};
