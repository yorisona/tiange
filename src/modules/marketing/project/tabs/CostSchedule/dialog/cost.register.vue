<!--
 * @Brief: 营销业务 - 项目详情 - 成本安排表 - 登记成本
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-04-24 15:38:53
-->

<template>
  <el-drawer
    title="登记成本"
    :visible="visible"
    class="cost-register-drawer"
    :wrapperClosable="false"
    @close="close"
  >
    <div class="cost-register-drawer-body">
      <div class="cost-register-drawer-content">
        <!-- 客户信息 -->
        <DrawerHeader title="客户信息"></DrawerHeader>
        <DrawerCustomer
          class="cost-register-customer-info"
          :customerName="project ? project.shop_name : '--'"
          :customerManager="project ? project.manager_name : '--'"
          :companyName="project ? project.company_name : '--'"
        ></DrawerCustomer>
        <!-- 成本信息 -->
        <DrawerHeader style="margin-bottom: 6px" title="成本信息"></DrawerHeader>
        <el-form :model="form" size="mini" label-position="top" ref="ruleForm">
          <div v-for="(costInfo, index) in form.data" :key="index" class="cost-register-info">
            <!-- 标题 -->
            <div class="cost-register-info-header">
              <span>成本信息</span>
              <tg-button type="link" @click="copyCost(costInfo, index)">复制</tg-button>
              <tg-button
                v-if="form.data.length > 1"
                class="cost-register-close"
                type="link"
                @click="deleteCost(index)"
              >
                <tg-icon name="ico-cross"></tg-icon>
                <tg-icon name="ico-cross-red"></tg-icon>
              </tg-button>
            </div>
            <!-- 表单部分 -->
            <!-- 关联业绩 -->
            <el-form-item label="关联业绩" class="required">
              <div class="drawer-item-radio-container">
                <el-radio-group v-model="costInfo.cost_type">
                  <el-radio :label="1">关联业绩</el-radio>
                  <el-radio :label="2">借款</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>

            <!-- 关联业绩 -->
            <el-form-item
              class="drawer-item-bg"
              v-if="costInfo.cost_type === 1"
              label="收款编号"
              :prop="'data.' + index + '.achievement_uid'"
              :rules="{ required: true, message: '请选择关联业绩', trigger: ['change'] }"
            >
              <el-select
                v-model="costInfo.achievement_uid"
                clearable
                filterable
                reserve-keyword
                placeholder="请输入并选择收款编号"
              >
                <el-option
                  v-for="(ach, i) in achievementList"
                  :key="i"
                  :value="ach.achievement_uid"
                  :label="ach.achievement_uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 借款 -->
            <el-form-item
              class="drawer-item-bg"
              v-if="costInfo.cost_type === 2"
              :prop="'data.' + index + '.borrowing_uid'"
              :rules="{ required: true, message: '关联垫款审批编号', trigger: ['change'] }"
            >
              <template #label>
                关联垫款审批单号
                <el-popover
                  v-if="costInfo.cost_type === 2"
                  placement="top"
                  trigger="hover"
                  effect="light"
                  content="借款要先提交借款审批，审批通过后再关联成本安排"
                >
                  <template slot="reference">
                    <tg-icon name="ico-question" style="cursor: pointer; color: #c4cbd2"></tg-icon>
                  </template>
                </el-popover>
              </template>
              <el-select
                v-model="costInfo.borrowing_uid"
                clearable
                filterable
                reserve-keyword
                placeholder="请输入并选择关联垫款审批编号"
              >
                <el-option
                  v-for="(borrowApproval, i) in borrowApprovalList"
                  :key="i"
                  :value="borrowApproval.approval_uid"
                  :label="borrowApproval.approval_uid"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 供应商合同 -->
            <el-form-item label="供应商合同" class="required">
              <div class="drawer-item-radio-container">
                <el-radio-group v-model="costInfo.has_contract">
                  <el-radio :label="1">有合同</el-radio>
                  <el-radio :label="2">无合同</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>

            <!-- 合同编号 -->
            <el-form-item
              v-model="costInfo.contract_id"
              v-if="costInfo.has_contract === 1"
              class="drawer-item-bg"
              label="合同编号"
              :prop="'data.' + index + '.contract_id'"
              :rules="{ required: true, message: '请选择关联供应商合同', trigger: ['change'] }"
            >
              <el-select
                v-model="costInfo.contract_id"
                clearable
                filterable
                reserve-keyword
                placeholder="请输入并选择合同编号"
              >
                <el-option
                  v-for="(contract, i) in contractList"
                  :key="i"
                  :value="contract.contract_id"
                  :label="contract.contract_uid"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- KOL名称 -->
            <el-form-item
              class="drawer-item-kol"
              label="KOL名称"
              :prop="'data.' + index + '.kol_id'"
              :rules="{ required: true, message: '请选择KOL', trigger: ['change'] }"
            >
              <el-select
                v-model="costInfo.kol_id"
                clearable
                filterable
                placeholder="请输入并选择KOL名称"
                popper-class="tg-cost-register-popover-260"
                @change="kolChanged($event, index)"
              >
                <el-option
                  v-for="(kol, index) in kolList"
                  :key="index"
                  :value="kol.kol_id"
                  :label="kol.kol_name"
                >
                </el-option>
              </el-select>
              <!--              <div class="drawer-item-radio-container">-->
              <!--                <el-radio-group v-model="costInfo.is_personal">-->
              <!--                  <el-radio :label="2">机构</el-radio>-->
              <!--                  <el-radio :label="1">个人</el-radio>-->
              <!--                </el-radio-group>-->
              <!--              </div>-->
            </el-form-item>

            <!-- 机构名称 -->
            <el-form-item
              v-if="costInfo.is_personal === 2"
              class="drawer-item-bg"
              label="机构名称"
              :prop="'data.' + index + '.company_id'"
              :rules="{ required: true, message: '请选择机构名称', trigger: ['change'] }"
            >
              <el-select
                :disabled="!costInfo.kol_id"
                v-model="costInfo.company_name"
                clearable
                filterable
                reserve-keyword
                placeholder="请输入并选择机构名称"
                @change="companyChanged($event, index)"
              >
                <el-option
                  v-for="com in costInfo.company_list"
                  :key="com.company_id"
                  :value="com.company_id"
                  :label="com.company_name"
                  :disabled="com.disabled"
                >
                </el-option>
              </el-select>
              <div class="company-kol-desc">
                请先选择KOL再选择所属机构，需要先给KOL关联机构信息
                <tg-button type="link" @click="goToConbination(index)">去关联</tg-button
                >，关联后点击
                <tg-button type="link" @click="companyRefresh(index)">刷新</tg-button>
              </div>
            </el-form-item>

            <!-- 业务执行日期 -->
            <el-form-item class="required">
              <template #label>
                业务执行日期
                <el-popover
                  placement="top"
                  trigger="hover"
                  effect="light"
                  content="kol开播的时间段"
                >
                  <template slot="reference">
                    <tg-icon name="ico-question" style="cursor: pointer; color: #c4cbd2"></tg-icon>
                    <!-- <i class="el-icon-question" style="cursor: pointer"></i> -->
                  </template>
                </el-popover>
              </template>
              <el-date-picker
                :clearable="false"
                v-model="costInfo.live_dates"
                type="daterange"
                :editable="false"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                @change="liveDateChanged($event, index)"
              >
              </el-date-picker>
            </el-form-item>

            <!-- 打款日期 -->
            <el-form-item label="打款日期">
              <el-date-picker
                v-model="costInfo.transfer_date"
                type="date"
                :editable="false"
                placeholder="请选择打款日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>

            <!-- 打款金额 -->
            <el-form-item
              label="打款金额"
              :prop="'data.' + index + '.pay_amount'"
              :rules="{
                required: true,
                validator: (rule, val, callback) => {
                  if (val === '' || val === undefined) {
                    callback(new Error('请输入打款金额'));
                  } else if (Number(val) === 0) {
                    callback(new Error('费用金额必须大于0'));
                  } else {
                    callback();
                  }
                },
                trigger: ['blur'],
              }"
            >
              <!-- :rules="{ required: true, message: '请输入打款金额', trigger: ['blur'] }" -->
              <el-input
                :clearable="true"
                v-model="costInfo.pay_amount"
                placeholder="请输入打款金额"
                @input="moneyChange($event, index)"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>

            <!-- 打款方式 -->
            <el-form-item label="打款方式" class="required">
              <div class="drawer-item-radio-container">
                <el-radio-group v-model="costInfo.pay_way" @change="payWayChanged($event, index)">
                  <el-radio :label="1">银行卡</el-radio>
                  <el-radio :label="2">V任务</el-radio>
                  <el-radio :label="3">对公银行</el-radio>
                  <el-radio :label="4">支付宝</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <!-- V任务 显示 -->
            <div v-if="costInfo.pay_way === 2" class="drawer-item-bg">
              <div v-for="(task, i) in costInfo.v_task_list" :key="i" class="v-task-bg">
                <el-form-item
                  label="V任务链接"
                  :prop="'data.' + index + '.v_task_list.' + i + '.v_task_url'"
                  :rules="{ required: true, message: '请输入V任务链接', trigger: ['blur'] }"
                >
                  <el-input
                    :clearable="true"
                    v-model="task.v_task_url"
                    placeholder="请输入V任务链接"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="产品链接"
                  :prop="'data.' + index + '.v_task_list.' + i + '.item_url'"
                  :rules="{ required: true, message: '请输入产品链接', trigger: ['blur'] }"
                >
                  <el-input
                    :clearable="true"
                    v-model="task.item_url"
                    placeholder="请输入产品链接"
                  ></el-input>
                </el-form-item>
                <tg-button
                  v-if="i > 0"
                  class="cost-register-close"
                  type="link"
                  @click="delVTask(index, i)"
                >
                  <tg-icon name="ico-cross"></tg-icon>
                  <tg-icon name="ico-cross-red"></tg-icon>
                </tg-button>
              </div>
              <tg-button class="drawer-item-add" type="link" @click="addVTask(index)">
                <tg-icon name="ico-btn-add"></tg-icon>
                点击添加
              </tg-button>
            </div>
            <!-- 对公银行/支付宝 显示 -->
            <el-form-item
              v-if="costInfo.pay_way > 2"
              class="drawer-item-bg"
              :prop="'data.' + index + '.approval_id'"
              :rules="{ required: true, message: '请关联用款审批编号', trigger: ['change'] }"
            >
              <template #label>
                关联用款审批编号
                <el-popover
                  placement="top"
                  trigger="hover"
                  effect="light"
                  content="对公银行或支付宝打款要先提交用款审批，审批通过后再在此关联"
                >
                  <template slot="reference">
                    <tg-icon name="ico-question" style="cursor: pointer; color: #c4cbd2"></tg-icon>
                    <!-- <i class="el-icon-question" style="cursor: pointer"></i> -->
                  </template>
                </el-popover>
              </template>
              <el-select
                v-model="costInfo.approval_id"
                clearable
                filterable
                reserve-keyword
                placeholder="请输入并选择用款审批编号"
              >
                <div v-if="costInfo.pay_way === 3">
                  <el-option
                    v-for="(useApproval, i) in dgyhApprovalList"
                    :key="i"
                    :value="useApproval.id"
                    :label="useApproval.approval_uid"
                  >
                  </el-option>
                </div>
                <div v-if="costInfo.pay_way === 4">
                  <el-option
                    v-for="(useApproval, i) in zfbApprovalList"
                    :key="i"
                    :value="useApproval.id"
                    :label="useApproval.approval_uid"
                  >
                  </el-option>
                </div>
              </el-select>
            </el-form-item>

            <!-- 打款账户 -->
            <el-form-item class="required">
              <template #label>
                <span>
                  打款账户
                  <el-popover placement="top-start" trigger="hover">
                    <div>
                      <p style="font-size: 13px; font-weight: 600; line-height: 20px">时光机：</p>
                      <p style="font-size: 12px; line-height: 20px">
                        支付宝名称：嘉兴市经开城南时光机营销策划工作室
                      </p>
                      <p style="font-size: 12px; line-height: 20px">账户：gmrenwupaifa@163.com</p>
                      <p style="font-size: 12px; line-height: 20px">淘宝会员名：GM任务派发</p>
                      <p
                        style="
                          font-size: 13px;
                          font-weight: 600;
                          margin-top: 10px;
                          line-height: 20px;
                        "
                      >
                        玥每映像：
                      </p>
                      <p style="font-size: 12px; line-height: 20px">
                        支付宝名称：嘉兴玥每映像文化传媒有限公司
                      </p>
                      <p style="font-size: 12px; line-height: 20px">账户： yuemeiyx@126.com</p>
                      <p
                        style="
                          font-size: 13px;
                          font-weight: 600;
                          margin-top: 10px;
                          line-height: 20px;
                        "
                      >
                        构美子账户：
                      </p>
                      <p style="font-size: 12px; line-height: 20px">
                        支付宝名称：嘉兴构美信息技术有限公司-子公司
                      </p>
                      <p style="font-size: 12px; line-height: 20px">账户： gmcwzy@126.com</p>
                    </div>
                    <!-- <i class="el-icon-question" style="cursor: pointer"></i> -->
                    <template slot="reference">
                      <tg-icon
                        name="ico-question"
                        style="cursor: pointer; color: #c4cbd2"
                      ></tg-icon>
                    </template>
                  </el-popover>
                </span>
              </template>
              <div class="drawer-item-radio-container">
                <el-radio-group v-model="costInfo.pay_account">
                  <el-radio :label="1">时光机</el-radio>
                  <el-radio :label="2">玥美映像</el-radio>
                  <el-radio :label="3">构美子账户</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item label="备注">
              <el-input
                type="textarea"
                placeholder="请输入备注"
                v-model="costInfo.note"
                maxlength="100"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <tg-button
          style="margin: 0 30px 0 30px"
          class="drawer-item-add"
          type="link"
          @click="addCost"
        >
          <tg-icon name="ico-btn-add"></tg-icon>
          点击添加
        </tg-button>
      </div>
      <div class="cost-register-drawer-footer">
        <tg-button size="small" @click="close">取消</tg-button>
        <tg-button size="small" type="primary" @click="save">保存</tg-button>
      </div>
    </div>
    <tg-mask-loading :visible="saveLoading" content="  正在删除，请稍候..." />
  </el-drawer>
</template>

<script src="./cost.register.ts"></script>

<style lang="less">
@import './cost.register.less';
</style>
