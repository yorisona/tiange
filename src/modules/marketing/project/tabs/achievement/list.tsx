/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-11 09:37:05
 */
/**
 * 营销业务 - 项目详情 - tab 项目收款(实收) - 列表部分
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-08 09:57:43
 */
import { computed, h, inject, onMounted, ref, UnwrapRef } from '@vue/composition-api';
import type { Ref, SetupContext } from '@vue/composition-api';
import type { TableColumn } from '@/types/vendor/column';
import type {
  Achievement,
  AchievementIncoiveInfo,
  AchievementQueryParams,
  AchievementStatInfo,
} from '@/types/tiange/marketing/achievement';
import type { PaginationParams } from '@/types/base/pagination';
import moment from 'moment';
import { fixFileToken } from '@/utils/http';
import { gatherWayListFormat } from '@/const/cooperative';
import invoice from '@/modules/live/project/dialog/invoice';
import { DeleteAchievement, GetAchievementList } from '@/services/marketing/achievement';
import { GatherTypeMap, GatherTypes } from '@/const/options';
import { AsyncConfirm } from '@/use/asyncConfirm';
import type { UserInfo } from '@/types/tiange/system';
import type { MarketingProjectDetail as ProjectDetail } from '@/types/tiange/marketing/project';
import { RouterLegal } from '@/const/router';
import { sleep, wait } from '@/utils/func';
// import { TgInvoiceDetail } from '@/modules/workbench/initiate/invoice/detail';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission, usePermission } from '@/use/permission';
import WriteOff from '@/components/BusinessComponents/WriteOff/index.vue';
import useVisible from '@/use/visible';
import { FinancialReverse, FinancialReverseAgain } from '@/services/finance';
import { ReverseType } from '@/types/tiange/finance/settlement';
import Decimal from 'decimal.js';
import { Decimal2String } from '@/utils/string';
import { ReverseStatus, ReverseStatusMap } from '@/types/tiange/finance/finance';
import { ReverseOrderDialog } from '@/modules/settlement/component/reverseOrder';
import { ApprovalInfo } from '@/types/tiange/workbench';
import { GetApprovalInfo } from '@/services/workbentch';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
type Col = TableColumn<Achievement>;

const moneyFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `￥${Decimal2String(new Decimal(num))}`;
const priceFormat = (num?: number | ''): string =>
  num === '' ? '--' : num === undefined ? '--' : `${Decimal2String(new Decimal(num))}`;

