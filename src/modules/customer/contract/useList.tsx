/**
 * 客户合同 - 列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 11:32:52
 */

import { GetContractList } from '@/services/contract';
import { Contract, ContractQueryParams, ContractStatementsStatus } from '@/types/tiange/contract';
import { computed, h, provide, Ref, ref, SetupContext } from '@vue/composition-api';
import { TableColumn, TableColumnFormatter } from '@/types/vendor/column';
import ApproveProgress from '@/views/customer/components/approveProgress.vue';
import { useOAFlows } from './useOAFlowsInList';
import { useRelatedContract } from './useContractLogic';
import { DefText } from '@/components/DefText/dt';
import { ApprovalStatus, ApprovalStatusMap, UserInfo } from '@/types/tiange/system';
import { MoneyAlign } from '@/use/money.align';
import { RIGHT_CODE } from '@/const/rightCode';
import { VNode } from 'vue/types/umd';

const isDev = process.env.NODE_ENV === 'development';

const getFilename = (url = '') =>
  String(url || '')
    .split('/')
    .pop();

type Col = TableColumn<Contract>;

interface ContractUseListOptions {
  indexFormatter: TableColumnFormatter<Contract>;
  currentUserInfo: Ref<UserInfo | null>;
  showAddContractCopyDialog: (row: Contract) => void;
  hasInvalidRight: (row: Contract) => boolean;
  invalidBtnDisabled: (row: Contract) => boolean;
  handleInvalidClick: (row: Contract) => Promise<void>;
}

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

