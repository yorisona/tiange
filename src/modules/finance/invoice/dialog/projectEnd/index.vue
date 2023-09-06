<template>
  <div v-if="visible">
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new use-seal-apply-detail-dialog"
      width="970px"
      @close="emitClose"
    >
      <template #title> <span>项目终止审批详情</span> </template>
      <div class="detail-wrapper">
        <div class="left-wrapper">
          <div class="left-header">
            <div class="line left">
              <p class="label">申请人：</p>
              <div class="value">{{ baseData.username }}</div>
            </div>
            <div class="line right">
              <p class="label">申请部门：</p>
              <div class="value">{{ baseData.create_department }}</div>
            </div>
            <div class="line left">
              <p class="label">发起时间：</p>
              <div class="value">{{ baseData.gmt_create.replace(/-/g, '.') }}</div>
            </div>
            <div class="line right">
              <p class="label">审批编号：</p>
              <div class="value" style="flex-shrink: 0">{{ baseData.approval_uid }}</div>
              <span v-if="baseData.approval_status === 1" class="status" style="flex-shrink: 0"
                >审批中</span
              >
              <span
                v-else-if="baseData.approval_status === 2"
                class="status success"
                style="flex-shrink: 0"
                >审批通过</span
              >
              <span
                v-else-if="baseData.approval_status === 3"
                class="status error"
                style="flex-shrink: 0"
                >审批失败</span
              >
              <span v-else class="status revoke" style="flex-shrink: 0">已撤销</span>
            </div>
          </div>
          <div class="left-body">
            <div class="grid-two-column">
              <div class="line">
                <p class="label">执行结果：</p>
                <!-- <div class="value">
                  {{ baseData.cooperation_company_name }}
                </div> -->
                <div class="value">{{ endTypeStr() }}</div>
              </div>
              <div class="line">
                <p class="label">清算周期：</p>
                <div class="value">
                  {{
                    (baseData.approval_detail && `${baseData.approval_detail.cycle_month}个月`) ||
                    '--'
                  }}
                </div>
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">备注说明：</p>
              <div class="value line-value">
                {{
                  baseData.approval_detail &&
                  (baseData.approval_detail.remark ? baseData.approval_detail.remark : '--')
                }}
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">附件：</p>
              <div class="value line-value">
                <template
                  v-if="
                    baseData.approval_detail &&
                    baseData.approval_detail.attachment_urls &&
                    baseData.approval_detail.attachment_urls.length
                  "
                >
                  <Appendix :list="baseData.approval_detail.attachment_urls" />
                </template>
                <span v-else>--</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-wrapper">
          <h5 class="right-wrapper-title">审批进度</h5>
          <WorkbenchTimeLine
            :step-status="baseData.approval_status"
            :items="baseData.approval_flow_detail"
          />
        </div>
      </div>
      <template #footer>
        <tg-button type="default" @click="emitClose">取消</tg-button>
        <div class="div-default-btn" v-if="baseData.approval_status === 3" @click="reSubmit">
          重新编辑提交
        </div>
      </template>
    </el-dialog>
    <!--    <UseSealApply @success="onSuccess" ref="useSealApplyRef" />-->
  </div>
</template>
<script src="./index.ts"></script>

<style lang="less" scoped>
@import './index';
</style>
