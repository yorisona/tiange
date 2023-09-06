import { useRouter } from '@/use/vue-router';
import { RouterNameProjectManage, RouterLegal, RouterNameSupplier } from '@/const/router';
export const useBreadcrumb = (isMerchant = false) => {
  const router = useRouter();
  const currentRouterName = router.currentRoute.name || '';

  /** 通用业务 详情 */
  const isCommonBusinessDetail =
    RouterNameProjectManage.commonBusiness.project.detail === currentRouterName ||
    isMerchant ||
    currentRouterName.indexOf('CommonBusiness') >= 0;

  // 是否 MCN-供应商合同详情
  const isCommonBusinessSupplierContractDetail =
    RouterNameProjectManage.commonBusiness.contract.supplier.detail === currentRouterName ||
    RouterNameProjectManage.commonBusiness.contract.supplier.detailTemplate === currentRouterName ||
    RouterNameProjectManage.commonBusiness.contract.anchor.detailTemplate === currentRouterName;
  // MCN-客户合同
  const isCommonBusinessCustomerContractDetail =
    RouterNameProjectManage.commonBusiness.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.commonBusiness.contract.customer.detailTemplate === currentRouterName;

  // 是否品牌中心-供应商合同详情
  const isLiveSupplierContractDetail =
    RouterNameProjectManage.live.contract.supplier.detail === currentRouterName ||
    RouterNameProjectManage.live.contract.supplier.detailTemplate === currentRouterName ||
    RouterNameProjectManage.live.contract.anchor.detailTemplate === currentRouterName;
  // 是否品牌中心-客户合同
  const isLiveCustomerContractDetail =
    RouterNameProjectManage.live.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.live.contract.customer.detailTemplate === currentRouterName;
  // 是否抖音店播-客户合同
  const isTiktokLiveCustomerContractDetail =
    RouterNameProjectManage.tiktokLive.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.tiktokLive.contract.customer.detailTemplate === currentRouterName;
  // 是否抖音店播-供应商合同详情
  const isTiktokSupplierContractDetail =
    RouterNameProjectManage.tiktokLive.contract.supplier.detail === currentRouterName ||
    RouterNameProjectManage.tiktokLive.contract.supplier.detailTemplate === currentRouterName ||
    RouterNameProjectManage.tiktokLive.contract.anchor.detailTemplate === currentRouterName;

  // 是否本地生活-客户合同
  const isLocalLifeCustomerContractDetail =
    RouterNameProjectManage.localLife.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.localLife.contract.customer.detailTemplate === currentRouterName;
  // 是否本地生活-供应商合同详情
  const isLocalLifeSupplierContractDetail =
    RouterNameProjectManage.localLife.contract.supplier.detail === currentRouterName ||
    RouterNameProjectManage.localLife.contract.supplier.detailTemplate === currentRouterName ||
    RouterNameProjectManage.localLife.contract.anchor.detailTemplate === currentRouterName;

  // 是否供应链-客户合同
  const isSupplyChainCustomerContractDetail =
    RouterNameProjectManage.supplyChain.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.supplyChain.contract.customer.detailTemplate === currentRouterName;

  // 是否供应链-供应商合同详情
  const isSupplyChainSupplierContractDetail =
    RouterNameProjectManage.supplyChain.contract.supplier.detail === currentRouterName ||
    RouterNameProjectManage.supplyChain.contract.supplier.detailTemplate === currentRouterName ||
    RouterNameProjectManage.supplyChain.contract.anchor.detailTemplate === currentRouterName;
  // 是否客户合同详情--模板--MCN
  const isisCommonBusinessCustomerContractDetailTemplate =
    RouterNameProjectManage.commonBusiness.contract.customer.detailTemplate === currentRouterName;

  // 是否整合营销-供应商合同详情
  const isCoopSupplierContractDetail =
    RouterNameProjectManage.marketing.contract.supplier.detail === currentRouterName ||
    RouterNameProjectManage.marketing.contract.supplier.detailTemplate === currentRouterName ||
    RouterNameProjectManage.marketing.contract.anchor.detailTemplate === currentRouterName;
  // 是否整合营销-客户合同
  const isCoopCustomerContractDetail =
    RouterNameProjectManage.marketing.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.marketing.contract.customer.detailTemplate === currentRouterName;
  // 是否法务合同-供应商合同详情
  const isLegalSupplierContractDetail =
    RouterLegal.contracts.supplier.detail === currentRouterName ||
    RouterLegal.contracts.supplier.detailTemplate === currentRouterName ||
    RouterLegal.contracts.anchor.detailTemplate === currentRouterName;
  // 是否法务合同-客户合同
  const isLegalCustomerContractDetail =
    RouterLegal.contracts.customer.detail === currentRouterName ||
    RouterLegal.contracts.customer.detailTemplate === currentRouterName;
  // 是否法务统计合同-供应商合同详情
  const isLegalStatisticsSupplierContractDetail =
    RouterLegal.statistics.supplier.detail === currentRouterName ||
    RouterLegal.statistics.supplier.detailTemplate === currentRouterName ||
    RouterLegal.statistics.anchor.detailTemplate === currentRouterName;
  // 是否法务统计合同-客户合同
  const isLegalStatisticsCustomerContractDetail =
    RouterLegal.statistics.customer.detail === currentRouterName ||
    RouterLegal.statistics.customer.detailTemplate === currentRouterName;
  // 是否营销业务
  const isCoopDetail =
    RouterNameProjectManage.marketing.project.detail === currentRouterName ||
    currentRouterName.indexOf('Marketing') >= 0;
  // 是否店播业务
  const isLiveDetail =
    RouterNameProjectManage.live.project.detail === currentRouterName ||
    currentRouterName.indexOf('SSTikTokLive') >= 0 ||
    currentRouterName.indexOf('SSLive') >= 0;
  // 是否店播业务
  const isLocalLifeDetail = currentRouterName.indexOf('SSLocalLife') >= 0;
  // 是否供应链
  const isSupplyChainDetail = router.currentRoute.fullPath.indexOf('supplyChain') >= 0;
  // 是否是客户合同详情
  const isCustomerDetail =
    RouterNameProjectManage.commonBusiness.contract.customer.detailTemplate === currentRouterName ||
    RouterLegal.contracts.customer.detailTemplate === currentRouterName ||
    RouterNameProjectManage.marketing.contract.customer.detailTemplate === currentRouterName ||
    RouterNameProjectManage.live.contract.customer.detailTemplate === currentRouterName ||
    RouterNameProjectManage.localLife.contract.customer.detailTemplate === currentRouterName ||
    RouterNameProjectManage.supplyChain.contract.customer.detailTemplate === currentRouterName ||
    RouterNameProjectManage.commonBusiness.contract.customer.detail === currentRouterName ||
    RouterLegal.contracts.customer.detail === currentRouterName ||
    RouterNameProjectManage.marketing.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.live.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.localLife.contract.customer.detail === currentRouterName ||
    RouterNameProjectManage.supplyChain.contract.customer.detail === currentRouterName ||
    RouterLegal.statistics.customer.detail === currentRouterName ||
    RouterLegal.statistics.customer.detailTemplate === currentRouterName ||
    RouterLegal.contracts.customer.detail === currentRouterName ||
    RouterNameProjectManage.tiktokLive.contract.customer.detailTemplate === currentRouterName ||
    RouterNameProjectManage.tiktokLive.contract.customer.detail === currentRouterName;
  // 是否主播
  const isAnchorDetail = RouterNameSupplier.player_contract === currentRouterName;
  return {
    isCustomerDetail,
    isCommonBusinessDetail,
    isCommonBusinessSupplierContractDetail,
    isCommonBusinessCustomerContractDetail,
    isLiveSupplierContractDetail,
    isLiveCustomerContractDetail,
    isTiktokLiveCustomerContractDetail,
    isTiktokSupplierContractDetail,
    isLocalLifeSupplierContractDetail,
    isLocalLifeCustomerContractDetail,
    isSupplyChainCustomerContractDetail,
    isSupplyChainSupplierContractDetail,
    isLegalCustomerContractDetail,
    isLegalSupplierContractDetail,
    isLegalStatisticsSupplierContractDetail,
    isLegalStatisticsCustomerContractDetail,
    isCoopSupplierContractDetail,
    isCoopCustomerContractDetail,
    isCoopDetail,
    isLiveDetail,
    isLocalLifeDetail,
    isSupplyChainDetail,
    isisCommonBusinessCustomerContractDetailTemplate,
    isAnchorDetail,
  };
};
