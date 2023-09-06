/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-22 16:11:51
 */
import { defineComponent } from '@vue/composition-api';
import { useData } from './use/useData';
import sunburst from '@/modules/datacenter/shoplive/components/dailyDetailSunburst/index.vue';
import dailyDetailFunnel from '@/modules/datacenter/shoplive/components/dailyDetailFunnel/funnel.vue';
import dailyDetailList from '../../components/dailyDetailList/index.vue';

export default defineComponent({
  components: {
    sunburst,
    dailyDetailFunnel,
    dailyDetailList,
  },
  setup(props, ctx) {
    const dataLogic = useData(ctx);

    return {
      ...dataLogic,
    };
  },
  mounted() {
    this.onRefresh();
  },
  methods: {
    onRefresh() {
      const container: any = document.getElementsByClassName('data-field');
      container[0].scrollTop = 0;
      container[0].scrollLeft = 0;
    },
  },
  render() {
    return (
      <div class="tg-datacenter-shoplive-daily-detail" style="height: calc(100% - 50px);">
        <section class="filter-field">
          <div class="filter-item date">
            <span class="label">选择日期：</span>
            <el-date-picker
              editable={false}
              clearable={false}
              v-model={this.queryForm.date}
              type="date"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              size="mini"
            ></el-date-picker>
          </div>
          <div class="filter-item group">
            <span class="label">选择项目组：</span>
            <el-select
              popper-class="el-select-popper-mini"
              v-model={this.queryForm.department_id}
              placeholder="请选择"
              size="mini"
            >
              <el-option key="undefined-1" label="全部" value={undefined}></el-option>
              {this.departmentList.map((el: any) => (
                <el-option key={el.id} label={el.name} value={el.id}></el-option>
              ))}
            </el-select>
          </div>
          <div class="filter-item group">
            <span class="label">选择项目类型：</span>
            <el-select
              popper-class="el-select-popper-mini"
              v-model={this.queryForm.business_type}
              placeholder="请选择"
              size="mini"
            >
              <el-option label="全部" value={undefined} key={undefined}></el-option>
              {E.project.ProjectTypeOption.filter(el => el.value !== 5).map((el, index) => {
                return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
              })}
            </el-select>
          </div>
        </section>
        <div style="background-color: #F6F6F6; height: 10px;"></div>
        <section class="data-field">
          <div style="min-width: 1264px;">
            <div class="projects-data" v-loading={this.loading}>
              {/* <el-table
                border
                data={this.projectItems}
                // style={
                //   this.loading && !(this.oldProjectsData?.length ?? 0) ? 'visibility: hidden' : ''
                // }
                cell-style={({ columnIndex }: { columnIndex: number }) => {
                  if (columnIndex === this.selectedColIndex) {
                    return {
                      backgroundColor: 'var(--table-focus-row-bg-color)',
                    };
                  }
                  return {};
                }}
                // header-cell-style={({ columnIndex }: { columnIndex: number }) => {
                //   if (columnIndex === this.selectedColIndex) {
                //     return {
                //       backgroundColor: 'var(--table-focus-row-bg-color) !important',
                //     };
                //   }
                //   return {};
                // }}
                on-cell-click={this.onCellClick}
                on-header-click={this.onHeaderClick}
                span-method={this.objSpanMethod}
              >
                {this.projectsColumns.map((col, colIndex) => (
                  <el-table-column props={{ ...col }} key={colIndex} />
                ))}
                <template slot="empty">
                  <empty-common detail-text="暂无数据"></empty-common>
                </template>
              </el-table> */}
              <dailyDetailList
                v-loading={this.loading}
                data={this.projectsData}
                department_id={this.queryForm.department_id}
                on-selectChanged={this.onSelectChanged}
                day_arr={this.queryForm.date}
              ></dailyDetailList>
            </div>
            <div style="border-bottom: 1px dashed var(--border-line-div-color); margin: 25px 0;"></div>
            <div class="project-charts-row">
              <div class="project-title">
                <span class="project-label">当前分析项目：</span>
                <span class="project-name">
                  {this.currentProject ? this.currentProject.project_name : '--'}
                </span>
              </div>
              <div class="project-charts">
                <div class="project-sunburst">
                  <div class="charts-title">流量构成</div>
                  <sunburst
                    class="dashboard-chart"
                    style="height: 290px; margin-top: 16px;"
                    loading={this.sunBurstLoading || this.loading}
                    // totalAmount={sunburstTotalAmount}
                    series={this.sunBurstSeries}
                    on-selectParamClick={this.selectClick}
                  ></sunburst>
                </div>
                <div class="project-funnel">
                  <div class="charts-title">成交漏斗</div>
                  <dailyDetailFunnel
                    style="height: 322px;"
                    v-loading={this.funnelLoading || this.loading}
                    data={(this.funnelData ?? []).map(el => el.value)}
                  ></dailyDetailFunnel>
                </div>
              </div>
            </div>
            <div class="one-project-table">
              <div class="one-project-title">当日爆款</div>
              <el-table
                class="mgt-12"
                border
                v-loading={this.topGoodsLoading || this.loading}
                data={this.oneProjectData}
                // height={this.tableProps.height}
              >
                {this.oneProjectColumns.map((col, colIndex) => (
                  <el-table-column props={{ ...col }} key={colIndex} />
                ))}
                <template slot="empty">
                  <empty-common detail-text="暂无数据"></empty-common>
                </template>
              </el-table>
            </div>
          </div>
        </section>
      </div>
    );
  },
});
