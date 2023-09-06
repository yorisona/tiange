import { defineComponent, ref } from '@vue/composition-api';

import { Select } from '@gm/component/select';
import { Message } from 'element-ui';

export default defineComponent({
  setup(props, ctx) {
    const weidus = ref<any[]>([]);
    const show = (value: any[]) => {
      console.info('value', value);
      weidus.value = value;
      options.value = value.map(item => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    };

    const options = ref<TG.OptionType[]>([]);

    const formData = ref({
      id: undefined,
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        console.log('form', formData.value.id);
        if (success) {
          const find = weidus.value.find(it => it.id === formData.value.id);
          if (!find) {
            Message.error('找不到纬度');
          }
          ctx.emit('submit', find);
          ctx.emit('close');
        }
      });
    };
    const formRef = ref<IFormRef>();
    return { onSaveBtnClick, show, formData, formRef, options };
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
            label="考评维度："
            label-width="70px"
            prop="id"
            rules={{ required: true, message: '请选择考评维度', trigger: 'change' }}
          >
            <Select
              popper-class="el-select-popper-mini"
              options={this.options}
              v-model={formData.id}
              style="width:100%"
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
