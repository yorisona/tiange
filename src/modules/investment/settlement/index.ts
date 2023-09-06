/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-11 15:24:33
 */
import {
  computed,
  defineComponent,
  onBeforeMount,
  provide,
  reactive,
  ref,
  UnwrapRef,
} from '@vue/composition-api';
import getRectHeightData from '@/utils/autoHeight';
import { ItemType, useList } from '../use/useSettlementList';
import { SettlementQueryParams, SettlementStatusOptions } from '@/types/tiange/investment';
import SettlementDialog from '@/modules/investment/settlement/dialog/income/base.vue';
import type { SettlementDialogType } from '@/modules/investment/settlement/dialog/income/base';
import { DelMerchantSettlement } from '@/services/investment';
import {
  ConfirmReverseParams,
  FinancialReverseParams,
  Settlement,
} from '@/types/tiange/finance/settlement';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { wait } from '@/utils/func';
import { is_reversed_order } from '@/use/finance';
import BuessinessSettlement from '@/modules/finance/settlement_income/components/BuessinessSettlement/index.vue';
import achievement from '@/modules/live/project/dialog/achievement.vue';
import { ReverseStatus, ReverseType } from '@/types/tiange/finance/finance';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { GetCommonBusinessProjectDetail } from '@/services/commonBusiness/project';
import {
  ConfirmMerchantReverse,
  FinancialReverse,
  FinancialReverseAgain,
} from '@/services/finance';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import MakeInvoiceDialog from '@/modules/workbench/initiate/lnvoice2/index.vue';
import { BooleanType } from '@/types/base/advanced';
import reverseAuditDialog from '@/modules/finance/components/reverseAudit.vue';
import settlementApprove from '@/modules/customer/contract/form/statement.vue';
import { usePermission } from '@/use/permission';
import store from '@/store';
import { UserInfo } from '@/types/tiange/system';
import { deepClone } from '@/utils/tools';
import { GetSettlementDetail } from '@/services/finance/settlement';

