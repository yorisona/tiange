// @ts-nocheck
import request from '@/utils/request';

export function queryStars(searchCondition) {
  return request({
    url: '/api/star/query_stars',
    method: 'get',
    params: searchCondition,
  });
}

export function queryStarSug(searchCondition) {
  return request({
    url: '/api/star/query_star_name_and_star_id',
    method: 'get',
    params: searchCondition,
  });
}

export function saveStar(starInfo) {
  return request({
    url: '/api/star/save_star',
    method: 'post',
    data: starInfo,
  });
}

export function deleteStar(starInfo) {
  return request({
    url: '/api/star/delete_star',
    method: 'get',
    params: starInfo,
  });
}

export function uploadStar(file) {
  return request({
    url: '/api/star/upload_star',
    method: 'post',
    data: file,
  });
}

export function uploadStarCost(file) {
  return request({
    url: '/api/star/upload_star_cost_price',
    method: 'post',
    data: file,
  });
}

export function exportStars(exportpass) {
  return request({
    url: '/api/star/export_stars',
    method: 'get',
    params: exportpass,
  });
}
