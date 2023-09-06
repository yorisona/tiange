/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-23 09:45:54
 */
import { RouterDataCenter } from '@/const/router';
import {
  defineComponent,
  onBeforeMount,
  ref,
  computed,
  watchEffect,
  onActivated,
  onDeactivated,
  PropType,
  // onMounted,
  // onUnmounted,
} from '@vue/composition-api';
import { CTRQueryForm, TrendCycleType } from './type';
import TrendChart from '@/modules/datacenter/ctr/components/projectTrendChart/index.vue';
import moment from 'moment';
import { QueryCTRProjects, QueryShopLiveStatisticalTrends } from '@/services/datacenter';
import {
  CTRProject,
  ShopLiveStatisticalTrendsModel,
  ShopLiveStatisticalTrendsParam,
} from '@/types/tiange/datacenter';
import { ElDatePicker } from 'element-ui/types/date-picker';
import ChangeTip from '@/modules/datacenter/ctr/components/changeTip/index.vue';
import hardcover from '@/assets/img/datacenter/hardcover.png';
import lighting from '@/assets/img/datacenter/lighting.png';
import seat from '@/assets/img/datacenter/seat.png';
import display from '@/assets/img/datacenter/display.png';
import patch from '@/assets/img/datacenter/patch.png';
import tint from '@/assets/img/datacenter/tint.png';
import { RecycleScroller } from 'vue-virtual-scroller';
import { Canceler } from 'axios';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

enum DateRange {
  custom,
  early7,
  early30,
}

export const ChartComponent = defineComponent({
  props: {
    index: {
      type: Number,
    },
    item: {
      type: Object as PropType<ShopLiveStatisticalTrendsModel>,
      default: () => {},
    },
    active: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    TrendChart,
    ChangeTip,
  },
  setup(props, ctx) {
    const tipImg = [hardcover, lighting, seat, display, patch, tint];
    const trendVisible = ref(false);
    // let intersectionObserver: IntersectionObserver | undefined = undefined;
    const methods = {
      chartDate(project_data: ShopLiveStatisticalTrendsModel) {
        return (project_data.data_list ?? []).map(live => {
          if (live.statistics_cycle === 1) {
            const date = moment(live.start_date).format('MM.DD');
            return date;
          } else if (live.statistics_cycle === 2) {
            const date = moment(live.start_date).format('yyyy 第 ww 周');
            return date;
          } else if (live.statistics_cycle === 3) {
            const date = moment(live.start_date).format('yyyy.MM');
            return date;
          }
        });
      },
      onDetail() {
        const project_id = props.item.project_id;
        ctx.root.$router.push({
          name: RouterDataCenter.ctrDataAnalysisDetail,
          params: { id: `${project_id}` },
        });
      },
      tipsData(live: ShopLiveStatisticalTrendsModel) {
        const changeTips: any[] = [];
        (live.data_list ?? []).forEach((el, elIndex) => {
          (el.change_tips ?? []).forEach((tip, tipIndex) => {
            changeTips.push({
              coord: [elIndex, 0],
              name: `${tip.change_tip}`,
              value: tip.change_tip,
              symbolOffset: [0, -10 * tipIndex - 7],
              symbol: `image://${tipImg[tip.change_tip - 1]}`,
            });
          });
        });
        return changeTips.reverse();
      },
    };

    // onMounted(() => {
    //   const projectCtrDom = document.querySelector('.project-ctr');
    //   const ctrChart = document.querySelector(`.ctr-chart-${props.index}`);
    //   debugger;
    //   if (!ctrChart) return;
    //   intersectionObserver = new IntersectionObserver(
    //     (entries: any[]) => {
    //       entries.forEach(item => {
    //         if (item.isIntersecting) {
    //           trendVisible.value = true;
    //           console.log(props.index, '可见');
    //         } else {
    //           trendVisible.value = false;
    //           console.log(props.index, '不可见');
    //         }
    //       });
    //     },
    //     {
    //       root: projectCtrDom,
    //     },
    //   );
    //   // console.log({
    //   //   projectCtrDom,
    //   // });
    //   // console.log(trendChartRef.value.$el);
    //   intersectionObserver.observe(ctrChart);
    // });

    // onUnmounted(() => {
    //   intersectionObserver?.disconnect();
    // });

    return {
      trendVisible,
      ...methods,
    };
  },
  render() {
    const { item: el, index, active } = this;
    return (
      <div
        class={`ctr-chart ctr-chart-${index}`}
        // style={index === 0 ? '' : 'margin-top: 24px;'}
        // key={`${JSON.stringify(el.data_list ?? '')}-${index}`}
        key={`${el.project_id}-${el.start_date}-${el.end_date}`}
      >
        <div style="padding-left: 30px;">
          <span style="font-weight: 600;">{el.project_name ?? '--'}</span>
          <tg-button type="link" class="mgl-12" on-click={() => this.onDetail()}>
            查看详情
          </tg-button>
        </div>
        {active && (
          <trendChart
            class="mgt-12"
            index={index}
            percentage={true}
            originDataList={el.data_list ?? []}
            date={this.chartDate(el)}
            list={[
              {
                name: '进入率 (人数)',
                type: 'line',
                smooth: true,
                data: (el.data_list ?? []).map(live => live.exposure_watch_ucnt_ratio),
                markPoint: {
                  symbolSize: [12, 17],
                  label: {
                    show: false,
                  },
                  data: this.tipsData(el),
                },
              },
              {
                name: '进入率 (人次)',
                type: 'line',
                smooth: true,
                data: (el.data_list ?? []).map(live => live.exposure_watch_times_ratio),
                markPoint: {
                  symbolSize: [12, 17],
                  label: {
                    show: false,
                  },
                  data: this.tipsData(el),
                },
              },
              {
                name: '直播销售额 (元)',
                type: 'line',
                smooth: true,
                data: (el.data_list ?? []).map(live => live.sum_gmv),
                yAxisIndex: 1,
                markPoint: {
                  // symbol: (value: any, params: Object) => {
                  //   return`image://${this.hardcover}`
                  // },
                  symbolSize: [12, 17],
                  label: {
                    show: false,
                    // formatter:'{c}%'
                  },
                  data: this.tipsData(el),
                },
              },
            ]}
          ></trendChart>
        )}
        {(el.data_list ?? []).length > 0 && this.trendVisible && (
          <change-tip style="position: absolute; left: 530px; bottom: 30px;"></change-tip>
        )}
      </div>
    );
  },
});

