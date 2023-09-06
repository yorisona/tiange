<template>
  <div class="tg-dialog-vcenter">
    <el-dialog
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="696px"
      class="customer-dialog project-form-modal"
      @close="onCancelBtnClick"
    >
      <template #title>{{ formTitle }}</template>
      <div class="dialog-content">
        <el-form label-width="97px" :model="projectForm" :rules="formRules" ref="formRef">
          <!-- 项目信息 -->
          <div class="subject mgt-20 mgl-20 mgb-10">项目信息</div>
          <el-form-item label="项目名称：" style="display: inline-block" prop="project_name">
            <el-input
              placeholder="请输入项目名称"
              v-model="projectForm.project_name"
              size="medium"
              style="width: 240px"
            ></el-input>
          </el-form-item>
          <!-- 客户名称 -->
          <el-form-item label="客户名称：" prop="customer_id" style="display: inline-block">
            <el-select
              :disabled="isEditForm"
              v-model="projectForm.customer_id"
              filterable
              remote
              reserve-keyword
              placeholder="请搜索并选择客户名称"
              :remote-method="getAllStoreName"
              @change="onCustomerIdChange"
              size="medium"
              style="width: 240px"
            >
              <el-option
                v-for="(item, index) in allStoreName"
                :key="index"
                :label="item.shop_name"
                :value="item.id"
              >
                <span>{{ item.shop_name }}</span>
                <span style="color: var(--text-des-color)">{{
                  item.brand_name ? '(' + item.brand_name + ')' : '(' + '--' + ')'
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 业务类型 -->
          <el-form-item prop="business_type" label="业务类型：" style="display: inline-block">
            <el-select
              :disabled="isEditForm"
              class="select"
              v-model="projectForm.business_type"
              @change="onBusinessTypeChange"
              placeholder=""
              size="medium"
              style="width: 240px"
            >
              <el-option label="请选择" :value="-1" />
              <el-option
                v-for="item in BusinessTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌：" style="display: inline-block">
            <el-input disabled v-model="brand_name" size="medium" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="店铺类目：" style="display: inline-block">
            <el-input
              disabled
              v-model="shop_cateogry_name"
              size="medium"
              style="width: 240px"
            ></el-input>
          </el-form-item>
          <el-form-item prop="cooperation_type" label="合作类型：" style="display: inline-block">
            <el-select
              :disabled="isEditForm"
              class="select"
              v-model="projectForm.cooperation_type"
              placeholder=""
              size="medium"
              style="width: 240px"
            >
              <el-option label="请选择" :value="-1" />
              <el-option label="区域" :value="2" />
              <el-option label="自营" :value="1" />
            </el-select>
          </el-form-item>
          <!-- 直播间 -->
          <el-form-item
            v-if="projectForm.cooperation_type !== CooperationTypeEnum.selfSupport"
            label="直播间："
            style="display: inline-block"
          >
            <el-select
              class="select"
              disabled
              v-model="projectForm.studio_id"
              placeholder="请选择直播间"
              size="medium"
              style="width: 240px"
            >
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="projectForm.cooperation_type === CooperationTypeEnum.selfSupport"
            prop="studio_id"
            label="直播间："
            style="display: inline-block"
          >
            <el-select
              class="select"
              v-model="projectForm.studio_id"
              filterable
              remote
              reserve-keyword
              :remote-method="getAllStudioName"
              @change="onStudioIdChange"
              placeholder="请选择直播间"
              size="medium"
              style="width: 240px"
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
          <el-form-item prop="start_date" label="开始时间：" style="display: inline-block">
            <el-date-picker
              placeholder="开始时间"
              v-model="projectForm.start_date"
              type="date"
              size="small"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item prop="end_date" label="结束时间：" style="display: inline-block">
            <el-date-picker
              placeholder="结束时间"
              v-model="projectForm.end_date"
              type="date"
              size="small"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item
            prop="settlement_cycle_type"
            label="结算周期："
            style="display: inline-block"
          >
            <el-select
              class="select"
              v-model="projectForm.settlement_cycle_type"
              placeholder=""
              size="medium"
              style="width: 240px"
            >
              <el-option label="请选择" :value="-1" />
              <el-option label="月结" :value="1" />
              <el-option label="季结" :value="2" />
              <el-option label="半年" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item prop="price_per_hour" label="小时报价：" style="display: inline-block">
            <el-input
              maxlength="20"
              placeholder="请输入报价"
              v-model="projectForm.price_per_hour"
              @input="getPricePerHour"
              size="medium"
              style="width: 240px"
              ><template slot="append">元/时</template></el-input
            >
          </el-form-item>
          <el-form-item prop="commission_rate" label="佣金比例：" style="display: inline-block">
            <el-input
              placeholder="请输入佣金比例"
              @input="value => inputPositiveInteger(value, 'commission_rate')"
              v-model="projectForm.commission_rate"
              size="medium"
              style="width: 240px"
              ><template slot="append">%</template></el-input
            >
          </el-form-item>
          <!-- 客户经理 -->
          <el-form-item prop="customer_manager_id" label="客户经理：" style="display: inline-block">
            <el-select
              filterable
              placeholder="请输入客户经理"
              v-model="projectForm.customer_manager_id"
              size="medium"
              style="width: 240px"
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
          <el-form-item prop="project_manager_id" label="项目经理：" style="display: inline-block">
            <el-select
              filterable
              placeholder="请输入项目经理"
              v-model="projectForm.project_manager_id"
              size="medium"
              style="width: 240px"
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
          <!-- 淘宝直播账号绑定 -->
          <el-form-item
            v-if="
              projectForm.business_type === BusinessTypeEnum.taobao ||
              projectForm.business_type === BusinessTypeEnum.douyin
            "
            label=""
            style="display: inline-block; width: 100%"
          >
            <label slot="label">
              <span>
                直播账号
                <el-popover offset="10" placement="top-start" trigger="hover">
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
                  <i
                    slot="reference"
                    class="el-icon-question"
                    style="color: #c4cbd2; margin-right: 3px; cursor: pointer"
                  />
                </el-popover>
              </span>
            </label>
            <div class="tbLiveAccountFormItem">
              <el-input
                v-for="(item, index) in taobaoLiveBindAccounts"
                :key="index"
                placeholder="请输入直播账号UID"
                maxlength="20"
                :disabled="projectForm.business_type === BusinessTypeEnum.douyin"
                @input="value => getPositiveInteger(value)"
                v-model.trim="item.account"
              ></el-input>
            </div>
          </el-form-item>

          <!-- 客户需求 -->
          <div style="margin-top: 4px" class="subject mgl-20 mgb-10">客户需求</div>
          <el-form-item label="每月场次：" style="display: inline-block">
            <el-input
              maxlength="9"
              v-model="projectForm.live_num_per_month"
              placeholder="请输入每月场次数"
              size="medium"
              @input="value => inputPositiveInteger(value, 'live_num_per_month')"
              style="width: 240px"
              ><template slot="append">场</template></el-input
            >
          </el-form-item>
          <el-form-item label="每场时长：" style="display: inline-block">
            <el-input
              maxlength="9"
              v-model="projectForm.duration_per_live"
              placeholder="请输入每场时长"
              @input="value => inputPositiveInteger(value, 'duration_per_live')"
              size="medium"
              style="width: 240px"
              ><template slot="append">时</template></el-input
            >
          </el-form-item>
          <el-form-item label="月度时长：" style="display: inline-block; width: 100%">
            <el-input
              maxlength="9"
              v-model="projectForm.month_duration"
              placeholder="请输入月度时长"
              @input="value => inputPositiveInteger(value, 'month_duration')"
              size="medium"
              style="width: 240px"
              ><template slot="append">时</template></el-input
            >
          </el-form-item>
          <el-form-item label="其他需求：" style="width: 100%">
            <el-input
              v-model="projectForm.other_requirement"
              type="textarea"
              :rows="6"
              :maxlength="200"
              style="width: 578px"
              show-word-limit
              placeholder="请输入其他需求"
            />
          </el-form-item>
          <el-form-item label="备注：" style="width: 100%; margin-bottom: 30px">
            <el-input
              v-model="projectForm.remark"
              type="textarea"
              :rows="3"
              :maxlength="100"
              style="width: 578px"
              show-word-limit
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <tg-button @click="onCancelBtnClick">取消</tg-button>
        <tg-button type="primary" @click="onSaveBtnClick">保存</tg-button>
      </template>
    </el-dialog>
    <tg-mask-loading :visible="saveLoading" content="正在提交数据，请稍候..." />
  </div>
</template>

<script src="./project.form.ts"></script>

<style lang="less">
@import '../project.form.less';
</style>
