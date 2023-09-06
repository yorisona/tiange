import { defineComponent, ref } from '@vue/composition-api';
import { GetAuthQueryUser } from '@/services/supplier';

export default defineComponent({
  setup(props, ctx) {
    const show = (value: any[]) => {
      console.log('value', value);
    };

    const formData = ref({
      id: undefined,
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ctx.emit('submit', formData.value.id);
          ctx.emit('close');
        }
      });
    };
    const queryUser = (val: string) => {
      GetAuthQueryUser({
        search_value: val,
        search_type: 2,
      }).then((res: any) => {
        options.value = res.data.map((item: any) => {
          return {
            label: item.username,
            value: item.id,
          };
        });
      });
    };
    const formRef = ref<IFormRef>();
    const options = ref<TG.OptionType[]>([]);
    return { onSaveBtnClick, show, formData, formRef, options, queryUser };
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
            label="转交人："
            label-width="70px"
            prop="id"
            rules={{ required: true, message: '请选择转交人', trigger: 'change' }}
          >
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请搜索选择转交人"
              v-model={formData.id}
              style="width:100%"
              filterable
              remote
              remote-method={this.queryUser}
            >
              {this.options.map(item => {
                return <el-option label={item.label} value={item.value} />;
              })}
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
