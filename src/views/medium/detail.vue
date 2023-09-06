<template>
  <div class="tg-page-container supplier-company-detail" style="flex-grow: 1">
    <tg-card>
      <div class="supplier-company-info" style="padding: 10px 0px; margin-top: 6px">
        <div class="supplier-company-info-detail">
          <div class="supplier-company-info-header">
            <span class="name line-clamp-1" style="margin-right: 12px">{{
              company.name || '--'
            }}</span>
            <div class="supplier-company-status">
              <el-popover
                v-if="company.approval_flow_detail.length > 0"
                placement="bottom"
                width="246"
                trigger="hover"
                popper-class="company-detail-approve-progress-popper"
              >
                <template #reference>
                  <span :class="[status_tag_class]" class="mgr-10">{{ contract_status_str }}</span>
                </template>
                <NewApproveProgress
                  :work-infos="company.approval_flow_detail"
                  :checkStatus="verify_status"
                />
              </el-popover>
              <tg-icon
                v-if="company.verify_status === 1"
                name="ico-edit"
                class="case-edit"
                @click="handleEditClick"
              />
            </div>
            <span class="add-by">录入人：{{ company.add_by || '--' }}</span>
          </div>
        </div>
      </div>
    </tg-card>
    <tg-card class="mgt-18 company-detail-info" style="flex-grow: 1">
      <div class="platform-info bottom-style">
        <div class="info-content" style="row-gap: 12px">
          <div style="display: flex">
            <span class="label" style="width: 60px">擅长平台：</span>
            <div class="platforms-or-areas" v-if="platforms && platforms.length > 0">
              <span class="item" v-for="item in platforms" :key="item">{{ item }}</span>
            </div>
            <div class="platforms-or-areas" v-else>--</div>
          </div>
          <div style="display: flex">
            <span class="label" style="width: 60px">擅长领域：</span>
            <div class="platforms-or-areas" v-if="areas && areas.length > 0">
              <span class="item" v-for="item in areas" :key="item">{{ item }}</span>
            </div>
            <div class="platforms-or-areas" v-else>--</div>
          </div>
        </div>
      </div>
      <div class="finance-info bottom-style" style="padding-bottom: 8px">
        <head-lines style="margin: 18px 0px 16px 0px" title="财务信息" />
        <div class="info-content" style="padding: 0 8px; margin-top: 6px">
          <div class="info-item">
            <span class="label">是否专票：</span>
            <span class="value">{{
              company.special_ticket ? '是' : company.special_ticket === 0 ? '否' : '--'
            }}</span>
          </div>
          <div class="info-item">
            <span class="label">财务电话：</span>
            <span class="value line-clamp-1">{{ company.contact_no2 || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="label">一般纳税人：</span>
            <span class="value line-clamp-1">{{
              company.is_taxpayer ? '是' : company.is_taxpayer === 0 ? '否' : '--'
            }}</span>
          </div>
        </div>
        <div
          class="info-content"
          style="
            /*border-top: dashed 1px #dcdfe6;*/
            border-radius: 4px;
            margin-bottom: 12px;
            padding: 12px 0px 4px 0px;
            margin: 0 8px;
            background-image: linear-gradient(to right, #e0e4ea 0%, #e0e4ea 50%, transparent 30%);
            background-size: 13px 1px;
            background-repeat: repeat-x;
          "
          v-for="(item, index) in company.gather_account_list"
          :key="index"
        >
          <div class="info-item" style="margin-bottom: 8px">
            <span class="label">收款账号类型：</span>
            <span class="value line-clamp-1">{{
              item.account_type === 1 ? '银行账户' : '支付宝账户'
            }}</span>
          </div>
          <template v-if="item.account_type === 1">
            <div class="info-item" style="margin-bottom: 8px">
              <span class="label">银行账号：</span>
              <span class="value line-clamp-1">{{ item.bank_card_number }}</span>
            </div>
            <div class="info-item" style="margin-bottom: 8px">
              <span class="label">开户地区：</span>
              <span class="value line-clamp-1"
                >{{ item.bank_region[0] }} {{ item.bank_region[1] }}</span
              >
            </div>
            <div class="info-item" style="margin-bottom: 8px">
              <span class="label">开户支行：</span>
              <span class="value line-clamp-1">{{ item.bank_sub_name }}</span>
            </div>
            <div class="info-item" style="margin-bottom: 8px">
              <span class="label">开户银行：</span>
              <span class="value line-clamp-1">{{ item.bank_name }}</span>
            </div>
            <div class="info-item" style="margin-bottom: 8px">
              <span class="label">银联号：</span>
              <span class="value line-clamp-1">{{ item.bank_code }}</span>
            </div>
          </template>
          <div v-else class="info-item" style="margin-bottom: 8px">
            <span class="label">支付宝账号：</span>
            <span class="value line-clamp-1">{{ item.alipay_account }}</span>
          </div>
        </div>
      </div>

      <div class="qualification-info bottom-style">
        <head-lines style="margin: 18px 0px 16px 0px" title="资质信息" />
        <div class="info-content" style="padding: 0 8px; margin-top: 6px">
          <div class="info-item">
            <span class="label">营业执照：</span>
            <div class="value">
              <div
                v-for="(item, index) in company.business_license"
                :key="index"
                class="line-clamp-1 uploaded-file"
                style="flex-shrink: 0"
              >
                <FileItem :key="1001" :filepath="item" :readonly="true" :showPreview="false" />
              </div>
              <div v-if="(company.business_license ? company.business_license.length : 0) === 0">
                --
              </div>
            </div>
          </div>
          <div class="info-item">
            <span class="label" style="width: 86px">银行信息证明：</span>
            <div class="value">
              <div
                v-for="(item, index) in company.account_permit"
                :key="index"
                class="line-clamp-1 uploaded-file"
                style="flex-shrink: 0"
              >
                <FileItem :key="1002" :filepath="item" :readonly="true" :showPreview="false" />
              </div>
              <div v-if="(company.account_permit ? company.account_permit.length : 0) === 0">
                --
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="contract-info bottom-style" style="padding-bottom: 8px">
        <head-lines style="margin: 18px 0px 16px 0px" title="联系人及地址" />
        <div class="info-content" style="padding: 0 8px; margin-top: 6px; margin-bottom: 0px">
          <div class="info-item" style="margin-bottom: 12px">
            <span class="label">联系人：</span>
            <span class="value line-clamp-1">{{
              company.contact_person ? company.contact_person : '--'
            }}</span>
          </div>
          <div class="info-item" style="margin-bottom: 12px">
            <span class="label">手机号：</span>
            <span class="value line-clamp-1">{{
              company.contact_no ? company.contact_no : '--'
            }}</span>
          </div>
          <div class="info-item" style="margin-bottom: 12px">
            <span class="label">微信号：</span>
            <span class="value line-clamp-1">{{ company.wechat ? company.wechat : '--' }}</span>
          </div>
          <div class="info-item" style="margin-bottom: 12px">
            <span class="label">邮箱：</span>
            <span class="value line-clamp-1">{{
              company.contact_email ? company.contact_email : '--'
            }}</span>
          </div>
        </div>
      </div>

      <div class="company-info bottom-style">
        <head-lines style="margin: 18px 0px 16px 0px" title="公司介绍" />
        <div class="info-content" style="margin-top: 6px">
          <div class="supplier-company-info-description" style="margin-left: 4px">
            <template v-if="company.description || company.description_file">
              <div class="summary-description">
                <span style="line-height: 22px">{{
                  company.description ? company.description : '--'
                }}</span>
              </div>
              <div class="detail-description mgt-6 mgl-16">
                <template v-if="company.description_file.length > 0">
                  <div class="label" :key="'desc' + index">详细介绍：</div>
                  <template v-for="(description_file, index) in company.description_file">
                    <FileItem
                      :key="index"
                      :filepath="description_file"
                      :readonly="true"
                      :showPreview="false"
                      style="width: 300px"
                    />
                  </template>
                </template>
              </div>
            </template>
            <div v-else style="color: var(--text-third-color)">暂无公司介绍哦~</div>
          </div>
        </div>
        <div class="company-info bottom-style">
          <head-lines style="margin: 14px 0px" title="新增原因" />
          <div class="company-introduce-cctv" style="font-size: 12px">
            <template>
              <div class="content">
                <span>{{ company.reason || '--' }}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="company-info bottom-style">
          <head-lines style="margin: 14px 0px" title="费用承担部门" />
          <div class="company-introduce-cctv" style="font-size: 12px">
            <template>
              <div class="content">
                <span>{{ company.department || '--' }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </tg-card>
    <CompanyAdd
      :id="id"
      :editCompany="companyFormEdit"
      :visible.sync="companyVisible"
      @save="saveCompany"
    ></CompanyAdd>
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
