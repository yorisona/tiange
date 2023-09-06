import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import {
  Query_Assessment,
  Query_Evaluation_Group,
  Save_Assessment,
  Check_Launch_Assessment,
} from '@/services/performance';
import { usePagination } from '@gm/hooks/ahooks';
import { useDialog } from '@/use/dialog';
import selectEvaluationGroup from '@/modules/performance/assessment/manage/dialog/selectEvaluationGroup/index.vue';
import { ECYCLE_TYPE } from '@/const/performance';
import moment from 'moment';
import DatePickers from '@/components/DatePickers/index.vue';
import { EDatePickerType, TimeToText } from '@/components/DatePickers';
import { Message } from 'element-ui';
import { isEmpty } from '@/utils/func';
import { ElForm } from 'element-ui/types/form';
import { Confirm } from '@/use/asyncConfirm';

interface IFormData {
  selectedAssess: NPerformance.IEvaluationGroup[];
  assessment_cycle_time: any;
  cycle_type: ECYCLE_TYPE;
  user_id_list: NPerformance.IEvaluationPerson[];
  assessment_cycle: string;
  assessment_start_time: string;
  assessment_end_time: string;
  evaluation_group_id_list: number[];
  target_setting_deadline: string;
  confirm_target_deadline: string;
}
export default defineComponent({
  components: {
    DatePickers,
  },
  setup: (_, ctx) => {
    const elFormRef = ref<ElForm | undefined>(undefined);
    const reqEvalation = usePagination(Query_Evaluation_Group);
    const formData = ref<IFormData>({
      selectedAssess: [],
      user_id_list: [],
      assessment_cycle: '',
      assessment_cycle_time: '',
      cycle_type: undefined,
    } as any | IFormData);

    const labelName = ref('考核名称');

    const name = computed(() => {
      const cycle_type = formData.value.cycle_type;
      const assessment_cycle_time = formData.value.assessment_cycle_time;
      if (cycle_type === undefined) return;
      if (assessment_cycle_time) {
        switch (cycle_type) {
          case ECYCLE_TYPE.MONTHLY:
            return moment(assessment_cycle_time).format('YYYY年MM月绩效考核');
          case ECYCLE_TYPE.ANNUAL:
            return moment(assessment_cycle_time).format('YYYY年绩效考核');
          case ECYCLE_TYPE.QUARTERLY:
            return TimeToText(assessment_cycle_time[0], EDatePickerType.QUARTER) + '绩效考核';
          case ECYCLE_TYPE.SEMIANNUA:
            return TimeToText(assessment_cycle_time[0], EDatePickerType.HALF) + '绩效考核';
          default:
            return '';
        }
      }
      return '';
    });
    const groupName = computed(() => {
      const selectedAssess = formData.value.selectedAssess;
      let result = '';
      if (selectedAssess.length === 0) return null;
      for (let i = 0; i < selectedAssess.length; i++) {
        const append = selectedAssess[i].name;
        if (result.length + append.length > 17) {
          if (i <= selectedAssess.length - 1) {
            result += `等${selectedAssess.length}个考评组`;
          }
          break;
        } else {
          if (i > 0) {
            result += '、 ';
          }
          result += append;
        }
      }
      return result;
    });
    watch(
      () => name.value,
      () => {
        if (isEmpty(name.value)) {
          labelName.value = '考核名称';
          return;
        }
        Query_Assessment({ num: 20, page_num: 1 }, { name: name.value }).then(res => {
          labelName.value = res.data.data.total > 0 ? '合并到' : '考核名称';
        });
      },
    );

    const dialogSelectEvaluationGroup = useDialog({
      component: selectEvaluationGroup,
      title: '选择考评组',

      width: '800px',
      on: {
        submit: (value: NPerformance.IEvaluationGroup[]) => {
          // 清空已添加的用户列表
          formData.value.user_id_list = [];
          formData.value.cycle_type = value.length > 0 ? value[0].cycle_type : (undefined as any);
          formData.value.selectedAssess = value;
          value.forEach(item => {
            formData.value.user_id_list.push(...item.by_evaluation_person);
          });
          formData.value.assessment_cycle_time = '';
        },
      },
    });
    const dialogSubmit = () => {
      elFormRef.value?.validate(valid => {
        if (valid) {
          if (formData.value.user_id_list.length === 0) {
            Message.error('请添加考核人员');
            return;
          } else if (!name.value) {
            Message.error('请选择考核周期');
            return;
          }
          const params = {
            ...formData.value,
            name: name.value,
          };
          let assessment_cycle_time = formData.value.assessment_cycle_time;
          params.evaluation_group_id_list = formData.value.selectedAssess.map(it => it.id);
          switch (params.cycle_type) {
            case ECYCLE_TYPE.MONTHLY:
              assessment_cycle_time = moment(assessment_cycle_time);
              params.assessment_cycle = assessment_cycle_time.format('YYYY年MM月');
              params.assessment_start_time = assessment_cycle_time.format('YYYY-MM-DD HH:mm:ss');
              params.assessment_end_time = assessment_cycle_time
                .endOf('month')
                .format('YYYY-MM-DD HH:mm:ss');
              break;
            case ECYCLE_TYPE.ANNUAL:
              assessment_cycle_time = moment(assessment_cycle_time);
              params.assessment_cycle = assessment_cycle_time.format('YYYY年');
              params.assessment_start_time = assessment_cycle_time.format('YYYY-MM-DD HH:mm:ss');
              params.assessment_end_time = assessment_cycle_time
                .endOf('year')
                .format('YYYY-MM-DD HH:mm:ss');
              break;
            case ECYCLE_TYPE.QUARTERLY:
              params.assessment_start_time = assessment_cycle_time[0];
              params.assessment_end_time = assessment_cycle_time[1];
              assessment_cycle_time = moment(params.assessment_start_time);
              params.assessment_cycle = TimeToText(
                params.assessment_start_time,
                EDatePickerType.QUARTER,
              );
              break;
            case ECYCLE_TYPE.SEMIANNUA:
              params.assessment_start_time = assessment_cycle_time[0];
              params.assessment_end_time = assessment_cycle_time[1];
              assessment_cycle_time = moment(params.assessment_start_time);
              params.assessment_cycle = TimeToText(
                params.assessment_start_time,
                EDatePickerType.HALF,
              );
              break;
          }
          params.user_id_list = params.user_id_list.map(it => it.user_id) as any;
          const saveAssessment = () => {
            Save_Assessment(params).then(res => {
              if (!res.data.success) return Message.error(res.data.message);
              Message.success('发起成功');
              ctx.emit('close');
              ctx.emit('submit');
            });
          };
          Check_Launch_Assessment(params).then(res => {
            if (res.data.data.is_checked) {
              const name = res.data.data.data.map((it: any) => it.username).join('、');
              Confirm({
                title: undefined as any,
                content: `${name}已发起过该考核周期的考核，是否删除原考核表？`,
              })
                .then(() => {
                  saveAssessment();
                })
                .catch(() => new Promise(() => {}));
            } else {
              saveAssessment();
            }
          });
        }
      });
    };
    return {
      reqEvalation,
      formData,
      dialogSelectEvaluationGroup,
      name,
      dialogSubmit,
      labelName,
      groupName,
      elFormRef,
    };
  },
  render() {
    const { formData } = this;

    let cycleTypeComp;
    switch (formData.cycle_type) {
      case ECYCLE_TYPE.MONTHLY:
        cycleTypeComp = (
          <el-date-picker
            type="month"
            placeholder="请选择考核周期"
            v-model={formData.assessment_cycle_time}
            style="width:100%"
          />
        );
        break;
      case ECYCLE_TYPE.QUARTERLY:
        cycleTypeComp = (
          <date-pickers
            placeholder="请选择考核周期"
            type="quarter"
            v-model={formData.assessment_cycle_time}
            style="width:100%"
          />
        );
        break;
      case ECYCLE_TYPE.SEMIANNUA:
        cycleTypeComp = (
          <date-pickers
            placeholder="请选择考核周期"
            type="half"
            v-model={formData.assessment_cycle_time}
            style="width:100%"
          />
        );
        break;
      case ECYCLE_TYPE.ANNUAL:
        cycleTypeComp = (
          <el-date-picker
            type="year"
            placeholder="请选择考核周期"
            v-model={this.formData.assessment_cycle_time}
            style="width:100%"
          />
        );
        break;
      default:
        cycleTypeComp = (
          <el-date-picker placeholder="请选择考核周期" disabled={true} style="width:100%" />
        );
        break;
    }
    return (
      <div class="launch-container">
        <el-form ref="elFormRef" size="mini" label-position="top" attrs={{ model: this.formData }}>
          <el-form-item label="考评组">
            <div
              onClick={() => {
                this.dialogSelectEvaluationGroup.show(formData.selectedAssess);
              }}
            >
              <el-input
                placeholder="请选择考评组"
                readonly
                style="width:100%"
                value={this.groupName}
              />
            </div>
          </el-form-item>
          <el-form-item label="考核周期">{cycleTypeComp}</el-form-item>
          <el-form-item label={this.labelName}>
            <el-input disabled value={this.name} />
          </el-form-item>
          <el-form-item
            label="制定目标截止日期"
            prop="target_setting_deadline"
            rules={{ required: true, message: '请选择制定目标截止日期' }}
          >
            <el-date-picker
              editable={false}
              clearable={false}
              v-model={formData.target_setting_deadline}
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy.MM.dd"
              style="width: 100%"
              pickerOptions={{
                disabledDate(time: Date) {
                  return time.getTime() <= Date.now() - 8.64e7;
                },
              }}
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="确认目标截止日期"
            prop="confirm_target_deadline"
            rules={{ required: true, message: '请选择确认目标截止日期' }}
          >
            <el-date-picker
              editable={false}
              clearable={false}
              v-model={formData.confirm_target_deadline}
              type="date"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy.MM.dd"
              style="width: 100%"
              pickerOptions={{
                disabledDate(time: Date) {
                  return time.getTime() <= Date.now() - 8.64e7;
                },
              }}
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
