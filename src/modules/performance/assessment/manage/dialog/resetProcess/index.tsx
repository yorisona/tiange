import { defineComponent, ref } from '@vue/composition-api';
import { EASSESSMENT_STAGE, EASSESSMENT_STAGE_OPTIONS } from '@/const/performance';
import { Select } from '@gm/component/select';
import { CheckResetAssessmentPresentStage } from '@/services/performance';

export default defineComponent({
  setup(props, ctx) {
    const current_state = ref(0);
    const currentData = ref<any>({});
    const formRef = ref<IFormRef>();
    /* 批量重置 */
    // const batchResetIds = ref<any>([]);
    const batchResetOption = ref<any>([]);
    const show = (value: any) => {
      if (Array.isArray(value)) {
        formData.value.assessment_detail_ids = value.map((item: any) => item.id);
        getBatchResetNode();
        return;
      }
      current_state.value = value.present_stage;
      currentData.value = value;
    };
    /* 批量重置查询可重置节点 */
    const getBatchResetNode = () => {
      CheckResetAssessmentPresentStage({
        assessment_detail_ids: formData.value.assessment_detail_ids,
      }).then(res => {
        if (res.data.success) {
          batchResetOption.value = res.data.data.map((item: any) => {
            return {
              value: item.key,
              ...item,
            };
          });
        }
      });
    };

    const formData = ref({
      id: undefined,
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          ctx.emit('submit', formData.value);
        }
      });
    };

    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      current_state,
      currentData,
      batchResetOption,
    };
  },
  render() {
    const { formData, currentData } = this;
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
            label="重置到"
            prop="id"
            rules={{
              required: true,
              message: this.batchResetOption.length > 0 ? '请选择节点' : '请选择转交人',
              trigger: 'change',
            }}
          >
            {/* 批量重置or单个重置 */}
            {this.batchResetOption.length > 0 ? (
              <Select
                style="width:100%"
                popper-class="el-select-popper-mini"
                v-model={formData.id}
                options={this.batchResetOption}
              />
            ) : (
              <el-select
                popper-class="el-select-popper-mini"
                v-model={formData.id}
                style="width:100%"
              >
                {EASSESSMENT_STAGE_OPTIONS.map(item => {
                  // 流程开关
                  let process = false;
                  if (
                    currentData.is_target_confirmed === false &&
                    item.value === EASSESSMENT_STAGE.TARGET_CONFIRM
                  ) {
                    process = true;
                  }
                  if (
                    currentData.is_self_evaluation === false &&
                    item.value === EASSESSMENT_STAGE.SELF
                  ) {
                    process = true;
                  }
                  if (
                    currentData.is_superior_rating === false &&
                    item.value === EASSESSMENT_STAGE.SUPERIOR
                  ) {
                    process = true;
                  }
                  return (
                    <el-option
                      label={item.label}
                      value={item.value}
                      disabled={
                        item.value >= this.current_state ||
                        item.value === EASSESSMENT_STAGE.IN_PROGRESS ||
                        process
                      }
                    />
                  );
                })}
              </el-select>
            )}
          </el-form-item>
          <el-form-item
            label="重置说明"
            prop="remark"
            rules={{ required: true, message: '请填写重置说明', trigger: 'change' }}
          >
            <el-input
              type="textarea"
              maxlength={200}
              show-word-limit
              resize="none"
              v-model={formData.remark}
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
