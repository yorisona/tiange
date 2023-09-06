// @ts-nocheck
import request from '@/utils/request';

export function getStarSalesRankings(sortstarpass) {
  return request({
    url: '/api/star_stat/get_star_sales_rankings',
    method: 'get',
    params: sortstarpass,
  });
}

export function sortStar(sortstarpass) {
  return request({
    url: '/api/stat_ydr/sort_stars',
    method: 'get',
    params: sortstarpass,
  });
}

export function queryStarStat(starName) {
  return request({
    url: '/api/stat_ydr/query_star',
    method: 'get',
    params: starName,
  });
}

export function queryCategory(starName) {
  return request({
    url: '/api/stat_ydr/query_category',
    method: 'get',
    params: starName,
  });
}

export function displayStatistics(displaystatpass) {
  return request({
    url: '/api/stat_ydr/display_statistics',
    method: 'get',
    params: displaystatpass,
  });
}

export function periodStatistics(periodstatpass) {
  return request({
    url: '/api/stat_ydr/period_statistics',
    method: 'get',
    params: periodstatpass,
  });
}

export function smallCategory(starnamepass) {
  return request({
    url: '/api/stat_ydr/query_small_category',
    method: 'get',
    params: starnamepass,
  });
}

export function queryFans(starpass) {
  return request({
    url: '/api/star/query_fans',
    method: 'get',
    params: starpass,
  });
}
