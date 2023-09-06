import { defineComponent, ref, computed, set } from '@vue/composition-api';
import { Message } from 'element-ui';
import {
  Modify_Assessment_Result,
  ParamsSaveAssessmentLevelConfig,
  Query_Assessment_Level_Config,
} from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { isEmpty } from '@/utils/func';
import limit from '@/utils/inputLimit';

interface FormData {
  assessment_detail_id: number;
  score: number;
  level: string;
  remark: string;
}
export default defineComponent({
  setup(props, ctx) {
    const assessmentInfo = ref<NPerformance.IAssessmentDetail>({} as any);
    const show = (value: NPerformance.IAssessmentDetail) => {
      assessmentInfo.value = value;
    };
    const scoreRange = ref<ParamsSaveAssessmentLevelConfig>();
    const reqSaveAssement = useRequest(Modify_Assessment_Result, { manual: true });
    Query_Assessment_Level_Config().then(res => {
      if (res.data.success) {
        scoreRange.value = res.data.data[0];
      }
    });
    const level = computed(() => {
      let result = '';
      const config_list = scoreRange.value?.config_list || [];
      if (config_list.length === 0) return result;
      if (isEmpty(formData.value.score)) return result;
      const score = Number(formData.value?.score);
      for (let i = 0; i < config_list.length; i++) {
        const tmp = config_list[i];
        if (score > tmp.gt_score && score <= tmp.lte_score) {
          result = tmp.name;
          break;
        }
      }
      return result;
    });
    const formData = ref<FormData>({} as FormData);
    const onSaveBtnClick = async () => {
      formRef.value?.validate((success, obj: any) => {
        if (!success) {
          const key = obj[Object.keys(obj)[0]];
          Message.error(key[0].message);
          return;
        }
        if (isEmpty(level.value)) {
          Message.error('分数没有匹配到等级');
          return;
        }
        const params: TG.ParameterFirst<typeof Modify_Assessment_Result> = {} as any;
        params.score = formData.value.score;
        params.level = level.value;
        params.remark = formData.value.remark;
        params.assessment_detail_id = assessmentInfo.value.id;

        reqSaveAssement.runAsync(params).then(() => {
          Message.success('调整成功');
          ctx.emit('submit');
          ctx.emit('close');
        });
      });
    };
    const formRef = ref<IFormRef>();
    return { onSaveBtnClick, show, formData, formRef, assessmentInfo, scoreRange, level };
  },
  render() {
    const { formData, assessmentInfo } = this;
    return (
      <div class="dialog-container">
        <el-form
          size="mini"
          ref="formRef"
          show-message={false}
          attrs={{
            model: formData,
          }}
        >
          <div class="level-info">
            <span>
              <span class="label">考核名称：</span>
              {assessmentInfo.assessment_management_name}
            </span>
            <span>
              <span class="label">员工姓名：</span>
              {assessmentInfo.username}（{assessmentInfo.real_name}）
            </span>
          </div>
          <div class="revise-box">
            <div class="th">
              <div></div>
              <div>分数</div>
              <div>等级</div>
            </div>
            <div>
              <div>调整前</div>
              <div>{assessmentInfo.result}</div>
              <div>{assessmentInfo.level}</div>
            </div>
            <div>
              <div>调整后</div>
              <div>
                <div class="input-box">
                  <el-form-item
                    prop="score"
                    rules={{ required: true, message: '请输入分数', trigger: ['change'] }}
                  >
                    <el-input
                      v-model={formData.score}
                      placeholder="请输入分数"
                      maxLength={6}
                      onInput={(val: string) => {
                        set(formData, 'score', limit.IntergerAndDecimals(val));
                      }}
                    />
                  </el-form-item>
                </div>
              </div>
              <div>
                <div class="input-box">
                  <el-form-item>
                    <el-input disabled value={this.level} />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <el-form-item
            label="调整说明"
            prop="remark"
            rules={{ required: true, message: '请输入调整说明', trigger: ['change'] }}
          >
            <el-input placeholder="请输入调整说明" type="textarea" v-model={formData.remark} />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
