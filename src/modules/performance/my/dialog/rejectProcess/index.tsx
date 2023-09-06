import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const type = ref('');
    const show = (value: string) => {
      type.value = value;
    };

    const formData = ref({
      id: '',
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ctx.emit('submit', {
            type: type.value,
            message: formData.value.id,
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
          hide-required-asterisk={true}
          attrs={{
            model: formData,
          }}
        >
          <el-form-item
            label="驳回理由"
            prop="id"
            rules={{ required: true, message: '请填写驳回理由', trigger: 'change' }}
          >
            <el-input
              type="textarea"
              maxlength="100"
              show-word-limit
              v-model={formData.id}
              placeholder="请输入驳回理由"
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
