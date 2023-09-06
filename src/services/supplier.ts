/**
 数据中心
 **/
import { Get, Post } from '@/utils/request';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { ObjectFilterEmpty } from '@/utils/func';
import {
  DELETE_KOL_FOR_SUPPLIER,
  DELETE_MODEL_FOR_SUPPLIER,
  GET_ANCHOR_KEY_INFO,
  GET_ANCHOR_KEY_INFO_LOG,
  GET_COMPANY_NAME_AND_ID,
  QUERY_ANCHOR_MAINTAINER,
  SAVE_ANCHOR_MAINTAINER,
  SAVE_COMPANY_TEMP_INFO,
  SAVE_ANCHOR_PROJECT_CONTRACT,
} from '@/apis/supplier';
import { CompanyBase } from '@/types/tiange/customer';
import { UserInfo } from '@/types/tiange/system';
import {
  AnchorKeyInfoLogModel,
  AnchorKeyInfoLogParams,
  AnchorKeyType,
  IAnchorInfo,
} from '@/types/tiange/supplier';
import { ANCHOR_CONTRACT } from '@/apis/contract';
const catchError = (res: any) => {
  if (res.data.success !== true) throw new Error(res.data.message);
  return res.data.data;
};
/** 获取擅长类目 */
export const GetAnchorGoodAtCategories = async (): Promise<
  HttpResponse<{ code: number; name: string }[]>
> => Get(`/api/anchor/good_at_categories`);

/** 获取主播标签 */
export const GetAnchorTags = async (): Promise<HttpResponse<{ id: number; name: string }[]>> =>
  Get(`/api/anchor/anchor_tags`);

/** 删除主播操作 **/
export const GetAnchorDelete = async (anchor_id: string): Promise<HttpResponse<any>> =>
  Get(`/api/anchor/delete_anchor/${anchor_id}`);

/** 保存主播试镜**/
export const PostAnchorVerify = async (params: any): Promise<HttpResponse<any[]>> =>
  Post(`/api/anchor/verify_anchor`, ObjectFilterEmpty(params));

/** 保存公司临时信息 */
export const SaveCompanyTempInfo = async (
  params: any,
): Promise<HttpResponse<{ id: number; name: string }[]>> =>
  Post(SAVE_COMPANY_TEMP_INFO, ObjectFilterEmpty(params));

export const PostModifyCompany = async (
  params: any,
): Promise<HttpResponse<{ id: number; name: string }[]>> =>
  Post(`/api/medium/add_company`, ObjectFilterEmpty(params));

/** 新增编辑主播基本信息 */
export const PostAnchorBasic = async (
  params: any,
): Promise<HttpResponse<{ id: number; name: string }[]>> =>
  Post(`/api/anchor/save_anchor_basic`, params).then(catchError);
/** 编辑主播其他信息 **/
export const PostAnchorOther = async (
  params: any,
): Promise<HttpResponse<{ id: number; name: string }[]>> =>
  Post(`/api/anchor/save_anchor_other`, ObjectFilterEmpty(params)).then(catchError);

/** 获取主播列表 **/
export const GetAnchorList = async (params?: any): Promise<ListResponse<any[]>> =>
  Get(`/api/anchor/list_anchors`, {
    params: ObjectFilterEmpty(params),
  }).then(catchError);

/** 获取主播详情 **/
export const GetAnchorDetail = async (anchor_id: string): Promise<ListResponse<any[]>> =>
  Get(`/api/anchor/get_anchor_detail/${anchor_id}/`).then(catchError);

/** 查询项目 **/
export const GetUnCompletedProjects = async (params?: any): Promise<ListResponse<any[]>> =>
  Get(`/api/shop_live/query_uncompleted_projects`, {
    params: ObjectFilterEmpty(params),
  }).then(catchError);

/** 保存主播合作**/
export const PostAnchorCooperation = async (params: any): Promise<ListResponse<any[]>> =>
  Post(`/api/anchor/save_anchor_cooperation`, ObjectFilterEmpty(params)).then(catchError);

/** 查询联系人项目 **/
export const GetAuthQueryUser = async (params?: any): Promise<ListResponse<any>> =>
  Get(`/api/auth/query_user_v2`, {
    params: ObjectFilterEmpty(params),
  }).then(catchError);

/** 搜索店播项目或营销项目 **/
export const GetSearchProject = async (params?: any): Promise<ListResponse<any>> =>
  Get(`/api/shop_live/search_project_or_cooperation`, {
    params: ObjectFilterEmpty(params),
  }).then(catchError);

/** 获取指定月份中相关的所有设计师 **/
export const GetDesigner = async (params?: any): Promise<HttpResponse<any>> =>
  Get(`/api/visual_design/get_designer`, {
    params: ObjectFilterEmpty(params),
  });

/** 获取飞书部门  **/
export const GetLevelTwoFeishuDepartmentList = async (params?: any): Promise<HttpResponse<any>> =>
  Get(`/api/feishu/level_two_feishu_department_list`, {
    params: ObjectFilterEmpty(params),
  });
/**
 * 获取下属用户列表v2
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-28 16:00:27
 */
export const GetUsers = (payload: any): Promise<ListResponse<UserInfo>> =>
  Get('/api/auth/query_subordinate_users', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  }).then(catchError);

/** 查询当前用户的下属及其权限列表 **/
export const GetSubordinatesRightTree = async (params?: any): Promise<Record<string, any>> =>
  Get(`/api/auth/get_subordinates_right_tree`, {
    params: ObjectFilterEmpty(params),
  });

