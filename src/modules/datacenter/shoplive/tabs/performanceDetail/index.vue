<script src="./index.ts" lang="ts"></script>

<template>
  <div class="all-performance">
    <div class="performance-div">
      <div>
        <performanceIndex
          :updata="updata"
          @getProjectDeatil="getProjectDeatil"
          :performanceId="performanceId"
        />
      </div>
      <div class="data-center-switch">
        <!-- <div :class="fixed == true ? 'fixed ' : 'center'">
            <el-button-group>
              <el-radio-group v-model="selectIndex" @change="onSwitch" size="small">
                <el-radio-button label="0">商品</el-radio-button>
                <el-radio-button label="1">流量</el-radio-button>
                <el-radio-button label="2">粉丝</el-radio-button>
                <el-radio-button label="3">投放</el-radio-button>
                <el-radio-button label="4">批注</el-radio-button>
              </el-radio-group>
            </el-button-group>
            <div
              v-if="fixed == true"
              style="width: 100%; height: 10px; background: rgb(246, 246, 246); margin-top: 18px"
            ></div>
             </div>-->
        <div :class="fixed == true ? 'fixed ' : ''">
          <tg-tabs
            class="flex-none"
            :tabs="tabs"
            v-model="selectIndex"
            @change="onTabChange"
            bottom
          />
        </div>
      </div>
      <div style="padding: 0 18px 12px 18px">
        <component
          :style="{ marginTop: fixed == true ? '0px' : '0px' }"
          :is="switchComponents[selectIndex]"
          :performanceId="performanceId"
          :projectData="projectData"
          @upDataProjectDeatil="upDataProjectDeatil"
        />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.all-performance {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.performance-div {
  flex: 1;
  width: 100%;
  min-width: 1300px;
  background: white;
  overflow: auto;
  overflow: overlay;
  position: relative;
  padding-top: 18px;
  padding-bottom: 64px;
}
.data-center-switch {
  width: 100%;
  background-color: white;
  z-index: 10;
  position: relative;
  .center {
    margin: 0 0 24px 0;
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
  padding: 2px 0 0 0;
  position: fixed;
  z-index: 10;
  height: 48px;
  width: 100%;
  top: 48px;
  /*border-bottom: 10px solid rgb(246, 246, 246);*/
  background-color: white;
}
.el-button-group {
  margin-left: 18px;
  /deep/.el-radio-button__inner {
    min-width: 92px;
    font-size: 14px;
    height: 32px;
    line-height: 30px;
    padding: 0;
    font-weight: 400;
  }
}
.fixedselect {
  padding: 18px 0 0 0;
  position: fixed;
  z-index: 10;
  height: 74px;
  width: 100%;
  top: 112px;
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

.el-radio-group {
  column-gap: 0;
}
/deep/ .el-radio-button__orig-radio + .el-radio-button__inner {
  min-width: 82px;
  border-color: var(--border-line-div-color);
  color: var(--text-second-color);
}
/deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: rgba(var(--theme-rgb-color), 0.9);
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
      padding: 0 !important;
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
  background-color: #e5e5e5 !important;
}
/deep/ .el-table--border,
.el-table--group {
  border: 1px solid var(--border-line-div-color);
  border-bottom-width: 0;
  border-right-width: 0;
}

.tg-tabs.tg-tabs-line.tg-tabs-bottom-line:before {
  background-color: var(--border-line-div-color);
}
</style>
