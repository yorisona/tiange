/*
 * @Author: 矢车
 * @Date: 2021-01-11 11:09:44
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-20 10:41:53
 * @Description: 店铺代播
 */
import request from '@/utils/request';

// 项目完结 - 项目详情
export function postEndProject(
  data: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
) {
  return request({
    url:
      business_type === E.project.BusinessType.supplyChain
        ? '/api/shop_live/end_supply_chain_project'
        : business_type === E.project.BusinessType.locallife
        ? '/api/shop_live/end_local_life_project'
        : business_type === E.project.BusinessType.s2b2c
        ? '/api/shop_live/end_common_project '
        : '/api/shop_live/end_project',
    method: 'post',
    data: data,
  });
}
// 项目完结 - 项目详情
export function postEndMcnProject(data: Record<string, any>) {
  return request({
    url: '/api/shop_live/end_common_project',
    method: 'post',
    data: data,
  });
}
// 试播结束
export function postUpdataProjectTryLive(
  data: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
) {
  return request({
    url:
      business_type === E.project.BusinessType.supplyChain
        ? '/api/shop_live/update_project_try_live/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/api/shop_live/update_project_try_live/local_life'
        : '/api/shop_live/update_project_try_live',
    method: 'post',
    data: data,
  });
}

// 区域执行下拉搜索
export function getCompanyName(params: Record<string, any>) {
  return request({
    url: '/api/medium/get_company_name_and_id',
    method: 'get',
    params: params,
  });
}

// 区域执行
export function postCompanyName(
  data: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
) {
  return request({
    url:
      business_type === E.project.BusinessType.supplyChain
        ? '/api/shop_live/update_area_execute/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/api/shop_live/update_area_execute/local_life'
        : '/api/shop_live/update_area_execute',
    method: 'post',
    data: data,
  });
}

// 主播排班 - 检查kol排期是否有冲突
/** @deprecated */
export function getCheckKol(data: Record<string, any>) {
  return request({
    url: '/api/shop_live/check_kol_schedule',
    method: 'post',
    data: data,
  });
}

// 主播排班 - 点击保存
/** @deprecated */
export function postSaveKol(
  data: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
) {
  return request({
    url:
      business_type === E.project.BusinessType.supplyChain
        ? '/api/shop_live/save_kol_schedule/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/api/shop_live/save_kol_schedule/local_life'
        : '/api/shop_live/save_kol_schedule',
    method: 'post',
    data: data,
  });
}

// 运营助理排班 - 获取运营助理
/** @deprecated */
export function getKolName(params: Record<string, any>) {
  return request({
    url: '/api/auth/get_user_by_role',
    method: 'get',
    params: params,
  });
}

// 运营助理排班 - 检查运营助理排期是否有冲突
/** @deprecated */
export function getCheckOperator(data: Record<string, any>) {
  return request({
    url: '/api/shop_live/check_operator_schedule',
    method: 'post',
    data: data,
  });
}

// 运营助理排班 - 点击保存
/** @deprecated */
export function postSaveOperate(
  data: Record<string, any>,
  business_type: number | undefined = E.project.BusinessType.douyin,
) {
  return request({
    url:
      business_type === E.project.BusinessType.supplyChain
        ? '/api/shop_live/save_operator_schedule/supply_chain'
        : business_type === E.project.BusinessType.locallife
        ? '/api/shop_live/save_operator_schedule/local_life'
        : '/api/shop_live/save_operator_schedule',
    method: 'post',
    data: data,
  });
}
