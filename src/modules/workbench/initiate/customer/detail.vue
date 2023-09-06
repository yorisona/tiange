<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible="visible"
      :isAppendToBody="true"
      :isfooter="true"
      class="customer-dialog tg-dialog-vcenter-new advance-detail-dialog customer-detail-dialog"
      width="948px"
      @close="emitClose"
    >
      <template #title>
        <span>{{ info.approval_type === 9 ? '客户' : '供应商' }}结算单审批</span>
      </template>
      <div class="detail-wrapper">
        <div class="left-wrapper">
          <div class="left-header">
            <div class="line left">
              <p class="label">申请人：</p>
              <div class="value">{{ info.username }}</div>
            </div>
            <div class="line right">
              <p class="label">申请部门：</p>
              <div class="value">{{ info.create_department }}</div>
            </div>
            <div class="line left">
              <p class="label">发起时间：</p>
              <div class="value">{{ info.gmt_create.replace(/-/g, '.') }}</div>
            </div>
            <div class="line right">
              <p class="label">审批编号：</p>
              <div class="value">{{ info.approval_uid }}</div>
              <span v-if="info.approval_status === 1" class="status">审批中</span>
              <span v-else-if="info.approval_status === 2" class="status success">审批通过</span>
              <span v-else-if="info.approval_status === 3" class="status error">审批失败</span>
              <span v-else class="status revoke">已撤销</span>
            </div>
          </div>
          <!-- 是否自动 -->
          <div
            class="left-body"
            v-if="info.approval_detail && info.approval_detail.auto_create !== undefined"
          >
            <div class="line left">
              <p class="label">合同编号：</p>
              <div class="value">{{ info.contract_uid }}</div>
            </div>
            <div class="line right">
              <p class="label">客户名称：</p>
              <div class="value">{{ info.customer_name }}</div>
            </div>
            <div class="line left">
              <p class="label">项目名称：</p>
              <div class="value">{{ info.project_name }}</div>
            </div>
            <div :class="['line', info.business_type === 5 ? 'right' : 'left']">
              <p class="label">审批金额：</p>
              <div class="value">{{ numberFormat(info.approve_amount, 2) }}</div>
            </div>
            <div class="line left">
              <p class="label">开始时间：</p>
              <div class="value">{{ info.details ? info.details[0].start_date : '--' }}</div>
            </div>
            <div class="line right">
              <p class="label">结束时间：</p>
              <div class="value">{{ info.details ? info.details[0].end_date : '--' }}</div>
            </div>
            <div class="line" style="height: auto">
              <p class="label">附件：</p>
              <div class="value line-value">
                <template v-if="info.attachment && info.attachment.length > 0">
                  <Appendix :list="info.attachment" />
                </template>
                <span v-else>--</span>
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label" style="margin-top: 6px">用印扫描附件：</p>
              <div class="value line-value">
                <template>
                  <div
                    class="upload-box mgb-12"
                    v-if="
                      info.approval_status === 2 && info.scan_status !== 2 && info.seal_type !== 1
                    "
                  >
                    <tg-upload
                      :disabled="(info.scan.length || 0) >= 10"
                      action="/api/approval/upload_approval_attachment"
                      :beforeUpload="beforeUpload"
                      :success="scanSuccessHandle"
                      :show-file-list="false"
                    >
                      <tg-button
                        :disabled="(info.scan.length || 0) >= 10"
                        size="medium"
                        icon="ico-btn-upload"
                      >
                        上传附件
                      </tg-button>
                    </tg-upload>
                  </div>
                  <div class="mgt-6" v-else-if="info.scan && info.scan.length === 0">--</div>
                  <div class="file-list-box mgt-8">
                    <!-- <upload-file-list v-model="baseData.scan" /> -->
                    <Appendix
                      :list="info.scan"
                      :isDelete="
                        info.approval_status === 2 && info.scan_status !== 2 && info.seal_type !== 1
                          ? true
                          : false
                      "
                      @deleteItem="deleteItem"
                    />
                  </div>
                </template>
                <!-- <span v-else>--</span> -->
              </div>
            </div>
          </div>
          <div class="left-body" v-else>
            <div class="line left">
              <p class="label">合同编号：</p>
              <div class="value">{{ info.contract_uid }}</div>
            </div>
            <div class="line right">
              <p class="label">客户名称：</p>
              <div class="value">{{ info.customer_name }}</div>
            </div>
            <div class="line left">
              <p class="label">项目：</p>
              <div class="value">{{ info.project_name }}</div>
            </div>
            <div v-if="info.business_type !== 5" class="line left">
              <p class="label">品牌：</p>
              <div class="value">{{ info.brand_name ? info.brand_name : '--' }}</div>
            </div>
            <div :class="['line', info.business_type === 5 ? 'right' : 'left']">
              <p class="label">审批金额：</p>
              <div class="value">{{ numberFormat(info.approve_amount, 2) }}</div>
            </div>
            <div :class="['line', info.business_type === 5 ? 'left' : 'right']">
              <p class="label">用章情况：</p>
              <div v-if="info.seal_type === 1" class="value">不同印章</div>
              <div v-else-if="info.seal_type === 2" class="value">公章</div>
              <div v-else class="value">合同章</div>
            </div>
            <div class="line" style="height: auto; margin-bottom: 24px">
              <p class="label">申请内容：</p>
              <div class="value line-value">{{ info.approval_content }}</div>
            </div>
            <div class="table-wrapper">
              <el-table :data="info.details" border>
                <el-table-column align="left" label="结算方式" width="93">
                  <template slot-scope="scope">
                    <span v-if="scope.row.settlement_way === 1">对公银行</span>
                    <span v-else-if="scope.row.settlement_way === 2">支付宝</span>
                    <span v-else-if="scope.row.settlement_way === 3">V任务</span>
                    <span v-else-if="scope.row.settlement_way === 4">淘宝联盟</span>
                    <span v-else>巨量百应</span>
                  </template>
                </el-table-column>
                <el-table-column align="right" label="结算金额" width="148">
                  <template slot-scope="scope">{{
                    numberFormat(scope.row.settle_amount, 2)
                  }}</template>
                </el-table-column>
                <el-table-column align="left" label="开始日期" width="100">
                  <template slot-scope="scope">{{ scope.row.start_date }}</template>
                </el-table-column>
                <el-table-column align="left" label="结束日期" width="100">
                  <template slot-scope="scope">{{ scope.row.end_date }}</template>
                </el-table-column>
                <el-table-column align="left" label="备注" width="190">
                  <template slot-scope="scope">
                    <el-popover
                      v-if="scope.row.comment.length > 12"
                      placement="top-start"
                      width="200"
                      trigger="hover"
                      :content="scope.row.comment"
                    >
                      <p slot="reference" class="line-clamp-1" style="width: 170px">
                        {{ scope.row.comment }}
                      </p>
                    </el-popover>
                    <p v-else>
                      {{ scope.row.comment ? scope.row.comment : '--' }}
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="line" style="height: auto">
              <p class="label">附件：</p>
              <div class="value line-value">
                <template v-if="info.attachment && info.attachment.length > 0">
                  <Appendix :list="info.attachment" />
                </template>
                <span v-else>--</span>
              </div>
            </div>
            <div class="line" style="height: auto">
              <p class="label" style="margin-top: 6px">用印扫描附件：</p>
              <div class="value line-value">
                <template>
                  <div
                    class="upload-box mgb-12"
                    v-if="
                      info.approval_status === 2 && info.scan_status !== 2 && info.seal_type !== 1
                    "
                  >
                    <tg-upload
                      :disabled="(info.scan.length || 0) >= 10"
                      action="/api/approval/upload_approval_attachment"
                      :beforeUpload="beforeUpload"
                      :success="scanSuccessHandle"
                      :show-file-list="false"
                    >
                      <tg-button
                        :disabled="(info.scan.length || 0) >= 10"
                        size="medium"
                        icon="ico-btn-upload"
                      >
                        上传附件
                      </tg-button>
                    </tg-upload>
                  </div>
                  <div class="mgt-5" v-else-if="info.scan && info.scan.length === 0">--</div>
                  <div class="file-list-box mgt-8">
                    <!-- <upload-file-list v-model="baseData.scan" /> -->
                    <Appendix
                      :list="info.scan"
                      :isDelete="
                        info.approval_status === 2 && info.scan_status !== 2 && info.seal_type !== 1
                          ? true
                          : false
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
            :step-status="info.approval_status"
            :items="info.approval_flow_detail"
          />
        </div>
      </div>
      <template #footer>
        <tg-button type="default" @click="emitClose">取消</tg-button>
        <tg-button v-if="info.approval_status === 1" @click="handleSubmit">撤销</tg-button>
        <tg-button v-if="info.approval_status === 3 && info.partner_id" @click="resubmit"
          >重新提交</tg-button
        >
      </template>
    </el-dialog>
    <add-settlement-dialog
      ref="settlementDialogRef"
      :edit-data="editData"
      @added="confirmSettlementDialog"
    />
    <new-add-settlement-dialog
      ref="newSettlementDialogRef"
      :edit-data="editData"
      @added="confirmSettlementDialog"
    />
    <add-statement
      :visible="settlementDialogVisible"
      :isfromworkbench="true"
      :editData="editData"
      @dialog:close="confirmSettlementDialog"
    ></add-statement>
    <new-statement
      :visible="setNewtlementDialogVisible"
      :isfromworkbench="true"
      :editData="editData"
      :isRelaunch="true"
      @dialog:close="confirmSettlementDialog"
    ></new-statement>
    <tg-mask-loading :visible="saveLoading" content="  正在提交，请稍候..." />
  </div>
</template>

<script src="./detail.ts"></script>

<style lang="less" scoped>
@import '../advance/detail.less';
@import './detail.less';
</style>
