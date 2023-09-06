import { defineComponent, ref } from '@vue/composition-api';

import { Select } from '@gm/component/select';
import { useRequest } from '@gm/hooks/ahooks';
import { Query_Daily_Infos_Set, Save_Daily_Infos_Set, Query_User_V2 } from '@/services/daily_infos';
import { Message } from 'element-ui';

type IFormData = TG.ParameterFirst<typeof Save_Daily_Infos_Set>;
export default defineComponent({
  setup(props, ctx) {
    const show = (value: any[]) => {
      reqInfo.runAsync().then(res => {
        const data = res.data.data;
        formData.value.receive_user_ids = data.receive_user_infos.map(it => it.id as any);
        formData.value.push_time = data.push_time;
        formData.value.is_auto_push = data.is_auto_push;
        formData.value.grab_time = data.grab_time;
        formData.value.grab_keywords = data.grab_keywords;
        options.value = data.receive_user_infos.map(data => {
          return {
            label: data.username,
            value: data.id,
          };
        });
      });
    };

    const options = ref<TG.OptionType[]>([]);

    const formData = ref<IFormData>({
      is_auto_push: 0,
      grab_time: null,
      receive_user_ids: [],
      push_time: null,
      grab_keywords: null,
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          reqSave.runAsync(formData.value).then(() => {
            Message.success('操作成功');
            ctx.emit('submit');
            ctx.emit('close');
          });
        }
      });
    };
    const formRef = ref<IFormRef>();
    const reqSave = useRequest(Save_Daily_Infos_Set, { manual: true });
    const reqSearchUser = useRequest(Query_User_V2, { manual: true });
    const reqInfo = useRequest(Query_Daily_Infos_Set, { manual: true });

    const searchUser = (key: string) => {
      if (key.trim() === '') {
        options.value = [];
        return;
      }
      reqSearchUser.runAsync(key).then(res => {
        options.value = res.data.data.data.map(item => {
          return {
            label: item.username,
            value: item.id,
          };
        });
      });
    };
    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      options,
      reqSave,
      reqSearchUser,
      searchUser,
    };
  },
  render() {
    const { formData, searchUser, reqSearchUser } = this;
    return (
      <div class="dialog-container">
        <el-form
          size="mini"
          ref="formRef"
          hide-required-asterisk={true}
          label-width="80px"
          attrs={{
            model: this.formData,
          }}
        >
          <el-form-item
            label="抓取时间："
            prop="grab_time"
            rules={{ required: true, message: '请选择考抓取时间', trigger: 'blur' }}
          >
            <el-time-select
              placeholder="请选择考抓取时间"
              v-model={this.formData.grab_time}
              value-format="HH:mm"
              picker-options={{
                start: '00:00',
                step: '00:30',
                end: '24:00',
              }}
            />
          </el-form-item>
          <el-form-item label="抓取关键字：" prop="grab_keywords">
            <el-input
              placeholder="请填写抓取关键字,多个关键字请使用 逗号 分隔"
              type="textarea"
              v-model={formData.grab_keywords}
              style="width:100%"
              rows={3}
            />
          </el-form-item>
          <el-form-item label="自动推送：" prop="grab_keywords">
            <el-radio-group v-model={formData.is_auto_push}>
              <el-radio label={1}>开启</el-radio>
              <el-radio label={0}>关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          {formData.is_auto_push === 1 && (
            <fragments>
              <el-form-item
                label="推送时间："
                prop="push_time"
                rules={{ required: true, message: '请选择推送时间', trigger: 'blur' }}
              >
                <el-time-select
                  placeholder="请选择推送时间"
                  picker-options={{
                    start: '00:00',
                    step: '00:30',
                    end: '24:00',
                  }}
                  v-model={formData.push_time}
                />
              </el-form-item>
              <el-form-item
                label="推送人员："
                prop="receive_user_ids"
                rules={{ required: true, message: '请选择推送人员', trigger: 'blur' }}
              >
                <Select
                  class="multiple-height"
                  options={this.options}
                  placeholder="请选择推送人员"
                  multiple
                  filterable
                  remote
                  v-model={formData.receive_user_ids}
                  remote-method={searchUser}
                  style="width:100%"
                  loading={reqSearchUser.loading}
                />
              </el-form-item>
            </fragments>
          )}
        </el-form>
      </div>
    );
  },
});
