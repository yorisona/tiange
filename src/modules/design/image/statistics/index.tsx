import { formatAmount } from '@/utils/string';
import { defineComponent, onMounted, ref, computed, watch } from '@vue/composition-api';
import sunburst from './charts/sunburst/index.vue';
import bar from './charts/bar/index.vue';
import pie from './charts/pie/index.vue';
import { usePieColors } from '@/modules/finance/fundStatement/use/useColors';
import { wait } from '@/utils/func';
import {
  Get_Reservation_Statistics,
  Get_Reservation_Statistics_Business_Type_Sunburst,
  Get_Reservation_Statistics_Pie_Chart,
} from '@/services/design';
import moment from 'moment';
import { useTrendBarBurstColors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
type DateType = 'week' | 'month' | 'year';

interface sunburstDataType {
  name: string;
  value: number | undefined;
  children: sunburstDataType[];
  [key: string]: any;
}

interface PieChartDataMoel {
  [key: number]: {
    loading: boolean;
    data: M.design.ReservatioonStatisticsPieModel[];
  };
}

export default defineComponent({
  component: {
    sunburst,
    bar,
    pie,
  },
  setup: (props, ctx) => {
    const pieChartDataModel = ref(
      (() => {
        const obj: PieChartDataMoel = {};
        E.design.PieChartTypeOption.forEach(el => {
          obj[el.value] = {
            loading: false,
            data: [],
          };
        });
        return obj;
      })(),
    );

    const sunburstDataLoading = ref(false);
    const sunburstData = ref<{ data: sunburstDataType[] }>({
      data: [],
    });

    const reservationStatisticsLoading = ref(false);
    const reservationStatistics = ref<M.design.ReservationStatistics | undefined>(undefined);

    const dateType = ref<DateType>('week');
    const weekDate = ref(moment().startOf('week'));
    const monthDate = ref(moment().startOf('month'));
    const yearDate = ref(moment().startOf('year'));
    let curDate = weekDate;
    const displayDate = computed(() => {
      switch (dateType.value) {
        case 'week': {
          const endDate = weekDate.value.clone().endOf('week');
          return `${curDate.value.format('yyyy第ww周')} (${curDate.value.format(
            'MM月DD日',
          )}-${endDate.format('MM月DD日')})`;
        }
        case 'month':
          return curDate.value.format('yyyy年MM月');
        case 'year':
          return curDate.value.format('yyyy年');
      }
      return '';
    });

    const dateSwitcDisablesList = computed(() => {
      const disables = curDate.value.isSameOrAfter(moment(), dateType.value);
      return [false, disables];
    });

    const methods = {
      onDateatypeSwitch(type: DateType) {
        dateType.value = type;
        curDate = type === 'week' ? weekDate : type === 'month' ? monthDate : yearDate;
      },
      pieItemColorObj(index: number) {
        const color = usePieColors[index];
        return color ? { color } : {};
      },
      async getReservationStatistics() {
        const [start_date, end_date] = methods.dateForParams();
        reservationStatisticsLoading.value = true;
        const [res] = await wait(
          500,
          Get_Reservation_Statistics({
            start_date,
            end_date,
          }),
        );
        reservationStatisticsLoading.value = false;
        if (res.data.success) {
          reservationStatistics.value = res.data.data;
        } else {
          reservationStatistics.value = undefined;
        }
      },
      async getReservationStatisticsBusinessTypeSunburst() {
        const [start_date, end_date] = methods.dateForParams();
        sunburstDataLoading.value = true;
        business_type_id.value = 1000000;
        business_type_name.value = '按业务类型';
        business_type_tree.value?.setCheckedKeys([1000000]);
        const [res] = await wait(
          500,
          Get_Reservation_Statistics_Business_Type_Sunburst({
            start_date,
            end_date,
          }),
        );
        sunburstDataLoading.value = false;
        if (res.data.success) {
          const data = res.data.data;
          sunburstData.value = { data: methods.transSunburstData(data, 1, 0) };
          // business_type_tree.value?.setCheckedKeys([0]);
        } else {
          sunburstData.value = { data: [] };
        }
        business_type_list.value = [
          {
            id: 1000000,
            name: '按业务类型',
            sons: sunburstData.value.data,
          },
        ];
        business_type_tree.value?.setCheckedKeys([1000000]);
      },
      async getReservationStatisticsPieChart(type: E.design.PieChartType) {
        const [start_date, end_date] = methods.dateForParams();
        const model = pieChartDataModel.value[type];
        model.loading = true;
        const [res] = await wait(
          500,
          Get_Reservation_Statistics_Pie_Chart({
            start_date,
            end_date,
            pie_chart_type: type,
          }),
        );
        model.loading = false;
        if (res.data.success) {
          const data = res.data.data;
          model.data = data;
          // reservationStatistics.value = res.data.data;
        } else {
          model.data = [];
        }
      },
      transSunburstData(
        data: M.design.ReservatioonStatisticsSunburstModel[] | undefined,
        level: number,
        lastlevel: number,
      ): any[] {
        if ((data || []).length === 0) {
          return [];
        }
        return (
          data
            ?.filter(el => (el.count || 0) > 0)
            .map((el: any, elIndex: number) => {
              return {
                name: el.key || '--',
                id: Number(level + '' + lastlevel + '' + elIndex),
                value: el.count,
                itemStyle: {
                  color: useTrendBarBurstColors[elIndex],
                },
                disabled: el.key === '创新项目' || el.key === '营销业务',
                sons:
                  el.key === '抖音店播' ||
                  el.key === '淘宝店播' ||
                  el.key === '淘宝甄选' ||
                  el.key === '本地生活'
                    ? level > 1
                      ? []
                      : methods.transSunburstData(el.sub_data, level + 1, elIndex)
                    : [],
                children: methods.transSunburstData(el.sub_data, level + 1, elIndex),
              };
            }) || []
        );
      },
      reload() {
        methods.getReservationStatistics();
        methods.getReservationStatisticsBusinessTypeSunburst();
        E.design.PieChartTypeOption.forEach(el => {
          methods.getReservationStatisticsPieChart(el.value);
        });
      },
      randomHex() {
        return `#${Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padEnd(6, '0')}`;
      },
      dateForParams() {
        const format = 'yyyy-MM-DD';
        const endDate = curDate.value.clone().endOf(dateType.value);
        return [`${curDate.value.format(format)}`, `${endDate.format(format)}`];
      },
      onDateSwitchHandler(increase: boolean) {
        curDate.value = curDate.value.clone().add(increase ? 1 : -1, dateType.value);
      },
      formatAmount,
    };

    onMounted(() => {
      methods.reload();
    });

    watch(
      () => displayDate.value,
      () => {
        methods.reload();
      },
    );
    const business_type_list = ref<any[]>([]);
    const business_type_name = ref<string | undefined>('按业务类型');
    const business_type_id = ref<string | number | undefined>(1000000);
    const business_type_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(
      undefined,
    );
    const handleCheckChange = (data: any) => {
      business_type_tree.value?.setCheckedKeys([]);
      if (business_type_id.value === data.id) {
        business_type_id.value = undefined;
        business_type_name.value = undefined;
      } else {
        business_type_id.value = data.id;
        business_type_name.value = data.name;
        business_type_tree.value?.setCheckedKeys([data.id]);
      }
    };
    const select_tree_data = computed(() => {
      if (!business_type_id.value || business_type_id.value === 1000000) {
        return business_type_list.value[0]?.sons || [];
      } else {
        let list: any[] = [];
        (business_type_list.value[0]?.sons || []).map((item: any) => {
          if (item.id === business_type_id.value) {
            list = item.children || [];
          } else {
            (item.children || []).map((sub: any) => {
              if (sub.id === business_type_id.value) {
                list = sub.children || sub.sons || [sub];
              }
            });
          }
        });
        return list;
      }
    });
    return {
      select_tree_data,
      business_type_list,
      handleCheckChange,
      business_type_tree,
      business_type_name,
      business_type_id,
      pieChartDataModel,
      sunburstData,
      sunburstDataLoading,
      reservationStatistics,
      reservationStatisticsLoading,
      dateType,
      displayDate,
      dateSwitcDisablesList,
      ...methods,
    };
  },
  render() {
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    const [prevDisables, nextDisabled] = this.dateSwitcDisablesList;
    return (
      <div class="tg-design-image-statistics-container">
        <div style="min-width: 1264px;">
          <section class="operator-field">
            <div
              disabled={prevDisables}
              class="date-switch"
              on-click={() => {
                if (prevDisables) {
                  return;
                }
                this.onDateSwitchHandler(false);
              }}
            >
              <tg-icon name="ico-arrow-left"></tg-icon>
            </div>
            <div class="date-text">{this.displayDate}</div>
            <div
              disabled={nextDisabled}
              class="date-switch"
              on-click={() => {
                if (nextDisabled) {
                  return;
                }
                this.onDateSwitchHandler(true);
              }}
            >
              <tg-icon name="ico-arrow-right"></tg-icon>
            </div>
            <div class="date-type-switch">
              <div
                class="date-type-item week"
                selected={this.dateType === 'week'}
                on-click={() => this.onDateatypeSwitch('week')}
              >
                周
              </div>
              <div
                class="date-type-item month"
                selected={this.dateType === 'month'}
                on-click={() => this.onDateatypeSwitch('month')}
              >
                月度
              </div>
              <div
                class="date-type-item year"
                selected={this.dateType === 'year'}
                on-click={() => this.onDateatypeSwitch('year')}
              >
                年度
              </div>
            </div>
          </section>
          <section class="summary-field" v-loading={this.reservationStatisticsLoading}>
            <div class="summary-item">
              <div class="title">
                <tg-icon name="ico-icon_zongtidanshu"></tg-icon>
                <span>总提单数</span>
              </div>
              <div class="content">
                {this.reservationStatistics?.total_valid === null ||
                this.reservationStatistics?.total_valid === undefined
                  ? '--'
                  : this.formatAmount(this.reservationStatistics?.total_valid || 0, 'None', true)}
              </div>
            </div>
            <div class="summary-item">
              <div class="title">
                <tg-icon name="ico-zongjiedanshu"></tg-icon>
                <span>总结单数</span>
              </div>
              <div class="content">
                {this.reservationStatistics?.total_closed === null ||
                this.reservationStatistics?.total_closed === undefined
                  ? '--'
                  : this.formatAmount(this.reservationStatistics?.total_closed || 0, 'None', true)}
              </div>
            </div>
            <div class="summary-item">
              <div class="title">
                <tg-icon name="ico-zongtuidanshu"></tg-icon>
                <span>总退单数</span>
              </div>
              <div class="content">
                {this.reservationStatistics?.total_chargeback === null ||
                this.reservationStatistics?.total_chargeback === undefined
                  ? '--'
                  : this.formatAmount(
                      this.reservationStatistics?.total_chargeback || 0,
                      'None',
                      true,
                    )}
              </div>
            </div>
            <div class="summary-item">
              <div class="title">
                <tg-icon name="ico-zonghaoshi"></tg-icon>
                <span>平均耗时(h)</span>
              </div>
              <div class="content">
                {this.reservationStatistics?.avg_time_consuming === null ||
                this.reservationStatistics?.avg_time_consuming === undefined
                  ? '--'
                  : this.formatAmount(
                      this.reservationStatistics?.avg_time_consuming || 0,
                      'None',
                      true,
                    )}
              </div>
            </div>
            <div class="summary-item">
              <div class="title">
                <tg-icon name="ico-manyidu"></tg-icon>
                <span>满意度</span>
              </div>
              <div class="content">
                {this.reservationStatistics?.satisfaction_ratio === null ||
                this.reservationStatistics?.satisfaction_ratio === undefined
                  ? '--'
                  : `${this.formatAmount(
                      this.reservationStatistics?.satisfaction_ratio || 0,
                      'None',
                      true,
                    )}%`}
              </div>
            </div>
          </section>
          <section class="charts-field">
            <div class="chart-container">
              <div class="chart-title">各妆造师结单统计</div>
              <div class="chart" style="padding: 0 32px 0;height:432px">
                {/* <pie
                  popoverTitle="结单数"
                  style="height: 370px;"
                  loading={this.pieChartDataModel[E.design.PieChartType.CLOSED].loading}
                  // totalAmount={sunburstTotalAmount}
                  series={{
                    data:
                      this.pieChartDataModel[E.design.PieChartType.CLOSED].data?.map(
                        (el, elIdx) => ({
                          name: el.name,
                          value: el.value ?? 0,
                          itemStyle: {
                            ...this.pieItemColorObj(elIdx),
                          },
                        }),
                      ) ?? [],
                  }}
                ></pie>*/}
                <bar
                  style="height:402px;"
                  loading={this.pieChartDataModel[E.design.PieChartType.CLOSED].loading}
                  xData={this.pieChartDataModel[E.design.PieChartType.CLOSED].data.map(
                    el => el.name,
                  )}
                  yLabel={'结单数'}
                  series={[
                    {
                      // name: '比格',
                      type: 'bar',
                      barMaxWidth: 48,
                      barMinWidth: 32,
                      barGap: '30%',
                      barCategoryGap: '33%',
                      itemStyle: {
                        // color: '#4FCA50',
                        borderRadius: 2,
                      },
                      data:
                        this.pieChartDataModel[E.design.PieChartType.CLOSED].data?.map(
                          (el, elIdx) => ({
                            name: el.name,
                            value: el.value ?? 0,
                            itemStyle: {
                              ...this.pieItemColorObj(elIdx),
                            },
                          }),
                        ) ?? [],
                    },
                  ]}
                ></bar>
              </div>
            </div>
            <div class="chart-container no-change-empty-top">
              <div class="chart-title">各业务预约统计</div>
              <div class="chart" style="padding: 0 32px 0;height:432px">
                {/* <sunburst
                  style="height: 400px; margin-top: 26px;"
                  loading={this.sunburstDataLoading}
                  // totalAmount={sunburstTotalAmount}
                  series={this.sunburstData}
                  // on-selectParamClick={this.selectClick}
                ></sunburst>*/}

                <div class="business-type-tree">
                  <el-popover
                    placement="bottom-start"
                    trigger="click"
                    width="370"
                    popper-class="pending-pay-detail-tree-popper el-tree-popper-mini"
                  >
                    <div
                      slot="reference"
                      class="department-tree-select"
                      style="display: block; cursor: pointer;"
                    >
                      {this.business_type_name && (
                        <div class="depart-select-box">
                          <span style="height: var(--default-height); line-height: var(--default-height);overflow:hidden">
                            {this.business_type_name}
                          </span>
                          <i
                            style="margin-top: 8px; color: var(--disabled-color);font-size: var(--small-font-size)"
                            class="el-icon-arrow-down"
                          ></i>
                        </div>
                      )}
                      {!this.business_type_name && (
                        <div class="depart-select-box">
                          <span style="color: var(--disabled-color); height: var(--default-height); line-height: var(--default-height);overflow:hidden">
                            按业务类型
                          </span>
                          <i
                            style="margin-top: 8px; color: var(--disabled-color);font-size: var(--small-font-size)"
                            class="el-icon-arrow-down"
                          ></i>
                        </div>
                      )}
                    </div>
                    <div class="department-tree">
                      <el-tree
                        ref="business_type_tree"
                        props={{
                          props: treeProps,
                        }}
                        check-strictly={true}
                        node-key="id"
                        data={this.business_type_list || []}
                        show-checkbox
                        check-on-click-node
                        // default-expand-all
                        // default-checked-keys="default_checked_department_ids"
                        default-expanded-keys={this.business_type_id ? [this.business_type_id] : []}
                        on-check={this.handleCheckChange}
                      ></el-tree>
                    </div>
                  </el-popover>
                </div>
                <bar
                  style="height:362px;"
                  yLabel={'预约量'}
                  loading={this.sunburstDataLoading}
                  xData={this.select_tree_data.map((el: { name: string }) => el.name)}
                  series={[
                    {
                      // name: '比格',
                      type: 'bar',
                      barMaxWidth: 48,
                      barMinWidth: 32,
                      barGap: '30%',
                      barCategoryGap: '33%',
                      itemStyle: {
                        // color: '#4FCA50',
                        borderRadius: 2,
                      },
                      data: this.select_tree_data ?? [],
                    },
                  ]}
                ></bar>
              </div>
            </div>
          </section>
          <section class="charts-field" style=" grid-template-rows:402px;padding-bottom:62px">
            <div class="chart-container">
              <div class="chart-title">预约主体统计</div>
              <div class="chart" style="padding: 0 32px 0;">
                <pie
                  popoverTitle="预约主体"
                  style="height: 370px"
                  loading={
                    this.pieChartDataModel[E.design.PieChartType.APPOINTMENT_SUBJECT].loading
                  }
                  // totalAmount={sunburstTotalAmount}
                  series={{
                    data:
                      this.pieChartDataModel[E.design.PieChartType.APPOINTMENT_SUBJECT].data?.map(
                        (el, elIdx) => ({
                          name: el.name,
                          value: el.value ?? 0,
                          itemStyle: {
                            ...this.pieItemColorObj(elIdx),
                          },
                        }),
                      ) ?? [],
                  }}
                ></pie>
              </div>
            </div>
            <div class="chart-container">
              <div class="chart-title">妆造类型统计</div>
              <div class="chart" style="padding: 0 32px 0;">
                <pie
                  popoverTitle="妆造类型"
                  style="height: 370px; width: 690px; margin: auto;"
                  loading={this.pieChartDataModel[E.design.PieChartType.IMAGE_TYPE].loading}
                  legend={true}
                  // totalAmount={sunburstTotalAmount}
                  series={{
                    data:
                      this.pieChartDataModel[E.design.PieChartType.IMAGE_TYPE].data?.map(
                        (el, elIdx) => ({
                          name: el.name,
                          value: el.value ?? 0,
                          itemStyle: {
                            ...this.pieItemColorObj(elIdx),
                          },
                        }),
                      ) ?? [],
                  }}
                ></pie>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
});
