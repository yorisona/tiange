import { defineComponent, ref } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import {
  QueryAssessment_and_evaluation_group,
  QueryNeedImproveUser,
  StartAssessmentImprovePlan,
} from '@/services/performance';
import { Message } from 'element-ui';

export default defineComponent({
  setup(props, ctx) {
    const type = ref('');
    const groupSelected = ref([]);
    const show = (value: string) => {
      type.value = value;
    };

    const formData = ref({
      assessed_ids: [], //被考核人id
      plan_review_deadline: undefined, //计划复盘信息提交截止日期
      plan_submit_deadline: undefined, //计划提交截止日期
      evaluation_group_id: undefined, // 考评组id
      assessment_management_id: undefined, // 考核周期id
    } as any);

    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          if (formData.value.assessed_ids.length === 0) {
            Message.error('请选择被考核人');
            return;
          }
          StartAssessmentImprovePlan(formData.value).then(res => {
            if (res.data.success) {
              Message.success('保存成功');
              ctx.emit('submit');
            } else {
              Message.error(res.data.message);
            }
          });
        }
      });
    };

    const formRef = ref<IFormRef>();

    /* 获取考核周期和考评组 */
    const assessmentCycle = ref<any[]>([]);
    const evaluationGroup = ref<any[]>([]);
    QueryAssessment_and_evaluation_group().then(res => {
      if (res.data.success) {
        assessmentCycle.value = res.data.data.assessment_data.map(
          (item: NPerformance.IAssessment & any, key: number) => {
            item.value = item.id;
            item.label = item.assessment_cycle;
            return item;
          },
        );
        formData.value.assessment_management_id = assessmentCycle.value[0].value;
        evaluationGroup.value = res.data.data.evaluation_group_data.map(
          (item: NPerformance.IEvaluationGroup & any, key: number) => {
            item.value = item.id;
            item.label = item.name;
            return item;
          },
        );
        evaluationGroup.value.unshift({
          value: undefined,
          label: '全部',
        });
        query();
      } else {
        Message.error(res.data.message);
      }
    });
    /* 根据考评周期、考评组获取该周期内的所有绩效为C、D的员工  */
    const groupData = ref<any[]>([]);
    const query = async () => {
      QueryNeedImproveUser(formData.value).then(res => {
        if (res.data.success) {
          groupData.value = res.data.data.data.map((item: any, key: number) => {
            item.key = item.user_id;
            item.label = item.username;
            return item;
          });
          console.log(groupData.value, res.data.data, 'groupData.value');
        } else {
          groupData.value = [];
          Message.error(res.data.message);
        }
      });
    };
    return {
      onSaveBtnClick,
      show,
      formData,
      formRef,
      groupData,
      groupSelected,
      assessmentCycle,
      evaluationGroup,
      query,
    };
  },
  render() {
    const { formData } = this;
    let SLength = 0;
    let noLength = 0;
    const transfer = (
      <el-transfer
        v-model={formData.assessed_ids}
        data={this.groupData}
        filterable={true}
        filter-placeholder={'搜索考评组'}
        button-texts={['回退', '添加']}
        titles={['全选', '全选']}
        format={{
          hasChecked: '已选择：${checked}',
          noChecked: '已选择：0',
        }}
      />
    );
    console.log(this.groupData, this.groupSelected, '1111');
    SLength = this.groupSelected.length;
    noLength = this.groupData.length - SLength;

    return (
      <div class="dialog-container">
        <el-form
          size="mini"
          ref="formRef"
          class="form-box"
          inline={true}
          // hide-required-asterisk={true}
          attrs={{
            model: formData,
          }}
        >
          <div class="header-box">
            <el-form-item
              label="考核周期："
              prop="id"
              // rules={{ required: true, message: '请选择考核周期', trigger: 'change' }}
            >
              <Select
                style={'width:180px'}
                popper-class="el-select-popper-mini"
                placeholder="请选择"
                v-model={formData.assessment_management_id}
                options={this.assessmentCycle}
                clearable={false}
              />
            </el-form-item>
            <el-form-item
              label="考评组："
              prop="id"
              // rules={{ required: true, message: '请选择考评组', trigger: 'change' }}
            >
              <Select
                style={'width:180px'}
                popper-class="el-select-popper-mini"
                placeholder="请选择"
                v-model={formData.evaluation_group_id}
                options={this.evaluationGroup}
                clearable={true}
              />
            </el-form-item>
            <tg-button type="primary" size="mini" onClick={this.query}>
              查询
            </tg-button>
          </div>
          <div class="content">
            <div class="transfer-header">
              <div>未发起绩效改进 ({noLength})</div>
              <div></div>
              <div>发起绩效改进 ({SLength})</div>
            </div>
            <div class="transfer-box">{transfer}</div>
          </div>
          <div class="date-box">
            <el-form-item
              label="计划提交截止日期"
              class="date-picker-item"
              prop="plan_submit_deadline"
              rules={{ required: true, message: '请选择计划提交截止日期', trigger: 'blur' }}
            >
              <el-date-picker
                v-model={formData.plan_submit_deadline}
                value-format={'yyyy-MM-dd'}
                type="date"
                range-separator="~"
                placeholder="请选择日期"
                size="mini"
                style="width: 244px"
                format="yyyy.MM.dd"
                pickerOptions={{
                  disabledDate(time: Date) {
                    return time.getTime() <= Date.now() - 8.64e7;
                  },
                }}
              />
            </el-form-item>
            <el-form-item
              label="计划复盘信息提交截止日期"
              class="date-picker-item"
              prop="plan_review_deadline"
              rules={{ required: true, message: '请选择计划复盘信息提交截止日期', trigger: 'blur' }}
            >
              <el-date-picker
                v-model={formData.plan_review_deadline}
                value-format={'yyyy-MM-dd'}
                type="date"
                range-separator="~"
                placeholder="请选择日期"
                size="mini"
                style="width: 244px"
                format="yyyy.MM.dd"
                pickerOptions={{
                  disabledDate(time: Date) {
                    return time.getTime() <= Date.now() - 8.64e7; //一天的毫秒数
                  },
                }}
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
    );
  },
});
