import { AuditReverseDepositRecevied } from '@/services/finance';
import { useRequest } from '@gm/hooks/ahooks';
import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';

interface FormData {
  reverse_audit_reason?: string;
  id: number;
  reverse_reason?: string;
  operate_status: number;
}

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<FormData>({
      reverse_audit_reason: undefined,
      id: undefined,
      reverse_reason: '',
      operate_status: 1,
    } as any);

    const approvalServe = useRequest(AuditReverseDepositRecevied, { manual: true });

    const methods = {
      show(value: { id: number; reverse_reason: string }) {
        formData.value.id = value.id;
        formData.value.reverse_reason = value.reverse_reason || '';
      },
      onRefuseHandler() {
        if (!formData.value.reverse_audit_reason) {
          Message.warning('请填写驳回意见');
          return;
        }
        // methods.onEmitHandler(0);
      },
      onPassHandler() {
        methods.onEmitHandler();
      },
      async onEmitHandler() {
        const res = await approvalServe.runAsync({
          operate_status: formData.value.operate_status, //1: 已通过 0: 不通过
          id: formData.value.id,
          reverse_audit_reason: formData.value.reverse_audit_reason,
        });
        if (res.data.success) {
          Message.success(res.data.message);
          ctx.emit('submit');
          ctx.emit('close');
        } else {
          Message.error(res.data.message);
        }
      },
    };
    const close = () => {
      ctx.emit('close');
    };
    return {
      close,
      formData,
      approvalServe,
      ...methods,
    };
  },
  render() {
    return (
      <div class="reject-container">
        <section class="content">
          <el-form class="el-form-vertical" label-position="top" showMessage={false} size="mini">
            <el-form-item label="冲销原因" class="sp-form-item">
              <div class="reverse-reason-content">
                <el-input
                  type="textarea"
                  // placeholder="冲销原因"
                  v-model={this.formData.reverse_reason}
                  disabled={true}
                />
              </div>
            </el-form-item>

            <el-form-item label="是否通过" style="margin-top: 18px" class="sp-form-item" required>
              <div style="width: 100%">
                <el-radio-group v-model={this.formData.operate_status}>
                  <el-radio label={1}>通过</el-radio>
                  <el-radio label={0}>不通过</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-form>
          {this.formData.operate_status === 0 && (
            <el-input
              type="textarea"
              placeholder="请输入不通过原因"
              v-model={this.formData.reverse_audit_reason}
              clearable={true}
              maxlength={100}
              show-word-limit={true}
            />
          )}
        </section>
        <section class="footer">
          <tg-button on-click={this.close}>取消</tg-button>
          <tg-button type="primary" on-click={this.onPassHandler}>
            提交
          </tg-button>
        </section>
        <tg-mask-loading
          visible={this.approvalServe.loading}
          content="  正在保存，请稍候..."
        ></tg-mask-loading>
      </div>
    );
  },
});
