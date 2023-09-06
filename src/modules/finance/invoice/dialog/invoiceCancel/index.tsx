import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useRequest } from '@gm/hooks/ahooks';
import { AbolishFinancialInvoice } from '@/services/finance/invoice';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<any>({
      id: undefined,
      is_reinvoice: undefined,
    });
    const reqSave = useRequest(AbolishFinancialInvoice, { manual: true });
    const methods = {
      show(id: number) {
        formData.value.id = id;
      },
      async onSaveBtnClick() {
        if (formData.value.is_reinvoice === undefined) {
          Message.warning('请选择作废方式');
        } else {
          const res = await reqSave.runAsync({
            ...formData.value,
          });
          if (res.data.success) {
            Message.success(res.data.message || '发票作废成功');
            ctx.emit('submit');
            ctx.emit('close');
          } else {
            Message.error(res.data.message || '发票作废失败');
          }
        }
      },
    };
    return { formData, reqSave, ...methods };
  },
  render() {
    return (
      <div class="tg-invoice-cancel-page-container">
        <el-radio-group v-model={this.formData.is_reinvoice}>
          <el-radio label={true}>作废并重新开票（无需重走开票审批）</el-radio>
          <el-radio label={false}>仅作废（需重新发起开票审批）</el-radio>
        </el-radio-group>
        <tg-mask-loading
          visible={this.reqSave.loading}
          content="  正在保存，请稍候..."
        ></tg-mask-loading>
      </div>
    );
  },
});
