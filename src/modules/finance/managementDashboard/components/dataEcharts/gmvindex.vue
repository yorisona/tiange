<template>
  <div style="min-width: 1080px; padding-bottom: 24px; padding-left: 24px; padding-right: 24px">
    <div style="border-top: 1px solid rgba(164, 178, 194, 0.3); padding-top: 16px; width: 100%">
      <el-form
        class="filter-form flex-form"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="60px"
      >
        <el-form-item label="归属部门：" class="flex-form-item flex-form-item-time">
          <el-popover
            placement="bottom-start"
            trigger="click"
            width="370"
            popper-class="cb-department-tree-popper-class el-tree-popper-mini"
          >
            <div slot="reference" class="repain-select" style="display: block">
              <div v-if="feishu_department_name" class="depart-select-box">
                <span>{{ feishu_department_name }}</span>
                <i
                  @click.stop="
                    () => {
                      feishu_department_name = '';
                      feishu_department_id = undefined;
                      cb_department_tree.setCheckedKeys([]);
                    }
                  "
                  style="margin-top: 7px; color: white; font-size: var(--small-font-size)"
                  class="el-icon-circle-close"
                ></i>
              </div>
              <div v-else class="depart-select-box" style="color: var(--disabled-color)">
                <span>请选择归属部门</span>
                <i
                  style="
                    margin-top: 7px;
                    color: var(--disabled-color);
                    font-size: var(--small-font-size);
                  "
                  class="el-icon-arrow-down"
                ></i>
              </div>
            </div>
            <div class="department-tree">
              <el-tree
                ref="cb_department_tree"
                :props="treeProps"
                :check-strictly="true"
                node-key="id"
                :data="feishuDepartmentList"
                show-checkbox
                check-on-click-node
                :default-checked-keys="default_checked_department_ids"
                :default-expanded-keys="default_checked_department_ids"
                @check="handleCheckChange"
              >
              </el-tree>
            </div>
          </el-popover>
        </el-form-item>

        <el-form-item label-width="0" class="flex-form-item order-100" style="margin-right: 20px">
          <tg-button type="primary" @click="getGMVList">查询</tg-button>
          <tg-button class="mgl-8" @click="resetDepartment">重置</tg-button>
        </el-form-item>
      </el-form>
      <div style="background: #f4f5f6; height: 10px; margin: 16px -24px 0 -24px"></div>
    </div>
    <div style="padding-top: 24px; width: 100%; margin-bottom: 24px">
      <div style="height: 415px; width: 100%; display: flex; justify-content: space-between">
        <div
          v-loading="TargetLoading"
          style="
            flex: 1;
            height: 390px;
            border: 1px solid #f0f0f0;
            margin-right: 12px;
            text-align: center;
            padding: 32px 0;
          "
        >
          <div class="echartTitle">
            {{ currentMonth > 1 ? '1-' + currentMonth + '' : currentMonth }}月目标完成率
          </div>
          <div
            style="
              margin-top: 24px;
              font-size: 18px;
              color: var(--text-color);
              letter-spacing: 0;
              line-height: 24px;
              display: flex;
              justify-content: space-between;
            "
          >
            <div style="text-align: right; flex: 1">
              {{ formatAmount(Number(month_total_gmv || 0) / 100, 'None') || '--' }}&nbsp;
            </div>
            <div style="color: var(--text-third-color); text-align: left; flex: 1">
              /&nbsp;{{ formatAmount(Number(month_total_goal_gmv || 0) / 100, 'None') || '--' }}
            </div>
          </div>
          <div style="height: 220px; margin-top: 40px">
            <div class="echarts-baifenbi">
              <div class="zhizhen" ref="monthdeg"></div>
              <div class="title">{{ monthIndex }}%</div>
            </div>
          </div>
        </div>
        <div
          v-loading="MonthLoading"
          style="
            flex: 1;
            height: 390px;
            border: 1px solid #f0f0f0;
            margin-left: 12px;
            text-align: center;
            padding: 32px 0;
          "
        >
          <div class="echartTitle">全年目标完成率</div>
          <div
            style="
              margin-top: 24px;
              font-size: 18px;
              color: var(--text-color);
              letter-spacing: 0;
              line-height: 24px;
              display: flex;
              justify-content: space-between;
            "
          >
            <div style="text-align: right; flex: 1">
              {{ formatAmount(Number(all_total_gmv || 0) / 100, 'None') || '--' }}&nbsp;
            </div>
            <div style="color: var(--text-third-color); text-align: left; flex: 1">
              /&nbsp;{{ formatAmount(Number(all_total_goal_gmv || 0) / 100, 'None') || '--' }}
            </div>
          </div>
          <div style="height: 220px; margin-top: 40px">
            <div class="echarts-baifenbi">
              <div class="zhizhen" ref="tagetdeg"></div>
              <div class="title">{{ targetIndex }}%</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-loading="trendLoading"
        style="height: 361px; width: 100%; border: 1px solid #f0f0f0; padding-top: 24px"
      >
        <div v-if="baseOptions.xAxis.data.length > 0">
          <div class="echartTitle">目标与完成率趋势</div>
          <div
            style="
              height: 290px;
              padding-left: 14px;
              padding-right: 24px;
              margin-right: 0px;
              margin-left: 0px;
              margin-top: 10px;
            "
          >
            <BaseEcharts :options="baseOptions"></BaseEcharts>
          </div>
        </div>
        <div
          v-else
          style="margin-top: 100px; width: 100%; height: 250px"
          v-loading="teamTrendLoading"
        >
          <empty-common />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./gmvindex.ts"></script>
<style lang="less">
.cb-department-tree-popper-class {
  max-height: 360px;
  overflow: auto;
}
</style>
<style scoped lang="less">
.depart-select-box {
  border: 1px solid var(--border-line-color);
  padding: 0 10px;
  line-height: 27px;
  height: 28px;
  display: flex;
  justify-content: space-between;
  width: 204px;
  border-radius: 2px;
  flex: 1;
  font-size: 12px;
  &:hover {
    /deep/ .el-icon-circle-close {
      color: #c0c4cc !important;
    }
    border-color: #5c82ff;
  }
}
.echartTitle {
  font-size: 18px;
  color: var(--text-color);
  letter-spacing: 0;
  line-height: 20px;
  width: 100%;
  text-align: center;
}
.echarts-baifenbi {
  background-image: url(../../../../../assets/echarts/icon-echarts-baifenbi.png);
  background-size: 100% 100%;
  width: 400px;
  height: 204px;
  margin: auto;
  position: relative;
  .zhizhen {
    position: absolute;
    margin-top: 192px;
    height: 18px;
    width: 140px;
    background-image: url(../../../../../assets/echarts/icon-echarts-zhinanzhen.png);
    background-size: 100% 100%;
    /*background: red;*/
    margin-left: 55px;
  }
  .title {
    position: absolute;
    margin-top: 148px;
    width: 100%;
    font-size: 42px;
    color: var(--text-color);
    letter-spacing: 0;
    text-align: center;
    line-height: 66px;
  }
}
</style>
