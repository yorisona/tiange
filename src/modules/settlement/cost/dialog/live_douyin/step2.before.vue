<template>
  <Step2Layout
    class="settlement-step2-shoplive-before settlement-step2-shoplive-before"
    topHeightType="default"
    :isSelfdouyinLive="true"
    :amount="total_amount_str"
  >
    <template #top>
      <top-card :amount="total_amount" type="default"></top-card>
    </template>
    <template #left>
      <div class="left-content">
        <div>
          <div class="add-settlement-detail-container">
            <tg-button
              icon="ico-btn-add"
              type="primary"
              @click="addSettlementDetail"
              size="mini"
              :disabled="DataForm.settlement_info_list.length >= 6"
              >新增结算明细</tg-button
            >
          </div>
          <div style="margin-top: 2px">
            <CostDetail
              style="margin-bottom: 16px"
              v-for="(income, incomeIdx) in DataForm.settlement_info_list"
              :key="incomeIdx"
              :feeDetail="income"
              :isLiveDouyin="true"
              :isLiveTbPick="DataForm.business_type === 8"
              :disabledTypeList="selectedIncomeTypeList"
              @delSettlementDetail="delSettlementDetail(incomeIdx)"
            >
              <div slot="anchor">
                <CardLayout
                  v-loading="fill_form_loading"
                  class="settlement-left-block"
                  :element-loading-text="loadingKolText"
                  element-loading-background="rgba(0, 0, 0, 0.25)"
                  :padding="[0]"
                  :isLiveDouyin="true"
                >
                  <template #title>主播工资</template>
                  <template #desc>
                    <div
                      style="cursor: pointer; line-height: 14px; height: 14px; margin-left: -6px"
                    >
                      <el-popover
                        :offset="130"
                        popper-class="kol-tips-popper"
                        placement="bottom"
                        trigger="hover"
                      >
                        <div>
                          <div style="color: var(--text-color); font-weight: 600">时薪工资</div>
                          <div style="color: var(--text-second-color)">主播工资 = 单价 * 时长</div>
                          <div style="color: var(--text-color); font-weight: 600">
                            底薪/提成（取高的）
                          </div>
                          <div style="color: var(--text-second-color)">
                            主播工资 = 底薪和（净销额）*提成比例取高的
                          </div>
                          <div style="color: var(--text-color); font-weight: 600">底薪+提成</div>
                          <div style="color: var(--text-second-color)">
                            主播工资 = 底薪 + （净销额）*提成比例
                          </div>
                        </div>
                        <template slot="reference">
                          <tg-icon style="font-size: 14px" name="ico-question"></tg-icon>
                        </template>
                      </el-popover>
                    </div>
                  </template>
                  <template #refresh
                    ><div style="cursor: pointer" @click="reloadRelationship">
                      <i
                        class="el-icon-refresh"
                        style="
                          color: var(--theme-color);
                          height: 22px;
                          line-height: 22px;
                          font-size: 16px;
                          margin-right: 4px;
                        "
                      ></i
                      >刷新数据
                    </div></template
                  >
                  <div class="AnchorListBlock" ref="root">
                    <el-form
                      ref="formRef"
                      :model="DataForm"
                      @submit.native.prevent
                      size="mini"
                      label-width="68px"
                    >
                      <div
                        v-if="
                          !DataForm.json_data.company_info_list ||
                          DataForm.json_data.company_info_list.length === 0
                        "
                      >
                        <div style="margin-top: 52px; margin-bottom: 40px" class="tg-page-empty">
                          <empty-common detail-text="暂无数据，请先完善主播排班信息"></empty-common>
                        </div>
                      </div>
                      <div
                        v-else
                        v-for="(company, companyIndex) in DataForm.json_data.company_info_list"
                        :key="companyIndex"
                        style="margin: 0 12px"
                        :style="
                          companyIndex > 0 ? 'border-top: 1px solid rgba(164,178,194,0.30);' : ''
                        "
                      >
                        <div class="company-list" style="height: 48px">
                          <div class="company-list-summary">
                            <div><span></span>{{ company.company_name }}</div>
                            <div>
                              {{
                                `总结算金额 ${formatAmountWithoutPrefix(
                                  ComputedCompanyData[companyIndex].jszje,
                                )} 元`
                              }}
                            </div>
                          </div>
                          <el-input
                            style="margin-top: 2px"
                            v-if="company.fwfsqfs === 1"
                            placeholder="0.00"
                            v-model="company.fwfbfb"
                            @input="value => fwRateInput(value, companyIndex)"
                          >
                            <template slot="prepend">
                              <el-select
                                size="mini"
                                popper-class="el-select-popper-mini"
                                v-model="company.fwfsqfs"
                              >
                                <el-option label="请选择" :value="0"></el-option>
                                <el-option label="抽成服务费" :value="1"></el-option>
                                <el-option label="固定服务费" :value="2"></el-option>
                              </el-select>
                            </template>
                            <template slot="append">%</template>
                          </el-input>
                          <el-input
                            v-else
                            style="margin-top: 8px"
                            placeholder="0.00"
                            v-model="company.fwf"
                            @input="value => fwfInput(value, companyIndex)"
                          >
                            <template slot="prepend">
                              <el-select
                                popper-class="el-select-popper-mini"
                                v-model="company.fwfsqfs"
                              >
                                <el-option label="请选择" :value="0"></el-option>
                                <el-option label="抽成服务费" :value="1"></el-option>
                                <el-option label="固定服务费" :value="2"></el-option>
                              </el-select>
                            </template>
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                        <div
                          v-for="(item, index) in company.kol_salary_infos"
                          :key="index"
                          ref="target"
                          style="height: 175px"
                          :data-index="index"
                        >
                          <template>
                            <div class="OneItem" :style="index > 0 ? 'margin-top: 8px' : ''">
                              <div style="height: 28px; line-height: 28px; margin-top: 12px">
                                <div style="display: inline-block">
                                  <div class="label" style="width: 64px">
                                    {{ `主播${index + 1}` }}
                                  </div>
                                  <span style="font-weight: 600; color: var(--text-color)"
                                    >{{ item.kol_name }}
                                  </span>
                                  <template v-if="hasDianBo && item.real_name"
                                    ><span style="color: var(--text-color)"
                                      >({{ item.real_name }})</span
                                    ></template
                                  >
                                  <span
                                    @click="dialogCompany.show(company, companyIndex, item, index)"
                                    style="
                                      color: var(--theme-color);
                                      margin-left: 12px;
                                      cursor: pointer;
                                      font-size: 12px;
                                    "
                                    >更换结算公司</span
                                  >
                                </div>
                                <div v-if="false" style="display: inline-block; float: right">
                                  <tg-button
                                    type="link"
                                    @click="downloadKolScheduleFile(company.company_id)"
                                    >下载<span style="color: var(--text-third-color)"
                                      >排班信息</span
                                    ></tg-button
                                  >
                                </div>
                              </div>
                              <div style="margin-top: 8px; height: 28px; line-height: 28px">
                                <div class="label" style="width: 64px">结算方式</div>
                                <el-select
                                  size="mini"
                                  popper-class="el-select-popper-mini"
                                  v-model="item.salary_type"
                                  class="select"
                                  placeholder=""
                                  style="width: 164px"
                                >
                                  <el-option
                                    v-for="(option, idx) in SettlementTypeOptions"
                                    :key="idx"
                                    :label="option.label"
                                    :value="option.value"
                                  />
                                </el-select>
                              </div>
                              <div
                                v-if="item.salary_type === 1"
                                style="
                                  margin-top: 12px;
                                  height: 28px;
                                  line-height: 28px;
                                  display: flex;
                                "
                              >
                                <div class="shoplive-form-item">
                                  <div class="label" style="width: 64px">
                                    <span style="color: #ec1e1e">*</span>开播时长
                                  </div>

                                  <el-form-item
                                    :rules="formRules.live_duration"
                                    :prop="`json_data.company_info_list[${companyIndex}].kol_salary_infos[${index}].live_duration`"
                                  >
                                    <el-input
                                      @input="
                                        value => LiveDurationInput(value, companyIndex, index)
                                      "
                                      v-model="item.live_duration"
                                      style="width: 164px"
                                      placeholder="0.0"
                                      maxlength="6"
                                    >
                                      <template #append>小时</template>
                                    </el-input>
                                  </el-form-item>
                                </div>
                                <div class="shoplive-form-item">
                                  <div class="label" style="width: 64px">
                                    <span style="color: #ec1e1e">*</span>单价
                                  </div>
                                  <el-form-item
                                    :rules="formRules.unit_price"
                                    :prop="`json_data.company_info_list[${companyIndex}].kol_salary_infos[${index}].unit_price`"
                                  >
                                    <el-input
                                      @input="value => UnitPriceInput(value, companyIndex, index)"
                                      v-model="item.unit_price"
                                      style="width: 164px"
                                      placeholder="0.00"
                                      maxlength="13"
                                    >
                                      <template #append>时/元</template>
                                    </el-input>
                                  </el-form-item>
                                </div>
                              </div>
                              <div
                                v-if="item.salary_type !== 1"
                                style="
                                  margin-top: 12px;
                                  height: 28px;
                                  line-height: 28px;
                                  display: flex;
                                "
                              >
                                <div class="shoplive-form-item">
                                  <div class="label" style="width: 64px">
                                    <span style="color: #ec1e1e">*</span>底薪
                                  </div>
                                  <el-form-item
                                    :rules="formRules.base_salary"
                                    :prop="`json_data.company_info_list[${companyIndex}].kol_salary_infos[${index}].base_salary`"
                                  >
                                    <el-input
                                      @input="value => BaseSalaryInput(value, companyIndex, index)"
                                      v-model="item.base_salary"
                                      style="width: 154px"
                                      placeholder="0.00"
                                      maxlength="13"
                                    >
                                      <template #append>元</template>
                                    </el-input>
                                  </el-form-item>
                                </div>
                                <div class="shoplive-form-item">
                                  <div class="label" style="width: 58px">
                                    <span style="color: #ec1e1e">*</span>净销额
                                  </div>

                                  <el-form-item
                                    :rules="formRules.sale_amount"
                                    :prop="`json_data.company_info_list[${companyIndex}].kol_salary_infos[${index}].sale_amount`"
                                  >
                                    <el-input
                                      @input="value => SaleAmountInput(value, companyIndex, index)"
                                      v-model="item.sale_amount"
                                      style="width: 154px"
                                      placeholder="0.00"
                                      maxlength="13"
                                    >
                                      <template #append>元</template>
                                    </el-input>
                                  </el-form-item>
                                </div>
                                <div class="shoplive-form-item">
                                  <div class="label" style="width: 72px">
                                    <span style="color: #ec1e1e">*</span>提成比例
                                  </div>

                                  <el-form-item
                                    :rules="formRules.commission_rate"
                                    :prop="`json_data.company_info_list[${companyIndex}].kol_salary_infos[${index}].commission_rate`"
                                  >
                                    <el-input
                                      @input="
                                        value => CommissionRateInput(value, companyIndex, index)
                                      "
                                      v-model="item.commission_rate"
                                      style="width: 100px"
                                      placeholder="0.00"
                                      maxlength="13"
                                    >
                                      <template #append>%</template>
                                    </el-input>
                                  </el-form-item>
                                </div>
                              </div>
                              <div
                                style="
                                  display: inline-block;
                                  margin-top: 12px;
                                  height: 28px;
                                  line-height: 28px;
                                "
                              >
                                <div class="label" style="width: 64px">合计</div>
                                <span style="font-weight: 600; color: var(--text-color)">{{
                                  ComputedCompanyData[companyIndex].calc_kol_salary_infos[index]
                                    .salary_str
                                }}</span>
                              </div>
                            </div>
                            <div
                              v-if="
                                index + 1 < company.kol_salary_infos.length &&
                                company.kol_salary_infos.length !== 0
                              "
                              style="
                                border-top: 1px dashed rgba(164, 178, 194, 0.3);
                                margin: 0 18px 18px 0;
                              "
                            ></div>
                          </template>
                          <!-- <template>
                            <div class="one-item-skeleton-screen">
                              <div
                                class="skeleton-screen-item"
                                :class="item.class"
                                v-for="(item, itemIndex) in skeletonItems"
                                :key="itemIndex"
                              >
                                <div class="skeleton-screen-item-label"></div>
                                <div class="skeleton-screen-item-content"></div>
                              </div>
                            </div>
                          </template> -->
                        </div>
                      </div>
                    </el-form>
                    <div
                      class="kol-company-no-relation-list"
                      :style="
                        DataForm.json_data.nofind &&
                        DataForm.json_data.nofind.length &&
                        DataForm.json_data.no_approved &&
                        DataForm.json_data.no_approved.length
                          ? 'height: 60px'
                          : (DataForm.json_data.nofind && DataForm.json_data.nofind.length) ||
                            (DataForm.json_data.no_approved &&
                              DataForm.json_data.no_approved.length)
                          ? 'height: 30px'
                          : ''
                      "
                      v-if="
                        (DataForm.json_data.nofind && DataForm.json_data.nofind.length) ||
                        (DataForm.json_data.no_approved && DataForm.json_data.no_approved.length)
                      "
                    >
                      <!-- <div
                      v-if="DataForm.json_data.nofind && DataForm.json_data.nofind.length"
                      class="kol-company-no-relation-list"
                    > -->
                      <div>
                        <div v-if="DataForm.json_data.nofind && DataForm.json_data.nofind.length">
                          <span>{{
                            `还有${DataForm.json_data.nofind.length}名主播没有对应机构`
                          }}</span>
                          <el-popover
                            ref="popover"
                            popper-class="kol-company-map"
                            placement="top"
                            trigger="click"
                            @show="startShow"
                            @hide="endShow"
                          >
                            <div style="max-height: 150px; overflow: overlay">
                              <div
                                v-for="(kol, kolIndex) in DataForm.json_data.nofind"
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
                            <tg-button
                              class="mgr-12"
                              style="font-size: 14px; margin-left: 8px"
                              slot="reference"
                              type="link"
                              >查看明细
                            </tg-button>
                          </el-popover>
                          <span style="color: #c1c1c1">请到主播管理中维护主播和主播的结算公司</span>
                        </div>
                        <div
                          v-if="
                            DataForm.json_data.no_approved && DataForm.json_data.no_approved.length
                          "
                          :style="
                            DataForm.json_data.nofind && DataForm.json_data.nofind.length
                              ? 'margin-top: 4px'
                              : ''
                          "
                        >
                          <span>{{
                            `${DataForm.json_data.no_approved.length}位主播信息未通过审核无法结算`
                          }}</span>
                          <el-popover
                            ref="popover"
                            popper-class="kol-company-map"
                            placement="top"
                            trigger="click"
                            @show="startShow"
                            @hide="endShow"
                          >
                            <div style="max-height: 150px; overflow: overlay">
                              <div
                                v-for="(kol, kolIndex) in DataForm.json_data.no_approved"
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
                            <tg-button
                              class="mgr-12"
                              style="font-size: 14px; margin-left: 8px"
                              slot="reference"
                              type="link"
                              >查看明细
                            </tg-button>
                          </el-popover>
                        </div>
                      </div>
                      <!--<tg-button type="link" @click="reloadRelationship">
                        <tg-icon name="ico-loading"></tg-icon>
                        刷新数据
                      </tg-button>-->
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
                </CardLayout>
              </div>
            </CostDetail>
          </div>
        </div>
      </div>
    </template>

    <template #right>
      <div>
        <el-form @submit.native.prevent label-width="68px">
          <TgAdjustAccountForm
            :height="470"
            v-if="ShowAdjustInfo"
            :adjust_info="DataForm.adjust_info"
            ExtendItem="LiveDouyinSelf"
            :ExtendItemSelectOptions="selectedAllCompanyList"
            :ExtendItemDpAllTypeOptionsObj="{
              kol: kolSelectOptions,
              put: selectedCompanyList,
              other: selectedOtherCompanyList,
              advert: selectedAdvertCompanyList,
            }"
            @dataChange="onAdjustAccountDataChange"
          />
        </el-form>
      </div>
    </template>
    <template #button>
      <tg-button @click="prev">上一步</tg-button>
      <tg-button type="primary" @click="next">下一步</tg-button>
    </template>
    <template #mask>
      <tg-mask-loading
        :visible="saveLoading || relocationshipLoading"
        :content="saveLoading ? '正在保存，请稍候...' : '正在刷新，请稍候...'"
      />
    </template>
  </Step2Layout>
