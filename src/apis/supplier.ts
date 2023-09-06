/*
 * @Brief: 供应商
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-12-08 16:36:21
 */
export const GET_COMPANY_NAME_AND_ID = '/api/medium/get_company_name_and_id';
/**
 * 删除模特
 */
export const DELETE_MODEL_FOR_SUPPLIER = '/api/model/del_model';

/**
 * 删除主播
 */
export const DELETE_KOL_FOR_SUPPLIER = '/api/anchor/del_anchor';
/** 获取主播维护人列表 */
export const QUERY_ANCHOR_MAINTAINER = '/api/auth/query_anchor_maintainer';
/** 保存主播维护人 */
export const SAVE_ANCHOR_MAINTAINER = '/api/anchor/save_anchor_maintainer';
/** 获取主播敏感信息 */
export const GET_ANCHOR_KEY_INFO = '/api/anchor/get_anchor_key_info';
/** 查询主播敏感信息查看记录 */
export const GET_ANCHOR_KEY_INFO_LOG = '/api/anchor/get_anchor_key_info_log';
/** 保存公司临时信息 */
export const SAVE_COMPANY_TEMP_INFO = '/api/medium/add_tmp_company';
/** 主播合同关联项目 */
export const SAVE_ANCHOR_PROJECT_CONTRACT = '/api/anchor/contract/associate_project';
