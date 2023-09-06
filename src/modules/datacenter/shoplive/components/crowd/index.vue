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
              margin-top: 0px;
              border: 1px solid var(--border-line-div-color);
              border-radius: 4px;
            "
          >
            <BaseEcharts style="height: 320px" :options="baseOptions"></BaseEcharts>
          </div>
        </div>
        <div
          v-else
          style="
            height: 360px;
            padding: 120px 12px 12px 0;
            width: 100%;
            border: 1px solid var(--border-line-div-color);
            border-radius: 4px;
          "
          v-loading="trendLoading"
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
      :default-sort="{ prop: 'present_incr_fans', order: 'descending' }"
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
            <span class="left">{{ scoped.row.project_name || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="department_name" label="所属项目组" min-width="100px" align="center">
        <template slot-scope="scope">
          <div>
            <span class="left">{{ scope.row.department_name || '--' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="present_incr_fans"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '新增粉丝'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.present_incr_fans !== null
              ? formatAmount(Number(scope.row.present_incr_fans || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="history_incr_fans"
        :label="'上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '新增粉丝'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          {{
            scope.row.history_incr_fans !== null
              ? formatAmount(Number(scope.row.history_incr_fans || 0).toFixed(0), 'None', true)
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="incr_fans_link_ratio"
        label="新增粉丝环比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div class="huanbi">
            <span
              v-if="scope.row.incr_fans_link_ratio > 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
            <span
              v-else-if="scope.row.incr_fans_link_ratio < 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
            <span>{{
              scope.row.incr_fans_link_ratio !== null
                ? formatAmount(Math.abs(scope.row.incr_fans_link_ratio), 'None') + '%'
                : '--'
            }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column
        prop="present_incr_fans_ratio"
        :label="'本' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '涨粉率'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.present_incr_fans_ratio !== null
                ? formatAmount(Number(scope.row.present_incr_fans_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="history_incr_fans_ratio"
        :label="'上' + (analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年') + '涨粉率'"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.history_incr_fans_ratio !== null
                ? formatAmount(Number(scope.row.history_incr_fans_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="incr_fans_ratio_link_ratio"
        label="涨粉率环比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div class="huanbi">
            <span
              v-if="scope.row.incr_fans_ratio_link_ratio > 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_shangsheng_16_red"
              ></tg-icon>
            </span>
            <span
              v-else-if="scope.row.incr_fans_ratio_link_ratio < 0"
              style="display: inline-block; text-align: left; padding-top: 0px"
              class="tgicon"
              ><tg-icon
                style="margin: auto 1px"
                name="ico-icon_tongyong_xiajiang_16_green"
              ></tg-icon>
            </span>
            <span>{{
              scope.row.incr_fans_ratio_link_ratio !== null
                ? formatAmount(Math.abs(scope.row.incr_fans_ratio_link_ratio), 'None') + '%'
                : '--'
            }}</span>
          </div></template
        >
      </el-table-column>
      <el-table-column
        prop="purchase_num_ratio"
        label="成交人数占比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.purchase_num_ratio !== null
                ? formatAmount(Number(scope.row.purchase_num_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="purchase_fans_num_ratio"
        label="成交粉丝占比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.purchase_fans_num_ratio !== null
                ? formatAmount(Number(scope.row.purchase_fans_num_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="interact_num_ratio"
        label="互动人数占比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.interact_num_ratio !== null
                ? formatAmount(Number(scope.row.interact_num_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="interact_fans_num_ratio"
        label="互动粉丝占比"
        align="right"
        min-width="130px"
        sortable
      >
        <template slot-scope="scope">
          <div style="padding-right: 12px">
            {{
              scope.row.interact_fans_num_ratio !== null
                ? formatAmount(Number(scope.row.interact_fans_num_ratio || 0), 'None') + '%'
                : '--'
            }}
          </div>
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
              margin: 18px 0;
              border: 1px solid var(--border-line-div-color);
              border-radius: 4px;
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
        height: 531px;
        border: 1px solid var(--border-line-div-color);
        border-radius: 4px;
        margin-top: 24px;
      "
    >
      <div
        style="
          margin: 32px auto;
          width: 968px;
          height: 56px;
          border-radius: 10px;
          display: flex;
          background: #ff8c00;
        "
      >
        <div
          style="
            width: 0px;
            background: var(--theme-color);
            font-weight: 400;
            font-size: 18px;
            color: #ffffff;
            padding-left: 70px;
            text-align: left;
            min-width: 250px;
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;
          "
          :style="{
            width: getWidthperent(
              detail_obj.purchase_people_num,
              detail_obj.not_purchase_people_num,
            ),
          }"
        >
          <div style="line-height: 56px">
            成交人数：{{
              detail_obj.purchase_people_num === null ||
              detail_obj.purchase_people_num === undefined
                ? '--'
                : formatAmount(Number(detail_obj.purchase_people_num || 0).toFixed(0), 'None', true)
            }}
          </div>
        </div>
        <div
          style="
            flex: 1;
            font-weight: 400;
            font-size: 18px;
            color: #ffffff;
            padding-right: 70px;
            text-align: right;
            min-width: 250px;
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;
          "
        >
          <div style="line-height: 56px">
            未成交人数：{{
              detail_obj.not_purchase_people_num === null ||
              detail_obj.not_purchase_people_num === undefined
                ? '--'
                : formatAmount(
                    Number(detail_obj.not_purchase_people_num || 0).toFixed(0),
                    'None',
                    true,
                  )
            }}
          </div>
        </div>
      </div>
      <div
        style="
          margin: 32px auto;
          width: 968px;
          display: flex;
          justify-content: space-between;
          padding-top: 0px;
        "
      >
        <div
          style="
            width: 520px;
            height: 376px;
            background: #fafafa;
            border: 1px solid var(--border-line-div-color);
          "
        >
          <div
            style="
              height: 20px;
              width: 20px;
              background-color: #fafafa;
              z-index: 1;
              border-left: 1px solid var(--border-line-div-color);
              border-top: 1px solid var(--border-line-div-color);
              transform: rotate(45deg);
              margin-left: 150px;
              margin-top: -11px;
            "
          ></div>
          <line-div
            :obj="{
              people_num_ratio: detail_obj.first_purchase_people_num_ratio,
              people_num: detail_obj.first_purchase_people_num,
              one_lable: '首购人数',
              two_lable: '复购人数',
              second_people_num_ratio: detail_obj.second_purchase_people_num_ratio,
              second_people_num: detail_obj.second_purchase_people_num,
              issuccess: true,
            }"
          ></line-div>
          <line-div
            :obj="{
              people_num_ratio: detail_obj.purchase_interact_num_ratio,
              people_num: detail_obj.purchase_interact_num,
              one_lable: '有互动人数',
              two_lable: '无互动人数',
              second_people_num_ratio: detail_obj.purchase_not_interact_num_ratio,
              second_people_num: detail_obj.purchase_not_interact_num,
              issuccess: true,
            }"
          ></line-div>
          <line-div
            :obj="{
              people_num_ratio: detail_obj.purchase_fans_num_ratio,
              people_num: detail_obj.purchase_fans_num,
              one_lable: '粉丝人数',
              two_lable: '非粉丝人数',
              second_people_num_ratio: detail_obj.purchase_not_fans_num_ratio,
              second_people_num: detail_obj.purchase_not_fans_num,
              issuccess: true,
            }"
          ></line-div>
        </div>
        <div
          style="
            margin-left: 24px;
            width: 520px;
            height: 376px;
            background: #fafafa;
            border: 1px solid var(--border-line-div-color);
          "
        >
          <div
            style="
              height: 20px;
              width: 20px;
              background-color: #fafafa;
              z-index: 1;
              border-left: 1px solid var(--border-line-div-color);
              border-top: 1px solid var(--border-line-div-color);
              transform: rotate(45deg);
              margin-left: 350px;
              margin-top: -11px;
            "
          ></div>
          <line-div
            :obj="{
              people_num_ratio: detail_obj.watch_time_40_seconds_more_ratio,
              people_num: detail_obj.watch_time_40_seconds_more,
              one_lable: '观看40s+人数',
              two_lable: '无效观看人数',
              second_people_num_ratio: detail_obj.invalid_watch_people_num_ratio,
              second_people_num: detail_obj.invalid_watch_people_num,
              issuccess: false,
            }"
          ></line-div>
          <line-div
            :obj="{
              people_num_ratio: detail_obj.interact_people_num_ratio,
              people_num: detail_obj.interact_people_num,
              one_lable: '有互动人数',
              two_lable: '无互动人数',
              second_people_num_ratio: detail_obj.not_interact_people_num_ratio,
              second_people_num: detail_obj.not_interact_people_num,
              issuccess: false,
            }"
          ></line-div>
          <line-div
            :obj="{
              people_num_ratio: detail_obj.not_purchase_fans_num_ratio,
              people_num: detail_obj.not_purchase_fans_num,
              one_lable: '粉丝人数',
              two_lable: '非粉丝人数',
              second_people_num_ratio: detail_obj.not_purchase_not_fans_num_ratio,
              second_people_num: detail_obj.not_purchase_not_fans_num,
              issuccess: false,
            }"
          ></line-div>
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
/*/deep/ .el-table .el-table__body .el-table__row {
            .el-table__cell:first-child,
            .el-table__cell:nth-child(2) {
              background: #f6f6f6 !important;
            }
          }*/
</style>
