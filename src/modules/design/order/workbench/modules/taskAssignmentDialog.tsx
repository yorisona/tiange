import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { OptionType } from '@/types/base/advanced';
import { GetAuthQueryUser } from '@/services/supplier';
import { Query_Design_Level } from '@/services/design';
import moment from 'moment';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref({
      executor: undefined,
      delivery_time: undefined,
      level: undefined,
      re_distribute: false,
    } as any);
    const show = (value: any) => {
      if (value) {
        /* 重新分配需带默认值 */
        search_executor_list.value = [
          {
            label: value.executor_name,
            value: value.executor,
          },
        ];
        Object.assign(formData.value, {
          ...value,
          delivery_time: moment(value.delivery_time).format('YYYY-MM-DD HH') ?? undefined,
        });
      }
    };
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          console.log(formData.value);
          ctx.emit('submit', formData.value);
        }
      });
    };

    const formRef = ref<IFormRef>();
    /* 搜索花名 */
    const search_executor_list = ref<OptionType<number>[]>([]);
    const search_executor = async (search: string) => {
      GetAuthQueryUser({
        search_value: search,
        search_type: 2,
        is_checked: 1,
      }).then((res: any) => {
        search_executor_list.value = res.data.map((item: any) => {
          return {
            label: item.username,
            value: item.id,
          };
        });
      });
    };
    /* 项目级别 */
    const level_list = ref<OptionType<number>[]>([]);
    const getLevelList = async () => {
      Query_Design_Level().then((res: any) => {
        level_list.value = res.data.data.data.map((item: any) => {
          return {
            label: item.level_name,
            value: item.id,
          };
        });
      });
    };
    onMounted(() => {
      getLevelList();
    });
    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      search_executor_list,
      search_executor,
      level_list,
    };
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
          label-width="86px"
        >
          {/* <el-form-item
            prop="id"
            rules={{ required: true, message: '请填写审核意见', trigger: 'change' }}
            label="选择执行人："
          >
            <el-input
              type="textarea"
              rows="4"
              show-word-limit
              v-model={formData.id}
              placeholder="请输入审核意见"
            />
          </el-form-item> */}
          <el-form-item
            label="执行设计师："
            prop="executor"
            rules={{ required: true, message: '请输入花名', trigger: ['change'] }}
          >
            <el-select
              placeholder="请输入花名"
              style="width:200px"
              v-model={formData.executor}
              filterable={true}
              remote={true}
              // disabled={isDisable_contract_id}
              remote-method={this.search_executor}
            >
              {this.search_executor_list.map((item, key) => (
                <el-option key={key} value={item.value} label={item.label} />
              ))}
            </el-select>
          </el-form-item>
          <el-form-item
            label="交付时间："
            style="margin-top: 16px"
            prop="delivery_time"
            rules={{ required: true, message: '请选择交付时间', trigger: ['change'] }}
          >
            <el-date-picker
              style="width:200px"
              v-model={formData.delivery_time}
              value-format={'yyyy-M-d HH'}
              popper-class="taskAssignmentDialog-date-picker"
              format="yyyy.MM.dd HH:mm"
              type="datetime"
              placeholder="选择时间"
              size="small"
              default-time="18:00:00"
              pickerOptions={{
                disabledDate: (date: string) => {
                  return moment().startOf('day').isAfter(date);
                },
              }}
            />
          </el-form-item>
          <el-form-item
            label="项目级别："
            prop="level"
            style="margin-top: 16px"
            rules={{ required: true, message: '请选择项目级别', trigger: ['change'] }}
          >
            <el-select placeholder="请选择" style="width:200px" v-model={formData.level}>
              {this.level_list.map((item, key) => (
                <el-option key={key} value={item.value} label={item.label} />
              ))}
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