export const useList = (ctx: SetupContext, options: ContractUseListOptions) => {
  /** 列表加载中 */
  const loading = ref(false);
  const total = ref(0);

  /** 客户合同数据列表 */
  const list = ref<Contract[]>([]);

  /** 加载数据 */
  const loadData = async (payload: ContractQueryParams) => {
    list.value = [];

    loading.value = true;
    const { data: response } = await GetContractList({ ...payload, business_type: 1 });
    loading.value = false;

    if (response.success) {
      list.value = response.data.data;
      total.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询合同失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

  const oaFlows = useOAFlows();

  // * 列表中实际获取关联合同相关逻辑
  const lazyUseRelatedContractLogic = (contract: Contract) => useRelatedContract(contract);

  // * 作废按钮是否可见 - 权限
  const hasInvalidRight = (row: Contract) =>
    row.contract_info.contract_status === 2 &&
    (options.currentUserInfo.value?.id === row.contract_info.manager_id ||
      options.currentUserInfo.value?.id === row.contract_info.add_by);

  // * 作废按钮是否不可用 - 数据状态
  // * 补充协议/结算单审批中，则合同不允许被删除
  const invalidBtnDisabled = (row: Contract) =>
    row.contract_annex_info.some(el => ApprovalStatus.Processing === el.contract_annex_status) ||
    row.contract_statements_list.some(
      el => el.contract_statements_status === ContractStatementsStatus.Processing,
    );

  const isOpColShow = ref(isDev);

  const moneyAlign = MoneyAlign.getColSetting();

  /** 列设置 */
  const baseColumns = ref<Col[]>([
    {
      type: 'index',
      label: '序号',
      width: 52,
      align: 'left',
      headerAlign: 'left',
      formatter: options.indexFormatter,
    },
    {
      prop: 'contract_info',
      label: '合同编号',
      align: 'left',
      headerAlign: 'left',
      minWidth: 208,
      formatter: (row, column, value, index) => {
        const {
          contract_info: { contract_uid },
        } = row;

        const refNode = h(
          'div',
          {
            ...(isDev ? { slot: 'reference' } : {}),
          },
          [h('span', { class: 'hover-link' }, [contract_uid])],
        );

        if (isDev) {
          // 开发模式追加更多信息展示
          const useRelatedContractLogic = lazyUseRelatedContractLogic(row);

          return h(
            'el-popover',
            {
              props: {
                placement: 'top',
                trigger: 'hover',
              },
            },
            [
              refNode,
              h('div', [
                ...(useRelatedContractLogic.has_related_contracts.value
                  ? [
                      h('div', [
                        h('span', [useRelatedContractLogic.related_contract_label.value]),
                        ...useRelatedContractLogic.related_contracts.value
                          .map(el => el.contract_uid)
                          .join('、'),
                      ]),
                    ]
                  : [h('div', ['没有关联合同'])]),
              ]),
            ],
          );
        }

        return refNode;
      },
    },
    {
      prop: 'contract_info',
      label: '客户名称',
      align: 'left',
      headerAlign: 'left',
      minWidth: 216,
      showOverflowTooltip: true,
      formatter: row =>
        row.contract_info.company_name || row.contract_info.customer_name || DefText(),
    },
    {
      label: '收费类型',
      width: 162,
      align: 'center',
      formatter: row => row.getMoneytype ?? DefText(),
    },
    {
      prop: 'contract_detail',
      label: '合同金额',
      minWidth: 140,
      ...moneyAlign,
      formatter: row => row.contract_detail.contract_amount ?? DefText(),
    },
    {
      prop: 'contract_info',
      label: '销售渠道',
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      formatter: row => {
        const sale_chance = row.contract_info.sale_chance;
        if (sale_chance.length > 1) {
          return h(
            'el-popover',
            {
              props: {
                popperClass: 'contract-sale-chance-popover',
                placement: 'top',
                width: '364',
                trigger: 'hover',
              },
            },
            [
              h('div', { class: 'contract-sale-chance-all' }, [
                h('tg-tag-group', {
                  props: {
                    theme: 'gray',
                    tags: sale_chance.map(({ sale_chance_name }) => sale_chance_name),
                  },
                }),
              ]),
              h('div', { class: 'contract-sale-chance', slot: 'reference' }, [
                sale_chance
                  .slice(0, 3)
                  .map(({ sale_chance_name }) => sale_chance_name)
                  .join('、'),
                sale_chance.length > 3 ? '...' : '',
              ]),
            ],
          );
        } else {
          return h('span', { class: ['one-sale-chance', 'size-medium', 'color-666'] }, [
            sale_chance?.[0]?.sale_chance_name ?? '',
          ]);
        }
      },
    },
    {
      label: '合作期限',
      align: 'left',
      headerAlign: 'left',
      width: 202,
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
      minWidth: 156,
      align: 'center',
      formatter: row => {
        const labelstr: any = row.associate_contract_count ?? DefText();
        const nodes: VNode[] = [];
        let statusNode: VNode | undefined = undefined;
        statusNode = h('p', { class: 'hover-link empty-data-line color-a4b2c2' }, [labelstr]);
        nodes.push(
          h(
            'div',
            {
              class: 'line-info',
              on: {
                click: (event: MouseEvent) => {
                  if (row.associate_contracts && row.associate_contracts.length > 0) {
                    const arrstr: string = row.associate_contracts.join('|');
                    const payload: any = { contract_uid: arrstr };
                    loadData(payload);
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
      prop: 'contract_info',
      label: '创建人/时间',
      align: 'left',
      headerAlign: 'left',
      showOverflowTooltip: true,
      minWidth: 114,
      formatter: row => [
        h('div', [row.contract_info.add_by_name]),
        h(
          'div',
          {
            style: {
              color: 'var(--text-third-color)',
            },
          },
          [row.contract_info.create_time_str?.split(' ')?.[0] ?? DefText()],
        ),
      ],
    },
    //
    /*
    {
      prop: 'contract_info',
      label: '创建时间',
      width: 114,
      align: 'left',
      headerAlign: 'left',
      formatter: row => row.contract_info.create_time_str?.split(' ')?.[0] ?? DefText(),
    },
    */
    // * 合同状态(外加是否收回)
    {
      prop: 'contract_info',
      label: '合同状态',
      align: 'left',
      headerAlign: 'left',
      width: 142,
      formatter: row => {
        const IsRecycledNode =
          row.contract_info.contract_status === ApprovalStatus.Normal
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
          ApprovalStatusMap.get(row.contract_info.contract_status) || DefText();

        const status_str = (slot = false) =>
          h(
            'span',
            {
              class: `fg-${ApprovalStatus[row.contract_info.contract_status]}`.toLowerCase(),
              ...(slot ? { slot: 'reference' } : {}),
            },
            [contract_status_str],
          );

        if (
          ![ApprovalStatus.Failure, ApprovalStatus.Processing].includes(
            row.contract_info.contract_status,
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
                    placement: 'left-start',
                    width: 234,
                    trigger: 'hover',
                    popperClass: 'oa-approve-progress-popper',
                    popperOptions: { boundariesElement: 'body', gpuAcceleration: false },
                  },
                  on: {
                    show: () => {
                      oaFlows.onFlowsShow(row.contract_info.id);
                    },
                    hide: () => {
                      oaFlows.onFlowsHide();
                    },
                  },
                },
                [
                  status_str(true),
                  ...(oaFlows.flowsLoading.value
                    ? [h('div', { style: { padding: '10px 20px' } }, ['正在查询进度...'])]
                    : oaFlows.flowsError.value !== ''
                    ? [oaFlows.flowsError.value]
                    : [oaFlows.oaflowsRender(row.contract_info.contract_status)]),
                ],
              ),
            ],
          );
        }

        const If =
          row.contract_work_infos.length > 0 &&
          [ApprovalStatus.Processing, ApprovalStatus.Failure].includes(
            row.contract_info.contract_status,
          );

        return h(
          'div',
          If
            ? [
                h(
                  'el-popover',
                  {
                    props: {
                      placement: 'left-start',
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
    },
    {
      label: '合同附件',
      align: 'left',
      headerAlign: 'left',
      minWidth: 50,
      formatter: row =>
        getAnnexList(row).length > 0
          ? h(
              'span',
              {
                class: 'hover-link',
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
          : DefText(),
    },
  ]);

  const opColumns = ref<Col[]>([
    {
      label: '操作',
      align: 'left',
      headerAlign: 'left',
      width: 154,
      formatter: row => {
        const operationBtnNodes = [];

        // * 上传合同扫描件
        if (
          options.currentUserInfo.value?.user_rights.includes(
            RIGHT_CODE.marketing_contract_scan_upload,
          ) &&
          row.contract_info.contract_status === ApprovalStatus.Normal
        ) {
          operationBtnNodes.push(
            h(
              'a',
              {
                on: {
                  click: (event: MouseEvent) => {
                    event.stopImmediatePropagation();
                    options.showAddContractCopyDialog(row);
                  },
                },
              },
              ['上传合同扫描件'],
            ),
          );
        }

        // * 作废
        if (hasInvalidRight(row)) {
          if (invalidBtnDisabled(row)) {
            const node = h(
              'el-popover',
              {
                props: {
                  placement: 'left',
                  trigger: 'hover',
                },
                style:
                  operationBtnNodes.length > 0
                    ? {
                        marginLeft: '4px',
                      }
                    : {},
              },
              [
                h('a', { attrs: { disabled: true }, slot: 'reference' }, ['作废']),
                h('span', ['补充协议/结算单审批中，禁止作废']),
              ],
            );
            operationBtnNodes.push(node);
          } else {
            operationBtnNodes.push(
              h(
                'a',
                {
                  on: {
                    click: () => {
                      options.handleInvalidClick(row);
                    },
                  },
                  style:
                    operationBtnNodes.length > 0
                      ? {
                          marginLeft: '4px',
                        }
                      : {},
                },
                ['作废'],
              ),
            );
          }
        }
        if (operationBtnNodes.length > 0) {
          return h(
            'div',
            {
              on: {
                click(event: MouseEvent) {
                  event.stopPropagation();
                },
              },
            },
            operationBtnNodes,
          );
        } else {
          return DefText();
        }
      },
    },
  ]);

  // * 2020-12-12
  // * from 青檀
  // * 改动需求：不要操作列，操作项移到详情
  // * 保留操作列可以快速对合同进行操作
  // * 跳转详情 -> 操作 比较冗长
  // * 故开发环境保留，误删
  const columns = computed<Col[]>(() => [
    ...baseColumns.value,
    ...(isOpColShow.value ? opColumns.value : []),
  ]);

  const annexDialogVisible = ref(false);
  const checkedRow = ref<Contract | undefined>(undefined);

  const annexList = computed(() => getAnnexList(checkedRow.value));

  provide('annex-data', annexList);
  provide('annex-dialog-visible', annexDialogVisible);

  const onAnnexDialogClose = () => {
    annexDialogVisible.value = false;
    checkedRow.value = undefined;
  };

  return {
    list,
    loading,
    loadData,
    total,
    columns,
    onAnnexDialogClose,
  };
};
