import { defineComponent, ref } from '@vue/composition-api';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { Message } from 'element-ui';

export default defineComponent({
  setup(props, ctx) {
    const show = (row: any) => {
      formData.value.value = [...row.effect_drawing];
    };
    const formData = ref<{ value: string[] }>({
      value: [],
    });
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (!success) {
          return;
        }
        ctx.emit('submit', formData.value.value);
      });
    };
    const formRef = ref<IFormRef>();

    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
    };
  },
  render() {
    const { formData } = this;
    return (
      <el-form
        size="small"
        ref="formRef"
        attrs={{
          model: formData,
        }}
      >
        <div class="form-body">
          <div class="pic-grid">
            <el-form-item
              prop="value"
              rules={[
                { required: true, message: '请选择上传图片', trigger: ['change'] },
                {
                  trigger: 'blur',
                  message: '至少上传一张图片',
                  validator: (_: any, val: string[], callback: any) => {
                    if (val.length === 0) {
                      callback(new Error(_.message));
                    } else {
                      callback();
                    }
                  },
                },
              ]}
            >
              <div class="upload-list">
                {formData.value.map((url, index) => {
                  return (
                    <div class="file-wrapper">
                      <div class="file">
                        <tg-image src={url} fit="cover" />
                      </div>
                      <tg-icon
                        name="ico-a-quseguanbiicon2x"
                        onClick={() => {
                          formData.value.splice(index, 1);
                        }}
                      />
                    </div>
                  );
                })}

                {formData.value.length < 5 && (
                  <tg-upload
                    action="/api/image_design/upload_image_design"
                    show-file-list={false}
                    multiple
                    beforeUpload={ValidationFileUpload({
                      fileSize: 100,
                      image: true,
                    })}
                    success={(res: {
                      data: { source: string };
                      success: boolean;
                      message: string;
                    }) => {
                      if (res.success) {
                        if (formData.value.length < 5) {
                          formData.value.push(res.data.source);
                        }
                      } else {
                        Message.error(res.message);
                      }
                    }}
                  >
                    <div class="upload-btn mgt-30">
                      <i class="el-icon-plus avatar-uploader-icon" />
                      <span>添加照片</span>
                    </div>
                  </tg-upload>
                )}
              </div>
              <div class="mgt-6" style="color:#c1c1c1">
                仅支持PNG,JPG,JPEG格式图片，单张不超过100M
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    );
  },
});
/**
 * 今天早上发现
 **/
