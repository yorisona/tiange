import { ProjectTypeEnum, ProjectTypeEnumMap } from '@/types/tiange/commonBusiness/project';
import { computed, Ref } from '@vue/composition-api';
import store from '@/store';
import Vue from 'vue';
// import { OptionType } from '@/types/base/advanced';
import { Query_Design_Type } from '@/services/design';
import { UserInfo } from '@/types/tiange/system';
import { useDialog } from '@/use/dialog';
import {
  Set_Design_Order_distribution,
  Set_Design_cancel,
  Set_Design_Order_refuse,
  Set_Design_Order_failed_review,
} from '@/services/design';

export enum OrderStatusEnum {
  /** 待接单 */
  initial = 0,
  /** 已接单 */
  ordersReceived = 100,
  /** 内审中 */
  inInternalAudit = 200,
  /** 内审通过 */
  internalAuditPassed = 201,
  /** 内审不通过 */
  internalAuditFailed = 202,
  /** 初稿审核中 */
  theFirstDraftIsUnderReview = 210,
  /** 初稿审核通过 */
  theFirstDraftWasApproved = 211,
  /** 初稿审核不通过 */
  theFirstDraftWasNotApproved = 212,
  /** 终稿审核中 */
  finalDraftReview = 220,
  /** 终稿审核通过 */
  finalDraftApproved = 221,
  /** 终稿审核不通过 */
  finalDraftReviewFailed = 222,
  /** 已交付 */
  delivered = 400,
  /** 已完成 */
  completed = 600,
  /** 已拒绝 */
  rejected = 610,
  /** 已取消 */
  cancelled = 620,
}

export const OrderStatusEnumMap = new Map([
  [OrderStatusEnum.initial, '待接单'],
  [OrderStatusEnum.ordersReceived, '已接单'],
  [OrderStatusEnum.inInternalAudit, '内审中'],
  [OrderStatusEnum.internalAuditPassed, '内审通过'],
  [OrderStatusEnum.internalAuditFailed, '内审不通过'],
  [OrderStatusEnum.theFirstDraftIsUnderReview, '初稿审核中'],
  [OrderStatusEnum.theFirstDraftWasApproved, '初稿审核通过'],
  [OrderStatusEnum.theFirstDraftWasNotApproved, '初稿审核不通过'],
  [OrderStatusEnum.finalDraftReview, '终稿审核中'],
  [OrderStatusEnum.finalDraftApproved, '终稿审核通过'],
  [OrderStatusEnum.finalDraftReviewFailed, '终稿审核不通过'],
  [OrderStatusEnum.delivered, '已交付'],
  [OrderStatusEnum.completed, '已完成'],
  [OrderStatusEnum.rejected, '已拒绝'],
  [OrderStatusEnum.cancelled, '已取消'],
]);

export type FormType = {
  // reservation_status: E.design.AppointmentStatus | null;
  // business_type: ProjectTypeEnum | null;
  /* 项目名称 */
  project_name: string;
  /* 执行状态 */
  order_status: OrderStatusEnum | null;
  department_name: string | undefined;
  department_id: number | undefined;
  /* 项目类型 */
  project_type: ProjectTypeEnum | undefined;
  /*项目小组*/
  team_id?: number | undefined;
  /*项目类别*/
  level_id?: number | undefined;
  /*執行人*/
  execute_person_name?: string;
  /* 项目方 */
  brand_name?: string;
  brand_id?: number;
  executor_id?: number;
};

export const projectTypeOptions = computed(() => {
  let options: { label: any; value: ProjectTypeEnum }[] = [];
  // 5, 6, 2, 1, 4, 3
  const types = [
    ProjectTypeEnum.taobao_cps,
    ProjectTypeEnum.v_task,
    ProjectTypeEnum.label,
    ProjectTypeEnum.clothing,
    ProjectTypeEnum.head,
    ProjectTypeEnum.makeups,
  ];
  options = types.map(el => {
    return {
      label: ProjectTypeEnumMap.get(el),
      value: el,
    };
  });
  return options;
});