const useList = (ctx: SetupContext) => {
  const project = inject<Ref<ProjectDetail>>('MarketingProject');
  /** 权限检查 */
  const Permission = computed(() => {
    const canChange = HasPermission(RIGHT_CODE.marketing_project_achievement_change);

    return { canChange };
  });
  const achievementRef = ref<{ show: (obj?: any, btype?: any) => void } | undefined>(undefined);
  const workbenchState = computed(() => ctx.root.$store.state.workbench);
  const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);
  /** 是否有权限操作 */
  const hasPermission = computed(() => {
    const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];

    return [project?.value?.add_by_id, project?.value?.manager_id].includes(user.id);
  });
  const add_by_self = (row: Achievement) => {
    const user: UserInfo = ctx.root.$store.getters['user/getUserInfo'];

    return [row.add_by_id].includes(user.id);
  };
  const fetchApprovalInfo = async (approval_id: number | '', approval_uid?: string) => {
    const { data: response } = await GetApprovalInfo({
      approval_id: approval_id === '' ? undefined : approval_id,
      approval_uid,
    });
    if (response.success) {
      ctx.root.$store.dispatch('workbench/setApproval', response.data);
    } else {
      ctx.root.$message.error(response.message ?? '获取审批详情失败');
    }
    return response.data;
  };
  const loading = ref(false);
  const data = ref<Achievement[]>([]);
  const statInfo = ref<AchievementStatInfo>({
    confirmed_gather_amount: 0,
    total_gather_amount: 0,
    wait_gather_amount: 0,
    write_off_amount: 0,
    not_write_off_amount: 0,
  });
  const total = ref(0);

  const refundWriteOffAmount = ref<number | undefined>(undefined);
  const refundWriteOffId = ref<number | undefined>(undefined);
  const refundWriteOffAchievementId = ref<number | undefined>(undefined);
  const refundWriteOffVisible = ref<boolean>(false);

  const queryForm = ref<PaginationParams>({
    page_num: 1,
    num: 10,
  });
  // 收款账户
  const gather_way_format = (row: Achievement) => {
    const node1 = [
      <label>下单旺旺名：</label>,
      <span>{row.gather_way_detail.order_wangwang_id}</span>,
      <label>任务ID：</label>,
      <span>{row.gather_way_detail.task_id}</span>,
      <label>接单日期：</label>,
      <span>
        {row.gather_way_detail.order_date
          ? moment(row.gather_way_detail.order_date).format('YYYY.MM.DD')
          : '--'}
      </span>,
    ];

    const node3 = [
      <label>打款公司名称：</label>,
      <span>
        {row.gather_way_detail.pay_company_name ? row.gather_way_detail.pay_company_name : '--'}
      </span>,
    ];

    return (
      <div style="padding-left:10px">
        <div class="account-info" style="width:100px;text-align:left">
          <label>方式：</label>
          <span>{gatherWayListFormat(row.gather_way)}</span>
        </div>
        <div class="account-info" style="width:100px;text-align:left">
          <label>详情：</label>
          <el-popover placement="bottom-start" trigger="hover" popper-class="achievement-popover">
            <a slot="reference">预览</a>
            <div class="achievement-popover-content">
              <div class="account-info-grid">
                <label>方式：</label>
                <span>{gatherWayListFormat(row.gather_way)}</span>
                {row.gather_way === 1 ? node1 : node3}
              </div>
            </div>
          </el-popover>
        </div>
      </div>
    );
  };

  const invoiceDialogVisible = ref(false);

  const refundDialogVisible = ref(false);
  const refundRow = ref<any>({
    achievement_uid: '',
    achievement_id: '',
    project_name: '',
    gather_amount: 0,
    project_id: '',
    business_type: '',
  });

  const onRefundViewBtnClick = (row: any) => {
    refundRow.value.achievement_uid = row.achievement_uid;
    refundRow.value.achievement_id = row.achievement_id;
    refundRow.value.project_name = row.project_name;
    refundRow.value.gather_amount = row.gather_amount;
    refundRow.value.project_id = row.project_id;
    refundRow.value.business_type = row.business_type;
    refundDialogVisible.value = true;
  };
  const onRefundDialogClose = () => {
    refundRow.value.achievement_uid = '';
    refundRow.value.achievement_id = '';
    refundRow.value.project_name = '';
    refundRow.value.gather_amount = 0;
    refundRow.value.project_id = '';
    refundRow.value.business_type = '';
    refundDialogVisible.value = false;
    reload(old_is_hide_reverse_data.value);
  };

  const invoices = ref<AchievementIncoiveInfo[]>([]);

  const firstStepRef = ref<UnwrapRef<{ show: (...args: any) => void } | undefined>>(undefined);
  const permission = usePermission();

  // 查看发票
  // const show_invoice = (row: Achievement) => {
  //   invoices.value = row.invoice_info.map(el => ({
  //     ...el,
  //     pic_url: fixFileToken(el.pic_url, false),
  //   }));
  //   invoiceDialogVisible.value = true;
  // };

  const closeInvoiceDialog = () => {
    invoiceDialogVisible.value = false;
  };

  // 是否开票
  // const invoice_format = (row: Achievement) => {
  //   return (
  //     <div style="padding-left:10px">
  //       <div class="account-info" style="width:100px;text-align:left">
  //         <label>开票：</label>
  //         <span>{row.is_invoice === 0 ? '否' : row.is_invoice === 1 ? '是' : '--'}</span>
  //       </div>
  //       <div class="account-info" style="width:100px;text-align:left">
  //         <label>凭证：</label>
  //         {row.invoice_info.length > 0 ? (
  //           <tg-button
  //             type="link"
  //             on={{
  //               click: () => {
  //                 show_invoice(row);
  //               },
  //             }}
  //           >
  //             查看
  //           </tg-button>
  //         ) : (
  //           <span>--</span>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  const deleteLoading = ref(false);
  // 删除业绩
  const deleteAchievement = async (row: Achievement, title = '确认删除该业绩？') => {
    const result = await AsyncConfirm(ctx, title);
    if (!result) {
      return;
    }

    const { achievement_id, achievement_uid } = row;

    deleteLoading.value = true;
    const [{ data: response }] = await Promise.all([
      await DeleteAchievement({ achievement_id }),
      await sleep(500),
    ]);
    deleteLoading.value = false;

    if (response.success) {
      ctx.root.$message.success(`${achievement_uid}删除成功`);
      reload(old_is_hide_reverse_data.value);
    } else {
      ctx.root.$message.error(response.message ?? `${achievement_uid}删除失败`);
    }
  };

  const checkedRowIndex = ref(-1);

  const clearCheckedRowIndex = () => {
    checkedRowIndex.value = -1;
  };

  /** 新窗口打开合同详情 */
  const jumpContract = (row: Achievement) => {
    if (row.contract_id === null) return;
    // if (
    //   row.contract_info?.contract_type === 1 ||
    //   row.contract_info?.contract_type === 2 ||
    //   row.contract_info?.contract_type === 5
    // ) {
    // 客户合同
    const { href } = ctx.root.$router.resolve({
      name: row.contract_info?.has_template_info
        ? RouterLegal.contracts.customer.detailTemplate
        : RouterLegal.contracts.customer.detail,
      params: { id: `${row.contract_id}` },
    });
    window.open(href);
    // }
    // if (id === null) {
    //   return;
    // }

    // const { href } = ctx.root.$router.resolve({
    //   name: RouterLegal.contracts.customer.detail,
    //   params: {
    //     id: `${id}`,
    //   },
    // });

    // window.open(href);
  };

  const dialogRef = ref<{ show(approval: ApprovalInfo | undefined): void } | null>(null);

  const reverseOrderDialogRef = ref<ReverseOrderDialog | null>(null);

  const { visible: reverseLoading, toggleVisible: toggleReverseLoading } = useVisible();

  /** 冲销动作 */
  const onReverseConfirm = async (row: Achievement, reverse_reason: string) => {
    toggleReverseLoading();

    const [{ data: response }] = await wait(
      500,
      FinancialReverse({
        id: row.achievement_id,
        reverse_type: ReverseType.receive,
        reverse_reason,
      }),
    );

    toggleReverseLoading();

    if (response.success) {
      ctx.root.$message.success(response.message ?? '发起冲销成功');
      reload(old_is_hide_reverse_data.value);
    } else {
      ctx.root.$message.error(response.message ?? '发起冲销失败');
    }

    return response.success;
  };

  const { visible: reverseAgainLoading, toggleVisible: toggleReverseAgainLoading } = useVisible();

  /** 重新提交冲销 */
  const reverseAgain = async (row: Achievement, reverse_reason: string) => {
    toggleReverseAgainLoading();
    const [{ data: response }] = await wait(
      500,
      FinancialReverseAgain({
        id: row.achievement_id,
        reverse_type: ReverseType.receive,
        reverse_reason,
      }),
    );
    toggleReverseAgainLoading();

    if (response.success) {
      ctx.root.$message.success(response.message ?? '重新提交成功');
      reload(old_is_hide_reverse_data.value);
    } else {
      ctx.root.$message.error(response.message ?? '重新提交成功');
    }

    return response.success;
  };

  const reasonDialogVisible = ref(false);
  const reason = ref('');
  const reasonDialogTitle = ref('');

  const onReasonDialogClose = () => {
    reason.value = '';
    reasonDialogVisible.value = false;
  };

  const onReverseBackReasonViewBtnClick = (row: Achievement) => {
    reasonDialogTitle.value = '退回原因';
    reason.value = row.reverse_back_reason;
    reasonDialogVisible.value = true;
  };

  const onReverseReasonViewBtnClick = (row: Achievement) => {
    reasonDialogTitle.value = '冲销原因';
    reason.value = row.reverse_reason;
    reasonDialogVisible.value = true;
  };

  const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
  const columns = computed<Col[]>(() => [
    // {
    //   label: '结算单编号',
    //   align: 'left',
    //   headerAlign: 'left',
    //   fixed: 'left',
    //   minWidth: 234,
    //   formatter: row =>
    //     h('div', [
    //       <div class={['color-primary', row.reversed_id !== null ? 'reverse-red' : '']}>
    //         {row.achievement_uid}
    //       </div>,
    //       <div class="color-secordary line-clamp-1">{row.achievement_name}</div>,
    //     ]),
    // },
    {
      label: '收款编号/名称',
      property: 'achievement_uid',
      align: 'left',
      headerAlign: 'left',
      fixed: 'left',
      minWidth: 150,
      formatter: row =>
        h('div', [
          <div
            class={[
              'color-primary',
              row.reversed_id !== null || row.reverse_id !== null ? 'reverse-red' : '',
            ]}
          >
            {row.achievement_uid}
          </div>,
          <div class="color-secordary" style="line-height:15px">
            {row.achievement_name}
          </div>,
        ]),
    },
    {
      label: '收款类型',
      property: 'gather_type',
      align: 'center',
      width: 80,
      formatter: row => {
        if (row.gather_type === null) {
          return '--';
        } else {
          const type =
            GatherTypeMap.get(row.gather_type) ?? GatherTypeMap.get(GatherTypes.ServiceCharge);
          if (row.reversed_id !== null || row.reverse_id !== null) {
            return h('div', { class: 'reverse-red' }, ['冲销']);
          } else {
            return type;
          }
        }
      },
    },
    {
      label: '收款金额 (元)',
      property: 'gather_amount',
      align: 'right',
      headerAlign: 'right',
      minWidth: 120,
      labelClassName: 'gather_amount-th',
      renderHeader: () => (
        <el-popover
          trigger="hover"
          placement="top"
          content="如发生退款，该字段为减去退款金额后的实际收款金额"
          popper-class="gather_amount-popover"
          disabled={false}
        >
          <div slot="reference" style="height: 20px;line-height:20px">
            <span>收款金额 (元)</span>
            {/* <tg-icon name="ico-question" /> */}
          </div>
        </el-popover>
      ),
      formatter: row => (
        <span class={row.reversed_id !== null || row.reverse_id !== null ? 'reverse-red' : ''}>
          {priceFormat(row.gather_amount)}
        </span>
      ),
    },
    {
      label: '收款账户',
      property: 'gather_way',
      align: 'center',
      minWidth: 120,
      formatter: gather_way_format,
    },
    {
      label: '退款金额 (元)',
      property: 'refund_amount',
      align: 'right',
      headerAlign: 'right',
      minWidth: 120,
      formatter: row => priceFormat(row.refund_amount),
    },
    {
      label: '登记成本金额 (元)',
      property: 'total_pay_amount',
      align: 'right',
      headerAlign: 'right',
      minWidth: 124,
      formatter: row => priceFormat(row.total_pay_amount),
    },
    {
      label: '已付成本金额 (元)',
      property: 'total_paid_amount',
      align: 'right',
      headerAlign: 'right',
      minWidth: 124,
      formatter: row => priceFormat(row.total_paid_amount),
    },
    {
      label: '收款凭证',
      property: 'gather_certificate_pic',
      align: 'center',
      headerAlign: 'center',
      width: 80,
      formatter: row => {
        if (row.gather_certificate_pic === '') {
          return '--';
        }

        return h(
          'tg-button',
          {
            props: {
              type: 'link',
            },
            on: {
              click: () => {
                invoice.showDetail(fixFileToken(row.gather_certificate_pic, false));
              },
            },
          },
          ['查看'],
        );
      },
    },
    // {
    //   label: '是否开票',
    //   property: 'is_invoice',
    //   align: 'center',
    //   width: 94,
    //   formatter: invoice_format,
    // },
    {
      label: '关联单据',
      property: 'contract_id',
      align: 'left',
      headerAlign: 'left',
      minWidth: 238,
      formatter: (row: any) => {
        return (
          <div>
            <div class="account-info">
              <label>关联合同：</label>
              {row.contract_id ? (
                <span
                  class="hover-link"
                  on={{
                    click: () => jumpContract(row),
                  }}
                >
                  {row.contract_uid}
                </span>
              ) : (
                <span>--</span>
              )}
            </div>
            <div class="account-info">
              <label>开票审批：</label>
              <span
                class="hover-link"
                on={{
                  click: async () => {
                    if (!approval.value && row.approval_uid) {
                      await fetchApprovalInfo('', row.approval_uid);
                    }
                    row.invoice_apply_id ? dialogRef.value?.show(approval.value) : void 0;
                  },
                }}
              >
                {row.approval_uid ?? '--'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      label: '财务确认信息',
      property: 'is_gather',
      align: 'left',
      headerAlign: 'left',
      minWidth: 150,
      formatter: row => {
        const { is_gather, gather_way, gather_confirm_detail } = row;
        if (is_gather === 1) {
          const nodes = [
            <div class="account-info">
              <label>状态：</label>
              <span>已确认</span>
            </div>,
          ];
          if (gather_confirm_detail !== null) {
            nodes.push(
              <div class="account-info">
                <label>收款日期：</label>
                <span>{gather_confirm_detail.order_date}</span>
              </div>,
            );

            if (gather_way !== 1) {
              nodes.push(
                <div class="account-info">
                  <label>详情：</label>
                  <el-popover
                    placement="bottom-start"
                    trigger="hover"
                    popper-class="achievement-popover"
                  >
                    <a slot="reference">预览</a>
                    <div class="achievement-popover-content">
                      <div class="account-info-grid">
                        <label>收款日期：</label>
                        <span>{gather_confirm_detail.order_date}</span>
                        <label>名称：</label>
                        <span>{gather_confirm_detail.pay_company_name}</span>
                        <label>账号：</label>
                        <span>{gather_confirm_detail.account}</span>
                        {gather_way === 3 ? <label>开户行：</label> : ''}
                        {gather_way === 3 ? (
                          <span>{gather_confirm_detail.bank_of_deposit}</span>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </el-popover>
                </div>,
              );
            }
          }

          return <div>{nodes}</div>;
        } else {
          return <span style="color: #ff7a36">待确认</span>;
        }
      },
    },
    {
      label: '核销状态',
      property: 'is_gather',
      align: 'left',
      headerAlign: 'left',
      width: 120,
      formatter: row => {
        let write_off_infos = [];
        if (Number(row.gather_type) === 5) {
          write_off_infos = (row.refund_write_off_info_items || []).map((item: any) => {
            return [
              item.settlement_uid,
              item.payable_uid,
              item.write_off_amount * -1,
              item.write_off_user,
              item.write_off_time,
            ];
          });
        } else {
          write_off_infos = (row.write_off_infos || []).map(item => {
            return [
              item.settlement_uid,
              item.receivable_uid,
              item.write_off_amount,
              item.write_off_user,
              item.write_off_time,
            ];
          });
        }
        const write_off_header = [
          '结算单编号',
          Number(row.gather_type) === 5 ? '应付编号' : '应收编号',
          '核销金额 (元)',
          '核销人/账期时间',
        ];

        return (
          <WriteOff
            {...{
              attrs: {
                write_off_header,
                write_off_infos,
                write_off_status:
                  Number(row.gather_type) === 5
                    ? row.refund_write_off_status
                    : row.write_off_status,
                is_reverse: row.reversed_id !== null,
              },
            }}
          />
        );
      },
    },
    {
      label: '冲销状态',
      align: 'center',
      minWidth: 80,
      formatter: row => {
        const { reverse_status } = row;

        const className =
          ReverseStatus.wait_confirm === reverse_status
            ? 'fg-waiting'
            : reverse_status === ReverseStatus.refused
            ? 'fg-failure'
            : '';

        return h('span', { class: className }, ReverseStatusMap.get(reverse_status) ?? '--');
      },
    },
    {
      label: '录入人/日期',
      property: 'gmt_create',
      align: 'left',
      headerAlign: 'left',
      width: 102,
      formatter: (row, col, val) =>
        h(
          'div',
          {
            class: 'table_achievement',
          },
          [
            <div class="color-primary">{row.add_by}</div>,
            <div class="color-secordary">{moment(val).format('YYYY.MM.DD')}</div>,
          ],
        ),
    },
    {
      label: '操作',
      align: 'left',
      headerAlign: 'left',
      fixed: 'right',
      minWidth: 168,
      formatter: row => {
        if (!Permission.value.canChange) {
          return '';
        }
        const is_btn_refund =
          row.is_gather === 1 &&
          (row.gather_type === 1 || row.gather_type === 2 || row.gather_type === 3);
        const btn_enabled =
          row.invoice_info.length === 0 &&
          row.gather_confirm_detail?.order_date === undefined &&
          (hasPermission.value || add_by_self(row));

        const btnNodes: JSX.Element[] = [];

        if (row.reversed_id === null) {
          if (
            row.reverse_id === null &&
            row.is_gather === 1 &&
            row.gather_type !== 5 &&
            !row.has_refund
          ) {
            btnNodes.push(
              <a
                class="reverse-red"
                on={{
                  click: () => {
                    reverseOrderDialogRef.value?.open(msg => onReverseConfirm(row, msg));
                  },
                }}
              >
                冲销
              </a>,
            );
          }

          const hasWriteOff = permission.marketing_project_write_off_save;

          if (
            row.reverse_id === null &&
            (row.write_off_status === 1 || row.write_off_status === 0) &&
            hasWriteOff
          ) {
            if (row.is_gather === 1 && Number(row.gather_type) !== 5) {
              btnNodes.push(
                <a
                  onclick={() => {
                    firstStepRef.value?.show({
                      type: 'isActualIncome',
                      id: row.achievement_id,
                      amount: row.not_write_off_amount, // 可核销金额
                      leaf: 'coop', // 营销业务
                      busType: row.business_type,
                      receivable_uid: row.achievement_uid, // 应收编号
                    });
                  }}
                >
                  核销
                </a>,
              );
            }
          }

          // if (btn_enabled) {
          //   btnNodes.push(
          //     <a
          //       key={'a'}
          //       onClick={() => {
          //         checkedRowIndex.value = index;
          //       }}
          //     >
          //       编辑
          //     </a>,
          //   );
          // }
          if (
            !row.is_gather &&
            (hasPermission.value || add_by_self(row)) &&
            row.gather_type !== 5
          ) {
            btnNodes.push(
              <tg-button
                type="link"
                onclick={() => {
                  const data: any = {
                    achievement_name: row.achievement_name,
                    gather_type: row.gather_type,
                    gather_amount: row.gather_amount,
                    gather_way: row.gather_way,
                    contract_id: row.contract_id,
                    is_invoice: row.is_invoice,
                    invoice_apply_id: row.invoice_apply_id,
                    achievement_id: row.achievement_id,
                    id: row.settlement_id,
                    revenue_flow_id: row.revenue_flow_id,
                    company_id: row.customer_company_id,
                    company_name: row.customer_company_name,
                  };
                  const detail = row.gather_way_detail;
                  if (detail) {
                    data.order_date = detail.order_date;
                    data.order_wangwang_id = detail.order_wangwang_id;
                    data.task_id = detail.task_id;
                    data.pay_company_name = detail.pay_company_name;
                  }
                  if (row.gather_certificate_pic) {
                    const reg = new RegExp('\\/([^\\/]+)$');
                    const match = reg.exec(row.gather_certificate_pic);
                    let name;
                    if (match) {
                      name = match[1];
                    }
                    data.gather_certificate_pic = {
                      name: name,
                      value: row.gather_certificate_pic,
                    };
                  }
                  if (row.contract_id && row.contract_info) {
                    data.search_contract_list_value = [
                      {
                        label:
                          row.contract_info.company_name +
                          '  (' +
                          row.contract_info.sign_type_name +
                          ')  ' +
                          row.contract_info.coop_start_date +
                          '-' +
                          row.contract_info.coop_end_date,
                        value: row.contract_id,
                      },
                    ];
                  }
                  if (row.invoice_apply_id) {
                    data.search_invoice_apply_value = [
                      {
                        label: row.approval_uid,
                        value: row.invoice_apply_id,
                      },
                    ];
                  }
                  const isMcn = ctx.root.$route.name === 'CommonBusinessProjectDetail'; // 创新项目
                  const isBrand = ctx.root.$route.name === 'SSLiveProjectDetail'; // 品牌中心业务
                  const isMarketing = ctx.root.$route.name === 'MarketingProjectDetail'; // 整合营销业务
                  achievementRef.value?.show(data, {
                    isMcn,
                    isBrand,
                    isMarketing,
                    isLocalLife: isFromLocalLife.value,
                    isSupplyChain: isFromSupplyChain.value,
                  });
                }}
              >
                编辑
              </tg-button>,
            );
          }
          if (btn_enabled && row.gather_type !== 5) {
            btnNodes.push(
              <a key="b" onClick={() => deleteAchievement(row)}>
                删除
              </a>,
            );
          }
        } else {
          if (
            ReverseStatus.wait_confirm === row.reverse_status ||
            ReverseStatus.confirmed === row.reverse_status
          ) {
            btnNodes.push(
              <a
                on={{
                  click: () => {
                    onReverseReasonViewBtnClick(row);
                  },
                }}
              >
                查看
              </a>,
            );
          } else {
            if (hasPermission.value || add_by_self(row)) {
              btnNodes.push(
                <a onClick={() => deleteAchievement(row, '是否删除该冲销单？')}>删除</a>,
              );
              btnNodes.push(
                <a
                  on={{
                    click: () => {
                      reverseOrderDialogRef.value?.open(
                        msg => reverseAgain(row, msg),
                        row.reverse_reason,
                      );
                    },
                  }}
                >
                  重新提交
                </a>,
              );
            }
            btnNodes.push(
              <a
                on={{
                  click: () => {
                    onReverseBackReasonViewBtnClick(row);
                  },
                }}
              >
                退回原因
              </a>,
            );
          }
        }
        if (is_btn_refund && !row.reverse_id) {
          btnNodes.push(
            <a
              on={{
                click: () => {
                  onRefundViewBtnClick(row);
                },
              }}
            >
              退款
            </a>,
          );
        }
        if (
          row.is_gather &&
          Number(row.gather_type) === 5 &&
          !row.reverse_id &&
          !row.reversed_id &&
          row.refund_write_off_status !== 2
        ) {
          btnNodes.push(
            <tg-button
              type="link"
              onclick={() => {
                refundWriteOffAmount.value = new Decimal(row.gather_amount ? row.gather_amount : 0)
                  .sub(new Decimal(row.refund_write_off_amount ? row.refund_write_off_amount : 0))
                  .toNumber();
                refundWriteOffId.value = row.refund_cost_id;
                refundWriteOffAchievementId.value = row.achievement_id;
                refundWriteOffVisible.value = true;
              }}
            >
              核销
            </tg-button>,
          );
        }

        return <div class="operation">{btnNodes}</div>;
      },
    },
  ]);

  const loadData = async (payload: AchievementQueryParams) => {
    loading.value = true;
    const { data: response } = await GetAchievementList(payload);
    loading.value = false;

    if (response.success) {
      data.value = response.data.data;
      total.value = response.data.total;
      statInfo.value = response.data.stat_info;
    } else {
      data.value = [];
      total.value = 0;
      statInfo.value.confirmed_gather_amount = 0;
      statInfo.value.total_gather_amount = 0;
      statInfo.value.wait_gather_amount = 0;
      statInfo.value.write_off_amount = 0;
      statInfo.value.not_write_off_amount = 0;
    }
  };
  const old_is_hide_reverse_data = ref<number | undefined>(1);
  const reload = async (is_hide_reverse_data: number | undefined, clean = true) => {
    if (clean) {
      queryForm.value.page_num = 1;
    }
    old_is_hide_reverse_data.value = is_hide_reverse_data;
    const payload = {
      // ...queryForm.value,
      cooperation_id: parseInt(ctx.root.$route.params.id, 10),
      is_hide_reverse_data: is_hide_reverse_data,
    };

    await loadData(payload);
  };

  onMounted(() => {
    reload(old_is_hide_reverse_data.value);
  });

  // 分页 - 页长
  const onPageSizeChange = (pageSize: number) => {
    queryForm.value.num = pageSize;
    reload(old_is_hide_reverse_data.value);
  };

  // 分页 - 当前页
  const onPageChange = (page: number) => {
    queryForm.value.page_num = page;
    reload(old_is_hide_reverse_data.value, false);
  };

  /** 显示发票详情中的发票图片 */
  const showInvoicePic = (url: string) => {
    invoice.showDetail(url);
  };
  const onInvoicingDetailClose = () => {
    console.log('关闭');
  };
  const triggerReload = () => {
    reload(old_is_hide_reverse_data.value);
  };
  return {
    hasPermission,
    project,
    triggerReload,
    onInvoicingDetailClose,
    loading,
    data,
    statInfo,
    total,
    columns,
    reload,
    moneyFormat,
    deleteLoading,
    onPageSizeChange,
    onPageChange,
    queryForm,
    checkedRowIndex,
    clearCheckedRowIndex,
    invoiceDialogVisible,
    closeInvoiceDialog,
    invoices,
    showInvoicePic,
    dialogRef,
    firstStepRef,
    reverseOrderDialogRef,
    reverseLoading,
    reverseAgainLoading,
    reasonDialogVisible,
    reason,
    reasonDialogTitle,
    onReasonDialogClose,
    refundDialogVisible,
    onRefundDialogClose,
    refundRow,
    refundWriteOffAmount,
    refundWriteOffId,
    refundWriteOffAchievementId,
    refundWriteOffVisible,
    achievementRef,
  };
};

export default useList;
