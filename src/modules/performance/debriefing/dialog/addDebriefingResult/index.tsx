import { defineComponent, nextTick, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import { add_report_management } from '@/services/performance';
type FormData = {
  name?: string;
  files?: string[];
};
export default defineComponent({
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const reqSave = useRequest(add_report_management, { manual: true });
    const formData = ref<FormData>({
      name: undefined,
      files: [],
    });
    const rules = {
      name: [{ required: true, message: '请输入述职名称', trigger: 'blur' }],
      files: [{ required: true, message: '请上传述职文件', trigger: 'change' }],
    };
    const methods = {
      show() {},
      onSaveBtnClick() {
        formRef.value?.validate(async valid => {
          if (valid) {
            const res = await reqSave.runAsync({
              name: formData.value.name,
              file_path: formData.value.files?.[0],
            });
            if (res.data.success) {
              Message.success(res.data.message || '新增成功');
              ctx.emit('submit');
              ctx.emit('close');
            } else {
              Message.error(res.data.message || '新增失败');
            }
          }
        });
      },
      onDownloadTemplateHandler() {
        window.open(
          'https://tiange-oss.goumee.com/prod/upload/visual_design/20230803/1691044659052/%E5%AF%BC%E5%85%A5%E8%BF%B0%E8%81%8C%E6%A8%A1%E6%9D%BF.xlsx',
          '_blank',
        );
      },
    };
    return { rules, formRef, formData, reqSave, ...methods };
  },
  render() {
    return (
      <div class="tg-add-debriefing-result-page-container">
        <el-form
          rules={this.rules}
          props={{ model: this.formData }}
          ref="formRef"
          label-width="68px"
          size="mini"
        >
          <el-form-item label="述职名称：" prop="name">
            <el-input maxlength={20} vModel_trim={this.formData.name}></el-input>
          </el-form-item>
          <el-form-item label="述职文件：" prop="files">
            <tg-upload
              show-file-list={false}
              data={{ type: 'visual_design' }}
              action="/api/resources/upload_file"
              beforeUpload={FormValidation.ValidationFileUpload({
                fileSize: 100,
                extensions: ['.xls', '.xlsx'],
              })}
              success={(res: { data: { source: string } }) => {
                res.data.source && (this.formData.files = [res.data.source]);
                nextTick(() => {
                  this.formRef?.clearValidate('invoice_files');
                });
              }}
            >
              <tg-button icon="ico-upload-lite">上传文件</tg-button>
            </tg-upload>
            <upload-file-list
              style="margin-top:4px"
              class="debriefing-upload-list"
              v-model={this.formData.files}
            />
          </el-form-item>
        </el-form>
        <tg-button type="link" onClick={this.onDownloadTemplateHandler}>
          下载文件模板
        </tg-button>
        <tg-mask-loading visible={this.reqSave.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
