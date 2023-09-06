import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref, h, onMounted, computed, provide, watch } from '@vue/composition-api';
// import { departmentFilterDisabled } from '@/utils/filter';
// import { wait } from '@/utils/func';
// import Decimal from 'decimal.js';
import { selectControlPopoverHide } from '@/utils/tree-other';
import scanFileApproval from '@/modules/legal/components/dialog/scanFileApproval/index.vue';
import { ScanFileApprovalType } from '../components/dialog/scanFileApproval';
import useSealDetail from '../components/dialog/useSealDetail/index.vue';
import { SealRecordDetailType } from '../components/dialog/useSealDetail';
import { QueryUseSeals } from '@/services/legal';
import { wait } from '@/utils/func';
import { QueryUseSealsParams, UseSealsModel } from '@/types/tiange/legal';
import annexDialog from '@/modules/customer/contract/annex.dialog.vue';
import { QueryApprovalInfo } from '@/services/workbench/workbench';
import { DefText } from '@/components/DefText/dt';
import { ApprovalInfo } from '@/types/tiange/workbench';
import workbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import { deepClone } from '@/utils/tools';

type Col = TableColumn<UseSealsModel>;

type UseSealForm = Omit<QueryUseSealsParams, 'apply_date_begin' | 'apply_date_end'> & {
  total: number | undefined;
  date: string[];
};

enum UseSealApprovalStatus {
  Processing = 1,
  Normal,
  Failure,
  Canceled,
}

enum UseScanStatus {
  Processing = 0,
  Normal,
  Failure,
  Canceled,
}

export const UseSealApprovalStatusMap = new Map<UseSealApprovalStatus, string>([
  [UseSealApprovalStatus.Processing, '审批中'],
  [UseSealApprovalStatus.Normal, '审批成功'],
  [UseSealApprovalStatus.Failure, '审批失败'],
  [UseSealApprovalStatus.Canceled, '已撤销'],
]);

export const UseSealScanStatusMap = new Map<UseScanStatus, string>([
  [UseScanStatus.Processing, '未上传'],
  [UseScanStatus.Normal, '待审核'],
  [UseScanStatus.Failure, '通过'],
  [UseScanStatus.Canceled, '驳回'],
]);