export const executionStatus = computed(() => {
  let options: { label: any; value: OrderStatusEnum }[] = [];
  // 5, 6, 2, 1, 4, 3
  const types = [
    OrderStatusEnum.initial,
    OrderStatusEnum.ordersReceived,
    OrderStatusEnum.inInternalAudit,
    OrderStatusEnum.internalAuditPassed,
    OrderStatusEnum.internalAuditFailed,
    OrderStatusEnum.theFirstDraftIsUnderReview,
    OrderStatusEnum.theFirstDraftWasApproved,
    OrderStatusEnum.finalDraftReview,
    OrderStatusEnum.finalDraftApproved,
    OrderStatusEnum.finalDraftReviewFailed,
    OrderStatusEnum.delivered,
    OrderStatusEnum.completed,
    OrderStatusEnum.rejected,
    OrderStatusEnum.cancelled,
  ];
  options = types.map(el => {
    return {
      label: OrderStatusEnumMap.get(el),
      value: el,
    };
  });
  return options;
});

export interface Design_Order {
  /* 下单id */
  id: string;
  /* 下单人 */
  add_by_name: string;
  /* 下单时间) */
  add_by_time: string;
  /* 下单部门 */
  department_name: string;
  /* 执行人 */
  execute_person_name: string;
  /* (期望截稿时间) */
  expect_delivery_time: string;
  /* 执行状态 */
  order_status: string;
  order_status_name: string;
  /* 项目名称 */
  project_name: string;
  /* 项目类型 */
  project_type: string;
  /* 交付时间 */
  actual_delivery_time: string;
  /* 负责小组 */
  team_name: string;
  /*項目類別*/
  level_name: string;
}

/* 项目类型下拉 */
export const projectType_option = async (v: number) => {
  return await Query_Design_Type(v).then((res: any) => {
    if (res.data.data) {
      return res.data.data.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    } else {
      return [];
    }
  });
};

/* history_record 历史记录结构 */
/*Attachment*/
export interface Attachment {
  file_name?: string;
  url: string;
}

/*Comment_list*/
export interface Comment_list {
  add_by: number;
  add_by_name: string;
  comment: string;
  design_order_id: number;
  design_order_step_info_id: number;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
}

/* 交付附加内容 */
export interface Deliver_Additional_Content {
  attachment: Attachment[];
  delivery_content: string;
  design_type_id: number;
  file_extension: string[];
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  name: string;
  attachment_type: number;
}

/*历史审核记录*/
export interface History_Structure {
  //111
  attachment: Attachment[];
  /* 阶段审核人ID */
  audit_by: number;
  /* 阶段审核人花名 */
  audit_by_name: string;
  /* 驳回意见 */
  audit_comment: string;
  /* 审核意见详情列表 */
  comment_list: Comment_list[];
  /* 设计订单ID */
  design_order_id: number;
  /* 阶段创建时间 */
  gmt_create: string;
  /* 审核时间 */
  gmt_modified: string;
  /* id */
  id: number;
  /* 设计订单阶段ID */
  step_id: number;
  /* 阶段mapname */
  step_name: string;
  /* 阶段提审时间 */
  submit_time: string;
}

/*Addition_attachment*/
export interface Addition_attachment {
  attachment: Attachment[];
  delivery_content: string;
  design_type_id: number;
  file_extension: string[];
  design_type_name: string;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  name: string;
}

/*Delivery_attachment*/
export interface Delivery_attachment {
  attachment: Attachment[];
  design_type_id: number;
  design_type_name: string;
  file_extension: string[];
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  name: string;
}

/*Design_level_info*/
export interface Design_level_info {
  add_by: number;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  level_name: string;
  modified_by: number;
  priority: number;
  step: number[];
  tips: string;
}

/*Design_type*/
export interface Design_type {
  add_by: number;
  delivery_days: number;
  fields: string;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  modified_by: number;
  name: string;
  team_id: number;
}

// /*Design_type_detail*/
// export interface Design_type_detail {
// }

/*Design_type_detail_list*/
export interface Design_type_detail_list {
  design_type: Design_type;
  design_type_detail: any;
}

/*Step_list*/
export interface Step_list {
  add_by: number;
  attachment: Attachment[];
  audit_by: number;
  audit_by_name: string;
  audit_comment: any;
  comment_list: any;
  design_order_id: number;
  flag: number;
  gmt_create: string;
  gmt_modified: string;
  history_record: any;
  id: number;
  modified_by: number;
  step_id: number;
  step_name: string;
  submit_time: string;
  is_audit_auth: boolean;
  is_upload_auth: boolean;
  is_current: boolean;
}

