import { defineComponent, ref } from '@vue/composition-api';
import limit from '@/utils/inputLimit';
import { Message } from 'element-ui';
import { isEmpty } from '@/utils/func';
import {
  Query_Assessment_Level_Config,
  Save_Assessment_Level_Config,
} from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';

export default defineComponent({
  setup(props, ctx) {
    const show = (value: NPerformance.Indicators[]) => {
      console.log('value', value);
    };

    Query_Assessment_Level_Config().then(res => {
      if (res.data.success) {
        if (res.data.data.length > 0) formData.value = res.data.data[0];
      }
    });
    const reqSaveAssement = useRequest(Save_Assessment_Level_Config, { manual: true });
    const formData = ref<TG.ParameterFirst<typeof Save_Assessment_Level_Config>>({
      entry_method: 1,
      config_list: [
        {
          gt_score: 0,
        },
      ],
    } as any);
    const addConfigList = () => {
      const preValue = formData.value.config_list[formData.value.config_list.length - 1];
      const nextValue: any = {
        name: '',
        lte_score: '',
        gt_score: '',
      };
      if (!isEmpty(preValue.lte_score)) {
        nextValue.gt_score = Number(preValue.lte_score);
      }
      formData.value.config_list.push(nextValue);
    };
    const onSaveBtnClick = async () => {
      formRef.value?.validate((success, obj: any) => {
        if (!success) {
          const key = obj[Object.keys(obj)[0]];
          Message.error(key[0].message);
          console.log(obj);
          return;
        }
        const params: any = formData.value;
        params.config_list = params.config_list.map((item: any, index: number) => {
          item.order = index;
          item.lte_score = Number(item.lte_score);
          item.gt_score = Number(item.gt_score);
          return item;
        });

        reqSaveAssement.runAsync(params).then(() => {
          Message.success('设置成功');
          ctx.emit('close');
        });
      });
    };
    const formRef = ref<IFormRef>();
    return { onSaveBtnClick, show, formData, formRef, addConfigList };
  },
  render() {
    const { formData } = this;
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
          <el-form-item label="录入方式：" label-width="60px" class="level-way">
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请输入标签名称"
              value={1}
              style="width:100%"
              disabled
            >
              <el-option label="分数区间对应" value={1} />
            </el-select>
          </el-form-item>
          <div class="level-box-header">
            <div class="level-name">等级名称</div>
            <div class="level-range">分数区间范围</div>
          </div>
          <div class="levels-box">
            {/* <div />
            <div />
            <div /> */}
            {formData.config_list.map((item, index) => {
              return (
                <fragments>
                  <el-form-item
                    style=" margin-right: 16px !important;"
                    prop={`config_list.${index}.name`}
                    rules={{ required: true, message: '请输入等级名称', trigger: ['change'] }}
                  >
                    <el-input placeholder="请输入" v-model={item.name} size="small" />
                  </el-form-item>
                  <el-form-item style=" margin-right: 0 !important;">
                    <el-input
                      disabled={true}
                      placeholder="请输入"
                      value={item.gt_score}
                      onInput={(val: any) => {
                        item.gt_score = limit.Interger(val) as any;
                      }}
                    />
                  </el-form-item>
                  <div class="score mgl-6 mgr-6">{'< 分数 ≤'}</div>
                  <el-form-item
                    style=" margin-right: 8px !important;"
                    prop={`config_list.${index}.lte_score`}
                    rules={[
                      { required: true, message: '请输入分数区间范围', trigger: ['blur'] },
                      {
                        validator: (rule: any, value: string, callback: IAnyFunc) => {
                          const val = Number(value);
                          if (index === 0 && val > 0) return callback();
                          const preVal = Number(formData.config_list[index - 1].lte_score);
                          if (isNaN(preVal)) return callback('');
                          if (val <= preVal) callback('必须大于前一项分数');
                          callback();
                        },
                        trigger: 'blur',
                      },
                    ]}
                  >
                    <el-input
                      placeholder="请输入"
                      v-model={item.lte_score}
                      onInput={(val: any) => {
                        item.lte_score = limit.Interger(val) as any;
                      }}
                      onBlur={() => {
                        const next = formData.config_list[index + 1];
                        if (next) {
                          if (isEmpty(item.lte_score)) {
                            next.gt_score = '';
                          } else {
                            next.gt_score = Number(item.lte_score);
                          }
                        }
                      }}
                    />
                  </el-form-item>
                  <div class="score">
                    {index > 0 && (
                      <tg-icon
                        name="ico-delete"
                        onClick={() => {
                          formData.config_list.splice(index, 1);
                        }}
                      />
                    )}
                  </div>
                </fragments>
              );
            })}
          </div>
          <div class="add">
            <div class="icon-add" onclick={this.addConfigList}>
              <tg-icon name="ico-btn-add" />
            </div>
            <tg-button type="link" onclick={this.addConfigList}>
              添加等级
            </tg-button>
          </div>
        </el-form>
      </div>
    );
  },
});
