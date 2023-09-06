import { ref, defineComponent, h, computed } from '@vue/composition-api';
import ProgressBar from '../order/workbench/statistics/modules/progressBar';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import moment from 'moment';
import { GetManHourCountData, GetDepartmentAndDesignerManHour } from '@/services/design';
import { useRouter } from '@/use/vue-router';
import { designerType, workingHoursColorMap } from '../order/workbench/statistics/use';
import Decimal from 'decimal.js-light';

export default defineComponent({
  components: {
    ProgressBar,
    BaseEcharts,
  },
  setup(props, ctx) {
    const router = useRouter();
    const formData = ref({
      date: moment().format('yyyy-MM'),
    });
    const countData = ref<M.visualDesignStatistics.ManHourCountData>({} as any); // 统计数据
    const cardData = ref<M.visualDesignStatistics.cardDepartmentsAndDesigners>({} as any); // 卡片数据
    // const baseOptions = ref({
    //   title: {
    //     text: titletext,
    //     textAlign: 'center',
    //     textStyle: {
    //       fontSize: 18,
    //       color: '#0A0A0A',
    //     },
    //     left: '21%',
    //     top: 'center',
    //   },
    //   tooltip: {
    //     show: false,
    //     trigger: 'item',
    //     borderColor: 'rgba(255,255,255,.3)',
    //     backgroundColor: 'rgba(13,5,30,.6)',
    //     borderWidth: 1,
    //     padding: 5,
    //     textStyle: {
    //       color: '#0A0A0A',
    //     },
    //   },
    //   legend: {
    //     type: 'scroll',
    //     orient: 'vertical',
    //     right: '6%',
    //     align: 'auto',
    //     top: 'middle',
    //     icon: 'circle',
    //     itemGap: 30,
    //     itemStyle: {},
    //     itemWidth: 6,
    //     itemHeight: 6,
    //     textStyle: {
    //       fontSize: 12,
    //       color: '#0A0A0A',
    //       padding: [3, 0, 0, 0],
    //       rich: {
    //         value: {
    //           color: '#0A0A0A',
    //           fontSize: 20,
    //           fontWeight: 600,
    //         },
    //         name2: {
    //           padding: [30, 0, 0, 0],
    //         },
    //       },
    //     },
    //     data: legendData,
    //     formatter: function (name: any, index: any) {
    //       const temp = legendData.map((item, index) => {
    //         if (item === name) {
    //           if (item === '加班工时/占比') {
    //             return `${name}    {value|${values[index]}}`;
    //           }
    //           return `${name}    {value|${values[index]}/31%}`;
    //         }
    //       });
    //       return temp.join('');
    //     },
    //   },
    //   series: [
    //     {
    //       type: 'pie',
    //       z: 3,
    //       center: ['22%', '50%'],
    //       radius: ['60%', '75%'],
    //       clockwise: true,
    //       avoidLabelOverlap: true,
    //       hoverOffset: 15,
    //       itemStyle: {
    //         normal: {
    //           color: function (params: any) {
    //             return colorList[params.dataIndex];
    //           },
    //         },
    //       },
    //       label: {
    //         show: false,
    //       },
    //       data: [
    //         {
    //           name: legendData[0],
    //           value: values[0],
    //         },
    //         {
    //           name: legendData[1],
    //           value: values[1],
    //         },
    //         {
    //           name: legendData[2],
    //           value: values[2],
    //         },
    //         {
    //           name: legendData[3],
    //           value: 0,
    //         },
    //       ],
    //     },
    //   ],
    // });
    // popoverOptions变量
    const popoverOptions = {
      // gpuAcceleration: true,
      // positionFixed: true,
      // preventOverflow: true,
      // boundary: document.documentElement,
      // fallbackPlacements: ['top'],
    };

    const project_left2_popover = ref<any>(null);
    const project_popover = ref<any>(null);

    const init = async () => {
      GetManHourCountData({
        query_month: formData.value.date,
      }).then(res => {
        if (res.data.success) {
          countData.value = res.data.data;
        }
      });
      GetDepartmentAndDesignerManHour({
        query_month: formData.value.date,
      }).then(res => {
        if (res.data.success) {
          cardData.value = res.data.data;
        }
      });
    };
    init();

    const baseOptions = computed(() => {
      if (!countData.value || !countData.value?.man_hour_count)
        return {} as M.visualDesignStatistics.ManHourCountData;
      // const colorList = ['#3F8EF6', '#984DFF', '#09ce98', '#fe365c'];
      const allP = countData.value?.man_hour_count
        ?.filter(v => v.man_hour_type_name !== '加班')
        ?.map(v => v.hours)
        ?.reduce((a, b) => a.add(new Decimal(b)), new Decimal(0))
        .toFixed(1);

      return {
        title: {
          text: `{value|${allP}h}\n {name|设计部总工时}`,
          textAlign: 'center',
          textStyle: {
            fontSize: 18,
            color: '#0A0A0A',
            rich: {
              value: {
                color: '#0A0A0A',
                fontSize: 20,
                fontWeight: 600,
              },
              name: {
                color: '#0A0A0A',
                fontSize: 12,
                fontWeight: 400,
              },
            },
          },
          left: '20%',
          top: 'center',
        },
        tooltip: {
          show: false,
          trigger: 'item',
          borderColor: 'rgba(255,255,255,.3)',
          backgroundColor: 'rgba(13,5,30,.6)',
          borderWidth: 1,
          padding: 5,
          textStyle: {
            color: '#0A0A0A',
          },
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '1%',
          align: 'auto',
          top: 'middle',
          icon: 'circle',
          itemGap: 28,
          itemStyle: {},
          itemWidth: 6,
          itemHeight: 6,
          textStyle: {
            fontSize: 12,
            color: '#0A0A0A',
            padding: [3, 0, 0, 0],
            rich: {
              value: {
                color: '#0A0A0A',
                fontSize: 18,
                fontWeight: 600,
              },
              name2: {
                padding: [30, 0, 0, 0],
              },
            },
          },
          // data: legendData,
          formatter: (name: any, index: any) => {
            const temp = countData.value.man_hour_count.map((item, index) => {
              if (item.man_hour_type_name === name) {
                if (item.man_hour_type_name === '加班') {
                  return `${name}  {value|${item.hours}h}`;
                }
                return `${name}  {value|${item.hours}h/${item.percent}%}`;
              }
            });
            return temp.join('');
          },
        },
        series: [
          {
            type: 'pie',
            z: 3,
            center: ['21%', '50%'],
            radius: ['56%', '70%'],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 15,
            itemStyle: {
              normal: {
                color: function (params: any) {
                  // return colorList[params.dataIndex];
                  return params.data.color;
                },
              },
            },
            label: {
              show: false,
            },
            data:
              countData.value.man_hour_count?.map(item => {
                return {
                  name: item.man_hour_type_name,
                  value: item.percent,
                  color: workingHoursColorMap.get(item.man_hour_type),
                };
              }) ?? [],
            // data: [
            //   {
            //     name: legendData[0],
            //     value: values[0],
            //   },
            //   {
            //     name: legendData[1],
            //     value: values[1],
            //   },
            //   {
            //     name: legendData[2],
            //     value: values[2],
            //   },
            //   {
            //     name: legendData[3],
            //     value: 0,
            //   },
            // ],
          },
        ],
      };
    });

    return {
      baseOptions,
      popoverOptions,
      project_popover,
      formData,
      project_left2_popover,
      countData,
      init,
      cardData,
      router,
    };
  },
  methods: {
    close() {
      this.project_popover?.doClose();
      this.project_left2_popover?.doClose();
    },
    clickedOutside() {
      this.close();
    },
  },
  render() {
    const { formData, countData } = this;

    return (
      <div class="statistics_box">
        <div class="statistics_box_header">
          <el-form size="mini" inline={true} model={formData} class="demo-form-inline">
            <el-form-item label="时间：">
              <el-date-picker
                clearable={false}
                style="width: 140px"
                v-model={formData.date}
                type="month"
                format="yyyy.MM"
                value-format="yyyy-MM"
                placeholder="选择月"
                onChange={() => {
                  this.init();
                }}
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="statistics_box_left1">
          <div class="title">
            <span>工时分布</span>
            <i
              class="el-icon-arrow-right next"
              onClick={() => {
                this.$router.push({
                  path: '/design/statistics/detail',
                  query: {
                    date: this.formData.date,
                  },
                });
              }}
            ></i>
          </div>
          <div class="content">
            {countData.man_hour_count?.length ? (
              <base-echarts style="width: 100%" options={this.baseOptions}></base-echarts>
            ) : (
              <empty-common
                style="margin-top:18px"
                img-height="100"
                img-width="150"
                detail-text="暂无数据~"
              />
            )}
          </div>
        </div>
        <div class="statistics_box_left2">
          <div class="title">
            <span>项目/需求方</span>
            <span class="sub_title">工时/总占比</span>
          </div>
          <div class="content">
            {countData.project_requirement_count?.length > 0 ? (
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
                  <div class="project_popover_box" v-click-outside={() => this.clickedOutside()}>
                    <div class="project_popover_box_title">
                      <span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;flex: 1;">
                        {item.target_name}
                      </span>
                      <span>
                        {item.hours}h/{item.percent}%
                      </span>
                    </div>
                    <div class="project_popover_box_content">
                      {item.designer_data?.map((item, index) => (
                        <fragments>
                          <div
                            class="name"
                            style={{ background: designerType.get(item.job_title) ?? '#ecf9e6' }}
                            onClick={() => {
                              this.$router.push({
                                path: '/design/statistics/detail_personal',
                                query: {
                                  user_id: String(item.user_id),
                                  date: this.formData.date,
                                },
                              });
                            }}
                          >
                            {item.user_name}
                          </div>
                          <div class="value-box">
                            <span class="value">{item.content}</span>
                            <span>
                              {item.hours}h/{item.percent}%
                            </span>
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
                        index === countData.project_requirement_count?.length - 1 ? '0' : '10px',
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
        <div class="statistics_box_center" id="statistics_box_center">
          <div class="title">部门</div>
          {this.cardData?.department_man_hour?.length > 0 ? (
            <div class="content statistics_box_center_wrap">
              {this.cardData?.department_man_hour?.map((item, i) => (
                <el-popover
                  ref={`project_popover${i}`}
                  popper-class="my_project_popover_wrap"
                  // key={i + Math.random()}
                  placement={
                    this.cardData?.department_man_hour.length < 10
                      ? 'right'
                      : i > this.cardData?.department_man_hour.length - 3
                      ? 'top'
                      : 'right'
                  }
                  width="265"
                  trigger="manual"
                  // append-to-body={false}
                  // v-model={item.visible}
                  popper-options={this.popoverOptions}
                >
                  <div
                    class="project_popover_box20230410"
                    v-click-outside={() => this.clickedOutside()}
                  >
                    <div class="project_popover_box20230410_title">
                      <span>{item.department_name}</span>
                      <span>{item.percent}%</span>
                    </div>
                    <div class="project_popover_box20230410_content">
                      {item.son_department_data &&
                        item.son_department_data?.map((v, i) => (
                          <ProgressBar
                            styles={{
                              height: '25px',
                              marginBottom:
                                i === item.son_department_data.length - 1 ? '0' : '10px',
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
                  </div>
                  <div
                    ref="myElement"
                    class="statistics_box_center_wrap_item"
                    slot="reference"
                    style={{
                      background: item.data_source === 0 ? '#f4f8ff' : '#ecfaf8',
                      cursor: item.son_department_data?.length === 0 ? 'default' : 'pointer',
                    }}
                    onDblclick={(e: any) => {
                      e.stopPropagation();
                      e.stopImmediatePropagation();
                      // this.close();
                      if (item.son_department_data?.length === 0) return;
                      this.project_popover = this.$refs[`project_popover${i}`];
                      this.project_popover?.doShow();
                      console.log(item, 'this.$refs');
                    }}
                  >
                    <div class="statistics_box_center_wrap_item_title">{item.department_name}</div>
                    <div class="sub_item mgr-8">
                      <span>{item.percent}%</span>
                      <span>工时总占比</span>
                    </div>
                    <div class="sub_item">
                      <span>{item.all_hours}h</span>
                      <span>工时总数</span>
                    </div>
                  </div>
                </el-popover>
              ))}
            </div>
          ) : (
            <empty-common
              style="margin-top:78px"
              img-height="100"
              img-width="150"
              detail-text="暂无数据~"
            />
          )}
        </div>
        <div class="statistics_box_right">
          <div class="title">设计师</div>
          {this.cardData?.designer_man_hour?.length > 0 ? (
            <div class="content statistics_box_right_wrap">
              {this.cardData?.designer_man_hour?.map((item: any) => (
                <div
                  class="statistics_box_right_wrap_item"
                  style={{ background: designerType.get(item.team_id) ?? '#ecf9e6' }}
                  onClick={() => {
                    this.$router.push({
                      path: '/design/statistics/detail_personal',
                      query: {
                        user_id: String(item.user_id),
                        date: this.formData.date,
                      },
                    });
                  }}
                >
                  <div class="statistics_box_right_wrap_item_title">{item.user_name}</div>
                  <div class="sub_item">
                    <span>
                      {item.hours}h/{item.all_hours}h
                    </span>
                    <span>完成/总工时</span>
                  </div>
                </div>
              ))}
            </div>
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
    );
  },
});
