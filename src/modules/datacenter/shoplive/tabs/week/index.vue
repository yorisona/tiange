<script src="./index.ts" lang="ts"></script>

<template>
  <div class="all-week">
    <div style="height: 120px">
      <div class="fixedselect">
        <el-form :inline="true" size="mini" style="margin-bottom: 4px">
          <el-form-item
            label="选择周："
            prop="allocated_time"
            class="flex-form-item flex-form-item-time"
            label-width="68px"
          >
            <el-date-picker
              :clearable="false"
              v-model="week_date"
              type="week"
              :picker-options="{ firstDayOfWeek: 1 }"
              :format="'yyyy第WW周(' + start_time + '-' + end_time + ')'"
              placeholder="选择周"
              @change="selectDateChange"
              style="width: 284px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="选择项目组："
            label-width="80px"
            class="flex-form-item flex-form-item-time"
          >
            <el-select
              popper-class="el-select-popper-mini"
              placeholder="请选择项目组"
              v-model="project_ground_id"
              style="width: 186px"
              @change="selectGround"
            >
              <el-option
                v-for="item in project_ground_list"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择项目类型："
            label-width="90px"
            class="flex-form-item flex-form-item-time"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="business_type"
              placeholder=""
              style="width: 100%"
            >
              <el-option label="全部" :value="undefined" />
              <el-option
                v-for="item in projectTypeOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="width: 100%; height: 10px; background: rgb(246, 246, 246)"></div>
      </div>
    </div>
    <div class="week-div">
      <div style="min-width: 1250px; width: 100%">
        <analyse-index
          :analyseType="1"
          :selectDate="week_date_str"
          :projectGroundId="project_ground_id"
          :projectGroundName="project_ground_name"
          :business_type="business_type"
        />
        <div class="data-center-switch">
          <div :class="fixed == true ? 'fixed ' : 'center'">
            <el-button-group>
              <el-radio-group v-model="selectIndex" @change="onSwitch">
                <el-radio-button label="0">项目概览</el-radio-button>
                <el-radio-button label="1">销售</el-radio-button>
                <el-radio-button label="2">流量</el-radio-button>
                <el-radio-button label="3">人群</el-radio-button>
                <el-radio-button label="4">转化</el-radio-button>
                <el-radio-button label="5">投放</el-radio-button>
              </el-radio-group>
            </el-button-group>
            <div
              v-if="fixed == true"
              style="width: 100%; height: 10px; background: rgb(246, 246, 246); margin-top: 18px"
            ></div>
          </div>
        </div>
        <div>
          <component
            :style="{ marginTop: fixed == true ? '26px' : '0px' }"
            :is="switchComponents[selectIndex]"
            :analyseType="1"
            :selectDate="week_date_str"
            :projectGroundId="project_ground_id"
            :business_type="business_type"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.all-week {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.week-div {
  flex: 1;
  width: 100%;
  background: white;
  overflow: auto;
  overflow: overlay;
  position: relative;
  padding-bottom: 64px;
}
.data-center-switch {
  width: 100%;
  background-color: white;
  z-index: 10;
  position: relative;
  .center {
    margin: 32px 0 24px 0;
  }
  .tg-btn-link {
    font-size: var(--small-font-size);
    color: var(--text-second-color);
    &[selected] {
      font-weight: 400;
      color: var(--theme-color);
    }
  }
  .line-ver {
    color: var(--border-line-color);
  }
}
.data-center-template {
  padding: 0;
}
.fixed {
  padding: 16px 0 0 0;
  position: fixed;
  z-index: 10;
  height: 72px;
  width: 100%;
  top: 154px;
  /*border-bottom: 10px solid rgb(246, 246, 246);*/
  background-color: white;
}
.el-button-group {
  margin-left: 18px;
  /deep/.el-radio-button__inner {
    min-width: 92px;
    font-size: 12px;
    height: 28px;
    line-height: 27px;
    padding: 0;
    font-weight: 400;
  }
}
.fixedselect {
  padding: 16px 0 0 0;
  position: fixed;
  z-index: 10;
  height: 64px;
  width: 100%;
  top: 104px;
  background-color: white;
}
.selectdiv {
  padding: 0 0 2px 0;
  width: 100%;
  background-color: white;
  position: relative;
}
/deep/.el-input {
  width: 186px;
}

/deep/ .el-input__icon {
  line-height: 24px;
  &.el-icon-delete {
    line-height: 28px;
    margin-left: 6px;
    color: var(--text-third-color);
  }
  &:hover {
    color: rgba(var(--theme-rgb-color), 0.9);
  }
}
.el-radio-group {
  column-gap: 0;
}
/deep/ .el-radio-button__orig-radio + .el-radio-button__inner {
  min-width: 82px;
  font-size: 12px;
  height: 28px;
  border-color: var(--border-line-div-color);
  color: var(--text-second-color);
}
/deep/.el-radio-button.is-active .el-radio-button__orig-radio + .el-radio-button__inner {
  border-color: rgba(var(--theme-rgb-color), 0.9);
}
/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: rgba(var(--theme-rgb-color), 0.9);
  border-color: rgba(var(--theme-rgb-color), 0.9);
  min-width: 82px;
  color: white;
}
/deep/.el-table {
  &::before {
    z-index: 8;
  }
}
/deep/.el-loading-mask {
  z-index: 8;
}
/deep/ .el-table {
  .el-table--border {
    > .el-table__body-wrapper.is-scrolling-none {
      overflow-y: auto;
      overflow-y: overlay;
    }
    thead > tr > th > .cell {
      text-align: center;
      padding: 0px !important;
      border-color: var(--border-line-div-color);
    }
    .el-table__row > td {
      border-color: var(--border-line-div-color);
    }
    th.el-table__cell.is-leaf {
      border-color: var(--border-line-div-color);
    }
  }
}
/deep/ .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-color: var(--border-line-div-color) !important;
}
/deep/ .el-table::before {
  content: '';
  position: absolute;
  background-color: var(--border-line-div-color) !important;
}
/deep/ .el-table.el-table--border th.el-table__cell.is-leaf,
.el-table.el-table--border th.el-table__cell.is-leaf {
  border-color: var(--border-line-div-color) !important;
}
/deep/ .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-color: var(--border-line-div-color) !important;
}
/deep/ .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: var(--border-line-div-color) !important;
}
/deep/ .el-table--border,
.el-table--group {
  border: 1px solid var(--border-line-div-color);
  border-bottom-width: 0;
  border-right-width: 0;
}
</style>
