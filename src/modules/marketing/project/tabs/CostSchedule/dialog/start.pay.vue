<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-09 14:02:03
-->
<template>
  <div class="tg-cost-start-pay">
    <el-dialog
      class="customer-dialog tg-dialog-vcenter-new"
      :visible="visible"
      width="440px"
      title="发起打款"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <div class="cost-start-pay-container">
        <el-form
          ref="elFormRef"
          :model="formData"
          :rules="elFormRules"
          label-width="80px"
          label-position="top"
          size="mini"
        >
          <el-form-item label="KOL名称" prop="kol">
            <el-select
              v-model="formData.kol"
              filterable
              remote
              reserve-keyword
              placeholder="请输入并选择KOL名称"
              :remote-method="queryKOL"
              :loading="queryKOLloading"
              value-key="kol_name"
            >
              <el-option
                v-for="kol in kolList"
                :label="kol.kol_name"
                :value="kol"
                :key="kol.kol_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务执行日期" prop="start_end_date">
            <el-date-picker
              type="daterange"
              range-separator="～"
              v-model="formData.start_end_date"
              style="width: 100%"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="打款日期" prop="pay_date">
            <el-date-picker
              type="date"
              placeholder="请选择打款日期"
              v-model="formData.pay_date"
              style="width: 100%"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              :editable="false"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item v-if="cost.pay_way === 2" label="V任务链接" prop="v_task_link">
            <el-input placeholder="请输入V任务链接" v-model.trim="formData.v_task_link"> </el-input>
          </el-form-item>
          <el-form-item v-if="cost.pay_way === 2" label="产品链接" prop="v_task_product_link">
            <el-input placeholder="请输入产品链接" v-model.trim="formData.v_task_product_link">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onClose">取消</tg-button>
        <tg-button type="primary" @click="onSave">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>
<script src="./start.pay.ts"></script>
<style lang="less">
@import './start.pay.less';
</style>
