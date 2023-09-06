import { defineComponent, ref } from '@vue/composition-api';
import { Save_Indicator_Tag } from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { INDICATOR_TYPE_OPTIONS } from '@/const/performance';
export default defineComponent({
  setup(props, ctx) {
    const name = ref<string>();
    const hasEdit = ref(false);
    const show = (value: NPerformance.IEvaluationDimension) => {
      if (value) {
        formData.value = value;
        hasEdit.value = true;
      }
    };
    const formRef = ref<IFormRef>();
    const reqSaveTag = useRequest(Save_Indicator_Tag, { manual: true });
    const onSaveBtnClick = () => {
      formRef.value?.validate(success => {
        if (success) {
          if (formData.value.id === undefined) {
            formData.value.id = Date.now();
          }
          ctx.emit('submit', formData.value);
        }
      });
    };
    const formData = ref<NPerformance.IEvaluationDimension>({
      dimension_type_list: [],
      indicator_list: [],
    } as any);
    return { name, onSaveBtnClick, show, reqSaveTag, formData, formRef, hasEdit };
  },
  render() {
    return (
      <div class="DialogContainer">
        <el-form
          size="mini"
          hide-required-asterisk={true}
          labelPosition="top"
          ref="formRef"
          attrs={{
            model: this.formData,
          }}
        >
          <el-form-item
            label="维度名称"
            prop="name"
            rules={[{ required: true, message: '请输入维度名称', trigger: 'change' }]}
          >
            <el-input
              placeholder="请输入维度名称"
              v-model={this.formData.name}
              style="width:100%"
            />
          </el-form-item>
          <el-form-item
            label="维度类型"
            class="radio-form-item"
            prop="dimension_type_list"
            rules={[{ required: true, message: '请选择维度类型', trigger: 'change' }]}
          >
            <el-checkbox-group v-model={this.formData.dimension_type_list} disabled={this.hasEdit}>
              {INDICATOR_TYPE_OPTIONS.map((it, key) => {
                return (
                  <el-checkbox key={key} label={it.value} disabled={this.hasEdit}>
                    {it.label}
                  </el-checkbox>
                );
              })}
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            class="radio-form-item"
            label="员工编辑和删除指标"
            prop="is_modify_delete"
            rules={[{ required: true, message: '请选择员工编辑和删除指标', trigger: 'change' }]}
          >
            <el-radio-group v-model={this.formData.is_modify_delete}>
              <el-radio name="is_modify_delete" label={true}>
                支持
              </el-radio>
              <el-radio name="is_modify_delete" label={false}>
                不支持
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
