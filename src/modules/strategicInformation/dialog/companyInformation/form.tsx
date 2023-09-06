import { defineComponent, ref } from '@vue/composition-api';
import { ElFormRef } from '@/utils/form';
import { Check_Opponent_Company, Save_Opponent_Company } from '@/services/strategicInformation';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
import { Confirm } from '@/use/asyncConfirm';
import { ValidateCallback } from '@/types/vendor/form';
import { isEmpty } from '@/utils/func';
type FormData = TG.ParameterFirst<typeof Save_Opponent_Company>;
export default defineComponent({
  name: 'newTypeDialog',
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    edit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {},
  setup(props, ctx) {
    const formRef = ref<ElFormRef>();
    const hasBrandsError = ref();
    const formData = ref<FormData>({
      cooperative_brand_infos: [{}],
    } as any);
    const addNewCooperative = () => {
      formData.value.cooperative_brand_infos.push({} as any);
    };
    const reqSave = useRequest(Save_Opponent_Company, { manual: true });
    const reqCheck = useRequest(Check_Opponent_Company, { manual: true });
    const onSaveBtnClick = async () => {
      if (!formRef.value) return;
      if (formData.value.cooperative_brand_infos.length === 0) {
        hasBrandsError.value = '至少要有一项合作品牌';
        return;
      } else {
        hasBrandsError.value = undefined;
      }
      formRef.value
        .validate()
        .catch(ex => {
          const hasError = Object.keys(ex).some(key => /cooperative_brand_infos\.\d/g.test(key));
          hasBrandsError.value = hasError ? '请完善合作品牌信息' : undefined;
          return new Promise(() => {});
        })
        .then(() => {
          const params = { ...formData.value };
          params.cooperative_brand_infos = params.cooperative_brand_infos.filter(it => {
            return !isEmpty(it.name) || !isEmpty(it.start_date) || !isEmpty(it.douyin_num);
          });
          return params;
        })
        .then(params => {
          return reqCheck.runAsync(params).then(res => {
            if (res.data.data) {
              return Confirm(res.data.data).then(() => params);
            }
            return params;
          });
        })
        .then(params => reqSave.runAsync(params))
        .then(() => {
          Message.success('操作成功');
          ctx.emit('submit');
          ctx.emit('close');
          console.log('保存成功');
        });
    };
    const show = (value: FormData) => {
      if (value) formData.value = JSON.parse(JSON.stringify(value));
    };
    return { formData, onSaveBtnClick, formRef, addNewCooperative, hasBrandsError, show };
  },
  render() {
    const { formData, addNewCooperative } = this;
    return (
      <div class="company-container">
        <el-form
          ref="formRef"
          label-width="70px"
          size="mini"
          attrs={{
            model: formData,
          }}
        >
          <el-form-item
            label="公司名称："
            prop="name"
            rules={{ required: true, trigger: 'blur', message: '请输入公司名称' }}
          >
            <el-input maxLength={20} placeholder="请输入公司名称" v-model={formData.name} />
          </el-form-item>
          <el-form-item label="公司简介：">
            <el-input
              type="textarea"
              maxlength={1000}
              placeholder="请输入公司简介"
              v-model={formData.introduction}
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="团队情况：">
            <el-input maxLength={100} placeholder="请输入团队情况" v-model={formData.team_info} />
          </el-form-item>
          <el-form-item label="头部达人：">
            <el-input maxLength={100} placeholder="请输入头部达人" v-model={formData.head_person} />
          </el-form-item>
          <el-form-item
            label="合作品牌："
            prop="cooperative_brand_infos"
            error={this.hasBrandsError}
          >
            <div class="brand-table">
              <div>品牌名称</div>
              <div>抖音号</div>
              <div>开始合作时间</div>
              <div>结束合作时间</div>
              <div>操作</div>
              {formData.cooperative_brand_infos.map((item, index) => {
                const validator = (rule: any, value: string, callback: ValidateCallback) => {
                  if (isEmpty(item.name) && isEmpty(item.douyin_num) && isEmpty(item.start_date))
                    return callback();
                  if (isEmpty(value)) callback(new Error(rule.message));
                  else callback();
                };
                return (
                  <fragments>
                    <el-form-item
                      label=""
                      prop={`cooperative_brand_infos.${index}.name`}
                      show-message={false}
                      rules={{
                        validator,
                        trigger: 'blue',
                        message: '请输入品牌名称',
                      }}
                    >
                      <el-input placeholder="请输入品牌名称" v-model={item.name} />
                    </el-form-item>
                    <el-form-item
                      label=""
                      prop={`cooperative_brand_infos.${index}.douyin_num`}
                      show-message={false}
                      rules={{ validator, trigger: 'blue', message: '请输入抖音号' }}
                    >
                      <el-input placeholder="请输入抖音号" v-model={item.douyin_num} />
                    </el-form-item>
                    <el-form-item
                      label=""
                      prop={`cooperative_brand_infos.${index}.start_date`}
                      show-message={false}
                      rules={{ validator, trigger: 'blue', message: '请选择开始合作时间' }}
                    >
                      <el-date-picker
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="请选择日期"
                        v-model={item.start_date}
                      />
                    </el-form-item>
                    <el-form-item label="">
                      <el-date-picker
                        placeholder="请选择日期"
                        value-format="yyyy-MM"
                        v-model={item.end_date}
                        type="month"
                      />
                    </el-form-item>
                    <div class="delete">
                      <tg-icon
                        name="ico-btn-delete"
                        disabled={formData.cooperative_brand_infos.length <= 1}
                        onClick={() => formData.cooperative_brand_infos.splice(index, 1)}
                      />
                    </div>
                  </fragments>
                );
              })}
            </div>
            <div class="brand-table-add" onClick={addNewCooperative}>
              <tg-icon name="ico-btn-add" />
              <tg-button type="link">新增</tg-button>
            </div>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              maxlength={1000}
              placeholder="请输入备注"
              show-word-limit
              v-model={formData.remark}
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
