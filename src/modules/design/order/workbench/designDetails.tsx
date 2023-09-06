import { ref, defineComponent, h, computed, inject, Ref, watchEffect } from '@vue/composition-api';
import step from './modules/step.vue';
import { RouterNameDesign } from '@/const/router';
import detailCard from './modules/detailCard.vue';
import {
  // Query_Design_Order_Detail,
  Set_Design_Order_add_attachment,
  Set_Design_Order_del_attachment,
  // Set_Design_Order_add_comment,
  Set_Design_Order_start_review,
  Set_Design_Order_approved_review,
  Set_Design_delivery_delivery,
  Set_Design_delivery_add_attachment,
  Set_Design_delivery_del_attachment,
} from '@/services/design';
import auditFailedDialog from './modules/auditFailedDialog.vue';
import taskAssignmentDialog from './modules/taskAssignmentDialog.vue';
import opinionDialog from './modules/opinionDialog.vue';
import auditOpinionDialog from './modules/auditOpinionDialog.vue';
import switchs from '@/modules/datacenter/shoplive/components/commodity/module/switch.vue';
import { downloadFileFromLink } from '@/utils/func';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
// import dialogImageView from '@/modules/supplier/playerManager/common/dialogImageView';
import {
  Design_Order_Details,
  OrderStatusEnum,
  useDesignPermission,
  rulesAuditType,
  useDialogAll,
} from '../useOrder';
// import { UserInfo } from '@/types/tiange/system';
import { Confirm } from '@/use/asyncConfirm';
import ImageViewer from '@/components/Image/ImageViewer';
import moment from 'moment';

// const levelBg = new Map([
//   ['SS', '#FF7A36'],
//   ['S', '#FFB736'],
//   ['A', '#2877FF'],
//   ['B', 'var(--success-color)'],
//   ['C', '#00A991'],
// ]);
// const randomColor = () => {
//   const color = ['#35B1F6', '#71C907', '#8862DF', '#ED3434', '#54CBC7'];
//   return color[Math.floor(Math.random() * color.length)];
// };
// console.log('levelBg', randomColor);

const eventCancellationDialog = defineComponent({
  name: 'eventCancellation',
  render() {
    return (
      <div class="eventCancellation-box">
        因需求方要求可取消设计制作，取消后相关后续流程将同时终止
        <div class="btn-box">
          <tg-button class="btn_cancel" onClick={() => this.$emit('submit')}>
            确认取消
          </tg-button>
        </div>
      </div>
    );
  },
});

