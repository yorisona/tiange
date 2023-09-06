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
          ctx.emit('submit', {
            type: type.value,
            message: formData.value.comment,
          });
        }
      });
    };

    const formRef = ref<IFormRef>();
    return { onSaveBtnClick, show, formData, formRef, type };
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
            rules={{ required: true, message: '请填写' + this.type, trigger: 'change' }}
          >
            <el-input
              type="textarea"
              rows="4"
              show-word-limit
              v-model={formData.comment}
              placeholder={`请输入${this.type}`}
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
