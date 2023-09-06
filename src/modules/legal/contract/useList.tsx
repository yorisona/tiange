/**
 * 客户合同 - 列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 11:32:52
 */
import {
  GetContractLawList,
  GetLawContractGeneral,
  GetLawContractSimple,
  GetTemplateContractList,
  GetWithout_contract,
} from '@/services/contract';
import {
  Contract,
  ContractQueryParams,
  ContractScanStatus,
  SignTypeMap,
} from '@/types/tiange/contract';
import { computed, h, provide, reactive, ref, SetupContext, toRefs } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import ApproveProgress from '@/views/customer/components/approveProgress.vue';
import { useOAFlows } from '@/modules/customer/contract/useOAFlowsInList';
import { DefText } from '@/components/DefText/dt';
import { ApprovalStatus, ApprovalStatusMap } from '@/types/tiange/system';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { render } from '@/use/vue';
import { setContractRecycle } from '@/api/customer';
import { Message } from 'element-ui';
import { usePermission } from '@/use/permission';
import { BusinessTypeMap, ProjectStatusMap } from '@/types/tiange/common';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { Decimal2String, formatAmount, get_limited_length_string } from '@/utils/string';
// import Decimal from 'decimal.js';
import { usePageJump } from '@/utils/pageJump';
import { businessNewTypeOptions } from '@/const/options';
import { VNode } from 'vue/types/umd';
import Decimal from 'decimal.js';
import formatPriceForm from '@/utils/formatData';
import { removeZeroKolCommission } from '@/modules/customer/contract/list/collection';

const { formatEmpty } = formatPriceForm;

const getFilename = (url = '') =>
  String(url || '')
    .split('/')
    .pop();

enum ContractType {
  customer = 1,
  supplier,
}

type Col = TableColumn<Contract>;

const getAnnexList = (contract: Contract | undefined) => {
  if (contract === undefined) {
    return [];
  }
  try {
    const attachment_url_list = contract.contract_detail.attachment_url_list.map(el => ({
      ...el,
      status: contract.contract_info.contract_status,
      status_str: contract.contract_info.contract_status_str,
      type: '合同附件',
    }));
    const contract_annex_info = contract.contract_annex_info
      .map(el =>
        (el.attachment_url_list || []).map(url => ({
          file_name: getFilename(url),
          url,
          status: el.contract_annex_status,
          status_str: el.contract_annex_status_str,
          type: '补充协议',
        })),
      )
      .flat();
    const contract_scan_urls = contract.contract_detail.contract_scan_urls.map(el => ({
      ...el,
      status: contract.contract_info.contract_status,
      status_str: contract.contract_info.contract_status_str,
      type: '合同扫描件',
    }));
    const contract_statements_list = contract.contract_statements_list
      .map(el =>
        el.attachment_url_list.map(url => ({
          file_name: getFilename(url),
          url,
          status: el.contract_statements_status,
          status_str: el.contract_statements_status_str,
          type: '结算单',
        })),
      )
      .flat();
    return [
      /** 合同附件 */
      ...attachment_url_list,
      /** 补充协议 */
      ...contract_annex_info,
      /** 合同扫描件 */
      ...contract_scan_urls,
      /** 结算单 */
      ...contract_statements_list,
    ];
  } catch (ex: any) {
    return [];
  }
};

