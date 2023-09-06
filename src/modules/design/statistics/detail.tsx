import { defineComponent, h, inject, provide, ref } from '@vue/composition-api';
import moment from 'moment';
import dataStatistics from '../order/workbench/statistics/dataStatistics';
import typographyCalendar from './modules/typographyCalendar.vue';
// import { save_user_man_hour } from '@/services/design';
// import { Message } from 'element-ui';
import { RouterNameDesign } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import ProgressBar from '../order/workbench/statistics/modules/progressBar';
import { interfaceType } from '../order/workbench/statistics/use';
import { GetDepartmentManHourCount } from '@/services/design';
import { GetLevelTwoFeishuDepartmentList } from '@/services/supplier';
import { ECalendarType } from '@/components/CalendarCustom';
import { useCalendarConfig } from '@/components/CalendarCustom/use';
import { useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
// import { useRequest } from '@gm/hooks/ahooks';

export default defineComponent({
  components: {
    ProgressBar,
    dataStatistics,
    typographyCalendar,
  },
  setup(props, ctx) {
    const router = useRouter();
    console.log(router, 'router');

    const routes: any = [
      {
        name: RouterNameDesign.design_order_statistics,
        title: '视觉设计统计',
      },
      {
        path: '',
        title: '部门占比',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const config = useCalendarConfig(ECalendarType.Month);

    const formData = ref<any>({
      man_hour_date: undefined,
      man_hour_id: undefined,
      date: router.currentRoute.query.date || moment().format('yyyy-MM'),
      department_id: router.currentRoute.query.department_id || undefined,
    }); // 表单数据

    provide('searchData', formData);
    provide('calendarConfig', config);

    const queryDepartmentManHourCount = useRequest(GetDepartmentManHourCount, {
      defaultParams: [
        {
          query_month: formData.value.date,
          department_id: formData.value.department_id,
        } as any,
      ],
    });
    /* 查询部门 */
    const selectDepartmentList = useRequest(GetLevelTwoFeishuDepartmentList, {
      transform: res => {
        if (res?.data?.length > 0) {
          return res.data.map((v: any) => ({
            value: v.id,
            label: v.name,
          }));
        }
        return [];
      },
    });
    const init = () => {
      queryDepartmentManHourCount.run({
        query_month: formData.value.date,
        department_id: formData.value.department_id,
      } as any);
    };
    console.log(queryDepartmentManHourCount, 'queryDepartmentManHourCount');

    return {
      formData,
      queryDepartmentManHourCount,
      init,
      selectDepartmentList,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="statistics-box">
        <div class="header-box">
          <el-form size="mini" inline={true} model={formData} class="demo-form-inline">
            <el-form-item label="时间：">
              <el-date-picker
                clearable={false}
                style="width: 175px"
                v-model={formData.date}
                type="month"
                format="yyyy.MM"
                value-format="yyyy-MM"
                placeholder="选择月"
                onChange={this.init}
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="部门：">
              {/* <department-select
                // style="--default-height: 40px"
                placeholder="请选择部门"
                onChange={this.init}
                queryForm={{}}
                disabledLevel={2}
                clearable
                v-model={formData.department_id}
              /> */}
              <Select
                style="width: 100%"
                options={this.selectDepartmentList.data}
                v-model={formData.department_id}
                placeholder="请选择部门"
                onChange={this.init}
                // onChange={() => {
                //   this.init();
                // }}
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="content_box">
          <div class="content_box__left">
            <div class="content_box__left__top">
              <div class="content_box__left__top__title">部门占比</div>
              <div
                class="content_box__left__top__wrap"
                v-loading={this.queryDepartmentManHourCount.loading}
              >
                {this.queryDepartmentManHourCount.data &&
                this.queryDepartmentManHourCount.data?.length > 0 ? (
                  <el-collapse onChange="handleChange">
                    {this.queryDepartmentManHourCount.data.map((item, i) => (
                      <el-collapse-item
                        name={i}
                        key={i}
                        class={[item.son_department_data?.length === 0 && 'no_son']}
                      >
                        <div
                          slot="title"
                          class="collapse_title_box"
                          style={{
                            cursor: item.son_department_data?.length === 0 ? 'default' : 'pointer',
                          }}
                        >
                          <span>{item.department_name}</span>
                          <span class="value">
                            {item.all_hours}h/{item.percent}%
                          </span>
                        </div>
                        <div>
                          {item.son_department_data &&
                            item.son_department_data.map(v => (
                              <ProgressBar
                                styles={{
                                  height: '27px',
                                  marginBottom: '10px',
                                }}
                                data={[v]}
                                scopedSlots={{
                                  tooltip: (data: any[]) => {
                                    return (
                                      <div class="tooltip-box">
                                        {data.map(field => {
                                          return (
                                            <div class="tooltip">
                                              <span>{field.department_name}</span>
                                              {/* <span>{field.label}</span> */}
                                              <span>
                                                {field.all_hours}h/{field.percent}%
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  },
                                }}
                              />
                            ))}
                        </div>
                      </el-collapse-item>
                    ))}
                  </el-collapse>
                ) : (
                  <empty-common
                    style="margin-top:78px"
                    img-height="100"
                    img-width="150"
                    detail-text="暂无数据~"
                  />
                )}
              </div>
            </div>
            <div class="content_box__left__bottom">
              <div class="content_box__left__top__title">数据统计</div>
              <dataStatistics
                modeType={interfaceType.manager}
                class="content_box__left__top__wrap"
              />
            </div>
          </div>
          <div class="content_box__right">
            <typographyCalendar
              ref="typographyCalendar"
              // onClickDate={(data: Record<string, any>) => {
              //   this.formData = { ...this.formData, ...data };
              // }}
            />
          </div>
        </div>
      </div>
    );
  },
});
