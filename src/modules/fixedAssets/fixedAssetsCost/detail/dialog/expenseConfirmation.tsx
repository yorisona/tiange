import { ref, defineComponent, h } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import S from './common.module.less';
export default defineComponent({
  setup(props, ctx) {
    const formData = ref();
    const show = (val: any) => {
      formData.value = val;
    };
    const close = () => {
      ctx.emit('close');
    };
    return {
      formData,
      show,
      close,
    };
  },
  render() {
    return (
      <el-form model={this.formData} class={[S['form-wrap']]}>
        <el-form-item label="费用月份：">
          <Select
            style={{ width: '100%' }}
            popper-class="el-select-popper-mini"
            v-model={this.formData}
            v-auto-placeholder
            options={E.project.BusinessTypeOption}
            clearable={false}
          />
        </el-form-item>
      </el-form>
    );
  },
});