export const useList = render((ctx: SetupContext, { dialogProject }: any) => {
  /** 列表加载中 */

  const { jumpProjectDetail } = usePageJump();

  const loading = ref(false);
  const total = ref(0);

  /** 客户合同数据列表 */
  const list = ref<Contract[]>([]);

  let lastPayload: any;
  /** 加载数据 */
  const loadData = async (payload: ContractQueryParams) => {
    lastPayload = payload;
    list.value = [];
    loading.value = true;
    const { data: response } = await GetContractLawList(payload);
    loading.value = false;
    if (response.success) {
      list.value = response.data.data.map((item: any) => {
        const template_info = item.template_info;
        if (template_info) {
          const pay_condition = template_info.pay_condition;
          if (pay_condition) {
            pay_condition.filter((subItem: any) => {
              if (subItem.key === '收费类型') {
                item.getMoneytype = subItem.value;
                item.contractMoney = '';
                item.contractCommission = '';
                item.contractOtherMoney = '';
                if (!subItem.value) {
                  item.getMoneytype = '其它';
                }
              }
              if (item.getMoneytype === '纯佣金') {
                if (subItem.key === '佣金') {
                  item.contractCommission = subItem.value ? subItem.value + '%' : '--';
                }
                if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                  const value = subItem.value ? subItem.value + '%(构美)' : '';
                  item.contractCommission = value;
                }
                if (subItem.key === '主播佣金') {
                  const value = subItem.value ? subItem.value + '%(主播)' : '';
                  item.contractCommission = item.contractCommission
                    ? value + '+' + item.contractCommission
                    : value;
                }
              }
              if (item.getMoneytype === '服务费+佣金' || item.getMoneytype === '固定服务费+佣金') {
                item.getMoneytype = '服务费+佣金';
                if (subItem.key === '固定服务费') {
                  item.contractMoney =
                    subItem.value || Number(subItem.value) === 0
                      ? '￥' + Decimal2String(new Decimal(subItem.value))
                      : '';
                }
                if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                  const value = subItem.value ? subItem.value + '%(构美)' : '';
                  item.contractCommission = value;
                }
                if (subItem.key === '主播佣金') {
                  const value = subItem.value ? subItem.value + '%(主播)' : '';
                  item.contractCommission = item.contractCommission
                    ? value + '+' + item.contractCommission
                    : value;
                }
                if (subItem.key === '佣金') {
                  const value = subItem.value ? subItem.value + '%' : '';
                  item.contractCommission = value;
                }
              }
              if (item.getMoneytype === '固定服务费') {
                if (subItem.key === '固定服务费') {
                  item.contractMoney =
                    subItem.value || Number(subItem.value) === 0
                      ? '￥' + Decimal2String(new Decimal(subItem.value))
                      : '';
                }
              }
              if (item.getMoneytype === '其它') {
                if (subItem.key === '其它') {
                  item.contractOtherMoney = '--';
                }
              }
            });
          } else {
            const contract_info = item.contract_info;
            if (contract_info.contract_type === 7) {
              const cooperation_content = template_info.cooperation_content;
              if (cooperation_content) {
                cooperation_content.filter((subItem: any) => {
                  if (subItem.key === '计算方式') {
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
                    const index = subItem.value;
                    let str = '--';
                    computeWayRecords.map((item: any) => {
                      if (String(item.value) === String(index)) {
                        str = item.label;
                      }
                    });
                    item.getMoneytype = str || '--';
                    item.contractOtherMoney = '--';
                  }
                  if (item.getMoneytype === '保底服务费') {
                    if (subItem.key === '保底服务费') {
                      item.contractOtherMoney =
                        subItem.value || Number(subItem.value) === 0
                          ? '￥' + Decimal2String(new Decimal(subItem.value))
                          : '';
                    }
                  }
                  if (item.getMoneytype === '小时服务费') {
                    if (subItem.key === '小时服务费') {
                      item.contractOtherMoney =
                        subItem.value || Number(subItem.value) === 0
                          ? '￥' + Decimal2String(new Decimal(subItem.value)) + '元/小时'
                          : '';
                    }
                  }
                });
              }
            } else {
              item.getMoneytype = '--';
              item.contractOtherMoney =
                item.contract_detail.contract_amount || item.contract_detail.contract_amount === 0
                  ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
                  : '--';
            }
          }
        } else {
          item.getMoneytype = '--';
          item.contractOtherMoney =
            item.contract_detail.contract_amount || item.contract_detail.contract_amount === 0
              ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
              : '--';
        }
        return item;
      });
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

  const permission = usePermission();

  const oaFlows = useOAFlows();

  const contract_type_formatter = (row: Contract) =>
    row.contract_info.contract_type === 1 ||
    row.contract_info.contract_type === 2 ||
    row.contract_info.contract_type === 5
      ? '客户合同'
      : '供应商合同';

  const contract_type_column_max_width = max_length_of_column(
    list,
    '合同类别',
    contract_type_formatter,
  );

  /** 合同编号渲染函数 */
  const contract_info_render = <T extends boolean>(row: Contract, text_only: T) => {
    const {
      contract_info: { contract_uid },
    } = row;

    if (text_only) {
      // 此处加的 '字数补丁' 是在纯文本条件下用来代替合同类型标签的
      // 宽度相等
      return contract_uid;
    }

    const refNode = h('div', [h('span', [contract_uid])]);

    return refNode as TableColumnRenderReturn<T>;
  };

  /** 合同编号最大宽度 */
  const contract_type_max_length = max_length_of_column(list, '合同编号', contract_info_render);

  /** 公司名称渲染函数 */
  const company_name_render = <T extends boolean>(
    row: Contract,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const data = row.contract_info.company_name || row.contract_info.customer_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 12);

    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              content: data,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  /** 公司名称渲染函数 */
  const company_name_max_length = max_length_of_column(list, '公司名称', company_name_render);

  /*
    /!** 合同金额渲染函数 *!/
    const contract_amount_render = ({ contract_detail: { contract_amount } }: Contract) =>
      contract_amount === null ? '--' : `￥${Decimal2String(new Decimal(contract_amount))}`;

    /!** 合同金额最大宽度 *!/
    const contract_amount_max_length = max_length_of_column(list, '合同金额', contract_amount_render);
  */
  /** 公司名称渲染函数 */
  const project_name_render = <T extends boolean>(
    row: Contract,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    if (row.project_infos.length < 1) {
      return '--';
    }
    const data =
      row.project_infos[0].project_name || '--' + row.project_infos[0].project_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 12);
    return text_only || !is_folded
      ? (h(
          'span',
          {
            class: ['hover-link', 'empty-data-line'],
            on: {
              click: (event: MouseEvent) => {
                jumpProjectDetail(row.contract_info.business_type, {
                  project_id: row.project_infos[0].project_id,
                  newWindow: true,
                });
              },
            },
          },
          [
            folded_text,
            h(
              'div',
              {
                class: ['hover-link', 'empty-data-line'],
                on: {
                  click: (event: MouseEvent) => {
                    jumpProjectDetail(row.contract_info.business_type, {
                      project_id: row.project_infos[0].project_id,
                      newWindow: true,
                    });
                  },
                },
                slot: 'reference',
              },
              [row.project_infos[0].project_uid],
            ),
          ],
        ) as TableColumnRenderReturn<T>)
      : (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              content: data,
            },
          },
          [
            h(
              'span',
              {
                class: ['hover-link', 'empty-data-line'],
                on: {
                  click: (event: MouseEvent) => {
                    jumpProjectDetail(row.contract_info.business_type, {
                      project_id: row.project_infos[0].project_id,
                      newWindow: true,
                    });
                  },
                },
                slot: 'reference',
              },
              [
                folded_text,
                h(
                  'div',
                  {
                    class: ['hover-link', 'empty-data-line'],
                    on: {
                      click: (event: MouseEvent) => {
                        jumpProjectDetail(row.contract_info.business_type, {
                          project_id: row.project_infos[0].project_id,
                          newWindow: true,
                        });
                      },
                    },
                  },
                  [row.project_infos[0].project_uid],
                ),
              ],
            ),
          ],
        ) as TableColumnRenderReturn<T>);
  };

  const contract_type = (row: Contract) =>
    row.contract_info.contract_type === 1 ||
    row.contract_info.contract_type === 2 ||
    row.contract_info.contract_type === 5
      ? ContractType.customer
      : ContractType.supplier;

  /** 列设置 */
  const columns = computed<Col[]>(() => [
    {
      label: '合同类别',
      fixed: 'left',
      align: 'center',
      minWidth: contract_type_column_max_width.value,
      formatter: contract_type_formatter,
    },
    {
      label: '签约类型',
      fixed: 'left',
      align: 'center',
      minWidth: 100,
      formatter: (row: any) => {
        return SignTypeMap.get(row?.contract_info?.sign_type) || '--';
      },
    },
    {
      prop: 'contract_info',
      label: '合同编号',
      fixed: 'left',
      minWidth: contract_type_max_length.value,
      formatter: row => contract_info_render(row, false),
    },
    {
      label: '项目信息',
      minWidth: 184,
      className: 'ProjectInfoColumn',
      formatter: row => project_name_render(row, false),
    },
    {
      label: '业务类型',
      minWidth: 100,
      align: 'center',
      formatter: row =>
        row.contract_info.business_type !== undefined
          ? BusinessTypeMap.get(row.contract_info.business_type) ?? '--'
          : '--',
    },
    {
      prop: 'contract_info',
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
      label: '应收/应付',
      minWidth: 140,
      align: 'right',
      formatter: row => {
        switch (contract_type(row)) {
          case ContractType.customer: {
            return row.settlement_info?.receivable_amount === null ||
              row.settlement_info?.receivable_amount === undefined
              ? '--'
              : formatAmount(row.settlement_info?.receivable_amount, 'None');
          }
          case ContractType.supplier: {
            return row.settlement_info?.payable_amount === null ||
              row.settlement_info?.payable_amount === undefined
              ? '--'
              : formatAmount(row.settlement_info?.payable_amount, 'None');
          }
          default:
            return '--';
        }
      },
    },
    {
      label: '实收/实付',
      minWidth: 140,
      align: 'right',
      formatter: row => {
        switch (contract_type(row)) {
          case ContractType.customer: {
            return row.settlement_info?.receivable_write_off_amount === null ||
              row.settlement_info?.receivable_write_off_amount === undefined
              ? '--'
              : formatAmount(row.settlement_info?.receivable_write_off_amount, 'None');
          }
          case ContractType.supplier: {
            return row.settlement_info?.payable_write_off_amount === null ||
              row.settlement_info?.payable_write_off_amount === undefined
              ? '--'
              : formatAmount(row.settlement_info?.payable_write_off_amount, 'None');
          }
          default:
            return '--';
        }
      },
    },
    {
      label: '合作期限',
      width: 166,
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
      width: 100,
      align: 'center',
      // formatter: row => row.contract_info.related_contracts?.length ?? DefText(),
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
      showOverflowTooltip: true,
      minWidth: 114,
      formatter: row => [
        h(
          'div',
          {
            style: {
              paddingLeft: '15px',
            },
          },
          [row.contract_info.add_by_name],
        ),
        h(
          'div',
          {
            style: {
              color: 'var(--text-third-color)',
              paddingLeft: '15px',
            },
          },
          [row.contract_info.create_time_str?.split(' ')?.[0].replace(/-/g, '.') ?? DefText()],
        ),
      ],
    },
    //
    /*
    {
      prop: 'contract_info',
      label: '创建时间',
      width: 114,
      formatter: row => row.contract_info.create_time_str?.split(' ')?.[0] ?? DefText(),
    },
    */
    // * 合同状态(外加是否收回)
    {
      prop: 'contract_info',
      label: '合同状态',
      align: 'center',
      minWidth: 90,
      formatter: row => {
        // const IsRecycledNode =
        //   row.contract_info.contract_status === ApprovalStatus.Normal
        //     ? row.contract_info.is_recycled === 1
        //       ? h('div', { style: { marginTop: '2px' } }, [
        //           h(
        //             'span',
        //             {
        //               class: ['contract-recycled-tag', 'contract-recycled-tag-yes'],
        //             },
        //             ['已收回'],
        //           ),
        //         ])
        //       : h('div', { style: { marginTop: '2px' } }, [
        //           h(
        //             'span',
        //             {
        //               class: ['contract-recycled-tag', 'contract-recycled-tag-no'],
        //             },
        //             ['未收回'],
        //           ),
        //         ])
        //     : '';

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

        const status_str2 = (slot = false) =>
          h(
            'span',
            {
              class: `fg-${ApprovalStatus[row.contract_info.contract_status]}`.toLowerCase(),
              ...(slot ? { slot: 'reference' } : {}),
            },
            // [contract_status_str],
            [
              contract_status_str,
              // [
              //   h(
              //     'div',
              //     {
              //       style: { marginTop: '2px' },
              //     },
              //     [
              //       h(
              //         'span',
              //         {
              //           class: ['contract-process-tag', 'contract-process-tag-detail'],
              //         },
              //         ['查看进度'],
              //       ),
              //     ],
              //   ),
              // ],
            ],
          );

        if (
          ![ApprovalStatus.Failure, ApprovalStatus.Processing].includes(
            row.contract_info.contract_status,
          )
        ) {
          return h('div', [status_str(false), ' ']);
          // return h('div', [status_str(false), ' ', IsRecycledNode]);
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
                    openDelay: 300,
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
                  status_str2(true),
                  h('div', [
                    ...(oaFlows.flowsLoading.value
                      ? [h('div', ['正在查询进度...'])]
                      : oaFlows.flowsError.value !== ''
                      ? [oaFlows.flowsError.value]
                      : [oaFlows.oaflowsRender(row.contract_info.contract_status)]),
                  ]),
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
                      openDelay: 300,
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
      label: '附件/扫描件',
      minWidth: 100,
      align: 'center',
      formatter: (row: any) =>
        getAnnexList(row).length > 0
          ? h(
              'span',
              {
                // class: 'hover-link',
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
          : DefText(),
    },
    {
      label: '扫描件审批',
      minWidth: 100,
      fixed: 'right',
      formatter: row => {
        const hasPermission = permission.law_verify_contract_scan;
        if (!hasPermission) return '--';
        const contract_status_str =
          ApprovalStatusMap.get(row.contract_info.contract_status) || DefText();
        if (contract_status_str !== '审批成功') return '--';
        const status = row.contract_info?.contract_scan_status;
        let status_str = '--';
        switch (status) {
          case ContractScanStatus.initial:
            status_str = '未上传';
            break;
          case ContractScanStatus.waiting:
            status_str = '驳回';
            break;
          case ContractScanStatus.passed:
            status_str = '已完成';
            break;
          case ContractScanStatus.refused:
            status_str = '已驳回';
            break;
          default:
            status_str = '--';
            break;
        }
        return h(
          'tg-button',
          {
            props: {
              type: 'link',
              disabled: status === ContractScanStatus.waiting ? false : true,
            },
            on: {
              click: (event: Event) => {
                if (row.contract_info.contract_scan_status === ContractScanStatus.waiting) {
                  dialogProject.show(row.contract_info.id);
                } else {
                  //
                }
                event.stopPropagation();
              },
            },
          },
          status_str,
        );
      },
    },
    {
      label: '操作',
      minWidth: 76,
      fixed: 'right',
      formatter: row => {
        const hasPermission = permission.law_contract_retrieve;
        const isStatus =
          row.contract_info?.contract_scan_status !== 0 &&
          row.contract_info?.contract_scan_status !== 3;

        if (!hasPermission) return '';
        const hasDisabled =
          row.contract_info.is_recycled === 1 ||
          [ApprovalStatus.Failure, ApprovalStatus.Processing, ApprovalStatus.Invalid].includes(
            row.contract_info.contract_status,
          );
        if (hasDisabled || !isStatus) {
          return '';
        } else {
          return (
            <span
              style={{ color: 'var(--theme-color)' }}
              onClick={async (event: Event) => {
                event.stopPropagation();
                let title_message = '';
                if (!row.contract_detail.contract_scan_urls.length) {
                  title_message = '该合同尚未上传扫描件，确认合同已收回？';
                } else {
                  title_message = '确认合同已收回?';
                }
                const result = await AsyncConfirm(ctx, title_message);
                if (!result) return;
                setContractRecycle({
                  id: row.contract_info.id,
                  is_recycled: 1,
                })
                  .then(res => {
                    const data = res.data;
                    if (!data.success) throw new Error(data.message);
                    return loadData(lastPayload);
                  })
                  .catch(ex => {
                    return Message.error(ex.message);
                  });
              }}
            >
              收回
            </span>
          );
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
  // ? 操作列啥时候被合并上去的？还保留这一层computed干蛋？
  // const columns = computed<Col[]>(() => [...baseColumns.value]);

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
    permission,
  };
});

//获取模板管理数据
export const useTemplateList = render((ctx: SetupContext) => {
  /** 列表加载中 */
  const loading = ref(false);
  const total = ref(0);
  /** 客户合同数据列表 */
  const list = ref<any[]>([]);
  /** 加载数据 */
  const loadData = async (payload: any) => {
    list.value = [];
    loading.value = true;
    const { data: response } = await GetTemplateContractList(payload);
    loading.value = false;
    if (response.success) {
      list.value = response.data.data.map((item: any) => {
        const arr = item.business_types;
        const newarr: void[] = [];
        const indexnewarr: void[] = [];
        const busniessarr = businessNewTypeOptions;
        arr.filter((subItem: any) => {
          const index = Number(subItem);
          busniessarr.filter((busniessitem: any) => {
            const itemone = Number(busniessitem.value);
            if (index === itemone) {
              newarr.push(busniessitem?.label || '');
            }
          });
          const indexone: any = index;
          indexnewarr.push(indexone);
        });
        item.business_types = indexnewarr;
        item.busniesstype = newarr.join('、');
        return item;
      });
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

  const permission = usePermission();
  const checkedRow = ref<Contract | undefined>(undefined);
  const annexList = computed(() => getAnnexList(checkedRow.value));
  provide('annex-data', annexList);
  return {
    list,
    loading,
    loadData,
    total,
    permission,
  };
});

// 合同看板列表
export const useLegalBulletinBoardList = (ctx: SetupContext, { dialogProject }: any) => {
  const rejectVisible = ref(false);
  const lastPayload = ref({});
  const permission = usePermission();
  const statusMap = new Map();
  statusMap.set(0, '未上传');
  statusMap.set(1, '待审核');
  statusMap.set(2, '通过');
  statusMap.set(3, '已驳回');
  // statusMap.set(3, '驳回');

  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    tableColumn: [
      {
        label: '合同类别',
        // minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        // property: 'type',
        formatter: (row: any) =>
          row?.contract_info?.contract_type === 1 ||
          row?.contract_info?.contract_type === 2 ||
          row?.contract_info?.contract_type === 5
            ? '客户合同'
            : '供应商合同' || '--',
      },
      {
        label: '签约类型',
        // minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => {
          return SignTypeMap.get(row?.contract_info?.sign_type) || '--';
        },
      },
      {
        label: '项目名称',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
        // property: 'type2',
        formatter: (row: any) =>
          formatEmpty(row.project_infos[0] ? row.project_infos[0].project_name : ''),
      },
      {
        label: '业务类型',
        // minWidth: 160,
        align: 'center',
        headerAlign: 'center',
        formatter: row =>
          row.contract_info.business_type !== undefined
            ? BusinessTypeMap.get(row.contract_info.business_type) ?? '--'
            : '--',
      },
      {
        label: '创建人',
        minWidth: 90,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.contract_info.add_by_name),
      },
      {
        label: '创建时间',
        minWidth: 150,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) =>
          row.contract_info.create_time_str?.split(' ')?.[0].replace(/-/g, '.') ?? DefText(),
      },
      {
        label: '附件/扫描件',
        // minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        // property: 'type6',
        formatter: (row: any) => {
          return getAnnexList(row).length > 0
            ? h(
                'span',
                {
                  // class: 'hover-link',
                  style: {
                    color: 'var(--theme-color)',
                    cursor: 'pointer',
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
      },
      {
        label: '扫描件审核',
        // minWidth: 90,
        align: 'center',
        headerAlign: 'center',
        // property: 'type7',
        formatter: (row: any) => {
          const hasPermission = permission.law_verify_contract_scan;
          if (!hasPermission) return '--';
          const contract_status_str =
            ApprovalStatusMap.get(row.contract_info.contract_status) || DefText();
          if (contract_status_str !== '审批成功') return '--';
          if (row.contract_info.contract_scan_status === 1) {
            return (
              <div
                style="color: var(--theme-color);cursor: pointer;"
                onClick={() => dialogProject.show(row.contract_info.id)}
              >
                驳回
              </div>
            );
          } else {
            return (
              <div style="color: var(--text-third-color)">
                {statusMap.get(row.contract_info.contract_scan_status)}
              </div>
            );
          }
        },
      },
      {
        label: '操作',
        minWidth: 90,
        align: 'center',
        headerAlign: 'center',
        // property: 'type8',
        formatter: (row: any) => {
          const isStatus =
            row.contract_info?.contract_scan_status !== 0 &&
            row.contract_info?.contract_scan_status !== 3;
          const hasPermission = permission.law_contract_retrieve;
          if (!hasPermission) return '';
          const hasDisabled =
            row.contract_info.is_recycled === 1 ||
            [ApprovalStatus.Failure, ApprovalStatus.Processing, ApprovalStatus.Invalid].includes(
              row.contract_info.contract_status,
            );
          if (hasDisabled || !isStatus) {
            return '';
          } else {
            return (
              <div
                style="color: var(--theme-color);cursor: pointer;"
                onClick={async (event: Event) => {
                  event.stopPropagation();
                  let title_message = '确认合同已收回?';
                  if (!row.contract_detail.contract_scan_urls.length) {
                    title_message = '该合同尚未上传扫描件，确认合同已收回？';
                  } else {
                    title_message = '确认合同已收回?';
                  }
                  const result = await AsyncConfirm(ctx, title_message);
                  if (!result) return;
                  setContractRecycle({
                    id: row.contract_info.id,
                    is_recycled: 1,
                  })
                    .then(res => {
                      const data = res.data;
                      if (!data.success) throw new Error(data.message);
                      return getData(lastPayload.value);
                    })
                    .catch(ex => {
                      return Message.error(ex.message);
                    });
                }}
              >
                收回
              </div>
            );
          }
        },
      },
    ],
  });
  const getData = async (payload: any) => {
    lastPayload.value = payload;
    dataStruct.loading = true;
    try {
      if (payload?.date) {
        payload.start_date = payload?.date[0] ?? undefined;
        payload.end_date = payload?.date[1] ?? undefined;
        delete payload.date;
      }

      const res: any = await GetLawContractSimple(payload);
      dataStruct.saleData = res.data.data.data || [];

      dataStruct.total = res.data.data.total || 0;
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      dataStruct.loading = false;
    }
  };
  const annexDialogVisible = ref(false);
  const checkedRow = ref<Contract | undefined>(undefined);
  // const getAnnexList = (contract: UseSealsModel | undefined) => {
  //   if (contract === undefined) {
  //     return [];
  //   }
  //   try {
  //     const attachment_url_list =
  //       contract?.attachment?.map(el => ({
  //         ...el,
  //         status: contract.approval_status,
  //         status_str: contract.approval_status
  //           ? UseSealApprovalStatusMap.get(contract.approval_status)
  //           : '--',
  //         type: '附件',
  //       })) ?? [];
  //     const contract_scan_urls =
  //       contract?.scan?.map(el => ({
  //         ...el,
  //         status: contract.scan_status,
  //         status_str: contract.scan_status ? UseSealScanStatusMap.get(contract.scan_status) : '--',
  //         type: '扫描件',
  //       })) ?? [];
  //     return [
  //       /** 合同附件 */
  //       ...attachment_url_list,
  //       /** 合同扫描件 */
  //       ...contract_scan_urls,
  //     ];
  //   } catch (ex: any) {
  //     return [];
  //   }
  // };
  const annexList = computed(() => getAnnexList(checkedRow.value));

  provide('annex-data', annexList);
  provide('annex-dialog-visible', annexDialogVisible);

  const onAnnexDialogClose = () => {
    annexDialogVisible.value = false;
    checkedRow.value = undefined;
  };
  return {
    ...toRefs(dataStruct),
    onAnnexDialogClose,
    rejectVisible,
    getData,
  };
};

// 合同看板无合同项目列表
export const useNoLegalContractProject = (ctx: SetupContext) => {
  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    tableColumn: [
      {
        label: '项目编号',
        minWidth: 160,
        align: 'left',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.project_uid),
      },
      {
        label: '项目名称',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.project_name),
      },
      {
        label: '业务类型',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: row =>
          row.business_type !== undefined ? BusinessTypeMap.get(row.business_type) ?? '--' : '--',
      },
      {
        label: '客户公司名称',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.customer_company_name),
      },
      {
        label: '部门',
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.feishu_department_name),
      },
      {
        label: '项目阶段',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(ProjectStatusMap.get(row.business_type)),
      },
      {
        label: '客户经理',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.customer_manager),
      },
      {
        label: '项目经理',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.project_manager),
      },
      {
        label: '创建日期',
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => formatEmpty(row.gmt_create.replace(/-/g, '.')),
        // formatter: ({ contract_info: { coop_start_date, coop_end_date } }) => {
        //   if (coop_start_date !== null && coop_end_date === null) {
        //     coop_end_date = '长期有效';
        //   }
        //   const arr: any = [coop_start_date, coop_end_date];
        //   const timestr =
        //     arr
        //       .filter((el: any) => el !== null)
        //       .join('～')
        //       .replace(/-/g, '.') || DefText();
        //   return timestr;
        // },
      },
    ],
  });
  const getData = async (payload: any) => {
    dataStruct.loading = true;
    try {
      const res: any = await GetWithout_contract(payload);
      dataStruct.saleData = res.data.data.data || [];

      dataStruct.total = res.data.data.total || 0;
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      dataStruct.loading = false;
    }
  };
  return {
    ...toRefs(dataStruct),
    getData,
  };
};

