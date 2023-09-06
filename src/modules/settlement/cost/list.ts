/**
 * 成本结算 - 通用业务/店铺代播/营销业务
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-02 15:52:02
 */
import {
  computed,
  defineComponent,
  h,
  inject,
  onMounted,
  provide,
  ref,
} from '@vue/composition-api';
import type { Ref } from '@vue/composition-api';
import {
  ConfirmReverseParams,
  ReverseType,
  Settlement,
  SettlementListQueryForm,
  SettlementListQueryParams,
  SettlementScanStatusOptions,
} from '@/types/tiange/finance/settlement';
// import { SettlementType } from '@/types/tiange/finance/settlement';
import {
  SettlementKind,
  SettlementStatusOptions,
  SettlementTypeOptions,
} from '@/types/tiange/finance/settlement';
import { SettlementStatus } from '@/types/tiange/finance/settlement';
import TgSettlementDialog from './dialog/dialog.vue';
import type { SettlementDialog } from './dialog/dialog';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { ObjectFilterEmpty, URLSearchMaker, wait } from '@/utils/func';
import {
  DeleteSettlement,
  GetSettlementDetail,
  GetSettlementList,
  // ReloadKolCompanyRelationship,
} from '@/services/finance/settlement';
import { AsyncConfirm, Confirm } from '@/use/asyncConfirm';
import { HasPermission, usePermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { form_data_to_optional_params } from '@/utils/request.fn';
import type { SettlementCol } from '@/modules/settlement/use/columns';
import { useColumns } from '@/modules/settlement/use/columns';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import type { MarketingProjectDetail } from '@/types/tiange/marketing/project';
import type { LiveProject } from '@/types/tiange/live.project';
import type { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import type { SettlementDetailDialogRef } from '@/modules/finance/settlement_cost/detail';
import SettlementDetailDialog from '@/modules/finance/settlement_cost/detail.vue';
// import { useCache } from '@/use/cache';
import { useUrlSearchParams } from '@vueuse/core';
import { Options2GroupedOptions } from '@/utils/form';
import { BooleanType } from '@/types/base/advanced';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import useVisible from '@/use/visible';
import reverseAuditDialog from '@/modules/finance/components/reverseAudit.vue';
import { ConfirmReverse, FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import { is_reversed_order as is_reversed_settlement, is_refunded_order } from '@/use/finance';
import { ReverseOrderDialog } from '../component/reverseOrder';
import { ReverseStatus } from '@/types/tiange/finance/finance';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import AddSettlementDialog from '@/views/medium/components/newAddSettlementDialog.vue';
import { useRouter } from '@/use/vue-router';
import PaymentDialog from '@/modules/marketing/project/dialog/payment/form.vue';
import InvoiceUpload from '@/modules/finance/invoice/dialog/invoice.upload.vue';
import { InoviceWriteOffStatusEnums } from '@/types/tiange/finance/invoice';
import { CooperationTypeEnum, ProjectTypeEnum } from '@/types/tiange/common';
import { ProjectStatusEnum } from '@/types/tiange/common';
import incomeSearch from '../component/incomeSearch.vue';
import { RouterNameFinance } from '@/const/router';
import { useDialog } from '@/use/dialog';
import scanImport from '@/modules/settlement/component/import/index.vue';
import scanCheck from '@/modules/finance/components/scanCheck/index.vue';
import { formatAmount } from '@/utils/string';
import changePayment from '@/modules/finance/components/changePayment/index.vue';

const parseStringParams = (param: string | string[] | undefined) => {
  if (param === undefined || param === '') {
    return '';
  } else if (Array.isArray(param) && param.length === 0) {
    return '';
  } else {
    return param as string;
  }
};

const parseNumberParams = <T = number | ''>(param: string | string[] | undefined, def: T) => {
  if (param === undefined || param === '') {
    return def;
  } else if (Array.isArray(param) && param.length === 0) {
    return def;
  } else {
    return parseInt(param as string, 10);
  }
};

/**
 * 能否冲销
 * ```
 * 已确认且为非冲销单
 * ```
 */
const can_i_use_reverse_btn = (row: Settlement) =>
  SettlementStatus.confirmed === row.status && !is_reversed_settlement(row);

/**
 * 能否重新发起冲销
 * ```
 * 冲销单且冲销被打回
 * ```
 */
const can_i_use_re_reverse_btn = (row: Settlement) =>
  ReverseStatus.refused === row.reverse_status && is_reversed_settlement(row);

/** 构造函数，可更改组件名称，用于区分财务和项目内结算列表 */
const setup = (name = 'TgSettlementTab') =>
  defineComponent({
    name,
    props: {
      isAreaCost: {
        type: Boolean,
        default: false,
        required: false,
      },
      cooperationType: {
        type: Number,
        default: 1,
        required: false,
      },
    },
    data() {
      return {
        SettlementTypeOptions: Options2GroupedOptions(SettlementTypeOptions),
        SettlementStatusOptions,
      };
    },
    components: {
      TgSettlementDialog,
      SettlementDetailDialog,
      reverseOrderDialog,
      reverseAuditDialog,
      AddSettlementDialog,
      PaymentDialog,
      InvoiceUpload,
      incomeSearch,
    },
    setup(props, ctx) {
      const {
        project_id,
        isFromMarketing,
        isFromLive,
        isFromLiveDouyin,
        isFromLocalLife,
        isFromCommon,
        isFromSupplyChain,
        project_type,
        business_type,
      } = useProjectBaseInfo();
      const router = useRouter();
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
            isFromLiveDouyin ||
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
      provide('project_add_id', router.currentRoute.params.id);
      /** 缓存过期时间 */
      // const expiration = 120_000;
      const paymentDialogVisible = ref<boolean>(false);
      const paySettlement = ref<Settlement | undefined>(undefined);
      const customerManager = ref<string>('');
      const InvoiceUploadRef = ref<{ show(): void } | null>(null);
      const isHideReversed = ref(true);
      // * 设定为2分钟过期的详情缓存
      // const { getCache, setCache, removeCache } = useCache<Settlement>(expiration);
      const { visible: isFetchingDetail, setVisible: setFetchingDetail } = useVisible();
      // * 获取结算单详情
      const get_settlement_detail = async (id: number, row?: Settlement) => {
        /* if (getCache(id) !== undefined) {
          return getCache(id);
        }*/
        setFetchingDetail(true);
        /*  if (row && row.business_type === 2 && row.is_tmp === 1) {
          await ReloadKolCompanyRelationship(id + '');
        }*/
        const [{ data: response }] = await wait(
          500,
          GetSettlementDetail(project_type.value, {
            id,
          }),
        );
        setFetchingDetail();
        if (response.success && response.data !== undefined) {
          // setCache(id, response.data);
          return response.data;
        } else {
          return undefined;
        }
      };

      /** 收到结算单缓存过期消息时清除该条结算单的缓存 */
      const onCacheOutdated = (id: number) => {
        // removeCache(id);
        console.log(id);
      };

      const projectType = computed(() => {
        if (isFromLive.value || isFromLiveDouyin.value) {
          return ProjectTypeEnum.live;
        }
        if (isFromSupplyChain.value) {
          return ProjectTypeEnum.supply_chain;
        }
        if (isFromLocalLife.value) {
          return ProjectTypeEnum.local_life;
        }
        if (isFromCommon.value) {
          return ProjectTypeEnum.common_business;
        }
        if (isFromMarketing.value) {
          return ProjectTypeEnum.marketing;
        }
        return undefined;
      });

      /** 项目详情 */
      const project = computed<
        MarketingProjectDetail | LiveProject | CommonBusinessProjectDetail | undefined
      >(() => {
        if (isFromMarketing.value) {
          const marketing_project =
            inject<Ref<MarketingProjectDetail | undefined>>('MarketingProject') ?? ref(undefined);
          return {
            ...marketing_project.value,
            project__type: 'marketing',
          } as MarketingProjectDetail;
        } else if (
          isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value
        ) {
          const live_project =
            inject<Ref<LiveProject | undefined>>('live_project') ?? ref(undefined);
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
            inject<Ref<CommonBusinessProjectDetail | undefined>>('common_project') ??
            ref(undefined);
          return {
            ...common_project.value,
            project__type: 'common',
          } as CommonBusinessProjectDetail;
        } else {
          return undefined;
        }
      });

      /** 权限码 */
      const permission = usePermission();
      const paymentData = ref<{
        brand_id: number | undefined;
        brand_name: string | undefined;
        business_type: number | undefined;
        project_id: number;
        project_name: string;
      }>({
        brand_id: project.value?.brand_id,
        brand_name: project.value?.brand_name,
        business_type: business_type.value,
        project_id: project_id.value,
        project_name: '',
      });

      /** 按钮权限 */
      const CanIUse = computed(() => {
        if (isFromMarketing.value) {
          return {
            createBtn: permission.marketing_project_settlement_save,
            deleteBtn: permission.marketing_project_settlement_delete,
            uploadInvoiceBtn: permission.coop_upload_invoice,
          };
        } else if (isFromLive.value || isFromLiveDouyin.value) {
          return {
            createBtn: permission.live_project_settlement_save,
            deleteBtn: permission.live_project_settlement_delete,
            auditBtn: permission.live_project_statements_create,
            uploadInvoiceBtn: permission.shop_live_upload_invoice,
          };
        } else if (isFromSupplyChain.value) {
          return {
            createBtn: permission.supply_edit_settlement,
            deleteBtn: permission.supply_edit_settlement,
            auditBtn: permission.supply_edit_contract_settlement,
            uploadInvoiceBtn: permission.supply_upload_invoice,
          };
        } else if (isFromLocalLife.value) {
          return {
            createBtn: permission.local_life_project_settlement_save,
            deleteBtn: permission.local_life_project_settlement_delete,
            auditBtn: permission.local_life_project_statements_create,
            uploadInvoiceBtn: permission.local_life_upload_invoice,
          };
        } else if (isFromCommon.value) {
          return {
            createBtn: permission.common_business_project_settlement_save,
            deleteBtn: permission.common_business_project_settlement_delete,
            auditBtn: permission.common_business_project_contract_statement_create,
            uploadInvoiceBtn: permission.common_upload_invoice,
          };
        } else {
          return {
            createBtn: false,
            deleteBtn: false,
            uploadInvoiceBtn: false,
          };
        }
      });

      if (project_type.value !== 'finance') {
        // 项目类型
        provide('project_type', project_type);

        // 注入项目ID
        provide('project_id', project_id);

        // 注入项目详情
        provide('project3in1', project);
      }

      /** 结算对话框引用 */
      const dialogRef = ref<SettlementDialog | null>(null);

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

      /** 发起结算 */
      const onCreateBtnClick = (is_estimate = 0) => {
        if (project_finished()) {
          return;
        }
        dialogRef.value?.open(undefined, is_estimate);
      };

      /** 编辑结算 */
      const onEditBtnClick = async (row: Settlement) => {
        const detail = await get_settlement_detail(row.id, row);
        if (detail !== undefined) {
          dialogRef.value?.open(detail);
        } else {
          ctx.root.$message.error('未查询到结算单详情');
        }
      };
      /** 查看结算 */
      const onViewBtnClick = async (row: Settlement) => {
        if (!rowStyle(row) || row.refunded_id) {
          return;
        }
        if (is_reversed_settlement(row)) {
          onReverseReasonViewBtnClick(row);
          return;
        }
        const detail = await get_settlement_detail(row.id, row);
        if (detail !== undefined) {
          settlementDetailDialogRef.value?.open(detail);
        } else {
          ctx.root.$message.error('未查询到结算单详情');
        }
      };

      const deleteLoading = ref(false);
      /** 删除结算 */
      const onDeleteBtnClick = async (row: Settlement, title = '确认要删除这条结算吗？') => {
        const result = await AsyncConfirm(ctx, {
          title,
          content:
            process.env.NODE_ENV === 'development'
              ? `结算编号【${row.settlement_uid}】`
              : undefined,
        });

        if (!result) {
          return;
        }

        deleteLoading.value = true;
        const [{ data: response }] = await wait(1200, DeleteSettlement(project_type.value, row.id));
        deleteLoading.value = false;

        if (response.success) {
          ctx.root.$message.success('删除成功');
          await reload();
        } else {
          ctx.root.$message.error(response.message ?? '删除失败');
        }
      };
      /** 付款按钮事件 */
      const onPayBtnClick = (settlement: any) => {
        if (project.value?.business_type === 1) {
          customerManager.value = project.value?.manager_name ? project.value?.manager_name : '';
        } else {
          customerManager.value = project.value?.customer_manager
            ? project.value?.customer_manager
            : '';
        }
        paymentData.value = {
          brand_id: project.value?.brand_id,
          brand_name: project.value?.brand_name,
          business_type: project.value?.business_type,
          project_id: project_id.value,
          project_name: settlement.project_name,
        };
        paySettlement.value = settlement;
        paymentDialogVisible.value = true;
      };

      const reverseOrderDialogRef = ref<ReverseOrderDialog | null>(null);

      const { visible: reverseLoading, toggleVisible: toggleReverseLoading } = useVisible();

      /** 冲销动作 */
      const onReverseConfirmResolve = async (
        /** 被冲销单据 */
        row: Settlement,
        /** 冲销原因 */
        reverse_reason: string,
        is_confirm: boolean = false,
      ) => {
        toggleReverseLoading();

        const [{ data: response }] = await wait(
          500,
          FinancialReverse({
            id: row.id,
            reverse_type: ReverseType.settlement_cost,
            reverse_reason,
            is_confirm: is_confirm,
          }),
        );

        toggleReverseLoading();
        if (response.success) {
          ctx.root.$message.success(response.message ?? '冲销成功');
          reverseOrderDialogRef.value?.close();
          reload();
        } else {
          if (Number(response.error_code) === 1001) {
            const result = await Confirm({
              title: '该结算单存在审批中的付款申请，是否同时撤销该付款申请？',
              confirmText: '是',
              cancelText: '否',
            });
            if (result) {
              await onReverseConfirmResolve(row, reverse_reason, true);
            }
          } else {
            ctx.root.$message.error(response.message ?? '冲销失败');
          }
        }
        return response.success;
      };

      const { visible: reverseAgainLoading, toggleVisible: toggleReverseAgainLoading } =
        useVisible();

      /** 重新提交冲销 */
      const reverseAgain = async (
        row: Settlement,
        reverse_reason: string,
        is_confirm: boolean = false,
      ) => {
        toggleReverseAgainLoading();
        const [{ data: response }] = await wait(
          500,
          FinancialReverseAgain({
            id: row.id,
            reverse_type: ReverseType.settlement_cost,
            reverse_reason,
            is_confirm: is_confirm,
          }),
        );
        toggleReverseAgainLoading();

        if (response.success) {
          ctx.root.$message.success(response.message ?? '重新提交成功');
          reverseOrderDialogRef.value?.close();
          reload();
        } else {
          if (Number(response.error_code) === 1001) {
            const result = await Confirm({
              title: '该结算单存在审批中的付款申请，是否同时撤销该付款申请？',
              confirmText: '是',
              cancelText: '否',
            });
            if (result) {
              reverseAgain(row, reverse_reason, true);
            }
          } else {
            ctx.root.$message.error(response.message ?? '重新提交失败');
          }
        }

        return response.success;
      };

      const reasonDialogVisible = ref(false);
      const reason = ref('');
      const reasonDialogTitle = ref('');

      const onReasonViewBtnClick = (row: Settlement) => {
        reasonDialogTitle.value = '退回原因';
        reason.value = row.refuse_reason;
        reasonDialogVisible.value = true;
      };

      const onReasonDialogClose = () => {
        reason.value = '';
        reasonDialogVisible.value = false;
      };

      const onReverseBackReasonViewBtnClick = (row: Settlement) => {
        reasonDialogTitle.value = '退回原因';
        reason.value = row.reverse_back_reason;
        reasonDialogVisible.value = true;
      };

      const onRefundedResaon = (row: Settlement) => {
        reasonDialogTitle.value = '退回原因';
        reason.value = row.refund_back_reason || '';
        reasonDialogVisible.value = true;
      };
      const onRefunded = (row: Settlement) => {
        reasonDialogTitle.value = '冲销原因';
        reason.value = row.refund_reason || '';
        reasonDialogVisible.value = true;
      };

      const onReverseReasonViewBtnClick = (row: Settlement) => {
        reasonDialogTitle.value = '冲销原因';
        reason.value = row.reverse_reason;
        reasonDialogVisible.value = true;
      };

      const loading = ref(false);
      const data = ref<Settlement[]>([]);
      const total = ref(0);
      const canMarketingChange = HasPermission(RIGHT_CODE.marketing_project_cost_change);
      const canLiveChange = HasPermission(RIGHT_CODE.live_project_cost);
      const canLocalLifeChange = HasPermission(RIGHT_CODE.local_life_project_cost);
      const canSupplyChainChange = HasPermission(RIGHT_CODE.supply_edit_cost);
      const canCommonChange = HasPermission(RIGHT_CODE.common_business_project_registration_cost);
      const showPayBtn = (settlement: Settlement) => {
        if (
          settlement.status !== SettlementStatus.confirmed ||
          settlement.is_estimate ||
          settlement.reverse_id ||
          settlement.reversed_id ||
          settlement.reverse_status === ReverseStatus.wait_confirm ||
          settlement.pending_amount <= 0 ||
          (isFromMarketing.value && !canMarketingChange) ||
          ((isFromLive.value || isFromLiveDouyin.value) && !canLiveChange) ||
          (isFromSupplyChain.value && !canSupplyChainChange) ||
          (isFromLocalLife.value && !canLocalLifeChange) ||
          (isFromCommon.value && !canCommonChange)
        ) {
          /**
           * 以下请款不显示付款按钮
           *  1、暂估结算单
           *  2、财务未确认
           *  3、结算单已冲销，或等待确认冲销
           *  4、冲销单
           *  5、待付款金额<=0
           */
          return false;
        }
        return true;
      };

      const {
        settlement_number_column,
        department_name_colume,
        settlement_cycle_column,
        bill_period_column,
        settlement_money_column,
        settlement_tax_rate_column,
        settlement_tax_amount_column,
        settlement_no_tax_amount_column,
        paid_amount_column,
        not_paid_amount_column,
        settlement_status_column,
        write_off_status_column,
        settlement_person_column,
        submit_date_column,
        confirm_person_column,
        confirm_date_column,
        income_settlement_column,
        project_name_colume,
        settlement_type_column,
        settlement_supplier_column,
        settlement_bill_column,
        scan_file_status_column,
        settlement_cost_type_column,
      } = useColumns(data);

      const operation_render = <T extends boolean>(
        row: Settlement,
        text_only: T,
      ): TableColumnRenderReturn<T> => {
        const btns = [];
        if (is_refunded_order(row)) {
          const { refund_status } = row;
          const btn1 = text_only
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

          const btn2 = text_only
            ? '查看'
            : h(
                'a',
                {
                  on: {
                    click: (event: MouseEvent) => {
                      onRefunded(row);
                      event.stopPropagation();
                    },
                  },
                },
                ['查看'],
              );
          const btn3 = text_only
            ? '查看原因'
            : h(
                'a',
                {
                  on: {
                    click: (event: MouseEvent) => {
                      onRefundedResaon(row);
                      event.stopPropagation();
                    },
                  },
                },
                ['查看原因'],
              );
          switch (refund_status) {
            case 1: {
              break;
            }
            case 2: {
              btns.push(btn2);
              break;
            }
            case 3: {
              btns.push(btn3);
              btns.push(btn1);
              break;
            }
            default: {
              break;
            }
          }
        } else {
          if (is_reversed_settlement(row)) {
            if (can_i_use_re_reverse_btn(row)) {
              const btn1 = text_only
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
              const btn2 = text_only
                ? '重新提交'
                : h(
                    'a',
                    {
                      on: {
                        click: (event: MouseEvent) => {
                          reverseOrderDialogRef.value?.open(
                            msg => reverseAgain(row, msg, false),
                            row.reverse_reason,
                          );
                          event.stopPropagation();
                        },
                      },
                    },
                    ['重新提交'],
                  );
              const btn3 = text_only
                ? '退回原因'
                : h(
                    'a',
                    {
                      on: {
                        click: (event: MouseEvent) => {
                          onReverseBackReasonViewBtnClick(row);
                          event.stopPropagation();
                        },
                      },
                    },
                    ['退回原因'],
                  );
              btns.push(btn1);
              btns.push(btn2);
              btns.push(btn3);
            }
          } else {
            if (
              CanIUse.value.createBtn &&
              [SettlementStatus.unsubmit, SettlementStatus.refused].includes(row.status)
            ) {
              const btn1 = text_only
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
              btns.push(btn1);
            }

            if (row.status === SettlementStatus.refused) {
              const btn1 = text_only
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
              btns.push(btn1);
            }
            if (can_i_use_reverse_btn(row) && row.reverse_id === null) {
              const btn1 = text_only
                ? '冲销'
                : h(
                    'a',
                    {
                      class: 'reverse-red',
                      on: {
                        click: (event: MouseEvent) => {
                          reverseOrderDialogRef.value?.open(msg =>
                            onReverseConfirmResolve(row, msg, false),
                          );
                          event.stopPropagation();
                        },
                      },
                    },
                    ['冲销'],
                  );
              row.has_refund_settlement !== 1 && btns.push(btn1);
            }
            if (
              CanIUse.value.deleteBtn &&
              (row.status === SettlementStatus.unsubmit || row.status === SettlementStatus.refused)
            ) {
              const btn1 = text_only
                ? '删除'
                : h(
                    'a',
                    {
                      on: {
                        click: (event: MouseEvent) => {
                          onDeleteBtnClick(row);
                          event.stopPropagation();
                        },
                      },
                    },
                    ['删除'],
                  );
              btns.push(btn1);
            }
          }
          if (showPayBtn(row)) {
            const btn = text_only
              ? '付款'
              : h(
                  'a',
                  {
                    on: {
                      click: (event: MouseEvent) => {
                        onPayBtnClick(row);
                        event.stopPropagation();
                      },
                    },
                  },
                  ['付款'],
                );

            btns.unshift(btn);
          }
          const showUploadInvoiceBtn =
            row.write_off_status !== InoviceWriteOffStatusEnums.write_off_all &&
            row.status === SettlementStatus.confirmed &&
            !(row.refund_amount !== 0 && row.refund_amount === row.tax_included_amount) &&
            !row.reverse_id &&
            !row.reversed_id;
          //暂估结算单隐藏上传发票
          if (showUploadInvoiceBtn && CanIUse.value.uploadInvoiceBtn && row.is_estimate === 0) {
            const btn = text_only
              ? '上传发票'
              : h(
                  'a',
                  {
                    on: {
                      click: (event: MouseEvent) => {
                        (InvoiceUploadRef.value as any).show(
                          {
                            id: row.id,
                            company: row.company_name,
                            business_type: row.business_type,
                          },
                          2,
                          projectType.value,
                        );
                        event.stopPropagation();
                      },
                    },
                  },
                  ['上传发票'],
                );
            btns.unshift(btn);
          }
        }

        return text_only
          ? btns.join('  ')
          : (h('div', { class: 'operation' }, btns) as TableColumnRenderReturn<T>);
      };
      /** 操作列最大宽度 */
      const operation_max_length = max_length_of_column(data, '操作', operation_render);
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
      /** 列设置 - 项目结算版 */
      const changePaymentDialog = useDialog({
        component: changePayment,
        title: '修改账期',
        width: 306,
        okText: '确定',
        cancelText: '取消',
        on: {
          submit() {
            reload();
          },
        },
      });

      const onChangeDateHandler = (row: Settlement) => {
        changePaymentDialog.show(row, 2);
      };
      const columns = computed<SettlementCol[]>(() => {
        const arr: SettlementCol[] = [
          settlement_number_column.value,
          settlement_cycle_column.value,
          department_name_colume.value,
          settlement_money_column.value,
          settlement_tax_rate_column.value,
          settlement_tax_amount_column.value,
          settlement_no_tax_amount_column.value,
          paid_amount_column.value,
          not_paid_amount_column.value,
          settlement_supplier_column.value,
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
              /** 冲销订单，退款订单,暂估订单,完全退款*/
              const status = row.settlement_scan_status || 0;
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
                  /** */
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
            fixed: 'right',
            width: operation_max_length.value,
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
          arr.splice(1, 0, settlement_cost_type_column.value);
        }
        return arr;
      });

      /** 结算明细对话框引用 */
      const settlementDetailDialogRef = ref<SettlementDetailDialogRef | null>(null);

      /** 显示结算明细 */
      const showDetail = async (row: Settlement) => {
        const detail = await get_settlement_detail(row.id, row);
        if (detail !== undefined) {
          settlementDetailDialogRef.value?.open(detail);
        } else {
          ctx.root.$message.error('未查询到结算单详情');
        }
      };

      const reverseAuditDialogRef = ref<{
        open: (
          msg: string,
          cb: (
            is_pass: BooleanType,
            reverse_back_reason: string,
            date?: string,
          ) => Promise<boolean>,
          accoiuntPeriod: boolean,
        ) => void;
      } | null>(null);

      const { visible: reverseAuditLoading, toggleVisible: toggleReverseAuditLoading } =
        useVisible();

      /** 冲销确认动作 */
      const onReverseAuditConfirm = async (
        row: Settlement,
        is_pass: BooleanType,
        reverse_back_reason: string,
        date?: string,
      ) => {
        toggleReverseAuditLoading();

        const params: ConfirmReverseParams = {
          id: row.id,
          reverse_type: ReverseType.settlement_cost,
          is_pass,
          reverse_back_reason,
          account_detail_date: date,
        };
        const [{ data: response }] = await wait(500, ConfirmReverse(params));

        toggleReverseAuditLoading();

        if (response.success) {
          ctx.root.$message.success(response.message ?? '提交成功');
        } else {
          ctx.root.$message.error(response.message ?? '提交失败');
        }

        reload();

        return response.success;
      };
      const ScanStatusOptions = computed(() => {
        return [...SettlementScanStatusOptions];
      });
      /** 扫描件上传 */
      const dialogCheckDemo = useDialog({
        component: scanCheck,
        footer: false,
        width: 410,
        title: '扫描件上传',
        on: {
          submit: () => {
            reload();
          },
        },
      });
      const checkFileClick = (row: Settlement) => {
        dialogCheckDemo.show(
          row.id,
          row.settlement_scan_urls,
          false,
          row.settlement_scan_message || '',
        );
      };
      const lookTwoFileClick = (row: Settlement) => {
        dialogCheckDemo.show(
          row.id,
          row.settlement_scan_urls,
          true,
          row.settlement_scan_message || '',
        );
      };
      /** 列设置 - 财务特供版 */
      const financeColumns = computed<SettlementCol[]>(() => [
        settlement_number_column.value,
        income_settlement_column.value,
        settlement_cost_type_column.value,
        department_name_colume.value,
        project_name_colume.value,
        settlement_supplier_column.value,
        settlement_type_column.value,
        settlement_cycle_column.value,
        bill_period_column.value,
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
        settlement_bill_column.value,
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
              /** 退款- 已确认结算 ,  已确认结算*/
              if (row.status === 2) {
                return status === 1
                  ? h(
                      'a',
                      {
                        on: {
                          click: (event: MouseEvent) => {
                            checkFileClick(row);
                            event.stopPropagation();
                          },
                        },
                      },
                      ['审核'],
                    )
                  : status === 2 || status === 3
                  ? h(
                      'a',
                      {
                        style: {
                          color: 'var(--text-color)',
                        },
                        on: {
                          click: (event: MouseEvent) => {
                            lookTwoFileClick(row);
                            event.stopPropagation();
                          },
                        },
                      },
                      ['查看'],
                    )
                  : '';
              } else {
                return '';
              }
            }
          },
        },
        {
          label: '操作',
          fixed: 'right',
          minWidth: 110,
          formatter: row => {
            const btns = [];
            if (is_refunded_order(row)) {
              if (HasPermission(RIGHT_CODE.edit_cost_account_period)) {
                const btns = [
                  h(
                    'a',
                    {
                      on: {
                        click: () => {
                          onChangeDateHandler(row);
                        },
                      },
                    },
                    ['账期'],
                  ),
                ];
                return h('div', { class: 'operation' }, btns);
              }
              return '';
            }
            if (is_reversed_settlement(row)) {
              //  冲销单
              if (row.reverse_status !== ReverseStatus.wait_confirm) {
                //  已确认
                btns.push(
                  h(
                    'a',
                    {
                      on: {
                        click: (event: MouseEvent) => {
                          reason.value = row.reverse_reason;
                          reasonDialogVisible.value = true;
                          event.stopPropagation();
                        },
                      },
                    },
                    '查看',
                  ),
                );
              }

              if (ReverseStatus.wait_confirm === row.reverse_status) {
                btns.push(
                  h(
                    'a',
                    {
                      class: 'reverse-red',
                      on: {
                        click: (event: MouseEvent) => {
                          reverseAuditDialogRef.value?.open(
                            row.reverse_reason,
                            (is_pass, reverse_back_reason, date) =>
                              onReverseAuditConfirm(row, is_pass, reverse_back_reason, date),
                            true,
                          );
                          event.stopPropagation();
                        },
                      },
                    },
                    '冲销确认',
                  ),
                );
              }
            } else {
              if (
                [SettlementStatus.confirmed, SettlementStatus.wait_confirm].includes(row.status) &&
                HasPermission(RIGHT_CODE.settlement_income_view)
              ) {
                btns.push(
                  h(
                    'a',
                    {
                      on: {
                        click: (event: MouseEvent) => {
                          showDetail(row);
                          event.stopPropagation();
                        },
                      },
                    },
                    ['查看'],
                  ),
                );
              }
            }
            if (HasPermission(RIGHT_CODE.edit_cost_account_period) && row.account_detail_date) {
              btns.push(
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        onChangeDateHandler(row);
                      },
                    },
                  },
                  ['账期'],
                ),
              );
            }

            return h('div', { class: 'operation' }, btns);
          },
        },
      ]);

      const onConfirmSuccuss = async (id: number) => {
        // removeCache(id);
        console.log(id);
        await reload();
      };

      /** 筛选项表单 */
      const filterForm = ref<SettlementListQueryForm>({
        project_name: '',
        settlement_type: '',
        status: 1,
        search_value: '',
        search_type: '1',
        settlement_kind: SettlementKind.cost,
        is_confirmed: '',
        page_num: 1,
        num: 20,
        month: '',
        account_month: '',
        settlement_scan_status: '',
      });

      /** 重置筛选项表单选项 */
      const resetFilterForm = () => {
        filterForm.value.project_name = '';
        filterForm.value.settlement_type = '';
        filterForm.value.status = '';
        filterForm.value.search_type = '1';
        filterForm.value.search_value = '';
        filterForm.value.month = '';
        filterForm.value.account_month = '';
        filterForm.value.settlement_scan_status = '';
      };

      const params = useUrlSearchParams('history');

      filterForm.value.project_name = parseStringParams(params.project_name);
      filterForm.value.settlement_type = parseNumberParams(params.settlement_type, '');
      filterForm.value.status = parseNumberParams(params.status, 1);
      filterForm.value.page_num = parseNumberParams(params.page_num, 1);
      filterForm.value.num = parseNumberParams(params.num, 20);

      const getPayload = (): SettlementListQueryParams => {
        const {
          project_name,
          settlement_type,
          status,
          settlement_kind,
          is_confirmed,
          month,
          account_month,
          ...rest
        } = filterForm.value;
        if (project_type.value !== 'finance_cost') {
          return {
            month: month === '' ? undefined : month,
            account_month: account_month === '' ? undefined : account_month,
            project_id: project_id.value,
            settlement_kind: form_data_to_optional_params(settlement_kind),
            business_type: business_type.value,
            ...rest,
          };
        } else {
          const filterFormParams = ObjectFilterEmpty({
            project_name: form_data_to_optional_params(project_name),
            settlement_type: form_data_to_optional_params(settlement_type),
            status: form_data_to_optional_params(status),
            ...rest,
          });

          const url = new URL(
            location.origin + ctx.root.$route.path + '?' + URLSearchMaker(filterFormParams),
          );

          if (url.search !== location.search) {
            ctx.root.$router.replace({
              path: url.pathname + url.search,
            });
          }

          return {
            month: month === '' ? undefined : month,
            account_month: account_month === '' ? undefined : account_month,
            project_name: form_data_to_optional_params(project_name),
            settlement_type: form_data_to_optional_params(settlement_type),
            status: form_data_to_optional_params(status),
            settlement_kind: form_data_to_optional_params(settlement_kind),
            is_confirmed: form_data_to_optional_params(is_confirmed),
            is_tmp: BooleanType.NO,
            ...rest,
          };
        }
      };
      const statisticsData = ref<any>();
      const loadData = async (payload: SettlementListQueryParams) => {
        const newPayload = {
          ...payload,
          is_hide_reverse_data:
            (isFromLive.value ||
              isFromLiveDouyin.value ||
              isFromLocalLife.value ||
              isFromSupplyChain.value ||
              isFromMarketing.value ||
              isFromCommon.value) &&
            isHideReversed.value
              ? 1
              : undefined,
        };
        loading.value = true;
        const [{ data: response }] = await wait(
          500,
          GetSettlementList(project_type.value, newPayload),
        );
        loading.value = false;

        if (response.success) {
          if (project_type.value === 'finance_cost') {
            statisticsData.value = response.data.total_count;
          }
          data.value = response.data.data;
          total.value = response.data.total;
        } else {
          data.value = [];
          total.value = 0;
        }
      };

      /** 重载数据 */
      const searchParams = ref<any>({});
      const reload = async (clean = true) => {
        if (clean) {
          filterForm.value.page_num = 1;
        }
        await loadData({
          ...getPayload(),
          ...searchParams.value,
        });
      };

      /** 对话框关闭，重载数据并清空缓存 */
      const onDialogClose = async () => {
        await reload();
      };

      /** 清空缓存 */
      const onCacheShouldUpdate = (data?: Settlement) => {
        if (data !== undefined) {
          // setCache(data.id, data);
        }
      };

      /** 重置筛选项表单并重载数据 */
      const reset = async () => {
        resetFilterForm();
        searchParams.value = {};
        await reload();
      };

      const onCurrentChange = async (page_num: number) => {
        filterForm.value.page_num = page_num;
        await reload(false);
      };

      const onSizeChange = async (num: number) => {
        filterForm.value.num = num;
        await reload();
      };

      const addSettlementDialog = ref<{ show: () => void } | null>(null);
      const onApproveBtnClick = () => {
        addSettlementDialog.value?.show();
      };
      const onSettlementAdded = () => {
        reload();
      };

      onMounted(() => {
        const params = new URLSearchParams(location.search);
        filterForm.value.search_type = params.get('search_type') || '1';
        filterForm.value.search_value = params.get('search_value') || '';
        const routeName = router.currentRoute.name;
        if (routeName === RouterNameFinance.settlement_cost) {
          reload();
        }
        // console.log('🚀 ~ file: list.ts:1169 ~ onMounted ~ ss', ss);
      });

      // * 财务 - 成本结算部分
      // * 自适应表格高度部分
      const buttonLineHeight = 0;
      const paginationLineHeight = 4;
      const rectPadding = 36;
      const otherHeight = 12;

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
        pagename: 'finance_settlementc_cost',
        delay: 100,
      });

      const onPaymentSave = () => {
        reload();
      };

      const rowStyle = (row: Settlement) => {
        if (
          (!row.reversed_id &&
            !row.refunded_id &&
            (row.status === SettlementStatus.confirmed ||
              row.status === SettlementStatus.wait_confirm)) ||
          ReverseStatus.wait_confirm === row.reverse_status ||
          ReverseStatus.confirmed === row.reverse_status
        ) {
          return { cursor: 'pointer' };
        }

        return undefined;
      };

      const onInvoiceUploadSuccess = () => {
        reload();
      };
      /* 搜索 */
      const search = async (params: any) => {
        filterForm.value.page_num = 1;
        searchParams.value = params || {};
        await loadData({ ...getPayload(), ...params });
      };
      const summaryMethod = ({ columns }: any) => {
        return columns.map((el: any, index: any) => {
          if (!index) return '合计';
          if (['tax_amount', 'tax_excluded_amount', 'tax_included_amount'].includes(el.property)) {
            const amount = statisticsData.value?.[el.property];
            if (amount === null || amount === undefined || amount === '') return '--';
            return formatAmount(+amount / 100, 'None');
          }
          return '';
        });
      };
      return {
        isHideReversed,
        ScanStatusOptions,
        isDev: process.env.NODE_ENV === 'development',
        isFromMarketing,
        isFromLive,
        isFromLocalLife,
        isFromSupplyChain,
        isFromCommon,
        CanIUse,
        dialogRef,
        buttonContent,
        onCreateBtnClick,
        onEditBtnClick,
        columns,
        financeColumns,
        project,
        loading,
        data,
        total,
        search,
        loadData,
        reload,
        reset,
        filterForm,
        onCurrentChange,
        onSizeChange,
        deleteLoading,
        reasonDialogVisible,
        reason,
        onViewBtnClick,
        onReasonViewBtnClick,
        onReasonDialogClose,
        // 表格和滚动条
        onTopCardRectUpdate,
        ...tableHeightLogic,
        settlementDetailDialogRef,
        onDialogClose,
        onCacheOutdated,
        onCacheShouldUpdate,
        onConfirmSuccuss,
        reverseOrderDialogRef,
        reverseLoading,
        reverseAgainLoading,
        reasonDialogTitle,
        reverseAuditLoading,
        reverseAuditDialogRef,
        isFetchingDetail,
        onApproveBtnClick,
        onSettlementAdded,
        addSettlementDialog,
        paymentDialogVisible,
        paymentData,
        paySettlement,
        onPaymentSave,
        customerManager,
        rowStyle,
        InvoiceUploadRef,
        onInvoiceUploadSuccess,
        projectType,
        summaryMethod,
      };
    },
  });

export default setup;
