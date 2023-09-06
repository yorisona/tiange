/**
 * 班次设置
 */
import { defineComponent, ref } from '@vue/composition-api';
import { SaveSettlementScan } from '@/services/finance/settlement';

export default defineComponent({
  setup(props, ctx) {
    const saveLoading = ref(false);
    const form = ref<any>({
      settlement_scan_urls: [],
      settlement_id: undefined,
      business_type: undefined,
    });
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('close');
    };
    // 保存
    const handleSaveAction = async () => {
      if (form.value.settlement_scan_urls.length < 1) {
        ctx.root.$message.warning('请上传扫描件！！！');
        return;
      }
      saveLoading.value = true;
      const res = await SaveSettlementScan({
        settlement_id: form.value.settlement_id,
        settlement_scan_urls: form.value.settlement_scan_urls,
        business_type: form.value.business_type,
      });
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message || '保存成功');
        ctx.emit('close');
        ctx.emit('submit');
      } else {
        ctx.root.$message.error(res.data.message || '保存失败');
      }
    };
    const beforeUpload = (file: any) => {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        ctx.root.$message.warning('上传图片大小不能超过 20MB!');
      }
      /*.pdf,.jpg,.jpeg,.png*/
      if (
        (file.type !== 'image/jpeg' &&
          file.type !== 'image/jpg' &&
          file.type !== 'image/png' &&
          file.type !== 'application/pdf') ||
        file.name.endsWith('.jfif.jpg') ||
        file.name.endsWith('.jfif')
      ) {
        ctx.root.$message.error('文件格式不正确！');
        return false;
      }
      return isLt2M;
    };

    const successHandle = (res: { data: { source: string } }) => {
      form.value.settlement_scan_urls = [...form.value.settlement_scan_urls, res.data.source];
    };
    const handleRemoveFileClick = (index: number) => {
      form.value.settlement_scan_urls.splice(index, 1);
    };
    const readOnly = ref(false);
    const reason_str = ref('');
    const show = (
      settlement_id: number,
      business_type: E.project.BusinessType,
      settlement_scan_urls = [],
      read = false,
      reason = '',
    ) => {
      readOnly.value = read;
      reason_str.value = reason || '';
      form.value = {
        settlement_scan_urls: settlement_scan_urls ? settlement_scan_urls : [],
        settlement_id: settlement_id,
        business_type,
      };
    };
    return {
      successHandle,
      beforeUpload,
      reason_str,
      readOnly,
      show,
      handleRemoveFileClick,
      form,
      saveLoading,
      handleSaveAction,
      handleCloseAction,
    };
  },
});
