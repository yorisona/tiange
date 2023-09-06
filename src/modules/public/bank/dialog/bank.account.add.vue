<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-21 17:15:46
-->
<template>
  <div>
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new"
      title="银行账号"
      :visible="visible"
      width="434px"
      height="364px"
      destroy-on-close
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="tg-dialog-bank-account-content">
        <el-form label-width="78px" size="small" :model="bank_info" :rules="rules">
          <el-form-item label="账号名称：" prop="account_name">
            <el-select placeholder="请选择账号" v-model="bank_info.account_id" style="width: 100%">
              <el-option label="构美（浙江）信息科技有限公司" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号：" prop="account">
            <el-input
              v-model="bank_info.account"
              placeholder="请输入账号"
              :maxlength="24"
              clearable
              @input="account_input"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户银行：" prop="bank">
            <el-input
              v-model="bank_info.bank"
              placeholder="请输入开户银行"
              :maxlength="10"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="开户行：" prop="account_bank">
            <el-input
              v-model="bank_info.account_bank"
              placeholder="请输入开户行"
              :maxlength="40"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="联行号：" prop="accoiation_bank_no">
            <el-input
              v-model="bank_info.accoiation_bank_no"
              placeholder="请输入联行号"
              :maxlength="12"
              clearable
              @input="accoiation_bank_no_input"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <tg-button @click="cancel" size="small" class="mgr-18">取消</tg-button>
        <tg-button type="primary" @click="sure" size="small">提交</tg-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./bank.account.add.ts"></script>

<style lang="less">
@import './bank.account.add.less';
</style>
