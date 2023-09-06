<template>
  <div
    id="customer-contract-detail"
    class="tg-page-container tg-customer-contract-detail"
    style="position: relative"
  >
    <!-- [合同详情] -->
    <div class="contract-detail-content" v-loading="loading" v-if="detail">
      <!-- [合同基础信息] -->
      <tg-block class="content-block">
        <template #title>
          <div class="contract-title">
            <div class="contract-title-left">
              <span class="contract-type-label-circle" :class="contract_type_label_class">{{
                contract_type_label
              }}</span>
              <span>{{ detail.contract_info.contract_uid }}</span>
            </div>
            <div class="contract-title-right">
              <div class="btns-line">
                <tg-button
                  icon="ico-edit-lite"
                  v-if="oprateBtnVisiable && detail.contract_info.contract_status !== 5"
                  @click="handleEditContractClick"
                  >编辑</tg-button
                >
                <tg-button
                  type="negative"
                  icon="ico-btn-delete"
                  @click="handleDeleteContractClick"
                  v-if="是否有删除按钮权限 && 删除按钮是否可用"
                  >删除</tg-button
                >
                <template v-if="是否有作废按钮权限">
                  <el-popover placement="left" trigger="hover" v-if="作废按钮是否禁用">
                    <template #reference>
                      <tg-button class="disabled" type="negative" icon="ico-invalid-lite">
                        <span>作废</span>
                      </tg-button>
                    </template>
                    <span>补充协议/结算单审批中，禁止作废</span>
                  </el-popover>
                  <tg-button type="negative" icon="ico-invalid-lite" v-else @click="作废合同()"
                    >作废</tg-button
                  >
                </template>
              </div>
            </div>
          </div>
        </template>
        <!-- [基础信息] -->
        <div class="base-grid">
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">客户名称：</div>
            <div class="base-grid-item-content">
              <DefText class="line-clamp-1" :content="customer_name" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">合同状态：</div>
            <div class="base-grid-item-content">
              <span :class="[status_tag_class]" class="mgr-10">{{ contract_status_str }}</span>
              <el-popover
                v-if="isFlowFromOA"
                placement="right-start"
                trigger="click"
                popper-class="approve-progress-popper"
                @show="onFlowsShow"
              >
                <template #reference>
                  <a>查看进度</a>
                </template>
                <div v-if="flowsLoading" style="padding: 10px 20px">正在查询进度...</div>
                <template v-else>
                  <oa-flows v-if="flows.length > 0" :status="status" />
                  <div v-else-if="flowsError !== ''">{{ flowsError }}</div>
                </template>
              </el-popover>
              <el-popover
                v-if="!isFlowFromOA && detail.contract_work_infos.length > 0"
                placement="bottom"
                width="246"
                trigger="click"
                popper-class="approve-progress-popper"
              >
                <template #reference>
                  <a>查看进度</a>
                </template>
                <approve-progress
                  :work-infos="detail.contract_work_infos"
                  :contract-info="detail"
                />
              </el-popover>
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">创建人：</div>
            <div class="base-grid-item-content">
              <DefText :content="detail.contract_info.add_by_name" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">关联店铺：</div>
            <div class="base-grid-item-content">
              <DefText class="line-clamp-1" :content="detail.contract_info.shop_name" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">合作期限：</div>
            <div class="base-grid-item-content">
              <DefText :content="coop_date" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">创建人部门：</div>
            <div class="base-grid-item-content">
              <DefText :content="detail.contract_info.add_by_department" />
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">销售渠道：</div>
            <div class="base-grid-item-content">
              <el-popover
                popperClass="contract-sale-chance-popover"
                placement="right"
                :width="364"
                trigger="hover"
              >
                <template #reference>
                  <div class="sale-chance-content">{{ sale_chances }}</div>
                </template>
                <div class="contract-sale-chance-all">
                  <tg-tag-group theme="gray" :tags="sale_chances_str_list" />
                </div>
              </el-popover>
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">合同是否收回：</div>
            <div class="base-grid-item-content">
              <span>{{ detail.contract_info.is_recycled === 1 ? '已收回' : '未收回' }}</span>
            </div>
          </div>
          <div class="base-grid-item">
            <div class="base-grid-item-lbl">创建时间：</div>
            <div class="base-grid-item-content">
              {{ detail.contract_info.create_time_str }}
            </div>
          </div>
        </div>
        <!-- [关联合同] -->
        <div class="base-grid-item mgb-10">
          <div class="base-grid-item-lbl" style="width: 98px">关联合同：</div>
          <div class="base-grid-item-content">
            <template v-if="related_contracts.length > 0">
              <template v-for="(contract, index) in related_contracts">
                <span :key="contract.contract_uid" v-if="index > 0">、</span>
                <a :key="contract.contract_uid" :href="getContractLink(contract)" target="_blank">{{
                  contract.contract_uid
                }}</a>
              </template>
            </template>
            <template v-else>
              <DefText />
            </template>
          </div>
        </div>
        <div>
          <div class="base-grid-item mgb-20">
            <div class="base-grid-item-lbl">
              <span style="padding-left: 55px">备注：</span>
              <span v-if="detail.contract_info.remark" style="color: #333333">{{
                detail.contract_info.remark
              }}</span>
              <template v-else>
                <DefText />
              </template>
            </div>
          </div>
        </div>

        <div class="line mgb-20"></div>
        <!-- <div class="line mgb-20"></div> -->
        <template>
          <div class="subject" style="">合作项目</div>
          <div class="base-grid-item" style="padding: 10px 0">
            <div class="base-grid-item-lbl" style="width: 98px; flex-shrink: 0">项目名称：</div>
            <div class="base-grid-item-content">
              <DefText
                :content="(detail.project_infos || []).map(el => el.project_name).join('、')"
              />
            </div>
          </div>
          <div class="line mgt-10 mgb-20"></div>
        </template>
        <!-- [合同明细] -->
        <template v-if="!是否框架合同">
          <div class="subject" style="">合同明细</div>
          <div class="base-grid">
            <div class="base-grid-item" v-for="field in contract_detail_fields" :key="field.prop">
              <div class="base-grid-item-lbl">{{ field.name }}：</div>
              <div class="base-grid-item-content">
                {{ field.value }}
              </div>
            </div>
          </div>
          <div class="line mgt-10 mgb-20"></div>
        </template>
        <!-- [合同附件] -->
        <template v-if="detail.project_contract_relation_type !== 2">
          <div>
            <div class="attachment-label">合同附件</div>
            <TgFileCardGroup
              :filelist="
                attachment_list.map(el => ({ filename: el.filename, url: el.originalUrl }))
              "
              :editable="false"
              v-if="attachment_list.length > 0"
            />
            <div class="no-attachment mgt-10" v-else>未上传附件</div>
          </div>
          <div class="line mgt-20 mgb-20"></div>
          <!-- [合同扫描件] -->
          <div class="attachment-label mgt-10">
            <span>合同扫描件</span>
            <tg-button
              v-if="
                permission.law_verify_contract_scan &&
                能否上传合同扫描件 &&
                detail.contract_info.contract_scan_status === 1 &&
                contract_scan_urls.length > 0
              "
              type="link"
              class="mgl-12"
              @click="onApprovalHandler"
              >审核</tg-button
            >
          </div>
          <TgFileCardGroup
            style="position: relative"
            :filelist="
              contract_scan_urls.map(el => ({
                filename: el.filename,
                url: el.originalUrl,
              }))
            "
            :editable="能否上传合同扫描件"
            :max="20"
            @remove="url => 点击删除扫描件(url)"
            v-if="contract_scan_urls.length >= 0"
          >
            <template #default>
              <el-upload
                action
                :http-request="uploadScanFiles"
                :show-file-list="false"
                accept=".doc,.pdf,.docx"
                v-if="
                  上传合同扫描件按钮是否显示 &&
                  (detail.contract_info.contract_scan_status === 0 ||
                    detail.contract_info.contract_scan_status === 3)
                "
              >
                <div class="tg-file-card-add-btn">
                  <tg-icon name="ico-add-thin" />
                  <div class="mgt-16">支持：pdf、doc、docx</div>
                  <div>单个文件不超过50M</div>
                </div>
              </el-upload>
              <span class="no-attachment" style="width: 200px" v-else>{{
                contract_scan_urls.length > 0
                  ? ''
                  : [
                      approval_status.Failure,
                      approval_status.Processing,
                      approval_status.Invalid,
                    ].includes(detail.contract_info.contract_status)
                  ? '合同审批通过后由创建人上传'
                  : '未上传合同扫描件'
              }}</span>
              <div
                v-if="
                  detail.contract_info.contract_scan_status === 2 ||
                  detail.contract_info.contract_scan_status === 3
                "
                :style="{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '0',
                  'font-size': '12px',
                  width: '178px',
                  'text-align': 'center',
                  color:
                    detail.contract_info.contract_scan_status === 3
                      ? 'red'
                      : 'var(--success-color)',
                }"
              >
                {{ detail.contract_info.contract_scan_status === 2 ? '审批通过' : '已驳回' }}
              </div>
            </template>
          </TgFileCardGroup>
          <div class="no-attachment mgt-10" v-else>未上传扫描件</div>
        </template>
        <!-- [收款计划] -->
        <template v-if="是否销售合同">
          <div class="line mgt-20 mgb-20"></div>
          <div class="subject">收款计划</div>
          <div class="block-content plan-list mgt-10">
            <el-table stripe :data="detail.proceeds_plan">
              <el-table-column
                v-for="(col, colIndex) in planColumns"
                v-bind="col"
                :key="colIndex"
              />
            </el-table>
          </div>
        </template>
      </tg-block>
      <!-- [补充协议/结算单tabs] -->
      <tg-block
        v-if="false"
        class="annex-block mgt-10 pdb-10"
        :bodyStyle="是否框架合同 ? { padding: '0' } : { padding: '10px 0' }"
      >
        <template #title>
          <template v-if="是否销售合同">
            <div class="contract-title" style="padding-left: 18px">
              <span class="contract-title-left attachment-label">补充协议详情</span>
              <a
                class="contract-title-right"
                v-if="
                  能否显示补充协议和结算单新增按钮 &&
                  !breadcrumb.isLegalCustomerContractDetail &&
                  !breadcrumb.isLegalStatisticsCustomerContractDetail &&
                  !breadcrumb.isCommonBusinessCustomerContractDetail &&
                  !breadcrumb.isLiveCustomerContractDetail &&
                  !breadcrumb.isTiktokLiveCustomerContractDetail &&
                  !breadcrumb.isLocalLifeCustomerContractDetail &&
                  !breadcrumb.isSupplyChainCustomerContractDetail &&
                  !breadcrumb.isCoopCustomerContractDetail
                "
                @click="打开补充协议对话框()"
                >新增补充协议</a
              >
            </div>
          </template>
        </template>
        <tg-tabs
          :tabs="tabs"
          v-model="checkedTab"
          @change="onTabChange"
          v-if="是否框架合同"
          bottom
        />
        <div
          class="operation-btns"
          v-if="
            是否框架合同 &&
            能否显示补充协议和结算单新增按钮 &&
            !breadcrumb.isLegalCustomerContractDetail &&
            !breadcrumb.isLegalStatisticsCustomerContractDetail &&
            !breadcrumb.isCommonBusinessCustomerContractDetail &&
            !breadcrumb.isLiveCustomerContractDetail &&
            !breadcrumb.isTiktokLiveCustomerContractDetail &&
            !breadcrumb.isLocalLifeCustomerContractDetail &&
            !breadcrumb.isSupplyChainCustomerContractDetail &&
            !breadcrumb.isCoopCustomerContractDetail
          "
        >
          <a @click="打开补充协议对话框()">新增补充协议</a>
          <span>|</span>
          <a @click="切换新增结算单对话框是否可见(true)">新增结算单</a>
        </div>
        <keep-alive>
          <component
            class="mgt-10"
            :is="componentName"
            ref="补充协议结算单列表引用"
            style="padding: 0 18px 18px 18px"
          />
        </keep-alive>
      </tg-block>
      <div v-if="!detail" class="no-detail">
        <img src="@/assets/img/pls_import_product.png" />
        <p>没有查询到合同详情</p>
      </div>
    </div>
    <add-contract ref="editContractDialog" type="edit" @edited="获取合同详情()" />
    <review-dialog ref="reviewDialog" @approved="获取合同详情()" />
    <AddAnnex ref="新增补充协议对话框" @added="补充协议添加完成()" />
    <AddStatement
      :visible="新增结算单对话框是否可见"
      @dialog:close="success => 新增结算单关闭回调(success)"
    />
    <tg-mask-loading :visible="approvalLoading" content="正在保存，请稍候..." />
  </div>
</template>

<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
@import '@/styles/utils/index.less';
.contract-type-label-circle {
  .hlh(20px, 20px);
  .brdr(10px);
  .pd(0);
  .mgr(4px);

  font-weight: 400;
  .fs(var(--default-font-size));
  // * 框架
  &.framework,
  &.supplierframework {
    @fgColor: #2eb5ff;
    @bgColor: fade(@fgColor, 8);
    .fgc(@fgColor);
    .brd(fade(@fgColor, 85));
    .bgc(@bgColor);
  }
  // * 销售
  &.sales {
    @fgColor: #2877ff;
    @bgColor: fade(@fgColor, 8);
    .fgc(fade(@fgColor, 90));
    .brd(fade(@fgColor, 80));
    .bgc(@bgColor);
  }
  // * 采买
  &.purchase {
    @fgColor: #3f6dff;
    @bgColor: fade(#7999ff, 10);
    .fgc(fade(@fgColor, 90));
    .brd(fade(@fgColor, 80));
    .bgc(@bgColor);
  }
}
</style>
