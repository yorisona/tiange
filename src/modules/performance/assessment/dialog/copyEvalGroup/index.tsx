import { defineComponent, ref } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import { ECYCLE_TYPE, ECYCLE_TYPE_OPTIONS } from '@/const/performance';
import { Query_Evaluation_Group } from '@/services/performance';

export default defineComponent({
  setup(props, ctx) {
    const show = (value: any) => {
      if (value) {
        formData.value.cycle_type = value.cycle_type;
        formData.value.id = value.id;
        options.value = [
          {
            label: value.name,
            value: value.id,
            obj: value,
          } as any,
        ];
      } else {
        Query('');
      }
    };
    const formRef = ref<IFormRef>();
    const options = ref<TG.OptionType[]>([]);
    const formData = ref<any>({
      id: undefined,
      cycle_type: ECYCLE_TYPE.MONTHLY,
    });

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          const find: any = options.value.find(it => it.value === formData.value.id);
          if (find) {
            ctx.emit('submit', {
              group: find.obj,
              template: formData.value.template,
              process: formData.value.process,
            });
            ctx.emit('close');
          }
        }
      });
    };
    const Query = (val: string) => {
      Query_Evaluation_Group(
        { num: 20, page_num: 1 },
        {
          name: val,
          cycle_type: formData.value.cycle_type,
        },
      ).then((res: any) => {
        if (res.data.success) {
          options.value = res.data.data.data.map((item: any) => {
            return {
              label: item.name,
              value: item.id,
              obj: item,
            };
          });
        } else {
          options.value = [];
        }
      });
    };

    return { onSaveBtnClick, show, formData, formRef, options, Query };
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
            label="考核周期："
            label-width="70px"
            prop="cycle_type"
            rules={{ required: true, message: '请选择考核周期', trigger: 'change' }}
          >
            <Select
              popper-class="el-select-popper-mini"
              options={ECYCLE_TYPE_OPTIONS}
              v-model={formData.cycle_type}
              onChange={() => {
                formData.id = undefined;
                this.Query('');
              }}
            />
          </el-form-item>
          <el-form-item
            label="考核组："
            label-width="70px"
            prop="id"
            rules={{ required: true, message: '请选择考核组', trigger: 'change' }}
          >
            <Select
              popper-class="el-select-popper-mini"
              v-model={formData.id}
              style="width:100%"
              filterable
              remote
              remote-method={this.Query}
              options={this.options}
            />
          </el-form-item>
          <el-form-item
            label="复制内容："
            label-width="70px"
            prop="id"
            rules={{
              validator: (_: any, value: any, callback: TG.anyFunc) => {
                if (formData.template || formData.process) {
                  callback();
                } else {
                  callback('复制内容必须选一个');
                }
              },
            }}
          >
            <div class="checkbox-group">
              <el-checkbox v-model={formData.template}>模板指标</el-checkbox>
              <el-checkbox v-model={formData.process}>考评流程</el-checkbox>
            </div>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
