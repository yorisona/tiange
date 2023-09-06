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
      <template #title> <span>非合同用印申请</span> </template>
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
                <p class="label">合作方公司全称：</p>
                <!-- <div class="value">
                  {{ baseData.cooperation_company_name }}
                </div> -->
                <tg-textPopover
                  :text="baseData.cooperation_company_name"
                  textClass="value"
                  :maxWidth="158"
                />
              </div>
              <div class="line">
                <p class="label">公司名称：</p>
                <!-- <div class="value">{{ company_name(baseData) }}</div> -->
                <tg-textPopover :text="company_name(baseData)" textClass="value" :maxWidth="158" />
              </div>
              <div class="line">
                <p class="label">印章名称：</p>
                <div class="value">{{ seal_name(baseData) }}</div>
              </div>
              <div class="line">
                <p class="label">涉及金额：</p>
                <div class="value">{{ amount(baseData) }}</div>
              </div>
              <div class="line">
                <p class="label">是否需要外带：</p>
                <div class="value">{{ baseData.is_take_out ? '是' : '否' }}</div>
              </div>
              <div v-if="baseData.is_take_out" class="line">
                <p class="label">外带时间：</p>
                <div class="value">{{ task_out_date_str(baseData) }}</div>
              </div>
              <div class="line">
                <p class="label">所属事项：</p>
                <div class="value">{{ matter_name(baseData) }}</div>
              </div>
              <div v-if="baseData.matter_type === 2" class="line">
                <p class="label">业务类型：</p>
                <div class="value">{{ business_type_name(baseData) }}</div>
              </div>
              <div class="line">
                <p class="label">文件名称：</p>
                <!-- <div class="value">{{ baseData.file_name }}</div> -->
                <tg-textPopover :text="baseData.file_name" textClass="value" :maxWidth="158" />
              </div>
              <div class="line">
                <p class="label">盖章份数：</p>
                <div class="value">{{ baseData.file_number }}</div>
              </div>
              <div class="line" style="height: auto" v-if="baseData.matter_name === '结算单用印'">
                <p class="label">是否邮寄：</p>
                <div class="value line-value">
                  {{ baseData.is_express ? '是' : '否' }}
                </div>
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">使用原因说明：</p>
              <div class="value line-value">
                {{ baseData.reason ? baseData.reason : '--' }}
              </div>
            </div>
            <template v-if="baseData.is_express && baseData.matter_name !== '结算单用印'">
              <div class="line" style="height: auto">
                <p class="label">邮寄信息：</p>
                <div class="value line-value">
                  <div>
                    {{
                      (baseData.addressee ? baseData.addressee : '--') +
                      '&nbsp;&nbsp;' +
                      (baseData.phone ? baseData.phone : '--')
                    }}
                  </div>
                  <div>
                    {{ baseData.address ? baseData.address : '--' }}
                  </div>
                </div>
              </div>
              <div class="line" style="height: auto">
                <p class="label">寄件人/商务处理人：</p>
                <div class="value line-value">
                  {{ baseData.sender_name ? baseData.sender_name : '--' }}
                </div>
              </div>
            </template>
            <div class="line" style="height: auto">
              <p class="label">附件：</p>
              <div class="value line-value">
                <template v-if="baseData.attachment && baseData.attachment.length">
                  <Appendix :list="baseData.attachment" />
                </template>
                <span v-else>--</span>
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label" style="margin-top: 6px">用印扫描附件：</p>
              <div class="value line-value">
                <template>
                  <div
                    class="upload-box"
                    v-if="baseData.approval_status === 2 && baseData.scan_status !== 2"
                  >
                    <tg-upload
                      :disabled="(baseData.scan.length || 0) >= 10"
                      action="/api/approval/upload_approval_attachment"
                      :beforeUpload="beforeUpload"
                      :success="scanSuccessHandle"
                      :show-file-list="false"
                    >
                      <tg-button
                        :disabled="(baseData.scan.length || 0) >= 10"
                        size="medium"
                        icon="ico-btn-upload"
                      >
                        上传附件
                      </tg-button>
                    </tg-upload>
                  </div>
                  <span v-else-if="baseData.scan && baseData.scan.length">--</span>
                  <div class="file-list-box mgt-12">
                    <!-- <upload-file-list v-model="baseData.scan" /> -->
                    <Appendix
                      :list="baseData.scan"
                      :isDelete="
                        baseData.approval_status === 2 && baseData.scan_status !== 2 ? true : false
                      "
                      @deleteItem="deleteItem"
                    />
                  </div>
                </template>
                <!-- <span v-else>--</span> -->
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
    <UseSealApply @success="onSuccess" ref="useSealApplyRef" />
  </div>
</template>
<script src="./index.ts"></script>

<style lang="less" scoped>
@import './index';
</style>
