<template>
  <div v-if="visible">
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new contract-form-modal"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1142px"
      top="70px"
      @close="backClick"
    >
      <template #title>
        <span>{{ type === 'add' ? '主播签约' : '编辑主播签约' }}</span>
      </template>
      <div
        class="dialog-content"
        style="
          padding: 5px 0px 5px 24px;
          overflow-y: auto;
          overflow-x: hidden;
          height: 80vh;
          min-height: 400px;
        "
      >
        <el-form
          size="mini"
          style="margin-left: 5px"
          :model="form"
          :rules="formRules"
          ref="formRef"
        >
          <el-form-item
            label="签约类型："
            style="display: inline-block; width: 1078px; margin-top: 10px"
            prop="cooperation_contract_type"
          >
            <el-radio-group
              :value="form.cooperation_contract_type"
              @input="tabsChange"
              :disabled="type !== 'add'"
            >
              <el-radio
                v-for="item in qianyueRecord"
                :key="item.value"
                :label="item.value"
                style="margin-right: 30px"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="
              form.cooperation_contract_type === 2 ||
              form.cooperation_contract_type === 3 ||
              form.cooperation_contract_type === 4
            "
            class="sub-item anchor one-item-sub pay-type-select"
            label="关联主合同："
            label-width="80px"
            style="height: 56px; line-height: 56px"
            prop="cooperation_link_contract_id"
            :class="{
              twoanchor: form.cooperation_contract_type === 2,
              threeanchor: form.cooperation_contract_type === 3,
              fouranchor: form.cooperation_contract_type === 4,
            }"
          >
            <div class="triangle-css3 transform"></div>
            <el-select
              popper-class="el-select-popper-mini"
              v-model="form.cooperation_link_contract_id"
              filterable
              reserve-keyword
              clearable
              placeholder="请选择"
              size="mini"
              style="width: 292px; margin-top: -1px"
              @change="val => selectContractUidChange(val)"
            >
              <el-option
                v-for="item in contract_id_list"
                :key="item.contract_id"
                :label="item.contract_uid"
                :value="item.contract_uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <head-lines style="margin: 12px 0 8px -10px" :titleFont="12" title="主播信息" />
          <el-form-item class="sub-item anchor" label="主播花名">
            <el-input v-model.trim="form.anchor_name" placeholder="请输入主播花名" disabled>
            </el-input>
          </el-form-item>
          <el-form-item class="sub-item anchor" label="主播姓名">
            <el-input v-model.trim="form.anchor_real_name" placeholder="请输入主播姓名" disabled>
            </el-input>
          </el-form-item>
          <el-form-item class="sub-item anchor" label="身份证号">
            <el-input v-model.trim="anchor_ident" placeholder="请输入身份证号" disabled> </el-input>
          </el-form-item>
          <el-form-item class="sub-item anchor" label="电话">
            <el-input v-model.trim="anchor_tel" placeholder="" disabled> </el-input>
          </el-form-item>
          <el-form-item class="sub-item anchor" label="微信号">
            <el-input v-model.trim="anchor_weixin" placeholder="" disabled> </el-input>
          </el-form-item>
          <el-form-item class="sub-item anchor" label="电子邮箱" prop="anchor_email">
            <el-input type="email" placeholder="请输入" v-model="form.anchor_email" />
          </el-form-item>
          <el-form-item class="sub-item anchor" label="联系地址" prop="anchor_address">
            <el-input type="text" placeholder="请输入" v-model="form.anchor_address" />
          </el-form-item>
          <template>
            <head-lines style="margin: 12px 0 8px -10px" :titleFont="12" title="关联机构信息" />
            <el-form-item class="sub-item anchor" label="机构名称">
              <el-input v-model.trim="form.organization_name" placeholder="" disabled> </el-input>
            </el-form-item>
            <el-form-item class="sub-item anchor" label="联系电话">
              <el-input v-model.trim="form.organization_tel" placeholder="" disabled> </el-input>
            </el-form-item>
            <el-form-item class="sub-item anchor" label="联系地址">
              <el-input type="text" placeholder="请输入" v-model="form.organization_address" />
            </el-form-item>
          </template>
          <template>
            <head-lines style="margin: 12px 0 8px -10px" :titleFont="12" title="项目信息" />
            <el-form-item class="sub-item anchor" label="关联项目" prop="project_relevancy_id">
              <el-select
                popper-class="el-select-popper-mini"
                v-model="form.project_relevancy_id"
                filterable
                reserve-keyword
                clearable
                placeholder="请选择"
                style="width: 254px; font-size: 12px"
                @change="val => selectProjrctIDChange(val)"
              >
                <el-option
                  v-for="item in project_ids"
                  :key="item.id"
                  :label="item.project_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="sub-item anchor" label="用人部门" prop="approval_department_id">
              <!-- <TreeSelect
                clearable
                v-model="form.approval_department_id"
                :data="reqFeishuDep.data"
                :props="{
                  label: 'name',
                  children: 'sons',
                }"
              ></TreeSelect> -->
              <department-select
                clearable
                :levelDisabled="levelDisabled"
                :defaultExpandedKeys="departmentDefaultExpandedKeys"
                v-model="form.approval_department_id"
              ></department-select>
            </el-form-item>
            <!-- <el-form-item
              class="sub-item anchor"
              label="运营审批人"
              prop="project_operation_prople"
            >
              <el-select
                size="mini"
                v-model="form.project_operation_prople"
                placeholder="请选择"
                style="width: 254px; font-size: 12px"
                popper-class=" el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option
                  v-for="item in ownInfoRecords"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->
          </template>
          <template>
            <head-lines style="margin: 12px 0 8px -10px" :titleFont="12" title="我方信息" />
            <el-form-item class="sub-item anchor" label="经办人" prop="own_id">
              <!--<el-input v-model.trim="form.own_name" placeholder="请输入经办人" ref="autoFocuseRef">
              </el-input>-->
              <el-select
                popper-class="el-select-popper-mini"
                v-model="form.own_id"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请输入"
                :remote-method="getOwnNameIds"
                style="width: 254px; font-size: 12px"
                @change="val => selecOwnNameidChange(val)"
              >
                <el-option
                  v-for="item in own_name_ids"
                  :key="item.id"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="sub-item anchor" label="电话" prop="own_tel">
              <el-input
                type="tel"
                rows="1"
                @input="getfixIntPositiveNumber($event, 'own_tel')"
                maxlength="11"
                placeholder="请输入电话"
                v-model="form.own_tel"
              />
            </el-form-item>
          </template>
          <template>
            <head-lines style="margin: 12px 0 8px -10px" :titleFont="12" title="合同期限" />
            <el-form-item
              label="合同有效期"
              class="sub-item anchor append"
              prop="cooperation_zhubo_real_year"
            >
              <div>
                <el-input
                  class="contract-valid-date"
                  style="margin-right: 4%"
                  @input="getfixIntPositiveNumber($event, 'cooperation_zhubo_real_year')"
                  maxlength="2"
                  type="tel"
                  v-model="form.cooperation_zhubo_real_year"
                  placeholder="请输入"
                >
                  <!-- <el-select popper-class="el-select-popper-mini"
                    v-model="form.dateUnit"
                    slot="append"
                    style="margin: -10px -14px -10px -12px"
                  >
                    <el-option label="年" value="年"></el-option>
                    <el-option label="月" value="月"></el-option>
                  </el-select> -->
                  <span slot="append">年</span>
                </el-input>
                <el-input
                  class="contract-valid-date"
                  @input="getfixIntPositiveNumber($event, 'cooperation_zhubo_real_month')"
                  maxlength="2"
                  type="tel"
                  v-model="form.cooperation_zhubo_real_month"
                  placeholder="请输入"
                >
                  <!-- <el-select popper-class="el-select-popper-mini"
                    v-model="form.dateUnit"
                    slot="append"
                    style="margin: -10px -14px -10px -12px"
                  >
                    <el-option label="年" value="年"></el-option>
                    <el-option label="月" value="月"></el-option>
                  </el-select> -->
                  <span slot="append">月</span>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item
              class="sub-item anchor neednoright"
              label="合作期限"
              prop="cooperation_zhubo_real_time"
            >
              <el-date-picker
                style="width: 254px; margin-right: 12px"
                v-model="form.cooperation_zhubo_real_time"
                range-separator="~"
                type="daterange"
                :editable="false"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
              <!-- <el-date-picker
                style="width: 120px"
                v-model="form.cooperation_zhubo_real_end_time"
                type="date"
                :editable="false"
                placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                disabled
              /> -->
            </el-form-item>
            <!--  <el-form-item
              class="sub-item anchor"
              label="试合作期"
              prop="cooperation_zhubo_try_type"
            >
              <el-select
                v-model="form.cooperation_zhubo_try_type"
                placeholder="请选择"
                style="width: 254px; font-size: 12px; display: inline-block"
                popper-class="el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option label="有" :value="1" />
                <el-option label="无" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.cooperation_zhubo_try_type === 1"
              class="sub-item anchor neednoright"
              label="试合作期限"
              prop="cooperation_zhubo_try_start_time"
            >
              <el-date-picker
                style="width: 120px; margin-right: 12px"
                v-model="form.cooperation_zhubo_try_start_time"
                type="date"
                :editable="false"
                placeholder="开始日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
              <el-date-picker
                style="width: 120px"
                v-model="form.cooperation_zhubo_try_end_time"
                type="date"
                :editable="false"
                placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>-->
          </template>
          <template>
            <head-lines style="margin: 12px 0 8px -10px" :titleFont="12" title="结算信息" />
            <div>
              <el-form-item class="sub-item anchor" label="计算方式" prop="settlement_way">
                <el-select
                  v-model="form.settlement_way"
                  placeholder="请选择"
                  style="width: 254px; font-size: 12px; display: inline-block"
                  popper-class="el-select-popper-mini frame_contract_popper-custoner"
                >
                  <el-option
                    v-for="item in computeWayRecords"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="小时服务费"
                v-if="
                  form.settlement_way === 1 ||
                  form.settlement_way === 4 ||
                  form.settlement_way === 5 ||
                  form.settlement_way === 8
                "
                class="sub-item anchor append"
                prop="settlement_hour_pay"
              >
                <el-input
                  @input="getfixPositiveNumber($event, 'settlement_hour_pay')"
                  @blur="blurPositiveNumber($event, 'settlement_hour_pay')"
                  v-model="form.settlement_hour_pay"
                  placeholder="请输入"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
              <el-form-item
                label="保底服务费"
                v-if="
                  form.settlement_way === 2 ||
                  form.settlement_way === 9 ||
                  form.settlement_way === 6 ||
                  form.settlement_way === 8
                "
                class="sub-item anchor append"
                prop="settlement_server_low_pay"
              >
                <el-input
                  @input="getfixPositiveNumber($event, 'settlement_server_low_pay')"
                  @blur="blurPositiveNumber($event, 'settlement_server_low_pay')"
                  v-model="form.settlement_server_low_pay"
                  placeholder="请输入"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
              <el-form-item
                label="保底服务费A"
                v-if="form.settlement_way === 7"
                class="sub-item anchor append"
                prop="settlement_server_low_pay_A"
              >
                <el-input
                  @input="getfixPositiveNumber($event, 'settlement_server_low_pay_A')"
                  @blur="blurPositiveNumber($event, 'settlement_server_low_pay_A')"
                  v-model="form.settlement_server_low_pay_A"
                  placeholder="请输入"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
              <el-form-item
                label="保底服务费B"
                v-if="form.settlement_way === 7"
                class="sub-item anchor append"
                prop="settlement_server_low_pay_B"
              >
                <el-input
                  @input="getfixPositiveNumber($event, 'settlement_server_low_pay_B')"
                  @blur="blurPositiveNumber($event, 'settlement_server_low_pay_B')"
                  v-model="form.settlement_server_low_pay_B"
                  placeholder="请输入"
                  ><span slot="append">元</span></el-input
                >
              </el-form-item>
              <el-form-item
                label="提成比例"
                v-if="
                  form.settlement_way === 2 ||
                  form.settlement_way === 4 ||
                  form.settlement_way === 7 ||
                  form.settlement_way === 8
                "
                class="sub-item anchor append"
                prop="settlement_rate"
              >
                <el-input
                  @input="getfixPositiveNumber($event, 'settlement_rate')"
                  @blur="blurPositiveNumber($event, 'settlement_rate')"
                  v-model="form.settlement_rate"
                  placeholder="请输入"
                  ><span slot="append">%</span></el-input
                >
              </el-form-item>
              <template v-if="form.settlement_way === 5 || form.settlement_way === 6">
                <template v-for="(item, index) in form.settlement_month_sales">
                  <el-form-item
                    :key="index + 'jieti'"
                    :label="'阶梯' + (index + 1) + '：月净销额（万）'"
                    class="sub-item anchor"
                    :rules="sales_rules_money(index)"
                    prop="settlement_month_sales"
                  >
                    <div
                      v-if="index < form.settlement_month_sales.length - 1"
                      @click.stop.prevent="noChange()"
                      style="
                        margin-left: 3px;
                        display: inline-block;
                        width: 250px;
                        border: 1px solid rgba(164, 178, 194, 0.5);
                        border-radius: 2px;
                      "
                    >
                      <el-input
                        maxlength="8"
                        class="paperview-input-text money"
                        style="text-align: right; width: 120px"
                        :value="
                          index === 0
                            ? form.settlement_month_first_point
                            : form.settlement_month_sales[index - 1].settlement_month_sales_point
                        "
                        placeholder=""
                        disabled
                      ></el-input
                      >-<el-input
                        maxlength="8"
                        type="number"
                        @input="
                          getfixPositiveSalseNumber($event, 'settlement_month_sales_point', index)
                        "
                        class="paperview-input-text"
                        style="width: 115px"
                        v-model="item.settlement_month_sales_point"
                        placeholder=""
                      ></el-input>
                    </div>
                    <div v-else>
                      <el-input
                        maxlength="8"
                        class="paperview-input-text anchorborder"
                        style="text-align: right; width: 254px"
                        :value="
                          form.settlement_month_sales[index - 1].settlement_month_sales_point
                            ? form.settlement_month_sales[index - 1].settlement_month_sales_point +
                              '万以上'
                            : ''
                        "
                        placeholder=""
                        disabled
                      ></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item
                    :key="index + 'rate'"
                    :label="'提成比例' + (index + 1)"
                    class="sub-item anchor append"
                    :style="{
                      width: index === form.settlement_month_sales.length - 1 ? '282px' : '254px',
                      marginRight:
                        index === form.settlement_month_sales.length - 1 ? '0px !important' : '',
                    }"
                    :rules="sales_rules_rate(index)"
                    prop="settlement_month_sales"
                  >
                    <div>
                      <el-input
                        type="number"
                        @input="
                          getfixPositiveSalseNumber($event, 'settlement_month_sales_rate', index)
                        "
                        v-model="item.settlement_month_sales_rate"
                        placeholder="请输入"
                        style="width: 254px; margin-right: 6px"
                        ><span slot="append">%</span></el-input
                      >
                      <!--<el-button
                      v-if="index === form.settlement_month_sales.length - 1"
                      type="text"
                      style="padding: 0px; border-width: 0px"
                      @click="addSettlementItem"
                      :disabled="form.settlement_month_sales.length === 5"
                      icon="el-icon-circle-plus-outline"
                    ></el-button>-->
                      <div
                        v-if="index === form.settlement_month_sales.length - 1"
                        style="
                          display: inline-flex;
                          width: 20px;
                          height: 28px;
                          flex-direction: column;
                          position: absolute;
                          cursor: pointer;
                        "
                      >
                        <div
                          class="icon-circle-plus"
                          :disabled="form.settlement_month_sales.length === 2"
                          @click="reduceSettlementItem"
                        >
                          -
                        </div>
                        <div
                          class="icon-circle-plus add"
                          :disabled="form.settlement_month_sales.length === 5"
                          @click="addSettlementItem"
                        >
                          +
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </template>
            </div>
            <el-form-item class="sub-item anchor" label="票款类型" prop="settlement_month_fee_type">
              <el-select
                size="mini"
                v-model="form.settlement_month_fee_type"
                placeholder="请选择"
                style="width: 254px; font-size: 12px"
                popper-class="el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option label="先票后款" :value="1" />
                <el-option label="先款后票" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="税率"
              class="sub-item anchor append"
              prop="settlement_month_tax_rate"
            >
              <el-input
                @input="getfixIntPositiveNumber($event, 'settlement_month_tax_rate')"
                @blur="blurPositiveNumber($event, 'settlement_month_tax_rate')"
                v-model="form.settlement_month_tax_rate"
                placeholder="请输入"
                ><span slot="append">%</span></el-input
              >
            </el-form-item>
            <el-form-item class="sub-item" label="开票内容" prop="content_type_other">
              <div style="display: inline-block">
                <div class="contract-type-div">
                  <el-input
                    style="width: 254px"
                    v-model.trim="form.content_type_other"
                    placeholder="请输入一级税目"
                    ref="autoFocuseRef"
                    maxlength="10"
                    show-word-limit
                  >
                  </el-input>
                  <span class="contract-type-explain">
                    <el-popover
                      popper-class="explain-pover"
                      placement="top-start"
                      title=""
                      width="640"
                      trigger="hover"
                    >
                      <div class="date-box-content">
                        <img
                          style="
                            height: 360px;
                            width: 600px;
                            border: 1px solid var(--border-line-color);
                          "
                          :src="this.invoiceFiledImage"
                        />
                      </div>
                      <el-button slot="reference">
                        <tg-icon
                          name="ico-icon_explain"
                          style="font-size: 14px; color: var(--icon-color)"
                        ></tg-icon>
                      </el-button>
                    </el-popover>
                  </span>
                </div>
              </div>
            </el-form-item>
          </template>
          <template>
            <template v-if="!dialogConfig.personalSign">
              <head-lines style="margin: 12px 0 8px -10px" :titleFont="12" title="其它信息" />
              <el-form-item class="sub-item anchor" label="盖章份数" prop="other_stamp_count">
                <el-input
                  maxlength="1"
                  @input="getfixIntPositiveNumber($event, 'other_stamp_count')"
                  style="width: 254px; line-height: 26px; height: 28px !important"
                  v-model="form.other_stamp_count"
                  placeholder="请输入盖章份数"
                ></el-input>
              </el-form-item>
              <el-form-item class="sub-item anchor" label="印章名称" prop="other_stamp_type">
                <el-select
                  size="mini"
                  v-model="form.other_stamp_type"
                  placeholder="请选择印章名称"
                  style="width: 254px; font-size: 12px"
                  popper-class="el-select-popper-mini frame_contract_popper-custoner"
                >
                  <el-option
                    v-for="item in stampRecord"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="sub-item anchor" label="用印时间" prop="other_stamp_time">
                <el-date-picker
                  style="width: 254px; margin-right: 12px"
                  v-model="form.other_stamp_time"
                  type="date"
                  :editable="false"
                  placeholder="选择日期"
                  format="yyyy.MM.dd"
                  value-format="yyyy.MM.dd"
                />
              </el-form-item>
              <el-form-item class="sub-item anchor" label="是否邮寄" prop="other_stamp_send_type">
                <el-select
                  size="mini"
                  v-model="form.other_stamp_send_type"
                  placeholder="请选择是否邮寄"
                  style="width: 254px; font-size: 12px"
                  popper-class="el-select-popper-mini frame_contract_popper-custoner"
                >
                  <el-option
                    v-for="item in sendAddressRecord"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="form.other_stamp_send_type === 1"
                class="sub-item anchor"
                label="邮寄信息"
                style="width: 600px"
                prop="other_stamp_send_address"
              >
                <el-input
                  style="width: 524px; line-height: 26px; height: 28px !important"
                  v-model="form.other_stamp_send_address"
                  placeholder="示例：省+市+区+详细地址，姓名（电话）"
                ></el-input>
              </el-form-item>
            </template>
            <div class="line-box">
              <el-form-item
                :label="
                  form.cooperation_contract_type === 1 || form.cooperation_contract_type === 2
                    ? '附件'
                    : '合同及附件'
                "
                prop="file_url_list"
              >
                <div>
                  <el-upload
                    action
                    class="upload-btn-wrap"
                    :show-file-list="false"
                    :multiple="false"
                    :http-request="uploadAttachmentFile"
                    accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.xlsx"
                    v-if="file_url_list.length < 10"
                  >
                    <tg-button icon="ico-btn-upload">{{
                      form.cooperation_contract_type === 1 || form.cooperation_contract_type === 2
                        ? '上传文件'
                        : '合同文本及附件'
                    }}</tg-button>
                  </el-upload>
                  <tg-button
                    v-else
                    icon="ico-btn-upload"
                    disabled
                    style="background-color: transparent"
                    >{{
                      form.cooperation_contract_type === 1 || form.cooperation_contract_type === 2
                        ? '上传文件'
                        : '合同文本及附件'
                    }}</tg-button
                  >
                  <div
                    class="file-tips"
                    v-if="
                      (form.cooperation_contract_type === 1 ||
                        form.cooperation_contract_type === 2) &&
                      !dialogConfig.personalSign
                    "
                  >
                    合同文本自动生成，无需上传；限docx .doc .pdf .jpg .png
                    .xlsx格式，最多上传10份文件，每份不超过20M。
                  </div>
                  <div class="file-tips" v-else>
                    限docx .doc .pdf .jpg .png .xlsx格式，最多上传10份文件，每份不超过20M。
                  </div>
                </div>
              </el-form-item>
            </div>
            <div class="file-list-box">
              <upload-file-list v-model="file_url_list" style="margin-bottom: 14px" />
            </div>
            <el-form-item class="remark-item" prop="other_remark" label="备注">
              <el-input
                type="textarea"
                rows="4"
                maxlength="100"
                show-word-limit
                placeholder="请输入"
                v-model="form.other_remark"
              ></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <template #footer>
        <tg-button type="primary" @click="onSaveBtnClick(1)" :disabled="isUnableClick"
          >提交审核</tg-button
        >
        <tg-button
          @click="onSaveBtnClick(2)"
          v-if="
            (form.cooperation_contract_type === 1 || form.cooperation_contract_type === 2) &&
            !dialogConfig.personalSign
          "
          :disabled="isUnableClick"
          >合同预览</tg-button
        >
        <tg-button @click="backClick">返回</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交数据，请稍候..." />
  </div>
</template>
<script src="./anchorAgreementDialog.ts" />

<style lang="less" scoped>
@import './agreement.less';
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: gray;
}
.el-radio__input.is-checked + .el-radio__label {
  color: var(--text-color);
}
</style>
