import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { UserInfo } from '@/types/tiange/system';
import { GetUser } from '@/services/system';
import { useRequest } from '@gm/hooks/ahooks';
import { insert_or_update_project_product_follow_up_record } from '@/services/datacenter';
import { deepClone } from '@/utils/tools';
interface FormData {
  is_follow_up?: number;
  follow_up_date?: string;
  follow_up_user_id?: number;
  follow_up_user_name?: string;
  follow_up_comment?: string;
  is_feedback?: number;
  feedback_date?: string;
  feedback_user_id?: number;
  feedback_user_name?: number;
  is_live?: number;
  feedback_comment?: string;
  project_id?: number;
  product_sn?: string;
}
export default defineComponent({
  setup(props, ctx) {
    const initFormData = (): FormData => ({
      project_id: undefined,
      product_sn: undefined,
      is_follow_up: undefined,
      follow_up_date: undefined,
      follow_up_user_id: undefined,
      follow_up_user_name: undefined,
      follow_up_comment: undefined,
      is_feedback: undefined,
      feedback_date: undefined,
      feedback_user_id: undefined,
      feedback_user_name: undefined,
      is_live: undefined,
      feedback_comment: undefined,
    });
    const formData = ref<FormData>(initFormData());
    const formRef = ref<ElForm>();
    const userLoading = ref(false);
    const userList = ref<UserInfo[]>([]);
    const saveReq = useRequest(insert_or_update_project_product_follow_up_record, {
      manual: true,
      onSuccess: () => {
        ctx.emit('submit');
        ctx.emit('close');
      },
    });
    const methdos = {
      show(goods_info: any, record?: any) {
        if (record?.product_sn) {
          formData.value = deepClone(record);
        } else {
          formData.value.project_id = goods_info.project_id;
          formData.value.product_sn = goods_info.sn;
        }
      },
      onSaveBtnClick() {
        formRef.value?.validate(valide => {
          if (valide) {
            const {
              project_id,
              product_sn,
              is_feedback,
              feedback_user_id,
              feedback_comment,
              feedback_date,
              follow_up_user_id,
              follow_up_comment,
              follow_up_date,
              is_follow_up,
              is_live,
            } = formData.value;
            const baseParams = { project_id, product_sn };
            saveReq.runAsync(
              is_follow_up && is_feedback
                ? {
                    ...baseParams,
                    follow_up_user_id,
                    follow_up_date,
                    follow_up_comment,
                    is_follow_up,
                    is_feedback,
                    is_live,
                    feedback_user_id,
                    feedback_comment,
                    feedback_date,
                  }
                : is_follow_up
                ? {
                    ...baseParams,
                    follow_up_user_id,
                    follow_up_date,
                    follow_up_comment,
                    is_follow_up,
                  }
                : baseParams,
            );
          }
        });
      },
      queryUserList: async (keyword: string) => {
        if (!keyword) {
          userList.value = [];
          return;
        }
        userLoading.value = true;
        const res = await GetUser({
          page_num: 1,
          num: 1000,
          search_type: 2,
          is_checked: 1,
          search_value: keyword,
        });
        userLoading.value = false;
        if (res.data.success) {
          userList.value = res.data.data.data;
        }
      },
      onSelectChange(value: string, type: 'followUp' | 'feedback') {
        const finder = userList.value.find(el => el.username === value);
        if (type === 'followUp') {
          formData.value.follow_up_user_id = finder?.id;
        } else if (type === 'feedback') {
          formData.value.feedback_user_id = finder?.id;
        }
      },
    };
    return { formData, userLoading, userList, formRef, saveReq, ...methdos };
  },
  render() {
    const { formData } = this;
    return (
      <div class="tg-datacenter-goods-follow-up-page-container">
        <el-form props={{ model: formData }} label-width="0" size="mini" ref="formRef">
          <section class="follow-up-field">
            <el-form-item prop="is_follow_up" class="mini-item" style="margin-bottom: 12px">
              <el-checkbox v-model={formData.is_follow_up} true-label={1} false-label={0}>
                已跟进
              </el-checkbox>
            </el-form-item>
            <div class="display-flex">
              <el-form-item
                prop="follow_up_date"
                label="跟进时间："
                label-width="60px"
                rules={{
                  required: formData.is_follow_up,
                  message: '请选择跟进时间',
                  trigger: 'change',
                }}
              >
                <el-date-picker
                  disabled={!formData.is_follow_up}
                  type="date"
                  editable={false}
                  clearable={false}
                  v-model={formData.follow_up_date}
                  placeholder="请选择"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item
                prop="follow_up_user_name"
                label="对接人："
                label-width="60px"
                rules={{
                  required: formData.is_follow_up,
                  message: '请选择对接人',
                  trigger: 'change',
                }}
              >
                <el-select
                  disabled={!formData.is_follow_up}
                  placeholder="请输入选择"
                  v-model={formData.follow_up_user_name}
                  style="width: 100%"
                  remote
                  filterable
                  remote-method={this.queryUserList}
                  loading={this.userLoading}
                  on-change={(val: string) => this.onSelectChange(val, 'followUp')}
                >
                  {this.userList.map(el => (
                    <el-option value={el.username} label={el.username} key={el.id}></el-option>
                  ))}
                </el-select>
              </el-form-item>
            </div>
            <el-form-item prop="follow_up_comment">
              <el-input
                type="textarea"
                maxlength={100}
                placeholder="请输入跟进备注"
                disabled={!formData.is_follow_up}
                v-model={formData.follow_up_comment}
              ></el-input>
            </el-form-item>
          </section>
          <section class="dash-line"></section>
          <section class="feedback-field">
            <el-form-item prop="is_feedback" class="mini-item" style="margin-bottom: 12px">
              <el-checkbox
                disabled={!formData.is_follow_up}
                v-model={formData.is_feedback}
                true-label={1}
                false-label={0}
              >
                已反馈
              </el-checkbox>
            </el-form-item>
            <div class="display-flex">
              <el-form-item
                prop="feedback_date"
                label="反馈时间："
                label-width="60px"
                rules={{
                  required: formData.is_follow_up && formData.is_feedback,
                  message: '请选择反馈时间',
                  trigger: 'change',
                }}
              >
                <el-date-picker
                  disabled={!formData.is_follow_up || !formData.is_feedback}
                  type="date"
                  editable={false}
                  clearable={false}
                  v-model={formData.feedback_date}
                  placeholder="请选择"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item
                prop="feedback_user_name"
                label="反馈人："
                label-width="60px"
                rules={{
                  required: formData.is_follow_up && formData.is_feedback,
                  message: '请选择反馈人',
                  trigger: 'change',
                }}
              >
                <el-select
                  disabled={!formData.is_follow_up || !formData.is_feedback}
                  placeholder="请输入选择"
                  v-model={formData.feedback_user_name}
                  style="width: 100%"
                  remote
                  filterable
                  remote-method={this.queryUserList}
                  loading={this.userLoading}
                  on-change={(val: string) => this.onSelectChange(val, 'feedback')}
                >
                  {this.userList.map(el => (
                    <el-option value={el.username} label={el.username} key={el.id}></el-option>
                  ))}
                </el-select>
              </el-form-item>
            </div>
            <el-form-item
              prop="is_live"
              class="mini-item"
              rules={{
                required: formData.is_follow_up && formData.is_feedback,
                message: '请选择是否已直播',
                trigger: 'change',
              }}
            >
              <el-radio-group
                disabled={!formData.is_follow_up || !formData.is_feedback}
                v-model={formData.is_live}
              >
                <el-radio label={1}>已直播</el-radio>
                <el-radio label={0}>未直播</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="feedback_comment">
              <el-input
                type="textarea"
                maxlength={100}
                placeholder="请输入反馈备注"
                disabled={!formData.is_follow_up || !formData.is_feedback}
                v-model={formData.feedback_comment}
              ></el-input>
            </el-form-item>
          </section>
        </el-form>
        <tg-mask-loading visible={this.saveReq.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
