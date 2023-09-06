import { InvoiceArchiveApproval } from '@/services/finance';
import { useRequest } from '@gm/hooks/ahooks';
import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';

interface FormData {
  archive_reject_remark?: string;
  invoice_id?: number;
}

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<FormData>({
      archive_reject_remark: undefined,
      invoice_id: undefined,
    });

    const approvalServe = useRequest(InvoiceArchiveApproval, { manual: true });

    const methods = {
      show(invoice_id: number) {
        formData.value.invoice_id = invoice_id;
      },
      onRefuseHandler() {
        if (!formData.value.archive_reject_remark) {
          Message.warning('请填写驳回意见');
          return;
        }
        methods.onEmitHandler(0);
      },
      onPassHandler() {
        methods.onEmitHandler(1);
      },
      async onEmitHandler(archive_status: number) {
        const res = await approvalServe.runAsync({
          ...formData.value,
          archive_status,
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
    return {
      formData,
      approvalServe,
      ...methods,
    };
  },
  render() {
    return (
      <div class="invoice-approval-container">
        <section class="content">
          <el-input
            v-model={this.formData.archive_reject_remark}
            resize="none"
            type="textarea"
            size="mini"
            maxlength={30}
            show-word-limit
            placeholder="若驳回请填写驳回意见（限30字）"
          ></el-input>
        </section>
        <section class="footer">
          <tg-button on-click={this.onRefuseHandler}>驳回</tg-button>
          <tg-button type="primary" on-click={this.onPassHandler}>
            通过
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