// 合同看板将到期列表
export const useExpiringContract = (ctx: SetupContext) => {
  const contract_type_formatter = (row: Contract) => {
    return row.contract_info.contract_type === 1 ||
      row.contract_info.contract_type === 2 ||
      row.contract_info.contract_type === 5
      ? '客户合同'
      : '供应商合同' || '--';
  };
  /** 合同编号渲染函数 */
  const contract_info_render = <T extends boolean>(row: Contract, text_only: T) => {
    const {
      contract_info: { contract_uid },
    } = row;

    if (text_only) {
      // 此处加的 '字数补丁' 是在纯文本条件下用来代替合同类型标签的
      // 宽度相等
      return contract_uid;
    }

    const refNode = h('div', [h('span', [contract_uid])]);

    return refNode as TableColumnRenderReturn<T>;
  };
  /** 公司名称渲染函数 */
  const company_name_render = <T extends boolean>(
    row: Contract,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const data = row.contract_info.company_name || row.contract_info.customer_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 12);

    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              content: data,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    tableColumn: [
      {
        label: '合同类别',
        fixed: 'left',
        align: 'center',
        minWidth: 120,
        formatter: (row: any) => contract_type_formatter(row),
      },
      {
        label: '签约类型',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type1',
        formatter: (row: any) => {
          return SignTypeMap.get(row?.contract_info?.sign_type) || '--';
        },
      },
      {
        label: '合同编号',
        align: 'left',
        headerAlign: 'center',
        minWidth: 180,
        formatter: (row: any) => contract_info_render(row, false),
      },
      {
        label: '项目名称',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
        formatter: (row: any) =>
          formatEmpty(row.project_infos[0] ? row.project_infos[0].project_name : ''),
      },
      {
        label: '业务类型',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: row =>
          row.contract_info.business_type !== undefined
            ? BusinessTypeMap.get(row.contract_info.business_type) ?? '--'
            : '--',
      },
      {
        label: '公司名称',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
        formatter: row => company_name_render(row, false),
      },
      {
        label: '费用类型',
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        formatter: row => row.getMoneytype ?? DefText(),
      },
      {
        label: '合同金额',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
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
        minWidth: 200,
        align: 'center',
        formatter: ({ contract_info: { coop_start_date, coop_end_date } }: any) => {
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
        label: '剩余有效天数',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        formatter: ({ contract_info: { coop_end_date } }: any) => {
          const date2 = new Date(); //结束时间
          const date3 = new Date(coop_end_date).getTime() - date2.getTime(); //时间差的毫秒数

          //计算出相差天数
          const days = Math.ceil(date3 / (24 * 3600 * 1000));
          return days > 0 ? days : '--';
        },
      },
      {
        label: '关联合同数',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
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
                      const payload: any = { contract_uid: arrstr };
                      getData(payload);
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
        label: '创建人',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        property: 'contract_info.add_by_name',
      },
      {
        label: '创建时间',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        formatter: row =>
          row.contract_info.create_time_str?.split(' ')?.[0].replace(/-/g, '.') ?? DefText(),
      },
      {
        label: '附件/扫描件',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        // property: 'type6',
        formatter: (row: any) => {
          // console.log(getAnnexList(row), 'getAnnexList(row)');

          return getAnnexList(row).length > 0
            ? h(
                'span',
                {
                  // class: 'hover-link',
                  style: {
                    color: 'var(--theme-color)',
                    cursor: 'pointer',
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
      },
    ],
    AbnormalTableColumn: [
      {
        label: '合同类别',
        fixed: 'left',
        align: 'center',
        minWidth: 100,
        formatter: (row: any) => contract_type_formatter(row),
      },
      {
        label: '签约类型',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        property: 'type1',
        formatter: (row: any) => {
          return SignTypeMap.get(row?.contract_info?.sign_type) || '--';
        },
      },
      {
        label: '合同编号',
        align: 'center',
        headerAlign: 'center',
        minWidth: 200,
        formatter: (row: any) => contract_info_render(row, false),
      },
      {
        label: '项目名称',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) =>
          formatEmpty(row.project_infos[0] ? row.project_infos[0].project_name : ''),
      },
      {
        label: '业务类型',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        formatter: row =>
          row.contract_info.business_type !== undefined
            ? BusinessTypeMap.get(row.contract_info.business_type) ?? '--'
            : '--',
      },
      {
        label: '公司名称',
        minWidth: 180,
        align: 'center',
        headerAlign: 'center',
        formatter: row => company_name_render(row, false),
      },
      {
        label: '费用类型',
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        formatter: row => row.getMoneytype ?? DefText(),
      },
      {
        label: '合同金额',
        minWidth: 200,
        align: 'left',
        headerAlign: 'center',
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
        minWidth: 180,
        align: 'center',
        formatter: ({ contract_info: { coop_start_date, coop_end_date } }: any) => {
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
      // {
      //   label: '剩余有效天数',
      //   minWidth: 120,
      //   align: 'center',
      //   headerAlign: 'center',
      //   formatter: ({ contract_info: { coop_end_date } }: any) => {
      //     const date2 = new Date(); //结束时间
      //     const date3 = new Date(coop_end_date).getTime() - date2.getTime(); //时间差的毫秒数

      //     //计算出相差天数
      //     const days = Math.floor(date3 / (24 * 3600 * 1000));
      //     return days > 0 ? days : '--';
      //   },
      // },
      {
        label: '关联合同数',
        minWidth: 110,
        align: 'center',
        headerAlign: 'center',
        formatter: (row: any) => {
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
                      const payload: any = { contract_uid: arrstr };
                      getData(payload);
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
        label: '创建人',
        minWidth: 80,
        align: 'center',
        headerAlign: 'center',
        property: 'contract_info.add_by_name',
      },
      {
        label: '创建时间',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        formatter: row =>
          row.contract_info.create_time_str?.split(' ')?.[0].replace(/-/g, '.') ?? DefText(),
      },
      {
        label: '附件/扫描件',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        // property: 'type6',
        formatter: (row: any) => {
          // console.log(getAnnexList(row), 'getAnnexList(row)');

          return getAnnexList(row).length > 0
            ? h(
                'span',
                {
                  // class: 'hover-link',
                  style: {
                    color: 'var(--theme-color)',
                    cursor: 'pointer',
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
      },
    ],
  });
  /** 合同编号最大宽度 */
  // const contract_type_max_length = max_length_of_column(
  //   dataStruct.saleData,
  //   '合同编号',
  //   contract_info_render,
  // );
  const lastPayload = ref({});
  const getData = async (payload: any) => {
    // payload.is_near = true;
    lastPayload.value = payload;
    dataStruct.loading = true;
    try {
      const res: any = await GetLawContractSimple(payload);
      // dataStruct.saleData = res.data.data.data || [];
      dataStruct.saleData = res.data.data.data.map((item: any) => {
        const template_info = item.template_info;
        if (template_info) {
          const pay_condition = template_info.pay_condition;
          if (pay_condition) {
            pay_condition.filter((subItem: any) => {
              if (subItem.key === '收费类型') {
                item.getMoneytype = subItem.value;
                item.contractMoney = '';
                item.contractCommission = '';
                item.contractOtherMoney = '';
                if (!subItem.value) {
                  item.getMoneytype = '其它';
                }
              }
              if (item.getMoneytype === '纯佣金') {
                if (subItem.key === '佣金') {
                  item.contractCommission = subItem.value ? subItem.value + '%' : '--';
                }
                if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                  const value = subItem.value ? subItem.value + '%(构美)' : '';
                  item.contractCommission = value;
                }
                if (subItem.key === '主播佣金') {
                  const value = subItem.value ? subItem.value + '%(主播)' : '';
                  item.contractCommission = item.contractCommission
                    ? value + '+' + item.contractCommission
                    : value;
                }
              }
              if (item.getMoneytype === '服务费+佣金' || item.getMoneytype === '固定服务费+佣金') {
                item.getMoneytype = '服务费+佣金';
                if (subItem.key === '固定服务费') {
                  item.contractMoney =
                    subItem.value || Number(subItem.value) === 0
                      ? '￥' + Decimal2String(new Decimal(subItem.value))
                      : '';
                }
                if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                  const value = subItem.value ? subItem.value + '%(构美)' : '';
                  item.contractCommission = value;
                }
                if (subItem.key === '主播佣金') {
                  const value = subItem.value ? subItem.value + '%(主播)' : '';
                  item.contractCommission = item.contractCommission
                    ? value + '+' + item.contractCommission
                    : value;
                }
                if (subItem.key === '佣金') {
                  const value = subItem.value ? subItem.value + '%' : '';
                  item.contractCommission = value;
                }
              }
              if (item.getMoneytype === '固定服务费') {
                if (subItem.key === '固定服务费') {
                  item.contractMoney =
                    subItem.value || Number(subItem.value) === 0
                      ? '￥' + Decimal2String(new Decimal(subItem.value))
                      : '';
                }
              }
              if (item.getMoneytype === '其它') {
                if (subItem.key === '其它') {
                  item.contractOtherMoney = '--';
                }
              }
            });
          } else {
            const contract_info = item.contract_info;
            if (contract_info.contract_type === 7) {
              const cooperation_content = template_info.cooperation_content;
              if (cooperation_content) {
                cooperation_content.filter((subItem: any) => {
                  if (subItem.key === '计算方式') {
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
                    const index = subItem.value;
                    let str = '--';
                    computeWayRecords.map((item: any) => {
                      if (String(item.value) === String(index)) {
                        str = item.label;
                      }
                    });
                    item.getMoneytype = str || '--';
                    item.contractOtherMoney = '--';
                  }
                  if (item.getMoneytype === '保底服务费') {
                    if (subItem.key === '保底服务费') {
                      item.contractOtherMoney =
                        subItem.value || Number(subItem.value) === 0
                          ? '￥' + Decimal2String(new Decimal(subItem.value))
                          : '';
                    }
                  }
                  if (item.getMoneytype === '小时服务费') {
                    if (subItem.key === '小时服务费') {
                      item.contractOtherMoney =
                        subItem.value || Number(subItem.value) === 0
                          ? '￥' + Decimal2String(new Decimal(subItem.value)) + '元/小时'
                          : '';
                    }
                  }
                });
              }
            } else {
              item.getMoneytype = '--';
              item.contractOtherMoney =
                item.contract_detail.contract_amount || item.contract_detail.contract_amount === 0
                  ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
                  : '--';
            }
          }
        } else {
          item.getMoneytype = '--';
          item.contractOtherMoney =
            item.contract_detail.contract_amount || item.contract_detail.contract_amount === 0
              ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
              : '--';
        }
        return item;
      });
      dataStruct.total = res.data.data.total || 0;
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      dataStruct.loading = false;
    }
  };
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
    ...toRefs(dataStruct),
    onAnnexDialogClose,
    getData,
  };
};

//合同看板异常列表
export const useAbnormalContract = (ctx: SetupContext) => {
  const contract_type_formatter = (row: Contract) => {
    return row.contract_info.contract_type === 1 ||
      row.contract_info.contract_type === 2 ||
      row.contract_info.contract_type === 5
      ? '客户合同'
      : '供应商合同' || '--';
  };
  const dataStruct = reactive({
    loading: false,
    saleData: [{ type: 1111, contract_info: { contract_type: 1 } }],
    total: 0,
    tableColumn: [
      {
        label: '合同类别',
        fixed: 'left',
        align: 'center',
        minWidth: 120,
        formatter: (row: any) => contract_type_formatter(row),
      },
      {
        label: '签约类型',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type1',
        formatter: (row: any) => formatEmpty(row.second_cname),
      },
      {
        label: '合同编号',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type',
        formatter: (row: any) => formatEmpty(row.item_id),
      },
      {
        label: '项目名称',
        minWidth: 100,
        align: 'center',
        headerAlign: 'center',
        property: 'type1',
        formatter: (row: any) => formatEmpty(row.second_cname),
      },
      {
        label: '业务类型',
        minWidth: 160,
        align: 'center',
        headerAlign: 'center',
        property: 'type3',
        formatter: (row: any) => formatEmpty(row.second_cname),
      },
      {
        label: '公司名称',
        minWidth: 160,
        align: 'center',
        headerAlign: 'center',
        property: 'type7',
      },
      {
        label: '费用类型',
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        property: 'type6',
      },
      {
        label: '合同金额',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type6',
      },
      {
        label: '合作期限',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type6',
      },
      // {
      //   label: '剩余有效天数',
      //   minWidth: 120,
      //   align: 'center',
      //   headerAlign: 'center',
      //   property: 'type6',
      // },
      {
        label: '关联合同数',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type6',
      },
      {
        label: '创建人',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type6',
      },
      {
        label: '创建时间',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type6',
      },
      {
        label: '附件/扫描件',
        minWidth: 120,
        align: 'center',
        headerAlign: 'center',
        property: 'type6',
      },
    ],
  });
  const getData = async (payload: any) => {
    // dataStruct.loading = true;
    // try {
    //   const res: any = await GetDouyinItemReport(payload);
    //   dataStruct.saleData = res.data.data.items || [];
    //   dataStruct.total = res.data.data.total || 0;
    // } catch (error) {
    //   ctx.root.$message.error('查询失败');
    // } finally {
    //   dataStruct.loading = false;
    // }
  };
  return {
    ...toRefs(dataStruct),
    getData,
  };
};

/** 通用合同 **/

// 通用合同看板
export const useGeneralContract = (ctx: SetupContext) => {
  const dataStruct = reactive({
    loading: false,
    saleData: [],
    total: 0,
    tableColumn: [
      {
        label: '合同编号',
        align: 'left',
        headerAlign: 'center',
        minWidth: 160,
        fixed: 'left',
        formatter: (row: any) => {
          return row.contract_uid || '--';
        },
      },
      {
        label: '公司名称',
        minWidth: 220,
        align: 'left',
        headerAlign: 'center',
        showOverflowTooltip: true,
        formatter: (row: any) => {
          return row.company_name || '--';
        },
      },
      {
        label: '合作期限',
        minWidth: 160,
        align: 'center',
        formatter: (row: any) => {
          if (row.coop_start_date !== null && row.coop_end_date === null) {
            row.coop_end_date = '长期有效';
          }
          const arr: any = [row.coop_start_date, row.coop_end_date];
          const timestr =
            arr
              .filter((el: any) => el !== null)
              .join('～')
              .replace(/-/g, '.') || DefText();
          return timestr;
        },
      },
      {
        label: '适用范围',
        minWidth: 320,
        align: 'center',
        formatter: (row: any) => {
          return row.business_types_name || '--';
        },
      },
    ],
  });

  const lastPayload = ref({});
  const getData = async (payload: {
    page_num?: number;
    num?: number;
    contract_uid?: string;
    company_name?: string;
  }) => {
    // payload.is_near = true;
    lastPayload.value = payload;
    dataStruct.loading = true;
    try {
      const res: any = await GetLawContractGeneral(payload);
      // dataStruct.saleData = res.data.data.data || [];
      dataStruct.saleData = res.data.data.data || [];
      dataStruct.total = res.data.data.total || 0;
    } catch (error) {
      ctx.root.$message.error('查询失败');
    } finally {
      dataStruct.loading = false;
    }
  };
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
    ...toRefs(dataStruct),
    onAnnexDialogClose,
    getData,
  };
};