export const GetListSettlementCompanies = async (
  company_name: string,
  verify_status?: number,
): Promise<ListResponse<Record<string, any>>> =>
  Get(`/api/anchor/list_settlement_companies`, {
    params: {
      company_name,
      verify_status,
    },
  }).then(catchError);
export const GetDeleteAnchorCooperation = async (
  cooperation_id: string,
): Promise<ListResponse<any[]>> =>
  Get(`/api/anchor/delete_anchor_cooperation/${cooperation_id}/`).then(catchError);

export const GetListAnchorCooperations = async (
  anchor_id: number | string,
): Promise<ListResponse<any[]>> =>
  Get(`/api/anchor/list_anchor_cooperations/${anchor_id}/`).then(catchError);

// 模特列表
export const GetModelList = async (params: any): Promise<ListResponse<any[]>> =>
  Get('/api/model/model_list', {
    params: ObjectFilterEmpty(params),
  }).then(catchError);

// 模特列表-new
export const GetModelListNew = async (params: any): Promise<ListResponse<any[]>> =>
  Get('/api/model/model_list', {
    params: ObjectFilterEmpty(params),
  });
/**
 * 获取所有公司名和id
 * verify_status: 1 审核通过，不传表示全部
 */
export const GetCompanyList = async (
  payload: { company_name: string | undefined; verify_status: number | undefined } | undefined,
): Promise<HttpResponse<CompanyBase[]>> =>
  Get(GET_COMPANY_NAME_AND_ID, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 删除模特
 * DELETE_KOL_FOR_SUPPLIER
 */
// TOOD-葶苧：参数待修改
export const DeleteModelForSupplier = async (
  id: number | undefined,
): Promise<HttpResponse<undefined>> => Post(DELETE_MODEL_FOR_SUPPLIER, { id });
/** 保存主播试播**/
export const PostSaveModel = async (params: any): Promise<ListResponse<any[]>> =>
  Post(`/api/model/save_model`, ObjectFilterEmpty(params)).then(catchError);
/**
 * 删除主播
 *
 */
// TOOD-葶苧：参数待修改
export const DeleteKolForSupplier = async (id: number): Promise<HttpResponse<undefined>> =>
  Post(DELETE_KOL_FOR_SUPPLIER, { id });
/**
 * 获取主播维护人列表
 * @param name
 * @returns
 */
export const QueryAnchorMaintainer = async (
  search_value: string | undefined,
): Promise<HttpResponse<UserInfo[]>> =>
  Get(QUERY_ANCHOR_MAINTAINER, {
    params: {
      ...ObjectFilterEmpty({ search_value }),
    },
  });

/**
 * 保存主播维护人
 * @param
 * @returns
 */
export const SaveAnchorMaintainer = async (payload: {
  maintainer_id: string | number | undefined;
  id: string | number | undefined;
}): Promise<HttpResponse<undefined>> =>
  Post(SAVE_ANCHOR_MAINTAINER, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 获取主播敏感信息
 * @param search_type  查询方式 1-微信 2-手机号
 * @returns
 */
export const GetAnchorKeyInfo = async (payload: {
  id: number | string | undefined;
  search_type: AnchorKeyType;
}): Promise<HttpResponse<IAnchorInfo>> =>
  Get(GET_ANCHOR_KEY_INFO, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 查询主播敏感信息查看记录
 * @param
 * @returns
 */
export const GetAnchorKeyInfoLog = async (
  payload: AnchorKeyInfoLogParams,
): Promise<ListResponse<AnchorKeyInfoLogModel>> =>
  Get(GET_ANCHOR_KEY_INFO_LOG, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 微信号参数待修改
export const GetCheckAnchorWechat = async (
  wechat: string,
  anchor_id: any,
): Promise<HttpResponse<undefined>> =>
  Get('/api/anchor/check_anchor_wechat', { params: { wechat, anchor_id } });

// 查询主播合同签约
export const AnchorContract = async (payload: {
  anchor_id: number;
}): Promise<ListResponse<AnchorKeyInfoLogModel>> =>
  Get(ANCHOR_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 保存主播维护人
 * @param
 * @returns
 */
export const SaveAnchorProjectContract = async (payload: {
  contract_id: string | number | undefined;
  project_id: string | number | undefined;
}): Promise<HttpResponse<undefined>> =>
  Post(SAVE_ANCHOR_PROJECT_CONTRACT, {
    ...ObjectFilterEmpty(payload),
  });

/** 主播列表获取 **/
export const QueryAnchorList = async (params?: any): Promise<ListResponse<any[]>> =>
  Get(`/api/anchor/list_anchors`, {
    params: ObjectFilterEmpty(params),
  });

/** 查询所有客户公司 **/
export const QueryAllCompany = async (params?: any): Promise<ListResponse<any[]>> =>
  Get(`/api/cust/query_all_company`, {
    params: ObjectFilterEmpty(params),
  });

export default {
  PostAnchorVerify,
  GetCheckAnchorWechat,
  GetAnchorGoodAtCategories,
  PostAnchorOther,
  GetAnchorTags,
  PostAnchorBasic,
  GetAnchorList,
  GetAnchorDetail,
  GetAnchorDelete,
  GetListSettlementCompanies,
  GetListAnchorCooperations,
  GetUnCompletedProjects,
  PostAnchorCooperation,
  GetAuthQueryUser,
  GetDeleteAnchorCooperation,
  PostModifyCompany,
  SaveAnchorProjectContract,
};
