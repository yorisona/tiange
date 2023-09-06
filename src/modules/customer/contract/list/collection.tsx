import {
  defineComponent,
  ref,
  UnwrapRef,
  h,
  provide,
  computed,
  reactive,
  inject,
} from '@vue/composition-api';
import achievement from '@/modules/live/project/dialog/achievement.vue';
import invoicelist from '@/modules/live/project/dialog/invoice.list.vue';
import dialogContact from './dialog.contract.vue';
import addContract from '@/modules/customer/contract/form/contract.vue';
import addSupplierContract from '@/views/medium/components/addContract.vue';
// 合同模板下载
import templateDownContractDialog from '@/modules/legal/contract/dialog/templateDownContractDialog.vue';
// 客户合同-  补充协议
import AddAttachmentDialog from '@/modules/customer/contract/form/annex.vue';
import AddAttachmentDialogSupplier from '@/views/medium/components/addAttachmentDialog.vue';
// 客户合同 - 结算单
import AddStatement from '@/modules/customer/contract/form/newStatement.vue';
import AddSettlementDialog from '@/views/medium/components/newAddSettlementDialog.vue';
import use from './use';
import { useRouter } from '@/use/vue-router';
import { Contract, SignTypeMap } from '@/types/tiange/contract';
import AnnexDialog from '@/modules/customer/contract/annex.dialog.vue';
import { DefText } from '@/components/DefText/dt';
import { ApprovalStatus, ApprovalStatusMap } from '@/types/tiange/system';
import ApproveProgress from '@/views/customer/components/approveProgress.vue';
import { useOAFlows } from '@/modules/customer/contract/useOAFlowsInList';
import { usePermission } from '@/use/permission';
import { RouterNameProjectManage } from '@/const/router';

import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import useAutoTableHeightInCard from '@/use/autoTableAHeightInCard';
import { get_limited_length_string } from '@/utils/string';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { max_length_of_column } from '@/utils/table';
import type { TableColumn } from '@/types/vendor/column';
import { useDialog } from '@/use/dialog';
import dialogContactTemplate from './dialog.contract.template.vue';
import supplierAgreementDialog from '@/modules/customer/contract/form/supplierAgreementDialog.vue';
import clientAgreementDialog from '@/modules/customer/contract/form/clientAgreementDialog.vue';
import relatedPublicContract from '@/modules/customer/contract/form/relatedPublicContract/index.vue';
import { VNode } from 'vue/types/umd';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export const removeZeroKolCommission = (commission: string | undefined) => {
  const contractCommissionArr = commission?.split('+') ?? [];
  const contractCommissionStr = contractCommissionArr
    .filter(el => {
      if (el.indexOf('%(主播)') >= 0) {
        const contractCommission = +el.split('%(')[0];
        return contractCommission > 0;
      }
      return true;
    })
    .join('+');
  return contractCommissionStr.replace(/\+$|^\+/g, '');
};

const getFilename = (url = '') =>
  String(url || '')
    .split('/')
    .pop();
