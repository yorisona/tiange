/**
 * 班次设置
 */
import { defineComponent, ref } from '@vue/composition-api';
import { AuditSettlementScan } from '@/services/finance/settlement';

export default defineComponent({
  setup(props, ctx) {
    const saveLoading = ref(false);
    const form = ref<any>({
      settlement_scan_urls: [],
      settlement_id: undefined,
      audit_message: '',
    });
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('close');
    };
    // 保存
    const handleAuditAction = async (audit_status: number) => {
      if (audit_status === 3 && !form.value.audit_message) {
        ctx.root.$message.warning('请输入审核意见！');
        return;
      }
      saveLoading.value = true;
      const res = await AuditSettlementScan({
        audit_message: form.value.audit_message,
        settlement_id: form.value.settlement_id,
        audit_status: audit_status,
      });
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(
          res.data.message || (audit_status === 2 ? '审核通过成功' : '审核驳回成功'),
        );
        ctx.emit('close');
        ctx.emit('submit');
      } else {
        ctx.root.$message.error(res.data.message || '操作失败，请重新提交');
      }
    };
    const readOnly = ref(false);
    const show = (settlement_id: number, settlement_scan_urls = [], read = false, reason = '') => {
      readOnly.value = read;
      form.value = {
        settlement_scan_urls: settlement_scan_urls ? settlement_scan_urls : [],
        settlement_id: settlement_id,
        audit_message: reason || '',
      };
    };
    return {
      readOnly,
      show,
      form,
      saveLoading,
      handleAuditAction,
      handleCloseAction,
    };
  },
});
