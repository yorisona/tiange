/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-10 13:13:57
 */
import { Get, Post } from '@/utils/request';
import * as APIs from '@/apis/investment';
import { ObjectFilterEmpty } from '@/utils/func';

import {
  AddLiveParams,
  SaveBaseInfoParams,
  SaveSettlementDataParams,
} from '@/types/tiange/investment';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { LiveDisplay } from '@/types/tiange/live';
import { SettlementDataUnionParams } from '@/types/tiange/finance/settlement';
import { refuseParams } from '@/types/tiange/finance/finance';

export const SaveLiveGoods = async (payload: AddLiveParams): Promise<HttpResponse<any>> =>
  Post(APIs.SAVE_LIVE_GOODS_V2, {
    ...ObjectFilterEmpty(payload),
  });
// 保存基本数九
export const SaveMerchantSettlementBaseInfo = async (
  payload: SaveBaseInfoParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_MERCHANT_SETTLEMENT_BASE_INFO, {
    ...ObjectFilterEmpty(payload),
  });
// 保存结算数据
export const SaveMerchantSettlementData = async (
  payload: SaveSettlementDataParams | SettlementDataUnionParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_MERCHANT_SETTLEMENT_DATA, {
    ...ObjectFilterEmpty(payload),
  });

// 招商生成子结算单
export const GenSubMerchantIncomeSettlement = async (
  settlement_id: string | number | undefined,
  settlement_files: string[],
): Promise<HttpResponse<undefined>> =>
  Post(APIs.GEN_SUB_MERCHANT_INCOME_SETTLEMENT, {
    ...ObjectFilterEmpty({ settlement_id, settlement_files }),
  });

// 查询结算场次
export const QuerySettlementShopLive = async (
  merchant_goods_id: string | number | undefined,
): Promise<ListResponse<LiveDisplay>> =>
  Get(APIs.QUERY_SETTLEMENT_SHOP_LIVE, {
    params: {
      merchant_goods_id,
    },
  });

// 查询招商结算列表
export const QuerySettlementList = async (
  payload: any,
  settlement_kind = 3,
): Promise<ListResponse<any>> =>
  Get(APIs.QUERY_MERCHANT_SETTLEMENTS, {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
      settlement_kind,
    },
  });

// 删除招商结算
export const DelMerchantSettlement = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.DEL_MERCHANT_SETTLEMENT, {
    ...ObjectFilterEmpty({ id }),
  });

// 通过招商结算接口
export const PassMerchantSettlement = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> => Post(`${APIs.PASS_MERCHANT_SETTLEMENT}/${id}`);

// 通过S2B2C结算接口
export const PassUnitySettlement = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> => Post(`${APIs.PASS_UNITY_SETTLEMENT}/${id}`);

/** 不通过成本结算 */
export const RefuseMerchantSettlement = (
  id: string | number | undefined,
  refuse_reason: string | number | undefined,
): Promise<HttpResponse<boolean>> =>
  Post(`${APIs.REFUND_MERCHANT_SETTLEMENT}/${id}`, { refuse_reason });

/** 收入结算 - 财务确认结算 */
export const ApproveMerchantSettlementFinancial = async (
  id: number,
): Promise<HttpResponse<boolean>> =>
  Get(APIs.APPROVE_MERCHANT_SETTLEMENT_FINANCIAL.replace(':id', `${id}`));

/** 不通过结算 */
export const RefuseMerchantSettlementFinacial = async ({
  id,
  refuse_reason,
}: refuseParams): Promise<HttpResponse<undefined>> =>
  Post(APIs.REFUND_MERCHANT_SETTLEMENT_FINANCIAL.replace(':id', `${id}`), {
    refuse_reason,
  });

/** 退款列表 */
export const GetMerchantRefundList = async (payload: Record<string, any>): Promise<any> =>
  Get(APIs.QUERY_MERCHANT_REFUND_LIST, { params: payload });

//LIST_UNITY_SETTLEMENTS
export const GetUnitySettlements = async (payload: Record<string, any>): Promise<any> =>
  Get(APIs.LIST_UNITY_SETTLEMENTS, { params: payload });

// 查询提现记录
export const GetShopLiveQueryWithdraw = async (payload: Record<string, any>): Promise<any> =>
  Get('/api/shop_live/query_withdraw', { params: payload });

export const PostCreateUnity = (payload: any): Promise<HttpResponse<boolean>> =>
  Post(APIs.CREATE_UNITY_SETTLEMENTS, {
    ...ObjectFilterEmpty(payload),
  });

export const PostStatementUnity = (payload: any): Promise<HttpResponse<boolean>> =>
  Post('/api/settlement/upload_douyin_bills', {
    ...ObjectFilterEmpty(payload),
  });

// 确认统一结算单
export const PostConfirmUnity = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.CONFIRM_UNITY_SETTLEMENTS, {
    ...ObjectFilterEmpty({ id }),
  });
// 删除招商结算
export const PostDeleteUnity = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.DELETE_UNITY_SETTLEMENTS, {
    ...ObjectFilterEmpty({ id }),
  });
// 确认统一结算单
export const PostRefreshUnit = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.REFRESH_UNITY_SETTLEMENTS, {
    ...ObjectFilterEmpty({ id }),
  });

// 删除提现核销
export const ShopLiveDeleteWithdraw = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/delete_withdraw', {
    ...ObjectFilterEmpty({ id }),
  });

// 提现核销
export const ShopLiveWithdrawWriteOff = async (
  id: string | number | undefined,
): Promise<HttpResponse<undefined>> =>
  Post('/api/shop_live/withdraw_write_off', {
    ...ObjectFilterEmpty({ id }),
  });
