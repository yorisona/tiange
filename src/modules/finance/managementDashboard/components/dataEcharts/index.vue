<template>
  <div style="width: 100%; padding-right: 24px; padding-left: 24px; min-width: 850px">
    <div style="background: #f4f5f6; height: 10px; margin: 0 -24px 0 -24px"></div>
    <div
      style="
        padding-top: 34px;
        height: 420px;
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: -12px;
      "
    >
      <div
        style="
          width: 25%;
          min-width: 420px;
          height: 420px;
          border: 1px solid #f0f0f0;
          margin-right: 12px;
          text-align: center;
          padding: 25px 24px;
        "
      >
        <div class="operators">
          <div class="echartTitle">
            {{ tab_type === 1 ? '收入' : tab_type === 2 ? '成本' : '利润' }}占比
          </div>
          <div style="width: 180px; z-index: 2; text-align: right">
            <!--<tg-button class="time-btn" type="link" @click="onDateChange(-1)">
              <tg-icon name="ico-arrow-left"></tg-icon>
            </tg-button>
            <span class="display-time">{{ selectMonth }}月</span>
            <tg-button class="time-btn" type="link" @click="onDateChange(1)">
              <tg-icon name="ico-arrow-right"></tg-icon>
            </tg-button>-->
            <el-popover
              popper-class="dashboard-month-popover"
              trigger="hover"
              append-to-body
              placement="bottom"
            >
              <div class="month-list">
                <div
                  v-for="(item, index) in month_arr"
                  :selected="index + 1 === selectMonth"
                  class="month-list-item"
                  @click="onBubbleMonth(index + 1)"
                  :key="index + 'month'"
                >
                  {{ item }}
                </div>
              </div>
              <div class="bubble-month-display" slot="reference" style="cursor: pointer">
                <span style="font-size: 14px; font-weight: 400; color: var(--text-color)">
                  {{ selectMonth > currentMonth ? '汇总' : selectMonth + '月' }}
                </span>
                <tg-icon style="margin-left: 0px" name="ico-triangle-down"></tg-icon>
              </div>
            </el-popover>
          </div>
        </div>
        <div style="margin-top: 35px">
          <!-- <BaseEcharts
            style="width: 350px; height: 350px; margin: auto"
            :options="allyearoption"
          ></BaseEcharts>-->
          <sunburst
            :itemName="tab_type === 1 ? '收入' : tab_type === 2 ? '成本' : '利润'"
            style="height: 282px; margin-top: 24px"
            :loading="sunBurstLoading"
            :series="{ data: osunBurstData }"
          ></sunburst>
        </div>
      </div>
      <div
        style="
          flex: 1;
          height: 420px;
          border: 1px solid #f0f0f0;
          text-align: center;
          padding: 0 24px 0 12px;
        "
      >
        <div style="padding-right: 12px">
          <div
            class="echartTitle"
            style="
              margin-left: 12px;
              margin-top: 25px;
              display: flex;
              justify-content: space-around;
            "
          >
            <span style="flex: 1"
              >项目{{ tab_type === 1 ? '收入' : tab_type === 2 ? '成本' : '利润' }}</span
            >
            <el-popover
              popper-class="dashboard-month-popover"
              trigger="hover"
              append-to-body
              placement="bottom"
            >
              <div class="month-list">
                <div
                  v-for="(item, index) in month_arr"
                  :selected="index + 1 === selectTrendMonth"
                  class="month-list-item"
                  @click="onTrendBubbleMonth(index + 1)"
                  :key="index + 'month'"
                >
                  {{ item }}
                </div>
              </div>
              <div class="bubble-month-display" slot="reference" style="cursor: pointer">
                <span style="font-size: 14px; font-weight: 400; color: var(--text-color)">
                  {{ selectTrendMonth > currentMonth ? '汇总' : selectTrendMonth + '月' }}
                </span>
                <tg-icon style="margin-left: 0px" name="ico-triangle-down"></tg-icon>
              </div>
            </el-popover>
          </div>
        </div>
        <div
          v-if="baseOptions.yAxis.data.length > 0"
          style="
            margin-left: 12px;
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 12px;
            color: #343f4c;
            line-height: 12px;
            max-height: 30px;
          "
        >
          <div style="flex: 1; align-items: flex-end; text-align: right">
            <div
              v-for="(item, index) in baseOptions.yAxis.data"
              :key="item.name"
              style="margin-left: 20px; display: inline-block; margin-bottom: 4px"
            >
              <div style="display: flex">
                <span
                  style="
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    top: 5px;
                    margin-right: 4px;
                    border-radius: 2px;
                    margin-bottom: 4px;
                  "
                  :style="{
                    background:
                      index < useTrendBarBurstColors.length ? useTrendBarBurstColors[index] : '',
                  }"
                ></span
                ><span style="left: 25px">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="baseOptions.yAxis.data.length > 0"
          style="margin-top: 0px; width: 100%; height: 306px"
          v-loading="teamTrendLoading"
        >
          <BaseEcharts :options="baseOptions"></BaseEcharts>
        </div>
        <div
          v-else
          style="margin-top: 100px; width: 100%; height: 260px"
          v-loading="teamTrendLoading"
        >
          <empty-common />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style scoped lang="less">
.echartTitle {
  font-size: var(--small-font-size);
  color: var(--text-color);
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
  width: 100%;
  text-align: left;
  padding: 0;
}
.operators {
  display: flex;
  .time-btn {
    height: 28px;
    width: 28px;
    border: 1px solid fade(#a4b2c2, 30);
    border-radius: 14px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    .icon {
      color: #6a7b92;
    }

    & :hover {
      border-color: var(--theme-color);

      .icon {
        color: var(--theme-color);
      }
    }
  }
  .display-time {
    color: var(--text-color);
    font-size: 16px;
    font-weight: 400;
    margin: 0 12px;
  }
}
</style>
