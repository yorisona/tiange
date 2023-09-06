import { defineComponent, provide, ref, UnwrapRef, computed, inject } from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import { useContract, useBreadcrumbRouter } from './anchorUse';
import anchorAgreementDialog from '@/modules/customer/contract/form/anchorAgreementDialog.vue';
import OaFlows from '@/components/OAFlows/flows.vue';
import { useUserInfo } from '@/use/vuex';
import { ApprovalStatus } from '@/types/tiange/system';
import { getProjectids } from '@/api/cooperative';
import supplierService from '@/services/supplier';
import { wait as AwaitFn } from '@/utils/func';
import { useBreadcrumb } from '@/modules/live/project/use/breadcrumb';
import { supplier_permission_info } from '@/modules/supplier/playerManager/common/utils/utils';
import { PostVerify_contract_scan } from '@/services/contract';
import { useDialog } from '@/use/dialog';
import toExamineDialog from '@/modules/legal/contract/dialog/toExamineDialog';
import { usePermission } from '@/use/permission';
import { isExternal } from '@/router/routeGuard/index';
const permission = usePermission();
interface IPropsJsx {
  children?: any;
  props?: any;
  class?: string;
  data?: any;
}

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
  return (
    <div class={`contract-grid-item contract-grid-columnSpan-${props.props.columnSpan}`}>
      <div
        class="label"
        style={
          'min-width:' +
          (props.props.label.length > 9 ? 150 : props.props.label.length * 13 + 10) +
          'px;'
        }
      >
        {props.props.label}：
      </div>
      <div class="item">{children}</div>
    </div>
  );
};
export default defineComponent({
  components: {
    anchorAgreementDialog,
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

    const signType = computed(() => {
      return contract.detail?.contract_info.cooperative_sign_type;
    });

    const addAnchorTemplateContractRef = ref<UnwrapRef<{ show: (...args: any) => void }> | null>(
      null,
    );
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
      addAnchorTemplateContractRef.value?.show({}, item, {
        personalSign:
          item.contract_info.cooperative_sign_type === E.supplier.CooperativeSignType.PERSONAL,
      });
    };

    const oprateBtnVisiable = computed(() => {
      return (
        [ApprovalStatus.Failure].includes(contract.detail?.contract_info.contract_status ?? -1) &&
        (supplier_permission_info.supplier_kol_sign_contract ||
          currentUserInfo.value.id === contract.detail?.contract_info.manager_id ||
          currentUserInfo.value.id === contract.detail?.contract_detail.add_by)
      );
    });
    const caneditproject = computed(() => {
      return (
        supplier_permission_info.supplier_kol_sign_contract ||
        currentUserInfo.value.id === contract.detail?.contract_info.manager_id ||
        currentUserInfo.value.id === contract.detail?.contract_detail.add_by
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
        contract.detail?.contract_info.add_by === currentUserInfo.value.id ||
        contract.detail?.allow_update_contract_scan_user_ids?.includes(currentUserInfo.value.id);
      return (
        contract.detail?.contract_info.contract_status === ApprovalStatus.Normal &&
        ((contract.isProject && inTeam) || (!contract.isProject && permission.upload_attachment))
      );
      // return (
      //   (contract.detail?.contract_info.add_by === currentUserInfo.value.id ||
      //     contract.detail?.allow_update_contract_scan_user_ids?.includes(
      //       currentUserInfo.value.id,
      //     )) &&
      //   contract.detail?.contract_info.contract_status === ApprovalStatus.Normal &&
      //   (permission.upload_attachment ||
      //     (!breadRouter.breadcrumb.isLegalCustomerContractDetail &&
      //       !breadRouter.breadcrumb.isLegalSupplierContractDetail &&
      //       !breadRouter.breadcrumb.isLegalStatisticsCustomerContractDetail &&
      //       !breadRouter.breadcrumb.isLegalStatisticsSupplierContractDetail))
      // );
    });
    const anchorIdent = (value: string) => {
      return value.length > 10 ? value.substring(0, 6) + '*****' + value.substring(14) : '******';
    };
    const anchorTel = (value: string) => {
      return value.length > 10 ? value.substring(0, 3) + '****' + value.substring(7) : '******';
    };
    const anchorWeixin = (value: string) => {
      return value.length > 0 ? value.substring(0, 1) + '****' : '******';
    };
    const projectVisible = ref(false);
    // 兼容组件
    const submitProject = async () => {
      if (project_relevancy_id.value) {
        const [{ data: response }] = await AwaitFn(
          500,
          supplierService.SaveAnchorProjectContract({
            contract_id: contract.detail?.contract_info.id,
            project_id: project_relevancy_id.value,
          }),
        );
        if (response.success) {
          ctx.root.$message.success(response.message || '修改关联项目成功！');
          projectVisible.value = false;
          contract.reload();
        } else {
          ctx.root.$message.warning(response.message || '修改关联项目失败！');
        }
      } else {
        ctx.root.$message.warning('请先选择要关联的项目！');
      }
    };
    // 关联项目
    const project_ids = ref([]);
    const getProjectIds = (val: any) => {
      getProjectids({
        project_name: val,
        cooperation_type: 1,
        business_type: '3,7,9',
        is_end: 0,
      }).then(({ data }) => {
        const arr: any = [];
        const project_ids_one = data.data;
        arr.push(...project_ids_one);
        project_ids.value = arr;
      });
    };
    if (
      (!contract.detail?.contract_info?.project_name ||
        contract.detail?.contract_info?.project_name === '无' ||
        contract.detail?.contract_info?.project_name === '暂无') &&
      caneditproject.value
    ) {
      getProjectIds('');
    }
    const project_relevancy_id = ref('');
    const project_relevancy_name = ref('');
    const breadcrumb = useBreadcrumb();

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
    /*const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );*/

    if (!isExternal()) {
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(breadRouter.routes);
    }
    return {
      approvalLoading,
      onApprovalHandler,
      breadcrumb,
      project_relevancy_id,
      project_relevancy_name,
      project_ids,
      getProjectIds,
      submitProject,
      projectVisible,
      anchorIdent,
      anchorTel,
      anchorWeixin,
      canUpload,
      hasPermission,
      addAnchorTemplateContractRef,
      opendialogClick,
      contract,
      breadRouter,
      oprateBtnVisiable,
      caneditproject,
      signType,
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
                style="margin-right:20px"
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

            {this.oprateBtnVisiable && (
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
              {contract.hasVoidRight && this.signType === E.supplier.CooperativeSignType.OFFICIAL && (
                <tg-button
                  size="small"
                  className="disabled"
                  type="negative"
                  icon="ico-invalid-lite"
                  onclick={contract.toVoid}
                >
                  <span>作废</span>
                </tg-button>
              )}

              {contract.hasDelete && this.signType === E.supplier.CooperativeSignType.OFFICIAL && (
                <tg-button type="negative" icon="ico-btn-delete" onClick={contract.onDelete}>
                  删除
                </tg-button>
              )}
            </div>
          </div>
          <Grid column={4}>
            {template_info?.cooperation_duration?.map(item => {
              if (item.key === '签约类型' && item.value === '从合同') {
                return <Cell label={item.key}>补充协议</Cell>;
              }
              if (item.key === '签约类型' && item.value) {
                return <Cell label={item.key}>{item.value}</Cell>;
              }
              return;
            })}
            <Cell label="创建人">{detail?.contract_info.add_by_name}</Cell>
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="主播信息" />
          <Grid column={4}>
            {template_info?.anchor_info?.map(item => {
              if (item.key === '身份证号') {
                return <Cell label={item.key}> {this.anchorIdent(item.value) || '--'}</Cell>;
              }
              if (item.key === '电话') {
                return <Cell label={item.key}> {this.anchorTel(item.value) || '--'}</Cell>;
              }
              if (item.key === '微信号') {
                return <Cell label={item.key}> {this.anchorWeixin(item.value) || '--'}</Cell>;
              }
              return <Cell label={item.key}>{item.value}</Cell>;
            })}
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="合作项目" />
          <Grid column={1}>
            <Cell label="项目名称">
              {(detail?.project_infos || [])
                .map(el => {
                  return el.project_name || '--';
                })
                .join('、 ')}
            </Cell>
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="关联机构信息" />
          <Grid column={4}>
            {template_info?.company_info?.map(item => {
              if (item.key === '机构ID') {
                return;
              }
              return <Cell label={item.key}>{item.value}</Cell>;
            })}
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="项目信息" />
          <Grid column={4}>
            <Cell label="关联项目">
              {detail?.contract_info?.project_name || '无'}{' '}
              {this.breadcrumb.isAnchorDetail &&
                (!detail?.contract_info?.project_name ||
                  detail?.contract_info?.project_name === '无' ||
                  detail?.contract_info?.project_name === '暂无') &&
                this.caneditproject && (
                  <tg-button
                    className="edit-button"
                    type="link"
                    style="color:var(--text-color);margin-left:5px"
                    onclick={() => {
                      this.projectVisible = true;
                    }}
                  >
                    <tg-icon name="ico-edit"></tg-icon>
                  </tg-button>
                )}
            </Cell>
            <Cell label="用人部门">{detail?.contract_info?.approval_department_name}</Cell>
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="我方信息" />
          <Grid column={4}>
            {template_info?.our_info?.map(item => {
              if (item.key === '经办人Name') {
                return <Cell label="经办人">{item.value}</Cell>;
              }
              if (item.key === '电话') {
                return <Cell label={item.key}>{item.value}</Cell>;
              }
              return;
            })}
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="合同期限" />
          <Grid column={4}>
            {console.log(
              template_info?.cooperation_duration,
              'template_info?.cooperation_duration',
            )}
            {template_info?.cooperation_duration?.map(item => {
              if (
                item.key === '签约类型' ||
                item.key === '试合作期' ||
                item.key === '起止时间' ||
                item.key === '合同有效期单位'
              ) {
                return;
              }
              if (item.key === '关联主合同') {
                if (item.value) {
                  return <Cell label={item.key}>{item.value}</Cell>;
                }
                return;
              }
              if (item.key === '合同有效期') {
                const year = Math.floor(Number(item.value) / 12);
                const month = Number(item.value) % 12;
                return (
                  <Cell label={item.key}>
                    {year ? year + '年' : ''}
                    {month ? month + '月' : ''}
                  </Cell>
                );
              }
              if (item.key === '合作期限') {
                return (
                  <Cell label={item.key}>{item.value.replace(/-/g, '.').replace('/', '-')}</Cell>
                );
              }
              /*if (item.key === '起止时间') {
                if (template_info?.hasTryCooperation) {
                  return (
                    <Cell label="试合作期限">
                      {item.value.replace(/-/g, '.').replace('/', '-')}
                    </Cell>
                  );
                } else {
                  return;
                }
              }*/
              return <Cell label={item.key}>{item.value}</Cell>;
            })}
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="结算信息" />
          <Grid column={4}>
            {template_info?.cooperation_content?.map(item => {
              if (item.key === '税率') {
                return <Cell label="税率">{item.value}%</Cell>;
              }
              return <Cell label={item.key}>{item.value}</Cell>;
            })}
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="其它信息" />
          <Grid column={4}>
            {this.signType === E.supplier.CooperativeSignType.OFFICIAL && (
              <fragments>
                <Cell label="盖章份数">{template_info?.othersMap['盖章份数']}</Cell>
                <Cell label="印章名称">{template_info?.othersMap['印章名称']}</Cell>
                <Cell label="用印时间">{template_info?.othersMap['用印时间']}</Cell>
                {template_info?.othersMap['是否邮寄'] === 0 && <Cell label="是否邮寄">否</Cell>}
                {template_info?.othersMap['邮寄信息'] && (
                  <Cell label="邮寄信息" columnSpan={4}>
                    {template_info?.othersMap['邮寄信息']}
                  </Cell>
                )}
              </fragments>
            )}
            <Cell label="备注" columnSpan={5}>
              {template_info?.frontend_data?.other_remark}
            </Cell>
            <Cell label="开票内容">{detail?.contract_info?.invoice_content}</Cell>
          </Grid>
          <div class="line" />
          <head-lines style="padding-bottom:16px" title="合同附件" />
          <div class="grid-annex ">
            {detail?.contract_detail?.attachment_url_list.length === 0 && <div>未上传合同附件</div>}
            <tg-file-card-group
              filelist={detail?.contract_detail?.attachment_url_list?.map(el => ({
                filename: el.file_name,
                url: el.url,
              }))}
            />
          </div>
          <div class="line" />
          <div style="display: flex;">
            <head-lines style="padding-bottom:16px" title="合同扫描件" />
            {this.canUpload &&
              this.hasPermission &&
              detail?.contract_info.contract_scan_status === 1 &&
              (detail?.contract_detail?.contract_scan_urls.length ?? 0) > 0 && (
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
              {!this.canUpload && detail?.contract_detail?.contract_scan_urls.length === 0 && (
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
        <el-dialog
          className="el-dialog__wrapper customer-dialog"
          width="460px"
          close-on-click-modal={false}
          visible={this.projectVisible}
          title="选择关联项目"
          onClose={() => {
            this.projectVisible = false;
          }}
        >
          <div style="margin:0px 8px 8px 8px">
            <span style="color:#6a7b92">关联项目： </span>
            <el-select
              placeholder="请输入选择关联项目"
              reserve-keyword={true}
              clearable={true}
              filterable={true}
              onchange={(val: any) => {
                this.project_relevancy_id = val;
                this.project_ids.map((item: any) => {
                  if (item.id === val) {
                    this.project_relevancy_name = item.project_name;
                  }
                });
              }}
              style="width: 252px; font-size: 12px"
              v-model={this.project_relevancy_id}
            >
              {(this as any).project_ids.map((item: any, key: number) => {
                return (
                  <el-option
                    style="width: 194px"
                    label={item.project_name}
                    value={item.id}
                    key={key}
                  />
                );
              })}
            </el-select>
          </div>
          <template slot="footer">
            <tg-button
              onClick={() => {
                this.projectVisible = false;
              }}
            >
              取消
            </tg-button>
            <tg-button type="primary" style="margin-left:20px" onClick={this.submitProject}>
              提交
            </tg-button>
          </template>
        </el-dialog>
        <anchorAgreementDialog
          type="edit"
          ref="addAnchorTemplateContractRef"
          onAdded={contract.reload}
        />
        <tg-mask-loading visible={this.approvalLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