/*设计订单详情*/
export interface Design_Order_Details {
  [index: string]: any;
  /* 实际交付时间 */
  actual_delivery_time: string;
  /* 下单人ID */
  add_by: number;
  /* 下单人花名 */
  add_by_name: string;
  /*附加内容详情列表  */
  addition_attachment: Addition_attachment[];
  /* 分配时间 */
  allocate_time: string;
  /* 分配人ID */
  assigner: number;
  /* 分配人花名 */
  assigner_name: string;
  /* 阶段审核是否完成 */
  audit_finish: boolean;
  /* 品牌名称 */
  brand: string;
  /* 交付内容详情列表 */
  delivery_attachment: Delivery_attachment[];
  /* 交付时间 */
  delivery_time: string;
  /* 下单人一级部门 */
  department_name: string;
  /* 订单等级ID */
  design_level_id: number;
  /* 设计级别详情 */
  design_level_info: Design_level_info;
  /* 设计类型详情列表 */
  design_type_detail_list: Design_type_detail_list[];
  // /*  */
  // design_type_id: number[];
  /* 执行人ID */
  executor: number;
  /* 执行人花名 */
  executor_name: string;
  /* 期望交付时间 */
  expectation_delivery_time: string;
  /*  */
  flag: number;
  /* 创建时间 */
  gmt_create: string;
  /* 修改时间 */
  gmt_modified: string;
  /*  */
  id: number;
  /* 修改人ID */
  modified_by: number;
  /* 修改人花名 */
  modified_by_name: string;
  /* 项目名称 */
  name: string;
  /* 拒绝理由 */
  refuse_comment: any;
  /*
  integer (0 待接单; 100 已接单; 200 内审中; 201 内审通过; 202 内审不通过; 210 初稿审核中; 211 初稿审核通过; 212 初稿审核不通过; 220 终稿审核中; 221 终稿审核通过; 222 终稿审核不通过; 400 待交付; 500 待确认; 600 已完成; 610 已拒绝; 620 已取消;) */
  status: number;
  /* 状态名称 */
  status_name: string;
  /* 阶段审核记录详情列表 */
  step_list: Step_list[];
  /* 项目主题 */
  subject: string;
  /* 项目小组id */
  team_id: number;
  /* 项目小组名称 */
  team_name: string;
}

import { Query_Design_Order_Detail } from '@/services/design';
import { useRouter } from '@/use/vue-router';
const router = useRouter();

export const order_detail = Vue.observable<{
  data: Design_Order_Details;
  order_id: string;
  isWorkbench: boolean;
}>({
  data: {},
  isWorkbench: /workbench/.test(router.currentRoute.path),
  order_id: router.currentRoute.query.order_id as string,
} as any);

const init = async () => {
  order_detail.order_id = router.currentRoute.query.order_id as string;
  order_detail.isWorkbench = /workbench/.test(router.currentRoute.path);
  const { data } = await Query_Design_Order_Detail(order_detail.order_id, order_detail.isWorkbench);
  order_detail.data = data.data as Design_Order_Details;
  // console.log(order_detail.data, router.currentRoute.query.order_id, 'order_detail.data');
};
export const useOrder = async (order_id?: string) => {
  if (order_id && order_id !== order_detail.order_id) {
    order_detail.order_id = order_id;
  }
  await init();
  return order_detail;
};

