import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import utils from '@/utils';
import FormValidation from '../../common/FormValidation';
const { debounce } = lodash;

interface IFormData {
  id?: string;
  title: string;
  description: string;
  videos: string[];
  lid?: number;
}

export default defineComponent({
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const title = ref('');
    const visible = ref(false);
    const formData = ref<IFormData>({
      id: undefined,
      lid: undefined,
      title: '',
      description: '',
      videos: [],
    });
    const months = ref<{ label: string; value: string }[]>([]);

    const onCloseBtnClick = () => {
      ctx.emit('close');
      ctx.root.$nextTick(resetForm);
      visible.value = false;
    };
    /** 重置表单 */
    const resetForm = () => {
      formData.value.id = undefined;
      formData.value.lid = undefined;
      formData.value.title = '';
      formData.value.description = '';
      formData.value.videos = [];
    };

    const show = (_title: string, data?: IFormData) => {
      title.value = _title;
      formData.value = data || {
        title: '',
        description: '',
        videos: [],
        lid: undefined,
      };
      if (formData.value.lid === undefined) {
        formData.value.lid = Date.now();
      }
      visible.value = true;
    };

    /** 点击保存 */
    const submit = () => {
      formRef.value?.validate(valid => {
        if (valid) {
          ctx.emit('saveCommissinRate', {
            ...formData.value,
          });
          visible.value = false;
        } else {
          return false;
        }
      });
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);

    return {
      show,
      title,
      visible,
      formData,
      months,
      onCloseBtnClick,
      onSaveBtnClick,
      formRef,
    };
  },
  render() {
    return (
      <el-dialog
        class="tg-dialog-classic"
        width="547px"
        visible={this.visible}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.onCloseBtnClick}
      >
        <fragments slot="title">{this.title}</fragments>
        <div class="dialog-content">
          <el-form
            attrs={{
              model: this.formData,
            }}
            ref="formRef"
            label-position="top"
            size="mini"
            label-width="106px"
          >
            <div class="line-box">
              <el-form-item
                class="mgb-18"
                label="标题"
                prop="title"
                rules={{ required: true, message: '请输入标题', trigger: 'blur' }}
              >
                <el-input
                  placeholder="标题示例：2020年双11欧莱雅淘宝专场直播"
                  maxlength={20}
                  show-word-limit={true}
                  v-model={this.formData.title}
                />
              </el-form-item>
            </div>
            <div class="line-box">
              <el-form-item
                class="mgb-18"
                label="说明"
                prop="description"
                rules={[
                  { required: true, message: '请输入业绩说明', trigger: 'blur' },
                  {
                    min: 20,
                    message: '请最少输入20个字',
                    trigger: 'blur',
                  },
                ]}
              >
                <el-input
                  placeholder="请输入业绩说明"
                  type="textarea"
                  show-word-limit={true}
                  maxlength={200}
                  v-model={this.formData.description}
                  rows={3}
                />
              </el-form-item>
            </div>
            <div class="line-box">
              <el-form-item
                className="mgb-18"
                label="视频"
                prop="videos"
                // rules={{ required: true, message: '请上传视频', trigger: 'blur' }}
              >
                <span slot="label">
                  <span>视频</span>
                  <span class="file-tips"> (最多上传5个视频，单个大小不超过50M!)</span>
                </span>
                {this.formData.videos.length < 5 && (
                  <tg-upload
                    class="upload-video"
                    action="/api/anchor/upload_anchor_video"
                    show-file-list={false}
                    beforeUpload={FormValidation.ValidationFileUpload({
                      video: true,
                      fileSize: 50,
                    })}
                    success={(res: { data: { source: string } }) => {
                      this.formData.videos.push(res.data.source);
                    }}
                  >
                    <tg-button name="ico-upload">上传视频</tg-button>
                  </tg-upload>
                )}
                <div class="videos">
                  {this.formData.videos.map((item, key) => {
                    return (
                      <div class="video">
                        <tg-icon name="ico-Pdfbeifen" />
                        <p class="video-name">{utils.basename(item)}</p>
                        <tg-icon
                          class="delete-icon"
                          name="ico-a-quseguanbiicon2x"
                          onClick={() => {
                            this.formData.videos.splice(key, 1);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <template slot="footer" style="height: 50px">
          <tg-button onClick={this.onCloseBtnClick}>取消</tg-button>
          <tg-button type="primary" onClick={this.onSaveBtnClick}>
            保存
          </tg-button>
        </template>
      </el-dialog>
    );
  },
});
