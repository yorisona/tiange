<script src="./index.ts" lang="ts"></script>

<template>
  <div style="padding: 0 18px 12px 18px">
    <div style="margin-bottom: 24px">
      <div v-loading="trendLoading" style="height: 404px; width: 100%; padding-top: 0px">
        <div
          style="
            height: 404px;
            padding: 24px 12px 12px 0;
            margin-right: 0px;
            margin-left: 0px;
            border: 1px solid var(--border-line-div-color);
            border-radius: 4px;
          "
        >
          <div class="echartTitle" style="margin-left: 24px">GMV订单对比趋势</div>
          <div v-if="baseOptions.series.length > 0">
            <BaseEcharts style="height: 330px" :options="baseOptions"></BaseEcharts>
          </div>
          <div
            v-else
            style="
              height: 340px;
              padding: 120px 12px 12px 0;
              margin-right: 0px;
              margin-left: 0px;
              margin-top: 0px;
            "
            v-loading="trendLoading"
          >
            <empty-common :imgWidth="200" :imgHeight="100" />
          </div>
        </div>
      </div>
    </div>
    <el-table
      class="table-div"
      ref="singleTable"
      highlight-current-row
      @cell-click="row => onViewBtnClick(row)"
      border
      :data="list"
      v-loading="detailLoading"
      :default-sort="{ prop: 'gmv_completion_rate', order: 'descending' }"
    >
      <el-table-column
        prop="project_name"
        label="项目"
        align="left"
        min-width="100px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scoped">
          <div class="two">
            <span class="left">{{ scoped.row.project_name || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="department_name"
        label="所属项目组"
        min-width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <div class="two">
            <span class="left"> {{ scope.row.department_name || '--' }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="current_total_goal_gmv"
        label="截至当前目标 (元)"
        align="right"
        min-width="136px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.current_total_goal_gmv !== null
              ? formatAmount(
                  (Number(scope.row.current_total_goal_gmv || 0) / 100).toFixed(0),
                  'None',
                  true,
                )
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="goal_gmv"
        label="整体目标 (元)"
        align="right"
        min-width="120px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.goal_gmv !== null
              ? formatAmount((Number(scope.row.goal_gmv || 0) / 100).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="gmv" label="完成GMV (元)" align="right" min-width="140px" sortable>
        <template slot-scope="scope">
          {{
            scope.row.gmv !== null ? formatAmount(Number(scope.row.gmv || 0) / 100, 'None') : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="current_total_gmv_completion_rate"
        label="截至当前完成率"
        align="right"
        min-width="120px"
        sortable
      >
        <template slot-scope="scope">
          <div class="two" style="padding-right: 12px">
            {{
              scope.row.current_total_gmv_completion_rate !== null
                ? scope.row.current_total_gmv_completion_rate + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="gmv_completion_rate"
        label="整体完成率"
        align="right"
        min-width="96px"
        sortable
      >
        <template slot-scope="scope">
          <div class="two" style="padding-right: 12px">
            {{
              scope.row.gmv_completion_rate !== null ? scope.row.gmv_completion_rate + '%' : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="distance_to_goal_gmv"
        label="差额 (元)"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div class="two">
            <span
              v-if="scope.row.distance_to_goal_gmv"
              style="display: inline-block; text-align: left; padding-top: 0px"
              :style="{ color: scope.row.distance_to_goal_gmv > 0 ? '#f30220' : '' }"
              class="tgicon"
              >{{
                scope.row.distance_to_goal_gmv !== null
                  ? formatAmount(Number(scope.row.distance_to_goal_gmv || 0) / 100, 'None')
                  : '--'
              }}
            </span>
            <span v-else>--</span>
          </div></template
        >
      </el-table-column>
      <el-table-column
        prop="gmv_incr_rate"
        label="GMV环比"
        align="right"
        min-width="100px"
        sortable
      >
        <template slot-scope="scope">
          <div class="two huanbi">
            <span
              v-if="scope.row.gmv_incr_rate > 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
            <span
              v-else-if="scope.row.gmv_incr_rate < 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
            <span>{{
              scope.row.gmv_incr_rate !== null
                ? formatAmount(Math.abs(scope.row.gmv_incr_rate), 'None') + '%'
                : '--'
            }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column
        prop="current_week_daily_gmv"
        :label="
          '本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '日均GMV (元)'
        "
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.current_week_daily_gmv !== null
              ? formatAmount(Number(scope.row.current_week_daily_gmv || 0) / 100, 'None')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="last_week_daily_gmv"
        :label="
          '上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '日均GMV (元)'
        "
        align="right"
        min-width="150px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.last_week_daily_gmv !== null
              ? formatAmount(Number(scope.row.last_week_daily_gmv || 0) / 100, 'None')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="daily_gmv_incr_rate"
        label="日均增长"
        align="right"
        min-width="120px"
        sortable
      >
        <template slot-scope="scope">
          <div class="two" style="padding-right: 12px">
            <span
              v-if="scope.row.daily_gmv_incr_rate"
              style="display: inline-block; text-align: left; padding-top: 0px"
              :style="{ color: scope.row.daily_gmv_incr_rate < 0 ? '#f30220' : '' }"
              class="tgicon"
              >{{
                scope.row.daily_gmv_incr_rate !== null
                  ? formatAmount(Number(scope.row.daily_gmv_incr_rate || 0), 'None') + '%'
                  : '--'
              }}
            </span>
            <span v-else>--</span>
          </div></template
        >
      </el-table-column>
      <template #empty>
        <empty-common :imgWidth="200" :imgHeight="100" />
      </template>
    </el-table>
    <div style="flex: 1; margin-top: 24px">
      <div v-loading="daytrendLoading" style="height: 356px; width: 100%; padding-top: 0px">
        <div class="echartTitle" style="margin-bottom: 18px">
          <span style="color: 5a5a5a; font-weight: 400">当前分析项目：</span
          >{{ project_name || '--' }}
        </div>
        <div v-if="baseProjectOptions.series.length > 0">
          <div
            style="
              height: 320px;
              border: 1px solid var(--border-line-div-color);
              border-radius: 4px;
              padding: 8px 12px 18px 0px;
            "
          >
            <BaseEcharts :options="baseProjectOptions"></BaseEcharts>
          </div>
        </div>
        <div
          v-else
          style="
            padding-top: 100px;
            height: 320px;
            border: 1px solid var(--border-line-div-color);
            border-radius: 4px;
          "
          v-loading="loading"
        >
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
    </div>
    <tg-card :padding="0" class="flex-auto" style="margin-top: 24px">
      <div class="main-table" ref="imageTofile">
        <div
          v-loading="loading"
          class="main-item"
          :class="lastData.length === 0 && lastLastData.length === 0 ? 'isnodata' : ''"
        >
          <h3 class="main-item-title">
            {{
              analyseType === 1 ? '第' + lastLastWeekNum + '周' : '第' + lastLastWeekNum + '月'
            }}TOP
          </h3>
          <Table :list="lastLastData" :row-style="rowColors" />
        </div>
        <div
          v-loading="loading"
          class="main-item last-week"
          style="padding-right: 2px"
          :class="lastData.length === 0 && lastLastData.length === 0 ? 'isnodata' : ''"
        >
          <h3 class="main-item-title">
            {{ analyseType === 1 ? '第' + lastWeekNum + '周' : '第' + lastWeekNum + '月' }}TOP
          </h3>
          <Table :list="lastData" :row-style="rowColors" :rank="true" />
        </div>
      </div>
    </tg-card>
  </div>
</template>

<style lang="less" scoped>
.table-div {
  /deep/ .el-table__body .el-table__row {
    .el-table__cell {
      padding-top: 5px;
      padding-bottom: 5px;
      .cell {
        height: 100%;
        div {
          line-height: 22px;
          &.two {
            height: 22px;
            &.huanbi {
              text-align: left;
              width: 80px;
              padding-left: 12px;
            }
          }
          .left {
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 1;
            display: inline-block;
            width: 100%;
          }
        }
      }
    }
  }
}
.echartTitle {
  font-size: var(--small-font-size);
  color: var(--text-color);
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
  width: 80%;
  text-align: left;
  padding: 0;
}
.main-table {
  display: flex;
  justify-content: space-between;
  width: 100%;
  overflow-x: scroll;
  .main-item {
    flex: 1;
    min-width: 780px;
    padding-bottom: 18px;
    /deep/.el-table__empty-block {
      border-bottom: 1px solid #ebeef5;
      /*height: 1013px !important;*/
    }
    &.isnodata {
      /deep/ .el-table {
        height: 450px;
        .el-table__empty-block {
          border-bottom: 0px solid #ebeef5;
          height: 450px !important;
        }
      }
    }
    &.last-week {
      margin-left: 18px;
      min-width: 1120px;
    }
    .main-item-title {
      margin: 0 0 12px 0;
      line-height: 1;
      color: var(--text-color);
      font-weight: 400;
      font-size: 14px;
    }
  }
}
.table-div {
  /deep/ thead > tr > th {
    line-height: 22px;
    padding: 5px 8px !important;
    .cell {
      .caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 22px;
        width: 18px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
        .sort-caret.ascending {
          // border-bottom-color: #c0c4cc; // ui说点击排序icon要有颜色变化
          top: 0px;
        }
        .sort-caret.descending {
          // border-top-color: #c0c4cc; // ui说点击排序icon要有颜色变化
          bottom: 0px;
        }
      }
    }
  }
}

/*/deep/ .el-table .el-table__body .el-table__row {
  .el-table__cell:first-child,
  .el-table__cell:nth-child(2) {
    background: #f6f6f6 !important;
  }
}*/
</style>
