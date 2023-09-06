import { computed, defineComponent, h, inject, provide, ref } from '@vue/composition-api';
import moment from 'moment';
import dataStatistics from './dataStatistics';
import typographyCalendar from './typographyCalendar.vue';
import { useDialog } from '@/use/dialog';
import addWork from './modules/addWork.vue';
import { save_user_man_hour } from '@/services/design';
import { Message } from 'element-ui';
import { useCalendarConfig } from '@/components/CalendarCustom/use';
import { ECalendarType } from '@/components/CalendarCustom';
// import { useRequest } from '@gm/hooks/ahooks';

const TypesOfWorkingHoursMap = new Map([
  ['项目工时', 'project'],
  ['协作工时', 'collaborative'],
  ['其他工时', 'other'],
  ['加班工时', 'overtime'],
]);
const man_hour_type = new Map([
  [0, '项目工时'],
  [1, '协作工时'],
  [2, '其他工时'],
  [3, '加班工时'],
]);
export default defineComponent({
  components: {
    dataStatistics,
    typographyCalendar,
  },
  setup(props, ctx) {
    const routes: any = [
      {
        name: 'Workbench',
        title: '工作台',
      },
      {
        path: '',
        title: '设计统计',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const config = useCalendarConfig(ECalendarType.Month);

    const monthDate = ref({
      date: moment().format('yyyy-MM'),
      start_date: computed(() => config.startTime.format('YYYY-MM-DD')),
      end_date: computed(() => config.endTime.format('YYYY-MM-DD')),
    });
    const formData = ref<any>({
      man_hour_date: moment().format('yyyy-MM-DD'),
      man_hour_id: undefined,
    }); // 表单数据

    /* 新增工时 */
    const dialogAddWorkTitle = ref('新增工时');
    const dialogAddWork = useDialog({
      component: addWork,
      title: dialogAddWorkTitle.value,
      width: '520px',
      okText: '确定',
      props: {},
      footer: false,
      on: {
        submit(v: Record<string, any>) {
          save_user_man_hour(v).then(res => {
            if (res.data.success) {
              dialogAddWork.close();
              Message.success('操作成功');
              console.log(ctx.refs, 'ctx.refs');
              // @ts-ignore
              ctx.refs.typographyCalendar.init();
              // @ts-ignore
              ctx.refs.dataStatistics.init(monthDate.value);
            } else {
              Message.error(res.data.message);
            }
          });
          console.log(v, 'vvvv');
        },
      },
    });

    provide('searchData', monthDate);
    return {
      formData,
      dialogAddWork,
      monthDate,
      config,
      dialogAddWorkTitle,
    };
  },
  render() {
    const { formData, monthDate } = this;
    return (
      <div class="statistics-box">
        <div class="header-box">
          <el-form size="mini" inline={true} model={monthDate} class="demo-form-inline">
            <el-form-item label="时间：">
              <el-date-picker
                clearable={false}
                style="width: 175px"
                v-model={monthDate.date}
                type="month"
                format="yyyy.MM"
                value-format="yyyy-MM"
                placeholder="选择月"
                onChange={(val: any) => {
                  this.config.changeDate(val);
                }}
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="content_box">
          <div class="content_box__left">
            <div class="content_box__left__top">
              <div class="content_box__left__top__title">新增工时</div>
              <div class="content_box__left__top__wrap">
                {Array.from(TypesOfWorkingHoursMap).map(([key, value], index: number) => (
                  <div
                    onClick={() => {
                      // if (formData.man_hour_date) {
                      this.dialogAddWorkTitle = '新增' + key;
                      this.dialogAddWork
                        .update({ title: this.dialogAddWorkTitle })
                        .show({ ...formData, man_hour_type: index });
                      // } else {
                      //   this.$message.warning('请选择日期');
                      // }
                    }}
                    class={[value, 'content_box__left__top__wrap__item']}
                  >
                    <span>{key}</span>
                    <div class={[value, 'cross']} style={{ backgroundColor: value }}></div>
                  </div>
                ))}
                {/* <div class="content_box__left__top__wrap__item">
                  <span>项目工时</span>
                  <div class="cross"></div>
                </div> */}
              </div>
            </div>
            <div class="content_box__left__bottom">
              <div class="content_box__left__top__title">数据统计</div>
              <dataStatistics ref="dataStatistics" class="content_box__left__top__wrap" />
            </div>
          </div>
          <div class="content_box__right">
            {/* <div class="content_box__right__title">
              <span class="time">{monthDate.date}</span>
              <span>
                已统计工时/总工时：119h/168h &nbsp;
                <span style="color:#888">(加班工时暂不计入总工时)</span>
              </span>
            </div> */}
            <typographyCalendar
              ref="typographyCalendar"
              onOpenWork={(item: any) => {
                if (item.id) {
                  this.dialogAddWorkTitle = `编辑${man_hour_type.get(item.man_hour_type)}`;
                } else {
                  item.man_hour_type
                    ? (this.dialogAddWorkTitle = `新增${man_hour_type.get(item.man_hour_type)}`)
                    : (this.dialogAddWorkTitle = '新增项目工时');
                }
                console.log(item, 'item');

                this.dialogAddWork.update({ title: this.dialogAddWorkTitle }).show(item);
              }}
              onClickDate={(data: Record<string, any>) => {
                this.formData = { ...this.formData, ...data };
              }}
              onChange={() => {
                // @ts-ignore
                this.$refs.dataStatistics.init(this.monthDate);
              }}
            />
          </div>
        </div>
      </div>
    );
  },
});
