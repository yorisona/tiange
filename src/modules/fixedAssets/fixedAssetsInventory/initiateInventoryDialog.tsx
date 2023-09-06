import { ref, defineComponent, h, watch } from '@vue/composition-api';
import { FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
export default defineComponent({
  setup(props, ctx) {
    const formData = ref({
      inventory_range: 2,
      department_id_list: [],
      project_id_list: [],
    });
    const show = (val: any) => {
      // formData.value = val;
    };
    const close = () => {
      ctx.emit('close');
    };
    const onSaveBtnClick = async () => {
      if (
        formData.value.inventory_range === 1 &&
        !formData.value.department_id_list?.length &&
        !formData.value.project_id_list?.length
      ) {
        return ctx.root.$message.warning('请选择部门或项目');
      }
      ctx.emit('submit', formData.value);
    };
    watch(
      () => formData.value.inventory_range,
      val => {
        if (val === 1) {
          formData.value.department_id_list = [];
          formData.value.project_id_list = [];
        }
      },
    );
    return {
      formData,
      show,
      close,
      onSaveBtnClick,
    };
  },
  render() {
    const { formData } = this;
    return (
      <el-form attrs={{ model: this.formData }} label-width={'70px'} class="form-wrap">
        <el-form-item label="盘点范围：">
          <el-radio v-model={formData.inventory_range} label={2}>
            全盘
          </el-radio>
          <el-radio v-model={formData.inventory_range} label={1}>
            部分盘
          </el-radio>
        </el-form-item>
        {formData.inventory_range === 1 && (
          <div key="other">
            <el-form-item label="部门：" label-width={'46px'}>
              <department-select
                // style="--default-height: 40px"
                style={{ flex: 1 }}
                placeholder="请选择部门"
                queryForm={{ is_contain_goumee: true }}
                checkOnClickNode={true}
                levelHidden={(level: number) => level > 3}
                clearable
                selectMultiple={true}
                v-model={formData.department_id_list}
              />
            </el-form-item>
            <el-form-item label="项目：" label-width={'46px'}>
              <FunctionSelect
                style="width:100%;flex: 1;"
                size="mini"
                collapse-tags
                modeType={EFunctionSelectType.SEARCH_PROFIT_LOSS}
                v-model={formData.project_id_list}
                placeholder="请选择项目"
                clearable={true}
                multiple
              />
            </el-form-item>
          </div>
        )}
      </el-form>
    );
  },
});
