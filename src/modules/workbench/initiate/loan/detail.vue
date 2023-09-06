<template>
  <el-dialog
    class="customer-dialog loan-detail-dialog el-dialog-center-rewrite"
    :isAppendToBody="true"
    :visible="visible"
    width="800px"
    :isfooter="true"
    @close="emitClose"
    v-if="approval !== undefined"
  >
    <template #title><span>用款申请详情</span></template>
    <template v-if="approval !== undefined">
      <div class="container-max">
        <div class="main">
          <div class="main-header">
            <div class="from-header-box">
              <div class="from-header">
                <span>申请人：</span>
                <span>{{ approval.username }}</span>
              </div>
              <div class="from-header">
                <span>申请部门：</span>
                <span>{{ approval.create_department }}</span>
              </div>
              <div class="from-header">
                <span>发起时间：</span>
                <span>{{ approval.gmt_create }}</span>
              </div>
              <span class="left_icon">
                <div class="apply-click" v-if="revocationVisiable" @click="again">
                  <span>
                    <img src="@/assets/img/workbench/toresubmit_icon@2x.png" />
                  </span>
                  <span class="hover-red">再次提交</span>
                </div>
                <div class="apply-click" @click="exportPdf">
                  <span>
                    <img src="@/assets/img/workbench/download_pdf_icon@2x.png" />
                  </span>
                  <span>下载PDF</span>
                </div>
              </span>
            </div>
            <div class="title-right article">
              <span style="font-size: 16px; color: var(--text-color); font-weight: 600"
                >审批编号：</span
              >
              <span style="color: var(--text-color); font-weight: 600; font-size: 16px">{{
                approval.approval_uid
              }}</span>
              <span :class="`status-color ${'status-color-' + approval.approval_status}`">
                <span class="approver-state" v-if="approval.approval_status === 1">审批中</span>
                <span class="approver-state" v-if="approval.approval_status === 2">审批成功</span>
                <span class="approver-state" v-if="approval.approval_status === 3">审批失败</span>
                <span class="approver-state" v-if="approval.approval_status === 4">已撤销</span>
              </span>
            </div>
          </div>
          <div class="main-middle">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="from-middle-first">
                  <span class="color-9">用款类型：</span>
                  <span v-if="approval.level_two_types === 1">成本安排</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <span class="color-9">店铺名称：</span>
                  <span>{{ approval.collecting_shop_name }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="from-middle-first">
                  <span class="color-9">用款总额（元）：</span>
                  <span style="font-weight: 600; color: #ff731e">{{
                    '￥' + approval.transfer_amount_str
                  }}</span>
                </div>
              </el-col>
            </el-row>
            <!-- [收款方式: 3--对公银行] -->
            <template v-if="approval.level_three_types === 3">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">用款日期：</span>
                    <span>{{ approval.transfer_date }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">收款方式：</span>
                    <span>对公银行</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">银行卡号：</span>
                    <span>{{ approval.bank_card_number }}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">开户行：</span>
                    <span>{{ approval.bank_of_deposit }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">公司名称：</span>
                    <span>{{ approval.collecting_company }}</span>
                  </div>
                </el-col>
              </el-row>
            </template>
            <!-- [收款方式: 4---对公支付宝] -->
            <template v-if="approval.level_three_types === 4">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="from-middle-first">
                    <span class="color-9">用款日期：</span>
                    <span>{{ approval.transfer_date }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">收款方式：</span>
                    <span>对公支付宝</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <span class="color-9">收款人：</span>
                    <span>{{ approval.collecting_person }}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>
                    <span class="color-9">支付宝账号：</span>
                    <span>{{ approval.alipay_account }}</span>
                  </div>
                </el-col>
              </el-row>
            </template>
            <el-row :gutter="20">
              <el-col :span="24">
                <div class="pay-reasons">
                  <span class="color-9">付款事由：</span>
                  <span>{{ approval.pay_reason ? approval.pay_reason : '--' }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="pay-reasons">
                  <span class="color-9">备注：</span>
                  <span>{{ approval.remark ? approval.remark : '--' }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="detailed-container article" v-if="approval.business_type || approval.cost_type">
          <div class="detailed-header">
            <div class="title" style="width: auto">用款明细</div>
            <template v-if="approval.business_type">
              <span class="label">业务类型：</span>
              <span class="text">{{ approval.business_type | filter_business_type }}</span>
            </template>
            <template v-if="approval.cost_type">
              <span class="label">成本类型：</span>
              <div class="text">{{ approval.cost_type | filter_cost_type }}</div>
            </template>
          </div>
          <div class="detailed-content" v-if="approval.cost && approval.cost.length > 0">
            <div class="detailed" v-for="(item, key) in approval.cost" :key="key">
              <div class="block">
                <div class="label">所属项目{{ key + 1 }}：</div>
                <div class="text">{{ item.project_uid }}</div>
              </div>
              <div class="block">
                <div class="label">项目费用{{ key + 1 }}：</div>
                <div class="text price">{{ item.price | filter_price }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flow article">
          <el-form>
            <el-form-item label="审批进度：" label-width="80px">
              <ApprovalFlow style="padding-top: 14px" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <template #footer>
      <tg-button v-if="canICancel" @click="revocation">撤销</tg-button>
      <tg-button v-if="canIAudit" type="primary" @click="refuse">拒绝</tg-button>
      <tg-button v-if="canIAudit" type="primary" @click="agree">同意</tg-button>
      <el-dialog
        :visible="approvalDialogVisible"
        class="userinfo-customer-dialog"
        width="460px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="approvalDialogVisible = false"
        :modal="false"
      >
        <template #title>
          <div class="userinfo-customer-dialog-header">拒绝理由</div>
        </template>
        <div class="approval-content">
          <p style="text-align: left; color: var(--text-color); margin-bottom: 10px">填写理由：</p>
          <el-input
            type="textarea"
            :rows="3"
            :maxlength="30"
            placeholder="请输入不超过30个字符"
            style="width: 100%"
            v-model="remark"
          />
        </div>
        <template #footer>
          <div class="userinfo-customer-dialog-footer">
            <tg-button @click="approvalDialogVisible = false">取消</tg-button>
            <tg-button type="primary" @click="handleApprovalSubmitClick">保存</tg-button>
          </div>
        </template>
      </el-dialog>
    </template>
  </el-dialog>
</template>

<script src="./detail.tsx"></script>

<style lang="less">
@import './detail.less';
</style>

<style lang="less" scoped>
.container-max {
  max-height: 600px;
}
.loan-detail-dialog {
  .article {
    border-radius: 2px;
    margin-bottom: 10px;
    padding: 18px 20px 20px 20px;
    background: #ffffff;

    /deep/ .el-form-item__label {
      font-weight: 600;
    }
  }

  .detailed-container {
    line-height: 1;

    .detailed-header {
      display: flex;

      .title {
        color: var(--text-color);
        font-weight: 600;
        margin-right: 10px;
        padding-right: 20px;
        width: 60px;
      }

      .label {
        color: var(--text-des-color);
      }

      .text {
        color: #666666;
        margin-right: 20px;
      }
    }

    .detailed-content {
      margin-left: 80px;
      background: #f6f6f6;
      padding: 10px 20px;
      margin-top: 15px;

      .detailed {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }

        .block {
          flex: 1 1 0;
          display: flex;
        }

        .price {
          color: #ff731e;
        }
      }
    }
  }

  .pay-reasons {
    display: grid;
    grid-template-columns: auto 1fr;
    line-height: 1.3;
  }
}
</style>
