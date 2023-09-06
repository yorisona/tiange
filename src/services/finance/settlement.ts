/**
 * 业务结算 service
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-20 17:50:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=155
 */
import { Get, Post } from '@/utils/request';
import type { HttpResponse, ListResponse } from '@/types/base/http';
import type {
  SettledDatesQueryParams,
  Settlement,
  SettlementDataUnionParams,
  SettlementListQueryParams,
  SettlementStep1SaveParams,
  SettlementStep2MakettingParams,
  SettlementStep3MakettingParams,
  SettlementSubmitParams,
  IncomeFileUploadResponseData,
  SettlementDetailQueryParams,
  SettlementCostBasicInfoSaveParams,
  SettlementCostStep2MakettingParams,
  SettlementCostDataUnionParams,
  SettlementCostDataLiveParams,
  SettlementCostMcnTaobaoBeforeSaveParams,
  SettlementCostMcnTaobaoAfterSaveParams,
  SettlementCostDataUnionParamsAfter,
  PitFeeParams,
  CompanyPitFee,
  AdCostParams,
} from '@/types/tiange/finance/settlement';
import { ObjectFilterEmpty } from '@/utils/func';
import * as APIs from '@/apis/settlement';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { Company, CompanyListQueryParams } from '@/types/tiange/company';

// key到接口地址的映射
const SettlementApiMap = new Map([
  ['live', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/shop_live`],
  ['local_life', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/local_life`],
  ['supply_chain', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/supply_chain`],
  ['marketing', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/marketing`],
  ['common', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/common`],
  ['finance', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/financial`],
  ['finance_cost', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/financial_cost`],
  ['approval', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/approval_financial`],
  ['customer_company', `${APIs.QUERY_SETTLEMENT_DETAIL_PREFIX}/customer_company`],
]);

// key转实际接口地址
const getSettlementApi = (
  type:
    | 'live'
    | 'marketing'
    | 'common'
    | 'finance'
    | 'finance_cost'
    | 'approval'
    | 'customer_company'
    | 'local_life'
    | 'supply_chain',
) => SettlementApiMap.get(type) ?? APIs.FINANCE_SETTLEMENT_QUERY_API;

type ListSettlementResponse<RecordData> = HttpResponse<{
  total: number;
  data: RecordData[];
  total_count: any;
}>;
/**
 * 获取项目结算列表
 */
export const GetSettlementList = async (
  type:
    | 'live'
    | 'marketing'
    | 'common'
    | 'finance'
    | 'finance_cost'
    | 'approval'
    | 'customer_company'
    | 'local_life'
    | 'supply_chain',
  payload: SettlementListQueryParams,
): Promise<ListSettlementResponse<Settlement>> =>
  Get(getSettlementApi(type), {
    params: {
      ...ObjectFilterEmpty({ ...payload }),
    },
  });

/**
 * 获取项目结算详情
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-09 15:44:01
 */
export const GetSettlementDetail = async (
  type:
    | 'live'
    | 'marketing'
    | 'common'
    | 'finance'
    | 'finance_cost'
    | 'local_life'
    | 'supply_chain',
  payload: SettlementDetailQueryParams,
): Promise<HttpResponse<Settlement | undefined>> => {
  const res: ListResponse<Settlement> = await Get(getSettlementApi(type), {
    params: payload,
  });

  const {
    data: { data: _, ...dataRest },
    ...rest
  } = res;

  const data = dataRest.success ? (_.total > 0 ? _.data[0] : undefined) : undefined;

  return {
    ...rest,
    data: {
      ...dataRest,
      data,
    },
  };
};

// key到接口地址的映射
const SettlementDelApiMap = new Map([
  ['live', APIs.DEL_SHOP_LIVE_SETTLEMENT],
  ['local_life', APIs.DEL_LOCAL_LIFE_SETTLEMENT],
  ['supply_chain', APIs.DEL_SUPPLY_CHAIN_SETTLEMENT],
  ['marketing', APIs.DEL_MARKETING_SETTLEMENT],
  ['common', APIs.DEL_COMMON_SETTLEMENT],
]);

// key转实际接口地址
const getSettlementDelApi = (
  type:
    | 'live'
    | 'marketing'
    | 'common'
    | 'finance'
    | 'finance_cost'
    | 'local_life'
    | 'supply_chain',
) => SettlementDelApiMap.get(type) ?? APIs.DEL_SHOP_LIVE_SETTLEMENT;

