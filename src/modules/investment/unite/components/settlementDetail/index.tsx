import { defineComponent, reactive, toRefs, ref, computed } from '@vue/composition-api';
import moment from 'moment';
import { numberFormat } from '@/utils/formatMoney';
import { getToken } from '@/utils/token';
import { PostConfirmUnity, PostRefreshUnit } from '@/services/investment';
export default defineComponent({
  props: {
    is_estimate: {
      type: String,
      default: '1',
    },
  },
  setup(prop, ctx) {
    const dialogState = reactive({
      visible: false,
      saveLoading: false,
      hideFooter: true,
      tableLoading: false,
    });
    const detailData: any = ref({
      project_details: [],
    });
    const filesList = computed(() => {
      if (!detailData.value.order_file) return [];
      const arr = detailData.value.order_file.split(',');
      return arr.map((item: string) => {
        const s = item.split('/');
        return {
          url: item,
          name: s[s.length - 1],
        };
      });
    });
    const closeHandler = () => {
      dialogState.visible = false;
      dialogState.tableLoading = false;
      ctx.emit('success');
    };
    const saveHandler = async () => {
      dialogState.saveLoading = true;
      try {
        const { data } = await PostConfirmUnity(detailData.value.id);

        if (data.success) {
          ctx.root.$message.success('提交成功');
          closeHandler();
        } else {
          return Promise.reject();
        }
      } catch (_) {
        ctx.root.$message({
          type: 'warning',
          message: '提交失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      } finally {
        dialogState.saveLoading = false;
      }
    };
    const lastDay = computed(() =>
      moment(detailData.value.settlement_date).endOf('month').format(' ~ MM.DD'),
    );
    const columns = computed(() => {
      const hasShowVersion2 = detailData.value?.project_details[0]?.version === 2;
      return [
        {
          label: '项目名称',
          prop: 'project_name',
          minWidth: 198,
          align: 'center',
          headerAlign: 'center',
        },
        {
          label: 'GMV (元)',
          minWidth: 162,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) => numberFormat(unite.total_gmv, 2, '.', ','),
        },
        hasShowVersion2 && {
          label: '预估总佣金 (元)',
          minWidth: 162,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) => numberFormat(unite.shop_commission_amount, 2, '.', ','),
        },
        {
          label: hasShowVersion2 ? '预估机构佣金 (元)' : '预估佣金金额 (元)',
          minWidth: 162,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) => numberFormat(unite.commission_amount, 2, '.', ','),
        },
        {
          label: '平均佣金比例',
          minWidth: 152,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) =>
            isNaN(unite.commission_rate) ? '--' : unite.commission_rate + '%',
        },
      ].filter(Boolean);
    });
    const autoColumns = computed(() => [
      {
        label: '项目名称',
        prop: 'project_name',
        minWidth: 198,
        align: 'center',
        headerAlign: 'center',
      },
      {
        label: '佣金 (元)',
        minWidth: 162,
        align: 'right',
        headerAlign: 'right',
        formatter: (unite: any) => numberFormat(unite.commission_amount, 2, '.', ','),
      },
      {
        label: '技术服务费 (元)',
        minWidth: 162,
        align: 'right',
        headerAlign: 'right',
        formatter: (unite: any) => numberFormat(unite.settled_tech_service_fee, 2, '.', ','),
      },
    ]);

    const costColumns = computed(() => {
      const result = [
        {
          label: '项目名称',
          prop: 'project_name',
          minWidth: 198,
          align: 'center',
          headerAlign: 'center',
        },
        {
          label: '机构佣金 (元)',
          minWidth: 152,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) => numberFormat(unite.institution_commission_amount, 2, '.', ','),
        },
      ];
      if (detailData.value.is_estimate !== 0) {
        result.push({
          label: '退货率',
          minWidth: 82,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) =>
            unite.pay_rate !== null ? numberFormat(Number(unite.refund_rate), 2) + '%' : '--',
        });
        result.splice(1, 0, {
          label: '达人',
          minWidth: 82,
          align: 'center',
          headerAlign: 'center',
          formatter: (unite: any) => (unite.kol_name ? unite.kol_name : '--'),
        });
      }
      result.push(
        {
          label: '达人分成比例',
          minWidth: 100,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) =>
            unite.pay_rate !== null ? numberFormat(Number(unite.kol_divide), 2) + '%' : '--',
        },
        {
          label: '预估达人佣金 (元)',
          minWidth: 152,
          align: 'right',
          headerAlign: 'right',
          formatter: (unite: any) => numberFormat(unite.commission_amount, 2, '.', ','),
        },
      );
      return result;
    });
    const show = (detail: any, showFoot: boolean) => {
      detailData.value = detail;
      dialogState.visible = true;
      dialogState.hideFooter = showFoot;
    };
    const downFile = (url: string) => {
      window.open(url + `?Authorization=${getToken()}`);
    };
    const refreshHandler = async () => {
      try {
        const { data } = await PostRefreshUnit(detailData.value.id);
        if (data.success) {
          ctx.root.$message({
            type: 'success',
            message: data.message,
            duration: 3000,
            showClose: true,
          });
          dialogState.tableLoading = true;
        }
      } catch (_) {
        ctx.root.$message({
          type: 'warning',
          message: '刷新失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    return {
      ...toRefs(dialogState),
      closeHandler,
      refreshHandler,
      autoColumns,
      costColumns,
      show,
      saveHandler,
      downFile,
      filesList,
      detailData,
      columns,
      lastDay,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          class="customer-dialog tg-dialog-vcenter-new unite-detail-dialog"
          visible={this.visible}
          width="884px"
          close-on-click-modal={false}
          title="结算明细"
          onClose={() => {
            this.closeHandler();
          }}
        >
          <tg-card padding={18} style="height: 450px;overflow-y: auto;">
            <div class="detail-item">
              <span class="label">结算周期：</span>
              <span class="value">
                {this.detailData.settlement_date?.replace(/-/gi, '.')}
                {this.lastDay}
              </span>
            </div>
            {this.is_estimate === '1' ? (
              <div class="detail-description">
                <span class="label">GMV</span>
                <span class="value">￥{numberFormat(this.detailData.total_gmv, 2, '.', ',')}</span>
                <span class="label">预估佣金金额</span>
                <span class="value">
                  ￥{numberFormat(this.detailData.commission_amount, 2, '.', ',')}
                </span>
              </div>
            ) : this.is_estimate === '0' ? (
              <div class="detail-description">
                <span class="label">佣金</span>
                <span class="value">
                  ￥{numberFormat(this.detailData.commission_amount, 2, '.', ',')}
                </span>
                {!(this.detailData.status === 2 || this.detailData.status === 4) && (
                  <el-button
                    class="refresh-btn"
                    type="text"
                    icon="el-icon-refresh"
                    disabled={this.tableLoading}
                    onClick={this.refreshHandler}
                  >
                    {this.tableLoading ? '请稍后查看' : '刷新数据'}
                  </el-button>
                )}
              </div>
            ) : (
              <div class="detail-description">
                <span class="label">预估达人佣金</span>
                <span class="value">
                  ￥{numberFormat(this.detailData.commission_amount, 2, '.', ',')}
                </span>
                {!(this.detailData.status === 2 || this.detailData.status === 4) && (
                  <el-button
                    class="refresh-btn"
                    type="text"
                    icon="el-icon-refresh"
                    disabled={this.tableLoading}
                    onClick={this.refreshHandler}
                  >
                    {this.tableLoading ? '请稍后查看' : '刷新数据'}
                  </el-button>
                )}
              </div>
            )}

            <div class="detail-table">
              <tg-table
                border
                stripe
                height="310"
                width="100%"
                class="mgt-12 investment-unite-table-content"
                data={this.detailData.project_details}
              >
                {this.is_estimate === '1'
                  ? this.columns.map((col, colIndex) => (
                      <el-table-column props={{ ...col }} key={colIndex} />
                    ))
                  : this.is_estimate === '0'
                  ? this.autoColumns.map((col, colIndex) => (
                      <el-table-column props={{ ...col }} key={colIndex} />
                    ))
                  : this.costColumns.map((col, colIndex) => (
                      <el-table-column props={{ ...col }} key={colIndex} />
                    ))}
                {this.detailData.project_details.length === 0 && (
                  <template slot="empty">
                    <empty-common detail-text="暂无项目"></empty-common>
                  </template>
                )}
              </tg-table>
            </div>
            <div class="detail-item down-file" style="margin-top: 18px; margin-bottom: 0px">
              <span class="label">账单文件：</span>
              <div class="file-row">
                {this.filesList.map((item: any) => (
                  <div>
                    <span class="file-item">{decodeURI(item.name)}</span>
                    <tg-icon
                      name="ico-xiazai"
                      class="down-icon"
                      onClick={() => {
                        this.downFile(item.url);
                      }}
                    ></tg-icon>
                  </div>
                ))}
              </div>
            </div>
          </tg-card>
          <template slot="footer">
            <tg-button
              onClick={() => {
                this.visible = false;
              }}
            >
              退出
            </tg-button>
            {(this.detailData.status === 1 || this.detailData.status === 5) && !this.hideFooter && (
              <tg-button
                type="primary"
                onClick={() => {
                  this.saveHandler();
                }}
              >
                财务确认
              </tg-button>
            )}
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="  正在提交，请稍候..." />
      </div>
    );
  },
});
