import { defineComponent, computed, ref, nextTick } from '@vue/composition-api';
import { useRequest } from '@gm/hooks/ahooks';
import { get_project_product_follow_up_record } from '@/services/datacenter';
import { usePermission } from '@/use/permission';
export default defineComponent({
  props: {
    item: {
      type: Object,
    },
  },
  setup(props, ctx) {
    const popoverRef = ref<any>();
    const goodsInfo = computed(() => props.item);
    const reqPopoverFollowUpRecord = useRequest(get_project_product_follow_up_record, {
      manual: true,
      onSuccess() {
        methdos.updatePopoverPosition();
      },
    });
    const permission = usePermission();
    const reqEditGetFollowUpRecord = useRequest(get_project_product_follow_up_record, {
      manual: true,
      onSuccess(data) {
        ctx.emit('edit', props.item, data);
      },
    });
    const methdos = {
      onFollowUpHandler(e: PointerEvent) {
        // followUpDialog.show(item);
        if (goodsInfo.value?.follow_up_status === E.datacenter.FollowUpStatus.not_follow_up) {
          ctx.emit('edit', props.item, undefined);
        }
        // else if (reqEditGetFollowUpRecord.data?.product_sn) {
        //   ctx.emit('edit', props.item, reqEditGetFollowUpRecord.data);
        // }
        else {
          reqEditGetFollowUpRecord.runAsync({
            project_id: goodsInfo.value?.project_id,
            product_sn: goodsInfo.value?.sn,
          });
        }
        e.stopPropagation();
      },
      formatDate(date: string) {
        return date?.replace(/-/g, '.') || '--';
      },
      statusClass(status: E.datacenter.FollowUpStatus) {
        const baseClass = 'follow-up-status';
        let varClass = 'not-follow-up';
        switch (status) {
          case E.datacenter.FollowUpStatus.not_follow_up:
            varClass = 'not-follow-up';
            break;
          case E.datacenter.FollowUpStatus.follow_up:
            varClass = 'follow-up';
            break;
          case E.datacenter.FollowUpStatus.lived:
            varClass = 'lived';
            break;
          case E.datacenter.FollowUpStatus.not_live:
            varClass = 'not-live';
            break;
        }
        return `${baseClass} ${varClass}`;
      },
      updatePopoverPosition() {
        setTimeout(() => {
          nextTick(() => {
            popoverRef.value?.updatePopper();
          });
        }, 0);
      },
    };
    return {
      popoverRef,
      goodsInfo,
      reqPopoverFollowUpRecord,
      reqEditGetFollowUpRecord,
      permission,
      ...methdos,
    };
  },
  render() {
    const { permission, goodsInfo, reqPopoverFollowUpRecord, reqEditGetFollowUpRecord } = this;
    const { data: record } = reqPopoverFollowUpRecord;
    return (
      <div class="tg-follow-up-status-tag">
        <el-popover
          ref="popoverRef"
          disabled={goodsInfo?.follow_up_status === E.datacenter.FollowUpStatus.not_follow_up}
          popper-class="tg-video-goods-follow-up-popover"
          open-delay={300}
          trigger="hover"
          placement="top"
          on-show={() => {
            this.reqPopoverFollowUpRecord.runAsync({
              project_id: goodsInfo?.project_id,
              product_sn: goodsInfo?.sn,
            });
            this.updatePopoverPosition();
          }}
        >
          <div slot="reference" class={this.statusClass(goodsInfo?.follow_up_status)}>
            {E.datacenter.FollowUpStatusMap.get(goodsInfo?.follow_up_status)}
          </div>
          {reqPopoverFollowUpRecord.loading ? (
            <div class="data-loading">
              <i class="el-icon-loading"></i>
              <span>加载中，请稍候...</span>
            </div>
          ) : (
            <div class="follow-up-content">
              <div class="follow-up-field display-grid">
                <div>
                  <span class="label">跟进时间：</span>
                  <span class="value">{this.formatDate(record?.follow_up_date)}</span>
                </div>
                <div>
                  <span class="label">对接人：</span>
                  <span class="value">{record?.follow_up_user_name || '--'}</span>
                </div>
                <div class="grid-tow-column display-flex">
                  <span class="label">备注：</span>
                  <div>
                    <span class="value">{record?.follow_up_comment || '--'}</span>
                    <div class="label operator-info">{`${this.formatDate(
                      record?.follow_up_operator_datetime,
                    )} ${record?.follow_up_operator_name || ''}`}</div>
                  </div>
                </div>
              </div>
              {record?.is_feedback === 1 && (
                <div class="feedback-field display-grid">
                  <div>
                    <span class="label">反馈时间：</span>
                    <span class="value">{this.formatDate(record?.feedback_date)}</span>
                  </div>
                  <div>
                    <span class="label">反馈人：</span>
                    <span class="value">{record?.feedback_user_name || '--'}</span>
                  </div>
                  <div class="grid-tow-column">
                    <span class="label">反馈结果：</span>
                    <span class="value">
                      {record?.is_live === 1 ? '已直播' : record?.is_live === 0 ? '未直播' : '--'}
                    </span>
                  </div>
                  <div class="grid-tow-column display-flex">
                    <span class="label">备注：</span>
                    <div>
                      <span class="value">{record?.feedback_comment || '--'}</span>
                      <div class="label operator-info">{`${this.formatDate(
                        record?.feedback_operator_datetime,
                      )} ${record?.feedback_operator_name || ''}`}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </el-popover>
        {permission.short_video_test_follow_up && (
          <tg-button
            type="link"
            class="follow-up-edit"
            on-click={(e: any) => this.onFollowUpHandler(e)}
          >
            <tg-icon name="ico-icon_bianji"></tg-icon>
          </tg-button>
        )}

        <tg-mask-loading
          visible={reqEditGetFollowUpRecord.loading}
          content="  正在加载，请稍候..."
        />
      </div>
    );
  },
});
