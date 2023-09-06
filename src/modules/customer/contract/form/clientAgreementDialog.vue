<template>
  <div v-if="visible">
    <el-dialog
      class="tg-dialog-classic tg-dialog-vcenter-new contract-form-modal"
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1128px"
      top="70px"
      @close="backClick"
    >
      <template #title>
        <span>{{ type === 'add' ? '新增客户合同' : '编辑客户合同' }}</span>
      </template>
      <div
        class="dialog-content"
        style="
          padding: 5px 20px;
          overflow-y: auto;
          overflow-x: hidden;
          height: 80vh;
          min-height: 400px;
        "
      >
        <el-form size="mini" :model="form" label-width="74px">
          <el-form-item
            label="合同类型："
            prop="radio"
            style="display: inline-block; width: 578px; margin: 10px 0 !important"
            v-if="project_type != 1 && project_type != 4 && project_type != 5"
          >
            <el-radio-group
              :value="form.contract_status"
              @input="tabscontract_statusChange"
              style="line-height: 28px; height: 28px; display: flex"
            >
              <el-radio :label="0" style="line-height: 28px; height: 28px; width: 180px"
                >其它合同协议</el-radio
              >
              <el-radio :label="1" style="line-height: 28px; height: 28px; width: 230px"
                >直播推广服务协议（品牌&构美）</el-radio
              >
            </el-radio-group>
            <div
              style="
                display: block;
                height: 22px;
                font-size: 12px;
                margin-left: 0px;
                margin-top: -4px;
              "
              :style="{
                marginLeft: form.contract_status === 1 ? '200px' : '0px',
              }"
            >
              <i
                class="el-icon-warning-outline"
                style="
                  color: var(--warning-color);
                  height: 22px;
                  line-height: 22px;
                  font-size: 14px;
                "
              ></i
              ><span
                v-if="form.contract_status === 1"
                style="
                  color: var(--text-third-color);
                  margin-left: 6px;
                  height: 17px;
                  line-height: 17px;
                "
                >完成信息填写后自动生成该协议文本</span
              ><span
                v-if="form.contract_status === 0"
                style="
                  color: var(--text-third-color);
                  margin-left: 6px;
                  height: 17px;
                  line-height: 17px;
                "
                >合同模板请至项目合同协议页面下载</span
              >
            </div>
          </el-form-item>
          <el-form-item
            label="客户名称："
            class="flex-form-item"
            style="margin-right: 20px; margin-top: 10px; margin-bottom: 12px; width: 916px"
          >
            <el-select
              popper-class="el-select-popper-mini"
              v-model="frame_contract_uid"
              style="width: 180px; margin-top: 0px"
              size="mini"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="请输入并选择客户名称"
              :remote-method="getAllSupplierName"
              @change="onSupplierIdChange"
              :disabled="contract_id !== undefined"
            >
              <el-option
                v-for="item in allSupplierName"
                :key="item.partner_id"
                :label="item.partner_name"
                :value="item.partner_id"
              >
                <span>{{ item.partner_name }}</span>
              </el-option>
            </el-select>
            <div
              class="elbuttonnone add"
              style="display: inline-block; height: 17px; font-size: 12px; margin-left: 12px"
            >
              <span style="color: var(--text-third-color)">找不到审核通过的客户信息？点此处</span>
              <el-button
                style="
                  color: var(--theme-color);
                  line-height: 25px;
                  font-size: 12px;
                  font-weight: 400;
                "
                @click="gotoAddCompany"
                ><span>新增</span></el-button
              >
            </div>
          </el-form-item>
        </el-form>
        <el-form
          size="mini"
          style="margin-left: 5px"
          :model="form"
          :rules="formRules"
          ref="formRef"
        >
          <head-lines style="margin: 12px 0 10px -10px" :titleFont="12" title="我方信息" />
          <el-form-item class="sub-item" label="签约主体" prop="own_contract_type">
            <el-select
              size="mini"
              v-model="form.own_contract_type"
              placeholder="请选择签约主体"
              style="width: 254px; font-size: 12px"
              popper-class="el-select-popper-mini frame_contract_popper-custoner"
            >
              <el-option
                v-for="item in ownInfoRecords"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="sub-item" label="联系人花名" prop="own_name">
            <el-input
              v-model.trim="form.own_name"
              placeholder="请输入联系人花名"
              ref="autoFocuseRef"
            >
            </el-input>
          </el-form-item>

          <el-form-item class="sub-item" label="电话" prop="own_tel">
            <el-input
              type="tel"
              rows="1"
              @input="getfixIntPositiveNumber($event, 'own_tel')"
              maxlength="11"
              placeholder="请输入联系人电话"
              v-model="form.own_tel"
            />
          </el-form-item>
          <el-form-item
            class="sub-item anchor"
            label="合同所属部门"
            :defaultExpandedKeys="departmentDefaultExpandedKeys"
            prop="approval_department_id"
            style="margin-right: 0"
          >
            <department-select
              :levelDisabled="levelDisabled"
              clearable
              v-model="form.approval_department_id"
            ></department-select>
          </el-form-item>
          <template v-if="form.contract_status === 1">
            <head-lines style="margin: 12px 0 10px -10px" :titleFont="12" title="合作内容" />
            <el-form-item class="sub-item" label="直播平台" prop="cooperation_work_platform">
              <el-select
                v-model="form.cooperation_work_platform"
                placeholder="请选择直播平台"
                style="width: 254px; font-size: 12px; display: inline-block"
                popper-class="el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option
                  v-for="item in pingtaiRecords"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="sub-item" label="主播名称" prop="cooperation_zhubo_name">
              <el-input
                maxlength="20"
                v-model.trim="form.cooperation_zhubo_name"
                placeholder="请输入主播名称"
                ref="autoFocuseRef"
              >
              </el-input>
            </el-form-item>
            <el-form-item class="sub-item" label="链接数量" prop="cooperation_link_count">
              <el-input
                maxlength="8"
                @input="getfixIntPositiveNumber($event, 'cooperation_link_count')"
                v-model.trim="form.cooperation_link_count"
                placeholder="请输入链接数量"
                ref="autoFocuseRef"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              class="sub-item"
              label="店铺名称"
              style="margin-right: 0 !important"
              prop="cooperation_shop_name"
            >
              <el-input
                maxlength="20"
                v-model.trim="form.cooperation_shop_name"
                placeholder="请输入店铺名称"
                ref="autoFocuseRef"
              >
              </el-input>
            </el-form-item>
            <el-form-item class="sub-item" label="产品服务/服务名称" prop="cooperation_work_name">
              <el-input
                maxlength="20"
                v-model.trim="form.cooperation_work_name"
                placeholder="请输入产品服务/服务名称"
                ref="autoFocuseRef"
              >
              </el-input>
            </el-form-item>
            <el-form-item class="sub-item" label="直播日期（暂定）" prop="cooperation_gather_date">
              <el-date-picker
                style="width: 254px"
                v-model="form.cooperation_gather_date"
                type="date"
                :editable="false"
                placeholder="请选择直播日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="讲解时长" class="sub-item append" prop="cooperation_work_time">
              <el-input
                @input="getfixPositiveNumber($event, 'cooperation_work_time')"
                @blur="blurPositiveNumber($event, 'cooperation_work_time')"
                v-model="form.cooperation_work_time"
                placeholder="请输入讲解时长"
                ><span slot="append">分钟</span></el-input
              >
            </el-form-item>
            <el-form-item
              class="sub-item append"
              label="平台信息流授权"
              style="margin-right: 0 !important"
              prop="cooperation_work_day"
            >
              <el-input
                @input="getfixPositiveNumber($event, 'cooperation_work_day')"
                @blur="blurPositiveNumber($event, 'cooperation_work_day')"
                v-model="form.cooperation_work_day"
                placeholder="请输入授权天数"
                ><span slot="append">天</span>
              </el-input>
            </el-form-item>
            <el-form-item
              label="种草视频时长"
              class="sub-item append"
              prop="cooperation_work_video_time"
            >
              <el-input
                @input="getfixPositiveNumber($event, 'cooperation_work_video_time')"
                @blur="blurPositiveNumber($event, 'cooperation_work_video_time')"
                v-model="form.cooperation_work_video_time"
                placeholder="请输入种草视频时长"
                ><span slot="append">秒</span></el-input
              >
            </el-form-item>
            <el-form-item class="sub-item append" label="其它权益">
              <el-input
                type="text"
                class="input-show-limit"
                v-model="form.cooperation_work_other"
                placeholder="请输入其它权益"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </template>
          <template>
            <head-lines style="margin: 12px 0 10px -10px" :titleFont="12" title="合同期限" />
            <el-form-item
              class="one-item change-error"
              label="签约类型"
              prop="cooperation_contract_type"
            >
              <div class="contract-type-div">
                <el-select
                  size="mini"
                  :disabled="type !== 'add'"
                  v-model="form.cooperation_contract_type"
                  placeholder="请选择签约类型"
                  style="width: 254px; font-size: 12px"
                  popper-class="el-select-popper-mini frame_contract_popper-custoner"
                >
                  <el-option
                    v-for="item in qianyueRecord"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span class="contract-type-explain">
                  <el-popover
                    popper-class="explain-pover"
                    placement="top-start"
                    title=""
                    width="500"
                    trigger="hover"
                    content="单次合同：双方基于本合同只合作一次。
                  框架合同：双方基于本合同合作两次及以上或长期合作。
                  补充协议：基于双方已签订的原合同，就原合同的部分条款修改或增加部分条款达成的协议。
                  续签合同：双方已签订的合同已到期，双方就原合同约定的合作事项重新签订合同或以补充协议形式延长合作期限。
                  注：若补充协议中有延长合作期限的约定的，优先选择续签合同。
                  解除协议：双方解除合作。"
                  >
                    <el-button slot="reference">
                      <!--                      <span class="icon-question">?</span>-->
                      <!--<i class="el-icon-question" style="font-size: 16px; color: gray"></i
              >-->
                      <tg-icon
                        name="ico-icon_explain"
                        style="font-size: 14px; color: var(--icon-color)"
                      ></tg-icon>
                    </el-button>
                  </el-popover>
                </span>
              </div>
            </el-form-item>
            <el-form-item
              v-if="
                form.cooperation_contract_type === 4 ||
                form.cooperation_contract_type === 5 ||
                form.cooperation_contract_type === 6 ||
                form.cooperation_contract_type === 0
              "
              class="sub-item one-item-sub pay-type-select"
              :label="form.cooperation_contract_type === 0 ? '关联原合同：' : '关联主合同：'"
              label-width="80px"
              style="height: 56px; line-height: 56px"
              prop="cooperation_link_contract_id"
            >
              <div class="triangle-css3 transform"></div>
              <el-select
                popper-class="el-select-popper-mini"
                v-model="form.cooperation_link_contract_id"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请输入合同编码"
                :remote-method="getContract"
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
            <el-form-item
              class="one-item"
              label="合同有效期"
              prop="cooperation_zhubo_real_start_time"
            >
              <el-date-picker
                style="width: 254px; margin-right: 12px"
                v-model="form.cooperation_zhubo_real_start_time"
                type="date"
                :editable="false"
                placeholder="开始日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
              <el-date-picker
                :disabled="form.cooperation_contract_long_type"
                style="width: 254px; margin-right: 12px"
                v-model="form.cooperation_zhubo_real_end_time"
                type="date"
                :editable="false"
                placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
              <el-checkbox v-model="form.cooperation_contract_long_type">长期有效</el-checkbox>
            </el-form-item>
            <el-form-item
              class="one-item"
              label="最后一期款项收款时间"
              style="margin-top: 4px"
              prop="cooperation_zhubo_real_last_time"
            >
              <el-date-picker
                style="width: 254px; margin-right: 12px"
                v-model="form.cooperation_zhubo_real_last_time"
                type="date"
                :editable="false"
                placeholder="选择时间"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </template>
          <template>
            <head-lines style="margin: 12px 0 10px -10px" :titleFont="12" title="收付款条件" />
            <el-form-item
              class="one-item change-errortypenew"
              label="收费类型"
              prop="payee_type"
              style="margin-bottom: 5px"
            >
              <el-radio-group
                :value="form.payee_type"
                @input="tabsShoufeiChange"
                style="line-height: 26px; height: 28px !important"
              >
                <el-radio
                  :label="1"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    width: 230px;
                    margin-right: 30px;
                  "
                  >固定服务费</el-radio
                >
                <el-radio
                  :label="2"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    width: 230px;
                    margin-right: 30px;
                  "
                  >服务费+佣金</el-radio
                ><el-radio
                  :label="3"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    width: 230px;
                    margin-right: 30px;
                  "
                  >纯佣金</el-radio
                >
                <el-radio
                  :label="4"
                  style="line-height: 26px; height: 28px !important; width: 150px"
                  >其它
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <div
              v-if="form.payee_type"
              class="pay-type-select client"
              style="margin-top: 0px; margin-bottom: 10px"
              :class="{
                one: form.payee_type === 1,
                two: form.payee_type === 2,
                three: form.payee_type === 3,
                four: form.payee_type === 4,
              }"
            >
              <div class="triangle-css3 transform"></div>
              <div v-if="form.payee_type === 1" style="margin-left: 18px">
                <span>固定服务费</span>
                <el-input
                  @input="getfixPositiveNumber($event, 'payee_money')"
                  @blur="blurPositiveNumber($event, 'payee_money')"
                  v-model="form.payee_money"
                  style="
                    margin-top: -8px;
                    margin-left: 8px;
                    width: 154px;
                    line-height: 26px;
                    height: 28px !important;
                  "
                  placeholder="请输入(必填)"
                  ><span slot="append">元</span></el-input
                >
              </div>
              <div v-if="form.payee_type === 2" style="margin-left: 18px">
                <span>服务费</span>
                <el-input
                  @input="getfixPositiveNumber($event, 'payee_money_two')"
                  @blur="blurPositiveNumber($event, 'payee_money_two')"
                  v-model="form.payee_money_two"
                  style="
                    margin-top: -8px;
                    margin-left: 8px;
                    width: 154px;
                    line-height: 26px;
                    height: 28px !important;
                  "
                  placeholder="请输入(必填)"
                  ><span slot="append">元</span></el-input
                >
                <span style="margin-left: 24px">主播佣金</span
                ><el-input
                  @input="getfixIsBaiPositiveNumber($event, 'payee_yongjinlv_two')"
                  @blur="blurPositiveNumber($event, 'payee_yongjinlv_two')"
                  v-model="form.payee_yongjinlv_two"
                  style="
                    margin-top: -8px;
                    margin-left: 8px;
                    width: 154px;
                    line-height: 26px;
                    height: 28px !important;
                  "
                  placeholder="请输入(必填)"
                  ><span slot="append">%</span></el-input
                ><span style="margin-left: 24px">构美佣金</span
                ><el-input
                  @input="getfixIsBaiPositiveNumber($event, 'payee_yongjinlv_one')"
                  @blur="blurPositiveNumber($event, 'payee_yongjinlv_one')"
                  style="
                    margin-top: -8px;
                    margin-left: 8px;
                    width: 154px;
                    line-height: 26px;
                    height: 28px !important;
                  "
                  v-model="form.payee_yongjinlv_one"
                  placeholder="请输入(选填)"
                  ><span slot="append">%</span></el-input
                >
              </div>
              <div v-if="form.payee_type === 3" style="margin-left: 18px">
                <span>主播佣金</span
                ><el-input
                  @input="getfixIsBaiPositiveNumber($event, 'payee_yongjinlv_four')"
                  @blur="blurPositiveNumber($event, 'payee_yongjinlv_four')"
                  v-model="form.payee_yongjinlv_four"
                  style="
                    margin-top: -8px;
                    margin-left: 8px;
                    width: 154px;
                    line-height: 26px;
                    height: 28px !important;
                  "
                  placeholder="请输入(必填)"
                  ><span slot="append">%</span></el-input
                >
                <span style="margin-left: 24px">构美佣金</span
                ><el-input
                  @input="getfixIsBaiPositiveNumber($event, 'payee_yongjinlv_three')"
                  @blur="blurPositiveNumber($event, 'payee_yongjinlv_three')"
                  style="
                    margin-top: -8px;
                    margin-left: 8px;
                    width: 154px;
                    line-height: 26px;
                    height: 28px !important;
                  "
                  v-model="form.payee_yongjinlv_three"
                  placeholder="请输入(选填)"
                  ><span slot="append">%</span></el-input
                >
              </div>
              <div
                v-if="form.payee_type === 4"
                class="payee-type-other-client"
                style="margin-left: 18px"
              >
                <span>其它</span>
                <el-input
                  style="
                    display: inline-block;
                    width: 836px;
                    line-height: 26px;
                    height: 28px !important;
                    margin-left: 8px;
                  "
                  maxlength="200"
                  show-word-limit
                  placeholder="请输入(必填)"
                  v-model="form.payee_remarkstr"
                />
              </div>
            </div>
            <el-form-item
              class="one-item change-error"
              style="margin-top: 4px"
              label="ROI要求"
              prop="payee_ROI_type"
            >
              <el-radio-group
                v-model="form.payee_ROI_type"
                class="nocheckbox"
                style="line-height: 26px; height: 28px !important"
              >
                <label>
                  <el-radio
                    :label="1"
                    @click.native.prevent="tabsROIChange(1)"
                    style="
                      line-height: 26px;
                      height: 28px !important;
                      margin-right: 30px;
                      width: 250px;
                    "
                    >不保量</el-radio
                  ></label
                ><label
                  ><el-radio
                    :label="2"
                    @click.native.prevent="tabsROIChange(2)"
                    style="line-height: 26px; height: 28px !important; margin-right: 0px"
                    >保量
                    <div
                      @click.stop.prevent="noChange()"
                      style="
                        margin-left: 3px;
                        display: inline-block;
                        width: 144px;
                        border: 1px solid var(--border-line-color);
                        border-radius: 2px;
                        line-height: 16px;
                      "
                    >
                      <el-input
                        @input="getfixIntPositiveNumber($event, 'payee_ROI_request_fw')"
                        @blur="blurIsZoreNumber($event, 'payee_ROI_request_fw')"
                        class="paperview-input-text"
                        style="text-align: right"
                        v-model="form.payee_ROI_request_fw"
                        placeholder=""
                        :disabled="!(form.payee_ROI_type === 2)"
                      ></el-input
                      >:<el-input
                        @input="getfixIntPositiveNumber($event, 'payee_ROI_request_xs')"
                        @blur="blurIsZoreNumber($event, 'payee_ROI_request_xs')"
                        class="paperview-input-text"
                        v-model="form.payee_ROI_request_xs"
                        :disabled="!(form.payee_ROI_type === 2)"
                        placeholder=""
                      ></el-input>
                    </div>

                    <div
                      @click.stop.prevent="noChange()"
                      style="
                        display: inline-block;
                        line-height: 26px;
                        height: 28px !important;

                        font-size: 12px;
                        color: var(--text-third-color);
                        padding-left: 10px;
                        cursor: default !important;
                      "
                    >
                      服务费 : 保量销售额
                    </div></el-radio
                  >
                </label>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="one-item change-error" label="执行要求" prop="payee_execute_type">
              <el-radio-group
                v-model.trim="form.payee_execute_type"
                style="line-height: 26px; height: 28px !important"
              >
                <el-radio
                  :label="1"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 30px;
                    width: 250px;
                  "
                  >先执行后收款</el-radio
                ><el-radio
                  :label="2"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >先收款后执行</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item class="one-item change-error" label="收款要求" prop="payee_request_type">
              <el-radio-group
                v-model="form.payee_request_type"
                style="line-height: 26px; height: 28px !important"
              >
                <el-radio
                  :label="1"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 30px;
                    width: 250px;
                  "
                  >分期收款</el-radio
                ><el-radio
                  :label="2"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >一次性收款</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="one-item change-error"
              label="票款要求"
              prop="payee_request_card_type"
            >
              <el-radio-group
                v-model="form.payee_request_card_type"
                style="line-height: 26px; height: 28px !important"
              >
                <el-radio
                  :label="1"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 30px;
                    width: 250px;
                  "
                  >先票后款</el-radio
                ><el-radio
                  :label="2"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >先款后票</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="one-item change-error"
              label="开票要求"
              prop="payee_request_opencard_type"
            >
              <el-radio-group
                v-model="form.payee_request_opencard_type"
                style="line-height: 26px; height: 28px !important"
              >
                <el-radio
                  :label="1"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 30px;
                    width: 250px;
                  "
                  >专票<el-input
                    @input="getfixIntPositiveNumber($event, 'payee_request_opencard_shuilv')"
                    style="
                      margin-left: 8px;
                      width: 136px;
                      line-height: 26px;
                      height: 28px !important;
                    "
                    v-model="form.payee_request_opencard_shuilv"
                    placeholder="请输入税率"
                    :disabled="!(form.payee_request_opencard_type === 1)"
                    ><span slot="append">%</span></el-input
                  ></el-radio
                ><el-radio
                  :label="2"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 0px;
                    width: 250px;
                  "
                  >普票<el-input
                    @input="
                      getfixIntPositiveNumber($event, 'payee_request_opencard_default_shuilv')
                    "
                    style="
                      margin-left: 8px;
                      width: 136px;
                      line-height: 26px;
                      height: 28px !important;
                    "
                    v-model="form.payee_request_opencard_default_shuilv"
                    placeholder="请输入税率"
                    :disabled="!(form.payee_request_opencard_type === 2)"
                    ><span slot="append">%</span></el-input
                  ></el-radio
                >
                <el-radio
                  :label="3"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >不开票</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="form.contract_status === 1"
              class="one-item change-error"
              label="收款方式"
              prop="payee_paymoney_type"
            >
              <el-radio-group
                v-model="form.payee_paymoney_type"
                style="line-height: 26px; height: 28px !important"
              >
                <el-radio
                  :label="1"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 30px;
                    width: 250px;
                  "
                  >对公账户转账</el-radio
                ><el-radio
                  :label="2"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 0px;
                    width: 250px;
                  "
                  >支付宝转账</el-radio
                >
                <el-radio
                  :label="3"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >V任务下单<el-input
                    style="
                      margin-left: 8px;
                      width: 154px;
                      line-height: 26px;
                      height: 28px !important;
                    "
                    v-model="form.payee_paymoney_type_link"
                    placeholder="请输入V任务链接"
                    :disabled="!(form.payee_paymoney_type === 3)"
                  ></el-input
                ></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              v-if="form.payee_request_opencard_type !== 3"
              class="one-item"
              label="开票内容"
              prop="content_type_other"
            >
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
            <head-lines style="margin: 12px 0 10px -10px" :titleFont="12" title="保证金" />
            <el-form-item class="sub-item" label="是否有保证金" prop="cashdeposit_need_type">
              <el-select
                size="mini"
                v-model="form.cashdeposit_need_type"
                placeholder="请选择"
                style="width: 254px; font-size: 12px"
                popper-class="el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option
                  v-for="item in baozhengjinrecord"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="sub-item"
              v-if="form.cashdeposit_need_type === 1"
              label="支付日期"
              prop="cashdeposit_need_date"
            >
              <el-date-picker
                style="width: 254px; margin-right: 12px"
                v-model="form.cashdeposit_need_date"
                type="date"
                :editable="false"
                placeholder="选择日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item
              class="sub-item append"
              v-if="form.cashdeposit_need_type === 1"
              label="保证金金额"
              prop="cashdeposit_need_money"
            >
              <el-input
                @input="getfixPositiveNumber($event, 'cashdeposit_need_money')"
                @blur="blurPositiveNumber($event, 'cashdeposit_need_money')"
                v-model="form.cashdeposit_need_money"
                style="width: 254px; line-height: 26px; height: 28px !important"
                placeholder="请输入保证金金额"
                ><span slot="append">元</span></el-input
              >
            </el-form-item>
            <el-form-item
              v-if="form.cashdeposit_need_type === 1"
              class="sub-item append"
              label="直播结束后退还日期"
              prop="cashdeposit_need_day"
              style="margin-right: 0 !important"
            >
              <el-input
                @input="getfixPositiveNumber($event, 'cashdeposit_need_day')"
                @blur="blurPositiveNumber($event, 'cashdeposit_need_day')"
                v-model="form.cashdeposit_need_day"
                style="width: 254px; line-height: 26px; height: 28px !important"
                placeholder="请输入直播结束后退还日期"
                ><span slot="append">工作日</span></el-input
              >
            </el-form-item>
          </template>
          <template>
            <head-lines style="margin: 12px 0 10px -10px" :titleFont="12" title="其它信息" />
            <el-form-item class="sub-item" label="盖章份数" prop="other_stamp_count">
              <el-input
                @input="getfixIntPositiveNumber($event, 'other_stamp_count')"
                maxlength="8"
                style="width: 254px; line-height: 26px; height: 28px !important"
                v-model="form.other_stamp_count"
                placeholder="请输入盖章份数"
              ></el-input>
            </el-form-item>
            <el-form-item class="sub-item" label="印章名称" prop="other_stamp_type">
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
            <el-form-item class="sub-item" label="用印时间" prop="other_stamp_time">
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
            <el-form-item
              class="sub-item"
              label="是否邮寄"
              prop="other_stamp_send_type"
              style="margin-right: 0 !important"
            >
              <el-select
                size="mini"
                v-model="form.other_stamp_send_type"
                placeholder="请选择是否邮寄"
                style="width: 254px; font-size: 12px"
                popper-class="el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option
                  v-for="item in baozhengjinrecord"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.other_stamp_send_type === 1"
              class="sub-item"
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
            <template
              v-if="
                project_type != 1 &&
                project_type != 4 &&
                project_type != 5 &&
                form.contract_status === 1
              "
            >
              <div style="min-height: 30px; margin-top: 10px" class="not-allowed">
                <el-checkbox
                  style="margin-top: 9px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px">甲方应于本合同签订后</span
                  ><el-input
                    @input="getfixPositiveNumber($event, 'live_day_pre')"
                    @blur="blurPositiveNumber($event, 'live_day_pre')"
                    v-model="form.live_day_pre"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                  ></el-input
                  >日内、直播开播前一次性全额支付给乙方，直播结束后<el-input
                    @input="getfixPositiveNumber($event, 'live_day_later')"
                    @blur="blurPositiveNumber($event, 'live_day_later')"
                    v-model="form.live_day_later"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                  ></el-input
                  >日内乙方根据实际应收款向甲方提供合法有效的且符合约定的增值税专用发票。
                </div>
              </div>
              <div style="min-height: 60px" class="not-allowed">
                <el-checkbox
                  style="margin-top: 9px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px"
                    >如未达成保量销售额，甲方可以选择要求乙方进行补播至保量目标或者要求乙方就未达成部分按比例退还基础服务费【即乙方退还服务费=未达成保量销售额部分÷保量销售额×基础服务费】，甲方选择退款的，乙方应于甲方提出退款申请后</span
                  ><el-input
                    @input="getfixPositiveNumber($event, 'refund_day')"
                    @blur="blurPositiveNumber($event, 'refund_day')"
                    v-model="form.refund_day"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                  ></el-input
                  >日内完成退款。
                </div>
              </div>
              <div
                v-if="
                  (form.payee_yongjinlv_three > 0 && form.payee_type === 3) ||
                  (form.payee_yongjinlv_one > 0 && form.payee_type === 2)
                "
                style="min-height: 30px"
                class="not-allowed"
              >
                <el-checkbox
                  style="margin-top: 9px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px"
                    >如因后台设置或其他原因导致未能通过平台系统完成佣金结算的，甲方应在直播结束后</span
                  ><el-input
                    @input="getfixPositiveNumber($event, 'live_line_day_later')"
                    @blur="blurPositiveNumber($event, 'live_line_day_later')"
                    v-model="form.live_line_day_later"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                  ></el-input
                  >日内完成线下结算。
                </div>
              </div>
              <div style="min-height: 30px" class="not-allowed">
                <el-checkbox
                  style="margin-top: 9px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px">直播开始前至少</span
                  ><el-input
                    @input="getfixPositiveNumber($event, 'live_start_day_pre')"
                    @blur="blurPositiveNumber($event, 'live_start_day_pre')"
                    v-model="form.live_start_day_pre"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                  ></el-input
                  >日向乙方提供发布物料及必要信息，做好直播的前期准备工作，提前告知乙方直播时间，做好直播间界面及直播环节设置等各种准备。
                </div>
              </div>
              <div
                class="elbuttonnone"
                style="
                  width: 100%;
                  height: 28px;
                  line-height: 26px;
                  margin-top: 0px;
                  font-size: 12px;
                  margin-left: -6px;
                "
              >
                <el-checkbox
                  style="width: 100%; display: block"
                  v-model="form.contract_xieyi_one_type"
                  >大主播合作条款<el-popover
                    placement="top-start"
                    title=""
                    width="500"
                    trigger="hover"
                    content="若甲方未能提供与双方约定一致的优惠机制（包括但不限于商品及赠品的种类、数量、库存、发货周期等），
                  甲方应按双方约定的优惠机制向下单客户三倍支付差价或三倍补发不一致部分商品，并每次赔偿乙方人民币拾万元整，
                  若该金额不足以赔偿因此给乙方带来的一切费用和损失，包括但不限于因甲方怠于履行上述承诺导致客户向乙方的追偿、
                  乙方人工成本、给粉丝的红包福利等及乙方用于挽回红人形象的经济支出等，甲方应当承担。"
                  >
                    <el-button slot="reference">
                      <!--                      <span class="icon-question">?</span>-->
                      <!--<i class="el-icon-question" style="font-size: 16px; color: gray"></i
                  >-->
                      <tg-icon
                        name="ico-icon_explain"
                        style="font-size: 14px; color: var(--icon-color)"
                      ></tg-icon>
                    </el-button> </el-popover
                ></el-checkbox>
              </div>
              <div style="min-height: 90px" class="trems">
                <el-checkbox
                  style="margin-top: 9px; width: 17px; display: inline-block; float: left"
                  v-model="form.contract_xieyi_two_type"
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px"
                    >保价条款：甲方承诺推广标的销售价格在直播当日及直播结束前</span
                  ><el-input
                    @input="getfixPositiveNumber($event, 'supportValue_one')"
                    @blur="blurPositiveNumber($event, 'supportValue_one')"
                    v-model="form.supportValue_one"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                    :disabled="!form.contract_xieyi_two_type"
                  ></el-input
                  >个自然日、直播后<el-input
                    @input="getfixPositiveNumber($event, 'supportValue_two')"
                    @blur="blurPositiveNumber($event, 'supportValue_two')"
                    v-model="form.supportValue_two"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                    :disabled="!form.contract_xieyi_two_type"
                  ></el-input
                  >个自然日内（共计<el-input
                    @input="getfixPositiveNumber($event, 'supportValue_all')"
                    @blur="blurPositiveNumber($event, 'supportValue_all')"
                    v-model="form.supportValue_all"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                    :disabled="!form.contract_xieyi_two_type"
                  ></el-input
                  >个自然日）为
                  <el-checkbox
                    v-model="form.contract_xieyi_pintai_one_type"
                    style="margin-right: 0 !important"
                    :disabled="!form.contract_xieyi_two_type"
                    >所有网络平台</el-checkbox
                  >
                  <el-checkbox
                    v-model="form.contract_xieyi_pintai_two_type"
                    style="margin: 0px 10px !important"
                    :disabled="!form.contract_xieyi_two_type"
                    >所有线上线下平台</el-checkbox
                  ><el-checkbox
                    class="nocheckbox"
                    v-model="form.contract_xieyi_pintai_three_type"
                    style="margin: 0px !important"
                    :disabled="!form.contract_xieyi_two_type"
                    ><el-input
                      class="paperview-input-line-text nocenter"
                      v-model="form.supportValue_pingtai"
                      placeholder=""
                      style="width: 300px"
                      :disabled="
                        !(form.contract_xieyi_two_type && form.contract_xieyi_pintai_three_type)
                      "
                    ></el-input
                  ></el-checkbox>
                  最低销售价格，否则甲方无条件向消费者退还<el-input
                    @input="getfixPositiveNumber($event, 'supportValue_three')"
                    @blur="blurPositiveNumber($event, 'supportValue_three')"
                    v-model="form.supportValue_three"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                    :disabled="!form.contract_xieyi_two_type"
                  ></el-input
                  >倍差价；向乙方赔偿违约金人民币<el-input
                    v-model="form.supportValue_four"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                    :disabled="!form.contract_xieyi_two_type"
                  ></el-input
                  >万元并承担由于退还差价发生的一切费用和损失，包括但不限于乙方为此发生的一切人工成本、
                  向消费者或合作主播支付的额外补偿（包括但不限于红包和其它粉丝福利）。
                </div>
              </div>
              <div style="min-height: 60px" class="trems">
                <el-checkbox
                  style="margin-top: 8px; width: 17px; display: inline-block; float: left"
                  v-model="form.contract_xieyi_three_type"
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px"
                    >保质期约定：甲方承诺推广标的剩余有效期/保质期（如有）不得低于有效期/保质期总和的【三分之二】，
                    否则将视为“临期商品”。如甲方销售临期商品，应无条件向消费者按购买金额的</span
                  ><el-input
                    @input="getfixPositiveNumber($event, 'expiration_date_one')"
                    @blur="blurPositiveNumber($event, 'expiration_date_one')"
                    v-model="form.expiration_date_one"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                    :disabled="!form.contract_xieyi_three_type"
                  ></el-input
                  >倍进行赔偿，并向乙方赔偿违约金人民币<el-input
                    v-model="form.expiration_date_two"
                    class="paperview-input-line-text"
                    placeholder=""
                    style="width: 110px"
                    :disabled="!form.contract_xieyi_three_type"
                  ></el-input
                  >万元，同时乙方有权要求甲方在5个工作日内，向消费者、乙方出具、公开官方致歉函。
                </div>
              </div>
              <div style="min-height: 30px" class="not-allowed">
                <el-checkbox
                  style="margin-top: 9px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px"
                    >如甲方销售过期、假冒伪劣商品，应向消费者按购买金额的十倍进行赔偿；并向乙方赔偿违约金人民币</span
                  ><el-input
                    v-model="form.need_pay_money"
                    class="paperview-input-line-text"
                    style="width: 110px"
                  ></el-input
                  >万元，同时在5个工作日内，向消费者、乙方出具、公开官方致歉函。
                </div>
              </div>
              <div style="min-height: 30px" class="not-allowed">
                <el-checkbox
                  style="margin-top: 9px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px">如甲方选择取消活动，应当在直播脚本确定前</span
                  ><el-input
                    @input="getfixPositiveNumber($event, 'need_pre_day')"
                    @blur="blurPositiveNumber($event, 'need_pre_day')"
                    v-model="form.need_pre_day"
                    class="paperview-input-line-text"
                    style="width: 110px"
                  ></el-input
                  >日提前通知乙方，否则甲方已支付的费用不退回。
                </div>
              </div>
              <div class="trems" style="min-height: 30px; margin-left: 0px">
                <el-checkbox
                  class="not-allowed"
                  style="margin-top: 9px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px"
                    >因本协议引起的或与本协议有关的任何争议，双方可通过友好协商解决，协商不成的，任何一方可向</span
                  ><el-checkbox
                    v-model="form.contract_xieyi_yifang_type"
                    style="margin-right: 0 !important"
                    >乙方</el-checkbox
                  >
                  <el-checkbox
                    v-model="form.contract_xieyi_yuangao_type"
                    style="margin: 0px 10px !important"
                    >原告</el-checkbox
                  >住所地人民法院诉讼解决。
                </div>
              </div>
            </template>
            <div class="line-box">
              <el-form-item
                :label="form.contract_status === 1 ? '附件' : '合同及附件'"
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
                      form.contract_status === 1 ? '上传文件' : '合同文本及附件'
                    }}</tg-button>
                  </el-upload>
                  <tg-button
                    v-else
                    icon="ico-btn-upload"
                    disabled
                    style="background-color: transparent"
                    >{{ form.contract_status === 1 ? '上传文件' : '合同文本及附件' }}</tg-button
                  >
                  <div
                    class="file-tips"
                    v-if="
                      project_type != 1 &&
                      project_type != 4 &&
                      project_type != 5 &&
                      form.contract_status === 1
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
              <upload-file-list v-model="file_url_list" :column="3" style="margin-bottom: 14px" />
            </div>
            <el-form-item class="remark-item" label="备注">
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
          v-if="
            project_type != 1 &&
            project_type != 4 &&
            project_type != 5 &&
            form.contract_status === 1
          "
          @click="onSaveBtnClick(2)"
          :disabled="isUnableClick"
          >合同预览</tg-button
        >
        <!--<tg-button
          v-if="project_type != 1 && form.contract_status === 1"
          @click="onSaveBtnClick(3)"
          :disabled="isUnableClick"
          >合同下载</tg-button
        >-->
        <tg-button @click="backClick">返回</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="  正在提交数据，请稍候..." />
  </div>
</template>
<script src="./clientAgreementDialog.ts"></script>

<style lang="less" scoped>
@import 'agreement.less';
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: gray;
}
.el-radio__input.is-checked + .el-radio__label {
  color: var(--text-color);
}
</style>

<style lang="less">
.explain-pover {
  white-space: pre-line;
  word-break: break-all;
}
</style>
