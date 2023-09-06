<template>
  <div class="tg-common-business-project-detail-info">
    <div class="project-info-scroll">
      <div class="project-info-left">
        <div class="project-name-info filter-form-item-btn">
          <span class="project-name">{{ ProjectDetail.project_name }}</span>
          <tg-button
            v-if="Permission.canSaveProject"
            class="project-edit"
            @click="toggleProjectModalVisible(true)"
            >编辑项目
          </tg-button>
        </div>
        <div class="project-uid">{{ ProjectDetail.project_uid }}</div>
        <div
          v-if="ProjectDetail.project_status === ProjectStatusEnum.execution"
          class="project-status"
        >
          <div style="width: 100%; display: flex; flex-direction: row; -ms-flex-align: start">
            <div style="color: var(--text-third-color)">状态：</div>
            <div style="width: 150px">
              <div class="status" style="font-size: 12px; color: var(--warning-color)">
                执行中<tg-button
                  class="edit-button"
                  v-if="Permission.canEditProject"
                  type="link"
                  @click="onFinishProjectHandler"
                  ><tg-icon name="ico-edit"></tg-icon
                ></tg-button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="ProjectDetail.project_status === ProjectStatusEnum.executionEnd"
          class="project-status"
        >
          <div style="width: 100%; display: flex; flex-direction: row; -ms-flex-align: start">
            <div style="color: var(--text-third-color)">状态：</div>
            <div style="width: 150px">
              <div class="status" style="font-size: 12px; color: var(--warning-color)">
                执行结束
                <!-- <tg-button
                  class="edit-button"
                  v-if="Permission.canEditProject"
                  type="link"
                  @click="onFinishProjectHandler"
                  ><tg-icon name="ico-edit"></tg-icon
                ></tg-button> -->
              </div>
            </div>
          </div>
        </div>
        <div v-else class="project-status">
          <div style="width: 100%; display: flex; flex-direction: row; -ms-flex-align: start">
            <div style="color: var(--text-third-color)">状态：</div>
            <div style="width: 150px">
              <div class="project-status-desc">
                <div
                  class="status"
                  style="font-size: 12px; color: var(--success-color)"
                  :style="{
                    color:
                      ProjectDetail.end_type === 1 ? 'var(--success-color)' : 'var(--error-color)',
                  }"
                >
                  {{ project_status_str }}
                  <tg-button
                    class="edit-button"
                    v-if="Permission.canEndEditProject"
                    type="link"
                    @click="onProlongLiquidationPeriodHandler"
                  >
                    <tg-icon name="ico-edit"></tg-icon>
                  </tg-button>
                </div>
              </div>
              <div style="margin-top: 2px; color: var(--text-third-color); font-size: 12px">
                {{ ProjectDetail.end_date ? ProjectDetail.end_date.replace(/-/g, '.') : '' }}
              </div>
            </div>
          </div>
          <div
            v-if="ProjectDetail.end_type === 2"
            style="
              width: 100%;
              display: flex;
              flex-direction: row;
              -ms-flex-align: start;
              margin-top: 8px;
            "
          >
            <div style="color: var(--text-third-color)">处理方案：</div>
            <div style="width: 180px; white-space: normal; word-wrap: break-word; overflow: hidden">
              {{ project_reason_status_str }}
            </div>
          </div>
        </div>
        <div class="project-business-type">
          <span class="label">业务类型：</span>
          <span>创新项目</span>
        </div>
        <div class="project-base">
          <span class="label">业务平台：</span>
          <span v-if="ProjectDetail.platform_type === 1">抖音</span>
          <span v-else-if="ProjectDetail.platform_type === 2">淘宝</span>
          <span v-else>--</span>
        </div>
        <div class="project-circle" style="margin-top: 24px">
          <span class="label">项目周期：</span>
          <span>{{ project_cycle }}</span>
        </div>
        <div class="project-base" v-if="ProjectDetail.platform_type === 1">
          <span class="label">项目达人：</span>
          <span>{{ ProjectDetail.kol_name ? ProjectDetail.kol_name : '--' }}</span>
        </div>
        <div class="project-base">
          <span class="label">项目类型：</span>
          <span>{{ projectTypeStr }}</span>
        </div>
        <div class="project-base">
          <span class="label">所属部门：</span>
          <span>{{
            ProjectDetail.feishu_department_name ? ProjectDetail.feishu_department_name : '--'
          }}</span>
        </div>
        <div v-if="teamMemberEditEnabled" class="project-team">
          <span class="label" style="font-size: 14px; color: var(--text-color)">项目团队</span>
          <tg-button class="edit-people-button" type="link" @click="onProjectTeamEdit"
            ><tg-icon name="ico-edit"></tg-icon
          ></tg-button>
        </div>
        <div :class="['project-manager', !teamMemberEditEnabled ? 'mgt-24' : '']">
          <span class="label">项目经理：</span>
          <span>{{ ProjectDetail.project_manager ? ProjectDetail.project_manager : '--' }}</span>
        </div>
        <div class="project-base">
          <span class="label">其他成员：</span>
          <span>{{ otherMembersStr }}</span>
        </div>
      </div>
      <div :class="['project-info-right', { 'row-two': ProjectDetail.platform_type === 2 }]">
        <div class="project-info-income-contract">
          <div class="income">
            <div class="title">
              <span class="bar"></span>
              <span>项目盈收</span>
            </div>
            <div class="income-row">
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.income_settlement_amount) }}</div>
                <div>收入结算金额</div>
              </div>
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.real_income_amount) }}</div>
                <div>实收金额</div>
              </div>
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.unreceived_amount) }}</div>
                <div>未收金额</div>
              </div>
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.paid_invoice_amount) }}</div>
                <div>已开发票</div>
              </div>
            </div>
            <div class="income-row">
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.cost_settlement_amount) }}</div>
                <div>成本结算金额</div>
              </div>
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.real_paid_amount) }}</div>
                <div>实付金额</div>
              </div>
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.unpaid_amount) }}</div>
                <div>未付金额</div>
              </div>
              <div class="income-contract-item">
                <div>{{ formatAmount(profitData.received_invoice_amount) }}</div>
                <div>已收发票</div>
              </div>
            </div>
          </div>
          <div class="contract">
            <div class="title"><span class="bar"></span><span>合同</span></div>
            <div class="contract-row">
              <div class="income-contract-item">
                <div
                  :class="
                    (ProjectDetail.contract_stat ? ProjectDetail.contract_stat.customer : 0) === 0
                      ? 'contract-no-customer'
                      : ''
                  "
                >
                  {{ ProjectDetail.contract_stat ? ProjectDetail.contract_stat.customer : 0 }}
                </div>
                <div>客户合同</div>
              </div>
              <div class="income-contract-item">
                <div>
                  {{ ProjectDetail.contract_stat ? ProjectDetail.contract_stat.supplier : 0 }}
                </div>
                <div>供应商合同</div>
              </div>
            </div>
            <div
              v-if="(ProjectDetail.contract_stat ? ProjectDetail.contract_stat.customer : 0) === 0"
              class="contract-tip"
            >
              <tg-icon name="ico-icon_jinggao"></tg-icon>
              <div>当前还没签署合同，请尽快签署合同并录入系统</div>
            </div>
          </div>
        </div>
        <month-live
          v-if="ProjectDetail.platform_type === 1"
          :platform="ProjectDetail.platform_type"
        />
        <div v-else class="taobao-empty">
          <empty-common detail-text="敬请期待新功能"></empty-common>
        </div>
      </div>
    </div>
    <CommonBusinessProjectDialog
      title="编辑项目"
      isEditForm
      :project="currentProject"
      :visible="ProjectFormVisible"
      @dialog:close="onProjectFormModalClose"
    />
    <team-member
      :projectId="`${ProjectDetail.id}`"
      :member="memberForEdit"
      :creator="ProjectDetail.add_by_username"
      :visible.sync="teamMemberVisible"
      @save="onTeamMemberSave"
    ></team-member>
    <projectFinal
      ref="projectFinal"
      :IsMcn="true"
      :visible="ProjectStepFinalFormVisible"
      :status="ProjectDetail.project_status"
      @ProjectFinalStep:close="onProjectFinalStepDialogModalClose"
      @getDetail="getDetail"
    />
    <roll-back-project
      :visible.sync="rollBackProjectVisible"
      :projectInfo="rollBackProjectInfo"
      @save="onProjectRollBackSave"
    ></roll-back-project>
  </div>
</template>
<script lang="ts" src="./info.ts"></script>
<style lang="less">
@import './info.less';
</style>
