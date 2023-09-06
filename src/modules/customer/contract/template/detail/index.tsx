import { defineComponent, provide, ref, UnwrapRef, computed, inject } from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import { useContract, useBreadcrumbRouter } from './use';
import supplierAgreementDialog from '@/modules/customer/contract/form/supplierAgreementDialog.vue';
import clientAgreementDialog from '@/modules/customer/contract/form/clientAgreementDialog.vue';
import OaFlows from '@/components/OAFlows/flows.vue';
import { useUserInfo } from '@/use/vuex';
import { ApprovalStatus } from '@/types/tiange/system';
import { PostVerify_contract_scan } from '@/services/contract';
import { useDialog } from '@/use/dialog';
import toExamineDialog from '@/modules/legal/contract/dialog/toExamineDialog';
import { usePermission } from '@/use/permission';
import { isExternal } from '@/router/routeGuard/index';

interface IPropsJsx {
  children?: any;
  props?: any;
  class?: string;
  data?: any;
}
const permission = usePermission();
const Grid = (props: { column?: number; class?: string } & IPropsJsx) => {
  return (
    <div class={`contract-grid column-${props.props.column} ${props.data.class}`}>
      {props.children}
    </div>
  );
};
const Cell = (props: { label: string; columnSpan?: number } & IPropsJsx) => {
  let children = props.children;
  if (!children || children.length === 0) children = '--';
  const style = {
    minWidth:
      props.props.label === 'ROI要求'
        ? '62px'
        : props.props.label === '产品服务/服务名称'
        ? '96px'
        : props.props.label.length > 9
        ? '142px'
        : props.props.label.length * 13 + 10 + 'px',
  };
  return (
    <div class={`contract-grid-item contract-grid-columnSpan-${props.props.columnSpan}`}>
      <div class="label" style={style}>
        {props.props.label}：
      </div>
      <div class="item">{children}</div>
    </div>
  );
};
export default defineComponent({
  components: {
    supplierAgreementDialog,
    clientAgreementDialog,
    OaFlows,
    toExamineDialog,
  },
  setup(_, ctx) {
    const approvalLoading = ref(false);

    const router = useRouter();
    const contract = useContract(ctx);
    const breadRouter = useBreadcrumbRouter();
    const currentUserInfo = useUserInfo();
    provide('project', {});
    provide('project_add_id', {});

    const addsupplierTemplateContractRef = ref<UnwrapRef<{ show: (arg: any) => void }> | null>(
      null,
    );
    const addclientTemplateContractRef = ref<UnwrapRef<{ show: (arg: any) => void }> | null>(null);
    contract.queryContractDetail({
      id: parseInt(router.currentRoute.params.id, 10),
      cooperation_id:
        breadRouter.breadcrumb.isCoopCustomerContractDetail ||
        breadRouter.breadcrumb.isCoopSupplierContractDetail
          ? router.currentRoute.query.parent_id
          : undefined,
      project_id:
        breadRouter.breadcrumb.isCoopCustomerContractDetail ||
        breadRouter.breadcrumb.isCoopSupplierContractDetail
          ? undefined
          : router.currentRoute.query.parent_id,
    });
    const opendialogClick = (item: any) => {
      if (
        item.contract_info.contract_type === 1 ||
        item.contract_info.contract_type === 2 ||
        item.contract_info.contract_type === 5
      ) {
        //客户合同详情编辑
        addclientTemplateContractRef.value?.show(item);
      } else {
        //供应商合同详情编辑
        addsupplierTemplateContractRef.value?.show(item);
      }
    };

    const oprateBtnVisiable = computed(() => {
      return (
        [ApprovalStatus.Failure].includes(contract.detail?.contract_info.contract_status ?? -1) &&
        (currentUserInfo.value.id === contract.detail?.contract_info.manager_id ||
          currentUserInfo.value.id === contract.detail?.contract_detail.add_by)
      );
    });
    const hasPermission = permission.law_verify_contract_scan;
    const canUpload = computed(() => {
      // const isProject =
      //   !breadRouter.breadcrumb.isLegalCustomerContractDetail &&
      //   !breadRouter.breadcrumb.isLegalSupplierContractDetail &&
      //   !breadRouter.breadcrumb.isLegalStatisticsCustomerContractDetail &&
      //   !breadRouter.breadcrumb.isLegalStatisticsSupplierContractDetail;
      const inTeam =
        contract.detail?.allow_update_contract_scan_user_ids?.includes(currentUserInfo.value.id) ||
        contract.detail?.contract_info.add_by === currentUserInfo.value.id;
      return (
        contract.detail?.contract_info.contract_status === ApprovalStatus.Normal &&
        ((contract.isProject && inTeam) || (!contract.isProject && permission.upload_attachment))
      );
      // return (
      //   (contract.detail?.allow_update_contract_scan_user_ids?.includes(currentUserInfo.value.id) ||
      //     contract.detail?.contract_info.add_by === currentUserInfo.value.id) &&
      //   contract.detail?.contract_info.contract_status === ApprovalStatus.Normal &&
      //   (permission.upload_attachment ||
      //     (!breadRouter.breadcrumb.isLegalCustomerContractDetail &&
      //       !breadRouter.breadcrumb.isLegalSupplierContractDetail &&
      //       !breadRouter.breadcrumb.isLegalStatisticsCustomerContractDetail &&
      //       !breadRouter.breadcrumb.isLegalStatisticsSupplierContractDetail))
      // );
    });

    const postVerify_contract_scan = async (v: any) => {
      v.status = 3;
      approvalLoading.value = true;
      const res = await PostVerify_contract_scan(v);
      approvalLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '驳回成功');
        // queryContract();
        contract.queryContractDetail({
          id: parseInt(router.currentRoute.params.id, 10),
          cooperation_id:
            breadRouter.breadcrumb.isCoopCustomerContractDetail ||
            breadRouter.breadcrumb.isCoopSupplierContractDetail
              ? router.currentRoute.query.parent_id
              : undefined,
          project_id:
            breadRouter.breadcrumb.isCoopCustomerContractDetail ||
            breadRouter.breadcrumb.isCoopSupplierContractDetail
              ? undefined
              : router.currentRoute.query.parent_id,
        });
      } else {
        ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
      }
    };

    const dialogProject = useDialog({
      component: toExamineDialog,
      title: '扫描件审核',
      okText: '驳回',
      width: '400px',
      on: {
        submit: (v: { contract_id: number; message?: string }) => {
          postVerify_contract_scan(v);
        },
      },
    });

    const onApprovalHandler = () => {
      dialogProject.show(contract.detail?.contract_info?.id);
    };
    /** 本地生活 */
    /*  const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );*/

    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(breadRouter.routes);

    // 兼容组件
    return {
      approvalLoading,
      onApprovalHandler,
      canUpload,
      addsupplierTemplateContractRef,
      addclientTemplateContractRef,
      opendialogClick,
      contract,
      oprateBtnVisiable,
      hasPermission,
      isExternal,
    };
  },
  render() {
    const { contract } = this;
    const { detail, flow } = contract;
    const template_info = detail?.template_info;
    return (
      <div class="contract-detail">
        <div class="contract-detail-container">
          <div class="contract-title-box">
            <div class="contract-title">合同编号：{detail?.contract_info?.contract_uid}</div>
            {contract.isFlowFromOA ? (
              <el-popover
                placement="right-start"
                trigger={'hover'}
                popper-class="approve-progress-popper"
                onShow={contract.flow.onFlowsShow}
              >
                <span
                  slot="reference"
                  class={`status  ${contract.contract_status.style}`}
                  style="cursor:default"
                >
                  {contract.contract_status.text}
                </span>
                {flow.flowsLoading && <div style="padding: 10px 20px">正在查询进度...</div>}
                {!flow.flowsLoading && flow.flows.length > 0 ? (
                  <oa-flows status={flow.status} />
                ) : (
                  <div>{flow.flowsError}</div>
                )}
              </el-popover>
            ) : (
              <span class={`status  ${contract.contract_status.style}`}>
                {contract.contract_status.text}
              </span>
            )}

            {this.oprateBtnVisiable && detail?.contract_info.contract_status !== 5 && (
              <span
                class="edit"
                onclick={() => {
                  this.opendialogClick(detail);
                }}
              >
                <tg-icon name="ico-edit" />
              </span>
            )}
            <div class="fill" />
            <div class="operator">
              {contract.hasVoidRight && (
                <tg-button
                  className="disabled"
                  type="negative"
                  icon="ico-invalid-lite"
                  onclick={contract.toVoid}
                >
                  <span>作废</span>
                </tg-button>
              )}
              {contract.hasDelete && (
                <tg-button type="negative" icon="ico-btn-delete" onClick={contract.onDelete}>
                  删除
                </tg-button>
              )}
            </div>
          </div>
          <Grid column={2}>
            {template_info?.extend_contract_info?.map(item => {
              return <Cell label={item.key}>{item.value}</Cell>;
            })}
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:18px" title="我方信息" />
          <Grid column={4}>
            {template_info?.our_info?.map(item => {
              if (
                item.key === '项目关联部门' ||
                item.key === '费用承担部门' ||
                item.key === '合同所属部门'
              ) {
                return (
                  <Cell label="合同所属部门">
                    {template_info?.our_info.length > 4 ? template_info?.our_info[4].value : '--'}
                  </Cell>
                );
              } else if (item.key === '部门名称') {
                return;
              }
              return <Cell label={item.key}>{item.value}</Cell>;
            })}
            {template_info?.our_info && template_info?.our_info.length < 4 && (
              <Cell label="合同所属部门">--</Cell>
            )}
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:18px" title="合作项目" />
          <Grid column={1}>
            <Cell label="项目名称" columnSpan={2}>
              {(detail?.project_infos || [])
                .map(item => {
                  return item.project_name;
                })
                .join('、')}
            </Cell>
          </Grid>
          {template_info?.cooperation_content && (
            <div>
              <div class="line" />
              <head-lines style="padding-bottom:18px" title="合作内容" />
              <Grid column={4}>
                {template_info?.cooperation_content?.map(item => {
                  if (item.key === '其它权益') {
                    return (
                      <Cell label="其它权益" columnSpan={2}>
                        {item.value}
                      </Cell>
                    );
                  }
                  return <Cell label={item.key}>{item.value}</Cell>;
                })}
              </Grid>
            </div>
          )}
          <div class="line" />
          <head-lines style="padding-bottom:18px" title="合同期限" />
          {detail?.contract_info.contract_type === 5 ? (
            <Grid column={4}>
              {template_info?.cooperation_duration?.map(item => {
                if (item.key === '关联主合同' || item.key === '关联原合同') {
                  if (item.value) {
                    return <Cell label={item.key}>{item.value}</Cell>;
                  } else {
                    return;
                  }
                }
                if (item.key === '签约类型' && item.value === '长期合作') {
                  return <Cell label={item.key}>框架合同</Cell>;
                }
                if (item.key === '签约类型' && item.value === '从合同') {
                  return <Cell label={item.key}>补充协议</Cell>;
                }
                if (item.key === '签约类型' && item.value === '单次合作') {
                  return <Cell label={item.key}>单次合同</Cell>;
                }
                if (item.key === '最后一期款项付款时间') {
                  return <Cell label="最后一期款项收款时间">{item.value}</Cell>;
                }
                return <Cell label={item.key}>{item.value}</Cell>;
              })}
            </Grid>
          ) : (
            <Grid column={4}>
              {template_info?.cooperation_duration?.map(item => {
                if (item.key === '关联主合同') {
                  if (item.value) {
                    return <Cell label={item.key}>{item.value}</Cell>;
                  } else {
                    return;
                  }
                }
                if (item.key === '签约类型' && item.value === '长期合作') {
                  return <Cell label={item.key}>框架合同</Cell>;
                }
                if (item.key === '签约类型' && item.value === '从合同') {
                  return <Cell label={item.key}>补充协议</Cell>;
                }
                return <Cell label={item.key}>{item.value}</Cell>;
              })}
            </Grid>
          )}
          <div class="line" />
          <head-lines style="padding-bottom:18px" title="收付款条件" />
          {detail?.contract_info.contract_type === 5 ? (
            <Grid column={4}>
              {template_info?.pay_condition?.map(item => {
                if (item.key === '付款要求') {
                  return <Cell label="收款要求">{item.value}</Cell>;
                }
                if (item.key === '付款方式') {
                  if (item.value) {
                    return (
                      <Cell label="收款方式" columnSpan={2}>
                        {item.value}
                      </Cell>
                    );
                  } else {
                    return;
                  }
                }
                return <Cell label={item.key}>{item.value}</Cell>;
              })}
            </Grid>
          ) : (
            <Grid column={4}>
              {template_info?.pay_condition?.map(item => {
                if (item.key === '付款方式') {
                  if (item.value) {
                    return (
                      <Cell label="付款方式" columnSpan={2}>
                        {item.value}
                      </Cell>
                    );
                  } else {
                    return;
                  }
                }
                return <Cell label={item.key}>{item.value}</Cell>;
              })}
            </Grid>
          )}
          {template_info?.hasMargin === true && (
            <div>
              <div class="line" />
              <head-lines style="padding-bottom:18px" title="保证金" />
              <Grid column={4}>
                {template_info?.margin?.map(item => {
                  if (item.key === '是否有保证金' && item.value) {
                    return <Cell label={item.key}>是</Cell>;
                  }
                  return <Cell label={item.key}>{item.value}</Cell>;
                })}
              </Grid>
            </div>
          )}
          <div class="line" />
          <head-lines style="padding-bottom:18px" title="其它信息" />
          <Grid column={4}>
            <Cell label="盖章份数">{template_info?.othersMap['盖章份数']}</Cell>
            <Cell label="印章名称">{template_info?.othersMap['印章名称']}</Cell>
            <Cell label="用印时间">{template_info?.othersMap['用印时间']}</Cell>
            {template_info?.othersMap['是否邮寄'] === 0 && <Cell label="是否邮寄">否</Cell>}
            {template_info?.othersMap['邮寄信息'] && (
              <Cell label="邮寄信息" columnSpan={4}>
                {template_info?.othersMap['邮寄信息']}
              </Cell>
            )}
            <Cell label="备注">{template_info?.frontend_data?.other_remark}</Cell>
            <Cell label="开票内容">{detail?.contract_info?.invoice_content}</Cell>
          </Grid>
          {detail && detail?.project_contract_relation_type !== 2 && (
            <div>
              <div class="line" />
              <head-lines style="padding-bottom:18px" title="合同附件" />
              <div class="grid-annex ">
                {detail?.contract_detail?.attachment_url_list?.length === 0 && (
                  <div>未上传合同附件</div>
                )}
                <tg-file-card-group
                  filelist={detail?.contract_detail?.attachment_url_list?.map(el => ({
                    filename: el.file_name,
                    url: el.url,
                  }))}
                />
              </div>
              <div class="line" />
              <div style="display: flex;">
                <head-lines style="padding-bottom:18px" title="合同扫描件" />
                {this.canUpload &&
                  this.hasPermission &&
                  detail?.contract_info.contract_scan_status === 1 &&
                  (detail?.contract_detail?.contract_scan_urls?.length ?? 0) > 0 && (
                    <tg-button type="link" on-click={this.onApprovalHandler}>
                      审核
                    </tg-button>
                  )}
              </div>
              <div class="grid-annex">
                <tg-file-card-group
                  filelist={detail?.contract_detail?.contract_scan_urls?.map(el => ({
                    filename: el.file_name,
                    url: el.url,
                  }))}
                  onRemove={contract.remove}
                  editable={true}
                >
                  {(detail?.contract_info.contract_scan_status === 2 ||
                    detail?.contract_info.contract_scan_status === 3) && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '0',
                        'font-size': '12px',
                        width: '178px',
                        'text-align': 'center',
                        color:
                          detail?.contract_info.contract_scan_status === 3
                            ? 'red'
                            : 'var(--success-color)',
                      }}
                    >
                      {detail?.contract_info.contract_scan_status === 2 ? '审批通过' : '已驳回'}
                    </div>
                  )}
                  {!this.canUpload && detail?.contract_detail?.contract_scan_urls?.length === 0 && (
                    <div>未上传合同扫描件</div>
                  )}
                  {this.canUpload &&
                    (detail?.contract_info.contract_scan_status === 0 ||
                      detail?.contract_info.contract_scan_status === 3) && (
                      <div class="annex">
                        <tg-upload
                          action="/api/resources/upload_file"
                          http-request={contract.uploadScanFiles}
                          show-file-list={false}
                          success={(res: { data: { source: string }; success: boolean }) => {
                            if (res.success) {
                              contract.uploadScans(res.data.source);
                            }
                          }}
                        >
                          <div class="annex-upload">
                            <tg-icon name="ico-add-thin" />
                            <span class="text">支持：docx、excel、pdf 单个文件不超过50M</span>
                          </div>
                        </tg-upload>
                      </div>
                    )}
                </tg-file-card-group>
              </div>
            </div>
          )}
        </div>
        <supplierAgreementDialog
          type="edit"
          ref="addsupplierTemplateContractRef"
          onAdded={contract.reload}
        />
        <clientAgreementDialog
          type="edit"
          ref="addclientTemplateContractRef"
          onAdded={contract.reload}
        />
        <tg-mask-loading visible={this.approvalLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