export const useDesignPermission = (tempIndex: Ref<number>) => {
  return computed(() => {
    const user: UserInfo = store.getters['user/getUserInfo'];
    const step_list = order_detail.data?.step_list || [];
    const 当前进行步骤 = step_list.find(item => item.is_current);
    /* 是否是下单人 */
    const 是否是下单人 = order_detail.data?.add_by === user.id;
    /* 是否设计师 */
    const is_designer = order_detail.data.executor === user.id;
    /* 是否管理员 */
    const is_admin = order_detail.data.is_can_assigner;
    /* 待分配管理者 */
    const distribution = order_detail.data.step_status === OrderStatusEnum.initial && is_admin;
    /* 设计取消 */
    const design_cancel = order_detail.data.status < OrderStatusEnum.delivered && is_admin;
    /* 审批人员 */
    const 当前人员是否能审批 = 当前进行步骤 && 当前进行步骤.is_audit_auth;
    /* 待分配无权限非管理者 */
    const 待分配无权限 = order_detail.data.step_status === OrderStatusEnum.initial && !is_admin;
    /* 待分配已拒绝 */
    const 待分配已拒绝 = order_detail.data.status === OrderStatusEnum.rejected;
    /* 是否内审中 */
    const 是否内审中 = order_detail.data.status === OrderStatusEnum.inInternalAudit;

    /* ----------- */
    /* 设计师已分配未上传 */
    const 已分配未上传 =
      order_detail.data.step_status === 1 && !step_list[0].attachment && is_designer;
    /* 设计师已上传未提交 */
    const 已上传未提交 =
      (order_detail.data.step_status === 1 && step_list[0].attachment && is_designer) ||
      (order_detail.data.step_status === 2 && step_list[tempIndex.value]?.is_upload_auth);
    // console.log(tempIndex, order_detail.data.step_list.length, 'tempIndex');
    /* 当前按钮节点能否修改 */
    const 修改文件 = 已上传未提交 || step_list[tempIndex.value]?.is_upload_auth;

    const 是否能查看图片 =
      // 查看上传文件 &&
      (!修改文件 || order_detail.data.status === OrderStatusEnum.delivered) &&
      step_list[tempIndex.value]?.attachment?.length > 0 &&
      step_list[tempIndex.value]?.attachment?.some(item =>
        /\.(png|jpg|jpeg|gif|svg)$/.test(item.url),
      );

    const 是否能查看文件 = step_list[tempIndex.value]?.attachment?.length > 0;
    const 是否显示文件列表 =
      step_list[tempIndex.value]?.attachment?.length > 0 &&
      step_list[tempIndex.value]?.attachment?.some(
        item => !/\.(png|jpg|jpeg|gif|svg)$/.test(item.url),
      );

    /* ------------- */

    const 显示阶段进度 = order_detail.data.step_status > 0 && step_list[0]?.attachment?.length > 0;

    /* 设计师-通过状态 */
    const 通过状态 = [
      OrderStatusEnum.internalAuditPassed,
      OrderStatusEnum.theFirstDraftWasApproved,
      OrderStatusEnum.finalDraftApproved,
    ];
    const 审批中状态 = [
      OrderStatusEnum.inInternalAudit,
      OrderStatusEnum.theFirstDraftIsUnderReview,
      OrderStatusEnum.finalDraftReview,
    ];
    const 设计师_通过状态 =
      order_detail.data.step_status === 2 &&
      is_designer &&
      通过状态.includes(order_detail.data.status) &&
      !order_detail.data.audit_finish;
    /* 设计师-等待审核状态 */
    const 设计师_等待审核状态 =
      审批中状态.includes(order_detail.data.status) &&
      order_detail.data.step_status === 2 &&
      !order_detail.data.audit_finish;
    /* 设计师-拒绝状态 */
    const 拒绝状态 = [202, 212, 222];
    const 设计师_拒绝状态_附件已清空 =
      order_detail.data.step_status === 2 &&
      is_designer &&
      拒绝状态.includes(order_detail.data.status) &&
      !当前进行步骤?.attachment?.length;

    const 设计师_拒绝状态_附件重新上传 =
      order_detail.data.step_status === 2 &&
      is_designer &&
      拒绝状态.includes(order_detail.data.status) &&
      当前进行步骤?.attachment?.length;

    const 设计师确认交付 =
      order_detail.data.status !== OrderStatusEnum.delivered &&
      order_detail.data.audit_finish &&
      is_designer;

    const 已交付 = order_detail.data.status === OrderStatusEnum.delivered;

    /* 审批人员------- */
    const 审批人员_审批中 =
      order_detail.data.step_status === 2 &&
      当前人员是否能审批 &&
      审批中状态.includes(order_detail.data.status);

    const 审批人员_审批拒绝 =
      order_detail.data.step_status === 2 &&
      当前人员是否能审批 &&
      拒绝状态.includes(order_detail.data.status);
    const 全部审核完毕 = order_detail.data.audit_finish && 当前人员是否能审批;

    /* 普通(下单)人--------- */
    const 设计中_路人 = order_detail.data.step_status === 1 && !is_designer && !当前人员是否能审批;
    const 审核中_路人 =
      order_detail.data.step_status === 2 &&
      (order_detail.data.status === OrderStatusEnum.internalAuditPassed ||
        审批中状态.includes(order_detail.data.status)) &&
      !is_designer &&
      !当前人员是否能审批;

    // const 各阶段交付状态 = [201, 211, 221, 400] 各阶段交付状态.includes(order_detail.data.status);
    const 各阶段交付_路人 = !is_designer && !当前人员是否能审批 && 已交付;
    // /* 交付阶段 */
    // const 交付阶段 = order_detail.data.step_status === 3 && is_designer;
    const 是否有交付附件 =
      order_detail.data.addition_attachment?.length &&
      order_detail.data.addition_attachment.some(item => item.attachment.length);
    return {
      is_admin,
      distribution,
      design_cancel,
      待分配无权限,
      待分配已拒绝,
      当前进行步骤,
      已分配未上传,
      已上传未提交,
      设计中_路人,
      显示阶段进度,
      审核中_路人,
      是否内审中,
      // 查看上传文件,
      是否能查看图片,
      是否能查看文件,
      是否显示文件列表,
      修改文件,
      is_designer,
      设计师_通过状态,
      设计师_拒绝状态_附件已清空,
      设计师_拒绝状态_附件重新上传,
      设计师_等待审核状态,
      设计师确认交付,
      已交付,
      当前人员是否能审批,
      审批人员_审批中,
      全部审核完毕,
      审批人员_审批拒绝,
      各阶段交付_路人,
      是否有交付附件,
      是否是下单人,
    };
  });
};

