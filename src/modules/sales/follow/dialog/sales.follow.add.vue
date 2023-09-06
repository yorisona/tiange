<template>
  <div class="tg-sales-follow-dialog-add-page">
    <el-dialog
      class="tg-dialog-classic tg-sales-follow-form-dialog"
      :visible="true"
      width="608px"
      top="132px"
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>{{ title }}</template>
      <div class="form-box">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
          <h3 class="form-module-title">跟进信息</h3>
          <el-form-item label="客户名称：" size="medium" prop="customer_uid">
            <el-select
              v-model="form.customer_name"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请搜索并选择客户名称"
              :remote-method="sendGetCustomerListRequest"
              @focus="handleCustomerFocus"
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.customer_name"
                :value="item.id"
              >
                <span>{{ item.customer_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型：" size="medium" prop="business_type">
            <el-radio-group v-model="form.business_type" style="margin-top: 12px">
              <el-radio :label="1">营销业务</el-radio>
              <el-radio :label="2">淘宝店播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="客户意向：" size="medium" prop="customer_intention">
            <el-radio-group v-model="form.customer_intention" style="margin-top: 12px">
              <el-radio :label="1">标三</el-radio>
              <el-radio :label="2">方案</el-radio>
              <el-radio :label="3">重点</el-radio>
              <el-radio :label="4">预测</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系人：" size="medium" prop="contact_name">
            <el-input v-model.trim="form.contact_name" placeholder="请输入联系人姓名" clearable />
          </el-form-item>
          <el-form-item label="联系方式：" maxLength="11" size="medium" prop="validate_person">
            <el-input
              v-model.trim="form.phone"
              placeholder="请输入手机号"
              clearable
              style="width: 236px"
            />
            <el-input
              v-model.trim="form.wechat"
              placeholder="请输入微信号"
              clearable
              style="width: 236px; margin-left: 10px"
            />
          </el-form-item>
          <el-form-item label="预估金额：" size="medium">
            <el-input v-model.trim="form.estimate_money" placeholder="请输入预估金额" clearable />
          </el-form-item>
          <el-form-item label="预估到账：" size="medium">
            <el-date-picker
              v-model="form.estimate_time"
              type="date"
              placeholder="请选择预估到账日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：" size="medium" class="remark-input">
            <el-input
              clearable
              maxlength="100"
              show-word-limit
              type="textarea"
              v-model="form.remark"
              class="remark-input"
              placeholder="请输入文本"
            />
          </el-form-item>
          <h3 class="form-module-title">跟进记录</h3>
          <el-form-item label="跟进时间：" size="medium" prop="follow_time">
            <el-date-picker v-model="form.follow_time" type="date" placeholder="请选择跟进时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="下次跟进：" size="medium">
            <el-date-picker v-model="form.next_time" type="date" placeholder="请选择下次跟进时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户情况：" size="medium" class="remark-input" prop="customer_info">
            <el-input
              clearable
              maxlength="200"
              show-word-limit
              type="textarea"
              v-model="form.customer_info"
              class="remark-input"
              placeholder="请输入文本"
            />
          </el-form-item>
        </el-form>
        <div class="customer-manager"><span>客户经理：</span> {{ form.customer_manager }}</div>
      </div>

      <template #footer>
        <tg-button @click="handleCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleSaveAction">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>
<script src="./sales.follow.add.ts"></script>
<style lang="less">
@import './sales.follow.add.less';
</style>
