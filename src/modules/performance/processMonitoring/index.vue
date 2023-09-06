<template>
  <div class="processMonitoring-box tg-page-container">
    <tg-card class="flex-none" :padding="[16]" style="border-bottom: 10px #f4f5f6 solid">
      <el-form
        class="filter-form flex-form"
        size="mini"
        :show-message="false"
        :inline="true"
        label-width="60px"
        @submit.native.prevent
      >
        <el-form-item label="考核名称：">
          <Select
            style="width: 195px"
            popper-class="el-select-popper-mini"
            @change="
              reqFeishuDep.run({
                assessment_management_id: formData.assessment_management_id,
              })
            "
            :clearable="false"
            :options="assessment_management_options"
            v-model="formData.assessment_management_id"
          />
        </el-form-item>
        <el-form-item label="考核部门：">
          <treeSelect
            clearable
            style="width: 195px"
            :selectMultiple="true"
            v-model="formData.department_ids"
            :data="reqFeishuDep.data"
            :props="{
              label: 'name',
              children: 'sons',
            }"
          ></treeSelect>
        </el-form-item>
        <el-form-item v-if="permissions.export">
          <!-- <tg-button type="primary" @click="onQueryClick">查询</tg-button> -->
          <!-- <tg-button class="mgl-8" @click="reset"> 重置 </tg-button> -->
          <tg-button @click="onExportList">导出</tg-button>
        </el-form-item></el-form
      >
    </tg-card>
    <!-- <tg-card class="flex-none category-table" :padding="[0, 0, 0, 0]"> -->
    <div class="category-table table-field">
      <tg-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        height="100%"
        stripe
        border
        default-expand-all
        :tree-props="{ children: 'sons', hasChildren: 'hasChildren' }"
        :summary-method="getSummaries"
        :row-style="rowHightlight"
        :show-summary="false"
      >
        <el-table-column
          fixed
          prop="name"
          label="部门"
          class-name="rightBorderColor"
          min-width="200"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="考核基础信息" min-width="170" class-name="rightBorderColor">
          <!-- :class-name=" index % 2 === 0 ? 'department-fund-statement-head-even' :
            'department-fund-statement-head-odd' " -->
          <el-table-column
            class-name="sub_cell"
            prop="assessment_management_name"
            label="考核名称"
            min-width="160"
            align="center"
            :show-overflow-tooltip="true"
          >
            <!-- <template slot-scope="scoped">
                <div>
                  <span>{{ scoped.row.assessment_management_name }}</span>
                </div>
              </template> -->
          </el-table-column>
          <el-table-column
            prop="assess_user_count"
            label="考核人数"
            min-width="95"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            class-name="rightBorderColor"
            prop="evaluation_group_count"
            label="考评组个数"
            min-width="95"
            align="center"
            :show-overflow-tooltip="true"
          >
            <!-- <template #header>
                <div style="display: flex; justify-content: center">
                  <span>退货率</span
                  ><el-popover
                    placement="top-start"
                    title=""
                    width="200"
                    trigger="hover"
                    content="退货率=退货额/总销额"
                  >
                    <el-button class="icon-btn" slot="reference">
                      <tg-icon
                        name="ico-icon_explain"
                        style="font-size: 14px; color: var(--text-third-color)"
                      ></tg-icon>
                    </el-button>
                  </el-popover>
                </div>
              </template> -->
          </el-table-column>
        </el-table-column>
        <el-table-column label="考核指标统计" class-name="rightBorderColor" min-width="170">
          <el-table-column
            class-name="sub_cell"
            prop="indicator_count"
            label="考核指标个数"
            min-width="105"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="add_indicator_count"
            label="新增指标个数"
            min-width="105"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="del_indicator_count"
            class-name="rightBorderColor"
            label="删减指标个数"
            min-width="105"
            align="center"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <!-- <el-table-column
              prop="update_indicator_count"
              label="修改指标个数"
              min-width="105"
              align="center"
              :show-overflow-tooltip="true"
            >
            </el-table-column> -->
        </el-table-column>
        <el-table-column
          label="各考核节点实施情况统计"
          class-name="rightBorderColor"
          min-width="170"
        >
          <el-table-column
            class-name="sub_cell"
            label="目标制定节点各部门平均耗时对比"
            min-width="130"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template #header>
              <div style="display: flex; justify-content: center">
                <span>目标制定节点</span
                ><el-popover title="" width="600" trigger="click">
                  <span
                    slot="reference"
                    style="color: var(--theme-color); cursor: pointer; margin-left: 5px"
                    >各部门平均耗时对比</span
                  >
                  <template>
                    <div style="min-width: 600px">
                      <base-echarts
                        v-if="chartCollection['目标制定耗时数据'].xAxis.data.length > 0"
                        style="width: 600px; height: 350px"
                        ref="myChart"
                        :options="chartCollection['目标制定耗时数据']"
                      />
                      <empty v-else />
                    </div>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column
              prop="goal_setting_count"
              label="按时完成人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.goal_setting_count }}
                  ({{ (scoped.row.goal_setting_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="goal_setting_overdue_count"
              label="逾期操作人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.goal_setting_overdue_count }}
                  ({{ (scoped.row.goal_setting_overdue_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="name"
            label="目标确认节点各部门平均耗时对比"
            min-width="120"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template #header>
              <div style="display: flex; justify-content: center">
                <span>目标确认节点</span
                ><el-popover title="" width="600" trigger="click">
                  <span
                    slot="reference"
                    style="color: var(--theme-color); cursor: pointer; margin-left: 5px"
                    >各部门平均耗时对比</span
                  >
                  <template>
                    <div style="min-width: 600px">
                      <base-echarts
                        v-if="chartCollection['目标确认耗时数据'].xAxis.data.length > 0"
                        style="width: 600px; height: 350px"
                        ref="myChart"
                        :options="chartCollection['目标确认耗时数据']"
                      />
                      <empty v-else />
                    </div>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column
              prop="target_confrim_count"
              label="按时完成人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.target_confrim_count }}
                  ({{ (scoped.row.target_confrim_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="target_confrim_overdue_count"
              label="逾期操作人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.target_confrim_overdue_count }}
                  ({{ (scoped.row.target_confrim_overdue_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="name"
            label="自评节点各部门平均耗时对比"
            min-width="110"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template #header>
              <div style="display: flex; justify-content: center">
                <span>自评节点</span
                ><el-popover title="" width="600" trigger="click">
                  <span
                    slot="reference"
                    style="color: var(--theme-color); cursor: pointer; margin-left: 5px"
                    >各部门平均耗时对比</span
                  >
                  <template>
                    <div style="min-width: 600px">
                      <base-echarts
                        v-if="chartCollection['自评耗时数据'].xAxis.data.length > 0"
                        style="width: 600px; height: 350px"
                        ref="myChart"
                        :options="chartCollection['自评耗时数据']"
                      />
                      <empty v-else />
                    </div>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column
              prop="self_evaluation_count"
              label="按时完成人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.self_evaluation_count }}
                  ({{ (scoped.row.self_evaluation_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="self_evaluation_overdue_count"
              label="逾期操作人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.self_evaluation_overdue_count }}
                  ({{ (scoped.row.self_evaluation_overdue_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="name"
            label="上级评分节点各部门平均耗时对比"
            min-width="110"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template #header>
              <div style="display: flex; justify-content: center">
                <span>上级评分节点</span
                ><el-popover title="" width="600" trigger="click">
                  <span
                    slot="reference"
                    style="color: var(--theme-color); cursor: pointer; margin-left: 5px"
                    >各部门平均耗时对比</span
                  >
                  <template>
                    <div style="min-width: 600px">
                      <base-echarts
                        v-if="chartCollection['上级评分耗时数据'].xAxis.data.length > 0"
                        style="width: 600px; height: 350px"
                        ref="myChart"
                        :options="chartCollection['上级评分耗时数据']"
                      />
                      <empty v-else />
                    </div>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column
              prop="self_evaluation_count"
              label="按时完成人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.superior_rating_count }}
                  ({{ (scoped.row.superior_rating_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="self_evaluation_overdue_count"
              label="逾期操作人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.superior_rating_overdue_count }}
                  ({{ (scoped.row.superior_rating_overdue_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="name"
            label="签字确认节点各部门平均耗时对比"
            class-name="rightBorderColor"
            min-width="110"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template #header>
              <div style="display: flex; justify-content: center">
                <span>签字确认节点</span
                ><el-popover title="" width="600" trigger="click">
                  <span
                    slot="reference"
                    style="color: var(--theme-color); cursor: pointer; margin-left: 5px"
                    >各部门平均耗时对比</span
                  >
                  <template>
                    <div style="min-width: 600px">
                      <base-echarts
                        v-if="chartCollection['签字确认耗时数据'].xAxis.data.length > 0"
                        style="width: 600px; height: 350px"
                        ref="myChart"
                        :options="chartCollection['签字确认耗时数据']"
                      />
                      <empty v-else />
                    </div>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-table-column
              prop="self_evaluation_count"
              label="按时完成人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.sign_confirm_count }}
                  ({{ (scoped.row.sign_confirm_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="self_evaluation_overdue_count"
              class-name="rightBorderColor"
              label="逾期操作人数（占比）"
              min-width="110"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scoped">
                <div>
                  {{ scoped.row.sign_confirm_overdue_count }}
                  ({{ (scoped.row.sign_confirm_overdue_count_rate * 100).toFixed(0) }}%)
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="重置流程统计" class-name="rightBorderColor" min-width="170">
          <el-table-column
            class-name="sub_cell"
            prop="reset_user_count"
            label="重置人数"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ scoped.row.reset_user_count }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="reset_count"
            label="重置次数"
            class-name="rightBorderColor"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                {{ scoped.row.reset_count }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="转交流程统计" class-name="rightBorderColor" min-width="170">
          <el-table-column
            class-name="sub_cell"
            prop="transfer_user_count"
            label="转交人数"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ scoped.row.transfer_user_count }}</span>
              </div>
            </template></el-table-column
          >
          <el-table-column
            prop="transfer_count"
            label="转交次数"
            class-name="rightBorderColor"
            min-width="80"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                {{ scoped.row.transfer_count }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="绩效申诉统计" class-name="rightBorderColor" min-width="170">
          <el-table-column
            class-name="sub_cell"
            prop="appeal_user_count"
            label="申诉总人数"
            min-width="100"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ scoped.row.appeal_user_count }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="appeal_pass_count"
            label="申诉通过人数"
            min-width="100"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                {{ scoped.row.appeal_pass_count }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="appeal_nopass_count"
            label="申诉未通过人数"
            class-name="rightBorderColor"
            min-width="110"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                {{ scoped.row.appeal_nopass_count }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="绩效等级占比及环比" class-name="rightBorderColor" min-width="170">
          <el-table-column
            class-name="sub_cell"
            prop="level_s_count"
            label="S级"
            min-width="140"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ (scoped.row.level_s_rate * 100).toFixed(0) }}%</span>
                (<span>{{ scoped.row.level_s_count }}人,</span>
                <tg-icon
                  :name="
                    scoped.row.previous_level_s_count >= 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green'
                  "
                />{{ Math.abs(scoped.row.previous_level_s_count) }}人)
              </div>
            </template></el-table-column
          >
          <el-table-column
            prop="level_a_count"
            label="A级"
            min-width="140"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ (scoped.row.level_a_rate * 100).toFixed(0) }}%</span>
                (<span>{{ scoped.row.level_a_count }}人,</span>
                <tg-icon
                  :name="
                    scoped.row.previous_level_a_count >= 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green'
                  "
                />{{ Math.abs(scoped.row.previous_level_a_count) }}人)
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="level_b_count"
            label="B级"
            min-width="140"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ (scoped.row.level_b_rate * 100).toFixed(0) }}%</span>
                (<span>{{ scoped.row.level_b_count }}人,</span>
                <tg-icon
                  :name="
                    scoped.row.previous_level_b_count >= 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green'
                  "
                />{{ Math.abs(scoped.row.previous_level_b_count) }}人)
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="level_c_count"
            label="C级"
            min-width="140"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ (scoped.row.level_c_rate * 100).toFixed(0) }}%</span>
                (<span>{{ scoped.row.level_c_count }}人,</span>
                <tg-icon
                  :name="
                    scoped.row.previous_level_c_count >= 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green'
                  "
                />{{ Math.abs(scoped.row.previous_level_c_count) }}人)
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="level_d_count"
            label="D级"
            class-name="rightBorderColor"
            min-width="140"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div>
                <span>{{ (scoped.row.level_d_rate * 100).toFixed(0) }}%</span>
                (<span>{{ scoped.row.level_d_count }}人,</span>
                <tg-icon
                  :name="
                    scoped.row.previous_level_d_count >= 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green'
                  "
                />{{ Math.abs(scoped.row.previous_level_d_count) }}人)
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="绩效奖金发放及环比">
          <el-table-column
            class-name="sub_cell"
            label="S级&A级"
            min-width="200"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scoped">
              <div class="text-overhidden">
                <!-- <span
                    >{{ scoped.row.previous_level_s_bonus }}({{
                      scoped.row.previous_level_a_bonus
                    }})</span
                  > -->
                <span>{{ scoped.row.level_sa_bonus }}</span>
                (<tg-icon
                  :name="
                    scoped.row.level_sa_bonus - scoped.row.previous_level_sa_bonus >= 0
                      ? 'ico-icon_tongyong_shangsheng_16_red'
                      : 'ico-icon_tongyong_xiajiang_16_green'
                  "
                />
                <span>{{
                  Math.abs(
                    (scoped.row.level_sa_bonus - scoped.row.previous_level_sa_bonus).toFixed(2),
                  )
                }}</span
                >)
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <div class="tg-page-empty" slot="empty">
          <empty-common detail-text="暂无数据" />
        </div>
      </tg-table>
    </div>
    <!-- </tg-card> -->
  </div>
</template>
<script src="./index.ts"></script>
<style lang="less" scoped>
.processMonitoring-box {
  // min-width: 1200px;
  .text-overhidden {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .category-table {
    padding: 16px 16px 32px 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    background-color: #ffffff;
    // min-width: 1200px;
    // min-height: 800px;
    // overflow: auto;
    .el-table tr {
      cursor: pointer;
    }

    .overview-btn-group {
      display: flex;
      justify-content: space-between;
    }

    /* table */
    /deep/ .el-table {
      // display: flex;
      // flex-direction: column;

      .ico-question {
        font-size: 14px;
      }

      .el-table__empty-block {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
      }

      tbody {
        .is-right {
          padding-right: 24px;
        }
      }

      & > .el-table__body-wrapper {
        flex: 1 1 0;
      }

      .el-table__fixed,
      .el-table__fixed-right {
        bottom: 0;
        background-color: transparent !important;
      }

      /*.el-table__header {
        .check-label {
          padding-top: 0px !important;
        }
      }*/

      thead > tr > th,
      tbody > tr > td {
        border-right: 1px solid var(--table-border-color);
        border-bottom: 1px solid var(--table-border-color);
      }
      .rightBorderColor {
        border-right: 1px solid var(--border-line-color) !important;
      }
      tbody > tr > td {
        padding-top: 4px;
        padding-bottom: 4px;
        font-size: 12px;

        .cell {
          min-height: 22px;
          line-height: 22px;
        }
      }

      thead > tr > th {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 12px;

        .cell {
          min-height: 22px;
          line-height: 22px;

          .caret-wrapper {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            height: 22px;
            width: 24px;
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
  }
}
</style>
