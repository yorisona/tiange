import { ref, defineComponent, h, provide, inject } from '@vue/composition-api';
import moment from 'moment';
import dataStatistics from '../statistics/dataStatistics';
import typographyCalendar from './typographyCalendar.vue';
// import { save_user_man_hour } from '@/services/design';
// import { Message } from 'element-ui';
import { useRouter } from '@/use/vue-router';
import ProgressBar from '../statistics/modules/progressBar';
// import { interfaceType } from '../statistics/use';
import {
  GetDepartmentManHourCount,
  GetDesignOrderCountForProjectRequirement,
  GetUserLevelTwoDepartment,
} from '@/services/design';
import { ObjectFilterEmpty } from '@/utils/func';
import { ECalendarType } from '@/components/CalendarCustom';
import { useCalendarConfig } from '@/components/CalendarCustom/use';
import { useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { GetDesigner, GetLevelTwoFeishuDepartmentList } from '@/services/supplier';
import { FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { useUserInfo } from '@/use/vuex';
import { designerType } from '../../../order/workbench/statistics/use';
import { workingHoursColorMap } from '../statistics/use';
import { getToken } from '@/utils/token';
import qs from 'query-string';

export default defineComponent({
  components: {
    ProgressBar,
    dataStatistics,
    typographyCalendar,
  },
  setup(props, ctx) {
    const userinfo = useUserInfo();
    console.log(userinfo, 'userinfo');

    const router = useRouter();
    const routes = [
      {
        name: 'Workbench',
        title: '工作台',
      },
      {
        path: '/design/order/workbench',
        title: '视觉设计',
      },
      {
        path: '',
        title: '下单统计',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);

    const config = useCalendarConfig(ECalendarType.Month);

    const formData = ref<any>({
      query_month: router.currentRoute.query.date || moment().format('yyyy-MM'),
      user_id: undefined,
      department_id: undefined,
      project_id: undefined,
      is_workbench: true,
    }); // 表单数据
    const calendarData = ref<any>({
      query_month: router.currentRoute.query.date || moment().format('yyyy-MM'),
      user_id: undefined,
      department_id: undefined,
      project_id: undefined,
    });

    provide('searchData', calendarData);
    provide('calendarConfig', config);

    const queryDepartmentManHourCount = useRequest(GetDepartmentManHourCount, {
      manual: true,
      defaultParams: [
        {
          ...formData.value,
        } as any,
      ],
    });
    const queryGetUserLevelTwoDepartment = useRequest(GetUserLevelTwoDepartment, {
      transform: res => {
        if (res.id) {
          formData.value.department_id = res.id;
          calendarData.value.department_id = res.id;
          init();
        }
        return res;
      },
    });
    const queryDesignOrderCountForProjectRequirement = useRequest(
      GetDesignOrderCountForProjectRequirement,
      {
        manual: true,
        defaultParams: [
          {
            ...formData.value,
          } as any,
        ],
      },
    );
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

    const selectOptions = useRequest(GetDesigner, {
      defaultParams: [
        {
          query_month: formData.value.query_month,
        } as any,
      ],
    });
    const project_left1_popover = ref<any>(null);
    const project_left2_popover = ref<any>(null);
    const configs = {
      reset() {
        formData.value.department_id = undefined;
        formData.value.project_id = undefined;
        formData.value.user_id = undefined;
        formData.value.query_month = moment().format('yyyy-MM');
        calendarData.value = { ...formData.value };
        init();
      },
      searchBefore() {
        calendarData.value = { ...formData.value };
        console.log(calendarData.value, 'calendarData.value');

        init();
      },
      onExportExcel() {
        const _paramsstr = qs.stringify({ ...ObjectFilterEmpty(formData.value) });
        const token = getToken();
        const url = '/api/visual_design/export_month_design_man_hour';
        window.open(`${process.env.VUE_APP_BASE_API}${url}?${_paramsstr}&Authorization=${token}`);
      },
    };
    const init = () => {
      queryDepartmentManHourCount.run({
        ...formData.value,
      });
      queryDesignOrderCountForProjectRequirement.run({
        ...formData.value,
      });
    };
    const projectOption = ref<any>([]);
    return {
      configs,
      formData,
      queryDepartmentManHourCount,
      selectOptions,
      init,
      project_left2_popover,
      project_left1_popover,
      queryDesignOrderCountForProjectRequirement,
      selectDepartmentList,
      queryGetUserLevelTwoDepartment,
      projectOption,
    };
  },
  methods: {
    close() {
      this.project_left1_popover?.doClose();
      this.project_left2_popover?.doClose();
    },
    clickedOutside() {
      this.close();
    },
  },
  render() {
    const { formData, queryDesignOrderCountForProjectRequirement } = this;
    const countData = queryDesignOrderCountForProjectRequirement.data;
    return (
      <div class="orderStatistics-box">
        <div class="header-box">
          <el-form size="mini" inline={true} model={formData} class="demo-form-inline">
            <el-form-item label="时间：">
              <el-date-picker
                clearable={false}
                v-model={formData.query_month}
                type="month"
                style="width: 168px"
                format="yyyy.MM"
                value-format="yyyy-MM"
                placeholder="选择月"
                onChange={() => {
                  this.selectOptions.run({
                    query_month: formData.query_month,
                  });
                }}
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="部门：">
              {/* <department-select
                // style="--default-height: 40px"
                placeholder="请选择部门"
                onChange={this.init}
                queryForm={{}}
                disabledLevel={1}
                clearable
                v-model={formData.department_id}
              /> */}
              <Select
                style="width: 168px"
                options={this.selectDepartmentList.data}
                v-model={formData.department_id}
                placeholder="请选择部门"
                // onChange={() => {
                //   this.init();
                // }}
              />
            </el-form-item>
            <el-form-item label="项目：">
              <FunctionSelect
                style="width: 168px"
                clearable={true}
                modeType={EFunctionSelectType.SEARCH_PROJECT}
                v-model={formData.project_id}
                placeholder="请选择项目"
                defaultValue={this.projectOption}
              />
            </el-form-item>
            <el-form-item label="设计师：">
              <Select
                style="width: 168px"
                options={this.selectOptions.data}
                v-model={formData.user_id}
                placeholder="请选择设计师"
                // onChange={() => {
                //   this.init();
                // }}
              />
            </el-form-item>
            <el-form-item>
              <el-button class="mgr-8" type="primary" onClick={this.configs.searchBefore}>
                查询
              </el-button>
              <el-button class="mgr-8" onClick={this.configs.reset}>
                重置
              </el-button>
              <el-button onClick={this.configs.onExportExcel}>导出</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="content_box">
          <div class="content_box__left">
            <div
              class="content_box__left__top"
              v-loading={queryDesignOrderCountForProjectRequirement.loading}
            >
              {/* <div class="content_box__left__top__title">
                <span>{countData?.department_count?.name}</span>
                <span>
                  {countData?.department_count?.hours || 0}h/
                  {countData?.department_count?.percent || 0}%
                </span>
              </div>
              <div class="content_box__left__top__wrap">
                {countData && countData?.department_count?.sons?.length > 0 ? (
                  countData.department_count.sons.map((item, index) => (
                    <el-popover
                      ref={`project_left1_popover${index}`}
                      popper-class="project_left2_popover_wrap"
                      // key={i + Math.random()}
                      placement={
                        countData.project_requirement_count.length < 5
                          ? 'right'
                          : index > countData.project_requirement_count.length - 3
                          ? 'top'
                          : 'right'
                      }
                      width="265"
                      trigger="manual"
                      append-to-body={false}
                      popper-options={this.popoverOptions}
                    >
                      <div
                        class="project_popover_box"
                        v-click-outside={() => this.clickedOutside()}
                      >
                        <div class="project_popover_box_title">
                          <span>{item.name}</span>
                          <span>
                            {item.hours}h/{item.percent}%
                          </span>
                        </div>
                        <div class="pd-10">
                          {item.views?.map((items, index) => (
                            <fragments>
                              <div
                                class="my_project_popover_wrap_box_title"
                                style={{
                                  '--popoverCirColor': workingHoursColorMap.get(
                                    items.man_hour_type,
                                  ),
                                }}
                              >
                                {items.target_name}
                              </div>
                              <div class="project_popover_box_content">
                                {items.datas?.map((item: any) => (
                                  <div class="project_popover_box_content">
                                    <div
                                      class="name"
                                      style={{
                                        background: designerType.get(item.job_title) ?? '#ecf9e6',
                                      }}
                                      // onClick={() => {
                                      //   this.$router.push({
                                      //     path: '/design/statistics/detail_personal',
                                      //     query: {
                                      //       user_id: String(item.user_id),
                                      //     },
                                      //   });
                                      // }}
                                    >
                                      {item.user_name}
                                    </div>
                                    <div class="value-box">
                                      <span class="value">{item.content}</span>
                                      <span>
                                        {item.hours}h/{item.percent}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </fragments>
                          ))}
                        </div>
                      </div>
                      <ProgressBar
                        slot="reference"
                        styles={{
                          height: '27px',
                          marginBottom:
                            index === countData.department_count.sons?.length - 1 ? '0' : '10px',
                        }}
                        data={[item]}
                        scopedSlots={{
                          tooltip: (data: any[]) => {
                            return (
                              <div class="tooltip-box">
                                {data.map(field => {
                                  return (
                                    <div
                                      class="tooltip"
                                      onDblclick={(e: any) => {
                                        e.stopPropagation();
                                        e.stopImmediatePropagation();
                                        this.project_left1_popover =
                                          this.$refs[`project_left1_popover${index}`];
                                        this.project_left1_popover?.doShow();
                                      }}
                                    >
                                      <span>{field.name}</span>
                                      <span>
                                        {field.hours || 0}h/{field.percent || 0}%
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          },
                        }}
                      />
                    </el-popover>
                  ))
                ) : (
                  <empty-common img-height="100" img-width="150" detail-text="暂无数据~" />
                )}
              </div> */}
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
                            item.son_department_data.map((v, ii, arr) => (
                              <el-popover
                                ref={`project_left1_popover${i}_${ii}`}
                                popper-class="project_left2_popover_wrap"
                                // key={i + Math.random()}
                                placement={
                                  arr.length < 5 ? 'right' : ii > arr.length - 3 ? 'top' : 'right'
                                }
                                width="265"
                                trigger="manual"
                                append-to-body={false}
                                popper-options={this.popoverOptions}
                              >
                                <div
                                  class="project_popover_box"
                                  v-click-outside={() => this.clickedOutside()}
                                >
                                  <div class="project_popover_box_title">
                                    <span>{v.department_name}</span>
                                    <span>
                                      {v.all_hours}h/{v.percent}%
                                    </span>
                                  </div>
                                  <div class="pd-10">
                                    {v.views?.map((items, index) => (
                                      <fragments>
                                        <div
                                          class="my_project_popover_wrap_box_title"
                                          style={{
                                            '--popoverCirColor': workingHoursColorMap.get(
                                              items.man_hour_type,
                                            ),
                                          }}
                                        >
                                          {items.target_name}
                                        </div>
                                        <div class="project_popover_box_content">
                                          {items.designer_data?.map((item: any) => (
                                            <div class="project_popover_box_content">
                                              <div
                                                class="name"
                                                style={{
                                                  background:
                                                    designerType.get(item.job_title) ?? '#ecf9e6',
                                                }}
                                                // onClick={() => {
                                                //   this.$router.push({
                                                //     path: '/design/statistics/detail_personal',
                                                //     query: {
                                                //       user_id: String(item.user_id),
                                                //     },
                                                //   });
                                                // }}
                                              >
                                                {item.user_name}
                                              </div>
                                              <div class="value-box">
                                                <span class="value">{item.content}</span>
                                                <span>
                                                  {item.hours}h/{item.percent}%
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </fragments>
                                    ))}
                                  </div>
                                </div>
                                <ProgressBar
                                  slot="reference"
                                  styles={{
                                    height: '27px',
                                    marginBottom: '10px',
                                  }}
                                  data={[v]}
                                  scopedSlots={{
                                    tooltip: (data: any[]) => {
                                      return (
                                        <div
                                          class="tooltip-box"
                                          onDblclick={(e: any) => {
                                            e.stopPropagation();
                                            e.stopImmediatePropagation();
                                            this.project_left1_popover =
                                              this.$refs[`project_left1_popover${i}_${ii}`];
                                            this.project_left1_popover?.doShow();
                                          }}
                                        >
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
                              </el-popover>
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
              <div class="content_box__left__top__title">
                <span>项目</span>
                <span>工时/总占比</span>
              </div>
              {/* <dataStatistics
                    modeType={interfaceType.manager}
                    class="content_box__left__top__wrap"+
                  /> */}
              <div
                class="content_box__left__top__wrap content_box__left__bottom__wrap"
                v-loading={queryDesignOrderCountForProjectRequirement.loading}
              >
                {countData && countData.project_requirement_count?.length > 0 ? (
                  countData.project_requirement_count.map((item, index) => (
                    <el-popover
                      ref={`project_left2_popover${index}`}
                      popper-class="project_left2_popover_wrap"
                      // key={i + Math.random()}
                      placement={
                        countData.project_requirement_count.length < 10
                          ? 'right'
                          : index > countData.project_requirement_count.length - 3
                          ? 'top'
                          : 'right'
                      }
                      width="265"
                      trigger="manual"
                      append-to-body={false}
                      // v-model={item.visible}
                      popper-options={this.popoverOptions}
                    >
                      <div
                        class="project_popover_box"
                        v-click-outside={() => this.clickedOutside()}
                      >
                        <div class="project_popover_box_title">
                          <span>{item.target_name}</span>
                          <span>
                            {item.hours}h/{item.percent}%
                          </span>
                        </div>
                        <div class="pd-10">
                          {item.views?.map((items, index) => (
                            <fragments>
                              <div
                                class="my_project_popover_wrap_box_title"
                                style={{
                                  '--popoverCirColor': workingHoursColorMap.get(
                                    items.man_hour_type,
                                  ),
                                }}
                              >
                                {items.man_hour_type_name}
                              </div>
                              <div class="project_popover_box_content">
                                {items.datas?.map((item, index) => (
                                  <div class="project_popover_box_content">
                                    <div
                                      class="name"
                                      style={{
                                        background: designerType.get(item.job_title) ?? '#ecf9e6',
                                      }}
                                      // onClick={() => {
                                      //   this.$router.push({
                                      //     path: '/design/statistics/detail_personal',
                                      //     query: {
                                      //       user_id: String(item.user_id),
                                      //     },
                                      //   });
                                      // }}
                                    >
                                      {item.user_name}
                                    </div>
                                    <div class="value-box">
                                      <span class="value">{item.content}</span>
                                      <span>
                                        {item.hours}h/{item.percent}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </fragments>
                          ))}
                        </div>
                      </div>
                      <ProgressBar
                        slot="reference"
                        styles={{
                          height: '27px',
                          marginBottom:
                            index === countData.project_requirement_count?.length - 1
                              ? '0'
                              : '10px',
                        }}
                        data={[item]}
                        scopedSlots={{
                          tooltip: (data: any[]) => {
                            return (
                              <div class="tooltip-box">
                                {data.map(field => {
                                  return (
                                    <div
                                      class="tooltip"
                                      onDblclick={(e: any) => {
                                        e.stopPropagation();
                                        e.stopImmediatePropagation();
                                        // this.close();
                                        this.project_left2_popover =
                                          this.$refs[`project_left2_popover${index}`];
                                        this.project_left2_popover?.doShow();
                                      }}
                                    >
                                      <span>{field.target_name}</span>
                                      {/* <span>{field.label}</span> */}
                                      <span>
                                        {field.hours}h/{field.percent}%
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          },
                        }}
                      />
                    </el-popover>
                  ))
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
          </div>
          <div class="content_box__right">
            <typographyCalendar
              ref="typographyCalendar"
              onClickData={(data: Record<string, any>) => {
                this.formData = { ...this.formData, ...data };
                this.configs.searchBefore();
              }}
              onClickProject={(data: Record<string, any>[]) => {
                console.log(data, 'data');

                this.projectOption = data;
                this.formData.project_id = data[0].value;
                this.configs.searchBefore();
              }}
            />
          </div>
        </div>
      </div>
    );
  },
});
