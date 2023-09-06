/*
 * @Description: 品牌需求相关接口
 * @Author: 白青
 * @Date: 2019-08-05 19:45:38
 * @LastEditTime: 2019-09-06 16:26:43
 * @LastEditors: 白青
 */
// @ts-nocheck
import request from '@/utils/request';

export function saveRequirment(requirementpass) {
  return request({
    url: '/api/brand/save_requirement',
    method: 'post',
    data: requirementpass,
  });
}
export function queryResidualCost(costpass) {
  return request({
    url: '/api/brand/query_residual_cost',
    method: 'get',
    params: costpass,
  });
}
// export function updateRequirement (requirementpass) {
//   return request({
//     url: '/api/brand/update_requirement',
//     method: 'post',
//     data: requirementpass
//   })
// }
export function uploadRequirementProduct(file) {
  return request({
    url: '/api/brand/upload_requirement_product',
    method: 'post',
    data: file,
  });
}
export function queryRequirementProduct(requirementid) {
  return request({
    url: '/api/brand/query_requirement_product',
    method: 'get',
    params: requirementid,
  });
}
export function updateRequirementProduct(requirementpass) {
  return request({
    url: '/api/brand/update_requirement_product',
    method: 'post',
    data: requirementpass,
  });
}
export function delRequirementProduct(productid) {
  return request({
    url: '/api/brand/del_requirement_product',
    method: 'get',
    params: productid,
  });
}
export function blurUpdateProductCost(requirementpass) {
  return request({
    url: '/api/brand/update_requirement_product_cost',
    method: 'post',
    data: requirementpass,
  });
}

export function queryRequirement(requirementpass) {
  return request({
    url: '/api/brand2/query_requirements',
    method: 'get',
    params: requirementpass,
  });
}
export function deleteRequirement(delpass) {
  return request({
    url: '/api/brand2/delete_requirement',
    method: 'post',
    data: delpass,
  });
}
// 获取品牌列表
export function queryBrand(brandpass) {
  return request({
    url: '/api/brand2/query_brand',
    method: 'get',
    params: brandpass,
  });
}
// 更新品牌
export function updateBrand(brandpass) {
  return request({
    url: '/api/brand2/update_brand',
    method: 'post',
    data: brandpass,
  });
}
// 创建品牌
export function createBrand(brandpass) {
  return request({
    url: '/api/brand2/create_brand',
    method: 'post',
    data: brandpass,
  });
}
// 品牌是否已存在
export function getCategories() {
  return request({
    url: '/api/brand2/query_categories',
    method: 'get',
  });
}
export function getAnchors(conditions) {
  return request({
    url: '/api/brand2/query_stars',
    method: 'get',
    params: conditions,
    timeout: 20000,
  });
}
export function getBrandList(conditions) {
  return request({
    url: '/api/brand2/query_brand',
    method: 'get',
    params: conditions,
  });
}
export function createRequirement(formdata) {
  return request({
    url: '/api/brand2/create_requirement',
    method: 'post',
    data: formdata,
  });
}
export function saveRequirementPlan(formdata) {
  return request({
    url: '/api/brand2/update_requirement_plan',
    method: 'post',
    data: formdata,
  });
}
export function brandNameExists(brandpass) {
  return request({
    url: '/api/brand2/brand_name_exists',
    method: 'get',
    params: brandpass,
  });
}
// export function getRequirementDetail (formdata) {
//   return request({
//     url: '/api/brand2/requirement_detail',
//     method: 'get',
//     params: formdata
//   })
// }
export function getPlanDetail(formdata) {
  return request({
    url: '/api/brand2/requirement_plan_detail',
    method: 'get',
    params: formdata,
  });
}
// export function modifyRequirementDetail (formdata) {
//   return request({
//     url: '/api/brand2/update_requirement',
//     method: 'post',
//     data: formdata
// 查看需求详情
export function requirementDetail(brandpass) {
  return request({
    url: '/api/brand2/requirement_detail',
    method: 'get',
    params: brandpass,
  });
}
// 修改需求
export function updateRequirement(brandpass) {
  return request({
    url: '/api/brand2/update_requirement',
    method: 'post',
    data: brandpass,
  });
}
// 删除方案
export function deleteRequirementPlan(brandpass) {
  return request({
    url: '/api/brand2/delete_requirement_plan',
    method: 'post',
    data: brandpass,
  });
}
// 查看方案选中的主播
export function viewSelectedStars(brandpass) {
  return request({
    url: '/api/brand2/view_selected_stars',
    method: 'get',
    params: brandpass,
  });
}
// 查看方案选中的主播
export function updateRequirementPlanName(brandpass) {
  return request({
    url: '/api/brand2/update_requirement_plan_name',
    method: 'post',
    data: brandpass,
  });
}
// 查看方案选中的主播
export function validateRequirementName(brandpass) {
  return request({
    url: '/api/brand2/requirement_name_exists',
    method: 'get',
    params: brandpass,
  });
}
// 删除方案主播
export function deletePlanAnchor(brandpass) {
  return request({
    url: '/api/brand2/delete_plan_stars',
    method: 'post',
    data: brandpass,
  });
}
