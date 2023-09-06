<!--
 * @Description: 我已审批-筛选
 * @Autor: 神曲
 * @Date: 2020-04-02 14:13:48
 * @LastEditors: 神曲
 * @LastEditTime: 2020-04-17 11:39:55
 -->

<template>
  <div>
    <div class="bgc-withe">
      <el-form class="workbench-search-bar" :inline="true" size="small">
        <el-form-item class="workbench-cls">
          <template #label>
            <span class="workbench-label">审批编号:</span>
          </template>
          <el-input
            class="approve-uid"
            size="small"
            placeholder="请输入审批编号"
            clearable
            v-model="searchForm.approval_uid"
          ></el-input>
        </el-form-item>
        <el-form-item class="workbench-cls">
          <template #label>
            <span class="workbench-label">审批类型:</span>
          </template>
          <el-select
            v-model="searchForm.approval_type"
            placeholder="请选择"
            style="width: 100px"
            @change="selectCustomerClass"
          >
            <template v-for="(item, index) in approvalTypeList">
              <el-option
                :key="item.value"
                :label="item.value"
                :value="item.type"
                v-if="index > 0"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item class="workbench-cls">
          <template #label>
            <span class="workbench-label">发起时间:</span>
          </template>
          <el-date-picker
            v-model="searchForm.start_time"
            unlink-panels
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            :default-value="new Date().getTime() - 2592000000"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="workbench-cls">
          <template #label>
            <span class="workbench-label">结束时间:</span>
          </template>
          <el-date-picker
            v-model="searchForm.end_time"
            unlink-panels
            type="daterange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            :default-value="new Date().getTime() - 2592000000"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="workbench-cls">
          <el-button class="btn-search btn-blue" type="primary" size="small" @click="handleSearch"
            >查询</el-button
          >
          <tg-button type="negative" size="small" @click="handleReset">重置</tg-button>
        </el-form-item>
      </el-form>
      <div class="tabs">
        <el-tabs v-model="activeMenu">
          <el-tab-pane name="all">
            <template #label>
              <div @click="selectStatusHandle({ approval_status: null })">全部</div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="first">
            <template #label>
              <div @click="selectStatusHandle({ approval_status: 1 })">审批中</div>
            </template>
          </el-tab-pane>
          <el-tab-pane name=" second">
            <template #label>
              <div @click="selectStatusHandle({ approval_status: 2 })">审批成功</div>
            </template>
          </el-tab-pane>
          <el-tab-pane name=" third ">
            <template #label>
              <div @click="selectStatusHandle({ approval_status: 3 })">审批失败</div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="fourth">
            <template #label>
              <div @click="selectStatusHandle({ approval_status: 4 })">已撤销</div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { approvalTypeList } from '@/utils/format';
export default {
  data() {
    return {
      activeMenu: 'all',
      activeName: 'first',
      searchForm: {
        approval_uid: '', //审批编号
        start_time: [], //发起时间范围
        end_time: [], //结束时间范围
        approval_status: '', //审批状态
      },
      approvalTypeList,
    };
  },
  mounted() {
    // 处理全部筛选
    if (this.activeMenu === 'all') {
      this.searchForm.approval_status = null;
    }
  },
  methods: {
    // 选择审批类型
    selectCustomerClass(type) {
      this.approval_type = type;
    },
    //点击筛选
    selectStatusHandle(val) {
      this.searchForm.approval_status = val.approval_status;
      this.handleSearch();
    },
    // 点击按条件查询
    handleSearch() {
      const searchForm = this.bindCondition();
      // 我已审批必传参
      const approval_type = {
        approval_search_type: 3,
        approval_status: this.searchForm.approval_status,
      };
      this.$emit('search', searchForm, approval_type);
    },
    // 重置
    handleReset() {
      // 清空数据
      this.searchForm = {
        approval_uid: '', //审批编号
        start_time: [], //发起时间范围
        end_time: [], //结束时间范围
        approval_status: this.searchForm.approval_status, //审批状态
      };
      //查询接口
      this.handleSearch();
    },
    // 绑定条件
    bindCondition() {
      const searchForm = JSON.parse(JSON.stringify(this.searchForm));
      // 发起时间范围
      if (searchForm.start_time) {
        if (searchForm.start_time.length === 0) {
          delete searchForm.start_time;
        } else {
          searchForm.start_time_min = searchForm.start_time[0];
          searchForm.start_time_max = searchForm.start_time[1];
          delete searchForm.start_time;
        }
      }
      // 结束时间范围
      if (searchForm.end_time) {
        if (searchForm.end_time.length === 0) {
          delete searchForm.end_time;
        } else {
          searchForm.end_time_min = searchForm.end_time[0];
          searchForm.end_time_max = searchForm.end_time[1];
          delete searchForm.end_time;
        }
      }

      // 审批编号
      if (searchForm.approval_uid === '') delete searchForm.approval_uid;
      // 审批状态
      if (searchForm.approval_status === '') delete searchForm.approval_status;
      return searchForm;
    },
  },
};
</script>
<style lang="less" scoped>
.bgc-withe {
  background: #fff;
  border-radius: 10px;
  position: relative;
}
.workbench-label {
  font-size: 16px;
  color: var(--text-color);
}
.tabs {
  position: absolute;
  bottom: -90px;
  padding-left: 10px;
}
.workbench-search-bar {
  margin-top: 40px;
}
</style>
