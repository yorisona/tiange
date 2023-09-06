<template>
  <div class="tg-live-project-form-dialog">
    <el-drawer
      :title="formTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="tg-dialog-classic"
      :visible="visible"
      :wrapperClosable="false"
      @close="onCancelBtnClick"
    >
      <div class="tg-drawer-form-content">
        <el-form
          :model="ProjectForm"
          :rules="formRules"
          ref="formRef"
          label-position="top"
          size="mini"
          label-width="106px"
        >
          <head-lines style="margin: 10px 0px" title="项目信息" />
          <el-form-item label="项目名称" class="one-item" prop="project_name">
            <el-input
              placeholder="建议仅输入品牌名称"
              v-model="ProjectForm.project_name"
              maxlength="20"
              ref="autoFocuseRef"
            ></el-input>
          </el-form-item>
          <!-- 客户名称 -->
          <el-form-item v-if="isEditForm" label="公司名称" prop="company_id" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              value=""
              :disabled="isEditForm"
              :placeholder="ProjectForm.company_name ? ProjectForm.company_name : '--'"
            />
          </el-form-item>

          <el-form-item v-else label="公司名称" prop="company_id" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              v-model="ProjectForm.company_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入并选择公司名称"
              :remote-method="getAllCompanyName"
              @change="onCompanyChange"
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
            class="two-item-left"
          >
            <el-select
              popper-class="el-select-popper-mini"
              value=""
              :disabled="isEditForm"
              :placeholder="ProjectForm.shop_name ? ProjectForm.shop_name : '--'"
            >
            </el-select>
          </el-form-item>
          <el-form-item v-else label="店铺名称" prop="company_shop_id" class="two-item-left">
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
          <el-form-item label="品牌" class="two-item-left" prop="brand_id">
            <!-- <el-input disabled v-model="new_brand_name"></el-input> -->
            <el-select :disabled="isEditForm" v-model="ProjectForm.brand_id">
              <el-option
                v-for="item in brandList || []"
                :key="item.id"
                :label="item.brand_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item v-else label="品牌" class="two-item-left">
            <el-input disabled v-model="brand_name"></el-input>
          </el-form-item> -->
          <!-- <el-form-item v-if="isEditForm" label="店铺类目" class="two-item-left">
            <el-input disabled v-model="new_shop_cateogry_name"></el-input>
          </el-form-item>
          <el-form-item v-else label="店铺类目" class="two-item-left">
            <el-input disabled v-model="shop_cateogry_name"></el-input>
          </el-form-item> -->
          <!-- 业务类型 -->
          <el-form-item prop="business_type" label="业务类型" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              :disabled="isEditForm"
              class="select"
              v-model="ProjectForm.business_type"
              @change="onBusinessTypeChange"
              placeholder=""
            >
              <el-option :key="-1" label="请选择" :value="-1" />
              <el-option
                v-for="item in BusinessTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="cooperation_type" label="合作类型" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              :disabled="isEditForm"
              class="select"
              v-model="ProjectForm.cooperation_type"
              placeholder=""
            >
              <el-option label="请选择" :value="-1" />
              <el-option label="自营" :value="1" />
              <el-option label="区域" :value="2" />
            </el-select>
          </el-form-item>
          <!-- 直播间 -->
          <div
            v-if="ProjectForm.cooperation_type === CooperationTypeEnum.selfSupport"
            class="one-item"
            style="
              margin-top: -12px;
              margin-bottom: 18px;
              height: 90px;
              background: #f7f8f9;
              border-radius: 2px;
              padding: 18px;
            "
          >
            <el-form-item
              v-if="ProjectForm.cooperation_type === CooperationTypeEnum.selfSupport"
              label="直播间"
              prop="studio_id"
              style="width: 249px"
            >
              <el-select
                popper-class="el-select-popper-mini"
                class="select"
                v-model="ProjectForm.studio_id"
                filterable
                remote
                reserve-keyword
                :remote-method="getAllStudioName"
                @change="onStudioIdChange"
                placeholder="请选择直播间"
              >
                <el-option
                  v-for="(item, index) in allStudioName"
                  :key="index"
                  :label="item.studio_name"
                  :value="item.id"
                >
                  <span>{{ item.studio_name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ProjectForm.cooperation_type !== CooperationTypeEnum.selfSupport"
              label="直播间"
              style="width: 249px"
            >
              <el-select
                popper-class="el-select-popper-mini"
                disabled
                class="select"
                v-model="ProjectForm.studio_id"
                placeholder="请选择直播间"
              >
                <el-option value="">
                  <span></span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item prop="start_date" label="开始时间" class="two-item-left">
            <el-date-picker
              placeholder="开始时间"
              v-model="ProjectForm.start_date"
              type="date"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item prop="end_date" label="结束时间" class="two-item-left">
            <el-date-picker
              placeholder="结束时间"
              v-model="ProjectForm.end_date"
              type="date"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item prop="settlement_cycle_type" label="结算周期" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              class="select"
              v-model="ProjectForm.settlement_cycle_type"
              placeholder=""
            >
              <el-option label="请选择" :value="-1" />
              <el-option label="月结" :value="1" />
              <el-option label="季结" :value="2" />
              <el-option label="半年" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="!isFromLocalLife"
            prop="price_per_hour"
            label="小时报价"
            class="two-item-left"
          >
            <el-input
              maxlength="20"
              placeholder="请输入报价"
              v-model="ProjectForm.price_per_hour"
              @input="getPricePerHour"
              ><template slot="append">元/时</template></el-input
            >
          </el-form-item>
          <el-form-item
            v-if="is_douyin_self && !isFromLocalLife"
            prop="service_amount"
            label="服务费"
            class="two-item-left"
          >
            <el-input
              placeholder="请输入服务费"
              v-model="ProjectForm.service_amount"
              @input="getPriceServerAmount"
              maxlength="20"
              ><template slot="append">元</template></el-input
            >
          </el-form-item>
          <el-form-item
            v-if="!isFromLocalLife"
            prop="commission_rate"
            label="佣金比例"
            class="two-item-left"
          >
            <el-input
              placeholder="请输入佣金比例"
              @input="value => inputPositiveInteger(value, 'commission_rate')"
              v-model="ProjectForm.commission_rate"
              ><template slot="append">%</template></el-input
            >
          </el-form-item>
          <!-- 客户经理 -->
          <el-form-item prop="customer_manager_id" label="客户经理" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              filterable
              :disabled="ProjectForm.business_type === -1"
              placeholder="请输入并选择客户经理"
              v-model="ProjectForm.customer_manager_id"
              remote
              reserve-keyword
              clearable
              :remote-method="getAllCustomerName"
            >
              <el-option
                v-for="(item, index) in allCustomerName"
                :key="index"
                :label="item.username"
                :value="item.id"
              >
                <span>{{ item.username }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 项目经理 -->
          <el-form-item prop="project_manager_id" label="项目经理" class="two-item-left">
            <el-select
              popper-class="el-select-popper-mini"
              filterable
              :disabled="ProjectForm.business_type === -1"
              placeholder="请输入并选择项目经理"
              v-model="ProjectForm.project_manager_id"
              remote
              reserve-keyword
              clearable
              :remote-method="getAllManagerName"
            >
              <el-option
                v-for="(item, index) in allManagerName"
                :key="index"
                :label="item.username"
                :value="item.id"
              >
                <span>{{ item.username }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="two-item-left" label="项目所属部门" prop="feishu_department_id">
            <el-popover
              placement="bottom-start"
              trigger="click"
              width="262"
              popper-class="live-department-tree-popper-class el-tree-popper-mini"
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
                  ref="live_department_tree"
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
          <el-form-item label="归属主体" prop="company_subject" class="two-item-left">
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
          <el-form-item v-if="!isFromLocalLife" label="GMV统计" class="one-item" prop="is_gather">
            <div style="width: 100%">
              <el-radio-group v-model="ProjectForm.gmv_way" style="margin-top: -6px">
                <el-radio :label="1">指定账号订单</el-radio>
                <el-radio :label="2">指定账号订单+橱窗订单</el-radio>
                <el-radio :label="3">全店订单</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <!-- 淘宝直播账号绑定 -->
          <el-form-item
            v-if="
              !isFromLocalLife &&
              (ProjectForm.business_type === BusinessTypeEnum.taobao ||
                ProjectForm.business_type === BusinessTypeEnum.douyin ||
                ProjectForm.business_type === BusinessTypeEnum.taobaopick ||
                ProjectForm.business_type === BusinessTypeEnum.locallife ||
                ProjectForm.business_type === BusinessTypeEnum.supplyChain) &&
              ProjectForm.cooperation_type === 1 &&
              ProjectForm.gmv_way !== 3
            "
            label=""
            style="
              display: inline-block;
              width: 100%;
              margin-right: 0 !important;
              padding-right: 18px;
            "
            prop="taobaoLiveBindAccounts"
          >
            <label slot="label">
              <span
                >直播账号
                <el-popover offset="10" placement="top-end" trigger="hover">
                  <template
                    v-if="ProjectForm.business_type !== 3 && ProjectForm.business_type !== 7"
                  >
                    <div style="height: 100px" class="tbLiveAccountFormLabel">
                      <div style="float: left; width: 174px; height: 100px; float: left">
                        <img
                          style="width: 174px; height: 100px"
                          src="@/assets/img/live/live_account_tips.png"
                          alt=""
                        />
                      </div>
                      <p
                        style="
                          font-size: 14px;
                          font-weight: 400;
                          color: #6a7b92;
                          line-height: 20px;
                          float: left;
                          margin-left: 18px;
                          width: 209px;
                          height: 100px;
                        "
                      >
                        该ID用于将插件收集的直播数据和天鸽内的直播场次进行匹配。获取方式：如图，登录直播中控台后在个人账号信息处查看用户<br />
                        ID
                      </p>
                    </div>
                  </template>
                  <template v-else>
                    <img
                      style="width: 700px"
                      src="@/assets/img/live/live_account_douyin_tips.jpg"
                      alt=""
                    />
                  </template>

                  <i
                    slot="reference"
                    class="el-icon-question"
                    style="color: #c4cbd2; margin-right: 3px; cursor: pointer"
                  />
                </el-popover>
              </span>
            </label>
            <div class="tbLiveAccountFormItem">
              <div class="LiveAccountFormItem">
                <div class="live-div" v-for="(item, index) in taobaoLiveBindAccounts" :key="index">
                  <el-input
                    placeholder="请输入直播账号UID"
                    maxlength="20"
                    @input="value => getPositiveInteger(value)"
                    v-model.trim="item.account"
                  ></el-input>

                  <tg-icon
                    v-if="taobaoLiveBindAccounts.length > 1"
                    name="ico-btn-delete"
                    style="width: 16px; height: 16px; margin-top: 2px"
                    @click="DeleteAccountFormItemHandler(index)"
                  />
                </div>
              </div>
              <tg-button icon="ico-btn-add" type="primary" @click="AddAccountFormItemHandler"
                >添加</tg-button
              >
            </div>
          </el-form-item>

          <!-- 客户需求 -->
          <!-- <div class="tg-dialog-section-title"><span></span>客户需求</div>
          <el-form-item label="每月场次" class="two-item-left">
            <el-input
              maxlength="9"
              v-model="ProjectForm.live_num_per_month"
              placeholder="请输入每月场次数"

              @input="value => inputPositiveInteger(value, 'live_num_per_month')"
              ><template slot="append">场</template></el-input
            >
          </el-form-item>
          <el-form-item label="每场时长" class="two-item-left">
            <el-input
              maxlength="9"
              v-model="ProjectForm.duration_per_live"
              placeholder="请输入每场时长"
              @input="value => inputPositiveInteger(value, 'duration_per_live')"

              ><template slot="append">时</template></el-input
            >
          </el-form-item>
          <el-form-item label="月度时长" class="one-item">
            <el-input
              maxlength="9"
              v-model="ProjectForm.month_duration"
              placeholder="请输入月度时长"
              @input="value => inputPositiveInteger(value, 'month_duration')"

              ><template slot="append">时</template></el-input
            >
          </el-form-item>
          <el-form-item label="其他需求" class="one-item">
            <el-input
              v-model="ProjectForm.other_requirement"
              type="textarea"
              :rows="6"
              :maxlength="200"
              show-word-limit
              placeholder="请输入其他需求"
            />
          </el-form-item>
          <el-form-item label="备注" class="one-item">
            <el-input
              v-model="ProjectForm.remark"
              type="textarea"
              :rows="3"
              :maxlength="100"
              show-word-limit
              placeholder="请输入备注"
            />
          </el-form-item> -->
        </el-form>
        <div class="tg-drawer-footer">
          <tg-button @click="onCancelBtnClick">取消</tg-button>
          <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script src="./index.ts"></script>

<style lang="less">
@import './index.less';
</style>