export default defineComponent({
  name: 'oiderDetail',
  components: {
    detailCard,
    step,
    switchs,
    // dialogImageView,
  },
  setup: (props, ctx) => {
    const order_id = ref('');
    order_id.value = ctx.root.$route.query.order_id as string;
    const routes = [
      {
        name:
          ctx.root.$route.path.indexOf('workbench') >= 0
            ? RouterNameDesign.workbench.design_order_list
            : RouterNameDesign.design_order_list,
        title: '视觉设计',
      },
      {
        path: '',
        title: '视觉设计明细',
      },
    ];
    if (ctx.root.$route.params && ctx.root.$route.params.isFromWorkbench === '1') {
      routes.splice(0, 0, {
        name: 'Workbench',
        title: '工作台',
      });
    }

    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    /* info */
    const info = ref<Design_Order_Details>({} as any);
    const fileList = ref<string[]>([]);
    /* 当前亮起节点 不能当做实际当前list的index */
    const currentNode = ref(0);
    const getStepList = (): {
      title: string;
      attachment: any;
      index: number;
    }[] => {
      const step_list_new =
        info.value.step_list?.map((item: any, index: number) => ({
          title: item.step_name,
          attachment: item.attachment,
          index,
        })) ?? [];

      let findCurrent = info.value.step_list?.findIndex((item: any) => item.is_current) ?? -1;
      // 如果只有一个节点，需要添加一个空节点
      if (step_list_new.length === 1) {
        step_list_new.unshift({
          title: '',
          attachment: null,
          index: -1,
        });
        findCurrent = 1;
      }

      if (findCurrent === -1) {
        if (info.value.step_status === 3) {
          currentNode.value = step_list_new.length;
        } else if (step_list_new.length === 1) {
          currentNode.value = 1;
        } else {
          currentNode.value = 0;
        }
      } else {
        currentNode.value = findCurrent;
      }

      return step_list_new;
    };

    /* 当前选择的节点 */
    const tempIndex = ref(0);
    const getFileList = (v: { title: string; attachment: any; index: number }) => {
      if (v.index > currentNode.value) return;
      tempIndex.value = v.index;
      if (v.attachment && v.attachment.length > 0) {
        fileList.value = v.attachment.map((item: any) => {
          return item.url;
        });
      }
    };
    const stepList = ref<
      {
        title: string;
        attachment: any;
        index: number;
      }[]
    >([]);
    const order_details = inject<Ref>('info');
    const updata = inject<Function>('loadData');
    const loading = ref(false);
    const loadData = async () => {
      info.value = order_details?.value;
      if (info.value?.step_list?.length > 0) {
        let findCurrent = 0;
        if (info.value.step_status > 1) {
          findCurrent = info.value.step_list.findIndex(item => item.is_current);
          /* 大于设计中找不到 已交付选择最后一个阶段 */
          if (findCurrent === -1) {
            findCurrent = info.value.step_list.length - 1;
          }
        }
        const attachmentTemp = info.value.step_list[findCurrent]?.attachment?.length
          ? info.value.step_list[findCurrent]?.attachment
          : [];
        fileList.value = attachmentTemp.map(item => {
          return item.url;
        });
        tempIndex.value = findCurrent;
        stepList.value = getStepList();
      }
      loading.value = false;
      // })
      // .finally(() => (loading.value = false));
    };
    watchEffect(() => {
      if (info.value) {
        loadData();
      }
    });
    const { dialogTask, eventCancellation, dialogOpinon, dialogAuditOpinion, dialogAuditFailed } =
      useDialogAll({
        component: {
          taskAssignmentDialog,
          eventCancellationDialog,
          opinionDialog,
          auditOpinionDialog,
          auditFailedDialog,
        },
        props: {
          loading,
          order_id,
          updata,
          ctx,
          info,
        },
      });
    /* 发起审核 */
    const initiateAnAudit = () => {
      Confirm('是否确定发起审核？').then(() => {
        loading.value = true;
        Set_Design_Order_start_review({
          order_id: order_id.value,
        }).then(res => {
          if (res.data.error_code === 0) {
            updata?.();
            ctx.root.$message.success(res.data.message ?? '审核通过');
          } else {
            loading.value = false;
            ctx.root.$message.error(res.data.message ?? '审核失败');
          }
        });
      });
    };
    /* 审核通过 */
    const approved = () => {
      Confirm('是否确定审核通过？').then(() => {
        loading.value = true;
        Set_Design_Order_approved_review({
          order_id: order_id.value,
        }).then(res => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            updata?.();
            ctx.root.$message.success(res.data.message ?? '审核通过');
          } else {
            ctx.root.$message.error(res.data.message ?? '审核失败');
          }
        });
      });
    };
    /* 交付 */
    const toApproved = () => {
      Confirm('是否确定交付？').then(() => {
        loading.value = true;
        Set_Design_delivery_delivery({
          order_id: order_id.value,
        }).then(res => {
          if (res.data.error_code === 0) {
            updata?.();
            ctx.root.$message.success(res.data.message ?? '交付成功');
          } else {
            loading.value = false;
            ctx.root.$message.error(res.data.message ?? '交付失败');
          }
        });
      });
    };
    /* 状态权限 */
    const Permission = useDesignPermission(tempIndex);

    /* 第一次重构,采用职责链模式 --- 这里判断必须采用从上到下 */
    const rulesAudit = computed(() => {
      const { value } = Permission;
      const 当前状态名字 = value.当前进行步骤?.step_name;
      const rulesAuditBtn: rulesAuditType[] = [
        {
          text: '设计师角色',
          match: value.is_designer,
          action: [
            {
              match: value.审批人员_审批中,
              text: '审批中',
              action: () => (
                <div
                  class="permission-button-group"
                  style={{
                    'grid-template-columns': value.是否内审中 ? '220px 1fr' : '220px 1fr 1fr',
                  }}
                >
                  <tg-button
                    class="order_btn"
                    size="small"
                    type="primary"
                    style="width:100%;"
                    onClick={() => approved()}
                  >
                    {当前状态名字}通过
                  </tg-button>
                  <tg-button
                    size="small"
                    class="order_btn"
                    style="width:100%;"
                    onClick={() => dialogAuditFailed.show('审核意见')}
                  >
                    审核不通过
                  </tg-button>
                  <tg-button
                    size="small"
                    class="order_btn"
                    style="width:100%;"
                    v-show={!value.是否内审中}
                    onClick={() => dialogAuditOpinion.show('方案意见')}
                  >
                    方案意见
                  </tg-button>
                </div>
              ),
            },
            {
              text: '已分配未上传',
              match: value.已分配未上传,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns: 300px 1fr;">
                  <div class="warning-words pd-8">请在截止时间前完成方案交付</div>
                  <tg-upload
                    class="upload-btn-box"
                    style="width:100%;"
                    action="/api/resources/upload_file"
                    show-file-list={false}
                    multiple={true}
                    data={{ type: 'visual_design', storage: 2 }}
                    success={(res: { data: { source: string }; success: boolean }) => {
                      if (res.success) {
                        changeUpload('add', res.data.source);
                      }
                    }}
                  >
                    <tg-button class="order_btn" size="small" type="primary" style="width:100%;">
                      上传方案
                    </tg-button>
                  </tg-upload>
                </div>
              ),
            },
            {
              text: '设计师_拒绝状态_附件已清空',
              match: value.设计师_拒绝状态_附件已清空,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns:300px 1fr;">
                  <div class="warning-words pd-8" style="color:#F04B4B">
                    {value.当前进行步骤?.history_record?.length > 0 ? (
                      <el-tooltip class="item" effect="dark" placement="top">
                        <div slot="content">
                          <span>失败原因：</span>
                          {value.当前进行步骤?.history_record[0].audit_comment}
                        </div>
                        <span style="cursor: pointer">{info.value.status_name},请重新上传方案</span>
                      </el-tooltip>
                    ) : (
                      `${info.value.status_name},请重新上传方案`
                    )}
                    {/* {info.value.status_name},请重新上传方案 */}
                  </div>
                  <tg-upload
                    class="upload-btn-box"
                    style="width:100%;"
                    action="/api/resources/upload_file"
                    show-file-list={false}
                    multiple={true}
                    data={{ type: 'visual_design', storage: 2 }}
                    success={(res: { data: { source: string }; success: boolean }) => {
                      if (res.success) {
                        changeUpload('add', res.data.source);
                      }
                    }}
                  >
                    <tg-button class="order_btn" size="small" type="primary" style="width:100%;">
                      上传方案
                    </tg-button>
                  </tg-upload>
                </div>
              ),
            },
            {
              text: '设计师_拒绝状态_附件重新上传',
              match: value.设计师_拒绝状态_附件重新上传,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns:300px 1fr;">
                  <div class="warning-words pd-8" style="color:#F04B4B">
                    {value.当前进行步骤?.history_record?.length > 0 ? (
                      <el-tooltip class="item" effect="dark" placement="top">
                        <div slot="content">
                          <span>失败原因：</span>
                          {value.当前进行步骤?.history_record[0].audit_comment}
                        </div>
                        <span style="cursor: pointer">{info.value.status_name},请重新上传方案</span>
                      </el-tooltip>
                    ) : (
                      `${info.value.status_name},请重新上传方案`
                    )}
                  </div>
                  <tg-button
                    size="medium"
                    type="primary"
                    class="order_btn"
                    style="width:100%;"
                    onClick={() => initiateAnAudit()}
                  >
                    提交审核
                  </tg-button>
                </div>
              ),
            },
            {
              text: '已上传未提交',
              match: value.已上传未提交,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns: 300px 1fr;">
                  <div class="warning-words pd-8">请在截止时间前完成方案交付</div>
                  <tg-button
                    size="medium"
                    type="primary"
                    class="order_btn"
                    style="width:100%;"
                    onClick={() => initiateAnAudit()}
                  >
                    提交审核
                  </tg-button>
                </div>
              ),
            },
            {
              text: '设计师_等待审核状态 || 设计师_通过状态',
              match: value.设计师_等待审核状态 || value.设计师_通过状态,
              action: () => (
                <div
                  class="permission-button-group"
                  style={{
                    'grid-template-columns': value.是否内审中 ? '1fr 1fr' : '200px 1fr 1fr',
                  }}
                >
                  <div class="warning-words pd-8">
                    {info.value.status_name},等待{当前状态名字}审核
                  </div>
                  <tg-upload
                    class="upload-btn-box"
                    style="width:100%;"
                    action="/api/resources/upload_file"
                    show-file-list={false}
                    multiple={true}
                    data={{ type: 'visual_design', storage: 2 }}
                    success={(res: { data: { source: string }; success: boolean }) => {
                      if (res.success) {
                        changeUpload('add', res.data.source);
                      }
                    }}
                  >
                    <tg-button class="order_btn" size="small" type="primary" style="width:100%;">
                      上传方案
                    </tg-button>
                  </tg-upload>
                  <tg-button
                    size="small"
                    style="width:100%;"
                    class="order_btn"
                    v-show={!value.是否内审中}
                    onClick={() => dialogAuditOpinion.show('方案意见')}
                  >
                    方案意见
                  </tg-button>
                </div>
              ),
            },
            {
              text: '设计师确认交付',
              match: value.设计师确认交付,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns:300px 1fr;">
                  {/* <div class="warning-words pd-8">{info.value.status_name},确认交付</div> */}
                  <tg-button
                    class="order_btn"
                    size="small"
                    type="primary"
                    onClick={() => toApproved()}
                  >
                    {info.value.status_name},确认交付
                  </tg-button>
                  <tg-upload
                    class="upload-btn-box"
                    style="width:100%;"
                    action="/api/resources/upload_file"
                    show-file-list={false}
                    multiple={true}
                    data={{ type: 'visual_design', storage: 2 }}
                    success={(res: { data: { source: string }; success: boolean }) => {
                      if (res.success) {
                        changeDeliveryUpload('add', res.data.source);
                      }
                    }}
                  >
                    <tg-button
                      class="order_btn"
                      size="small"
                      style="width:100%;"
                      disabled={!info.value.is_can_delivery}
                    >
                      补充文件
                    </tg-button>
                  </tg-upload>
                </div>
              ),
            },
            {
              text: '已交付',
              match: value.已交付,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns: 1fr;">
                  <div class="warning-words pd-8" style="color:#33BA5D">
                    <i class="el-icon-circle-check"></i>
                    方案已交付
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          text: '审批人员角色',
          match: value.当前人员是否能审批,
          action: [
            {
              text: '审批人员_审批中',
              match: value.审批人员_审批中,
              action: () => (
                <div
                  class="permission-button-group"
                  style={{
                    'grid-template-columns': value.是否内审中 ? '1fr 1fr' : '220px 1fr 1fr',
                  }}
                >
                  <tg-button
                    class="order_btn"
                    size="small"
                    type="primary"
                    style="width:100%;"
                    onClick={() => approved()}
                  >
                    {当前状态名字}通过
                  </tg-button>
                  <tg-button
                    class="order_btn"
                    size="small"
                    style="width:100%;"
                    onClick={() => dialogAuditFailed.show('审核意见')}
                  >
                    审核不通过
                  </tg-button>
                  <tg-button
                    class="order_btn"
                    size="small"
                    style="width:100%;"
                    onClick={() => dialogAuditOpinion.show('方案意见')}
                    v-show={!value.是否内审中}
                  >
                    方案意见
                  </tg-button>
                </div>
              ),
            },
            {
              text: '审批人员_审批拒绝',
              match: value.审批人员_审批拒绝,
              action: () => {
                let btn;
                let style = 'grid-template-columns:1fr;';
                if (order_details?.value?.step_list?.[0]?.step_audit_status === 2) {
                  btn = (
                    <tg-button
                      class="order_btn"
                      type="primary"
                      size="small"
                      onClick={() => {
                        dialogTask.show({
                          executor_name: info.value.executor_name,
                          executor: info.value.executor,
                          re_distribute: true,
                          delivery_time: info.value.delivery_time,
                          level: info.value.design_level_id,
                        });
                      }}
                    >
                      重新分配
                    </tg-button>
                  );
                  style = 'grid-template-columns:300px 1fr;';
                }
                return (
                  <div class="permission-button-group" style={style}>
                    <div class="warning-words pd-8" style="color:#F04B4B">
                      {info.value.status_name}
                    </div>
                    {btn}
                  </div>
                );
              },
            },
            {
              text: '全部审核完毕',
              match: value.全部审核完毕,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns: 1fr;">
                  <div class="warning-words pd-8" style="color:#33BA5D">
                    <i class="el-icon-circle-check"></i>
                    已完成全部审核,督促设计师完成交付
                  </div>
                </div>
              ),
            },
            {
              text: '已交付',
              match: value.已交付,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns: 1fr;">
                  <div class="warning-words pd-8" style="color:#33BA5D">
                    <i class="el-icon-circle-check"></i>
                    方案已交付
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          text: '设计中_路人且是管理员',
          match: value.设计中_路人 && value.is_admin,
          action: () => (
            <div class="permission-button-group" style="grid-template-columns: 300px 1fr;">
              <div class="warning-words pd-8">请督促设计师在截止时间前完成交付</div>
              <tg-button
                class="order_btn"
                type="primary"
                size="small"
                onClick={() => {
                  dialogTask.show({
                    executor_name: info.value.executor_name,
                    executor: info.value.executor,
                    re_distribute: true,
                    delivery_time: info.value.delivery_time,
                    level: info.value.design_level_id,
                  });
                }}
              >
                重新分配
              </tg-button>
            </div>
          ),
        },
        {
          text: '设计中_路人',
          match: value.设计中_路人,
          action: () => (
            <div class="permission-button-group" style="grid-template-columns: 1fr;">
              <div class="warning-words pd-8">设计师正在加急制作中，请稍等</div>
            </div>
          ),
        },
        {
          text: '审核中_路人',
          match: value.审核中_路人,
          action: () => (
            <div
              class="permission-button-group"
              style={{
                'grid-template-columns': value.是否内审中 ? '1fr' : '300px 1fr ',
              }}
            >
              <div class="warning-words pd-8">设计方案正在{当前状态名字}审核，即将交付</div>
              <tg-button
                class="order_btn"
                size="small"
                style="width:100%;"
                v-show={!value.是否内审中}
                onClick={() => dialogAuditOpinion.show('方案意见')}
              >
                方案意见
              </tg-button>
            </div>
          ),
        },
        {
          text: '审核结束且未交付',
          match: info.value.audit_finish && !value.已交付,
          action: () => (
            <div class="permission-button-group" style="grid-template-columns: 1fr;">
              <div class="warning-words pd-8" style="color:#33BA5D">
                <i class="el-icon-circle-check"></i>
                已完成全部审核,督促设计师完成交付
              </div>
            </div>
          ),
        },
        {
          text: '各阶段交付_路人',
          match: value.各阶段交付_路人,
          action: [
            {
              text: '是否是下单人',
              match: value.是否是下单人,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns: 1fr;">
                  <tg-button
                    class="order_btn"
                    size="small"
                    type="primary"
                    style="width:100%;"
                    onClick={() => {
                      const addition_attachment =
                        (info.value.addition_attachment?.length > 0 &&
                          info.value.addition_attachment[0].attachment.map(item => item.url)) ||
                        [];
                      const fileListAll =
                        info.value.step_list
                          .map(item => {
                            if (item.attachment && item.attachment.length > 0) {
                              return item.attachment.map(item => item.url);
                            }
                          })
                          .flat()
                          .filter(Boolean) ?? [];
                      downloadAll([...fileListAll, ...addition_attachment]);
                    }}
                  >
                    {当前状态名字 || '方案'}已交付,下载全部
                  </tg-button>
                </div>
              ),
            },
            {
              text: '非下单人',
              match: true,
              action: () => (
                <div class="permission-button-group" style="grid-template-columns: 1fr;">
                  <div class="warning-words pd-8" style="color:#33BA5D">
                    <i class="el-icon-circle-check"></i>
                    方案已交付
                  </div>
                </div>
              ),
            },
          ],
        },
      ];
      const findMatchingAction = (rules: rulesAuditType[]): (() => JSX.Element) | null => {
        for (const item of rules) {
          if (item.match) {
            if (Array.isArray(item.action)) {
              const subResult = findMatchingAction(item.action);
              if (subResult !== null) {
                return subResult;
              }
            } else if (typeof item.action === 'function') {
              return item.action;
            }
          }
        }
        return null;
      };

      const result = findMatchingAction(rulesAuditBtn)?.();
      return result ?? [];
    });

    /* 仅查看缩略图 */
    const filterImages = (fileList: string[]) => {
      const IMG = /\.(png|jpg|jpeg|gif|svg)$/;
      return fileList.filter(item => IMG.test(item));
    };

    const getViewablePictures = () => {
      if (Permission.value.是否能查看图片) {
        const images = filterImages(fileList.value || []);
        const showSwitchs = images.length > 6;

        if (showSwitchs) {
          return (
            <switchs
              // v-show={Permission.是否能查看图片}
              showicon={true}
              ref="switchs"
              style="width: 100%;margin-bottom:14px"
            >
              <template slot="pre">
                <tg-button class="time-btn" type="link" onClick={() => pre(`switchs`)}>
                  <tg-icon name="ico-arrow-left"></tg-icon>
                </tg-button>
              </template>
              <div class="itemBox">
                {images.map((item, index: number) => (
                  <div class="item">
                    <img src={item} alt="" />
                    <div
                      class="mask"
                      onClick={() => {
                        opImgView(index);
                      }}
                    >
                      <i class="el-icon-zoom-in"></i>
                    </div>
                  </div>
                ))}
              </div>
              <template slot="next">
                <tg-button class="time-btn" type="link" onClick={() => next(`switchs`)}>
                  <tg-icon name="ico-arrow-right"></tg-icon>
                </tg-button>
              </template>
            </switchs>
          );
        } else {
          return (
            <div class="itemBox" style="width: 100%;margin-bottom:14px">
              {images.map((item, index: number) => (
                <div class="item">
                  <img src={item} alt="" />
                  <div
                    class="mask"
                    onClick={() => {
                      opImgView(index);
                    }}
                  >
                    <i class="el-icon-zoom-in"></i>
                  </div>
                </div>
              ))}
            </div>
          );
        }
      }
    };

    /* 上传控件 */
    const handleRemove = (file: string) => {
      changeUpload('delete', file);
    };
    const beforeUpload = (config: any): boolean => ValidationFileUpload({ fileSize: 500 })(config);
    /* 上传or删除附件 */
    const changeUpload = (type: 'add' | 'delete', file = '') => {
      if (type === 'add') {
        loading.value = true;
        Set_Design_Order_add_attachment({
          order_id: order_id.value,
          attachment_url_list: [file], //接口需要数组
        }).then(res => {
          if (res.data.error_code === 0) {
            updata?.();
            ctx.root.$message.success(res.data.message ?? '上传成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '上传失败');
            loading.value = false;
          }
        });
      } else if (type === 'delete') {
        loading.value = true;
        Set_Design_Order_del_attachment({
          order_id: order_id.value,
          attachment_url: file,
        }).then(res => {
          if (res.data.error_code === 0) {
            updata?.();
            ctx.root.$message.success(res.data.message ?? '删除成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '删除失败');
            loading.value = false;
          }
        });
      }
    };
    /* 交付-补充文件 */
    const changeDeliveryUpload = (type: 'add' | 'delete', file = '') => {
      if (type === 'add') {
        loading.value = true;
        Set_Design_delivery_add_attachment({
          order_id: order_id.value,
          attachment_url_list: [file], //接口需要数组
        }).then(res => {
          if (res.data.error_code === 0) {
            updata?.();
            ctx.root.$message.success(res.data.message ?? '上传成功');
          } else {
            loading.value = false;
            ctx.root.$message.error(res.data.message ?? '上传失败');
          }
        });
      } else if (type === 'delete') {
        loading.value = true;
        Set_Design_delivery_del_attachment({
          order_id: order_id.value,
          attachment_url: file,
        }).then((res: any) => {
          ctx.emit('update:showMask', false);
          if (res.data.error_code === 0) {
            updata?.();
            ctx.root.$message.success(res.data.message ?? '删除成功');
          } else {
            loading.value = false;
            ctx.root.$message.error(res.data.message ?? '删除失败');
          }
        });
      }
    };
    /* 图片滑动 */
    const next = (v: string) => {
      //@ts-ignore
      ctx.refs[v].next();
    };
    const pre = (v: string) => {
      //@ts-ignore
      ctx.refs[v].pre();
    };
    /* 图片预览 */
    // const dialogImageViewRef = ref<{ show: (...args: any) => void }>();
    const opImgView = (index: number) => {
      const list = fileList.value.filter(item => {
        const IMG = /\.(png|jpg|jpeg|gif|svg)$/;
        if (IMG.test(item)) {
          return true;
        }
      });
      // dialogImageViewRef.value?.show('查看照片', list, index);
      ImageViewer.show(list, index);
    };
    const downloadAll = (list: any[]) => {
      if (!list?.length) return ctx.root.$message.error('暂无文件可下载');
      list.forEach(item => {
        // window.open(item);
        downloadFileFromLink(item, /tiange-oss/g.test(item) ? false : true);
      });
    };
    const getTime = (time: string) => {
      return time ? moment(time).format('YYYY.MM.DD HH:mm') : '--';
    };
    /* 截止时间 */
    const overdue = () => {
      const { value } = info;
      if (
        value.status === OrderStatusEnum.delivered ||
        value.status === OrderStatusEnum.completed ||
        value.status === OrderStatusEnum.rejected
      ) {
        return;
      }
      // 截止日期
      const delivery_time = moment(value.delivery_time);
      // 交付日期
      let dueTime = moment();
      if (value.actual_delivery_time) {
        dueTime = moment(value.actual_delivery_time);
      }

      if (dueTime.isAfter(delivery_time)) {
        return '#d70000';
      }
      return '#3D84FF';
    };
    return {
      info,
      routes,
      loading,
      dialogTask,
      dialogOpinon,
      handleRemove,
      fileList,
      changeUpload,
      next,
      pre,
      eventCancellation,
      beforeUpload,
      currentNode,
      opImgView,
      // dialogImageViewRef,
      Permission,
      getFileList,
      stepList,
      changeDeliveryUpload,
      downloadAll,
      getTime,
      overdue,
      getViewablePictures,
      rulesAudit,
    };
  },
  render() {
    const { info, Permission } = this;
    return (
      <div class="">
        <div class="warp-box detail-box">
          {/* 设计明细-待分配 */}
          <detailCard
            v-show={Permission.distribution}
            cardsStlye={{ width: '416px', height: '196px' }}
            headerStyle={{ color: '#3D84FF', background: 'rgba(80, 144, 253, 0.2)' }}
            title="设计明细"
          >
            <div class="design-details-no-order">
              <div class="design-details-no-order-title">
                评估需求是否完整合理，接受后分配设计师和截止时间
              </div>
              <div class="btn-box">
                <tg-button
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.dialogTask.show();
                  }}
                >
                  接受
                </tg-button>
                <tg-button
                  size="small"
                  onClick={() => {
                    this.dialogOpinon.show('拒绝原因');
                  }}
                >
                  拒绝
                </tg-button>
              </div>
            </div>
          </detailCard>
          {/* 需求方-未接单 */}
          <detailCard
            v-show={Permission.待分配无权限}
            cardsStlye={{ width: '416px', height: '220px' }}
            headerStyle={{ color: '#3D84FF', background: 'rgba(80, 144, 253, 0.2)' }}
            title="设计明细"
          >
            <div class="design-details-no-order">
              <empty-common class="empty" detailText=" " />
              <div class="design-details-no-order-title bold">还未接单</div>
              <div class="sub-title">设计师正在评估，请稍等片刻</div>
            </div>
          </detailCard>
          {/* 需求方-已拒绝 */}
          <detailCard
            v-show={Permission.待分配已拒绝}
            cardsStlye={{ width: '416px', height: '224px' }}
            headerStyle={{ color: '#3D84FF', background: 'rgba(80, 144, 253, 0.2)' }}
            title="设计明细"
          >
            <div class="design-details-no-order no-data">
              {/* <empty-common class="empty" detailText=" " /> */}
              <img
                src={require('@/assets/img/design/empty.png')}
                style="width: 85px; height: 90px; margin-bottom: 10px;margin-top:4px;"
              />
              <div class="design-details-no-order-title bold">需求被拒绝</div>
              <div class="sub-title">请与设计师沟通后重新下单</div>
            </div>
          </detailCard>

          {/* 设计师-设计明细 */}
          <detailCard
            v-loading={this.loading}
            v-show={info.step_status > 0 && !Permission.待分配无权限 && !Permission.待分配已拒绝}
            cardsStlye={{ width: '475px', height: 'max-content', position: 'relative' }}
            headerStyle={{
              color: '#3D84FF',
              background: 'rgba(80, 144, 253, 0.2)',
            }}
            title="设计明细"
          >
            <div slot="header" class="card-header20230203">
              <span>设计明细</span>
              <div
                class="designCancellation"
                v-show={Permission.design_cancel}
                onClick={() => {
                  this.eventCancellation.show();
                }}
              >
                <i class="el-icon-warning-outline tip-icon"></i>
                设计取消
              </div>
            </div>
            <div class="card">
              <div class="header-content">
                <div>
                  <span>设计师：</span>
                  <span class="value">{info.executor_name || '--'}</span>
                  <span class="mgl-20">分配人：</span>
                  <span class="value">{info.assigner_name || '--'}</span>
                </div>
                <div>
                  <span>项目等级：</span>
                  <span class="value">{info.design_level_name || '--'}</span>
                </div>
                <div>
                  <span style={{ color: this.overdue() }}>截止时间：</span>
                  <span class="value" style={{ color: this.overdue() }}>
                    {this.getTime(info.delivery_time) || '--'}
                  </span>
                </div>
                <div>
                  <span>分配时间：</span>
                  <span class="value">{this.getTime(info.allocate_time) || '--'}</span>
                </div>
              </div>
              <div class="line"></div>
              <div class="mgb-14" v-show={Permission.显示阶段进度}>
                {/* <span class="item open">内审</span>
                  <span class="item open">初稿</span> */}
                {/* <span class="item open1" data-width="10px">
                    终稿
                  </span> */}
                <step
                  active={this.currentNode}
                  step={this.stepList}
                  onClick={(item: any) => this.getFileList(item)}
                />
              </div>
              <div class="upload-box">
                <div
                  class="upload-list"
                  style={{
                    marginBottom:
                      Permission.已上传未提交 &&
                      Permission.修改文件 &&
                      !Permission.设计师_拒绝状态_附件已清空
                        ? '14px'
                        : '',
                  }}
                >
                  {/* 上传 */}
                  <tg-upload
                    v-show={
                      Permission.已上传未提交 &&
                      Permission.修改文件 &&
                      !Permission.设计师_拒绝状态_附件已清空
                    }
                    multiple={true}
                    class="col-span-full"
                    action="/api/resources/upload_file"
                    show-file-list={false}
                    data={{ type: 'visual_design', storage: 2 }}
                    beforeUpload={this.beforeUpload}
                    success={(res: { data: { source: string }; success: boolean }) => {
                      if (res.success) {
                        this.changeUpload('add', res.data.source);
                        // this.fileList.push(res.data.source);
                        // contract.uploadScans(res.data.source);
                      }
                    }}
                  >
                    <div class="upload-add-box">
                      <i class="el-icon-plus"></i>
                      <span class="upload-add-text">点击新增</span>
                    </div>
                  </tg-upload>
                  {(Permission.已上传未提交 || Permission.修改文件) &&
                    this.fileList?.length > 0 &&
                    this.fileList
                      .filter((item: string) => {
                        const IMG = /\.(png|jpg|jpeg|gif|svg)$/;
                        if (IMG.test(item)) {
                          return true;
                        }
                      })
                      .map((item: string, index: number) => {
                        return (
                          <div class="upload-list-item">
                            <img src={item} alt="" onclick={() => ImageViewer.show([item])} />
                            <i
                              class="el-icon-circle-close"
                              onClick={() => this.handleRemove(item)}
                            />
                          </div>
                        );
                      })}
                  {/* 仅查看 */}
                  {/* <dialogImageView ref="dialogImageViewRef" /> */}
                  {this.getViewablePictures()}
                </div>
                <div
                  class="file-text-box"
                  /* (Permission.修改文件 &&
                            Permission.当前进行步骤 &&
                            Permission.当前进行步骤.attachment.length > 0)) */
                  style={{
                    marginBottom: '14px',
                  }}
                  v-show={
                    (Permission.是否能查看文件 || Permission.修改文件) &&
                    Permission.是否显示文件列表
                  }
                >
                  {this.fileList?.length > 0 &&
                    this.fileList
                      .filter((item: string) => !item?.match(/\.(png|jpg|jpeg|gif|svg)$/))
                      .map((item: string, index: number) => {
                        return (
                          <file-item
                            isManualUpload={true}
                            class="mgt-4"
                            limitNameWidth={80}
                            showPreview={false}
                            readonly={!Permission.修改文件}
                            key={index}
                            filepath={item}
                            onDownload={() => {
                              // console.log(downloadFileFromLink, i, 'i');
                              downloadFileFromLink(item, /tiange-oss/g.test(item) ? false : true);
                              // window.open(i);
                            }}
                            onRemove={() => this.handleRemove(item)}
                          />
                        );
                      })}
                </div>
              </div>
              {this.rulesAudit}
              {/* 补充文件 */}
              <div v-show={Permission.是否有交付附件}>
                <div class="line"></div>
                <div class="file-text-box">
                  {info.addition_attachment?.length > 0 &&
                    info.addition_attachment[0].attachment.map((item, index: number) => {
                      return (
                        <file-item
                          isManualUpload={true}
                          class="mgt-10"
                          limitNameWidth={80}
                          showPreview={true}
                          readonly={!Permission.设计师确认交付}
                          key={index}
                          filepath={item.url}
                          onDownload={() => {
                            downloadFileFromLink(
                              item.url,
                              /tiange-oss/g.test(item.url) ? false : true,
                            );
                            // window.open(i);
                          }}
                          onRemove={() => this.changeDeliveryUpload('delete', item.url)}
                        />
                      );
                    })}
                </div>
              </div>
              <div
                v-show={info.status === OrderStatusEnum.cancelled}
                class="mask mask-eventCancellation"
                style="opacity:1"
              >
                设计需求已取消
              </div>
            </div>
          </detailCard>
        </div>
      </div>
    );
  },
});
