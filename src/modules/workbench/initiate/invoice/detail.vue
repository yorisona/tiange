<template>
  <el-drawer
    title="开票申请详情"
    :visible="visible"
    height="100vh"
    size="612"
    :wrapperClosable="false"
    @close="close"
  >
    <div v-loading="loading" v-if="loading" style="height: 420px"></div>
    <div class="invoice-dialog-content" v-if="detail">
      <div class="main">
        <div class="invoice-info-header">
          <div class="invoice-info-header-list">
            <div class="invoice-info-header-item">
              <span>申请人:</span>
              <span>{{ detail.username }}</span>
            </div>
            <div class="invoice-info-header-item">
              <span>申请部门:</span>
              <span>{{ detail.create_department }}</span>
            </div>
            <div class="invoice-info-header-item">
              <span>发起时间:</span>
              <span>{{ detail.gmt_create }}</span>
            </div>
          </div>
          <a @click="exportPdf(detail.approval_id)">下载PDF</a>
        </div>
        <div class="invoice-info-body">
          <div class="invoice-info-uid">
            <span class="uid">审批编号：{{ detail.approval_uid }}</span>
            <div class="invoice-tag" :data-text="ApprovalStatusText">{{ ApprovalStatusText }}</div>
          </div>
          <div class="invoice-info-base base-grid">
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">开票类型：</div>
              <div class="base-grid-item-content">{{ 发票类型 }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">关联客户合同：</div>
              <div class="base-grid-item-content">
                <a @click="jumpContract">{{ detail.contract_uid }}</a>
              </div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">开票金额：</div>
              <div class="base-grid-item-content">{{ 开票金额 }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">关联业绩：</div>
              <div class="base-grid-item-content">
                <a @click="jumpAchievement">{{ detail.achievement_uid }}</a>
              </div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">款项是否收到：</div>
              <div class="base-grid-item-content">{{ 款项是否收到 }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">{{ 收款时间标签 }}</div>
              <div class="base-grid-item-content">{{ 收款时间 }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">发票寄送方式：</div>
              <div class="base-grid-item-content">{{ 发票寄送方式 }}</div>
            </div>
          </div>
          <el-divider style="margin: 17px 0" />
          <div class="invoice-info-title">开票信息</div>
          <div class="invoice-info-base base-grid" style="margin-top: 12px">
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">公司名称：</div>
              <div class="base-grid-item-content line-clamp-1">
                {{ detail.collecting_company || '--' }}
              </div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">纳税人识别号：</div>
              <div class="base-grid-item-content">{{ detail.tax_number || '--' }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">地址：</div>
              <div class="base-grid-item-content">{{ detail.address || '--' }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">电话：</div>
              <div class="base-grid-item-content">{{ detail.phone || '--' }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">开户行：</div>
              <div class="base-grid-item-content">{{ detail.bank_of_deposit || '--' }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">账号：</div>
              <div class="base-grid-item-content">{{ detail.bank_card_number || '--' }}</div>
            </div>
            <div class="base-grid-item">
              <div class="base-grid-item-lbl">备注：</div>
              <div class="base-grid-item-content">{{ detail.remark || '--' }}</div>
            </div>
          </div>
        </div>
      </div>
      <el-divider style="margin: 17px 0" />
      <div class="flow" style="padding-top: 12px">
        <div class="invoice-info-title">审批流程</div>
        <tg-steps direction="vertical" :steps="steps" :active="activeNumber" />
      </div>
    </div>
  </el-drawer>
</template>

<script src="./detail.ts"></script>

<style lang="less">
@import './detail.less';
</style>
