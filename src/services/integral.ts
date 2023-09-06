/** MB币 | 商城 | 兑换 **/
import { IGPageQuery } from '@/types/tiange/general';
import { ListResponse } from '@/types/base/http';
import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';

/** 查询用户及M币数据 */
export interface Params_Query_Integral_M_User {
  department_id: string;
  username: string;
  join_end_date: string;
  birth_start_date: string;
  birth_end_date: string;
  join_start_date: string;
}
export const Query_Integral_M_User = async (
  pager: IGPageQuery,
  payload: Params_Query_Integral_M_User,
): Promise<ListResponse<NPerformance.Indicators>> =>
  Get(`/api/integral_m/query_integral_m_user`, {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });

/** 查询用户的M币变动记录 */
export const Query_Integral_M_Exchange_Record = async (
  pager: IGPageQuery,
  payload: { user_id: number },
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Get(`/api/integral_m/query_integral_m_exchange_record`, {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });

/** 更新用户信息**/
export const Update_Integral_M_User = async (payload: {
  user_id: number;
  birth_date: string;
}): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Post(`/api/integral_m/update_integral_m_user`, ObjectFilterEmpty(payload));

/** 发放扣除M币 **/
export const Exchange_Integral_M = async (payload: {
  user_id: number;
  comment: string;
  exchange_m_num: number;
  reason_type: E.mb.IntegralMReasonType;
}): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Post(`/api/integral_m/exchange_integral_m`, ObjectFilterEmpty(payload));

/** 查询商品-企业中台 */
export const Query_Integral_Goods = async (
  pager: IGPageQuery,
  payload: { user_id: number },
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Get(`/api/integral_m/query_integral_goods`, {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });

/** 查询商品-工作台 */
export const Query_Listed_Integral_Goods = async (
  pager: IGPageQuery,
  payload: { order_by_cost: number },
): Promise<
  ListResponse<{
    images: string[];
    comment: string;
    name: string;
    cost_m: number;
    id: number;
  }>
> =>
  Get(`/api/integral_m/query_listed_integral_goods`, {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });

/** 企业中台-保存商品信息 */
export const Save_Integral_Goods = async (
  payload: any,
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Post(`/api/integral_m/save_integral_goods`, ObjectFilterEmpty(payload));

/** 查询兑换明细-企业中台 */
export const Query_Integral_Goods_Exchange_Record = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Get(`/api/integral_m/query_integral_goods_exchange_record`, {
    params: {
      ...pager,
      ...ObjectFilterEmpty(payload),
    },
  });

/** 企业中台-完成/退回动作 */
export const Edit_Integral_Goods_Exchange_Record = async (
  payload: any,
): Promise<ListResponse<any[]>> =>
  Post(`/api/integral_m/edit_integral_goods_exchange_record`, ObjectFilterEmpty(payload));

/** 兑换商品 */
export const Create_Integral_Goods_Exchange_Record = async (payload: {
  exchange_num: number;
  integral_goods_id: number;
}): Promise<ListResponse<any[]>> =>
  Post(`/api/integral_m/create_integral_goods_exchange_record`, ObjectFilterEmpty(payload));

/** M币赠送 */
export const save_integral_m_give_record = async (payload: {
  m_num: number | undefined;
  to_user_id: number | undefined;
  reason: string;
}): Promise<ListResponse<any[]>> =>
  Post(`/api/integral_m/save_integral_m_give_record`, ObjectFilterEmpty(payload));

/** 查询我的兑换记录 */
export const Query_Owner_Integral_M_Exchange_Record = async (
  pager: IGPageQuery,
): Promise<ListResponse<NPerformance.Indicators[]>> =>
  Get(`/api/integral_m/query_owner_integral_m_exchange_record`, {
    params: {
      ...pager,
    },
  });
/** 查询我的兑换明细 */
export const Query_Owner_Integral_Goods_Exchange_Record = async (
  pager: IGPageQuery,
  payload: {
    integral_goods_id: number;
    exchange_status: number;
    integral_goods_name: number;
  },
): Promise<
  ListResponse<{
    gmt_create: string;
    integral_goods_name: string;
    exchange_total_cost: number;
    id: number;
    operator_id: number;
    integral_goods_id: number;
    operator_name: string;
    gmt_modified: string;
    status: E.mb.RedemptionStatus;
    exchange_num: number;
  }>
> =>
  Get(`/api/integral_m/query_owner_integral_goods_exchange_record`, {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 查询赠送明细 */
export const Query_Gift_Details = async (
  pager: IGPageQuery,
  payload: {
    from_user: number;
    to_user: number;
    status: number;
  },
): Promise<
  ListResponse<{
    gmt_create: string;
    from_user_id: string;
    m_num: number;
    id: number;
    operator_id: number;
    operator_status: number;
    operator_time: string;
    // gmt_modified: string;
    status: E.mb.RedemptionStatus;
    reason: number;
    to_user_id: number;
  }>
> =>
  Get(`/api/integral_m/query_integral_m_give_record`, {
    params: ObjectFilterEmpty({
      ...pager,
      ...payload,
    }),
  });

/** 审核赠送明细 */
export const CheckIntegralMGiveRecord = async (payload: {
  failed_reason?: string;
  record_id: number;
  operator_status: number;
}): Promise<any> =>
  Post(
    `/api/integral_m/check_integral_m_give_record`,
    ObjectFilterEmpty({
      ...payload,
    }),
  );
