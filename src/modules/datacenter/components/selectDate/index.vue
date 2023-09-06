<template>
  <div class="el-select-group">
    <el-select
      popper-class="el-select-popper-mini"
      v-if="!isMcnDouyinDaily"
      size="mini"
      v-model="selectDate.dateType"
      class="time-select-type"
      style="width: 102px"
    >
      <el-option
        v-for="item in selectDate.dateTypeList"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
    <el-select
      popper-class="el-select-popper-mini"
      size="mini"
      v-model="selectDate.dateValue"
      :style="{
        width: isMonthWeek ? '240px' : isMcnDouyinDaily ? '180px' : '200px',
      }"
    >
      <el-option
        v-for="item in selectDate.dateValueList"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
  </div>
</template>

<script src="./index.ts"></script>
<style scoped lang="less">
.el-select-group {
  .el-select:nth-of-type(1) {
    /deep/.el-input.is-focus .el-input__inner {
      border-color: #dcdfe6 !important;
    }
    /deep/.el-input__inner:focus {
      border-color: #dcdfe6 !important;
    }
  }
  .el-select:nth-of-type(2) {
    margin-left: -1px;
  }
}
</style>
