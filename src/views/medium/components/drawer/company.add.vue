<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-05-07 13:16:38
-->
<template>
  <div class="tg-add-company-drawer">
    <el-drawer
      :visible="visible"
      @close="close"
      :title="id ? '编辑公司' : '新增公司'"
      :wrapperClosable="false"
    >
      <div class="tg-add-company-content">
        <el-form
          class="add-company-form"
          ref="formRef"
          :model="form"
          size="small"
          label-position="top"
          :rules="rules"
        >
          <!-- :rules="rules" -->
          <DrawerHeader title="公司基本信息" class="mgb-6"></DrawerHeader>
          <div class="form-section">
            <el-form-item label="公司名称" prop="name">
              <el-input
                clearable
                v-model.trim="form.name"
                placeholder="请输入公司名称"
                :maxlength="30"
                ref="autoFocuseRef"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司LOGO">
              <div class="pic-container">
                <Upp
                  action=""
                  :value="form.logo"
                  :http-request="uploadLogo"
                  :onBeforeUpload="beforeUploadLogo"
                  @remove="form"
                />
                <span class="tips">建议尺寸不小于400*400像素的正方形图片；图片大小不超过2M</span>
              </div>
            </el-form-item>
            <el-form-item label="擅长平台" prop="platforms">
              <div>
                <!-- <el-checkbox
                  v-model="form"
                  :indeterminate="isIndeterminatePlatform"
                  @change="selectAllPlatform"
                  >全选</el-checkbox
                > -->
                <el-checkbox-group
                  class="platform-selection-grid"
                  v-model="checkCooperationPlatformList"
                >
                  <template v-for="(item, index) in cooperationPlatforms">
                    <el-checkbox
                      :indeterminate="index === 0 ? isIndeterminatePlatform : false"
                      size="medium"
                      :label="item.value"
                      :key="item.value"
                      @change="checkedPlatformChange($event, index)"
                    />
                  </template>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item label="擅长领域" prop="areas">
              <div>
                <!-- <el-checkbox
                  class="checkbox-item"
                  v-model="checkAllCategory"
                  :indeterminate="isIndeterminateCategory"
                  @change="selectAllCategory"
                  >全选</el-checkbox
                > -->
                <el-checkbox-group class="category-selection-grid" v-model="checkCategoryList">
                  <template v-for="(item, index) in categories">
                    <el-checkbox
                      :indeterminate="index === 0 ? isIndeterminateCategory : false"
                      :label="item"
                      :key="item"
                      @change="checkedCategoryChange($event, index)"
                    />
                  </template>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </div>
          <DrawerHeader title="联系人及地址" class="mgb-6"></DrawerHeader>
          <div class="form-section">
            <div class="form-section-grid">
              <el-form-item label="业务联系人" prop="contact_person">
                <el-input
                  clearable
                  v-model.trim="form.contact_person"
                  placeholder="请输入联系人姓名"
                  :maxlength="20"
                ></el-input>
              </el-form-item>
              <el-form-item label="微信号" prop="wechat">
                <el-input
                  v-model="form.wechat"
                  placeholder="请输入微信号"
                  :maxlength="20"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人电话" prop="contact_no">
                <el-input
                  clearable
                  v-model.trim="form.contact_no"
                  placeholder="请输入联系人电话"
                  :maxlength="18"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱地址" prop="contact_email">
                <el-input
                  clearable
                  v-model.trim="form.contact_email"
                  placeholder="请输入邮箱地址"
                  :maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="财务联系人" prop="contact_person2">
                <el-input
                  clearable
                  v-model.trim="form.contact_person2"
                  placeholder="请输入联系人姓名"
                  :maxlength="20"
                ></el-input>
              </el-form-item>
              <el-form-item label="微信号" prop="wechat2">
                <el-input
                  clearable
                  v-model="form.wechat2"
                  placeholder="请输入微信号"
                  :maxlength="20"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系人电话" prop="contact_no2">
                <el-input
                  clearable
                  v-model.trim="form.contact_no2"
                  placeholder="请输入联系人电话"
                  :maxlength="18"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱地址" prop="contact_email2">
                <el-input
                  clearable
                  v-model.trim="form.contact_email2"
                  placeholder="请输入邮箱地址"
                  :maxlength="50"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item label="公司地址">
              <el-cascader
                clearable=""
                style="display: block"
                placeholder="请选择省/市/区"
                v-model="selectedAddress"
                :options="cities"
                @change="addressChanged"
              >
              </el-cascader>
              <el-input
                clearable
                v-model.trim="form.address"
                :maxlength="100"
                :show-word-limit="true"
                class="mgt-6 company-detail-address"
                type="textarea"
                placeholder="详细地址"
              ></el-input>
            </el-form-item>
          </div>

          <DrawerHeader title="财务信息" class="mgb-6"></DrawerHeader>
          <div class="form-section">
            <div class="form-section-grid">
              <el-form-item label="是否可以专票" prop="special_ticket">
                <el-radio-group v-model="form.special_ticket">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="开户行">
                <el-input
                  clearable
                  v-model.trim="form.bank_of_deposit"
                  placeholder="请输入开户行名称"
                  :maxlength="40"
                ></el-input>
              </el-form-item>
              <el-form-item label="银行账号" prop="bank_card_number">
                <el-input
                  clearable
                  v-model.trim="form.bank_card_number"
                  placeholder="请输入银行账号"
                  :maxlength="30"
                ></el-input>
              </el-form-item>
              <el-form-item label="支付宝账号" prop="alipay_account">
                <el-input
                  clearable
                  v-model.trim="form.alipay_account"
                  placeholder="请输入支付宝账号"
                  :maxlength="50"
                ></el-input>
              </el-form-item>
            </div>

            <el-form-item label="报价单">
              <div style="display: flex; height: 32px">
                <div>
                  <el-upload
                    v-model="form.quotation"
                    action="/"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadQuotationHandler"
                    accept=".docx,.pdf,.jpg,doc,.xlsx,xls"
                    :disabled="form.quotation ? true : false"
                    size="small"
                  >
                    <tg-button icon="ico-btn-upload" :disabled="form.quotation ? true : false"
                      >上传文件</tg-button
                    >
                  </el-upload>
                </div>
                <div
                  style="
                    height: 16px;
                    line-height: 16px;
                    font-size: 12px;
                    margin: 16px 0 0 12px;
                    color: #a4b2c2;
                  "
                >
                  支持扩展名： .xlsx .doc .docx .pdf .jpg .xls
                </div>
              </div>
              <div
                v-show="uploadedQuotationFileList.length"
                class="fileList"
                style="margin-top: 8px"
              >
                <div v-for="(item, index) in uploadedQuotationFileList" :key="index">
                  <div class="fileItem">
                    <tg-icon class="file-item-icon" slot="icon" :name="`ico-${item.icon}`" />
                    <div class="file-item-name line-clamp-1">
                      {{ item.name }}
                    </div>
                    <tg-icon
                      class="file-item-delete"
                      slot="icon"
                      name="ico-frm-delete"
                      hover-name="ico-frm-delete-active"
                      @click="handleRemoveQuotationClick(index)"
                    />
                  </div>
                </div>
              </div>
              <!-- <el-upload class="file-upload" action :http-request="form" :show-file-list="false">
                <div class="file-box" v-if="form">
                  <i class="icon-link" @click.stop></i>
                  <span class="file-name" @click.stop="form">{{ form }}</span>
                  <span class="close-box" @click.stop="form">
                    <i class="el-icon-close"></i>
                  </span>
                </div>
                <el-button
                  v-else
                  v-loading="form"
                  type="primary"
                  size="small"
                >
                  <i class="iconfont icon-zhongxinshangchuan"></i>上传文件
                </el-button>
                <span class="tips">支持扩展名： .xlsx .doc .docx .pdf .jpg</span>
              </el-upload> -->
            </el-form-item>
          </div>

          <DrawerHeader title="资质信息" class="mgb-6"></DrawerHeader>
          <div class="form-section">
            <el-form-item label="营业执照" prop="business_license">
              <div style="display: flex; height: 32px">
                <div>
                  <el-upload
                    v-model="form.business_license"
                    action="/"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadLicenseHandler"
                    accept=".pdf,.jpg,.png,.jpeg"
                    :disabled="(form.business_license ? form.business_license.length : 0) >= 4"
                  >
                    <tg-button
                      icon="ico-btn-upload"
                      :disabled="(form.business_license ? form.business_license.length : 0) >= 4"
                      >上传扫描件</tg-button
                    >
                  </el-upload>
                </div>
                <div
                  style="
                    height: 16px;
                    line-height: 16px;
                    font-size: 12px;
                    margin: 16px 0 0 12px;
                    color: #a4b2c2;
                  "
                >
                  支持扩展名：.pdf .jpg .png .jpeg，不超过30M
                </div>
              </div>
              <div
                v-show="uploadedDLicenseFileList.length"
                class="fileList"
                style="margin-top: 8px"
              >
                <div v-for="(item, index) in uploadedDLicenseFileList" :key="index">
                  <div class="fileItem">
                    <tg-icon class="file-item-icon" slot="icon" :name="`ico-${item.icon}`" />
                    <div class="file-item-name line-clamp-1">
                      {{ item.name }}
                    </div>
                    <tg-icon
                      class="file-item-delete"
                      slot="icon"
                      name="ico-frm-delete"
                      hover-name="ico-frm-delete-active"
                      @click="handleRemoveFileClick(0, index)"
                    />
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="开户许可证" prop="account_permit">
              <div style="display: flex; height: 32px">
                <div>
                  <el-upload
                    v-model="form.account_permit"
                    action="/"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadPermitHandler"
                    accept=".pdf,.jpg,.jpeg,.png"
                    :disabled="(form.account_permit ? form.account_permit.length : 0) >= 4"
                  >
                    <tg-button
                      icon="ico-btn-upload"
                      :disabled="(form.account_permit ? form.account_permit.length : 0) >= 4"
                      >上传扫描件</tg-button
                    >
                  </el-upload>
                </div>
                <div
                  style="
                    height: 16px;
                    line-height: 16px;
                    font-size: 12px;
                    margin: 16px 0 0 12px;
                    color: #a4b2c2;
                  "
                >
                  支持扩展名：.pdf .jpg .png .jpeg，不超过30M
                </div>
              </div>
              <div v-show="uploadedPermitFileList.length" class="fileList" style="margin-top: 8px">
                <div v-for="(item, index) in uploadedPermitFileList" :key="index">
                  <div class="fileItem">
                    <tg-icon class="file-item-icon" slot="icon" :name="`ico-${item.icon}`" />
                    <div class="file-item-name line-clamp-1">
                      {{ item.name }}
                    </div>
                    <tg-icon
                      class="file-item-delete"
                      slot="icon"
                      name="ico-frm-delete"
                      hover-name="ico-frm-delete-active"
                      @click="handleRemoveFileClick(1, index)"
                    />
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
          <DrawerHeader title="公司介绍" class="mgb-6"></DrawerHeader>
          <div class="form-section">
            <el-form-item label="公司介绍">
              <el-input
                clearable
                v-model.trim="form.description"
                class="company-description mgb-18"
                type="textarea"
                placeholder="您可以填写公司的文字介绍或公司相关链接"
                :show-word-limit="true"
                :maxlength="1000"
              ></el-input>
              <div style="display: flex; height: 32px">
                <div>
                  <el-upload
                    v-model="form.description_file"
                    action="/"
                    :multiple="false"
                    :show-file-list="false"
                    :http-request="uploadDescriptionHandler"
                    accept=".pdf,.jpg,.jpeg,.png"
                    :disabled="form.description_file ? true : false"
                  >
                    <tg-button
                      icon="ico-btn-upload"
                      :disabled="form.description_file ? true : false"
                      >上传PDF/公司介绍</tg-button
                    >
                  </el-upload>
                </div>
                <div
                  style="
                    height: 16px;
                    line-height: 16px;
                    font-size: 12px;
                    margin: 16px 0 0 12px;
                    color: #a4b2c2;
                  "
                >
                  支持pdf/图片上传，不超过80M
                </div>
              </div>
              <div
                v-show="uploadedDescriptionFileList.length"
                class="fileList"
                style="margin-top: 8px"
              >
                <div v-for="(item, index) in uploadedDescriptionFileList" :key="index">
                  <div class="fileItem">
                    <tg-icon class="file-item-icon" slot="icon" :name="`ico-${item.icon}`" />
                    <div class="file-item-name line-clamp-1">
                      {{ item.name }}
                    </div>
                    <tg-icon
                      class="file-item-delete"
                      slot="icon"
                      name="ico-frm-delete"
                      hover-name="ico-frm-delete-active"
                      @click="handleRemoveFileClick(2, index)"
                    />
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div class="tg-add-compnay-footer">
          <tg-button size="small" @click="close">取消</tg-button>
          <tg-button type="primary" size="small" @click="submit">保存</tg-button>
        </div>
      </div>
    </el-drawer>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>

<script src="./company.add.ts"></script>
<style lang="less">
@import './company.add.less';
</style>
