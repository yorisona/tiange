import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { Message } from 'element-ui';
import { useRequest } from '@gm/hooks/ahooks';
import { import_store_product } from '@/services/live';
import Appendix from '@/modules/workbench/initiate/appendix/index.vue';
export default defineComponent({
  components: {
    Appendix,
  },
  setup(props, ctx) {
    const formData = ref<{ file_path?: string[]; project_id?: string | number }>({
      file_path: [],
      project_id: undefined,
    });
    const reqUpload = useRequest(import_store_product, { manual: true });
    const formRef = ref<ElForm>();
    const methods = {
      show(project_id?: number | string) {
        formData.value.project_id = project_id;
      },
      onSaveBtnClick() {
        formRef.value?.validate(async valid => {
          if (valid) {
            const upRes = await reqUpload.runAsync({
              project_id: formData.value.project_id,
              file_path: formData.value.file_path?.[0],
            });
            if (upRes.data.success) {
              Message.success(upRes.data.message);
              ctx.emit('submit');
              ctx.emit('close');
            } else {
              Message.error(upRes.data.message || '导入失败');
            }
          }
        });
      },
      onDownloadTemplateHandler() {
        window.open(
          'http://tiange-oss.goumee.com/dev/upload/visual_design/20230703/1688374706651/%E5%AF%BC%E5%85%A5%E5%95%86%E5%93%81%E6%A8%A1%E6%9D%BF.xlsx',
          '_blank',
        );
      },
    };
    return { formRef, formData, reqUpload, ...methods };
  },
  render() {
    return (
      <div class="tg-live-tool-import-product-page-container">
        <el-form ref="formRef" props={{ model: this.formData }} label-width="62px">
          <el-form-item
            label="上传文件："
            prop="file_path"
            rules={[
              {
                required: true,
                message: '请上传文件',
                trigger: 'change',
              },
            ]}
          >
            <div>
              <div class="upload-and-download">
                <tg-upload
                  show-file-list={false}
                  action="/api/resources/upload_file"
                  data={{ type: 'allocated' }}
                  // style="margin-bottom:12px"
                  beforeUpload={FormValidation.ValidationFileUpload({
                    extensions: ['.xls', '.xlsx'],
                    fileSize: 50,
                  })}
                  success={async (res: any) => {
                    if (res.success) {
                      this.formData.file_path = [res.data.source];
                    } else {
                      Message.error(res.message || '上传失败');
                    }
                  }}
                >
                  <tg-button icon="ico-upload-lite">上传文件</tg-button>
                </tg-upload>
                <tg-button class="mgl-12" type="link" onClick={this.onDownloadTemplateHandler}>
                  下载模板
                </tg-button>
              </div>
              {/*<Appendix isDelete={true} list={this.formData.file_path} onDeleteItem="deleteItem" />*/}
              <upload-file-list v-model={this.formData.file_path} />
            </div>
          </el-form-item>
        </el-form>
        <tg-mask-loading visible={this.reqUpload.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
