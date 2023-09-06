import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const type = ref('');
    const show = (value: string) => {
      type.value = value;
    };

    const formData = ref({
      comment: '',
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ctx.emit('submit', formData.value);
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
        <div class="mgb-16">
          <span style="color: var(--text-third-color);">审核结果：</span>
          <span>不通过</span>
        </div>
        <el-form
          size="small"
          ref="formRef"
          hide-required-asterisk={true}
          attrs={{
            model: formData,
          }}
        >
          <el-form-item
            prop="comment"
            rules={{ required: true, message: '请输入原因', trigger: 'change' }}
          >
            <el-input
              type="textarea"
              rows="4"
              show-word-limit
              v-model={formData.comment}
              placeholder="请输入原因"
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
