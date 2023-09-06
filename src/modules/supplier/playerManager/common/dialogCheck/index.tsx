import { defineComponent, ref, PropType } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import { Message } from 'element-ui';
const { debounce } = lodash;
export default defineComponent({
  props: {
    save: {
      type: Function as PropType<any>,
    },
  },
  setup(props: { save: (arg: any) => Promise<any> }, ctx) {
    const formRef = ref<ElForm | null>(null);
    const visible = ref(false);
    const formData = ref<any>({
      verify_message: '',
    });

    const onCloseBtnClick = () => {
      ctx.emit('close');
      ctx.root.$nextTick(resetForm);
      visible.value = false;
    };
    /** 重置表单 */
    const resetForm = () => {
      formData.value = { verify_message: '' };
      // formRef.value?.resetFields();
    };

    const show = () => {
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
      visible,
      formData,
      onCloseBtnClick,
      onSaveBtnClick,
      formRef,
    };
  },
  render() {
    return (
      <el-dialog
        class="tg-dialog-classic"
        width="472px"
        visible={this.visible}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.onCloseBtnClick}
      >
        <fragments slot="title">不通过原因</fragments>
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
            <div class="form-body">
              <el-form-item label="">
                <el-input
                  placeholder="请输入不通过原因"
                  v-model={this.formData.verify_message}
                  maxlength={100}
                  show-word-limit={true}
                  type="textarea"
                  row={20}
                />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <template slot="footer" style="height: 50px">
          <tg-button onClick={this.onCloseBtnClick}>取消</tg-button>
          <tg-button type="primary" onClick={this.onSaveBtnClick}>
            确定
          </tg-button>
        </template>
      </el-dialog>
    );
  },
});
