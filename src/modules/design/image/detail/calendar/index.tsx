import { defineComponent, reactive, ref, watch } from '@vue/composition-api';
import CalendarCustom, { ECalendarType, useCalendarConfig } from '@/components/CalendarCustom';
import { Moment } from 'moment';
import { usePagination } from '@gm/hooks/ahooks';
import { Query_Image_Design_Calendar } from '@/services/design';
import { Select } from '@gm/component/select';
import { useImageMethod } from '@/modules/design/workbench/common';

export default defineComponent({
  setup: (props, ctx) => {
    const config = useCalendarConfig(ECalendarType.Month);
    const reqList = usePagination(Query_Image_Design_Calendar, { manual: true });
    const data = ref<{ [key: string]: { time: string; objects: any[] }[] }>({});
    const getDayData = (day: Moment) => {
      const dayStr = day.format('YYYY-MM-DD');
      const data: any = reqList.data || {};

      const dayData = data[dayStr];
      if (dayData === undefined || dayData.length === 0) return null;
      return dayData;
    };
    const formData = ref({
      status: undefined,
    });
    const ImageMethod = useImageMethod();
    const getDate = () => {
      reqList.runAsync({
        start_date: config.startTime.format('YYYY-MM-DD'),
        end_date: config.endTime.format('YYYY-MM-DD'),
        reservation_status: formData.value.status,
      });
    };
    watch(() => config.startTime, getDate);
    ImageMethod.on(
      ['撤销', '退单', '接单', '完成', '未完成', '上传', '重新提交', '调整妆造师'],
      reqList.reload,
    );

    getDate();
    const AppointmentStatus = E.design.AppointmentStatus;
    const AppointmentStatusOption = E.design.AppointmentStatusOption.filter(
      it => it.value !== AppointmentStatus.WITHDRAWN && it.value !== AppointmentStatus.CHARGED_BACK,
    );
    return reactive({
      config,
      data,
      getDayData,
      getDate,
      formData,
      ImageMethod,
      AppointmentStatusOption,
    });
  },
  render() {
    const { getDayData, config, formData, ImageMethod } = this;
    return (
      <div class="calendar-container">
        <div class="filter-bar" style="justify-content: space-between;">
          <div style="display:flex; align-items: center;">
            <div class="date-switch">
              <div class="btn-circle" onClick={() => config.add(-1)}>
                <tg-icon name="ico-arrow-left" />
              </div>
              <span class="live-date">{config.currentDate.format('YYYY年MM月')}</span>
              <div class="btn-circle" onClick={() => config.add(1)}>
                <tg-icon name="ico-arrow-right" />
              </div>
            </div>
            <span style="margin-left:32px;font-size:12px">预约状态：</span>
            <Select
              v-model={formData.status}
              showAll
              options={this.AppointmentStatusOption}
              onChange={this.getDate}
              style="width:132px"
            />
            <span class="mgl-18 tips" style="font-size:12px">
              日历模式下不展示已撤回和已退单的预约信息
            </span>
          </div>
          <div style="font-size:12px;margin-left:24px">
            <span style="color: var(--text-third-color)">
              <span style="width: 10px;height: 10px;background: #ED3434;border-radius: 2px;display:inline-block;margin-right:4px"></span>
              待接单
            </span>
            <span style="color:var(--text-third-color);margin-left:16px">
              <span style="width: 10px;height: 10px;background: #FB8500;border-radius: 2px;display:inline-block;margin-right:4px"></span>
              待完成、待评价、待上传
            </span>
            <span style="color:var(--text-third-color);margin-left:16px">
              <span style="width: 10px;height: 10px;background: #20BF55;border-radius: 2px;display:inline-block;margin-right:4px"></span>
              已结单
            </span>
          </div>
        </div>
        <div>
          <CalendarCustom
            config={this.config}
            scopedSlots={{
              render: (_: Moment) => {
                const data = getDayData(_);
                if (data === null) {
                  return <div class="no-appointment-yet">暂无预约</div>;
                }
                return (
                  <div class="calendar-cell">
                    {data.map((itemTime: any, key: number) => {
                      let otherDom: any = null;
                      if (itemTime.objects.length === 0) otherDom = <span class="tip">无</span>;
                      if (itemTime.disabled === true) otherDom = <span class="tip">已关闭</span>;
                      if (itemTime.objects.length > 0) otherDom = undefined;
                      return (
                        <div class="info" key={key}>
                          <span class="time">{itemTime.time}</span>
                          <div class="projects">
                            {otherDom}
                            {itemTime.objects.map((project: any) => {
                              return (
                                <el-popover
                                  trigger="hover"
                                  content={project.project_name}
                                  placement="top-end"
                                  open-delay={500}
                                >
                                  <span
                                    class="project_name"
                                    slot="reference"
                                    onClick={() => ImageMethod.emit('查看', project)}
                                    style={{
                                      color:
                                        project.reservation_status === 1
                                          ? '#ED3434'
                                          : project.reservation_status === 2 ||
                                            project.reservation_status === 3 ||
                                            project.reservation_status === 4
                                          ? '#FB8500'
                                          : project.reservation_status === 5
                                          ? '#20BF55'
                                          : '',
                                    }}
                                  >
                                    {project.project_name ?? '--'}
                                  </span>
                                </el-popover>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              },
            }}
          />
        </div>
      </div>
    );
  },
});

// how_much
