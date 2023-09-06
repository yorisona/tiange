<template>
  <div class="tg-user-page-tab-user" v-loading.lock="loading">
    <!-- 搜索组件 -->
    <tg-card class="flex-none" :padding="[16, 0, 4, 0]" @rect:update="onTopCardRectUpdate">
      <userSearch
        @transmitSearchCallback="p_transmitSearchCallback($event)"
        @transmitResetCallback="p_transmitResetCallback()"
      />
    </tg-card>
    <tg-card class="con-list-wrap flex-auto mgt-10" @rect:update="onRectUpdate" v-bind="cardProps">
      <div class="mgt-12">
        <!-- <tg-button

          type="primary"
          icon="ico-btn-add"
          v-if="Permission.canEditUser"
          @click="
            operateType = '新增';
            $refs.addUser.isDialog = true;
          "
        >
          新增用户
        </tg-button> -->
        <tg-button
          class="mgb-12"
          type="primary"
          icon="ico-btn-add"
          v-if="Permission.batchAuthorization_view"
          @click="dialogAuthorization.show()"
        >
          批量授权
        </tg-button>
      </div>
      <el-table
        height="100%"
        stripe
        :data="list"
        v-if="Permission.canViewUserList"
        v-bind="tableProps"
      >
        <template #empty>
          <empty-common></empty-common>
        </template>
        <el-table-column v-for="(col, colIndex) in columns" v-bind="col" :key="colIndex" />
      </el-table>
      <el-pagination
        :current-page="search_params.page_num"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="search_params.num"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        @current-change="p_currentChange($event)"
        @size-change="handlePageSizeChange"
        v-if="total > 0 && Permission.canViewUserList"
      />
    </tg-card>
    <addUser
      ref="addUser"
      :id="id"
      :type="operateType"
      @save:done="id = null"
      @cancel="id = null"
    />
  </div>
</template>

<script src="./user.ts"></script>

<style lang="less" scoped>
@import './user.less';
/deep/.el-table {
  a,
  .cell,
  .status {
    font-size: 12px;
  }
  .tg-button {
    margin-right: 10px;
  }
}
</style>
