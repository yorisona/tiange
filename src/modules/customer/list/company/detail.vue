<template>
  <div class="tg-page-container tg-customer-company-detail-page" v-if="!loading">
    <tg-card
      class="flex-none"
      :padding="[18, 18, company.brands.length > 0 ? 0 : 6, 18]"
      bodyClass="tg-company-basic-block"
    >
      <div class="tg-company-title">
        <span class="title">{{ company.company_name }}</span>
        <div class="supplier-company-status">
          <el-popover
            v-if="company.approval_flow_detail && company.approval_flow_detail.length > 0"
            placement="bottom"
            width="246"
            style="padding: 0"
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
        <span class="add-by">{{ addByFormat }}</span>
      </div>
    </tg-card>
    <!-- [其它信息] -->
    <tg-card
      class="other-block mgt-18"
      :padding="[0, 18, 18, 18]"
      overflowInBody
      bodyClass="introduct-block-bd"
    >
      <head-lines style="margin: 14px 0px" title="财务信息" />
      <div class="other-grid" style="margin-bottom: 12px">
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">一般纳税人：</span>
          <span class="base-grid-item-content">{{ company.is_taxpayer === 1 ? '是' : '否' }}</span>
        </div>
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">纳税人识别号：</span>
          <span class="base-grid-item-content">{{ fillEmptyStr(company.tax_id) }}</span>
        </div>
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">公司电话：</span>
          <span class="base-grid-item-content">{{
            fillEmptyStr(company.cw_info_contact_phone)
          }}</span>
        </div>
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">公司地址：</span>
          <span class="base-grid-item-content" style="word-break: break-all">{{
            fillEmptyStr(company.address)
          }}</span>
        </div>
      </div>
      <div
        class="other-grid"
        v-for="(account, accountIdx) in company.company_account"
        :key="accountIdx"
        style="
          background-size: 13px 1px;
          background-repeat: repeat-x;
          margin: 0px 0px 12px;
          padding: 12px 0px 4px;
          background-image: linear-gradient(to right, #e0e4ea 0%, #e0e4ea 50%, transparent 30%);
        "
      >
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">对公账号类型：</span>
          <span class="base-grid-item-content">{{
            AccountTypeMap.get(account.account_type) || '--'
          }}</span>
        </div>
        <div class="base-grid-item">
          <span class="base-grid-item-lbl"
            >{{ account.account_type === 1 ? '银行账号' : '支付宝账号' }}：</span
          >
          <span class="base-grid-item-content">{{ fillEmptyStr(account.account_code) }}</span>
        </div>
        <template v-if="account.account_type === 1">
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">开户地区：</span>
            <span class="base-grid-item-content" v-if="account.bank_province && account.bank_city"
              >{{ account.bank_province }} {{ account.bank_city }}</span
            >
            <span class="base-grid-item-content" v-else>--</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">开户银行：</span>
            <span class="base-grid-item-content">{{ fillEmptyStr(account.bank_name) }}</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">开户支行：</span>
            <span class="base-grid-item-content"> {{ fillEmptyStr(account.bank_sub_name) }}</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">联行号：</span>
            <span class="base-grid-item-content">{{ fillEmptyStr(account.bank_code) }}</span>
          </div>
        </template>
      </div>
      <div
        style="
          background-size: 13px 1px;
          background-repeat: repeat-x;
          padding: 12px 0px 4px;
          font-size: 12px;
          background-image: linear-gradient(to right, #e0e4ea 0%, #e0e4ea 50%, transparent 30%);
        "
      >
        <div style="margin-top: 8px; display: flex" class="content" v-if="company.invoice_files">
          <div class="lbl" style="color: var(--text-third-color); font-size: 12px; flex-shrink: 0">
            开票信息：
          </div>
          <div
            v-for="(invoice_file, index) in company.invoice_files"
            :key="index"
            :class="index > 0 ? 'invoice_files mgl-12' : 'invoice_files'"
          >
            <tg-icon
              :name="isIntroduceFilePdf(invoice_file) ? 'ico-pdf' : 'ico-picture'"
              style="font-size: 16px"
            />
            <span class="link-name">{{ introduceFilename(invoice_file) }}</span>
            <a
              style="font-size: 12px"
              class="mgl-12"
              @click="onDownClick(invoice_file, introduceFilename(invoice_file))"
              v-if="!downloading"
              >下载</a
            >
            <template v-else>
              <div class="ani-spin" style="display: inline-flex; align-items: center">
                <tg-icon name="ico-loading" />
              </div>
              <a class="download-link" disabled style="cursor: progress">正在下载，请稍候...</a>
            </template>
          </div>
        </div>
      </div>
      <el-divider class="other-block-divider" />
      <head-lines style="margin: 14px 0px" title="联系人" />
      <!-- <div class="subject">联系人</div> -->
      <div class="other-grid">
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">联系人：</span>
          <span class="base-grid-item-content">{{ fillEmptyStr(company.contact) }}</span>
        </div>
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">手机号：</span>
          <span class="base-grid-item-content">{{ fillEmptyStr(company.contact_phone) }}</span>
        </div>
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">微信号：</span>
          <span class="base-grid-item-content">{{ fillEmptyStr(company.wechat) }}</span>
        </div>
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">邮箱：</span>
          <span class="base-grid-item-content">{{ fillEmptyStr(company.email) }}</span>
        </div>
      </div>
      <el-divider class="other-block-divider" />
      <head-lines style="margin: 14px 0px" title="品牌信息" />
      <template v-if="company.brands.length > 0">
        <div class="base-grid-item">
          <span class="base-grid-item-lbl">品牌：</span>
          <span class="base-grid-item-content">
            {{ company.brands.map(el => el.brand_name).join('、') }}
          </span>
        </div>
        <!-- <div
          v-for="(shopInfo, tagIndex) in company.shops_info"
          :key="tagIndex"
          class="tg-company-info other-grid"
          style="border-bottom: 1px dashed rgba(164, 178, 194, 0.3); padding-bottom: 12px"
          :style="{
            marginRight: tagIndex < company.shops.length - 1 ? '6px' : 0,
            marginBottom: '6px',
            borderWidth: tagIndex === company.shops.length - 1 ? '0px' : '1px',
          }"
        >
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">店铺名称：</span>
            <span class="base-grid-item-content">{{ shopInfo.shop_name }}</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">店铺类目：</span>
            <span class="base-grid-item-content">{{
              CustomerCategoryMAP.get(shopInfo.category) || '--'
            }}</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">店铺类型：</span>
            <span class="base-grid-item-content">{{
              ShopTypeMap.get(shopInfo.shop_type) || '--'
            }}</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">店铺品牌：</span>
            <span class="base-grid-item-content">{{ shopInfo.brand_name }}</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">客户类型：</span>
            <span class="base-grid-item-content">{{
              companyTypeList[shopInfo.company_type].value
                ? companyTypeList[shopInfo.company_type].value
                : '--'
            }}</span>
          </div>
          <div class="base-grid-item">
            <span class="base-grid-item-lbl">店铺ID：</span>
            <span class="base-grid-item-content">{{ shopInfo.xd_shop_id || '--' }}</span>
          </div>
        </div> -->
      </template>
      <p class="no-shops-line" style="margin-bottom: 18px" v-else>{{ NO_SHOPS_TIP }}</p>
      <div
        class="other-block-divider"
        style="
          background-color: rgba(164, 178, 194, 0.3);
          display: block;
          height: 1px;
          width: 100%;
          margin: 18px 0 4px 0;
        "
      />
      <head-lines style="margin: 14px 0px" title="公司介绍" />
      <div class="company-introduce-cctv" style="font-size: 12px">
        <template v-if="company.introduce === ''">
          <div
            class="empty-tip flex-auto"
            style="grid-column-start: 1; grid-column-end: 3; grid-row-start: 1; grid-row-end: 3"
          >
            <span style="color: var(--text-third-color)">暂无公司介绍哦~</span>
          </div>
        </template>
        <template v-else>
          <div class="content" ref="introduceRef">
            <span>{{ company.introduce || '--' }}</span>
          </div>
          <div
            style="margin-top: 8px; display: flex"
            class="content"
            v-if="company.introduce_files"
          >
            <div class="lbl">详细介绍：</div>
            <div
              v-for="(introduce_file, index) in company.introduce_files"
              :key="index"
              :class="index > 0 ? 'mgl-12' : ''"
            >
              <tg-icon
                :name="isIntroduceFilePdf(introduce_file) ? 'ico-pdf' : 'ico-picture'"
                style="font-size: 16px"
              />
              <span class="link-name">{{ introduceFilename(introduce_file) }}</span>
              <a
                class="mgl-12"
                @click="onDownClick(introduce_file, introduceFilename(introduce_file))"
                v-if="!downloading"
                >下载</a
              >
              <template v-else>
                <div class="ani-spin" style="display: inline-flex; align-items: center">
                  <tg-icon name="ico-loading" />
                </div>
                <a class="download-link" disabled style="cursor: progress">正在下载，请稍候...</a>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div
        class="other-block-divider"
        style="
          background-color: rgba(164, 178, 194, 0.3);
          display: block;
          height: 1px;
          width: 100%;
          margin: 18px 0 4px 0;
        "
      />
      <head-lines style="margin: 14px 0px" title="新增原因" />
      <div class="company-introduce-cctv" style="font-size: 12px">
        <template>
          <div class="content">
            <span>{{ company.reason || '--' }}</span>
          </div>
        </template>
      </div>
      <head-lines style="margin: 14px 0px" title="业务关联部门" />
      <div class="company-introduce-cctv" style="font-size: 12px">
        <template>
          <div class="content">
            <span>{{ company.department || '--' }}</span>
          </div>
        </template>
      </div>
    </tg-card>
    <formDrawer ref="formDrawerRef" @form:submit:success="onCompanyFormSubmitSuccess" />
  </div>
  <div class="" v-else-if="loading">
    <tg-block>
      <tg-icon class="ani-spin" name="ico-loading" />
      <span class="mgl-10">正在加载详情...</span>
    </tg-block>
  </div>
</template>

<script src="./detail.tsx"></script>
<style lang="less" scoped>
.content {
  /deep/ .invoice_files {
    display: flex;
    align-items: center;
    .link-name {
      margin-left: 2px;
    }
  }
}
</style>

<style lang="less">
@import './detail.less';
</style>
