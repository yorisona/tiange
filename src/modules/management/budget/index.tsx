import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import icon_dashboard_gmv from '@/assets/img/finance/icon_dashboard_gmv.png';
import icon_dashboard_income from '@/assets/img/finance/icon_dashboard_income.png';
import moment from 'moment';
import { RouterManagement } from '@/const/router';
import { GetTargetManagementList } from '@/services/management';
import { formatAmount } from '@/utils/string';
import { projectBussinessModel } from '@/modules/management/budget/use';
// import icon_target_all_bg from '@/assets/img/management/icon_target_all_bg.png';
const formatPrice = (value: any) => {
  try {
    if (value === null || value === undefined || value === '') return '--';
    let result = value;
    if (value > 100000) {
      value = parseInt(String((value / 10000) * 100), 10);
      result = formatAmount((value / 100).toFixed(0), 'None', true) + 'w';
      // result = (value / 100).toFixed(fixed) + 'w';
    } else {
      // today whotao say , after RMB 都保留 fixed 位数
      value = parseInt(String((value || 0) * 100), 10);
      result = formatAmount((value / 100).toFixed(0), 'None', true);
    }
    return result;
  } catch (val: any) {
    return value;
  }
};
const renderGoalValue = (gmv_goal_value: any, revenue_goal_value: any, show_dashed = false) => {
  return (
    <div class="target-value">
      <div
        class="gmv"
        style={{
          borderRight: show_dashed ? '1px dashed #E5E5E5' : '',
        }}
      >
        <div class="gmv-value">
          <span>¥ </span>
          {formatPrice(gmv_goal_value)}
        </div>
        <div class="gmv-label">GMV目标</div>
      </div>
      <div class="gmv">
        <div class="gmv-value">
          <span>¥ </span> {formatPrice(revenue_goal_value)}
        </div>
        <div class="gmv-label">营收目标</div>
      </div>
    </div>
  );
};
export default defineComponent({
  setup(props, ctx) {
    const currentYearOptions = [
      { label: moment().format('YYYY') + ' 年', value: Number(moment().format('YYYY')) },
    ];
    const select_year = ref(Number(moment().format('YYYY')));
    const select_department_id = ref<number | string>(0);
    // 自适应表格高度部分
    // const topCardHeightStr = ref('calc(100vh - 290px)');
    const topCardHeight = ref(60);
    const onTopCardRectUpdate = (rect: DOMRect) => {
      topCardHeight.value = rect.height;
    };
    const topCardHeightStr = computed(() => {
      const height = 49;
      const topCardHeight_s = String(Number(topCardHeight.value + height).toFixed(0));
      return 'calc(100vh - ' + topCardHeight_s + 'px)';
    });
    const project_type_arr = ref([]);
    const target_data = ref();
    const split_department_goal = ref();
    const select_department_children = ref();
    const loading = ref(false);
    const changeShowAction = () => {
      if (
        departmentRef.value &&
        split_department_goal.value &&
        departmentRef.value.clientWidth < split_department_goal.value.length * 208
      ) {
        department_show.value = true;
        department_left_disable.value = true;
        department_right_disable.value = false;
      } else {
        department_show.value = false;
      }
      if (
        projectRef.value &&
        select_department_children.value &&
        projectRef.value.clientWidth <= select_department_children.value.length * 198 - 16
      ) {
        project_show.value = true;
        project_left_disable.value = true;
        project_right_disable.value = false;
      } else {
        project_show.value = false;
      }
    };
    const queryTargetBudgetReq = async () => {
      loading.value = true;
      const res = await GetTargetManagementList({ year: select_year.value });
      loading.value = false;
      if (res.data.success) {
        target_data.value = res.data.data;
        split_department_goal.value = target_data.value.split_department_goal;
        select_department_id.value =
          split_department_goal.value && split_department_goal.value.length > 0
            ? split_department_goal.value[0].department_id
            : 0;
        select_department_children.value =
          split_department_goal.value && split_department_goal.value.length > 0
            ? split_department_goal.value[0].sons || []
            : [];
        changeShowAction();
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    queryTargetBudgetReq();
    const departmentRef = ref<Element>();
    const department_show = ref(false);
    const department_left_disable = ref(true);
    const department_right_disable = ref(false);
    const onDepartmentClick = (index: number) => {
      if (departmentRef.value) {
        let move_left = 228;
        const scrollLeft = departmentRef.value.scrollLeft;
        const scrollWidth = departmentRef.value.scrollWidth;
        const clientWidth = departmentRef.value.clientWidth;
        const difference = scrollWidth - scrollLeft - clientWidth;
        if (scrollLeft < 456 && index === -1) {
          move_left = difference || 456;
          department_left_disable.value = true;
          department_right_disable.value = false;
        } else if (index === -1) {
          const x_mod = scrollLeft % 228;
          move_left = x_mod > 200 ? scrollLeft % 228 : move_left + (scrollLeft % 228);
          department_left_disable.value = false;
          department_right_disable.value = false;
        }
        if (index === 1 && difference < 228) {
          move_left = difference || 228;
          department_right_disable.value = true;
          department_left_disable.value = false;
        } else if (index === 1) {
          const x_mod = (scrollLeft + clientWidth) % 228;
          move_left = x_mod > 10 ? move_left + (228 - x_mod) : 228 - x_mod;
          department_right_disable.value = false;
          department_left_disable.value = false;
        }
        departmentRef.value.scrollLeft =
          departmentRef.value.scrollLeft + (index === 1 ? move_left : -move_left);
      }
    };
    const projectRef = ref<Element>();
    const groundRef = ref<Element>();
    const project_show = ref(false);
    const project_left_disable = ref(true);
    const project_right_disable = ref(false);
    const onProjectClick = (index: number) => {
      if (projectRef.value && groundRef.value) {
        let move_left = 208;
        const scrollLeft = projectRef.value.scrollLeft;
        const scrollWidth = projectRef.value.scrollWidth;
        const clientWidth = projectRef.value.clientWidth;
        const difference = scrollWidth - scrollLeft - clientWidth;
        if (scrollLeft <= 390 && index === -1) {
          project_left_disable.value = true;
          project_right_disable.value = false;
          move_left = difference || 416;
        } else if (index === -1) {
          const x_mod = scrollLeft % 208;
          move_left = x_mod > 190 ? scrollLeft % 208 : move_left + (scrollLeft % 208);
          project_left_disable.value = false;
          project_right_disable.value = false;
        }
        if (index === 1 && difference <= 208) {
          move_left = difference || 208;
          project_left_disable.value = false;
          project_right_disable.value = true;
        } else if (index === 1) {
          const x_mod = (scrollLeft + clientWidth) % 208;
          move_left = x_mod > 10 ? move_left + (208 - x_mod) : 208 - x_mod;
          project_right_disable.value = false;
          project_left_disable.value = false;
        }
        projectRef.value.scrollLeft =
          projectRef.value.scrollLeft + (index === 1 ? move_left : -move_left);
        groundRef.value.scrollLeft =
          groundRef.value.scrollLeft + (index === 1 ? move_left : -move_left);
      }
    };
    onMounted(() => {
      changeShowAction();
    });
    const screenWidth = ref(1300);
    watch(
      () => screenWidth.value,
      () => {
        changeShowAction();
      },
      {
        deep: true,
      },
    );
    const onProjectBudgetClick = (item?: projectBussinessModel) => {
      ctx.root.$router.push({
        name: RouterManagement.projectManagement,
        params: {
          business_type: item ? item.business_type + '' : '',
          year: select_year.value + '',
        },
      });
    };
    const onDepartmentBudgetClick = (item: any) => {
      ctx.root.$router.push({
        name: RouterManagement.departmentManagement,
        params: {
          department_id: item ? item.id : '',
          year: select_year.value + '',
        },
      });
    };
    const onSelectDepartmentClick = (department_id: number | string) => {
      select_department_id.value = department_id;
      const find = (split_department_goal.value || []).find(
        (item: any) => item.department_id === select_department_id.value,
      );
      select_department_children.value = find ? find.sons || [] : [];
      changeShowAction();
    };

    return {
      select_department_children,
      split_department_goal,
      loading,
      target_data,
      onSelectDepartmentClick,
      select_department_id,
      onDepartmentBudgetClick,
      onProjectBudgetClick,
      groundRef,
      projectRef,
      screenWidth,
      project_left_disable,
      project_right_disable,
      project_show,
      department_left_disable,
      department_right_disable,
      department_show,
      onProjectClick,
      onDepartmentClick,
      departmentRef,
      project_type_arr,
      onTopCardRectUpdate,
      topCardHeightStr,
      select_year,
      currentYearOptions,
      select: 1,
    };
  },
  created() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  render() {
    return (
      <tg-card v-loading={this.loading} class="target-budget-container" padding={0}>
        <tg-card
          class="budget-background-card"
          padding={[0]}
          on={{ 'rect:update': this.onTopCardRectUpdate }}
        >
          <el-form class="budget-filter-form" size="mini" label-width="60px">
            <el-form-item label="所属年度：">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.select_year}
                class="budget-select"
                placeholder="请选择所属年度"
                style="width: 100%"
              >
                {this.currentYearOptions.map((el, index) => {
                  return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
                })}
              </el-select>
            </el-form-item>
          </el-form>
          {/* <div class="des-value">数据更新时间：2023.02.17</div>*/}
        </tg-card>
        <tg-card class="budget-card" padding={[0]}>
          <div class="budget-div" style={{ height: this.topCardHeightStr }}>
            <div class="header-div">
              <div
                class="all-target-div"
                onclick={() => {
                  this.onDepartmentBudgetClick('');
                }}
              >
                <div class="title">业务总预算目标</div>
                <div class="target-value">
                  <div class="gmv">
                    <div class="gmv-value">
                      <span>¥ </span>
                      {formatPrice(
                        this.target_data ? this.target_data.all_goal.gmv_goal_value : null,
                      )}
                    </div>
                    <div class="gmv-label">总GMV目标</div>
                  </div>
                  <div class="gmv">
                    <div class="gmv-value">
                      <span>¥ </span>{' '}
                      {formatPrice(
                        this.target_data ? this.target_data.all_goal.revenue_goal_value : null,
                      )}
                    </div>
                    <div class="gmv-label">总营收目标</div>
                  </div>
                </div>
              </div>
              <div class="project-div">
                {this.target_data &&
                  this.target_data.all_business_goal &&
                  this.target_data.all_business_goal.map((item: projectBussinessModel) => {
                    return (
                      <div
                        class="project-type-item"
                        onclick={() => {
                          this.onProjectBudgetClick(item);
                        }}
                      >
                        <div class="title">{item.business_type_name}</div>
                        {renderGoalValue(item.gmv_goal_value, item.revenue_goal_value, true)}
                      </div>
                    );
                  })}
                <div
                  class="project-type-item"
                  onclick={() => {
                    this.onProjectBudgetClick();
                  }}
                >
                  <div class="look-btn">
                    查看所有项目预算明细 <tg-icon name="ico-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
            <div class="department-div">
              {this.department_show && (
                <tg-button
                  class={['left', this.department_left_disable && 'disabled']}
                  icon="ico-arrow-left"
                  onclick={() => {
                    this.onDepartmentClick(-1);
                  }}
                ></tg-button>
              )}

              <div class="department-all" key="department-all" ref="departmentRef">
                <div class="department">
                  {this.split_department_goal &&
                    this.split_department_goal.map((item: any) => {
                      return (
                        <div
                          class={[
                            'department-item',
                            this.select_department_id === item.department_id && 'selected',
                          ]}
                          onclick={() => {
                            this.onSelectDepartmentClick(item.department_id);
                          }}
                        >
                          <div class="title">
                            <span>{item.name} </span>
                            <div
                              class="right"
                              onclick={() => {
                                this.onDepartmentBudgetClick(item);
                              }}
                            >
                              <tg-icon name="ico-arrow-right" />
                            </div>
                          </div>
                          {renderGoalValue(item.gmv_goal_value, item.revenue_goal_value)}
                        </div>
                      );
                    })}
                </div>
              </div>
              {this.department_show && (
                <tg-button
                  class={['right', this.department_right_disable && 'disabled']}
                  icon="ico-arrow-right"
                  onclick={() => {
                    this.onDepartmentClick(1);
                  }}
                ></tg-button>
              )}
            </div>
            <div class="ground-background-div">
              <div
                class="ground-div"
                style={{
                  paddingLeft: this.project_show ? '0' : '24px',
                  paddingRight: this.project_show ? '0' : '24px',
                }}
              >
                <div
                  class="ground-header-div"
                  ref="groundRef"
                  key="ground-header-div"
                  style={{
                    marginLeft: this.project_show ? '34px' : '',
                    marginRight: this.project_show ? '34px' : '',
                    'grid-template-columns': this.select_department_children
                      ? 'repeat(' + this.select_department_children.length + ', 192px)'
                      : 'repeat(2, 192px)',
                  }}
                >
                  {this.select_department_children &&
                    this.select_department_children.map((item: any, index: number) => {
                      return (
                        <div class="ground-title" key={index}>
                          <div class="title">{item.name}</div>
                        </div>
                      );
                    })}
                </div>
                <div class="ground-body-div">
                  {this.project_show && (
                    <tg-button
                      class={['left', this.project_left_disable && 'disabled']}
                      icon="ico-arrow-left"
                      onclick={() => {
                        this.onProjectClick(-1);
                      }}
                    ></tg-button>
                  )}
                  <div
                    class="ground-all-item"
                    ref="projectRef"
                    key="ground-all-item"
                    style={{
                      'grid-template-columns': this.select_department_children
                        ? 'repeat(' + this.select_department_children.length + ', 192px)'
                        : 'repeat(2, 192px)',
                    }}
                  >
                    {this.select_department_children &&
                      this.select_department_children.map((item: any) => {
                        return (
                          <div class="ground-item">
                            <div class="goal-div">
                              <div class="line-div">
                                <div class="item-icon">
                                  <img src={icon_dashboard_gmv} alt="" />
                                </div>
                                <div>GMV目标：</div>
                                <div class="gmv-value">
                                  <span>¥ </span>
                                  {formatPrice(item.gmv_goal_value)}
                                </div>
                              </div>
                              <div class="line-div">
                                <div class="item-icon">
                                  <img src={icon_dashboard_income} alt="" />
                                </div>
                                <div>营收目标：</div>
                                <div class="gmv-value">
                                  <span>¥ </span>
                                  {formatPrice(item.revenue_goal_value)}
                                </div>
                              </div>
                            </div>
                            <div class="project-all-div">
                              {item.project_datas &&
                                item.project_datas.map((sub_item: any) => {
                                  return (
                                    <div class="project-item-div">
                                      <div class="item-title">
                                        <div class="circle"></div>
                                        <div>{sub_item.project_name}</div>
                                      </div>
                                      <div class="target-value">
                                        <div class="gmv">
                                          <div class="gmv-value">
                                            <span>¥ </span>
                                            {formatPrice(sub_item.gmv_goal_value)}
                                          </div>
                                          <div class="gmv-label">
                                            <span class="blue line"></span>
                                            <span>GMV目标</span>
                                          </div>
                                        </div>
                                        <div class="gmv">
                                          <div class="gmv-value">
                                            <span>¥ </span>{' '}
                                            {formatPrice(sub_item.revenue_goal_value)}
                                          </div>
                                          <div class="gmv-label">
                                            <span class="orange line"></span>
                                            <span>营收目标</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              {!item.project_datas ||
                                (item.project_datas.length === 0 && (
                                  <div class="no-project-div">-暂无项目数据-</div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  {this.project_show && (
                    <tg-button
                      class={['right', this.project_right_disable && 'disabled']}
                      icon="ico-arrow-right"
                      onclick={() => {
                        this.onProjectClick(1);
                      }}
                    ></tg-button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </tg-card>
      </tg-card>
    );
  },
});
