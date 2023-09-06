import { EvaluateAnchorRecruit } from '@/services/anchorRecruitment';
import { formatAmount } from '@/utils/string';
import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';

interface QueryForm {
  recruit_id: number | undefined;
  recruit_satisfaction: number | undefined;
}

export default defineComponent({
  setup(props, ctx) {
    const loading = ref(false);
    const queryForm = ref<QueryForm>({
      recruit_id: undefined,
      recruit_satisfaction: undefined,
    });
    const displayRecord = ref<M.anchorRecruitment.AnchorRecruitmentModel>();
    const isReadonly = ref(false);
    const methods = {
      show(recruit_record: M.anchorRecruitment.AnchorRecruitmentModel, readonly = false) {
        queryForm.value.recruit_id = recruit_record.recruit_id;
        queryForm.value.recruit_satisfaction = recruit_record.recruit_satisfaction;
        displayRecord.value = recruit_record;
        isReadonly.value = readonly;
      },
      onSaveBtnClick() {
        methods.evaluateAnchorRecruit();
      },
      onCancel() {
        ctx.emit('close');
      },
      async evaluateAnchorRecruit() {
        const { recruit_id, recruit_satisfaction } = queryForm.value;
        if (!recruit_id || !recruit_satisfaction) {
          return;
        }
        loading.value = true;
        const res = await EvaluateAnchorRecruit({
          recruit_id,
          recruit_satisfaction,
        });
        loading.value = false;
        if (res.data.success) {
          ctx.emit('submit');
          ctx.emit('close');
          Message.success(res.data.message);
        } else {
          Message.error(res.data.message);
        }
      },
      formatAmount,
    };
    return { loading, isReadonly, queryForm, displayRecord, ...methods };
  },
  render() {
    const { displayRecord } = this;
    return (
      <div class="recruitment-dialog">
        <div class="recruitment-dialog-content">
          <section class="recruitment-info">
            <div class="title">
              <span>招募信息</span>
            </div>
            <div class="grid-container mgt-16">
              <div label="关联项目">{displayRecord?.project_name || '--'}</div>
              <div label="负责人">{displayRecord?.project_counterpart_name || '--'}</div>
              <div label="合作内容">
                {E.supplier.RecruitmentCooperationContentMap.get(
                  displayRecord?.cooperation_class as any,
                ) || '--'}
              </div>
            </div>
          </section>
          <section class="recruitment-result">
            <div class="title">
              <span>招募结果</span>
            </div>
            <div class="grid-container mgt-16">
              <div label="主播花名">{`${displayRecord?.anchor_flower_name || '--'} (${
                displayRecord?.anchor_real_name || '--'
              })`}</div>
              <div label="合作情况">
                {E.supplier.RecruitmentCooperationModeMap.get(
                  displayRecord?.cooperation_mode as any,
                ) || '--'}
              </div>
              <div label="商务费用">
                {displayRecord?.business_cost !== undefined && displayRecord?.business_cost !== null
                  ? this.formatAmount(displayRecord.business_cost / 100, '¥ ')
                  : '--'}
              </div>
            </div>
            <div>
              <div class="mgt-12" label="合作费用">
                {displayRecord?.cooperation_cost_describe || '--'}
              </div>
              <div class="mgt-12" label="其它说明">
                {displayRecord?.comment || '--'}
              </div>
            </div>
          </section>
          <section class="result-rating mgt-16">
            <div class="title">
              <span>结果评价</span>
            </div>
            <div class="recruit-satisfaction-list mgt-16">
              {(this.queryForm.recruit_satisfaction || 0) <= 0 && this.isReadonly ? (
                <div style="font-size: 12px; color: var(--text-third-color);">暂无评价</div>
              ) : (
                E.supplier.RecruitRatisfactionOption.map(el => {
                  return (
                    <div
                      class={`recruit-satisfaction-list-item ${this.isReadonly && 'readonly'}`}
                      on-click={() => {
                        if (this.isReadonly) return;
                        this.queryForm.recruit_satisfaction = el.value;
                      }}
                      checked={el.value <= (this.queryForm.recruit_satisfaction || 0)}
                    >
                      {el.value <= (this.queryForm.recruit_satisfaction || 0) ? (
                        <tg-icon name="ico-icon_manyidu_gaoliang"></tg-icon>
                      ) : this.isReadonly ? (
                        <tg-icon name="ico-icon_manyidu_gaoliang"></tg-icon>
                      ) : (
                        <tg-icon name="ico-icon_manyidu_weixuanzhong"></tg-icon>
                      )}
                      {/* <div class="icon"></div> */}
                      <div class="desc">{el.label}</div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
        {!this.isReadonly && (
          <div class="recruitment-dialog-footer">
            <tg-button
              class="mgr-12"
              onClick={() => {
                this.onCancel();
              }}
            >
              取消
            </tg-button>

            <tg-button
              type="primary"
              disabled={!this.queryForm.recruit_satisfaction}
              onClick={this.onSaveBtnClick}
            >
              确定
            </tg-button>
          </div>
        )}
        <tg-mask-loading visible={this.loading} content="  正在保存，请稍候..."></tg-mask-loading>
      </div>
    );
  },
});
