import { defineComponent, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { FunctionSelect, EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import {
  Check_Reservation_Form_Date,
  Post_Visual_Design_Set_Design_Level,
  Query_Design_Level,
  Query_Project_Name,
} from '@/services/design';
import moment from 'moment';
import { ElForm } from 'element-ui/types/form';

const autoAuditOptions: TG.OptionType<number>[] = Array.from({ length: 5 }).map((_, key) => ({
  label: key + 1 + '',
  value: key + 1,
}));

const personInChargeOption: TG.OptionType<number>[] = [
  { label: '二级部门负责人', value: 1 },
  { label: '三级及以上负责人', value: 2 },
];

interface IFormData {
  level_name: string;
  step: IFormDataStep[];
}
interface IFormDataStep {
  name: string;
  audit_by_type: number;
  is_opened: boolean;
  auto_audit_time_days: number;
  assign_audit_user_ids: number[];
  assign_audit_user_infos: TG.OptionType[];
}

export default defineComponent({
  setup(props, ctx) {
    const show = (value: M.design.Reservation) => {};
    const reqSaveAssement = useRequest(Post_Visual_Design_Set_Design_Level, { manual: true });
    const getInitItemData = () => {
      return [
        {
          name: '内审',
          is_opened: false,
          audit_by_type: 1,
          auto_audit_time_days: 1,
          assign_audit_user_ids: [],
          assign_audit_user_infos: [],
        },
        {
          name: '初稿',
          is_opened: false,
          audit_by_type: 1,
          auto_audit_time_days: 1,
          assign_audit_user_ids: [],
          assign_audit_user_infos: [],
        },
        {
          name: '终稿',
          is_opened: true,
          audit_by_type: 1,
          auto_audit_time_days: 1,
          assign_audit_user_ids: [],
          assign_audit_user_infos: [],
        },
      ] as IFormDataStep[];
    };
    const formData = ref<IFormData[]>([]);
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (!success) {
          return;
        }
        let message: string | null = null;
        const params = {
          datas: formData.value.map(item => {
            item.level_name = String(item.level_name).trim();
            const noSelected = item.step.find(it => it.is_opened);
            if (message === null && !noSelected) {
              message = `级别名称:${item.level_name} ,必须设置一项审核人`;
            }
            return item;
          }),
        };
        if (message !== null) {
          Message.error(message);
          return;
        }

        reqSaveAssement.runAsync(params as any).then(() => {
          Message.success('发起成功');
          ctx.emit('submit');
          ctx.emit('close');
        });
      });
    };
    const reqProjectName = usePagination(Query_Project_Name, {
      manual: true,
      transform: data => {
        return data.data.map(it => {
          return {
            label: it.project_name,
            value: it.project_id,
          };
        });
      },
    });
    const reqCheckFormDate = useRequest(Check_Reservation_Form_Date, {
      manual: true,
      // onSuccess(_, res) {
      //   if (res.data.message) {
      //     ctx.root.$message.success(res.data.message);
      //   }
      // },
      transform(data) {
        return data.map(it => {
          return {
            label: it.message ? `${it.label} (${it.message})` : it.label,
            value: it.label,
            disabled: it.disabled,
          };
        });
      },
    });
    // Query_Design_Level
    Query_Design_Level().then(res => {
      if (res.data.data.data && res.data.data.data.length > 0) {
        // formData.value = res.data.data.data;
        const list = res.data.data.data || [];
        list.forEach((item: any) => {
          item.step.forEach((v: any) => {
            if (v.assign_audit_user_infos) {
              v.assign_audit_user_infos.map((it: any) => {
                it.label = it.username;
                it.value = it.user_id;
                return it;
              });
            }
          });
        });
        formData.value = list;
        console.log(formData.value, list, 'formData.value');
      }
    });
    const checkFormDate = (val: string[]) => {
      const transVal = val.map((date: string) => {
        return moment(date).format('YYYY-MM-DD') as string;
      });
      return reqCheckFormDate.runAsync(transVal);
    };
    // const formRef = ref<IFormRef>();
    const formRef = ref<ElForm | null>(null);

    const addNewlevel = () => {
      formData.value.push({
        level_name: '',
        step: getInitItemData(),
      });
    };

    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      reqProjectName,
      reqCheckFormDate,
      checkFormDate,
      addNewlevel,
    };
  },
  render() {
    const { formData, addNewlevel } = this;
    const formBlockItem = formData.map((item, keyLevel) => {
      return (
        <div class="form-block-item">
          {formData.length > 1 && (
            <tg-icon
              class="close"
              name="ico-common-cuowuhuoquxiao-areality"
              onClick={() => formData.splice(keyLevel, 1)}
            />
          )}

          <div>级别名称：</div>
          <div>
            <el-form-item
              prop={`${keyLevel}.level_name`}
              class="xiangguanyaoqiu"
              rules={{ required: true, message: '请输入级别名称', trigger: ['blur'] }}
            >
              <el-input
                style="width:171px"
                maxlength={10}
                v-model={item.level_name}
                placeholder="请输入级别名称"
              />
            </el-form-item>
          </div>
          <div class="coalesce" />
          {item.step.map((step, keyType) => {
            return (
              <fragments>
                <div class="label">
                  <el-checkbox v-model={step.is_opened} disabled={step.name === '终稿' && true}>
                    {step.name}
                  </el-checkbox>
                </div>
                <div>
                  <div>
                    <el-form-item
                      class="Select-box"
                      prop={`${keyLevel}.step.${keyType}.audit_by_type`}
                      rules={
                        step.is_opened && {
                          required: true,
                          message: '请选择部门负责人',
                          trigger: ['blur'],
                        }
                      }
                    >
                      <Select
                        disabled={!step.is_opened}
                        placeholder="请选择部门负责人"
                        class="mgr-12"
                        style={{ flex: 1 }}
                        clearable={false}
                        v-model={step.audit_by_type}
                        options={personInChargeOption}
                      />
                      <FunctionSelect
                        modeType={EFunctionSelectType.FLOWER_NAME}
                        size="mini"
                        multiple
                        style={{ flex: 1 }}
                        v-model={step.assign_audit_user_ids}
                        class="td-3"
                        collapse-tags={true}
                        placeholder="请选择指定审核人"
                        defaultValue={step.assign_audit_user_infos}
                        onChange={(val: any) => {
                          console.log(val, 'va;');
                        }}
                      />
                    </el-form-item>
                  </div>
                </div>
                <div class="label-auto">自动审核时间：</div>
                <div>
                  <el-form-item
                    prop={`${keyLevel}.step.${keyType}.auto_audit_time_days`}
                    rules={
                      step.is_opened && {
                        required: true,
                        message: '请选择审核时间',
                        trigger: ['blur'],
                      }
                    }
                  >
                    <Select
                      disabled={!step.is_opened}
                      placeholder="请选择"
                      clearable={false}
                      v-model={step.auto_audit_time_days}
                      options={autoAuditOptions}
                    />
                  </el-form-item>
                </div>
                <div class="label-day">天</div>
              </fragments>
            );
          })}
        </div>
      );
    });
    return (
      <el-form
        size="mini"
        ref="formRef"
        attrs={{
          model: formData,
        }}
      >
        <div class="form-body">
          <div class="form-block">{formBlockItem}</div>

          <tg-button icon="ico-btn-add" size="mini" onClick={addNewlevel}>
            新增级别
          </tg-button>
        </div>
      </el-form>
    );
  },
});
/**
 * 今天早上发现
 **/
