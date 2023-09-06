import { ref, defineComponent, h } from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import projectDaily from '@/modules/datacenter/shoplive/tabs/projectDailyDetail/index.vue';
import moment from 'moment';
import capsuleGroup from '@/components/Button/capsuleGroup';

enum DateType {
  date = 0,
  week = 1,
  month = 2,
}
// const DateTypeMap = {
//   [DateType.week]: 'week',
//   [DateType.month]: 'month',
//   [DateType.day]: '自定义',
// };

export default defineComponent({
  components: {
    projectDaily,
    capsuleGroup,
  },
  setup(props, ctx) {
    // 时间区间
    const dateType = ref(DateType.week);
    const dateTime = ref<string | string[]>(moment().format('YYYY-MM-DD'));
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const methods = {
      getRangeDate(date: string | string[]) {
        if (dateType.value === DateType.week) {
          return (
            moment(date).startOf('week').format('YYYY.MM.DD') +
            '-' +
            moment(date).endOf('week').format('YYYY.MM.DD')
          );
        } else {
          return (
            moment(date).startOf('month').format('YYYY.MM.DD') +
            '-' +
            moment(date).endOf('month').format('YYYY.MM.DD')
          );
        }
      },
    };
    const projectDailyRef = ref<any>(null);
    return {
      dateType,
      project_id,
      dateTime,
      projectDailyRef,
      ...methods,
    };
  },
  render() {
    const { project_id } = this;

    const dateBar = (
      <div class="date-box">
        <capsule-group
          v-model={this.dateType}
          options={[
            { label: '日', value: DateType.date },
            { label: '周', value: DateType.week },
            { label: '月', value: DateType.month },
          ]}
          onChange={this.changeDateType}
        />
        <el-date-picker
          key={'syb' + this.dateType}
          v-model={this.dateTime}
          class="mgl-16"
          style="width: 270px;"
          type={
            this.dateType === DateType.week
              ? 'week'
              : this.dateType === DateType.month
              ? 'month'
              : 'date'
          }
          format={
            this.dateType === DateType.week
              ? `yyyy第WW周 (${this.getRangeDate(this.dateTime)})`
              : this.dateType === DateType.month
              ? `yyyy年MM月 (${this.getRangeDate(this.dateTime)})`
              : 'yyyy年MM月dd日'
          }
          picker-options={{
            disabledDate: (current: any) => {
              const end = moment();
              return current.valueOf() > end.valueOf();
            },
          }}
          size="small"
          // placeholder={formData.type === 1 ? '选择年' : '选择月'}
          clearable={false}
        />
      </div>
    );
    return (
      <div class="projectDaily-wrap">
        <div class="date-wrap">
          {dateBar}
          <tg-button
            style="margin-left: auto;"
            onClick={() => {
              console.log(this.projectDailyRef, 'projectDailyRef');
              this.projectDailyRef.onExport();
            }}
          >
            导出明细
          </tg-button>
        </div>
        <div class="bar"></div>
        <div class="projectDaily">
          <projectDaily
            ref="projectDailyRef"
            selectDate={moment(this.dateTime)}
            analyseType={DateType[this.dateType]}
            projectId={project_id}
            is_from_project={true}
          >
            <div></div>
          </projectDaily>
        </div>
      </div>
    );
  },
});