/**
 * 删除结算
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-21 17:17:03
 */
export const DeleteSettlement = async (
  type:
    | 'live'
    | 'marketing'
    | 'common'
    | 'finance'
    | 'finance_cost'
    | 'local_life'
    | 'supply_chain',
  id: number,
): Promise<HttpResponse<null>> => Post(getSettlementDelApi(type), { id });

// key到接口地址的映射
const SettlementSaveStep1ApiMap = new Map([
  ['live', APIs.SAVE_LIVE_SETTLEMENT_COST_BASEINFO],
  ['local_life', APIs.SAVE_LOCAL_LIFE_SETTLEMENT_COST_BASEINFO],
  ['marketing', APIs.SAVE_MARKETING_SETTLEMENT_COST_BASEINFO],
  ['common', APIs.SAVE_COMMON_SETTLEMENT_COST_BASEINFO],
  ['supply_chain', APIs.SAVE_SUPPLY_CHAIN_SETTLEMENT_COST_BASEINFO],
]);

// key转实际接口地址
const getSettlementSaveStep1Api = (
  type: 'live' | 'marketing' | 'common' | 'local_life' | 'supply_chain',
) => SettlementSaveStep1ApiMap.get(type) ?? APIs.SAVE_LIVE_SETTLEMENT_COST_BASEINFO;

/**
 * 保存结算 - 第一步
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-22 13:06:59
 */
