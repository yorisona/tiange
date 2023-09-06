<!--
 * @Brief: v任务- 第二步 - 生成结算单之前
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-06-03 09:40:49
-->
<template>
  <SettlementStep2Layout class="tg-cost-mcn-vtask-step2-before-container" topHeightType="default">
    <template #top>
      <top-card :amount="`${total_settlement_amount.toString()}`" type="default"></top-card>
    </template>

    <template #left>
      <CardLayout :padding="[0]">
        <template #title>
          <span>成本信息</span>
        </template>
        <!-- <template #desc>
          <span>机构成本 =所有达人（（收入-支出-退款）＊（1-机构扣点% + 税点%））</span>
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
                      <!-- <span class="label">机构</span> -->
                      <span class="value">{{ company.company_name }}</span>
                      <span class="company-cost">{{
                        `机构成本 ${formatAmount(company.zccb)} 元`
                      }}</span>
                    </div>
                    <div class="cost-list-company-operator">
                      <tg-button type="link" @click="downKolDataFile(company)">下载</tg-button>
                      <span v-if="company.excel_data"
                        ><span class="kol-data">{{
                          `达人数据(共${company.excel_data ? company.excel_data.length : 0}人)`
                        }}</span>
                      </span>
                    </div>
                  </div>
                  <div
                    class="cost-list-company-kol"
                    v-for="(kol, kol_index) in company.excel_data"
                    :key="kol_index"
                  >
                    <div class="origin-amount-info">
                      <div class="origin-amount-info-detail">
                        <span class="label">{{ `达人${kol_index + 1}` }}</span>
                        <!-- <span class="value"> -->
                        <el-popover
                          placement="top-start"
                          trigger="hover"
                          :content="kol.kol_name"
                          :open-delay="300"
                          :disabled="kol.kol_name.length < 10"
                        >
                          <span class="line-clamp-1" style="width: 90px" slot="reference">{{
                            kol.kol_name
                          }}</span>
                        </el-popover>
                        <span
                          @click="dialogCompany.show(company, companyIndex, kol, kol_index)"
                          style="
                            color: var(--theme-color);
                            margin-left: 12px;
                            cursor: pointer;
                            font-size: 12px;
                            line-height: 19px;
                          "
                          >更换结算公司</span
                        >
                        <!-- </span> -->
                      </div>
                      <div class="origin-amount-info-detail">
                        <span class="label">原始收入</span>
                        <span class="value">{{ `${formatAmount(kol.income_amount)} 元` }}</span>
                      </div>
                      <div class="origin-amount-info-detail">
                        <span class="label">原始支出</span>
                        <span class="value">{{ `${formatAmount(kol.spend_amount)} 元` }}</span>
                      </div>
                      <div class="origin-amount-info-detail">
                        <tg-icon
                          style="width: 16px; height: 16px; font-size: 16px; margin-top: 1px"
                          className="icon-delete"
                          name="ico-a-quseguanbiicon2x"
                          @click="deleteClick(company, kol, kol_index, companyIndex)"
                        />
                      </div>
                    </div>
                    <div class="commission">
                      <div class="commission-item">
                        <span class="label">退款金额</span>
                        <el-input
                          placeholder="0.00"
                          v-model="kol.tkje"
                          @input="refundAmountInput($event, company, kol)"
                        >
                          <template slot="append">元</template>
                        </el-input>
                      </div>
                      <div class="commission-item">
                        <span class="label">机构扣点</span>
                        <el-input
                          placeholder="0.00"
                          v-model="kol.jgkd"
                          @input="bucklePointInput($event, company, kol)"
                        >
                          <template slot="append">%</template>
                        </el-input>
                      </div>
                      <div class="commission-item">
                        <span class="label">税点</span>
                        <el-input
                          placeholder="0.00"
                          v-model="kol.sd"
                          @input="taxPointInput($event, company, kol)"
                        >
                          <template slot="append">%</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="expenditure-cost-summary">
                    <span class="label">支出成本</span>
                    <span class="value">{{ `${formatAmount(company.zccb)} 元` }}</span>
                  </div> -->
                </div>
              </div>

              <div v-else class="tg-page-empty">
                <empty-common detail-text="请先上传达人和机构对应关系"></empty-common>
              </div>
            </div>
            <div
              v-if="
                dataForm.companyData.nofind.length ||
                (dataForm.companyData.no_approved || []).length
              "
              class="expenditure-cost-info-operator"
            >
              <div v-if="dataForm.companyData.nofind.length">
                <div>
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
                  <span style="color: #c1c1c1; margin-left: 16px"
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
                </div>
              </div>
              <tg-button type="link" @click="reloadRelationClick">
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
                  <div style="max-height: 150px; overflow: overlay">
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
            <el-dialog
              class="tg-dialog-classic el-dialog-center-rewrite"
              width="300px"
              :visible="dialogCompany.visible"
              :append-to-body="true"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              :wrapperClosable="false"
              @close="dialogCompany.close"
              title="更换公司"
            >
              <el-form size="mini" label-width="86px" :model="dialogCompany.form">
                <div class="dialog_change_company">
                  <el-form-item label="选择公司">
                    <el-select
                      popper-class="el-select-popper-mini"
                      v-model="dialogCompany.form.company"
                      filterable
                      remote
                      :remote-method="dialogCompany.remoteMethod"
                      placeholder="请输入公司名"
                    >
                      <el-option
                        v-for="item in dialogCompany.options"
                        :key="item.id"
                        :label="item.company_name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
              <template slot="footer" style="height: 50px">
                <tg-button @click="dialogCompany.close"> 取消</tg-button>
                <tg-button type="primary" @click="dialogCompany.submit"> 确定 </tg-button>
              </template>
            </el-dialog>
          </div>
        </template>
      </CardLayout>
    </template>
    <template #right>
      <el-form @submit.native.prevent>
        <TgAdjustAccountForm
          :height="470"
          v-if="ShowAdjustInfo"
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
<style lang="less" scoped>
.dialog_change_company {
  padding: 18px 0 0 0;

  /deep/ .el-form-item__label {
    padding-right: 12px;
  }
}
</style>