const getAnnexList = (contract: Contract | undefined) => {
  if (contract === undefined) {
    return [];
  }
  return [
    /** 合同附件 */
    ...contract.contract_detail.attachment_url_list.map(el => ({
      ...el,
      status: contract.contract_info.contract_status,
      status_str: contract.contract_info.contract_status_str,
      type: '合同附件',
    })),
    /** 补充协议 */
    ...contract.contract_annex_info
      .map(el =>
        el.attachment_url_list.map(url => ({
          file_name: getFilename(url),
          url,
          status: el.contract_annex_status,
          status_str: el.contract_annex_status_str,
          type: '补充协议',
        })),
      )
      .flat(),
    /** 合同扫描件 */
    ...contract.contract_detail.contract_scan_urls.map(el => ({
      ...el,
      status: contract.contract_info.contract_status,
      status_str: contract.contract_info.contract_status_str,
      type: '合同扫描件',
    })),
    /** 结算单 */
    ...contract.contract_statements_list
      .map(el =>
        el.attachment_url_list.map(url => ({
          file_name: getFilename(url),
          url,
          status: el.contract_statements_status,
          status_str: el.contract_statements_status_str,
          type: '结算单',
        })),
      )
      .flat(),
  ];
};
export default defineComponent({
  components: {
    AddAttachmentDialog,
    AddAttachmentDialogSupplier,
    AddSettlementDialog,
    AddStatement,
    achievement,
    invoicelist,
    dialogContact,
    addContract,
    addSupplierContract,
    AnnexDialog,
    templateDownContractDialog,
    supplierAgreementDialog,
    clientAgreementDialog,
  },
  setup(props, ctx) {
    const isHideInvalid = ref(true);
    const company_name = ref('');
    const router = useRouter();
    const {
      isFromMarketing,
      isFromLive,
      isFromLocalLife,
      isFromLiveDouyin,
      isFromCommon,
      isFromSupplyChain,
    } = useProjectBaseInfo();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    /** 本地生活 */
    if (isFromLocalLife.value || isFromLiveDouyin.value) {
      const routes = [
        {
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.project.list
            : RouterNameProjectManage.live.project.list,
          title: '项目管理',
        },
        {
          // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.detail.info
            : RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: project_id,
            tab: 'projectInfo',
            liveType: 'calendar',
          },
          title: '项目详情',
        },
        {
          path: '',
          title: '合同协议',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(RIGHT_CODE.marketing_project_contract_view);
      const canCreateContract = HasPermission(RIGHT_CODE.marketing_project_documentary_create);
      const canCreateAnnex = HasPermission(RIGHT_CODE.marketing_project_contract_annex_create);
      const canCreateStatement = HasPermission(
        RIGHT_CODE.marketing_project_contract_statement_create,
      );
      const canLiveViewList = HasPermission(RIGHT_CODE.live_project_contract_view);
      const canLiveCreateContract = HasPermission(RIGHT_CODE.live_project_contract_create);
      const canLiveCreateAnnex = HasPermission(RIGHT_CODE.live_project_annex_create);
      const canLiveCreateStatement = HasPermission(RIGHT_CODE.live_project_statements_create);
      const canLocalLifeViewList = HasPermission(RIGHT_CODE.local_life_project_contract_view);
      const canLocalLifeCreateContract = HasPermission(
        RIGHT_CODE.local_life_project_contract_create,
      );
      const canLocalLifeCreateAnnex = HasPermission(RIGHT_CODE.local_life_project_annex_create);
      const canLocalLifeCreateStatement = HasPermission(
        RIGHT_CODE.local_life_project_statements_create,
      );
      // 供应链
      const canSupplyViewList = HasPermission(RIGHT_CODE.supply_view_contract);
      const canSupplyCreateContract = HasPermission(RIGHT_CODE.supply_edit_contract);
      const canSupplyCreateAnnex = HasPermission(RIGHT_CODE.supply_project_annex_create);
      const canSupplyCreateStatement = HasPermission(RIGHT_CODE.supply_edit_contract_settlement);
      const canCommonViewList = HasPermission(RIGHT_CODE.common_business_project_contract_view);
      const canCommonCreateContract = HasPermission(
        RIGHT_CODE.common_business_project_contract_create,
      );
      const canCommonCreateAnnex = HasPermission(
        RIGHT_CODE.common_business_project_contract_annex_create,
      );
      const canCommonCreateStatement = HasPermission(
        RIGHT_CODE.common_business_project_contract_statement_create,
      );
      return {
        canViewList,
        canCreateContract,
        canCreateAnnex,
        canCreateStatement,
        canLiveViewList,
        canLiveCreateContract,
        canLiveCreateAnnex,
        canLiveCreateStatement,
        canLocalLifeViewList,
        canLocalLifeCreateContract,
        canLocalLifeCreateAnnex,
        canLocalLifeCreateStatement,
        canCommonViewList,
        canCommonCreateContract,
        canCommonCreateAnnex,
        canCommonCreateStatement,
        canSupplyViewList,
        canSupplyCreateContract,
        canSupplyCreateStatement,
        canSupplyCreateAnnex,
      };
    });

    const canViewList = computed(() => {
      return isFromSupplyChain.value
        ? Permission.value.canSupplyViewList
        : isFromMarketing.value
        ? Permission.value.canViewList
        : isFromLive.value || isFromLiveDouyin.value
        ? Permission.value.canLiveViewList
        : isFromLocalLife.value
        ? Permission.value.canLocalLifeViewList
        : Permission.value.canCommonViewList;
    });
    const canCreateContract = computed(() => {
      return isFromSupplyChain.value
        ? Permission.value.canSupplyCreateContract
        : isFromMarketing.value
        ? Permission.value.canCreateContract
        : isFromLive.value || isFromLiveDouyin.value
        ? Permission.value.canLiveCreateContract
        : isFromLocalLife.value
        ? Permission.value.canLocalLifeCreateContract
        : Permission.value.canCommonCreateContract;
    });
    const canCreateAnnex = computed(() => {
      return isFromSupplyChain.value
        ? Permission.value.canSupplyCreateAnnex
        : isFromMarketing.value
        ? Permission.value.canCreateAnnex
        : isFromLive.value || isFromLiveDouyin.value
        ? Permission.value.canLiveCreateAnnex
        : isFromLocalLife.value
        ? Permission.value.canLocalLifeCreateAnnex
        : Permission.value.canCommonCreateAnnex;
    });
    const canCreateStatement = computed(() => {
      return isFromSupplyChain.value
        ? Permission.value.canSupplyCreateStatement
        : isFromMarketing.value
        ? Permission.value.canCreateStatement
        : isFromLive.value || isFromLiveDouyin.value
        ? Permission.value.canLiveCreateStatement
        : isFromLocalLife.value
        ? Permission.value.canLocalLifeCreateStatement
        : Permission.value.canCommonCreateStatement;
    });
    const visibleAchievement = ref(false);
    const visibleInvoiceList = ref(false);
    const addContractRef = ref<UnwrapRef<{ show: (arg: any) => void }> | null>(null);
    const addTemplateContractRef = ref<UnwrapRef<{ show: (arg?: any) => void }> | null>(null);
    const addsupplierTemplateContractRef = ref<UnwrapRef<{ show: () => void }> | null>(null);
    const addclientTemplateContractRef = ref<UnwrapRef<{ show: () => void }> | null>(null);
    const addCustomerContractRef = ref<UnwrapRef<{ show: () => void }> | null>(null);
    const addSupplierContractRef = ref<UnwrapRef<{ show: () => void }> | null>(null);
    const AddStatementVisible = ref(false);
    const addAttachmentDialogRef = ref<UnwrapRef<{ show: () => void }> | null>(null);
    const addSettlementDialog = ref<UnwrapRef<{ show: () => void }> | null>(null);
    const addAttachmentDialog = ref<UnwrapRef<{ show: () => void }> | null>(null);
    const permission = usePermission();
    const typestr = computed(() => {
      return isFromMarketing.value
        ? '1'
        : isFromLive.value || isFromLiveDouyin.value
        ? '2'
        : isFromLocalLife.value
        ? '4'
        : isFromSupplyChain.value
        ? '5'
        : '3';
    });
    const contract = use.useContract(typestr.value, ctx);
    // 附件
    const annexDialogVisible = ref(false);
    const checkedRow = ref<Contract | undefined>(undefined);
    const annexList = computed(() => {
      return getAnnexList(checkedRow.value);
    });
    provide('annex-data', annexList);
    provide('annex-dialog-visible', annexDialogVisible);
    provide('project_add_id', router.currentRoute.params.id);
    // * 注入null防止报错
    provide('contract', ref(undefined));
    const project = inject<any>('project');

    // 合同状态
    const oaFlows = reactive(useOAFlows('contract', true));
    const payload = computed(() => {
      const tempPayload = isFromMarketing.value
        ? { cooperation_id: router.currentRoute.params.id }
        : isFromLive.value ||
          isFromLiveDouyin.value ||
          isFromLocalLife.value ||
          isFromSupplyChain.value
        ? { project_id: router.currentRoute.params.id }
        : { project_id: router.currentRoute.params.id };
      return {
        ...tempPayload,
        company_name: company_name.value,
        is_hide_invalid_data: isHideInvalid.value ? 1 : undefined,
        is_order_by_relation: true,
      };
    });
    contract.query(payload.value);

    // 自适应表格高度部分
    const buttonLineHeight = 32;
    const paginationLineHeight = 0;
    const rectPadding = 0;
    const otherHeight = 31;

    const topCardHeight = ref(251);
    // const onTopCardRectUpdate = (rect: DOMRect) => {
    //   topCardHeight.value = rect.height;
    // };

    const tableHeightLogic = useAutoTableHeightInCard({
      compensation: computed(
        () => buttonLineHeight + paginationLineHeight + rectPadding + otherHeight,
      ),
      fixedBlockHeightRefs: [topCardHeight],
      tableMinHeight: 100,
    });

    /** 公司名称渲染函数 */
    const company_name_render = <T extends boolean>(row: Contract, text_only: T) => {
      const data = row.contract_info.company_name || row.contract_info.customer_name || '--';
      const { is_folded, folded_text } = get_limited_length_string(data, 12);

      return text_only || !is_folded
        ? folded_text
        : (h(
            'el-popover',
            {
              props: {
                placement: 'right',
                trigger: 'hover',
                content: data,
              },
            },
            [h('div', { slot: 'reference' }, [folded_text])],
          ) as TableColumnRenderReturn<T>);
    };
    /** 公司名称最大宽度 */
    const company_name_max_length = max_length_of_column(
      contract.data,
      '公司名称',
      company_name_render,
    );
    const columns = computed<TableColumn<Contract>[]>(() => [
      {
        label: '合同类别',
        align: 'center',
        minWidth: 94,
        formatter: row =>
          row.contract_info.contract_type === 1 ||
          row.contract_info.contract_type === 2 ||
          row.contract_info.contract_type === 5
            ? '客户合同'
            : '供应商合同',
      },
      {
        label: '签约类型',
        minWidth: 94,
        align: 'center',
        formatter: (row: any) => SignTypeMap.get(row?.contract_info?.sign_type) || '--',
      },
      {
        label: '合同编号',
        minWidth: 190,
        formatter: (row: any) => {
          const {
            contract_info: { contract_uid },
          } = row;

          // const refNode = h('div', {}, [h('span', { class: 'hover-link' }, [contract_uid])]);
          const refNode = h('div', {}, [h('span', [contract_uid])]);
          return refNode;
        },
      },
      {
        label: '公司名称',
        minWidth: company_name_max_length.value,
        formatter: row => company_name_render(row, false),
      },
      {
        label: '费用类型',
        width: 130,
        align: 'center',
        formatter: row => row.getMoneytype ?? DefText(),
      },
      {
        label: '合同金额',
        align: 'left',
        minWidth: 200,
        formatter: row => {
          const arr = [];
          if (row.contractMoney) {
            arr.push(
              h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: 'var(--text-third-color)',
                    },
                  },
                  [row.contractCommission ? '服务费：' : '固定服务费：'],
                ),
                h(
                  'span',
                  {
                    style: {
                      color: 'var(--text-color)',
                    },
                  },
                  [row.contractMoney ?? '--'],
                ),
              ]),
            );
          }
          if (row.contractCommission) {
            arr.push(
              h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: 'var(--text-third-color)',
                    },
                  },
                  ['佣金：'],
                ),
                h(
                  'span',
                  {
                    style: {
                      color: 'var(--text-color)',
                    },
                  },
                  [removeZeroKolCommission(row.contractCommission) || '--'],
                ),
              ]),
            );
          }
          if (row.contractOtherMoney) {
            arr.push(
              h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: 'var(--text-color)',
                    },
                  },
                  [row.contractOtherMoney ?? '--'],
                ),
              ]),
            );
          }
          return arr.length > 0 ? arr : '--';
        },
      },
      {
        label: '合作期限',
        minWidth: 166,
        align: 'center',
        formatter: ({ contract_info: { coop_start_date, coop_end_date } }) => {
          if (coop_start_date !== null && coop_end_date === null) {
            coop_end_date = '长期有效';
          }
          const arr: any = [coop_start_date, coop_end_date];
          const timestr =
            arr
              .filter((el: any) => el !== null)
              .join('～')
              .replace(/-/g, '.') || DefText();
          return timestr;
        },
      },
      {
        label: '关联合同数',
        minWidth: 100,
        align: 'center',
        formatter: row => {
          const labelstr: any = row.associate_contract_count ?? DefText();
          const nodes: VNode[] = [];
          let statusNode: VNode | undefined = undefined;
          statusNode = h('p', { class: 'hover-link empty-data-line' }, [labelstr]);
          nodes.push(
            h(
              'div',
              {
                class: 'line-info',
                on: {
                  click: (event: MouseEvent) => {
                    if (row.associate_contracts && row.associate_contracts.length > 0) {
                      const arrstr: string = row.associate_contracts.join('|');
                      const payload: any = { contract_uid: arrstr, is_order_by_relation: true };
                      contract.query(payload);
                    }
                    event.stopPropagation();
                  },
                },
              },
              [statusNode],
            ),
          );
          return nodes;
        },
      },
      {
        label: '创建人/日期',
        minWidth: 118,
        formatter: row => [
          h(
            'div',
            {
              style: {
                paddingLeft: '15px',
              },
            },
            [row.project_relation?.add_by_name],
          ),
          h(
            'div',
            {
              style: {
                paddingLeft: '15px',
                color: '#a4b2c2',
              },
            },
            [
              row.project_relation?.create_time_str?.split(' ')?.[0].replace(/-/g, '.') ??
                DefText(),
            ],
          ),
        ],
        // property: 'job_name',
        // minWidth: max_length_of_column(list, '岗位名称', job_name_render).value,
        // formatter: job_name_render,
      },
      {
        label: '审批状态',
        align: 'center',
        minWidth: 90,
        formatter: row => {
          const IsRecycledNode =
            row.project_relation?.relation_status === ApprovalStatus.Normal
              ? row.contract_info.is_recycled === 1
                ? h('div', { style: { marginTop: '2px' } }, [
                    h(
                      'span',
                      {
                        class: ['contract-recycled-tag', 'contract-recycled-tag-yes'],
                      },
                      ['已收回'],
                    ),
                  ])
                : h('div', { style: { marginTop: '2px' } }, [
                    h(
                      'span',
                      {
                        class: ['contract-recycled-tag', 'contract-recycled-tag-no'],
                      },
                      ['未收回'],
                    ),
                  ])
              : '';

          const contract_status_str =
            ApprovalStatusMap.get(row.project_relation?.relation_status) || DefText();

          const status_str = (slot = false) =>
            h(
              'span',
              {
                class: `fg-${ApprovalStatus[row.project_relation?.relation_status]}`.toLowerCase(),
                ...(slot ? { slot: 'reference' } : {}),
              },
              [contract_status_str],
            );

          if (
            ![ApprovalStatus.Failure, ApprovalStatus.Processing].includes(
              row.project_relation?.relation_status,
            )
          ) {
            return h('div', [status_str(false), ' ', IsRecycledNode]);
          }

          // * OA 审批流
          if (row.contract_info.feishu_request_id || row.contract_info.oa_request_id) {
            return h(
              'div',
              {
                on: {
                  click: (event: MouseEvent) => {
                    event.stopPropagation();
                  },
                },
              },
              [
                h(
                  'el-popover',
                  {
                    props: {
                      placement: 'left-end',
                      width: 234,
                      trigger: 'hover',
                      popperClass: 'oa-approve-progress-popper',
                      popperOptions: { boundariesElement: 'body', gpuAcceleration: false },
                    },
                    on: {
                      show: () => {
                        oaFlows.onFlowsShow(
                          row.contract_info.id,
                          project?.value?.project_uid || project?.value?.cooperation_uid,
                        );
                      },
                      hide: () => {
                        oaFlows.onFlowsHide();
                      },
                    },
                  },
                  [
                    status_str(true),
                    h('div', { style: { 'min-height': '160px' } }, [
                      ...(oaFlows.flowsLoading
                        ? [h('div', { style: { padding: '10px 20px' } }, ['正在查询进度...'])]
                        : oaFlows.flowsError !== ''
                        ? [oaFlows.flowsError]
                        : [oaFlows.oaflowsRender(row.project_relation?.relation_status)]),
                    ]),
                  ],
                ),
              ],
            );
          }

          const If =
            row.contract_work_infos.length > 0 &&
            [ApprovalStatus.Processing, ApprovalStatus.Failure].includes(
              row.project_relation?.relation_status,
            );

          return h(
            'div',
            If
              ? [
                  h(
                    'el-popover',
                    {
                      props: {
                        placement: 'left-end',
                        width: '246',
                        trigger: 'hover',
                        popperClass: 'approve-progress-popper',
                      },
                    },
                    [
                      status_str(true),
                      h(ApproveProgress, {
                        props: {
                          workInfos: row.contract_work_infos,
                          contractInfo: row,
                        },
                      }),
                    ],
                  ),
                ]
              : [status_str()],
          );
        },
        // property: 'job_name',
        // minWidth: max_length_of_column(list, '岗位名称', job_name_render).value,
        // formatter: job_name_render,
      },
      {
        label: '合同附件',
        minWidth: 88,
        align: 'center',
        formatter: row => {
          const relationType = row.project_relation?.relation_type;
          const shouldCheck =
            (relationType === 2 &&
              row.project_relation?.relation_status === ApprovalStatus.Normal) ||
            relationType === 1;
          return getAnnexList(row).length > 0 && shouldCheck
            ? h(
                'span',
                {
                  style: {
                    color: 'var(--theme-color)',
                  },
                  on: {
                    click: (event: MouseEvent) => {
                      event.stopPropagation();

                      checkedRow.value = row;
                      annexDialogVisible.value = true;
                    },
                  },
                },
                ['查看'],
              )
            : DefText();
        },
        // property: 'job_name',
        // minWidth: max_length_of_column(list, '岗位名称', job_name_render).value,
        // formatter: job_name_render,
      },
    ]);

    // 客户/供应商/ 选择器
    const dialogContactHook = useDialog({
      component: dialogContactTemplate,
      title: '新增合同',
      width: '460px',
      footer: false,
      on: {
        close: (value: number) => {
          if (value === undefined) return;
          switch (value) {
            // 这里是模板合同
            case 1:
              addclientTemplateContractRef.value?.show();
              break;
            case 2:
              addsupplierTemplateContractRef.value?.show();
              break;
          }
        },
      },
    });

    const dialogRelatedPublicContract = useDialog({
      component: relatedPublicContract,
      title: '选择已有合同',
      width: '920px',
      okText: '提交审批',
      on: {
        submit: () => {
          // postVerify_contract_scan(v);
          contract.reload();
        },
      },
    });

    return {
      isHideInvalid,
      payload,
      company_name,
      typestr,
      canViewList,
      canCreateContract,
      canCreateAnnex,
      canCreateStatement,
      isFromMarketing,
      isFromLive,
      isFromLiveDouyin,
      isFromLocalLife,
      isFromSupplyChain,
      isFromCommon,
      dialogContactHook,
      Permission,
      permission,
      router,
      addSettlementDialog,
      addAttachmentDialog,
      AddStatementVisible,
      addAttachmentDialogRef,
      checkedRow,
      ...contract,
      visibleAchievement,
      visibleInvoiceList,
      addCustomerContractRef,
      addSupplierContractRef,
      addContractRef,
      addTemplateContractRef,
      addsupplierTemplateContractRef,
      addclientTemplateContractRef,
      dialogRelatedPublicContract,
      annexDialogVisible,
      oaFlows,
      ...tableHeightLogic,
      columns,
      project,
    };
  },
  render() {
    // const rectUpdate = {
    //   on: {
    //     ['rect:update']: this.onRectUpdate,
    //   },
    //   style: {
    //     ...this.cardProps,
    //   },
    // };
    return (
      <tg-card class="project-collection flex-auto tg-marketing-contract">
        <div class="header-div">
          <div class="search-div">
            <span>公司名称：</span>
            <el-input
              clearable
              size="mini"
              v-key-enter={() => {
                this.query(this.payload);
              }}
              placeholder="请输入公司名称"
              vModel_trim={this.company_name}
              style="width:200px"
              show-word-limit={true}
            />
            <tg-button
              class="mgl-16"
              type="primary"
              on-click={() => {
                this.query(this.payload);
              }}
            >
              查询
            </tg-button>
            <tg-button
              class="mgl-8"
              on-click={() => {
                this.company_name = '';
                this.query(this.payload);
              }}
            >
              重置
            </tg-button>
          </div>
          {this.canCreateContract || this.canCreateStatement || this.canCreateAnnex ? (
            <div
              class="btns-line"
              style={{
                'min-width': this.isFromMarketing ? '410px' : '312px',
              }}
            >
              {this.canCreateContract ? (
                <tg-button
                  type="primary"
                  // icon="ico-btn-add"
                  onclick={() => {
                    this.addContractRef?.show({
                      title: '新增合同协议',
                      items: [
                        { name: '客户合同', id: 1 },
                        { name: '供应商合同', id: 2 },
                      ],
                    });
                  }}
                >
                  新增合同协议
                </tg-button>
              ) : (
                ''
              )}
              <tg-button
                type="primary"
                onclick={() => {
                  this.dialogRelatedPublicContract.show({
                    type: this.typestr,
                    project_uid: this.project?.project_uid || this.project?.cooperation_uid,
                  });
                }}
              >
                选择已有合同
              </tg-button>
              {this.canCreateStatement && this.isFromMarketing ? (
                <tg-button
                  // icon="ico-btn-add"
                  onclick={() => {
                    this.addContractRef?.show({
                      title: '新增结算单',
                      items: [
                        { name: '客户结算单', id: 3 },
                        { name: '供应商结算单', id: 4 },
                      ],
                    });
                  }}
                >
                  新增结算单
                </tg-button>
              ) : (
                ''
              )}
              {/*{this.canCreateAnnex ? (
              <tg-button
                icon="ico-btn-add"
                onclick={() => {
                  this.addContractRef?.show({
                    title: '新增补充协议',
                    items: [
                      { name: '客户补充协议', id: 5 },
                      { name: '供应商补充协议', id: 6 },
                    ],
                  });
                }}
              >
                新增补充协议
              </tg-button>
            ) : (
              ''
            )}*/}
              {this.canCreateContract ? (
                <tg-button
                  onclick={() => {
                    this.addTemplateContractRef?.show();
                  }}
                >
                  合同模板下载
                </tg-button>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
          <div class="reverse-div">
            <el-checkbox
              on-change={() => {
                this.query(this.payload);
              }}
              v-model={this.isHideInvalid}
              size="mini"
            >
              <span>隐藏无效记录</span>
            </el-checkbox>
          </div>
        </div>
        {this.canViewList ? (
          <el-table
            v-loading={this.loading}
            stripe
            border
            // height={this.tableProps.height}
            height={`calc(100% - 70px - 24px)`}
            data={this.data}
            // header-cell-style={{ lineHeight: '42px', height: '42px' }}
            cell-style={({ row }: { row: any }) => {
              const project_relation = row.project_relation;
              if (
                project_relation?.relation_type === 2 &&
                project_relation?.relation_status !== ApprovalStatus.Normal
              ) {
                return;
              }
              return { cursor: 'pointer' };
            }}
            on-row-click={(row: any) => {
              const project_relation = row.project_relation;
              if (
                project_relation.relation_type === 2 &&
                project_relation.relation_status !== ApprovalStatus.Normal
              ) {
                return;
              }
              if (
                row.contract_info.contract_type === 1 ||
                row.contract_info.contract_type === 2 ||
                row.contract_info.contract_type === 5
              ) {
                // 客户合同
                // TODO: 5.30项目管理-合同协议跳转
                const detailTemplate = this.isFromLiveDouyin
                  ? RouterNameProjectManage.tiktokLive.contract.customer.detailTemplate
                  : this.isFromSupplyChain
                  ? RouterNameProjectManage.supplyChain.contract.customer.detailTemplate
                  : this.isFromMarketing
                  ? RouterNameProjectManage.marketing.contract.customer.detailTemplate
                  : this.isFromLive || this.isFromLiveDouyin
                  ? RouterNameProjectManage.live.contract.customer.detailTemplate
                  : this.isFromLocalLife
                  ? RouterNameProjectManage.localLife.contract.customer.detailTemplate
                  : RouterNameProjectManage.commonBusiness.contract.customer.detailTemplate;
                const detail = this.isFromLiveDouyin
                  ? RouterNameProjectManage.tiktokLive.contract.customer.detail
                  : this.isFromSupplyChain
                  ? RouterNameProjectManage.supplyChain.contract.customer.detail
                  : this.isFromMarketing
                  ? RouterNameProjectManage.marketing.contract.customer.detail
                  : this.isFromLive || this.isFromLiveDouyin
                  ? RouterNameProjectManage.live.contract.customer.detail
                  : this.isFromLocalLife
                  ? RouterNameProjectManage.localLife.contract.customer.detail
                  : RouterNameProjectManage.commonBusiness.contract.customer.detail;
                this.router.push({
                  name: row.template_info ? detailTemplate : detail,
                  params: {
                    id: `${row.contract_info.id}`,
                    project_id: this.router?.currentRoute.params.id,
                  },
                  query: {
                    parent_id: this.router?.currentRoute.params.id,
                    parent_tab: this.router?.currentRoute.params.tab,
                  },
                });
              } else if (
                row.contract_info.contract_type === 3 ||
                row.contract_info.contract_type === 4 ||
                row.contract_info.contract_type === 6
              ) {
                // 供应商合同
                const detailTemplate = this.isFromLiveDouyin
                  ? RouterNameProjectManage.tiktokLive.contract.supplier.detailTemplate
                  : this.isFromSupplyChain
                  ? RouterNameProjectManage.supplyChain.contract.supplier.detailTemplate
                  : this.isFromMarketing
                  ? RouterNameProjectManage.marketing.contract.supplier.detailTemplate
                  : this.isFromLive || this.isFromLiveDouyin
                  ? RouterNameProjectManage.live.contract.supplier.detailTemplate
                  : this.isFromLocalLife
                  ? RouterNameProjectManage.localLife.contract.supplier.detailTemplate
                  : RouterNameProjectManage.commonBusiness.contract.supplier.detailTemplate;
                const detail = this.isFromLiveDouyin
                  ? RouterNameProjectManage.tiktokLive.contract.supplier.detail
                  : this.isFromSupplyChain
                  ? RouterNameProjectManage.supplyChain.contract.supplier.detail
                  : this.isFromMarketing
                  ? RouterNameProjectManage.marketing.contract.supplier.detail
                  : this.isFromLive || this.isFromLiveDouyin
                  ? RouterNameProjectManage.live.contract.supplier.detail
                  : this.isFromLocalLife
                  ? RouterNameProjectManage.localLife.contract.supplier.detail
                  : RouterNameProjectManage.commonBusiness.contract.supplier.detail;
                this.router.push({
                  name: row.template_info ? detailTemplate : detail,
                  params: {
                    id: `${row.contract_info.id}`,
                    project_id: this.router?.currentRoute.params.id,
                  },
                  query: {
                    contract_type: row.contract_info.contract_type,
                    parent_id: this.router?.currentRoute.params.id,
                    parent_tab: this.router?.currentRoute.params.tab,
                  },
                });
              } else {
                // 主播
                const detailTemplate = this.isFromLiveDouyin
                  ? RouterNameProjectManage.tiktokLive.contract.anchor.detailTemplate
                  : this.isFromSupplyChain
                  ? RouterNameProjectManage.supplyChain.contract.anchor.detailTemplate
                  : this.isFromMarketing
                  ? RouterNameProjectManage.marketing.contract.anchor.detailTemplate
                  : this.isFromLive || this.isFromLiveDouyin
                  ? RouterNameProjectManage.live.contract.anchor.detailTemplate
                  : this.isFromLocalLife
                  ? RouterNameProjectManage.localLife.contract.anchor.detailTemplate
                  : RouterNameProjectManage.commonBusiness.contract.anchor.detailTemplate;
                this.router.push({
                  name: detailTemplate,
                  params: {
                    id: `${row.contract_info.id}`,
                    project_id: this.router?.currentRoute.params.id,
                  },
                  query: {
                    contract_type: row.contract_info.contract_type,
                    parent_id: this.router?.currentRoute.params.id,
                    parent_tab: this.router?.currentRoute.params.tab,
                  },
                });
              }
            }}
            scopedSlots={{
              empty: () => {
                return (
                  <div class="tg-page-empty">
                    <empty-common detail-text="暂未添加合同协议"></empty-common>
                  </div>
                );
              },
            }}
          >
            {this.columns.map((col, colIndex) => (
              <el-table-column props={{ ...col }} key={colIndex} />
            ))}
          </el-table>
        ) : (
          ''
        )}
        <achievement
          visible={this.visibleAchievement}
          onClose={() => {
            this.visibleAchievement = false;
          }}
        />
        <invoicelist
          visible={this.visibleInvoiceList}
          onClose={() => {
            this.visibleInvoiceList = false;
          }}
          onAdded={() => {
            //
          }}
        />
        <dialogContact
          ref="addContractRef"
          onClose={(value: undefined | { id: number }) => {
            if (value === undefined) return;
            switch (value.id) {
              // 合同
              case 1:
                this.addclientTemplateContractRef?.show();
                break;
              case 2:
                this.addsupplierTemplateContractRef?.show();
                break;
              // 结算单
              case 3:
                this.AddStatementVisible = true;
                break;
              case 4:
                this.addSettlementDialog?.show();
                break;
              // 补充协议
              case 5:
                this.addAttachmentDialogRef?.show();
                break;
              case 6:
                this.addAttachmentDialog?.show();
                break;
            }
          }}
        />
        <addContract ref="addCustomerContractRef" onAdded={() => this.reload()} />
        <addSupplierContract ref="addSupplierContractRef" onAdded={() => this.reload()} />
        <annexDialog on={{ 'dialog:close': () => (this.annexDialogVisible = false) }} />
        <addStatement
          visible={this.AddStatementVisible}
          on={{
            'dialog:close': () => {
              this.reload();
              this.AddStatementVisible = false;
            },
          }}
        />
        <addAttachmentDialog
          ref="addAttachmentDialogRef"
          onAdded={() => this.reload()}
          editData={{}}
        />
        <addAttachmentDialogSupplier ref="addAttachmentDialog" onAdded={() => this.reload()} />
        <addSettlementDialog
          ref="addSettlementDialog"
          onAdded={() => this.reload()}
          editData={{}}
        />
        <templateDownContractDialog
          type={
            this.isFromSupplyChain
              ? 'supply_chain'
              : this.isFromLocalLife
              ? 'local_life'
              : this.isFromMarketing
              ? 'marketing'
              : this.isFromCommon
              ? 'mcn'
              : 'live'
          }
          ref="addTemplateContractRef"
        />
        <supplierAgreementDialog
          ref="addsupplierTemplateContractRef"
          onAdded={() => this.reload()}
        />
        <clientAgreementDialog ref="addclientTemplateContractRef" onAdded={() => this.reload()} />
      </tg-card>
    );
  },
});