</template>

<script src="./step2.before.ts"></script>
<style lang="less" scoped>
.dialog_change_company {
  padding: 18px 0 0 0;

  /deep/ .el-form-item__label {
    padding-right: 12px;
  }
}
</style>

<style lang="less">
@import '~@/styles/utils/index.less';
.settlement-step2-shoplive-before {
  .adjust-account-content {
    .el-select,
    .el-input {
      width: 198px;
    }
  }
  .add-settlement-detail-container {
    padding: 16px 16px;
  }
  .left-content {
    overflow-y: overlay;
    flex-grow: 1;
    border-radius: 2px;
    border: 1px solid rgba(var(--tip-icon-rgb-color), 0.3);
  }
  .AnchorListBlock {
    margin-top: 0px;
    /*    height: 372px;*/
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-content: space-between;
    overflow-y: hidden;

    > .el-form {
      // height: 335px;
      flex-grow: 1;
      // padding: 0 18px;
      overflow-y: auto;
      overflow-y: overlay;
      .el-form-item--mini {
        margin-right: 0 !important;
      }
      .el-input-group__append .el-button,
      .el-input-group__append .el-select,
      .el-input-group__prepend .el-button,
      .el-input-group__prepend .el-select {
        margin: -10px;
      }
    }
  }

  .settlement-left-block {
    overflow-y: auto;
  }

  .shoplive-form-item {
    display: flex;

    .el-form-item__content {
      margin-left: 0 !important;
    }
  }

  .el-input > .el-input__inner {
    border-color: var(--border-line-color);
  }

  .el-input-group__append {
    text-align: center;
    padding: 0 10px;
    background-color: #f6f6f6;
    color: var(--text-third-color);
  }

  .OneItem {
    padding: 0 0 18px 0;

    .label {
      color: var(--text-second-color);
      font-size: 12px;
      width: fit-content;
      margin-right: 8px;
      text-align: right;
      display: inline-block;
    }
  }

  // 骨架屏
  .one-item-skeleton-screen {
    display: grid;
    grid-template-areas: 'a1 . .' 'b1 . .' 'c1 c2 c3' 'd1 . .';
    row-gap: 12px;
    column-gap: 4px;
    .pd(18px 0);
    border-top: 1px dashed rgba(164, 178, 194, 0.3);

    > .skeleton-screen-item {
      height: 28px;
      display: flex;
      @color1: rgba(var(--text-second-color), 0.2);
      @color2: rgba(var(--text-second-color), 0.1);

      > .skeleton-screen-item-label {
        height: 18px;
        .mgr(12px);
        background-image: linear-gradient(to right, @color1 0%, @color2 50%, @color1 100%);
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-name: skeleton-screen-loading;
        animation-timing-function: linear;
        transition: 0.3s;
      }

      > .skeleton-screen-item-content {
        height: 18px;
        background-image: linear-gradient(to right, @color1 0%, @color2 50%, @color1 100%);
        animation-duration: 30s;
        animation-iteration-count: infinite;
        animation-name: skeleton-screen-loading;
        animation-timing-function: linear;
        transition: 0.3s;
      }

      &.a1 {
        grid-area: a1;
        .pdl(24px);

        > .skeleton-screen-item-label {
          width: 40px;
        }

        > .skeleton-screen-item-content {
          width: 40px;
        }
      }

      &.b1 {
        grid-area: b1;

        > .skeleton-screen-item-label {
          width: 64px;
        }

        > .skeleton-screen-item-content {
          width: 164px;
        }
      }

      &.c1 {
        grid-area: c1;
        .pdl(24px);

        > .skeleton-screen-item-label {
          width: 40px;
        }

        > .skeleton-screen-item-content {
          width: 164px;
        }
      }

      &.c2 {
        grid-area: c2;
        .pdl(19px);

        > .skeleton-screen-item-label {
          width: 45px;
        }

        > .skeleton-screen-item-content {
          width: 150px;
        }
      }

      &.c3 {
        grid-area: c3;

        > .skeleton-screen-item-label {
          width: 64px;
        }

        > .skeleton-screen-item-content {
          width: 60px;
        }
      }

      &.d1 {
        grid-area: d1;
        .pdl(24px);

        > .skeleton-screen-item-label {
          width: 40px;
        }

        > .skeleton-screen-item-content {
          width: 60px;
        }
      }
    }
  }

  .kol-company-no-relation-list {
    height: 60px;
    flex-shrink: 0;
    padding: 0 24px;
    border-top: 1px solid rgba(var(--tip-icon-rgb-color), 0.3);
    display: flex;
    align-items: center;
    display: flex;
    justify-content: space-between;
    font-size: 12px;

    div span {
      &:first-of-type {
        color: #ec1e1e;
      }

      &:last-of-type {
        color: var(--text-second-color);
      }
    }
  }

  .company-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed rgba(var(--tip-icon-rgb-color), 0.3);

    .company-list-summary {
      margin-top: 2px;
      display: flex;
      > div {
        &:first-of-type {
          font-weight: 600;
          margin-right: 18px;
          color: var(--text-color);
          padding-left: 8px;
          position: relative;
          & > span {
            position: absolute;
            display: inline-block;
            width: 3px;
            height: 12px;
            background: var(--theme-color);
            left: 0px;
            top: 3px;
            border-radius: 1px;
          }
        }

        &:last-of-type {
          font-weight: 600;
          color: var(--warning-color);
        }
      }
    }
    .el-input__inner {
      height: 28px;
      line-height: 26px;
    }
    > .el-input-group {
      width: 236px;

      > input {
        height: 28px;
        line-height: 28px;
      }

      > .el-input-group__prepend {
        width: 116px;
        background: transparent;
        color: var(--text-color);
      }

      > .el-input-group__append {
        width: 28px;
        padding: 0;
      }
    }
  }
}

.el-popover.kol-tips-popper {
  line-height: 24px;
  font-size: 12px;
  padding: 10px 18px 8px 18px;
  border-bottom: 1px dashed rgba(var(--tip-icon-rgb-color), 0.3);
}

@keyframes skeleton-screen-loading {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}
</style>
