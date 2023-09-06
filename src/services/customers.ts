/*
 * @Author: 矢车
 * @Date: 2021-01-07 16:34:12
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-18 17:51:05
 * @Description:
 */
/**
 * 客户管理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 17:06:00
 */
import { Get, Post } from '@/utils/request';
import * as APIs from '@/apis/customer';
import { ObjectFilterEmpty } from '@/utils/func';
import {
  CustomerQueryParams,
  BrandList,
  CustomerShop,
  CustomerShopCreateParams,
  CustomerShopEditParams,
  QueryShopAndCompanyRecord,
  QueryShopAndBrandRecord,
  AdvanceCustomerParams,
  ProjectAchievementParams,
  BankListParams,
} from '@/types/tiange/customer';
import { HttpResponse, ListResponse } from '@/types/base/http';

// 客户(店铺)
/**
 * 查询客户
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-22 17:13:13
 */
export const GetCustomer = (params: CustomerQueryParams): Promise<ListResponse<CustomerShop>> =>
  Get(APIs.CUST_QUERY_CUSTOMER, {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 查询客户详情
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-29 13:43:23
 */
export const GetCustomerDetail = async (id: number): Promise<CustomerShop | undefined> => {
  const { data: response } = await GetCustomer({ customer_id: id });

  return response.success && response.data.total > 0 ? response.data.data[0] : undefined;
};

/**
 * 营销业务 客户列表
 * @deprecated 统一到用 GetCustomer
 */
export const GetMarketingCustomer = (
  params: CustomerQueryParams,
): Promise<ListResponse<CustomerShop>> =>
  Get(APIs.CUST_MARKETING_QUERY_CUSTOMER, {
    params: {
      ...ObjectFilterEmpty(params),
    },
  });

/**
 * 客户(店铺) - 新建
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 13:57:10
 */
export const CreateCustomer = (
  payload: CustomerShopCreateParams,
): Promise<HttpResponse<CustomerShop>> =>
  Post(APIs.CUST_SAVE_CUSTOMER, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 客户(店铺) - 编辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-23 13:57:10
 */
export const EditCustomer = (
  payload: CustomerShopEditParams,
): Promise<HttpResponse<CustomerShop>> =>
  Post(APIs.CUST_UPDATE_CUSTOMER, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 获取所有店铺的名称列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-14 14:46:43
 */
export const QueryShopAndCompany = async (payload: {
  shop_name?: string;
}): Promise<HttpResponse<QueryShopAndCompanyRecord[]>> =>
  Get(APIs.CUST_QUERY_SHOP_AND_COMPANY, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取所有店铺的名称和品牌列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-30 16:32:16
 */
export const QueryShopAndBrand = async (payload: {
  shop_name?: string;
  company_id?: string;
}): Promise<HttpResponse<QueryShopAndBrandRecord[]>> =>
  Get(APIs.CUST_QUERY_SHOP_AND_BRAND, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * @Author: 矢车
 * @Date: 2021-01-18 15:43:36
 * @Description: 品牌id和名称列表
 */
export const GetBrandList = async (payload: {
  brand_name?: string;
}): Promise<HttpResponse<BrandList>> =>
  Get(APIs.GET_BRAND_LIST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 *@description: 对外付款获取关联审批单列表
 *@author: 棠棣
 *@since: 2021/10/15 14:41
 */
export const GetBorrowList = async (): Promise<ListResponse<undefined>> =>
  Get(APIs.LIST_BORROWING_FOR_PAY);

/**
 *@description: 对外付款获取业绩列表
 *@author: 棠棣
 *@since: 2021/10/15 14:04
 */
export const GetPaymentAchievementList = async (
  payload: ProjectAchievementParams,
): Promise<ListResponse<undefined>> =>
  Get(APIs.LIST_PROJECT_ACHIEVEMENTS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 *@description: 垫款申请查询垫款客户
 *@author: 棠棣
 *@since: 2021/8/18 14:25
 */
export const GetAdvanceCustomerList = async (
  payload: AdvanceCustomerParams,
): Promise<ListResponse<undefined>> =>
  Get(APIs.SEARCH_BORROWING_CUSTOMER, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 *@description: 垫款申请查询垫款供应商收款信息
 *@author: 棠棣
 *@since: 2021/8/18 14:27
 */
export const GetSupplierCustomerList = async (
  payload: AdvanceCustomerParams,
): Promise<ListResponse<undefined>> =>
  Get(APIs.SEARCH_BORROWING_SUPPLIER, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 *@description: 银行所属省市
 *@author: 棠棣
 *@since: 2021/9/23 14:27
 */
export const GetBankRegion = async (): Promise<ListResponse<undefined>> => Get(APIs.BANK_REGION);

/**
 *@description: 省市范围所有银行信息
 *@author: 棠棣
 *@since: 2021/9/23 14:53
 */
export const GetBankList = async (payload: BankListParams): Promise<ListResponse<undefined>> =>
  Get(APIs.LIST_BANKS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 *@description: 保存公司临时数据
 */
export const SaveCompanyTempInfo = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_TEMP_COMPANY_INFO, {
    ...ObjectFilterEmpty(payload),
  });

/**
 *@description: 新增/编辑 公司
 *@author: 棠棣
 *@since: 2021/9/23 16:06
 */
export const SaveCompany = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_COMPANY_NEW, {
    ...ObjectFilterEmpty(payload),
  });
