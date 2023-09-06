<script src="./index.ts" lang="ts"></script>
<template>
  <div style="margin-top: 20px; min-width: 1200px">
    <div style="display: flex; height: 376px; padding: 0 18px; width: 100%">
      <div
        style="
          width: 30%;
          min-width: 490px;
          padding: 18px 24px 18px 24px;
          border: 1px solid var(--border-line-div-color);
          border-radius: 4px;
          margin-right: 18px;
        "
      >
        <div class="echartTitle" style="margin-bottom: 18px; margin-left: 0px">
          {{ projectGroundName === '全部' ? '品牌中心' : projectGroundName }}
        </div>
        <div
          v-if="
            completion_rate_obj.total_gmv !== null ||
            completion_rate_obj.total_gmv_incr_rate !== null ||
            completion_rate_obj.total_goal_gmv !== null ||
            completion_rate_obj.previous_total_gmv !== null ||
            completion_rate_obj.completion_rate !== null
          "
          v-loading="echartsBurstLoading"
          style="width: 450px; height: 300px; margin: 10px auto"
        >
          <div style="display: flex; justify-content: center; gap: 12px">
            <div style="width: 250px; height: 100px">
              <div class="detaildiv">GMV</div>
              <div class="titlediv" style="margin-bottom: 2px">
                {{
                  completion_rate_obj.total_gmv === null ||
                  completion_rate_obj.total_gmv === undefined
                    ? '--'
                    : formatAmount((completion_rate_obj.total_gmv || 0) / 100)
                }}
              </div>
              <span
                class="detaildiv"
                style="padding: 3px 0; height: 26px; border-radius: 4px; font-size: 12px"
              >
                环比<span
                  v-if="completion_rate_obj.total_gmv_incr_rate > 0"
                  style="text-align: left; padding: 0 5px; color: #f30220"
                  class="tgicon"
                  ><tg-icon
                    style="margin: auto 1px; color: #f30220; font-size: 14px"
                    name="ico-icon_tongyong_shangsheng_16_red"
                  ></tg-icon
                  >{{ completion_rate_obj.total_gmv_incr_rate }}%
                </span>
                <span
                  v-else-if="completion_rate_obj.total_gmv_incr_rate < 0"
                  style="color: #0fc97c; text-align: left; padding: 0 5px"
                  class="tgicon"
                  ><tg-icon
                    style="margin: auto 1px; font-size: 14px"
                    name="ico-icon_tongyong_xiajiang_16_green"
                  ></tg-icon
                  >{{ Math.abs(completion_rate_obj.total_gmv_incr_rate) }}%
                </span>
                <span v-else> --</span>
              </span>
            </div>
            <div
              style="
                width: 170px;
                height: 62px;
                background: #f6f6f6;
                border-radius: 6px;
                margin-top: 12px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                padding-left: 12px;
              "
            >
              <div class="detaildiv" style="font-size: 12px; margin-top: 7px">目标GMV</div>
              <div
                class="detaildiv"
                style="color: var(--text-color); line-height: 28px; font-size: 16px"
              >
                {{
                  completion_rate_obj.total_goal_gmv === null ||
                  completion_rate_obj.total_goal_gmv === undefined
                    ? '--'
                    : formatAmount((completion_rate_obj.total_goal_gmv || 0) / 100)
                }}
              </div>
            </div>
          </div>
          <div style="height: 190px; margin-top: -14px">
            <div class="echarts-baifenbi">
              <div class="zhizhen" ref="tagetdeg"></div>
              <div
                class="title"
                :style="{
                  fontSize:
                    completion_rate_obj.completion_rate &&
                    completion_rate_obj.completion_rate < 1000
                      ? '42px'
                      : '32px',
                }"
              >
                {{
                  completion_rate_obj.completion_rate === null ||
                  completion_rate_obj.completion_rate === undefined
                    ? '--'
                    : completion_rate_obj.completion_rate + '%'
                }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          v-loading="echartsBurstLoading"
          style="width: 400px; height: 320px; padding-top: 100px; margin: 10px auto"
        >
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
      <div
        v-loading="echartsBurstLoading"
        style="
          flex: 1;
          height: 100%;
          padding: 18px 0px 18px 24px;
          border: 1px solid var(--border-line-div-color);
          border-radius: 4px;
        "
      >
        <div class="echartTitle">完成明细</div>
        <div
          style="height: 260px; overflow-y: auto; overflow-x: hidden; margin-top: 24px; padding: 0"
          v-if="completion_rate_daily.length > 0"
        >
          <div
            style="margin-bottom: 16px; height: 60px"
            v-for="item in completion_rate_daily"
            :key="item.name"
          >
            <div style="display: flex; height: 32px; line-height: 32px">
              <tg-textPopover
                :text="item.name"
                :maxWidth="90"
                style="
                  color: var(--text-color);
                  width: 88px;
                  margin-right: 12px;
                  text-align: right;
                  line-height: 32px;
                "
              ></tg-textPopover>
              <el-popover style="flex: 1" placement="bottom-end" :title="item.name" trigger="hover">
                <div>
                  <div style="color: var(--text-second-color">
                    <div style="height: 32px; line-height: 32px">
                      GMV：<span style="color: var(--text-color)">{{
                        formatAmount((item.total_gmv || 0) / 100)
                      }}</span>
                    </div>
                    <div style="height: 32px; line-height: 32px">
                      目标GMV：<span style="color: var(--text-color)">{{
                        formatAmount((item.total_goal_gmv || 0) / 100)
                      }}</span>
                    </div>
                    <div style="height: 32px; line-height: 32px">
                      完成度：<span style="color: var(--text-color)">{{
                        item.completion_rate !== null ? item.completion_rate + '%' : '--'
                      }}</span>
                    </div>
                  </div>
                </div>
                <div slot="reference">
                  <div class="progressdiv">
                    <div
                      style="
                        position: absolute;
                        left: 0px;
                        background: var(--theme-color);
                        width: 118px;
                        height: 16px;
                        margin-top: 10px;
                        border-radius: 3px;
                      "
                      :style="{
                        width:
                          (Number(item.total_gmv) * 100) /
                            Number(getNewGoal(item.total_gmv, item.total_goal_gmv)) +
                          '%',
                      }"
                    ></div>
                    <div
                      style="
                        position: absolute;
                        left: 250px;
                        width: 3px;
                        height: 24px;
                        border-radius: 2px;
                        background-color: #f30220;
                        margin-top: 6px;
                      "
                      :style="{
                        left:
                          (Number(item.total_goal_gmv) * 100) /
                            Number(getNewGoal(item.total_gmv, item.total_goal_gmv)) +
                          '%',
                      }"
                    ></div>
                  </div>
                </div>
              </el-popover>
              <div
                style="margin-left: 12px; width: 80px; text-align: left"
                :style="{
                  color:
                    (item.completion_rate || 0) > 100
                      ? '#4FCA50'
                      : (item.completion_rate || 0) > 40
                      ? '#FF8C00'
                      : item.completion_rate !== null
                      ? '#F73838'
                      : '',
                }"
              >
                {{ item.completion_rate !== null ? item.completion_rate + '%' : '--' }}
              </div>
            </div>
            <div
              style="
                margin-left: 100px;
                margin-right: 92px;
                display: flex;
                justify-content: space-between;
              "
            >
              <div
                style="width: 1px; height: 10px; text-align: center; background: #4d343f4c"
                v-for="(_, subinex) in getGoalList(item.total_gmv, item.total_goal_gmv)"
                :key="subinex + 'span'"
              ></div>
            </div>
            <div
              style="
                margin-left: 60px;
                margin-right: 50px;
                display: flex;
                justify-content: space-between;
              "
            >
              <div
                style="
                  width: 80px;
                  text-align: center;
                  color: var(--text-second-color);
                  line-height: 20px;
                  font-size: 12px;
                "
                v-for="(sub, subinex) in getGoalList(item.total_gmv, item.total_goal_gmv)"
                :key="subinex + 'div'"
              >
                {{ sub || 0 }}
              </div>
            </div>
          </div>
        </div>
        <div
          style="height: 260px; overflow-y: auto; overflow-x: hidden; margin-top: 106px; padding: 0"
          v-else
        >
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
    </div>
    <div
      style="
        display: flex;
        height: 388px;
        border: 1px solid var(--border-line-div-color);
        border-radius: 4px;
        margin: 18px;
      "
    >
      <div v-loading="sunBurstLoading" style="width: 450px; padding: 18px 12px 18px 24px">
        <div class="echartTitle">GMV构成</div>
        <div
          v-if="projectGroundId === 0 && osunBurstData && osunBurstData.length > 0"
          style="width: 390px; height: 320px; margin: 0 auto; margin-top: 30px; display: flex"
        >
          <div style="width: 290px; height: 300px; position: relative">
            <sunburst
              itemName="GMV"
              style="height: 290px; width: 290px; position: absolute"
              :series="{ data: osunBurstData, children: osunBurstChildrenData }"
              @selectParamClick="selectClick"
            ></sunburst>
            <div
              style="
                background: transparent;
                width: 90px;
                height: 90px;
                border-radius: 100px;
                position: absolute;
                cursor: pointer;
                margin-top: 100px;
                margin-left: 100px;
                z-index: 3;
              "
              @click="onClickAllColor"
            ></div>
          </div>
          <div v-if="selectosunBurstData.length > 0" class="el-props">
            <div
              style="
                padding-left: 5px;
                width: 100%;
                text-align: left;
                height: 230px;
                overflow: hidden;
              "
            >
              <div v-for="(item, index) in selectosunBurstData" :key="item.name">
                <div
                  v-if="
                    index < select_show_index * select_show_size &&
                    index >= (select_show_index - 1) * select_show_size
                  "
                  style="
                    width: 100%;
                    height: 14px;
                    line-height: 14px;
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 12px;
                  "
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
                    :maxWidth="90"
                    style="
                      margin-left: 6px;
                      color: var(--text-color);
                      font-size: 12px;
                      max-width: 90px;
                    "
                  ></tg-textPopover>
                </div>
              </div>
            </div>
            <div v-if="selectosunBurstData.length > select_show_size" style="display: flex">
              <i
                class="el-icon-caret-left sort-icon"
                :class="select_show_index === 1 ? 'disable' : ''"
                @click="
                  () => {
                    select_show_index = select_show_index === 1 ? 1 : select_show_index - 1;
                  }
                "
              ></i>
              <span style="padding: 0 4px">{{ select_show_index }}/{{ get_total_num() }}</span>
              <i
                class="el-icon-caret-right sort-icon"
                :class="select_show_index === get_total_num() ? 'disable' : ''"
                @click="
                  () => {
                    select_show_index =
                      select_show_index < get_total_num()
                        ? select_show_index + 1
                        : select_show_index;
                  }
                "
              ></i>
            </div>
          </div>
        </div>
        <div
          v-else-if="projectGroundId !== 0 && piearr && piearr.length > 0"
          style="width: 400px; height: 300px; margin: auto; margin-top: 30px; display: flex"
        >
          <div style="width: 300px; height: 320px">
            <BaseEcharts
              style="width: 290px; height: 290px"
              :options="pieOption"
              @selectClick="selectClick"
            ></BaseEcharts>
          </div>
          <div v-if="selectosunBurstData.length > 0" class="el-props">
            <div
              style="
                padding-left: 5px;
                width: 100%;
                text-align: left;
                height: 230px;
                overflow: hidden;
              "
            >
              <div v-for="(item, index) in selectosunBurstData" :key="item.name">
                <div
                  v-if="
                    index < select_show_index * select_show_size &&
                    index >= (select_show_index - 1) * select_show_size
                  "
                  style="
                    width: 100%;
                    height: 14px;
                    line-height: 14px;
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 12px;
                  "
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
                    :maxWidth="90"
                    style="margin-left: 6px; color: #343f4c; font-size: 12px; max-width: 90px"
                  ></tg-textPopover>
                </div>
              </div>
            </div>
            <div v-if="selectosunBurstData.length > select_show_size" style="display: flex">
              <i
                class="el-icon-caret-left sort-icon"
                :class="select_show_index === 1 ? 'disable' : ''"
                @click="
                  () => {
                    select_show_index = select_show_index === 1 ? 1 : select_show_index - 1;
                  }
                "
              ></i>
              <span style="padding: 0 4px">{{ select_show_index }}/{{ get_total_num() }}</span>
              <i
                class="el-icon-caret-right sort-icon"
                :class="select_show_index === get_total_num() ? 'disable' : ''"
                @click="
                  () => {
                    select_show_index =
                      select_show_index < get_total_num()
                        ? select_show_index + 1
                        : select_show_index;
                  }
                "
              ></i>
            </div>
          </div>
        </div>
        <div v-else style="width: 200px; margin: 0 auto; height: 320px; padding-top: 100px">
          <empty-common :imgWidth="200" :imgHeight="100" />
        </div>
      </div>
      <div v-loading="trendLoading" style="flex: 1; height: 100%">
        <div style="height: 381px; width: 100%; padding: 18px 24px 18px 24px">
          <div class="echartTitle">
            {{
              selectOneProjectGroundName ||
              (projectGroundName === '全部' ? '品牌中心' : projectGroundName)
            }}
            GMV{{ analyseType === 1 ? '周' : analyseType === 2 ? '月' : '年' }}趋势
          </div>
          <div v-if="baseOptions.series.length > 0">
            <div
              style="
                height: 320px;
                padding-left: 0px;
                padding-right: 0px;
                margin-right: 0px;
                margin-left: 0px;
                margin-top: 10px;
              "
            >
              <BaseEcharts :options="baseOptions"></BaseEcharts>
            </div>
          </div>
          <div v-else style="width: 100%; height: 320px; padding-top: 100px">
            <empty-common :imgWidth="200" :imgHeight="100" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
