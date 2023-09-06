<template>
  <el-drawer
    :title="companyFormModalTitle"
    height="100vh"
    :size="612"
    :visible="companyDrawerVisible"
    :wrapperClosable="false"
    @close="onClose"
  >
    <div class="company-drawer-content">
      <el-form
        class="company-form el-form-vertical"
        :model="companyForm"
        :rules="formRules"
        label-position="right"
        size="small"
        ref="formRef"
      >
        <!-- [公司基础信息] -->
        <DrawerHeader title="公司基础信息" style="padding: 0; margin-left: -12px" />
        <el-form-item label="公司名称" prop="company_name">
          <el-input
            v-model.trim="companyForm.company_name"
            placeholder="请输入公司名称"
            :maxlength="50"
            clearable
            ref="autoFocuseRef"
          />
        </el-form-item>
        <el-form-item label="公司LOGO" prop="">
          <div style="width: 100%; display: flex; align-items: flex-end">
            <Upp
              action="/api/medium/upload_file"
              :min-size-range="[400, 400]"
              :value="logo"
              :on-before-upload="onBeforeLogoUpload"
              :on-success="onLogoUploadSuccess"
              :key="timestamp"
              @remove="onLogoRemove"
            />
            <div class="upload-tips mgl-12" style="">
              建议尺寸不小于400*400像素的正方形图片；图片大小不超过2M
            </div>
          </div>
        </el-form-item>
        <!-- [联系人及地址] -->
        <DrawerHeader title="联系人及地址" style="padding: 0; margin-left: -12px" />
        <div class="cols">
          <!-- [业务联系人] -->
          <el-form-item label="业务联系人" prop="contact" class="col-1-2">
            <el-input
              clearable
              v-model.trim="companyForm.contact"
              :maxlength="20"
              placeholder="请输入联系人姓名"
              @input="value => inputContact(value, 'contact')"
            />
          </el-form-item>
          <el-form-item label="微信号" prop="wechat" class="col-2-3">
            <el-input
              v-model.trim="companyForm.wechat"
              placeholder="请输入微信号"
              :maxlength="20"
              @input="value => inputWechat(value, 'wechat')"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系人电话" prop="contact_phone" class="col-1-2">
            <el-input
              v-model.trim="companyForm.contact_phone"
              placeholder="请输入联系人电话"
              :maxlength="18"
              @input="value => inputContactPhone(value, 'contact_phone')"
              clearable
            />
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email" class="col-2-3">
            <el-input
              v-model.trim="companyForm.email"
              placeholder="请输入邮箱地址"
              :maxlength="32"
              clearable
            />
          </el-form-item>
          <!-- [财务联系人] -->
          <el-form-item label="财务联系人" prop="cw_contact" class="col-1-2">
            <el-input
              clearable
              v-model.trim="companyForm.cw_contact"
              :maxlength="20"
              placeholder="请输入联系人姓名"
              @input="value => inputContact(value, 'cw_contact')"
            />
          </el-form-item>
          <el-form-item label="微信号" prop="cw_wechat" class="col-2-3">
            <el-input
              v-model.trim="companyForm.cw_wechat"
              placeholder="请输入微信号"
              :maxlength="20"
              @input="value => inputWechat(value, 'cw_wechat')"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系人电话" prop="cw_contact_phone" class="col-1-2">
            <el-input
              v-model.trim="companyForm.cw_contact_phone"
              placeholder="请输入联系人电话"
              :maxlength="18"
              @input="value => inputContactPhone(value, 'cw_contact_phone')"
              clearable
            />
          </el-form-item>
          <el-form-item label="邮箱地址" prop="cw_email" class="col-2-3">
            <el-input
              v-model.trim="companyForm.cw_email"
              placeholder="请输入邮箱地址"
              :maxlength="32"
              clearable
            />
          </el-form-item>
        </div>
        <!-- [公司地址] -->
        <el-form-item label="公司地址" prop="cities">
          <el-cascader
            ref="cascader"
            :options="city"
            style="width: 100%"
            v-model="companyForm.cities"
            :props="{ value: 'id', label: 'name' }"
            placeholder="请选择省/市/区"
          />
        </el-form-item>
        <el-form-item label="" prop="address">
          <el-input
            type="textarea"
            v-model.trim="companyForm.address"
            :rows="3"
            placeholder="详细地址"
            :maxlength="100"
            :show-word-limit="true"
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <!-- [财务信息] -->
        <DrawerHeader title="财务信息" style="padding: 0; margin-left: -12px" />
        <div class="cols">
          <el-form-item label="是否一般纳税人" prop="is_taxpayer" class="col-1-2">
            <el-radio-group
              v-model="companyForm.is_taxpayer"
              style="width: 100%; height: 32px;display: flex; align-items：center"
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开户行" prop="bank_name" class="col-2-3">
            <el-input
              v-model.trim="companyForm.bank_name"
              :maxlength="40"
              placeholder="请输入开户行名称"
            />
          </el-form-item>
          <el-form-item label="银行账号" prop="bank_account" class="col-1-2">
            <el-input
              v-model.trim="companyForm.bank_account"
              :maxlength="30"
              placeholder="请输入银行账号"
              @input="onInputBankCount"
            />
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="tax_id" class="col-2-3">
            <el-input
              v-model="companyForm.tax_id"
              :maxlength="20"
              placeholder="请输入纳税人识别号"
              @input="onInputTaxID"
            />
          </el-form-item>
          <el-form-item label="注册地址" prop="cw_register_address" class="col-1-2">
            <el-input
              v-model.trim="companyForm.cw_register_address"
              :maxlength="100"
              placeholder="请输入公司注册地址"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="cw_info_contact_phone" class="col-2-3">
            <el-input
              v-model.trim="companyForm.cw_info_contact_phone"
              :maxlength="18"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item label="接收发票手机" prop="cw_invoice_phone" class="col-1-2">
            <el-input
              v-model.trim="companyForm.cw_invoice_phone"
              placeholder="请输入接收电子发票的手机"
            />
          </el-form-item>
          <el-form-item label="接收发票邮箱" prop="cw_invoice_email" class="col-2-3">
            <el-input
              v-model.trim="companyForm.cw_invoice_email"
              placeholder="请输入接收电子发票的邮箱"
            />
          </el-form-item>
        </div>
        <!-- [公司介绍] -->
        <DrawerHeader title="公司介绍" style="padding: 0; margin-left: -12px; margin-top: 6px" />
        <el-form-item label="文字介绍" prop="introduce">
          <el-input
            type="textarea"
            v-model.trim="companyForm.introduce"
            :rows="4"
            placeholder="您可以填写公司的文字介绍或公司相关链接"
            :maxlength="1000"
            :show-word-limit="true"
            style="width: 100%"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="introduce_file">
          <div style="display: inline-flex; height: 32px; align-items: center">
            <Uppf
              action="/api/medium/upload_file"
              :on-success="onIntroduceFileUploadSuccess"
              :name="filename"
              :value="companyForm.introduce_file"
              @file:remove="onIntroduceFileRemove"
              :key="timestamp"
              :showFileList="false"
              style="flex-wrap: wrap"
            />
            <div class="upload-tips" style="margin-left: 12px; align-self: flex-end">
              支持上传一个PDF/图片文件；大小不超过50M
            </div>
          </div>
          <div class="introduce-file" v-if="companyForm.introduce_file !== ''">
            <tg-icon :name="isIntroduceFilePdf ? 'ico-pdf' : 'ico-picture'" />
            <span class="line-clamp-1 filename">{{ introduceFileName }}</span>
            <tg-icon
              name="ico-frm-delete"
              hover-name="ico-frm-delete-active"
              @click="removeIntroduceFile"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="el-drawer-footer">
      <tg-button type="default" @click="onCancel">取消</tg-button>
      <tg-button type="primary" @click="onSubmit">保存</tg-button>
    </div>
    <tg-mask-loading :visible="loading" content="正在保存数据，请稍候..." />
  </el-drawer>
</template>

<script src="./drawer.ts"></script>

<style lang="less">
@import './drawer.less';
</style>
