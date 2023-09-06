/**
 * 合同 Services
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:12:00
 * *          .,:,,,                                        .::,,,::.
 * *        .::::,,;;,                                  .,;;:,,....:i:
 * *        :i,.::::,;i:.      ....,,:::::::::,....   .;i:,.  ......;i.
 * *        :;..:::;::::i;,,:::;:,,,,,,,,,,..,.,,:::iri:. .,:irsr:,.;i.
 * *        ;;..,::::;;;;ri,,,.                    ..,,:;s1s1ssrr;,.;r,
 * *        :;. ,::;ii;:,     . ...................     .;iirri;;;,,;i,
 * *        ,i. .;ri:.   ... ............................  .,,:;:,,,;i:
 * *        :s,.;r:... ....................................... .::;::s;
 * *        ,1r::. .............,,,.,,:,,........................,;iir;
 * *        ,s;...........     ..::.,;:,,.          ...............,;1s
 * *       :i,..,.              .,:,,::,.          .......... .......;1,
 * *      ir,....:rrssr;:,       ,,.,::.     .r5S9989398G95hr;. ....,.:s,
 * *     ;r,..,s9855513XHAG3i   .,,,,,,,.  ,S931,.,,.;s;s&BHHA8s.,..,..:r:
 * *    :r;..rGGh,  :SAG;;G@BS:.,,,,,,,,,.r83:      hHH1sXMBHHHM3..,,,,.ir.
 * *   ,si,.1GS,   sBMAAX&MBMB5,,,,,,:,,.:&8       3@HXHBMBHBBH#X,.,,,,,,rr
 * *   ;1:,,SH:   .A@&&B#&8H#BS,,,,,,,,,.,5XS,     3@MHABM&59M#As..,,,,:,is,
 * *  .rr,,,;9&1   hBHHBB&8AMGr,,,,,,,,,,,:h&&9s;   r9&BMHBHMB9:  . .,,,,;ri.
 * *  :1:....:5&XSi;r8BMBHHA9r:,......,,,,:ii19GG88899XHHH&GSr.      ...,:rs.
 * *  ;s.     .:sS8G8GG889hi.        ....,,:;:,.:irssrriii:,.        ...,,i1,
 * *  ;1,         ..,....,,isssi;,        .,,.                      ....,.i1,
 * *  ;h:               i9HHBMBBHAX9:         .                     ...,,,rs,
 * *  ,1i..            :A#MBBBBMHB##s                             ....,,,;si.
 * *  .r1,..        ,..;3BMBBBHBB#Bh.     ..                    ....,,,,,i1;
 * *   :h;..       .,..;,1XBMMMMBXs,.,, .. :: ,.               ....,,,,,,ss.
 * *    ih: ..    .;;;, ;;:s58A3i,..    ,. ,.:,,.             ...,,,,,:,s1,
 * *    .s1,....   .,;sh,  ,iSAXs;.    ,.  ,,.i85            ...,,,,,,:i1;
 * *     .rh: ...     rXG9XBBM#M#MHAX3hss13&&HHXr         .....,,,,,,,ih;
 * *      .s5: .....    i598X&&A&AAAAAA&XG851r:       ........,,,,:,,sh;
 * *      . ihr, ...  .         ..                    ........,,,,,;11:.
 * *         ,s1i. ...  ..,,,..,,,.,,.,,.,..       ........,,.,,.;s5i.
 * *          .:s1r,......................       ..............;shs,
 * *          . .:shr:.  ....                 ..............,ishs.
 * *              .,issr;,... ...........................,is1s;.
 * *                 .,is1si;:,....................,:;ir1sr;,
 * *                    ..:isssssrrii;::::::;;iirsssssr;:..
 * *                         .,::iiirsssssssssrri;;:.
 */

import request, { Get, Post, Put } from '@/utils/request';
import * as APIs from '@/apis/contract';
import { ObjectFilterEmpty } from '@/utils/func';
import { HttpResponse, HttpResponseData, ListResponse } from '@/types/base/http';
import {
  Contract,
  ContractAnnex,
  ContractAnnexQueryParams,
  ContractAnnexSaveParams,
  ContractQueryParams,
  ContractSaveParams,
  ContractScanDeleteParams,
  ContractScanSaveParams,
  ContractStatementsSaveParams,
  Settlement,
  SettlementListQueryParams,
} from '@/types/tiange/contract';
import { ApprovalFlow } from '@/types/oa/approval';
import { IGPageQuery } from '@/types/tiange/general';