export type rulesAuditType = {
  text: string;
  match: any;
  action: rulesAuditType[] | (() => JSX.Element);
};

interface DialogComponent {
  taskAssignmentDialog: Vue.Component;
  opinionDialog: Vue.Component;
  eventCancellationDialog: Vue.Component;
  auditOpinionDialog: Vue.Component;
  auditFailedDialog: Vue.Component;
}
interface DialogProps {
  component: Record<keyof DialogComponent, Vue.Component>;
  props: {
    loading: Ref<boolean>;
    ctx: any;
    updata?: Function;
    order_id: Ref<string>;
    info: any;
  };
}
interface DialogConfig {
  component: Vue.Component;
  title: string;
  width?: string;
  footer?: boolean;
  props?: DialogProps;
  on?: {
    submit?: (data: any) => Promise<{ data: { error_code: number; message: string } }>;
    close?: () => void;
  };
}

const useDialogHelper = ({
  component,
  title,
  width,
  footer = true,
  props = {} as DialogProps,
  on = {},
}: DialogConfig) => {
  const { loading, ctx, updata, info } = props.props;
  // console.log(props, loading, info, 'props');

  const dialog = useDialog({
    component,
    title,
    width,
    footer,
    props: {
      info,
    },
    on: {
      submit: async (data: any) => {
        if (on.submit) {
          loading.value = true;
          on.submit(data).then(res => {
            loading.value = false;
            if (res.data.error_code === 0) {
              updata?.();
              ctx.root.$message.success(res.data.message ?? '操作成功');
            } else {
              ctx.root.$message.error(res.data.message ?? '操作失败');
            }
            dialog.close();
          });
        } else {
          dialog.close();
        }
      },
      close: () => {
        if (on.close) {
          on.close();
        }
      },
    },
  });

  return dialog;
};

export const useDialogAll = (props: DialogProps) => {
  const {
    taskAssignmentDialog,
    eventCancellationDialog,
    opinionDialog,
    auditOpinionDialog,
    auditFailedDialog,
  } = props.component;
  const dialogTask = useDialogHelper({
    component: taskAssignmentDialog,
    title: '任务分配',
    width: '340px',
    props,
    on: {
      submit: (v: any) =>
        Set_Design_Order_distribution({
          order_id: props.props.order_id.value,
          ...v,
        }),
    },
  });

  const eventCancellation = useDialogHelper({
    component: eventCancellationDialog,
    title: '活动取消',
    width: '360px',
    footer: false,
    props,
    on: {
      submit: () => Set_Design_cancel({ order_id: props.props.order_id.value }),
    },
  });

  const dialogOpinon = useDialogHelper({
    component: opinionDialog,
    title: '拒绝原因',
    width: '320px',
    props,
    on: {
      submit: ({ message }: any) =>
        Set_Design_Order_refuse({
          order_id: props.props.order_id.value,
          refuse_comment: message,
        }),
    },
  });
  /** 方案意见 */
  const dialogAuditOpinion = useDialogHelper({
    component: auditOpinionDialog,
    title: '审核意见',
    width: '360px',
    footer: false,
    props,
  });

  const dialogAuditFailed = useDialogHelper({
    component: auditFailedDialog,
    title: '审核结果',
    width: '320px',
    props,
    on: {
      submit: ({ comment }: any) =>
        Set_Design_Order_failed_review({
          order_id: props.props.order_id.value,
          audit_comment: comment,
        }),
    },
  });

  return {
    dialogTask,
    eventCancellation,
    dialogOpinon,
    dialogAuditOpinion,
    dialogAuditFailed,
  };
};
