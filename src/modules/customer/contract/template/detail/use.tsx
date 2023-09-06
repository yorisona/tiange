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
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { BreadcrumbsRoutes } from '@/types/components/breadcrumbs';

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
    let getType = 5;
    let partner_type;
    if (breadcrumb.isLegalSupplierContractDetail || breadcrumb.isLegalCustomerContractDetail) {
      getType = 2;
    } else if (
      breadcrumb.isLiveCustomerContractDetail ||
      breadcrumb.isLiveSupplierContractDetail ||
      breadcrumb.isTiktokSupplierContractDetail ||
      breadcrumb.isTiktokLiveCustomerContractDetail
    ) {
      getType = 3;
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
    } else if (breadcrumb.isCoopSupplierContractDetail || breadcrumb.isCoopCustomerContractDetail) {
      getType = 4;
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
    if (breadcrumb.isCustomerDetail) {
      partner_type = 1;
    } else {
      partner_type = 2;
    }
    // payload.partner_type = partner_type;
    // const isExternal = router.currentRoute.query.source === 'external';
    const response = await GetContract(payload, getType, isExternal());
    if (response.success && response.data) {
      detail.value = transformDetailData(response.data, partner_type);
    } else {
      ctx.root.$message.warning(response.message ?? '合同详情获取失败，稍后重试');
    }
  };

  const transformDetailData = (data: any, partner_type: number) => {
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
      key: '客户名称',
      value: data?.contract_info?.company_name,
    };
    if (partner_type === 2) {
      parther_name.key = '供应商名称';
    }
    data.template_info.extend_contract_info = [parther_name, add_by];
    const transformKey = ['others', 'margin', 'pay_condition'];
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
    // 额外的进行转换
    if (template_info.pay_condition) {
      const pay_condition: { key: string; value: any }[] = [];
      let tmp: { key: string; value: any };
      template_info.pay_condition = pay_condition;
      tmp = {
        key: 'ROI要求',
        value: '',
      };
      if (template_info.pay_conditionMap['ROI要求'] === '不保量') {
        tmp.value = '不保量';
      } else if (template_info.pay_conditionMap['ROI要求'] === '保量') {
        tmp.value = `${template_info.pay_conditionMap['ROI要求保量-服务费']} : ${template_info.pay_conditionMap['ROI要求保量-保量销售额']}`;
      }
      tmp.value = tmp.value.replace(/undefined/g, '--');
      pay_condition.push(tmp);
      pay_condition.push({
        key: '执行要求',
        value: template_info.pay_conditionMap['执行要求'],
      });
      pay_condition.push({
        key: '付款要求',
        value: template_info.pay_conditionMap['付款要求'],
      });
      pay_condition.push({
        key: '票款要求',
        value: template_info.pay_conditionMap['票款要求'],
      });
      tmp = { key: '开票要求', value: template_info.pay_conditionMap['开票要求'] };
      if (template_info.pay_conditionMap['开票要求'] === '专票') {
        tmp.value = `专票${template_info.pay_conditionMap['开票税率']}%`;
      } else if (template_info.pay_conditionMap['开票要求'] === '普票') {
        tmp.value = `普票${template_info.pay_conditionMap['开票税率']}%`;
      }
      pay_condition.push(tmp);
      tmp = { key: '收费类型', value: template_info.pay_conditionMap['收费类型'] };
      if (template_info.pay_conditionMap['收费类型'] === '固定服务费') {
        tmp.value = `服务费${template_info.pay_conditionMap['固定服务费']}`;
      } else if (template_info.pay_conditionMap['收费类型'] === '固定服务费+佣金') {
        if (template_info.pay_conditionMap['佣金']) {
          tmp.value = `服务费${template_info.pay_conditionMap['固定服务费']}+${template_info.pay_conditionMap['佣金']}%`;
        } else if (
          template_info.pay_conditionMap['构美佣金'] &&
          Number(template_info.pay_conditionMap['构美佣金']) !== 0
        ) {
          const kol_amount = +template_info.pay_conditionMap['主播佣金'];
          tmp.value =
            kol_amount > 0
              ? `服务费${template_info.pay_conditionMap['固定服务费']}+${template_info.pay_conditionMap['主播佣金']}%(主播佣金)+${template_info.pay_conditionMap['构美佣金']}%(构美佣金)`
              : `服务费${template_info.pay_conditionMap['固定服务费']}+${template_info.pay_conditionMap['构美佣金']}%(构美佣金)`;
        } else {
          const kol_amount = +template_info.pay_conditionMap['主播佣金'];
          tmp.value =
            kol_amount > 0
              ? `服务费${template_info.pay_conditionMap['固定服务费']}+${template_info.pay_conditionMap['主播佣金']}%(主播佣金)`
              : `服务费${template_info.pay_conditionMap['固定服务费']}`;
        }
      } else if (template_info.pay_conditionMap['收费类型'] === '纯佣金') {
        if (template_info.pay_conditionMap['佣金']) {
          tmp.value = `${template_info.pay_conditionMap['佣金']}%`;
        } else if (
          template_info.pay_conditionMap['构美佣金'] &&
          Number(template_info.pay_conditionMap['构美佣金']) !== 0
        ) {
          const kol_amount = +template_info.pay_conditionMap['主播佣金'];
          tmp.value =
            kol_amount > 0
              ? `${template_info.pay_conditionMap['主播佣金']}%(主播佣金)+${template_info.pay_conditionMap['构美佣金']}%(构美佣金)`
              : `${template_info.pay_conditionMap['构美佣金']}%(构美佣金)`;
        } else {
          const kol_amount = +template_info.pay_conditionMap['主播佣金'];
          tmp.value =
            kol_amount > 0 ? `${template_info.pay_conditionMap['主播佣金']}%(主播佣金)` : '--';
        }
      } else {
        tmp.value = `其它-${template_info.pay_conditionMap['其它']}`;
      }
      if (tmp.value.indexOf('undefined') !== -1) {
        tmp.value = '--';
      }
      pay_condition.push(tmp);
      tmp = { key: '付款方式', value: template_info.pay_conditionMap['付款方式'] };
      if (tmp.value === '其它') {
        tmp.value = `其它-${template_info.pay_conditionMap['付款方式-其它']}`;
      }
      if (tmp.value === 'V任务下单') {
        tmp.value = `V任务下单-${template_info.pay_conditionMap['V任务下单']}`;
      }
      pay_condition.push(tmp);
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
        router.back();
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
        : isFromLiveDouyin.value
        ? RouterNameProjectManage.tiktokLive.project.detail.contract
        : RouterNameProjectManage.live.project.detail,
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
    breadcrumb.isLegalStatisticsCustomerContractDetail
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
