import { defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import rejectIndex from './reject.vue';
import { Message } from 'element-ui';
import { useRequest } from '@gm/hooks/ahooks';
import { AuditDepositRecevied } from '@/services/finance';
import { formatAmount } from '@/utils/string';
import { onContractClick } from '../use/index';
// import { usePermission } from '@/use/permission';

export default defineComponent({
  setup(props, ctx) {
    // const permission = usePermission();
    const row = ref<any>({});
    const formData = ref({
      audit_reason: '',
    });
    const show = (value: any) => {
      row.value = value;
    };
    const rejectIndexDialog = useDialog({
      title: '驳回原因',
      width: '400px',
      footer: false,
      component: rejectIndex,
      on: {
        submit() {
          console.log('submit');
        },
      },
    });
    const loading = ref(false);
    const onRefuseHandler = () => {
      rejectIndexDialog.show({ label: '222' });
    };
    const approvalServe = useRequest(AuditDepositRecevied, { manual: true });

    const onPassHandler = async (audit_status: number) => {
      const res = await approvalServe.runAsync({
        audit_status,
        id: row.value.id,
        audit_reason: formData.value.audit_reason,
      });
      if (res.data.success) {
        Message.success(res.data.message);
        ctx.emit('submit');
        ctx.emit('close');
      } else {
        Message.error(res.data.message);
      }
    };
    return {
      onPassHandler,
      loading,
      onRefuseHandler,
      rejectIndexDialog,
      show,
      row,
      formData,
      onContractClick,
    };
  },
  render() {
    const { row } = this;

    return (
      <div class="prepay-approval-container">
        <section class="content">
          {row.is_received === 1 ? (
            <fragments>
              <div class="row">
                <div>收款账户：</div>
                <div>招商银行</div>
              </div>
              <div class="row">
                <div>收款说明：</div>
                <div>{row.remark || '--'}</div>
              </div>
              <div class="row">
                <div>收款金额：</div>
                <div>{formatAmount(row.register_amount / 100) || '--'}</div>
              </div>
              <div class="row">
                <div>收款日期：</div>
                <div>{row.gmt_create || '--'}</div>
              </div>
              <div class="row">
                <div>关联合同：</div>
                <div
                  class={[row.contract_uid && 'toHt']}
                  onClick={() => {
                    this.onContractClick(row);
                  }}
                >
                  {row.contract_uid || '未关联'}
                </div>
              </div>
            </fragments>
          ) : (
            <fragments>
              <div class="row">
                <div>是否到账：</div>
                <div>{row.is_received === 1 ? '到账' : '未到账'}</div>
              </div>
              <div class="row">
                <div>收款说明：</div>
                <div>{row.remark || '--'}</div>
              </div>
              <div class="row">
                <div>预收金额：</div>
                <div>{formatAmount(row.register_amount / 100) || '--'}</div>
              </div>
              <div class="row">
                <div>关联合同：</div>
                <div
                  class="toHt"
                  onClick={() => {
                    this.onContractClick(row);
                  }}
                >
                  {row.contract_uid || '未关联'}
                </div>
              </div>
            </fragments>
          )}

          <div class="row">
            <div>审核意见：</div>
            <el-input
              style="width:100%"
              type="textarea"
              maxlength="50"
              placeholder="请输入审核意见"
              show-word-limit
              v-model={this.formData.audit_reason}
            />
          </div>
        </section>
        <section class="footer">
          {/* <tg-button on-click={this.onRefuseHandler}>驳回</tg-button> */}
          <tg-button on-click={() => this.onPassHandler(2)}>驳回</tg-button>
          <tg-button type="primary" on-click={() => this.onPassHandler(4)}>
            通过
          </tg-button>
        </section>
        <tg-mask-loading visible={this.loading} content="  正在保存，请稍候..."></tg-mask-loading>
      </div>
    );
  },
});
