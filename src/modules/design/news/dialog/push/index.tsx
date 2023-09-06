import { defineComponent, ref } from '@vue/composition-api';

import { Select } from '@gm/component/select';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import {
  Hand_Push_News,
  Query_Daily_Infos_News,
  Query_Daily_Infos_Set,
  Query_User_V2,
} from '@/services/daily_infos';
import viewInfoMobile from '../viewInfoMobile/index.vue';
import { useDialog } from '@/use/dialog';
import moment from 'moment';
import { Message } from 'element-ui';
type IFormData = TG.ParameterFirst<typeof Hand_Push_News> & { count?: number };
export default defineComponent({
  setup(props, ctx) {
    const show = (value: any[]) => {
      reqInfo.runAsync().then(res => {
        const data = res.data.data;
        formData.value.receive_user_ids = data.push_user_infos.map(it => it.id as any);
        if (data.push_user_infos) {
          options.value = data.push_user_infos.map(data => {
            return {
              label: data.username,
              value: data.id,
            };
          });
        }
      });
    };

    const options = ref<TG.OptionType[]>([]);

    const formData = ref<IFormData>({
      count: undefined,
      receive_user_ids: [],
      grab_time: undefined,
    });

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          const params = formData.value;
          if (params.grab_time) params.grab_time = moment(params.grab_time).format('YYYY-MM-DD');
          reqSave.runAsync(params).then(() => {
            Message.success('操作成功');
            ctx.emit('submit');
            ctx.emit('close');
          });
        }
      });
    };
    const formRef = ref<IFormRef>();
    const reqSave = useRequest(Hand_Push_News, { manual: true });
    const reqSearchUser = useRequest(Query_User_V2, { manual: true });
    const reqList = usePagination(Query_Daily_Infos_News, { manual: true });

    const DialogViewInfoMobile = useDialog({
      title: '每日资讯预览',
      component: viewInfoMobile,
      width: 375,
      footer: false,
    });

    const onDateChange = (value: any) => {
      if (value === null) {
        formData.value.count = undefined;
        return;
      }
      reqList
        .runAsync({ num: 50, page_num: 1 }, { grab_time: moment(value).format('YYYY-MM-DD') })
        .then(res => {
          if (res.data.success) {
            formData.value.count = res.data.data.total;
          } else {
            formData.value.count = undefined;
          }
        });
    };
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
    const reqInfo = useRequest(Query_Daily_Infos_Set, { manual: true });
    const onPreview = () => {
      DialogViewInfoMobile.show(reqList.data);
    };
    return {
      onSaveBtnClick,
      onPreview,
      show,
      formData,
      formRef,
      options,
      reqSave,
      reqSearchUser,
      searchUser,
      onDateChange,
    };
  },
  render() {
    const { formData, searchUser, reqSearchUser, onDateChange, onPreview } = this;
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
            label="抓取时间："
            label-width="70px"
            prop="grab_time"
            rules={{ required: true, message: '请选择抓取时间', trigger: 'blur' }}
          >
            <el-date-picker
              placeholder="请选择抓取时间"
              v-model={formData.grab_time}
              style="width:100%"
              onChange={onDateChange}
            />
          </el-form-item>
          {formData.count !== undefined && (
            <el-form-item label="推送内容：" label-width="70px">
              <div class="push-count">
                共计快讯 {formData.count} 条
                {formData.count > 0 && (
                  <span class="preview" onClick={onPreview}>
                    预览
                  </span>
                )}
              </div>
            </el-form-item>
          )}
          <el-form-item
            label="推送人员："
            label-width="70px"
            prop="receive_user_ids"
            rules={{ required: true, message: '请选择推送人员', trigger: 'blur' }}
          >
            <Select
              placeholder="请选择推送人员"
              class="multiple-height"
              options={this.options}
              multiple
              filterable
              remote
              v-model={formData.receive_user_ids}
              remote-method={searchUser}
              style="width:100%"
              loading={reqSearchUser.loading}
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
