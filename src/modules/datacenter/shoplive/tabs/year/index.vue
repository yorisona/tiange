<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-29 10:54:54
-->
<script src="./index.ts" lang="ts"></script>

<template>
  <div class="all-year">
    <div style="height: 120px">
      <div class="fixedselect">
        <el-form :inline="true" size="mini" style="margin-bottom: 4px">
          <el-form-item
            :clearable="false"
            label="选择年："
            prop="allocated_time"
            class="flex-form-item flex-form-item-time"
            label-width="68px"
          >
            <el-date-picker
              :clearable="false"
              v-model="week_date"
              type="year"
              format="yyyy 年"
              @change="selectDateChange"
              style="width: 186px"
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
              @change="selectGround"
              placeholder="请选择项目组"
              v-model="project_ground_id"
              style="width: 186px"
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
    <div class="year-div">
      <div style="min-width: 1200px; width: 100%">
        <analyse-index
          style="margin-top: 20px"
          :analyseType="3"
          :selectDate="week_date_str"
          :projectGroundId="project_ground_id"
          :business_type="business_type"
          :projectGroundName="project_ground_name"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.all-year {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.year-div {
  flex: 1;
  width: 100%;
  background: white;
  overflow: auto;
  overflow: overlay;
  position: relative;
  padding-bottom: 64px;
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
.selectdiv {
  padding: 70px 0 2px 0;
  width: 90%;
  background-color: white;
}
.fixedselect {
  padding: 16px 0 0 0;
  position: fixed;
  z-index: 10;
  height: 66px;
  width: 100%;
  top: 104px;
  background-color: white;
}
/deep/.el-loading-mask {
  z-index: 8;
}
</style>
