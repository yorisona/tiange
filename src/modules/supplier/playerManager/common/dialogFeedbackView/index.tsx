import { defineComponent, ref, PropType } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import { Message } from 'element-ui';
const { debounce } = lodash;
import utils from '@/utils';

export default defineComponent({
  props: {
    save: {
      type: Function as PropType<any>,
    },
  },
  setup(props: { save: (arg: any) => Promise<any> }, ctx) {
    const formRef = ref<ElForm | null>(null);
    const title = ref('');
    const visible = ref(false);
    const formData = ref<any>({
      feedback_pics: [],
      feedback_videos: [],
    });
    const months = ref<{ label: string; value: string }[]>([]);

    const onCloseBtnClick = () => {
      ctx.emit('close');
      ctx.root.$nextTick(resetForm);
      visible.value = false;
    };
    /** 重置表单 */
    const resetForm = () => {
      console.log('');
    };

    const show = (_title: string, data: any) => {
      title.value = _title;
      formData.value = { ...data };
      visible.value = true;
    };

    /** 点击保存 */
    const submit = () => {
      formRef.value?.validate(valid => {
        if (valid) {
          props
            .save(formData.value)
            .then(() => {
              visible.value = false;
            })
            .catch(ex => {
              Message.error(ex.message);
            });
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
        width="572px"
        visible={this.visible}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.onCloseBtnClick}
      >
        <fragments slot="title">{this.title}</fragments>
        <div class="dialog-content">
          <div class="block">
            <div class="label">试播结果</div>
            <div class="text">{this.formData.feedback_status === 1 ? '合适' : '不合适'}</div>
          </div>
          <div class="block">
            <div class="label">详细说明</div>
            <div class="text">{this.formData.feedback_content}</div>
          </div>
          <div class="block">
            <div class="label">反馈图片</div>
            <div class="images">
              {this.formData.feedback_pics.map((item: string) => {
                return <tg-image src={item} alt="" />;
              })}
            </div>
          </div>
          <div class="block">
            <div class="label">试播视频</div>
            <div class="videos">
              {this.formData.feedback_videos.map((item: string) => {
                return (
                  <div class="video">
                    <tg-icon name="ico-Pdfbeifen" />
                    <a class="link-url" href={item} target="_blank">
                      {utils.basename(item)}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </el-dialog>
    );
  },
});
