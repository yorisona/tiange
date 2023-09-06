import { ref, defineComponent, h } from '@vue/composition-api';
import { Select, FunctionSelect } from '@gm/component/select';
import S from './common.module.less';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
export default defineComponent({
  setup(props, ctx) {
    const formData = ref({
      type: '1',
      department_id: undefined,
      project_id: undefined,
      user_id: undefined,
      asset_id_list: [],
    });
    const show = (val: any) => {
      formData.value.asset_id_list = val.asset_id_list;
    };
    const close = () => {
      ctx.emit('close');
    };
    const formRef = ref<any>(null);
    const onSaveBtnClick = async () => {
      const formValid = await formRef.value.validate();
      if (formValid) {
        ctx.emit('submit', formData.value);
      }
    };
    return {
      formData,
      show,
      close,
      formRef,
      onSaveBtnClick,
    };
  },
  render() {
    return (
      <el-form ref="formRef" attrs={{ model: this.formData }} class={[S.transfer]}>
        <el-form-item
          label="调拨至："
          prop={this.formData.type === '1' ? 'department_id' : 'project_id'}
          rules={[{ required: true, message: '请选择部门或项目', trigger: 'change' }]}
        >
          <div class={[S.flexBox]}>
            <Select
              style={{ width: '80px' }}
              class="mgr-8"
              popper-class="el-select-popper-mini"
              v-model={this.formData.type}
              placeholder="请选择"
              options={[
                { label: '部门', value: '1' },
                { label: '项目', value: '2' },
              ]}
              clearable={false}
            />
            {this.formData.type === '1' ? (
              <department-select
                // style="--default-height: 40px"
                style={{ flex: 1 }}
                placeholder="请选择部门"
                queryForm={{ is_contain_goumee: true }}
                checkOnClickNode={true}
                // disabledLevel={2}
                // levelDisabled={(level: number) => level !== 2}
                levelHidden={(level: number) => level > 3}
                clearable
                v-model={this.formData.department_id}
              />
            ) : (
              <FunctionSelect
                style="width:100%;flex: 1;"
                size="mini"
                modeType={EFunctionSelectType.SEARCH_PROFIT_LOSS}
                v-model={this.formData.project_id}
                placeholder="选择接项目"
                clearable={true}
              />
            )}
          </div>
        </el-form-item>
        <el-form-item
          label="接收人："
          prop="user_id"
          rules={[{ required: true, message: '请选择接收人', trigger: 'blur' }]}
        >
          <FunctionSelect
            style="width:100%"
            size="mini"
            modeType={EFunctionSelectType.FLOWER_NAME}
            v-model={this.formData.user_id}
            placeholder="选择接收人"
            otherParams={{ is_contain_goumee: true }}
            clearable={true}
          />
        </el-form-item>
      </el-form>
    );
  },
});
