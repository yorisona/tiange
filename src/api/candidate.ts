// @ts-nocheck
import request from '@/utils/request';

export function matchCandidate(matchpass) {
  return request({
    url: '/api/brand/match_candidate',
    method: 'get',
    params: matchpass,
  });
}
export function queryCandidate(matchpass) {
  return request({
    url: '/api/brand/query_candidate',
    method: 'get',
    params: matchpass,
  });
}
// export function matchCandidateSingle (matchpass) {
//   return request({
//     url: '/api/brand/query_candidate_for_product',
//     method: 'get',
//     params: matchpass
//   })
// }
export function addCandidate(matchpass) {
  return request({
    url: '/api/brand/add_candidate',
    method: 'post',
    data: matchpass,
  });
}
export function updateCandidate(matchpass) {
  return request({
    url: '/api/brand/update_plan',
    method: 'post',
    data: matchpass,
  });
}
export function delCandidate(params) {
  return request({
    url: '/api/brand/del_candidate',
    method: 'get',
    params: params,
  });
}
export function queryPlan(requirmentpass) {
  return request({
    url: '/api/brand/query_plan',
    method: 'get',
    params: requirmentpass,
  });
}
export function addSchedule(addSchedulepass) {
  return request({
    url: '/api/brand/add_schedule',
    method: 'post',
    data: addSchedulepass,
  });
}
export function deleteSchedule(deleteSchedulpass) {
  return request({
    url: '/api/brand/delete_schedule',
    method: 'get',
    params: deleteSchedulpass,
  });
}
export function replaceStar(replacepass) {
  return request({
    url: '/api/brand/replace_star',
    method: 'post',
    data: replacepass,
  });
}
