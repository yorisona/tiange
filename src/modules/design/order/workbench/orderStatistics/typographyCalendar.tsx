import { ref, defineComponent, nextTick, h, inject, watch, computed } from '@vue/composition-api';
import CalendarCustom from '@/components/CalendarCustom';
import { useCalendarConfig } from '@/components/CalendarCustom/use';
import { Moment } from 'moment';
import { workingHoursColorMap } from '../statistics/use';
import { GetOrderStatisticsQueryCalendar } from '@/services/design';
import { useRequest } from '@gm/hooks/ahooks';
// import { RouterNameDesign } from '@/const/router';

export default defineComponent({
  setup: (props, ctx) => {
    // const config = useCalendarConfig(ECalendarType.Month);
    // inject('calendarConfig', config);
    const config = inject('calendarConfig') as ReturnType<typeof useCalendarConfig>;

    const clickDate = ref<any>({
      man_hour_date: undefined,
    });

    const popoverRef = ref<any>(null);
    const popoverRefBox = ref<any>(null);
    /* 月份控制 */
    const searchData = inject<any>('searchData');
    watch(
      () => searchData,
      val => {
        const { value } = val;
        console.log('searchData', value);

        config.changeDate(value.query_month);
        console.log('config', config);

        nextTick(() => {
          init({
            department_id: value?.department_id || undefined,
            user_id: value?.user_id || undefined,
            project_id: value?.project_id || undefined,
          });
        });
      },
      {
        deep: true,
        // immediate: true,
      },
    );

    const all_Data = ref<any>({});
    const queryCalendar = useRequest(GetOrderStatisticsQueryCalendar, {
      defaultParams: [
        {
          query_month: searchData.value.query_month,
        } as any,
      ],
      transform: (res: any) => {
        all_Data.value = res;
        return res.data;
      },
    });

    const minutesToHours = (minutes: number): string => {
      const hours = minutes / 60;
      // const remainingMinutes = minutes % 60;
      return `${hours.toFixed(1)}h`;
    };
    const init = (params: any) => {
      queryCalendar.run({
        query_month: searchData.value.query_month,
        ...params,
      });
    };
    const showMask = computed(() => {
      const has = queryCalendar.data?.some(v => v.views?.length > 0);
      return !has;
    });
    return {
      config,
      clickDate,
      popoverRef,
      popoverRefBox,
      queryCalendar,
      minutesToHours,
      init,
      all_Data,
      searchData,
      showMask,
    };
  },
  data() {
    return {};
  },
  mounted() {
    // 添加全局点击事件监听器
    document.addEventListener('click', this.handleGlobalClick);
  },
  beforeUnmount() {
    // 移除全局点击事件监听器
    document.removeEventListener('click', this.handleGlobalClick);
  },
  methods: {
    handleGlobalClick(event: Event) {
      try {
        // @ts-ignore
        if (!event || (this.$refs?.myElement && !this.$refs!.myElement?.contains(event?.target))) {
          // console.log('点击元素以外的操作逻辑');
          // this.aaa.forEach((v: any) => (v.visible = false));
          this.close();
        }
      } catch (error) {
        // console.log(error);
      }
    },
    close() {
      this.popoverRef?.doClose();
      this.popoverRefBox?.doClose();
    },
    renderTd(day: Moment) {
      const dayStr = day.format('YYYY-MM-DD');

      // popoverOptions变量
      const popoverOptions = {
        gpuAcceleration: true,
        positionFixed: true,
        preventOverflow: true,
        boundary: document.documentElement,
        fallbackPlacements: ['left', 'top', 'bottom', 'right'],
      };

      const findDay = this.queryCalendar.data
        ? this.queryCalendar.data.find(v => v.date === dayStr)
        : null;

      //  const findDay = reqSaveAssement.data ? reqSaveAssement.data[dayStr] : null;
      // if (!findDay) return '';
      // console.log(day, 'day');
      // if (dayStr === '2023-03-01') {
      return (
        <el-popover
          ref={`popoverRefBox${dayStr}`}
          popper-class="my_project_popover_wrap"
          key={dayStr}
          placement="right"
          width="265"
          trigger="manual"
          // append-to-body={false}
          // v-model={item.visible}
          popper-options={popoverOptions}
        >
          <div class="my_project_popover_wrap_box">
            {findDay && findDay.views?.length > 0 && (
              <div>
                <div style="padding: 10px 10px 10px;color: #0A0A0A;">
                  总工时：{findDay.all_hours}h
                </div>
                {findDay.views.map((v, index: number) => {
                  return (
                    <div class={['my_project_popover_wrap_box_item']}>
                      <div
                        class="my_project_popover_wrap_box_title"
                        // style={{
                        //   '--popoverCirColor': workingHoursColorMap.get(v.man_hour_type),
                        // }}
                      >
                        {v.target_name}
                      </div>
                      {v.datas.map((vv, index: number) => {
                        return (
                          <div class={['my_project_popover_wrap_box_content']} onClick={() => {}}>
                            <div
                              class="name"
                              onClick={() => {
                                // this.$router.push({
                                //   path: '/design/statistics/detail_personal',
                                //   query: {
                                //     user_id: String(vv.user_id),
                                //   },
                                // });
                                this.$emit('clickData', {
                                  user_id: Number(vv.user_id),
                                });
                              }}
                            >
                              {vv.user_name}
                            </div>
                            <div
                              class="huros"
                              onClick={() => {
                                // this.$router.push({
                                //   path: '/design/statistics/detail_personal',
                                //   query: {
                                //     user_id: String(vv.user_id),
                                //   },
                                // });
                                if (vv.man_hour_belong === 1) {
                                  this.$emit('clickData', {
                                    department_id: Number(vv.target_id),
                                  });
                                } else {
                                  this.$emit('clickProject', [
                                    {
                                      label: vv.target_name,
                                      value: vv.project_id,
                                    },
                                  ]);
                                }
                              }}
                            >
                              <span class="content_text">{vv.content}</span>
                              <span>
                                {this.minutesToHours(vv.minutes)}
                                <span v-show={vv.man_hour_type !== 3}>/{vv.percent}%</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div
            slot="reference"
            key={dayStr}
            ref="myElement"
            onClick={(event: Event) => {
              this.clickDate.man_hour_date = day.format('YYYY-MM-DD');
              // this.$emit('clickDate', this.clickDate);
            }}
            onDblclick={(e: any) => {
              e.stopPropagation();
              e.stopImmediatePropagation();
              this.close();
              this.popoverRefBox = this.$refs[`popoverRefBox${dayStr}`];
              if (findDay && findDay.views?.length) this.popoverRefBox?.doShow();
            }}
            class={{
              typographyCalendar__box__active:
                this.clickDate.man_hour_date === day.format('YYYY-MM-DD'),
              typographyCalendar__box: true,
            }}
          >
            <div class="typographyCalendar__box__wrap">
              {findDay &&
                findDay.details?.length > 0 &&
                findDay.details.map((item, index: number) => (
                  <el-popover
                    ref={`popoverRef${dayStr + index}`}
                    popper-class="my_popover_box"
                    // key={index}
                    placement="right"
                    // width="200"
                    trigger="manual"
                    // append-to-body={false}
                    // v-model={item.visible}
                    popper-options={popoverOptions}
                  >
                    <div class="popover_box">
                      <div
                        class="popover_box_title"
                        style={{
                          '--popoverCirColor': workingHoursColorMap.get(item.man_hour_type),
                        }}
                      >
                        {item.content}
                      </div>
                      <div class="popover_box_content">
                        <span>{item.man_hour_belong === 0 ? '项目方' : '需求方'}</span>
                        <span>{item.target_name}</span>
                        <span>设计师</span>
                        <span>{item.user_name}</span>
                        {/*<span>截止时间</span>
                        <span>{item.end_time}</span>
                        <span>共计工时</span>
                        <span>{this.minutesToHours(item.minutes)}</span> */}
                        <span>使用工时</span>
                        <span>{item.hours}h</span>
                        <span>对接人</span>
                        <span>{item.connect_name || '--'}</span>
                        <span>备注</span>
                        <span>{item.remark || '--'}</span>
                      </div>
                    </div>

                    <div
                      class="typographyCalendar__box__item"
                      slot="reference"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                      }}
                      onDblclick={(e: any) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        this.close();
                        this.popoverRef = this.$refs[`popoverRef${dayStr + index}`];
                        this.popoverRef?.doShow();
                      }}
                      style={{ '--backCol': workingHoursColorMap.get(item.man_hour_type) }}
                    >
                      {item.target_name} · {item.content}
                    </div>
                  </el-popover>
                ))}
            </div>
          </div>
        </el-popover>
      );
    },
  },
  render() {
    return (
      <div class="typographyCalendar__box" v-loading={this.queryCalendar.loading}>
        <div class="content_box__right__title">
          <span class="time">{this.searchData.query_month}</span>
          <span>
            {this.all_Data?.project_name ? this.all_Data?.project_name : '全部项目'}/
            {this.all_Data?.user_name ? this.all_Data?.user_name : '全部设计师'}
          </span>
        </div>
        <div class="calendar-box">
          <CalendarCustom
            ref="CalendarRef"
            config={this.config}
            scopedSlots={{
              render: this.renderTd,
            }}
          />
          <div class="mask" v-show={this.showMask}>
            该设计师未支持当前项目
          </div>
        </div>
      </div>
    );
  },
});
