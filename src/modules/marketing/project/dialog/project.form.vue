<!--
 * @Brief: 营销业务-项目管理- 新增/编辑 项目弹框
 * @Author: wuyou
 * @Date: 2021-04-13 10:19:53
-->
<template>
  <div class="tg-marketing-project-form-dialog tg-dialog-vcenter">
    <el-drawer
      :title="title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="tg-dialog-classic"
      :visible="visible"
      :wrapperClosable="false"
      @close="onCloseBtnClick"
    >
      <div class="tg-drawer-form-content">
        <el-alert
          v-if="!isEditForm"
          style="color: #ff7a36; height: 40px"
          :closable="false"
          title="注意：已确认合作的在此创建项目，意向客户请由客户经理在销售管理板块创建跟进任务"
          type="warning"
          show-icon
        >
        </el-alert>
        <el-form
          :model="ProjectForm"
          :rules="formRules"
          ref="formRef"
          label-position="top"
          size="mini"
          label-width="106px"
        >
          <head-lines style="margin: 10px 0px" title="项目信息" />
          <el-form-item class="one-item" label="项目名称" prop="cooperation_name">
            <el-input
              maxlength="20"
              v-model.trim="ProjectForm.cooperation_name"
              placeholder="请输入项目名称"
              ref="autoFocuseRef"
            >
            </el-input>
          </el-form-item>

          <el-form-item v-if="isEditForm" label="公司名称" prop="company_id" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              :disabled="isEditForm"
              :placeholder="ProjectForm.company_name ? ProjectForm.company_name : '--'"
            >
            </el-select>
          </el-form-item>

          <el-form-item v-else label="公司名称" prop="company_id" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="ProjectForm.company_id"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入并选择公司名称"
              :remote-method="getAllCompanyName"
              @change="onCompanyIdChange"
            >
              <el-option
                v-for="(item, index) in allCompanyName"
                :key="index"
                :label="item.company_name"
                :value="item.id"
              >
                <span>{{ item.company_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            v-if="isEditForm"
            label="店铺名称"
            prop="company_shop_id"
            class="two-item-right"
          >
            <el-select
              popper-class="el-select-popper-mini"
              :disabled="isEditForm"
              :placeholder="ProjectForm.shop_name ? ProjectForm.shop_name : '--'"
            >
            </el-select>
          </el-form-item>
          <el-form-item v-else label="店铺名称" prop="company_shop_id" class="two-item-right">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="ProjectForm.company_shop_id"
              placeholder="请选择店铺"
              @change="onShopIdChange"
            >
              <el-option
                v-for="(item, index) in allStoreName"
                :key="index"
                :label="item.shop_name"
                :value="item.shop_id"
              >
                <span>{{ item.shop_name }}</span>
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="品牌" class="two-item-right" prop="brand_id">
            <!-- <el-input disabled v-model="new_brand_name"></el-input> -->
            <el-select :disabled="isEditForm" v-model="ProjectForm.brand_id" filterable>
              <el-option
                v-for="brand in brandList || []"
                :label="brand.brand_name"
                :value="brand.id"
                :key="brand.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-else label="品牌" class="two-item-right">
            <el-input disabled v-model="brand_name" />
          </el-form-item> -->
          <!-- <el-form-item v-if="isEditForm" label="店铺类目" class="two-item-right">
            <el-input disabled v-model="new_shop_cateogry_name"></el-input>
          </el-form-item>
          <el-form-item v-else label="店铺类目" class="two-item-right">
            <el-input disabled v-model="shop_category_name" />
          </el-form-item> -->

          <!-- 客户经理 -->
          <el-form-item prop="manager_id" label="客户经理" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              filterable
              placeholder="请输入并选择客户经理"
              v-model="ProjectForm.manager_id"
              remote
              reserve-keyword
              clearable
              :remote-method="getAllCustomerManager"
              style="width: 267px; font-size: 12px"
            >
              <el-option
                v-for="(item, index) in CustomerManagerList"
                :key="index"
                :label="item.username"
                :value="item.id"
              >
                <span>{{ item.username }}</span>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="two-item-right" label="项目所属部门" prop="feishu_department_id">
            <el-popover
              placement="bottom-start"
              trigger="click"
              width="267"
              popper-class="marketing-department-tree-popper-class el-tree-popper-mini"
            >
              <div slot="reference" class="repain-select" style="display: block">
                <el-input
                  :value="ProjectForm.feishu_department_name"
                  style="color: var(--text-des-color)"
                  placeholder="请选择项目所属部门"
                  readonly
                >
                  <template #suffix>
                    <i class="select-icon select-icon-user-add el-icon-arrow-down"></i>
                  </template>
                </el-input>
              </div>
              <div class="department-tree">
                <el-tree
                  ref="maketing_department_tree"
                  :props="treeProps"
                  :check-strictly="true"
                  node-key="id"
                  :data="feishuDepartmentList"
                  show-checkbox
                  :default-checked-keys="default_checked_department_ids"
                  :default-expanded-keys="default_checked_department_ids"
                  @check="handleCheckChange"
                >
                </el-tree>
              </div>
            </el-popover>
          </el-form-item>

          <!-- <el-form-item
            prop="feishu_department_id"
            label="项目所属部门"
            class="two-item-right mgb-18"
          >
            <el-select popper-class="el-select-popper-mini"
              filterable
              placeholder="请选择项目所属部门"
              v-model="ProjectForm.feishu_department_id"
            >
              <el-option
                v-for="(item, index) in feishuDepartmentList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
                <span>{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="销售金额" class="two-item-left sale-cell" prop="sale_amount">
            <el-input
              v-model="ProjectForm.sale_amount"
              placeholder="请输入销售金额"
              @input="value => inputPositiveNumber(value, 'sale_amount')"
              ><span slot="append">元</span></el-input
            >
          </el-form-item>
          <el-form-item label="归属主体" prop="company_subject" class="two-item-right">
            <el-select
              popper-class="el-select-popper-mini"
              style="width: 100%"
              placeholder="请选择归属主体"
              v-model="ProjectForm.company_subject"
            >
              <el-option
                v-for="(item, index) in ProprietorTypeOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="合作类型"
            class="cooperation_item two-item-left"
            prop="cooperation_type"
          >
            <el-checkbox-group
              v-model="ProjectForm.cooperation_type"
              class="CooperationType-checkbox-group"
            >
              <el-checkbox class="CooperationType-checkbox" :label="1"><p>直播</p></el-checkbox>
              <el-checkbox class="CooperationType-checkbox" :label="2"><p>视频</p></el-checkbox>
              <el-checkbox class="CooperationType-checkbox" :label="3"><p>图文</p></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="是否收款" class="two-item-right" prop="is_gather">
            <div style="width: 246px">
              <el-radio-group
                v-model="ProjectForm.is_gather"
                style="
                  display: inline-grid;
                  grid-template-columns: repeat(2, 60px);
                  column-gap: 0;
                  margin-top: -6px;
                "
              >
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <!-- 回款日期 -->
          <div
            v-if="!ProjectForm.is_gather"
            class="one-item"
            style="
              margin-bottom: 18px;
              height: 90px;
              background: #f7f8f9;
              border-radius: 2px;
              padding: 18px;
            "
          >
            <el-form-item label="回款日期" prop="gather_date">
              <el-date-picker
                style="width: 249px"
                v-model="ProjectForm.gather_date"
                type="date"
                :editable="false"
                placeholder="回款日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </div>
          <!-- <el-form-item label="合作方案" class="one-item">
            <div style="display: flex">
              <div>
                <el-upload
                  v-model="ProjectForm.plan"
                  action="/"
                  :multiple="false"
                  :show-file-list="false"
                  :http-request="uploadFileHandler"
                  accept=".docx,.pdf,.jpg,.jpeg,.png,.xlsx"
                  :disabled="uploadedFileList.length >= 2"
                >
                  <tg-button icon="ico-btn-upload" :disabled="uploadedFileList.length >= 2"
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
                支持扩展名：.docx .pdf .jpg .png .xlsx（最多上传2个文件)
              </div>
            </div>
            <div class="fileList" style="margin-top: 8px">
              <div v-for="(item, index) in uploadedFileList" :key="index">
                <div class="fileItem">
                  <tg-icon
                    slot="icon"
                    :name="`ico-${item.icon}`"
                    style="width: 20px; height: 20px; line-height: 20px"
                  />
                  <div style="font-size: 14px; margin-left: 4px; height: 20px; line-height: 20px">
                    {{ item.name }}
                  </div>
                  <tg-icon
                    slot="icon"
                    name="ico-frm-delete"
                    hover-name="ico-frm-delete-active"
                    style="
                      margin-left: 7px;
                      font-size: 16px;
                      height: 20px;
                      line-height: 20px;
                      cursor: pointer;
                    "
                    @click="handleRemoveFileClick(index)"
                  />
                </div>
              </div>
            </div>
          </el-form-item> -->
          <!-- 客户需求 -->
          <!-- <div class="tg-dialog-section-title"><span></span>客户需求</div>
          <el-form-item label="预算" class="two-item-left mgb-18">
            <el-input
              v-model="ProjectForm.budget"
              placeholder="请输入客户预算金额"
              @input="value => inputPositiveNumber(value, 'budget')"
              ><span slot="append">元</span></el-input
            >
          </el-form-item>
          <el-form-item label="GMV要求" class="two-item-right mgb-18">
            <el-input
              v-model="ProjectForm.gmv"
              placeholder="请输入GMV要求"
              @input="value => inputPositiveNumber(value, 'gmv')"
              ><span slot="append">元</span></el-input
            >
          </el-form-item>

          <el-form-item label="UV要求" class="two-item-left mgb-18">
            <el-input
              v-model="ProjectForm.uv"
              placeholder="请输入UV要求"
              @input="value => inputPositiveInteger(value, 'uv')"
              ><span slot="append">个</span></el-input
            >
          </el-form-item>
          <el-form-item label="PV要求" class="two-item-right mgb-18">
            <el-input
              v-model="ProjectForm.pv"
              @input="value => inputPositiveInteger(value, 'pv')"
              placeholder="请输入PV要求"
              ><span slot="append">个</span></el-input
            >
          </el-form-item>

          <el-form-item label="其他要求" class="one-item mgb-18">
            <el-input
              v-model="ProjectForm.note"
              clearable
              maxlength="200"
              show-word-limit
              type="textarea"
              class="remark-input"
              placeholder="请输入其他要求"
            />
          </el-form-item>
          <el-form-item label="备注" class="one-item mgb-18">
            <el-input
              v-model="ProjectForm.remark"
              clearable
              maxlength="100"
              show-word-limit
              type="textarea"
              class="remark-input"
              placeholder="请输入备注"
            />
          </el-form-item> -->
        </el-form>
        <div class="tg-drawer-footer">
          <tg-button @click="onCloseBtnClick">取消</tg-button>
          <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
        </div>
      </div>
    </el-drawer>
    <tg-mask-loading :visible="saveLoading" content="  正在保存，请稍候..." />
  </div>
</template>
<script src="./project.form.ts"></script>

<style lang="less">
@import './project.form.less';
</style>