export default defineComponent({
  components: {
    RecycleScroller,
    ChartComponent,
  },
  setup(props, ctx) {
    const date_format = 'yyyy-MM-DD';
    const early_seven_days = () => {
      const end_moment = moment().subtract(1, 'day');
      const start_moment = end_moment.clone().subtract(6, 'day');
      return [start_moment.format(date_format), end_moment.format(date_format)];
    };

    const early_30_days = () => {
      const end_moment = moment().subtract(1, 'day');
      const start_moment = end_moment.clone().subtract(29, 'day');
      return [start_moment.format(date_format), end_moment.format(date_format)];
    };

    const early_12_month = () => {
      const month_format = 'yyyy-MM-DD';
      const end_moment = moment().subtract(1, 'month').endOf('month');
      const start_moment = end_moment.clone().subtract(11, 'month').startOf('month');
      return [start_moment.format(month_format), end_moment.format(month_format)];
    };
    const early_10_week = () => {
      const week_format = 'yyyy-MM-DD';
      const end_moment = moment().subtract(1, 'weeks').endOf('week');
      const start_moment = end_moment.clone().subtract(9, 'weeks').startOf('week');
      return [start_moment.format(week_format), end_moment.format(week_format)];
    };

    const initForm = (): CTRQueryForm => {
      return {
        project_ids: [],
        trend_cycle: 'day',
        dates: early_seven_days(),
      };
    };

    // const paginationForm = ref<PaginationParams>({
    //   num: 10,
    //   page_num: 1,
    // });

    const queryForm = ref<CTRQueryForm>(initForm());

    const shouldShow = ref(true);

    const loading = ref(false);

    const projectList = ref<CTRProject[]>([]);

    const ctrProjectTrendData = ref<ShopLiveStatisticalTrendsModel[]>([]);
    const filterCtrProjectTrendDataList = computed(
      () => ctrProjectTrendData.value,
      // ctrProjectTrendData.value.filter((el, index) => {
      //   return index < (paginationForm.value.num ?? 0) * (paginationForm.value.page_num ?? 0);
      // }),
    );
    const startWeekPickerRef = ref<ElDatePicker | undefined>(undefined);
    const endWeekPickerRef = ref<ElDatePicker | undefined>(undefined);
    const dateRange = ref(DateRange.early7);
    const week_cycle = ref<{
      start_week: string | undefined;
      end_week: string | undefined;
    }>({
      start_week: undefined,
      end_week: undefined,
    });
    let reqCanceler: Canceler | undefined;
    const methods = {
      onTrendCycle(trendCycle: TrendCycleType) {
        queryForm.value.trend_cycle = trendCycle;
        if (trendCycle === 'day') {
          // queryForm.value.dates = early_seven_days()
          methods.onEarlySevenDays();
        } else if (trendCycle === 'week') {
          const [start, end] = early_10_week();
          week_cycle.value.start_week = start;
          week_cycle.value.end_week = end;
          methods.onEndWeekBlurred();
        } else if (trendCycle === 'month') {
          queryForm.value.dates = early_12_month();
        }
      },
      // onDetail(index: number) {
      //   const project_id = ctrProjectTrendData.value[index].project_id;
      //   ctx.root.$router.push({
      //     name: RouterDataCenter.ctrDataAnalysisDetail,
      //     params: { id: `${project_id}` },
      //   });
      // },
      onEarlySevenDays() {
        dateRange.value = DateRange.early7;
        queryForm.value.dates = early_seven_days();
      },
      onEarlyOnMonthDays() {
        dateRange.value = DateRange.early30;
        queryForm.value.dates = early_30_days();
      },
      onDateChange() {
        dateRange.value = DateRange.custom;
      },
      async queryCTRProjects() {
        const res = await QueryCTRProjects();
        if (res.data.success) {
          projectList.value = res.data.data;
        }
      },
      cancelPrevRequest() {
        reqCanceler?.();
        loading.value = false;
      },
      async queryShopLiveStatisticalTrends(params: ShopLiveStatisticalTrendsParam) {
        methods.cancelPrevRequest();
        loading.value = true;
        const res = await QueryShopLiveStatisticalTrends(params, canceler => {
          reqCanceler = canceler;
        });
        loading.value = false;
        if (res.data.success) {
          // ert4t
          ctrProjectTrendData.value = res.data.data;
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，清稍后重试');
        }
      },
      onStartWeekChanged() {
        week_cycle.value.end_week = undefined;
        endWeekPickerRef.value?.focus();
      },
      onEndWeekBlurred() {
        if (!week_cycle.value.start_week || !week_cycle.value.end_week) {
          week_cycle.value = {
            start_week: queryForm.value.dates[0],
            end_week: queryForm.value.dates[1],
          };
          return;
        }
        const startWeekMoment = moment(week_cycle.value.start_week);
        const endWeekMoment = moment(week_cycle.value.end_week);
        if (startWeekMoment.isAfter(endWeekMoment)) {
          const tempMoment = week_cycle.value.start_week;
          week_cycle.value.start_week = week_cycle.value.end_week;
          week_cycle.value.end_week = tempMoment;
        }
        queryForm.value.dates = [week_cycle.value.start_week, week_cycle.value.end_week];
      },
      // chartDate(project_data: ShopLiveStatisticalTrendsModel) {
      //   return (project_data.data_list ?? []).map(live => {
      //     if (live.statistics_cycle === 1) {
      //       const date = moment(live.start_date).format('MM.DD');
      //       return date;
      //     } else if (live.statistics_cycle === 2) {
      //       const date = moment(live.start_date).format('yyyy 第 ww 周');
      //       return date;
      //     } else if (live.statistics_cycle === 3) {
      //       const date = moment(live.start_date).format('yyyy.MM');
      //       return date;
      //     }
      //   });
      // },
      reload() {
        const query_dates = () => {
          const date_format = 'yyyy-MM-DD';
          let temp_dates: string[] = [];
          const [start_date, end_date] = queryForm.value.dates;
          if (queryForm.value.trend_cycle === 'day') {
            temp_dates = [start_date, end_date];
          } else if (queryForm.value.trend_cycle === 'week') {
            temp_dates = [
              moment(start_date).startOf('week').format(date_format),
              moment(end_date).endOf('week').format(date_format),
            ];
          } else if (queryForm.value.trend_cycle === 'month') {
            temp_dates = [
              moment(start_date).startOf('month').format(date_format),
              moment(end_date).endOf('month').format(date_format),
            ];
          }
          return temp_dates;
        };

        if ((queryForm.value.project_ids?.length ?? 0) === 0) {
          methods.cancelPrevRequest();
          ctrProjectTrendData.value = [];
          return;
        }
        const [start_date, end_date] = query_dates();
        const params = {
          project_ids: queryForm.value.project_ids?.join(','),
          statistics_cycle:
            queryForm.value.trend_cycle === 'day'
              ? 1
              : queryForm.value.trend_cycle === 'week'
              ? 2
              : 3,
          start_date,
          end_date,
        };
        methods.queryShopLiveStatisticalTrends(params);
      },
      // async loadLocalMoreData(event: any) {
      //   const target = event.target;
      //   const scrollTop = target.scrollTop;
      //   const windowHeight = target.clientHeight;
      //   const scrollHeight = target.scrollHeight;
      //   console.log({
      //     scrollTop,
      //     windowHeight,
      //     sum: scrollTop + windowHeight,
      //     scrollHeight,
      //   });
      //   // 滚动条的总高度
      //   // 滚动条到底部
      //   if (scrollTop + windowHeight === scrollHeight) {
      //     if (ctrProjectTrendData.value.length <= filterCtrProjectTrendDataList.value.length) {
      //       return;
      //     }
      //     loading.value = true;

      //     setTimeout(async () => {
      //       if (paginationForm.value.page_num) {
      //         paginationForm.value.page_num += 1;
      //       }
      //       loading.value = false;
      //     }, 300);
      //   }
      // },
      onAllProject(selected: boolean) {
        if (selected) {
          queryForm.value.project_ids = projectList.value.map(el => el.project_id);
        } else {
          setTimeout(() => {
            queryForm.value.project_ids = [];
          }, 0);
        }
      },
    };

    onBeforeMount(async () => {
      await methods.queryCTRProjects();
      // await methods.queryCTRDatas()
    });
    const projectListRef = ref<HTMLElement | undefined>(undefined);
    // watchEffect(() => {
    // projectListRef.value?.addEventListener('scroll', methods.loadLocalMoreData);
    // });

    watchEffect(() => {
      queryForm.value.project_ids = projectList.value.map(el => el.project_id);
    });

    watchEffect(() => {
      methods.reload();
    });
    const pickDate = ref<Date | undefined>(undefined);
    const dayPickerOptions = {
      onPick({ maxDate, minDate }: { maxDate: Date; minDate: Date }) {
        if (!maxDate) {
          pickDate.value = minDate;
        } else {
          pickDate.value = undefined;
        }
      },
      disabledDate(date: Date) {
        if (!pickDate.value) {
          return false;
        }
        const pickMoment = moment(pickDate.value);
        const dateMoment = moment(date);
        const minMoment = pickMoment.clone().subtract(29, 'day');
        const maxMoment = pickMoment.clone().add(29, 'day');
        if (dateMoment.isBefore(minMoment) || dateMoment.isAfter(maxMoment)) {
          return true;
        }
        return false;
      },
    };

    const pickMonth = ref<Date | undefined>(undefined);
    const monthPickerOptions = {
      onPick({ maxDate, minDate }: { maxDate: Date; minDate: Date }) {
        if (!maxDate) {
          pickMonth.value = minDate;
        } else {
          pickMonth.value = undefined;
        }
      },
      disabledDate(date: Date) {
        if (!pickMonth.value) {
          return false;
        }
        const pickMoment = moment(pickMonth.value);
        const dateMoment = moment(date);
        const minMoment = pickMoment.clone().subtract(11, 'month');
        const maxMoment = pickMoment.clone().add(11, 'month');
        if (dateMoment.isBefore(minMoment, 'month') || dateMoment.isAfter(maxMoment, 'month')) {
          return true;
        }
        return false;
      },
    };

    // const pickWeek = ref<Date| undefined>(undefined);
    const weekhPickerOptions = {
      disabledDate(date: Date) {
        if (!week_cycle.value.start_week) {
          return false;
        }
        const pickMoment = moment(week_cycle.value.start_week);
        const dateMoment = moment(date);
        const minMoment = pickMoment.clone().subtract(9, 'week');
        const maxMoment = pickMoment.clone().add(9, 'week');
        if (dateMoment.isBefore(minMoment, 'week') || dateMoment.isAfter(maxMoment, 'week')) {
          return true;
        }
        return false;
      },
      firstDayOfWeek: 1,
    };

    // const tipImg = [hardcover, lighting, seat, display, patch, tint];

    // const tipsData = (live: ShopLiveStatisticalTrendsModel) => {
    //   const changeTips: any[] = [];
    //   (live.data_list ?? []).forEach((el, elIndex) => {
    //     (el.change_tips ?? []).forEach((tip, tipIndex) => {
    //       changeTips.push({
    //         coord: [elIndex, 0],
    //         name: `${tip.change_tip}`,
    //         value: tip.change_tip,
    //         symbolOffset: [0, -10 * tipIndex - 7],
    //         symbol: `image://${tipImg[tip.change_tip - 1]}`,
    //       });
    //     });
    //   });
    //   return changeTips.reverse();
    // };

    onActivated(() => {
      shouldShow.value = true;
      // paginationForm.value.page_num = 1;
      // methods.reload();
    });
    onDeactivated(() => {
      shouldShow.value = false;
    });

    return {
      // ...tipImg,
      projectListRef,
      shouldShow,
      // tipsData,
      loading,
      pickDate,
      dayPickerOptions,
      monthPickerOptions,
      weekhPickerOptions,
      startWeekPickerRef,
      endWeekPickerRef,
      ctrProjectTrendData: filterCtrProjectTrendDataList,
      week_cycle,
      projectList,
      dateRange,
      queryForm,
      ...methods,
    };
  },
  render() {
    const { queryForm, projectList } = this;
    return (
      <div class="datacenter-ctr-page-container tg-page-container">
        <div class="filter-contaainer">
          <div class="filter-item">
            <span class="label">选择项目：</span>
            <div class="content">
              <el-select
                popper-class="el-select-popper-mini"
                class="project-select"
                filterable
                v-model={queryForm.project_ids}
                size="small"
                multiple
                style="width: 100%;"
                placeholder="请选择项目"
                pickerOptions={this.dayPickerOptions}
              >
                {projectList.map(el => (
                  <el-option
                    label={el.project_name}
                    value={el.project_id}
                    key={el.project_id}
                  ></el-option>
                ))}
              </el-select>
            </div>
            <div style="flex-shrink: 0;">
              <tg-button
                style="margin-left: 16px;"
                type="link"
                on-click={() => this.onAllProject(false)}
              >
                清除
              </tg-button>
              <tg-button class="mgl-8" type="link" on-click={() => this.onAllProject(true)}>
                全选
              </tg-button>
            </div>
          </div>
          <div class="filter-item mgt-12">
            <span class="label">趋势周期：</span>
            <div class="content trend">
              <tg-button
                size="small"
                type="default"
                selected={queryForm.trend_cycle === 'day'}
                on-click={() => this.onTrendCycle('day')}
              >
                按天
              </tg-button>
              <tg-button
                size="small"
                type="default"
                selected={queryForm.trend_cycle === 'week'}
                on-click={() => this.onTrendCycle('week')}
              >
                按周
              </tg-button>
              <tg-button
                size="small"
                type="default"
                selected={queryForm.trend_cycle === 'month'}
                on-click={() => this.onTrendCycle('month')}
              >
                按月
              </tg-button>
            </div>
          </div>
          <div class="filter-item mgt-12">
            <span class="label">时间范围：</span>
            <div class="content">
              {/* {queryForm.trend_cycle === 'day' && ( */}
              <div
                class="date-range"
                style={queryForm.trend_cycle === 'day' ? '' : 'display: none;'}
              >
                <el-date-picker
                  v-model={queryForm.dates}
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini"
                  editable={false}
                  clearable={false}
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  style="width: 248px;"
                  on-change={this.onDateChange}
                  pickerOptions={this.dayPickerOptions}
                  on-blur={() => {
                    this.pickDate = undefined;
                  }}
                ></el-date-picker>
                <tg-button
                  selected={this.dateRange === DateRange.early7}
                  type="link"
                  class="mgl-16"
                  on-click={this.onEarlySevenDays}
                >
                  近7天
                </tg-button>
                <tg-button
                  selected={this.dateRange === DateRange.early30}
                  type="link"
                  class="mgl-8"
                  on-click={this.onEarlyOnMonthDays}
                >
                  近30天
                </tg-button>
              </div>
              {/* )} */}
              {/* {queryForm.trend_cycle === 'month' && ( */}
              <div style={queryForm.trend_cycle === 'month' ? '' : 'display: none;'}>
                <el-date-picker
                  v-model={queryForm.dates}
                  type="monthrange"
                  range-separator="~"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  size="mini"
                  editable={false}
                  clearable={false}
                  format="yyyy.MM"
                  value-format="yyyy-MM"
                  pickerOptions={this.monthPickerOptions}
                ></el-date-picker>
              </div>
              {/* )} */}
              {/* {queryForm.trend_cycle === 'week' && ( */}
              <div style={queryForm.trend_cycle === 'week' ? '' : 'display: none;'}>
                <el-date-picker
                  ref="startWeekPickerRef"
                  v-model={this.week_cycle.start_week}
                  type="week"
                  placeholder="选择周"
                  size="mini"
                  editable={false}
                  clearable={false}
                  style="width: 168px;"
                  format="yyyy 第 WW 周"
                  value-format="yyyy-MM-dd"
                  on-change={this.onStartWeekChanged}
                  pickerOptions={{ firstDayOfWeek: 1 }}
                ></el-date-picker>
                <span style="margin: 0 8px; display: inline-block;">~</span>
                <el-date-picker
                  ref="endWeekPickerRef"
                  v-model={this.week_cycle.end_week}
                  type="week"
                  placeholder="选择周"
                  size="mini"
                  editable={false}
                  clearable={false}
                  style="width: 168px;"
                  format="yyyy 第 WW 周"
                  value-format="yyyy-MM-dd"
                  on-blur={this.onEndWeekBlurred}
                  pickerOptions={this.weekhPickerOptions}
                ></el-date-picker>
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
        <div class="data-container" v-loading={this.loading}>
          {this.ctrProjectTrendData.length > 0 && this.shouldShow && (
            <div class="project-ctr" ref="projectListRef">
              <RecycleScroller
                style="height: 100%;"
                items={this.ctrProjectTrendData}
                item-size={428}
                key-field="project_id"
                buffer={808}
                scopedSlots={{
                  default: (props: any) => {
                    // console.log({
                    //   props,
                    // });
                    return (
                      <ChartComponent
                        {...{ props }}
                        // index={props.index}
                        // source={props.item}
                        // active={props.active}
                      ></ChartComponent>
                    );
                  },
                }}
              ></RecycleScroller>
              {/* <virtual-list
                style="height: 100%; overflow-y: overlay;"
                data-key="project_id"
                data-component={ChartComponent}
                data-sources={this.ctrProjectTrendData}
                estimate-size={404}
                keeps={8}
              ></virtual-list> */}
              {/* {this.ctrProjectTrendData.map((el, index) => {
                return (
                  <div
                    class="chart"
                    style={index === 0 ? '' : 'margin-top: 24px;'}
                    // key={`${JSON.stringify(el.data_list ?? '')}-${index}`}
                    key={`${el.project_id}-${el.start_date}-${el.end_date}`}
                  >
                    <div style="padding-left: 30px;">
                      <span style="font-weight: 600;">{el.project_name ?? '--'}</span>
                      <tg-button type="link" class="mgl-12" on-click={() => this.onDetail(index)}>
                        查看详情
                      </tg-button>
                    </div>
                    <trendChart
                      class="mgt-12"
                      index={index}
                      percentage={true}
                      originDataList={el.data_list ?? []}
                      date={this.chartDate(el)}
                      list={[
                        {
                          name: '进入率 (人数)',
                          type: 'line',
                          smooth: true,
                          data: (el.data_list ?? []).map(live => live.exposure_watch_ucnt_ratio),
                          markPoint: {
                            // symbol: (value: any, params: Object) => {
                            //   return`image://${this.hardcover}`
                            // },
                            symbolSize: [12, 17],
                            label: {
                              show: false,
                              // formatter:'{c}%'
                            },
                            data: this.tipsData(el),
                            // data: [
                            //   { coord: [1, 0], name: '15', value: 16, symbolOffset: [0, '-20%'] },
                            //   {
                            //     coord: [1, 0],
                            //     name: '15',
                            //     value: 16,
                            //     symbolOffset: [0, '-10%'],
                            //   },
                            //   {
                            //     coord: [1, 0],
                            //     name: '15',
                            //     value: 16,
                            //     symbolOffset: [0, '0'],
                            //     itemStyle: { color: 'red' },
                            //   },
                            // ],
                          },
                        },
                        {
                          name: '进入率 (人次)',
                          type: 'line',
                          smooth: true,
                          data: (el.data_list ?? []).map(live => live.exposure_watch_times_ratio),
                          markPoint: {
                            // symbol: (value: any, params: Object) => {
                            //   return`image://${this.hardcover}`
                            // },
                            symbolSize: [12, 17],
                            label: {
                              show: false,
                              // formatter:'{c}%'
                            },
                            data: this.tipsData(el),
                            // data: [
                            //   { coord: [1, 0], name: '15', value: 16, symbolOffset: [0, '-20%'] },
                            //   {
                            //     coord: [1, 0],
                            //     name: '15',
                            //     value: 16,
                            //     symbolOffset: [0, '-10%'],
                            //   },
                            //   {
                            //     coord: [1, 0],
                            //     name: '15',
                            //     value: 16,
                            //     symbolOffset: [0, '0'],
                            //     itemStyle: { color: 'red' },
                            //   },
                            // ],
                          },
                        },
                        {
                          name: '直播销售额 (元)',
                          type: 'line',
                          smooth: true,
                          data: (el.data_list ?? []).map(live => live.sum_gmv),
                          yAxisIndex: 1,
                          markPoint: {
                            // symbol: (value: any, params: Object) => {
                            //   return`image://${this.hardcover}`
                            // },
                            symbolSize: [12, 17],
                            label: {
                              show: false,
                              // formatter:'{c}%'
                            },
                            data: this.tipsData(el),
                            // data: [
                            //   { coord: [1, 0], name: '15', value: 16, symbolOffset: [0, '-20%'] },
                            //   {
                            //     coord: [1, 0],
                            //     name: '15',
                            //     value: 16,
                            //     symbolOffset: [0, '-10%'],
                            //   },
                            //   {
                            //     coord: [1, 0],
                            //     name: '15',
                            //     value: 16,
                            //     symbolOffset: [0, '0'],
                            //     itemStyle: { color: 'red' },
                            //   },
                            // ],
                          },
                        },
                      ]}
                    ></trendChart>
                    {(el.data_list ?? []).length > 0 && (
                      <change-tip style="position: absolute; left: 530px; bottom: 30px;"></change-tip>
                    )}
                  </div>
                );
              })} */}
            </div>
          )}
          {this.ctrProjectTrendData.length === 0 && (
            <div class="chart-empty">
              <empty-common detail-text="暂无数据"></empty-common>
            </div>
          )}
        </div>
      </div>
    );
  },
});
