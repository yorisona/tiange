import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  setup(props, ctx) {
    const show = (obj: any) => {
      formData.value = obj;
    };
    const formData = ref({
      title: '',
      id: 0,
      value: '',
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
    return { onSaveBtnClick, show, formData, formRef };
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
          <el-form-item
            label={formData.title}
            prop="value"
            rules={{ required: true, message: `请填写${formData.title}`, trigger: 'blur' }}
          >
            <el-input
              show-word-limit
              maxlength="100"
              type="textarea"
              v-model={formData.value}
              placeholder={`请填写${formData.title}`}
            />
          </el-form-item>
        </div>
      </el-form>
    );
  },
});
/**
 * 今天早上发现
 **/
