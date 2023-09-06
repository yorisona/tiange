<!--
 * @Author: 矢车
 * @Date: 2020-12-28 13:11:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-14 11:08:10
 * @Description: 系统设置 - 用户管理 - 列表 - 搜索组件
-->
<template>
  <div class="system-search system-search-ns el-form">
    <ul class="arrange el-form-item--mini">
      <li>
        <span class="s-title">用户信息：</span>
        <el-input
          size="mini"
          class="info-name-input"
          v-model="search_params.search_value"
          placeholder="请输入关键词"
          style="width: 204px"
          v-key-enter="transmitSearch"
        >
          <el-select
            popper-class="el-select-popper-mini"
            slot="prepend"
            size="mini"
            class="info-name-select"
            v-model="search_params.search_type"
            placeholder="请选择"
            @focus="selectControlPopoverHide"
            style="height: 28px; padding-left: 6px"
          >
            <el-option :value="1" label="手机号" />
            <el-option :value="2" label="花名" />
          </el-select>
        </el-input>
      </li>
      <li>
        <span class="s-title">所属部门：</span>
        <el-popover
          placement="bottom-start"
          width="204"
          trigger="click"
          @show="popoverShow"
          @hide="popoverHide"
          popper-class="user-serch-popper el-tree-popper-mini"
        >
          <div slot="reference" class="repain-select250">
            <el-button
              size="mini"
              v-if="!search_other_params.department_name"
              style="color: var(--placeholder-color); width: 204px; font-size: 12px"
              >请选择部门</el-button
            >
            <el-button size="mini" v-else>{{ search_other_params.department_name }}</el-button>
            <i class="select-icon el-icon-arrow-down"></i>
          </div>
          <singleTrees
            ref="singleTree"
            :c_treeData="treeData"
            @handleTreeDataCall="p_handleTreeDataCall($event)"
          />
        </el-popover>
      </li>
      <!-- 控制点击 select 部门树不收缩的问题 -->
      <li v-show="false" class="controlPopoverHide"></li>
      <li>
        <span class="s-title">所属岗位：</span>
        <el-input
          size="mini"
          class="info-name-input"
          v-model="search_params.job_name"
          placeholder="请输入关键词"
          v-key-enter="transmitSearch"
          style="width: 204px"
        />
        <!-- <el-select
          popper-class="el-select-popper-mini"
          v-model="search_other_params.job_name"
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="请输入并选择岗位"
          :remote-method="getJobLists"
          @change="onJobIdChange"
          size="mini"
          style="width: 204px"
        >
          <el-option
            v-for="item in search_other_params.job_list"
            :key="item.id"
            :label="item.job_name"
            :value="item.id"
          >
          </el-option>
        </el-select> -->
      </li>
      <!-- <li>
        <span class="s-title">业务类型：</span>
        <el-select
          popper-class="el-select-popper-mini"
          size="mini"
          v-model="search_params.business_type"
          placeholder="请选择业务类型"
          @focus="selectControlPopoverHide"
          style="width: 204px"
        >
          <el-option
            v-for="item in enumBussinessType()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li> -->
      <li>
        <span class="s-title">状态：</span>
        <el-select
          popper-class="el-select-popper-mini"
          size="mini"
          v-model="search_params.is_checked"
          placeholder="请选择状态"
          @focus="selectControlPopoverHide"
          style="width: 204px"
        >
          <el-option
            v-for="item in enumUserStatus()"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </li>
      <li style="margin-left: 0">
        <tg-button type="primary" @click="transmitSearch">查询</tg-button>
        <tg-button class="mgl-8" @click="transmitReset">重置</tg-button>
        <tg-button
          v-if="Permission.canUserExport"
          class="mgl-8"
          @click="exportBtnClick"
          :disabled="isDisabled"
          >导出</tg-button
        >
      </li>
    </ul>
  </div>
</template>

<script src="./userSearch.ts"></script>

<style lang="scss" scoped>
@import './userSearch.scss';
@import '@/assets/scss/common-system.scss';

.system-search {
  ::v-deep .arrange {
    .el-input {
      width: 100%;
    }
  }
}
</style>

<style lang="less">
@import '@/styles/main.less';
.system-search-ns {
  .el-icon-caret-right::before {
    color: #666666;
  }
  .el-button {
    &:hover {
      border-color: #c0c4cc !important;
    }
  }
  .el-form-item--mini {
    margin-right: 0 !important;
    margin-bottom: 0 !important;
  }
}
</style>
