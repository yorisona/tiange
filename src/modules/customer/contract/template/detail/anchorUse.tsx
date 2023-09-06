import { computed, provide, reactive, ref, toRef } from '@vue/composition-api';
import { Contract, ContractScanSaveParams } from '@/types/tiange/contract';
import {
  DeleteContractScan,
  GetContract,
  GetContractApprovalFlow,
  SaveContractScan,
  SaveContractScanLegal,
} from '@/services/contract';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { ApprovalStatus, ApprovalStatusMap } from '@/types/tiange/system';
import { uploadFile } from '@/api/cooperative';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { RouterNameProjectManage, RouterLegal, RouterNameSupplier } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import { useCache } from '@/use/cache';
import { ApprovalFlow } from '@/types/oa/approval';
import { sleep } from '@/utils/func';
import { Message } from 'element-ui';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { deleteContracts, invalidContract } from '@/api/customer';
import { useUserInfo } from '@/use/vuex';
import { isExternal } from '@/router/routeGuard';
import { BreadcrumbsRoutes } from '@/types/components/breadcrumbs';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
// import moduleName from 'useu';

export const useContract = (ctx: any) => {
  const detail = ref<Contract>();
  const router = useRouter();
  const breadcrumb = useBreadcrumb();
  const currentUserInfo = useUserInfo();
  let lastPayload: any = 1;

  const isFlowFromOA = computed(() => {
    return (
      (detail.value?.contract_info.contract_status === ApprovalStatus.Processing ||
        detail.value?.contract_info.contract_status === ApprovalStatus.Failure) &&
      (detail.value?.contract_info.feishu_request_id !== null ||
        detail.value?.contract_info.oa_request_id !== null)
    );
  });

  const { getCache, setCache } = useCache<ApprovalFlow[]>();
  const fetchContractApprovalFlow = async (id: number) => {
    flow.flowsLoading = true;
    const [{ data: response }, _] = await Promise.all([
      await GetContractApprovalFlow(id),
      await sleep(200),
    ]);
    flow.flowsLoading = false;
    if (response.success) {
      setCache(id, response.data);
      flow.flowsError = '';
      return response.data;
    } else {
      flow.flowsError = response.message;
      return false;
    }
  };
  const flow = reactive({
    flowsLoading: true,
    isFlowFromOA,
    flows: [],
    status: 1,
    flowsError: '',
    onFlowsShow: async () => {
      const id = detail.value?.contract_info.id;
      if (id === undefined) {
        return;
      }
      const checkedFlow = getCache(id) ?? (await fetchContractApprovalFlow(id));

      if (checkedFlow !== false) {
        flow.flows = checkedFlow as any;
        flow.status = detail.value?.contract_info.contract_status as any;
      }
    },
  });
  provide('flows', toRef(flow, 'flows'));

  const queryContractDetail = async (payload: any) => {
    lastPayload = payload;
    let getType = 7;
    if (breadcrumb.isLegalSupplierContractDetail || breadcrumb.isLegalCustomerContractDetail) {
      getType = 2;
    } else if (
      breadcrumb.isLiveCustomerContractDetail ||
      breadcrumb.isLiveSupplierContractDetail ||
      breadcrumb.isTiktokLiveCustomerContractDetail ||
      breadcrumb.isTiktokSupplierContractDetail
    ) {
      getType = 3;
    } else if (breadcrumb.isCoopSupplierContractDetail || breadcrumb.isCoopCustomerContractDetail) {
      getType = 4;
    } else if (
      breadcrumb.isSupplyChainCustomerContractDetail ||
      breadcrumb.isSupplyChainSupplierContractDetail
    ) {
      getType = 9;
    } else if (
      breadcrumb.isLocalLifeCustomerContractDetail ||
      breadcrumb.isLocalLifeSupplierContractDetail
    ) {
      getType = 8;
    } else if (
      breadcrumb.isCommonBusinessCustomerContractDetail ||
      breadcrumb.isCommonBusinessSupplierContractDetail ||
      breadcrumb.isisCommonBusinessCustomerContractDetailTemplate
    ) {
      /** 通用业务 */
      getType = 5;
    } else if (
      breadcrumb.isLegalStatisticsSupplierContractDetail ||
      breadcrumb.isLegalStatisticsCustomerContractDetail
    ) {
      getType = 6;
    } else if (breadcrumb.isAnchorDetail) {
      getType = 7;
    }
    // const isExternal = router.currentRoute.query.source === 'external';
    const response = await GetContract(payload, getType, isExternal());
    if (response.success && response.data) {
      detail.value = transformDetailData(response.data);
    } else {
      ctx.root.$message.warning(response.message ?? '合同详情获取失败，稍后重试');
    }
  };

  const transformDetailData = (data: any) => {
    if (!data.template_info) return data;
    const template_info = data.template_info;
    if (data?.contract_detail?.contract_scan_urls) {
      data.contract_detail.contract_scan_urls = data?.contract_detail?.contract_scan_urls.map(
        (item: any) => {
          item.file_name = decodeURIComponent(item.file_name);
          return item;
        },
      );
    }
    if (data?.contract_detail?.attachment_url_list) {
      data.contract_detail.attachment_url_list = data?.contract_detail?.attachment_url_list.map(
        (item: any) => {
          item.file_name = decodeURIComponent(item.file_name);
          return item;
        },
      );
    }
    const add_by = { key: '创建人', value: data.contract_info.add_by_name };
    const parther_name = {
      key: '供应商名称',
      value: data?.contract_info?.company_name,
    };
    data.template_info.extend_contract_info = [parther_name, add_by];
    const transformKey = ['others', 'margin', 'cooperation_content', 'cooperation_duration'];
    transformKey.forEach(key => {
      const tmp: Record<string, any> = {};
      if (template_info[key]) {
        template_info[key].forEach((item: { key: string; value: any }) => {
          tmp[item.key] = item.value;
        });
      }
      template_info[`${key}Map`] = tmp;
    });
    template_info.hasMargin = template_info.marginMap['是否有保证金'] === 1;
    // template_info.hasTryCooperation = template_info.cooperation_durationMap['试合作期'] === '有';
    // 额外的进行转换
    if (template_info.cooperation_content) {
      const cooperation_content: { key: string; value: any }[] = [];
      let tmp: { key: string; value: any };
      template_info.cooperation_content = cooperation_content;
      const computeWayRecords = [
        { value: 1, label: '小时服务费' },
        { value: 9, label: '保底服务费' },
        { value: 4, label: '小时服务费或提点' },
        { value: 2, label: '保底服务费或提点' },
        { value: 5, label: '小时服务费或阶梯式提点' },
        { value: 6, label: '保底服务费或阶梯式提点' },
        { value: 7, label: '保底服务费A或保底服务费B+提点' },
        { value: 8, label: '小时服务费或保底服务费+提点' },
      ];
      const index = template_info.cooperation_contentMap['计算方式'];
      let str = '';
      computeWayRecords.map((item: any) => {
        if (String(item.value) === String(index)) {
          str = item.label;
        }
      });
      tmp = { key: '计算方式', value: str };
      cooperation_content.push(tmp);
      if (index === 1 || index === 4 || index === 5 || index === 8) {
        tmp = { key: '小时服务费', value: template_info.cooperation_contentMap['小时服务费'] };
        cooperation_content.push(tmp);
      }
      if (index === 9 || index === 2 || index === 6 || index === 8) {
        tmp = { key: '保底服务费', value: template_info.cooperation_contentMap['保底服务费'] };
        cooperation_content.push(tmp);
      }
      if (index === 7) {
        tmp = { key: '保底服务费A', value: template_info.cooperation_contentMap['保底服务费A'] };
        cooperation_content.push(tmp);
        tmp = { key: '保底服务费B', value: template_info.cooperation_contentMap['保底服务费B'] };
        cooperation_content.push(tmp);
      }
      if (index === 4 || index === 2 || index === 7 || index === 8) {
        tmp = { key: '提成比例', value: template_info.cooperation_contentMap['提成比例'] + '%' };
        cooperation_content.push(tmp);
      }
      if (index === 5 || index === 6) {
        const settlement_month_sales: any = template_info.cooperation_contentMap['阶梯提点'];
        settlement_month_sales.map((item: any, index: number) => {
          tmp = {
            key: '阶梯' + (index + 1) + '：月净销额（万）',
            value:
              index === 0
                ? '0 - ' + settlement_month_sales[0].settlement_month_sales_point
                : settlement_month_sales[index - 1].settlement_month_sales_point +
                  (item.settlement_month_sales_point
                    ? ' - ' + item.settlement_month_sales_point
                    : '万以上'),
          };
          cooperation_content.push(tmp);
          tmp = {
            key: '提成比例' + (index + 1),
            value: item.settlement_month_sales_rate + '%',
          };
          cooperation_content.push(tmp);
        });
      }
      tmp = { key: '票款类型', value: template_info.cooperation_contentMap['票款类型'] };
      cooperation_content.push(tmp);
      tmp = { key: '发票类型', value: template_info.cooperation_contentMap['发票类型'] };
      cooperation_content.push(tmp);
      tmp = { key: '税率', value: template_info.cooperation_contentMap['税率'] };
      cooperation_content.push(tmp);
    }

    return data;
  };

  const reload = async () => {
    queryContractDetail(lastPayload);
  };

  const contract_status = computed(() => {
    const text = ApprovalStatusMap.get(detail.value?.contract_info.contract_status ?? 2) ?? '';
    let style = 'status-approval';
    switch (detail.value?.contract_info.contract_status) {
      case ApprovalStatus.Failure:
        style = 'status-error';
        break;
      case ApprovalStatus.Normal:
        style = 'status-success';
        break;
      case ApprovalStatus.Invalid:
        style = 'status-fail';
        break;
      default:
        break;
    }
    return {
      text,
      style,
    };
  });

  const uploadScanFiles = async (options: any) => {
    try {
      if (
        !ValidationFileUpload({
          excel: true,
          pdf: true,
          doc: true,
          // image: true,
          fileSize: 50,
        })(options.file)
      )
        return;
      const form = new FormData();
      form.append('file', options.file);
      form.append('type', 'contract/scan');
      const { data: response } = await uploadFile(form);
      if (!response.success) {
        throw new Error(response.message || '上传失败');
      }
      return response;
    } catch (ex: any) {
      Message.error(ex.message);
      throw ex;
    }
  };

  const isProject = computed(() => {
    return (
      !breadcrumb.isLegalCustomerContractDetail &&
      !breadcrumb.isLegalSupplierContractDetail &&
      !breadcrumb.isLegalStatisticsCustomerContractDetail &&
      !breadcrumb.isLegalStatisticsSupplierContractDetail
    );
  });
  const uploadScans = async (url: string) => {
    const payload: ContractScanSaveParams = {
      contract_id: detail.value?.contract_info.id as number,
      contract_scan_urls: [url],
      save_for_update: 1,
    };
    try {
      const { data: response } = isProject.value
        ? await SaveContractScan(payload)
        : await SaveContractScanLegal(payload);
      if (response.success) {
        await reload();
      } else {
        throw new Error(response.message);
      }
    } catch (ex: any) {
      Message.error(ex.message);
    }
  };

  const remove = async (url: string) => {
    const result = await AsyncConfirm(ctx, '扫描件删除后无法恢复，是否继续操作？');
    if (!result) {
      return;
    }
    if (detail.value === undefined) {
      return;
    }
    const { data: response } = await DeleteContractScan({
      contract_id: detail.value.contract_info.id,
      contract_scan_urls: [url],
    });
    if (response.success) {
      await reload();
    } else {
      ctx.root.$message.error(response.message ?? '删除失败');
    }
  };
  // 作废相关
  const toVoid = async () => {
    if (!detail.value) {
      return;
    }
    const id = detail.value?.contract_info.id;
    const result = await AsyncConfirm(ctx, {
      title: '此操作将作废合同, 是否继续',
      confirmText: '作废合同',
    });
    if (!result) {
      return;
    }
    const { data: response } = await invalidContract({
      contract_id: id,
      invalid_code: 5,
    });

    if (response.success) {
      ctx.root.$message.success(response.message);
      await reload();
    } else {
      ctx.root.$message.error(response.message);
    }
  };
  // 是否有作弊权限
  const hasVoidRight = computed(() => {
    return isExternal()
      ? false
      : detail.value?.contract_info.contract_status === ApprovalStatus.Normal &&
          (currentUserInfo.value?.id === detail.value?.contract_info.manager_id ||
            currentUserInfo.value?.id === detail.value?.contract_info.add_by);
  });
  // 是否有删除
  const hasDelete = computed(() => {
    if (isExternal()) return false;
    const bol =
      [ApprovalStatus.Invalid, ApprovalStatus.Failure].includes(
        detail.value?.contract_info.contract_status ?? -1,
      ) &&
      (currentUserInfo.value?.id === detail.value?.contract_info.manager_id ||
        currentUserInfo.value?.id === detail.value?.contract_detail.add_by);
    if (!bol) return;
    return true;
  });
  // 删除合同
  const onDelete = async () => {
    if (!detail.value) {
      return;
    }
    const result = await AsyncConfirm(ctx, {
      title: '此操作将删除合同， 确认删除？',
      confirmText: '删除合同',
    });

    if (!result) {
      return;
    }
    const { data: response } = await deleteContracts({
      contract_id: [detail.value.contract_info.id],
    });

    if (response.success) {
      Message.success('删除成功');
      setTimeout(() => {
        if (breadcrumb.isAnchorDetail) {
          //主播详情
          ctx.root.$router.replace({
            name: RouterNameSupplier.player_detail,
            params: {
              id: router.currentRoute.query.anchorId,
              tab: router.currentRoute.query.parent_tab,
            },
          });
        } else {
          router.back();
        }
      }, 500);
    } else {
      ctx.root.$message.error(response.message ?? '合同删除失败');
    }
  };

  return reactive({
    onDelete,
    hasDelete,
    hasVoidRight,
    toVoid,
    queryContractDetail,
    remove,
    uploadScans,
    uploadScanFiles,
    detail,
    contract_status,
    reload,
    flow,
    isFlowFromOA,
    isProject,
  });
};

