import { defineComponent, ref } from '@vue/composition-api';
import { ElFormRef } from '@/utils/form';
import { useRequest } from '@gm/hooks/ahooks';
import { Loading, Message } from 'element-ui';
import { Save_Goods_Train } from '@/services/datacenter';
import { FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
type FormData = TG.ParameterFirst<typeof Save_Goods_Train> & {
  train_time: string[];
  train_date: string;
  trainer_info: any[];
};
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import moment from 'moment';
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
    const formatStr = 'YYYY-MM-DD HH:mm';

    const formRef = ref<ElFormRef>();
    const formData = ref<FormData>({
      train_courseware: [],
      trainer_id: [],
      train_time: ['', ''],
      train_date: '',
    } as any);

    const reqSave = useRequest(Save_Goods_Train, { manual: true });
    const onSaveBtnClick = async () => {
      if (!formRef.value) return;

      const isBefore = moment(
        moment(`${formData.value.train_date} ${formData.value.train_time[0]}`),
      ).isBefore(
        moment(`${formData.value.train_date} ${formData.value.train_time[1]}`).format(formatStr),
      );
      if (isBefore === false) {
        ctx.root.$message.warning('开始时间小于等于结束时间');
        return;
      }
      let loading: any;
      formRef.value
        .validate()
        .then(() => {
          const { train_time, train_date, ...other } = formData.value;
          const params = { ...other };

          params.train_start_time = moment(`${train_date} ${train_time[0]}`).format(formatStr);
          params.train_end_time = moment(`${train_date} ${train_time[1]}`).format(formatStr);

          return params;
        })
        .then(params => {
          loading = Loading.service({});
          return reqSave.runAsync(params);
        })
        .then(() => {
          Message.success('操作成功');
          ctx.emit('submit');
          ctx.emit('close');
        })
        .finally(() => {
          loading?.close();
        });
    };
    const show = (value: FormData) => {
      if (value) {
        const fdata = JSON.parse(JSON.stringify(value));
        fdata.train_date = moment(fdata.train_start_time).format('YYYY-MM-DD');
        fdata.train_time = [
          moment(`${fdata.train_start_time}`).format('HH:mm'),
          moment(`${fdata.train_end_time}`).format('HH:mm'),
        ];
        if (fdata.trainer_info) {
          fdata.trainer_id = fdata.trainer_info.map((it: any) => it.id);
          fdata.trainer_info = fdata.trainer_info.map((it: any) => ({
            label: it.username,
            value: it.id,
          }));
        }
        formData.value = fdata;
      }
    };

    return { formData, onSaveBtnClick, formRef, show };
  },
  render() {
    const { formData } = this;
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
            label="培训主题："
            prop="topic"
            rules={{ required: true, trigger: 'blur', message: '请输入培训主题' }}
          >
            <el-input maxLength={30} placeholder="请输入培训主题" v-model={formData.topic} />
          </el-form-item>
          <el-form-item
            label="培训人："
            prop="trainer_id"
            rules={{ required: true, trigger: 'change', message: '选择输入并选择培训人' }}
          >
            <FunctionSelect
              style="width:100%"
              modeType={EFunctionSelectType.FLOWER_NAME}
              v-model={formData.trainer_id}
              multiple
              placeholder="选择培训人"
              clearable={true}
              defaultValue={formData.trainer_info}
            />
          </el-form-item>
          <el-form-item
            label="培训日期："
            prop="train_date"
            rules={{ required: true, trigger: 'blur', message: '选择培训日期' }}
          >
            <el-date-picker
              type="date"
              maxLength={100}
              placeholder="选择培训日期"
              v-model={formData.train_date}
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item
            label="培训时间："
            prop="train_time"
            rules={{ required: true, trigger: 'blur', message: '选择培训时间' }}
          >
            {/*<el-time-picker
              range-separator="~"
              is-range
              maxLength={100}
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              v-model={formData.train_time}
              style="width:100%"
              value-format="HH:mm"
              format="HH:mm"
              default-value={['00:00:00', '23:00:00']}
            />*/}
            <div class="time-date-div">
              <el-time-picker
                popper-class="tpc"
                editable={true}
                clearable={false}
                v-model={formData.train_time[0]}
                placeholder="开始时间"
                format="HH:mm"
                value-format="HH:mm"
                picker-options={{
                  start: '00:00',
                  step: '00:01',
                  end: '24:00',
                }}
              />
              <span class="date-picker-separator">~</span>
              <el-time-picker
                popper-class="tpc"
                editable={true}
                clearable={false}
                v-model={formData.train_time[1]}
                placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
                picker-options={{
                  start: '00:00',
                  step: '00:01',
                  end: '24:00',
                }}
              />
            </div>
          </el-form-item>
          <el-form-item
            label="培训地点："
            prop="train_addr"
            rules={{ required: true, trigger: 'blur', message: '请填写培训地点' }}
          >
            <el-input maxLength={100} placeholder="请输入培训地点" v-model={formData.train_addr} />
          </el-form-item>
          <el-form-item label="培训课件：">
            <div class="upload-box">
              <tg-upload
                class="col-span-full"
                multiple={true}
                action="/api/resources/upload_file"
                data={{ type: 'visual_design', storage: 2 }}
                show-file-list={false}
                beforeUpload={ValidationFileUpload({
                  fileSize: 100,
                })}
                success={(res: any) => {
                  if (!res.success) {
                    Message.error(res.message);
                    return;
                  }
                  formData.train_courseware.push(res.data.source);
                }}
              >
                <tg-button icon="ico-upload-lite" v-model={formData.train_courseware}>
                  上传课件
                </tg-button>
                <span class="tips">支持ppt,pdf,xlsx,xls,doc.,docx 等格式上传</span>
              </tg-upload>
              <upload-file-list v-model={formData.train_courseware} />
            </div>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
