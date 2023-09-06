<script src="./index.ts" lang="ts"></script>

<template>
  <div>
    <div style="margin-top: 24px" v-if="performanceId === 0">
      <div
        v-loading="daytrendLoading"
        style="
          height: 390px;
          width: 100%;
          padding-top: 0px;
          border: 1px solid var(--border-line-div-color);
          border-radius: 4px;
          padding: 0;
        "
      >
        <div class="echartTitle" style="padding-top: 18px; padding-left: 18px">增粉趋势</div>
        <div v-if="baseProjectOptions.series.length > 0">
          <div style="height: 320px">
            <BaseEcharts :options="baseProjectOptions"></BaseEcharts>
          </div>
        </div>
        <div v-else style="padding-top: 100px; height: 320px" v-loading="daytrendLoading">
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
    </div>
    <div
      style="
        height: 531px;
        margin-top: 24px;
        border: 1px solid var(--border-line-div-color);
        border-radius: 4px;
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
                ? '&#45;&#45;'
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
                ? '&#45;&#45;'
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
    <div style="height: 460px; margin-top: 24px; display: flex">
      <div style="flex: 1">
        <div class="echartTitle">年龄分布</div>
        <div
          v-if="pieOption.series[0].data.length > 0"
          style="width: 400px; height: 420px; margin: 48px auto"
        >
          <BaseEcharts style="width: 390px; height: 340px" :options="pieOption"></BaseEcharts>
        </div>
        <div style="width: 400px; height: 320px; margin: 48px auto" v-else>
          <empty-common
            :imgWidth="200"
            :imgHeight="100"
            style="margin-top: 150px"
            detail-text="暂无数据~"
          />
        </div>
      </div>
      <div style="flex: 1">
        <div class="echartTitle">常驻省份</div>
        <div class="progress-main">
          <div v-if="area_list.length !== 0" class="row">
            <span class="label"> </span>
            <div class="price-progress" />
            <span class="unit">占比</span>
          </div>
          <div v-for="(item, index) in area_list" class="row" :key="item.distribute_type">
            <span class="label">
              <span
                style="margin-right: 10px"
                :style="{ color: index < 3 ? getColor(index) : 'var(--text-second-color)' }"
                >{{ index + 1 }}</span
              >
              {{ item.distribute_index }}</span
            >
            <el-popover
              class="price-progress"
              style="flex: 1"
              :title="item.distribute_index"
              trigger="hover"
            >
              <p>
                <span
                  style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 10px;
                    margin-right: 8px;
                  "
                  :style="{ background: getColor(index) }"
                ></span
                >{{ item.value }}
              </p>
              <div slot="reference">
                <el-progress
                  :color="getColor(index)"
                  :show-text="false"
                  class="price-progress"
                  :percentage="(item.value / (area_list[0].value || 1)) * 100"
                />
              </div>
            </el-popover>
            <span class="unit">{{ item.ratio }}%</span>
          </div>
          <div v-if="area_list.length === 0" style="width: 400px; height: 320px; margin: 48px auto">
            <empty-common
              :imgWidth="200"
              :imgHeight="100"
              style="margin-top: 150px"
              detail-text="暂无数据~"
            />
          </div>
        </div>
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
  margin-left: 12px;
}
.progress-main {
  width: 100%;
  /*border: 1px solid #f0f0f0;*/
  border-radius: 4px;
  padding: 0px 25px;
  display: inline-block;
  & .row {
    display: flex;
    /*line-height: 20px;*/
    &:last-child {
      & .price-progress {
        margin-bottom: 0;
      }
    }
    & .label {
      width: 70px;
      font-weight: 600;
      font-size: 12px;
      color: var(--text-second-color);
      text-align: right;
      margin-right: 12px;
    }
    & .unit {
      width: 50px;
      margin-left: 12px;
      text-align: right;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-second-color);
    }
    & .price-progress {
      flex: 1;
      height: 20px;
      margin-bottom: 16px;
      border-radius: 2px;
      & /deep/.el-progress-bar__outer {
        height: 16px !important;
        border-radius: 2px;
        & .el-progress-bar__inner {
          border-radius: 0;
        }
      }
    }
  }
}
</style>
