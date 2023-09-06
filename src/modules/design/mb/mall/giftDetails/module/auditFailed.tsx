import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref({
      comment: '',
      id: null,
    } as any);

    const show = (value: number) => {
      formData.value.id = value;
    };

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
            label="不通过原因："
            rules={{ required: true, message: '请输入不通过原因', trigger: 'change' }}
          >
            <el-input
              type="textarea"
              rows="4"
              show-word-limit
              maxlength={50}
              v-model={formData.comment}
              placeholder="请输入不通过原因"
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
