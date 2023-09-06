<!--
 * @Brief: 系统设置-消息管理
-->

<template>
  <div>
    <tg-card
      class="tg-built-in-role-page flex-auto"
      :padding="[16, 16, 0, 16]"
      @rect:update="onRectUpdate"
      v-bind="cardProps"
    >
      <!-- 表格 -->
      <el-table
        stripe
        v-if="Permission.canViewList"
        :data="list"
        style="width: 100%"
        v-loading="loading"
        v-bind="tableProps"
      >
        <el-table-column prop="id" label="ID" min-width="164"> </el-table-column>
        <el-table-column prop="instructions" label="说明" min-width="322" align="left">
          <template v-slot="{ row }">
            <div class="line-clamp-2">{{ row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="提醒频次" min-width="150" align="left">
          <template v-slot="{ row }">
            {{
              row.remind_frequency === 'once'
                ? '一次'
                : row.remind_frequency === 'weekly'
                ? '每周一次'
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="发送时间" min-width="150" align="center">
          <template v-slot="{ row }">{{
            row.send_time.substring(0, row.send_time.length - 3)
          }}</template>
        </el-table-column>
        <el-table-column label="状态" min-width="180" align="center">
          <template v-slot="{ row }">
            {{ row.status === '1' || row.status === 1 ? '启用' : '停用' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="122" align="left" fixed="right">
          <template v-slot="{ row }">
            <a class="edit-a" @click="handleUploadAction(row.id, row.status)">{{
              row.status === '0' || row.status === 0 ? '启用' : '停用'
            }}</a>
            <a class="edit-a" @click="handleEditAction(row.id, row.message_type, row.event_type)"
              >设置</a
            >
          </template>
        </el-table-column>
        <template #empty>
          <empty-common detail-text="暂未添加消息管理"></empty-common>
        </template>
      </el-table>
      <!-- 编辑弹框 -->
      <settingDialog
        :editingId="editingId"
        :msgType="msgType"
        :evtType="evtType"
        @closeAction="shouldEditing = !shouldEditing"
        v-if="shouldEditing"
      />
    </tg-card>
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less" scoped>
@import './index.less';
/deep/ .el-table {
  a,
  .cell,
  .status {
    font-size: 12px;
  }
  .tg-button {
    margin-right: 10px;
  }
}
.related-job-label-grid {
  margin-bottom: -10px;
  margin-right: -10px;
  padding: 4px;
  .related-job-label {
    background-color: #f3f4f6;
    color: var(--text-color);
    position: relative;
    height: 24px;
    line-height: 24px;
    border-radius: 4px;
    padding: 0 8px;
    font-size: 14px;
    margin-right: 10px;
    margin-bottom: 10px;

    display: inline-block;
  }
}
</style>
