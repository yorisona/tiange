import { ref, defineComponent, nextTick, h, inject, watch } from '@vue/composition-api';
import CalendarCustom, { ECalendarType } from '@/components/CalendarCustom';
import { useCalendarConfig } from '@/components/CalendarCustom/use';
import moment, { Moment } from 'moment';
import { workingHoursColorMap } from './use';
import { QueryUserManHourForCalendar, DeleteUserManHour } from '@/services/design';
import { useRequest } from '@gm/hooks/ahooks';
// import { workingHoursDirectionMap } from './use';

export default defineComponent({
  setup: (props, ctx) => {
    const config = useCalendarConfig(ECalendarType.Month);

    const clickDate = ref<any>({
      man_hour_date: moment().format('yyyy-MM-DD'),
    });

    const copyData = ref<any>({});

    const popoverRef = ref<any>(null);
    const popoverRefBox = ref<any>(null);
    /* 月份控制 */
    const searchData = inject<any>('searchData');
    watch(
      () => searchData.value,
      val => {
        config.changeDate(val.date);
        nextTick(() => {
          init();
        });
      },
      {
        deep: true,
      },
    );
    const all_Data = ref<any>({});
    const queryCalendar = useRequest(QueryUserManHourForCalendar, {
      defaultParams: [
        {
          query_month: searchData.value.date,
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

    const init = () => {
      queryCalendar.run({
        query_month: searchData.value.date,
      });
    };
    return {
      config,
      clickDate,
      popoverRef,
      popoverRefBox,
      queryCalendar,
      minutesToHours,
      init,
      copyData,
      all_Data,
      searchData,
    };
  },
  data() {
    return {
      projectId: undefined as number | undefined,
    };
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
    /* 粘贴 */
    paste() {
      this.$emit('openWork', {
        man_hour_type: 0,
        ...this.copyData,
        ...this.clickDate,
        // start_time: undefined,
        // end_time: undefined,
      });
      this.copyData = {};
      this.projectId = undefined;
    },
    /* 返回复制内容 */
    copy(item: any) {
      this.copyData = {
        content: item.content,
        man_hour_belong: item.man_hour_belong,
        man_hour_date: this.clickDate.man_hour_date,
        man_hour_type: item.man_hour_type,
        remark: item.remark,
        target_id: item.target_id,
        extra_target_id: item.extra_target_id,
        target_name: item.target_name,
        hours: item.hours,
        connect_name: item.connect_name ?? undefined,
        connect_id: item.connect_id ?? undefined,
      };
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
      //  if (!findDay || findDay.length === 0) return '';
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
          append-to-body={false}
          // v-model={item.visible}
          popper-options={popoverOptions}
        >
          <div class="my_project_popover_wrap_box">
            {findDay && findDay.views?.length > 0 ? (
              <div>
                <div style="padding: 10px 10px 10px;color: #0A0A0A;">
                  总工时：{findDay.all_hours}h
                </div>
                {findDay.views.map((v, index: number) => {
                  return (
                    <div class={['my_project_popover_wrap_box_item']}>
                      <div
                        class="my_project_popover_wrap_box_title"
                        style={{
                          '--popoverCirColor': workingHoursColorMap.get(v.man_hour_type),
                        }}
                      >
                        <span>{v.man_hour_type_name}</span>
                        <span v-show={v.man_hour_type_name === '加班'}>加班暂不计入总工时</span>
                      </div>
                      {v.datas.map((vv, index: number) => {
                        return (
                          <div
                            class={[
                              'my_project_popover_wrap_box_content',
                              vv.id === this.projectId &&
                                'my_project_popover_wrap_box_content_active',
                            ]}
                            onClick={() => {
                              this.projectId = vv.id;
                              this.copy(vv);
                              this.$message.success('复制成功');
                            }}
                          >
                            <span>
                              {vv.target_name} · {vv.content}
                            </span>
                            <span>
                              {this.minutesToHours(vv.minutes)}
                              <span v-show={v.man_hour_type_name !== '加班'}>/{vv.percent}%</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                <div class="my_project_popover_wrap_box_footer" v-show={this.copyData.target_id}>
                  <el-button
                    class="btn"
                    type="primary"
                    onclick={() => {
                      this.paste();
                    }}
                  >
                    粘贴
                  </el-button>
                </div>
              </div>
            ) : (
              <div>暂无数据</div>
            )}
            {/* <div class="my_project_popover_wrap_box_title">项目</div>
            <div class="my_project_popover_wrap_box_content">
              <span>瑞幸·日常装修升级</span>
              <span>47h/15%</span>
            </div> */}
          </div>
          <div
            slot="reference"
            key={dayStr}
            ref="myElement"
            onClick={(event: Event) => {
              this.clickDate.man_hour_date = day.format('YYYY-MM-DD');
              this.$emit('clickDate', this.clickDate);
            }}
            onDblclick={(e: any) => {
              e.stopPropagation();
              e.stopImmediatePropagation();
              this.close();
              if (!findDay?.details?.length) {
                /* 默认新增项目工时 */
                this.paste();
                return;
              }
              this.popoverRefBox = this.$refs[`popoverRefBox${dayStr}`];
              console.log(findDay, 'this.popoverRef');
              this.popoverRefBox?.doShow();
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
                    append-to-body={false}
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
                        <span>{item.user_name || '--'}</span>
                        <span>使用工时</span>
                        <span>{item.hours}h</span>
                        <span>对接人</span>
                        <span>{item.connect_name || '--'}</span>
                        <span>备注</span>
                        <span>{item.remark || '--'}</span>
                      </div>
                      <div class="popover_box_footer">
                        <el-button
                          class="btn"
                          onclick={() => {
                            DeleteUserManHour({
                              man_hour_id: item.id,
                            }).then(res => {
                              if (res.data.success) {
                                this.$message.success('删除成功');
                                this.$emit('change');
                              } else {
                                this.$message.error(res.data.message);
                              }
                              this.init();
                            });
                            this.close();
                          }}
                        >
                          删除
                        </el-button>
                        <el-button
                          class="btn"
                          type="primary"
                          onclick={() => {
                            this.copy(item);
                            this.$message.success('复制成功');
                            this.close();
                          }}
                        >
                          复制
                        </el-button>
                        <el-button
                          class="btn"
                          type="primary"
                          onClick={() => {
                            this.close();
                            this.$emit('openWork', item);
                          }}
                        >
                          编辑
                        </el-button>
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
          <span class="time">{this.searchData.date}</span>
          <span>
            已统计工时/总工时：{this.all_Data?.hours}h/{this.all_Data?.all_hours}h &nbsp;
            <span style="color:#888">(加班工时暂不计入总工时)</span>
          </span>
        </div>
        <CalendarCustom
          ref="CalendarRef"
          config={this.config}
          scopedSlots={{
            render: this.renderTd,
          }}
        />
      </div>
    );
  },
});

/*
<el-popover
          // v-model={item.visible}
          ref={`popoverRefBox${dayStr}`}
          popper-class="my_project_popover_wrap"
          key={dayStr + Math.random()}
          popper-options={{
            // boundariesElement: 'body',
            gpuAcceleration: true,
            // removeOnDestroy: true,
            positionFixed: true,
            preventOverflow: true,
            boundary: document.documentElement,
            fallbackPlacements: ['left', 'top', 'bottom', 'right'],
          }}
          placement="right"
          width="265"
          trigger="manual"
          append-to-body={false}
        >
          <div class="my_project_popover_wrap_box">
            <div class="my_project_popover_wrap_box_title">项目</div>
            <div class="my_project_popover_wrap_box_content">
              <span>瑞幸·日常装修升级</span>
              <span>47h/15%</span>
            </div>
            <div class="my_project_popover_wrap_box_content">
              <span>瑞幸·日常装修升级</span>
              <span>47h/15%</span>
            </div>
            <div class="my_project_popover_wrap_box_content">
              <span>瑞幸·日常装修升级</span>
              <span>47h/15%</span>
            </div>
          </div>
          <div
            slot="reference"
            key={dayStr}
            ref="myElement"
            onClick={(event: Event) => {
              // 防止点击事件冒泡到父元素
              // event.stopPropagation();
              this.clickDate = day.format('YYYY-MM-DD');
              this.$emit('clickDate', { man_hour_date: this.clickDate });
            }}
            onDblclick={(e: any) => {
              e.stopPropagation();
              e.stopImmediatePropagation();
              // this.popoverRefBox && this.popoverRefBox?.doClose();
              this.close();
              this.popoverRefBox = this.$refs[`popoverRefBox${dayStr}`];
              console.log(this.popoverRefBox, 'this.popoverRef');
              this.popoverRefBox?.doShow();
            }}
            class={{
              typographyCalendar__box__active: this.clickDate === day.format('YYYY-MM-DD'),
              typographyCalendar__box: true,
            }}
          >
            {aaa.map((item: any, index: number) => {
              return (
                <div>
                  <el-popover
                    // v-model={item.visible}
                    ref={`popoverRef${dayStr + index}`}
                    popper-class="my_popover_box"
                    // key={index + Math.random()}
                    popper-options={{
                      // boundariesElement: 'body',
                      gpuAcceleration: true,
                      positionFixed: true,
                      preventOverflow: true,
                      boundary: document.documentElement,
                      fallbackPlacements: ['left', 'top', 'bottom', 'right'],
                    }}
                    placement="right"
                    // width="200"
                    trigger="manual"
                    append-to-body={false}
                  >
                    <div class="popover_box">
                      <div
                        class="popover_box_title"
                        style={{ '--popoverCirColor': workingHoursColorMap.get(0) }}
                      >
                        妖精的口袋装修升级
                      </div>
                      <div class="popover_box_content">
                        <span>项目方</span>
                        <span>妖精的口袋</span>
                        <span>开始时间</span>
                        <span>2020.03.12 09:00</span>
                        <span>截止时间</span>
                        <span>2020.03.12 09:00</span>
                        <span>共计工时</span>
                        <span>7.5h</span>
                        <span>备注</span>
                        <span>妖精的口袋存在项目方调整方向，重新设计</span>
                      </div>
                      <div class="popover_box_footer">
                        <el-button
                          class="btn"
                          onclick={() => {
                            this.close();
                          }}
                        >
                          删除
                        </el-button>
                        <el-button
                          class="btn"
                          type="primary"
                          onClick={() => {
                            this.close();
                            this.$emit('edit', item);
                          }}
                        >
                          编辑
                        </el-button>
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
                        this.popoverRef && this.popoverRef?.doClose();
                        this.popoverRef = this.$refs[`popoverRef${dayStr + index}`];
                        console.log(this.popoverRef, 'this.popoverRef');
                        this.popoverRef?.doShow();

                        // aaa.forEach((v: any) => (v.visible = false));
                        // item.visible = true;
                        nextTick(() => {});
                      }}
                      style={{ '--backCol': workingHoursColorMap.get(0) }}
                    >
                      {item.value}
                    </div>
                  </el-popover>
                </div>
              );

              // return (
              //   <div
              //     class="typographyCalendar__box__item"
              //     style={{ '--backCol': TypesOfWorkingHoursColor.other }}
              //   >
              //     {item}
              //   </div>
              // );
            })}
          </div>
        </el-popover>
*/