export default defineComponent({
  name: 'TgInvestmentSettlementPage',
  components: {
    SettlementDialog,
    BuessinessSettlement,
    achievement,
    reverseOrderDialog,
    MakeInvoiceDialog,
    reverseAuditDialog,
    settlementApprove,
  },
  setup(_, ctx) {
    const merchant_project_id = ref<number>(195);

    const ladingStatus = ref<boolean>(false);
    const loadingText = ref<string | undefined>(undefined);
    // 收款登记弹框
    const achievementRef = ref<UnwrapRef<{ show: (obj?: any, btype?: any) => void } | null>>(null);

    const project = ref<CommonBusinessProjectDetail | undefined>(undefined);
    provide('project', project);
    provide('project_add_id', merchant_project_id);
    provide('contract', ref(undefined));

    const reasonDialogVisible = ref(false);
    const reasonDialogTitle = ref<string>('');
    const reason = ref('');

    const permission = usePermission();

    const MakeInvoiceDialogRef = ref<{
      show(settlement: Settlement & { seller: string | undefined }): void;
    } | null>(null);

    const approveVisible = ref<boolean>(false);

    const reverseOrderDialogRef = ref<{
      open: (cb: (msg: string) => Promise<boolean>, reverse_reason?: string) => void;
    } | null>(null);

    const onlyCheckDetail = ref<boolean>(true);

    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const settlementRef = ref<SettlementDialogType | undefined>(undefined);

    const userinfo = computed<UserInfo>(() => store.getters['user/getUserInfo']);

    const filterForm = reactive<SettlementQueryParams>({
      search_type: 1,
      search_value: '',
      status: '',
      month: '',
      page_num: 1,
      num: 20,
      add_by: permission.merchant_settlement_view_all
        ? undefined
        : permission.merchant_settlement_view
        ? userinfo.value.id
        : undefined,
    });
    /** 重置查询form */
    const resetForm = () => {
      filterForm.search_type = 1;
      filterForm.search_value = '';
      filterForm.status = '';
      filterForm.month = '';
      filterForm.page_num = 1;
      filterForm.num = 20;
    };
    // 重载数据
    const reload = async (clean = true) => {
      if (!permission.merchant_settlement_view_all && !permission.merchant_settlement_view) {
        ctx.root.$message.error('没有查看结算数据的权限');
        return;
      }
      if (clean) {
        filterForm.page_num = 1;
      }
      await listLogic.loadData({
        ...filterForm,
      });
    };
    const onSearchClick = () => {
      reload();
    };
    const onResetClick = () => {
      resetForm();
      reload();
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      filterForm.page_num = page_num;
      reload(false);
    };
    const handlePageSizeChange = (num: number) => {
      filterForm.num = num;
      reload();
    };

    const startLoading = (type: 'ProjectDetail' | 'Delete' | 'SettlementDetail') => {
      ladingStatus.value = true;
      switch (type) {
        case 'ProjectDetail':
          loadingText.value = '正在获取项目详情，请稍等...';
          break;
        case 'Delete':
          loadingText.value = '正在删除结算单，请稍等...';
          break;
        case 'SettlementDetail':
          loadingText.value = '正在获取结算单详情，请稍等...';
          break;
        default:
          break;
      }
    };

    const endLoading = () => {
      ladingStatus.value = false;
      loadingText.value = undefined;
    };

    const delSettlement = async (row: Settlement, title = '确认要删除这条结算吗？') => {
      const result = await AsyncConfirm(ctx, {
        title,
        content:
          process.env.NODE_ENV === 'development' ? `结算编号【${row.settlement_uid}】` : undefined,
      });

      if (!result) {
        return;
      }
      startLoading('Delete');
      const [{ data: response }] = await wait(1200, DelMerchantSettlement(row.id));
      endLoading();
      if (response.success) {
        ctx.root.$message.success('删除成功');
        await reload();
      } else {
        ctx.root.$message.error(response.message ?? '删除失败');
      }

      // const res = await DelMerchantSettlement(row.id);
      // if (res.data.success) {
      //   ctx.root.$message.success(res.data.message ?? "删除成功")
      // }else{
      //   ctx.root.$message.success(res.data.message ?? "删除失败")
      // }
    };

    const onApproveClose = () => {
      approveVisible.value = false;
      reload();
    };
    const onApproveBtnClick = () => {
      getProjectReq(`${merchant_project_id.value}`, () => {
        approveVisible.value = true;
      });
    };

    const checkRefundReason = (row: Settlement) => {
      if (is_reversed_order(row)) {
        if (row.reverse_status === ReverseStatus.refused) {
          reasonDialogTitle.value = '冲销退回原因';
          reason.value = row.reverse_back_reason;
          reasonDialogVisible.value = true;
        } else {
          reasonDialogTitle.value = '冲销原因';
          reason.value = row.reverse_reason;
          reasonDialogVisible.value = true;
        }
      } else {
        reasonDialogTitle.value = '退回原因';
        reason.value = row.refuse_reason;
        reasonDialogVisible.value = true;
      }
    };
    const checkRefundedResaon = (row: Settlement) => {
      if (row.refund_status === 2) {
        reasonDialogTitle.value = '冲销原因';
        reason.value = row.refund_reason || '';
      } else if (row.refund_status === 3) {
        reasonDialogTitle.value = '退回原因';
        reason.value = row.refund_back_reason || '';
      }
      reasonDialogVisible.value = true;
    };

    const openDetail = (settlement: Settlement, readonly: boolean) => {
      onlyCheckDetail.value = readonly;
      (ctx.refs.BuessinessSettlement as unknown as { show: (row: any) => void }).show(settlement);
    };

    /** 冲销动作 */
    const onWriteOffConfirmResolve = async (row: Settlement, msg: string, again: boolean) => {
      // toggleWriteOffLoading();

      const params: FinancialReverseParams = {
        id: row.id,
        reverse_reason: msg,
        reverse_type: ReverseType.settlement_income,
      };
      let res;
      if (again) {
        res = await FinancialReverseAgain(params);
      } else {
        res = await FinancialReverse(params);
      }

      // toggleWriteOffLoading();
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '冲销成功');
        reload();
      } else {
        ctx.root.$message.error(res.data.message ?? '冲销失败');
      }

      return res.data.success;
    };

    /** 冲销确认动作 */
    const onReverseAuditConfirm = async (
      row: Settlement,
      is_pass: BooleanType,
      reverse_back_reason: string,
    ) => {
      // toggleReverseAuditLoading();

      const params: ConfirmReverseParams = {
        id: row.id,
        reverse_type: ReverseType.settlement_income,
        is_pass,
        reverse_back_reason,
      };
      const res = await ConfirmMerchantReverse(params);
      // toggleReverseAuditLoading();
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '确认成功');
        reload();
      } else {
        ctx.root.$message.error(res.data.message ?? '确认失败');
      }

      return res.data.success;
    };

    const reverseAuditDialogRef = ref<{
      open: (
        msg: string,
        cb: (is_pass: BooleanType, reverse_back_reason: string) => Promise<boolean>,
      ) => void;
    } | null>(null);

    /** 项目列表 logic */
    const listLogic = useList(ctx, async (itemType, settlement) => {
      switch (itemType) {
        case ItemType.check: {
          openDetail(settlement, true);
          break;
        }
        case ItemType.edit: {
          settlementRef.value?.open(settlement);
          break;
        }
        case ItemType.delete: {
          delSettlement(settlement);
          break;
        }
        case ItemType.checkReason: {
          checkRefundReason(settlement);
          break;
        }
        case ItemType.financeComfirm: {
          openDetail(settlement, false);
          break;
        }
        case ItemType.collection: {
          getProjectReq(settlement.project_id.toString(), () => {
            let data = deepClone(settlement) as any;
            data = { ...data, gather_amount: data.settlement_no_register_amount };
            achievementRef.value?.show(data, {
              isMcn: true,
              isBrand: false,
              isMarketing: false,
              isMerchant: true,
            });
          });
          break;
        }
        case ItemType.writeOff: {
          reverseOrderDialogRef.value?.open(msg =>
            onWriteOffConfirmResolve(settlement, msg, false),
          );
          break;
        }
        case ItemType.writeOffAgain: {
          reverseOrderDialogRef.value?.open(msg => onWriteOffConfirmResolve(settlement, msg, true));
          break;
        }
        case ItemType.writeOffConfirm: {
          reverseAuditDialogRef.value?.open(
            settlement.reverse_reason,
            (is_pass, reverse_back_reason) =>
              onReverseAuditConfirm(settlement, is_pass, reverse_back_reason),
          );
          break;
        }
        case ItemType.billing: {
          startLoading('SettlementDetail');
          const res = await GetSettlementDetail('common', { id: settlement.id });
          endLoading();
          if (res.data.success) {
            MakeInvoiceDialogRef.value?.show({
              ...(res.data.data ?? settlement),
              seller:
                project.value?.company_subject !== null
                  ? E.project.ProprietorTypeMap.get(project.value?.company_subject || 0)
                  : '',
            });
          } else {
            ctx.root.$message.error(res.data.message ?? '获取结算单详情失败');
          }
          break;
        }
        case ItemType.refundedCheck:
          checkRefundedResaon(settlement);
          break;
        case ItemType.refundedCheckResaon:
          checkRefundedResaon(settlement);
          break;
        default:
          //
          break;
      }
    });

    const getProjectReq = async (project_id: string, successAction: () => void) => {
      startLoading('ProjectDetail');
      const res = await GetCommonBusinessProjectDetail(project_id);
      endLoading();
      if (res.data.success) {
        project.value = res.data.data;
        successAction?.();
      } else {
        ctx.root.$message.error(res.data.message ?? '获取项目详情失败');
      }
    };

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    /** 对话框关闭，重载数据并清空缓存 */
    const onDialogClose = async () => {
      await reload();
    };

    // const addSettlementDialog = ref<{ show: () => void } | null>(null);
    // const onApproveBtnClick = () => {
    //   getProjectReq(`${merchant_project_id.value}`, () => {
    //     {
    //       addSettlementDialog.value?.show();
    //     }
    //   });
    // };

    const onSettlementAdded = () => {
      reload();
    };

    onBeforeMount(() => {
      reload();
    });

    return {
      onlyCheckDetail,
      reason,
      reasonDialogTitle,
      reasonDialogVisible,
      onReasonDialogClose,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      ...listLogic,
      filterForm,
      settlementRef,
      onSearchClick,
      onResetClick,
      SettlementStatusOptions,
      handleCurrentChange,
      handlePageSizeChange,
      onDialogClose,
      achievementRef,
      reload,
      reverseOrderDialogRef,
      onApproveBtnClick,
      onSettlementAdded,
      MakeInvoiceDialogRef,
      ladingStatus,
      loadingText,
      reverseAuditDialogRef,
      onApproveClose,
      approveVisible,
    };
  },
});
