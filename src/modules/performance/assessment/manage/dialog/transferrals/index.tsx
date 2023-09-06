import { computed, defineComponent, h, reactive, ref } from '@vue/composition-api';
import { GetAuthQueryUser } from '@/services/supplier';
import { OptionType } from '@/types/base/advanced';
import { Select } from '@gm/component/select';
import { EASSESSMENT_STAGE, ALLOW_OPERATOR_CODES } from '@/const/performance';
import { ElForm } from 'element-ui/types/form';
import { useRequest } from '@gm/hooks/ahooks';
import { batch_modify_performance_process_transmit } from '@/services/performance';

type GoodInfo = TG.ParameterFirst<typeof batch_modify_performance_process_transmit>;
export default defineComponent({
  name: 'transferrals',
  setup(props, ctx) {
    const formData = reactive<GoodInfo>({
      assessment_detail_ids: [],
      operate_type_list: [],
      transfer_user_id: undefined,
    });
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
    const batchResetOption = computed(() => {
      return [
        {
          label: '目标确认',
          value: ALLOW_OPERATOR_CODES.GOAL_CONFIRM_DELIVER,
          disabled: selectList.value.some(
            (item: any) =>
              item.present_stage > EASSESSMENT_STAGE.TARGET_CONFIRM || !item.is_target_confirmed,
          ),
        },
        {
          label: '上级评分',
          value: ALLOW_OPERATOR_CODES.SUPERIOR_ASSESSMENT_DELIVER,
          disabled: selectList.value.some(
            (item: any) =>
              item.present_stage > EASSESSMENT_STAGE.SUPERIOR || !item.is_superior_rating,
          ),
        },
      ];
    });
    const elFormRef = ref<ElForm | undefined>(undefined);
    const selectList = ref<any[]>([]);
    const reqSave = useRequest(batch_modify_performance_process_transmit, { manual: true });
    const methods = {
      show(row: any) {
        selectList.value = row;
        formData.assessment_detail_ids = row.map((item: any) => item.id);
      },
      onSaveBtnClick() {
        console.log(11);

        elFormRef.value?.validate(success => {
          if (success) {
            reqSave.runAsync(formData).then(() => {
              ctx.root.$message.success('操作成功');
              ctx.emit('submit');
              ctx.emit('close');
            });
            // methods.evaluateAnchorRecruit();
          }
        });
      },
    };
    return {
      elFormRef,
      formData,
      search_executor,
      search_executor_list,
      batchResetOption,
      ...methods,
    };
  },
  render() {
    const { formData, batchResetOption } = this;
    return (
      <div class="dialog-container">
        <el-form
          size="mini"
          ref="elFormRef"
          hide-required-asterisk={true}
          attrs={{
            model: formData,
          }}
        >
          <el-form-item
            class="mgb-12"
            label="转交节点"
            prop="operate_type_list"
            rules={{ required: true, message: '请选择转交节点', trigger: 'change' }}
          >
            <Select
              multiple={true}
              style="width:100%"
              popper-class="el-select-popper-mini"
              v-model={formData.operate_type_list}
              options={batchResetOption}
            />
          </el-form-item>
          <el-form-item
            label="转交给"
            prop="transfer_user_id"
            rules={{ required: true, message: '请输入并选择花名', trigger: 'change' }}
          >
            <el-select
              placeholder="请输入并选择花名"
              v-model={formData.transfer_user_id}
              filterable={true}
              remote={true}
              style={'width:100%'}
              // disabled={isDisable_contract_id}
              remote-method={this.search_executor}
            >
              {this.search_executor_list.map((item, key) => (
                <el-option key={key} value={item.value} label={item.label} />
              ))}
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
