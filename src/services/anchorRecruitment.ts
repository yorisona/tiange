import { HttpResponse, ListResponse } from '@/types/base/http';
import {
  CommonBusinessProject,
  CommonBusinessProjectQueryParams,
} from '@/types/tiange/commonBusiness/project';
import { IGPageQuery } from '@/types/tiange/general';
import { ObjectFilterEmpty } from '@/utils/func';
import { Get, Post } from '@/utils/request';

/**
 * 主播招募列表-工作台
 */
export const QuerySelfAnchorRecruitmentList = async (
  pageQuery: IGPageQuery,
  payload: M.anchorRecruitment.AnchorRecruitmentQueryParams,
): Promise<ListResponse<M.anchorRecruitment.AnchorRecruitmentModel>> =>
  Get('/api/recruit/query_self_anchor_recruit', {
    params: ObjectFilterEmpty({
      ...pageQuery,
      ...payload,
    }),
  });

/**
 * 主播招募列表-企业中台
 */
export const QueryAnchorRecruitmentList = async (
  pageQuery: IGPageQuery,
  payload: M.anchorRecruitment.AnchorRecruitmentQueryParams,
): Promise<ListResponse<M.anchorRecruitment.AnchorRecruitmentModel>> =>
  Get('/api/recruit/query_anchor_recruit', {
    params: ObjectFilterEmpty({
      ...pageQuery,
      ...payload,
    }),
  });

/**
 * 评价 主播招募记录
 */
export const EvaluateAnchorRecruit = async (payload: {
  recruit_id: number;
  recruit_satisfaction: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/recruit/evaluate_anchor_recruit', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 删除 主播招募记录
 */
export const DeleteAnchorRecruit = async (payload: {
  recruit_id: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/recruit/delete_anchor_recruit', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 新增/编辑 主播招募记录
 */
export const SaveOrUpdateAnchorRecruit = async (
  payload: M.anchorRecruitment.AddAnchorRecruitmentRecordParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/recruit/save_or_update_anchor_recruit', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 主播招募-项目列表
 */
export const QueryShopAndCommonProject = async (
  payload: Partial<CommonBusinessProjectQueryParams>,
): Promise<ListResponse<CommonBusinessProject>> =>
  Get('/api/shop_live/query_shop_and_common_project', {
    params: ObjectFilterEmpty(payload),
  });
