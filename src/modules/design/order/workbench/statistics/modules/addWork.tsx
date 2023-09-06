import { ref, defineComponent, h, computed } from '@vue/composition-api';
import ButtonGroup from '@/modules/design/dialog/createOrder/buttonGroup';
import { workingHoursDirection } from '../use';
// import { useRequest } from '@gm/hooks/ahooks';
import treeSelect from '@/components/treeSelect/base/index.vue';
import { FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { GetUserLevelTwoDepartment } from '@/services/design';
import { useRequest } from '@gm/hooks/ahooks';
import moment from 'moment';

const department_list = [
  {
    label: '项目方',
    value: workingHoursDirection.project,
  },
  {
    label: '需求方',
    value: workingHoursDirection.demandSide,
  },
];
export default defineComponent({
  components: {
    ButtonGroup,
    treeSelect,
  },
  setup(props, ctx) {
    const formData = ref<any>({
      man_hour_belong: workingHoursDirection.project,
      // end_time: '17:00',
      // start_time: '09:30',
      target_id: undefined,
      remark: '',
      use_hours: undefined,
      connect_id: undefined,
    });
    const MAN_HOUR_BELONG = ref(workingHoursDirection.project);
    const show = (data: any) => {
      formData.value = {
        ...formData.value,
        ...data,
        // start_time: data.start_time ? data.start_time : '09:30',
        // end_time: data.end_time ? data.end_time : '17:00',
        extra_target_id:
          data.man_hour_belong === workingHoursDirection.project ? data.extra_target_id : undefined,
        use_hours: data.hours ? data.hours : undefined,
      };
      MAN_HOUR_BELONG.value = data.man_hour_belong;
      if (data.target_id) {
        defaultExpandedKeys.value = [data.target_id];
      }
    };

    const calculateHourDiff = computed(() => {
      const { start_time, end_time } = formData.value;
      if (start_time && end_time) {
        const start = new Date(`2023-01-01 ${start_time}`);
        const end = new Date(`2023-01-01 ${end_time}`);
        const diff = end.getTime() - start.getTime();
        const hour = diff / 1000 / 60 / 60;
        return hour.toFixed(1);
      }
      return 0;
    });

    /* 根据对接人查询二级部门id */
    const queryGetUserLevelTwoDepartment = useRequest(GetUserLevelTwoDepartment, {
      manual: true,
      transform: (res: any) => {
        if (res.id) {
          formData.value.target_id = res.id;
          defaultExpandedKeys.value = [res.id];
        }
        return res;
      },
    });
    const defaultExpandedKeys = ref<any>([]);
    const changeConnectId = (e: any) => {
      console.log(e, queryGetUserLevelTwoDepartment, 'e');
      queryGetUserLevelTwoDepartment.run({ connect_id: e });
      // formData.value.connect_id = e;
    };
    const hasTargetId = computed(() => {
      if (formData.value.man_hour_belong === workingHoursDirection.project) {
        return formData.value.extra_target_id;
      } else {
        return formData.value.target_id;
      }
    });

    const submit = () => {
      const requiredFields: Record<string, any> = {
        content: '执行内容',
        // end_time: '结束时间',
        // start_time: '开始时间',
        use_hours: '使用工时',
      };

      if (!hasTargetId.value) {
        return ctx.root.$message.error('项目为必填');
      } else {
        const missingFields = Object.entries(requiredFields).filter(
          ([key, value]) => !formData.value[key],
        );
        if (missingFields.length > 0) {
          const missingFieldsMsg = missingFields.map(([key, value]) => `${value}`).join('、 ');
          return ctx.root.$message.error(`${missingFieldsMsg}为必填`);
        }
      }
      // 提交表单
      ctx.emit('submit', {
        ...formData.value,
        target_id:
          formData.value.man_hour_belong === workingHoursDirection.project
            ? formData.value.extra_target_id
            : String(formData.value.target_id),
      });
    };

    return {
      formData,
      calculateHourDiff,
      show,
      submit,
      MAN_HOUR_BELONG,
      changeConnectId,
      defaultExpandedKeys,
    };
  },
  render() {
    const { formData, MAN_HOUR_BELONG } = this;
    console.log(formData, 'formData');
    const defaultOption = () => {
      if (MAN_HOUR_BELONG === workingHoursDirection.project) {
        return [
          {
            label: formData.target_name,
            value: formData.extra_target_id,
          },
        ];
      }
    };
    const defaultConnectOption = () => {
      console.log(formData, 'formData');

      if (formData.connect_id) {
        return [{ label: formData.connect_name, value: formData.connect_id }];
      }
    };

    return (
      <div>
        <div class="addWork_box">
          <div class="mgb-10" style="color: #888888;">
            设计时间：{moment(formData.man_hour_date).format('YYYY.MM.DD')}
          </div>
          <div class="date-box">
            <span>使用工时</span>
            <span>对接人</span>
            {/* <el-time-select
                placeholder="请输入时长"
                v-model={formData.start_time}
                style="width: 100%"
                picker-options={{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                }}
                default-value="09:30"
              ></el-time-select> */}
            <el-input
              style="width: 100%"
              v-model={formData.use_hours}
              // maxlength={20}
              onInput={(e: any) => {
                const IntergerAndDecimals = (value: string) => {
                  const match = /(\d+)$|\d+\.?\d{0,1}/.exec(value);
                  return match ? match[0] : '';
                  // return value.replace(/[^\d.]/g, '').replace(/(\..{2,2}).+/, '$1');
                };
                formData.use_hours = IntergerAndDecimals(e);
              }}
              placeholder="请输入时长*"
            >
              <template slot="append">h</template>
            </el-input>
            <FunctionSelect
              style="width:100%"
              multiple={false}
              modeType={EFunctionSelectType.FLOWER_NAME}
              v-model={formData.connect_id}
              placeholder="请选择对接人"
              clearable={true}
              onChange={(e: any) => this.changeConnectId(e)}
              defaultValue={defaultConnectOption()}
            />
            {/* <el-time-select
                placeholder="请选择对接人"
                v-model={formData.end_time}
                style="width: 100%"
                picker-options={{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                  minTime: formData.start_time,
                }}
              ></el-time-select> */}
          </div>
          <div class="addWork_box_title">项目内容</div>
          <el-form ref="form" model={formData} label-width="0">
            <div class="project_item">
              <el-form-item class="project_item_left">
                {formData.man_hour_belong === workingHoursDirection.project ? (
                  <FunctionSelect
                    style="width: 100%"
                    modeType={EFunctionSelectType.SEARCH_PROJECT}
                    v-model={formData.extra_target_id}
                    placeholder="项目*"
                    defaultValue={defaultOption()}
                    ref="projectSelect"
                    // onChange={(value: any, label: any) => {
                    //   console.log(value, label, 'value');
                    // }}
                  />
                ) : (
                  <department-select
                    style="--default-height: 40px"
                    placeholder="请选择部门*"
                    queryForm={{}}
                    checkOnClickNode={true}
                    defaultExpandedKeys={this.defaultExpandedKeys}
                    // disabledLevel={2}
                    levelDisabled={(level: number) => level !== 2}
                    levelHidden={(level: number) => level > 2}
                    clearable
                    v-model={formData.target_id}
                  />
                )}
              </el-form-item>
              <ButtonGroup
                buttons={department_list}
                v-model={formData.man_hour_belong}
                autoFill={true}
                gap="10px"
                labelStyle="font-weight: 400;font-size: 12px;color:#0A0A0A;"
                onChange={(value: any) => {
                  // nextTick(() => {
                  //   // @ts-ignore
                  //   const select = this.$refs['projectSelect']?.$refs['Select'] as any;
                  //   console.log(select, 'this.$refs.projectSelect');
                  // });
                  if (value === workingHoursDirection.demandSide && !formData.target_name) {
                    formData.extra_target_id = undefined;
                  }
                }}
              />
            </div>
            <el-form-item style="margin-top:10px">
              <el-input
                style="width: 100%"
                v-model={formData.content}
                maxlength={20}
                placeholder="执行内容*"
              ></el-input>
            </el-form-item>
            <el-input
              type="textarea"
              class="textarea"
              placeholder="备注内容"
              maxlength={100}
              autosize={{
                minRows: 4,
              }}
              v-model={formData.remark}
            ></el-input>
          </el-form>
        </div>
        <div class="footer">
          <div></div>
          <div>
            <el-button class="btn" onClick={() => this.$emit('close')}>
              取消
            </el-button>
            <el-button
              disabled={this.isOverwork}
              class="btn"
              type="primary"
              onClick={() => !this.isOverwork && this.submit()}
            >
              确定
            </el-button>
          </div>
        </div>
      </div>
    );
  },
});