export default defineComponent({
  name: 'sealUseRecord',
  components: {
    scanFileApproval,
    useSealDetail,
    annexDialog,
    workbenchTimeLine,
  },
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        date: [],
        username: undefined,
        reason: undefined,
        approval_status: undefined,
        total: 0,
      } as UseSealForm;
    };

    const loading = ref(false);
    const detailLoading = ref(false);
    const scanFileApprovalRef = ref<ScanFileApprovalType | undefined>(undefined);

    const approvalStatusOptions = [
      UseSealApprovalStatus.Processing,
      UseSealApprovalStatus.Normal,
      UseSealApprovalStatus.Failure,
      UseSealApprovalStatus.Canceled,
    ].map(el => ({ value: el, label: UseSealApprovalStatusMap.get(el) ?? '' }));

    const queryForm = ref(initQueryForm());
    const tableData = ref<UseSealsModel[]>([]);
    const sealRecordDetailRef = ref<SealRecordDetailType | undefined>(undefined);

    const flowLoading = ref<boolean>(false);
    const flowErrorMsg = ref<string | undefined>(undefined);
    // const recordDetail = ref<ApprovalInfo | undefined>(undefined);
    const flowRecordDetailList = ref<ApprovalInfo[]>([]);
    const approvalRecordDetailList = ref<ApprovalInfo[]>([]);

    const methods = {
      async queryUseSeals() {
        const { date, total, ...rest } = queryForm.value;
        const [start_date, end_date] = date ?? [];
        loading.value = true;
        const [res] = await wait(
          500,
          QueryUseSeals({
            apply_date_begin: start_date,
            apply_date_end: end_date,
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          queryForm.value.total = res.data.data.total;
          tableData.value = res.data.data.data ?? [];
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.queryUseSeals();
      },
      onResetHandler() {
        queryForm.value = initQueryForm();
        methods.onQueryHandler();
      },
      onRowHandler(row: UseSealsModel) {
        const index = tableData.value.findIndex(el => el.id === row.id);
        const detail = approvalRecordDetailList.value[index];
        if (detail) {
          sealRecordDetailRef.value?.show(detail);
          return;
        }
        methods.queryApprovalInfo(row.id, false, index);
      },
      async queryApprovalInfo(approval_id: number, isFlow: boolean, index: number) {
        if (isFlow) {
          flowLoading.value = true;
        } else {
          detailLoading.value = true;
        }
        const [res] = await wait(
          500,
          QueryApprovalInfo({
            approval_id,
          }),
        );
        detailLoading.value = false;
        flowLoading.value = false;
        if (res.data.success) {
          const detail = res.data.data;
          if (isFlow) {
            // recordDetail.value = res.data.data;
            flowRecordDetailList.value[index] = detail;
          } else {
            approvalRecordDetailList.value[index] = detail;
            sealRecordDetailRef.value?.show(detail);
          }
        } else {
          if (isFlow) {
            flowErrorMsg.value = res.data.message || '';
          } else {
            ctx.root.$message.error(res.data.message ?? '获取用印详情失败，请稍后重试');
          }
        }
      },
      getAnnexList(contract: UseSealsModel | undefined) {
        if (contract === undefined) {
          return [];
        }
        try {
          const attachment_url_list =
            contract?.attachment?.map(el => ({
              ...el,
              status: contract.approval_status,
              status_str: contract.approval_status
                ? UseSealApprovalStatusMap.get(contract.approval_status)
                : '--',
              type: '附件',
            })) ?? [];
          const contract_scan_urls =
            contract?.scan?.map(el => ({
              ...el,
              status: contract.scan_status,
              status_str: contract.scan_status
                ? UseSealScanStatusMap.get(contract.scan_status)
                : '--',
              type: '扫描件',
            })) ?? [];
          return [
            /** 合同附件 */
            ...attachment_url_list,
            /** 合同扫描件 */
            ...contract_scan_urls,
          ];
        } catch (ex: any) {
          return [];
        }
      },
      formatAmount,
    };

    const annexDialogVisible = ref(false);
    const checkedRow = ref<UseSealsModel | undefined>(undefined);

    const annexList = computed(() => methods.getAnnexList(checkedRow.value));

    provide('annex-data', annexList);
    provide('annex-dialog-visible', annexDialogVisible);

    const onAnnexDialogClose = () => {
      annexDialogVisible.value = false;
      checkedRow.value = undefined;
    };

    const statusTextClass = (row: UseSealsModel) => {
      let str = '';
      switch (row.approval_status) {
        case UseSealApprovalStatus.Processing:
          str = 'processing';
          break;
        case UseSealApprovalStatus.Normal:
          str = 'normal';
          break;
        case UseSealApprovalStatus.Failure:
          str = 'failure';
          break;
        case UseSealApprovalStatus.Canceled:
          str = 'canceled';
          break;
        default:
          break;
      }
      return `use-seal-record-status-${str}`;
    };

    const columns = ref<Col[]>([
      {
        label: '申请日期',
        minWidth: 80,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.start_time ? row.start_time.replace(/-/g, '.') : '--';
        },
      },
      {
        label: '申请人',
        minWidth: 66,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.username ? row.username : '--';
        },
      },
      {
        label: '部门',
        minWidth: 80,
        align: 'left',
        showOverflowTooltip: true,
        formatter: row => {
          return row.create_department ? row.create_department : '--';
        },
      },
      {
        label: '审批状态',
        minWidth: 80,
        align: 'center',
        showOverflowTooltip: true,
        formatter: (row, _, __, index) => {
          const contract_status_str =
            UseSealApprovalStatusMap.get(row.approval_status) || DefText();

          const status_str = (slot = false) =>
            h(
              'span',
              {
                class: statusTextClass(row),
                ...(slot ? { slot: 'reference' } : {}),
              },
              [contract_status_str],
            );

          // const status_str2 = (slot = false) =>
          //   h(
          //     'span',
          //     {
          //       // class: `fg-${ApprovalStatus[row.contract_info.contract_status]}`.toLowerCase(),
          //       ...(slot ? { slot: 'reference' } : {}),
          //     },
          //     [contract_status_str],
          //   );

          if (
            ![UseSealApprovalStatus.Failure, UseSealApprovalStatus.Processing].includes(
              row.approval_status,
            )
          ) {
            return h('div', [status_str(false), ' ']);
          }
          // return status_str;
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
                    // popperClass: 'oa-approve-progress-popper',
                    openDelay: 300,
                    popperOptions: { boundariesElement: 'body', gpuAcceleration: false },
                  },
                  on: {
                    show: () => {
                      if (!flowRecordDetailList.value[index]) {
                        methods.queryApprovalInfo(row.id, true, index);
                      } else {
                        flowRecordDetailList.value = deepClone(flowRecordDetailList.value) as [];
                      }
                      // oaFlows.onFlowsShow(row.id);
                    },
                    hide: () => {
                      // recordDetail.value = undefined;
                      flowErrorMsg.value = undefined;
                      // oaFlows.onFlowsHide();
                    },
                  },
                  // key: `${JSON.stringify(flowRecordDetailList.value[index])}-${index}`,
                },
                [
                  status_str(true),
                  h(
                    'div',
                    {
                      style: {
                        maxHeight: '240px',
                        overflow: 'overlay',
                      },
                    },
                    [
                      flowLoading.value
                        ? [h('div', ['正在查询进度...'])]
                        : flowErrorMsg.value
                        ? [flowErrorMsg.value]
                        : h(workbenchTimeLine, {
                            props: {
                              'step-status': row.approval_status,
                              items: flowRecordDetailList.value[index]?.approval_flow_detail ?? [],
                            },
                          }),
                    ],
                  ),
                ],
              ),
            ],
          );
          // return row.approval_status ? UseSealApprovalStatusMap.get(row.approval_status) : '--';
        },
      },
      {
        label: '用印原因说明',
        minWidth: 140,
        showOverflowTooltip: true,
        formatter: row => {
          return row.reason ? row.reason : '--';
        },
      },
      {
        label: '印章名称',
        minWidth: 80,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.seal_name ? row.seal_name : '--';
        },
      },
      {
        label: '涉及金额 (元)',
        minWidth: 100,
        align: 'right',
        showOverflowTooltip: true,
        formatter: row => {
          return methods.formatAmount(row.amount_involved ?? 0, 'None');
        },
      },
      {
        label: '所属事项',
        minWidth: 80,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.matter_name ? row.matter_name : '--';
        },
      },
      {
        label: '附件/扫描件',
        minWidth: 96,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return methods.getAnnexList(row).length > 0
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
            : DefText();
        },
      },
      {
        label: '扫描件审批',
        minWidth: 86,
        showOverflowTooltip: true,
        formatter: row => {
          if (row.approval_status === 2 && row.scan_status === 1) {
            return h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: (event: MouseEvent) => {
                    scanFileApprovalRef.value?.show(row);
                    event.stopPropagation();
                  },
                },
              },
              ['审核'],
            );
          } else {
            return '';
          }
        },
      },
    ]);

    onMounted(async () => {
      methods.onQueryHandler();
    });

    watch(
      () => tableData.value,
      () => {
        flowRecordDetailList.value = [];
        approvalRecordDetailList.value = [];
      },
    );

    return {
      onAnnexDialogClose,
      loading,
      detailLoading,
      approvalStatusOptions,
      tableData,
      columns,
      queryForm,
      selectControlPopoverHide,
      scanFileApprovalRef,
      // daylyReportStatistics,
      sealRecordDetailRef,
      ...methods,
    };
  },
  render() {
    const addBtnProps = {
      props: {
        title: '附件',
      },
      on: {
        'dialog:close': () => {
          this.onAnnexDialogClose();
        },
      },
    };
    return (
      <div class="tg-legal-seal-use-record_month-container">
        <section class="query-field">
          <el-form size="mini" label-width="60px">
            <el-form-item label="申请日期：">
              <el-date-picker
                style="width: 210px;"
                v-model={this.queryForm.date}
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                editable={false}
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="申请人：">
              <el-input
                style="width: 210px;"
                v-model={this.queryForm.username}
                clearable
                placeholder="请输入申请人"
                v-key-enter={this.onQueryHandler}
              ></el-input>
            </el-form-item>
            <el-form-item label="用印原因：">
              <el-input
                style="width: 210px;"
                v-model={this.queryForm.reason}
                clearable
                placeholder="请输入用印原因"
                v-key-enter={this.onQueryHandler}
              ></el-input>
            </el-form-item>
            <el-form-item label="审批状态：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 210px;"
                v-model={this.queryForm.approval_status}
                clearable
                filterable
                placeholder="请选择审批状态"
                on-focus={this.selectControlPopoverHide}
              >
                <el-option label="全部" value={undefined} key={undefined}></el-option>
                {this.approvalStatusOptions.map(el => {
                  return <el-option label={el.label} value={el.value} key={el.value}></el-option>;
                })}
              </el-select>
            </el-form-item>
            <el-form-item label="" label-width="0">
              <div>
                <tg-button type="primary" on-click={() => this.onQueryHandler()}>
                  查询
                </tg-button>
                <tg-button class="mgl-8" on-click={() => this.onResetHandler()}>
                  重置
                </tg-button>
              </div>
            </el-form-item>
          </el-form>
        </section>
        <section class="table-field">
          <div style="height: 100%;">
            <el-table
              border
              stripe
              v-loading={this.loading}
              height="100%"
              data={this.tableData}
              row-style={{
                cursor: 'pointer',
              }}
              on-row-click={this.onRowHandler}
            >
              {this.columns.map((column, index) => (
                <el-table-column props={{ ...column }} key={column.label}></el-table-column>
              ))}
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
            </el-table>
          </div>
        </section>
        {this.tableData.length > 0 && (
          <section class="pagination-field">
            <el-pagination
              current-page={this.queryForm.page_num}
              page-sizes={[20, 30, 50, 100]}
              pageSize={this.queryForm.num}
              total={this.queryForm.total}
              oncurrent-change={(page_num: number) => {
                this.queryForm.page_num = page_num;
                this.onQueryHandler(page_num);
              }}
              onsize-change={(num: number) => {
                this.queryForm.num = num;
                this.onQueryHandler();
              }}
              layout="total, prev, pager, next, sizes, jumper"
            />
          </section>
        )}
        <scanFileApproval
          ref="scanFileApprovalRef"
          on-save={() => this.onQueryHandler()}
        ></scanFileApproval>
        <useSealDetail ref="sealRecordDetailRef"></useSealDetail>
        <annexDialog {...addBtnProps} />
        <tg-mask-loading visible={this.detailLoading} content="正在获取详情，请稍候..." />
      </div>
    );
  },
});
