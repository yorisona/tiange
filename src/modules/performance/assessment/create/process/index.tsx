import { defineComponent, Ref, inject, ref, onMounted } from '@vue/composition-api';
import { EASSESSMENT_STAGE, EEVALUATION_OPERATOR } from '@/const/performance';
import { isEmpty } from '@/utils/func';
// import { OptionType } from '@/types/base/advanced';
import { GetAuthQueryUser } from '@/services/supplier';

interface SEARCH_LIST {
  label: string;
  value: number;
  real_name?: string;
}

export default defineComponent({
  setup() {
    const formData = inject('formData') as Ref<NPerformance.IEvaluationGroup>;
    console.log(formData, 'formData');

    const currentStep = ref(EASSESSMENT_STAGE.TARGET_SETTING);
    /* 搜索花名 */
    const GetAuthQueryUsers = async (search: string) => {
      const res: any = await GetAuthQueryUser({
        search_value: search,
        search_type: 2,
        is_checked: 1,
      });
      return res.data.map((item: any) => {
        return {
          label: item.username,
          value: item.id,
          real_name: item.real_name,
        };
      });
    };
    const search_executor_list = ref<SEARCH_LIST[]>([]);
    const search_executor = async (search: string) => {
      const list = await GetAuthQueryUsers(search);
      // if (list?.length > 0) {
      search_executor_list.value = list;
      // }
    };
    const search_rater_list = ref<SEARCH_LIST[]>([]);
    const search_rater = async (search: string) => {
      const list = await GetAuthQueryUsers(search);
      // if (list?.length > 0) {
      search_rater_list.value = list;
      // }
    };
    onMounted(() => {
      if (
        formData.value.confirmer_transfer_user_id &&
        formData.value.confirmer_transfer_user_name
      ) {
        search_executor_list.value = [
          {
            label: formData.value.confirmer_transfer_user_name,
            value: Number(formData.value.confirmer_transfer_user_id),
          },
        ];
      }
      const rating = formData.value.superior_rating[0].scorer;
      if (rating.transfer_user_id && rating.transfer_user_name) {
        search_rater_list.value = [
          {
            label: rating.transfer_user_name,
            value: Number(rating.transfer_user_id),
          },
        ];
      }
    });
    const getAListOfDefaultRaters = (item: {
      is_manager?: boolean;
      is_designated_user?: boolean;
      manager?: number;
      user_id?: number;
      transfer_user_id?: number;
      transfer_user_name?: string;
    }) => {
      if (item.transfer_user_id && item.transfer_user_name) {
        search_rater_list.value = [
          {
            label: item.transfer_user_name,
            value: Number(item.transfer_user_id),
          },
        ];
      }
    };
    return {
      formData,
      currentStep,
      search_executor,
      search_executor_list,
      search_rater_list,
      search_rater,
      getAListOfDefaultRaters,
    };
  },
  render() {
    const { formData, currentStep } = this;
    return (
      <div class="process-container">
        <div class="steps-box">
          <div
            class={['step', currentStep === EASSESSMENT_STAGE.TARGET_SETTING && 'currentEdit']}
            onclick={() => (this.currentStep = EASSESSMENT_STAGE.TARGET_SETTING)}
          >
            <div class="step-target">
              <span>目标制定</span>
              {[<span />, <span>(被考核人)</span>, <span>(直接主管)</span>][formData.operator ?? 0]}
              <tg-icon name="ico-icon_bianji" />
            </div>
          </div>
          <div
            class={['step', currentStep === EASSESSMENT_STAGE.TARGET_CONFIRM && 'currentEdit']}
            onclick={() => (this.currentStep = EASSESSMENT_STAGE.TARGET_CONFIRM)}
          >
            <div class={['step-target', formData.is_target_confirmed ? undefined : 'close']}>
              <span>目标确认</span>
              {
                [
                  <span />,
                  <span>(被考核人)</span>,
                  <span>(直接主管)</span>,
                  <span>(指定人员)</span>,
                ][formData.confirmer ?? 0]
              }
              <tg-icon name="ico-icon_bianji" />
            </div>
          </div>
          <div class={['step']}>
            <div class="step-target close disabled">
              <span>执行中</span>
            </div>
          </div>
          <div
            class={['step', currentStep === EASSESSMENT_STAGE.SELF && 'currentEdit']}
            onclick={() => (this.currentStep = EASSESSMENT_STAGE.SELF)}
          >
            <div class={['step-target', formData.is_self_evaluation ? undefined : 'close']}>
              <span>评分：自评</span>
              {(isEmpty(formData.weight) && <span />) || <span>权重：{formData.weight}%</span>}
              <tg-icon name="ico-icon_bianji" />
            </div>
          </div>
          <div
            class={['step', currentStep === EASSESSMENT_STAGE.SUPERIOR && 'currentEdit']}
            onclick={() => (this.currentStep = EASSESSMENT_STAGE.SUPERIOR)}
          >
            <div class={['step-target', formData.is_superior_rating ? undefined : 'close']}>
              <span>评分：上级评分</span>
              {(isEmpty(formData.superior_rating[0].weight) && <span />) || (
                <span>权重：{formData.superior_rating[0].weight}%</span>
              )}
              <tg-icon name="ico-icon_bianji" />
            </div>
          </div>
          <div class="step">
            <div class="step-target close disabled">
              <span>签字确认</span>
            </div>
          </div>
          <div class="step">
            <div class="step-target close disabled">
              <span>考核完成</span>
            </div>
          </div>
        </div>
        <el-form
          ref="formRef"
          size="mini"
          labelPosition="top"
          attrs={{
            model: this.formData,
          }}
        >
          {currentStep === EASSESSMENT_STAGE.TARGET_SETTING && (
            <fragments>
              <div class="process-title">目标制定</div>
              <el-form-item label="执行人" prop="name">
                <el-radio-group v-model={formData.operator}>
                  <el-radio label={1} value={1}>
                    被考核人
                  </el-radio>
                  <el-radio label={2} value={2}>
                    直接主管
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </fragments>
          )}
          {currentStep === EASSESSMENT_STAGE.TARGET_CONFIRM && (
            <fragments>
              <div class="process-title">
                <span class="mgr-18">目标确认</span>
                <el-switch v-model={formData.is_target_confirmed} />
              </div>
              {formData.is_target_confirmed && (
                <fragments>
                  <el-form-item label="确认人" prop="confirmer">
                    <el-radio-group v-model={formData.confirmer}>
                      <el-radio label={1}>被考核人</el-radio>
                      <el-radio label={2}>直接主管</el-radio>
                      <el-radio label={3}>指定人员</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    v-show={formData.confirmer === EEVALUATION_OPERATOR.DESIGNATED_USER}
                    label="请选择确认人"
                    prop="confirmer_transfer_user_id"
                    style="margin-top: -20px;"
                  >
                    <div class="checkbox-items-container">
                      <el-select
                        placeholder="请输入并选择花名"
                        onblur={() => {
                          if (this.search_executor_list.length === 0) {
                            this.search_executor_list = [
                              {
                                label: formData.confirmer_transfer_user_name as string,
                                value: Number(formData.confirmer_transfer_user_id),
                              },
                            ];
                          }
                        }}
                        v-model={formData.confirmer_transfer_user_id}
                        filterable={true}
                        remote={true}
                        key={formData.confirmer_transfer_user_id}
                        // style={'width:100%'}
                        // disabled={isDisable_contract_id}
                        onChange={(e: number) => {
                          const name = this.search_executor_list.find(item => item.value === e);
                          formData.confirmer_transfer_user_name = name?.label;
                          formData.confirmer_transfer_user_real_name = name?.real_name;
                          console.log(name, 'name');
                        }}
                        remote-method={this.search_executor}
                      >
                        {this.search_executor_list.map((item, key) => (
                          <el-option key={key} value={item.value} label={item.label} />
                        ))}
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item label="允许确认人">
                    <div class="checkbox-items-container">
                      <el-checkbox
                        style="margin-right: 20px;"
                        label={true}
                        v-model={formData.is_modify_indicator}
                      >
                        修改指标
                      </el-checkbox>
                      <el-checkbox label={true} v-model={formData.is_transfer}>
                        转交
                      </el-checkbox>
                    </div>
                  </el-form-item>
                </fragments>
              )}
            </fragments>
          )}
          {currentStep === EASSESSMENT_STAGE.SELF && (
            <fragments>
              <div class="process-title">
                <span class="mgr-18">自评</span>
                <el-switch v-model={formData.is_self_evaluation} />
              </div>
              {formData.is_self_evaluation && (
                <el-form-item label="评分权重" prop="name" class="label-bottom-6">
                  <el-input maxlength={3} v-model={formData.weight} style="width:300px">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              )}
            </fragments>
          )}
          {currentStep === EASSESSMENT_STAGE.SUPERIOR && (
            <fragments>
              <div class="process-title">
                <span class="mgr-18">上级评分</span>
                <el-switch v-model={formData.is_superior_rating} />
              </div>
              {formData.is_superior_rating && (
                <fragments>
                  {formData.superior_rating.map(item => {
                    return (
                      <fragments>
                        <el-form-item label="评分人" class="label-bottom-0 label-font-14">
                          <el-radio-group v-model={item.scorer.manager}>
                            <el-radio label={1}>直接主管</el-radio>
                            <el-radio label={5}>指定人员</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item
                          v-show={item.scorer.manager === 5}
                          label="请指定评分人"
                          prop="confirmer_transfer_user_id"
                          style="margin-top: -20px;"
                        >
                          <div class="checkbox-items-container">
                            {/* {this.search_rater_list.length === 0 &&
                              item.scorer.transfer_user_id &&
                              item.scorer.transfer_user_name &&
                              this.getAListOfDefaultRaters(item.scorer)} */}
                            <el-select
                              placeholder="请输入并选择花名"
                              v-model={item.scorer.transfer_user_id}
                              filterable={true}
                              remote={true}
                              key={item.scorer.transfer_user_id}
                              onblur={() => {
                                if (this.search_rater_list.length === 0) {
                                  this.search_rater_list = [
                                    {
                                      label: item.scorer.transfer_user_name as string,
                                      value: Number(item.scorer.transfer_user_id),
                                    },
                                  ];
                                }
                              }}
                              // style={'width:100%'}
                              // disabled={isDisable_contract_id}
                              onChange={(e: number) => {
                                const name = this.search_rater_list.find(item => item.value === e);
                                item.scorer.transfer_user_name = name?.label;
                                item.scorer.transfer_user_real_name = name?.real_name;
                                console.log(e);
                              }}
                              remote-method={this.search_rater}
                            >
                              {this.search_rater_list.map((item, key) => (
                                <el-option key={key} value={item.value} label={item.label} />
                              ))}
                            </el-select>
                          </div>
                        </el-form-item>
                        <el-form-item label="评分权重" class="label-bottom-6">
                          <el-input v-model={item.weight} maxlength={3} style="width:175px">
                            <template slot="append">%</template>
                          </el-input>
                        </el-form-item>
                        <el-form-item label="允许评分人">
                          <div class="checkbox-items-container">
                            <el-checkbox value={true} v-model={item.is_transfer}>
                              转交
                            </el-checkbox>
                          </div>
                        </el-form-item>
                      </fragments>
                    );
                  })}
                  <div class="process-title">
                    <span class="mgr-18">隔级主管校准</span>
                    <el-switch v-model={formData.is_superior_leader_rating} />
                  </div>
                </fragments>
              )}
            </fragments>
          )}
        </el-form>
      </div>
    );
  },
});