/deep/.el-input {
  width: 180px;
}

/deep/ .el-form-item__content {
  line-height: 32px !important;
}
/deep/ .el-form-item--medium .el-form-item__content,
.el-form-item--medium .el-form-item__label {
  line-height: 32px;
}

/deep/ .el-form-item__label {
  font-size: 14px !important;
  color: #6a7b92 !important;
  line-height: 32px !important;
}
/deep/ .el-input__inner {
  line-height: 32px;
  height: 32px;
  font-size: 14px !important;
}
/deep/ .el-input__icon {
  line-height: 24px;
  &.el-icon-delete {
    line-height: 32px;
    margin-left: 6px;
    color: var(--text-third-color);
  }
  &:hover {
    color: rgba(var(--theme-rgb-color), 0.9);
  }
}
.echartTitle {
  font-size: var(--small-font-size);
  color: var(--text-color);
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 400;
  width: 100%;
  text-align: left;
  padding: 0;
  margin-left: 0px;
}
.progressdiv {
  position: relative;
  height: 36px;
  background: #f1f4f9;
  border-radius: 4px;
  &:hover {
    background: #f0f6ff;
  }
  /*background-image: linear-gradient(
    270deg,
    rgba(195, 195, 195, 0.6) 0%,
    rgba(255, 255, 255, 1) 100%
  );*/
  flex: 1;
  /*border: 1px solid rgba(195, 195, 195, 0.6);*/
}
.detaildiv {
  font-weight: 400;
  font-size: 14px;
  color: var(--text-second-color);
  letter-spacing: 0;
}
.titlediv {
  font-size: 24px;
  color: var(--text-color);
  letter-spacing: 0;
}
.echarts-baifenbi {
  background-image: url(../../../../../assets/echarts/icon-analyse-yibiaopan.png);
  background-size: 100% 100%;
  width: 356px;
  height: 186px;
  margin: auto;
  position: relative;
  .zhizhen {
    position: absolute;
    margin-top: 170px;
    height: 16px;
    width: 120px;
    background-image: url(../../../../../assets/echarts/icon-echarts-zhinanzhen.png);
    background-size: 100% 100%;
    /*background: red;*/
    margin-left: 59px;
  }
  .title {
    position: absolute;
    margin-top: 128px;
    width: 100%;
    font-size: 42px;
    color: var(--text-color);
    letter-spacing: 0;
    text-align: center;
    line-height: 66px;
  }
}
</style>
<style lang="less">
.el-popover[x-placement^='bottom-end'] {
  padding: 18px;
  margin-top: -6px;
  margin-left: -20px;
  background-color: white;
  border: none;
  font-size: 14px;
  box-shadow: 0 2px 8px 0 rgba(36, 47, 76, 0.14);
  border-radius: 6px;
  min-width: 180px;
  .el-popover__title {
    color: var(--text-color);
  }
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
  font-size: 12px;
  color: #343f4c;
  margin-top: 32px;
  margin-bottom: 48px;
  .sort-icon {
    font-size: 16px;
    color: #a4b2c2;
    &:hover {
      color: var(--theme-color);
    }
    &.disable {
      color: rgba(60, 82, 105, 0.1) !important;
    }
  }
}
</style>
