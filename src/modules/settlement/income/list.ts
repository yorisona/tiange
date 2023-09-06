/**
 * 收入结算 - 通用业务/店铺代播/营销业务
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-18 17:32:04
 */
import {
  computed,
  defineComponent,
  h,
  inject,
  onMounted,
  provide,
  ref,
  UnwrapRef,
} from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import {
  ReverseType,
  Settlement,
  SettlementListQueryParams,
} from '@/types/tiange/finance/settlement';
import { SettlementStatus, FinancialReverseParams } from '@/types/tiange/finance/settlement';
import achievement from '@/modules/live/project/dialog/achievement.vue';
import TgSettlementDialog from './dialog/main.vue';
import type { SettlementDialog } from './dialog/main';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { wait } from '@/utils/func';
import { DeleteSettlement, GetSettlementDetail } from '@/services/finance/settlement';
import type { PaginationParams } from '@/types/base/pagination';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { usePermission } from '@/use/permission';
import { useSettlementIncomeList } from '../use/incomeList';
import type { SettlementCol } from '@/modules/settlement/use/columns';
import { useColumns } from '@/modules/settlement/use/columns';
import type { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import type { LiveProject } from '@/types/tiange/live.project';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import BuessinessSettlement from '@/modules/finance/settlement_income/components/BuessinessSettlement/index.vue';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import useVisible from '@/use/visible';
import { FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import { ReverseStatus } from '@/types/tiange/finance/finance';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import settlementApprove from '@/modules/customer/contract/form/newStatement.vue';
import { useRouter } from '@/use/vue-router';
import { BusinessTypeEnum, CooperationTypeEnum, ProjectStatusEnum } from '@/types/tiange/common';
import { ProjectConfirmDialogRef } from './dialog/project_confirm/project.confirm';
import ProjectConfirmDialog from '@/modules/settlement/income/dialog/project_confirm/project.confirm.vue';
import MakeInvoiceDialog from '@/modules/workbench/initiate/lnvoice2/index.vue';
import { deepClone } from '@/utils/tools';
import incomeSearch from '../component/incomeSearch.vue';
import { is_refunded_order, is_reversed_order as is_reversed_settlement } from '@/use/finance';
import scanImport from '@/modules/settlement/component/import/index.vue';
import { useDialog } from '@/use/dialog';

export default defineComponent({
  name: 'TgSettlementIncomeTab',
  props: {
    cooperationType: {
      type: Number,
      default: 1,
      required: false,
    },
  },
  components: {
    TgSettlementDialog,
    BuessinessSettlement,
    achievement,
    reverseOrderDialog,
    settlementApprove,
    ProjectConfirmDialog,
    MakeInvoiceDialog,
    incomeSearch,
  },
  setup(props, ctx) {
    const settlementDetailLoading = ref<boolean>(false);
    const {
      project_id,
      isFromMarketing,
      isFromLive,
      isFromLocalLife,
      isFromSupplyChain,
      isFromCommon,
      isFromLiveDouyin,
      project_type,
      business_type,
    } = useProjectBaseInfo();
    const router = useRouter();
    const isHideReversed = ref(true);
    const newProject = JSON.stringify(inject('project3in1', { cooperation_type: 0 }));
    const jsonProject = JSON.parse(newProject);
    const cooperation_type = ref(Number(props.cooperationType || 1));
    if (cooperation_type.value !== 2) {
      if (jsonProject.value) {
        if (jsonProject.value.cooperation_type === CooperationTypeEnum.region) {
          cooperation_type.value = 2;
        } else if (jsonProject.value.cooperation_type === CooperationTypeEnum.selfSupport) {
          cooperation_type.value = 1;
        } else if (
          isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value
        ) {
          const project_one = JSON.parse(localStorage.getItem('project3Live') || '{}');
          cooperation_type.value =
            project_one.value?.cooperation_type === 2 ? project_one.value?.cooperation_type : 1;
        }
      }
    }
    provide('cooperation_type', cooperation_type);
    const projectConfirmDialogRef = ref<ProjectConfirmDialogRef | null>(null);
    /** 项目详情 */
    const project = computed<
      MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined
    >(() => {
      if (isFromMarketing.value) {
        const marketing_project =
          inject<Ref<MarketingProjectDetail | undefined>>('MarketingProject') ?? ref(undefined);
        return { ...marketing_project.value, project__type: 'marketing' } as MarketingProjectDetail;
      } else if (
        isFromLive.value ||
        isFromLiveDouyin.value ||
        isFromLocalLife.value ||
        isFromSupplyChain.value
      ) {
        const live_project = inject<Ref<LiveProject | undefined>>('live_project') ?? ref(undefined);
        return {
          ...live_project.value,
          project__type: isFromSupplyChain.value
            ? 'supply_chain'
            : isFromLocalLife.value
            ? 'local_life'
            : 'live',
        } as LiveProject;
      } else if (isFromCommon.value) {
        const common_project =
          inject<Ref<CommonBusinessProjectDetail | undefined>>('common_project') ?? ref(undefined);
        return { ...common_project.value, project__type: 'common' } as CommonBusinessProjectDetail;
      } else {
        return undefined;
      }
    });

    /** 权限码 */
    const permission = usePermission();

    /** 按钮权限 */
    const CanIUse = computed(() => {
      if (isFromMarketing.value) {
        return {
          createBtn: permission.marketing_project_settlement_save,
          deleteBtn: permission.marketing_project_settlement_delete,
        };
      } else if (isFromLive.value || isFromLiveDouyin.value) {
        return {
          createBtn: permission.live_project_settlement_save,
          deleteBtn: permission.live_project_settlement_delete,
          auditBtn: permission.live_project_statements_create,
        };
      } else if (isFromLocalLife.value) {
        return {
          createBtn: permission.local_life_project_settlement_save,
          deleteBtn: permission.local_life_project_settlement_delete,
          auditBtn: permission.local_life_project_statements_create,
        };
      } else if (isFromSupplyChain.value) {
        return {
          createBtn: permission.supply_edit_settlement,
          deleteBtn: permission.supply_edit_settlement,
          auditBtn: permission.supply_edit_contract_settlement,
        };
      } else if (isFromCommon.value) {
        return {
          createBtn: permission.common_business_project_settlement_save,
          deleteBtn: permission.common_business_project_settlement_delete,
          auditBtn: permission.common_business_project_contract_statement_create,
        };
      } else {
        return {
          createBtn: false,
          deleteBtn: false,
        };
      }
    });
    // 项目类型
    provide('project_type', project_type);

    // 注入项目ID
    provide('project_id', project_id);

    // 注入项目详情
    provide('project3in1', project);

    /** 结算对话框引用 */
    const dialogRef = ref<SettlementDialog | null>(null);
    // 收款登记弹框
    const achievementRef =
      ref<UnwrapRef<{ show: (obj?: any, btype?: any, liveDouyin?: boolean) => void } | null>>(null);

    const MakeInvoiceDialogRef = ref<{
      show(settlement: Settlement & { seller: string | undefined }, shop?: number): void;
    } | null>(null);

    const buttonContent = computed(() => {
      return process.env.NODE_ENV === 'development'
        ? `发起结算(${
            isFromMarketing.value
              ? '营销'
              : isFromLive.value || isFromLiveDouyin.value
              ? '店播'
              : isFromSupplyChain.value
              ? '供应链'
              : isFromLocalLife.value
              ? '本地生活'
              : isFromCommon.value
              ? '通用'
              : ''
          })`
        : '发起结算';
    });

    const project_finished = () => {
      if (
        isFromLive.value ||
        isFromLiveDouyin.value ||
        isFromLocalLife.value ||
        isFromSupplyChain.value
      ) {
        const live_project = project.value as LiveProject;
        if (live_project.project_status === ProjectStatusEnum.finish) {
          ctx.root.$message.warning('项目已完结，不允许进行结算');
          return true;
        }
      } else if (isFromMarketing.value) {
        const marketing_project = project.value as MarketingProjectDetail;
        if (marketing_project.cooperation_status === 4) {
          ctx.root.$message.warning('项目已执行结束，不允许进行结算');
          return true;
        }
      }
      //  mcn不用处理，当没有完成返回
      return false;
    };

    const onViewBtnClick = (row: Settlement) => {
      if (!rowStyle(row) || row.refunded_id) {
        return;
      }
      if (row.status === SettlementStatus.wait_project_confirm && permission.project_confirmation) {
        if (isFromCommon) {
          if (project_id.value !== 195) {
            //  非招商项目才可以进行项目确认
            projectConfirmDialogRef.value?.open(row);
            return;
          }
        }
      }
      row.cooperation_type = row.cooperation_type ? row.cooperation_type : cooperation_type.value;
      cooperation_type.value = row.cooperation_type;
      (ctx.refs.BuessinessSettlement as unknown as { show: (row: any) => void }).show(row);
    };

    /** 发起结算 */
    const onCreateBtnClick = (is_estimate = 0) => {
      if (project_finished()) {
        return;
      }
      dialogRef.value?.open(undefined, is_estimate);
    };

    /** 编辑结算 */
    const onEditBtnClick = (row: Settlement) => {
      dialogRef.value?.open(row);
    };

    const onBillBtnClick = async (row: Settlement) => {
      const type =
        isFromLive.value || isFromLiveDouyin.value
          ? 'live'
          : isFromLocalLife.value
          ? 'local_life'
          : isFromSupplyChain.value
          ? 'supply_chain'
          : isFromCommon.value
          ? 'common'
          : 'marketing';
      settlementDetailLoading.value = true;
      const res = await GetSettlementDetail(type, { id: row.id });
      settlementDetailLoading.value = false;
      if (res.data.success) {
        MakeInvoiceDialogRef.value?.show(
          {
            ...(res.data.data ?? row),
            seller:
              project.value?.company_subject !== null
                ? E.project.ProprietorTypeMap.get(project.value?.company_subject || 0)
                : '',
          },
          row.unity_settlement_id !== 0 ? 1 : 0,
        );
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const deleteLoading = ref(false);
    /** 删除结算 */
    const onDeleteBtnClick = async (row: Settlement, title: string) => {
      const result = await AsyncConfirm(ctx, {
        title: title,
        content:
          process.env.NODE_ENV === 'development' ? `结算编号【${row.settlement_uid}】` : undefined,
      });

      if (!result) {
        return;
      }

      deleteLoading.value = true;
      const [{ data: response }] = await wait(500, DeleteSettlement(project_type.value, row.id));
      deleteLoading.value = false;

      if (response.success) {
        ctx.root.$message.success('删除成功');
        await reload();
      } else {
        ctx.root.$message.error(response.message ?? '删除失败');
      }
    };

    const reasonDialogVisible = ref(false);
    const reasonDialogTitle = ref<string>('');
    const reason = ref('');
    const onReasonViewBtnClick = (row: Settlement) => {
      reasonDialogTitle.value = '退回原因';
      reason.value = row.refuse_reason;
      reasonDialogVisible.value = true;
    };

    const onReserveBackReasonViewBtnClick = (row: Settlement) => {
      reasonDialogTitle.value = '冲销退回原因';
      reason.value = row.reverse_back_reason;
      reasonDialogVisible.value = true;
    };

    const onReserveReasonViewBtnClick = (row: Settlement) => {
      reasonDialogTitle.value = '冲销原因';
      reason.value = row.reverse_reason;
      reasonDialogVisible.value = true;
    };

    const onRefundedReason = (row: Settlement) => {
      reasonDialogTitle.value = '冲销原因';
      reason.value = row.refund_reason || '';
      reasonDialogVisible.value = true;
    };
    const onRefundedBackReason = (row: Settlement) => {
      reasonDialogTitle.value = '退回原因';
      reason.value = row.refund_back_reason || '';
      reasonDialogVisible.value = true;
    };

    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };

    const { loading, data, total, loadData } = useSettlementIncomeList(project_type);

    const {
      settlement_number_column,
      settlement_company_column,
      settlement_cycle_column,
      settlement_money_column,
      settlement_tax_amount_column,
      settlement_tax_rate_column,
      settlement_no_tax_amount_column,
      settlement_status_column,
      write_off_status_column,
      settlement_person_column,
      submit_date_column,
      confirm_person_column,
      confirm_date_column,
      scan_file_status_column,
      settlement_income_type_column,
    } = useColumns(data);

    const reverseOrderDialogRef = ref<{
      open: (
        cb: (msg: string, reverseReceive?: boolean) => Promise<boolean>,
        reverse_reason?: string,
        related_receive?: boolean,
      ) => void;
    } | null>(null);

    const { visible: writeOffLoading, toggleVisible: toggleWriteOffLoading } = useVisible();

    /** 冲销动作 */
    const onWriteOffConfirmResolve = async (
      row: Settlement,
      msg: string,
      again: boolean,
      reverseReceive?: boolean,
    ) => {
      toggleWriteOffLoading();

      const params: FinancialReverseParams = {
        id: row.id,
        reverse_reason: msg,
        reverse_type: ReverseType.settlement_income,
        is_reverse_achievement: reverseReceive,
      };
      let res;
      if (again) {
        res = await FinancialReverseAgain(params);
      } else {
        res = await FinancialReverse(params);
      }

      toggleWriteOffLoading();
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '冲销成功');
        reload();
      } else {
        ctx.root.$message.error(res.data.message ?? '冲销失败');
      }

      return res.data.success;
    };

    const operation_render = <T extends boolean>(row: Settlement, text_only: T) => {
      const btns: any = [];
      const isOver =
        row.settlement_type === 8 && row.unity_settlement_id && row.related_income_settlement_id;
      if (row.refunded_id || isOver) {
        const { refund_status = 1 } = row;
        const show_btn = text_only
          ? '查看'
          : h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    onRefundedReason(row);
                    event.stopPropagation();
                  },
                },
              },
              ['查看'],
            );
        const show_refunded_btn = text_only
          ? '查看原因'
          : h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    onRefundedBackReason(row);
                    event.stopPropagation();
                  },
                },
              },
              ['查看原因'],
            );
        const deleteBtn = text_only
          ? '删除'
          : h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    onDeleteBtnClick(row, '是否删除该退款单');
                    event.stopPropagation();
                  },
                },
              },
              ['删除'],
            );
        if (refund_status === SettlementStatus.confirmed) {
          btns.push(show_btn);
        } else if (refund_status === SettlementStatus.refused) {
          // 退回
          btns.push(show_refunded_btn);
          btns.push(deleteBtn);
        }
        return h('div', { class: 'operation' }, btns) as TableColumnRenderReturn<T>;
      }

      // 招商结算拆出来的单子没有操作按钮
      if (row.shop_live_live_goods_id)
        return text_only
          ? ''
          : (h('div', { class: 'operation' }, []) as TableColumnRenderReturn<T>);
      if (row.reversed_id) {
        const deleteBtn = text_only
          ? '删除'
          : h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    onDeleteBtnClick(row, '是否删除该冲销单');
                    event.stopPropagation();
                  },
                },
              },
              ['删除'],
            );

        const financialReverseAgainBtn = text_only
          ? '重新提交'
          : h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    reverseOrderDialogRef.value?.open(
                      msg => onWriteOffConfirmResolve(row, msg, true),
                      row.reverse_reason,
                    );
                    event.stopPropagation();
                  },
                },
              },
              ['重新提交'],
            );

        const viewReasonBtn = text_only
          ? '退回原因'
          : h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    onReserveBackReasonViewBtnClick(row);
                    event.stopPropagation();
                  },
                },
              },
              ['退回原因'],
            );

        // 冲销记录
        if (row.reverse_status === ReverseStatus.refused) {
          btns.push(deleteBtn);
          btns.push(financialReverseAgainBtn);
          btns.push(viewReasonBtn);
        } else {
          const viewBtn = text_only
            ? '查看'
            : h(
                'a',
                {
                  on: {
                    click: (event: MouseEvent) => {
                      onReserveReasonViewBtnClick(row);
                      event.stopPropagation();
                    },
                  },
                },
                ['查看'],
              );
          btns.push(viewBtn);
        }
      } else {
        if (
          CanIUse.value.createBtn &&
          [SettlementStatus.unsubmit, SettlementStatus.refused].includes(row.status)
        ) {
          const editBtn = text_only
            ? '编辑'
            : h(
                'a',
                {
                  on: {
                    click: (event: MouseEvent) => {
                      onEditBtnClick(row);
                      event.stopPropagation();
                    },
                  },
                },
                ['编辑'],
              );
          btns.push(editBtn);
        }

        // if (
        //   row.status === SettlementStatus.confirmed ||
        //   row.status === SettlementStatus.wait_confirm
        // ) {
        //   const viewBtn = text_only
        //     ? '查看'
        //     : h(
        //         'a',
        //         {
        //           on: {
        //             click: (event: MouseEvent) => {
        //               onViewBtnClick(row);
        //                event.stopPropagation();
        //             },
        //           },
        //         },
        //         ['查看'],
        //       );
        //   btns.push(viewBtn);
        // }
        if (row.status === SettlementStatus.refused) {
          const viewReasonBtn = text_only
            ? '查看原因'
            : h(
                'a',
                {
                  on: {
                    click: (event: MouseEvent) => {
                      onReasonViewBtnClick(row);
                      event.stopPropagation();
                    },
                  },
                },
                ['查看原因'],
              );
          btns.push(viewReasonBtn);
        }
        if (SettlementStatus.confirmed === row.status && !row.reverse_id) {
          const write_off_amount = row.write_off_amount ? `${row.write_off_amount}` : '0';
          const tax_included_amount = row.tax_included_amount ? `${row.tax_included_amount}` : '0';
          if (
            Number(row.tax_included_amount) - Number(row.invoiced_amount) !== 0 &&
            !row.is_estimate &&
            write_off_amount !== tax_included_amount
          ) {
            const kpBtn = text_only
              ? '开票申请'
              : h(
                  'a',
                  {
                    on: {
                      click: (event: MouseEvent) => {
                        event.stopPropagation();
                        // onEditBtnClick(row);
                        onBillBtnClick(row);
                      },
                    },
                    class: 'line-clamp-1',
                  },
                  ['开票申请'],
                );
            btns.push(kpBtn);
          }
          const reverseBtn = text_only
            ? '冲销'
            : h(
                'a',
                {
                  style: { color: 'var(--error-color)' },
                  on: {
                    click: (event: MouseEvent) => {
                      reverseOrderDialogRef.value?.open(
                        (msg, reverseReceive) =>
                          onWriteOffConfirmResolve(row, msg, false, reverseReceive),
                        undefined,
                        row.achievements_can_be_reversed,
                      );
                      event.stopPropagation();
                    },
                  },
                },
                ['冲销'],
              );
          row.has_refund_settlement !== 1 && btns.push(reverseBtn);
        }
        if (
          CanIUse.value.deleteBtn &&
          (row.status === SettlementStatus.unsubmit || row.status === SettlementStatus.refused)
        ) {
          const deleteBtn = text_only
            ? '删除'
            : h(
                'a',
                {
                  on: {
                    click: (event: MouseEvent) => {
                      onDeleteBtnClick(row, '确认要删除这条结算吗？');
                      event.stopPropagation();
                    },
                  },
                },
                ['删除'],
              );
          btns.push(deleteBtn);
        }
      }
      if (
        row.status === SettlementStatus.confirmed &&
        !row.reversed_id &&
        !row.reverse_id &&
        row.settlement_no_write_off_amount
      ) {
        const isMcn = ctx.root.$route.name === 'CommonBusinessProjectDetail'; // 创新项目
        const isBrand = ctx.root.$route.name === 'SSLiveProjectDetail' || isFromLiveDouyin.value; // 品牌中心业务
        const isMarketing = ctx.root.$route.name === 'MarketingProjectDetail'; // 整合营销业务
        const receiveComt = h(
          'tg-button',
          {
            props: {
              type: 'link',
              disabled: (row.settlement_no_register_amount ?? 0) <= 0 ? true : false,
            },
            on: {
              click: (event: MouseEvent) => {
                if (row.settlement_no_register_amount && row.settlement_no_register_amount > 0) {
                  let data = deepClone(row) as any;
                  data = { ...data, gather_amount: data.settlement_no_register_amount };
                  if (row.contract_id) {
                    data.search_contract_list_value = [
                      {
                        label:
                          row.contract_company_name +
                          '  (' +
                          row.sign_type_name +
                          ')  ' +
                          row.coop_start_date +
                          '-' +
                          row.coop_end_date,
                        value: row.contract_id,
                      },
                    ];
                  }
                  achievementRef.value?.show(
                    data,
                    {
                      isMcn,
                      isBrand,
                      isMarketing,
                      isLocalLife: isFromLocalLife.value,
                      isSupplyChain: isFromSupplyChain.value,
                    },
                    row.business_type === BusinessTypeEnum.douyin ||
                      row.business_type === BusinessTypeEnum.locallife ||
                      row.business_type === BusinessTypeEnum.supplyChain,
                  );
                }
                event.stopPropagation();
              },
            },
          },
          ['收款'],
        );
        if (
          (isMcn && permission.common_business_project_achievement) ||
          (isBrand && permission.live_project_achievement) ||
          (isFromLocalLife.value && permission.local_life_project_achievement) ||
          (isFromSupplyChain.value && permission.supply_edit_achievement) ||
          (isMarketing && permission.marketing_project_achievement_change)
        ) {
          if (!(row.status === SettlementStatus.confirmed && row.unity_settlement_id)) {
            btns.unshift(receiveComt);
          }
        }
      }
      return text_only
        ? btns.join('  ')
        : (h('div', { class: 'operation' }, btns) as TableColumnRenderReturn<T>);
    };
    /** 扫描件上传 */
    const dialogUploadDemo = useDialog({
      component: scanImport,
      footer: false,
      width: 420,
      title: '扫描件上传',
      on: {
        submit: () => {
          reload();
        },
      },
    });
    const uploadFileClick = (row: Settlement) => {
      dialogUploadDemo.show(
        row.id,
        row.business_type,
        row.settlement_scan_urls,
        false,
        row.settlement_scan_message || '',
      );
    };
    const lookFileClick = (row: Settlement) => {
      dialogUploadDemo.show(
        row.id,
        row.business_type,
        row.settlement_scan_urls,
        true,
        row.settlement_scan_message || '',
      );
    };
    /** 列设置 */
    const columns = computed<SettlementCol[]>(() => {
      const arr: SettlementCol[] = [
        settlement_number_column.value,
        settlement_company_column.value,
        settlement_cycle_column.value,
        settlement_money_column.value,
        settlement_tax_rate_column.value,
        settlement_tax_amount_column.value,
        settlement_no_tax_amount_column.value,
        settlement_status_column.value,
        write_off_status_column.value,
        settlement_person_column.value,
        submit_date_column.value,
        confirm_person_column.value,
        confirm_date_column.value,
        scan_file_status_column.value,
        {
          label: '结算单扫描件',
          fixed: 'right',
          align: 'center',
          headerAlign: 'center',
          minWidth: 108,
          formatter: row => {
            const status = row.settlement_scan_status || 0;
            /** 冲销订单，退款订单,暂估订单,完全退款*/
            if (
              is_reversed_settlement(row) ||
              is_refunded_order(row) ||
              row.is_estimate === 1 ||
              (row.refund_amount !== 0 &&
                row.refund_amount === row.tax_included_amount &&
                status === 0)
            ) {
              return h('div', { style: 'display: flex;justify-content: center' }, '');
            } else {
              /** 已确认结算 */
              if (row.status === 2) {
                return status === 0 || status === 3
                  ? h(
                      'a',
                      {
                        on: {
                          click: (event: MouseEvent) => {
                            uploadFileClick(row);
                            event.stopPropagation();
                          },
                        },
                      },
                      ['上传'],
                    )
                  : h(
                      'a',
                      {
                        style: {
                          color: 'var(--text-color)',
                        },
                        on: {
                          click: (event: MouseEvent) => {
                            lookFileClick(row);
                            event.stopPropagation();
                          },
                        },
                      },
                      ['查看'],
                    );
              } else {
                return '';
              }
            }
          },
        },
        {
          label: '操作',
          align: 'left',
          headerAlign: 'left',
          fixed: 'right',
          minWidth: 180,
          formatter: row => operation_render(row, false),
        },
      ];
      if (
        (isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value) &&
        (business_type.value === 3 || business_type.value === 7 || business_type.value === 9)
      ) {
        arr.splice(2, 0, settlement_income_type_column.value);
      }
      return arr;
    });

    const filterForm = ref<PaginationParams>({
      page_num: 1,
      num: 20,
    });

    const getPayload = (): SettlementListQueryParams => {
      const payload: SettlementListQueryParams = {
        project_id: project_id.value,
        business_type: business_type.value,
        ...filterForm.value,
      };
      return payload;
    };
    const searchParams = ref<any>({});
    const reload = async (clean = true) => {
      if (clean) {
        filterForm.value.page_num = 1;
      }
      await loadData({
        ...getPayload(),
        ...searchParams.value,
        is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
      });
    };

    const onCurrentChange = async (page_num: number) => {
      filterForm.value.page_num = page_num;
      await reload(false);
    };

    const onSizeChange = async (num: number) => {
      filterForm.value.num = num;
      await reload();
    };

    provide('contract', ref(undefined));
    provide('project_add_id', router.currentRoute.params.id);

    const approveVisible = ref<boolean>(false);
    const onApproveBtnClick = () => {
      approveVisible.value = true;
    };
    const onApproveClose = () => {
      approveVisible.value = false;
      reload();
    };

    onMounted(() => {
      reload();
    });

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 34;
    const rectPadding = 36;
    const otherHeight = 31;

    const topCardHeight = ref(0);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    const dis_height = computed(() =>
      isFromLocalLife.value || isFromLiveDouyin.value
        ? data.value.length > 0
          ? 12
          : 45
        : data.value.length > 0
        ? 64
        : 94,
    );
    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight.value === 0 ? 6 : topCardHeight, dis_height],
      tableMinHeight: 100,
    });

    const rowStyle = (row: Settlement) => {
      if (
        !row.reversed_id &&
        !row.refunded_id &&
        (row.status === SettlementStatus.confirmed ||
          row.status === SettlementStatus.wait_confirm ||
          row.status === SettlementStatus.wait_project_confirm ||
          row.status === SettlementStatus.nopass_project_confirm)
      ) {
        return { cursor: 'pointer' };
      }
      return undefined;
    };
    /* 搜索 */
    const search = async (params: any) => {
      filterForm.value.page_num = 1;
      searchParams.value = params || {};
      await loadData({
        ...getPayload(),
        ...params,
        is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
      });
    };

    return {
      isHideReversed,
      isFromMarketing,
      isFromLive,
      isFromLocalLife,
      isFromLiveDouyin,
      isFromSupplyChain,
      isFromCommon,
      CanIUse,
      dialogRef,
      buttonContent,
      onCreateBtnClick,
      onEditBtnClick,
      achievementRef,
      columns,
      project,
      loading,
      data,
      total,
      loadData,
      search,
      reload,
      filterForm,
      onCurrentChange,
      onSizeChange,
      deleteLoading,
      reasonDialogVisible,
      reasonDialogTitle,
      reason,
      onViewBtnClick,
      onReasonViewBtnClick,
      onRefundedReason,
      onRefundedBackReason,
      onReasonDialogClose,
      reverseOrderDialogRef,
      onWriteOffConfirmResolve,
      writeOffLoading,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      onApproveBtnClick,
      approveVisible,
      onApproveClose,
      rowStyle,
      projectConfirmDialogRef,
      MakeInvoiceDialogRef,
      settlementDetailLoading,
    };
  },
});
