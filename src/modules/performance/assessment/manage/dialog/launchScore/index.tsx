import { defineComponent, ref, reactive } from '@vue/composition-api';
import { Modify_Start_Score, Query_Assessment_By_Id } from '@/services/performance';
import { Message } from 'element-ui';
import { Confirm } from '@/use/asyncConfirm';
import { ElForm } from 'element-ui/types/form';

export default defineComponent({
  setup: (_, ctx) => {
    const tabs = reactive({
      tabs: [
        {
          label: '按考评组',
          value: 'group',
        },
        {
          label: '按单个员工',
          value: 'people',
        },
      ],
      active: 'group',
    });
    const groupData = ref<any[]>([]);
    const groupSelected = ref([]);

    const userData = ref<any[]>([]);
    const userSelected = ref([]);
    const assessment_management_id = ref<number>();
    const formData = ref<{
      self_evaluation_deadline: string;
      superior_rating_deadline: string;
      sign_confirm_deadline: string;
    }>({
      self_evaluation_deadline: '',
      superior_rating_deadline: '',
      sign_confirm_deadline: '',
    });
    const elFormRef = ref<ElForm | undefined>(undefined);

    const show = (id: number) => {
      assessment_management_id.value = id;
      Query_Assessment_By_Id(id).then(res => {
        if (res.data.success) {
          groupData.value = res.data.data.evaluation_group_list.map(
            (item: NPerformance.IEvaluationGroup & any, key) => {
              item.key = item.id;
              item.label = item.name;
              return item;
            },
          );
          res.data.data.evaluation_group_list.forEach(item => {
            item.by_evaluation_person.forEach(person => {
              userData.value.push({
                key: person.user_id,
                label: `${person.username}(${person.real_name})`,
                id: person.user_id,
                username: person.username,
                real_name: person.real_name,
              });
            });
          });
        }
      });
    };

    const dialogSubmit = () => {
      elFormRef.value?.validate(valid => {
        if (valid) {
          const params: TG.ParameterFirst<typeof Modify_Start_Score> = {
            assessment_management_id: assessment_management_id.value as number,
            evaluation_group_id_list: [] as number[],
            user_id_list: [] as number[],
            self_evaluation_deadline: formData.value.self_evaluation_deadline,
            superior_rating_deadline: formData.value.superior_rating_deadline,
            sign_confirm_deadline: formData.value.sign_confirm_deadline,
          };
          if (tabs.active === 'group') {
            if (groupSelected.value.length === 0) {
              return Message.error('还未选择考评组');
            }
            params.evaluation_group_id_list = groupSelected.value;
          } else {
            if (userSelected.value.length === 0) {
              return Message.error('还未选择员工');
            }
            params.user_id_list = userSelected.value;
          }
          Modify_Start_Score(params).then(res => {
            if (res.data.success) {
              Message.success('发起成功');
              ctx.emit('close');
              ctx.emit('submit');
            } else {
              Message.error(res.data.message);
            }
          });
        }
      });
    };
    return {
      formData,
      elFormRef,
      tabs,
      groupData,
      groupSelected,
      userData,
      userSelected,
      dialogSubmit,
      show,
    };
  },
  render() {
    let transfer: any;
    let SLength = 0;
    let noLength = 0;
    switch (this.tabs.active) {
      case 'group':
        transfer = (
          <el-transfer
            v-model={this.groupSelected}
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
        break;
      case 'people':
        transfer = (
          <el-transfer
            v-model={this.userSelected}
            data={this.userData}
            filterable={true}
            filter-placeholder={'搜索员工'}
            button-texts={['回退', '添加']}
            titles={['全选', '全选']}
            format={{
              hasChecked: '已选择：${checked}',
              noChecked: '已选择：0',
            }}
          />
        );
        SLength = this.userSelected.length;
        noLength = this.userData.length - SLength;
        break;
      default:
        break;
    }

    return (
      <div class="launch-container">
        <tg-tabs
          tabs={this.tabs.tabs}
          value={this.tabs.active}
          onInput={async (val: any) => {
            if (SLength > 0) {
              await Confirm('切换选人方式，当前已选中的会被清除');
            }
            this.groupSelected = [];
            this.userSelected = [];
            this.tabs.active = val;
          }}
        />
        <div class="content">
          <div class="transfer-header">
            <div>未发起评分 ({noLength})</div>
            <div></div>
            <div>发起评分 ({SLength})</div>
          </div>
          <div class="transfer-box">{transfer}</div>
        </div>
        <el-form
          class="launch-score-form"
          ref="elFormRef"
          size="small"
          attrs={{ model: this.formData }}
        >
          <el-form-item
            label="自评截止日期"
            prop="self_evaluation_deadline"
            rules={{ required: true, message: '请选择自评截止日期' }}
          >
            <el-date-picker
              size="mini"
              editable={false}
              clearable={false}
              v-model={this.formData.self_evaluation_deadline}
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
            />
          </el-form-item>
          <el-form-item
            label="上级评分截止日期"
            prop="superior_rating_deadline"
            rules={{ required: true, message: '请选择上级评分截止日期' }}
          >
            <el-date-picker
              size="mini"
              editable={false}
              clearable={false}
              v-model={this.formData.superior_rating_deadline}
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
            />
          </el-form-item>
          <el-form-item
            label="签字确认截止日期"
            prop="sign_confirm_deadline"
            rules={{ required: true, message: '请选择签字确认截止日期' }}
          >
            <el-date-picker
              size="mini"
              editable={false}
              clearable={false}
              v-model={this.formData.sign_confirm_deadline}
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
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
