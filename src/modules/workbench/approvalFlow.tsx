import { ApprovalFlowDetail, ApprovalInfo, TiangeApprovalStream } from '@/types/tiange/workbench';
import { computed, defineComponent, h, SetupContext } from '@vue/composition-api';

export default defineComponent({
  name: 'ApprovalFlow',
  setup(props, ctx: SetupContext) {
    const workbenchState = computed(() => ctx.root.$store.state.workbench);
    const approval = computed<ApprovalInfo | undefined>(() => workbenchState.value.approval);

    const isFromOA = computed(
      () =>
        (approval.value?.approval_flow_detail ?? []).length >= 0 &&
        approval.value?.approval_stream.length === 0,
    );

    /** 步骤 */
    const step_status = computed(() => {
      if (approval.value === undefined) {
        return 0;
      }

      const isDone = [2, 3].includes(approval.value.approval_status ?? -1);

      if (isFromOA.value) {
        return approval.value.approval_flow_detail.length;
      } else {
        return approval.value.steps + (isDone ? 1 : 0);
      }
    });

    const flowDetail = computed<Array<ApprovalFlowDetail | TiangeApprovalStream>>(() => {
      if (approval.value === undefined) {
        return [];
      } else if (approval.value.approval_flow_detail.length > 0) {
        return approval.value.approval_flow_detail.map(el => ({
          ...el,
          username: el.receivedPersons,
        }));
      } else {
        return approval.value.approval_stream;
      }
    });

    return {
      approval,
      step_status,
      flowDetail,
      isFromOA,
    };
  },
  render() {
    const approval: ApprovalInfo | undefined = this.approval as ApprovalInfo | undefined;
    const isFromOA = this.isFromOA as boolean;
    const step_status: number = this.step_status as number;
    const flowDetail: Array<ApprovalFlowDetail | TiangeApprovalStream> = this.flowDetail as Array<
      ApprovalFlowDetail | TiangeApprovalStream
    >;

    if (approval === undefined) {
      return <div></div>;
    }

    const mainSteps = h(
      'el-steps',
      {
        class: 'steps-line',
        props: { active: step_status, direction: 'vertical' },
      },
      [
        ...flowDetail.map((item, index) => {
          const titleNodes =
            item.role_code === 804
              ? /* 分管副总 */
                [
                  <span class="size-medium" slot="title">
                    {item.role_name + '（用款金额大于10万元）'}
                  </span>,
                ]
              : item.role_code === 802
              ? [
                  /* 副总经理 */
                  <span class="size-medium" slot="title">
                    {item.role_name + '（用款金额大于50万元）'}
                  </span>,
                ]
              : [
                  <span class="size-medium" slot="title">
                    {item.role_name}
                  </span>,
                ];

          const lastStepClass = approval.approval_status === 2 ? 'last-color' : '';
          const stepClass =
            item.approval_result === 1 ? 'color-3' : item.approval_result === 2 ? 'refuse' : '';

          const descriptionClass = ['flow-select', stepClass, lastStepClass];

          return (
            <el-step key={index} class="step-children">
              <tg-icon name="ico-step-finish" slot={'icon'}></tg-icon>
              {titleNodes}
              <div slot="description">
                <span class={descriptionClass}>审批人：</span>
                {/* 已审批 */}
                {item.approval_result ? (
                  <span>
                    {item.approval_result === 1 ? (
                      <span class={[stepClass, lastStepClass]}>
                        {isFromOA ? (item as ApprovalFlowDetail).operatorName : item.username}
                        （已同意）
                      </span>
                    ) : (
                      ''
                    )}
                    {item.approval_result === 2 ? (
                      <span class={['flow-select', 'refuse']}>
                        {isFromOA ? (item as ApprovalFlowDetail).operatorName : item.username}
                        （已拒绝）
                      </span>
                    ) : (
                      ''
                    )}
                  </span>
                ) : (
                  <span class="flow-select">
                    {isFromOA ? (item as ApprovalFlowDetail).operatorName : item.username}
                  </span>
                )}
                {/* 未审批  */}
                {item.remark !== '' || (item as ApprovalFlowDetail).oa_review_result !== '' ? (
                  <p class="refuse">
                    {item.remark
                      ? '理由:' + ((item as ApprovalFlowDetail).oa_review_result || item.remark)
                      : ''}
                  </p>
                ) : (
                  ''
                )}
                {item.approval_date ? (
                  <p
                    class={[
                      'flow-select',
                      item.approval_result === 2 ? 'refuse' : '',
                      lastStepClass,
                    ]}
                  >
                    {isFromOA
                      ? `${(item as ApprovalFlowDetail).operateDate} ${
                          (item as ApprovalFlowDetail).operateTime
                        }`
                      : `${item.approval_date}`}
                  </p>
                ) : (
                  ''
                )}
              </div>
            </el-step>
          );
        }),
        ...(isFromOA && ![2, 3, 4].includes(approval.approval_status)
          ? [
              <el-step style="height: 82px !important" class="step-children">
                <tg-icon name="ico-waiting" slot={'icon'}></tg-icon>
                <span class="size-medium" slot="title">
                  {(flowDetail[flowDetail.length - 1] as ApprovalFlowDetail).receivedPersons}
                </span>
              </el-step>,
            ]
          : []),
      ],
    );

    return h(
      'div',
      {
        class: 'steps-exted',
        attrs: {
          id: 'steps-exted',
        },
      },
      [
        !isFromOA ? (
          <el-steps direction="vertical" active={1} class="step-username">
            <el-step style="height: 82px">
              <div style="font-size: 14px" slot="title">
                申请人
              </div>
              <div slot="description">
                <span class="color-3">{approval.username}</span>
                <p class="flow-select">{approval.gmt_create_datetime}</p>
              </div>
            </el-step>
          </el-steps>
        ) : (
          ''
        ),
        mainSteps,
        approval.approval_status === 4 ? (
          <el-steps direction="vertical" active={1} class="step-username revocation">
            <el-step style="height: 82px">
              <div style="font-size: 14px" slot="title">
                申请人
              </div>
              <div slot="description">
                <span class="flow-select revocation-color">{approval.username}（已撤销）</span>
                <p class="flow-select revocation-color">{approval.gmt_modified}</p>
              </div>
            </el-step>
          </el-steps>
        ) : (
          ''
        ),
      ],
    );
  },
});
