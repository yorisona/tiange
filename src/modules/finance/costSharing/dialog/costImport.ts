/**
 * 班次设置
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import { uploadFileService } from '@/services/file';
import { HttpRequestOptions } from 'element-ui/types/upload';
import { SaveCostShare } from '@/services/finance/costshare';

export default defineComponent({
  props: {
    visiable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const exportErrorTip = ref<string>();
    const form = ref<any>({
      cost_paytype: '',
      file_name: '',
      file_url: '',
      people_model: '',
      other_model: '',
    });
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    // 保存
    const handleSaveAction = async () => {
      saveLoading.value = true;
      const res = await SaveCostShare({ file_path: form.value.file_url });
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message || '保存成功');
        ctx.emit('closeAction', true);
      } else {
        // ctx.root.$message.error(res.data.message || '保存失败');
        exportErrorTip.value = res.data.message;
      }
    };
    watch(
      () => props.visiable,
      () => {
        if (props.visiable) {
          exportErrorTip.value = undefined;
          form.value = {
            cost_paytype: '',
            file_name: '',
            people_model: '',
            other_model: '',
          };
        }
      },
    );
    /** 文件上传 */
    const uploadFileHandler = async (value: HttpRequestOptions) => {
      const file = value.file;
      if (file.size > 30 * 1024 * 1024) {
        ctx.root.$message.error('上传文件大小不能超过 30MB!');
        return;
      }
      const formData = new FormData();
      const filename = value.file.name;
      formData.append('file', value.file, filename);
      formData.append('type', 'allocated');

      /** 上传文件service */
      const res = await uploadFileService(formData);
      const result = res.data;
      if (result.success) {
        form.value.file_url = res.data.data.source;
        form.value.file_name = res.data.data.source;
        ctx.root.$message.success('上传成功');
      } else {
        ctx.root.$message.error(result.message ?? '上传失败，稍后重试');
      }
    };
    const handleRemoveFileClick = () => {
      form.value.file_url = '';
      form.value.file_name = '';
    };
    return {
      exportErrorTip,
      handleRemoveFileClick,
      uploadFileHandler,
      form,
      saveLoading,
      handleSaveAction,
      handleCloseAction,
    };
  },
});
