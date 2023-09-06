import { defineComponent, ref } from '@vue/composition-api';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';

export default defineComponent({
  setup(props, ctx) {
    const type = ref('');
    const show = (value: string) => {
      type.value = value;
    };

    const formData = ref({
      id: '',
      summary_files: [],
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ctx.emit('submit', {
            appeal_reason: formData.value.id,
            appeal_files: formData.value.summary_files,
          });
        }
      });
    };

    const formRef = ref<IFormRef>();
    return { onSaveBtnClick, show, formData, formRef };
  },
  render() {
    const { formData } = this;
    return (
      <div class="dialog-container">
        <el-form
          size="mini"
          ref="formRef"
          attrs={{
            model: formData,
          }}
        >
          <el-form-item
            label="申诉理由"
            prop="id"
            rules={{ required: true, message: '请填写申诉理由', trigger: 'change' }}
          >
            <el-input
              type="textarea"
              maxlength="300"
              show-word-limit
              v-model={formData.id}
              placeholder="请输入申诉理由"
            />
          </el-form-item>
          <el-form-item label="上传附件" prop="id">
            <div class="annex">
              {formData.summary_files.length < 5 && (
                <tg-upload
                  action="/api/anchor/upload_anchor_file"
                  show-file-list={false}
                  beforeUpload={FormValidation.ValidationFileUpload({
                    fileSize: 30,
                    excel: true,
                    pdf: true,
                    doc: true,
                    image: true,
                  })}
                  success={(res: { data: { source: string } }) => {
                    formData.summary_files.push(res.data.source);
                  }}
                >
                  <tg-button icon="ico-upload-lite">上传附件</tg-button>
                </tg-upload>
              )}

              <upload-file-list v-model={formData.summary_files} />
              {formData.summary_files.length < 5 && (
                <span class="tips"> 支持docx. pdf. xlsx. xls, png, jpeg，最多上传5个文件</span>
              )}
            </div>
          </el-form-item>
          <el-form-item label="申诉处理人" class="inline">
            <span class="handler">茯神</span>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
