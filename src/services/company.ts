/**
 * 公司 services
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 11:42:21
 */

import { Get, Post } from '@/utils/request';
import * as APIs from '@/apis/customer';
import { ObjectFilterEmpty } from '@/utils/func';
import {
  BatchDeleteCompanyParams,
  Company,
  CompanyCreateParams,
  CompanyEditParams,
  CompanyListQueryParams,
  SupplierListQueryParams,
  CompanyAccountQueryParams,
  CompanyAccountListQueryParams,
} from '@/types/tiange/company';
import { HttpResponse, ListResponse } from '@/types/base/http';
import { CompanyBase } from '@/types/tiange/customer';

/**
 * 根据公司名称查询公司ID
 * 实际返回值包含公司名称和公司ID
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 10:50:13
 */
export const GetCompanyId = async (
  company_name: string,
  company_id?: number,
): Promise<HttpResponse<CompanyBase[]>> =>
  Get(APIs.CUST_QUERY_COMPANY_IDS, {
    params: {
      ...ObjectFilterEmpty({
        company_name,
        company_id,
      }),
    },
  });

/**
 * 根据项目编号查询项目ID
 * 实际返回值包含品牌名称和项目id
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 10:50:13
 */
export const GetProjectId = async (
  project_uid: string | number,
): Promise<HttpResponse<CompanyBase[]>> =>
  Get(APIs.GET_SHOP_LIVE_PROJECT_ID_LIST, {
    params: {
      ...ObjectFilterEmpty({
        project_uid,
      }),
    },
  });

/**
 * 获取客户公司列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 11:44:34
 */
export const GetCompanyList = async (
  payload: CompanyListQueryParams,
): Promise<ListResponse<Company>> =>
  Get(APIs.CUST_QUERY_COMPANY, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 店铺代播获取客户公司列表
 * @author  John
 * @since   2021-08-03
 */
export const GetShopLiveCompanyList = async (
  payload: CompanyListQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
): Promise<ListResponse<Company>> => {
  console.log('business_type', business_type);

  return Get(
    business_type === E.project.BusinessType.supplyChain
      ? APIs.CUST_SUPPLY_CHAIN_QUERY_COMPANY
      : business_type === E.project.BusinessType.locallife
      ? APIs.CUST_LOCAL_LIFE_QUERY_COMPANY
      : APIs.CUST_SHOP_LIVE_QUERY_COMPANY,
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );
};
/**
 * 整合营销获取客户公司列表
 */
export const GetMarketingCompanyList = async (
  payload: CompanyListQueryParams,
): Promise<ListResponse<Company>> => {
  return Get(APIs.CUST_MARKETING_QUERY_COMPANY, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};

/**
 * 批量删除公司
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-31 10:57:31
 */
export const BatchDeleteCompany = async (
  payload: BatchDeleteCompanyParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.CUST_BATCH_DEL_COMPANY, { ...ObjectFilterEmpty(payload) });

/**
 * 新建公司
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-02 18:00:47
 */
export const CreateCompany = async (payload: CompanyCreateParams): Promise<HttpResponse<Company>> =>
  Post(APIs.CUST_SAVE_COMPANY, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 编辑公司
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-02 18:00:54
 */
export const EditCompany = async (payload: CompanyEditParams): Promise<HttpResponse<Company>> =>
  Post(APIs.CUST_SAVE_COMPANY, {
    ...payload,
  });

/**
 * 获取公司详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-02 18:02:07
 */
export const GetCompanyDetail = async (id: string): Promise<HttpResponse<any>> =>
  Get(APIs.CUST_COMPANY_DETAIL.replace(':id', id));

/**
 * 店铺代播获取客户公司列表
 * @author  John
 * @since   2021-08-03
 */
export const GetSupplierList = async (
  payload: SupplierListQueryParams,
): Promise<ListResponse<Company>> =>
  Get(APIs.SEARCH_PAY_WAY_ACCOUNT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 *@description: 自动查询项目公司退款账号信息
 *@author: 棠棣
 *@since: 2021/8/17 17:01
 */
export const GetCompanyAccount = async (
  payload: CompanyAccountQueryParams,
): Promise<HttpResponse<undefined>> =>
  Get(APIs.GET_PROJECT_REFUND_ACCOUNT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 *@description: 手动查询项目公司退款账号信息
 *@author: 棠棣
 *@since: 2021/8/17 17:01
 */
export const GetCompanyAccountList = async (
  payload: CompanyAccountListQueryParams,
): Promise<ListResponse<undefined>> =>
  Get(APIs.SEARCH_REFUND_ACCOUNT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const ShopLiveSaveWithdraw = async (payload: any): Promise<HttpResponse<Company>> =>
  Post('/api/shop_live/save_withdraw', {
    ...payload,
  });

/**
 * 查询分到店铺的结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 11:44:34
 */
export const SettlementGetSettlementByShopId = async (payload: any): Promise<HttpResponse<any>> =>
  Get('/api/settlement/get_settlement_by_shop_id', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 发票申请查询结算单最晚的收款记录 */
export const SettlementQuerySettlementsLastAchievement = async (
  payload: any,
): Promise<HttpResponse<any>> =>
  Get('/api/settlement/query_settlements_last_achievement', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