/**
 * 获取合同编号
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-20 10:13:31QUERY_CONTRACT
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=75&itf=809
 */
export const GetContractUid = async (payload: any): Promise<ListResponse<any>> =>
  Get(APIs.QUERY_CONTRACT_UID, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取合同列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:41:25
 */
export const GetContractLawList = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_LAW_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取统计合同列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:41:25
 */
export const GetStatisticsContractLawList = async (
  payload: ContractQueryParams,
): Promise<ListResponse<any>> =>
  Get(APIs.QUERY_LAW_STATISTICS_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取法务合同列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:41:25
 */
export const GetContractList = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取拷贝上面----换成法务
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:41:25
 */
export const GetContractListLegel = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_LAW_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取拷贝上面----换成法务统计详情
 */
export const GetContractListLegelStatistics = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_LAW_STATISTICS_DETAIL_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取拷贝上面----换成主播合同详情
 */
export const GetContractListAnchor = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_LAW_ANCHOR_DETAIL_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取拷贝上面----换成主播合同详情供应链
 */
export const GetContractListSupply = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_SUPPLY_CHAIN_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取拷贝上面----换成主播合同详情本地生活
 */
export const GetContractListLocalList = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_LOCAL_LIFE_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取拷贝上面----换成合同详情 - 无权限
 */
export const QuerySkipPermissionsContract = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_SKIP_PERMISSIONS_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取拷贝上面----换成店播
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:41:25
 */
export const GetContractListShop = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_SHOP_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取项目合同列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:41:25
 */
export const GetContractShopList = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_SHOP_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取 通用业务 项目合同列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-17 18:51:35
 */
export const GetContractCommonBusinessList = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_COMMON_BUSINESS_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取营销业务项目合同列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 00:41:25
 */
export const GetCoopContractList = async (
  payload: ContractQueryParams,
): Promise<ListResponse<Contract>> =>
  Get(APIs.QUERY_COOP_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取项目合同列表
 */
export const GetContractListByType = async (
  payload: ContractQueryParams,
  type: any,
  asExternal = false,
): Promise<ListResponse<Contract>> => {
  let response;
  if (asExternal) {
    response = await QuerySkipPermissionsContract(payload);
  } else if (type === '1') {
    //  营销
    response = await Get(APIs.QUERY_COOP_CONTRACT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === '2' || type === '6') {
    //  品牌中心
    response = await Get(APIs.QUERY_SHOP_CONTRACT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === '4') {
    //  本地生活
    response = await Get(APIs.QUERY_LOCAL_LIFE_CONTRACT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === '5') {
    //  供应链
    response = await Get(APIs.QUERY_SUPPLY_CHAIN_CONTRACT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  } else {
    //  MCN
    response = await Get(APIs.QUERY_COMMON_BUSINESS_CONTRACT, {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Promise.resolve(response);
};

/**
 * 店铺代播新增/编辑合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:46:01
 */
export const SaveContractShop = async (
  payload: ContractSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_CONTRACT_SHOP, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 通用业务 新增/编辑合同
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-18 09:57:01
 */
export const SaveContractCommonBusiness = async (
  payload: ContractSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_CONTRACT_COMMON_BUSINESS, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 营销业务项目新增/编辑合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-25 14:46:01
 */
export const SaveCoopContract = async (
  payload: ContractSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_COOPERATION_CONTRACT, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * @param type 1:默认, 2:法务 3:店播 4:营销业务
 * 获取单个合同
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 00:13:19
 */
export const GetContract = async (
  payload: ContractQueryParams,
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | number = 1,
  isExternal = false,
): Promise<HttpResponseData<Contract | undefined>> => {
  let response;
  if (isExternal) {
    response = await QuerySkipPermissionsContract(payload);
  } else {
    switch (type) {
      case 1:
        response = await GetContractList(payload);
        break;
      case 2:
        response = await GetContractListLegel(payload);
        break;
      case 3:
        response = await GetContractListShop(payload);
        break;
      case 4:
        response = await GetCoopContractList(payload);
        break;
      case 5:
        response = await GetContractCommonBusinessList(payload);
        break;
      case 6:
        response = await GetContractListLegelStatistics(payload);
        break;
      case 7:
        response = await GetContractListAnchor(payload);
        break;
      case 8:
        response = await GetContractListLocalList(payload);
        break;
      case 9:
        response = await GetContractListSupply(payload);
        break;
      default:
        throw new Error('未知类型');
    }
  }
  if (response.data.success && response.data) {
    const {
      data: {
        data: { data, total },
        message,
        success,
        error_code,
      },
    } = response;

    if (success && total > 0) {
      return Promise.resolve({
        data: data[0],
        message,
        success,
        error_code,
      });
    } else {
      return Promise.resolve({
        data: undefined,
        message,
        success: false,
        error_code,
      });
    }
  } else {
    const {
      data: { message, error_code },
    } = response;
    return Promise.resolve({
      data: undefined,
      message,
      success: false,
      error_code,
    });
  }
};

/**
 * 查询(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 11:47:39
 */
export const GetContractAnnex = async (
  payload: ContractAnnexQueryParams,
): Promise<ListResponse<ContractAnnex>> =>
  Get(APIs.QUERY_CONTRACT_ANNEX, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 新增补充协议(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 16:55:19
 */
export const SaveContractAnnex = async (
  payload: ContractAnnexSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_CONTRACT_ANNEX, {
    ...ObjectFilterEmpty(payload),
  });
/**
 * 店铺代波新增补充协议(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 16:55:19
 */
export const SaveContractAnnexShop = async (
  payload: ContractAnnexSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_annex/shop_live', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 通用项目 新增补充协议(合同附件)
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-18 10:02:19
 */
export const SaveContractAnnexCommonBusiness = async (
  payload: ContractAnnexSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_annex/common', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 营销业务新增补充协议(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-26 16:55:19
 */
export const SaveContractAnnexCoop = async (
  payload: ContractAnnexSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_annex/coop', {
    ...ObjectFilterEmpty(payload),
  });
/**
 * 删除补充协议(合同附件)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-30 23:05:58
 */
export const DeleteContractAnnex = async (id: number): Promise<HttpResponse<undefined>> =>
  Post(APIs.DELETE_CONTRACT_ANNEX.replace(':id', `${id}`));

/**
 * 获取合同结算单列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-27 11:55:07
 */
export const GetContractStatements = async (
  payload: SettlementListQueryParams,
): Promise<ListResponse<Settlement>> =>
  Get(APIs.QUERY_CONTRACT_STATEMENTS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 新增结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-29 15:53:00
 */
export const SaveContractStatements = async (
  payload: ContractStatementsSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_CONTRACT_STATEMENTS, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 店铺代播结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-29 15:53:00
 */
export const SaveContractStatementsShop = async (
  payload: ContractStatementsSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_statements/shop_live', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 本地生活结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-29 15:53:00
 */
export const SaveContractStatementsLocalLife = async (
  payload: ContractStatementsSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_statements/local_life', {
    ...ObjectFilterEmpty(payload),
  });
/**
 * 供应链结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-29 15:53:00
 */
export const SaveContractStatementsSupplyChain = async (
  payload: ContractStatementsSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_statements/supply_chain', {
    ...ObjectFilterEmpty(payload),
  });
/**
 * 通用项目 结算单
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-18 10:01:00
 */
export const SaveContractStatementsCommonBusiness = async (
  payload: ContractStatementsSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_statements/common', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 营销业务结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-29 15:53:00
 */
export const SaveContractStatementsCoop = async (
  payload: ContractStatementsSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/save_contract_statements/coop', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 删除合同结算单
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-30 11:17:52
 */
export const DeleteContractStatements = async (id: number): Promise<HttpResponse<undefined>> =>
  Post(APIs.DELETE_CONTRACT_STATEMENTS.replace(':id', `${id}`));

/**
 * 获取补充协议审批流
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-01 00:18:33
 */
export const GetContractAnnexApprovalFlow = async (
  id: number,
): Promise<HttpResponse<ApprovalFlow[]>> =>
  Get(APIs.GET_CONTRACT_ANNEX_APPROVAL_FLOW.replace(':id', `${id}`));

/**
 * 获取结算单审批流
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-01 00:18:33
 */
export const GetContractStatementsApprovalFlow = async (
  id: number,
): Promise<HttpResponse<ApprovalFlow[]>> =>
  Get(APIs.GET_CONTRACT_STATEMENTS_APPROVAL_FLOW.replace(':id', `${id}`));

/**
 * 获取合同审批流详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-02 11:25:13
 */
export const GetContractApprovalFlow = async (id: number): Promise<HttpResponse<ApprovalFlow[]>> =>
  Get(APIs.GET_CONTRACT_APPROVAL_FLOW.replace(':id', `${id}`));

/**
 * 获取关联合同审批流详情
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-02 11:25:13
 */
export const GetAssociateContractApprovalFlow = async (payload: {
  contract_id: number;
  project_uid: string;
}): Promise<HttpResponse<ApprovalFlow[]>> =>
  Get(APIs.GET_ASSOCIATE_CONTRACT_APPROVAL_FLOW, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 保存合同扫描件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 09:42:37
 */
export const SaveContractScan = async (
  payload: ContractScanSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_CONTRACT_SCAN, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 保存合同扫描件-法务
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 09:42:37
 */
export const SaveContractScanLegal = async (
  payload: ContractScanSaveParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_CONTRACT_SCAN_LEGAL, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 删除合同扫描件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 17:49:13
 */
export const DeleteContractScan = async (
  payload: ContractScanDeleteParams,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.DELETE_CONTRACT_SCAN, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 获取模板合同列表。
 */
export const GetTemplateContractList = async (payload: any): Promise<ListResponse<undefined>> =>
  Get(APIs.QUERY_TEMPLATE_CONTRACT, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
/**
 * 获取模板合同列表。区分品牌中心、mcn、营销项目
 */
export const GetTemplateDownContractList = async (
  payload: any,
  type: any,
): Promise<ListResponse<undefined>> =>
  Get(
    type === 'mcn'
      ? APIs.QUERY_TEMPLATE_MCN_CONTRACT
      : type === 'live'
      ? APIs.QUERY_TEMPLATE_LIVE_CONTRACT
      : type === 'local_life'
      ? APIs.QUERY_TEMPLATE_LOCAL_LIFE_CONTRACT
      : type === 'supply_chain'
      ? APIs.QUERY_TEMPLATE_SUPPLY_CHAIN_CONTRACT
      : APIs.QUERY_TEMPLATE_MARKETING_CONTRACT,
    {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    },
  );
/**
 * 新增模板合同
 */
export const PostTemplateContractDetail = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_TEMPLATE_UPLAODE_CONTRACT, {
    ...ObjectFilterEmpty(payload),
  });
/**
 * 更新、删除模板合同
 */
export const UploadTemplateContractDetail = async (
  payload: any,
): Promise<HttpResponse<undefined>> =>
  Put(APIs.UPLOAD_TEMPLATE_INFO_CONTRACT, {
    ...ObjectFilterEmpty(payload),
  });

/*// 合同模板相关
// 上传附件
/!** @deprecated *!/
export const uploadContractAttachment = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/upload_contract_template_file/', {
    params: {
      ...payload,
    },
  });*/
// 合同相关
// 上传附件
/** @deprecated */
export function uploadContractAttachment(data: Record<string, any>) {
  return request({
    url: '/api/cont/upload_contract_template_file/',
    method: 'post',
    data: data,
  });
}

/**
 * 新增、编辑直播协议模板合同
 */
export const PostTemplateProjectContractDetail = async (
  payload: any,
  project_type: any,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_TEMPLATE_CONTRACT + project_type, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 预览、下载直播协议模板合同PDF
 */
export const PostPreviewTemplateContractDetail = async (
  payload: any,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.QUERY_TEMPLATE_PREVIEW_CONTRACT, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 新增、编辑主播直播协议模板合同
 */
export const PostTemplateAnchorContractDetail = async (
  payload: any,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.SAVE_ANCHOR_TEMPLATE_CONTRACT, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 预览、下载直播协议模板合同PDF
 */
export const PostPreviewAnchorTemplateContractDetail = async (
  payload: any,
): Promise<HttpResponse<undefined>> =>
  Post(APIs.QUERY_ANCHOR_TEMPLATE_PREVIEW_CONTRACT, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 获取合同看板概览。
 */
export const GetContract_overview = async (payload: any): Promise<ListResponse<undefined>> =>
  Get('/api/cont/query_law_contract_overview', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 查找合同简要信息
 */
export const GetLawContractSimple = async (payload: any): Promise<ListResponse<undefined>> =>
  Get('/api/cont/query_law_contract_simple', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 审核合同扫描件
 */
export const PostVerify_contract_scan = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/verify_contract_scan', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 审核用印申请扫描件
 */
export const PostVerify_use_sea_scan = async (payload: any): Promise<HttpResponse<undefined>> =>
  Post('/api/approval/verify_use_seal_scan', {
    ...ObjectFilterEmpty(payload),
  });
/**
 * 查找合同简要信息
 */
export const GetWithout_contract = async (payload: any): Promise<ListResponse<undefined>> =>
  Get('/api/cont/project_without_contract', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 获取项目合同列表
 */
export const GetNewContractListByType = async (
  pager: IGPageQuery,
  payload: ContractQueryParams,
  type?: string,
): Promise<ListResponse<Contract>> => {
  let response;
  if (type === '1') {
    //  营销
    response = await Get(APIs.QUERY_COOP_CONTRACT, {
      params: {
        ...pager,
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === '2') {
    //  品牌中心
    response = await Get(APIs.QUERY_SHOP_CONTRACT, {
      params: {
        ...pager,
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === '4') {
    //  本地生活
    response = await Get(APIs.QUERY_LOCAL_LIFE_CONTRACT, {
      params: {
        ...pager,
        ...ObjectFilterEmpty(payload),
      },
    });
  } else if (type === '5') {
    //  本地生活
    response = await Get(APIs.QUERY_SUPPLY_CHAIN_CONTRACT, {
      params: {
        ...pager,
        ...ObjectFilterEmpty(payload),
      },
    });
  } else {
    //  MCN
    response = await Get(APIs.QUERY_COMMON_BUSINESS_CONTRACT, {
      params: {
        ...pager,
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Promise.resolve(response);
};

/**
 * 关联已有合同
 */
export const AssociateExistingContractApply = async (
  payload: {
    project_uid?: string;
    contract_id: number;
  },
  type?: string,
): Promise<ListResponse<Contract>> => {
  let response;
  if (type === '1') {
    //  营销
    response = await Post('/api/cont/associate_existing_contract_apply/coop', {
      ...ObjectFilterEmpty(payload),
    });
  } else if (type === '2') {
    //  品牌中心
    response = await Post('/api/cont/associate_existing_contract_apply/shop_live', {
      ...ObjectFilterEmpty(payload),
    });
  } else if (type === '4') {
    //  本地生活
    response = await Post('/api/cont/associate_existing_contract_apply/local_life', {
      ...ObjectFilterEmpty(payload),
    });
  } else if (type === '5') {
    //  供应链
    response = await Post('/api/cont/associate_existing_contract_apply/supply_chain', {
      ...ObjectFilterEmpty(payload),
    });
  } else {
    //  MCN
    response = await Post('/api/cont/associate_existing_contract_apply/common', {
      ...ObjectFilterEmpty(payload),
    });
  }
  return Promise.resolve(response);
};

// 合同台账-查询供应商合同
export const QueryDepositRecevied = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<Record<string, any>>> =>
  Get('/api/cont/query_provider_contract', {
    params: ObjectFilterEmpty({
      ...payload,
      ...pager,
    }),
  });

// 合同台账-查询客户合同
export const QueryCustomerContract = async (
  pager: IGPageQuery,
  payload: any,
): Promise<ListResponse<Record<string, any>>> =>
  Get('/api/cont/query_customer_contract', {
    params: ObjectFilterEmpty({
      ...payload,
      ...pager,
    }),
  });

/**
 * 合同台账-编辑合同税目接口
 */
export const UpdateContractTaxSubject = async (payload: {
  id: number;
  tax_subject_type: number;
}): Promise<HttpResponse<undefined>> =>
  Post('/api/cont/update_contract_tax_subject', {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 查找通用合同
 */
export const GetLawContractGeneral = async (payload: {
  page_num?: number;
  num?: number;
  contract_uid?: string;
  company_name?: string;
}): Promise<ListResponse<undefined>> =>
  Get('/api/cont/query_public_contract', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

// 通用-删除合同
export const DeleteContractGeneral = async (payload: {
  contract_uid: string;
}): Promise<HttpResponse<any>> =>
  Post('/api/cont/delete_public_contract', {
    ...ObjectFilterEmpty(payload),
  });

// 通用-修改
export const UpdateContractGeneral = async (payload: {
  contract_uid: string;
  business_types: number[];
}): Promise<HttpResponse<any>> =>
  Post('/api/cont/update_public_contract', {
    ...ObjectFilterEmpty(payload),
  });

// 通用-新增
export const AddContractGeneral = async (payload: {
  contract_uid: string;
  business_types: number[];
}): Promise<HttpResponse<any>> =>
  Post('/api/cont/add_public_contract', {
    ...ObjectFilterEmpty(payload),
  });

// 获取合作下的所有合同编号-通用新增、编辑
export const GetGeneralContractUid = async (payload: any): Promise<HttpResponse<any>> =>
  Get('/api/cont/query_contract_by_uid', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
