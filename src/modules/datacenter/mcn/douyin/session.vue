<!--
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: MCN页面
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 17:24:21
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.vue
-->
<template>
  <div class="data-changci-center-collect flex-auto tg-card">
    <div class="collect-select" style="margin-top: 0px">
      <div style="display: flex">
        <select-date
          style="width: 302px"
          @selectDate="selectDate"
          :isMonthQuarter="true"
        ></select-date>
        <div style="width: 180px; margin-left: 10px" v-if="!is_one_peoject">
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
              <div v-else class="depart-select-box" style="color: var(--placeholder-color)">
                <span>请选择项目所属部门</span>
                <i
                  style="
                    margin-top: 8px;
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
        </div>
        <el-select
          popper-class="el-select-popper-mini"
          v-if="!is_one_peoject"
          size="mini"
          v-model="select_project_id"
          style="margin-left: 12px; width: 180px"
        >
          <el-option
            v-for="item in project_list"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          />
        </el-select>
      </div>
      <div
        v-if="update_time"
        style="
          font-size: 12px;
          color: var(--text-third-color);
          line-height: 32px;
          height: 32px;
          margin-left: 18px;
        "
      >
        最后更新时间： {{ update_time }}
      </div>
    </div>
    <div style="width: 100%; height: 10px; background: rgb(246, 246, 246)"></div>
    <data-center-list
      v-loading="tableLoading"
      :list="tableData"
      :current-date-type="selectedDateType"
      class="center-list-min-height"
    />
  </div>
</template>
<script src="./session.ts"></script>
<style lang="less">
.cb-department-tree-popper-class {
  max-height: 360px;
  overflow: auto;
}
</style>
<style lang="less" scoped>
.data-changci-center-collect {
  .depart-select-box {
    border: 1px solid var(--border-line-color);
    padding: 0 10px;
    line-height: 27px;
    height: 28px;
    display: flex;
    justify-content: space-between;
    width: 180px;
    border-radius: 2px;
    font-size: 12px;
    flex: 1;
    &:hover {
      /deep/ .el-icon-circle-close {
        color: #c0c4cc !important;
      }
      border-color: #5c82ff;
    }
  }
  .collect-select {
    height: 68px;
    display: flex;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    flex: auto 168px;
  }
  .related-project-title {
    height: 52px;
    padding-left: 18px;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  .center-list-min-height {
    margin-top: 16px;
  }
  /deep/ .el-input--suffix .el-input__inner,
  .el-input__suffix .el-input__suffix-inner,
  .el-input__suffix {
    height: 28px;
    line-height: 28px;
    .el-icon-arrow-down {
      line-height: 28px;
    }
  }
}
</style>
