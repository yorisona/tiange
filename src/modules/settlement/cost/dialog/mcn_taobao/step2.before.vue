<!--
 * @Brief: 淘宝cps - 第二步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 13:51:03
-->
<template>
  <SettlementStep2Layout topHeightType="default" class="tg-cost-mcn-taobao-step2-before-container">
    <template #top>
      <top-card :amount="`${total_settlement_amount.toString()}`" type="default"></top-card>
    </template>

    <template #left>
      <CardLayout :padding="[0]">
        <template #title>
          <span>成本信息</span>
        </template>
        <!-- <template #desc>
          <span>支出成本 = 主播总收入 * 提成比例</span>
        </template> -->
        <template>
          <div class="expenditure-cost-info">
            <div class="expenditure-cost-info-list">
              <div v-if="dataForm.companyData.company_info_list.length">
                <div
                  v-for="(company, companyIndex) in dataForm.companyData.company_info_list
                    ? dataForm.companyData.company_info_list
                    : []"
                  :key="companyIndex"
                  class="expenditure-cost-info-list-row"
                >
                  <div class="cost-list-company">
                    <div>
                      <span class="label">机构：</span>
                      <span class="value">{{ company.company_name }}</span>
                    </div>
                    <div class="cost-list-company-operator">
                      <tg-button type="link" @click="downKolDataFile(company)">下载</tg-button>
                      <span class="kol-data">{{
                        `主播数据(共${company.excel_data ? company.excel_data.length : 0}人)`
                      }}</span>
                    </div>
                  </div>
                  <div class="commission">
                    <span class="label">提成比例：</span>
                    <el-input
                      placeholder="0.00"
                      v-model="company.tcbl"
                      @input="commissionInput($event, companyIndex)"
                    >
                      <template slot="append">%</template>
                    </el-input>
                    <span class="label">原始收入</span>
                    <span class="origin-income">{{ `${formatAmount(company.yssr)} 元` }}</span>
                  </div>
                  <div class="expenditure-cost-summary">
                    <span class="label">支出成本：</span>
                    <span class="value">{{ `${formatAmount(company.zccb)} 元` }}</span>
                  </div>
                </div>
              </div>

              <div v-else class="tg-page-empty">
                <empty-common detail-text="请先上传主播和机构对应关系"></empty-common>
              </div>
            </div>
            <div
              v-if="
                dataForm.companyData.nofind.length ||
                (dataForm.companyData.no_approved || []).length
              "
              class="expenditure-cost-info-operator"
            >
              <div style="font-size: 12px">
                <div v-if="dataForm.companyData.nofind.length">
                  <span style="color: #ec1e1e">
                    <span>还有</span>
                    <span>{{ `${dataForm.companyData.nofind.length}` }}</span>
                    <span>名达人没有所属公司</span>
                  </span>
                  <el-popover popper-class="kol-company-map" placement="top" trigger="click">
                    <div style="max-height: 150px; overflow: overlay">
                      <div
                        v-for="(kol, kolIndex) in dataForm.companyData.nofind"
                        :key="kolIndex"
                        :style="
                          kolIndex === 0
                            ? 'color: var(--text-color);'
                            : 'margin-top: 4px; color: var(--text-color);'
                        "
                      >
                        {{ kol }}
                      </div>
                    </div>
                    <tg-button slot="reference" type="link" style="margin-left: 8px"
                      >查看明细</tg-button
                    >
                  </el-popover>
                  <span style="color: #c1c1c1; margin-left: 16"
                    >请到达人管理中维护达人和达人所属公司</span
                  >
                </div>
                <div
                  v-if="(dataForm.companyData.no_approved || []).length"
                  :style="dataForm.companyData.nofind.length ? 'margin-top: 4px' : ''"
                >
                  <span style="color: #ec1e1e">
                    <span>还有</span>
                    <span>{{ `${dataForm.companyData.no_approved.length}` }}</span>
                    <span>名达人信息未通过审核无法结算</span>
                  </span>
                  <el-popover popper-class="kol-company-map" placement="top" trigger="click">
                    <div style="max-height: 150px; overflow: overlay">
                      <div
                        v-for="(kol, kolIndex) in dataForm.companyData.no_approved"
                        :key="kolIndex"
                        :style="
                          kolIndex === 0
                            ? 'color: var(--text-color);'
                            : 'margin-top: 4px; color: var(--text-color);'
                        "
                      >
                        {{ kol }}
                      </div>
                    </div>
                    <tg-button slot="reference" type="link" style="margin-left: 8px"
                      >查看明细</tg-button
                    >
                  </el-popover>
                  <!-- <span style="color: #6a7b92" class="mgl-12"
                    >请到达人管理中维护达人和达人所属公司</span
                  > -->
                </div>
              </div>
              <tg-button
                type="link"
                @click="reloadRelationClick"
                style="font-size: 14px !important"
              >
                <tg-icon name="ico-loading"></tg-icon>
                <span style="margin-left: 4px">刷新数据</span>
              </tg-button>
              <!-- <span>机构达人对应关系:</span>
              <el-upload
                action="/"
                :multiple="false"
                :show-file-list="false"
                :http-request="uploadFileHandler"
              >
                <tg-button type="link">上传</tg-button>
              </el-upload>
              <tg-button type="link" @click="downloadKolCompanyMapFile">下载</tg-button>
              <span v-if="dataForm.companyData.nofind.length">
                <span>{{ `(还有${dataForm.companyData.nofind.length}名达人没有对应机构。` }}</span>
                <el-popover popper-class="kol-company-map" placement="top" trigger="click">
                  <div style="max-height: 150px; overflow: overlay; padding: 12px">
                    <div
                      v-for="(kol, kolIndex) in dataForm.companyData.nofind"
                      :key="kolIndex"
                      :style="
                        kolIndex === 0 ? 'color: var(--text-color);' : 'margin-top: 4px; color: var(--text-color);'
                      "
                    >
                      {{ kol }}
                    </div>
                  </div>
                  <tg-button style="font-size: 12px" slot="reference" type="link"
                    >查看明细</tg-button
                  >
                </el-popover>
                <span>)</span>
              </span> -->
            </div>
          </div>
        </template>
      </CardLayout>
    </template>
    <template #right>
      <el-form @submit.native.prevent size="small">
        <TgAdjustAccountForm
          v-if="ShowAdjustInfo"
          :height="470"
          ExtendItem="company"
          :adjust_info="dataForm.adjustInfo"
          :ExtendItemSelectOptions="companyOptions"
          @dataChange="onAdjustAccountDataChange"
        />
      </el-form>
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading :visible="loading" :content="loadingText" />
    </template>
  </SettlementStep2Layout>
</template>

<script src="./step2.before.ts"></script>
<style lang="less">
@import './step2.before.less';
</style>