export const SaveSettlementStep1 = async (
  type: 'live' | 'marketing' | 'common' | 'local_life' | 'supply_chain',
  payload: SettlementStep1SaveParams,
): Promise<HttpResponse<Settlement>> =>
  Post(getSettlementSaveStep1Api(type), {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 保存结算 - 第二步 - 营销业务(营销/V任务)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 00:12:06
 */
export const SaveSettlementStep2Marketing = async (
  payload: SettlementStep2MakettingParams,
): Promise<HttpResponse<Settlement>> => Post(APIs.SAVE_MARKETING_SETTLEMENT_DATA, payload);

/**
 * 保存结算 - 第三步 - 营销业务(营销/V任务)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-27 00:20:15
 */
export const SaveSettlementStep3Marketing = async (
  payload: SettlementStep3MakettingParams,
): Promise<HttpResponse<Settlement>> => Post(APIs.SAVE_MARKETING_SETTLEMENT_DATA, payload);

/**
 * 上传文件-淘宝店播 结算
 */
export const uploadTaobaoSettlementFileService = async (
  payload: FormData,
): Promise<
  HttpResponse<{
    recommend_amount: number;
    recommend_file: string;
    record_count?: number;
    recommend_live_time: string;
    recommend_live_count?: number;
  }>
> => Post(APIs.SETTLEMENT_TAOBAO_FILE_UPLOAD_API, payload);

/**
 * 上传文件-抖音 订单 结算
 */
export const uploadDouyinOrderSettlementFileService = async (
  payload: FormData,
): Promise<
  HttpResponse<{
    order_amount: number;
    order_file: string;
    record_count: number;
  }>
> => Post(APIs.SETTLEMENT_DOUYIN_ORDER_FILE_UPLOAD_API, payload);

/**
 * 上传文件-MCN淘宝CPS - 收入
 */
export const uploadMCNTaobaoIncomeFileService = async (
  payload: FormData,
): Promise<HttpResponse<IncomeFileUploadResponseData>> =>
  Post(APIs.INCOME_MCN_TAOBAO_FILE_UPLOAD_API, payload);

/**
 * 上传文件-S2B2C抖音CPS - 收入
 */
export const uploadMCNDouyinIncomeFileService = async (
  payload: FormData,
): Promise<HttpResponse<IncomeFileUploadResponseData>> =>
  Post(APIs.INCOME_MCN_DOUYIN_FILE_UPLOAD_API, payload);

/**
 * 上传文件- MCN v任务 收入
 */
export const uploadMCNVTaskIncomeFileService = async (
  payload: FormData,
): Promise<HttpResponse<IncomeFileUploadResponseData>> =>
  Post(APIs.INCOME_MCN_V_TASK_FILE_UPLOAD_API, payload);

/**
 * 收入保存结算数据 - 第二步
 * @param payload
 * @param business_type
 */
export const saveSettlementDataService = async (
  payload: SettlementDataUnionParams,
  business_type: BusinessTypeEnum | number | undefined,
): Promise<HttpResponse<undefined>> => {
  switch (business_type) {
    case BusinessTypeEnum.douyin:
    case BusinessTypeEnum.taobao:
      //  店播
      return Post(APIs.SHOPLIVE_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.locallife:
      //  本地生活
      return Post(APIs.LOCAL_LIFE_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.supplyChain:
      //  供应链
      return Post(APIs.SUPPLY_CHAIN_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.marketing:
      //  营销
      return Post(APIs.SAVE_MARKETING_SETTLEMENT_DATA, payload);
    case BusinessTypeEnum.mcn:
      //  通用业务
      return Post(APIs.COMMON_BUSINESS_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.base:
      //  基地业务
      return Post(APIs.SHOPLIVE_SETTLEMENT_DATA_SAVE_API, payload);
    default:
      //  默认
      return Post(APIs.SHOPLIVE_SETTLEMENT_DATA_SAVE_API, payload);
  }
};

/**
 * 成本结算 保存结算数据 - 第二步
 * @param payload
 * @param business_type
 */
export const saveSettlementCostDataService = async (
  payload:
    | SettlementCostDataUnionParams
    | SettlementCostDataLiveParams
    | SettlementCostDataUnionParamsAfter
    | SettlementDataUnionParams
    | any,
  business_type: BusinessTypeEnum | number | undefined | null,
): Promise<HttpResponse<undefined>> => {
  switch (business_type) {
    case BusinessTypeEnum.douyin:
    case BusinessTypeEnum.taobao:
    case BusinessTypeEnum.taobaopick:
      //  店播
      return Post(APIs.SHOPLIVE_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.locallife:
      //  本地生活
      return Post(APIs.LOCAL_LIFE_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.supplyChain:
      //  供应链
      return Post(APIs.SUPPLY_CHAIN_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.marketing:
      //  营销
      return Post(APIs.SAVE_MARKETING_SETTLEMENT_DATA, payload);
    case BusinessTypeEnum.mcn:
      //  通用业务
      return Post(APIs.COMMON_BUSINESS_SETTLEMENT_DATA_SAVE_API, payload);
    case BusinessTypeEnum.base:
      //  基地业务
      return Post(APIs.SHOPLIVE_SETTLEMENT_DATA_SAVE_API, payload);
    default:
      return Post(APIs.SHOPLIVE_SETTLEMENT_DATA_SAVE_API, payload);
  }
};

/**
 * 提交结算单数据 第三步
 * @param payload
 * @returns
 */
export const submitSettlementDataService = async (
  payload: SettlementSubmitParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SETTLEMENT_FINAL_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 提交结算别名
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-06 20:52:06
 */
export const SubmitSettlementStep3 = submitSettlementDataService;

/** 获取下载直播时长文件的地址 */
export const getShopLiveTimeFileService = async (payload: {
  settlement_id: string;
  unit_price?: string;
}): Promise<HttpResponse<undefined>> =>
  Get(APIs.SHOPLIVE_TIME_DATA_FILE_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/** 淘宝 业务结算 获取时长 */
export const getSettlementTaobaoLiveTimeService = async (payload: {
  settlement_id: string;
}): Promise<HttpResponse<{ live_count: number; live_hours: number }>> =>
  Get(APIs.SHOPLIVE_TIME_DATA_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取项目中已结算过的日期
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-01 11:10:08
 */
export const GetSettledDates = async (
  payload: SettledDatesQueryParams,
): Promise<HttpResponse<string[]>> =>
  Get('/api/settlement/get_settled_dates', {
    params: ObjectFilterEmpty(payload),
  });

// 以上收入结算部分
// 以下成本结算部分

/**
 * 成本结算 - 保存基本信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-02 21:59:15
 */
export const SaveSettlementCostBasicInfo = async (
  type: 'live' | 'marketing' | 'common' | 'local_life' | 'supply_chain',
  payload: SettlementCostBasicInfoSaveParams,
): Promise<HttpResponse<{ id: number; settlement_uid: string }>> => {
  const api =
    type === 'live'
      ? APIs.SAVE_COST_SETTLEMENT_BASE_INFO_LIVE
      : type === 'local_life'
      ? APIs.SAVE_COST_SETTLEMENT_BASE_INFO_LOCAL_LIFE
      : type === 'supply_chain'
      ? APIs.SAVE_COST_SETTLEMENT_BASE_INFO_SUPPLY_CHAIN
      : type === 'marketing'
      ? APIs.SAVE_COST_SETTLEMENT_BASE_INFO_MARKETING
      : APIs.SAVE_COST_SETTLEMENT_BASE_INFO_COMMON;
  return Post(api, {
    ...ObjectFilterEmpty(payload),
  });
};

/**
 * 保存成本结算 - 第二步 - 营销业务(营销/V任务)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 00:12:06
 */
export const SaveSettlementCostStep2Marketing = async (
  payload: SettlementCostStep2MakettingParams,
): Promise<HttpResponse<Settlement>> => Post(APIs.SAVE_MARKETING_SETTLEMENT_DATA, payload);

/**
 * 上传主播机构对应文件 - 第二步
 * @since   2021-05-25 00:12:06
 */
export const UploadKolCompanyFile = async (payload: FormData): Promise<HttpResponse<undefined>> =>
  Post(APIs.UPLOAD_KOL_COMPANY_FILE, payload);

/**
 * 保存成本结算 - 第二步 - 淘宝cps before
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 00:12:06
 */
export const SaveSettlementCostStep2MCNTaobaoBefore = async (
  payload: SettlementCostMcnTaobaoBeforeSaveParams,
): Promise<HttpResponse<Settlement>> =>
  Post(APIs.COMMON_BUSINESS_SETTLEMENT_DATA_SAVE_API, payload);

/**
 * 生成成本结算 - 第二步 - 通用 before
 * @author  tingzhu
 * @since   2021-05-25 00:12:06
 */
export const GetSubCostSettlement = async (payload: {
  settlement_id: string | number;
}): Promise<HttpResponse<Settlement>> => Post(APIs.GET_SUB_COST_SETTLEMENT, payload);

/**
 * 保存成本结算 - 第二步 - 淘宝cps after
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 00:12:06
 */
export const SaveSettlementCostStep2MCNTaobaoAfter = async (
  payload: SettlementCostMcnTaobaoAfterSaveParams,
): Promise<HttpResponse<Settlement>> =>
  Post(APIs.COMMON_BUSINESS_SETTLEMENT_DATA_SAVE_API, payload);

export const ReloadKolCompanyRelationship = async (
  settlement_id: string,
): Promise<HttpResponse<any>> =>
  Get(APIs.RELOAD_KOL_COMPANY_RELATIONSHIP, {
    params: {
      settlement_id,
    },
  });

/**
 * 暂估收入结算 替换
 */

// 暂估收入替换 营销业务
export const ReplaceCoopEstimateSettlementIncome = async (payload: {
  settlement_id: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_COOP_ESTIMATE_INCOME_SETTLEMENT_API, payload);

// 暂估收入替换 店播业务
export const ReplaceLiveEstimateSettlementIncome = async (payload: {
  settlement_id: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_LIVE_ESTIMATE_INCOME_SETTLEMENT_API, payload);

// 暂估收入替换 本地生活
export const ReplaceLocalLifeEstimateSettlementIncome = async (payload: {
  settlement_id: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_LOCAL_LIFE_ESTIMATE_INCOME_SETTLEMENT_API, payload);

// 暂估收入替换 供应链
export const ReplaceSupplyChainEstimateSettlementIncome = async (payload: {
  settlement_id: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_SUPPLY_CHAIN_ESTIMATE_INCOME_SETTLEMENT_API, payload);

// 暂估收入替换 通用业务
export const ReplaceCommonEstimateSettlementIncome = async (payload: {
  settlement_id: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_COMMON_ESTIMATE_INCOME_SETTLEMENT_API, payload);

/**
 * 暂估成本 替换
 */
// 暂估成本替换 营销业务
export const ReplaceCoopEstimateSettlementCost = async (payload: {
  project_id: string;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_MARKETING_ESTIMATE_COST_SETTLEMENT_API, payload);

// 暂估成本替换 店播业务
export const ReplaceLiveEstimateSettlementCost = async (payload: {
  project_id: string;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_LIVE_ESTIMATE_COST_SETTLEMENT_API, payload);

// 暂估成本替换 本地生活
export const ReplaceLocalLifeEstimateSettlementCost = async (payload: {
  project_id: string;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_LOCAL_LIFE_ESTIMATE_COST_SETTLEMENT_API, payload);

// 暂估成本替换 供应链
export const ReplaceSupplyChainEstimateSettlementCost = async (payload: {
  project_id: string;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_SUPPLY_CHAIN_ESTIMATE_COST_SETTLEMENT_API, payload);

// 暂估成本替换 通用业务
export const ReplaceCommonEstimateSettlementCost = async (payload: {
  project_id: string;
  start_date: string;
  end_date: string;
}): Promise<HttpResponse<Settlement>> =>
  Post(APIs.REPLACE_COMMON_ESTIMATE_COST_SETTLEMENT_API, payload);

//  上传星图/抖音/团长服务费文件
export const uploadMCNDouyinFileService = async (
  payload: FormData,
  type: 'douyin' | 'xingtu' | 'head_fee',
): Promise<HttpResponse<IncomeFileUploadResponseData>> => {
  let url = '';
  switch (type) {
    case 'douyin':
      url = APIs.UPLOAD_DOUYIN_CPS_FILE_V2;
      break;
    case 'xingtu':
      url = APIs.UPLOAD_XINGTU_FILE;
      break;
    case 'head_fee':
      url = APIs.UPLOAD_GROUP_FILE;
      break;
    default:
      break;
  }
  return Post(url, payload);
};

//  查询结算周期内的坑位费
export const GetCompanyPitFee = async (
  payload: PitFeeParams,
): Promise<HttpResponse<{ data: CompanyPitFee[] }>> =>
  Get(APIs.GET_COMPANY_PIT_FEE, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 生成收入结算 - 第二步 - 通用 before
 * @author  tingzhu
 * @since   2021-05-25 00:12:06
 */
export const GetSubIncomeSettlement = async (payload: {
  settlement_id: string | number;
}): Promise<HttpResponse<any>> => Post(APIs.GET_SUB_INCOME_SETTLEMENT, payload);

/**
 * 下载场次商品明细excel
 * @author  tingzhu
 * @since   2021-05-25 00:12:06
 */
export const GetMarchantGoods = async (payload: {
  settlement_id: string | number | undefined;
}): Promise<HttpResponse<undefined>> =>
  Get(APIs.GET_MERCHANT_GOODS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const GetSettlementCompanyList = async (
  payload: CompanyListQueryParams,
): Promise<ListResponse<Company>> =>
  Get(APIs.QUERY_SETTLEMENT_COMPANY, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const GetAdCost = async (
  payload: AdCostParams,
): Promise<HttpResponse<{ sum_cost: number }>> =>
  Get(APIs.GET_AD_COST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const GetYFAdCost = async (
  payload: AdCostParams,
): Promise<HttpResponse<{ sum_cost: number }>> =>
  Get(APIs.GET_YF_AD_COST, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 查询结算单的开票数据
export const QuerySettlementInvoiceAmount = async (payload: any): Promise<HttpResponse<any>> =>
  Get(APIs.GET_SETTLEMENT_INVOICE_AMOUNT, {
    params: {
      ...ObjectFilterEmpty(payload ?? ''),
    },
  });

/**
 * 上传结算单扫描件
 */
export const SaveSettlementScan = async (payload: {
  settlement_id: number;
  settlement_scan_urls: string[];
  business_type: E.project.BusinessType;
}): Promise<HttpResponse<Settlement>> => {
  const { business_type, ...rest } = payload;
  switch (business_type) {
    case E.project.BusinessType.s2b2c:
      return Post('/api/settlement/update_settlement_scan_urls/common', {
        ...ObjectFilterEmpty(rest),
      });
    case E.project.BusinessType.marketing:
      return Post('/api/settlement/update_settlement_scan_urls/cooperation', {
        ...ObjectFilterEmpty(rest),
      });
    case E.project.BusinessType.taobao:
    case E.project.BusinessType.douyin:
    case E.project.BusinessType.taobaopick:
      return Post('/api/settlement/update_settlement_scan_urls/shop_live', {
        ...ObjectFilterEmpty(rest),
      });
    case E.project.BusinessType.locallife:
      return Post('/api/settlement/update_settlement_scan_urls/local_life', {
        ...ObjectFilterEmpty(rest),
      });
    case E.project.BusinessType.supplyChain:
      return Post('/api/settlement/update_settlement_scan_urls/supply_chain', {
        ...ObjectFilterEmpty(rest),
      });
    default:
      return Post('/api/settlement/update_settlement_scan_urls/shop_live', {
        ...ObjectFilterEmpty(rest),
      });
  }
};

/**
 * 审核结算单扫描件
 */
export const AuditSettlementScan = async (payload: {
  settlement_id: number;
  audit_message: string;
  audit_status: number;
}): Promise<HttpResponse<Settlement>> =>
  Post('/api/settlement/audit_settlement_scan', {
    ...ObjectFilterEmpty(payload),
  });
