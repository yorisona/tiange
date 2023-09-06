<script src="./index.ts" lang="ts"></script>

<template>
  <div style="min-height: 500px">
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
            v-if="osunBurstData && osunBurstData.length > 0"
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
              <span style="display: inline-block">
                流量来源：{{ select_flow_name || '&#45;&#45;' }}
              </span>
              <span style="display: inline-block; margin-left: 48px">
                直播间观看次数：{{
                  sunBurstDetail || watch_cnt
                    ? formatAmount(
                        Number(sunBurstDetail ? sunBurstDetail.watch_cnt : watch_cnt).toFixed(0),
                        'None',
                        true,
                      )
                    : '&#45;&#45;'
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
              <div style="margin-right: 50px; margin-top: 60px">
                <empty-common style="width: 260px; margin: auto" :imgWidth="200" :imgHeight="100" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectosunBurstData && selectosunBurstData.length > 0" class="el-props">
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
              <div
                style="
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  margin-top: 1px;
                  border-radius: 2px;
                "
                :style="{ background: item.itemStyle.color }"
              ></div>
              <tg-textPopover
                :text="item.name"
                style="
                  margin-left: 6px;
                  color: #343f4c;
                  font-size: 12px;
                  width: 56px;
                  display: inline-block;
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
    <div style="margin-top: 24px" v-if="performanceId === 0">
      <div v-loading="daytrendLoading" style="height: 320px; width: 100%; padding-top: 0px">
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
    <div v-if="performanceId === 0">
      <div class="echartTitle" style="margin-top: 24px; margin-bottom: 12px">短视频引流</div>
      <tg-table stripe :tooltip-effect="light" v-loading="loading" border :data="tableData">
        <el-table-column v-for="(col, index) in prechargeColumn" v-bind="col" :key="index" />
        <template #empty>
          <empty-common
            style="margin-top: 20px"
            :imgWidth="200"
            :imgHeight="100"
            detail-text="暂无数据"
          ></empty-common>
        </template>
      </tg-table>
      <div class="pagination" style="padding: 0">
        <el-pagination
          class="flex-none"
          :current-page="paginationData.page_num"
          :page-size="paginationData.num"
          :page-sizes="[10, 20]"
          :total="paginationData.total"
          @size-change="handlePageSizeChange"
          layout="total, prev, pager, next, sizes, jumper"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
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

.toptrianglediv {
  margin-top: 96px;
  width: 172px;
  background-color: #d1d8e0;
  height: 1px;
  transform: rotate(-60deg);
}
.bottomtrianglediv {
  width: 172px;
  margin-top: 148px;
  margin-left: 0px;
  height: 1px;
  background-color: #d1d8e0;
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
  border: 0px solid var(--border-line-div-color);
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
  width: 1100px;
  font-size: 12px;
  color: #343f4c;
  overflow: hidden;
  flex: 1;
  margin: 18px auto;
}
/deep/ .el-table {
  .text-right {
    padding-right: 30px;
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
.pagination {
  padding: 8px 18px;
  /deep/ .el-pagination__jump {
    margin-left: 12px;
  }
}
</style>
