import { computed, defineComponent, ref, set } from '@vue/composition-api';
import { Message } from 'element-ui';
import {
  Modify_Performance_Process_Appeal,
  ParamsSaveAssessmentLevelConfig,
  Query_Assessment_Level_Config,
} from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { downloadFileFromLink, isEmpty, previewFile } from '@/utils/func';
import { ALLOW_OPERATOR_CODES } from '@/const/performance';
import limit from '@/utils/inputLimit';

interface FormData {
  assessment_detail_id: number;
  score: number;
  level: string;
  remark: string;
  // 是否调整结果
  adjustSwitch: boolean;
  revoke_reason: string;
  adjustment_reason: string;
}
export default defineComponent({
  setup(props, ctx) {
    const assessmentInfo = ref<NPerformance.IAssessmentDetail>({} as any);
    const show = (value: NPerformance.IAssessmentDetail) => {
      assessmentInfo.value = value;
    };
    const scoreRange = ref<ParamsSaveAssessmentLevelConfig>();
    const reqSaveAssement = useRequest(Modify_Performance_Process_Appeal, { manual: true });
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
    const formData = ref<FormData>({
      adjustSwitch: false,
      revoke_reason: '',
    } as FormData);
    const onSaveBtnClick = async () => {
      formRef.value?.validate((success, obj: any) => {
        if (!success) {
          const key = obj[Object.keys(obj)[0]];
          Message.error(key[0].message);
          return;
        }
        const params: TG.ParameterFirst<typeof Modify_Performance_Process_Appeal> = {} as any;
        params.assessment_detail_id = assessmentInfo.value.id;
        if (formData.value.adjustSwitch) {
          if (isEmpty(level.value)) {
            Message.error('分数没有匹配到等级');
            return;
          }
          params.operate_type = ALLOW_OPERATOR_CODES.SIGNATURE_CONFIRM_APPEAL_PASSED;
          params.result = formData.value.score;
          params.adjustment_reason = formData.value.remark;
        } else {
          params.operate_type = ALLOW_OPERATOR_CODES.SIGNATURE_CONFIRM_APPEAL_FAILED;
          params.revoke_reason = formData.value.revoke_reason;
        }

        reqSaveAssement.runAsync(params).then(() => {
          Message.success(formData.value.adjustSwitch ? '调整成功' : '驳回成功');
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
    const appeal_detail = assessmentInfo.appeal_detail;
    return (
      <div class="dialog-container">
        <el-form
          size="small"
          ref="formRef"
          show-message={false}
          attrs={{
            model: formData,
          }}
        >
          <div class="level-info">
            <div class={'block'}>
              <span class="label">申诉理由</span>
              <span>{assessmentInfo.appeal_detail?.appeal_reason}</span>
            </div>
            {appeal_detail?.appeal_files && appeal_detail.appeal_files.length > 0 && (
              <div class="block" style="margin-top:8px">
                <span class="label">附件</span>
                <upload-file-list
                  value={appeal_detail?.appeal_files}
                  delete={false}
                  scopedSlots={{
                    append: (file: string) => {
                      return (
                        <div class="upload-file-download">
                          <tg-button
                            type="link"
                            class="mgr-10"
                            onClick={() => previewFile(file, true)}
                          >
                            预览
                          </tg-button>
                          <tg-button type="link" onClick={() => downloadFileFromLink(file, true)}>
                            下载
                          </tg-button>
                        </div>
                      );
                    },
                  }}
                />
              </div>
            )}
          </div>
          <el-form-item label="是否调整结果" class="adjustTheResult">
            <div class="radio-group">
              <el-radio-group v-model={formData.adjustSwitch}>
                <el-radio label={true}>是</el-radio>
                <el-radio label={false}>否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          {!formData.adjustSwitch && (
            <el-form-item
              label="驳回理由"
              prop="revoke_reason"
              rules={{ required: true, message: '请输入驳回理由', trigger: ['blur'] }}
            >
              <el-input
                placeholder="请输入驳回理由"
                type="textarea"
                maxlength="100"
                show-word-limit
                v-model={formData.revoke_reason}
              />
            </el-form-item>
          )}

          {formData.adjustSwitch && (
            <fragments>
              <div class="level-info">
                <div style="margin-top:0px">
                  <span class="label">考核名称：</span>
                  {assessmentInfo.assessment_management_name}
                </div>
                <div style="margin-top:6px">
                  <span class="label">员工姓名：</span>
                  {assessmentInfo.username}（{assessmentInfo.real_name}）
                </div>
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
                        rules={{ required: true, message: '请输入分数', trigger: ['blur'] }}
                      >
                        <el-input
                          v-model={formData.score}
                          onInput={(val: string) => {
                            set(formData, 'score', limit.IntergerAndDecimals(val));
                          }}
                          maxLength={6}
                          placeholder="请输入分数"
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
                rules={{ required: true, message: '请输入调整说明', trigger: ['blur'] }}
                style="margin-top:0px"
              >
                <el-input
                  maxlength="100"
                  show-word-limit
                  limt
                  placeholder="请输入调整说明"
                  type="textarea"
                  v-model={formData.remark}
                />
              </el-form-item>
            </fragments>
          )}
        </el-form>
      </div>
    );
  },
});
