<!--
 * @Description: 待我审批-筛选
 * @Autor: 神曲
 * @Date: 2020-04-02 14:13:48
 * @LastEditors: 神曲
 * @LastEditTime: 2020-04-21 17:45:29
 -->

<template>
  <div>
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
        <el-button class="btn-search btn-blue" type="primary" size="small" @click="handleSearch"
          >查询</el-button
        >
        <tg-button type="negative" size="small" @click="handleReset">重置</tg-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { approvalTypeList } from '@/utils/format';
export default {
  data() {
    return {
      activeName: 'first',
      searchForm: {
        approval_uid: '', //审批编号
        approval_type: '', //审批类型
      },
      approvalTypeList,
    };
  },
  methods: {
    // 选择审批类型
    selectCustomerClass(type) {
      this.approval_type = type;
    },
    // 点击按条件查询
    handleSearch() {
      const searchForm = this.bindCondition();
      // 待我审批必传参
      const approval_type = {
        approval_search_type: 1,
      };

      this.$emit('search', searchForm, approval_type);
      //查询接口
    },
    bindCondition() {
      const searchForm = JSON.parse(JSON.stringify(this.searchForm));
      // 审批编号
      if (searchForm.approval_uid === '') delete searchForm.approval_uid;
      //审批类型
      if (searchForm.approval_type === '') delete searchForm.approval_type;
      return searchForm;
    },
    // 重置
    handleReset() {
      // 清空数据
      this.searchForm = {
        approval_uid: '', //审批编号
        approval_type: '', //审批类型
      };
      //查询接口
      this.handleSearch();
    },
  },
};
</script>
<style lang="less" scoped>
.workbench-label {
  font-size: 16px;
  color: var(--text-color);
}
.workbench-search-bar {
  margin-top: 40px;
}
</style>
