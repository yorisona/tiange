import { defineComponent, ref } from '@vue/composition-api';
import { EINDICATOR_TYPE, INDICATOR_TYPE_OPTIONS } from '@/const/performance';
import { Query_Indicator_Tag, Save_Indicator } from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import { Select } from '@gm/component/select';
import limit from '@/utils/inputLimit';
import { isEmpty } from '@/utils/func';
import { queryUserNames } from '@/api/customer';
import { deepClone } from '@/utils/tools';

interface DialogOptionsType {
  isTargetSetting: boolean;
}

export default defineComponent({
  props: {
    disabledSubmit: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const formData = ref<NPerformance.Indicators>({
      indicator_type: EINDICATOR_TYPE.RATION,
      is_can_delete: 1,
    } as NPerformance.Indicators);
    const formRef = ref<IFormRef>();
    const dismension_type_list = ref<number[]>([]);
    const reqSaveIndicator = useRequest(Save_Indicator, {
      manual: true,
    });
    const reqTag = useRequest(Query_Indicator_Tag, {
      manual: props.disabledSubmit,
      transform(data) {
        return data.map(it => ({ label: it.name, value: it.tag_id }));
      },
    });
    const dialogOptions = ref<DialogOptionsType | undefined>(undefined);
    const show = (
      row: NPerformance.Indicators,
      types: number[] = [],
      options?: DialogOptionsType,
    ) => {
      dismension_type_list.value = types;
      dialogOptions.value = options;
      if (row) {
        formData.value = deepClone(row) as NPerformance.Indicators;
      } else {
        // 如果不是编辑,又有禁止选择字段,给单选框赋值
        if (types.length > 0) {
          formData.value.indicator_type = types[0];
        }
      }
    };

    const assignScorerList = ref<any[]>([]);

    const onSaveBtnClick = () => {
      formRef.value?.validate(async (err: any) => {
        if (!err) return;
        const postData = { ...formData.value };
        // 定量指标必填
        postData.is_target = postData.indicator_type === EINDICATOR_TYPE.RATION;
        postData.is_result = postData.indicator_type === EINDICATOR_TYPE.RATION;
        if (
          postData.indicator_type === EINDICATOR_TYPE.BONUS ||
          postData.indicator_type === EINDICATOR_TYPE.DEDUCT
        ) {
          postData.weight = undefined as any;
        }

        if (isEmpty(postData.weight)) {
          postData.weight = null as any;
        }
        if (isEmpty(postData.increase_limit)) {
          postData.increase_limit = null as any;
        }
        if (isEmpty(postData.decrease_limit)) {
          postData.decrease_limit = null as any;
        }
        if (props.disabledSubmit) {
          ctx.emit('submit', postData);
        } else {
          reqSaveIndicator.runAsync(postData).then(() => {
            Message.success('新增成功 ');
            ctx.emit('submit');
            ctx.emit('close');
          });
        }
      });
    };

    const searchAssignScorer = async (val: string) => {
      if (val.trim() === '') {
        return [];
      }
      const res = await queryUserNames({
        username: val,
      });
      if (res.data.success) {
        return res.data.data.user_data.map((it: any) => {
          return {
            value: it.id,
            label: it.username,
            ...it,
          };
        }) as any;
      } else {
        return [];
      }
    };

    return {
      dialogOptions,
      assignScorerList,
      formData,
      formRef,
      reqTag,
      reqSaveIndicator,
      onSaveBtnClick,
      show,
      dismension_type_list,
      searchAssignScorer,
    };
  },
  render() {
    // const { formData } = this;
    return (
      <div class="tg-page-container page-content-container">
        <div class="content">
          <el-form
            ref="formRef"
            size="mini"
            attrs={{
              model: this.formData,
            }}
          >
            {!this.disabledSubmit && (
              <el-form-item label="指标标签：">
                <Select
                  popper-class="el-select-popper-mini"
                  style="width:100%"
                  options={this.reqTag.data as any}
                  v-model={this.formData.tag_id}
                  filterable={true}
                  clearable={true}
                />
              </el-form-item>
            )}
            <el-form-item label="指标类型" prop="indicator_type" label-position="top">
              <el-radio-group
                disabled={!this.formData.is_can_delete}
                v-model={this.formData.indicator_type}
                style="width:100%;height:24px; display: flex;align-items: center;column-gap: 0px;"
              >
                {INDICATOR_TYPE_OPTIONS.map(item => {
                  let disable = false;
                  if (this.dismension_type_list.length > 0) {
                    disable = !this.dismension_type_list.some(it => it === item.value);
                  }
                  return (
                    <el-radio
                      style="margin-right:18px"
                      disabled={disable}
                      name="indiactor_type"
                      label={item.value}
                    >
                      {item.label}
                    </el-radio>
                  );
                })}
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="指标名称"
              prop="name"
              label-position="top"
              rules={[{ required: true, message: '请输入指标名称' }]}
            >
              <el-input maxlength={100} placeholder="请输入指标名称" v-model={this.formData.name} />
            </el-form-item>
            <el-form-item label="指标定义" label-position="top">
              <el-input
                v-model={this.formData.remark}
                type="textarea"
                placeholder="请输入指标定义"
                maxlength={350}
                show-word-limit
              />
            </el-form-item>
            <el-form-item
              label="考核标准"
              prop="check_standard"
              label-position="top"
              key="check_standard"
              rules={[{ required: true, message: '请输入考核标准' }]}
            >
              <el-input
                disabled={!this.formData.is_can_delete}
                v-model={this.formData.check_standard}
                placeholder="请输入考核标准"
                type="textarea"
                maxlength={350}
                show-word-limit
              />
            </el-form-item>
            {this.formData.indicator_type === EINDICATOR_TYPE.RATION &&
              this.dialogOptions?.isTargetSetting === true && (
                <el-form-item
                  label="目标值"
                  prop="target"
                  key="target"
                  label-position="top"
                  rules={{ required: true, message: '请输入目标值' }}
                >
                  <el-input
                    v-model={this.formData.target}
                    placeholder="请输入目标值"
                    maxlength={100}
                  ></el-input>
                </el-form-item>
              )}
            {this.formData.indicator_type === EINDICATOR_TYPE.RATION &&
              !this.dialogOptions?.isTargetSetting && (
                <el-form-item
                  label="目标值："
                  prop="increase_limit"
                  class="content-flex value-item"
                >
                  <el-switch value={true} disabled />
                </el-form-item>
              )}
            {this.formData.indicator_type === EINDICATOR_TYPE.RATION &&
              !this.dialogOptions?.isTargetSetting && (
                <el-form-item
                  label="结果值："
                  prop="increase_limit"
                  class="content-flex value-item"
                >
                  <el-switch value={true} disabled />
                </el-form-item>
              )}
            {this.formData.indicator_type === EINDICATOR_TYPE.BONUS && (
              <el-form-item label="加分上限" label-position="top" prop="increase_limit">
                <el-input v-model={this.formData.increase_limit} />
              </el-form-item>
            )}
            {this.formData.indicator_type === EINDICATOR_TYPE.DEDUCT && (
              <el-form-item label="扣分上限" label-position="top" prop="decrease_limit">
                <el-input v-model={this.formData.decrease_limit} />
              </el-form-item>
            )}
            {this.formData.indicator_type !== EINDICATOR_TYPE.DEDUCT &&
              this.formData.indicator_type !== EINDICATOR_TYPE.BONUS && (
                <el-form-item
                  label="权重"
                  prop="weight"
                  label-position="top"
                  key="weight"
                  rules={{
                    required: this.dialogOptions?.isTargetSetting ? true : false,
                    message: '请输入权重',
                  }}
                >
                  <el-input
                    maxlength={3}
                    v-model={this.formData.weight}
                    placeholder="请输入权重"
                    onInput={(val: string) => {
                      this.formData.weight = limit.Interger(val) as any;
                    }}
                  >
                    <span slot="append">%</span>
                  </el-input>
                </el-form-item>
              )}

            <el-form-item label="评分方式：" class="detail-item">
              <div class="sheng">直接输入分数 </div>
            </el-form-item>
            <el-form-item label="指定评分人：" class="detail-item">
              <el-switch
                v-model={this.formData.is_assign_scorer}
                style="position: relative; top: 2px;"
              />
              {
                // (this.formData.indicator_type !== EINDICATOR_TYPE.RATION &&
                // this.formData.indicator_type !== EINDICATOR_TYPE.QUALITATIVE) ||
                !this.dialogOptions?.isTargetSetting === true && (
                  <div class="sheng">
                    开启后，该指标如被引用，则被考核人需在考核表设置指定评分人。{' '}
                  </div>
                )
              }
            </el-form-item>
            {
              // (this.formData.indicator_type === EINDICATOR_TYPE.RATION ||
              // this.formData.indicator_type === EINDICATOR_TYPE.QUALITATIVE) &&
              this.formData.is_assign_scorer && this.dialogOptions?.isTargetSetting === true && (
                <el-form-item label="指定评分人" label-position="top">
                  <el-select
                    popper-class="el-select-popper-mini"
                    style="width: 100%"
                    v-model={this.formData.assign_scorer_id}
                    filterable
                    remote
                    remote-method={async (val: string) => {
                      this.assignScorerList = await this.searchAssignScorer(val);
                    }}
                    placeholder="请输入并选择评分人"
                    on-change={(val: number) => {
                      const finder = this.assignScorerList.find((el: any) => el.value === val);
                      this.formData.assign_scorer_username = finder?.label;
                    }}
                  >
                    {this.assignScorerList.map((el: any) => {
                      return (
                        <el-option label={el.label} value={el.value} key={el.value}></el-option>
                      );
                    })}
                  </el-select>
                  {/* <el-input v-model={formData.target} placeholder="请输入并指定评分人"></el-input> */}
                </el-form-item>
              )
            }
          </el-form>
        </div>
      </div>
    );
  },
});
