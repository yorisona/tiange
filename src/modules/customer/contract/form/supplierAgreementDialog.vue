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
        <span>{{ type === 'add' ? '新增供应商合同' : '编辑供应商合同' }}</span>
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
            style="display: inline-block; width: 578px; margin-top: 10px"
            v-if="project_type !== 1 && project_type != 4 && project_type != 5"
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
                >直播推广服务协议（构美&主播）</el-radio
              >
            </el-radio-group>
            <div
              style="
                display: block;
                height: 17px;
                font-size: 12px;
                margin-left: 0;
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
              >
              <span
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
            label="供  应  商："
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
              placeholder="请输入并选择供应商名称"
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
              <span style="color: var(--text-third-color)">找不到审核通过的供应商信息？点此处</span>
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
            prop="approval_department_id"
            style="margin-right: 0"
          >
            <department-select
              :levelDisabled="levelDisabled"
              clearable
              :defaultExpandedKeys="departmentDefaultExpandedKeys"
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
            <el-form-item class="sub-item" label="直播形式" prop="cooperation_live_way">
              <el-select
                v-model="form.cooperation_live_way"
                placeholder="请选择直播形式"
                style="width: 254px; font-size: 12px; display: inline-block"
                popper-class="el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option
                  v-for="item in liveWayRecords"
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
            <el-form-item
              class="sub-item"
              style="margin-right: 0 !important"
              label="链接数量"
              prop="cooperation_link_count"
            >
              <el-input
                maxlength="8"
                v-model.trim="form.cooperation_link_count"
                @input="getfixIntPositiveNumber($event, 'cooperation_link_count')"
                placeholder="请输入链接数量"
                ref="autoFocuseRef"
              >
              </el-input>
            </el-form-item>
            <el-form-item class="sub-item" label="店铺名称" prop="cooperation_shop_name">
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
            <el-form-item
              label="讲解时长"
              class="sub-item append"
              style="margin-right: 0 !important"
              prop="cooperation_work_time"
            >
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
              prop="cooperation_work_day"
            >
              <el-input
                @input="getfixPositiveNumber($event, 'cooperation_work_day')"
                @blur="blurPositiveNumber($event, 'cooperation_work_day')"
                v-model="form.cooperation_work_day"
                placeholder="请输入授权天数"
                ref="autoFocuseRef"
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
              label="最后一期款项付款时间"
              style="margin-top: 10px"
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
              class="one-item change-errortypenew supplier-item"
              label="收费类型"
              prop="payee_type"
              style="margin-bottom: 0px !important"
            >
              <el-radio-group
                v-model="form.payee_type"
                style="line-height: 26px; height: 28px !important; margin-top: 6px"
              >
                <label
                  ><el-radio
                    :label="1"
                    @click.native.prevent="tabsShoufeiChange(1)"
                    style="line-height: 26px; height: 28px !important; width: 280px; top: -8px"
                    >固定服务费</el-radio
                  ></label
                >
                <label>
                  <el-radio
                    :label="2"
                    @click.native.prevent="tabsShoufeiChange(2)"
                    style="line-height: 26px; height: 28px !important; width: 260px; top: -8px"
                    >服务费+佣金</el-radio
                  >
                </label>
                <label>
                  <el-radio
                    :label="3"
                    @click.native.prevent="tabsShoufeiChange(3)"
                    style="line-height: 26px; height: 28px !important; width: 250px; top: -8px"
                    >纯佣金</el-radio
                  >
                </label>
              </el-radio-group>
            </el-form-item>
            <div
              v-if="form.payee_type && form.payee_type !== 4"
              class="pay-type-select"
              style="margin-bottom: 8px"
              :class="{
                one: form.payee_type === 1,
                two: form.payee_type === 2,
                three: form.payee_type === 3,
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
                  @blur="blurIsZoreNumber($event, 'payee_yongjinlv_two')"
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
                  @blur="blurIsZoreNumber($event, 'payee_yongjinlv_four')"
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
            </div>
            <div class="payee-type-other" style="margin-top: 10px; margin-bottom: 4px">
              <el-checkbox
                style="display: block; padding-top: 10px; position: absolute"
                v-model="form.payee_type_other"
                >其它
              </el-checkbox>
              <el-input
                style="
                  display: inline-block;
                  width: 636px;
                  top: 0px;
                  left: 55px;
                  position: absolute;
                "
                type="textarea"
                rows="2"
                maxlength="200"
                show-word-limit
                placeholder="请输入"
                :disabled="!form.payee_type_other"
                v-model="form.payee_remarkstr"
              />
            </div>

            <el-form-item class="one-item change-error" label="ROI要求" prop="payee_ROI_type">
              <el-radio-group
                class="nocheckbox"
                v-model="form.payee_ROI_type"
                style="line-height: 26px; height: 28px !important"
              >
                <label
                  ><el-radio
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
                        placeholder=""
                        :disabled="!(form.payee_ROI_type === 2)"
                      ></el-input>
                    </div>

                    <div
                      @click.stop.prevent="noChange()"
                      style="
                        display: inline-block;
                        line-height: 30px;
                        height: 30px !important;

                        font-size: 12px;
                        color: var(--text-third-color);
                        padding-left: 10px;
                        cursor: default !important;
                      "
                    >
                      服务费 : 保量销售额
                    </div></el-radio
                  ></label
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item class="one-item change-error" label="执行要求" prop="payee_execute_type">
              <el-radio-group
                v-model="form.payee_execute_type"
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
                  >先执行后付款</el-radio
                ><el-radio
                  :label="2"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >先付款后执行</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item class="one-item change-error" label="付款要求" prop="payee_request_type">
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
                  >分期付款</el-radio
                ><el-radio
                  :label="2"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >一次性付款</el-radio
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
              label="付款方式"
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
                    width: 160px;
                  "
                  >对公账户转账</el-radio
                ><el-radio
                  :label="2"
                  style="
                    line-height: 26px;
                    height: 28px !important;
                    margin-right: 0px;
                    width: 170px;
                  "
                  >支付宝转账</el-radio
                >
                <el-radio
                  :label="3"
                  style="line-height: 26px; height: 28px !important; width: 330px"
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
                <el-radio
                  :label="4"
                  style="line-height: 26px; height: 28px !important; margin-right: 0px"
                  >其它<el-input
                    style="
                      margin-left: 8px;
                      width: 154px;
                      line-height: 26px;
                      height: 28px !important;
                    "
                    v-model="form.payee_paymoney_type_other"
                    placeholder="请输入其它"
                    :disabled="!(form.payee_paymoney_type === 4)"
                  ></el-input
                ></el-radio>
              </el-radio-group>
            </el-form-item>
            <!--            <el-form-item
              v-if="form.payee_request_opencard_type !== 3"
              class="sub-item"
              label="开票内容"
              prop="content_type"
            >
              <el-select
                size="mini"
                v-model="form.content_type"
                placeholder="请优先选择信息技术服务"
                style="width: 254px; font-size: 12px"
                popper-class="el-select-popper-mini frame_contract_popper-custoner"
              >
                <el-option
                  v-for="item in bailingOutContent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>-->
            <el-form-item
              v-if="form.payee_request_opencard_type !== 3"
              class="sub-item"
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
                      width="500"
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
                maxlength="8"
                @input="getfixIntPositiveNumber($event, 'other_stamp_count')"
                style="width: 254px; line-height: 30px; height: 30px !important"
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
                style="width: 524px; line-height: 30px; height: 30px !important"
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
                  style="margin-top: 7px; width: 18px; display: inline-block; float: left"
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
                  style="margin-top: 7px; width: 18px; display: inline-block; float: left"
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
                style="min-height: 30px"
                v-if="
                  (form.payee_yongjinlv_three > 0 && form.payee_type === 3) ||
                  (form.payee_yongjinlv_one > 0 && form.payee_type === 2)
                "
                class="not-allowed"
              >
                <el-checkbox
                  style="margin-top: 7px; width: 18px; display: inline-block; float: left"
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
              <div class="trems" style="min-height: 30px; margin-left: 0px">
                <el-checkbox
                  class="not-allowed"
                  style="margin-top: 7px; width: 18px; display: inline-block; float: left"
                  v-model="checked2"
                  disabled
                ></el-checkbox>
                <div class="tremsline">
                  <span style="padding-left: 10px"
                    >因本协议引起的或与本协议有关的任何争议，双方可通过友好协商解决，协商不成的，任何一方可向</span
                  ><el-checkbox
                    v-model="form.contract_xieyi_yifang_type"
                    style="margin-right: 0px !important"
                    >甲方</el-checkbox
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
        <!-- <tg-button
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
<script src="./supplierAgreementDialog.ts"></script>

<style lang="less" scoped>
@import './agreement.less';
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
