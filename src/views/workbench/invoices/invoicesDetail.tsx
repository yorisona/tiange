/*
 * @Author: 肖槿
 * @Date: 2021-08-18 14:30:34
 * @Description: 开票详情
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-01-21 14:30:07
 * @FilePath: \goumee-star-frontend\src\views\workbench\invoices\invoicesDetail.tsx
 */
import { defineComponent, ref, SetupContext, h, computed } from '@vue/composition-api';
import { Decimal2String } from '@/utils/string';
import workbenchTimeLine from '@/views/workbench/components/workbenchTimeLine.vue';
import { enumLevelTwoTypes } from '@/utils/enumFunc';
import { downloadFileFromBlob } from '@/utils/func';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { getToken } from '@/utils/token';
import { UpdateApprovalStatus } from '@/services/workbentch';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
import invoiceDialog from '@/modules/workbench/initiate/lnvoice2/index.vue';
const contractStatus = new Map([
  [1, '审批中'],
  [2, '审批成功'],
  [3, '审批失败'],
  [4, '已撤销'],
]);
const useLogic = (ctx: SetupContext) => {
  const revokeLoading = ref(false);
  return {
    revokeLoading,
  };
};
export default defineComponent({
  components: {
    Appendix,
    workbenchTimeLine,
    invoiceDialog,
  },
  setup(prop, ctx) {
    const invoiceDialogRef = ref<{ show(): void } | null>(null);
    const invoiceDialogVisible = ref(false);
    const visible = ref(false);
    const invoiceLogic = useLogic(ctx);
    const invoiceDetail: any = ref({});
    const currentUserInfo: any = computed(() => ctx.root.$store.getters['user/getUserInfo']);
    const hide = () => {
      ctx.emit('close');
      visible.value = false;
    };
    const show = (detail: any) => {
      invoiceDetail.value = detail;
      visible.value = true;
    };
    const subAjax = (payload: any) => {
      return UpdateApprovalStatus(payload).then(res => {
        if (res && res.data && res.data.success) {
          ctx.root.$message.success('保存成功');
          hide();
          ctx.emit('reload:invoices');
          return res;
        } else {
          ctx.root.$message.error('保存失败');
          return res.data.message;
        }
      });
    };
    const revoke = async () => {
      const result = await AsyncConfirm(ctx, '你确定撤销吗?');
      if (result) {
        const params = {
          approval_id: invoiceDetail.value.approval_id,
          update_code: 4,
        };
        subAjax(params);
      }
    };
    const downFile = (urlString: string) => {
      if (!urlString) return false;
      const requestOptions = {
        headers: {
          Authorization: getToken() ?? '',
        },
      };
      fetch(urlString, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            const filename = decodeURIComponent(
              urlString.split('/')[urlString.split('/').length - 1],
            );
            downloadFileFromBlob(data, filename);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };
    const iconName = (extName: string) => {
      if (extName) {
        switch (extName.toLowerCase()) {
          case 'docx':
          case 'doc':
            return 'ico-word';
          case 'xlsx':
          case 'xls':
            return 'ico-excel';
          case 'pdf':
            return 'ico-pdf';
          case 'mp4':
            return 'ico-picture2';
          default:
            return 'ico-picture';
        }
      } else {
        return 'ico-picture';
      }
    };
    const renderAttachment = () => {
      if (!invoiceDetail.value.attachment) {
        return h(
          'span',
          {
            class: 'value',
          },
          '--',
        );
      } else {
        const attachments = invoiceDetail.value.attachment.map((item: string) => {
          const link = item.split('/');
          const names = link[link.length - 1];
          const suffixArr = names.split('.');
          const suffix = suffixArr[suffixArr.length - 1];
          return h(
            'span',
            {
              class: 'value',
              on: {
                click() {
                  downFile(item);
                },
              },
            },
            [
              h(
                'tg-icon',
                {
                  attrs: {
                    name: iconName(suffix),
                  },
                },
                suffix,
              ),
              names,
            ],
          );
        });
        return h('div', { class: 'load' }, [attachments]);
      }
    };
    const btnVisiable = computed(() => {
      return currentUserInfo && currentUserInfo.value.id === invoiceDetail.value.now_id;
    });
    const revocationVisiable = computed(() => {
      return currentUserInfo && currentUserInfo.value.id === invoiceDetail.value.add_by;
    });

    const showInvoiceDialog = () => {
      invoiceDialogRef.value?.show();
    };

    const reApply = async () => {
      const result = await AsyncConfirm(ctx, '你确定重新提交吗?');
      if (result) {
        Promise.resolve()
          .then(() => {
            invoiceDialogVisible.value = true;
          })
          .then(() => {
            showInvoiceDialog();
          });
      }
    };

    const confirmInvoiceDialog = () => {
      invoiceDialogVisible.value = false;
      hide();
      ctx.emit('reload:invoices');
    };

    return {
      show,
      hide,
      revoke,
      visible,
      btnVisiable,
      invoiceDetail,
      contractStatus,
      Decimal2String,
      ...invoiceLogic,
      renderAttachment,
      enumLevelTwoTypes,
      revocationVisiable,
      reApply,
      invoiceDialogRef,
      confirmInvoiceDialog,
      invoiceDialogVisible,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          class="tg-dialog-classic tg-dialog-vcenter-new new-invoice-detail-dialog"
          width="948px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.hide}
          wrapperClosable={false}
        >
          <template slot="title">开票申请详情</template>
          <div class="new-invoice-detail">
            <div class="invoice-detail">
              <div class="invoice-detail-info">
                <div class="detail-row">
                  <span class="label">申请人：</span>
                  <span class="value">{this.invoiceDetail.username}</span>
                </div>
                <div class="detail-row">
                  <span class="label">申请部门：</span>
                  <span class="value">{this.invoiceDetail.create_department}</span>
                </div>
                <div class="detail-row">
                  <span class="label">发起时间：</span>
                  <span class="value">{this.invoiceDetail.gmt_create}</span>
                </div>
                <div class="detail-row">
                  <span class="label">审批编号：</span>
                  <span class="value">{this.invoiceDetail.approval_uid}</span>
                  <span class={'contract-status status-' + this.invoiceDetail.approval_status}>
                    {this.contractStatus.get(this.invoiceDetail.approval_status)}
                  </span>
                </div>
                <div class="line"></div>
                <div class="detail-row" style="margin-top: 18px">
                  <span class="label">开票金额：</span>
                  <span class="value">{this.invoiceDetail.invoice_amount_str}</span>
                </div>
                <div class="detail-row" style="margin-top: 18px">
                  <span class="label">开票类型：</span>
                  <span class="value">
                    {this.enumLevelTwoTypes(this.invoiceDetail.level_two_types)}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">寄送方式：</span>
                  <span class="value">
                    {this.invoiceDetail.invoice_send_type === 1 ? '快递寄送' : '自行送达'}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">是否收到款项：</span>
                  <span class="value">{this.invoiceDetail.is_received ? '是' : '否'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">
                    {this.invoiceDetail.is_received ? '' : '预计'}收款时间：
                  </span>
                  <span class="value">{this.invoiceDetail.received_date || '--'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">开票内容：</span>
                  <span class="value">
                    {this.invoiceDetail.approval_detail
                      ? this.invoiceDetail.approval_detail.content_type === 1
                        ? '信息服务费'
                        : this.invoiceDetail.approval_detail.content_type === 2
                        ? '信息技术服务费'
                        : this.invoiceDetail.approval_detail.content_type_other || '--'
                      : '--'}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">发票备注：</span>
                  <span class="value  block">
                    {this.invoiceDetail.approval_detail.invoice_remark || '--'}
                  </span>
                </div>
                {(this.invoiceDetail.is_received === 1 ||
                  (this.invoiceDetail.approval_detail &&
                    this.invoiceDetail.approval_detail.deposit_received_uid)) && (
                  <div class="detail-row">
                    <span class="label">
                      {this.invoiceDetail.achievement_uid ? '收款编号：' : '预收编号：'}
                    </span>
                    <span class="value">
                      {this.invoiceDetail.achievement_uid ||
                        this.invoiceDetail.approval_detail.deposit_received_uid ||
                        ''}
                    </span>
                  </div>
                )}
                {this.invoiceDetail.approval_detail &&
                  this.invoiceDetail.approval_detail.deposit_received_uid && (
                    <div class="detail-row">
                      <span class="label">项目：</span>
                      <span class="value">{this.invoiceDetail.project_name || ''}</span>
                    </div>
                  )}
              </div>
              {this.invoiceDetail.achievement_uid && (
                <div class="invoice-detail-table">
                  <div class="detail-table-head">
                    <span class="table-head-td">项目</span>
                    <span class="table-head-td">结算单编号</span>
                    <span class="table-head-td text-r">结算金额 (元)</span>
                    <span class="table-head-td text-r">本次开票金额 (元)</span>
                  </div>
                  <div class="detail-table-body">
                    {this.invoiceDetail.details &&
                      this.invoiceDetail.details.map((item: any) => {
                        return (
                          <div class="table-body-tr">
                            <span class="table-body-td">{item.project_name}</span>
                            <span class="table-body-td">{item.settlement_no}</span>
                            <span class="table-body-td text-r">
                              {this.Decimal2String(item.settlement_amount)}
                            </span>
                            <span class="table-body-td text-r">
                              {this.Decimal2String(item.invoice_amount)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
              <div
                class="line2"
                style={{ marginTop: this.invoiceDetail.achievement_uid ? '24px' : '0' }}
              ></div>
              <div class="invoice-detail-info">
                <div class="detail-row">
                  <span class="label">销售方：</span>
                  <span class="value">{this.invoiceDetail.approval_detail.seller || '--'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">公司名称：</span>
                  <span class="value">{this.invoiceDetail.collecting_company || '--'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">纳税人识别号：</span>
                  <span class="value">{this.invoiceDetail.tax_number || '--'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">地址|电话：</span>
                  <span class="value block">
                    {this.invoiceDetail.address || '--'}&nbsp;
                    {this.invoiceDetail.phone || '--'}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">开户行|账号：</span>
                  <span class="value block">
                    {this.invoiceDetail.bank_of_deposit || '--'} &nbsp;
                    {this.invoiceDetail.bank_card_number || '--'}
                  </span>
                </div>
                {this.invoiceDetail.level_two_types === 3 && (
                  <div class="detail-row">
                    <span class="label">邮箱地址：</span>
                    <span class="value block">
                      {this.invoiceDetail.approval_detail?.email_address || '--'}
                    </span>
                  </div>
                )}
              </div>
              <div class="line2" style="margin-top:-6px"></div>
              <div class="invoice-detail-info">
                <div class="detail-row">
                  <span class="label">关联合同：</span>
                  <span class="value block">
                    {this.invoiceDetail.approval_detail &&
                    this.invoiceDetail.approval_detail.contract_uid
                      ? this.invoiceDetail.approval_detail.contract_uid
                      : '--'}
                  </span>
                </div>
                <div class="detail-row">
                  <span class="label">申请说明：</span>
                  <span class="value block">{this.invoiceDetail.remark || '--'}</span>
                </div>
                <div class="detail-row">
                  <span class="label">附件：</span>
                  {this.invoiceDetail?.attachment?.length ? (
                    <appendix list={this.invoiceDetail.attachment} />
                  ) : (
                    <span class="value">--</span>
                  )}
                </div>
              </div>
            </div>
            <div class="invoice-press">
              <h5 class="title">审批进度</h5>
              <workbenchTimeLine
                step-status={this.invoiceDetail.approval_status}
                items={this.invoiceDetail.approval_flow_detail}
              />
            </div>
          </div>
          <template slot="footer">
            <tg-button onClick={this.hide}>取消</tg-button>
            {this.invoiceDetail.approval_status === 1 && this.revocationVisiable && (
              <tg-button class="div-default-btn" onClick={this.revoke} v-loading={this.saveLoading}>
                撤销
              </tg-button>
            )}
            {this.invoiceDetail.approval_status === 3 && (
              <tg-button
                class="div-default-btn"
                onClick={this.reApply}
                v-loading={this.saveLoading}
              >
                重新编辑提交
              </tg-button>
            )}
          </template>
        </el-dialog>
        {this.invoiceDialogVisible && (
          <invoiceDialog
            ref="invoiceDialogRef"
            confirm={this.confirmInvoiceDialog}
            data={this.invoiceDetail}
            edit={true}
          />
        )}
      </div>
    );
  },
});
