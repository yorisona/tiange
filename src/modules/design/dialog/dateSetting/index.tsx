import { Query_Appointment_Date, Set_Appointment_Date } from '@/services/design';
import { computed, defineComponent, nextTick, ref, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

interface FormDataType {
  appointment_date: string | undefined;
  appointment_time_list: string[] | undefined;
}

export default defineComponent({
  setup(props, ctx) {
    const loading = ref(false);
    const timeList = ref<{ label: string; disabled: boolean; notAllow: boolean }[]>([]);
    const checkAll = computed(
      () =>
        (formData.value.appointment_time_list?.length || 0) > 0 &&
        formData.value.appointment_time_list?.length ===
          timeList.value.filter(el => !el.notAllow || (el.disabled && el.notAllow)).length,
    );
    const isIndeterminate = computed(
      () =>
        !checkAll.value &&
        (formData.value.appointment_time_list?.length ?? 0) > 0 &&
        !formData.value.appointment_time_list?.every(el =>
          timeList.value.find(subEl => subEl.label === el && subEl.notAllow),
        ),
    );
    const formData = ref<FormDataType>({
      appointment_date: undefined,
      appointment_time_list: [],
    });
    const formRef = ref<ElForm | undefined>(undefined);
    // const appointmentDate = ref<any[]>([]);
    const methods = {
      show() {},
      onSaveBtnClick() {
        formRef.value?.validate(valid => {
          if (valid) {
            methods.setAppointmentDate();
          }
        });
      },
      async setAppointmentDate() {
        loading.value = true;
        const res = await Set_Appointment_Date({
          appointment_time_list: formData.value.appointment_time_list || [],
          appointment_date: formData.value.appointment_date || '',
        });
        loading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          ctx.emit('submit');
          ctx.emit('close');
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async queryAppointmentDate() {
        if (!formData.value.appointment_date) {
          return;
        }
        const res = await Query_Appointment_Date({
          appointment_date: formData.value.appointment_date,
        });
        if (res.data.success) {
          timeList.value = (res.data.data || []).map(el => ({
            label: el.label,
            disabled: el.disabled,
            notAllow: methods.timeOptionDisabled(el.label),
          }));
          formData.value.appointment_time_list =
            timeList.value.filter(el => el.disabled).map(el => el.label) || [];
          // appointmentDate.value = res.data.data;
        } else {
          formData.value.appointment_time_list = [];
          ctx.root.$message.error(res.data.message);
        }
        nextTick(() => {
          formRef.value?.clearValidate();
        });
      },
      timeOptionDisabled(timeStr: string) {
        const [_, end_time] = timeStr.split('-');
        const optionMoment = moment(`${formData.value.appointment_date} ${end_time}`);
        return !optionMoment.isAfter(moment());
      },
      pickerOptions: {
        disabledDate: (time: any) => {
          return moment(time).isBefore(moment(), 'day');
        },
      },
    };
    watch(
      () => formData.value.appointment_date,
      newVal => {
        if (newVal) {
          methods.queryAppointmentDate();
        }
      },
    );
    return {
      loading,
      timeList,
      isIndeterminate,
      checkAll,
      formData,
      formRef,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-date-setting-container">
        <div class="message">
          <tg-icon name="ico-warn"></tg-icon>
          <span>预约日期关闭后，预约人将无法发起该日期的预约。</span>
        </div>
        <el-form
          size="small"
          ref="formRef"
          label-width="92px"
          attrs={{
            model: this.formData,
          }}
        >
          <el-form-item
            label="关闭预约日期："
            prop="appointment_date"
            rules={{ required: true, message: '请选择关闭预约日期', trigger: ['change'] }}
          >
            <el-date-picker
              editable={false}
              clearable={false}
              style="width: 100%"
              v-model={this.formData.appointment_date}
              type="date"
              placeholder="请选择日期"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              picker-options={this.pickerOptions}
            ></el-date-picker>
          </el-form-item>
          {this.timeList.length > 0 && (
            <el-form-item
              class="flex-item"
              label="关闭预约时段："
              prop="appointment_time_list"
              // rules={{ required: true, message: '请选择关闭预约时段', trigger: ['change'] }}
            >
              <el-checkbox
                // disabled={!this.formData.appointment_date}
                indeterminate={this.isIndeterminate}
                v-model={this.checkAll}
                on-change={() => {
                  if (this.checkAll) {
                    this.formData.appointment_time_list = this.timeList
                      .filter(el => el.disabled && el.notAllow)
                      .map(el => el.label);
                  } else {
                    this.formData.appointment_time_list = this.timeList
                      .filter(el => !el.notAllow || (el.disabled && el.notAllow))
                      .map(el => el.label);
                  }
                }}
              >
                全天
              </el-checkbox>
              <el-checkbox-group v-model={this.formData.appointment_time_list}>
                {this.timeList.map(el => (
                  <el-checkbox
                    // disabled={!this.formData.appointment_date}
                    disabled={el.notAllow}
                    style="margin-top: 4px;"
                    label={el.label}
                    key={el.label}
                  >
                    {el.label}
                  </el-checkbox>
                ))}
              </el-checkbox-group>
              {/* <el-select
                style="width: 100%"
                v-model={this.formData.times}
                multiple
                collapse-tags
                placeholder="请选择时段"
              >
                {E.design.AppointmentTimeIntervalOption.map(el => (
                  <el-option key={el.value} label={el.label} value={el.value}></el-option>
                ))}
              </el-select> */}
            </el-form-item>
          )}
        </el-form>
        <tg-mask-loading visible={this.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
