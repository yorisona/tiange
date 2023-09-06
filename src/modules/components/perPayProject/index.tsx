import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUpdated,
  ref,
  UnwrapRef,
} from '@vue/composition-api';

import { columns, prepayModel, prepayQueryForm, statusTypeOption } from './use/index';
import { useDialog } from '@/use/dialog';
import prePayAudit from './dialog/prePayAudit.vue';
import { ElTable } from 'element-ui/types/table';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { wait } from '@/utils/func';
import MakeInvoiceDialog from '@/modules/workbench/initiate/lnvoice2/index.vue';
import achievement from '@/modules/live/project/dialog/achievement.vue';
import reverseOrderDialog from '@/modules/settlement/component/reverseOrder.vue';
import { BusinessTypeEnum } from '@/types/tiange/common';
import useVisible from '@/use/visible';
import refundDialog from '@/modules/marketing/project/dialog/refund/form.vue';
import {
  DeletePrePayInfo,
  GetProjectPrePayList,
  SaveProjectPrePayReverseApply,
} from '@/services/common/project';
import { formatAmount } from '@/utils/string';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'registerList',
  components: {
    MakeInvoiceDialog,
    achievement,
    reverseOrderDialog,
    refundDialog,
  },
  setup(props, ctx) {
    const initQueryForm = (): prepayQueryForm => {
      return {
        company_name: undefined,
        page_num: 1,
        num: 20,
        audit_status: undefined,
      };
    };
    /*   const { project_id, isFromMarketing, isFromLive, isFromCommon, project_type, business_type } =
      useProjectBaseInfo();*/
    const project = JSON.parse(JSON.stringify(inject('project')));
    const isHideReversed = ref(true);
    const MakeInvoiceDialogRef = ref<{ show(settlement: any, openType?: number): void } | null>(
      null,
    );
    // 收款登记弹框
    const achievementRef =
      ref<UnwrapRef<{ show: (obj?: any, btype?: any, liveDouyin?: boolean) => void } | null>>(null);
    const reverseOrderDialogRef = ref<{
      open: (cb: (msg: string) => Promise<boolean>, reverse_reason?: string) => void;
    } | null>(null);
    const refundDialogVisible = ref(false);
    const refundRow = ref<any>({
      achievement_id: '',
      achievement_uid: '',
      project_name: '',
      gather_amount: 0,
      project_id: '',
      business_type: '',
    });
    const dialog = useDialog({
      component: prePayAudit,
      width: '368px',
      title: '登记预收',
      footer: false,
      on: {
        submit() {
          queryForm.value.page_num = 1;
          methods.queryProjectPrePayReq();
        },
      },
    });
    const queryForm = ref<prepayQueryForm>(initQueryForm());
    const tableData = ref<any[]>([]);
    const total = ref<number>(0);
    const loading = ref<boolean>(false);
    const methods = {
      query() {
        queryForm.value.page_num = 1;
        methods.queryProjectPrePayReq();
      },
      reset() {
        queryForm.value = initQueryForm();
        methods.queryProjectPrePayReq();
      },
      queryProjectPrePayReq: async () => {
        loading.value = true;
        const res = await GetProjectPrePayList(
          {
            page_num: 1,
            num: 1000,
            status: queryForm.value.audit_status,
            project_uid: project.value.project_uid,
            is_hide_reverse_data: isHideReversed.value ? 1 : undefined,
            company_name: queryForm.value.company_name || undefined,
          },
          project.value.business_type,
        );
        loading.value = false;
        if (res.data.success) {
          tableData.value = res.data.data.data || [];
          total.value = res.data.data.total;
          statistics_data.value = res.data.data.total_amount as any;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      handleCurrentChange(val: number) {
        queryForm.value.page_num = val;
        methods.queryProjectPrePayReq();
      },
      currentSizeChange(val: number) {
        queryForm.value.num = val;
        methods.queryProjectPrePayReq();
      },
    };

    onMounted(async () => {
      methods.queryProjectPrePayReq();
    });
    const statistics_data = ref<any>();
    const numFormat = (num: string) => {
      const res = num.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ',';
        });
      });
      return res;
    };
    const summaryMethod = () => {
      if (statistics_data.value === undefined) return [];
      const arr = [
        '合计',
        '--',
        '--',
        '--',
        statistics_data.value.total_register_amount !== null
          ? formatAmount((statistics_data.value.total_register_amount || 0) / 100)
          : '--',
        statistics_data.value.total_income_amount !== null
          ? formatAmount((statistics_data.value.total_income_amount || 0) / 100)
          : '--',
        statistics_data.value.total_un_income_amount !== null
          ? formatAmount((statistics_data.value.total_un_income_amount || 0) / 100)
          : '--',
        statistics_data.value.total_write_off_amount !== null
          ? formatAmount((statistics_data.value.total_write_off_amount || 0) / 100)
          : '--',
        statistics_data.value.total_un_write_off_amount !== null
          ? formatAmount((statistics_data.value.total_un_write_off_amount || 0) / 100)
          : '--',
        statistics_data.value.total_refund_amount !== null
          ? formatAmount((statistics_data.value.total_refund_amount || 0) / 100)
          : '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
        '--',
      ];
      return arr;
    };
    // 自适应表格高度部分
    // const topCardHeightStr = ref('calc(100vh - 290px)');
    const topCardHeight = ref(60);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    /** 本地生活 */
    const { isFromLocalLife, isFromLiveDouyin, isFromSupplyChain } = useProjectBaseInfo();
    const topCardHeightStr = computed(() => {
      const height = isFromLocalLife.value || isFromLiveDouyin.value ? 145 : 190;
      const topCardHeight_s = String(Number(topCardHeight.value + height).toFixed(0));
      return 'calc(100vh - ' + topCardHeight_s + 'px)';
    });
    const projectPrepayTable = ref<ElTable>();
    onUpdated(() => {
      if (projectPrepayTable.value) {
        projectPrepayTable.value?.doLayout();
      }
    });
    const reload = () => {
      methods.queryProjectPrePayReq();
    };
    const { visible: writeOffLoading, toggleVisible: toggleWriteOffLoading } = useVisible();
    /** 冲销动作 */
    const onWriteOffConfirmResolve = async (row: any, msg: string) => {
      toggleWriteOffLoading();
      const params = {
        record_id: row.id,
        reverse_reason: msg,
      };
      const res = await SaveProjectPrePayReverseApply(params, project.value.business_type);

      toggleWriteOffLoading();
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '冲销成功');
        reload();
      } else {
        ctx.root.$message.error(res.data.message ?? '冲销失败');
      }

      return res.data.success;
    };
    const rowClick = async (row: prepayModel, type = 1) => {
      if (type === 0) {
        const result = await AsyncConfirm(ctx, {
          title: '是否删除该条预收单？',
          confirmText: '删除',
        });
        if (!result) {
          return;
        }
        loading.value = true;
        const [{ data: response }] = await wait(
          500,
          DeletePrePayInfo({ record_id: row.id }, project.value.business_type),
        );
        loading.value = false;
        if (response.success) {
          ctx.root.$message.success('删除成功');
          await reload();
        } else {
          ctx.root.$message.error(response.message ?? '删除失败');
        }
        return;
      }
      const isMcn = ctx.root.$route.name === 'CommonBusinessProjectDetail'; // 创新项目
      const isBrand = ctx.root.$route.name === 'SSLiveProjectDetail'; // 品牌中心业务
      const isMarketing = ctx.root.$route.name === 'MarketingProjectDetail'; // 整合营销业务
      switch (type) {
        case 1:
          MakeInvoiceDialogRef.value?.show(
            {
              ...row,
              seller:
                project.value?.company_subject !== null
                  ? E.project.ProprietorTypeMap.get(project.value?.company_subject || 0)
                  : '',
            },
            0,
          );
          return;
          break;
        case 2:
          achievementRef.value?.show(
            row,
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
          return;
          break;
        case 3:
          refundRow.value.record_id = row.id;
          refundRow.value.achievement_uid = row.uid;
          refundRow.value.project_name = row.project_name;
          refundRow.value.gather_amount = (row.un_write_off_amount || 0) / 100;
          refundRow.value.project_id = project.value.project_id || row.project_id;
          refundRow.value.business_type = row.business_type;
          refundRow.value.contract_id = row.contract_id || undefined;
          refundRow.value.company_name = row.company_name || undefined;
          refundRow.value.company_id = row.company_id || undefined;
          refundRow.value.contract_company_name = row.contract_company_name || undefined;
          refundDialogVisible.value = true;
          return;
          break;
        case 4:
          reverseOrderDialogRef.value?.open(msg => onWriteOffConfirmResolve(row, msg), '');
          return;
          break;
        case 5:
          reasonDialogTitle.value = row.status === 2 ? '查看审核意见' : '冲销拒绝原因';
          reason.value = row.status === 2 ? row.audit_reason : row.reverse_audit_reason;
          reasonDialogVisible.value = true;
          return;
          break;
        default:
          dialog.show(row);
      }
    };
    const prepayHandler = () => {
      dialog.show(project);
    };
    const reasonDialogVisible = ref(false);
    const reasonDialogTitle = ref<string>('');
    const reason = ref('');
    const onReasonDialogClose = () => {
      reason.value = '';
      reasonDialogVisible.value = false;
    };
    return {
      onReasonDialogClose,
      reason,
      reasonDialogVisible,
      reasonDialogTitle,
      project,
      prepayHandler,
      refundRow,
      refundDialogVisible,
      writeOffLoading,
      reverseOrderDialogRef,
      achievementRef,
      MakeInvoiceDialogRef,
      isHideReversed,
      reload,
      rowClick,
      statusTypeOption,
      numFormat,
      projectPrepayTable,
      dialog,
      topCardHeight,
      topCardHeightStr,
      onTopCardRectUpdate,
      total,
      queryForm,
      tableData,
      columns,
      loading,
      summaryMethod,
      // dialog,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <tg-card class="prepay-container" padding={0}>
          <tg-card
            class="prepay-background-card"
            padding={[16, 0, 4, 16]}
            on={{ 'rect:update': this.onTopCardRectUpdate }}
          >
            <el-form
              class="prepay-filter-form"
              size="mini"
              label-width="60px"
              attrs={{
                model: this.formData,
              }}
            >
              <div class="prepay-filter-form-div">
                <div class="prepay-filter-form-item">
                  <el-form-item label="客户名称：">
                    <el-input
                      style="width: 100%"
                      v-model={this.queryForm.company_name}
                      placeholder="请输入"
                      v-key-enter={this.query}
                    />
                  </el-form-item>
                </div>
                <div class="prepay-filter-form-item">
                  <el-form-item label="审核状态：">
                    <el-select
                      popper-class="el-select-popper-mini"
                      v-model={this.queryForm.audit_status}
                      class="prepay-select"
                      placeholder="请选择审核状态"
                      style="width: 100%"
                    >
                      <el-option label="全部" value={undefined} key={undefined}></el-option>
                      {this.statusTypeOption.map((el, index) => {
                        return (
                          <el-option label={el.label} value={el.value} key={index + 1}></el-option>
                        );
                      })}
                    </el-select>
                  </el-form-item>
                </div>
                <div class="prepay-filter-form-item btns">
                  <el-form-item label-width="0">
                    <div class="prepay-filter-form-item-btn">
                      <tg-button type="primary" onClick={this.query}>
                        查询
                      </tg-button>
                      <tg-button class="mgl-8" onClick={this.reset}>
                        重置
                      </tg-button>
                      <tg-button class="mgl-8" onClick={this.prepayHandler}>
                        预收
                      </tg-button>
                    </div>
                  </el-form-item>
                </div>
                <div class="prepay-filter-form-item reverse-div">
                  <el-checkbox
                    on-change={() => {
                      this.reload();
                    }}
                    v-model={this.isHideReversed}
                    size="small"
                  >
                    <span>隐藏已冲销数据</span>
                  </el-checkbox>
                </div>
              </div>
            </el-form>
          </tg-card>
          <tg-card class="prepay-background-card" padding={[0, 16, 0, 16]}>
            <el-table
              ref="projectPrepayTable"
              height={this.topCardHeightStr}
              v-loading={this.loading}
              border
              class="prepay-table"
              data={this.tableData}
              show-summary
              summary-method={this.summaryMethod}
            >
              {this.columns &&
                this.columns.map((col, colIndex) => {
                  return <el-table-column key={colIndex} props={{ ...col }} />;
                })}
              <el-table-column
                label="操作"
                fixed={'right'}
                align="left"
                minWidth={160}
                scopedSlots={{
                  default: ({ row }: any) => {
                    return (
                      <div class="information-div">
                        {(row.status === 2 || row.status === 1) && (
                          <tg-button
                            type="link"
                            onClick={() => {
                              this.rowClick(row, 0);
                            }}
                          >
                            删除
                          </tg-button>
                        )}

                        {row.status === 4 && row.un_invoiced_amount > 0 && (
                          <tg-button
                            type="link"
                            onClick={() => {
                              this.rowClick(row, 1);
                            }}
                          >
                            开票
                          </tg-button>
                        )}
                        {row.status === 4 && row.un_income_amount > 0 && (
                          <tg-button
                            type="link"
                            onClick={() => {
                              this.rowClick(row, 2);
                            }}
                          >
                            收款
                          </tg-button>
                        )}
                        {row.status === 4 && row.un_write_off_amount > 0 && (
                          <tg-button
                            type="link"
                            onClick={() => {
                              this.rowClick(row, 3);
                            }}
                          >
                            退款
                          </tg-button>
                        )}
                        {row.status === 4 && row.write_off_amount === 0 && row.refund_amount === 0 && (
                          <tg-button
                            type="link"
                            class="red-btn"
                            onClick={() => {
                              this.rowClick(row, 4);
                            }}
                          >
                            冲销
                          </tg-button>
                        )}
                        {(row.status === 2 || row.reverse_audit_reason) && (
                          <tg-button
                            type="link"
                            onClick={() => {
                              this.rowClick(row, 5);
                            }}
                          >
                            查看
                          </tg-button>
                        )}
                      </div>
                    );
                  },
                }}
              />

              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
            </el-table>
            {/* {this.tableData.length > 0 && (
              <div class="prepay-pagination">
                <el-pagination
                  class="flex-none"
                  current-page={this.queryForm.page_num}
                  page-sizes={[10, 20, 30, 50, 100]}
                  page-size={this.queryForm.num}
                  total={this.total}
                  layout="total, prev, pager, next, sizes, jumper"
                  on-current-change={this.handleCurrentChange}
                  on-size-change={this.currentSizeChange}
                />
              </div>
            )}*/}
          </tg-card>
        </tg-card>
        <make-invoice-dialog
          isFromPrePay={true}
          title={'预收款开票'}
          ref="MakeInvoiceDialogRef"
          reload={true}
          on-success={this.reload}
        />
        <achievement isFromPrePay={true} ref="achievementRef" on-ok={this.reload} />
        <reverseOrderDialog isFromPrePay={true} ref="reverseOrderDialogRef" />
        <tg-mask-loading visible={this.writeOffLoading} content="正在提交冲销，请稍候..." />
        {this.refundDialogVisible ? (
          <refundDialog
            visible={this.refundDialogVisible}
            isFromPrePay={true}
            row={this.refundRow}
            on={{
              'dialog:close': () => {
                this.refundDialogVisible = false;
                this.reload();
              },
            }}
          />
        ) : (
          ''
        )}
        <el-dialog
          class="tg-dialog-classic tg-dialog-vcenter"
          visible={this.reasonDialogVisible}
          width="440px"
          on-close={this.onReasonDialogClose}
        >
          <template slot={'title'}>{this.reasonDialogTitle}</template>
          <div class="reason-dialog-content">{this.reason}</div>
        </el-dialog>
      </div>
    );
  },
});
