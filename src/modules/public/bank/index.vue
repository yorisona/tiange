<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-21 16:23:51
-->
<template>
  <div class="tg-public-bank-container">
    <div v-if="permission.finance_account_modify">
      <tg-button class="mgl-16 mgt-12" type="primary" @click="onAddAccountHandler"
        >新增账户</tg-button
      >
    </div>
    <tg-card v-bind="cardProps">
      <el-table
        border
        stripe
        :class="permission.finance_account_modify ? 'mgt-12' : 'mgt-16'"
        :data="bank_list"
        v-bind="tableProps"
        v-loading="loading"
      >
        <el-table-column v-for="(col, index) in columns" v-bind="col" :key="index" />
        <template #empty>
          <empty-common detail-text="暂无项目"></empty-common>
        </template>
      </el-table>
    </tg-card>
    <bank-account-add
      :bank="edit_bank"
      :visible.sync="visible"
      @close="onEditClose"
    ></bank-account-add>
    <addAccount ref="addAccountRef" @save="onAccountSave"></addAccount>
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less">
@import './index.less';
</style>
