<script src="./index.ts" lang="ts"></script>

<template>
  <div style="padding: 0 18px 12px 18px">
    <div style="margin-bottom: 24px">
      <div v-loading="trendLoading" style="height: 360px; width: 100%; padding-top: 0px">
        <div v-if="baseOptions.series.length > 0">
          <div
            style="
              height: 360px;
              padding: 6px 12px 12px 6px;
              margin-right: 0px;
              margin-left: 0px;
              border: 1px solid var(--border-line-div-color);
              border-radius: 4px;
            "
          >
            <!--            <div class="echartTitle" style="margin-left: 24px">GMV订单对比趋势</div>-->
            <BaseEcharts style="height: 320px" :options="baseOptions"></BaseEcharts>
          </div>
        </div>
        <div
          v-else
          style="
            height: 360px;
            padding: 120px 12px 12px 0;
            margin-right: 0px;
            margin-left: 0px;
            margin-top: 0px;
            border: 1px solid var(--border-line-div-color);
            border-radius: 4px;
          "
          v-loading="teamTrendLoading"
        >
          <empty-common :imgWidth="200" :imgHeight="100" />
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
      :default-sort="{ prop: 'present_watch_ucnt', order: 'descending' }"
    >
      <el-table-column
        prop="project_name"
        label="项目"
        align="left"
        min-width="100px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scoped">
          <div>
            <span class="left"> {{ scoped.row.project_name || '--' }}</span>
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
          <div>
            <span class="left"> {{ scope.row.department_name || '--' }} </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="present_watch_ucnt"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '总观看人数'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_watch_ucnt !== null
              ? formatAmount(Number(scope.row.present_watch_ucnt || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="history_watch_ucnt"
        :label="'上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '总观看人数'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.history_watch_ucnt !== null
              ? formatAmount(Number(scope.row.history_watch_ucnt || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="watch_ucnt_link_ratio"
        label="观看人数环比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div class="huanbi">
            <span
              v-if="scope.row.watch_ucnt_link_ratio > 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
            <span
              v-else-if="scope.row.watch_ucnt_link_ratio < 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
            <span>{{
              scope.row.watch_ucnt_link_ratio !== null
                ? formatAmount(Math.abs(scope.row.watch_ucnt_link_ratio), 'None') + '%'
                : '--'
            }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column
        prop="present_avg_gmv"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '人均价值'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_avg_gmv !== null
              ? formatAmount(scope.row.present_avg_gmv || 0, 'None')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="history_avg_gmv"
        :label="'上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '人均价值'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.history_avg_gmv !== null
              ? formatAmount(scope.row.history_avg_gmv || 0, 'None')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="avg_gmv_link_ratio"
        label="人均价值环比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div class="huanbi">
            <span
              v-if="scope.row.avg_gmv_link_ratio > 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
            <span
              v-else-if="scope.row.avg_gmv_link_ratio < 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
            <span>{{
              scope.row.avg_gmv_link_ratio !== null
                ? formatAmount(Math.abs(scope.row.avg_gmv_link_ratio), 'None') + '%'
                : '--'
            }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column
        prop="present_max_online_cnt"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '最高在线'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_max_online_cnt !== null
              ? formatAmount(Number(scope.row.present_max_online_cnt || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="history_max_online_cnt"
        :label="'上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '最高在线'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.history_max_online_cnt !== null
              ? formatAmount(Number(scope.row.history_max_online_cnt || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="present_natural_flow"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '自然流量'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_natural_flow !== null
              ? formatAmount(Number(scope.row.present_natural_flow || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="present_at_flow"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '付费流量'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_at_flow !== null
              ? formatAmount(Number(scope.row.present_at_flow || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <template #empty>
        <empty-common :imgWidth="200" :imgHeight="100" />
      </template>
    </el-table>
    <div style="flex: 1; margin-top: 24px">
      <div v-loading="daytrendLoading" style="height: 354px; width: 100%; padding-top: 0px">
        <div class="echartTitle" style="margin-bottom: 18px">
          <span style="color: 5a5a5a; font-weight: 400">当前分析项目：</span>{{ project_name }}
        </div>
        <div v-if="baseProjectOptions.series.length > 0">
          <div
            style="
              height: 320px;
              border: 1px solid var(--border-line-div-color);
              border-radius: 4px;
              padding: 8px 12px 18px 6px;
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
          v-loading="daytrendLoading"
        >
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
    </div>
    <div
      style="
        height: 464px;
        margin-top: 24px;
        border: 1px solid var(--border-line-div-color);
        border-radius: 4px;
      "
    >
      <div class="echartTitle" style="margin-left: 32px; padding-top: 24px">流量构成</div>
      <div style="display: flex; height: 340px; justify-content: center">
        <div style="width: 490px; margin-top: 10px">
          <div
            v-if="osunBurstData.length > 0"
            style="width: 560px; height: 440px; margin: auto; display: flex; flex-direction: column"
          >
            <div style="padding-left: 50px; width: 426px; height: 320px; position: relative">
              <sunburst
                itemName="直播间观看次数"
                style="width: 320px; height: 320px; position: absolute"
                :loading="sunBurstLoading"
                :series="{ data: osunBurstData, children: osunBurstChildrenData }"
                @selectParamClick="selectClick"
              ></sunburst>
              <div
                style="
                  background: transparent;
                  width: 88px;
                  height: 88px;
                  border-radius: 100px;
                  position: absolute;
                  cursor: pointer;
                  margin-top: 106px;
                  margin-left: 106px;
                  z-index: 3;
                "
                @click="onClickAllColor"
              ></div>
            </div>
          </div>
          <div v-else style="width: 320px; height: 320px; margin: auto; padding-top: 120px">
            <empty-common :imgWidth="200" :imgHeight="100" />
          </div>
        </div>
        <div
          v-loading="sunBurstDetailLoading"
          style="margin-left: -108px; width: 640px; height: 100%; display: flex"
        >
          <div>
            <div class="toptrianglediv"></div>
            <div class="bottomtrianglediv"></div>
          </div>
          <div class="sundetail">
            <div class="echartTitle" style="font-weight: 400; margin: 24px 0 12px 0; width: 400px">
              <span style="display: inline-block"> 流量来源：{{ select_flow_name || '--' }} </span>
              <span style="display: inline-block; margin-left: 48px">
                直播间观看次数：{{
                  sunBurstDetail || watch_cnt
                    ? formatAmount(
                        Number(sunBurstDetail ? sunBurstDetail.watch_cnt : watch_cnt).toFixed(0),
                        'None',
                        true,
                      )
                    : '--'
                }}
              </span>
            </div>
            <div v-if="sunBurstDetail && sunBurstDetail.watch_cnt !== null">
              <div class="detailspan" style="margin-bottom: 4px">流量承接分析</div>
              <div class="echartTitle" style="margin-left: 0px; margin-bottom: 12px; width: 440px">
                <span class="detailtitle">
                  平均观看时长： {{ getSecondsabe(sunBurstDetail.avg_watch_duration, 0, '秒') }}
                </span>
                <span class="detailtitle" style="margin-left: 18px">
                  观看互动率：{{ getSecondsabe(sunBurstDetail.watch_interact_ratio, 2, '%') }}
                </span>
              </div>
              <div class="detailspan" style="margin-bottom: 4px">流量转化分析</div>
              <div class="echartTitle" style="margin-left: 0px; margin-bottom: 12px; width: 440px">
                <span class="detailtitle">
                  成交金额：¥ {{ formatAmount((sunBurstDetail.pay_amt || 0) / 100, 'None') }}
                </span>
                <span class="detailtitle" style="margin-left: 18px">
                  客单价：¥ {{ formatAmount((sunBurstDetail.cnt_unit_amt || 0) / 100, 'None') }}
                </span>
              </div>
              <div class="echartTitle" style="margin-left: 0px; margin-bottom: 12px; width: 440px">
                <span class="detailtitle">
                  成交次数：{{
                    formatAmount(Number(sunBurstDetail.pay_cnt || 0).toFixed(0), 'None', true)
                  }}
                </span>
                <span class="detailtitle" style="margin-left: 18px">
                  观看-成交转化率：{{ sunBurstDetail.watch_pay_ratio }}%
                </span>
              </div>
            </div>
            <div v-else style="margin-top: 18px">
              <!--<div style="height: 38px; color: #a4b2c2; margin-bottom: 6px">
                {{ select_flow_type_name === '付费流量' ? '付费流量暂不提供流量分析' : '' }}
              </div>-->
              <div style="margin-right: 50px; margin-top: 60px">
                <empty-common style="width: 260px; margin: auto" :imgWidth="200" :imgHeight="100" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectosunBurstData.length > 0" class="el-props">
        <div
          style="
            width: 100%;
            text-align: left;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
          "
        >
          <div
            v-for="item in selectosunBurstData"
            :key="item.name"
            style="margin-left: 6px; margin-bottom: 6px; display: inline-block"
          >
            <div
              style="
                display: inline-block;
                width: 80px;
                height: 14px;
                line-height: 14px;
                padding-right: 6px;
              "
              :style="{
                width:
                  selectosunBurstData.length > 6
                    ? '80px'
                    : selectosunBurstData.length === 1
                    ? '180px'
                    : '120px',
              }"
            >
              <span
                style="
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  margin-top: 1px;
                  border-radius: 2px;
                "
                :style="{ background: item.itemStyle.color }"
              ></span>
              <tg-textPopover
                :text="item.name"
                style="
                  display: inline-block;
                  margin-left: 4px;
                  color: #343f4c;
                  font-size: 12px;
                  width: 56px;
                "
                :style="{
                  width:
                    selectosunBurstData.length > 6
                      ? '56px'
                      : selectosunBurstData.length === 1
                      ? '150px'
                      : '90px',
                }"
                :maxWidth="
                  selectosunBurstData.length > 6 ? 56 : selectosunBurstData.length === 1 ? 150 : 90
                "
              ></tg-textPopover>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          height: 22px;
          &.huanbi {
            text-align: left;
            width: 100px;
            padding-left: 24px;
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
  margin-left: 0px;
}

/deep/ .el-table {
  .el-table__empty-block {
    width: 200px !important;
    height: 200px !important;
    position: absolute;
    top: 20px;
    margin-left: -100px;
  }

  thead > tr > th {
    line-height: 22px;
    padding: 5px 12px !important;
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
.toptrianglediv {
  margin-top: 96px;
  width: 172px;
  background-color: var(--border-line-div-color);
  height: 1px;
  transform: rotate(-60deg);
}
.bottomtrianglediv {
  width: 172px;
  margin-top: 148px;
  margin-left: 0px;
  height: 1px;
  background-color: var(--border-line-div-color);
  transform: rotate(-120deg);
}
.sundetail {
  width: 490px;
  border-bottom: 1px solid var(--border-line-div-color);
  border-top: 1px solid var(--border-line-div-color);
  border-right: 1px solid var(--border-line-div-color);
  height: 298px;
  margin-right: 12px;
  margin-left: -43px;
  margin-top: 22px;
  padding-left: 24px;
}
.detailspan {
  height: 32px;

  font-weight: 400;
  font-size: 12px;
  color: var(--text-second-color);
  line-height: 32px;
}
.detailtitle {
  display: inline-block;
  text-align: left;
  padding-left: 18px;
  width: 200px;
  height: 40px;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-color);
  line-height: 40px;
  background: #f5f5f5;
  border: 0 solid var(--border-line-div-color);
  border-radius: 2px;
}
.line-one {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  margin-left: 6px;
  flex: 1;
}
.el-props {
  width: 1050px;
  font-size: 12px;
  color: #343f4c;
  overflow: hidden;
  flex: 1;
  margin: 10px auto;
}
/*/deep/ .el-table .el-table__body .el-table__row {
      .el-table__cell:first-child,
      .el-table__cell:nth-child(2) {
        background: #f6f6f6 !important;
      }
    }*/
</style>