export const useBreadcrumbRouter = () => {
  const router = useRouter();
  const { isFromLocalLife, isFromSupplyChain, isFromMarketing, isFromCommon, isFromLiveDouyin } =
    useProjectBaseInfo();
  const breadcrumb = useBreadcrumb();
  let routes: BreadcrumbsRoutes[] = [
    {
      name: isFromLocalLife.value
        ? RouterNameProjectManage.localLife.project.list
        : isFromCommon.value
        ? RouterNameProjectManage.commonBusiness.project.list
        : isFromMarketing.value
        ? RouterNameProjectManage.marketing.project.list
        : isFromSupplyChain.value
        ? RouterNameProjectManage.supplyChain.list
        : RouterNameProjectManage.live.project.list,
      title: '项目管理',
    },
    {
      // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
      name: isFromLocalLife.value
        ? RouterNameProjectManage.localLife.detail.info
        : isFromCommon.value
        ? RouterNameProjectManage.commonBusiness.project.detail
        : isFromMarketing.value
        ? RouterNameProjectManage.marketing.project.detail
        : isFromSupplyChain.value
        ? RouterNameProjectManage.supplyChain.detail
        : isFromLiveDouyin.value
        ? RouterNameProjectManage.tiktokLive.project.detail.info
        : RouterNameProjectManage.live.project.detail,
      params: {
        id: router.currentRoute.query.parent_id,
        tab: router.currentRoute.query.parent_tab || 'contract',
        liveType: isFromSupplyChain.value ? 'SupplyChainDetail' : 'calendar',
      },
      title: '项目详情',
    },
    {
      path: '',
      title: breadcrumb.isCustomerDetail ? '客户合同详情' : '供应商合同详情',
    },
  ];
  if (isFromLocalLife.value || isFromLiveDouyin.value) {
    routes.splice(2, 0, {
      // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
      name: isFromLocalLife.value
        ? RouterNameProjectManage.localLife.detail.contract
        : RouterNameProjectManage.tiktokLive.project.detail.contract,
      params: {
        id: router.currentRoute.query.parent_id,
        tab: router.currentRoute.query.parent_tab || 'contract',
        liveType: 'calendar',
      },
      title: '合同协议',
    });
  }
  if (
    breadcrumb.isLegalCustomerContractDetail ||
    breadcrumb.isLegalSupplierContractDetail ||
    breadcrumb.isLegalStatisticsSupplierContractDetail ||
    breadcrumb.isLegalStatisticsSupplierContractDetail
  ) {
    routes = [
      {
        name:
          breadcrumb.isLegalCustomerContractDetail || breadcrumb.isLegalSupplierContractDetail
            ? RouterLegal.contact
            : RouterLegal.constatistics,
        title:
          breadcrumb.isLegalCustomerContractDetail || breadcrumb.isLegalSupplierContractDetail
            ? '合同管理'
            : '合同统计',
      },
      {
        path: '',
        title: breadcrumb.isCustomerDetail ? '客户合同详情' : '供应商合同详情',
      },
    ];
  }
  if (breadcrumb.isAnchorDetail) {
    routes = [
      { title: '主播管理', name: RouterNameSupplier.player },
      {
        title: '主播详情',
        name: RouterNameSupplier.player_detail,
        params: {
          id: router.currentRoute.query.anchorId,
          tab: router.currentRoute.query.parent_tab,
        },
      },
      { title: '合同详情' },
    ];
  }
  return reactive({
    routes,
    breadcrumb,
  });
};
