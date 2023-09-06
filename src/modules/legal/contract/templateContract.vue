<template>
  <div class="tg-contract-page flex-auto">
    <tg-card class="flex-none" :padding="[16, 0, 16, 16]" @rect:update="onTopCardRectUpdate">
      <el-form
        class="filter-form flex-form"
        :inline="true"
        size="mini"
        :show-message="false"
        label-width="60px"
      >
        <el-form-item label="模板类型：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.template_type"
            clearable
            placeholder="请选择"
            style="width: 204px"
          >
            <el-option
              v-for="item in contractTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称：" class="flex-form-item form-item-group">
          <el-input
            class="contract-input"
            v-model="queryForm.name"
            placeholder="请输入模板名称"
            clearable
            v-key-enter="reload"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="业务类型：" class="flex-form-item">
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.business_type"
            clearable
            placeholder="请选择"
            style="width: 204px"
          >
            <el-option
              v-for="item in businessTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="模板状态："
          class="flex-form-item"
          style="margin-right: 20px; margin-bottom: 12px"
        >
          <el-select
            popper-class="el-select-popper-mini"
            class="select"
            v-model="queryForm.status"
            clearable
            placeholder="请选择"
            style="width: 204px"
          >
            <el-option
              v-for="item in ApprovalStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="flex-form-item order-100"
          style="margin-right: 20px; margin-bottom: 14px"
        >
          <tg-button type="primary" @click="reload">查询</tg-button>
          <tg-button class="mgl-8" @click="reset">重置</tg-button>
          <tg-button class="mgl-8" @click="uploadClick" v-if="Permission.canEditContract"
            >上传</tg-button
          >
        </el-form-item>
      </el-form>
    </tg-card>
    <!-- [列表] -->
    <tg-card
      class="result-list Customer-contract mgt-10"
      :class="cardFlexClass"
      :padding="[16, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <el-table
        stripe
        :data="list"
        v-loading="loading"
        v-if="Permission.canViewContractList"
        height="100%"
      >
        <el-table-column label="模板类型" min-width="128" align="left" fixed="left">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">
                {{
                  scope.row.template_type === 1 || scope.row.template_type === '1'
                    ? '客户合同'
                    : '供应商合同'
                }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="模板名称" min-width="288" fixed="left" align="left">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">
                {{ scope.row.name || '--' }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" min-width="238" align="left">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.busniesstype || '--' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="显示排序" min-width="108" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.priority || '--' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="108" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.status === 1 ? '启用' : '停用' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.gmt_modified || '--' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上传人" min-width="108" align="center">
          <template slot-scope="scope">
            <div class="line-info">
              <p class="clamp-1">{{ scope.row.add_by_name || '--' }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          :min-width="Permission.canEditContract ? 228 : 100"
          fixed="right"
          align="left"
        >
          <template slot-scope="scope">
            <div class="line-info">
              <span v-if="Permission.canEditContract" @click="changeStatusClick(scope.row)">{{
                scope.row.status === 1 ? '停用' : '启用'
              }}</span>
              <span @click="downClick(scope.row)">下载</span>
              <span v-if="Permission.canEditContract" @click="editClick(scope.row)">编辑</span>
              <span v-if="Permission.canEditContract" @click="deleteClick(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
        <!-- 空白页 -->
        <template #empty>
          <empty-common detail-text="暂无合同数据"></empty-common>
        </template>
      </el-table>
      <el-pagination
        v-if="Permission.canViewContractList && list.length"
        :current-page.sync="queryForm.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="queryForm.num"
        layout="total,prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
      />
    </tg-card>
    <tempalteContractDialog ref="editContractDialog" @saveClick="saveClick" />
  </div>
</template>

<script src="./templateContract.ts"></script>

<style lang="less" scoped>
@import './templateContract.less';
/deep/ .el-table {
  a,
  .cell,
  .status,
  .line-info {
    font-size: 12px;
  }
  .tg-button {
    margin-right: 10px;
  }
}
</style>
