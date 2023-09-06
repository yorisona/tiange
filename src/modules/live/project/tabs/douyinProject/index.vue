<template>
  <div class="tg-douyin-live-project-info">
    <div class="project-info-scroll">
      <div class="project-info-left">
        <!-- 项目基础信息 -->
        <div class="project-name-info filter-form-item-btn">
          <span class="project-name">{{ project.project_name }}</span>
          <tg-button v-if="Permission.canProjectEdit" class="project-edit" @click="onProjectEdit">
            编辑项目
          </tg-button>
        </div>
        <div class="project-uid">{{ project.project_uid }}</div>
        <div v-if="project.project_status !== ProjectStatusEnum.finish" class="project-status">
          <div>
            <div style="width: 100%; display: flex; flex-direction: row; -ms-flex-align: start">
              <div style="color: var(--text-third-color)">状态：</div>
              <div style="width: 150px">
                <div
                  v-if="project.project_status === ProjectStatusEnum.tryLive"
                  class="status"
                  style="font-size: 12px; color: var(--warning-color)"
                >
                  试播中<tg-button
                    v-if="Permission.canEditProjectStatus"
                    class="edit-button"
                    type="link"
                    @click="openTestLiveDialog"
                    ><tg-icon name="ico-edit"></tg-icon
                  ></tg-button>
                </div>
                <div
                  v-if="project.project_status === ProjectStatusEnum.execution"
                  class="status"
                  style="font-size: 12px; color: var(--warning-color)"
                >
                  项目执行中<tg-button
                    v-if="Permission.canEditProjectStatus && !project.end_project_approval_uid"
                    class="edit-button"
                    type="link"
                    @click="onFinishProjectHandler"
                    ><tg-icon name="ico-edit"></tg-icon
                  ></tg-button>
                </div>
                <div
                  v-if="project.project_status === ProjectStatusEnum.executionEnd"
                  class="status"
                  style="font-size: 12px; color: var(--warning-color)"
                >
                  执行结束
                  <!--                  <tg-button-->
                  <!--                    v-if="Permission.canEditProjectStatus && !project.end_project_approval_uid"-->
                  <!--                    class="edit-button"-->
                  <!--                    type="link"-->
                  <!--                    @click="onFinishProjectHandler"-->
                  <!--                    ><tg-icon name="ico-edit"></tg-icon-->
                  <!--                  ></tg-button>-->
                </div>
                <div
                  v-if="
                    project.cooperation_type === 2 &&
                    project.project_status === ProjectStatusEnum.regionExecution
                  "
                  class="status"
                  style="font-size: 12px; color: var(--warning-color)"
                >
                  区域执行中<tg-button
                    v-if="Permission.canEditProjectStatus && !project.end_project_approval_uid"
                    class="edit-button"
                    type="link"
                    @click="onFinishProjectHandler"
                    ><tg-icon name="ico-edit"></tg-icon
                  ></tg-button>
                </div>
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
                      injectProject.end_type === 1 ? 'var(--success-color)' : 'var(--error-color)',
                  }"
                >
                  {{ project_status_str }}
                </div>
                <tg-button
                  class="edit-button"
                  v-if="Permission.canUpdateEndProject"
                  type="link"
                  @click="onProlongLiquidationPeriodHandler"
                >
                  <tg-icon name="ico-edit"></tg-icon>
                </tg-button>
              </div>
              <!--              <div-->
              <!--                v-if="injectProject.end_time"-->
              <!--                style="margin-top: 2px; color: var(&#45;&#45;text-des-color); font-size: 12px"-->
              <!--              >-->
              <!--                {{ project_end_time }}-->
              <!--              </div>-->
            </div>
          </div>
          <!--          <div-->
          <!--            v-if="injectProject.end_type === 2"-->
          <!--            style="-->
          <!--              width: 100%;-->
          <!--              display: flex;-->
          <!--              flex-direction: row;-->
          <!--              -ms-flex-align: start;-->
          <!--              margin-top: 8px;-->
          <!--            "-->
          <!--          >-->
          <!--            <div style="color: var(&#45;&#45;text-third-color)">处理方案：</div>-->
          <!--            <div style="width: 180px; white-space: normal; word-wrap: break-word; overflow: hidden">-->
          <!--              {{ project_reason_status_str }}-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <div
          style="margin-top: 8px"
          v-if="
            project.cooperation_type === 2 &&
            (project.project_status === ProjectStatusEnum.regionExecution ||
              project.project_status === ProjectStatusEnum.finish ||
              project.project_status === ProjectStatusEnum.executionEnd)
          "
        >
          <span style="color: #6a7b92">合作公司：</span>
          <span class="status" v-if="project.supplier_company_name" style="margin-right: 2px">
            <el-popover
              v-if="
                Permission.canEditProjectStatus &&
                project.project_status === ProjectStatusEnum.regionExecution
                  ? project.supplier_company_name.length > 10
                  : project.supplier_company_name.length > 11
              "
              placement="right-start"
              trigger="hover"
            >
              <div>
                {{ project.supplier_company_name }}
              </div>
              <div
                slot="reference"
                class="live"
                style="display: inline-block"
                :style="{ width: Permission.canEditProjectStatus ? '' : '162px' }"
              >
                {{ getnewcoopcompany(project.supplier_company_name) }}
              </div>
            </el-popover>
            <div
              v-else
              class="live"
              style="display: inline-block"
              :style="{ width: Permission.canEditProjectStatus ? '' : '162px' }"
            >
              {{ project.supplier_company_name }}
            </div>
            <tg-button
              class="edit-button"
              v-if="
                Permission.canEditProjectStatus &&
                project.project_status === ProjectStatusEnum.regionExecution
              "
              type="link"
              @click="openAreaDialog"
            >
              <tg-icon name="ico-edit"></tg-icon></tg-button
          ></span>
          <tg-button
            type="link"
            v-else-if="
              Permission.canEditProjectStatus &&
              project.project_status === ProjectStatusEnum.regionExecution
            "
            @click="openAreaDialog"
            >点击添加</tg-button
          >
          <span v-else>--</span>
        </div>
        <div class="project-business-type">
          <span class="label">业务类型：</span>
          <span>{{ business_type_str }}</span>
          <span
            class="cooperation-type"
            :style="{
              color: project.cooperation_type === 2 ? '#FF7A36' : 'var(--warning-color)',
              borderColor: project.cooperation_type === 2 ? '#FF7A36' : 'var(--warning-color)',
            }"
            >{{ cooperation_type_str }}</span
          >
        </div>
        <div class="feishu-department">
          <span class="label">所属部门：</span>
          <span>{{ project.feishu_department_name ? project.feishu_department_name : '--' }}</span>
        </div>

        <div class="customer-company">
          <span class="label">客户公司：</span>
          <tg-button class="arrow-btn" type="link" @click="onCustomerCompany(project.company_id)">
            <el-popover
              placement="top-start"
              trigger="hover"
              :open-delay="300"
              :content="project.customer_company_name"
            >
              <span slot="reference" class="line-clamp-2" style="width: 130px">{{
                project.customer_company_name
              }}</span>
            </el-popover>
            <tg-icon name="ico-arrow-right"></tg-icon>
          </tg-button>
        </div>
        <div v-if="false" class="customer-shop">
          <span class="label">客户店铺：</span>
          <!-- <tg-button
            v-if="project.customer_id"
            class="arrow-btn"
            type="link"
            @click="onShopName(project.customer_id)"
          > -->
          <el-popover
            placement="top-start"
            trigger="hover"
            :open-delay="300"
            :content="project.shop_name"
          >
            <span slot="reference" class="line-clamp-2" style="width: 160px">{{
              project.shop_name
            }}</span>
          </el-popover>
          <!-- <tg-icon name="ico-arrow-right"></tg-icon> -->
          <!-- </tg-button> -->
          <!-- <div v-else>--</div> -->
        </div>
        <div class="shop-brand">
          <span class="label">品牌：</span>
          <span>{{ project.brand_name ? project.brand_name : '--' }}</span>
        </div>
        <div class="studio">
          <span class="label">直播间：</span>
          <span>{{ project.studio_name ? project.studio_name : '--' }}</span>
        </div>
        <div
          class="studio"
          v-if="
            project.cooperation_type === 1 &&
            (project.business_type === 3 || project.business_type === 7)
          "
        >
          <span class="label">商家授权：</span>
          <span v-if="project.is_shop_auth === 1 || project.is_shop_auth === true">已授权</span>
          <span v-else @click="linkAccess" style="color: var(--theme-color); cursor: pointer"
            >立即授权</span
          >
        </div>
        <div class="project-circle" style="margin-top: 24px">
          <span class="label">项目周期：</span>
          <span>{{ project_cycle }}</span>
        </div>
        <div class="settlement-circle">
          <span class="label">结算周期：</span>
          <span>{{ settlement_cycle_type }}</span>
        </div>
        <div class="price-per-hour">
          <span class="label">小时报价：</span>
          <span>{{
            isCustomerManager && project.price_per_hour ? `${project.price_per_hour}/小时` : '--'
          }}</span>
        </div>
        <div
          class="price-per-hour"
          v-if="
            project.cooperation_type === 1 &&
            (project.business_type === 3 || project.business_type === 7)
          "
        >
          <span class="label">服务费：</span>
          <span>{{
            isCustomerManager && project.service_amount ? `${project.service_amount}元` : '--'
          }}</span>
        </div>
        <div class="commission-rate">
          <span class="label">佣金比例：</span>
          <span>{{
            isCustomerManager && project.commission_rate ? `${project.commission_rate}%` : '--'
          }}</span>
        </div>

        <div v-if="teamMemberEditEnabled" class="project-team">
          <span class="label" style="font-size: 14px; color: var(--text-color)">项目团队</span>
          <tg-button class="edit-people-button" type="link" @click="onProjectTeamEdit"
            ><tg-icon name="ico-edit"></tg-icon
          ></tg-button>
        </div>
        <div class="project-manager" :class="!teamMemberEditEnabled ? 'mgt-24' : ''">
          <span class="label">项目经理：</span>
          <span>{{ project.project_manager ? project.project_manager : '--' }}</span>
        </div>
        <div class="customer-manager">
          <span class="label">客户经理：</span>
          <span>{{ project.customer_manager ? project.customer_manager : '--' }}</span>
        </div>
        <div class="other-members">
          <span class="label">其他成员：</span>
          <span>{{ otherMembersStr }}</span>
        </div>
      </div>
      <div class="project-info-right new-two-rows">
        <div class="right-content">
          <div class="project-sub-page-item-list">
            <div
              class="sub-page-item"
              @click="
                onPageItemHandler(
                  RouterNameProjectManage.tiktokLive.project.detail.display,
                  !project ||
                    (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    ? '暂不支持场次排班'
                    : '',
                )
              "
            >
              <div class="item-header">
                <img class="item-icon" :src="live" />
                <div class="item-title">直播场次</div>
              </div>
              <div class="item-content">
                <div
                  v-if="
                    !project ||
                    (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                  "
                  class="content-row t8"
                >
                  <span class="desc ligray">暂不支持场次排班</span>
                </div>
                <div
                  v-else-if="
                    !remindsData.not_archive_live_count && !remindsData.not_associate_live_count
                  "
                  class="content-row t8"
                >
                  <span class="desc ligray">暂无待办事项</span>
                </div>
                <div v-if="remindsData.not_associate_live_count" class="content-row t8">
                  <span class="value">{{ remindsData.not_associate_live_count }}</span>
                  <span class="desc">场直播未关联主播</span>
                  <el-popover
                    placement="bottom-start"
                    width="640"
                    trigger="hover"
                    :open-delay="300"
                  >
                    <div class="date-box">
                      <div class="date-box-content">
                        <img
                          style="
                            height: 320px;
                            width: 600px;
                            border: 1px solid var(--border-line-color);
                          "
                          :src="weiguanlianzhuboImage"
                        />
                      </div>
                    </div>
                    <tg-icon
                      slot="reference"
                      class="detail-icon"
                      name="ico-icon_explain"
                      style="font-size: 14px; color: var(--icon-color)"
                    ></tg-icon>
                  </el-popover>
                </div>
                <div v-if="remindsData.not_archive_live_count" class="content-row t2">
                  <span class="value">{{ remindsData.not_archive_live_count }}</span>
                  <span class="desc">场直播未完成归档</span>
                  <el-popover
                    placement="bottom-start"
                    width="640"
                    trigger="hover"
                    :open-delay="300"
                  >
                    <div class="date-box">
                      <div class="date-box-content">
                        <img
                          style="
                            height: 320px;
                            width: 600px;
                            border: 1px solid var(--border-line-color);
                          "
                          :src="notFiledImage"
                        />
                      </div>
                    </div>
                    <tg-icon
                      slot="reference"
                      class="detail-icon"
                      name="ico-icon_explain"
                      style="font-size: 14px; color: var(--icon-color)"
                    ></tg-icon>
                  </el-popover>
                </div>
              </div>
              <img class="shadow-img" :src="liveBg" />
            </div>
            <div
              class="sub-page-item"
              @click="onPageItemHandler(RouterNameProjectManage.tiktokLive.project.detail.income)"
            >
              <div class="item-header">
                <img class="item-icon" :src="income" />
                <div class="item-title">项目收入</div>
              </div>
              <div class="item-content">
                <div
                  v-if="
                    !remindsData.not_write_off_receivable_count &&
                    !remindsData.not_received_achievement_count
                  "
                  class="content-row t8"
                >
                  <span class="desc ligray">暂无待办事项</span>
                </div>
                <template v-else>
                  <div v-if="remindsData.not_write_off_receivable_count" class="content-row t8">
                    <span class="value">{{ remindsData.not_write_off_receivable_count }}</span>
                    <span class="desc">笔应收款未完成核销</span>
                  </div>
                  <div v-if="remindsData.not_received_achievement_count" class="content-row t2">
                    <span class="value">{{ remindsData.not_received_achievement_count }}</span>
                    <span class="desc">笔预收款未到账</span>
                  </div>
                </template>
              </div>
              <img class="shadow-img" :src="incomeBg" />
            </div>
            <div
              class="sub-page-item"
              @click="onPageItemHandler(RouterNameProjectManage.tiktokLive.project.detail.cost)"
            >
              <div class="item-header">
                <img class="item-icon" :src="cost" />
                <div class="item-title">项目成本</div>
              </div>
              <div class="item-content">
                <div class="content-row t8">
                  <span v-if="!remindsData.not_write_off_invoice_cost_count" class="desc ligray"
                    >暂无待办事项</span
                  >
                  <template v-else>
                    <span class="value">{{ remindsData.not_write_off_invoice_cost_count }}</span>
                    <span class="desc">笔成本未核销发票</span>
                  </template>
                </div>
              </div>
              <img class="shadow-img" :src="costBg" />
            </div>
            <div
              class="sub-page-item"
              @click="onPageItemHandler(RouterNameProjectManage.tiktokLive.project.detail.contract)"
            >
              <div class="item-header">
                <img class="item-icon" :src="contract" />
                <div class="item-title">合同协议</div>
              </div>
              <div class="item-content display-grid">
                <div class="content-row t8">
                  <span class="desc r4">客户合同</span>
                  <span class="value">{{ remindsData.customer_contract_count || 0 }}</span>
                </div>
                <div class="content-row t8">
                  <span class="desc r4">供应商合同</span>
                  <span class="value">{{ remindsData.supplier_contract_count || 0 }}</span>
                </div>
              </div>
              <img class="shadow-img" :src="contractBg" />
            </div>
            <div
              class="sub-page-item"
              @click="
                onPageItemHandler(
                  RouterNameProjectManage.tiktokLive.project.detail.data,
                  !project ||
                    (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    ? '暂不支持自动抓取'
                    : '',
                  {
                    project_name: injectProject.brand_name,
                  },
                )
              "
            >
              <div class="item-header">
                <img class="item-icon" :src="data" />
                <div class="item-title">运营数据</div>
              </div>
              <div class="item-content">
                <div class="content-row t8">
                  <span
                    v-if="
                      !project ||
                      (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    "
                    class="desc ligray"
                    >暂不支持自动抓取</span
                  >
                  <span v-else class="desc">
                    <div>数据更新至</div>
                    <div>{{ remindsData.data_update_time || '--' }}</div>
                  </span>
                </div>
              </div>
              <img class="shadow-img" :src="dataBg" />
            </div>
            <div
              class="sub-page-item"
              @click="
                onPageItemHandler(
                  RouterNameProjectManage.tiktokLive.project.detail.target,
                  !project ||
                    (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    ? '暂不支持目标设置'
                    : '',
                )
              "
            >
              <div class="item-header">
                <img class="item-icon" :src="target" />
                <div class="item-title">目标设置</div>
              </div>
              <div class="item-content">
                <div class="content-row t8">
                  <span
                    v-if="
                      !project ||
                      (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    "
                    class="desc ligray"
                    >暂不支持目标设置</span
                  >
                  <span
                    v-else-if="
                      !remindsData.need_set_goal_months ||
                      (remindsData.need_set_goal_months && !remindsData.need_set_goal_months.length)
                    "
                    class="desc ligray"
                    >暂无待办事项</span
                  >
                  <template v-else>
                    <span class="value">{{
                      (remindsData.need_set_goal_months || []).join(',')
                    }}</span>
                    <span class="desc">月份目标待设置</span>
                  </template>
                </div>
              </div>
              <img class="shadow-img" :src="targetBg" />
            </div>
            <div
              class="sub-page-item"
              @click="
                onPageItemHandler(
                  RouterNameProjectManage.tiktokLive.project.detail.liveTool,
                  !project ||
                    (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    ? '敬请期待'
                    : '',
                )
              "
            >
              <div class="item-header">
                <img class="item-icon" :src="live" />
                <div class="item-title">直播工具</div>
              </div>
              <div class="item-content">
                <div class="content-row t10">
                  <span
                    v-if="
                      !project ||
                      (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    "
                    class="desc ligray"
                    >敬请期待</span
                  >
                </div>
              </div>

              <!--            <div>-->
              <!--              <div>-->
              <!--                <span>5</span>-->
              <!--                <span>场直播未关联主播</span>-->
              <!--                <tg-icon name="ico-common-wenda-linear"></tg-icon>-->
              <!--              </div>-->
              <!--              <div>-->
              <!--                <span>8</span>-->
              <!--                <span>场直播未完成归档</span>-->
              <!--                <tg-icon name="ico-common-wenda-linear"></tg-icon>-->
              <!--              </div>-->
              <!--            </div>-->
              <img class="shadow-img" :src="liveBg" />
            </div>
            <div
              class="sub-page-item"
              @click="
                onPageItemHandler(
                  RouterNameProjectManage.tiktokLive.project.detail.setting,
                  !project ||
                    (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    ? '敬请期待'
                    : '',
                )
              "
            >
              <div class="item-header">
                <img class="item-icon" :src="setting" />
                <div class="item-title">项目设置</div>
              </div>
              <div class="item-content">
                <div class="content-row t10">
                  <span
                    v-if="
                      !project ||
                      (project && project.cooperation_type !== CooperationTypeEnum.selfSupport)
                    "
                    class="desc ligray"
                    >敬请期待</span
                  >
                  <span
                    v-else-if="
                      !remindsData.is_stock_monitor_enable && !remindsData.is_auto_settlement_enable
                    "
                    class="desc"
                    >自动结算、库存设置暂未开启</span
                  >
                  <span v-else-if="!remindsData.is_stock_monitor_enable" class="desc"
                    >库存设置暂未开启</span
                  >
                  <span v-else-if="!remindsData.is_auto_settlement_enable" class="desc"
                    >自动结算暂未开启</span
                  >
                  <span v-else class="desc ligray">暂无待办事项</span>
                </div>
              </div>
              <img class="shadow-img" :src="settingBg" />
            </div>
          </div>
          <div class="project-info-daily-data">
            <!-- 项目日报 -->
            <head-lines
              style="margin: 16px 0 12px 18px"
              :title-font="14"
              title="项目日报（近7天）"
            />
            <div v-if="!withoutDailyDataPermission">
              <calendar-page
                :query="queryDailyData"
                :business_type="project ? project.business_type : ''"
                :cooperation_type="project ? project.cooperation_type : undefined"
                type="base"
                :near_seven_data="true"
                itemHeight="32px"
                :showRest="true"
                :showQueryError="false"
                @withoutPermission="withoutPermission"
              />
            </div>
            <div v-else class="project-info-daily-data-empty">
              <div class="abnormal-empty">
                <div class="abnormal-empty-content">
                  <empty-common detail-text="暂无查看日报数据权限 "></empty-common>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddLiveProject
      :visible="editProjectVisible"
      :project="project"
      :isEditForm="true"
      @dialog:close="onEditProjectClose"
    />
    <!-- 项目试播 -->
    <projectTrial
      ref="projectTrial"
      :visible="ProjectStepTrialFormVisible"
      @ProjectTrailStep:close="onProjectTrailStepDialogModalClose"
      :step="project_status"
      @getDetail="getDetail"
    />
    <!-- 区域-区域执行 -->
    <projectArea
      ref="projectArea"
      :visible="ProjectStepAreaFormVisible"
      @ProjectAreaStep:close="onProjectAreaStepDialogModalClose"
      @getDetail="getDetail"
    />
    <!-- 项目完结 -->
    <projectFinal
      ref="projectFinal"
      :visible="ProjectStepFinalFormVisible"
      :status="project.project_status"
      @ProjectFinalStep:close="onProjectFinalStepDialogModalClose"
      @getDetail="getDetail"
    />
    <team-member
      :projectId="`${project.id}`"
      :member="memberForEdit"
      :creator="project.add_by_username"
      :visible.sync="teamMemberVisible"
      @save="onTeamMemberSave"
    ></team-member>
    <roll-back-project
      :visible.sync="rollBackProjectVisible"
      :projectInfo="rollBackProjectInfo"
      @save="onProjectRollBackSave"
    ></roll-back-project>
  </div>
</template>

<script src="./index.ts"></script>
<style lang="less">
@import './index.less';
</style>
